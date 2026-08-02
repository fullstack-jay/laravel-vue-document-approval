import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Notification,
  NotificationStats,
} from '../types/notification'
import { notificationService } from '../services/notificationService'

export const useNotificationStore = defineStore('notification', () => {
  // State
  const notifications = ref<Notification[]>([])
  const stats = ref<NotificationStats>({
    total: 0,
    unread: 0,
    read: 0,
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const unreadNotifications = computed(() =>
    notifications.value.filter((n) => !(n.is_read ?? n.isRead))
  )
  const unreadCount = computed(() => stats.value.unread)

  // Actions
  async function fetchNotifications() {
    loading.value = true
    error.value = null
    try {
      const response = await notificationService.getNotifications()
      notifications.value = response.data
      await fetchStats()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch notifications'
      console.error('Failed to fetch notifications:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchStats() {
    try {
      stats.value = await notificationService.getNotificationStats()
    } catch (err) {
      console.error('Failed to fetch notification stats:', err)
    }
  }

  async function markAsRead(notificationId: number) {
    try {
      const notification = await notificationService.markAsRead(notificationId)
      const index = notifications.value.findIndex((n) => n.id === notificationId)
      if (index !== -1) {
        notifications.value[index] = notification
      }
      await fetchStats()
    } catch (err) {
      console.error('Failed to mark notification as read:', err)
    }
  }

  async function markAllAsRead() {
    try {
      await notificationService.markAllAsRead()
      notifications.value.forEach((n) => {
        n.isRead = true
      })
      await fetchStats()
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err)
    }
  }

  async function deleteNotification(notificationId: number) {
    try {
      await notificationService.deleteNotification(notificationId)
      notifications.value = notifications.value.filter((n) => n.id !== notificationId)
      await fetchStats()
    } catch (err) {
      console.error('Failed to delete notification:', err)
    }
  }

  function addNotification(notification: Notification) {
    notifications.value.unshift(notification)
    fetchStats()
  }

  return {
    notifications,
    stats,
    loading,
    error,
    unreadNotifications,
    unreadCount,
    fetchNotifications,
    fetchStats,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
  }
})
