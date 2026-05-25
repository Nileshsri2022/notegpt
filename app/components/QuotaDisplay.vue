<template>
  <div class="flex items-center gap-2">
    <!-- Plan badge -->
    <span
      class="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full leading-none"
      :class="planClasses"
    >
      {{ planLabel }}
    </span>

    <!-- Quota bar (only for non-unlimited) -->
    <div v-if="!isUnlimited" class="flex items-center gap-1.5">
      <span class="text-xs text-gray-500 tabular-nums">{{ used }}/{{ limit }}</span>
      <div class="w-14 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-300"
          :class="barColor"
          :style="{ width: `${percentage}%` }"
        />
      </div>
    </div>

    <!-- Upgrade link -->
    <NuxtLink
      v-if="showUpgrade && plan === 'basic'"
      to="/pricing"
      class="text-[11px] font-medium text-[#2E83FB] hover:underline"
    >
      Upgrade
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  plan?: 'basic' | 'premium' | 'unlimited'
  used?: number
  limit?: number
  showUpgrade?: boolean
}>(), {
  plan: 'basic',
  used: 0,
  limit: 10,
  showUpgrade: true,
})

const isUnlimited = computed(() => props.plan === 'unlimited')

const percentage = computed(() => {
  if (props.limit === 0) return 0
  return Math.min((props.used / props.limit) * 100, 100)
})

const planLabel = computed(() => {
  switch (props.plan) {
    case 'premium': return 'Pro'
    case 'unlimited': return 'Unlimited'
    default: return 'Basic'
  }
})

const planClasses = computed(() => {
  switch (props.plan) {
    case 'premium': return 'bg-purple-100 text-purple-700'
    case 'unlimited': return 'bg-amber-100 text-amber-700'
    default: return 'bg-gray-100 text-gray-600'
  }
})

const barColor = computed(() => {
  if (percentage.value >= 90) return 'bg-red-500'
  if (percentage.value >= 70) return 'bg-amber-500'
  return 'bg-[#2E83FB]'
})
</script>
