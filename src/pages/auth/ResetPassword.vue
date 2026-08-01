<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
    <div class="text-center mb-8">
      <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <LockOpenIcon class="w-8 h-8 text-green-600 dark:text-green-400" />
      </div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Reset your password
      </h1>
      <p class="text-gray-500 dark:text-gray-400 mt-2">
        Enter your new password below.
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <AppInput
        v-model="form.password"
        label="New Password"
        type="password"
        placeholder="••••••••"
        required
        hint="Must be at least 8 characters"
      />
      <AppInput
        v-model="form.passwordConfirmation"
        label="Confirm New Password"
        type="password"
        placeholder="••••••••"
        required
        :error="passwordError"
      />
      <AppButton type="submit" :loading="loading" block size="lg">
        Reset Password
      </AppButton>
    </form>

    <p class="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
      <router-link
        to="/login"
        class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
      >
        Back to sign in
      </router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { LockOpenIcon } from '@heroicons/vue/24/outline'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'

const router = useRouter()

const form = ref({
  password: '',
  passwordConfirmation: '',
})

const loading = ref(false)

const passwordError = computed(() => {
  if (form.value.passwordConfirmation && form.value.password !== form.value.passwordConfirmation) {
    return 'Passwords do not match'
  }
  return ''
})

async function handleSubmit() {
  if (passwordError.value) return

  loading.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  loading.value = false

  // Redirect to login
  router.push('/login')
}
</script>
