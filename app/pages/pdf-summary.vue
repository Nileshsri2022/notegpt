<template>
  <ToolPageLayout
    title="Free PDF Summarizer"
    description="Upload a PDF file to get an AI-powered summary with key points."
    category="AI Summarizer"
    category-icon="heroicons:document"
    :tabs="navTabs"
  >
    <!-- Upload Area -->
    <div
      class="bg-white rounded-[10px] border-2 border-dashed border-gray-200 p-8 mb-6 text-center transition-colors"
      :class="{ 'border-primary-400 bg-primary-50/30': isDragging }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <div v-if="!selectedFile">
        <Icon name="heroicons:document-arrow-up" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-600 mb-2">Drag & drop your PDF file here</p>
        <p class="text-sm text-gray-400 mb-4">or</p>
        <UButton color="primary" variant="soft" @click="fileInput?.click()">
          Browse Files
        </UButton>
        <p class="text-xs text-gray-400 mt-3">Supports .pdf files up to 10MB</p>
      </div>
      <div v-else class="flex items-center justify-center gap-3">
        <Icon name="heroicons:document" class="w-8 h-8 text-primary-500" />
        <div class="text-left">
          <p class="font-medium text-gray-900">{{ selectedFile.name }}</p>
          <p class="text-sm text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
        </div>
        <UButton color="neutral" variant="ghost" size="xs" @click="clearFile">
          <Icon name="heroicons:x-mark" class="w-4 h-4" />
        </UButton>
      </div>
      <input
        ref="fileInput"
        type="file"
        accept=".pdf"
        class="hidden"
        @change="handleFileSelect"
      />
    </div>

    <!-- Generate Button -->
    <div class="flex justify-center mb-6">
      <UButton
        color="primary"
        size="lg"
        :loading="loading"
        :disabled="!selectedFile || loading"
        @click="generateSummary"
      >
        Generate Summary
      </UButton>
    </div>

    <!-- Loading Steps -->
    <div v-if="loading" class="bg-white rounded-[10px] border border-gray-200 p-6 mb-6">
      <div class="space-y-3">
        <div class="flex items-center gap-3">
          <Icon
            :name="currentStep >= 1 ? 'heroicons:check-circle-solid' : 'lucide:loader-circle'"
            class="w-5 h-5"
            :class="currentStep >= 1 ? 'text-green-500' : 'text-primary-500 animate-spin'"
          />
          <span class="text-sm" :class="currentStep >= 1 ? 'text-green-700' : 'text-gray-600'">
            Uploading PDF...
          </span>
        </div>
        <div v-if="currentStep >= 1" class="flex items-center gap-3">
          <Icon
            :name="currentStep >= 2 ? 'heroicons:check-circle-solid' : 'lucide:loader-circle'"
            class="w-5 h-5"
            :class="currentStep >= 2 ? 'text-green-500' : 'text-primary-500 animate-spin'"
          />
          <span class="text-sm" :class="currentStep >= 2 ? 'text-green-700' : 'text-gray-600'">
            Extracting text from PDF...
          </span>
        </div>
        <div v-if="currentStep >= 2" class="flex items-center gap-3">
          <Icon
            :name="currentStep >= 3 ? 'heroicons:check-circle-solid' : 'lucide:loader-circle'"
            class="w-5 h-5"
            :class="currentStep >= 3 ? 'text-green-500' : 'text-primary-500 animate-spin'"
          />
          <span class="text-sm" :class="currentStep >= 3 ? 'text-green-700' : 'text-gray-600'">
            Generating AI summary...
          </span>
        </div>
      </div>
    </div>

    <!-- Results -->
    <div v-if="summary" class="bg-white rounded-[10px] border border-gray-200 p-6">
      <h2 class="font-semibold text-gray-900 mb-4">Summary</h2>
      <div class="prose prose-sm max-w-none whitespace-pre-wrap">{{ summary }}</div>

      <!-- Actions -->
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

    <!-- Empty State -->
    <div v-else-if="!loading" class="bg-gray-50 rounded-[10px] border border-dashed border-gray-200 p-12 text-center">
      <Icon name="heroicons:document" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-500">Upload a PDF file above to generate a summary</p>
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
const isDragging = ref(false)
const loading = ref(false)
const saving = ref(false)
const currentStep = ref(0)
const summary = ref('')

const navTabs = [
  { label: 'PDF', to: '/pdf-summary' },
  { label: 'Article', to: '/article-summary' },
  { label: 'Book', to: '/book-summary' },
  { label: 'Audio', to: '/audio-summary' },
  { label: 'Video', to: '/youtube-video-summarizer' },
  { label: 'Text', to: '/text-summary' },
]

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function handleDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file && file.type === 'application/pdf') {
    selectedFile.value = file
  } else {
    toast.add({ title: 'Invalid file', description: 'Please upload a PDF file.', color: 'warning' })
  }
}

function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files?.[0]) {
    selectedFile.value = input.files[0]
  }
}

function clearFile() {
  selectedFile.value = null
  if (fileInput.value) fileInput.value.value = ''
}

async function generateSummary() {
  if (!selectedFile.value) return

  loading.value = true
  currentStep.value = 0
  summary.value = ''

  try {
    const quotaAvailable = await consumeQuota('pdf-summarizer')
    if (!quotaAvailable) {
      toast.add({ title: 'Quota Exhausted', description: 'Upgrade to continue using this tool.', color: 'warning' })
      return
    }

    // Step 1: Upload
    currentStep.value = 1

    // Step 2: Extract text (simulated - in production you'd use a PDF parser API)
    await new Promise(r => setTimeout(r, 1000))
    currentStep.value = 2

    // Read file as text (simplified - real implementation would use pdf-parse on server)
    const text = await selectedFile.value.text()
    const content = text.slice(0, 8000) || 'PDF content could not be extracted. Please try a text-based PDF.'

    // Step 3: Summarize
    const response = await $fetch('/api/summarize', {
      method: 'POST',
      body: { content, type: 'PDF document' },
    })

    summary.value = response.summary
    currentStep.value = 3
  } catch (err: any) {
    toast.add({ title: 'Error', description: err.data?.message || 'Failed to summarize PDF.', color: 'error' })
  } finally {
    loading.value = false
  }
}

async function saveToNotes() {
  if (!summary.value) return
  saving.value = true
  try {
    await createNote({
      title: selectedFile.value?.name || 'PDF Summary',
      content: summary.value,
      summary: summary.value,
      source_type: 'pdf',
    })
    toast.add({ title: 'Saved!', description: 'Summary saved to your notes.', color: 'success' })
  } catch {
    toast.add({ title: 'Error', description: 'Failed to save note.', color: 'error' })
  } finally {
    saving.value = false
  }
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(summary.value)
    toast.add({ title: 'Copied!', description: 'Summary copied to clipboard.', color: 'success' })
  } catch {
    toast.add({ title: 'Error', description: 'Failed to copy.', color: 'error' })
  }
}
</script>
