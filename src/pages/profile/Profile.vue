<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <!-- Page Header -->
    <div class="space-y-4">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
        My Profile
      </h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Manage your account settings and preferences
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <LoadingSkeleton height="200px" />
    </div>

    <!-- Profile Content -->
    <div v-else-if="profile" class="space-y-8">
      <!-- Profile Information Card -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
        <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">
          Profile Information
        </h2>

        <form @submit.prevent="handleUpdateProfile" class="space-y-6">
          <!-- Avatar Section -->
          <div class="flex items-center gap-6 mb-8">
            <div class="relative">
              <div class="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  v-if="profile.avatar"
                  :src="profile.avatar"
                  :alt="profile.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <UserIcon class="h-12 w-12 text-gray-400" />
                </div>
              </div>
              <label
                for="avatar-upload"
                class="absolute bottom-0 right-0 p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full cursor-pointer transition-colors"
              >
                <CameraIcon class="h-4 w-4" />
              </label>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                @change="handleAvatarUpload"
                class="hidden"
              />
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ profile.name }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ profile.email }}
              </p>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>

          <!-- Form Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Name -->
            <AppInput
              v-model="form.name"
              label="Full Name"
              placeholder="Enter your full name"
              required
              :error="errors.name"
            />

            <!-- Email -->
            <AppInput
              v-model="form.email"
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              required
              :error="errors.email"
            />

            <!-- NIP -->
            <AppInput
              v-model="form.nip"
              label="NIP"
              placeholder="Enter your NIP"
              :error="errors.nip"
            />

            <!-- Phone -->
            <AppInput
              v-model="form.phone"
              label="Phone Number"
              type="tel"
              placeholder="+62 812 3456 7890"
              :error="errors.phone"
            />

            <!-- Department -->
            <AppInput
              v-model="form.department"
              label="Department"
              placeholder="Your department"
              :error="errors.department"
            />

            <!-- Position -->
            <AppInput
              v-model="form.position"
              label="Position"
              placeholder="Your position"
              :error="errors.position"
            />
          </div>

          <!-- Bio -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Bio
            </label>
            <textarea
              v-model="form.bio"
              rows="3"
              placeholder="Tell us about yourself..."
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          <!-- Error message -->
          <div
            v-if="errorMessage"
            class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end pt-4">
            <AppButton
              type="submit"
              :loading="isUpdating"
              size="lg"
            >
              Save Changes
            </AppButton>
          </div>
        </form>
      </div>

      <!-- Change Password Card -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
        <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">
          Change Password
        </h2>

        <form @submit.prevent="handleChangePassword" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Current Password -->
            <AppInput
              v-model="passwordForm.currentPassword"
              label="Current Password"
              type="password"
              placeholder="••••••••"
              required
              :error="passwordErrors.currentPassword"
            />

            <!-- New Password -->
            <AppInput
              v-model="passwordForm.newPassword"
              label="New Password"
              type="password"
              placeholder="••••••••"
              required
              :error="passwordErrors.newPassword"
            />

            <!-- Confirm Password -->
            <AppInput
              v-model="passwordForm.confirmPassword"
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              required
              :error="passwordErrors.confirmPassword"
            />
          </div>

          <!-- Error message -->
          <div
            v-if="passwordErrorMessage"
            class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <p class="text-sm text-red-600 dark:text-red-400">{{ passwordErrorMessage }}</p>
          </div>

          <!-- Success message -->
          <div
            v-if="passwordSuccessMessage"
            class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
          >
            <p class="text-sm text-green-600 dark:text-green-400">{{ passwordSuccessMessage }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end pt-4">
            <AppButton
              type="submit"
              :loading="isChangingPassword"
              variant="secondary"
              size="lg"
            >
              Change Password
            </AppButton>
          </div>
        </form>
      </div>

      <!-- Account Info Card -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
        <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">
          Account Information
        </h2>

        <div class="space-y-4">
          <div class="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
            <div>
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Role</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">{{ profile.role }}</p>
            </div>
            <span
              class="px-3 py-1 text-xs font-medium rounded-full"
              :class="getRoleBadgeClass(profile.role)"
            >
              {{ profile.role }}
            </span>
          </div>

          <div class="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
            <div>
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Member Since</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(profile.createdAt) }}</p>
            </div>
          </div>

          <div class="flex justify-between items-center py-3">
            <div>
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Last Updated</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(profile.updatedAt) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useProfileStore } from '@/modules/profile/stores/profileStore'
import { useAuthStore } from '@/modules/auth/stores/authStore'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue'
import { UserIcon, CameraIcon } from '@heroicons/vue/24/outline'
import type { ProfileFormData, PasswordChangeData } from '@/modules/profile/types/profile'
import { showSuccessAlert, showErrorAlert, showToast } from '@/composables/useSweetAlert'

const profileStore = useProfileStore()
const authStore = useAuthStore()

const profile = ref(profileStore.profile)
const loading = ref(false)

// Profile form
const form = reactive<ProfileFormData>({
  name: '',
  email: '',
  nip: '',
  phone: '',
  department: '',
  position: '',
  bio: '',
})

const errors = ref<Record<string, string>>({})
const errorMessage = ref('')
const isUpdating = ref(false)

// Password form
const passwordForm = reactive<PasswordChangeData>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const passwordErrors = ref<Record<string, string>>({})
const passwordErrorMessage = ref('')
const passwordSuccessMessage = ref('')
const isChangingPassword = ref(false)

async function fetchProfile() {
  loading.value = true
  try {
    await profileStore.fetchProfile()
    profile.value = profileStore.profile

    // Populate form
    if (profile.value) {
      form.name = profile.value.name
      form.email = profile.value.email
      form.nip = profile.value.nip || ''
      form.phone = profile.value.phone || ''
      form.department = profile.value.department || ''
      form.position = profile.value.position || ''
      form.bio = profile.value.bio || ''
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to fetch profile'
  } finally {
    loading.value = false
  }
}

async function handleUpdateProfile() {
  errors.value = {}
  errorMessage.value = ''

  // Validation
  if (!form.name.trim()) {
    errors.value.name = 'Name is required'
    return
  }

  if (!form.email.trim()) {
    errors.value.email = 'Email is required'
    return
  }

  isUpdating.value = true
  try {
    await profileStore.updateProfile(form)
    profile.value = profileStore.profile
    await showSuccessAlert('Success', 'Profile updated successfully!')
  } catch (error: any) {
    await showErrorAlert('Error', error.message || 'Failed to update profile')
    errorMessage.value = error.message || 'Failed to update profile'
  } finally {
    isUpdating.value = false
  }
}

async function handleChangePassword() {
  passwordErrors.value = {}
  passwordErrorMessage.value = ''
  passwordSuccessMessage.value = ''

  // Validation
  if (!passwordForm.currentPassword) {
    passwordErrors.value.currentPassword = 'Current password is required'
    return
  }

  if (!passwordForm.newPassword) {
    passwordErrors.value.newPassword = 'New password is required'
    return
  }

  if (passwordForm.newPassword.length < 6) {
    passwordErrors.value.newPassword = 'Password must be at least 6 characters'
    return
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordErrors.value.confirmPassword = 'Passwords do not match'
    return
  }

  isChangingPassword.value = true
  try {
    await profileStore.changePassword(passwordForm)
    passwordSuccessMessage.value = 'Password changed successfully!'

    // Reset form
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''

    // Clear success message after 3 seconds
    setTimeout(() => {
      passwordSuccessMessage.value = ''
    }, 3000)
  } catch (error: any) {
    passwordErrorMessage.value = error.message || 'Failed to change password'
  } finally {
    isChangingPassword.value = false
  }
}

async function handleAvatarUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // Validate file size (2MB max)
  if (file.size > 2 * 1024 * 1024) {
    showToast('File is too large. Max size is 2MB.', 'error')
    return
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    showToast('File must be an image.', 'error')
    return
  }

  try {
    const avatarUrl = await profileStore.uploadAvatar(file)
    if (profile.value) {
      profile.value.avatar = avatarUrl
    }
    await showSuccessAlert('Success', 'Avatar uploaded successfully!')
  } catch (error: any) {
    await showErrorAlert('Error', error.message || 'Failed to upload avatar')
  }
}

function getRoleBadgeClass(role: string): string {
  const classes = {
    applicant: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    reviewer: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    admin: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  }
  return classes[role as keyof typeof classes] || classes.applicant
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString()
}

onMounted(() => {
  fetchProfile()
})
</script>
