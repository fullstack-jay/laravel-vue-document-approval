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
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function fetchDashboardStats(role: 'applicant' | 'reviewer') {
    loading.value = true
    error.value = null
    try {
      const [statsData, activitiesData] = await Promise.all([
        dashboardService.getStats(role),
        dashboardService.getRecentActivities(role),
      ])

      stats.value = statsData
      recentActivities.value = activitiesData
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
    error.value = null
  }

  return {
    stats,
    recentActivities,
    loading,
    error,
    fetchDashboardStats,
    clearDashboard,
  }
})
