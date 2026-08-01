<template>
  <aside class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 hidden md:block">
    <div class="h-full flex flex-col">
      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <template v-if="isApplicant">
          <SidebarLink
            v-for="item in applicantMenu"
            :key="item.name"
            :to="item.to"
            :icon="item.icon"
            :name="item.name"
          />
        </template>
        <template v-else-if="isReviewer">
          <SidebarLink
            v-for="item in reviewerMenu"
            :key="item.name"
            :to="item.to"
            :icon="item.icon"
            :name="item.name"
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
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import {
  HomeIcon,
  DocumentTextIcon,
  FolderOpenIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
} from '@heroicons/vue/24/outline'
import SidebarLink from './SidebarLink.vue'

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
  { name: 'Drafts', to: '/projects?status=draft', icon: DocumentTextIcon },
  { name: 'Submitted', to: '/projects?status=submitted', icon: ClipboardDocumentListIcon },
  { name: 'Revisions', to: '/projects?status=revision', icon: ArrowPathIcon },
  { name: 'History', to: '/history', icon: ClockIcon },
]

const reviewerMenu = [
  { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
  { name: 'Review Queue', to: '/review', icon: ClipboardDocumentListIcon },
  { name: 'Approved', to: '/review?status=approved', icon: CheckCircleIcon },
  { name: 'Rejected', to: '/review?status=rejected', icon: XCircleIcon },
  { name: 'Revisions', to: '/review?status=revision', icon: ArrowPathIcon },
  { name: 'Statistics', to: '/statistics', icon: ChartBarIcon },
]
</script>
