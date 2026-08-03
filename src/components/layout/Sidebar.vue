<template>
  <aside class="w-64 h-full bg-white dark:bg-gray-800 flex flex-col">
    <!-- Close button for mobile -->
    <div class="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">Menu</span>
      <button
        @click="$emit('close')"
        class="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <XMarkIcon class="w-5 h-5" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
      <template v-if="isApplicant">
        <SidebarLink
          v-for="item in applicantMenu"
          :key="item.name"
          :to="item.to"
          :icon="item.icon"
          :name="item.name"
          @click="handleLinkClick"
        />
      </template>
      <template v-else-if="isReviewer">
        <SidebarLink
          v-for="item in reviewerMenu"
          :key="item.name"
          :to="item.to"
          :icon="item.icon"
          :name="item.name"
          @click="handleLinkClick"
        />
      </template>
    </nav>

    <!-- User role badge -->
    <div class="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
        <span class="text-xs font-medium text-gray-600 dark:text-gray-400">
          Role
        </span>
        <span class="text-xs font-semibold px-2 py-1 rounded-full" :class="roleBadgeClass">
          {{ userRoleDisplay }}
        </span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/modules/auth/stores/authStore'
import {
  HomeIcon,
  FolderOpenIcon,
  ClipboardDocumentListIcon,
  XMarkIcon,
  BellIcon,
} from '@heroicons/vue/24/outline'
import SidebarLink from './SidebarLink.vue'

const emit = defineEmits<{
  close: []
}>()

const authStore = useAuthStore()

const isApplicant = computed(() => authStore.isApplicant)
const isReviewer = computed(() => authStore.isReviewer)
const userRole = computed(() => authStore.userRole)

const userRoleDisplay = computed(() => {
  const role = userRole.value
  return role ? `${role.charAt(0).toUpperCase()}${role.slice(1)}` : 'User'
})

const roleBadgeClass = computed(() => {
  if (isApplicant.value) {
    return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
  }
  if (isReviewer.value) {
    return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
  }
  return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
})

const applicantMenu = [
  { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
  { name: 'My Projects', to: '/projects', icon: FolderOpenIcon },
  { name: 'Notifications', to: '/notifications', icon: BellIcon },
]

const reviewerMenu = [
  { name: 'Dashboard', to: '/reviewer-dashboard', icon: HomeIcon },
  { name: 'Review Queue', to: '/projects', icon: ClipboardDocumentListIcon },
  { name: 'Notifications', to: '/notifications', icon: BellIcon },
]

const handleLinkClick = () => {
  // Close sidebar on mobile when clicking a link
  if (window.innerWidth < 1024) {
    emit('close')
  }
}
</script>
