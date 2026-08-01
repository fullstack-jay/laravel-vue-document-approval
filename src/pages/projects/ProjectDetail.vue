<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <LoadingSkeleton height="200px" />
    </div>

    <!-- Project Detail -->
    <div v-else-if="project">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center space-x-3">
            <button
              @click="router.back()"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeftIcon class="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ project.title }}
            </h1>
            <StatusBadge :status="project.status" />
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-8">
            Created on {{ formatDate(project.createdAt) }}
          </p>
        </div>

        <!-- Action buttons -->
        <div class="flex items-center space-x-2">
          <button
            v-if="canEdit"
            @click="router.push(`/projects/${project.id}/edit`)"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center"
          >
            <PencilIcon class="h-4 w-4 mr-2" />
            Edit
          </button>
          <button
            v-if="canSubmit"
            @click="handleSubmit"
            :disabled="isSubmitting"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center disabled:opacity-50"
          >
            <PaperAirplaneIcon class="h-4 w-4 mr-2" />
            {{ isSubmitting ? 'Submitting...' : 'Submit' }}
          </button>
          <button
            v-if="canDelete"
            @click="handleDelete"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center"
          >
            <TrashIcon class="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      <!-- Description Card -->
      <Card title="Description" padding="md">
        <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {{ project.description }}
        </p>
      </Card>

      <!-- Info Card -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Category" padding="md">
          <p class="text-gray-700 dark:text-gray-300 capitalize">
            {{ project.category }}
          </p>
        </Card>
        <Card title="Status" padding="md">
          <StatusBadge :status="project.status" :label="project.status" />
        </Card>
        <Card title="Documents" padding="md">
          <p class="text-gray-700 dark:text-gray-300">
            {{ project.documents.length }} file(s)
          </p>
        </Card>
      </div>

      <!-- Documents Card -->
      <Card title="Supporting Documents" padding="md">
        <div v-if="project.documents.length > 0" class="space-y-3">
          <div
            v-for="doc in project.documents"
            :key="doc.id"
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <DocumentIcon class="h-5 w-5 text-gray-400" />
              <div>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ doc.fileName }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatFileSize(doc.fileSize) }}
                </p>
              </div>
            </div>
            <button
              @click="handleDownload(doc)"
              class="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <ArrowDownTrayIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
        <EmptyState v-else title="No documents" description="No supporting documents uploaded" />
      </Card>

      <!-- Review Notes Card (if any) -->
      <Card
        v-if="project.reviewNotes.length > 0"
        title="Review Notes"
        padding="md"
      >
        <div class="space-y-4">
          <div
            v-for="note in project.reviewNotes"
            :key="note.id"
            class="p-4 rounded-lg"
            :class="getNoteBgColor(note.type)"
          >
            <div class="flex items-start justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ note.reviewerName }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ formatDate(note.createdAt) }}
                </p>
              </div>
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="getNoteBadgeColor(note.type)"
              >
                {{ note.type }}
              </span>
            </div>
            <p class="mt-2 text-gray-700 dark:text-gray-300">
              {{ note.note }}
            </p>
          </div>
        </div>
      </Card>

      <!-- Timeline Card -->
      <Card title="Timeline" padding="md">
        <div class="space-y-4">
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
      </Card>
    </div>

    <!-- Error -->
    <div v-else class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400">Project not found</p>
      <AppButton @click="router.back()" class="mt-4">
        Go Back
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProjectStore } from '@/modules/projects/stores/projectStore'
import { useAuthStore } from '@/modules/auth/stores/authStore'
import type { Project } from '@/modules/projects/types/project'
import Card from '@/components/common/Card.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import AppButton from '@/components/common/AppButton.vue'
import TimelineItem from '@/components/projects/TimelineItem.vue'
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  PaperAirplaneIcon,
  DocumentIcon,
  ArrowDownTrayIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const projectStore = useProjectStore()
const authStore = useAuthStore()

const project = ref<Project | null>(null)
const loading = ref(true)
const isSubmitting = ref(false)

const canEdit = computed(() => {
  return project.value && project.value.status === 'draft' && authStore.isApplicant
})

const canSubmit = computed(() => {
  return project.value &&
         (project.value.status === 'draft' || project.value.status === 'revision') &&
         authStore.isApplicant
})

const canDelete = computed(() => {
  return project.value && project.value.status === 'draft' && authStore.isApplicant
})

async function fetchProject() {
  loading.value = true
  try {
    const id = route.params.id as string
    project.value = await projectStore.fetchProjectById(id)
  } catch (error) {
    console.error('Failed to fetch project:', error)
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  if (!confirm('Are you sure you want to submit this project for review?')) {
    return
  }

  isSubmitting.value = true
  try {
    await projectStore.submitProject(project.value.id)
    await fetchProject()
    alert('Project submitted successfully!')
  } catch (error: any) {
    alert(error.message || 'Failed to submit project')
  } finally {
    isSubmitting.value = false
  }
}

async function handleDelete() {
  if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
    return
  }

  try {
    await projectStore.deleteProject(project.value.id)
    router.push('/projects')
  } catch (error: any) {
    alert(error.message || 'Failed to delete project')
  }
}

function handleDownload(doc) {
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

function getNoteBgColor(type: string): string {
  const colors = {
    info: 'bg-blue-50 dark:bg-blue-900/20',
    revision: 'bg-orange-50 dark:bg-orange-900/20',
    approval: 'bg-green-50 dark:bg-green-900/20',
    rejection: 'bg-red-50 dark:bg-red-900/20',
  }
  return colors[type] || colors.info
}

function getNoteBadgeColor(type: string): string {
  const colors = {
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    revision: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    approval: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    rejection: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  }
  return colors[type] || colors.info
}

onMounted(() => {
  fetchProject()
})
</script>
