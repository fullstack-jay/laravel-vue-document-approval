<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 border border-gray-100 dark:border-gray-700 transition-all hover:shadow-soft">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ title }}</p>
        <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
          {{ formattedValue }}
        </p>
        <div v-if="change !== undefined" class="mt-3 flex items-center text-sm">
          <span
            :class="[
              'flex items-center font-medium',
              changeType === 'positive' ? 'text-green-600 dark:text-green-400' : '',
              changeType === 'negative' ? 'text-red-600 dark:text-red-400' : '',
              changeType === 'neutral' ? 'text-gray-500 dark:text-gray-400' : '',
            ]"
          >
            <ChevronUpIcon v-if="changeType === 'positive'" class="w-4 h-4 mr-1" />
            <ChevronDownIcon v-else-if="changeType === 'negative'" class="w-4 h-4 mr-1" />
            <MinusIcon v-else class="w-4 h-4 mr-1" />
            {{ change }}
          </span>
          <span class="text-gray-500 dark:text-gray-400 ml-2">vs last month</span>
        </div>
      </div>
      <div
        :class="[
          'p-4 rounded-xl flex-shrink-0 ml-4',
          iconBgColor,
        ]"
      >
        <component :is="currentIcon" class="w-6 h-6" :class="iconColor" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import {
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  FolderIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  MinusIcon,
} from '@heroicons/vue/24/outline'

const props = withDefaults(
  defineProps<{
    title: string
    value: number
    icon?: Component | string
    iconBgColor?: string
    iconColor?: string
    change?: string
    changeType?: 'positive' | 'negative' | 'neutral'
  }>(),
  {
    iconBgColor: 'bg-primary-50 dark:bg-primary-900/20',
    iconColor: 'text-primary-600 dark:text-primary-400',
    changeType: 'neutral',
    icon: DocumentTextIcon,
  }
)

// Map icon name string to component
const currentIcon = computed(() => {
  if (typeof props.icon === 'string') {
    const icons: Record<string, Component> = {
      document: DocumentTextIcon,
      check: CheckCircleIcon,
      close: XCircleIcon,
      clock: ClockIcon,
      refresh: ArrowPathIcon,
      folder: FolderIcon,
    }
    return icons[props.icon] || DocumentTextIcon
  }
  return props.icon as Component
})

const formattedValue = computed(() => {
  return props.value.toLocaleString()
})
</script>
