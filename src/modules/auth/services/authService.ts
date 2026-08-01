import { mockUsers, mockAuthResponse } from '@/services/mock/authData'
import type { User, LoginCredentials, RegisterData, AuthResponse } from '../types/auth'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const user = mockUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    )

    if (!user) {
      throw new Error('Invalid credentials')
    }

    const { password, ...userWithoutPassword } = user

    return {
      user: userWithoutPassword,
      token: mockAuthResponse.access_token,
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 800))

    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === data.email)
    if (existingUser) {
      throw new Error('Email already registered')
    }

    const newUser: User = {
      id: mockUsers.length + 1,
      name: data.name,
      email: data.email,
      role: data.role || 'applicant',
      avatar: `https://i.pravatar.cc/150?img=${mockUsers.length + 10}`,
    }

    mockUsers.push({ ...newUser, password: data.password })

    return {
      user: newUser,
      token: mockAuthResponse.access_token,
    }
  },

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))
  },

  async getCurrentUser(token: string): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 300))

    // Mock user lookup by token (in real app, decode JWT or call API)
    // For now, we'll look up user from stored localStorage data in the store
    // This method is mainly for API calls in production

    // Try to get user from localStorage (this is a workaround for mock)
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user_data')
      if (storedUser) {
        try {
          return JSON.parse(storedUser)
        } catch (e) {
          console.error('Failed to parse stored user:', e)
        }
      }
    }

    // Fallback to first user (shouldn't happen in normal flow)
    const user = mockUsers[0]
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  },
}
