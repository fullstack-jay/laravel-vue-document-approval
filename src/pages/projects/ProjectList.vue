<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <PageHeader
      title="My Projects"
      subtitle="Manage and track your document submissions"
    >
      <template #actions>
        <AppButton @click="router.push('/projects/create')" size="md">
          <PlusIcon class="h-5 w-5 mr-2" />
          New Project
        </AppButton>
      </template>
    </PageHeader>

    <!-- Status Filter Tabs -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-2">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="handleFilterChange(tab.value)"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            currentFilter === tab.value
              ? 'bg-primary-600 text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          ]"
        >
          {{ tab.label }}
          <span class="ml-2 text-xs opacity-75">
            ({{ getCount(tab.value) }})
          </span>
        </button>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <LoadingSkeleton v-for="i in 6" :key="i" height="150px" />
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else-if="projects.length === 0"
      title="No projects found"
      :description="getEmptyMessage()"
    >
      <AppButton @click="router.push('/projects/create')" v-if="currentFilter === 'draft'">
        <PlusIcon class="h-5 w-5 mr-2" />
        Create Your First Project
      </AppButton>
    </EmptyState>

    <!-- Projects Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
        @click="handleProjectClick(project.id)"
        @edit="handleEditProject(project.id)"
        @delete="handleDeleteProject(project.id)"
      />
    </div>

    <!-- Pagination (placeholder) -->
    <div v-if="projects.length > 0" class="flex justify-center">
      <div class="flex gap-2">
        <button
          class="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 disabled:opacity-50"
          disabled
        >
          Previous
        </button>
        <button
          class="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 disabled:opacity-50"
          disabled
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/modules/projects/stores/projectStore'
import { PlusIcon } from '@heroicons/vue/24/outline'
import PageHeader from '@/components/common/PageHeader.vue'
import AppButton from '@/components/common/AppButton.vue'
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ProjectCard from '@/components/projects/ProjectCard.vue'
import type { ProjectStatus } from '@/modules/projects/types/project'

const router = useRouter()
const projectStore = useProjectStore()

const currentFilter = ref<ProjectStatus | 'all'>('all')
const loading = ref(false)

const tabs = [
  { label: 'All', value: 'all' as const },
  { label: 'Draft', value: 'draft' as ProjectStatus },
  { label: 'Submitted', value: 'submitted' as ProjectStatus },
  { label: 'Revision', value: 'revision' as ProjectStatus },
  { label: 'Approved', value: 'approved' as ProjectStatus },
  { label: 'Rejected', value: 'rejected' as ProjectStatus },
]

const projects = computed(() => projectStore.projects)

const statsByStatus = computed(() => projectStore.statsByStatus)

function getCount(status: ProjectStatus | 'all'): number {
  if (status === 'all') {
    return projectStore.totalProjects
  }
  return statsByStatus.value[status] || 0
}

function getEmptyMessage(): string {
  const messages = {
    all: 'You haven\'t created any projects yet',
    draft: 'No draft projects',
    submitted: 'No submitted projects',
    revision: 'No projects requiring revision',
    approved: 'No approved projects yet',
    rejected: 'No rejected projects',
  }
  return messages[currentFilter.value] || messages.all
}

async function handleFilterChange(status: ProjectStatus | 'all') {
  currentFilter.value = status
  loading.value = true

  try {
    if (status === 'all') {
      await projectStore.fetchProjects()
    } else {
      await projectStore.fetchProjects({ status })
    }
  } finally {
    loading.value = false
  }
}

function handleProjectClick(id: string) {
  router.push(`/projects/${id}`)
}

function handleEditProject(id: string) {
  router.push(`/projects/${id}/edit`)
}

async function handleDeleteProject(id: string) {
  if (!confirm('Are you sure you want to delete this project?')) {
    return
  }

  loading.value = true

  try {
    await projectStore.deleteProject(id)

    // Refresh the list
    await handleFilterChange(currentFilter.value)
  } catch (error: any) {
    alert(error.message || 'Failed to delete project')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  handleFilterChange('all')
})
</script>
