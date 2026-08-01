import { mockProjects, mockReviewerProjects, getProjectListItems } from '@/services/mock/projectData'
import type {
  Project,
  ProjectListItem,
  ProjectFormData,
  ProjectFilter,
  PaginatedProjects,
  ProjectStatus,
} from '../types/project'

/**
 * Project Service - Handles all project-related operations
 * Mock API implementation for development
 */
export const projectService = {
  /**
   * Get all projects for the current user (applicant view)
   */
  async getProjects(filter?: ProjectFilter): Promise<PaginatedProjects> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    let projects = [...mockProjects]

    // Apply filters
    if (filter?.status) {
      projects = projects.filter(p => p.status === filter.status)
    }
    if (filter?.category) {
      projects = projects.filter(p => p.category === filter.category)
    }
    if (filter?.search) {
      const searchLower = filter.search.toLowerCase()
      projects = projects.filter(p =>
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      )
    }

    // Sort by updated date (newest first)
    projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

    return {
      data: getProjectListItems(projects),
      meta: {
        currentPage: 1,
        perPage: 10,
        total: projects.length,
        lastPage: Math.ceil(projects.length / 10),
      },
    }
  },

  /**
   * Get projects for reviewer (excluding draft)
   */
  async getReviewerProjects(filter?: ProjectFilter): Promise<PaginatedProjects> {
    await new Promise(resolve => setTimeout(resolve, 500))

    let projects = [...mockReviewerProjects]

    if (filter?.status) {
      projects = projects.filter(p => p.status === filter.status)
    }
    if (filter?.search) {
      const searchLower = filter.search.toLowerCase()
      projects = projects.filter(p =>
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      )
    }

    projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

    return {
      data: getProjectListItems(projects),
      meta: {
        currentPage: 1,
        perPage: 10,
        total: projects.length,
        lastPage: Math.ceil(projects.length / 10),
      },
    }
  },

  /**
   * Get project detail by ID
   */
  async getProjectById(id: string): Promise<Project> {
    await new Promise(resolve => setTimeout(resolve, 300))

    const project = mockProjects.find(p => p.id === id) ||
                   mockReviewerProjects.find(p => p.id === id)

    if (!project) {
      throw new Error('Project not found')
    }

    return project
  },

  /**
   * Create new project
   */
  async createProject(data: ProjectFormData): Promise<Project> {
    await new Promise(resolve => setTimeout(resolve, 800))

    // Convert File objects to document metadata
    const documents = data.documents.map((file, index) => ({
      id: `doc${Date.now()}_${index}`,
      projectId: '', // Will be set after project creation
      fileName: file.name,
      fileType: file.type.split('/')[1] as 'pdf' | 'doc' | 'docx',
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      url: `/documents/${file.name}`, // Mock URL
    }))

    const newProject: Project = {
      id: Math.random().toString(36).substring(7),
      userId: '1', // Mock current user ID
      title: data.title,
      description: data.description,
      category: data.category,
      status: 'draft',
      documents,
      reviewNotes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Update project IDs in documents
    documents.forEach(doc => {
      doc.projectId = newProject.id
    })

    mockProjects.unshift(newProject)

    return newProject
  },

  /**
   * Update project (only draft status)
   */
  async updateProject(id: string, data: Partial<ProjectFormData>): Promise<Project> {
    await new Promise(resolve => setTimeout(resolve, 600))

    const projectIndex = mockProjects.findIndex(p => p.id === id)
    if (projectIndex === -1) {
      throw new Error('Project not found')
    }

    const project = mockProjects[projectIndex]

    if (project.status !== 'draft') {
      throw new Error('Can only edit draft projects')
    }

    // Update fields
    if (data.title) project.title = data.title
    if (data.description) project.description = data.description
    if (data.category) project.category = data.category
    project.updatedAt = new Date().toISOString()

    mockProjects[projectIndex] = project

    return project
  },

  /**
   * Submit project for review
   */
  async submitProject(id: string): Promise<Project> {
    await new Promise(resolve => setTimeout(resolve, 800))

    const projectIndex = mockProjects.findIndex(p => p.id === id)
    if (projectIndex === -1) {
      throw new Error('Project not found')
    }

    const project = mockProjects[projectIndex]

    if (project.status !== 'draft' && project.status !== 'revision') {
      throw new Error('Can only submit draft or revision projects')
    }

    project.status = 'submitted'
    project.submittedAt = new Date().toISOString()
    project.updatedAt = new Date().toISOString()

    mockProjects[projectIndex] = project

    return project
  },

  /**
   * Delete project (only draft status)
   */
  async deleteProject(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400))

    const projectIndex = mockProjects.findIndex(p => p.id === id)
    if (projectIndex === -1) {
      throw new Error('Project not found')
    }

    const project = mockProjects[projectIndex]

    if (project.status !== 'draft') {
      throw new Error('Can only delete draft projects')
    }

    mockProjects.splice(projectIndex, 1)
  },

  /**
   * Upload document to project
   */
  async uploadDocument(projectId: string, file: File): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock upload - in real implementation, would upload to server
    console.log(`Uploading file ${file.name} to project ${projectId}`)
  },

  /**
   * Delete document from project
   */
  async deleteDocument(projectId: string, documentId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400))

    const project = mockProjects.find(p => p.id === projectId)
    if (!project) {
      throw new Error('Project not found')
    }

    project.documents = project.documents.filter(d => d.id !== documentId)
  },

  /**
   * Add review note (reviewer only)
   */
  async addReviewNote(projectId: string, note: string, type: 'revision' | 'approval' | 'rejection'): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500))

    const project = mockReviewerProjects.find(p => p.id === projectId)
    if (!project) {
      throw new Error('Project not found')
    }

    project.reviewNotes.push({
      id: Math.random().toString(36).substring(7),
      projectId,
      reviewerId: '2', // Mock reviewer ID
      reviewerName: 'Reviewer User',
      note,
      type,
      createdAt: new Date().toISOString(),
    })
  },

  /**
   * Update project status (reviewer only)
   */
  async updateProjectStatus(
    id: string,
    status: ProjectStatus,
    note?: string
  ): Promise<Project> {
    await new Promise(resolve => setTimeout(resolve, 600))

    const projectIndex = mockReviewerProjects.findIndex(p => p.id === id)
    if (projectIndex === -1) {
      throw new Error('Project not found')
    }

    const project = mockReviewerProjects[projectIndex]
    const now = new Date().toISOString()

    project.status = status
    project.reviewedAt = now
    project.updatedAt = now

    if (status === 'approved') {
      project.approvedAt = now
    } else if (status === 'rejected') {
      project.rejectedAt = now
    }

    // Add review note if provided
    if (note) {
      const noteType = status === 'approved' ? 'approval' : status === 'rejected' ? 'rejection' : 'revision'
      project.reviewNotes.push({
        id: Math.random().toString(36).substring(7),
        projectId: id,
        reviewerId: '2',
        reviewerName: 'Reviewer User',
        note,
        type: noteType,
        createdAt: now,
      })
    }

    mockReviewerProjects[projectIndex] = project

    return project
  },
}
