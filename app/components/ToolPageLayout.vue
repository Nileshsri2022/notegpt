<template>
  <div>
    <NuxtLayout name="dashboard">
      <!-- Tool Sub-Navigation Bar -->
      <template #header>
        <ToolSubNav
          :category="category"
          :tabs="tabs"
          :external-link="externalLink"
        />
      </template>

      <div class="max-w-4xl mx-auto">
        <!-- Tool Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
            <p v-if="description" class="text-gray-600 mt-1">{{ description }}</p>
          </div>
          <QuotaDisplay :basic="remainingQuota" :premium="remainingPremiumQuota" />
        </div>

        <!-- Main Content Slot -->
        <slot />
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
interface Tab {
  label: string
  to: string
}

interface ExternalLink {
  label: string
  url: string
}

withDefaults(defineProps<{
  title: string
  description?: string
  category: string
  categoryIcon?: string
  tabs: Tab[]
  externalLink?: ExternalLink
}>(), {
  categoryIcon: 'heroicons:sparkles',
})

const { remainingQuota, remainingPremiumQuota } = useProfile()
</script>
