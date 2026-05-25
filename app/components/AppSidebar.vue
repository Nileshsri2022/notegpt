<template>
  <aside
    class="hidden lg:flex flex-col bg-white border-r border-gray-100 transition-all duration-300"
    :class="collapsed ? 'w-[56px]' : 'w-[268px]'"
  >
    <!-- Logo -->
    <div class="flex items-center h-16 px-3" :class="collapsed ? 'justify-center' : 'gap-2'">
      <div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center shrink-0">
        <span class="text-white font-bold text-sm">N</span>
      </div>
      <span v-if="!collapsed" class="text-lg font-bold text-gray-900">NoteGPT</span>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
      <SidebarItem
        v-for="item in navItems"
        :key="item.to"
        :icon="item.icon"
        :label="item.label"
        :to="item.to"
        :collapsed="collapsed"
      />
    </nav>

    <!-- Bottom -->
    <div class="px-2 py-4 border-t border-gray-100 space-y-1">
      <SidebarItem icon="heroicons:bookmark" label="My Notes" to="/notes" :collapsed="collapsed" />
      <NuxtLink
        to="/pricing"
        class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 transition-colors"
        :class="collapsed ? 'justify-center' : ''"
      >
        <Icon name="heroicons:sparkles" class="w-5 h-5 shrink-0" />
        <span v-if="!collapsed">30% Off</span>
      </NuxtLink>
    </div>

    <!-- Collapse toggle -->
    <button
      class="flex items-center justify-center h-10 border-t border-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
      @click="collapsed = !collapsed"
    >
      <Icon :name="collapsed ? 'heroicons:chevron-right' : 'heroicons:chevron-left'" class="w-4 h-4" />
    </button>
  </aside>
</template>

<script setup lang="ts">
const collapsed = ref(false)

const navItems = [
  { icon: 'heroicons:home', label: 'Home', to: '/dashboard' },
  { icon: 'heroicons:play-circle', label: 'AI YouTube', to: '/youtube-video-summarizer' },
  { icon: 'heroicons:microphone', label: 'AI Transcriber', to: '/speech-to-text' },
  { icon: 'heroicons:document-text', label: 'AI Summarizer', to: '/ai-text-summarizer' },
  { icon: 'heroicons:speaker-wave', label: 'AI Voices', to: '/text-to-speech' },
  { icon: 'heroicons:photo', label: 'AI Images', to: '/ai-image-generator' },
  { icon: 'heroicons:video-camera', label: 'AI Video', to: '/video-summarizer' },
  { icon: 'heroicons:presentation-chart-bar', label: 'AI Presentation', to: '/ai-presentation-maker' },
  { icon: 'heroicons:chat-bubble-left-right', label: 'AI Chat', to: '/ai-chat' },
  { icon: 'heroicons:pencil-square', label: 'AI Writer', to: '/ai-essay-writer' },
  { icon: 'heroicons:document', label: 'AI PDF', to: '/pdf-summary' },
  { icon: 'heroicons:academic-cap', label: 'AI Study', to: '/ai-flashcard-maker' },
]
</script>
