/**
 * Project/Application types based on WORKFLOW.md requirements
 * Document Approval Management System
 */

// Status workflow: Draft → Submitted → Review → (Approved / Revision / Rejected)
export type ProjectStatus = 'draft' | 'submitted' | 'revision' | 'approved' | 'rejected'

export type ProjectCategory = 'permohonan' | 'pengajuan' | 'permintaan' | 'lainnya'

/**
 * Document file type
 */
export interface ProjectDocument {
  id: string | number
  projectId: string | number
  fileName: string
  file_name: string // Backend uses snake_case
  fileType: 'pdf' | 'doc' | 'docx'
  file_type: string // Backend uses snake_case
  fileSize: number // in bytes
  file_size: number // Backend uses snake_case
  human_file_size?: string // Backend provides human-readable size
  filePath?: string
  file_path?: string // Backend uses snake_case
  downloadUrl?: string
  download_url?: string // Backend uses snake_case
  icon?: string
  uploadedAt: string
  uploaded_at?: string // Backend uses snake_case
  url?: string
  createdAt?: string
  created_at?: string // Backend uses snake_case
}

/**
 * Review note from reviewer
 */
export interface ReviewNote {
  id: string
  projectId: string
  reviewerId: string
  reviewerName: string
  note: string
  type: 'info' | 'revision' | 'approval' | 'rejection'
  createdAt: string
}

/**
 * Main Project/Application entity
 */
export interface Project {
  id: string
  userId: string // applicant ID
  user_id?: string // Backend uses snake_case
  title: string
  description: string
  category: ProjectCategory
  status: ProjectStatus
  documents: ProjectDocument[]
  reviewNotes: ReviewNote[]
  submittedAt?: string
  submitted_at?: string // Backend uses snake_case
  reviewedAt?: string
  reviewed_at?: string // Backend uses snake_case
  approvedAt?: string
  approved_at?: string // Backend uses snake_case
  rejectedAt?: string
  rejected_at?: string // Backend uses snake_case
  createdAt: string
  created_at?: string // Backend uses snake_case
  updatedAt: string
  updated_at?: string // Backend uses snake_case
}

/**
 * Form data for creating/updating project
 */
export interface ProjectFormData {
  title: string
  description: string
  category: ProjectCategory
  documents: File[]
}

/**
 * Project list item (summary)
 */
export interface ProjectListItem {
  id: string
  title: string
  category: ProjectCategory
  status: ProjectStatus
  createdAt: string
  created_at?: string // Backend uses snake_case
  updatedAt: string
  updated_at?: string // Backend uses snake_case
  submittedAt?: string
  submitted_at?: string // Backend uses snake_case
  documentCount: number
}

/**
 * Filter options for project list
 */
export interface ProjectFilter {
  status?: ProjectStatus
  category?: ProjectCategory
  search?: string
}

/**
 * Pagination meta
 */
export interface PaginationMeta {
  currentPage: number
  perPage: number
  total: number
  lastPage: number
}

/**
 * Paginated response
 */
export interface PaginatedProjects {
  data: ProjectListItem[]
  meta: PaginationMeta
}
