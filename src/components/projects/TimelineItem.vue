<template>
  <div class="flex items-start space-x-4">
    <!-- Icon -->
    <div class="flex-shrink-0">
      <div
        class="w-10 h-10 rounded-full flex items-center justify-center"
        :class="bgClass"
      >
        <CheckIcon v-if="isSuccess" class="h-5 w-5 text-green-600" />
        <XMarkIcon v-else-if="isError" class="h-5 w-5 text-red-600" />
        <ClockIcon v-else class="h-5 w-5 text-gray-400" />
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-gray-900 dark:text-white">
        {{ label }}
      </p>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {{ formatDate(date) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CheckIcon, XMarkIcon, ClockIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  label: string
  date: string
  isFirst?: boolean
  isSuccess?: boolean
  isError?: boolean
}>()

const bgClass = computed(() => {
  if (props.isSuccess) return 'bg-green-100 dark:bg-green-900/30'
  if (props.isError) return 'bg-red-100 dark:bg-red-900/30'
  return 'bg-gray-100 dark:bg-gray-700'
})

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString()
}
</script>
