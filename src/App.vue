<template>
    <div>
      <!-- Navigation -->
      <nav
        :class="[
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out',
          isScrolled
            ? 'bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-lg shadow-black/20'
            : 'bg-slate-900',
          mounted ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        ]"
      >
        <div class="max-w-6xl mx-auto px-4 sm:px-6">
          <div class="flex items-center justify-between h-16">
            <!-- Logo -->
            <router-link
              to="/"
              class="group relative flex items-center gap-2 transition-all duration-300"
            >
              <div class="relative">
                <div class="absolute inset-0 bg-gradient-to-r from-sky-500 to-cyan-400 rounded-lg blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                <div class="relative w-9 h-9 bg-gradient-to-br from-sky-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:shadow-sky-500/40 group-hover:scale-105 transition-all duration-300">
                  <span class="text-white font-semibold text-sm">KM</span>
                </div>
              </div>

            </router-link>
  
            <!-- Desktop Navigation -->
            <div class="hidden md:flex items-center gap-1">
            <template v-for="link in navLinks" :key="link.path || link.label">
                <!-- Regular link -->
                <router-link
                v-if="link.path"
                :to="link.path"
                :class="[
                    'relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300',
                    $route.path === link.path
                    ? 'text-white'
                    : 'text-slate-300 hover:text-white'
                ]"
                >
                <span
                    :class="[
                    'absolute inset-0 rounded-full transition-all duration-300',
                    $route.path === link.path
                        ? 'bg-gradient-to-r from-sky-500/20 to-cyan-500/20 border border-sky-500/30'
                        : 'bg-transparent hover:bg-slate-800/50'
                    ]"
                />
                <span 
                    v-if="$route.path === link.path" 
                    class="absolute inset-0 rounded-full bg-sky-500/10 blur-md" 
                />
                <span class="relative z-10">{{ link.label }}</span>
                <span 
                    v-if="$route.path === link.path" 
                    class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-sky-400 rounded-full shadow-lg shadow-sky-400/50" 
                />
                </router-link>
                
                <!-- Dropdown -->
                <div v-else class="relative" @mouseenter="projectsOpen = true" @mouseleave="projectsOpen = false">
                <button
                    :class="[
                    'relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 flex items-center gap-1',
                    $route.path.startsWith('/workflow')
                        ? 'text-white'
                        : 'text-slate-300 hover:text-white'
                    ]"
                >
                    <span
                    :class="[
                        'absolute inset-0 rounded-full transition-all duration-300',
                        $route.path.startsWith('/workflow')
                        ? 'bg-gradient-to-r from-sky-500/20 to-cyan-500/20 border border-sky-500/30'
                        : 'bg-transparent hover:bg-slate-800/50'
                    ]"
                    />
                    <span class="relative z-10">{{ link.label }}</span>
                    <svg 
                    class="relative z-10 w-4 h-4 transition-transform duration-200" 
                    :class="{ 'rotate-180': projectsOpen }"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                
                <!-- Dropdown menu -->
                <div 
                v-show="projectsOpen"
                class="absolute top-full left-0 pt-2 w-56"
                >
                <div class="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-xl shadow-black/30 overflow-hidden">
                    <router-link
                    v-for="child in link.children"
                    :key="child.path"
                    :to="child.path"
                    class="block px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
                    >
                    {{ child.label }}
                    </router-link>
                </div>
                </div>
                </div>
            </template>
            </div>
  
            <!-- CTA Button - Desktop -->
            <div class="hidden md:block">
              <button
                @click="scrollToContact"
                class="group relative inline-flex items-center gap-2 px-5 py-2.5 overflow-hidden rounded-full transition-all duration-300"
              >
                <span class="absolute inset-0 bg-gradient-to-r from-sky-500 to-sky-600 transition-all duration-300 group-hover:from-sky-400 group-hover:to-sky-500" />
                <span class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-sky-400 to-cyan-400" />
                <span class="absolute inset-0 rounded-full shadow-lg shadow-sky-500/25 group-hover:shadow-sky-500/40 transition-shadow duration-300" />
                <svg
                  class="relative z-10 w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span class="relative z-10 text-sm font-medium text-white">
                  Get in Touch
                </span>
              </button>
            </div>
  
            <!-- Mobile Menu Button -->
            <button
              @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-700/60 hover:border-sky-500/30 transition-all duration-300"
              aria-label="Toggle menu"
            >
              <div class="relative w-5 h-4 flex flex-col justify-between">
                <span
                  :class="[
                    'w-full h-0.5 bg-current rounded-full transition-all duration-300 origin-center',
                    isMobileMenuOpen && 'rotate-45 translate-y-1.5'
                  ]"
                />
                <span
                  :class="[
                    'w-full h-0.5 bg-current rounded-full transition-all duration-300',
                    isMobileMenuOpen && 'opacity-0 scale-0'
                  ]"
                />
                <span
                  :class="[
                    'w-full h-0.5 bg-current rounded-full transition-all duration-300 origin-center',
                    isMobileMenuOpen && '-rotate-45 -translate-y-1.5'
                  ]"
                />
              </div>
            </button>
          </div>
        </div>
      </nav>
  
      <!-- Mobile Menu Overlay -->
      <div
        :class="[
          'fixed inset-0 z-40 md:hidden transition-all duration-500',
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        ]"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-slate-900/95 backdrop-blur-xl"
          @click="isMobileMenuOpen = false"
        />
  
        <!-- Mobile Menu Content -->
        <div
          :class="[
            'absolute inset-x-4 top-20 bg-slate-800/90 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 shadow-2xl shadow-black/40 transition-all duration-500',
            isMobileMenuOpen
              ? 'translate-y-0 opacity-100 scale-100'
              : '-translate-y-8 opacity-0 scale-95'
          ]"
        >
          <nav class="flex flex-col gap-2">
            <router-link
              v-for="(link, index) in navLinks"
              :key="link.path"
              :to="link.path"
              @click="isMobileMenuOpen = false"
              :class="[
                'relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300',
                $route.path === link.path
                  ? 'bg-gradient-to-r from-sky-500/20 to-cyan-500/20 border border-sky-500/30 text-white'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              ]"
              :style="{
                transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms'
              }"
            >
              <span 
                v-if="$route.path === link.path" 
                class="w-2 h-2 bg-sky-400 rounded-full shadow-lg shadow-sky-400/50" 
              />
              <span :class="['font-medium', $route.path !== link.path && 'ml-5']">
                {{ link.label }}
              </span>
            </router-link>
          </nav>
  
          <!-- Mobile CTA -->
          <div class="mt-6 pt-6 border-t border-slate-700/50">
            <button
              @click="scrollToContact(); isMobileMenuOpen = false"
              class="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-gradient-to-r from-sky-500 to-sky-600 text-white font-medium rounded-2xl hover:from-sky-400 hover:to-sky-500 transition-all duration-300 shadow-lg shadow-sky-500/20"
            >
              <svg
                class="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Get in Touch
            </button>
          </div>
        </div>
      </div>
  
      <!-- Spacer for fixed nav -->
      <div class="h-16" />
  
      <!-- Page content -->
      <router-view />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const navLinks = [
  { path: '/', label: 'CV Chatbot' },
  { 
    label: 'Projects',
    children: [
      { path: '/workflow', label: 'AI Workflow Builder' }
    ]
  }
  ]
  
  const isScrolled = ref(false)
  const isMobileMenuOpen = ref(false)
  const mounted = ref(false)
  const projectsOpen = ref(false)
  
  const handleScroll = () => {
    isScrolled.value = window.scrollY > 20
  }
  
  const scrollToContact = () => {
  if (router.currentRoute.value.path !== '/') {
    router.push('/?contact=true')
  } else {
    window.dispatchEvent(new CustomEvent('open-contact-modal'))
  }
}
  
  onMounted(() => {
    mounted.value = true
    window.addEventListener('scroll', handleScroll)
  })
  
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
  </script>