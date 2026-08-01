<template>
  <component :is="layoutComponent">
    <component :is="routeComponent" />
  </component>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AppLayout from '@/layouts/AppLayout.vue'

const route = useRoute()
const router = useRouter()

// Get the current route component
const routeComponent = computed(() => {
  return router.currentRoute.value.matched[router.currentRoute.value.matched.length - 1]?.components?.default
})

// Get the layout component
const layoutComponent = computed(() => {
  const layoutName = route.meta.layout || 'AppLayout'

  if (layoutName === 'AuthLayout') {
    return AuthLayout
  }

  return AppLayout
})
</script>
