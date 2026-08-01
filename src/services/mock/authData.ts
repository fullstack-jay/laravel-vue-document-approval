import type { User } from '@/modules/auth/types/auth'

export const mockUsers: Array<User & { password: string }> = [
  {
    id: 1,
    name: 'Applicant User',
    email: 'applicant@example.com',
    password: 'password123',
    role: 'applicant',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 2,
    name: 'Reviewer User',
    email: 'reviewer@example.com',
    password: 'password123',
    role: 'reviewer',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: 3,
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
]

export const mockAuthResponse = {
  access_token: 'mock-jwt-token-xyz123',
  token_type: 'Bearer',
  expires_in: 3600,
}
