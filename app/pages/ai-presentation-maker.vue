<template>
  <ToolPageLayout
    title="AI Presentation Maker"
    description="Generate professional presentations from any topic or content using AI."
    category="AI Presentation"
    category-icon="heroicons:presentation-chart-bar"
    :tabs="navTabs"
  >
    <!-- Content Input -->
    <div class="bg-white rounded-[10px] border border-gray-200 p-6 mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Topic or content</label>
      <UTextarea
        v-model="content"
        placeholder="Enter a topic or paste content for your presentation..."
        :rows="4"
        class="w-full"
      />
    </div>

    <!-- Options Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <!-- Number of Slides -->
      <div class="bg-white rounded-[10px] border border-gray-200 p-6">
        <label class="block text-sm font-medium text-gray-700 mb-3">Number of slides</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="count in slideCounts"
            :key="count"
            class="px-4 py-2 rounded-[8px] text-sm font-medium transition-colors"
            :class="numSlides === count
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            @click="numSlides = count"
          >
            {{ count }}
          </button>
        </div>
      </div>

      <!-- Style -->
      <div class="bg-white rounded-[10px] border border-gray-200 p-6">
        <label class="block text-sm font-medium text-gray-700 mb-3">Style</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="style in styles"
            :key="style.id"
            class="px-4 py-2 rounded-[8px] text-sm font-medium transition-colors"
            :class="selectedStyle === style.id
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            @click="selectedStyle = style.id"
          >
            {{ style.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Generate Button -->
    <div class="flex justify-center mb-6">
      <UButton
        color="primary"
        size="lg"
        :loading="loading"
        :disabled="!content.trim() || loading"
        @click="generatePresentation"
      >
        Generate Presentation
      </UButton>
    </div>

    <!-- Slide Preview -->
    <div v-if="slides.length > 0" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="(slide, idx) in slides"
          :key="idx"
          class="bg-white rounded-[10px] border border-gray-200 p-5 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center gap-2 mb-3">
            <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs font-bold">
              {{ idx + 1 }}
            </span>
            <h4 class="font-semibold text-gray-900 text-sm">{{ slide.title }}</h4>
          </div>
          <ul class="space-y-1.5">
            <li
              v-for="(point, pIdx) in slide.points"
              :key="pIdx"
              class="text-xs text-gray-600 flex items-start gap-1.5"
            >
              <span class="text-primary-400 mt-0.5">•</span>
              {{ point }}
            </li>
          </ul>
          <p v-if="slide.notes" class="text-xs text-gray-400 mt-3 italic">{{ slide.notes }}</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <UButton color="primary" variant="soft" size="sm" :loading="saving" @click="saveToNotes">
          <Icon name="heroicons:bookmark" class="w-4 h-4 mr-1" />
          Save to Notes
        </UButton>
        <UButton color="neutral" variant="ghost" size="sm" disabled>
          <Icon name="heroicons:arrow-down-tray" class="w-4 h-4 mr-1" />
          Download as PDF (Coming Soon)
        </UButton>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading" class="bg-gray-50 rounded-[10px] border border-dashed border-gray-200 p-12 text-center">
      <Icon name="heroicons:presentation-chart-bar" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-500">Enter a topic above to generate a presentation</p>
    </div>
  </ToolPageLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'auth' })

const toast = useToast()
const { consumeQuota } = useProfile()
const { createNote } = useNotes()

const content = ref('')
const numSlides = ref(10)
const selectedStyle = ref('professional')
const loading = ref(false)
const saving = ref(false)
const slides = ref<{ title: string; points: string[]; notes?: string }[]>([])

const navTabs = [
  { label: 'Presentation Maker', to: '/ai-presentation-maker' },
  { label: 'PPT Maker', to: '/ai-ppt-maker' },
  { label: 'Slide Generator', to: '/ai-slide-generator' },
  { label: 'Keynote Generator', to: '/ai-keynote-generator' },
]

const slideCounts = [5, 10, 15, 20]

const styles = [
  { id: 'professional', label: 'Professional' },
  { id: 'creative', label: 'Creative' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'academic', label: 'Academic' },
]

async function generatePresentation() {
  if (!content.value.trim()) return

  loading.value = true
  slides.value = []

  try {
    const quotaAvailable = await consumeQuota('ai-presentation-maker')
    if (!quotaAvailable) {
      toast.add({ title: 'Quota Exhausted', description: 'Upgrade to continue using this tool.', color: 'warning' })
      return
    }

    const prompt = `Create a ${selectedStyle.value} presentation with exactly ${numSlides.value} slides about the following topic/content. Each slide should have a title and 3-5 bullet points.

Topic/Content:
${content.value}

Respond in this exact JSON format (no other text):
[{"title": "Slide Title", "points": ["Point 1", "Point 2", "Point 3"], "notes": "Speaker notes"}]`

    const response = await $fetch('/api/summarize', {
      method: 'POST',
      body: { content: prompt, type: 'presentation' },
    })

    const text = response.summary || ''
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        slides.value = JSON.parse(jsonMatch[0])
      }
    } catch {
      toast.add({ title: 'Error', description: 'Could not parse presentation. Try again.', color: 'warning' })
    }
  } catch (err: any) {
    toast.add({ title: 'Error', description: err.data?.message || 'Failed to generate presentation.', color: 'error' })
  } finally {
    loading.value = false
  }
}

async function saveToNotes() {
  if (slides.value.length === 0) return
  saving.value = true
  try {
    const noteContent = slides.value
      .map((s, i) => `## Slide ${i + 1}: ${s.title}\n${s.points.map(p => `- ${p}`).join('\n')}${s.notes ? `\n\n_Notes: ${s.notes}_` : ''}`)
      .join('\n\n')

    await createNote({
      title: `Presentation: ${slides.value[0]?.title || 'Untitled'}`,
      content: noteContent,
      summary: `${slides.value.length}-slide ${selectedStyle.value} presentation`,
      source_type: 'presentation',
    })
    toast.add({ title: 'Saved!', description: 'Presentation saved to your notes.', color: 'success' })
  } catch {
    toast.add({ title: 'Error', description: 'Failed to save.', color: 'error' })
  } finally {
    saving.value = false
  }
}
</script>
