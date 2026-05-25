<template>
  <div
    class="relative overflow-hidden rounded-2xl"
    @mouseenter="isPaused = true"
    @mouseleave="isPaused = false"
  >
    <!-- Slides container -->
    <div
      class="flex transition-transform duration-500 ease-in-out"
      :style="{ transform: `translateX(-${activeIndex * 100}%)` }"
    >
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="w-full shrink-0 flex items-center justify-between p-8 min-h-[180px]"
        :style="{ background: slide.bg }"
      >
        <div class="flex-1 pr-6">
          <div class="flex items-center gap-2 mb-2">
            <h3 class="text-lg font-bold text-white">
              {{ slide.emoji }} {{ slide.title }}
            </h3>
            <span
              v-if="slide.badge"
              class="px-2 py-0.5 text-xs font-semibold rounded-full bg-white/20 text-white"
            >
              {{ slide.badge }}
            </span>
          </div>
          <p class="text-sm text-white/80">{{ slide.description }}</p>
        </div>
        <div class="w-28 h-28 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
          <span class="text-5xl">{{ slide.emoji }}</span>
        </div>
      </div>
    </div>

    <!-- Dot indicators -->
    <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
      <button
        v-for="(_, index) in slides"
        :key="index"
        class="rounded-full transition-all duration-300"
        :class="activeIndex === index ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/70'"
        :aria-label="`Go to slide ${index + 1}`"
        @click="goToSlide(index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const slides = [
  {
    emoji: '🎨',
    title: 'Agent Slides Empowers Intelligent Slide Creation!',
    description: 'Create stunning presentations with AI-powered intelligent slide generation.',
    bg: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    badge: null,
  },
  {
    emoji: '🎊',
    title: 'Master Learning with New AI Flashcard Maker!',
    description: 'Turn any content into effective flashcards for better retention.',
    bg: 'linear-gradient(135deg, #2E83FB, #06b6d4)',
    badge: 'Free',
  },
  {
    emoji: '🎉',
    title: 'Nano Banana Pro Slides now supports editing~',
    description: 'Edit and customize your AI-generated slides with full control.',
    bg: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    badge: null,
  },
  {
    emoji: '🎸',
    title: 'New AI Music Generator Update! 🥳',
    description: 'Create original music tracks with our improved AI engine.',
    bg: 'linear-gradient(135deg, #10b981, #059669)',
    badge: null,
  },
]

const activeIndex = ref(0)
const isPaused = ref(false)
let intervalId: ReturnType<typeof setInterval> | null = null

function goToSlide(index: number) {
  activeIndex.value = index
  resetInterval()
}

function nextSlide() {
  if (!isPaused.value) {
    activeIndex.value = (activeIndex.value + 1) % slides.length
  }
}

function resetInterval() {
  if (intervalId) clearInterval(intervalId)
  intervalId = setInterval(nextSlide, 5000)
}

onMounted(() => {
  resetInterval()
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>
