<template>
  <div>
    <NuxtLayout name="dashboard">
      <div class="max-w-4xl mx-auto">
        <!-- Greeting -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900 mb-1">👋 Hi~ Let me help you get started!</h1>
          <p class="text-gray-500">Choose a tool below or search for what you need.</p>
        </div>

        <!-- Search -->
        <div class="mb-8">
          <UInput
            placeholder="Search Tools..."
            size="lg"
            class="max-w-lg"
          >
            <template #leading>
              <Icon name="heroicons:magnifying-glass" class="w-5 h-5 text-gray-400" />
            </template>
          </UInput>
        </div>

        <!-- Tool Tabs -->
        <div class="flex flex-wrap gap-2 mb-6">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
            :class="activeTab === tab.id
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Tool Cards Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          <NuxtLink
            v-for="tool in currentTools"
            :key="tool.to"
            :to="tool.to"
            class="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-primary-200 transition-all text-center group"
          >
            <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-100 transition-colors">
              <Icon :name="tool.icon" class="w-5 h-5 text-primary-500" />
            </div>
            <p class="text-sm font-medium text-gray-900">{{ tool.name }}</p>
          </NuxtLink>
        </div>

        <!-- Banner Carousel -->
        <div class="bg-gradient-to-r from-primary-500 to-blue-600 rounded-2xl p-8 text-white">
          <h3 class="text-xl font-bold mb-2">🎉 New: AI Music Generator</h3>
          <p class="text-white/80 text-sm mb-4">Create original music with AI. Try it now!</p>
          <UButton variant="solid" color="neutral" size="sm">
            Try Now →
          </UButton>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const activeTab = ref('all')

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'youtube', label: 'AI YouTube' },
  { id: 'transcriber', label: 'AI Transcriber' },
  { id: 'summarizer', label: 'AI Summarizer' },
  { id: 'voices', label: 'AI Voices' },
  { id: 'images', label: 'AI Images' },
  { id: 'study', label: 'AI Study' },
]

const allTools = [
  { name: 'YouTube Summarizer', icon: 'heroicons:play-circle', to: '/youtube-video-summarizer', category: 'youtube' },
  { name: 'Transcript Generator', icon: 'heroicons:document-text', to: '/youtube-transcript-generator', category: 'youtube' },
  { name: 'Audio to Text', icon: 'heroicons:microphone', to: '/audio-to-text-converter', category: 'transcriber' },
  { name: 'Speech to Text', icon: 'heroicons:speaker-wave', to: '/speech-to-text', category: 'transcriber' },
  { name: 'PDF Summarizer', icon: 'heroicons:document', to: '/pdf-summary', category: 'summarizer' },
  { name: 'Article Summarizer', icon: 'heroicons:newspaper', to: '/article-summary', category: 'summarizer' },
  { name: 'Text to Speech', icon: 'heroicons:speaker-wave', to: '/text-to-speech', category: 'voices' },
  { name: 'AI Voice Generator', icon: 'heroicons:microphone', to: '/ai-voice-generator', category: 'voices' },
  { name: 'AI Image Generator', icon: 'heroicons:sparkles', to: '/ai-image-generator', category: 'images' },
  { name: 'Background Remover', icon: 'heroicons:scissors', to: '/ai-background-remover', category: 'images' },
  { name: 'AI Chat', icon: 'heroicons:chat-bubble-left-right', to: '/ai-chat', category: 'all' },
  { name: 'AI Flashcards', icon: 'heroicons:rectangle-stack', to: '/ai-flashcard-maker', category: 'study' },
  { name: 'AI Quiz', icon: 'heroicons:question-mark-circle', to: '/ai-quiz-generator', category: 'study' },
  { name: 'Math Solver', icon: 'heroicons:calculator', to: '/ai-math-solver', category: 'study' },
  { name: 'AI Presentation', icon: 'heroicons:presentation-chart-bar', to: '/ai-presentation-maker', category: 'all' },
  { name: 'Mind Map', icon: 'heroicons:map', to: '/ai-mind-map-generator', category: 'all' },
]

const currentTools = computed(() => {
  if (activeTab.value === 'all') return allTools
  return allTools.filter(t => t.category === activeTab.value)
})
</script>
