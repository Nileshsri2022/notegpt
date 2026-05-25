<template>
  <div class="border-b border-gray-100 bg-white px-4 sm:px-6">
    <div class="flex items-center justify-between">
      <!-- Category label + sub-tabs -->
      <div class="flex items-center gap-4 overflow-x-auto scrollbar-none">
        <!-- Category label -->
        <span class="text-sm font-semibold text-gray-900 whitespace-nowrap shrink-0">
          {{ category }}
        </span>

        <!-- Sub-tabs -->
        <nav class="flex items-center gap-1">
          <NuxtLink
            v-for="tab in tabs"
            :key="tab.to"
            :to="tab.to"
            class="px-3 py-2.5 text-[13px] font-medium whitespace-nowrap rounded-md transition-colors relative"
            :class="isActiveTab(tab.to)
              ? 'text-[#2E83FB]'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            "
          >
            {{ tab.label }}
            <!-- Active underline -->
            <span
              v-if="isActiveTab(tab.to)"
              class="absolute bottom-0 left-3 right-3 h-0.5 bg-[#2E83FB] rounded-full"
            />
          </NuxtLink>
        </nav>
      </div>

      <!-- Right side: quota display or extra links -->
      <div v-if="$slots.right" class="shrink-0 ml-4">
        <slot name="right" />
      </div>

      <!-- Quota display -->
      <div v-else-if="showQuota" class="shrink-0 ml-4 flex items-center gap-2">
        <span class="text-xs text-gray-500">{{ quotaUsed }}/{{ quotaLimit }}</span>
        <div class="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-[#2E83FB] rounded-full transition-all duration-300"
            :style="{ width: `${Math.min((quotaUsed / quotaLimit) * 100, 100)}%` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Tab {
  label: string
  to: string
}

const props = withDefaults(defineProps<{
  category: string
  tabs: Tab[]
  showQuota?: boolean
  quotaUsed?: number
  quotaLimit?: number
}>(), {
  showQuota: false,
  quotaUsed: 0,
  quotaLimit: 10,
})

const route = useRoute()

function isActiveTab(to: string) {
  return route.path === to || route.path.startsWith(to + '/')
}
</script>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
