<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="text-center">
      <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-6">
        <ExclamationTriangleIcon class="w-12 h-12 text-primary-600 dark:text-primary-400" />
      </div>
      <h1 class="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">404</h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">
        Page not found
      </p>
      <p class="text-gray-500 dark:text-gray-500 mb-8 max-w-md mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <AppButton variant="primary" size="lg" @click="$router.push('/dashboard')">
          <HomeIcon class="w-5 h-5 mr-2" />
          Go to Dashboard
        </AppButton>
        <AppButton variant="secondary" size="lg" @click="$router.back()">
          <ArrowLeftIcon class="w-5 h-5 mr-2" />
          Go Back
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon, HomeIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline'
import AppButton from '@/components/common/AppButton.vue'
</script>
