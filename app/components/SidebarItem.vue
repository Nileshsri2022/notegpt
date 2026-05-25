<template>
  <UTooltip :text="collapsed ? label : ''" :delay-duration="200" :disabled="!collapsed">
    <NuxtLink
      :to="to"
      class="sidebar-item flex items-center rounded-lg text-sm font-medium transition-all duration-200 relative group"
      :class="[
        isActive
          ? 'bg-[#2E83FB]/10 text-[#2E83FB]'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
        collapsed ? 'justify-center w-10 h-10 mx-auto px-0' : 'gap-3 px-3 py-2.5'
      ]"
    >
      <Icon :name="icon" class="w-5 h-5 shrink-0" />
      <Transition name="label-fade">
        <span
          v-if="!collapsed"
          class="whitespace-nowrap overflow-hidden text-ellipsis"
        >{{ label }}</span>
      </Transition>
      <!-- Active indicator bar -->
      <span
        v-if="isActive && !collapsed"
        class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#2E83FB] rounded-r-full"
      />
    </NuxtLink>
  </UTooltip>
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
