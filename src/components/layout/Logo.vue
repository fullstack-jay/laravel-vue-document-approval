<template>
  <div class="inline-flex items-center space-x-3">
    <div class="relative">
      <!-- Logo image with spinning animation when loading -->
      <img
        :src="logoImage"
        alt="Logo"
        :class="['h-10 w-10 rounded-lg object-cover', loadingClass]"
      />
      <!-- Spinner overlay when loading -->
      <div
        v-if="showSpinner"
        class="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg"
      >
        <svg
          class="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    </div>
    <span class="text-2xl font-bold text-gray-900 dark:text-gray-100">
      DocApproval
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import logoImage from '@/assets/images/logo-klh.webp'

const props = withDefaults(
  defineProps<{
    loading?: boolean
  }>(),
  {
    loading: false,
  }
)

const showSpinner = computed(() => props.loading)
const loadingClass = computed(() => props.loading ? 'animate-pulse opacity-70' : '')
</script>
