# Document Approval System

A full-stack Document Approval Management System for Kementrian Lingkungan Hidup, built with Laravel 12 (REST API), Vue 3, and PostgreSQL.

## Table of Contents

- [System Overview](#system-overview)
- [Business Workflow](#business-workflow)
- [Actors & Roles](#actors--roles)
- [Technical Architecture](#technical-architecture)
  - [Frontend (Vue.js)](#frontend-vuejs)
  - [Backend (Laravel)](#backend-laravel)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Development Guidelines](#development-guidelines)
- [License](#license)

---

## System Overview

This Document Approval System enables applicants to submit document requests and reviewers to evaluate them through a structured approval workflow. The system is designed to be scalable, secure, and optimized for handling large datasets (10,000+ applications, 2,000+ users).

### Key Features

- **User Authentication**: Login, registration, password reset with Laravel Sanctum
- **Role-based Access**: Applicant, Reviewer, and Admin roles with Spatie Permissions
- **Complete Workflow**: Draft → Submitted → Review → Approved/Revision/Rejected
- **File Management**: Upload and manage supporting documents (PDF, DOC, DOCX, Excel; max 10MB)
- **Audit Trail**: Complete history logging for all actions
- **Notifications**: Real-time notification system
- **Export**: Export projects to PDF and Excel formats
- **Dashboard Analytics**: Statistics and charts for both roles
- **Dark Mode**: Full dark mode support
- **Responsive Design**: Mobile-first responsive UI

---

## Business Workflow

### Workflow Steps

The document approval process follows these stages:

```
Draft → Submitted → Review → Approved/Revision/Rejected
```

#### Step 1: Document Preparation
Applicant prepares all required documents offline.

#### Step 2: Authentication
- If no account exists: **Register**
- Otherwise: **Login**

#### Step 3: Create Project
- Applicant creates a new Project/Application
- Initial status: **Draft**
- Applicant can edit data, upload files, save draft
- Draft applications are **not visible** to reviewers

#### Step 4: Submit Application
- Status changes: **Draft** → **Submitted**
- Reviewer can now see the application
- Applicant can no longer edit data directly

#### Step 5: Review
- Reviewer receives notification
- Reviewer opens and checks the application
- Reviewer writes review notes

#### Step 6: Decision

**A. Approved**
```
Submitted → Approved
```
- Generate approval record
- Application becomes read-only
- Applicant receives notification
- Workflow ends

**B. Revision Required**
```
Submitted → Revision → Submitted (after resubmission)
```
- Reviewer must write revision notes
- Applicant receives notification
- Applicant edits and resubmits
- Application returns to reviewer
- This cycle may repeat multiple times

**C. Rejected**
```
Submitted → Rejected
```
- Reviewer writes rejection reason
- Applicant receives notification
- Application permanently closed
- Applicant must create new application if needed

### Status Flow Diagram

```
┌─────────┐
│  Draft  │
└────┬────┘
     │ Submit
     ▼
┌──────────┐     ┌──────────┐
│ Submitted │────▶│ Revision  │
└────┬─────┘     └─────┬────┘
     │ Review           │ Resubmit
     ▼                  │
┌─────────┐             │
│ Review  │◀────────────┘
└────┬────┘
     │ Decision
     ├──────────┬────────────┐
     ▼          ▼            ▼
┌─────────┐ ┌───────┐ ┌──────────┐
│ Approved│ │Revision│ │ Rejected │
└─────────┘ └───────┘ └──────────┘
```

---

## Actors & Roles

### 1. Applicant (Pemohon)

**Responsibilities:**
- Register account
- Login to system
- Create projects/applications
- Upload supporting documents
- Edit applications while in Draft status
- Submit applications for review
- Receive revision requests
- Update and resubmit applications
- Receive approval/rejection notifications

**Features:**
- Authentication (Login, Register, Logout)
- Personal Dashboard
- Create Project
- Upload Documents
- Save Draft
- Submit Application
- View Status
- View Review Notes
- View Revision History
- View Notifications

**Permissions:**
- ✅ Create application
- ✅ Edit Draft
- ✅ Upload files
- ✅ View own applications
- ✅ View status
- ✅ View revision history
- ✅ View review notes
- ❌ Approve
- ❌ Reject
- ❌ Review other applications
- ❌ Edit Submitted application

### 2. Reviewer (Penilai)

**Responsibilities:**
- Login to system
- View submitted applications queue
- Review documents and applications
- Add review notes
- Request revisions with notes
- Approve applications
- Reject applications with reasons
- View review history

**Features:**
- Authentication (Login, Logout)
- Reviewer Dashboard
- View Submitted Applications
- Review Documents
- Add Notes
- Approve
- Reject
- Request Revision
- View Review History
- Dashboard Analytics

**Permissions:**
- ✅ View submitted applications
- ✅ Review
- ✅ Approve
- ✅ Reject
- ✅ Request revision
- ✅ Write notes
- ✅ View history
- ❌ Edit applicant data
- ❌ Create application

---

## Technical Architecture

### Frontend (Vue.js)

#### Tech Stack

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

#### Project Structure

```
src/
├── assets/              # Static assets (images, fonts)
├── components/          # Reusable Vue components
│   ├── common/         # Common UI components
│   ├── dashboard/      # Dashboard-specific components
│   ├── layout/         # Layout components
│   ├── notifications/  # Notification components
│   └── projects/       # Project-related components
├── composables/        # Vue composables (reusable logic)
├── layouts/            # Page layout wrappers
├── modules/            # Feature modules (domain-driven)
│   ├── auth/          # Authentication module
│   ├── dashboard/     # Dashboard module
│   ├── notifications/ # Notifications module
│   ├── profile/       # Profile module
│   └── projects/      # Projects module
├── pages/              # Page components
├── router/            # Vue Router configuration
├── services/          # Shared services
├── types/             # Global TypeScript types
├── utils/             # Utility functions
├── App.vue            # Root component
└── main.ts            # Application entry point
```

#### Frontend Getting Started

```bash
# Navigate to frontend directory
cd laravel-vue-document-approval

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

#### Environment Variables (Frontend)

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

---

### Backend (Laravel)

#### Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | Laravel | 12.x |
| **Database** | PostgreSQL | 15+ |
| **Authentication** | Laravel Sanctum | - |
| **Authorization** | Spatie Permission | - |
| **Cache** | Redis | - |
| **Queue** | Redis Queue | - |
| **API Documentation** | OpenAPI/Swagger | - |

#### REST API Modules

- **Authentication**: Login, Register, Logout
- **Projects**: CRUD operations for projects
- **Documents**: File upload/download
- **Reviews**: Review management
- **Approvals**: Approval workflow
- **Revisions**: Revision requests
- **Users**: User management
- **Dashboard**: Analytics data
- **Logs**: Audit trail
- **Notifications**: Notification system

#### Database Tables

```
users
roles
permissions
projects
applications
application_documents
reviews
review_notes
approval_logs
notifications
activity_logs
```

#### File Upload Rules

- **Supported Formats**: PDF, DOC, DOCX, Excel
- **Maximum Size**: 10 MB per file
- **Access Control**: Only owner and reviewer can access files

#### Performance Optimization

- Indexing for fast queries
- Eager loading to prevent N+1 queries
- Pagination for large datasets
- Redis caching for frequently accessed data
- Queue jobs for heavy operations

#### Security Features

- Laravel Sanctum for API authentication
- Spatie Permission for role-based access control
- Policies for authorization
- Input validation with Form Requests
- CSRF protection
- SQL injection protection
- File validation

---

## Getting Started

### Prerequisites

- **Backend**: PHP 8.2+, Composer, PostgreSQL, Redis
- **Frontend**: Node.js 22.x or higher, npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd laravel-vue-document-approval
   ```

2. **Install backend dependencies**
   ```bash
   composer install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Setup database**
   ```bash
   # Create PostgreSQL database
   createdb doc_approval

   # Run migrations
   php artisan migrate

   # Seed database (optional)
   php artisan db:seed
   ```

5. **Install frontend dependencies**
   ```bash
   npm install
   ```

6. **Start services**
   ```bash
   # Backend
   php artisan serve

   # Frontend (new terminal)
   npm run dev
   ```

### Demo Credentials

**Reviewer:**
- Email: `reviewer@example.com`
- Password: `password`

**Registration:**
- New users are automatically assigned `applicant` role

---

## API Documentation

For detailed API documentation, see [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)

### Base URL

```
http://127.0.0.1:8000/api/v1
```

### Authentication

All protected endpoints require Bearer token authentication:

```
Authorization: Bearer {token}
```

### Key Endpoints

| Module | Endpoints |
|--------|-----------|
| **Auth** | POST /auth/login, POST /auth/register, POST /auth/logout |
| **Projects** | GET /projects, POST /projects, GET /projects/{id}, DELETE /projects/{id} |
| **Documents** | POST /projects/{projectId}/documents, DELETE /documents/{id} |
| **Reviewer** | GET /reviewer/projects, POST /reviewer/projects/{id}/approve |
| **Export** | GET /export/projects/{id}/pdf, GET /export/projects/excel |
| **Notifications** | GET /notifications, PUT /notifications/{id}/read |

---

## Development Guidelines

### File Naming Conventions

- **Components**: PascalCase (e.g., `ProjectCard.vue`, `AppButton.vue`)
- **Composables**: camelCase with `use` prefix (e.g., `useFileExport.ts`)
- **Services**: camelCase (e.g., `authService.ts`)
- **Stores**: camelCase with `Store` suffix (e.g., `authStore.ts`)

### Code Standards

- **Indentation**: 2 spaces (no tabs)
- **Line Length**: Maximum 120 characters
- **TypeScript**: Avoid `any`, use type imports
- **Vue**: Use Composition API with `<script setup>`
- **Naming**:
  - Variables: camelCase
  - Constants: UPPER_SNAKE_CASE
  - Functions: camelCase with verb prefix
  - Types/Interfaces: PascalCase

### Testing

```bash
# Backend tests
php artisan test

# Frontend type checking
npm run type-check

# Frontend linting
npm run lint
```

---

## License

Copyright © 2026 Kementrian Lingkungan Hidup. All rights reserved.
