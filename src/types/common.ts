export interface ApiResponse<T = any> {
  data: T
  message: string
  status: number
}

export interface PaginationMeta {
  currentPage: number
  perPage: number
  total: number
  lastPage: number
}

export interface SelectOption {
  label: string
  value: string | number
}

export type StatusType = 'draft' | 'submitted' | 'revision' | 'approved' | 'rejected' | 'created'

export type UserRole = 'applicant' | 'reviewer' | 'admin'
