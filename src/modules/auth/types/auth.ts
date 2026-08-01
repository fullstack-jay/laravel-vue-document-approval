import type { UserRole } from '@/types'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  avatar?: string
  createdAt?: string
  updatedAt?: string
}

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterData {
  name: string
  email: string
  password: string
  passwordConfirmation?: string
  role?: UserRole
}

export interface AuthResponse {
  user: User
  token: string
}

export interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}
