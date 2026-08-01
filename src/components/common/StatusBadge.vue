<template>
  <span
    class="px-3 py-1 text-xs font-medium rounded-full"
    :class="statusClasses"
  >
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { StatusType } from '@/types'

const props = defineProps<{
  status: StatusType
  label?: string
}>()

const defaultLabels: Record<StatusType, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  revision: 'Revision',
  approved: 'Approved',
  rejected: 'Rejected',
  created: 'Created',
}

const statusClasses = computed(() => {
  const classes: Record<StatusType, string> = {
    draft: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    submitted: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    revision: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    approved: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    created: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  }
  return classes[props.status]
})

const label = computed(() => props.label || defaultLabels[props.status])
</script>
