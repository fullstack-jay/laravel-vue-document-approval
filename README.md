# Document Approval System - Frontend

Vue.js 3 frontend application for Document Approval Management System of Kementrian Lingkungan Hidup.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development Guidelines](#development-guidelines)
- [Code Standards](#code-standards)
- [API Integration](#api-integration)
- [State Management](#state-management)
- [Components](#components)
- [Routing](#routing)
- [Styling](#styling)
- [Backend Integration](#backend-integration)

## Overview

This is a modern Vue.js 3 application built with TypeScript, Vite, and Tailwind CSS. It provides a document approval workflow system for the Ministry of Environment.

### Key Features

- **User Authentication**: Login, registration, password reset
- **Role-based Access**: Applicant, Reviewer, and Admin roles
- **Project Management**: Create, edit, submit, and track document submissions
- **Review Workflow**: Reviewers can approve, reject, or request revisions
- **File Management**: Upload and manage supporting documents (PDF, Excel only)
- **Notifications**: Real-time notification system with auto-delete on click
- **Export**: Export projects to PDF and Excel formats
- **Dark Mode**: Full dark mode support
- **Responsive Design**: Mobile-first responsive UI
- **SweetAlert2**: Beautiful alert dialogs and confirmations

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | Vue.js | 3.x |
| **Language** | TypeScript | 5.x |
| **Build Tool** | Vite | 5.x |
| **State Management** | Pinia | 2.x |
| **Routing** | Vue Router | 4.x |
| **Styling** | Tailwind CSS | 3.x |
| **Icons** | Heroicons | 24/outline |
| **HTTP Client** | Axios | 1.x |
| **Alerts** | SweetAlert2 | 11.x |
| **Date Handling** | Native (custom WIB formatters) |

## Project Structure

```
src/
├── assets/              # Static assets (images, fonts)
├── components/          # Reusable Vue components
│   ├── common/         # Common UI components
│   │   ├── AppButton.vue
│   │   ├── AppInput.vue
│   │   ├── Card.vue
│   │   ├── EmptyState.vue
│   │   ├── LoadingSkeleton.vue
│   │   ├── PageHeader.vue
│   │   └── StatusBadge.vue
│   ├── dashboard/      # Dashboard-specific components
│   │   ├── ActivityCard.vue
│   │   ├── ActivityList.vue
│   │   └── StatisticCard.vue
│   ├── layout/         # Layout components
│   │   ├── LayoutWrapper.vue
│   │   ├── Logo.vue
│   │   ├── Navbar.vue
│   │   ├── Sidebar.vue
│   │   └── SidebarLink.vue
│   ├── notifications/  # Notification components
│   │   └── NotificationBell.vue
│   └── projects/       # Project-related components
│       ├── ProjectCard.vue
│       └── TimelineItem.vue
├── composables/        # Vue composables (reusable logic)
│   ├── useDarkMode.ts
│   ├── useFileExport.ts
│   └── useSweetAlert.ts
├── layouts/            # Page layout wrappers
│   ├── AppLayout.vue
│   └── AuthLayout.vue
├── modules/            # Feature modules (domain-driven)
│   ├── auth/          # Authentication module
│   │   ├── services/
│   │   │   └── authService.ts
│   │   ├── stores/
│   │   │   └── authStore.ts
│   │   └── types/
│   │       └── auth.ts
│   ├── dashboard/     # Dashboard module
│   │   ├── services/
│   │   ├── stores/
│   │   └── types/
│   ├── notifications/ # Notifications module
│   │   ├── services/
│   │   ├── stores/
│   │   └── types/
│   ├── profile/       # Profile module
│   │   ├── services/
│   │   ├── stores/
│   │   └── types/
│   └── projects/      # Projects module
│       ├── services/
│       │   └── projectService.ts
│       ├── stores/
│       │   └── projectStore.ts
│       └── types/
│           └── project.ts
├── pages/              # Page components
│   ├── auth/          # Authentication pages
│   │   ├── ForgotPassword.vue
│   │   ├── Login.vue
│   │   ├── Register.vue
│   │   └── ResetPassword.vue
│   ├── dashboard/     # Dashboard pages
│   │   ├── ApplicantDashboard.vue
│   │   └── ReviewerDashboard.vue
│   ├── notifications/ # Notification pages
│   │   └── Notifications.vue
│   ├── profile/       # Profile pages
│   │   └── Profile.vue
│   ├── projects/      # Project pages
│   │   ├── CreateProject.vue
│   │   ├── EditProject.vue
│   │   ├── ProjectDetail.vue
│   │   ├── ProjectList.vue
│   │   └── ReviewerProjectDetail.vue
│   └── NotFound.vue
├── router/            # Vue Router configuration
│   └── index.ts
├── services/          # Shared services
│   ├── api/          # HTTP client setup
│   │   └── http.ts
│   └── mock/         # Mock data for development
│       ├── authData.ts
│       ├── dashboardData.ts
│       └── projectData.ts
├── types/             # Global TypeScript types
│   ├── common.ts
│   └── index.ts
├── utils/             # Utility functions
├── App.vue            # Root component
└── main.ts            # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 22.x or higher
- npm or yarn package manager
- Laravel backend API running on port 8000

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd laravel-vue-document-approval

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## Development Guidelines

### File Naming Conventions

- **Components**: PascalCase (e.g., `ProjectCard.vue`, `AppButton.vue`)
- **Composables**: camelCase with `use` prefix (e.g., `useFileExport.ts`, `useSweetAlert.ts`)
- **Services**: camelCase (e.g., `authService.ts`, `projectService.ts`)
- **Stores**: camelCase with `Store` suffix (e.g., `authStore.ts`, `projectStore.ts`)
- **Types**: camelCase (e.g., `auth.ts`, `project.ts`)
- **Pages**: PascalCase (e.g., `ProjectDetail.vue`, `Login.vue`)

### Component Structure

Each component should follow this structure:

```vue
<template>
  <!-- Component template -->
</template>

<script setup lang="ts">
/**
 * ComponentName Component
 *
 * Brief description of what this component does.
 *
 * @example
 * <ComponentName prop="value" />
 */

// Imports
import { ref, computed, onMounted } from 'vue'
import type { SomeType } from '@/types'

// Props interface
interface Props {
  propOne: string
  propTwo?: number
}

// Props definition
const props = withDefaults(defineProps<Props>(), {
  propTwo: 0
})

// Emits definition
interface Emits {
  (e: 'event-name', value: string): void
}

const emit = defineEmits<Emits>()

// State
const state = ref('initial')

// Computed
const computedValue = computed(() => {
  // Logic
})

// Methods
const handleAction = () => {
  // Logic
}

// Lifecycle
onMounted(() => {
  // Initialization
})
</script>

<style scoped>
/* Component-specific styles */
</style>
```

### Composable Pattern

Composables should be reusable and follow this pattern:

```typescript
/**
 * useComposableName
 *
 * Description of what this composable does.
 *
 * @module composables/useComposableName
 *
 * @example
 * ```typescript
 * const { value, method } = useComposableName()
 * ```
 */

import { ref, computed, type Ref } from 'vue'

// Type definitions
interface ComposableState {
  // State properties
}

// Main composable function
export function useComposableName() {
  // State
  const state: Ref<ComposableState> = ref(defaultValue)

  // Computed
  const computedValue = computed(() => {
    // Logic
  })

  // Methods
  const method = () => {
    // Logic
  }

  // Return public API
  return {
    state,
    computedValue,
    method,
  }
}
```

## Code Standards

### PSR-12 Compliance for TypeScript

This project follows PSR-12 coding standards adapted for TypeScript:

1. **Indentation**: 2 spaces (no tabs)
2. **Line Length**: Maximum 120 characters
3. **Blank Lines**: 
   - One blank line after imports
   - One blank line between functions
4. **Spacing**: 
   - Spaces around operators (`a = b + c`)
   - Spaces after commas in function calls
5. **Braces**: Opening brace on same line
6. **Naming**: 
   - Classes/Types: PascalCase
   - Functions/Variables: camelCase
   - Constants: UPPER_SNAKE_CASE

### TypeScript Guidelines

1. **Always use types**: Avoid `any` whenever possible
2. **Use type imports**: `import type { ... }` for type-only imports
3. **Define interfaces** for complex objects
4. **Use generics** when appropriate
5. **Add JSDoc comments** for exported functions

```typescript
// Good
import type { User, Project } from '@/types'

interface FetchProjectsOptions {
  page?: number
  status?: ProjectStatus
}

async function fetchProjects(options?: FetchProjectsOptions): Promise<Project[]> {
  // Implementation
}

// Avoid
async function fetchProjects(options?: any): Promise<any> {
  // Implementation
}
```

### Vue 3 Best Practices

1. **Use Composition API** with `<script setup>`
2. **Prefer composables** over mixins
3. **Use refs and reactives** appropriately
4. **Computed properties** for derived state
5. **Watch effects** sparingly

### Naming Conventions

- **Variables**: camelCase (e.g., `projectList`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Functions**: camelCase with verb prefix (e.g., `handleSubmit`, `fetchData`)
- **Types/Interfaces**: PascalCase (e.g., `Project`, `User`)
- **Booleans**: Prefix with `is/has/can` (e.g., `isLoading`, `hasAccess`)

### Comment Guidelines

```typescript
/**
 * Function description
 *
 * Detailed explanation if needed.
 *
 * @param paramOne - Description of first parameter
 * @param paramTwo - Description of second parameter
 * @returns Description of return value
 *
 * @example
 * ```typescript
 * const result = functionName(arg1, arg2)
 * ```
 */
```

## API Integration

### HTTP Client

The application uses Axios with interceptors for authentication:

```typescript
// services/api/http.ts
- Request interceptor adds Bearer token
- Response interceptor handles 401 errors
- Base URL from environment variable
```

### Service Pattern

Each module has its own service:

```typescript
// modules/auth/services/authService.ts
export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse>,
  async register(data: RegisterData): Promise<AuthResponse>,
  async logout(): Promise<void>,
}
```

### Error Handling

All API calls should be wrapped in try-catch:

```typescript
try {
  const response = await service.someMethod()
  // Handle success
} catch (error: any) {
  const message = error.response?.data?.message || error.message
  // Handle error
  await showErrorAlert('Error', message)
}
```

## State Management

### Pinia Stores

Each feature module has its own store:

```typescript
// modules/projects/stores/projectStore.ts
export const useProjectStore = defineStore('project', () => {
  // State
  const projects = ref<Project[]>([])
  const loading = ref(false)

  // Actions
  async function fetchProjects() {
    // Implementation
  }

  // Getters
  const filteredProjects = computed(() => {
    // Computed logic
  })

  return {
    projects,
    loading,
    fetchProjects,
    filteredProjects,
  }
})
```

## Components

### Common Components

Reusable UI components in `src/components/common/`:

- `AppButton.vue` - Standardized button with loading states
- `AppInput.vue` - Form input with validation
- `Card.vue` - Card container component
- `PageHeader.vue` - Page header with actions
- `StatusBadge.vue` - Status badge component
- `LoadingSkeleton.vue` - Skeleton loader
- `EmptyState.vue` - Empty state placeholder

### Component Props

Always define prop types:

```typescript
interface Props {
  title: string
  status: ProjectStatus
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})
```

## Routing

### Route Structure

```typescript
// Public routes
/login              - Login page
/register            - Registration page
/forgot-password     - Forgot password

// Protected routes (require auth)
/dashboard           - Applicant dashboard
/reviewer-dashboard  - Reviewer dashboard
/projects            - Project list with pagination
/projects/create     - Create new project
/projects/:id        - Project detail
/projects/:id/edit   - Edit project
/profile             - User profile
/notifications       - Notification list

// Reviewer routes
/projects/:id/review - Review project
```

### Route Guards

Authentication guard checks for valid token:

```typescript
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})
```

## Styling

### Tailwind CSS Configuration

Primary colors and theme in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#EFF6FF',
        500: '#3B82F6',
        600: '#2563EB',
        700: '#1D4ED8',
      },
      // Status colors
      draft: '#6B7280',
      submitted: '#3B82F6',
      revision: '#F59E0B',
      approved: '#10B981',
      rejected: '#EF4444',
    }
  }
}
```

### Dark Mode

Dark mode is class-based and can be toggled via `useDarkMode` composable.

## Backend Integration

This frontend is designed to work with a Laravel backend. See:

- **`BACKEND_REGISTRATION_GUIDE.md`** - User registration API implementation
- **`BACKEND_EXPORT_GUIDE.md`** - PDF/Excel export API implementation

### Demo Credentials

**Reviewer:**
- Email: `reviewer@example.com`
- Password: `password`

**Registration:**
- New users are automatically assigned `applicant` role

## Available Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

## License

Copyright © 2026 Kementrian Lingkungan Hidup. All rights reserved.
