<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <PageHeader
      title="Reviewer Dashboard"
      subtitle="Applications awaiting your review"
    >
      <template #actions>
        <AppButton
          variant="primary"
          @click="$router.push('/projects')"
        >
          <ClipboardDocumentListIcon class="w-5 h-5 mr-2" />
          Review Queue ({{ stats.submitted }})
        </AppButton>
      </template>
    </PageHeader>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <LoadingSkeleton v-for="i in 4" :key="i" height="120px" />
    </div>

    <!-- Dashboard Content -->
    <template v-else>
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatisticCard
          title="Pending Review"
          :value="stats.submitted"
          icon="document"
          icon-bg-color="bg-blue-100 dark:bg-blue-900/30"
          icon-color="text-blue-600 dark:text-blue-400"
        />
        <StatisticCard
          title="Approved Today"
          :value="12"
          icon="check"
          icon-bg-color="bg-green-100 dark:bg-green-900/30"
          icon-color="text-green-600 dark:text-green-400"
          change="+15%"
          change-type="positive"
        />
        <StatisticCard
          title="Revision Requests"
          :value="stats.revisions"
          icon="refresh"
          icon-bg-color="bg-orange-100 dark:bg-orange-900/30"
          icon-color="text-orange-600 dark:text-orange-400"
        />
        <StatisticCard
          title="Rejected Today"
          :value="3"
          icon="close"
          icon-bg-color="bg-red-100 dark:bg-red-900/30"
          icon-color="text-red-600 dark:text-red-400"
          change="+5%"
          change-type="negative"
        />
      </div>

      <!-- Charts and Stats -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Total Statistics -->
        <div class="lg:col-span-1">
          <Card title="Total Reviews" padding="md">
            <div class="space-y-4">
              <div
                v-for="item in reviewStats"
                :key="item.label"
                class="flex items-center justify-between p-3 rounded-lg"
                :class="item.bgClass"
              >
                <div class="flex items-center space-x-3">
                  <component :is="item.icon" class="w-5 h-5" :class="item.iconClass" />
                  <span class="font-medium" :class="item.textClass">{{ item.label }}</span>
                </div>
                <span class="text-lg font-bold" :class="item.valueClass">{{ item.value }}</span>
              </div>
            </div>
          </Card>
        </div>

        <!-- Approval Rate Chart -->
        <div class="lg:col-span-2">
          <Card title="Approval Statistics" padding="md">
            <div class="h-64 flex items-center justify-center">
              <div class="space-y-4 w-full px-4">
                <div
                  v-for="item in approvalRate"
                  :key="item.label"
                  class="flex items-center space-x-4"
                >
                  <span class="w-24 text-sm text-gray-600 dark:text-gray-400">{{ item.label }}</span>
                  <div class="flex-1 h-6 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                    <div
                      class="h-full transition-all duration-500"
                      :class="item.barColor"
                      :style="{ width: `${item.percentage}%` }"
                    />
                    <span class="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ item.percentage }}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <!-- Recent Reviews -->
      <Card title="Recent Reviews" padding="none">
        <ActivityList :activities="recentActivities" />
      </Card>

      <!-- Quick Actions -->
      <Card title="Quick Actions" padding="md">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AppButton
            variant="primary"
            size="lg"
            @click="$router.push('/projects')"
          >
            <ClipboardDocumentListIcon class="w-5 h-5 mr-2" />
            Review Queue
          </AppButton>
          <AppButton
            variant="secondary"
            size="lg"
            @click="$router.push('/projects')"
          >
            <CheckCircleIcon class="w-5 h-5 mr-2" />
            All Projects
          </AppButton>
          <AppButton
            variant="secondary"
            size="lg"
            @click="$router.push('/profile')"
          >
            <ArrowPathIcon class="w-5 h-5 mr-2" />
            Profile
          </AppButton>
          <AppButton
            variant="secondary"
            size="lg"
            @click="$router.push('/projects')"
          >
            <ChartBarIcon class="w-5 h-5 mr-2" />
            View Projects
          </AppButton>
        </div>
      </Card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, inject } from 'vue'
import { useDashboardStore } from '@/modules/dashboard/stores/dashboardStore'
import PageHeader from '@/components/common/PageHeader.vue'
import StatisticCard from '@/components/dashboard/StatisticCard.vue'
import Card from '@/components/common/Card.vue'
import ActivityList from '@/components/dashboard/ActivityList.vue'
import AppButton from '@/components/common/AppButton.vue'
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue'
import {
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CheckIcon,
  XCircleIcon,
} from '@heroicons/vue/24/outline'

const dashboardStore = useDashboardStore()

// Inject setLoading from parent layout
const setLoading = inject<(value: boolean) => void>('setLoading', () => {})

const stats = computed(() => dashboardStore.stats)
const recentActivities = computed(() => dashboardStore.recentActivities)
const loading = computed(() => dashboardStore.loading)

const reviewStats = [
  {
    label: 'Total Reviewed',
    value: stats.value.approved + stats.value.rejected + stats.value.revisions,
    icon: DocumentTextIcon,
    bgClass: 'bg-gray-50 dark:bg-gray-700/50',
    iconClass: 'text-gray-600 dark:text-gray-400',
    textClass: 'text-gray-900 dark:text-gray-100',
    valueClass: 'text-gray-900 dark:text-gray-100',
  },
  {
    label: 'Approved',
    value: stats.value.approved,
    icon: CheckIcon,
    bgClass: 'bg-green-50 dark:bg-green-900/20',
    iconClass: 'text-green-600 dark:text-green-400',
    textClass: 'text-green-900 dark:text-green-100',
    valueClass: 'text-green-600 dark:text-green-400',
  },
  {
    label: 'Rejected',
    value: stats.value.rejected,
    icon: XCircleIcon,
    bgClass: 'bg-red-50 dark:bg-red-900/20',
    iconClass: 'text-red-600 dark:text-red-400',
    textClass: 'text-red-900 dark:text-red-100',
    valueClass: 'text-red-600 dark:text-red-400',
  },
  {
    label: 'Revisions',
    value: stats.value.revisions,
    icon: ArrowPathIcon,
    bgClass: 'bg-orange-50 dark:bg-orange-900/20',
    iconClass: 'text-orange-600 dark:text-orange-400',
    textClass: 'text-orange-900 dark:text-orange-100',
    valueClass: 'text-orange-600 dark:text-orange-400',
  },
]

const approvalRate = [
  { label: 'Approved', percentage: 63, barColor: 'bg-green-500' },
  { label: 'Rejected', percentage: 15, barColor: 'bg-red-500' },
  { label: 'Revision', percentage: 8, barColor: 'bg-orange-500' },
  { label: 'Pending', percentage: 14, barColor: 'bg-blue-500' },
]

onMounted(async () => {
  setLoading(true)
  try {
    await dashboardStore.fetchDashboardStats()
  } finally {
    setLoading(false)
  }
})
</script>
