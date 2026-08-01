<template>
  <div class="space-y-2">
    <ActivityCard
      v-for="activity in activities"
      :key="activity.id"
      :activity="activity"
    />
    <div v-if="activities.length === 0" class="py-8">
      <EmptyState
        title="No activities yet"
        description="There are no recent activities to display."
        icon="inbox"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ActivityCard from './ActivityCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import type { RecentActivity } from '@/modules/dashboard/types/dashboard'

defineProps<{
  activities: RecentActivity[]
}>()
</script>
