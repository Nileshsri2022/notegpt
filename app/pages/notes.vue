<template>
  <div>
    <NuxtLayout name="dashboard">
      <div class="max-w-5xl mx-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-gray-900">My Notes</h1>
          <UButton color="primary" size="sm">
            <Icon name="heroicons:plus" class="w-4 h-4 mr-1" />
            New Folder
          </UButton>
        </div>

        <div class="flex gap-6">
          <!-- Sidebar Folders -->
          <div class="w-56 shrink-0 hidden md:block">
            <nav class="space-y-1">
              <button
                v-for="folder in folders"
                :key="folder.id"
                class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors"
                :class="activeFolder === folder.id
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'"
                @click="activeFolder = folder.id"
              >
                <div class="flex items-center gap-2">
                  <Icon :name="folder.icon" class="w-4 h-4" />
                  <span>{{ folder.name }}</span>
                </div>
                <span class="text-xs text-gray-400">{{ folder.count }}</span>
              </button>
            </nav>
          </div>

          <!-- Notes List -->
          <div class="flex-1">
            <!-- Filters -->
            <div class="flex items-center gap-3 mb-4">
              <UInput placeholder="Search notes..." size="sm" class="flex-1 max-w-xs">
                <template #leading>
                  <Icon name="heroicons:magnifying-glass" class="w-4 h-4 text-gray-400" />
                </template>
              </UInput>
              <select class="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600">
                <option>All Types</option>
                <option>YouTube</option>
                <option>PDF</option>
                <option>Audio</option>
                <option>Text</option>
              </select>
              <select class="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600">
                <option>Newest First</option>
                <option>Oldest First</option>
                <option>A-Z</option>
              </select>
            </div>

            <!-- Empty State -->
            <div v-if="notes.length === 0" class="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <Icon name="heroicons:document-text" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p class="text-gray-500 mb-4">Oops, no notes saved yet.</p>
              <UButton color="primary" size="sm">
                <Icon name="heroicons:plus" class="w-4 h-4 mr-1" />
                Create Your First Note
              </UButton>
            </div>

            <!-- Notes Grid -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                v-for="note in notes"
                :key="note.id"
                class="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div class="flex items-start justify-between mb-2">
                  <span class="text-xs px-2 py-0.5 rounded bg-primary-50 text-primary-600 font-medium">
                    {{ note.type }}
                  </span>
                  <button class="text-gray-400 hover:text-gray-600">
                    <Icon name="heroicons:ellipsis-horizontal" class="w-4 h-4" />
                  </button>
                </div>
                <h3 class="font-medium text-gray-900 text-sm mb-1 line-clamp-2">{{ note.title }}</h3>
                <p class="text-xs text-gray-500 line-clamp-2">{{ note.preview }}</p>
                <p class="text-xs text-gray-400 mt-3">{{ note.date }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const activeFolder = ref('all')

const folders = [
  { id: 'all', name: 'All Notes', icon: 'heroicons:folder', count: 0 },
  { id: 'uncategorized', name: 'Uncategorized', icon: 'heroicons:folder-open', count: 0 },
]

const notes = ref<Array<{ id: string; title: string; preview: string; type: string; date: string }>>([])
</script>
