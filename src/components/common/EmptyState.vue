<template>
  <div class="text-center py-12 px-4">
    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
      <component :is="iconComponent" class="w-8 h-8 text-gray-400 dark:text-gray-600" />
    </div>
    <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
      {{ title }}
    </h3>
    <p class="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
      {{ description }}
    </p>
    <slot name="action">
      <AppButton v-if="actionText" :variant="variant" @click="$emit('action')">
        {{ actionText }}
      </AppButton>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  DocumentTextIcon,
  FolderOpenIcon,
  InboxIcon,
  MagnifyingGlassIcon,
} from '@heroicons/vue/24/outline'
import AppButton from './AppButton.vue'

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    actionText?: string
    variant?: 'primary' | 'secondary'
    icon?: 'document' | 'folder' | 'inbox' | 'search'
  }>(),
  {
    title: 'No data found',
    description: 'There are no items to display at the moment.',
    variant: 'primary',
    icon: 'inbox',
  }
)

defineEmits<{
  (e: 'action'): void
}>()

const iconComponent = computed(() => {
  const icons = {
    document: DocumentTextIcon,
    folder: FolderOpenIcon,
    inbox: InboxIcon,
    search: MagnifyingGlassIcon,
  }
  return icons[props.icon]
})
</script>
