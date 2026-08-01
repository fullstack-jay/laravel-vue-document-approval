<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Navbar :logo-image="logoImage" @toggle-sidebar="showSidebar = !showSidebar" />
    <div class="flex relative h-[calc(100vh-4rem)]">
      <!-- Mobile sidebar overlay -->
      <div
        v-if="showSidebar"
        class="fixed inset-0 bg-black/50 z-40 lg:hidden"
        @click="showSidebar = false"
      />

      <!-- Sidebar -->
      <div
        :class="[
          'fixed inset-y-0 left-0 z-50 w-64 h-full transform transition-transform duration-300 ease-in-out lg:relative lg:transform-none lg:z-auto',
          showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        ]"
      >
        <Sidebar @close="showSidebar = false" />
      </div>

      <!-- Main content -->
      <main class="flex-1 p-4 sm:p-6 md:p-8 overflow-auto relative w-full h-full">
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

// Mobile sidebar state
const showSidebar = ref(false)

// Provide loading state to children
const isLoading = ref(false)
const setLoading = (value: boolean) => {
  isLoading.value = value
}

provide('setLoading', setLoading)
</script>
