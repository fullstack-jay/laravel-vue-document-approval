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

  async getCurrentUser(_token: string): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock user lookup by token (in real app, decode JWT or call API)
    const user = mockUsers[0] // Return first user as current
    const { password, ...userWithoutPassword } = user

    return userWithoutPassword
  },
}
