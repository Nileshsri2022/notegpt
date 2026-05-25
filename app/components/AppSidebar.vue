<template>
  <aside
    class="hidden lg:flex flex-col bg-white border-r border-gray-100 transition-all duration-300 ease-in-out h-screen sticky top-0 overflow-hidden"
    :style="{ width: collapsed ? '64px' : '220px' }"
  >
    <!-- Logo -->
    <div class="flex items-center h-14 shrink-0" :class="collapsed ? 'justify-center px-2' : 'px-4 gap-2'">
      <img
        src="https://cdn.notegpt.io/notegpt/static/logo/NoteGPT_logo_blue_small.png"
        alt="NoteGPT"
        class="w-8 h-8 shrink-0 object-contain"
      />
      <Transition name="label-fade">
        <span v-if="!collapsed" class="text-base font-bold text-gray-900 whitespace-nowrap">NoteGPT</span>
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
            : 'gap-2 px-3 py-2'
        ]"
        :style="{
          background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
          color: '#92400E'
        }"
      >
        <Icon name="heroicons:sparkles-solid" class="w-5 h-5 shrink-0 text-amber-600" />
        <Transition name="label-fade">
          <span v-if="!collapsed" class="whitespace-nowrap flex items-center gap-1.5">
            <span class="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none">30% Off</span>
            Upgrade
          </span>
        </Transition>
      </NuxtLink>

      <!-- User section -->
      <div
        class="flex items-center rounded-lg transition-all duration-200 cursor-pointer hover:bg-gray-50"
        :class="collapsed ? 'justify-center w-10 h-10 mx-auto' : 'gap-2 px-3 py-2'"
        @click="toggleCollapse"
      >
        <div class="w-7 h-7 rounded-full bg-[#2E83FB] flex items-center justify-center shrink-0">
          <span class="text-white text-xs font-semibold">{{ userInitial }}</span>
        </div>
        <Transition name="label-fade">
          <div v-if="!collapsed" class="flex-1 min-w-0 flex items-center justify-between">
            <p class="text-sm font-medium text-gray-700 truncate">{{ userName }}</p>
            <Icon
              :name="collapsed ? 'heroicons:chevron-double-right' : 'heroicons:chevron-double-left'"
              class="w-3.5 h-3.5 text-gray-400 shrink-0"
            />
          </div>
        </Transition>
      </div>
    </div>
  </aside>

  <!-- Mobile sidebar overlay -->
  <Teleport to="body">
    <Transition name="sidebar-overlay">
      <div
        v-if="mobileOpen"
        class="fixed inset-0 z-40 bg-black/30 lg:hidden"
        @click="mobileOpen = false"
      />
    </Transition>
    <Transition name="sidebar-slide">
      <aside
        v-if="mobileOpen"
        class="fixed inset-y-0 left-0 z-50 w-[220px] bg-white shadow-xl flex flex-col lg:hidden"
      >
        <!-- Mobile logo -->
        <div class="flex items-center h-14 px-4 gap-2 border-b border-gray-100">
          <img
            src="https://cdn.notegpt.io/notegpt/static/logo/NoteGPT_logo_blue_small.png"
            alt="NoteGPT"
            class="w-8 h-8 object-contain"
          />
          <span class="text-base font-bold text-gray-900">NoteGPT</span>
          <button class="ml-auto text-gray-400 hover:text-gray-600" @click="mobileOpen = false">
            <Icon name="heroicons:x-mark" class="w-5 h-5" />
          </button>
        </div>

        <!-- Mobile nav -->
        <nav class="flex-1 overflow-y-auto px-2 space-y-0.5 mt-1 scrollbar-thin">
          <SidebarItem
            v-for="item in navItems"
            :key="item.to"
            :icon="item.icon"
            :label="item.label"
            :to="item.to"
            :collapsed="false"
            @click="mobileOpen = false"
          />
        </nav>

        <!-- Mobile bottom -->
        <div class="shrink-0 border-t border-gray-100 px-2 py-2 space-y-1">
          <SidebarItem
            icon="heroicons:bookmark-solid"
            label="My Notes"
            to="/notes"
            :collapsed="false"
            @click="mobileOpen = false"
          />
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const collapsed = ref(false)
const mobileOpen = ref(false)

const user = useSupabaseUser()
const userName = computed(() => user.value?.user_metadata?.full_name || user.value?.email?.split('@')[0] || 'User')
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())

function toggleCollapse() {
  collapsed.value = !collapsed.value
}

// Expose mobileOpen for DashboardTopBar to toggle
defineExpose({ mobileOpen })

const navItems = [
  { icon: 'heroicons:play-circle', label: 'AI YouTube', to: '/youtube-video-summarizer' },
  { icon: 'heroicons:document-text', label: 'AI Transcriber', to: '/youtube-transcript-generator' },
  { icon: 'heroicons:document-magnifying-glass', label: 'AI Summarizer', to: '/pdf-summary' },
  { icon: 'heroicons:speaker-wave', label: 'AI Voices', to: '/text-to-speech' },
  { icon: 'heroicons:photo', label: 'AI Images', to: '/ai-image-generator' },
  { icon: 'heroicons:video-camera', label: 'AI Video', to: '/ai-video-generator' },
  { icon: 'heroicons:presentation-chart-bar', label: 'AI Presentation', to: '/ai-presentation-maker' },
  { icon: 'heroicons:chat-bubble-left-right', label: 'AI Chat', to: '/ai-chat' },
  { icon: 'heroicons:pencil-square', label: 'AI Writer', to: '/ai-detector' },
  { icon: 'heroicons:document', label: 'AI PDF', to: '/chat-pdf' },
  { icon: 'heroicons:academic-cap', label: 'AI Study', to: '/ai-homework-helper' },
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

.sidebar-overlay-enter-active,
.sidebar-overlay-leave-active {
  transition: opacity 0.3s ease;
}
.sidebar-overlay-enter-from,
.sidebar-overlay-leave-to {
  opacity: 0;
}

.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
  transition: transform 0.3s ease;
}
.sidebar-slide-enter-from,
.sidebar-slide-leave-to {
  transform: translateX(-100%);
}
</style>
