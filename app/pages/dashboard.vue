<template>
  <div>
    <NuxtLayout name="dashboard">
      <div class="max-w-5xl mx-auto">
        <!-- Greeting -->
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900">
            Good {{ timeOfDay }}, {{ userName }} 👋
          </h1>
          <p class="text-gray-500 mt-1">What would you like to learn today?</p>
        </div>

        <!-- Search Bar -->
        <div class="relative mb-8">
          <div class="flex items-center bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm focus-within:border-[#2E83FB] focus-within:ring-1 focus-within:ring-[#2E83FB]/20 transition-all">
            <Icon name="heroicons:magnifying-glass" class="w-5 h-5 text-gray-400 shrink-0" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search tools, notes, or paste a YouTube URL..."
              class="flex-1 ml-3 text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none"
              @keydown.enter="handleSearch"
            />
            <button
              v-if="searchQuery"
              class="text-gray-400 hover:text-gray-600"
              @click="searchQuery = ''"
            >
              <Icon name="heroicons:x-mark" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Carousel Banner -->
        <div class="mb-8">
          <CarouselBanner />
        </div>

        <!-- Tool Tabs -->
        <div class="mb-6">
          <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              v-for="tab in toolTabs"
              :key="tab.id"
              class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
              :class="activeTab === tab.id
                ? 'bg-[#2E83FB] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- Tool Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          <NuxtLink
            v-for="tool in currentTools"
            :key="tool.name"
            :to="tool.to"
            class="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-[#2E83FB]/30 transition-all group"
          >
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" :class="tool.bgColor">
                <Icon :name="tool.icon" class="w-5 h-5" :class="tool.iconColor" />
              </div>
              <div class="min-w-0">
                <h3 class="font-medium text-gray-900 text-sm group-hover:text-[#2E83FB] transition-colors">{{ tool.name }}</h3>
                <p class="text-xs text-gray-500 mt-0.5 line-clamp-2">{{ tool.description }}</p>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="bg-white rounded-xl p-4 border border-gray-100">
            <p class="text-xs text-gray-500 mb-1">Notes Saved</p>
            <p class="text-xl font-bold text-gray-900">{{ stats.notes }}</p>
          </div>
          <div class="bg-white rounded-xl p-4 border border-gray-100">
            <p class="text-xs text-gray-500 mb-1">Summaries</p>
            <p class="text-xl font-bold text-gray-900">{{ stats.summaries }}</p>
          </div>
          <div class="bg-white rounded-xl p-4 border border-gray-100">
            <p class="text-xs text-gray-500 mb-1">Quota Used</p>
            <p class="text-xl font-bold text-gray-900">{{ stats.quotaUsed }}/{{ stats.quotaLimit }}</p>
          </div>
          <div class="bg-white rounded-xl p-4 border border-gray-100">
            <p class="text-xs text-gray-500 mb-1">Plan</p>
            <p class="text-xl font-bold text-[#2E83FB]">{{ stats.plan }}</p>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'auth' })

const user = useSupabaseUser()
const { profile, remainingQuota } = useProfile()

const searchQuery = ref('')
const activeTab = ref('youtube')

const userName = computed(() => {
  return user.value?.user_metadata?.full_name || user.value?.email?.split('@')[0] || 'there'
})

const timeOfDay = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
})

const stats = computed(() => ({
  notes: profile.value?.notes_count || 0,
  summaries: profile.value?.basic_quotas_used || 0,
  quotaUsed: profile.value?.basic_quotas_used || 0,
  quotaLimit: profile.value?.basic_quotas_limit || 10,
  plan: profile.value?.plan === 'unlimited' ? 'Unlimited' : profile.value?.plan === 'premium' ? 'Pro' : 'Basic',
}))

const toolTabs = [
  { id: 'youtube', label: 'AI YouTube' },
  { id: 'summarizer', label: 'AI Summarizer' },
  { id: 'voices', label: 'AI Voices' },
  { id: 'images', label: 'AI Images' },
  { id: 'study', label: 'AI Study' },
  { id: 'chat', label: 'AI Chat' },
  { id: 'more', label: 'More Tools' },
]

const toolsByTab: Record<string, Array<{ name: string; icon: string; to: string; description: string; bgColor: string; iconColor: string }>> = {
  youtube: [
    { name: 'YouTube Summarizer', icon: 'heroicons:play-circle', to: '/youtube-video-summarizer', description: 'Summarize any YouTube video', bgColor: 'bg-red-50', iconColor: 'text-red-500' },
    { name: 'Transcript Generator', icon: 'heroicons:document-text', to: '/youtube-transcript-generator', description: 'Get full video transcripts', bgColor: 'bg-blue-50', iconColor: 'text-blue-500' },
    { name: 'Video Summarizer', icon: 'heroicons:video-camera', to: '/video-summarizer', description: 'Summarize uploaded videos', bgColor: 'bg-purple-50', iconColor: 'text-purple-500' },
    { name: 'Audio Summarizer', icon: 'heroicons:speaker-wave', to: '/audio-summary', description: 'Summarize audio files', bgColor: 'bg-green-50', iconColor: 'text-green-500' },
  ],
  summarizer: [
    { name: 'PDF Summarizer', icon: 'heroicons:document', to: '/pdf-summary', description: 'Summarize PDF documents', bgColor: 'bg-orange-50', iconColor: 'text-orange-500' },
    { name: 'Article Summarizer', icon: 'heroicons:newspaper', to: '/article-summary', description: 'Condense long articles', bgColor: 'bg-teal-50', iconColor: 'text-teal-500' },
    { name: 'Book Summarizer', icon: 'heroicons:book-open', to: '/book-summary', description: 'Key insights from books', bgColor: 'bg-indigo-50', iconColor: 'text-indigo-500' },
    { name: 'Text Summarizer', icon: 'heroicons:document-text', to: '/ai-text-summarizer', description: 'Summarize any text', bgColor: 'bg-cyan-50', iconColor: 'text-cyan-500' },
  ],
  voices: [
    { name: 'Text to Speech', icon: 'heroicons:speaker-wave', to: '/text-to-speech', description: 'Convert text to natural speech', bgColor: 'bg-violet-50', iconColor: 'text-violet-500' },
    { name: 'AI Voice Generator', icon: 'heroicons:microphone', to: '/ai-voice-generator', description: 'Generate AI voices', bgColor: 'bg-pink-50', iconColor: 'text-pink-500' },
    { name: 'AI Voice Cloning', icon: 'heroicons:user-circle', to: '/ai-voice-cloning', description: 'Clone any voice', bgColor: 'bg-rose-50', iconColor: 'text-rose-500' },
    { name: 'AI Podcast', icon: 'heroicons:radio', to: '/ai-podcast-generator', description: 'Create AI podcasts', bgColor: 'bg-amber-50', iconColor: 'text-amber-500' },
  ],
  images: [
    { name: 'AI Image Generator', icon: 'heroicons:sparkles', to: '/ai-image-generator', description: 'Generate images from text', bgColor: 'bg-fuchsia-50', iconColor: 'text-fuchsia-500' },
    { name: 'AI Video Generator', icon: 'heroicons:film', to: '/ai-video-generator', description: 'Create AI videos', bgColor: 'bg-sky-50', iconColor: 'text-sky-500' },
    { name: 'Background Remover', icon: 'heroicons:scissors', to: '/ai-background-remover', description: 'Remove backgrounds', bgColor: 'bg-lime-50', iconColor: 'text-lime-500' },
    { name: 'Image Upscaler', icon: 'heroicons:arrow-up-circle', to: '/ai-image-upscaler', description: 'Enhance image quality', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-500' },
  ],
  study: [
    { name: 'AI Flashcard Maker', icon: 'heroicons:rectangle-stack', to: '/ai-flashcard-maker', description: 'Create flashcards', bgColor: 'bg-yellow-50', iconColor: 'text-yellow-600' },
    { name: 'AI Quiz Generator', icon: 'heroicons:question-mark-circle', to: '/ai-quiz-generator', description: 'Generate quizzes', bgColor: 'bg-blue-50', iconColor: 'text-blue-500' },
    { name: 'AI Math Solver', icon: 'heroicons:calculator', to: '/ai-math-solver', description: 'Solve math problems', bgColor: 'bg-red-50', iconColor: 'text-red-500' },
    { name: 'AI Homework Helper', icon: 'heroicons:academic-cap', to: '/ai-homework-helper', description: 'Get homework help', bgColor: 'bg-purple-50', iconColor: 'text-purple-500' },
  ],
  chat: [
    { name: 'AI Chat', icon: 'heroicons:chat-bubble-left-right', to: '/ai-chat', description: 'Chat with AI models', bgColor: 'bg-blue-50', iconColor: 'text-blue-500' },
    { name: 'Chat PDF', icon: 'heroicons:document-magnifying-glass', to: '/chat-pdf', description: 'Chat with your PDFs', bgColor: 'bg-orange-50', iconColor: 'text-orange-500' },
    { name: 'Ask AI', icon: 'heroicons:light-bulb', to: '/ask-ai', description: 'Ask anything', bgColor: 'bg-amber-50', iconColor: 'text-amber-500' },
    { name: 'AI Writer', icon: 'heroicons:pencil-square', to: '/ai-detector', description: 'AI writing tools', bgColor: 'bg-green-50', iconColor: 'text-green-500' },
  ],
  more: [
    { name: 'AI Presentation', icon: 'heroicons:presentation-chart-bar', to: '/ai-presentation-maker', description: 'Create presentations', bgColor: 'bg-indigo-50', iconColor: 'text-indigo-500' },
    { name: 'AI Mind Map', icon: 'heroicons:map', to: '/ai-mind-map-generator', description: 'Generate mind maps', bgColor: 'bg-teal-50', iconColor: 'text-teal-500' },
    { name: 'AI Music', icon: 'heroicons:musical-note', to: '/ai-music-generator', description: 'Create AI music', bgColor: 'bg-pink-50', iconColor: 'text-pink-500' },
    { name: 'AI Detector', icon: 'heroicons:shield-check', to: '/ai-detector', description: 'Detect AI content', bgColor: 'bg-gray-50', iconColor: 'text-gray-500' },
  ],
}

const currentTools = computed(() => toolsByTab[activeTab.value] || toolsByTab.youtube)

function handleSearch() {
  const q = searchQuery.value.trim()
  if (!q) return

  // If it looks like a YouTube URL, go to summarizer
  if (q.includes('youtube.com') || q.includes('youtu.be')) {
    navigateTo(`/youtube-video-summarizer?url=${encodeURIComponent(q)}`)
    return
  }

  // Otherwise search notes
  navigateTo(`/notes?search=${encodeURIComponent(q)}`)
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
