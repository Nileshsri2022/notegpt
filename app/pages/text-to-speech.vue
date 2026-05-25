<template>
  <div>
    <NuxtLayout name="dashboard">
      <template #header>
        <ToolSubNav
          category="AI Voices"
          :tabs="[
            { label: 'Text to Speech', to: '/text-to-speech' },
            { label: 'Voice Generator', to: '/ai-voice-generator' },
            { label: 'Voice Cloning', to: '/ai-voice-cloning' },
            { label: 'Podcast Generator', to: '/ai-podcast-generator' },
          ]"
        />
      </template>

      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900">AI Text to Speech</h1>
          <p class="text-gray-600 mt-1">Convert text to natural-sounding speech powered by ElevenLabs.</p>
        </div>

        <!-- Voice Selection -->
        <div class="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Voice</label>
              <select
                v-model="selectedVoice"
                class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option v-for="voice in voices" :key="voice.id" :value="voice.id">
                  {{ voice.name }} — {{ voice.description }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Model</label>
              <select
                v-model="selectedModel"
                class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="eleven_multilingual_v2">Multilingual v2 (Best quality)</option>
                <option value="eleven_turbo_v2_5">Turbo v2.5 (Low latency)</option>
                <option value="eleven_flash_v2_5">Flash v2.5 (Fastest)</option>
              </select>
            </div>
          </div>

          <!-- Voice Settings -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label class="block text-xs text-gray-500 mb-1">Stability: {{ stability }}%</label>
              <input type="range" v-model="stability" min="0" max="100" class="w-full" />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Clarity: {{ clarity }}%</label>
              <input type="range" v-model="clarity" min="0" max="100" class="w-full" />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Style: {{ style }}%</label>
              <input type="range" v-model="style" min="0" max="100" class="w-full" />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Speed: {{ speed }}x</label>
              <input type="range" v-model="speed" min="50" max="200" class="w-full" />
            </div>
          </div>
        </div>

        <!-- Text Input -->
        <div class="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Text to convert
            <span class="text-gray-400 font-normal">({{ text.length }}/5000)</span>
          </label>
          <textarea
            v-model="text"
            placeholder="Enter the text you want to convert to speech..."
            class="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            rows="6"
            maxlength="5000"
          ></textarea>
          <div class="flex items-center justify-between mt-4">
            <div class="flex gap-2">
              <button class="px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-600 hover:bg-gray-200">
                <Icon name="heroicons:document-text" class="w-3 h-3 inline mr-1" />
                Paste from clipboard
              </button>
            </div>
            <UButton
              color="primary"
              :loading="generating"
              :disabled="!text.trim()"
              @click="generateSpeech"
            >
              <Icon name="heroicons:speaker-wave" class="w-4 h-4 mr-1" />
              Generate Speech
            </UButton>
          </div>
        </div>

        <!-- Audio Player -->
        <div v-if="audioUrl" class="bg-white rounded-xl border border-gray-200 p-6">
          <div class="flex items-center gap-4">
            <button
              class="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center hover:bg-primary-600 transition-colors"
              @click="togglePlay"
            >
              <Icon :name="playing ? 'heroicons:pause' : 'heroicons:play'" class="w-5 h-5 text-white" />
            </button>
            <div class="flex-1">
              <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-primary-500 rounded-full" :style="{ width: progress + '%' }"></div>
              </div>
            </div>
            <button class="p-2 text-gray-400 hover:text-gray-600">
              <Icon name="heroicons:arrow-down-tray" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'auth' })

const text = ref('')
const selectedVoice = ref('JBFqnCBsd6RMkjVDRZzb')
const selectedModel = ref('eleven_multilingual_v2')
const stability = ref(50)
const clarity = ref(75)
const style = ref(0)
const speed = ref(100)
const generating = ref(false)
const audioUrl = ref('')
const playing = ref(false)
const progress = ref(0)

const voices = [
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', description: 'Warm & authoritative' },
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', description: 'Calm & professional' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', description: 'Soft & friendly' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', description: 'Well-rounded & clear' },
  { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli', description: 'Young & energetic' },
  { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', description: 'Deep & narrative' },
]

const generateSpeech = async () => {
  if (!text.value.trim()) return
  generating.value = true
  try {
    const response = await $fetch('/api/tts', {
      method: 'POST',
      body: {
        text: text.value,
        voiceId: selectedVoice.value,
        modelId: selectedModel.value,
        stability: stability.value / 100,
        clarity: clarity.value / 100,
        style: style.value / 100,
        speed: speed.value / 100,
      },
    })
    // TODO: Handle audio blob response
    audioUrl.value = '/placeholder-audio.mp3'
  } catch (error) {
    console.error('TTS generation failed:', error)
  } finally {
    generating.value = false
  }
}

const togglePlay = () => {
  playing.value = !playing.value
}
</script>
