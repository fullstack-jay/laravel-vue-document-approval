import type { DashboardStats, RecentActivity } from '../types/dashboard'
import {
  mockApplicantStats,
  mockReviewerStats,
  mockApplicantActivities,
  mockReviewerActivities,
} from '@/services/mock/dashboardData'

export const dashboardService = {
  async getStats(role: 'applicant' | 'reviewer'): Promise<DashboardStats> {
    await new Promise(resolve => setTimeout(resolve, 500))

    return role === 'applicant' ? mockApplicantStats : mockReviewerStats
  },

  async getRecentActivities(role: 'applicant' | 'reviewer'): Promise<RecentActivity[]> {
    await new Promise(resolve => setTimeout(resolve, 300))

    return role === 'applicant' ? mockApplicantActivities : mockReviewerActivities
  },
}
