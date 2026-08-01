/**
 * Profile Service - Handles profile-related operations
 * Mock API implementation for development
 */
import type { UserProfile, ProfileFormData, PasswordChangeData } from '../types/profile'

/**
 * Mock current user profile
 */
const mockUserProfile: UserProfile = {
  id: '1',
  name: 'Applicant User',
  email: 'applicant@example.com',
  nip: '1234567890',
  phone: '+62 812 3456 7890',
  role: 'applicant',
  avatar: 'https://i.pravatar.cc/150?img=1',
  department: 'Environmental Department',
  position: 'Staff',
  bio: 'Responsible for document submission and tracking.',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-15T00:00:00.000Z',
}

/**
 * Reviewer profile mock
 */
const mockReviewerProfile: UserProfile = {
  id: '2',
  name: 'Reviewer User',
  email: 'reviewer@example.com',
  nip: '0987654321',
  phone: '+62 811 2345 6789',
  role: 'reviewer',
  avatar: 'https://i.pravatar.cc/150?img=2',
  department: 'Quality Assurance',
  position: 'Senior Reviewer',
  bio: 'Responsible for reviewing and approving document submissions.',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-15T00:00:00.000Z',
}

export const profileService = {
  /**
   * Get current user profile
   */
  async getProfile(role: 'applicant' | 'reviewer' | 'admin' = 'applicant'): Promise<UserProfile> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))

    return role === 'reviewer' ? mockReviewerProfile : mockUserProfile
  },

  /**
   * Update user profile
   */
  async updateProfile(data: ProfileFormData): Promise<UserProfile> {
    await new Promise(resolve => setTimeout(resolve, 800))

    // Update mock profile
    const profile = mockUserProfile
    profile.name = data.name
    profile.email = data.email
    profile.nip = data.nip
    profile.phone = data.phone
    profile.department = data.department
    profile.position = data.position
    profile.bio = data.bio
    profile.updatedAt = new Date().toISOString()

    return profile
  },

  /**
   * Change password
   */
  async changePassword(data: PasswordChangeData): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 600))

    // Mock validation
    if (data.newPassword !== data.confirmPassword) {
      throw new Error('New password and confirmation do not match')
    }

    if (data.newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters long')
    }

    // In real implementation, would verify current password and update
    console.log('Password changed successfully')
  },

  /**
   * Upload avatar
   */
  async uploadAvatar(file: File): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock upload - return URL
    const mockUrl = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
    console.log(`Uploading avatar: ${file.name}`)
    return mockUrl
  },
}
