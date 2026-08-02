import axios from 'axios'
import type { DashboardStats, RecentActivity } from '../types/dashboard'

// Helper function to format time ago
function formatTimeAgo(dateString: string | undefined): string {
  if (!dateString) return 'Just now'

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Just now'

    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  } catch {
    return 'Just now'
  }
}

// Create axios instance for dashboard API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
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
      const response = await api.get('/api/v1/dashboard/stats', {
        params: { _t: Date.now() }, // Cache-busting
      })
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
      const response = await api.get('/api/v1/dashboard/recent-activities', {
        params: { _t: Date.now() }, // Cache-busting
      })
      const activities = response.data.data || response.data.activities || response.data || []

      return activities.map((activity: any) => {
        // Map backend action to frontend type
        let type: 'submitted' | 'approved' | 'revision' | 'rejected' | 'created' = 'created'
        if (activity.action === 'project_submitted' || activity.action === 'document_submitted') {
          type = 'submitted'
        } else if (activity.action === 'project_approved') {
          type = 'approved'
        } else if (activity.action === 'revision_requested') {
          type = 'revision'
        } else if (activity.action === 'project_rejected') {
          type = 'rejected'
        }

        // Extract title from project or action
        const title = activity.project?.title || activity.description || 'Activity'

        return {
          id: activity.id,
          title: title,
          time: formatTimeAgo(activity.created_at || activity.createdAt),
          type: type,
        }
      })
    } catch (error: any) {
      console.error('❌ Failed to fetch recent activities:', error)
      const message = error.response?.data?.message ||
                     error.response?.data?.error ||
                     error.message ||
                     'Failed to fetch recent activities'
      throw new Error(message)
    }
  },

  async getStatusDistribution(): Promise<Array<{ status: string; count: number; percentage: number }>> {
    try {
      const response = await api.get('/api/v1/dashboard/charts/status-distribution', {
        params: { _t: Date.now() }, // Cache-busting
      })
      return response.data.data || response.data || []
    } catch (error: any) {
      console.error('Failed to fetch status distribution:', error)
      return []
    }
  },

  async getMonthlySubmissions(): Promise<Array<{ month: string; count: number }>> {
    try {
      const response = await api.get('/api/v1/dashboard/charts/monthly-submissions', {
        params: { _t: Date.now() }, // Cache-busting
      })
      return response.data.data || response.data || []
    } catch (error: any) {
      console.error('Failed to fetch monthly submissions:', error)
      return []
    }
  },
}
