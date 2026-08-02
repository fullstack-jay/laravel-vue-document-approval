<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <LoadingSkeleton height="400px" />
    </div>

    <!-- Edit Form -->
    <div v-else-if="project">
      <PageHeader
        title="Edit Project"
        :subtitle="project.title"
      />

      <Card>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Title -->
          <AppInput
            v-model="form.title"
            label="Project Title"
            placeholder="Enter project title"
            required
            :error="errors.title"
          />

          <!-- Category -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.category"
              required
              disabled
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 px-4 py-2 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            >
              <option value="permohonan">Permohonan</option>
              <option value="pengajuan">Pengajuan</option>
              <option value="permintaan">Permintaan</option>
              <option value="lainnya">Lainnya</option>
            </select>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Category cannot be changed after creation
            </p>
          </div>

          <!-- Description -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.description"
              rows="5"
              required
              placeholder="Provide a detailed description of your project..."
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              :class="{ 'border-red-500': errors.description }"
            />
            <p v-if="errors.description" class="text-sm text-red-600 dark:text-red-400">
              {{ errors.description }}
            </p>
          </div>

          <!-- Existing Documents -->
          <div v-if="existingDocuments.length > 0" class="space-y-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Current Documents
            </label>
            <div class="space-y-3">
              <div
                v-for="doc in existingDocuments"
                :key="doc.id"
                class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div class="flex items-center gap-3 flex-1 min-w-0">
                  <div class="flex-shrink-0 w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                    <DocumentIcon class="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {{ doc.file_name || doc.fileName || 'Document' }}
                    </p>
                    <p v-if="doc.file_size || doc.fileSize" class="text-xs text-gray-500 dark:text-gray-400">
                      {{ formatFileSize(doc.file_size || doc.fileSize || 0) }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    @click="handlePreview(doc)"
                    class="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    title="Preview"
                  >
                    <EyeIcon class="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    @click="handleDeleteDocument(doc.id)"
                    class="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Upload New Documents -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Upload Additional Documents
              <span class="text-gray-500 font-normal">(Optional)</span>
            </label>
            <div
              @click="$refs.fileInput?.click()"
              @drop.prevent="handleFileDrop"
              @dragover.prevent
              class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
              :class="{ 'bg-primary-50 dark:bg-primary-900/20': isDragging }"
            >
              <input
                ref="fileInput"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                class="hidden"
                @change="handleFileSelect"
              />
              <DocumentIcon class="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Click to upload or drag and drop files here
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                PDF, DOC, DOCX, JPG, PNG (Max 10MB each)
              </p>
            </div>

            <!-- Selected Files List -->
            <div v-if="newDocuments.length > 0" class="space-y-2 mt-3">
              <div
                v-for="(file, index) in newDocuments"
                :key="index"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div class="flex items-center gap-2 flex-1 min-w-0">
                  <DocumentIcon class="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span class="text-sm text-gray-900 dark:text-white truncate">
                    {{ file.name }}
                  </span>
                  <span class="text-xs text-gray-500 flex-shrink-0">
                    ({{ formatFileSize(file.size) }})
                  </span>
                </div>
                <button
                  type="button"
                  @click="removeNewDocument(index)"
                  class="p-1 text-gray-500 hover:text-red-600 transition-colors"
                >
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
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
              Save Changes
            </AppButton>
            <AppButton
              type="button"
              variant="ghost"
              @click="router.back()"
              size="lg"
            >
              Cancel
            </AppButton>
          </div>
        </form>
      </Card>
    </div>

    <!-- Not Found -->
    <EmptyState
      v-else
      title="Project not found"
      description="The project you're trying to edit doesn't exist"
    >
      <AppButton @click="router.push('/projects')">
        Back to Projects
      </AppButton>
    </EmptyState>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProjectStore } from '@/modules/projects/stores/projectStore'
import type { Project, ProjectFormData } from '@/modules/projects/types/project'
import PageHeader from '@/components/common/PageHeader.vue'
import Card from '@/components/common/Card.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { DocumentIcon, EyeIcon, TrashIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const projectStore = useProjectStore()

const project = ref<Project | null>(null)
const loading = ref(true)
const isSubmitting = ref(false)
const errorMessage = ref('')
const errors = ref<Record<string, string>>({})
const existingDocuments = ref<any[]>([])
const newDocuments = ref<File[]>([])
const isDragging = ref(false)

const form = reactive<ProjectFormData>({
  title: '',
  description: '',
  category: 'permohonan' as any,
  documents: [],
})

const setLoading = inject<(value: boolean) => void>('setLoading', () => {})

function validateForm(): boolean {
  errors.value = {}

  if (!form.title.trim()) {
    errors.value.title = 'Title is required'
  } else if (form.title.length < 5) {
    errors.value.title = 'Title must be at least 5 characters'
  }

  if (!form.description.trim()) {
    errors.value.description = 'Description is required'
  } else if (form.description.length < 20) {
    errors.value.description = 'Description must be at least 20 characters'
  }

  return Object.keys(errors.value).length === 0
}

async function fetchProject() {
  loading.value = true
  try {
    const id = route.params.id as string
    project.value = await projectStore.fetchProjectById(id)

    // Populate form
    form.title = project.value.title
    form.description = project.value.description
    form.category = project.value.category

    // Load existing documents
    existingDocuments.value = project.value.documents || []
  } catch (error) {
    console.error('Failed to fetch project:', error)
    project.value = null
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    setLoading(true)

    const id = route.params.id as string

    // Update project details first
    await projectStore.updateProject(id, {
      title: form.title,
      description: form.description,
      category: form.category,
    })

    // Upload new documents if any
    if (newDocuments.value.length > 0) {
      for (const file of newDocuments.value) {
        try {
          await projectStore.uploadDocument(id, file)
        } catch (error: any) {
          console.error('Failed to upload document:', error)
          // Continue with other files even if one fails
        }
      }
    }

    alert('Project updated successfully!')

    router.push(`/projects/${id}`)
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to update project'
  } finally {
    isSubmitting.value = false
    setLoading(false)
  }
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  addFiles(files)
  // Reset input so same files can be selected again
  target.value = ''
}

function handleFileDrop(event: DragEvent) {
  isDragging.value = false
  const files = Array.from(event.dataTransfer?.files || [])
  addFiles(files)
}

function addFiles(files: File[]) {
  for (const file of files) {
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert(`File "${file.name}" is too large. Maximum size is 10MB.`)
      continue
    }
    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ]
    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|jpg|jpeg|png)$/i)) {
      alert(`File "${file.name}" has invalid type. Please upload PDF, DOC, DOCX, JPG, or PNG.`)
      continue
    }
    newDocuments.value.push(file)
  }
}

function removeNewDocument(index: number) {
  newDocuments.value.splice(index, 1)
}

async function handleDeleteDocument(documentId: string) {
  if (!project.value) return
  if (!confirm('Are you sure you want to delete this document?')) {
    return
  }

  try {
    await projectStore.deleteDocument(project.value.id, documentId)
    // Remove from existing documents list
    existingDocuments.value = existingDocuments.value.filter(doc => doc.id !== documentId)
    alert('Document deleted successfully!')
  } catch (error: any) {
    alert(error.message || 'Failed to delete document')
  }
}

function handlePreview(doc: any) {
  // Use backend URL if available, otherwise use a placeholder
  const url = doc.url || doc.download_url || doc.downloadUrl
  if (url) {
    window.open(url, '_blank')
  } else {
    alert('Preview not available for this document')
  }
}

function formatFileSize(bytes: number | undefined | null): string {
  if (!bytes || bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

onMounted(() => {
  fetchProject()
})
</script>
