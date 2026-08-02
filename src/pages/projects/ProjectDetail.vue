<template>
  <div class="max-w-4xl mx-auto">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <LoadingSkeleton height="200px" />
    </div>

    <!-- Project Detail -->
    <div v-else-if="project">
      <!-- Header Section -->
      <div class="space-y-4 mb-10">
        <!-- Back Button -->
        <button
          @click="router.push('/projects')"
          class="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeftIcon class="h-4 w-4 mr-2" />
          Back to Projects
        </button>

        <!-- Title & Status -->
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div class="flex-1">
            <div class="flex flex-wrap items-center gap-3">
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {{ project.title }}
              </h1>
              <StatusBadge :status="project.status" />
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Created on {{ formatDate(project.created_at || project.createdAt) }}
            </p>
          </div>

          <!-- Action buttons -->
          <div class="flex flex-wrap items-center gap-2">
            <button
              v-if="canEdit"
              @click="handleEdit"
              class="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <PencilIcon class="h-4 w-4 mr-2" />
              Edit
            </button>
            <button
              v-if="canSubmit"
              @click="handleSubmit"
              :disabled="isSubmitting"
              class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
            >
              <PaperAirplaneIcon class="h-4 w-4 mr-2" />
              {{ isSubmitting ? 'Submitting...' : 'Submit' }}
            </button>
            <button
              v-if="canDelete"
              @click="handleDelete"
              class="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <TrashIcon class="h-4 w-4 mr-2" />
              Delete
            </button>
            <button
              @click="handleExportPDF"
              :disabled="isExportingPDF"
              class="inline-flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <DocumentArrowDownIcon v-if="!isExportingPDF" class="h-4 w-4 mr-2" />
              <svg v-else class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isExportingPDF ? 'Exporting...' : 'Export PDF' }}
            </button>
          </div>
        </div>
      </div>

      <!-- KPI Info Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Category Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-7">
          <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            Category
          </p>
          <p class="text-base font-medium text-gray-900 dark:text-white capitalize">
            {{ project.category }}
          </p>
        </div>

        <!-- Status Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-7">
          <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            Status
          </p>
          <StatusBadge :status="project.status" :label="project.status" />
        </div>

        <!-- Documents Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-7">
          <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            Documents
          </p>
          <p class="text-base font-medium text-gray-900 dark:text-white">
            {{ documents.length }} file(s)
          </p>
        </div>
      </div>

      <!-- Description Card -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 mb-8">
        <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-5">
          Description
        </h2>
        <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
          {{ project.description }}
        </p>
      </div>

      <!-- Supporting Documents Card -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 mb-8">
        <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-5">
          Supporting Documents
        </h2>

        <div v-if="documents.length > 0" class="space-y-3">
          <div
            v-for="doc in documents"
            :key="doc.id"
            class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors"
          >
            <div class="flex items-center gap-3">
              <DocumentIcon class="h-5 w-5 text-gray-400" />
              <div>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {{ doc.file_name || doc.fileName }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ doc.human_file_size || formatFileSize(doc.file_size || doc.fileSize) }}
                </p>
              </div>
            </div>
            <button
              @click="handleDownload(doc)"
              class="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
              title="Download document"
            >
              <ArrowDownTrayIcon class="h-5 w-5" />
            </button>
          </div>
        </div>

        <!-- Compact Empty State -->
        <div
          v-else
          class="min-h-[120px] flex flex-col items-center justify-center text-center py-8 px-4"
        >
          <DocumentIcon class="h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
            No documents uploaded
          </p>
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Supporting documents will appear here
          </p>
        </div>
      </div>

      <!-- Review Notes Card (if any) -->
      <div
        v-if="reviewNotes.length > 0"
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 mb-8"
      >
        <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">
          Review Notes
        </h2>

        <div class="space-y-6">
          <div
            v-for="note in reviewNotes"
            :key="note.id"
            class="rounded-lg border p-6 mt-3"
            :class="getNoteClasses(note.type)"
          >
            <div class="flex items-start justify-between mb-4">
              <div>
                <p class="font-medium" :class="getNoteTitleColor(note.type)">
                  {{ note.reviewerName }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ formatDate(note.createdAt) }}
                </p>
              </div>
              <span
                class="px-2.5 py-1 text-xs font-medium rounded-full border"
                :class="getNoteBadgeClasses(note.type)"
              >
                {{ note.type }}
              </span>
            </div>
            <p class="text-sm leading-relaxed" :class="getNoteTextColor(note.type)">
              {{ note.note }}
            </p>
          </div>
        </div>
      </div>

      <!-- Timeline Card -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
        <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">
          Timeline
        </h2>

        <div class="space-y-5">
          <TimelineItem
            v-if="project.created_at || project.createdAt"
            label="Created"
            :date="project.created_at || project.createdAt"
            :is-first="true"
          />
          <TimelineItem
            v-if="project.submitted_at || project.submittedAt"
            label="Submitted"
            :date="project.submitted_at || project.submittedAt"
          />
          <!-- Review Notes in Timeline -->
          <div
            v-for="note in allReviewNotes"
            :key="note.id"
            class="flex items-start space-x-4"
          >
            <!-- Icon -->
            <div class="flex-shrink-0">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center"
                :class="getNoteIconBgClass(note.type)"
              >
                <ChatBubbleLeftRightIcon class="h-5 w-5" :class="getNoteIconClass(note.type)" />
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ note.reviewer?.name || note.reviewerName || note.reviewer_name || 'Reviewer' }}
                </p>
                <span
                  class="px-2 py-0.5 text-xs font-medium rounded-full"
                  :class="getNoteBadgeClasses(note.type)"
                >
                  {{ note.type_label || note.type }}
                </span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ note.note }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ formatDate(note.created_at || note.createdAt) }}
              </p>
            </div>
          </div>
          <TimelineItem
            v-if="project.approved_at || project.approvedAt"
            label="Approved"
            :date="project.approved_at || project.approvedAt"
            :is-success="true"
          />
          <TimelineItem
            v-if="project.rejected_at || project.rejectedAt"
            label="Rejected"
            :date="project.rejected_at || project.rejectedAt"
            :is-error="true"
          />
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-16">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
        <DocumentIcon class="h-8 w-8 text-gray-400" />
      </div>
      <p class="text-gray-500 dark:text-gray-400 font-medium">Project not found</p>
      <AppButton @click="router.back()" class="mt-6">
        Go Back
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProjectStore } from '@/modules/projects/stores/projectStore'
import { useAuthStore } from '@/modules/auth/stores/authStore'
import type { Project, ProjectDocument } from '@/modules/projects/types/project'
import StatusBadge from '@/components/common/StatusBadge.vue'
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue'
import AppButton from '@/components/common/AppButton.vue'
import TimelineItem from '@/components/projects/TimelineItem.vue'
import { useNotificationStore } from '@/modules/notifications/stores/notificationStore'
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  PaperAirplaneIcon,
  DocumentIcon,
  ArrowDownTrayIcon,
  ChatBubbleLeftRightIcon,
  DocumentArrowDownIcon,
} from '@heroicons/vue/24/outline'
import { showSuccessAlert, showErrorAlert, showConfirmAlert, showToast } from '@/composables/useSweetAlert'
import { useFileExport } from '@/composables/useFileExport'

const router = useRouter()
const route = useRoute()
const projectStore = useProjectStore()
const authStore = useAuthStore()

const project = ref<Project | null>(null)
const loading = ref(true)
const isSubmitting = ref(false)

// File export functionality
const { isExporting: isExportingPDF, errorMessage: exportError, exportPDF } = useFileExport()

// Computed property to combine review notes from both naming conventions
const allReviewNotes = computed(() => {
  const notes = project.value?.review_notes || project.value?.reviewNotes || []
  // Ensure it's always an array
  return Array.isArray(notes) ? notes : []
})

// Safe computed properties with defaults
const safeProject = computed(() => project.value)
const documents = computed(() => project.value?.documents || [])
const reviewNotes = computed(() => project.value?.reviewNotes || [])

const canEdit = computed(() => {
  return project.value &&
         (project.value.status === 'draft' || project.value.status === 'revision') &&
         authStore.isApplicant
})

const canSubmit = computed(() => {
  // For draft and revision status, can submit
  if (project.value?.status === 'draft' && authStore.isApplicant) {
    return true
  }
  if (project.value?.status === 'revision' && authStore.isApplicant) {
    return true
  }
  return false
})

const canDelete = computed(() => {
  return project.value && project.value.status === 'draft' && authStore.isApplicant
})

async function fetchProject() {
  loading.value = true

  try {
    const id = route.params.id as string

    // Check if currentProject in store matches the requested ID
    if (projectStore.currentProject && String(projectStore.currentProject.id) === String(id)) {
      project.value = projectStore.currentProject
    } else {
      // Check temp data from localStorage (fallback for recently created projects)
      const tempProjectData = localStorage.getItem('temp_project_data')
      if (tempProjectData) {
        const tempProject = JSON.parse(tempProjectData)
        if (String(tempProject.id) === String(id)) {
          console.log('Using temp project data from localStorage')
          project.value = tempProject
          return
        }
      }

      // Otherwise fetch from API
      project.value = await projectStore.fetchProjectById(id)
    }

    // Clear temp project data from localStorage if exists
    localStorage.removeItem('temp_project_data')
  } catch (error: any) {
    console.error('Failed to fetch project:', error)

    // If backend fails (500 error), try to use temp data as fallback
    const tempProjectData = localStorage.getItem('temp_project_data')
    if (tempProjectData) {
      const tempProject = JSON.parse(tempProjectData)
      if (String(tempProject.id) === String(id)) {
        console.log('Backend failed, using temp project data as fallback')
        project.value = tempProject
        await showErrorAlert('Warning', 'Loaded project data from cache. Backend may have issues.')
        return
      }
    }

    project.value = null
  } finally {
    loading.value = false
  }
}

function handleEdit() {
  if (!project.value) return
  router.push(`/projects/${project.value.id}/edit`)
}

async function handleSubmit() {
  if (!project.value) return
  const result = await showConfirmAlert(
    'Submit Project',
    'Are you sure you want to submit this project for review?',
    { confirmButtonText: 'Yes, submit it', cancelButtonText: 'Cancel' }
  )
  if (!result.isConfirmed) {
    return
  }

  isSubmitting.value = true
  try {
    await projectStore.submitProject(project.value.id)
    await fetchProject()

    // Refresh notifications to get latest count
    const notificationStore = useNotificationStore()
    await notificationStore.fetchStats()

    await showSuccessAlert('Success', 'Project submitted successfully!')
  } catch (error: any) {
    await showErrorAlert('Error', error.message || 'Failed to submit project')
  } finally {
    isSubmitting.value = false
  }
}

async function handleDelete() {
  if (!project.value) return
  const result = await showConfirmAlert(
    'Delete Project',
    'Are you sure you want to delete this project? This action cannot be undone.',
    { confirmButtonText: 'Yes, delete it', cancelButtonText: 'Cancel', confirmButtonColor: '#EF4444' }
  )
  if (!result.isConfirmed) {
    return
  }

  try {
    await projectStore.deleteProject(project.value.id)
    await showSuccessAlert('Success', 'Project deleted successfully!')
    router.push('/projects')
  } catch (error: any) {
    await showErrorAlert('Error', error.message || 'Failed to delete project')
  }
}

function handleDownload(doc: ProjectDocument) {
  // Use backend download URL if available, otherwise mock download
  const downloadUrl = doc.download_url || doc.downloadUrl || doc.url
  const fileName = doc.file_name || doc.fileName

  if (downloadUrl) {
    // Open download URL in new tab
    window.open(downloadUrl, '_blank')
    showToast(`Downloading ${fileName}...`, 'success')
  } else {
    showToast('Download not available for this document', 'warning')
  }
}

async function handleExportPDF() {
  if (!project.value) return

  const filename = `${project.value.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_project.pdf`
  await exportPDF(project.value.id, filename)
}

function formatDate(dateString: string): string {
  if (!dateString) return 'Invalid Date'

  try {
    // Parse the datetime string directly without timezone conversion
    // Backend sends in WIB format: "2026-08-02 06:38:45"
    const dateMatch = dateString.match(/(\d{4})-(\d{2})-(\d{2})[\sT](\d{2}):(\d{2}):(\d{2})/)

    if (dateMatch) {
      const [, year, month, day, hour, minute] = dateMatch
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                         'July', 'August', 'September', 'October', 'November', 'December']

      const monthName = monthNames[parseInt(month) - 1]
      const hour24 = parseInt(hour)
      const minuteFormatted = minute

      return `${monthName} ${parseInt(day)}, ${year} at ${hour24.toString().padStart(2, '0')}:${minuteFormatted} WIB`
    }

    // Fallback for other formats
    return dateString
  } catch {
    return dateString || 'Invalid Date'
  }
}

function getNoteBadgeClasses(type: string): string {
  const classes: Record<string, string> = {
    info: 'bg-blue-100/80 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-700',
    revision: 'bg-orange-100/80 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 border-orange-200 dark:border-orange-700',
    approval: 'bg-green-100/80 text-green-700 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-700',
    rejection: 'bg-rose-100/80 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 border-rose-200 dark:border-rose-700',
  }
  return classes[type] || classes.info
}

function getNoteIconBgClass(type: string): string {
  const classes: Record<string, string> = {
    info: 'bg-blue-100 dark:bg-blue-900/30',
    revision: 'bg-orange-100 dark:bg-orange-900/30',
    approval: 'bg-green-100 dark:bg-green-900/30',
    rejection: 'bg-rose-100 dark:bg-rose-900/30',
  }
  return classes[type] || classes.info
}

function getNoteIconClass(type: string): string {
  const classes: Record<string, string> = {
    info: 'text-blue-600 dark:text-blue-400',
    revision: 'text-orange-600 dark:text-orange-400',
    approval: 'text-green-600 dark:text-green-400',
    rejection: 'text-rose-600 dark:text-rose-400',
  }
  return classes[type] || classes.info
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

function getNoteClasses(type: string): string {
  const classes: Record<string, string> = {
    info: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
    revision: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800',
    approval: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
    rejection: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800',
  }
  return classes[type] || classes.info
}

function getNoteTitleColor(type: string): string {
  const colors: Record<string, string> = {
    info: 'text-blue-900 dark:text-blue-200',
    revision: 'text-orange-900 dark:text-orange-200',
    approval: 'text-green-900 dark:text-green-200',
    rejection: 'text-rose-900 dark:text-rose-200',
  }
  return colors[type] || colors.info
}

function getNoteTextColor(type: string): string {
  const colors: Record<string, string> = {
    info: 'text-gray-700 dark:text-gray-300',
    revision: 'text-gray-700 dark:text-gray-300',
    approval: 'text-gray-700 dark:text-gray-300',
    rejection: 'text-gray-700 dark:text-gray-300',
  }
  return colors[type] || colors.info
}

onMounted(() => {
  fetchProject()
})
</script>
