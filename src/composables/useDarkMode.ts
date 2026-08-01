import { ref, onMounted } from 'vue'

const isDark = ref(false)

export function useDarkMode() {
  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', isDark.value ? 'dark' : 'light')
  }

  const initializeDarkMode = () => {
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode === 'dark' || (!savedDarkMode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      isDark.value = true
      document.documentElement.classList.add('dark')
    } else {
      isDark.value = false
      document.documentElement.classList.remove('dark')
    }
  }

  return {
    isDark,
    toggleDarkMode,
    initializeDarkMode,
  }
}
