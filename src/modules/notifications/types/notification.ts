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
  title: string
  message: string
  category: NotificationCategory
  type: NotificationType
  isRead: boolean
  data?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface NotificationStats {
  total: number
  unread: number
  read: number
}
