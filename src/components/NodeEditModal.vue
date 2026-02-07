<template>
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-icon" :style="{ background: nodeColor + '20', color: nodeColor }">
            {{ nodeIcon }}
          </div>
          <div>
            <h3 class="modal-title">Edit {{ nodeType }}</h3>
            <p class="modal-subtitle">Configure this node's settings</p>
          </div>
          <button @click="$emit('close')" class="close-btn">✕</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Label</label>
            <input 
              v-model="localData.label" 
              type="text" 
              class="form-input"
              placeholder="Enter node label"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea 
              v-model="localData.description" 
              class="form-textarea"
              placeholder="Enter node description"
              rows="3"
            ></textarea>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="$emit('close')" class="btn-cancel">Cancel</button>
          <button @click="saveChanges" class="btn-save">Save Changes</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  
  const props = defineProps({
    show: Boolean,
    node: Object
  })
  
  const emit = defineEmits(['close', 'save'])
  
  const localData = ref({
    label: '',
    description: ''
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
  
  const nodeColor = ref('#64748b')
  const nodeIcon = ref('📦')
  const nodeType = ref('Node')
  
  watch(() => props.node, (newNode) => {
    if (newNode) {
      localData.value = {
        label: newNode.data?.label || '',
        description: newNode.data?.description || ''
      }
      nodeColor.value = nodeColors[newNode.type] || '#64748b'
      nodeIcon.value = nodeIcons[newNode.type] || '📦'
      nodeType.value = newNode.type?.charAt(0).toUpperCase() + newNode.type?.slice(1) || 'Node'
    }
  }, { immediate: true })
  
  const saveChanges = () => {
    emit('save', {
      id: props.node.id,
      data: { ...localData.value }
    })
    emit('close')
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }
  
  .modal-content {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border: 1px solid #30363d;
    border-radius: 16px;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  }
  
  .modal-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px;
    border-bottom: 1px solid #30363d;
  }
  
  .modal-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }
  
  .modal-title {
    font-size: 16px;
    font-weight: 600;
    color: #f1f5f9;
    margin: 0;
  }
  
  .modal-subtitle {
    font-size: 12px;
    color: #64748b;
    margin: 2px 0 0 0;
  }
  
  .close-btn {
    margin-left: auto;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: none;
    background: #0d1117;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .close-btn:hover {
    background: #1e293b;
    color: #f1f5f9;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .form-group {
    margin-bottom: 16px;
  }
  
  .form-group:last-child {
    margin-bottom: 0;
  }
  
  .form-label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: #94a3b8;
    margin-bottom: 8px;
  }
  
  .form-input,
  .form-textarea {
    width: 100%;
    padding: 12px 14px;
    background: #0d1117;
    border: 1px solid #30363d;
    border-radius: 10px;
    color: #f1f5f9;
    font-size: 14px;
    transition: all 0.2s;
    box-sizing: border-box;
  }
  
  .form-input:focus,
  .form-textarea:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  }
  
  .form-textarea {
    resize: none;
    font-family: inherit;
  }
  
  .modal-footer {
    display: flex;
    gap: 12px;
    padding: 16px 20px;
    border-top: 1px solid #30363d;
  }
  
  .btn-cancel,
  .btn-save {
    flex: 1;
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .btn-cancel {
    background: #0d1117;
    border: 1px solid #30363d;
    color: #94a3b8;
  }
  
  .btn-cancel:hover {
    background: #1e293b;
    color: #f1f5f9;
  }
  
  .btn-save {
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    border: none;
    color: white;
  }
  
  .btn-save:hover {
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
    transform: translateY(-1px);
  }
  </style>