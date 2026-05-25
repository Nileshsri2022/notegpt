<template>
  <ToolPageLayout
    title="Audio Summarizer"
    description="Upload an audio file and get an AI-powered summary of its content."
    category="AI Summarizer"
    :tabs="navTabs"
  >
    <!-- File Upload -->
    <div class="bg-white rounded-[10px] border border-gray-200 p-6 mb-6">
      <div
        class="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-primary-300 transition-colors"
        @click="triggerFileInput"
        @dragover.prevent
        @drop.prevent="handleDrop"
      >
        <Icon name="heroicons:musical-note" class="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p class="text-sm text-gray-600 mb-1">
          <span class="text-primary-500 font-medium">Click to upload</span> or drag and drop
        </p>
        <p class="text-xs text-gray-400">MP3, WAV, M4A, OGG (max 50MB)</p>
      </div>
      <input
        ref="fileInput"
        type="file"
        accept="audio/*"
        class="hidden"
        @change="handleFileSelect"
      />

      <!-- Selected file -->
      <div v-if="selectedFile" class="mt-4 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <Icon name="heroicons:musical-note" class="w-5 h-5 text-primary-500" />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">{{ selectedFile.name }}</p>
          <p class="text-xs text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
        </div>
        <button class="text-gray-400 hover:text-red-500" @click="selectedFile = null">
          <Icon name="heroicons:x-mark" class="w-4 h-4" />
        </button>
      </div>

      <div class="mt-4 flex justify-center">
        <UButton
          color="primary"
          size="lg"
          :loading="loading"
          :disabled="!selectedFile || loading"
          @click="summarizeAudio"
        >
          Summarize Audio
        </UButton>
      </div>
    </div>

    <!-- Results -->
    <div v-if="summary" class="bg-white rounded-[10px] border border-gray-200 p-6">
      <h3 class="font-semibold text-gray-900 mb-3">Summary</h3>
      <div class="prose prose-sm max-w-none whitespace-pre-wrap">{{ summary }}</div>
      <div class="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
        <UButton color="primary" variant="soft" size="sm" :loading="saving" @click="saveToNotes">
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
    <div v-else-if="!loading" class="bg-gray-50 rounded-[10px] border border-dashed border-gray-200 p-12 text-center">
      <Icon name="heroicons:musical-note" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-500">Upload an audio file to generate a summary</p>
    </div>
  </ToolPageLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'auth' })

const toast = useToast()
const { consumeQuota } = useProfile()
const { createNote } = useNotes()

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const loading = ref(false)
const saving = ref(false)
const summary = ref('')

const navTabs = [
  { label: 'Audio Summarizer', to: '/audio-summary' },
  { label: 'Video Summarizer', to: '/video-summarizer' },
  { label: 'PDF Summarizer', to: '/pdf-summary' },
]

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files?.[0]) selectedFile.value = input.files[0]
}

function handleDrop(e: DragEvent) {
  const file = e.dataTransfer?.files?.[0]
  if (file && file.type.startsWith('audio/')) selectedFile.value = file
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

async function summarizeAudio() {
  if (!selectedFile.value) return
  loading.value = true
  summary.value = ''

  try {
    const quotaAvailable = await consumeQuota('audio-summarizer')
    if (!quotaAvailable) {
      toast.add({ title: 'Quota Exhausted', description: 'Upgrade to continue.', color: 'warning' })
      return
    }

    // For now, show a placeholder since audio transcription requires additional backend work
    toast.add({ title: 'Processing', description: 'Audio transcription is being processed...', color: 'info' })
    summary.value = 'Audio summarization requires server-side transcription (Whisper API). This feature will be fully available once the transcription backend is configured.'
  } catch (err: any) {
    toast.add({ title: 'Error', description: err.message || 'Failed to summarize audio.', color: 'error' })
  } finally {
    loading.value = false
  }
}

async function saveToNotes() {
  if (!summary.value) return
  saving.value = true
  try {
    await createNote({
      title: selectedFile.value?.name || 'Audio Summary',
      content: summary.value,
      source_type: 'audio',
    })
    toast.add({ title: 'Saved!', description: 'Summary saved to your notes.', color: 'success' })
  } catch {
    toast.add({ title: 'Error', description: 'Failed to save note.', color: 'error' })
  } finally {
    saving.value = false
  }
}

async function copyToClipboard() {
  await navigator.clipboard.writeText(summary.value)
  toast.add({ title: 'Copied!', color: 'success' })
}
</script>
