<template>
  <div class="max-w-4xl mx-auto space-y-8">
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
          @click="router.back()"
          class="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeftIcon class="h-4 w-4 mr-2" />
          Back to Review Queue
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
              Submitted on {{ formatDate(project.submittedAt || project.createdAt) }}
            </p>
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
            {{ project.documents.length }} file(s)
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

        <div v-if="project.documents.length > 0" class="space-y-3">
          <div
            v-for="doc in project.documents"
            :key="doc.id"
            class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors"
          >
            <div class="flex items-center gap-3">
              <DocumentIcon class="h-5 w-5 text-gray-400" />
              <div>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {{ doc.fileName }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatFileSize(doc.fileSize) }}
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

        <!-- Empty State -->
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

      <!-- Existing Review Notes Card -->
      <div
        v-if="project.reviewNotes.length > 0"
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 mb-8"
      >
        <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">
          Review History
        </h2>

        <div class="space-y-6">
          <div
            v-for="note in project.reviewNotes"
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
            <p class="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {{ note.note }}
            </p>
          </div>
        </div>
      </div>

      <!-- Review Actions Card -->
      <div
        v-if="canReview"
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 mb-8"
      >
        <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">
          Review & Decision
        </h2>

        <form @submit.prevent="handleReviewAction" class="space-y-6">
          <!-- Review Notes -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Review Notes <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="reviewForm.note"
              rows="5"
              required
              placeholder="Provide detailed review notes, feedback, or reasons for your decision..."
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              :class="{ 'border-red-500': errors.note }"
            />
            <p v-if="errors.note" class="text-sm text-red-600 dark:text-red-400">
              {{ errors.note }}
            </p>
          </div>

          <!-- Decision Type -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Decision <span class="text-red-500">*</span>
            </label>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Approval Option -->
              <label
                class="relative flex cursor-pointer"
                :class="{ 'opacity-50': reviewForm.decision !== 'approval' }"
              >
                <input
                  type="radio"
                  v-model="reviewForm.decision"
                  value="approval"
                  class="sr-only"
                />
                <div
                  class="w-full rounded-lg border-2 p-4 text-center transition-all"
                  :class="reviewForm.decision === 'approval'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-green-300'"
                >
                  <CheckCircleIcon class="h-8 w-8 mx-auto mb-2" :class="reviewForm.decision === 'approval' ? 'text-green-600' : 'text-gray-400'" />
                  <p class="text-sm font-medium" :class="reviewForm.decision === 'approval' ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'">
                    Approve
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    Accept this application
                  </p>
                </div>
              </label>

              <!-- Revision Option -->
              <label
                class="relative flex cursor-pointer"
                :class="{ 'opacity-50': reviewForm.decision !== 'revision' }"
              >
                <input
                  type="radio"
                  v-model="reviewForm.decision"
                  value="revision"
                  class="sr-only"
                />
                <div
                  class="w-full rounded-lg border-2 p-4 text-center transition-all"
                  :class="reviewForm.decision === 'revision'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'"
                >
                  <ArrowPathIcon class="h-8 w-8 mx-auto mb-2" :class="reviewForm.decision === 'revision' ? 'text-orange-600' : 'text-gray-400'" />
                  <p class="text-sm font-medium" :class="reviewForm.decision === 'revision' ? 'text-orange-700 dark:text-orange-300' : 'text-gray-600 dark:text-gray-400'">
                    Request Revision
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    Ask for corrections
                  </p>
                </div>
              </label>

              <!-- Rejection Option -->
              <label
                class="relative flex cursor-pointer"
                :class="{ 'opacity-50': reviewForm.decision !== 'rejection' }"
              >
                <input
                  type="radio"
                  v-model="reviewForm.decision"
                  value="rejection"
                  class="sr-only"
                />
                <div
                  class="w-full rounded-lg border-2 p-4 text-center transition-all"
                  :class="reviewForm.decision === 'rejection'
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-red-300'"
                >
                  <XCircleIcon class="h-8 w-8 mx-auto mb-2" :class="reviewForm.decision === 'rejection' ? 'text-red-600' : 'text-gray-400'" />
                  <p class="text-sm font-medium" :class="reviewForm.decision === 'rejection' ? 'text-red-700 dark:text-red-300' : 'text-gray-600 dark:text-gray-400'">
                    Reject
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    Decline this application
                  </p>
                </div>
              </label>
            </div>
            <p v-if="errors.decision" class="text-sm text-red-600 dark:text-red-400 mt-1">
              {{ errors.decision }}
            </p>
          </div>

          <!-- Error message -->
          <div
            v-if="errorMessage"
            class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 pt-4">
            <AppButton
              type="submit"
              :loading="isSubmitting"
              size="lg"
              class="flex-1"
            >
              Submit Review
            </AppButton>
            <AppButton
              type="button"
              variant="ghost"
              @click="handleCancel"
              size="lg"
            >
              Cancel
            </AppButton>
          </div>
        </form>
      </div>

      <!-- Already Reviewed Notice -->
      <div
        v-else
        class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-8 mb-8"
      >
        <div class="flex items-start gap-4">
          <InformationCircleIcon class="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 class="text-base font-medium text-blue-900 dark:text-blue-200 mb-1">
              Review Completed
            </h3>
            <p class="text-sm text-blue-700 dark:text-blue-300">
              This application has already been reviewed. The current status is
              <span class="font-semibold">{{ project.status }}</span>.
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
            label="Created"
            :date="project.createdAt"
            :is-first="true"
          />
          <TimelineItem
            v-if="project.submittedAt"
            label="Submitted"
            :date="project.submittedAt"
          />
          <TimelineItem
            v-if="project.reviewedAt"
            label="Reviewed"
            :date="project.reviewedAt"
          />
          <TimelineItem
            v-if="project.approvedAt"
            label="Approved"
            :date="project.approvedAt"
            :is-success="true"
          />
          <TimelineItem
            v-if="project.rejectedAt"
            label="Rejected"
            :date="project.rejectedAt"
            :is-error="true"
          />
        </div>
      </div>
    </div>

    <!-- Error -->
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProjectStore } from '@/modules/projects/stores/projectStore'
import { useAuthStore } from '@/modules/auth/stores/authStore'
import type { Project, ProjectDocument } from '@/modules/projects/types/project'
import StatusBadge from '@/components/common/StatusBadge.vue'
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue'
import AppButton from '@/components/common/AppButton.vue'
import TimelineItem from '@/components/projects/TimelineItem.vue'
import {
  ArrowLeftIcon,
  DocumentIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  XCircleIcon,
  InformationCircleIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const projectStore = useProjectStore()
const authStore = useAuthStore()

const project = ref<Project | null>(null)
const loading = ref(true)
const isSubmitting = ref(false)

// Review form
const reviewForm = reactive({
  note: '',
  decision: '' as 'approval' | 'revision' | 'rejection',
})

const errors = ref<Record<string, string>>({})
const errorMessage = ref('')

// Can review if user is reviewer and project is submitted/revision
const canReview = computed(() => {
  return project.value &&
         authStore.isReviewer &&
         (project.value.status === 'submitted' || project.value.status === 'revision')
})

async function fetchProject() {
  loading.value = true
  try {
    const id = route.params.id as string
    // Fetch from reviewer projects
    project.value = await projectStore.fetchProjectById(id)
  } catch (error) {
    console.error('Failed to fetch project:', error)
  } finally {
    loading.value = false
  }
}

function validateForm(): boolean {
  errors.value = {}

  if (!reviewForm.note.trim()) {
    errors.value.note = 'Review notes are required'
  } else if (reviewForm.note.length < 10) {
    errors.value.note = 'Please provide more detailed feedback (min 10 characters)'
  }

  if (!reviewForm.decision) {
    errors.value.decision = 'Please select a decision'
  }

  return Object.keys(errors.value).length === 0
}

async function handleReviewAction() {
  if (!validateForm()) {
    return
  }

  if (!confirm(`Are you sure you want to ${reviewForm.decision} this application?`)) {
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    if (!project.value) return

    const statusMap = {
      approval: 'approved' as const,
      revision: 'revision' as const,
      rejection: 'rejected' as const,
    }

    const newStatus = statusMap[reviewForm.decision]

    await projectStore.updateProjectStatus(project.value.id, newStatus, reviewForm.note)

    // Refresh project data
    await fetchProject()

    // Show success message
    const actionText = reviewForm.decision === 'approval' ? 'approved' :
                      reviewForm.decision === 'revision' ? 'sent for revision' : 'rejected'
    alert(`Application ${actionText} successfully!`)

    // Reset form
    reviewForm.note = ''
    reviewForm.decision = '' as 'approval' | 'revision' | 'rejection'
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to submit review'
  } finally {
    isSubmitting.value = false
  }
}

function handleCancel() {
  reviewForm.note = ''
  reviewForm.decision = '' as 'approval' | 'revision' | 'rejection'
  errors.value = {}
  errorMessage.value = ''
}

function handleDownload(doc: ProjectDocument) {
  // Mock download
  alert(`Downloading ${doc.fileName}...`)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString()
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

function getNoteBadgeClasses(type: string): string {
  const classes: Record<string, string> = {
    info: 'bg-blue-100/80 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-700',
    revision: 'bg-orange-100/80 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 border-orange-200 dark:border-orange-700',
    approval: 'bg-green-100/80 text-green-700 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-700',
    rejection: 'bg-rose-100/80 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 border-rose-200 dark:border-rose-700',
  }
  return classes[type] || classes.info
}

onMounted(() => {
  fetchProject()
})
</script>
