<template>
  <div>
    <!-- Mobile Warning -->
    <div class="mobile-warning">
      <div class="mobile-warning__content">
        <div class="mobile-warning__icon">🖥️</div>
        <h2 class="mobile-warning__title">Desktop Required</h2>
        <p class="mobile-warning__text">
          The AI Workflow Builder uses drag-and-drop functionality that works best on larger screens.
        </p>
        <p class="mobile-warning__text">
          Please visit this page on a desktop or laptop computer for the full experience.
        </p>
        <router-link to="/" class="mobile-warning__btn">
          ← Back to Home
        </router-link>
      </div>
    </div>

    <!-- Desktop Content -->
    <div class="workflow-page">
        <div class="sidebar-wrapper" :style="{ width: sidebarWidth + 'px' }">
          <NodeSidebar 
            :nodes="nodes"
            :edges="edges"
            @clear="clearCanvas" 
            @save="saveWorkflow" 
            @load="loadWorkflow"
            @add-suggested-node="addSuggestedNode"
          />
          <!-- Resize Handle -->
          <div 
            class="resize-handle"
            @mousedown="startResize"
          >
            <div class="resize-line"></div>
          </div>
        </div>
        
        <div class="workflow-container">
        <div class="workflow-header">
          <h1 class="text-3xl font-bold text-white">AI Workflow Builder</h1>
          <p class="text-slate-400 mt-1">Drag nodes from the sidebar to build your automation</p>
        </div>
        
        <div 
          class="canvas-wrapper"
          @drop="onDrop"
          @dragover.prevent
          @dragenter.prevent
        >
          <VueFlow
            :nodes="nodes"
            :edges="edges"
            :node-types="nodeTypes"
            @node-double-click="onNodeDoubleClick"
            @node-context-menu="onNodeContextMenu"
            @connect="handleConnect"
            fit-view-on-init
            :default-viewport="{ zoom: 1 }"
            :min-zoom="0.5"
            :max-zoom="2"
          >
            <Background pattern-color="#334155" :gap="20" />
            <Controls />
          </VueFlow>
        </div>
      </div>
      
      <NodeEditModal 
        :show="showEditModal" 
        :node="selectedNode"
        @close="showEditModal = false"
        @save="saveNodeChanges"
      />
    </div>
  </div>
</template>
  
  <script setup>
  import { ref, markRaw } from 'vue'
  import { VueFlow, useVueFlow } from '@vue-flow/core'
  import { Background } from '@vue-flow/background'
  import { Controls } from '@vue-flow/controls'
  import '@vue-flow/core/dist/style.css'
  import '@vue-flow/core/dist/theme-default.css'
  
  import NodeSidebar from '../components/NodeSidebar.vue'
  import TriggerNode from '../components/TriggerNode.vue'
  import ActionNode from '../components/ActionNode.vue'
  import ConditionNode from '../components/ConditionNode.vue'
  import OutputNode from '../components/OutputNode.vue'
  import NodeEditModal from '../components/NodeEditModal.vue'

  const nodeTypes = {
    trigger: markRaw(TriggerNode),
    action: markRaw(ActionNode),
    condition: markRaw(ConditionNode),
    output: markRaw(OutputNode)
  }
  
  const showEditModal = ref(false)
  const selectedNode = ref(null)

  // Sidebar resizing
  const sidebarWidth = ref(280)
  const isResizing = ref(false)

  const startResize = (event) => {
    isResizing.value = true
    document.addEventListener('mousemove', handleResize)
    document.addEventListener('mouseup', stopResize)
  }

  const handleResize = (event) => {
    if (!isResizing.value) return
    const newWidth = event.clientX
    if (newWidth >= 200 && newWidth <= 500) {
      sidebarWidth.value = newWidth
    }
  }

  const stopResize = () => {
    isResizing.value = false
    document.removeEventListener('mousemove', handleResize)
    document.removeEventListener('mouseup', stopResize)
  }
  
  let nodeId = 10
  
  const nodes = ref([
    {
      id: '1',
      type: 'trigger',
      position: { x: 250, y: 0 },
      data: { 
        label: 'Webhook Received',
        description: 'When a POST request arrives'
      }
    },
    {
      id: '2',
      type: 'condition',
      position: { x: 250, y: 150 },
      data: { 
        label: 'Check Payload',
        description: 'If data.type === "urgent"'
      }
    },
    {
      id: '3',
      type: 'action',
      position: { x: 100, y: 300 },
      data: { 
        label: 'Send Slack Alert',
        description: 'Post to #alerts channel'
      }
    },
    {
      id: '4',
      type: 'action',
      position: { x: 400, y: 300 },
      data: { 
        label: 'Log to Database',
        description: 'Insert into events table'
      }
    },
    {
      id: '5',
      type: 'output',
      position: { x: 250, y: 450 },
      data: { 
        label: 'Return Response',
        description: 'Send 200 OK'
      }
    }
  ])
  
  const edges = ref([
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#64748b', strokeWidth: 2 } },
    { id: 'e2-3', source: '2', sourceHandle: 'yes', target: '3', animated: true, style: { stroke: '#4ade80', strokeWidth: 2 } },
    { id: 'e2-4', source: '2', sourceHandle: 'no', target: '4', animated: true, style: { stroke: '#f87171', strokeWidth: 2 } },
    { id: 'e3-5', source: '3', target: '5', animated: true, style: { stroke: '#64748b', strokeWidth: 2 } },
    { id: 'e4-5', source: '4', target: '5', animated: true, style: { stroke: '#64748b', strokeWidth: 2 } }
  ])
  
  const handleConnect = (params) => {
    edges.value.push({ 
      ...params, 
      id: `e${params.source}-${params.target}`,
      animated: true, 
      style: { stroke: '#64748b', strokeWidth: 2 } 
    })
  }

const { screenToFlowCoordinate } = useVueFlow()

const onDrop = (event) => {
  const data = event.dataTransfer.getData('application/vueflow')
  if (!data) return
  
  const nodeData = JSON.parse(data)
  
  const position = screenToFlowCoordinate({
    x: event.clientX,
    y: event.clientY
  })
  
  const newNode = {
    id: `node-${nodeId++}`,
    type: nodeData.type,
    position: {
      x: position.x - 75,
      y: position.y - 30
    },
    data: { ...nodeData.data }
  }
  
  nodes.value = [...nodes.value, newNode]
  }
  
  const addSuggestedNode = (nodeData) => {
    const newNode = {
      id: `node-${nodeId++}`,
      type: nodeData.type,
      position: { x: 250, y: nodes.value.length * 120 },
      data: nodeData.data
    }
    nodes.value = [...nodes.value, newNode]
  }
  
  const clearCanvas = () => {
    nodes.value = []
    edges.value = []
  }
  
  const saveWorkflow = () => {
    const workflow = {
      nodes: nodes.value,
      edges: edges.value
    }
    localStorage.setItem('savedWorkflow', JSON.stringify(workflow))
    alert('Workflow saved!')
  }
  
  const loadWorkflow = () => {
    const saved = localStorage.getItem('savedWorkflow')
    if (saved) {
      const workflow = JSON.parse(saved)
      nodes.value = workflow.nodes
      edges.value = workflow.edges
      alert('Workflow loaded!')
    } else {
      alert('No saved workflow found')
    }
  }
  
  const onNodeDoubleClick = ({ node }) => {
    selectedNode.value = node
    showEditModal.value = true
  }
  
  const onNodeContextMenu = ({ event, node }) => {
    event.preventDefault()
    if (confirm('Delete this node?')) {
      nodes.value = nodes.value.filter(n => n.id !== node.id)
      edges.value = edges.value.filter(e => e.source !== node.id && e.target !== node.id)
    }
  }
  
  const saveNodeChanges = (updatedNode) => {
  nodes.value = nodes.value.map(n => {
    if (n.id === updatedNode.id) {
      return {
        ...n,
        data: { ...updatedNode.data }
      }
    }
    return n
  })
  }
  </script>
  
  <style>
  .workflow-page {
    display: flex;
    height: calc(100vh - 64px);
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    overflow: hidden;
  }
  
  .workflow-container {
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
  }
  
  .workflow-header {
    margin-bottom: 20px;
  }
  
  .canvas-wrapper {
    flex: 1;
    border-radius: 16px;
    overflow: hidden;
    background: #0d1117;
    border: 1px solid #30363d;
  }

.vue-flow__node-output {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}
.canvas-wrapper {
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  will-change: transform;
  isolation: isolate;
}

.vue-flow__node {
  -webkit-transform: translateZ(0);
  backface-visibility: hidden;
}

.sidebar-wrapper {
  position: relative;
  display: flex;
  flex-shrink: 0;
  height: 100%;
}

.resize-handle {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 8px;
  cursor: col-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.resize-handle:hover .resize-line,
.resize-handle:active .resize-line {
  background: #6366f1;
}

.resize-line {
  width: 3px;
  height: 40px;
  background: #475569;
  border-radius: 3px;
  transition: background 0.2s;
}

/* Mobile Warning */
.mobile-warning {
  display: none;
  min-height: calc(100vh - 64px);
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 2rem;
  align-items: center;
  justify-content: center;
}

.mobile-warning__content {
  text-align: center;
  max-width: 320px;
}

.mobile-warning__icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.mobile-warning__title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #f1f5f9;
  margin-bottom: 1rem;
}

.mobile-warning__text {
  color: #94a3b8;
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.mobile-warning__btn {
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.75rem;
  text-decoration: none;
  transition: all 0.3s;
}

.mobile-warning__btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(14, 165, 233, 0.4);
}

/* Show mobile warning, hide desktop on small screens */
@media (max-width: 768px) {
  .mobile-warning {
    display: flex;
  }
  
  .workflow-page {
    display: none;
  }
}
  </style>