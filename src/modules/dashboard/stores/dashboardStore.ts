import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DashboardStats, RecentActivity } from '@/modules/dashboard/types/dashboard'
import { dashboardService } from '@/modules/dashboard/services/dashboardService'

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const stats = ref<DashboardStats>({
    totalProjects: 0,
    draft: 0,
    submitted: 0,
    approved: 0,
    revisions: 0,
    rejected: 0,
  })

  const recentActivities = ref<RecentActivity[]>([])
  const monthlySubmissions = ref<Array<{ month: string; count: number }>>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function fetchDashboardStats() {
    loading.value = true
    error.value = null
    try {
      const [statsData, activitiesData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentActivities(),
      ])

      stats.value = statsData
      recentActivities.value = activitiesData

      // Try to fetch monthly submissions separately (it might fail if backend doesn't support it yet)
      try {
        monthlySubmissions.value = await dashboardService.getMonthlySubmissions()
      } catch {
        // Use mock data if backend endpoint fails
        monthlySubmissions.value = [
          { month: 'Jan', count: 0 },
          { month: 'Feb', count: 0 },
          { month: 'Mar', count: 0 },
          { month: 'Apr', count: 0 },
          { month: 'May', count: 0 },
          { month: 'Jun', count: 0 },
        ]
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch dashboard data'
    } finally {
      loading.value = false
    }
  }

  function clearDashboard() {
    stats.value = {
      totalProjects: 0,
      draft: 0,
      submitted: 0,
      approved: 0,
      revisions: 0,
      rejected: 0,
    }
    recentActivities.value = []
    monthlySubmissions.value = []
    error.value = null
  }

  return {
    stats,
    recentActivities,
    monthlySubmissions,
    loading,
    error,
    fetchDashboardStats,
    clearDashboard,
  }
})
