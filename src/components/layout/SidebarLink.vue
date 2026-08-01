<template>
  <router-link
    :to="to"
    class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
    :class="isActive ? activeClasses : inactiveClasses"
    @click="$emit('click')"
  >
    <component :is="icon" class="w-5 h-5 mr-3 flex-shrink-0" />
    <span class="truncate">{{ name }}</span>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Component } from 'vue'

const props = defineProps<{
  to: string
  icon: Component
  name: string
}>()

defineEmits<{
  click: []
}>()

const route = useRoute()

const isActive = computed(() => {
  if (props.to === '/dashboard' && route.path === '/reviewer-dashboard') {
    return true
  }
  return route.path === props.to || route.path.startsWith(props.to + '?')
})

const activeClasses = 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
const inactiveClasses = 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
</script>
