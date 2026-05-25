<template>
  <div>
    <NuxtLayout name="dashboard">
      <div class="max-w-5xl mx-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-gray-900">My Notes</h1>
          <UButton color="primary" size="sm" @click="handleNewFolder">
            <Icon name="heroicons:plus" class="w-4 h-4 mr-1" />
            New Folder
          </UButton>
        </div>

        <div class="flex gap-6">
          <!-- Sidebar Folders -->
          <div class="w-56 shrink-0 hidden md:block">
            <nav class="space-y-1">
              <!-- All Notes -->
              <button
                class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors"
                :class="activeFolder === null
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'"
                @click="selectFolder(null)"
              >
                <div class="flex items-center gap-2">
                  <Icon name="heroicons:folder" class="w-4 h-4" />
                  <span>All Notes</span>
                </div>
                <span class="text-xs text-gray-400">{{ notes.length }}</span>
              </button>

              <!-- User folders -->
              <button
                v-for="folder in folders"
                :key="folder.id"
                class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors group"
                :class="activeFolder === folder.id
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'"
                @click="selectFolder(folder.id)"
              >
                <div class="flex items-center gap-2">
                  <Icon name="heroicons:folder-open" class="w-4 h-4" />
                  <span>{{ folder.name }}</span>
                </div>
                <button
                  class="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-red-500 transition-opacity"
                  @click.stop="handleDeleteFolder(folder.id)"
                >
                  <Icon name="heroicons:trash" class="w-3 h-3" />
                </button>
              </button>
            </nav>
          </div>

          <!-- Notes List -->
          <div class="flex-1">
            <!-- Filters -->
            <div class="flex items-center gap-3 mb-4">
              <UInput
                v-model="searchQuery"
                placeholder="Search notes..."
                size="sm"
                class="flex-1 max-w-xs"
              >
                <template #leading>
                  <Icon name="heroicons:magnifying-glass" class="w-4 h-4 text-gray-400" />
                </template>
              </UInput>
              <select
                v-model="typeFilter"
                class="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600"
              >
                <option value="">All Types</option>
                <option value="youtube">YouTube</option>
                <option value="pdf">PDF</option>
                <option value="audio">Audio</option>
                <option value="text">Text</option>
                <option value="webpage">Webpage</option>
              </select>
              <select
                v-model="sortBy"
                class="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">A-Z</option>
              </select>
            </div>

            <!-- Empty State -->
            <div v-if="filteredNotes.length === 0" class="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <Icon name="heroicons:document-text" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p class="text-gray-500 mb-4">
                {{ searchQuery || typeFilter ? 'No notes match your filters.' : 'Oops, no notes saved yet.' }}
              </p>
              <UButton v-if="!searchQuery && !typeFilter" color="primary" size="sm" to="/youtube-video-summarizer">
                <Icon name="heroicons:plus" class="w-4 h-4 mr-1" />
                Create Your First Note
              </UButton>
            </div>

            <!-- Notes Grid -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                v-for="note in filteredNotes"
                :key="note.id"
                class="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div class="flex items-start justify-between mb-2">
                  <span class="text-xs px-2 py-0.5 rounded bg-primary-50 text-primary-600 font-medium capitalize">
                    {{ note.source_type }}
                  </span>
                  <button
                    class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                    @click.stop="handleDeleteNote(note.id)"
                  >
                    <Icon name="heroicons:trash" class="w-4 h-4" />
                  </button>
                </div>
                <h3 class="font-medium text-gray-900 text-sm mb-1 line-clamp-2">{{ note.title }}</h3>
                <p class="text-xs text-gray-500 line-clamp-2">
                  {{ note.summary || note.content || 'No preview available' }}
                </p>
                <p class="text-xs text-gray-400 mt-3">{{ formatDate(note.created_at) }}</p>
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

const toast = useToast()
const { notes, folders, fetchNotes, fetchFolders, createFolder, deleteNote, deleteFolder } = useNotes()

const activeFolder = ref<string | null>(null)
const searchQuery = ref('')
const typeFilter = ref('')
const sortBy = ref('newest')

// Fetch data on mount
onMounted(async () => {
  await Promise.all([fetchNotes(), fetchFolders()])
})

// Filtered and sorted notes
const filteredNotes = computed(() => {
  let result = [...notes.value]

  // Filter by folder
  if (activeFolder.value) {
    result = result.filter(n => n.folder_id === activeFolder.value)
  }

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(n =>
      n.title.toLowerCase().includes(query) ||
      n.content?.toLowerCase().includes(query) ||
      n.summary?.toLowerCase().includes(query)
    )
  }

  // Filter by type
  if (typeFilter.value) {
    result = result.filter(n => n.source_type === typeFilter.value)
  }

  // Sort
  if (sortBy.value === 'newest') {
    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  } else if (sortBy.value === 'oldest') {
    result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  } else if (sortBy.value === 'title') {
    result.sort((a, b) => a.title.localeCompare(b.title))
  }

  return result
})

const selectFolder = async (folderId: string | null) => {
  activeFolder.value = folderId
  await fetchNotes(folderId || undefined)
}

const handleNewFolder = async () => {
  const name = prompt('Enter folder name:')
  if (!name?.trim()) return

  const folder = await createFolder(name.trim())
  if (folder) {
    toast.add({ title: 'Folder created', color: 'success' })
  }
}

const handleDeleteNote = async (id: string) => {
  if (!confirm('Are you sure you want to delete this note?')) return

  await deleteNote(id)
  toast.add({ title: 'Note deleted', color: 'success' })
}

const handleDeleteFolder = async (id: string) => {
  if (!confirm('Delete this folder? Notes inside will become uncategorized.')) return

  await deleteFolder(id)
  if (activeFolder.value === id) {
    activeFolder.value = null
    await fetchNotes()
  }
  toast.add({ title: 'Folder deleted', color: 'success' })
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>
