<template>
  <div class="ai-panel">
    <div class="ai-header">
      <div class="ai-icon">🤖</div>
      <h3 class="ai-title">AI Assistant</h3>
    </div>
    
    <div class="ai-body">
      <!-- Chat Messages -->
      <div class="chat-messages" ref="chatContainer">
        <div v-if="messages.length === 0" class="empty-state">
          <p>Ask me anything about your workflow!</p>
          <div class="quick-prompts">
            <button @click="sendMessage('What should I add next?')" class="quick-prompt">
              What's next?
            </button>
            <button @click="sendMessage('Is my workflow complete?')" class="quick-prompt">
              Is it complete?
            </button>
            <button @click="sendMessage('How can I improve this?')" class="quick-prompt">
              Improve it
            </button>
          </div>
        </div>
        
        <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.role]">
          <div class="message-content">
            {{ msg.content }}
          </div>
          <button 
            v-if="msg.suggestion" 
            @click="addSuggestedNode(msg.suggestion)" 
            class="add-node-btn"
          >
            + Add {{ msg.suggestion.type }}
          </button>
        </div>
        
        <div v-if="isLoading" class="message assistant">
          <div class="typing-indicator">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
      
      <!-- Input -->
      <div class="chat-input-wrapper">
        <input 
          v-model="userInput"
          @keyup.enter="sendMessage(userInput)"
          type="text"
          placeholder="Ask about your workflow..."
          class="chat-input"
          :disabled="isLoading"
        />
        <button @click="sendMessage(userInput)" :disabled="isLoading || !userInput.trim()" class="send-btn">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import Groq from 'groq-sdk'

const props = defineProps({
  nodes: {
    type: Array,
    default: () => []
  },
  edges: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['add-node'])

const messages = ref([])
const userInput = ref('')
const isLoading = ref(false)
const chatContainer = ref(null)

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
})

const nodeColors = {
  trigger: '#22d3ee',
  action: '#a78bfa',
  condition: '#fbbf24',
  output: '#4ade80'
}

const nodeIcons = {
  trigger: '⚡',
  action: '▶️',
  condition: '🔀',
  output: '📤'
}

const getWorkflowContext = () => {
  const nodesByType = {
    triggers: props.nodes.filter(n => n.type === 'trigger'),
    actions: props.nodes.filter(n => n.type === 'action'),
    conditions: props.nodes.filter(n => n.type === 'condition'),
    outputs: props.nodes.filter(n => n.type === 'output')
  }
  
  const nodesWithOutgoing = new Set(props.edges.map(e => e.source))
  const leafNodes = props.nodes.filter(n => !nodesWithOutgoing.has(n.id) && n.type !== 'output')
  
  return `
CURRENT WORKFLOW STATE:
- Nodes (${props.nodes.length} total):
${props.nodes.map(n => `  • ${n.type.toUpperCase()}: "${n.data.label}" - ${n.data.description}`).join('\n') || '  (empty canvas)'}
- Connections: ${props.edges.length}
- Incomplete nodes (need connections): ${leafNodes.map(n => n.data.label).join(', ') || 'none'}
`
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const sendMessage = async (text) => {
  if (!text.trim() || isLoading.value) return
  
  const userMessage = text.trim()
  userInput.value = ''
  
  messages.value.push({ role: 'user', content: userMessage })
  scrollToBottom()
  
  isLoading.value = true
  
  const systemPrompt = `You are an expert workflow automation assistant helping a user build workflows visually. You're friendly, concise, and practical.

${getWorkflowContext()}

AVAILABLE NODE TYPES:
- trigger: Starts workflows (webhooks, schedules, file watchers, API events)
- action: Performs operations (API calls, database queries, send messages, transform data)
- condition: Branches logic (if/else checks, validations, comparisons)
- output: Ends workflows (return responses, log results, send final notifications)

INSTRUCTIONS:
1. Be conversational and helpful
2. Keep responses SHORT (2-4 sentences max)
3. When suggesting a node, ALWAYS include this exact JSON block at the end:
###NODE###{"type": "action", "label": "Node Name", "description": "What it does"}###NODE###
4. Only include the JSON block when you're specifically recommending adding a node
5. Reference the user's actual workflow when giving advice
6. If the workflow is empty, suggest starting with a trigger`

  try {
    const response = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.value.slice(-10).map(m => ({ role: m.role, content: m.content }))
      ],
      model: 'llama-3.1-8b-instant',
      max_tokens: 300,
      temperature: 0.7
    })
    
    const text = response.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.'
    
    // Extract node suggestion if present
    let suggestion = null
    let displayText = text
    
    const nodeMatch = text.match(/###NODE###(.+?)###NODE###/s)
    if (nodeMatch) {
      try {
        suggestion = JSON.parse(nodeMatch[1])
        suggestion.color = nodeColors[suggestion.type] || '#64748b'
        suggestion.icon = nodeIcons[suggestion.type] || '📦'
        displayText = text.replace(/###NODE###.+?###NODE###/s, '').trim()
      } catch (e) {
        console.error('Failed to parse node suggestion:', e)
      }
    }
    
    messages.value.push({ 
      role: 'assistant', 
      content: displayText,
      suggestion 
    })
    
  } catch (err) {
    console.error('AI Error:', err)
    messages.value.push({ 
      role: 'assistant', 
      content: 'Sorry, I had trouble connecting. Please try again.' 
    })
  }
  
  isLoading.value = false
  scrollToBottom()
}

const addSuggestedNode = (suggestion) => {
  emit('add-node', {
    type: suggestion.type,
    data: {
      label: suggestion.label,
      description: suggestion.description
    }
  })
}
</script>

<style scoped>
.ai-panel {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border: 1px solid #30363d;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  max-height: 400px;
}

.ai-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0.05) 100%);
  border-bottom: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 11px 11px 0 0;
}

.ai-icon {
  font-size: 16px;
}

.ai-title {
  font-size: 13px;
  font-weight: 600;
  color: #a5b4fc;
  margin: 0;
}

.ai-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 150px;
  max-height: 250px;
}

.empty-state {
  text-align: center;
  color: #64748b;
  font-size: 12px;
  padding: 20px 0;
}

.empty-state p {
  margin-bottom: 12px;
}

.quick-prompts {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}

.quick-prompt {
  padding: 6px 12px;
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 20px;
  color: #94a3b8;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-prompt:hover {
  border-color: #6366f1;
  color: #a5b4fc;
}

.message {
  max-width: 90%;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 12px;
  line-height: 1.4;
}

.message.user {
  align-self: flex-end;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.message.assistant {
  align-self: flex-start;
  background: #0d1117;
  color: #e2e8f0;
  border-bottom-left-radius: 4px;
}

.add-node-btn {
  margin-top: 8px;
  padding: 6px 12px;
  background: transparent;
  border: 1px dashed #4ade80;
  border-radius: 6px;
  color: #4ade80;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.add-node-btn:hover {
  background: rgba(74, 222, 128, 0.1);
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 4px 0;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  background: #64748b;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.chat-input-wrapper {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid #30363d;
}

.chat-input {
  flex: 1;
  padding: 8px 12px;
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 8px;
  color: #f1f5f9;
  font-size: 12px;
  outline: none;
}

.chat-input:focus {
  border-color: #6366f1;
}

.chat-input::placeholder {
  color: #64748b;
}

.send-btn {
  padding: 8px 12px;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>