<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <div class="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div class="max-w-md w-full">
        <!-- Initial loading state (Lottie animation) -->
        <div
          v-if="isInitialLoading"
          class="flex flex-col items-center justify-center py-12 min-h-[300px]"
        >
          <template v-if="animationLoaded">
            <div class="relative w-[150px] h-[150px]">
              <DotLottieVue
                :src="lottieSrc"
                style="width: 150px; height: 150px;"
                autoplay
                loop
              />
            </div>
          </template>
          <!-- Placeholder while animation loads -->
          <div v-else class="w-[150px] h-[150px]"></div>
        </div>

        <!-- After loading: show card -->
        <template v-else>
          <!-- Auth content wrapper -->
          <div class="relative">
            <!-- Loading overlay during actions (login, register, etc.) -->
            <div
              v-if="isLoading"
              class="absolute inset-0 z-20 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 rounded-2xl backdrop-blur-sm"
            >
              <div class="flex flex-col items-center space-y-4">
                <DotLottieVue
                  :src="lottieSrc"
                  style="width: 80px; height: 80px;"
                  autoplay
                  loop
                />
                <p class="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Processing...
                </p>
              </div>
            </div>

            <!-- Content card -->
            <router-view />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted } from 'vue'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
// @ts-expect-error - logoImage imported for future use
import logoImage from '@/assets/images/logo-klh.webp'

// Initial loading state (when page first loads)
const isInitialLoading = ref(true)

// Track when animation is loaded
const animationLoaded = ref(false)

// Action loading state (during login, register, etc.)
const isLoading = ref(false)

// Lottie data source - gunakan file JSON yang baru tanpa background
const lottieSrc = ref('/animations/klh-loading.json')

// Provide loading state to children
const setLoading = (value: boolean) => {
  isLoading.value = value
}

provide('setLoading', setLoading)

// Preload the Lottie file
onMounted(() => {
  console.log('lottieSrc.value:', lottieSrc.value)

  // Set animation as loaded and show initial loading for 1 second
  animationLoaded.value = true
  setTimeout(() => {
    isInitialLoading.value = false
  }, 1000)
})
</script>
