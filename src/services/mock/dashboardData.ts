import type { DashboardStats, RecentActivity } from '@/modules/dashboard/types/dashboard'

export const mockApplicantStats: DashboardStats = {
  totalProjects: 24,
  draft: 5,
  submitted: 8,
  approved: 7,
  revisions: 3,
  rejected: 1,
}

export const mockReviewerStats: DashboardStats = {
  totalProjects: 156,
  draft: 0,
  submitted: 23,
  approved: 98,
  revisions: 12,
  rejected: 23,
}

export const mockApplicantActivities: RecentActivity[] = [
  { id: 1, title: 'Application Submitted - Project A', time: '2 hours ago', type: 'submitted' },
  { id: 2, title: 'Document Approved - Project B', time: '1 day ago', type: 'approved' },
  { id: 3, title: 'Revision Requested - Project C', time: '2 days ago', type: 'revision' },
  { id: 4, title: 'Draft Created - Project D', time: '3 days ago', type: 'created' },
  { id: 5, title: 'Application Approved - Project E', time: '1 week ago', type: 'approved' },
]

export const mockReviewerActivities: RecentActivity[] = [
  { id: 1, title: 'Approved Application from John Doe', time: '1 hour ago', type: 'approved' },
  { id: 2, title: 'Requested Revision for Project X', time: '3 hours ago', type: 'revision' },
  { id: 3, title: 'Rejected Application from Jane Smith', time: '5 hours ago', type: 'rejected' },
  { id: 4, title: 'Approved Application from Bob Wilson', time: '1 day ago', type: 'approved' },
  { id: 5, title: 'New Submission from Alice Brown', time: '2 days ago', type: 'submitted' },
]
