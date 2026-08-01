<template>
  <div class="bg-white/90 dark:bg-[#161616]/90 backdrop-blur-xl rounded-xl border border-slate-100/50 dark:border-white/5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] py-6 w-full max-w-[440px]">
    <!-- Card Header -->
    <div class="px-6 sm:px-8 lg:px-10 pt-10 sm:pt-12 lg:pt-14 pb-6 sm:pb-7 lg:pb-8 text-center space-y-4">
      <!-- Logo -->
      <div class="mx-auto w-16 h-16 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center shadow-2xl">
        <img
          src="/src/assets/images/logo-klh.webp"
          alt="Logo"
          class="h-12 w-12 rounded-lg object-cover"
        />
      </div>

      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
          Sign in
        </h1>
        <p class="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium mt-2">
          Selamat datang di portal Document Approval
        </p>
      </div>
    </div>

    <!-- Card Content -->
    <div class="px-6 sm:px-8 lg:px-10 pb-10 sm:pb-12 lg:pb-14">
      <!-- Error message -->
      <div
        v-if="errorMessage"
        class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
      >
        <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5 sm:space-y-6">
        <!-- Email -->
        <div class="space-y-2">
          <label for="email" class="block text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">
            Email Address
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="nama@gmail.com"
            required
            autocomplete="email"
            class="w-full rounded-md border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0f0f0f] px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent h-10 sm:h-11 transition-all"
          />
        </div>

        <!-- Password -->
        <div class="space-y-2">
          <div class="flex justify-between items-center ml-1">
            <label for="password" class="block text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              Password
            </label>
          </div>
          <div class="relative">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              required
              autocomplete="current-password"
              class="w-full rounded-md border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0f0f0f] px-3 py-2 pr-12 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent h-10 sm:h-11 transition-all"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <EyeIcon v-if="!showPassword" class="w-4 h-4" />
              <EyeSlashIcon v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Remember me & Forgot password -->
        <div class="flex items-center justify-between">
          <label class="flex items-center">
            <input
              v-model="form.remember"
              type="checkbox"
              class="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:bg-gray-700"
            />
            <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
              Remember me
            </span>
          </label>
          <router-link
            to="/forgot-password"
            class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
          >
            Forgot password?
          </router-link>
        </div>

        <!-- Submit button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full h-11 sm:h-12 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white shadow-xl shadow-slate-200 dark:shadow-indigo-500/20 rounded-xl transition-all text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-3 sm:mt-4"
        >
          <span v-if="loading">Signing in...</span>
          <span v-else>Lanjutkan</span>
        </button>
      </form>

      <!-- Demo credentials hint -->
      <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p class="text-sm text-blue-800 dark:text-blue-300 font-medium mb-2">
          Demo Credentials:
        </p>
        <div class="text-xs text-blue-600 dark:text-blue-400 space-y-1">
          <p>Applicant: applicant@example.com / password123</p>
          <p>Reviewer: reviewer@example.com / password123</p>
        </div>
      </div>

      <!-- Sign up link -->
      <p class="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?
        <router-link
          to="/register"
          class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
        >
          Sign up
        </router-link>
      </p>

      <!-- Footer -->
      <div class="mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 border-t border-slate-100 dark:border-white/5 text-center">
        <p class="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-bold tracking-[0.3em] uppercase">
          © 2026 Kementrian Lingkungan Hidup
        </p>
        <p class="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-bold tracking-[0.3em] uppercase">
          All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/authStore'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Inject setLoading from parent layout
const setLoading = inject<(value: boolean) => void>('setLoading', () => {})

const form = ref({
  email: '',
  password: '',
  remember: false,
})

const showPassword = ref(false)
const loading = computed(() => authStore.loading)
const errorMessage = computed(() => authStore.error)

async function handleLogin() {
  try {
    setLoading(true)
    await authStore.login(form.value)

    // Redirect based on user role
    const redirect = (route.query.redirect as string) || null
    if (redirect) {
      router.push(redirect)
    } else {
      // Redirect based on role
      if (authStore.isReviewer || authStore.isAdmin) {
        router.push('/reviewer-dashboard')
      } else {
        router.push('/dashboard')
      }
    }
  } catch (error) {
    // Error is handled by the store and displayed via errorMessage computed
    console.error('Login failed:', error)
  } finally {
    setLoading(false)
  }
}
</script>
