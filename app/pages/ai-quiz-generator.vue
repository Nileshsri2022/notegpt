<template>
  <ToolPageLayout
    title="AI Quiz Generator"
    description="Generate interactive quizzes from any content to test your knowledge."
    category="AI Study"
    category-icon="heroicons:academic-cap"
    :tabs="navTabs"
  >
    <!-- Content Input -->
    <div v-if="!quizStarted" class="space-y-6">
      <div class="bg-white rounded-[10px] border border-gray-200 p-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Paste content to generate a quiz from</label>
        <UTextarea
          v-model="content"
          placeholder="Paste your study material, notes, or describe a topic..."
          :rows="6"
          class="w-full"
        />
      </div>

      <!-- Quiz Type -->
      <div class="bg-white rounded-[10px] border border-gray-200 p-6">
        <label class="block text-sm font-medium text-gray-700 mb-3">Quiz type</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="type in quizTypes"
            :key="type.id"
            class="px-4 py-2 rounded-[8px] text-sm font-medium transition-colors"
            :class="selectedType === type.id
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            @click="selectedType = type.id"
          >
            {{ type.label }}
          </button>
        </div>
      </div>

      <!-- Number of Questions -->
      <div class="bg-white rounded-[10px] border border-gray-200 p-6">
        <label class="block text-sm font-medium text-gray-700 mb-3">Number of questions</label>
        <div class="flex gap-2">
          <button
            v-for="count in questionCounts"
            :key="count"
            class="px-4 py-2 rounded-[8px] text-sm font-medium transition-colors"
            :class="numQuestions === count
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            @click="numQuestions = count"
          >
            {{ count }}
          </button>
        </div>
      </div>

      <!-- Generate Button -->
      <div class="flex justify-center">
        <UButton
          color="primary"
          size="lg"
          :loading="loading"
          :disabled="!content.trim() || loading"
          @click="generateQuiz"
        >
          Generate Quiz
        </UButton>
      </div>
    </div>

    <!-- Quiz Display -->
    <div v-else-if="!quizCompleted" class="space-y-6">
      <!-- Progress -->
      <div class="bg-white rounded-[10px] border border-gray-200 p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">Question {{ currentQuestion + 1 }} of {{ questions.length }}</span>
          <span class="text-sm text-gray-500">Score: {{ score }}/{{ currentQuestion }}</span>
        </div>
        <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            class="h-full bg-primary-500 rounded-full transition-all"
            :style="{ width: ((currentQuestion + 1) / questions.length * 100) + '%' }"
          />
        </div>
      </div>

      <!-- Question Card -->
      <div class="bg-white rounded-[10px] border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">{{ questions[currentQuestion].question }}</h3>

        <!-- Multiple Choice -->
        <div v-if="selectedType === 'multiple-choice'" class="space-y-2">
          <button
            v-for="(option, idx) in questions[currentQuestion].options"
            :key="idx"
            class="w-full p-3 rounded-[8px] border text-left text-sm transition-all"
            :class="getOptionClass(idx)"
            :disabled="answered"
            @click="selectAnswer(idx)"
          >
            <span class="font-medium mr-2">{{ String.fromCharCode(65 + idx) }}.</span>
            {{ option }}
          </button>
        </div>

        <!-- True/False -->
        <div v-else-if="selectedType === 'true-false'" class="flex gap-3">
          <button
            v-for="option in ['True', 'False']"
            :key="option"
            class="flex-1 p-3 rounded-[8px] border text-center text-sm font-medium transition-all"
            :class="getTFClass(option)"
            :disabled="answered"
            @click="selectAnswer(option === 'True' ? 0 : 1)"
          >
            {{ option }}
          </button>
        </div>

        <!-- Short Answer -->
        <div v-else>
          <UInput
            v-model="shortAnswer"
            placeholder="Type your answer..."
            class="w-full mb-3"
            :disabled="answered"
          />
          <UButton v-if="!answered" color="primary" size="sm" @click="submitShortAnswer">
            Submit
          </UButton>
        </div>

        <!-- Feedback -->
        <div v-if="answered" class="mt-4 p-3 rounded-[8px]" :class="lastCorrect ? 'bg-green-50' : 'bg-red-50'">
          <p class="text-sm font-medium" :class="lastCorrect ? 'text-green-700' : 'text-red-700'">
            {{ lastCorrect ? '✓ Correct!' : '✗ Incorrect' }}
          </p>
          <p v-if="!lastCorrect" class="text-sm text-gray-600 mt-1">
            Correct answer: {{ questions[currentQuestion].correctAnswer }}
          </p>
        </div>
      </div>

      <!-- Next Button -->
      <div v-if="answered" class="flex justify-center">
        <UButton color="primary" @click="nextQuestion">
          {{ currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results' }}
        </UButton>
      </div>
    </div>

    <!-- Results -->
    <div v-else class="bg-white rounded-[10px] border border-gray-200 p-8 text-center">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
        :class="score >= questions.length * 0.7 ? 'bg-green-100' : score >= questions.length * 0.4 ? 'bg-yellow-100' : 'bg-red-100'"
      >
        <span class="text-2xl font-bold" :class="score >= questions.length * 0.7 ? 'text-green-600' : score >= questions.length * 0.4 ? 'text-yellow-600' : 'text-red-600'">
          {{ Math.round(score / questions.length * 100) }}%
        </span>
      </div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">Quiz Complete!</h3>
      <p class="text-gray-600 mb-6">You scored {{ score }} out of {{ questions.length }} questions correctly.</p>
      <div class="flex items-center justify-center gap-3">
        <UButton color="primary" @click="resetQuiz">
          Try Again
        </UButton>
        <UButton color="neutral" variant="soft" @click="newQuiz">
          New Quiz
        </UButton>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!quizStarted && !loading && questions.length === 0" class="bg-gray-50 rounded-[10px] border border-dashed border-gray-200 p-12 text-center mt-6">
      <Icon name="heroicons:academic-cap" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-500">Enter content above to generate an interactive quiz</p>
    </div>
  </ToolPageLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'auth' })

const toast = useToast()
const { consumeQuota } = useProfile()

const content = ref('')
const selectedType = ref('multiple-choice')
const numQuestions = ref(5)
const loading = ref(false)

const questions = ref<any[]>([])
const currentQuestion = ref(0)
const score = ref(0)
const answered = ref(false)
const lastCorrect = ref(false)
const selectedIdx = ref(-1)
const shortAnswer = ref('')
const quizStarted = ref(false)
const quizCompleted = ref(false)

const navTabs = [
  { label: 'Flashcard Maker', to: '/ai-flashcard-maker' },
  { label: 'Quiz Generator', to: '/ai-quiz-generator' },
  { label: 'Math Solver', to: '/ai-math-solver' },
  { label: 'Homework Helper', to: '/ai-homework-helper' },
]

const quizTypes = [
  { id: 'multiple-choice', label: 'Multiple Choice' },
  { id: 'true-false', label: 'True/False' },
  { id: 'short-answer', label: 'Short Answer' },
]

const questionCounts = [5, 10, 15]

function getOptionClass(idx: number) {
  if (!answered.value) {
    return selectedIdx.value === idx ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
  }
  if (idx === questions.value[currentQuestion.value].correctIdx) return 'border-green-500 bg-green-50'
  if (idx === selectedIdx.value) return 'border-red-500 bg-red-50'
  return 'border-gray-200 opacity-50'
}

function getTFClass(option: string) {
  const idx = option === 'True' ? 0 : 1
  if (!answered.value) {
    return selectedIdx.value === idx ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
  }
  if (idx === questions.value[currentQuestion.value].correctIdx) return 'border-green-500 bg-green-50'
  if (idx === selectedIdx.value) return 'border-red-500 bg-red-50'
  return 'border-gray-200 opacity-50'
}

function selectAnswer(idx: number) {
  if (answered.value) return
  selectedIdx.value = idx
  answered.value = true
  const correct = questions.value[currentQuestion.value].correctIdx === idx
  lastCorrect.value = correct
  if (correct) score.value++
}

function submitShortAnswer() {
  if (!shortAnswer.value.trim()) return
  answered.value = true
  const correct = shortAnswer.value.toLowerCase().trim().includes(
    questions.value[currentQuestion.value].correctAnswer.toLowerCase().trim()
  )
  lastCorrect.value = correct
  if (correct) score.value++
}

function nextQuestion() {
  if (currentQuestion.value < questions.value.length - 1) {
    currentQuestion.value++
    answered.value = false
    selectedIdx.value = -1
    shortAnswer.value = ''
    lastCorrect.value = false
  } else {
    quizCompleted.value = true
  }
}

function resetQuiz() {
  currentQuestion.value = 0
  score.value = 0
  answered.value = false
  selectedIdx.value = -1
  shortAnswer.value = ''
  lastCorrect.value = false
  quizCompleted.value = false
}

function newQuiz() {
  resetQuiz()
  quizStarted.value = false
  questions.value = []
}

async function generateQuiz() {
  if (!content.value.trim()) return

  loading.value = true
  questions.value = []

  try {
    const quotaAvailable = await consumeQuota('ai-quiz-generator')
    if (!quotaAvailable) {
      toast.add({ title: 'Quota Exhausted', description: 'Upgrade to continue using this tool.', color: 'warning' })
      return
    }

    let formatInstructions = ''
    if (selectedType.value === 'multiple-choice') {
      formatInstructions = `Generate exactly ${numQuestions.value} multiple choice questions. Each question should have 4 options with one correct answer.
Respond in JSON: [{"question": "...", "options": ["A", "B", "C", "D"], "correctIdx": 0, "correctAnswer": "A"}]`
    } else if (selectedType.value === 'true-false') {
      formatInstructions = `Generate exactly ${numQuestions.value} true/false questions.
Respond in JSON: [{"question": "...", "options": ["True", "False"], "correctIdx": 0, "correctAnswer": "True"}]`
    } else {
      formatInstructions = `Generate exactly ${numQuestions.value} short answer questions.
Respond in JSON: [{"question": "...", "correctAnswer": "...", "correctIdx": 0}]`
    }

    const prompt = `Based on the following content, ${formatInstructions}

Content:
${content.value}

Only return valid JSON, no other text.`

    const response = await $fetch('/api/summarize', {
      method: 'POST',
      body: { content: prompt, type: 'quiz' },
    })

    const text = response.summary || ''
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        questions.value = JSON.parse(jsonMatch[0])
        quizStarted.value = true
      }
    } catch {
      toast.add({ title: 'Error', description: 'Could not parse quiz. Try again.', color: 'warning' })
    }
  } catch (err: any) {
    toast.add({ title: 'Error', description: err.data?.message || 'Failed to generate quiz.', color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>
