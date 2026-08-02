<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
    <div class="text-center mb-8">
      <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <KeyIcon class="w-8 h-8 text-primary-600 dark:text-primary-400" />
      </div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Forgot your password?
      </h1>
      <p class="text-gray-500 dark:text-gray-400 mt-2">
        Enter your email address and we'll send you a link to reset your password.
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <AppInput
        v-model="form.email"
        label="Email Address"
        type="email"
        placeholder="your@email.com"
        required
      />
      <AppButton type="submit" :loading="loading" block size="lg">
        Send Reset Link
      </AppButton>
    </form>

    <p class="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
      Remember your password?
      <router-link
        to="/login"
        class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
      >
        Sign in
      </router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { KeyIcon } from '@heroicons/vue/24/outline'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import { showSuccessAlert } from '@/composables/useSweetAlert'

const form = ref({
  email: '',
})

const loading = ref(false)

async function handleSubmit() {
  loading.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  loading.value = false
  // Show success message
  await showSuccessAlert('Check Your Email', 'If an account exists with this email, a reset link has been sent.')
}
</script>
