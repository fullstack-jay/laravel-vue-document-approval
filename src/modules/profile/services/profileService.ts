import axios from 'axios'
import type { UserProfile, ProfileFormData, PasswordChangeData } from '../types/profile'

// Create axios instance for profile API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  timeout: 15000, // Longer timeout for file uploads
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
      localStorage.removeItem('access_token')
      localStorage.removeItem('user_data')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

/**
 * Profile Service - Handles profile-related operations
 * Connected to Laravel backend API
 */
export const profileService = {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await api.get('/api/v1/profile')
      const data = response.data.data || response.data

      return {
        id: data.id?.toString() || '',
        name: data.name || '',
        email: data.email || '',
        nip: data.nip || '',
        phone: data.phone || '',
        role: data.role || 'applicant',
        avatar: data.avatar || '',
        department: data.department || '',
        position: data.position || '',
        bio: data.bio || '',
        createdAt: data.created_at || data.createdAt || '',
        updatedAt: data.updated_at || data.updatedAt || '',
      }
    } catch (error: any) {
      const message = error.response?.data?.message ||
                     error.response?.data?.error ||
                     error.message ||
                     'Failed to fetch profile'
      throw new Error(message)
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(data: ProfileFormData): Promise<UserProfile> {
    try {
      const response = await api.put('/api/v1/profile', data)
      const responseData = response.data.data || response.data

      return {
        id: responseData.id?.toString() || '',
        name: responseData.name || '',
        email: responseData.email || '',
        nip: responseData.nip || '',
        phone: responseData.phone || '',
        role: responseData.role || 'applicant',
        avatar: responseData.avatar || '',
        department: responseData.department || '',
        position: responseData.position || '',
        bio: responseData.bio || '',
        createdAt: responseData.created_at || responseData.createdAt || '',
        updatedAt: responseData.updated_at || responseData.updatedAt || '',
      }
    } catch (error: any) {
      const message = error.response?.data?.message ||
                     error.response?.data?.error ||
                     error.message ||
                     'Failed to update profile'
      throw new Error(message)
    }
  },

  /**
   * Change password
   */
  async changePassword(data: PasswordChangeData): Promise<void> {
    try {
      await api.put('/api/v1/profile/password', {
        current_password: data.currentPassword,
        password: data.newPassword,
        password_confirmation: data.confirmPassword,
      })
    } catch (error: any) {
      const message = error.response?.data?.message ||
                     error.response?.data?.error ||
                     error.message ||
                     'Failed to change password'
      throw new Error(message)
    }
  },

  /**
   * Upload avatar
   */
  async uploadAvatar(file: File): Promise<string> {
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await api.post('/api/v1/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return response.data.data?.avatar || response.data.avatar || ''
    } catch (error: any) {
      const message = error.response?.data?.message ||
                     error.response?.data?.error ||
                     error.message ||
                     'Failed to upload avatar'
      throw new Error(message)
    }
  },
}
