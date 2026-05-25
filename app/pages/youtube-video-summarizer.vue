<template>
  <div>
    <NuxtLayout name="dashboard">
      <template #header>
        <ToolSubNav
          category="AI YouTube"
          :tabs="subNavTabs"
          :show-quota="true"
          :quota-used="10 - remainingQuota"
          :quota-limit="10"
        >
          <template #right>
            <a
              href="https://chromewebstore.google.com/detail/notegpt"
              target="_blank"
              class="text-xs text-[#2E83FB] hover:underline flex items-center gap-1"
            >
              YouTube Extension
              <Icon name="heroicons:arrow-top-right-on-square" class="w-3 h-3" />
            </a>
          </template>
        </ToolSubNav>
      </template>

      <div class="max-w-4xl mx-auto">
        <!-- Logo + Title -->
        <div class="text-center mb-6">
          <img
            src="https://cdn.notegpt.io/notegpt/static/tario_image/home/logo_with_notegpt.webp"
            alt="NoteGPT"
            class="h-8 mx-auto mb-3"
          />
          <h1 class="text-xl font-bold text-gray-900">Free YouTube Video Summarizer</h1>
          <p class="text-sm text-gray-500 mt-1 max-w-lg mx-auto">
            Batch summarize YouTube videos and playlists in seconds, generating comprehensive and in-depth summaries.
          </p>
        </div>

        <!-- Input Type Tabs (YouTube, Video, Audio, PDF, Webpage, Long Text) -->
        <div class="flex flex-wrap justify-center gap-1 mb-5">
          <NuxtLink
            v-for="inputType in inputTypes"
            :key="inputType.to"
            :to="inputType.to"
            class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            :class="inputType.to === '/youtube-video-summarizer'
              ? 'bg-[#2E83FB] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          >
            {{ inputType.label }}
          </NuxtLink>
        </div>

        <!-- URL Input Card -->
        <div class="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <!-- YouTube Video / Playlist Toggle -->
          <div class="flex items-center gap-4 mb-4">
            <button
              class="text-sm font-medium pb-1 border-b-2 transition-colors"
              :class="inputMode === 'video' ? 'text-[#2E83FB] border-[#2E83FB]' : 'text-gray-500 border-transparent hover:text-gray-700'"
              @click="inputMode = 'video'"
            >
              YouTube Video
            </button>
            <button
              class="text-sm font-medium pb-1 border-b-2 transition-colors"
              :class="inputMode === 'playlist' ? 'text-[#2E83FB] border-[#2E83FB]' : 'text-gray-500 border-transparent hover:text-gray-700'"
              @click="inputMode = 'playlist'"
            >
              YouTube Playlist
            </button>
          </div>

          <!-- URL Input -->
          <div class="space-y-3">
            <div v-for="(url, idx) in videoUrls" :key="idx" class="flex gap-2">
              <UInput
                v-model="videoUrls[idx]"
                :placeholder="inputMode === 'video' ? 'Paste YouTube video URL here...' : 'Paste YouTube playlist URL here...'"
                size="lg"
                class="flex-1"
                :disabled="loading"
              />
              <button
                v-if="videoUrls.length > 1"
                class="p-2 text-gray-400 hover:text-red-500 transition-colors"
                @click="removeUrl(idx)"
              >
                <Icon name="heroicons:x-mark" class="w-5 h-5" />
              </button>
            </div>

            <!-- Add More Link -->
            <button
              v-if="videoUrls.length < 5"
              class="text-sm text-[#2E83FB] hover:underline flex items-center gap-1"
              @click="addUrl"
            >
              <Icon name="heroicons:plus" class="w-4 h-4" />
              Add More Link
            </button>
          </div>

          <!-- Generate Button -->
          <div class="flex items-center gap-3 mt-5">
            <UButton color="primary" size="lg" :loading="loading" @click="generateSummary">
              Generate Summary
            </UButton>
            <button
              class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              @click="fillExample"
            >
              Example
            </button>
          </div>

          <p v-if="errorMessage" class="text-sm text-red-500 mt-3">{{ errorMessage }}</p>
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
        <div v-if="summary" class="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          <!-- Video Info -->
          <div v-if="videoTitle" class="px-6 pt-5 pb-3 border-b border-gray-100">
            <h2 class="font-semibold text-gray-900">{{ videoTitle }}</h2>
            <p v-if="videoDuration" class="text-sm text-gray-500 mt-1">Duration: {{ videoDuration }}</p>
          </div>

          <!-- Result Tabs -->
          <div class="flex items-center gap-1 px-6 pt-3 border-b border-gray-100">
            <button
              v-for="tab in resultTabs"
              :key="tab.value"
              class="px-3 py-2 text-sm font-medium rounded-t-md transition-colors relative"
              :class="activeResultTab === tab.value
                ? 'text-[#2E83FB]'
                : 'text-gray-500 hover:text-gray-700'"
              @click="activeResultTab = tab.value"
            >
              {{ tab.label }}
              <span
                v-if="activeResultTab === tab.value"
                class="absolute bottom-0 left-2 right-2 h-0.5 bg-[#2E83FB] rounded-full"
              />
            </button>
          </div>

          <!-- Tab Content -->
          <div class="p-6">
            <div v-if="activeResultTab === 'summary'">
              <div class="prose prose-sm max-w-none whitespace-pre-wrap">{{ summary }}</div>
            </div>
            <div v-else-if="activeResultTab === 'transcript'">
              <div class="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700 max-h-96 overflow-y-auto">
                {{ transcript }}
              </div>
            </div>
            <div v-else>
              <p class="text-gray-500 text-sm text-center py-8">This feature is coming soon.</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3 px-6 pb-5 border-t border-gray-100 pt-4">
            <UButton color="primary" variant="soft" size="sm" @click="saveToNotes" :loading="saving">
              <Icon name="heroicons:bookmark" class="w-4 h-4 mr-1" />
              Save to Notes
            </UButton>
            <UButton color="neutral" variant="ghost" size="sm" @click="copyToClipboard">
              <Icon name="heroicons:clipboard-document" class="w-4 h-4 mr-1" />
              Copy
            </UButton>
            <UButton color="neutral" variant="ghost" size="sm" @click="activeResultTab = 'transcript'">
              <Icon name="heroicons:document-text" class="w-4 h-4 mr-1" />
              View Transcript
            </UButton>
          </div>
        </div>

        <!-- Empty state with example thumbnails -->
        <div v-else-if="!loading" class="bg-white rounded-xl border border-gray-200 p-8">
          <div class="text-center mb-6">
            <img
              src="https://cdn.notegpt.io/notegpt/static/tario_image/youtube-transcript-generator/notegpt-empty-container.png"
              alt="Empty"
              class="w-48 mx-auto opacity-60"
            />
          </div>
        </div>

        <!-- More Tools -->
        <div class="mt-8 mb-4">
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

const videoUrls = ref([''])
const videoUrl = computed(() => videoUrls.value[0] || '')
const summary = ref('')
const transcript = ref('')
const videoTitle = ref('')
const videoDuration = ref('')
const loading = ref(false)
const saving = ref(false)
const currentStep = ref(0)
const errorMessage = ref('')
const inputMode = ref<'video' | 'playlist'>('video')
const activeResultTab = ref('summary')

const subNavTabs = [
  { label: 'YouTube Summarizer', to: '/youtube-video-summarizer' },
  { label: 'YouTube Transcript', to: '/youtube-transcript-generator' },
  { label: 'YouTube Subtitle', to: '/youtube-subtitle-downloader' },
  { label: 'YouTube Subscriptions', to: '/youtube-subscriptions' },
]

const inputTypes = [
  { label: 'YouTube', to: '/youtube-video-summarizer' },
  { label: 'Video', to: '/video-summarizer' },
  { label: 'Audio', to: '/audio-summary' },
  { label: 'PDF, Image & More Files', to: '/pdf-summary' },
  { label: 'Webpage', to: '/article-summary' },
  { label: 'Long Text', to: '/ai-text-summarizer' },
]

const resultTabs = [
  { label: 'Summary', value: 'summary' },
  { label: 'Transcript', value: 'transcript' },
  { label: 'Notes', value: 'notes' },
  { label: 'Mind Map', value: 'mindmap' },
]

const relatedTools = [
  { label: 'PPT Summarizer', to: '/ppt-summary' },
  { label: 'Image Summarizer', to: '/image-summary' },
  { label: 'Word Summarizer', to: '/word-summary' },
  { label: 'Book Summarizer', to: '/book-summary' },
]

function addUrl() {
  if (videoUrls.value.length < 5) videoUrls.value.push('')
}

function removeUrl(idx: number) {
  videoUrls.value.splice(idx, 1)
}

function fillExample() {
  videoUrls.value = ['https://www.youtube.com/watch?v=dQw4w9WgXcQ']
}

const generateSummary = async () => {
  const url = videoUrls.value[0]?.trim()
  if (!url) {
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
    const quotaAvailable = await consumeQuota('youtube-summarizer')
    if (!quotaAvailable) {
      errorMessage.value = 'You have used all your free credits. Please upgrade your plan.'
      toast.add({ title: 'Quota Exhausted', description: 'Upgrade to continue using this tool.', color: 'warning' })
      return
    }

    // Step 1: Fetch transcript
    const transcriptResponse = await $fetch('/api/youtube/transcript', {
      method: 'POST',
      body: { url },
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
    toast.add({ title: 'Error', description: message, color: 'error' })
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
      metadata: { duration: videoDuration.value },
    })
    toast.add({ title: 'Saved!', description: 'Summary saved to your notes.', color: 'success' })
  } catch {
    toast.add({ title: 'Error', description: 'Failed to save note.', color: 'error' })
  } finally {
    saving.value = false
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(summary.value)
    toast.add({ title: 'Copied!', description: 'Summary copied to clipboard.', color: 'success' })
  } catch {
    toast.add({ title: 'Error', description: 'Failed to copy.', color: 'error' })
  }
}
</script>
