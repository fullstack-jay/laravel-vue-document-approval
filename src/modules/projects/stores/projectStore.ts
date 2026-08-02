import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { projectService } from '../services/projectService'
import type {
  Project,
  ProjectListItem,
  ProjectFormData,
  ProjectFilter,
  ProjectStatus,
} from '../types/project'

/**
 * Project Store - Manages project state and operations
 */
export const useProjectStore = defineStore('projects', () => {
  // State
  const projects = ref<ProjectListItem[]>([])
  const currentProject = ref<Project | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filter = ref<ProjectFilter>({})
  const pagination = ref({
    currentPage: 1,
    perPage: 10,
    total: 0,
    lastPage: 1,
  })

  // Track locally deleted projects to handle backend sync issues
  const locallyDeletedIds = ref<Set<string>>(new Set())

  // Getters
  const draftProjects = computed(() =>
    projects.value.filter(p => p.status === 'draft')
  )

  const submittedProjects = computed(() =>
    projects.value.filter(p => p.status === 'submitted')
  )

  const revisionProjects = computed(() =>
    projects.value.filter(p => p.status === 'revision')
  )

  const approvedProjects = computed(() =>
    projects.value.filter(p => p.status === 'approved')
  )

  const rejectedProjects = computed(() =>
    projects.value.filter(p => p.status === 'rejected')
  )

  const totalProjects = computed(() => pagination.value.total)

  const statsByStatus = computed(() => ({
    draft: draftProjects.value.length,
    submitted: submittedProjects.value.length,
    revision: revisionProjects.value.length,
    approved: approvedProjects.value.length,
    rejected: rejectedProjects.value.length,
  }))

  // Actions

  /**
   * Fetch all projects for applicant
   */
  async function fetchProjects(params?: ProjectFilter) {
    loading.value = true
    error.value = null

    try {
      const response = await projectService.getProjects(params)

      // Filter out locally deleted projects to handle backend sync issues
      const filteredProjects = response.data.filter(p => !locallyDeletedIds.value.has(p.id))

      projects.value = filteredProjects
      pagination.value = {
        ...response.meta,
        total: filteredProjects.length
      }
      filter.value = params || {}
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch projects'
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch projects for reviewer
   */
  async function fetchReviewerProjects(params?: ProjectFilter) {
    loading.value = true
    error.value = null

    try {
      const response = await projectService.getReviewerProjects(params)

      projects.value = response.data
      pagination.value = response.meta
      filter.value = params || {}
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch projects'
      console.error('Fetch reviewer projects error:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch project detail by ID
   */
  async function fetchProjectById(id: string) {
    loading.value = true
    error.value = null

    try {
      currentProject.value = await projectService.getProjectById(id)
      return currentProject.value
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch project'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Create new project
   */
  async function createProject(data: ProjectFormData) {
    loading.value = true
    error.value = null

    try {
      const newProject = await projectService.createProject(data)

      // Add to local state
      const listItem = {
        id: newProject.id,
        title: newProject.title,
        category: newProject.category,
        status: newProject.status,
        createdAt: newProject.createdAt,
        updatedAt: newProject.updatedAt,
        documentCount: newProject.documents?.length || 0,
      }

      projects.value.unshift(listItem)
      pagination.value.total++

      currentProject.value = newProject

      return newProject
    } catch (err: any) {
      error.value = err.message || 'Failed to create project'
            throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update project
   */
  async function updateProject(id: string, data: Partial<ProjectFormData>) {
    loading.value = true
    error.value = null

    try {
      const updatedProject = await projectService.updateProject(id, data)

      // Update in local state
      const index = projects.value.findIndex(p => p.id === id)
      if (index !== -1) {
        projects.value[index] = {
          ...projects.value[index],
          title: updatedProject.title,
          category: updatedProject.category,
          updatedAt: updatedProject.updatedAt,
        }
      }

      currentProject.value = updatedProject

      return updatedProject
    } catch (err: any) {
      error.value = err.message || 'Failed to update project'
            throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Submit project for review
   */
  async function submitProject(id: string) {
    loading.value = true
    error.value = null

    try {
      const submittedProject = await projectService.submitProject(id)

      // Update in local state
      const index = projects.value.findIndex(p => p.id === id)
      if (index !== -1) {
        projects.value[index] = {
          ...projects.value[index],
          status: submittedProject.status,
          updatedAt: submittedProject.updatedAt,
          submittedAt: submittedProject.submittedAt,
        }
      }

      currentProject.value = submittedProject

      return submittedProject
    } catch (err: any) {
      error.value = err.message || 'Failed to submit project'
      console.error('Submit project error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete project
   */
  async function deleteProject(id: string) {
    loading.value = true
    error.value = null

    try {
      await projectService.deleteProject(id)

      // Add to locally deleted set to handle backend sync issues
      locallyDeletedIds.value.add(id)

      // Remove from local state
      projects.value = projects.value.filter(p => p.id !== id)
      pagination.value.total = Math.max(0, pagination.value.total - 1)

      if (currentProject.value?.id === id) {
        currentProject.value = null
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete project'

      // If project not found (404), it means it's already deleted
      // Remove from local state to sync with backend reality
      if (err.message?.includes('not found') || err.message?.includes('already deleted')) {
        // Still add to locally deleted set
        locallyDeletedIds.value.add(id)

        projects.value = projects.value.filter(p => p.id !== id)
        pagination.value.total = Math.max(0, pagination.value.total - 1)

        // Don't throw error for this case
        return
      }

      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update project status (reviewer action)
   */
  async function updateProjectStatus(
    id: string,
    status: ProjectStatus,
    note?: string
  ) {
    loading.value = true
    error.value = null

    try {
      const updatedProject = await projectService.updateProjectStatus(id, status, note)

      // Update in local state
      const index = projects.value.findIndex(p => p.id === id)
      if (index !== -1) {
        projects.value[index] = {
          ...projects.value[index],
          status: updatedProject.status,
          updatedAt: updatedProject.updatedAt,
        }
      }

      currentProject.value = updatedProject

      return updatedProject
    } catch (err: any) {
      error.value = err.message || 'Failed to update project status'
      console.error('Update project status error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Set filter
   */
  function setFilter(newFilter: ProjectFilter) {
    filter.value = { ...filter.value, ...newFilter }
  }

  /**
   * Reset filter
   */
  function resetFilter() {
    filter.value = {}
  }

  /**
   * Clear current project
   */
  function clearCurrentProject() {
    currentProject.value = null
  }

  /**
   * Clear error
   */
  function clearError() {
    error.value = null
  }

  return {
    // State
    projects,
    currentProject,
    loading,
    error,
    filter,
    pagination,

    // Getters
    draftProjects,
    submittedProjects,
    revisionProjects,
    approvedProjects,
    rejectedProjects,
    totalProjects,
    statsByStatus,

    // Actions
    fetchProjects,
    fetchReviewerProjects,
    fetchProjectById,
    createProject,
    updateProject,
    submitProject,
    deleteProject,
    updateProjectStatus,
    setFilter,
    resetFilter,
    clearCurrentProject,
    clearError,
  }
})
