<template>
  <ToolPageLayout
    title="AI Voice Generator"
    description="Convert text to natural-sounding speech with AI voices."
    category="AI Voices"
    category-icon="heroicons:speaker-wave"
    :tabs="navTabs"
  >
    <!-- Text Input -->
    <div class="bg-white rounded-[10px] border border-gray-200 p-6 mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Enter your text</label>
      <UTextarea
        v-model="text"
        placeholder="Type or paste the text you want to convert to speech..."
        :rows="6"
        :maxlength="5000"
        class="w-full"
      />
      <p class="text-xs text-gray-400 mt-1 text-right">{{ text.length }}/5000 characters</p>
    </div>

    <!-- Voice Selection -->
    <div class="bg-white rounded-[10px] border border-gray-200 p-6 mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">Select a voice</label>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
        <button
          v-for="voice in voices"
          :key="voice.id"
          class="p-3 rounded-[8px] border text-left transition-all"
          :class="selectedVoice === voice.id
            ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
            : 'border-gray-200 hover:border-gray-300'"
          @click="selectedVoice = voice.id"
        >
          <p class="font-medium text-sm text-gray-900">{{ voice.name }}</p>
          <p class="text-xs text-gray-500 mt-0.5">{{ voice.description }}</p>
        </button>
      </div>
    </div>

    <!-- Style Presets -->
    <div class="bg-white rounded-[10px] border border-gray-200 p-6 mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">Style preset</label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="preset in stylePresets"
          :key="preset.id"
          class="px-4 py-2 rounded-[8px] text-sm font-medium transition-colors"
          :class="selectedStyle === preset.id
            ? 'bg-primary-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          @click="selectedStyle = preset.id"
        >
          {{ preset.label }}
        </button>
      </div>
    </div>

    <!-- Generate Button -->
    <div class="flex justify-center mb-6">
      <UButton
        color="primary"
        size="lg"
        :loading="loading"
        :disabled="!text.trim() || loading"
        @click="generateVoice"
      >
        Generate Voice
      </UButton>
    </div>

    <!-- Audio Player -->
    <div v-if="audioUrl" class="bg-white rounded-[10px] border border-gray-200 p-6">
      <h3 class="font-semibold text-gray-900 mb-4">Generated Audio</h3>
      <audio :src="audioUrl" controls class="w-full" />
      <div class="flex items-center gap-3 mt-4">
        <UButton color="primary" variant="soft" size="sm" @click="downloadAudio">
          <Icon name="heroicons:arrow-down-tray" class="w-4 h-4 mr-1" />
          Download
        </UButton>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading" class="bg-gray-50 rounded-[10px] border border-dashed border-gray-200 p-12 text-center">
      <Icon name="heroicons:speaker-wave" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-500">Enter text and select a voice to generate speech</p>
    </div>
  </ToolPageLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'auth' })

const toast = useToast()
const { consumeQuota } = useProfile()

const text = ref('')
const selectedVoice = ref('21m00Tcm4TlvDq8ikWAM')
const selectedStyle = ref('narration')
const loading = ref(false)
const audioUrl = ref('')

const navTabs = [
  { label: 'Text to Speech', to: '/ai-voice-generator' },
  { label: 'Voice Generator', to: '/ai-voice-generator' },
  { label: 'Voice Cloning', to: '/ai-voice-cloning' },
  { label: 'Podcast Generator', to: '/ai-podcast-generator' },
]

const voices = [
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', description: 'Calm, young female' },
  { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', description: 'Strong, confident female' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', description: 'Soft, warm female' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', description: 'Well-rounded male' },
  { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli', description: 'Emotional, young female' },
  { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', description: 'Deep, narrative male' },
]

const stylePresets = [
  { id: 'narration', label: 'Narration' },
  { id: 'conversational', label: 'Conversational' },
  { id: 'news', label: 'News' },
  { id: 'characters', label: 'Characters' },
]

const styleSettings: Record<string, { stability: number; clarity: number; style: number }> = {
  narration: { stability: 0.7, clarity: 0.8, style: 0.2 },
  conversational: { stability: 0.4, clarity: 0.7, style: 0.5 },
  news: { stability: 0.8, clarity: 0.9, style: 0.1 },
  characters: { stability: 0.3, clarity: 0.6, style: 0.8 },
}

async function generateVoice() {
  if (!text.value.trim()) return

  loading.value = true
  audioUrl.value = ''

  try {
    const quotaAvailable = await consumeQuota('ai-voice-generator')
    if (!quotaAvailable) {
      toast.add({ title: 'Quota Exhausted', description: 'Upgrade to continue using this tool.', color: 'warning' })
      return
    }

    const settings = styleSettings[selectedStyle.value] || styleSettings.narration

    const response = await $fetch('/api/tts', {
      method: 'POST',
      body: {
        text: text.value,
        voiceId: selectedVoice.value,
        stability: settings.stability,
        clarity: settings.clarity,
        style: settings.style,
      },
      responseType: 'blob',
    })

    audioUrl.value = URL.createObjectURL(response as Blob)
  } catch (err: any) {
    toast.add({ title: 'Error', description: err.data?.message || 'Failed to generate voice.', color: 'error' })
  } finally {
    loading.value = false
  }
}

function downloadAudio() {
  if (!audioUrl.value) return
  const a = document.createElement('a')
  a.href = audioUrl.value
  a.download = 'generated-voice.mp3'
  a.click()
}
</script>
