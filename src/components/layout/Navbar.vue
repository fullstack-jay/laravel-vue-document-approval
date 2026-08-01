<template>
  <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Left side - Logo & Mobile menu button -->
        <div class="flex items-center space-x-4">
          <!-- Mobile menu button -->
          <button
            @click="$emit('toggle-sidebar')"
            class="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Toggle menu"
          >
            <Bars3Icon class="w-6 h-6" />
          </button>

          <!-- Logo -->
          <router-link to="/dashboard" class="inline-flex items-center">
            <img
              :src="logoImage || defaultLogo"
              alt="Logo"
              class="h-10 w-10 rounded-lg object-cover"
            />
          </router-link>
        </div>

        <!-- Right side -->
        <div class="flex items-center space-x-2 sm:space-x-4">
          <!-- Dark mode toggle -->
          <button
            @click="toggleDarkMode"
            class="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Toggle dark mode"
          >
            <SunIcon v-if="isDark" class="w-5 h-5" />
            <MoonIcon v-else class="w-5 h-5" />
          </button>

          <!-- Notifications -->
          <button
            class="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
            title="Notifications"
          >
            <BellIcon class="w-5 h-5" />
            <span
              v-if="unreadCount > 0"
              class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
            />
          </button>

          <!-- Profile dropdown -->
          <div class="relative" ref="profileDropdownRef">
            <button
              @click="toggleProfileMenu"
              class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <img
                :src="user?.avatar || '/default-avatar.png'"
                :alt="user?.name"
                class="w-8 h-8 rounded-full object-cover"
              />
              <span class="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ user?.name }}
              </span>
              <ChevronDownIcon class="w-4 h-4 text-gray-500" />
            </button>

            <!-- Dropdown menu -->
            <div
              v-if="showProfileMenu"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
            >
              <router-link
                to="/profile"
                class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="showProfileMenu = false"
              >
                <UserIcon class="w-4 h-4 mr-3" />
                Profile
              </router-link>
              <router-link
                to="/settings"
                class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="showProfileMenu = false"
              >
                <CogIcon class="w-4 h-4 mr-3" />
                Settings
              </router-link>
              <hr class="my-1 border-gray-200 dark:border-gray-700" />
              <button
                @click="handleLogout"
                class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowRightOnRectangleIcon class="w-4 h-4 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useDarkMode } from '@/composables/useDarkMode'
import {
  BellIcon,
  MoonIcon,
  SunIcon,
  ChevronDownIcon,
  UserIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
} from '@heroicons/vue/24/outline'
import defaultLogo from '@/assets/images/logo-klh.webp'

// Props & Emits
const props = defineProps<{
  logoImage?: string
}>()

defineEmits<{
  'toggle-sidebar': []
}>()

const logoImage = computed(() => props.logoImage || defaultLogo)

const router = useRouter()
const authStore = useAuthStore()
const { isDark, toggleDarkMode } = useDarkMode()

const user = computed(() => authStore.user)
const showProfileMenu = ref(false)
const profileDropdownRef = ref<HTMLElement | null>(null)
const unreadCount = ref(3) // Mock unread notifications

function toggleProfileMenu() {
  showProfileMenu.value = !showProfileMenu.value
}

async function handleLogout() {
  showProfileMenu.value = false
  await authStore.logout()
  router.push('/login')
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  if (profileDropdownRef.value && !profileDropdownRef.value.contains(event.target as Node)) {
    showProfileMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
