import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/main.css'
import { useAuthStore } from './modules/auth/stores/authStore'
import { useDarkMode } from './composables/useDarkMode'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize auth state from localStorage
const authStore = useAuthStore()
authStore.initializeAuth()

// Initialize dark mode from localStorage
const { initializeDarkMode } = useDarkMode()
initializeDarkMode()

app.mount('#app')
