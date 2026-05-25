<template>
  <NuxtLink
    :to="to"
    :title="collapsed ? label : undefined"
    class="sidebar-item flex items-center rounded-lg text-[13px] font-medium transition-all duration-200 relative group"
    :class="[
      isActive
        ? 'bg-[#2E83FB]/10 text-[#2E83FB]'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
      collapsed ? 'justify-center w-10 h-10 mx-auto px-0' : 'gap-2.5 px-3 py-2'
    ]"
  >
    <Icon :name="icon" class="w-[18px] h-[18px] shrink-0" />
    <Transition name="label-fade">
      <span
        v-if="!collapsed"
        class="whitespace-nowrap overflow-hidden text-ellipsis"
      >{{ label }}</span>
    </Transition>
    <!-- Active indicator bar -->
    <span
      v-if="isActive && !collapsed"
      class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-[#2E83FB] rounded-r-full"
    />
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
const isActive = computed(() => {
  return route.path === props.to || route.path.startsWith(props.to + '/')
})
</script>

<style scoped>
.label-fade-enter-active,
.label-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.label-fade-enter-from,
.label-fade-leave-to {
  opacity: 0;
  transform: translateX(-4px);
}
</style>
