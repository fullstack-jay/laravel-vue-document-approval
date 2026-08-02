import axios from 'axios'
import type {
  Project,
  ProjectListItem,
  ProjectFormData,
  ProjectFilter,
  PaginatedProjects,
  ProjectStatus,
  Document,
} from '../types/project'

// Create axios instance for project API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  timeout: 15000, // Longer timeout for file uploads
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user_data')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

/**
 * Project Service - Handles all project-related operations
 * Connected to Laravel backend API
 */
export const projectService = {
  /**
   * Get all projects for the current user (applicant view)
   */
  async getProjects(filter?: ProjectFilter): Promise<PaginatedProjects> {
    try {
      const params: Record<string, any> = {}

      if (filter?.status) params.status = filter.status
      if (filter?.category) params.category = filter.category
      if (filter?.search) params.search = filter.search
      if (filter?.page) params.page = filter.page
      if (filter?.perPage) params.per_page = filter.perPage

      const response = await api.get('/api/v1/projects', { params })

      const projects = response.data.data || response.data.projects || []
      const meta = response.data.meta || {}

      return {
        data: projects,
        meta: {
          currentPage: meta.current_page || response.data.current_page || 1,
          perPage: meta.per_page || response.data.per_page || 10,
          total: meta.total || response.data.total || projects.length,
          lastPage: meta.last_page || response.data.last_page || 1,
        },
      }
    } catch (error: any) {
      console.error('❌ Fetch projects error:', error)
      const message = error.response?.data?.message ||
                     error.response?.data?.error ||
                     error.message ||
                     'Failed to fetch projects'
      throw new Error(message)
    }
  },

  /**
   * Get projects for reviewer (excluding draft)
   */
  async getReviewerProjects(filter?: ProjectFilter): Promise<PaginatedProjects> {
    try {
      const params: Record<string, any> = {}

      if (filter?.status) params.status = filter.status
      if (filter?.search) params.search = filter.search
      if (filter?.page) params.page = filter.page

      // Always set per_page to enable pagination
      // Use filter.perPage if provided, otherwise default to 10
      params.per_page = filter?.perPage || 10

      const response = await api.get('/api/v1/reviewer/projects', { params })

      // Debug: log detailed pagination info
      console.log('Reviewer projects response:', response.data)
      console.log('Meta details:', response.data.meta)
      console.log('Last page:', response.data.meta?.last_page)

      const projects = response.data.data || response.data.projects || []
      const meta = response.data.meta || {}

      return {
        data: projects,
        meta: {
          currentPage: meta.current_page || response.data.current_page || 1,
          perPage: meta.per_page || response.data.per_page || 10,
          total: meta.total || response.data.total || 0,
          lastPage: meta.last_page || response.data.last_page || 1,
        },
      }
    } catch (error: any) {
      const message = error.response?.data?.message ||
                     error.response?.data?.error ||
                     error.message ||
                     'Failed to fetch reviewer projects'
      throw new Error(message)
    }
  },

  /**
   * Get project detail by ID
   */
  async getProjectById(id: string): Promise<Project> {
    try {
      const response = await api.get(`/api/v1/projects/${id}`)
      const project = response.data.data || response.data

      // Ensure documents array exists
      if (!project.documents) {
        project.documents = []
      }

      // Ensure reviewNotes array exists
      if (!project.reviewNotes) {
        project.reviewNotes = []
      }

      return project
    } catch (error: any) {
      const message = error.response?.data?.message ||
                     error.response?.data?.error ||
                     error.message ||
                     'Project not found'
      throw new Error(message)
    }
  },

  /**
   * Get project detail for reviewer
   */
  async getProjectForReview(id: string): Promise<Project> {
    try {
      const response = await api.get(`/api/v1/reviewer/projects/${id}`)
      return response.data.data || response.data
    } catch (error: any) {
      const message = error.response?.data?.message ||
                     error.response?.data?.error ||
                     error.message ||
                     'Project not found'
      throw new Error(message)
    }
  },

  /**
   * Create new project
   */
  async createProject(data: ProjectFormData): Promise<Project> {
    try {
      // Create FormData for file upload
      const formData = new FormData()

      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('category', data.category)

      // Don't append documents in create request - they'll be uploaded separately

      const response = await api.post('/api/v1/projects', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const result = response.data.data || response.data

      // Ensure documents array exists
      if (!result.documents) {
        result.documents = []
      }

      return result
    } catch (error: any) {
      const message = error.response?.data?.message ||
                     error.response?.data?.error ||
                     error.message ||
                     'Failed to create project'
      throw new Error(message)
    }
  },

  /**
   * Update project (only draft status)
   */
  async updateProject(id: string, data: Partial<ProjectFormData>): Promise<Project> {
    try {
      const formData = new FormData()

      if (data.title) formData.append('title', data.title)
      if (data.description) formData.append('description', data.description)
      if (data.category) formData.append('category', data.category)

      // Append new documents if any
      if (data.documents && data.documents.length > 0) {
        data.documents.forEach((file) => {
          if (file instanceof File) {
            formData.append('documents[]', file)
          }
        })
      }

      const response = await api.post(`/api/v1/projects/${id}?_method=PUT`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return response.data.data || response.data
    } catch (error: any) {
      const message = error.response?.data?.message ||
                     error.response?.data?.error ||
                     error.message ||
                     'Failed to update project'
      throw new Error(message)
    }
  },

  /**
   * Submit project for review
   */
  async submitProject(id: string): Promise<Project> {
    try {
      const response = await api.post(`/api/v1/projects/${id}/submit`)
      return response.data.data || response.data
    } catch (error: any) {
      const message = error.response?.data?.message ||
                     error.response?.data?.error ||
                     error.message ||
                     'Failed to submit project'
      throw new Error(message)
    }
  },

  /**
   * Delete project (only draft status)
   */
  async deleteProject(id: string): Promise<void> {
    try {
      await api.delete(`/api/v1/projects/${id}`)
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 404) {
        throw new Error('Project not found. It may have been already deleted.')
      }
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to delete this project.')
      }
      if (error.response?.status === 422) {
        throw new Error('Cannot delete project. It may not be in draft status.')
      }

      const message = error.response?.data?.message ||
                     error.response?.data?.error ||
                     error.message ||
                     'Failed to delete project'
      throw new Error(message)
    }
  },

  /**
   * Upload document to project
   */
  async uploadDocument(projectId: string, file: File): Promise<Document> {
    try {
      const formData = new FormData()
      formData.append('document', file)

      const response = await api.post(`/api/v1/projects/${projectId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return response.data.data || response.data
    } catch (error: any) {
      const message = error.response?.data?.message ||
                     error.response?.data?.error ||
                     error.message ||
                     'Failed to upload document'
      throw new Error(message)
    }
  },

  /**
   * Delete document from project
   */
  async deleteDocument(projectId: string, documentId: string): Promise<void> {
    try {
      await api.delete(`/api/v1/documents/${documentId}`)
    } catch (error: any) {
      const message = error.response?.data?.message ||
                     error.response?.data?.error ||
                     error.message ||
                     'Failed to delete document'
      throw new Error(message)
    }
  },

  /**
   * Add review note (reviewer only)
   */
  async addReviewNote(projectId: string, note: string, type: 'revision' | 'approval' | 'rejection'): Promise<void> {
    try {
      await api.post(`/api/v1/reviewer/projects/${projectId}/notes`, {
        note,
        type,
      })
    } catch (error: any) {
      const message = error.response?.data?.message ||
                     error.response?.data?.error ||
                     error.message ||
                     'Failed to add review note'
      throw new Error(message)
    }
  },

  /**
   * Update project status (reviewer only)
   */
  async updateProjectStatus(
    id: string,
    status: ProjectStatus,
    note?: string
  ): Promise<Project> {
    try {
      let endpoint = `/api/v1/reviewer/projects/${id}`
      let body: any = {}

      // Determine the appropriate endpoint based on status and request body
      if (status === 'approved') {
        endpoint = `/api/v1/reviewer/projects/${id}/approve`
        body = note ? { note } : {}
      } else if (status === 'rejected') {
        endpoint = `/api/v1/reviewer/projects/${id}/reject`
        // Backend expects 'reason' for reject endpoint
        body = note ? { reason: note } : {}
      } else if (status === 'revision') {
        endpoint = `/api/v1/reviewer/projects/${id}/request-revision`
        body = note ? { note, reason: note } : {}
      }

      const response = await api.post(endpoint, body)

      return response.data.data || response.data
    } catch (error: any) {
      const message = error.response?.data?.message ||
                     error.response?.data?.error ||
                     error.message ||
                     'Failed to update project status'
      throw new Error(message)
    }
  },
}
