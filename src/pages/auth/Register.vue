<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Create an account
      </h1>
      <p class="text-gray-500 dark:text-gray-400 mt-2">
        Sign up to get started with Document Approval
      </p>
    </div>

    <!-- Error message -->
    <div
      v-if="errorMessage"
      class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
    >
      <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
    </div>

    <form @submit.prevent="handleRegister" class="space-y-6">
      <AppInput
        v-model="form.name"
        label="Full Name"
        type="text"
        placeholder="John Doe"
        required
        autocomplete="name"
      />
      <AppInput
        v-model="form.email"
        label="Email Address"
        type="email"
        placeholder="your@email.com"
        required
        autocomplete="email"
      />
      <AppInput
        v-model="form.password"
        label="Password"
        type="password"
        placeholder="••••••••"
        required
        autocomplete="new-password"
        hint="Must be at least 8 characters"
      />
      <AppInput
        v-model="form.passwordConfirmation"
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        required
        autocomplete="new-password"
        :error="passwordError"
      />
      <div class="flex items-center">
        <input
          v-model="form.agreeToTerms"
          type="checkbox"
          id="terms"
          required
          class="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:bg-gray-700"
        />
        <label for="terms" class="ml-2 text-sm text-gray-600 dark:text-gray-400">
          I agree to the
          <a href="#" class="text-primary-600 hover:text-primary-700 dark:text-primary-400">
            Terms of Service
          </a>
          and
          <a href="#" class="text-primary-600 hover:text-primary-700 dark:text-primary-400">
            Privacy Policy
          </a>
        </label>
      </div>
      <AppButton type="submit" :loading="loading" block size="lg">
        Create Account
      </AppButton>
    </form>

    <p class="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
      Already have an account?
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
import { ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/authStore'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import { showSuccessAlert, showErrorAlert } from '@/composables/useSweetAlert'

const router = useRouter()
const authStore = useAuthStore()

// Inject setLoading from parent layout
const setLoading = inject<(value: boolean) => void>('setLoading', () => {})

const form = ref({
  name: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  role: 'applicant' as const,
  agreeToTerms: false,
})

const loading = computed(() => authStore.loading)
const errorMessage = computed(() => authStore.error)

const passwordError = computed(() => {
  if (form.value.passwordConfirmation && form.value.password !== form.value.passwordConfirmation) {
    return 'Passwords do not match'
  }
  return ''
})

async function handleRegister() {
  if (passwordError.value) {
    return
  }

  try {
    setLoading(true)
    await authStore.register({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      passwordConfirmation: form.value.passwordConfirmation,
      role: form.value.role,
    })

    // Show success message
    await showSuccessAlert(
      'Registration Successful!',
      'Your account has been created. You can now log in with your credentials.'
    )

    // Redirect to login page instead of dashboard
    router.push('/login')
  } catch (error) {
    // Show error message
    await showErrorAlert(
      'Registration Failed',
      authStore.error || 'An error occurred during registration. Please try again.'
    )
    console.error('Registration failed:', error)
  } finally {
    setLoading(false)
  }
}
</script>
