export interface DashboardStats {
  totalProjects: number
  draft: number
  submitted: number
  approved: number
  revisions: number
  rejected: number
}

export interface RecentActivity {
  id: number
  title: string
  time: string
  type: 'submitted' | 'approved' | 'revision' | 'rejected' | 'created'
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
  }[]
}

export interface StatCard {
  key: string
  title: string
  value: number
  icon: string
  iconClass: string
  change?: string
  changeType?: 'positive' | 'negative'
}
