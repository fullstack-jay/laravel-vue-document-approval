# API Documentation

## Base URL

```
http://127.0.0.1:8000/api/v1
```

## Authentication

All protected endpoints require Bearer token authentication:

```
Authorization: Bearer {token}
```

## Endpoints

### Authentication

#### POST /auth/login
Login user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Response (200):**
```json
{
  "data": {
    "user": {
      "id": 1,
      "name": "User Name",
      "email": "user@example.com",
      "role": "applicant"
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
```

#### POST /auth/register
Register new user with automatic `applicant` role.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirmation": "password123",
  "role": "applicant"
}
```

**Response (201):**
```json
{
  "data": {
    "user": {
      "id": 2,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "applicant"
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
```

#### POST /auth/logout
Logout authenticated user.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

#### GET /auth/me
Get current authenticated user.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "name": "User Name",
    "email": "user@example.com",
    "role": "applicant"
  }
}
```

### Projects

#### GET /projects
Get all projects for authenticated applicant.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number |
| per_page | integer | 10 | Items per page |
| status | string | - | Filter by status |
| search | string | - | Search in title |

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Project Title",
      "description": "Description",
      "category": "permohonan",
      "status": "submitted",
      "created_at": "2026-08-02T10:00:00.000000Z",
      "submitted_at": "2026-08-02T11:00:00.000000Z",
      "documents": [...]
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 10,
    "total": 25,
    "last_page": 3
  }
}
```

#### GET /projects/{id}
Get single project details.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "title": "Project Title",
    "description": "Full description",
    "category": "permohonan",
    "status": "submitted",
    "user": {
      "id": 1,
      "name": "Applicant Name",
      "email": "applicant@example.com"
    },
    "documents": [...],
    "reviewNotes": [...],
    "created_at": "2026-08-02T10:00:00.000000Z",
    "submitted_at": "2026-08-02T11:00:00.000000Z"
  }
}
```

#### POST /projects
Create new project (draft).

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body:**
```
title: string
description: string
category: string
documents: File[] (optional)
```

**Response (201):**
```json
{
  "data": {
    "id": 2,
    "title": "New Project",
    "status": "draft",
    ...
  }
}
```

#### POST /projects/{id}
Update project (draft only).

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Response (200):**
```json
{
  "data": { "id": 1, "title": "Updated Title", ... }
}
```

#### POST /projects/{id}/submit
Submit project for review.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "status": "submitted",
    "submitted_at": "2026-08-02T12:00:00.000000Z"
  }
}
```

#### DELETE /projects/{id}
Delete project (draft only).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (204):** No content

### Documents

#### POST /projects/{projectId}/documents
Upload document to project.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body:**
```
document: File (PDF or Excel, max 10MB)
```

**Response (201):**
```json
{
  "data": {
    "id": 1,
    "file_name": "document.pdf",
    "file_size": 1024000,
    "human_file_size": "1 MB",
    "created_at": "2026-08-02T12:00:00.000000Z"
  }
}
```

#### DELETE /documents/{id}
Delete document from project.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (204):** No content

### Reviewer

#### GET /reviewer/projects
Get all projects for reviewer (excluding draft).

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number |
| per_page | integer | 10 | Items per page |
| status | string | - | Filter by status |

**Response:** Same as GET /projects

#### POST /reviewer/projects/{id}/approve
Approve project.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "note": "Approved successfully"
}
```

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "status": "approved",
    "approved_at": "2026-08-02T13:00:00.000000Z"
  }
}
```

#### POST /reviewer/projects/{id}/reject
Reject project.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "reason": "Does not meet requirements"
}
```

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "status": "rejected",
    "rejected_at": "2026-08-02T13:00:00.000000Z"
  }
}
```

#### POST /reviewer/projects/{id}/request-revision
Request revision for project.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "note": "Please update the following sections...",
  "reason": "Missing information"
}
```

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "status": "revision",
    ...
  }
}
```

#### POST /reviewer/projects/{id}/notes
Add review note to project.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "note": "Review comment",
  "type": "revision"
}
```

**Response (201):**
```json
{
  "data": {
    "id": 1,
    "note": "Review comment",
    "type": "revision",
    "reviewer_id": 2,
    "project_id": 1,
    "created_at": "2026-08-02T13:00:00.000000Z"
  }
}
```

### Export

#### GET /export/projects/{id}/pdf
Export single project to PDF.

**Headers:**
```
Authorization: Bearer {token}
Accept: application/pdf
```

**Response (200):** PDF file (binary)

**Error Responses:**
- 403: Not authorized to export
- 404: Project not found
- 500: Export failed

#### GET /export/projects/excel
Export all projects to Excel.

**Headers:**
```
Authorization: Bearer {token}
Accept: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
```

**Response (200):** Excel file (binary)

**Error Responses:**
- 403: Not authorized to export
- 500: Export failed

### Notifications

#### GET /notifications
Get user notifications.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number |
| per_page | integer | 20 | Items per page |

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Project Approved",
      "message": "Your project has been approved",
      "category": "application_approved",
      "is_read": false,
      "data": {
        "project_id": 1
      },
      "created_at": "2026-08-02T14:00:00.000000Z"
    }
  ],
  "meta": { ... }
}
```

#### GET /notifications/stats
Get notification statistics.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "data": {
    "total": 15,
    "unread": 3,
    "read": 12
  }
}
```

#### PUT /notifications/{id}/read
Mark notification as read.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "is_read": true
  }
}
```

#### PUT /notifications/read-all
Mark all notifications as read.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "All notifications marked as read"
}
```

#### DELETE /notifications/{id}
Delete notification.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (204):** No content

## Error Responses

All endpoints return consistent error responses:

### 422 Validation Error
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "field": ["Error message"]
  }
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthenticated"
}
```

### 403 Forbidden
```json
{
  "message": "You do not have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "message": "Internal server error",
  "error": "Error details (in debug mode)"
}
```
