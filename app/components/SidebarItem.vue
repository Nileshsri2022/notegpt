<template>
  <NuxtLink
    :to="to"
    class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
    :class="[
      isActive
        ? 'bg-primary-50 text-primary-600'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
      collapsed ? 'justify-center' : ''
    ]"
  >
    <Icon :name="icon" class="w-5 h-5 shrink-0" />
    <span v-if="!collapsed">{{ label }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  icon: string
  label: string
  to: string
  collapsed: boolean
}>()

const route = useRoute()
const isActive = computed(() => route.path === props.to)
</script>
