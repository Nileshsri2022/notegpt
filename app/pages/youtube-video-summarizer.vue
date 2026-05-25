<template>
  <div>
    <NuxtLayout name="dashboard">
      <div class="max-w-4xl mx-auto">
        <!-- Tool Header -->
        <div class="mb-6">
          <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span>AI YouTube</span>
            <Icon name="heroicons:chevron-right" class="w-3 h-3" />
            <span class="text-gray-900">YouTube Summarizer</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">Free YouTube Video Summarizer</h1>
          <p class="text-gray-600 mt-1">Paste a YouTube URL to get an AI-powered summary with key points.</p>
        </div>

        <!-- Quota Display -->
        <div class="flex items-center gap-4 mb-6 text-sm">
          <div class="flex items-center gap-1">
            <span class="font-semibold text-gray-900">15</span>
            <span class="text-gray-500">basic</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="font-semibold text-gray-900">0</span>
            <span class="text-gray-500">premium</span>
          </div>
          <NuxtLink to="/pricing" class="text-primary-500 text-xs font-medium hover:underline flex items-center gap-1">
            <Icon name="heroicons:rocket-launch" class="w-3 h-3" />
            Upgrade
          </NuxtLink>
        </div>

        <!-- Input Type Tabs -->
        <div class="flex flex-wrap gap-2 mb-4">
          <button
            v-for="inputType in inputTypes"
            :key="inputType.id"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="activeInput === inputType.id
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            @click="activeInput = inputType.id"
          >
            <Icon :name="inputType.icon" class="w-4 h-4 mr-1 inline" />
            {{ inputType.label }}
          </button>
        </div>

        <!-- URL Input -->
        <div class="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div class="flex gap-3">
            <UInput
              v-model="videoUrl"
              placeholder="Paste YouTube video URL here..."
              size="lg"
              class="flex-1"
            />
            <UButton color="primary" size="lg" :loading="loading" @click="generateSummary">
              Generate Summary
            </UButton>
          </div>
          <button class="text-sm text-primary-500 mt-3 hover:underline">
            + Add More Link
          </button>
        </div>

        <!-- Results -->
        <div v-if="summary" class="bg-white rounded-xl border border-gray-200 p-6">
          <div class="flex items-center gap-2 mb-4">
            <button class="px-3 py-1 rounded text-sm font-medium bg-primary-50 text-primary-600">Summary</button>
            <button class="px-3 py-1 rounded text-sm font-medium text-gray-500 hover:bg-gray-50">Key Points</button>
            <button class="px-3 py-1 rounded text-sm font-medium text-gray-500 hover:bg-gray-50">Transcript</button>
          </div>
          <div class="prose prose-sm max-w-none">
            <p>{{ summary }}</p>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="bg-gray-50 rounded-xl border border-dashed border-gray-200 p-12 text-center">
          <Icon name="heroicons:play-circle" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-500">Paste a YouTube URL above to generate a summary</p>
        </div>

        <!-- More Tools -->
        <div class="mt-8">
          <h3 class="text-sm font-medium text-gray-500 mb-3">More summary tools</h3>
          <div class="flex flex-wrap gap-2">
            <NuxtLink
              v-for="tool in relatedTools"
              :key="tool.to"
              :to="tool.to"
              class="px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-600 hover:bg-gray-200 transition-colors"
            >
              {{ tool.label }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const videoUrl = ref('')
const summary = ref('')
const loading = ref(false)
const activeInput = ref('youtube')

const inputTypes = [
  { id: 'youtube', label: 'YouTube', icon: 'heroicons:play-circle' },
  { id: 'video', label: 'Video', icon: 'heroicons:video-camera' },
  { id: 'audio', label: 'Audio', icon: 'heroicons:speaker-wave' },
  { id: 'pdf', label: 'PDF/Image', icon: 'heroicons:document' },
  { id: 'webpage', label: 'Webpage', icon: 'heroicons:globe-alt' },
  { id: 'text', label: 'Long Text', icon: 'heroicons:document-text' },
]

const relatedTools = [
  { label: 'PPT Summarizer', to: '/ppt-summary' },
  { label: 'Image Summarizer', to: '/image-summary' },
  { label: 'Word Summarizer', to: '/word-summary' },
  { label: 'Book Summarizer', to: '/book-summary' },
  { label: 'Article Summarizer', to: '/article-summary' },
]

const generateSummary = async () => {
  if (!videoUrl.value) return
  loading.value = true
  try {
    // TODO: Call server API for summarization
    await new Promise(resolve => setTimeout(resolve, 2000))
    summary.value = 'This is a placeholder summary. Once the backend is connected, this will show an AI-generated summary of the YouTube video with key points, timestamps, and insights.'
  } finally {
    loading.value = false
  }
}
</script>
