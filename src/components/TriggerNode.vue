<template>
    <div class="trigger-node">
      <div class="node-header">
        <div class="node-icon">⚡</div>
        <span class="node-type">Trigger</span>
      </div>
      <div class="node-body">
        <div class="node-label">{{ data.label }}</div>
        <div class="node-description">{{ data.description }}</div>
      </div>
      <Handle type="source" :position="Position.Bottom" class="handle-source" />
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
  .trigger-node {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border: 1px solid #22d3ee;
    border-radius: 12px;
    min-width: 200px;
    box-shadow: 0 0 20px rgba(34, 211, 238, 0.2);
  }
  
  .node-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: linear-gradient(135deg, rgba(34, 211, 238, 0.2) 0%, rgba(34, 211, 238, 0.05) 100%);
    border-bottom: 1px solid rgba(34, 211, 238, 0.3);
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
    color: #22d3ee;
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
  
  .handle-source {
    width: 12px;
    height: 12px;
    background: #22d3ee;
    border: 2px solid #0f172a;
  }
  </style>