/**
 * Profile Store - Pinia store for profile management
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { profileService } from '../services/profileService'
import type { UserProfile, ProfileFormData, PasswordChangeData } from '../types/profile'

export const useProfileStore = defineStore('profile', () => {
  // State
  const profile = ref<UserProfile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const userRole = computed(() => profile.value?.role || null)
  const userName = computed(() => profile.value?.name || '')
  const userEmail = computed(() => profile.value?.email || '')
  const userAvatar = computed(() => profile.value?.avatar || '')

  // Actions
  async function fetchProfile(role: 'applicant' | 'reviewer' | 'admin' = 'applicant') {
    loading.value = true
    error.value = null
    try {
      profile.value = await profileService.getProfile(role)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch profile'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(data: ProfileFormData) {
    loading.value = true
    error.value = null
    try {
      profile.value = await profileService.updateProfile(data)
    } catch (err: any) {
      error.value = err.message || 'Failed to update profile'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function changePassword(data: PasswordChangeData) {
    loading.value = true
    error.value = null
    try {
      await profileService.changePassword(data)
    } catch (err: any) {
      error.value = err.message || 'Failed to change password'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function uploadAvatar(file: File) {
    loading.value = true
    error.value = null
    try {
      const avatarUrl = await profileService.uploadAvatar(file)
      if (profile.value) {
        profile.value.avatar = avatarUrl
      }
      return avatarUrl
    } catch (err: any) {
      error.value = err.message || 'Failed to upload avatar'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    profile,
    loading,
    error,
    userRole,
    userName,
    userEmail,
    userAvatar,
    fetchProfile,
    updateProfile,
    changePassword,
    uploadAvatar,
  }
})
