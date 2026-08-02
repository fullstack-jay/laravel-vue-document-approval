<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <!-- Page Header -->
    <PageHeader
      title="Create New Project"
      subtitle="Fill in the details below to create a new document submission"
    />

    <!-- Form Card -->
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
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            :class="{ 'border-red-500': errors.category }"
          >
            <option value="">Select category</option>
            <option value="permohonan">Permohonan</option>
            <option value="pengajuan">Pengajuan</option>
            <option value="permintaan">Permintaan</option>
            <option value="lainnya">Lainnya</option>
          </select>
          <p v-if="errors.category" class="text-sm text-red-600 dark:text-red-400">
            {{ errors.category }}
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

        <!-- Documents Upload (placeholder) -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Supporting Documents
          </label>
          <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <DocumentIcon class="mx-auto h-12 w-12 text-gray-400" />
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Drag and drop files here, or click to select
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
              PDF, DOC, DOCX (Max 10MB)
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              @change="handleFileUpload"
              class="hidden"
              id="file-upload"
              ref="fileInputRef"
            />
            <button
              type="button"
              @click="fileInputRef?.click()"
              class="mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Browse Files
            </button>
          </div>

          <!-- Uploaded files list -->
          <div v-if="uploadedFiles.length > 0" class="space-y-2 mt-4">
            <div
              v-for="(file, index) in uploadedFiles"
              :key="index"
              class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <DocumentIcon class="h-5 w-5 text-gray-400" />
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ file.name }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatFileSize(file.size) }}
                  </p>
                </div>
              </div>
              <button
                type="button"
                @click="removeFile(index)"
                class="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <XMarkIcon class="h-5 w-5" />
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
            Submit Project
          </AppButton>
          <AppButton
            type="button"
            variant="secondary"
            @click="handleSaveDraft"
            :loading="isSavingDraft"
            size="lg"
            class="flex-1"
          >
            Save as Draft
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
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/modules/projects/stores/projectStore'
import { projectService } from '@/modules/projects/services/projectService'
import PageHeader from '@/components/common/PageHeader.vue'
import Card from '@/components/common/Card.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import { DocumentIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import type { ProjectFormData } from '@/modules/projects/types/project'

const router = useRouter()
const projectStore = useProjectStore()

const form = reactive<ProjectFormData>({
  title: '',
  description: '',
  category: 'permohonan',
  documents: [],
})

const uploadedFiles = ref<File[]>([])
const errors = ref<Record<string, string>>({})
const errorMessage = ref('')
const isSubmitting = ref(false)
const isSavingDraft = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const setLoading = inject<(value: boolean) => void>('setLoading', () => {})

function validateForm(): boolean {
  errors.value = {}

  if (!form.title.trim()) {
    errors.value.title = 'Title is required'
  } else if (form.title.length < 5) {
    errors.value.title = 'Title must be at least 5 characters'
  }

  if (!form.category) {
    errors.value.category = 'Please select a category'
  }

  if (!form.description.trim()) {
    errors.value.description = 'Description is required'
  } else if (form.description.length < 20) {
    errors.value.description = 'Description must be at least 20 characters'
  }

  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    setLoading(true)

    // Step 1: Create project first without documents
    const projectData = {
      title: form.title,
      description: form.description,
      category: form.category,
      documents: [] // Don't send documents in create request
    }

    const project = await projectStore.createProject(projectData)

    // Step 2: Upload documents one by one to the created project
    if (uploadedFiles.value.length > 0) {
      for (let i = 0; i < uploadedFiles.value.length; i++) {
        const file = uploadedFiles.value[i]
        try {
          await projectService.uploadDocument(project.id, file)
        } catch (uploadError: any) {
          // Continue with next file even if one fails
        }
      }
    }

    // Show success message (you can add toast here)
    alert('Project created successfully!')

    // Redirect to project detail
    router.push(`/projects/${project.id}`)
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to create project'
  } finally {
    isSubmitting.value = false
    setLoading(false)
  }
}

async function handleSaveDraft() {
  if (!form.title.trim()) {
    errors.value.title = 'Title is required for draft'
    return
  }

  isSavingDraft.value = true
  errorMessage.value = ''

  try {
    setLoading(true)

    // Step 1: Create project first without documents
    const projectData = {
      title: form.title,
      description: form.description,
      category: form.category,
      documents: [] // Don't send documents in create request
    }

    const project = await projectStore.createProject(projectData)

    // Step 2: Upload documents one by one to the created project
    if (uploadedFiles.value.length > 0) {
      for (let i = 0; i < uploadedFiles.value.length; i++) {
        const file = uploadedFiles.value[i]
        try {
          await projectService.uploadDocument(project.id, file)
        } catch (uploadError: any) {
          // Continue with next file even if one fails
        }
      }
    }

    alert('Draft saved successfully!')

    router.push(`/projects/${project.id}`)
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to save draft'
  } finally {
    isSavingDraft.value = false
    setLoading(false)
  }
}

function handleCancel() {
  router.back()
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Max size is 10MB.`)
        continue
      }

      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!validTypes.includes(file.type)) {
        alert(`File ${file.name} is not supported. Please upload PDF, DOC, or DOCX files.`)
        continue
      }

      uploadedFiles.value.push(file)
    }
  }
}

function removeFile(index: number) {
  uploadedFiles.value.splice(index, 1)
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
</script>
