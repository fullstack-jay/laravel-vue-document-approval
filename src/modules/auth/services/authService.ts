import axios from 'axios'
import type { User, LoginCredentials, RegisterData, AuthResponse } from '../types/auth'

// Create axios instance for API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear local storage
      localStorage.removeItem('access_token')
      localStorage.removeItem('user_data')
      // Redirect to login (but don't do it here to avoid circular dependency)
    }
    return Promise.reject(error)
  }
)

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/api/v1/auth/login', credentials)

      // Laravel Sanctum typically returns:
      // { user: {...}, token: "..." } or similar structure
      const { data } = response

      // Handle different response formats
      const user = data.user || data.data?.user || data
      const token = data.token || data.access_token || data.data?.token

      if (!user || !token) {
        throw new Error('Invalid response format from server')
      }

      return {
        user,
        token,
      }
    } catch (error: any) {
      // Handle different error formats
      const message = error.response?.data?.message ||
                     error.response?.data?.error ||
                     error.message ||
                     'Login failed'
      throw new Error(message)
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post('/api/v1/auth/register', data)
      const { responseData } = response

      return {
        user: responseData.user,
        token: responseData.token || responseData.access_token,
      }
    } catch (error: any) {
      const message = error.response?.data?.message ||
                     error.response?.data?.error ||
                     error.message ||
                     'Registration failed'
      throw new Error(message)
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/api/v1/auth/logout')
    } catch (error: any) {
      console.error('Logout error:', error)
      // Continue with local cleanup even if API call fails
    } finally {
      // Clear tokens (handled by store, but ensure cleanup)
      localStorage.removeItem('access_token')
      localStorage.removeItem('user_data')
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get('/api/v1/auth/me')
      return response.data.data || response.data.user || response.data
    } catch (error: any) {
      console.error('Failed to fetch current user:', error)

      // Fallback to localStorage if API fails
      const storedUser = localStorage.getItem('user_data')
      if (storedUser) {
        try {
          return JSON.parse(storedUser)
        } catch (e) {
          console.error('Failed to parse stored user:', e)
        }
      }

      throw error
    }
  },

  async forgotPassword(email: string): Promise<void> {
    try {
      await api.post('/api/v1/auth/forgot-password', { email })
    } catch (error: any) {
      const message = error.response?.data?.message ||
                     error.response?.data?.error ||
                     error.message ||
                     'Failed to send reset link'
      throw new Error(message)
    }
  },

  async resetPassword(data: { token: string; email: string; password: string; password_confirmation: string }): Promise<void> {
    try {
      await api.post('/api/v1/auth/reset-password', data)
    } catch (error: any) {
      const message = error.response?.data?.message ||
                     error.response?.data?.error ||
                     error.message ||
                     'Failed to reset password'
      throw new Error(message)
    }
  },
}
