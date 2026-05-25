<template>
  <div>
    <NuxtLayout name="dashboard">
      <!-- Tool Sub-Navigation Bar -->
      <template #header>
        <ToolSubNav
          category="YouTube Summarizer"
          category-icon="heroicons:play-circle"
          v-model="activeResultTab"
          :tabs="resultTabs"
          :basic-remaining="remainingQuota"
          :premium-remaining="0"
        />
      </template>

      <div class="max-w-4xl mx-auto">
        <!-- Tool Header -->
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900">Free YouTube Video Summarizer</h1>
          <p class="text-gray-600 mt-1">Paste a YouTube URL to get an AI-powered summary with key points.</p>
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
              :disabled="loading"
            />
            <UButton color="primary" size="lg" :loading="loading" @click="generateSummary">
              Generate Summary
            </UButton>
          </div>
          <p v-if="errorMessage" class="text-sm text-red-500 mt-2">{{ errorMessage }}</p>
        </div>

        <!-- Loading Steps -->
        <div v-if="loading" class="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <Icon
                :name="currentStep >= 1 ? 'heroicons:check-circle-solid' : 'lucide:loader-circle'"
                class="w-5 h-5"
                :class="currentStep >= 1 ? 'text-green-500' : 'text-primary-500 animate-spin'"
              />
              <span class="text-sm" :class="currentStep >= 1 ? 'text-green-700' : 'text-gray-600'">
                Fetching video transcript...
              </span>
            </div>
            <div v-if="currentStep >= 1" class="flex items-center gap-3">
              <Icon
                :name="currentStep >= 2 ? 'heroicons:check-circle-solid' : 'lucide:loader-circle'"
                class="w-5 h-5"
                :class="currentStep >= 2 ? 'text-green-500' : 'text-primary-500 animate-spin'"
              />
              <span class="text-sm" :class="currentStep >= 2 ? 'text-green-700' : 'text-gray-600'">
                Generating AI summary...
              </span>
            </div>
          </div>
        </div>

        <!-- Results -->
        <div v-if="summary" class="bg-white rounded-xl border border-gray-200 p-6">
          <!-- Video Info -->
          <div v-if="videoTitle" class="mb-4 pb-4 border-b border-gray-100">
            <h2 class="font-semibold text-gray-900">{{ videoTitle }}</h2>
            <p v-if="videoDuration" class="text-sm text-gray-500 mt-1">Duration: {{ videoDuration }}</p>
          </div>

          <!-- Tab Content -->
          <div v-if="activeResultTab === 'summary'">
            <div class="prose prose-sm max-w-none whitespace-pre-wrap">{{ summary }}</div>
          </div>
          <div v-else-if="activeResultTab === 'transcript'">
            <div class="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700 max-h-96 overflow-y-auto">
              {{ transcript }}
            </div>
          </div>
          <div v-else>
            <p class="text-gray-500 text-sm">This feature is coming soon.</p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
            <UButton color="primary" variant="soft" size="sm" @click="saveToNotes" :loading="saving">
              <Icon name="heroicons:bookmark" class="w-4 h-4 mr-1" />
              Save to Notes
            </UButton>
            <UButton color="neutral" variant="ghost" size="sm" @click="copyToClipboard">
              <Icon name="heroicons:clipboard-document" class="w-4 h-4 mr-1" />
              Copy
            </UButton>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else-if="!loading" class="bg-gray-50 rounded-xl border border-dashed border-gray-200 p-12 text-center">
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
definePageMeta({ layout: false, middleware: 'auth' })

const toast = useToast()
const { consumeQuota, remainingQuota } = useProfile()
const { createNote } = useNotes()

const videoUrl = ref('')
const summary = ref('')
const transcript = ref('')
const videoTitle = ref('')
const videoDuration = ref('')
const loading = ref(false)
const saving = ref(false)
const currentStep = ref(0)
const errorMessage = ref('')
const activeInput = ref('youtube')
const activeResultTab = ref('summary')

const resultTabs = [
  { label: 'Summary', value: 'summary' },
  { label: 'Transcript', value: 'transcript' },
  { label: 'Notes', value: 'notes' },
  { label: 'Mind Map', value: 'mindmap' },
]

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
  if (!videoUrl.value.trim()) {
    errorMessage.value = 'Please enter a YouTube URL'
    return
  }

  errorMessage.value = ''
  loading.value = true
  currentStep.value = 0
  summary.value = ''
  transcript.value = ''
  videoTitle.value = ''
  videoDuration.value = ''

  try {
    // Check quota
    const quotaAvailable = await consumeQuota('youtube-summarizer')
    if (!quotaAvailable) {
      errorMessage.value = 'You have used all your free credits. Please upgrade your plan.'
      toast.add({
        title: 'Quota Exhausted',
        description: 'Upgrade to continue using this tool.',
        color: 'warning',
      })
      return
    }

    // Step 1: Fetch transcript
    currentStep.value = 0
    const transcriptResponse = await $fetch('/api/youtube/transcript', {
      method: 'POST',
      body: { url: videoUrl.value },
    })

    transcript.value = transcriptResponse.transcript
    videoTitle.value = transcriptResponse.title
    videoDuration.value = transcriptResponse.duration
    currentStep.value = 1

    // Step 2: Generate summary
    const summaryResponse = await $fetch('/api/summarize', {
      method: 'POST',
      body: {
        content: transcriptResponse.transcript,
        type: 'YouTube video transcript',
      },
    })

    summary.value = summaryResponse.summary
    currentStep.value = 2
  } catch (err: any) {
    const message = err.data?.message || err.message || 'An error occurred'
    errorMessage.value = message
    toast.add({
      title: 'Error',
      description: message,
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}

const saveToNotes = async () => {
  if (!summary.value) return
  saving.value = true

  try {
    await createNote({
      title: videoTitle.value || 'YouTube Summary',
      content: transcript.value,
      summary: summary.value,
      source_type: 'youtube',
      source_url: videoUrl.value,
      metadata: {
        duration: videoDuration.value,
      },
    })

    toast.add({
      title: 'Saved!',
      description: 'Summary saved to your notes.',
      color: 'success',
    })
  } catch {
    toast.add({
      title: 'Error',
      description: 'Failed to save note.',
      color: 'error',
    })
  } finally {
    saving.value = false
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(summary.value)
    toast.add({
      title: 'Copied!',
      description: 'Summary copied to clipboard.',
      color: 'success',
    })
  } catch {
    toast.add({
      title: 'Error',
      description: 'Failed to copy to clipboard.',
      color: 'error',
    })
  }
}
</script>
