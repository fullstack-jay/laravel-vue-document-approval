<template>
  <div class="flex items-start space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
    <div
      :class="[
        'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
        activityIconBgColor,
      ]"
    >
      <component :is="activityIcon" class="w-5 h-5" :class="activityIconColor" />
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
        {{ activity.title }}
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
        {{ activity.time }}
      </p>
    </div>
    <div class="flex-shrink-0">
      <StatusBadge :status="activity.type" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import {
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  PlusIcon,
} from '@heroicons/vue/24/outline'
import StatusBadge from '@/components/common/StatusBadge.vue'
import type { RecentActivity } from '@/modules/dashboard/types/dashboard'

const props = defineProps<{
  activity: RecentActivity
}>()

const activityIcon = computed<Component>(() => {
  const icons: Record<string, Component> = {
    submitted: DocumentTextIcon,
    approved: CheckCircleIcon,
    rejected: XCircleIcon,
    revision: ArrowPathIcon,
    created: PlusIcon,
  }
  return icons[props.activity.type] || DocumentTextIcon
})

const activityIconBgColor = computed(() => {
  const colors: Record<string, string> = {
    submitted: 'bg-blue-100 dark:bg-blue-900/30',
    approved: 'bg-green-100 dark:bg-green-900/30',
    rejected: 'bg-red-100 dark:bg-red-900/30',
    revision: 'bg-orange-100 dark:bg-orange-900/30',
    created: 'bg-gray-100 dark:bg-gray-700',
  }
  return colors[props.activity.type] || colors.created
})

const activityIconColor = computed(() => {
  const colors: Record<string, string> = {
    submitted: 'text-blue-600 dark:text-blue-400',
    approved: 'text-green-600 dark:text-green-400',
    rejected: 'text-red-600 dark:text-red-400',
    revision: 'text-orange-600 dark:text-orange-400',
    created: 'text-gray-600 dark:text-gray-400',
  }
  return colors[props.activity.type] || colors.created
})
</script>
