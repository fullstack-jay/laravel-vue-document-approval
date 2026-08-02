import axios from 'axios'
import type {
  Notification,
  NotificationStats,
} from '../types/notification'

// Create axios instance for notification API calls
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
      localStorage.removeItem('access_token')
      localStorage.removeItem('user_data')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const notificationService = {
  async getNotifications(page: number = 1, perPage: number = 20): Promise<{
    data: Notification[]
    meta: {
      currentPage: number
      perPage: number
      total: number
      lastPage: number
    }
  }> {
    try {
      const response = await api.get('/api/v1/notifications', {
        params: {
          page,
          per_page: perPage,
        },
      })

      return {
        data: response.data.data || response.data.notifications || [],
        meta: {
          currentPage: response.data.meta?.current_page || 1,
          perPage: response.data.meta?.per_page || perPage,
          total: response.data.meta?.total || 0,
          lastPage: response.data.meta?.last_page || 1,
        },
      }
    } catch (error: any) {
      const message = error.response?.data?.message ||
                     error.response?.data?.error ||
                     error.message ||
                     'Failed to fetch notifications'
      throw new Error(message)
    }
  },

  async getNotificationStats(): Promise<NotificationStats> {
    try {
      const response = await api.get('/api/v1/notifications/stats')
      const data = response.data.data || response.data

      return {
        total: data.total || 0,
        unread: data.unread || 0,
        read: data.read || 0,
      }
    } catch (error: any) {
      const message = error.response?.data?.message ||
                     error.response?.data?.error ||
                     error.message ||
                     'Failed to fetch notification stats'
      throw new Error(message)
    }
  },

  async markAsRead(notificationId: number): Promise<Notification> {
    try {
      const response = await api.put(`/api/v1/notifications/${notificationId}/read`)
      return response.data.data || response.data
    } catch (error: any) {
      const message = error.response?.data?.message ||
                     error.response?.data?.error ||
                     error.message ||
                     'Failed to mark notification as read'
      throw new Error(message)
    }
  },

  async markAllAsRead(): Promise<void> {
    try {
      await api.put('/api/v1/notifications/read-all')
    } catch (error: any) {
      const message = error.response?.data?.message ||
                     error.response?.data?.error ||
                     error.message ||
                     'Failed to mark all notifications as read'
      throw new Error(message)
    }
  },

  async deleteNotification(notificationId: number): Promise<void> {
    try {
      await api.delete(`/api/v1/notifications/${notificationId}`)
    } catch (error: any) {
      const message = error.response?.data?.message ||
                     error.response?.data?.error ||
                     error.message ||
                     'Failed to delete notification'
      throw new Error(message)
    }
  },
}
