<template>
  <div class="flex items-center gap-4 text-sm">
    <div class="flex items-center gap-1.5">
      <span class="font-semibold text-gray-900">{{ basic }}</span>
      <span class="text-gray-500">basic</span>
    </div>
    <div class="flex items-center gap-1.5">
      <span class="font-semibold text-gray-900">{{ premium }}</span>
      <span class="text-gray-500">premium</span>
    </div>
    <NuxtLink
      to="/pricing"
      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary-500 text-white text-xs font-medium hover:bg-primary-600 transition-colors"
    >
      🚀 Upgrade
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  basic?: number
  premium?: number
}>(), {
  basic: 15,
  premium: 0,
})
</script>
