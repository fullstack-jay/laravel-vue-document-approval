<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <PageHeader
      title="Dashboard"
      :subtitle="`Welcome back, ${user?.name}`"
    />

    <!-- Loading Skeleton -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <LoadingSkeleton v-for="i in 6" :key="i" height="120px" />
    </div>

    <!-- Dashboard Content -->
    <template v-else>
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
        <StatisticCard
          title="Total Projects"
          :value="stats.totalProjects"
          icon="folder"
          icon-bg-color="bg-gray-100 dark:bg-gray-700"
          icon-color="text-gray-600 dark:text-gray-400"
        />
        <StatisticCard
          title="Draft"
          :value="stats.draft"
          icon="document"
          icon-bg-color="bg-gray-100 dark:bg-gray-700"
          icon-color="text-gray-600 dark:text-gray-400"
        />
        <StatisticCard
          title="Submitted"
          :value="stats.submitted"
          icon="clock"
          icon-bg-color="bg-blue-100 dark:bg-blue-900/30"
          icon-color="text-blue-600 dark:text-blue-400"
        />
        <StatisticCard
          title="Approved"
          :value="stats.approved"
          icon="check"
          icon-bg-color="bg-green-100 dark:bg-green-900/30"
          icon-color="text-green-600 dark:text-green-400"
        />
        <StatisticCard
          title="Revisions"
          :value="stats.revisions"
          icon="refresh"
          icon-bg-color="bg-orange-100 dark:bg-orange-900/30"
          icon-color="text-orange-600 dark:text-orange-400"
        />
        <StatisticCard
          title="Rejected"
          :value="stats.rejected"
          icon="close"
          icon-bg-color="bg-red-100 dark:bg-red-900/30"
          icon-color="text-red-600 dark:text-red-400"
        />
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Application Status" padding="md">
          <div class="h-64 flex items-center justify-center">
            <div class="grid grid-cols-2 gap-4 w-full">
              <div
                v-for="(value, key) in statusChart"
                :key="key"
                class="flex flex-col items-center p-4 rounded-lg"
                :class="value.bgColor"
              >
                <span class="text-2xl font-bold" :class="value.textColor">{{ value.count }}</span>
                <span class="text-sm capitalize" :class="value.labelColor">{{ value.label }}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Monthly Submissions" padding="md">
          <div class="h-64 flex items-center justify-center">
            <div class="space-y-4 w-full px-4">
              <div
                v-for="item in monthlyData"
                :key="item.month"
                class="flex items-center space-x-4"
              >
                <span class="w-20 text-sm text-gray-600 dark:text-gray-400">{{ item.month }}</span>
                <div class="flex-1 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <div
                    class="h-full bg-primary-500 transition-all duration-500"
                    :style="{ width: `${(item.count / 20) * 100}%` }"
                  />
                </div>
                <span class="w-8 text-sm font-medium text-gray-900 dark:text-gray-100">{{ item.count }}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- Recent Activities -->
      <Card title="Recent Activities" padding="none">
        <ActivityList :activities="recentActivities" />
      </Card>

      <!-- Quick Actions -->
      <Card title="Quick Actions" padding="md">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AppButton
            variant="primary"
            size="lg"
            @click="$router.push('/projects/new')"
          >
            <PlusIcon class="w-5 h-5 mr-2" />
            New Project
          </AppButton>
          <AppButton
            variant="secondary"
            size="lg"
            @click="$router.push('/projects?status=draft')"
          >
            <DocumentTextIcon class="w-5 h-5 mr-2" />
            View Drafts
          </AppButton>
          <AppButton
            variant="secondary"
            size="lg"
            @click="$router.push('/projects?status=submitted')"
          >
            <ClockIcon class="w-5 h-5 mr-2" />
            Submitted
          </AppButton>
          <AppButton
            variant="secondary"
            size="lg"
            @click="$router.push('/history')"
          >
            <ClipboardDocumentListIcon class="w-5 h-5 mr-2" />
            History
          </AppButton>
        </div>
      </Card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, inject } from 'vue'
import { useAuthStore } from '@/modules/auth/stores/authStore'
import { useDashboardStore } from '@/modules/dashboard/stores/dashboardStore'
import PageHeader from '@/components/common/PageHeader.vue'
import StatisticCard from '@/components/dashboard/StatisticCard.vue'
import Card from '@/components/common/Card.vue'
import ActivityList from '@/components/dashboard/ActivityList.vue'
import AppButton from '@/components/common/AppButton.vue'
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue'
import {
  PlusIcon,
  DocumentTextIcon,
  ClockIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const dashboardStore = useDashboardStore()

// Inject setLoading from parent layout
const setLoading = inject<(value: boolean) => void>('setLoading', () => {})

const user = computed(() => authStore.user)
const stats = computed(() => dashboardStore.stats)
const recentActivities = computed(() => dashboardStore.recentActivities)
const loading = computed(() => dashboardStore.loading)

const statusChart = computed(() => {
  const colors = {
    draft: { bgColor: 'bg-gray-100 dark:bg-gray-700', textColor: 'text-gray-900 dark:text-gray-100', labelColor: 'text-gray-600 dark:text-gray-400' },
    submitted: { bgColor: 'bg-blue-100 dark:bg-blue-900/30', textColor: 'text-blue-900 dark:text-blue-100', labelColor: 'text-blue-600 dark:text-blue-400' },
    approved: { bgColor: 'bg-green-100 dark:bg-green-900/30', textColor: 'text-green-900 dark:text-green-100', labelColor: 'text-green-600 dark:text-green-400' },
    revisions: { bgColor: 'bg-orange-100 dark:bg-orange-900/30', textColor: 'text-orange-900 dark:text-orange-100', labelColor: 'text-orange-600 dark:text-orange-400' },
    rejected: { bgColor: 'bg-red-100 dark:bg-red-900/30', textColor: 'text-red-900 dark:text-red-100', labelColor: 'text-red-600 dark:text-red-400' },
  }

  return {
    draft: { count: stats.value.draft, label: 'Draft', ...colors.draft },
    submitted: { count: stats.value.submitted, label: 'Submitted', ...colors.submitted },
    approved: { count: stats.value.approved, label: 'Approved', ...colors.approved },
    revisions: { count: stats.value.revisions, label: 'Revisions', ...colors.revisions },
    rejected: { count: stats.value.rejected, label: 'Rejected', ...colors.rejected },
  }
})

const monthlyData = [
  { month: 'Jan', count: 8 },
  { month: 'Feb', count: 12 },
  { month: 'Mar', count: 15 },
  { month: 'Apr', count: 10 },
  { month: 'May', count: 18 },
  { month: 'Jun', count: 20 },
]

onMounted(async () => {
  setLoading(true)
  try {
    await dashboardStore.fetchDashboardStats('applicant')
  } finally {
    setLoading(false)
  }
})
</script>
