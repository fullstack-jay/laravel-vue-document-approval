import axios from 'axios'
import type { DashboardStats, RecentActivity } from '../types/dashboard'

// Create axios instance for dashboard API calls
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

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    try {
      const response = await api.get('/api/v1/dashboard/stats')
      const data = response.data.data || response.data

      return {
        totalProjects: data.total_projects || data.totalProjects || 0,
        draft: data.draft || 0,
        submitted: data.submitted || 0,
        approved: data.approved || 0,
        revisions: data.revisions || data.revision || 0,
        rejected: data.rejected || 0,
      }
    } catch (error: any) {
      const message = error.response?.data?.message ||
                     error.response?.data?.error ||
                     error.message ||
                     'Failed to fetch dashboard stats'
      throw new Error(message)
    }
  },

  async getRecentActivities(): Promise<RecentActivity[]> {
    try {
      const response = await api.get('/api/v1/dashboard/recent-activities')
      const activities = response.data.data || response.data.activities || response.data || []

      return activities.map((activity: any) => ({
        id: activity.id,
        title: activity.title,
        description: activity.description,
        type: activity.type,
        createdAt: activity.created_at || activity.createdAt,
        projectId: activity.project_id || activity.projectId,
      }))
    } catch (error: any) {
      const message = error.response?.data?.message ||
                     error.response?.data?.error ||
                     error.message ||
                     'Failed to fetch recent activities'
      throw new Error(message)
    }
  },

  async getStatusDistribution(): Promise<Array<{ status: string; count: number; percentage: number }>> {
    try {
      const response = await api.get('/api/v1/dashboard/charts/status-distribution')
      return response.data.data || response.data || []
    } catch (error: any) {
      console.error('Failed to fetch status distribution:', error)
      return []
    }
  },

  async getMonthlySubmissions(): Promise<Array<{ month: string; count: number }>> {
    try {
      const response = await api.get('/api/v1/dashboard/charts/monthly-submissions')
      return response.data.data || response.data || []
    } catch (error: any) {
      console.error('Failed to fetch monthly submissions:', error)
      return []
    }
  },
}
