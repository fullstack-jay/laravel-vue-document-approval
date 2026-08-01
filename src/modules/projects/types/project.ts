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
  id: string
  projectId: string
  fileName: string
  fileType: 'pdf' | 'doc' | 'docx'
  fileSize: number // in bytes
  uploadedAt: string
  url: string
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
  title: string
  description: string
  category: ProjectCategory
  status: ProjectStatus
  documents: ProjectDocument[]
  reviewNotes: ReviewNote[]
  submittedAt?: string
  reviewedAt?: string
  approvedAt?: string
  rejectedAt?: string
  createdAt: string
  updatedAt: string
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
  updatedAt: string
  submittedAt?: string
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
