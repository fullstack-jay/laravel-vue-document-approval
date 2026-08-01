<template>
  <div class="animate-pulse">
    <div
      :class="[
        'rounded',
        variant === 'circular' ? 'rounded-full' : 'rounded-lg',
        widthClass,
        heightClass,
        bgClass,
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    width?: string
    height?: string
    variant?: 'rectangular' | 'circular'
    bgColor?: 'light' | 'dark'
  }>(),
  {
    width: '100%',
    height: '1rem',
    variant: 'rectangular',
    bgColor: 'light',
  }
)

const widthClass = computed(() => {
  if (props.width === '100%') return 'w-full'
  return `w-[${props.width}]`
})

const heightClass = computed(() => {
  if (props.height === '1rem') return 'h-4'
  if (props.height === '2rem') return 'h-8'
  return `h-[${props.height}]`
})

const bgClass = computed(() => {
  return props.bgColor === 'light'
    ? 'bg-gray-200 dark:bg-gray-700'
    : 'bg-gray-300 dark:bg-gray-600'
})
</script>
