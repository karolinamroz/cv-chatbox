<template>
    <div class="sidebar">
      <div class="sidebar-header">
        <h3 class="text-lg font-semibold text-white">Nodes</h3>
        <p class="text-xs text-slate-400 mt-1">Drag onto canvas</p>
      </div>
      
      <div class="node-list">
        <div
          v-for="node in availableNodes"
          :key="node.type"
          class="draggable-node"
          :style="{ borderColor: node.color }"
          draggable="true"
          @dragstart="onDragStart($event, node)"
        >
          <div class="node-icon" :style="{ background: node.color + '20' }">
            {{ node.icon }}
          </div>
          <div class="node-info">
            <div class="node-name" :style="{ color: node.color }">{{ node.label }}</div>
            <div class="node-desc">{{ node.description }}</div>
          </div>
        </div>
      </div>
      
      <!-- AI Suggestion Panel -->
      <AISuggestion 
        :nodes="nodes" 
        :edges="edges" 
        @add-node="$emit('add-suggested-node', $event)"
      />
      
      <div class="sidebar-section">
        <h4 class="text-sm font-medium text-slate-300 mb-3">Quick Actions</h4>
        <button @click="$emit('clear')" class="quick-action-btn danger">
          <span>🗑️</span>
          Clear Canvas
        </button>
        <button @click="$emit('save')" class="quick-action-btn">
          <span>💾</span>
          Save Workflow
        </button>
        <button @click="$emit('load')" class="quick-action-btn">
          <span>📂</span>
          Load Workflow
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import AISuggestion from './AISuggestion.vue'
  
  defineProps({
    nodes: {
      type: Array,
      default: () => []
    },
    edges: {
      type: Array,
      default: () => []
    }
  })
  
  defineEmits(['clear', 'save', 'load', 'add-suggested-node'])
  
  const availableNodes = [
    {
      type: 'trigger',
      label: 'Trigger',
      icon: '⚡',
      color: '#22d3ee',
      description: 'Start your workflow',
      data: { label: 'New Trigger', description: 'Configure trigger' }
    },
    {
      type: 'action',
      label: 'Action',
      icon: '▶️',
      color: '#a78bfa',
      description: 'Perform an action',
      data: { label: 'New Action', description: 'Configure action' }
    },
    {
      type: 'condition',
      label: 'Condition',
      icon: '🔀',
      color: '#fbbf24',
      description: 'Branch logic',
      data: { label: 'New Condition', description: 'Configure condition' }
    },
    {
      type: 'output',
      label: 'Output',
      icon: '📤',
      color: '#4ade80',
      description: 'End your workflow',
      data: { label: 'New Output', description: 'Configure output' }
    }
  ]
  
  const onDragStart = (event, node) => {
    event.dataTransfer.setData('application/vueflow', JSON.stringify(node))
    event.dataTransfer.effectAllowed = 'move'
  }
  </script>
  
  <style scoped>
    .sidebar {
    width: 100%;
    background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
    border-right: 1px solid #30363d;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 100%;
    overflow-y: auto;
    flex-shrink: 0;
    }
  
  .sidebar-header {
    padding-bottom: 16px;
    border-bottom: 1px solid #30363d;
  }
  
  .node-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .draggable-node {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #0d1117;
    border: 1px solid #30363d;
    border-radius: 10px;
    cursor: grab;
    transition: all 0.2s ease;
  }
  
  .draggable-node:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }
  
  .draggable-node:active {
    cursor: grabbing;
  }
  
  .node-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }
  
  .node-info {
    flex: 1;
  }
  
  .node-name {
    font-size: 13px;
    font-weight: 600;
  }
  
  .node-desc {
    font-size: 11px;
    color: #64748b;
    margin-top: 2px;
  }
  
  .sidebar-section {
    padding-top: 16px;
    border-top: 1px solid #30363d;
  }
  
  .quick-action-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 10px 12px;
    background: #0d1117;
    border: 1px solid #30363d;
    border-radius: 8px;
    color: #94a3b8;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 8px;
  }
  
  .quick-action-btn:hover {
    background: #1e293b;
    color: #f1f5f9;
    border-color: #475569;
  }
  
  .quick-action-btn.danger:hover {
    border-color: #f87171;
    color: #f87171;
  }
  </style>