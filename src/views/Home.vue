<template>
  <main class="home-page">
    <!-- Ambient gradient background -->
    <div class="ambient-bg">
      <div class="gradient-orb gradient-orb--1"></div>
      <div class="gradient-orb gradient-orb--2"></div>
      <div class="gradient-orb gradient-orb--3"></div>
    </div>

    <!-- Main content -->
    <div class="content-wrapper">
      <!-- Header -->
      <header class="header" :class="{ 'is-visible': showHeader }">
        <h1 class="header__title">
          Hi, I'm <span class="header__highlight">Karolina</span>
        </h1>
        <p class="header__subtitle">Ask me anything about my experience</p>
      </header>

      <!-- Chat Container -->
      <section class="chat" :class="{ 'is-visible': showChat }">
        <!-- Messages Area -->
        <div ref="messagesContainer" class="chat__messages">
          <!-- Welcome state -->
          <div v-if="messages.length === 0" class="welcome">
            <div class="welcome__icon">💬</div>
            <p class="welcome__text">Start a conversation</p>
            <div class="welcome__suggestions">
              <button
                v-for="(suggestion, index) in CHAT_SUGGESTIONS"
                :key="index"
                @click="input = suggestion"
                class="suggestion-chip"
              >
                {{ suggestion }}
              </button>
            </div>
          </div>

          <!-- Messages -->
          <TransitionGroup name="message">
            <div
              v-for="message in messages"
              :key="message.id"
              class="message"
              :class="[`message--${message.role}`]"
            >
              <div class="message__bubble">{{ message.text }}</div>
            </div>
          </TransitionGroup>

          <!-- Loading indicator -->
          <Transition name="fade">
            <div v-if="isLoading" class="message message--bot">
              <div class="message__bubble">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Input Area -->
        <form @submit.prevent="sendMessage" class="chat__input-area" :class="{ 'is-visible': showInput }">
          <input
            v-model="input"
            type="text"
            placeholder="Type your question..."
            :disabled="isLoading"
            class="chat__input"
          />
          <button type="submit" :disabled="!input.trim() || isLoading" class="chat__send-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </section>

      <!-- Footer -->
      <footer class="footer" :class="{ 'is-visible': showInput }">
        <a href="https://github.com/karolinamroz" target="_blank" class="footer__social" title="GitHub">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
        <p class="footer__text">Powered by AI ✨</p>
      </footer>
    </div>

    <!-- Contact Modal -->
    <Transition name="modal">
      <div v-if="showContactModal" class="modal-overlay" @click.self="closeContactModal">
        <div class="modal">
          <button @click="closeContactModal" class="modal__close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <h2 class="modal__title">Get in Touch</h2>
          
          <form @submit.prevent="sendContactEmail" class="modal__form">
            <input v-model="contactForm.name" type="text" placeholder="Your name" required />
            <input v-model="contactForm.email" type="email" placeholder="Your email" required />
            <textarea v-model="contactForm.message" placeholder="Your message" required rows="4"></textarea>
            <button type="submit" :disabled="contactSending" class="modal__submit">
              {{ contactSending ? 'Sending...' : 'Send Message' }}
            </button>
          </form>
          
          <p v-if="contactSuccess" class="modal__success">Message sent! I'll get back to you soon.</p>
          <p v-if="contactError" class="modal__error">Something went wrong. Please try again.</p>
        </div>
      </div>
    </Transition>

    <!-- CV Request Modal -->
    <Transition name="modal">
      <div v-if="showCvModal" class="modal-overlay" @click.self="closeCvModal">
        <div class="modal">
          <button @click="closeCvModal" class="modal__close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <h2 class="modal__title">Get My CV</h2>
          <p class="modal__subtitle">Enter your email and I'll send you my CV directly.</p>
          
          <form @submit.prevent="sendCvEmail" class="modal__form">
            <input v-model="cvForm.email" type="email" placeholder="Your email" required />
            <button type="submit" :disabled="cvSending" class="modal__submit">
              {{ cvSending ? 'Sending...' : 'Send CV to My Email' }}
            </button>
          </form>
          
          <p v-if="cvSuccess" class="modal__success">CV sent! Check your inbox.</p>
          <p v-if="cvError" class="modal__error">Something went wrong. Please try again.</p>
        </div>
      </div>
    </Transition>

    <!-- Floating CV Button -->
    <div class="cv-float" @mouseenter="showCvDropdown = true" @mouseleave="showCvDropdown = false">
      <div v-show="showCvDropdown" class="cv-float__dropdown">
        <a href="/Karolina_Mroz_CV.pdf" download class="cv-float__item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download CV
        </a>
        <button @click="openCvModal" class="cv-float__item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          Send to Email
        </button>
      </div>
      
      <button class="cv-float__btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
        CV
      </button>
    </div>
  </main>
</template>

<script setup>
/**
 * Home.vue - CV Chatbot Landing Page
 * 
 * An AI-powered chatbot that answers questions about Karolina's CV.
 * Features contact form, CV download/email, and animated UI.
 */

import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import Groq from 'groq-sdk'
import { SYSTEM_PROMPT, CHAT_SUGGESTIONS } from '../data/cv.js'

// ============================================
// STATE
// ============================================

// Chat
const input = ref('')
const messages = ref([])
const chatHistory = ref([])
const isLoading = ref(false)
const messagesContainer = ref(null)
let messageId = 0

// Modals
const showContactModal = ref(false)
const showCvModal = ref(false)
const showCvDropdown = ref(false)

// Contact form
const contactForm = ref({ name: '', email: '', message: '' })
const contactSending = ref(false)
const contactSuccess = ref(false)
const contactError = ref(false)

// CV form
const cvForm = ref({ email: '' })
const cvSending = ref(false)
const cvSuccess = ref(false)
const cvError = ref(false)

// Animations
const showHeader = ref(false)
const showChat = ref(false)
const showInput = ref(false)

// ============================================
// SERVICES
// ============================================

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
})

const route = useRoute()

// ============================================
// LIFECYCLE
// ============================================

const handleOpenContactModal = () => {
  showContactModal.value = true
}

onMounted(() => {
  // Staggered entrance animations
  setTimeout(() => showHeader.value = true, 100)
  setTimeout(() => showChat.value = true, 400)
  setTimeout(() => showInput.value = true, 700)
  
  // Check for contact query param
  if (route.query.contact === 'true') {
    showContactModal.value = true
  }
  
  // Listen for nav button clicks
  window.addEventListener('open-contact-modal', handleOpenContactModal)
})

onUnmounted(() => {
  window.removeEventListener('open-contact-modal', handleOpenContactModal)
})

// ============================================
// CHAT METHODS
// ============================================

async function sendMessage() {
  if (!input.value.trim() || isLoading.value) return
  
  // Add user message
  messages.value.push({
    id: messageId++,
    role: 'user',
    text: input.value
  })
  
  chatHistory.value.push({
    role: 'user',
    content: input.value
  })
  
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
    
    messages.value.push({
      id: messageId++,
      role: 'bot',
      text: text
    })
  } catch (error) {
    console.error('Chat error:', error)
    messages.value.push({
      id: messageId++,
      role: 'bot',
      text: "Sorry, I'm having trouble connecting right now. Please try again!"
    })
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

// ============================================
// MODAL METHODS
// ============================================

function openCvModal() {
  showCvModal.value = true
  showCvDropdown.value = false
}

function closeCvModal() {
  showCvModal.value = false
}

function closeContactModal() {
  showContactModal.value = false
}

// ============================================
// EMAIL METHODS
// ============================================

async function sendContactEmail() {
  contactSending.value = true
  contactSuccess.value = false
  contactError.value = false
  
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'contact',
        ...contactForm.value
      })
    })
    
    if (response.ok) {
      contactSuccess.value = true
      contactForm.value = { name: '', email: '', message: '' }
    } else {
      contactError.value = true
    }
  } catch (error) {
    console.error('Contact email error:', error)
    contactError.value = true
  }
  
  contactSending.value = false
}

async function sendCvEmail() {
  cvSending.value = true
  cvSuccess.value = false
  cvError.value = false
  
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'cv-request',
        email: cvForm.value.email
      })
    })
    
    if (response.ok) {
      cvSuccess.value = true
      cvForm.value = { email: '' }
    } else {
      cvError.value = true
    }
  } catch (error) {
    console.error('CV email error:', error)
    cvError.value = true
  }
  
  cvSending.value = false
}
</script>

<style scoped>
/* ============================================
   VARIABLES & BASE
   ============================================ */

.home-page {
  --color-primary: #0ea5e9;
  --color-primary-light: #38bdf8;
  --color-bg: #0f172a;
  --color-surface: #1e293b;
  --color-border: #334155;
  --color-text: #f1f5f9;
  --color-text-muted: #94a3b8;
  --color-success: #4ade80;
  --color-error: #f87171;
  
  min-height: 100vh;
  background: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  position: relative;
  overflow: hidden;
}

/* ============================================
   AMBIENT BACKGROUND
   ============================================ */

.ambient-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  animation: pulse 4s ease-in-out infinite;
}

.gradient-orb--1 {
  top: 0;
  left: 25%;
  width: 24rem;
  height: 24rem;
  background: rgba(14, 165, 233, 0.1);
}

.gradient-orb--2 {
  bottom: 0;
  right: 25%;
  width: 20rem;
  height: 20rem;
  background: rgba(168, 85, 247, 0.1);
  animation-delay: 1s;
}

.gradient-orb--3 {
  top: 50%;
  right: 33%;
  width: 16rem;
  height: 16rem;
  background: rgba(14, 165, 233, 0.05);
  animation-delay: 2s;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}

/* ============================================
   CONTENT WRAPPER
   ============================================ */

.content-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 42rem;
  margin: 0 auto;
  padding: 0 1rem;
}

/* ============================================
   HEADER
   ============================================ */

.header {
  margin-bottom: 2rem;
  text-align: center;
  opacity: 0;
  transform: translateY(-2rem);
  transition: all 0.7s ease-out;
}

.header.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.header__title {
  font-size: 2.5rem;
  font-weight: 300;
  letter-spacing: -0.025em;
  color: var(--color-text);
  margin-bottom: 0.75rem;
}

.header__highlight {
  font-weight: 400;
  background: linear-gradient(to right, var(--color-primary), #67e8f9);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.header__subtitle {
  color: var(--color-text-muted);
  font-size: 1.125rem;
}

/* ============================================
   CHAT CONTAINER
   ============================================ */

.chat {
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(51, 65, 85, 0.5);
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
  opacity: 0;
  transform: translateY(3rem) scale(0.95);
  transition: all 0.7s ease-out;
}

.chat.is-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.chat__messages {
  height: 420px;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chat__input-area {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  border-top: 1px solid rgba(51, 65, 85, 0.5);
  background: rgba(30, 41, 59, 0.4);
  opacity: 0;
  transform: translateY(1rem);
  transition: all 0.5s ease-out;
}

.chat__input-area.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.chat__input {
  flex: 1;
  background: rgba(51, 65, 85, 0.6);
  color: var(--color-text);
  padding: 0.875rem 1.25rem;
  border-radius: 1rem;
  border: 1px solid rgba(71, 85, 105, 0.5);
  font-size: 0.875rem;
  outline: none;
  transition: all 0.3s;
}

.chat__input::placeholder {
  color: var(--color-text-muted);
}

.chat__input:focus {
  border-color: rgba(14, 165, 233, 0.5);
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2);
}

.chat__send-btn {
  padding: 0.875rem;
  background: linear-gradient(135deg, var(--color-primary), #0284c7);
  color: white;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
}

.chat__send-btn svg {
  width: 1.25rem;
  height: 1.25rem;
}

.chat__send-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4);
}

.chat__send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ============================================
   WELCOME STATE
   ============================================ */

.welcome {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1rem;
}

.welcome__icon {
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(168, 85, 247, 0.2));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  animation: pulse 2s ease-in-out infinite;
}

.welcome__text {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.welcome__suggestions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  max-width: 28rem;
}

.suggestion-chip {
  padding: 0.5rem 1rem;
  background: rgba(51, 65, 85, 0.6);
  color: var(--color-text-muted);
  border: 1px solid transparent;
  border-radius: 2rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.3s;
}

.suggestion-chip:hover {
  background: rgba(14, 165, 233, 0.2);
  color: var(--color-primary-light);
  border-color: rgba(14, 165, 233, 0.3);
  transform: scale(1.05);
}

/* ============================================
   MESSAGES
   ============================================ */

.message {
  display: flex;
}

.message--user {
  justify-content: flex-end;
}

.message--bot {
  justify-content: flex-start;
}

.message__bubble {
  max-width: 85%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  line-height: 1.5;
}

.message--user .message__bubble {
  background: linear-gradient(135deg, var(--color-primary), #0284c7);
  color: white;
  border-bottom-right-radius: 0.25rem;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.2);
}

.message--bot .message__bubble {
  background: rgba(51, 65, 85, 0.8);
  color: var(--color-text);
  border-bottom-left-radius: 0.25rem;
}

/* Typing indicator */
.typing-dot {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  background: var(--color-primary);
  border-radius: 50%;
  margin-right: 0.25rem;
  animation: bounce 1.4s ease-in-out infinite;
}

.typing-dot:nth-child(2) { animation-delay: 0.15s; }
.typing-dot:nth-child(3) { animation-delay: 0.3s; margin-right: 0; }

@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-0.5rem); }
}

/* ============================================
   FOOTER
   ============================================ */

.footer {
  margin-top: 1.5rem;
  text-align: center;
  opacity: 0;
  transition: all 0.7s ease-out 0.5s;
}

.footer.is-visible {
  opacity: 1;
}

.footer__social {
  display: inline-block;
  color: var(--color-text-muted);
  transition: all 0.3s;
}

.footer__social svg {
  width: 1.25rem;
  height: 1.25rem;
}

.footer__social:hover {
  color: var(--color-primary);
  transform: scale(1.1);
}

.footer__text {
  color: var(--color-border);
  font-size: 0.75rem;
  margin-top: 0.5rem;
}

/* ============================================
   MODAL
   ============================================ */

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}

.modal {
  position: relative;
  background: var(--color-surface);
  border: 1px solid rgba(51, 65, 85, 0.5);
  border-radius: 1.5rem;
  padding: 1.5rem;
  width: 100%;
  max-width: 28rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.modal__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: color 0.2s;
}

.modal__close svg {
  width: 1.25rem;
  height: 1.25rem;
}

.modal__close:hover {
  color: var(--color-text);
}

.modal__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.modal__subtitle {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.modal__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal__form input,
.modal__form textarea {
  width: 100%;
  background: rgba(51, 65, 85, 0.6);
  color: var(--color-text);
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(71, 85, 105, 0.5);
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s;
}

.modal__form input::placeholder,
.modal__form textarea::placeholder {
  color: var(--color-text-muted);
}

.modal__form input:focus,
.modal__form textarea:focus {
  border-color: rgba(14, 165, 233, 0.5);
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2);
}

.modal__form textarea {
  resize: none;
}

.modal__submit {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, var(--color-primary), #0284c7);
  color: white;
  font-weight: 500;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
}

.modal__submit:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4);
}

.modal__submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal__success {
  margin-top: 1rem;
  color: var(--color-success);
  font-size: 0.875rem;
  text-align: center;
}

.modal__error {
  margin-top: 1rem;
  color: var(--color-error);
  font-size: 0.875rem;
  text-align: center;
}

/* ============================================
   CV FLOATING BUTTON
   ============================================ */

.cv-float {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 50;
}

.cv-float__dropdown {
  position: absolute;
  bottom: 100%;
  right: 0;
  padding-bottom: 0.5rem;
  width: 12rem;
}

.cv-float__dropdown > div {
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(51, 65, 85, 0.5);
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.cv-float__item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
}

.cv-float__item svg {
  width: 1rem;
  height: 1rem;
}

.cv-float__item:hover {
  background: rgba(51, 65, 85, 0.5);
  color: var(--color-text);
}

.cv-float__btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, var(--color-primary), #0284c7);
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
}

.cv-float__btn svg {
  width: 1rem;
  height: 1rem;
}

.cv-float__btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 25px rgba(14, 165, 233, 0.4);
}

/* ============================================
   TRANSITIONS
   ============================================ */

.message-enter-active {
  transition: all 0.4s ease-out;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(1rem);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: scale(0.95);
}

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 640px) {
  .header__title {
    font-size: 2rem;
  }
  
  .chat__messages {
    height: 380px;
  }
}
</style>