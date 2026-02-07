<template>
    <div class="condition-node">
      <div class="node-header">
        <div class="node-icon">🔀</div>
        <span class="node-type">Condition</span>
      </div>
      <div class="node-body">
        <div class="node-label">{{ data.label }}</div>
        <div class="node-description">{{ data.description }}</div>
      </div>
      <Handle type="target" :position="Position.Top" class="handle-target" />
      <Handle type="source" :position="Position.Bottom" id="yes" class="handle-yes" :style="{ left: '30%' }" />
      <Handle type="source" :position="Position.Bottom" id="no" class="handle-no" :style="{ left: '70%' }" />
    </div>
  </template>
  
  <script setup>
  import { Handle, Position } from '@vue-flow/core'
  
  defineProps({
    data: {
      type: Object,
      required: true
    }
  })
  </script>
  
  <style scoped>
  .condition-node {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border: 1px solid #fbbf24;
    border-radius: 12px;
    min-width: 200px;
    box-shadow: 0 0 20px rgba(251, 191, 36, 0.2);
  }
  
  .node-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(251, 191, 36, 0.05) 100%);
    border-bottom: 1px solid rgba(251, 191, 36, 0.3);
    border-radius: 11px 11px 0 0;
  }
  
  .node-icon {
    font-size: 14px;
  }
  
  .node-type {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #fbbf24;
  }
  
  .node-body {
    padding: 12px 14px;
  }
  
  .node-label {
    font-size: 14px;
    font-weight: 500;
    color: #f1f5f9;
    margin-bottom: 4px;
  }
  
  .node-description {
    font-size: 12px;
    color: #94a3b8;
  }
  
  .handle-target {
    width: 12px;
    height: 12px;
    background: #fbbf24;
    border: 2px solid #0f172a;
  }
  
  .handle-yes {
    width: 12px;
    height: 12px;
    background: #4ade80;
    border: 2px solid #0f172a;
  }
  
  .handle-no {
    width: 12px;
    height: 12px;
    background: #f87171;
    border: 2px solid #0f172a;
  }
  </style>