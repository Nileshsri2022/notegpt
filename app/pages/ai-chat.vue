<template>
  <div>
    <NuxtLayout name="dashboard">
      <div class="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
        <!-- Chat Messages -->
        <div class="flex-1 overflow-y-auto py-8">
          <!-- Welcome state -->
          <div v-if="messages.length === 0" class="text-center py-16">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">👋 Hi~ What can I help you with today?</h2>
            <p class="text-gray-500 mb-8">Ask me anything — I can help with research, writing, math, and more.</p>

            <!-- Quick tools -->
            <div class="flex flex-wrap justify-center gap-2">
              <button
                v-for="tool in quickTools"
                :key="tool.label"
                class="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-gray-200 transition-colors"
              >
                {{ tool.label }}
              </button>
            </div>
          </div>

          <!-- Messages -->
          <div v-else class="space-y-6">
            <div
              v-for="msg in messages"
              :key="msg.id"
              class="flex gap-3"
              :class="msg.role === 'user' ? 'justify-end' : ''"
            >
              <div
                v-if="msg.role === 'assistant'"
                class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0"
              >
                <Icon name="heroicons:sparkles" class="w-4 h-4 text-primary-500" />
              </div>
              <div
                class="max-w-[80%] rounded-2xl px-4 py-3"
                :class="msg.role === 'user'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-900'"
              >
                <p class="text-sm whitespace-pre-wrap">{{ msg.content }}</p>
              </div>
            </div>

            <!-- Loading indicator -->
            <div v-if="isLoading" class="flex gap-3">
              <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                <Icon name="heroicons:sparkles" class="w-4 h-4 text-primary-500 animate-pulse" />
              </div>
              <div class="bg-gray-100 rounded-2xl px-4 py-3">
                <div class="flex gap-1">
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Model Selector -->
        <div class="flex items-center gap-2 mb-2">
          <button class="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-gray-500 hover:bg-gray-100">
            <Icon name="heroicons:cpu-chip" class="w-3 h-3" />
            {{ selectedModel }}
            <Icon name="heroicons:chevron-down" class="w-3 h-3" />
          </button>
        </div>

        <!-- Input Area -->
        <div class="bg-white rounded-xl border border-gray-200 p-3">
          <div class="flex items-end gap-2">
            <div class="flex-1">
              <textarea
                v-model="input"
                placeholder="Feel free to ask me anything..."
                class="w-full resize-none border-0 focus:ring-0 text-sm text-gray-900 placeholder-gray-400 bg-transparent"
                rows="2"
                @keydown.enter.exact.prevent="sendMessage"
              ></textarea>
            </div>
            <div class="flex items-center gap-1">
              <button class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Icon name="heroicons:paper-clip" class="w-5 h-5" />
              </button>
              <UButton
                color="primary"
                size="sm"
                :disabled="!input.trim()"
                @click="sendMessage"
              >
                <Icon name="heroicons:paper-airplane" class="w-4 h-4" />
              </UButton>
            </div>
          </div>
          <div class="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
            <button class="px-2 py-1 rounded text-xs text-gray-500 hover:bg-gray-100">
              <Icon name="heroicons:arrow-up-tray" class="w-3 h-3 inline mr-1" />Upload
            </button>
            <button class="px-2 py-1 rounded text-xs text-gray-500 hover:bg-gray-100">
              <Icon name="heroicons:light-bulb" class="w-3 h-3 inline mr-1" />DeepThink
            </button>
            <button class="px-2 py-1 rounded text-xs text-gray-500 hover:bg-gray-100">
              <Icon name="heroicons:academic-cap" class="w-3 h-3 inline mr-1" />Guided Learning
            </button>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const input = ref('')
const isLoading = ref(false)
const selectedModel = ref('Gemini 3.1 Flash-Lite')

const messages = ref<Array<{ id: string; role: 'user' | 'assistant'; content: string }>>([])

const quickTools = [
  { label: 'AI Humanizer' },
  { label: 'AI Detector' },
  { label: 'AI Podcast' },
  { label: 'Text to Speech' },
  { label: 'AI Image' },
]

const sendMessage = async () => {
  const text = input.value.trim()
  if (!text) return

  messages.value.push({ id: Date.now().toString(), role: 'user', content: text })
  input.value = ''
  isLoading.value = true

  try {
    // TODO: Call AI API via server route
    await new Promise(resolve => setTimeout(resolve, 1500))
    messages.value.push({
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `This is a placeholder response. Once the backend is connected with OpenRouter, I'll provide real AI responses using ${selectedModel.value}.`,
    })
  } finally {
    isLoading.value = false
  }
}
</script>
