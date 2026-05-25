<template>
  <aside
    class="hidden lg:flex flex-col bg-white border-r border-gray-100 transition-all duration-300 ease-in-out h-screen sticky top-0 overflow-hidden"
    :style="{ width: collapsed ? '56px' : '268px' }"
  >
    <!-- Logo -->
    <div class="flex items-center h-14 shrink-0" :class="collapsed ? 'justify-center px-2' : 'px-4 gap-2.5'">
      <div class="w-8 h-8 bg-[#2E83FB] rounded-lg flex items-center justify-center shrink-0">
        <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <circle cx="19" cy="18" r="3" fill="currentColor"/>
        </svg>
      </div>
      <Transition name="label-fade">
        <span v-if="!collapsed" class="text-lg font-bold text-gray-900 whitespace-nowrap">NoteGPT</span>
      </Transition>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto overflow-x-hidden px-2 space-y-0.5 scrollbar-thin mt-1">
      <SidebarItem
        v-for="item in navItems"
        :key="item.to"
        :icon="item.icon"
        :label="item.label"
        :to="item.to"
        :collapsed="collapsed"
      />
    </nav>

    <!-- Bottom section -->
    <div class="shrink-0 border-t border-gray-100 px-2 py-2 space-y-1">
      <!-- My Notes -->
      <SidebarItem
        icon="heroicons:bookmark-solid"
        label="My Notes"
        to="/notes"
        :collapsed="collapsed"
      />

      <!-- Pricing badge - 30% Off -->
      <NuxtLink
        to="/pricing"
        class="flex items-center rounded-lg text-sm font-semibold transition-all duration-200"
        :class="[
          collapsed
            ? 'justify-center w-10 h-10 mx-auto px-0'
            : 'gap-2.5 px-3 py-2'
        ]"
        :style="{
          background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
          color: '#92400E'
        }"
      >
        <Icon name="heroicons:sparkles-solid" class="w-5 h-5 shrink-0 text-amber-600" />
        <Transition name="label-fade">
          <span v-if="!collapsed" class="whitespace-nowrap flex items-center gap-1.5">
            <span class="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">30% Off</span>
            Upgrade
          </span>
        </Transition>
      </NuxtLink>

      <!-- User avatar -->
      <div
        class="flex items-center rounded-lg transition-all duration-200 cursor-pointer hover:bg-gray-50"
        :class="collapsed ? 'justify-center w-10 h-10 mx-auto' : 'gap-2.5 px-3 py-2'"
      >
        <div class="w-8 h-8 rounded-full bg-[#2E83FB] flex items-center justify-center shrink-0">
          <span class="text-white text-sm font-semibold">{{ userInitial }}</span>
        </div>
        <Transition name="label-fade">
          <div v-if="!collapsed" class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ userName }}</p>
            <p class="text-xs text-gray-500 truncate">{{ userEmail }}</p>
          </div>
        </Transition>
      </div>

      <!-- Collapse toggle -->
      <div class="flex" :class="collapsed ? 'justify-center' : 'justify-end'">
        <button
          class="flex items-center justify-center w-7 h-7 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          @click="toggleCollapse"
          :title="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        >
          <Icon
            :name="collapsed ? 'heroicons:chevron-double-right' : 'heroicons:chevron-double-left'"
            class="w-3.5 h-3.5 transition-transform duration-300"
          />
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
const collapsed = ref(false)

const user = useSupabaseUser()
const userName = computed(() => user.value?.user_metadata?.full_name || user.value?.email?.split('@')[0] || 'User')
const userEmail = computed(() => user.value?.email || '')
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())

function toggleCollapse() {
  collapsed.value = !collapsed.value
}

const navItems = [
  { icon: 'heroicons:play-circle', label: 'YouTube Summarizer', to: '/youtube-video-summarizer' },
  { icon: 'heroicons:document-text', label: 'Transcript Generator', to: '/youtube-transcript-generator' },
  { icon: 'heroicons:chat-bubble-left-right', label: 'AI Chat', to: '/ai-chat' },
  { icon: 'heroicons:speaker-wave', label: 'Text-to-Speech', to: '/text-to-speech' },
  { icon: 'heroicons:microphone', label: 'AI Voice Generator', to: '/ai-voice-generator' },
  { icon: 'heroicons:photo', label: 'AI Image Generator', to: '/ai-image-generator' },
  { icon: 'heroicons:shield-check', label: 'AI Detector', to: '/ai-detector' },
  { icon: 'heroicons:rectangle-stack', label: 'AI Flashcard Maker', to: '/ai-flashcard-maker' },
  { icon: 'heroicons:clipboard-document-list', label: 'AI Quiz Generator', to: '/ai-quiz-generator' },
  { icon: 'heroicons:presentation-chart-bar', label: 'AI Presentation Maker', to: '/ai-presentation-maker' },
  { icon: 'heroicons:map', label: 'AI Mind Map', to: '/ai-mind-map' },
  { icon: 'heroicons:calculator', label: 'AI Math Solver', to: '/ai-math-solver' },
  { icon: 'heroicons:document', label: 'PDF Summarizer', to: '/pdf-summarizer' },
  { icon: 'heroicons:musical-note', label: 'Audio Summarizer', to: '/audio-summarizer' },
  { icon: 'heroicons:video-camera', label: 'Video Summarizer', to: '/video-summarizer' },
  { icon: 'heroicons:musical-note', label: 'AI Music Generator', to: '/ai-music-generator' },
]
</script>

<style scoped>
.label-fade-enter-active,
.label-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.label-fade-enter-from,
.label-fade-leave-to {
  opacity: 0;
  transform: translateX(-4px);
}

.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 2px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}
</style>
