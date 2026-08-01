<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-100 dark:border-gray-700 overflow-hidden">
    <div
      v-if="$slots.header || title"
      class="px-6 py-4 border-b border-gray-100 dark:border-gray-700"
    >
      <slot name="header">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {{ title }}
        </h3>
      </slot>
    </div>
    <div :class="bodyClasses">
      <slot />
    </div>
    <div
      v-if="$slots.footer"
      class="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    title?: string
    padding?: 'none' | 'sm' | 'md' | 'lg'
  }>(),
  {
    padding: 'md',
  }
)

const bodyClasses = computed(() => {
  const paddings = {
    none: '',
    sm: 'px-4 py-3 sm:px-6',
    md: 'px-6 py-4',
    lg: 'px-8 py-6',
  }
  return paddings[props.padding]
})
</script>
