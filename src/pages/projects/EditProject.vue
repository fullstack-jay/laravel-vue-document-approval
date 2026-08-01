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

const router = useRouter()
const route = useRoute()
const projectStore = useProjectStore()

const project = ref<Project | null>(null)
const loading = ref(true)
const isSubmitting = ref(false)
const errorMessage = ref('')
const errors = ref<Record<string, string>>({})

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
    await projectStore.updateProject(id, form)

    alert('Project updated successfully!')

    router.push(`/projects/${id}`)
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to update project'
  } finally {
    isSubmitting.value = false
    setLoading(false)
  }
}

onMounted(() => {
  fetchProject()
})
</script>
