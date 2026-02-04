<template>
  <main class="min-h-screen bg-slate-900 flex items-center justify-center py-8 relative overflow-hidden">
    <!-- Ambient gradient background -->
    <div class="fixed inset-0 pointer-events-none">
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
      <div class="absolute top-1/2 right-1/3 w-64 h-64 bg-sky-400/5 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s"></div>
    </div>

    <!-- Main content -->
    <div class="relative z-10 w-full max-w-2xl mx-auto px-4">
      <!-- Header with fade-in -->
      <div 
        class="mb-8 text-center transition-all duration-700 ease-out"
        :class="showHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'"
      >
        <h1 class="text-4xl md:text-5xl font-light tracking-tight text-white mb-3">
          Hi, I'm <span class="text-sky-400 font-normal bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">Karolina</span>
        </h1>
        <p class="text-slate-400 text-base md:text-lg">
          Ask me anything about my experience
        </p>
      </div>

      <!-- Chat Container with slide-up -->
      <div 
        class="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl shadow-black/40 transition-all duration-700 ease-out"
        :class="showChat ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'"
      >
        <!-- Messages Area -->
        <div ref="messagesContainer" class="h-[380px] md:h-[420px] overflow-y-auto p-5 md:p-6 space-y-4 scroll-smooth">
          <!-- Welcome state when no messages -->
          <div v-if="messages.length === 0" class="h-full flex items-center justify-center">
            <div class="text-center space-y-4">
              <div class="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-sky-500/20 to-purple-500/20 flex items-center justify-center mb-4 animate-pulse">
                <span class="text-2xl">💬</span>
              </div>
              <div class="text-slate-400 text-sm">Start a conversation</div>
              <div class="flex flex-wrap justify-center gap-2 max-w-md">
                <button
                  v-for="(suggestion, index) in suggestions"
                  :key="suggestion"
                  @click="input = suggestion"
                  class="px-4 py-2 text-xs bg-slate-700/60 text-slate-300 rounded-full hover:bg-sky-500/20 hover:text-sky-300 hover:scale-105 hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-300 border border-transparent hover:border-sky-500/30"
                  :style="{ animationDelay: index * 100 + 'ms' }"
                >
                  {{ suggestion }}
                </button>
              </div>
            </div>
          </div>

          <!-- Messages -->
          <TransitionGroup name="message">
            <div
              v-for="message in messages"
              :key="message.id"
              :class="['flex', message.role === 'user' ? 'justify-end' : 'justify-start']"
            >
              <div
                :class="[
                  'max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed transition-all duration-300',
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-br-sm shadow-lg shadow-sky-500/20'
                    : 'bg-slate-700/80 text-slate-200 rounded-bl-sm shadow-lg shadow-black/10'
                ]"
              >
                {{ message.text }}
              </div>
            </div>
          </TransitionGroup>

          <!-- Loading indicator -->
          <Transition name="fade">
            <div v-if="isLoading" class="flex justify-start">
              <div class="bg-slate-700/80 px-4 py-3 rounded-2xl rounded-bl-sm shadow-lg shadow-black/10">
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 bg-sky-400 rounded-full animate-bounce"></span>
                  <span class="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
                  <span class="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Input Area with slide-up -->
        <form 
          @submit.prevent="sendMessage" 
          class="border-t border-slate-700/50 p-4 bg-slate-800/40 transition-all duration-500 ease-out"
          :class="showInput ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
        >
          <div class="flex items-center gap-3">
            <input
              v-model="input"
              type="text"
              placeholder="Type your question..."
              :disabled="isLoading"
              @keyup.enter="sendMessage"
              class="flex-1 bg-slate-700/60 text-white placeholder:text-slate-400 px-5 py-3.5 rounded-2xl border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500/50 focus:bg-slate-700/80 transition-all duration-300 text-sm"
            />
            <button
              type="submit"
              :disabled="!input.trim() || isLoading"
              class="p-3.5 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-2xl hover:from-sky-400 hover:to-sky-500 hover:scale-105 hover:shadow-xl hover:shadow-sky-500/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none transition-all duration-300 shadow-lg shadow-sky-500/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </form>
      </div>

      <!-- Footer with fade-in -->
      <div 
        class="mt-6 text-center transition-all duration-700 delay-500"
        :class="showInput ? 'opacity-100' : 'opacity-0'"
      >
        <p class="text-slate-500 text-xs">Powered by AI ✨</p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import Groq from 'groq-sdk'

const input = ref('')
const messages = ref([])
const isLoading = ref(false)
const messagesContainer = ref(null)

// Staggered entrance animations
const showHeader = ref(false)
const showChat = ref(false)
const showInput = ref(false)

// Initialize Groq
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
})

const KAROLINA_CV = `
KAROLINA MROZ - CV

CONTACT:
- Location: Rotherham, UK (open to remote)
- Email: kwintuj@gmail.com
- Phone: 07424734922

PROFESSIONAL SUMMARY:
Results-driven .NET Software Engineer with 3+ years of experience designing, developing, and optimizing secure, high-performance web applications. Strong background in C#, ASP.NET (WebForms & Core), SQL, and Azure. Proven ability to manage client-facing work, deliver scalable backend systems, and accelerate development using AI-assisted tools and automation. Passionate about clean architecture, security by design, and progressing toward solutions architect or technical consultant roles.

TECHNICAL SKILLS:
- Languages: C#, SQL, JavaScript, C++, Java
- Frameworks & Tools: ASP.NET (WebForms & Core), .NET Core, Entity Framework, Azure, Git, REST APIs
- Web Development: HTML, CSS, JavaScript, React, Vue.js
- Databases: SQL Server, Oracle, stored procedures, performance optimization
- Cloud & DevOps: Microsoft Azure (App Services, Azure SQL), CI/CD pipelines
- Security: ASP.NET Core Identity, Authentication & Authorization, Security by Design principles

PROFESSIONAL EXPERIENCE:

Software Developer | Paloma Systems | Remote | Jan 2024 – Present
- Developing and maintaining scalable ASP.NET WebForms and .NET Core applications used by enterprise clients
- Managing client work, gathering requirements, and ensuring smooth communication across distributed teams
- Leveraging AI-assisted tooling to accelerate development, improve code quality, and automate repetitive tasks
- Writing optimized SQL queries and stored procedures to improve reliability and performance
- Implementing security-first architecture following OWASP and Security by Design principles
- Collaborating with product managers and cross-functional teams to deliver robust software solutions on time
- Mentoring junior developers and contributing to CI/CD pipelines

Software Developer | Expedite Law | Brighouse | Apr 2022 – Jan 2024
- Engineered API integrations to extend MatterSphere product functionality
- Modernized legacy codebases, improving maintainability and response times by up to 30%
- Worked directly with clients to gather requirements and deliver secure, scalable solutions
- Enhanced performance and infrastructure across multi-user environments

EDUCATION & CERTIFICATIONS:
- BSc (Hons) Computer Science | Sheffield Hallam University | 2019–2022 | Grade: 2:1
- Microsoft Certified: Azure Fundamentals (AZ-900) | 2025
- Currently studying for AZ-104 (Azure Administrator Associate)
- Udacity Nanodegree Program – SQL | 2023
- ASP.NET Core Identity: Authentication & Authorization | 2024

KEY STRENGTHS:
- Strong analytical and problem-solving skills with a focus on clean, maintainable code
- Excellent communication and teamwork abilities developed through client collaboration
- Quick learner dedicated to continuous improvement and emerging technologies
- Passion for building secure, efficient, and user-focused systems

CAREER GOALS:
Karolina wants to move into a Solutions Architect or Technical Consultant role where she can design systems and work closely with clients, rather than day-to-day coding.

INTERESTS:
Marathon running, mindfulness, and meditation for focus and resilience.
`

const SYSTEM_PROMPT = `You are Karolina, a software developer responding to questions about your CV and experience. 

Here is your CV:
${KAROLINA_CV}

Rules:
- Answer in first person as Karolina
- Be friendly, professional, and concise
- Keep responses short (2-4 sentences unless more detail is asked for)
- Only answer questions related to your professional experience, skills, education, or career goals
- If asked something unrelated, politely redirect to professional topics
- If asked about something not in your CV, say you'd be happy to discuss it in an interview`

const chatHistory = ref([])

onMounted(() => {
  setTimeout(() => showHeader.value = true, 100)
  setTimeout(() => showChat.value = true, 400)
  setTimeout(() => showInput.value = true, 700)
})

const suggestions = [
  'What are your skills?',
  'Tell me about your experience',
  'What are you looking for?'
]

let messageId = 0

async function sendMessage() {
  if (!input.value.trim() || isLoading.value) return
  
  const userMessage = {
    id: messageId++,
    role: 'user',
    text: input.value
  }
  messages.value.push(userMessage)
  
  chatHistory.value.push({
    role: 'user',
    content: input.value
  })
  
  const question = input.value
  input.value = ''
  isLoading.value = true
  
  await nextTick()
  scrollToBottom()
  
  try {
    const response = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...chatHistory.value
      ],
      model: 'llama-3.1-8b-instant',
      max_tokens: 200,
      temperature: 0.7
    })
    
    const text = response.choices[0]?.message?.content || "Sorry, I couldn't generate a response."
    
    chatHistory.value.push({
      role: 'assistant',
      content: text
    })
    
    const botMessage = {
      id: messageId++,
      role: 'bot',
      text: text
    }
    messages.value.push(botMessage)
  } catch (error) {
    console.error('Error:', error)
    const botMessage = {
      id: messageId++,
      role: 'bot',
      text: "Sorry, I'm having trouble connecting right now. Please try again!"
    }
    messages.value.push(botMessage)
  }
  
  isLoading.value = false
  await nextTick()
  scrollToBottom()
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}
</script>

<style>
/* Message animations */
.message-enter-active {
  transition: all 0.4s ease-out;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

/* Fade animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>