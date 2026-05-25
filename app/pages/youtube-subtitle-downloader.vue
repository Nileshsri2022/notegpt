<template>
  <ToolPageLayout
    title="YouTube Subtitle Downloader"
    description="Download subtitles from any YouTube video in multiple formats."
    category="AI YouTube"
    category-icon="heroicons:play-circle"
    :tabs="navTabs"
  >
    <!-- URL Input -->
    <div class="bg-white rounded-[10px] border border-gray-200 p-6 mb-6">
      <div class="flex gap-3">
        <UInput
          v-model="videoUrl"
          placeholder="Paste YouTube video URL here..."
          size="lg"
          class="flex-1"
          :disabled="loading"
        />
        <UButton color="primary" size="lg" :loading="loading" @click="fetchSubtitles">
          Get Subtitles
        </UButton>
      </div>
      <p v-if="errorMessage" class="text-sm text-red-500 mt-2">{{ errorMessage }}</p>
    </div>

    <!-- Format Selection -->
    <div v-if="transcript" class="bg-white rounded-[10px] border border-gray-200 p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-semibold text-gray-900">{{ videoTitle }}</h2>
      </div>

      <label class="block text-sm font-medium text-gray-700 mb-3">Download format</label>
      <div class="flex flex-wrap gap-2 mb-4">
        <button
          v-for="fmt in formats"
          :key="fmt.id"
          class="px-4 py-2 rounded-[8px] text-sm font-medium transition-colors"
          :class="selectedFormat === fmt.id ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          @click="selectedFormat = fmt.id"
        >
          {{ fmt.label }}
        </button>
      </div>

      <UButton color="primary" variant="soft" @click="downloadSubtitles">
        <Icon name="heroicons:arrow-down-tray" class="w-4 h-4 mr-1" />
        Download .{{ selectedFormat }}
      </UButton>

      <!-- Preview -->
      <div class="mt-6 pt-4 border-t border-gray-100">
        <h3 class="text-sm font-medium text-gray-700 mb-2">Preview</h3>
        <div class="bg-gray-50 rounded-[8px] p-4 max-h-64 overflow-y-auto">
          <pre class="text-xs text-gray-600 whitespace-pre-wrap">{{ previewText }}</pre>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading" class="bg-gray-50 rounded-[10px] border border-dashed border-gray-200 p-12 text-center">
      <Icon name="heroicons:arrow-down-tray" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-500">Paste a YouTube URL to download subtitles</p>
    </div>
  </ToolPageLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'auth' })

const toast = useToast()
const { consumeQuota } = useProfile()

const videoUrl = ref('')
const transcript = ref('')
const videoTitle = ref('')
const loading = ref(false)
const errorMessage = ref('')
const selectedFormat = ref('txt')

const navTabs = [
  { label: 'YouTube Summarizer', to: '/youtube-video-summarizer' },
  { label: 'Transcript Generator', to: '/youtube-transcript-generator' },
  { label: 'Subtitle Downloader', to: '/youtube-subtitle-downloader' },
  { label: 'YouTube Subscriptions', to: '/youtube-subscriptions' },
]

const formats = [
  { id: 'txt', label: 'Plain Text (.txt)' },
  { id: 'srt', label: 'SRT (.srt)' },
  { id: 'vtt', label: 'WebVTT (.vtt)' },
]

const previewText = computed(() => {
  if (!transcript.value) return ''
  if (selectedFormat.value === 'txt') return transcript.value.slice(0, 500)
  if (selectedFormat.value === 'srt') {
    return '1\n00:00:00,000 --> 00:00:05,000\n' + transcript.value.slice(0, 200) + '\n\n2\n00:00:05,000 --> 00:00:10,000\n...'
  }
  return 'WEBVTT\n\n00:00:00.000 --> 00:00:05.000\n' + transcript.value.slice(0, 200) + '\n\n00:00:05.000 --> 00:00:10.000\n...'
})

async function fetchSubtitles() {
  if (!videoUrl.value.trim()) { errorMessage.value = 'Please enter a YouTube URL'; return }
  errorMessage.value = ''
  loading.value = true
  transcript.value = ''

  try {
    const quotaAvailable = await consumeQuota('youtube-subtitle')
    if (!quotaAvailable) { toast.add({ title: 'Quota Exhausted', color: 'warning' }); return }

    const res = await $fetch('/api/youtube/transcript', { method: 'POST', body: { url: videoUrl.value } })
    transcript.value = res.transcript
    videoTitle.value = res.title
  } catch (err: any) {
    errorMessage.value = err.data?.message || 'Failed to fetch subtitles'
  } finally {
    loading.value = false
  }
}

function downloadSubtitles() {
  let content = transcript.value
  let mimeType = 'text/plain'

  if (selectedFormat.value === 'srt') {
    content = '1\n00:00:00,000 --> 99:59:59,000\n' + transcript.value
    mimeType = 'application/x-subrip'
  } else if (selectedFormat.value === 'vtt') {
    content = 'WEBVTT\n\n00:00:00.000 --> 99:59:59.000\n' + transcript.value
    mimeType = 'text/vtt'
  }

  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${videoTitle.value || 'subtitles'}.${selectedFormat.value}`
  a.click()
  URL.revokeObjectURL(url)
  toast.add({ title: 'Downloaded!', color: 'success' })
}
</script>
