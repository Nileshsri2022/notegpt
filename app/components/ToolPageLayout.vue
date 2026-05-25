<template>
  <div>
    <NuxtLayout name="dashboard">
      <!-- Tool Sub-Navigation Bar -->
      <template #header>
        <ToolSubNav
          :category="category"
          :tabs="tabs"
          :show-quota="true"
          :quota-used="10 - remainingQuota"
          :quota-limit="10"
        >
          <template v-if="externalLink" #right>
            <a
              :href="externalLink.url"
              target="_blank"
              class="text-xs text-[#2E83FB] hover:underline flex items-center gap-1"
            >
              {{ externalLink.label }}
              <Icon name="heroicons:arrow-top-right-on-square" class="w-3 h-3" />
            </a>
          </template>
        </ToolSubNav>
      </template>

      <div class="max-w-4xl mx-auto">
        <!-- Tool Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
            <p v-if="description" class="text-gray-600 mt-1">{{ description }}</p>
          </div>
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

const { remainingQuota } = useProfile()
</script>
