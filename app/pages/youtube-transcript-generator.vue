<template>
  <ToolPageLayout
    title="YouTube Transcript Generator"
    description="Get full transcripts from any YouTube video instantly."
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
        <UButton color="primary" size="lg" :loading="loading" @click="getTranscript">
          Get Transcript
        </UButton>
      </div>
      <p v-if="errorMessage" class="text-sm text-red-500 mt-2">{{ errorMessage }}</p>
    </div>

    <!-- Results -->
    <div v-if="transcript" class="bg-white rounded-[10px] border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-semibold text-gray-900">{{ videoTitle }}</h2>
        <UButton color="neutral" variant="ghost" size="sm" @click="copyToClipboard">
          <Icon name="heroicons:clipboard-document" class="w-4 h-4 mr-1" />
          Copy
        </UButton>
      </div>
      <div class="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700 max-h-[500px] overflow-y-auto">
        {{ transcript }}
      </div>
      <div class="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
        <UButton color="primary" variant="soft" size="sm" :loading="saving" @click="saveToNotes">
          <Icon name="heroicons:bookmark" class="w-4 h-4 mr-1" />
          Save to Notes
        </UButton>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading" class="bg-gray-50 rounded-[10px] border border-dashed border-gray-200 p-12 text-center">
      <Icon name="heroicons:document-text" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-500">Paste a YouTube URL above to extract the full transcript</p>
    </div>
  </ToolPageLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'auth' })

const toast = useToast()
const { consumeQuota } = useProfile()
const { createNote } = useNotes()

const videoUrl = ref('')
const transcript = ref('')
const videoTitle = ref('')
const loading = ref(false)
const saving = ref(false)
const errorMessage = ref('')

const navTabs = [
  { label: 'YouTube Summarizer', to: '/youtube-video-summarizer' },
  { label: 'Transcript Generator', to: '/youtube-transcript-generator' },
  { label: 'Subtitle Downloader', to: '/youtube-subtitle-downloader' },
  { label: 'YouTube Subscriptions', to: '/youtube-subscriptions' },
]

async function getTranscript() {
  if (!videoUrl.value.trim()) { errorMessage.value = 'Please enter a YouTube URL'; return }
  errorMessage.value = ''
  loading.value = true
  transcript.value = ''

  try {
    const quotaAvailable = await consumeQuota('youtube-transcript')
    if (!quotaAvailable) { toast.add({ title: 'Quota Exhausted', color: 'warning' }); return }

    const res = await $fetch('/api/youtube/transcript', { method: 'POST', body: { url: videoUrl.value } })
    transcript.value = res.transcript
    videoTitle.value = res.title
  } catch (err: any) {
    errorMessage.value = err.data?.message || 'Failed to get transcript'
  } finally {
    loading.value = false
  }
}

async function saveToNotes() {
  saving.value = true
  try {
    await createNote({ title: videoTitle.value || 'YouTube Transcript', content: transcript.value, source_type: 'youtube', source_url: videoUrl.value })
    toast.add({ title: 'Saved!', color: 'success' })
  } catch { toast.add({ title: 'Error', color: 'error' }) }
  finally { saving.value = false }
}

async function copyToClipboard() {
  try { await navigator.clipboard.writeText(transcript.value); toast.add({ title: 'Copied!', color: 'success' }) }
  catch { toast.add({ title: 'Failed to copy', color: 'error' }) }
}
</script>
