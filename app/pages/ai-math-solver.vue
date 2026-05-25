<template>
  <ToolPageLayout
    title="AI Math Solver"
    description="Solve math problems step-by-step with AI explanations."
    category="AI Study"
    category-icon="heroicons:calculator"
    :tabs="navTabs"
  >
    <!-- Problem Input -->
    <div class="bg-white rounded-[10px] border border-gray-200 p-6 mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Enter your math problem</label>
      <UTextarea
        v-model="problem"
        placeholder="e.g., Solve for x: 2x² + 5x - 3 = 0&#10;&#10;Or describe a word problem..."
        :rows="4"
        class="w-full"
      />
      <p class="text-xs text-gray-400 mt-2">
        Supports algebra, calculus, geometry, statistics, and more.
      </p>
    </div>

    <!-- Solve Button -->
    <div class="flex justify-center mb-6">
      <UButton
        color="primary"
        size="lg"
        :loading="loading"
        :disabled="!problem.trim() || loading"
        @click="solveProblem"
      >
        Solve
      </UButton>
    </div>

    <!-- Solution Display -->
    <div v-if="solution" class="space-y-6">
      <!-- Step-by-step Solution -->
      <div class="bg-white rounded-[10px] border border-gray-200 p-6">
        <h3 class="font-semibold text-gray-900 mb-4">Step-by-Step Solution</h3>

        <div class="space-y-4">
          <div
            v-for="(step, idx) in solution.steps"
            :key="idx"
            class="flex gap-3"
          >
            <div class="flex-shrink-0 w-7 h-7 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
              {{ idx + 1 }}
            </div>
            <div class="flex-1 pt-0.5">
              <p class="text-sm font-medium text-gray-900">{{ step.title }}</p>
              <p class="text-sm text-gray-600 mt-1 whitespace-pre-wrap font-mono">{{ step.content }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Final Answer -->
      <div class="bg-green-50 rounded-[10px] border border-green-200 p-6">
        <h3 class="font-semibold text-green-800 mb-2">Final Answer</h3>
        <p class="text-green-900 font-mono text-lg">{{ solution.answer }}</p>
      </div>

      <!-- Explanation -->
      <div v-if="solution.explanation" class="bg-white rounded-[10px] border border-gray-200 p-6">
        <h3 class="font-semibold text-gray-900 mb-3">Explanation</h3>
        <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ solution.explanation }}</p>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <UButton color="primary" variant="soft" size="sm" :loading="saving" @click="saveToNotes">
          <Icon name="heroicons:bookmark" class="w-4 h-4 mr-1" />
          Save to Notes
        </UButton>
        <UButton color="neutral" variant="ghost" size="sm" @click="copyToClipboard">
          <Icon name="heroicons:clipboard-document" class="w-4 h-4 mr-1" />
          Copy
        </UButton>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading" class="bg-gray-50 rounded-[10px] border border-dashed border-gray-200 p-12 text-center">
      <Icon name="heroicons:calculator" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-500">Enter a math problem above to get a step-by-step solution</p>
    </div>
  </ToolPageLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'auth' })

const toast = useToast()
const { consumeQuota } = useProfile()
const { createNote } = useNotes()

interface SolutionStep {
  title: string
  content: string
}

interface Solution {
  steps: SolutionStep[]
  answer: string
  explanation?: string
}

const problem = ref('')
const loading = ref(false)
const saving = ref(false)
const solution = ref<Solution | null>(null)

const navTabs = [
  { label: 'Flashcard Maker', to: '/ai-flashcard-maker' },
  { label: 'Quiz Generator', to: '/ai-quiz-generator' },
  { label: 'Math Solver', to: '/ai-math-solver' },
  { label: 'Homework Helper', to: '/ai-homework-helper' },
]

async function solveProblem() {
  if (!problem.value.trim()) return

  loading.value = true
  solution.value = null

  try {
    const quotaAvailable = await consumeQuota('ai-math-solver')
    if (!quotaAvailable) {
      toast.add({ title: 'Quota Exhausted', description: 'Upgrade to continue using this tool.', color: 'warning' })
      return
    }

    const prompt = `Solve the following math problem step by step. Show your work clearly.

Problem: ${problem.value}

Respond in this exact JSON format (no other text):
{
  "steps": [
    {"title": "Step description", "content": "Mathematical work for this step"}
  ],
  "answer": "The final answer",
  "explanation": "Brief explanation of the approach used"
}`

    const response = await $fetch('/api/summarize', {
      method: 'POST',
      body: { content: prompt, type: 'math solution' },
    })

    const text = response.summary || ''
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        solution.value = JSON.parse(jsonMatch[0])
      }
    } catch {
      // Fallback: display raw text as a single step
      solution.value = {
        steps: [{ title: 'Solution', content: text }],
        answer: 'See steps above',
      }
    }
  } catch (err: any) {
    toast.add({ title: 'Error', description: err.data?.message || 'Failed to solve problem.', color: 'error' })
  } finally {
    loading.value = false
  }
}

async function saveToNotes() {
  if (!solution.value) return
  saving.value = true
  try {
    const noteContent = [
      `**Problem:** ${problem.value}`,
      '',
      ...solution.value.steps.map((s, i) => `**Step ${i + 1}: ${s.title}**\n${s.content}`),
      '',
      `**Answer:** ${solution.value.answer}`,
      solution.value.explanation ? `\n**Explanation:** ${solution.value.explanation}` : '',
    ].join('\n')

    await createNote({
      title: `Math: ${problem.value.slice(0, 50)}`,
      content: noteContent,
      summary: `Solution: ${solution.value.answer}`,
      source_type: 'math',
    })
    toast.add({ title: 'Saved!', description: 'Solution saved to your notes.', color: 'success' })
  } catch {
    toast.add({ title: 'Error', description: 'Failed to save.', color: 'error' })
  } finally {
    saving.value = false
  }
}

async function copyToClipboard() {
  if (!solution.value) return
  const text = [
    `Problem: ${problem.value}`,
    '',
    ...solution.value.steps.map((s, i) => `Step ${i + 1}: ${s.title}\n${s.content}`),
    '',
    `Answer: ${solution.value.answer}`,
  ].join('\n')

  try {
    await navigator.clipboard.writeText(text)
    toast.add({ title: 'Copied!', description: 'Solution copied to clipboard.', color: 'success' })
  } catch {
    toast.add({ title: 'Error', description: 'Failed to copy.', color: 'error' })
  }
}
</script>
