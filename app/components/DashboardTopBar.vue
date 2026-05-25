<template>
  <header class="flex items-center justify-between h-14 px-4 border-b border-gray-100 bg-white sticky top-0 z-30">
    <div class="flex items-center gap-3">
      <!-- Mobile menu button -->
      <button
        class="lg:hidden text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100 transition-colors"
        @click="$emit('toggle-mobile-sidebar')"
      >
        <Icon name="heroicons:bars-3" class="w-6 h-6" />
      </button>

      <!-- Breadcrumb / Page title -->
      <div class="hidden sm:flex items-center gap-1.5 text-sm text-gray-500">
        <span class="font-medium text-gray-900">{{ pageTitle }}</span>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <!-- Start Free Trial button -->
      <UButton
        v-if="!isPro"
        size="sm"
        color="primary"
        variant="solid"
        class="text-xs font-medium"
        to="/pricing"
      >
        Start Free Trial
      </UButton>

      <!-- Settings -->
      <button class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
        <Icon name="heroicons:cog-6-tooth" class="w-5 h-5" />
      </button>

      <!-- User avatar -->
      <div class="w-8 h-8 rounded-full bg-[#2E83FB] flex items-center justify-center cursor-pointer">
        <span class="text-white text-sm font-medium">{{ userInitial }}</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
defineEmits(['toggle-mobile-sidebar'])

const route = useRoute()
const user = useSupabaseUser()
const userInitial = computed(() => {
  const name = user.value?.user_metadata?.full_name || user.value?.email?.split('@')[0] || 'U'
  return name.charAt(0).toUpperCase()
})

const isPro = ref(false) // TODO: wire to subscription status

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/youtube-video-summarizer': 'AI YouTube',
    '/youtube-transcript-generator': 'AI Transcriber',
    '/pdf-summary': 'AI Summarizer',
    '/text-to-speech': 'AI Voices',
    '/ai-image-generator': 'AI Images',
    '/ai-video-generator': 'AI Video',
    '/ai-presentation-maker': 'AI Presentation',
    '/ai-chat': 'AI Chat',
    '/ai-detector': 'AI Writer',
    '/chat-pdf': 'AI PDF',
    '/ai-homework-helper': 'AI Study',
    '/notes': 'My Notes',
    '/pricing': 'Pricing',
  }
  return titles[route.path] || 'Dashboard'
})
</script>
