<template>
  <div>
    <NuxtLayout name="dashboard">
      <div class="flex h-[calc(100vh-5rem)]">
        <!-- Conversations Sidebar -->
        <div class="w-64 border-r border-gray-200 flex flex-col shrink-0 hidden lg:flex">
          <div class="p-3 border-b border-gray-100">
            <UButton color="primary" block size="sm" @click="startNewChat">
              <Icon name="heroicons:plus" class="w-4 h-4 mr-1" />
              New Chat
            </UButton>
          </div>
          <div class="flex-1 overflow-y-auto p-2 space-y-1">
            <button
              v-for="conv in conversations"
              :key="conv.id"
              class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors group"
              :class="currentConversation?.id === conv.id
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-600 hover:bg-gray-50'"
              @click="selectConversation(conv)"
            >
              <div class="flex items-center justify-between">
                <span class="truncate flex-1">{{ conv.title }}</span>
                <button
                  class="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity"
                  @click.stop="handleDeleteConversation(conv.id)"
                >
                  <Icon name="heroicons:trash" class="w-3 h-3" />
                </button>
              </div>
            </button>
            <p v-if="conversations.length === 0" class="text-xs text-gray-400 text-center py-4">
              No conversations yet
            </p>
          </div>
        </div>

        <!-- Chat Area -->
        <div class="flex-1 flex flex-col max-w-3xl mx-auto w-full">
          <!-- Chat Messages -->
          <div ref="messagesContainer" class="flex-1 overflow-y-auto py-8 px-4">
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
                  @click="sendQuickMessage(tool.prompt)"
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

          <!-- Error message -->
          <div v-if="chatError" class="px-4 pb-2">
            <div class="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2">
              {{ chatError }}
            </div>
          </div>

          <!-- Model Selector -->
          <div class="flex items-center gap-2 px-4 mb-2">
            <button class="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-gray-500 hover:bg-gray-100">
              <Icon name="heroicons:cpu-chip" class="w-3 h-3" />
              {{ selectedModel }}
              <Icon name="heroicons:chevron-down" class="w-3 h-3" />
            </button>
          </div>

          <!-- Input Area -->
          <div class="px-4 pb-4">
            <div class="bg-white rounded-xl border border-gray-200 p-3">
              <div class="flex items-end gap-2">
                <div class="flex-1">
                  <textarea
                    v-model="input"
                    placeholder="Feel free to ask me anything..."
                    class="w-full resize-none border-0 focus:ring-0 text-sm text-gray-900 placeholder-gray-400 bg-transparent"
                    rows="2"
                    @keydown.enter.exact.prevent="handleSend"
                  ></textarea>
                </div>
                <div class="flex items-center gap-1">
                  <button class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Icon name="heroicons:paper-clip" class="w-5 h-5" />
                  </button>
                  <UButton
                    color="primary"
                    size="sm"
                    :disabled="!input.trim() || isLoading"
                    @click="handleSend"
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
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'auth' })

const {
  conversations,
  currentConversation,
  messages,
  isLoading,
  error: chatError,
  loadConversations,
  selectConversation,
  sendMessage,
  deleteConversation,
  clearCurrentChat,
} = useChat()

const input = ref('')
const selectedModel = ref('Gemini 2.0 Flash')
const messagesContainer = ref<HTMLElement>()

const quickTools = [
  { label: 'AI Humanizer', prompt: 'Help me rewrite text to sound more natural and human-like.' },
  { label: 'AI Detector', prompt: 'Can you help me check if text was written by AI?' },
  { label: 'AI Podcast', prompt: 'Help me create a podcast script.' },
  { label: 'Text to Speech', prompt: 'I want to convert text to speech. What options do I have?' },
  { label: 'AI Image', prompt: 'Help me generate an image description.' },
]

// Load conversations on mount
onMounted(async () => {
  await loadConversations()
})

// Auto-scroll to bottom when messages change
watch(messages, () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}, { deep: true })

const handleSend = async () => {
  const text = input.value.trim()
  if (!text || isLoading.value) return

  input.value = ''
  await sendMessage(text)
}

const sendQuickMessage = async (prompt: string) => {
  input.value = ''
  await sendMessage(prompt)
}

const startNewChat = () => {
  clearCurrentChat()
}

const handleDeleteConversation = async (id: string) => {
  if (confirm('Delete this conversation?')) {
    await deleteConversation(id)
  }
}
</script>
