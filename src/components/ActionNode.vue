<template>
  <div class="action-node" :class="{ 'is-active': data.isActive, 'is-completed': data.isCompleted }">
    <div class="node-header">
      <div class="node-icon">▶️</div>
      <span class="node-type">Action</span>
      <span v-if="data.isCompleted" class="status-icon">✓</span>
    </div>
    <div class="node-body">
      <div class="node-label">{{ data.label }}</div>
      <div class="node-description">{{ data.description }}</div>
    </div>
    <Handle type="target" :position="Position.Top" class="handle-target" />
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
.action-node {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border: 1px solid #a78bfa;
  border-radius: 12px;
  min-width: 200px;
  box-shadow: 0 0 20px rgba(167, 139, 250, 0.2);
  transition: all 0.3s ease;
}

.action-node.is-active {
  border-color: #fbbf24;
  box-shadow: 0 0 30px rgba(251, 191, 36, 0.5), 0 0 60px rgba(251, 191, 36, 0.3);
  transform: scale(1.05);
}

.action-node.is-completed {
  border-color: #4ade80;
  box-shadow: 0 0 20px rgba(74, 222, 128, 0.4);
}

.node-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.2) 0%, rgba(167, 139, 250, 0.05) 100%);
  border-bottom: 1px solid rgba(167, 139, 250, 0.3);
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
  color: #a78bfa;
}

.status-icon {
  margin-left: auto;
  color: #4ade80;
  font-weight: bold;
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

.handle-target,
.handle-source {
  width: 12px;
  height: 12px;
  background: #a78bfa;
  border: 2px solid #0f172a;
}
</style>