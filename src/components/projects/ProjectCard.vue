<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
    @click="$emit('click', project.id)"
  >
    <!-- Card Header -->
    <div class="p-4 pb-3">
      <div class="flex items-start justify-between">
        <div class="flex-1 min-w-0">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white truncate">
            {{ project.title }}
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {{ formatDate(project.created_at || project.createdAt) }}
          </p>
        </div>
        <StatusBadge :status="project.status" />
      </div>
    </div>

    <!-- Card Body -->
    <div class="px-4 pb-4">
      <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
        {{ getDescriptionPreview() }}
      </p>
    </div>

    <!-- Card Footer -->
    <div class="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-between">
      <div class="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
        <span class="flex items-center">
          <DocumentIcon class="h-4 w-4 mr-1" />
          {{ project.documentCount }} documents
        </span>
        <span class="capitalize">{{ project.category }}</span>
      </div>

      <!-- Action buttons (stop propagation) -->
      <div class="flex items-center space-x-2" @click.stop>
        <!-- Applicant actions -->
        <template v-if="!isReviewer">
          <button
            v-if="project.status === 'draft'"
            @click="$emit('edit', project.id)"
            class="p-1.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            title="Edit"
          >
            <PencilIcon class="h-4 w-4" />
          </button>
          <button
            v-if="project.status === 'draft'"
            @click="$emit('delete', project.id)"
            class="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Delete"
          >
            <TrashIcon class="h-4 w-4" />
          </button>
        </template>

        <!-- View/Review button -->
        <button
          @click="handleViewDetail"
          class="p-1.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          :title="isReviewer ? 'Review Application' : 'View Detail'"
        >
          <ArrowRightIcon class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  DocumentIcon,
  PencilIcon,
  TrashIcon,
  ArrowRightIcon,
} from '@heroicons/vue/24/outline'
import StatusBadge from '@/components/common/StatusBadge.vue'
import type { ProjectListItem } from '@/modules/projects/types/project'

const props = defineProps<{
  project: ProjectListItem
  isReviewer?: boolean
}>()

const emit = defineEmits<{
  click: [id: string]
  edit: [id: string]
  delete: [id: string]
}>()

const router = useRouter()

function formatDate(dateString: string): string {
  if (!dateString) return 'Invalid Date'

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'

    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      return 'Today'
    } else if (diffInDays === 1) {
      return 'Yesterday'
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`
    } else if (diffInDays < 30) {
    return `${Math.floor(diffInDays / 7)} weeks ago`
  } else {
    return date.toLocaleDateString()
  }
}

function getDescriptionPreview(): string {
  // This would come from the full project data
  // For now, return a placeholder
  return 'Click to view project details and description...'
}

function handleViewDetail() {
  if (props.isReviewer) {
    router.push(`/projects/${props.project.id}/review`)
  } else {
    router.push(`/projects/${props.project.id}`)
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
