<template>
  <div class="relative" ref="container">
    <!-- Bell button -->
    <button
      @click="toggleDropdown"
      class="relative p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      :class="{ 'bg-gray-100 dark:bg-gray-700': isOpen }"
    >
      <BellIcon class="w-6 h-6" />

      <!-- Unread badge -->
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs font-semibold rounded-full"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 class="font-semibold text-gray-900 dark:text-white">Notifications</h3>
        <button
          v-if="unreadCount > 0"
          @click="handleMarkAllRead"
          class="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Mark all read
        </button>
      </div>

      <!-- Notification list -->
      <div class="max-h-96 overflow-y-auto">
        <div v-if="loading" class="flex items-center justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>

        <div v-else-if="notifications.length === 0" class="px-4 py-8 text-center">
          <BellIcon class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p class="text-gray-500 dark:text-gray-400">No notifications yet</p>
        </div>

        <div v-else>
          <div
            v-for="notification in notifications.slice(0, 5)"
            :key="notification.id"
            @click="handleNotificationClick(notification)"
            class="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            :class="{ 'bg-blue-50/50 dark:bg-blue-900/10': !notification.isRead }"
          >
            <!-- Icon -->
            <div
              class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
              :class="iconClass(notification.category)"
            >
              <component :is="getIcon(notification.category)" class="w-5 h-5" />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <p
                  class="text-sm font-medium text-gray-900 dark:text-white"
                  :class="{ 'font-semibold': !notification.isRead }"
                >
                  {{ notification.title }}
                </p>
                <span
                  v-if="!notification.isRead"
                  class="flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full mt-1.5"
                ></span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">
                {{ notification.message }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {{ formatTime(notification.createdAt) }}
              </p>
            </div>
          </div>

          <!-- View all link -->
          <div
            v-if="notifications.length > 5"
            @click="goToNotifications"
            class="px-4 py-3 text-center text-sm text-primary-600 hover:text-primary-700 font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            View all notifications
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
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
} from '@heroicons/vue/24/outline'

const router = useRouter()
const notificationStore = useNotificationStore()
const authStore = useAuthStore()

const isOpen = ref(false)
const container = ref<HTMLElement>()

const notifications = computed(() => notificationStore.notifications)
const unreadCount = computed(() => notificationStore.unreadCount)
const loading = computed(() => notificationStore.loading)

function toggleDropdown() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    notificationStore.fetchNotifications()
  }
}

function closeDropdown() {
  isOpen.value = false
}

async function handleMarkAllRead() {
  await notificationStore.markAllAsRead()
}

async function handleNotificationClick(notification: any) {
  if (!notification.isRead) {
    await notificationStore.markAsRead(notification.id)
  }

  // Navigate to project detail if data contains projectId
  if (notification.data?.projectId) {
    const isReviewer = authStore.isReviewer
    router.push(isReviewer ? `/projects/${notification.data.projectId}/review` : `/projects/${notification.data.projectId}`)
  }

  closeDropdown()
}

function goToNotifications() {
  router.push('/notifications')
  closeDropdown()
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

function formatTime(dateString: string) {
  const date = new Date(dateString)
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
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  if (container.value && !container.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  notificationStore.fetchStats()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
