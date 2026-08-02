import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Import layouts
import AppLayout from '@/layouts/AppLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const routes: RouteRecordRaw[] = [
  // Auth routes with AuthLayout
  {
    path: '/login',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import('@/pages/auth/Login.vue'),
        meta: { requiresGuest: true },
      },
    ],
  },
  {
    path: '/register',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'Register',
        component: () => import('@/pages/auth/Register.vue'),
        meta: { requiresGuest: true },
      },
    ],
  },
  {
    path: '/forgot-password',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'ForgotPassword',
        component: () => import('@/pages/auth/ForgotPassword.vue'),
        meta: { requiresGuest: true },
      },
    ],
  },
  {
    path: '/reset-password',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'ResetPassword',
        component: () => import('@/pages/auth/ResetPassword.vue'),
        meta: { requiresGuest: true },
      },
    ],
  },
  // Dashboard routes with AppLayout
  {
    path: '/dashboard',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/pages/dashboard/ApplicantDashboard.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/reviewer-dashboard',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'ReviewerDashboard',
        component: () => import('@/pages/dashboard/ReviewerDashboard.vue'),
        meta: { requiresAuth: true, requiredRole: ['reviewer', 'admin'] },
      },
    ],
  },
  // Profile routes with AppLayout
  {
    path: '/profile',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'Profile',
        component: () => import('@/pages/profile/Profile.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  // Notifications routes with AppLayout
  {
    path: '/notifications',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'Notifications',
        component: () => import('@/pages/notifications/Notifications.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  // Project routes with AppLayout
  {
    path: '/projects',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'ProjectList',
        component: () => import('@/pages/projects/ProjectList.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'create',
        name: 'CreateProject',
        component: () => import('@/pages/projects/CreateProject.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: ':id',
        name: 'ProjectDetail',
        component: () => import('@/pages/projects/ProjectDetail.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: ':id/edit',
        name: 'EditProject',
        component: () => import('@/pages/projects/EditProject.vue'),
        meta: { requiresAuth: true, draftOnly: true },
      },
      {
        path: ':id/review',
        name: 'ReviewerProjectDetail',
        component: () => import('@/pages/projects/ReviewerProjectDetail.vue'),
        meta: { requiresAuth: true, reviewerOnly: true },
      },
    ],
  },
  // 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue'),
  },
  // Default redirect to login
  {
    path: '/',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guards
router.beforeEach(async (to) => {
  // Get auth state from localStorage
  const token = localStorage.getItem('access_token')
  const userData = localStorage.getItem('user_data')
  const isAuthenticated = !!token

  let userRole: string | null = null
  if (userData) {
    try {
      const user = JSON.parse(userData)
      userRole = user.role
    } catch (e) {
      console.error('Failed to parse user data:', e)
    }
  }

  const requiresAuth = to.meta.requiresAuth || to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.meta.requiresGuest || to.matched.some(record => record.meta.requiresGuest)
  const reviewerOnly = to.meta.reviewerOnly || to.matched.some(record => record.meta.reviewerOnly)

  if (requiresAuth && !isAuthenticated) {
    // Redirect to login with return URL
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    }
  }

  // Check reviewer-only routes
  if (reviewerOnly && isAuthenticated && userRole !== 'reviewer' && userRole !== 'admin') {
    // Non-reviewers trying to access reviewer routes
    return '/dashboard'
  }

  if (requiresGuest && isAuthenticated) {
    // Redirect based on role
    if (userRole === 'reviewer' || userRole === 'admin') {
      return '/reviewer-dashboard'
    }
    return '/dashboard'
  }

  // Check draft-only routes (like EditProject)
  const draftOnly = to.meta.draftOnly || to.matched.some(record => record.meta.draftOnly)
  if (draftOnly && isAuthenticated) {
    // For now, allow access. ProjectDetail will check if draft and redirect if not
    // In production, you might want to fetch the project here
  }

  // Return undefined to continue navigation
  return
})

// Error handler for navigation
router.onError((error) => {
  console.error('Router error:', error)
})

export default router
