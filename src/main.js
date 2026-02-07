import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

import Home from './views/Home.vue'
import WorkflowBuilder from './views/WorkflowBuilder.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/workflow', name: 'WorkflowBuilder', component: WorkflowBuilder }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')