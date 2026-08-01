/**
 * Profile/User Management types
 * Document Approval Management System
 */

/**
 * User profile information
 */
export interface UserProfile {
  id: string
  name: string
  email: string
  nip?: string
  phone?: string
  role: 'applicant' | 'reviewer' | 'admin'
  avatar?: string
  department?: string
  position?: string
  bio?: string
  createdAt: string
  updatedAt: string
}

/**
 * Form data for updating profile
 */
export interface ProfileFormData {
  name: string
  email: string
  nip?: string
  phone?: string
  department?: string
  position?: string
  bio?: string
}

/**
 * Password change data
 */
export interface PasswordChangeData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
