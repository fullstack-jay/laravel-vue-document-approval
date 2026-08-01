import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials, RegisterData } from '@/modules/auth/types/auth'
import { authService } from '@/modules/auth/services/authService'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('access_token'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => user.value?.role || null)
  const isApplicant = computed(() => userRole.value === 'applicant')
  const isReviewer = computed(() => userRole.value === 'reviewer')
  const isAdmin = computed(() => userRole.value === 'admin')

  // Actions
  async function login(credentials: LoginCredentials) {
    loading.value = true
    error.value = null
    try {
      const response = await authService.login(credentials)
      user.value = response.user
      token.value = response.token
      localStorage.setItem('access_token', response.token)
      return response
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(data: RegisterData) {
    loading.value = true
    error.value = null
    try {
      const response = await authService.register(data)
      user.value = response.user
      token.value = response.token
      localStorage.setItem('access_token', response.token)
      return response
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    try {
      await authService.logout()
    } finally {
      user.value = null
      token.value = null
      localStorage.removeItem('access_token')
      loading.value = false
    }
  }

  async function fetchUser() {
    if (!token.value) return

    loading.value = true
    try {
      user.value = await authService.getCurrentUser(token.value)
    } catch (err: any) {
      error.value = err.message
      // If token is invalid, clear it
      if (err.message?.includes('token') || err.message?.includes('auth')) {
        token.value = null
        localStorage.removeItem('access_token')
      }
    } finally {
      loading.value = false
    }
  }

  function initializeAuth() {
    const storedToken = localStorage.getItem('access_token')
    if (storedToken) {
      token.value = storedToken
      fetchUser()
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    userRole,
    isApplicant,
    isReviewer,
    isAdmin,
    login,
    register,
    logout,
    fetchUser,
    initializeAuth,
  }
})
