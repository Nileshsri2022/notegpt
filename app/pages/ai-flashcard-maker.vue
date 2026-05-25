<template>
  <ToolPageLayout
    title="AI Flashcard Maker"
    description="Generate study flashcards from any text, notes, or topic using AI."
    category="AI Study"
    category-icon="heroicons:academic-cap"
    :tabs="navTabs"
  >
    <!-- Content Input -->
    <div class="bg-white rounded-[10px] border border-gray-200 p-6 mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Paste your notes, article, or topic</label>
      <UTextarea
        v-model="content"
        placeholder="Paste your study material here, or describe a topic you want flashcards for..."
        :rows="6"
        class="w-full"
      />
    </div>

    <!-- Number of Cards -->
    <div class="bg-white rounded-[10px] border border-gray-200 p-6 mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">Number of flashcards</label>
      <div class="flex gap-2">
        <button
          v-for="count in cardCounts"
          :key="count"
          class="px-4 py-2 rounded-[8px] text-sm font-medium transition-colors"
          :class="numCards === count
            ? 'bg-primary-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          @click="numCards = count"
        >
          {{ count }} cards
        </button>
      </div>
    </div>

    <!-- Generate Button -->
    <div class="flex justify-center mb-6">
      <UButton
        color="primary"
        size="lg"
        :loading="loading"
        :disabled="!content.trim() || loading"
        @click="generateFlashcards"
      >
        Generate Flashcards
      </UButton>
    </div>

    <!-- Flashcard Grid -->
    <div v-if="flashcards.length > 0" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="(card, idx) in flashcards"
          :key="idx"
          class="perspective-1000"
        >
          <div
            class="relative w-full h-48 cursor-pointer transition-transform duration-500 transform-style-3d"
            :class="{ 'rotate-y-180': card.flipped }"
            @click="card.flipped = !card.flipped"
          >
            <!-- Front -->
            <div class="absolute inset-0 backface-hidden bg-white rounded-[10px] border border-gray-200 p-5 flex flex-col justify-center items-center text-center">
              <span class="text-xs text-gray-400 absolute top-3 left-3">{{ idx + 1 }}/{{ flashcards.length }}</span>
              <Icon name="heroicons:question-mark-circle" class="w-6 h-6 text-primary-300 mb-2" />
              <p class="text-sm font-medium text-gray-900">{{ card.question }}</p>
              <p class="text-xs text-gray-400 mt-3">Click to reveal answer</p>
            </div>
            <!-- Back -->
            <div class="absolute inset-0 backface-hidden rotate-y-180 bg-primary-50 rounded-[10px] border border-primary-200 p-5 flex flex-col justify-center items-center text-center">
              <span class="text-xs text-primary-400 absolute top-3 left-3">Answer</span>
              <p class="text-sm text-gray-800">{{ card.answer }}</p>
              <p class="text-xs text-gray-400 mt-3">Click to flip back</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <UButton color="primary" variant="soft" size="sm" :loading="saving" @click="saveToNotes">
          <Icon name="heroicons:bookmark" class="w-4 h-4 mr-1" />
          Save to Notes
        </UButton>
        <UButton color="neutral" variant="ghost" size="sm" @click="generateFlashcards">
          <Icon name="heroicons:arrow-path" class="w-4 h-4 mr-1" />
          Regenerate
        </UButton>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading" class="bg-gray-50 rounded-[10px] border border-dashed border-gray-200 p-12 text-center">
      <Icon name="heroicons:academic-cap" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-500">Enter content above to generate study flashcards</p>
    </div>
  </ToolPageLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'auth' })

const toast = useToast()
const { consumeQuota } = useProfile()
const { createNote } = useNotes()

const content = ref('')
const numCards = ref(10)
const loading = ref(false)
const saving = ref(false)
const flashcards = ref<{ question: string; answer: string; flipped: boolean }[]>([])

const cardCounts = [5, 10, 15, 20]

const navTabs = [
  { label: 'Flashcard Maker', to: '/ai-flashcard-maker' },
  { label: 'Quiz Generator', to: '/ai-quiz-generator' },
  { label: 'Math Solver', to: '/ai-math-solver' },
  { label: 'Homework Helper', to: '/ai-homework-helper' },
]

async function generateFlashcards() {
  if (!content.value.trim()) return

  loading.value = true
  flashcards.value = []

  try {
    const quotaAvailable = await consumeQuota('ai-flashcard-maker')
    if (!quotaAvailable) {
      toast.add({ title: 'Quota Exhausted', description: 'Upgrade to continue using this tool.', color: 'warning' })
      return
    }

    const prompt = `Based on the following content, generate exactly ${numCards.value} flashcards for studying. Each flashcard should have a clear question and a concise answer.

Content:
${content.value}

Respond in this exact JSON format (no other text):
[{"question": "...", "answer": "..."}, ...]`

    const response = await $fetch('/api/summarize', {
      method: 'POST',
      body: { content: prompt, type: 'flashcards' },
    })

    // Parse flashcards from response
    const text = response.summary || ''
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        flashcards.value = parsed.map((card: any) => ({
          question: card.question || card.front || '',
          answer: card.answer || card.back || '',
          flipped: false,
        }))
      }
    } catch {
      // Fallback: try to parse line by line
      toast.add({ title: 'Partial Result', description: 'Could not parse all flashcards. Try again.', color: 'warning' })
    }
  } catch (err: any) {
    toast.add({ title: 'Error', description: err.data?.message || 'Failed to generate flashcards.', color: 'error' })
  } finally {
    loading.value = false
  }
}

async function saveToNotes() {
  if (flashcards.value.length === 0) return
  saving.value = true
  try {
    const noteContent = flashcards.value
      .map((c, i) => `**Q${i + 1}:** ${c.question}\n**A:** ${c.answer}`)
      .join('\n\n')

    await createNote({
      title: `Flashcards (${flashcards.value.length} cards)`,
      content: noteContent,
      summary: `${flashcards.value.length} flashcards generated from study material`,
      source_type: 'flashcards',
    })
    toast.add({ title: 'Saved!', description: 'Flashcards saved to your notes.', color: 'success' })
  } catch {
    toast.add({ title: 'Error', description: 'Failed to save.', color: 'error' })
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}
.transform-style-3d {
  transform-style: preserve-3d;
}
.backface-hidden {
  backface-visibility: hidden;
}
.rotate-y-180 {
  transform: rotateY(180deg);
}
</style>
