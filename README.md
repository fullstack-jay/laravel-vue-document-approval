# Document Approval Management System - Frontend

A modern, production-ready frontend application for a Document Approval Management System built with Vue 3, Vite, TypeScript, and Tailwind CSS.

## Features

- **Authentication**: Login, Register, Forgot Password, Reset Password
- **Role-Based Dashboards**: Separate dashboards for Applicants and Reviewers
- **Mock API Integration**: Ready for backend integration
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Mode**: Built-in dark mode support
- **Type Safety**: Full TypeScript support
- **Clean Architecture**: Feature-based folder structure
- **Modern UI**: Reusable components with Vue 3 Composition API

## Tech Stack

- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite 8
- **Language**: TypeScript 5
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Styling**: Tailwind CSS v3
- **HTTP Client**: Axios
- **Icons**: Heroicons Vue

## Project Structure

```
src/
├── assets/
│   └── styles/
│       └── main.css
├── components/
│   ├── common/           # Reusable UI components
│   ├── layout/           # Layout components (Navbar, Sidebar)
│   └── dashboard/        # Dashboard-specific components
├── composables/          # Vue composables
├── layouts/              # Page layouts
├── modules/              # Feature modules
│   ├── auth/
│   └── dashboard/
├── pages/                # Route pages
│   ├── auth/
│   └── dashboard/
├── router/               # Vue Router configuration
├── services/             # API services
│   ├── api/
│   └── mock/
├── stores/               # Pinia stores
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
├── App.vue
└── main.ts
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Demo Credentials

The application uses mock data for demonstration:

**Applicant:**
- Email: `applicant@example.com`
- Password: `password123`

**Reviewer:**
- Email: `reviewer@example.com`
- Password: `password123`

## Available Pages

### Authentication
- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Password reset request
- `/reset-password` - Reset password form

### Dashboard
- `/dashboard` - Applicant dashboard
- `/reviewer-dashboard` - Reviewer dashboard

## Components

### Common Components
- `AppButton` - Reusable button with variants and loading states
- `AppInput` - Form input with validation
- `Card` - Container component for content sections
- `StatusBadge` - Badge for displaying application status
- `EmptyState` - Placeholder for empty content
- `LoadingSkeleton` - Skeleton loading state
- `PageHeader` - Page title and actions header

### Dashboard Components
- `StatisticCard` - Display statistics with icons and trends
- `ActivityCard` - Display activity items
- `ActivityList` - List of activities

### Layout Components
- `Navbar` - Top navigation bar with user menu
- `Sidebar` - Side navigation menu
- `SidebarLink` - Navigation link with active states

## Stores (Pinia)

### Auth Store
```typescript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
await authStore.login({ email, password })
await authStore.logout()
```

### Dashboard Store
```typescript
import { useDashboardStore } from '@/stores/dashboard'

const dashboardStore = useDashboardStore()
await dashboardStore.fetchDashboardStats('applicant')
```

## Status Types

The application uses the following status types:

- `draft` - Application is in draft state
- `submitted` - Application has been submitted
- `revision` - Application needs revision
- `approved` - Application has been approved
- `rejected` - Application has been rejected
- `created` - Resource was created

## Customization

### Colors

Custom colors are defined in `tailwind.config.js`:

```javascript
colors: {
  primary: { /* ... */ },
  draft: '#6B7280',
  submitted: '#3B82F6',
  revision: '#F59E0B',
  approved: '#10B981',
  rejected: '#EF4444'
}
```

### Theme

The application supports dark mode. Toggle is available in the navbar.

## Roadmap

Future enhancements:
- [ ] Project list with pagination/filtering
- [ ] Create/Edit project forms
- [ ] Document upload functionality
- [ ] Review workflow pages
- [ ] Notification system
- [ ] Profile settings
- [ ] Real-time updates

## License

MIT License
