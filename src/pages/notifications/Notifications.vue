<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Stay updated with your application status
        </p>
      </div>
      <button
        v-if="stats.unread > 0"
        @click="handleMarkAllRead"
        class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
      >
        Mark all as read
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stats.total }}</p>
          </div>
          <div class="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <BellIcon class="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Unread</p>
            <p class="text-2xl font-bold text-primary-600 mt-1">{{ stats.unread }}</p>
          </div>
          <div class="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
            <EnvelopeIcon class="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Read</p>
            <p class="text-2xl font-bold text-green-600 mt-1">{{ stats.read }}</p>
          </div>
          <div class="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <CheckCircleIcon class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- Notifications list -->
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <!-- Loading state -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>

      <!-- Empty state -->
      <div v-else-if="notifications.length === 0" class="px-6 py-12 text-center">
        <BellIcon class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No notifications</h3>
        <p class="text-gray-600 dark:text-gray-400">You're all caught up!</p>
      </div>

      <!-- List -->
      <div v-else>
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="flex items-start gap-4 px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
          :class="{ 'bg-blue-50/50 dark:bg-blue-900/10': !(notification.is_read ?? notification.isRead) }"
        >
          <!-- Icon -->
          <div
            class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
            :class="iconClass(notification.category)"
          >
            <component :is="getIcon(notification.category)" class="w-6 h-6" />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-3">
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <h3
                    class="text-base font-semibold text-gray-900 dark:text-white"
                    :class="{ 'font-bold': !(notification.is_read ?? notification.isRead) }"
                  >
                    {{ notification.title }}
                  </h3>
                  <span
                    v-if="!(notification.is_read ?? notification.isRead)"
                    class="flex-shrink-0 px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 rounded-full dark:bg-primary-900/50 dark:text-primary-300"
                  >
                    New
                  </span>
                </div>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {{ notification.message }}
                </p>
                <p class="mt-2 text-xs text-gray-500 dark:text-gray-500">
                  {{ formatDateTime(notification.created_at || notification.createdAt) }}
                </p>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2">
                <button
                  v-if="!(notification.is_read ?? notification.isRead)"
                  @click="handleMarkAsRead(notification.id)"
                  class="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  title="Mark as read"
                >
                  <CheckIcon class="w-5 h-5" />
                </button>
                <button
                  @click="handleDelete(notification.id)"
                  class="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <TrashIcon class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- Action button for project-related notifications -->
            <div
              v-if="notification.data?.projectId"
              class="mt-3"
            >
              <button
                @click="goToProject(notification.data.projectId)"
                class="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                <DocumentTextIcon class="w-4 h-4" />
                View Project
                <ArrowRightIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/modules/notifications/stores/notificationStore'
import { useAuthStore } from '@/modules/auth/stores/authStore'
import {
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  DocumentIcon,
  CheckIcon,
  TrashIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  EnvelopeIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const notificationStore = useNotificationStore()
const authStore = useAuthStore()

const notifications = computed(() => notificationStore.notifications)
const stats = computed(() => notificationStore.stats)
const loading = computed(() => notificationStore.loading)

onMounted(() => {
  notificationStore.fetchNotifications()
})

async function handleMarkAsRead(notificationId: number) {
  await notificationStore.markAsRead(notificationId)
}

async function handleMarkAllRead() {
  await notificationStore.markAllAsRead()
}

async function handleDelete(notificationId: number) {
  if (confirm('Are you sure you want to delete this notification?')) {
    await notificationStore.deleteNotification(notificationId)
  }
}

function goToProject(projectId: number) {
  const isReviewer = authStore.isReviewer
  router.push(isReviewer ? `/projects/${projectId}/review` : `/projects/${projectId}`)
}

function getIcon(category: string) {
  const icons: Record<string, any> = {
    submission_success: CheckCircleIcon,
    application_approved: CheckCircleIcon,
    revision_requested: ExclamationTriangleIcon,
    application_rejected: XCircleIcon,
    new_submission: DocumentIcon,
    resubmission: DocumentIcon,
    system: InformationCircleIcon,
  }
  return icons[category] || InformationCircleIcon
}

function iconClass(category: string) {
  const classes: Record<string, string> = {
    submission_success: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    application_approved: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    revision_requested: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    application_rejected: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    new_submission: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    resubmission: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    system: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  }
  return classes[category] || classes.system
}

function formatDateTime(dateString: string) {
  if (!dateString) return 'Invalid Date'

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'

    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays === 1) return 'Yesterday at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return 'Invalid Date'
  }
}
</script>
