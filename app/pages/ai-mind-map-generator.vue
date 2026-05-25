<template>
  <ToolPageLayout
    title="AI Mind Map Generator"
    description="Generate visual mind maps from any topic to organize your thoughts."
    category="AI Presentation"
    category-icon="heroicons:map"
    :tabs="navTabs"
  >
    <!-- Topic Input -->
    <div class="bg-white rounded-[10px] border border-gray-200 p-6 mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Enter a topic</label>
      <UInput
        v-model="topic"
        placeholder="e.g., Machine Learning, World War II, Photosynthesis..."
        size="lg"
        class="w-full"
      />
    </div>

    <!-- Depth Selector -->
    <div class="bg-white rounded-[10px] border border-gray-200 p-6 mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">Depth (levels)</label>
      <div class="flex gap-2">
        <button
          v-for="d in depths"
          :key="d"
          class="px-4 py-2 rounded-[8px] text-sm font-medium transition-colors"
          :class="depth === d
            ? 'bg-primary-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          @click="depth = d"
        >
          {{ d }} levels
        </button>
      </div>
    </div>

    <!-- Generate Button -->
    <div class="flex justify-center mb-6">
      <UButton
        color="primary"
        size="lg"
        :loading="loading"
        :disabled="!topic.trim() || loading"
        @click="generateMindMap"
      >
        Generate Mind Map
      </UButton>
    </div>

    <!-- Mind Map Display -->
    <div v-if="mindMap" class="bg-white rounded-[10px] border border-gray-200 p-6">
      <h3 class="font-semibold text-gray-900 mb-4">Mind Map</h3>

      <!-- Tree View -->
      <div class="mind-map-tree pl-2">
        <div class="tree-root">
          <span class="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-500 text-white rounded-[8px] font-medium text-sm">
            <Icon name="heroicons:light-bulb" class="w-4 h-4" />
            {{ mindMap.title }}
          </span>

          <ul v-if="mindMap.children" class="tree-children">
            <li v-for="(child, idx) in mindMap.children" :key="idx" class="tree-node">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">
                {{ child.title }}
              </span>

              <ul v-if="child.children" class="tree-children">
                <li v-for="(sub, sIdx) in child.children" :key="sIdx" class="tree-node">
                  <span class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-medium">
                    {{ sub.title }}
                  </span>

                  <ul v-if="sub.children" class="tree-children">
                    <li v-for="(leaf, lIdx) in sub.children" :key="lIdx" class="tree-node">
                      <span class="text-xs text-gray-600 px-2 py-0.5 bg-gray-50 rounded">
                        {{ leaf.title }}
                      </span>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
        <UButton color="primary" variant="soft" size="sm" :loading="saving" @click="saveToNotes">
          <Icon name="heroicons:bookmark" class="w-4 h-4 mr-1" />
          Save to Notes
        </UButton>
        <UButton color="neutral" variant="ghost" size="sm" @click="generateMindMap">
          <Icon name="heroicons:arrow-path" class="w-4 h-4 mr-1" />
          Regenerate
        </UButton>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading" class="bg-gray-50 rounded-[10px] border border-dashed border-gray-200 p-12 text-center">
      <Icon name="heroicons:map" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-500">Enter a topic above to generate a mind map</p>
    </div>
  </ToolPageLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'auth' })

const toast = useToast()
const { consumeQuota } = useProfile()
const { createNote } = useNotes()

interface MindMapNode {
  title: string
  children?: MindMapNode[]
}

const topic = ref('')
const depth = ref(3)
const loading = ref(false)
const saving = ref(false)
const mindMap = ref<MindMapNode | null>(null)

const depths = [2, 3, 4]

const navTabs = [
  { label: 'Presentation Maker', to: '/ai-presentation-maker' },
  { label: 'PPT Maker', to: '/ai-ppt-maker' },
  { label: 'Mind Map', to: '/ai-mind-map-generator' },
  { label: 'Slide Generator', to: '/ai-slide-generator' },
]

async function generateMindMap() {
  if (!topic.value.trim()) return

  loading.value = true
  mindMap.value = null

  try {
    const quotaAvailable = await consumeQuota('ai-mind-map-generator')
    if (!quotaAvailable) {
      toast.add({ title: 'Quota Exhausted', description: 'Upgrade to continue using this tool.', color: 'warning' })
      return
    }

    const prompt = `Create a mind map for the topic "${topic.value}" with ${depth.value} levels of depth. The root node is the main topic, with branches for subtopics, and sub-branches for details.

Generate 4-6 main branches, each with 2-4 sub-branches${depth.value >= 4 ? ', each with 2-3 leaf nodes' : ''}.

Respond in this exact JSON format (no other text):
{"title": "Main Topic", "children": [{"title": "Branch 1", "children": [{"title": "Sub-branch 1"${depth.value >= 4 ? ', "children": [{"title": "Leaf 1"}]' : ''}}]}]}`

    const response = await $fetch('/api/summarize', {
      method: 'POST',
      body: { content: prompt, type: 'mind map' },
    })

    const text = response.summary || ''
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        mindMap.value = JSON.parse(jsonMatch[0])
      }
    } catch {
      toast.add({ title: 'Error', description: 'Could not parse mind map. Try again.', color: 'warning' })
    }
  } catch (err: any) {
    toast.add({ title: 'Error', description: err.data?.message || 'Failed to generate mind map.', color: 'error' })
  } finally {
    loading.value = false
  }
}

function flattenMindMap(node: MindMapNode, indent = 0): string {
  let result = '  '.repeat(indent) + (indent === 0 ? '# ' : '- ') + node.title + '\n'
  if (node.children) {
    for (const child of node.children) {
      result += flattenMindMap(child, indent + 1)
    }
  }
  return result
}

async function saveToNotes() {
  if (!mindMap.value) return
  saving.value = true
  try {
    const noteContent = flattenMindMap(mindMap.value)
    await createNote({
      title: `Mind Map: ${mindMap.value.title}`,
      content: noteContent,
      summary: `Mind map with ${depth.value} levels for "${topic.value}"`,
      source_type: 'mindmap',
    })
    toast.add({ title: 'Saved!', description: 'Mind map saved to your notes.', color: 'success' })
  } catch {
    toast.add({ title: 'Error', description: 'Failed to save.', color: 'error' })
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.tree-children {
  margin-left: 1.5rem;
  padding-left: 1rem;
  border-left: 2px solid #e5e7eb;
  margin-top: 0.5rem;
}

.tree-node {
  position: relative;
  padding: 0.375rem 0;
}

.tree-node::before {
  content: '';
  position: absolute;
  left: -1rem;
  top: 50%;
  width: 0.75rem;
  height: 2px;
  background: #e5e7eb;
}
</style>
