<template>
  <ToolPageLayout
    title="AI Content Detector"
    description="Analyze text to determine if it was written by AI or a human."
    category="AI Writer"
    category-icon="heroicons:magnifying-glass"
    :tabs="navTabs"
  >
    <!-- Text Input -->
    <div class="bg-white rounded-[10px] border border-gray-200 p-6 mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Paste or type text to analyze</label>
      <UTextarea
        v-model="text"
        placeholder="Paste the text you want to check for AI-generated content..."
        :rows="8"
        class="w-full"
      />
      <p class="text-xs text-gray-400 mt-1 text-right">{{ text.length }} characters</p>
    </div>

    <!-- Detect Button -->
    <div class="flex justify-center mb-6">
      <UButton
        color="primary"
        size="lg"
        :loading="loading"
        :disabled="!text.trim() || text.length < 50 || loading"
        @click="detectContent"
      >
        Detect AI Content
      </UButton>
      <p v-if="text.length > 0 && text.length < 50" class="text-xs text-gray-400 ml-3 self-center">
        Minimum 50 characters required
      </p>
    </div>

    <!-- Results -->
    <div v-if="result" class="space-y-6">
      <!-- Score Bar -->
      <div class="bg-white rounded-[10px] border border-gray-200 p-6">
        <h3 class="font-semibold text-gray-900 mb-4">Detection Result</h3>

        <!-- Percentage Display -->
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-600">Human</span>
          <span class="text-sm font-medium text-gray-600">AI Generated</span>
        </div>

        <!-- Progress Bar -->
        <div class="w-full h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
          <div
            class="h-full rounded-full transition-all duration-700"
            :class="scoreColor"
            :style="{ width: result.score + '%' }"
          />
        </div>

        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-500">{{ 100 - result.score }}%</span>
          <span class="text-sm text-gray-500">{{ result.score }}%</span>
        </div>

        <!-- Verdict -->
        <div class="mt-4 p-3 rounded-[8px]" :class="verdictBg">
          <p class="text-sm font-medium" :class="verdictText">
            {{ verdictLabel }}
          </p>
        </div>
      </div>

      <!-- Analysis -->
      <div class="bg-white rounded-[10px] border border-gray-200 p-6">
        <h3 class="font-semibold text-gray-900 mb-3">Analysis</h3>
        <p class="text-sm text-gray-700">{{ result.analysis }}</p>
      </div>

      <!-- Highlighted Sections -->
      <div v-if="result.highlights.length > 0" class="bg-white rounded-[10px] border border-gray-200 p-6">
        <h3 class="font-semibold text-gray-900 mb-3">Likely AI-Generated Sections</h3>
        <div class="space-y-2">
          <div
            v-for="(highlight, idx) in result.highlights"
            :key="idx"
            class="p-3 bg-yellow-50 border border-yellow-200 rounded-[8px]"
          >
            <p class="text-sm text-gray-700 italic">"{{ highlight }}"</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading" class="bg-gray-50 rounded-[10px] border border-dashed border-gray-200 p-12 text-center">
      <Icon name="heroicons:magnifying-glass" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-500">Paste text above to check if it's AI-generated</p>
    </div>
  </ToolPageLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'auth' })

const toast = useToast()
const { consumeQuota } = useProfile()

const text = ref('')
const loading = ref(false)
const result = ref<{ score: number; analysis: string; highlights: string[] } | null>(null)

const navTabs = [
  { label: 'AI Detector', to: '/ai-detector' },
  { label: 'AI Humanizer', to: '/ai-humanizer' },
  { label: 'Essay Writer', to: '/ai-essay-writer' },
  { label: 'Grammar Checker', to: '/ai-grammar-checker' },
]

const scoreColor = computed(() => {
  if (!result.value) return 'bg-gray-300'
  if (result.value.score >= 75) return 'bg-red-500'
  if (result.value.score >= 50) return 'bg-orange-500'
  if (result.value.score >= 25) return 'bg-yellow-500'
  return 'bg-green-500'
})

const verdictLabel = computed(() => {
  if (!result.value) return ''
  if (result.value.score >= 75) return 'This text is very likely AI-generated.'
  if (result.value.score >= 50) return 'This text is possibly AI-generated.'
  if (result.value.score >= 25) return 'This text is likely human-written with some AI assistance.'
  return 'This text appears to be human-written.'
})

const verdictBg = computed(() => {
  if (!result.value) return 'bg-gray-50'
  if (result.value.score >= 75) return 'bg-red-50'
  if (result.value.score >= 50) return 'bg-orange-50'
  if (result.value.score >= 25) return 'bg-yellow-50'
  return 'bg-green-50'
})

const verdictText = computed(() => {
  if (!result.value) return 'text-gray-700'
  if (result.value.score >= 75) return 'text-red-700'
  if (result.value.score >= 50) return 'text-orange-700'
  if (result.value.score >= 25) return 'text-yellow-700'
  return 'text-green-700'
})

async function detectContent() {
  if (!text.value.trim() || text.value.length < 50) return

  loading.value = true
  result.value = null

  try {
    const quotaAvailable = await consumeQuota('ai-detector')
    if (!quotaAvailable) {
      toast.add({ title: 'Quota Exhausted', description: 'Upgrade to continue using this tool.', color: 'warning' })
      return
    }

    const response = await $fetch('/api/detect', {
      method: 'POST',
      body: { text: text.value },
    })

    result.value = response
  } catch (err: any) {
    toast.add({ title: 'Error', description: err.data?.message || 'Failed to analyze text.', color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>
