import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import WorkflowBuilder from './views/WorkflowBuilder.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: App
  },
  {
    path: '/workflow',
    name: 'WorkflowBuilder',
    component: WorkflowBuilder
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router