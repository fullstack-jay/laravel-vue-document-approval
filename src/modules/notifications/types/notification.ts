export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export type NotificationCategory =
  | 'submission_success'
  | 'revision_requested'
  | 'application_approved'
  | 'application_rejected'
  | 'new_submission'
  | 'resubmission'
  | 'system'

export interface Notification {
  id: number
  userId: number
  user_id?: number // Backend uses snake_case
  title: string
  message: string
  category: NotificationCategory
  type: NotificationType
  isRead: boolean
  is_read?: boolean // Backend uses snake_case
  data?: Record<string, any>
  createdAt: string
  created_at?: string // Backend uses snake_case
  updatedAt: string
  updated_at?: string // Backend uses snake_case
}

export interface NotificationStats {
  total: number
  unread: number
  read: number
}
