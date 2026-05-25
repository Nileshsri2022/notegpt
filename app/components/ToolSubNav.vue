<template>
  <div class="border-b border-gray-200">
    <div class="flex items-center gap-4 px-4 py-2">
      <!-- Category label -->
      <span class="text-sm font-semibold text-gray-900 shrink-0">{{ category }}</span>

      <!-- Sub-tab links -->
      <div class="flex items-center gap-1 overflow-x-auto">
        <NuxtLink
          v-for="tab in visibleTabs"
          :key="tab.to"
          :to="tab.to"
          class="px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors"
          :class="isActiveTab(tab.to)
            ? 'bg-primary-500/10 text-primary-500'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
        >
          {{ tab.label }}
        </NuxtLink>
      </div>

      <!-- More dropdown -->
      <UDropdownMenu
        v-if="hiddenTabs.length > 0"
        :items="hiddenTabItems"
      >
        <UButton variant="ghost" size="xs" trailing-icon="i-heroicons-chevron-down" class="text-gray-500">
          More
        </UButton>
      </UDropdownMenu>

      <!-- Spacer -->
      <div class="flex-1" />

      <!-- External link -->
      <a
        v-if="externalLink"
        :href="externalLink.url"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600 font-medium whitespace-nowrap"
      >
        {{ externalLink.label }}
        <Icon name="heroicons:arrow-top-right-on-square" class="w-3.5 h-3.5" />
      </a>

      <!-- Separator + My Notes -->
      <div class="h-4 w-px bg-gray-200" />
      <NuxtLink
        to="/notes"
        class="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium whitespace-nowrap"
      >
        <Icon name="heroicons:bookmark" class="w-4 h-4" />
        My Notes
      </NuxtLink>
    </div>
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

const props = withDefaults(defineProps<{
  category: string
  tabs: Tab[]
  externalLink?: ExternalLink
  maxVisible?: number
}>(), {
  maxVisible: 4,
})

const route = useRoute()

const visibleTabs = computed(() => props.tabs.slice(0, props.maxVisible))
const hiddenTabs = computed(() => props.tabs.slice(props.maxVisible))

const hiddenTabItems = computed(() =>
  hiddenTabs.value.map(tab => ({
    label: tab.label,
    to: tab.to,
  }))
)

function isActiveTab(to: string) {
  return route.path === to || route.path.startsWith(to + '/')
}
</script>
