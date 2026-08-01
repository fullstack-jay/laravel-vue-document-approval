<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Navbar :logo-image="logoImage" />
    <div class="flex">
      <Sidebar />
      <main class="flex-1 p-4 md:p-8 overflow-auto relative">
        <!-- Loading overlay with Lottie animation -->
        <div
          v-if="isLoading"
          class="absolute inset-0 z-10 flex items-center justify-center bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm"
        >
          <div class="flex flex-col items-center space-y-4">
            <DotLottieVue
              :src="lottieSrc"
              style="width: 80px; height: 80px;"
              autoplay
              loop
            />
          </div>
        </div>

        <!-- Page content -->
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import Navbar from '@/components/layout/Navbar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import logoImage from '@/assets/images/logo-klh.webp'

// Lottie data source - gunakan file JSON yang baru tanpa background
const lottieSrc = '/animations/klh-loading.json'

// Provide loading state to children
const isLoading = ref(false)
const setLoading = (value: boolean) => {
  isLoading.value = value
}

provide('setLoading', setLoading)
</script>
