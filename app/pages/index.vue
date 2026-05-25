<template>
  <div>
    <!-- Hero Section -->
    <section class="py-20 lg:py-28">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Your All-in-One<br />
          <span class="text-primary-500">AI Learning Assistant</span>
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Summarize YouTube videos, PDFs, and articles. Generate flashcards, quizzes, and mind maps.
          Chat with AI models. All in one place.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <UButton to="/dashboard" color="primary" size="lg" class="px-8">
            Try Free Now
          </UButton>
          <UButton variant="outline" size="lg" class="px-8">
            <Icon name="simple-icons:googlechrome" class="w-4 h-4 mr-2" />
            Add to Chrome - Free
          </UButton>
        </div>

        <!-- Stats -->
        <div class="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
          <div class="flex items-center gap-2">
            <Icon name="simple-icons:googlechrome" class="w-4 h-4" />
            <span>Chrome Web Store</span>
          </div>
          <div class="flex items-center gap-2">
            <Icon name="heroicons:users" class="w-4 h-4" />
            <span class="font-semibold text-gray-900">80M+</span> Users
          </div>
          <div class="flex items-center gap-2">
            <Icon name="heroicons:academic-cap" class="w-4 h-4" />
            <span class="font-semibold text-gray-900">12K+</span> Schools
          </div>
        </div>
      </div>
    </section>

    <!-- Tool Tabs Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-4">
          Loved by Over 80 Million Users Worldwide
        </h2>
        <p class="text-center text-gray-600 mb-10 max-w-xl mx-auto">
          Explore our powerful AI tools designed for students, educators, and professionals.
        </p>

        <!-- Tabs -->
        <div class="flex flex-wrap justify-center gap-2 mb-8">
          <button
            v-for="tab in toolTabs"
            :key="tab.id"
            class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            :class="activeTab === tab.id
              ? 'bg-primary-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Tool Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <NuxtLink
            v-for="tool in currentTools"
            :key="tool.name"
            :to="tool.to"
            class="bg-white rounded-lg p-5 border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all group"
          >
            <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center mb-3 group-hover:bg-primary-100 transition-colors">
              <Icon :name="tool.icon" class="w-5 h-5 text-primary-500" />
            </div>
            <h3 class="font-semibold text-gray-900 text-sm">{{ tool.name }}</h3>
            <p class="text-xs text-gray-500 mt-1">{{ tool.description }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Designed for You Section -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">Designed for You</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="persona in personas"
            :key="persona.title"
            class="relative rounded-xl overflow-hidden bg-gradient-to-br p-8 min-h-[200px] flex flex-col justify-end"
            :class="persona.gradient"
          >
            <h3 class="text-xl font-bold text-white mb-2">{{ persona.title }}</h3>
            <p class="text-sm text-white/80">{{ persona.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">Real Stories, Real Results</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="testimonial in testimonials"
            :key="testimonial.name"
            class="bg-white rounded-xl p-6 border border-gray-100"
          >
            <div class="flex items-center gap-1 mb-3">
              <Icon v-for="i in 5" :key="i" name="heroicons:star-solid" class="w-4 h-4 text-amber-400" />
            </div>
            <p class="text-sm text-gray-600 mb-4">{{ testimonial.text }}</p>
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span class="text-xs font-medium text-primary-600">{{ testimonial.name[0] }}</span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ testimonial.name }}</p>
                <p class="text-xs text-gray-500">{{ testimonial.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Privacy Section -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">Your Privacy, Our Priority</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="feature in privacyFeatures"
            :key="feature.title"
            class="text-center p-6"
          >
            <div class="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
              <Icon :name="feature.icon" class="w-6 h-6 text-primary-500" />
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">{{ feature.title }}</h3>
            <p class="text-sm text-gray-500">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Preview -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-4">
          Powerful Features, Affordable Plans
        </h2>
        <p class="text-center text-gray-600 mb-12">Choose the plan that fits your needs</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div
            v-for="plan in plans"
            :key="plan.name"
            class="bg-white rounded-xl p-6 border-2 transition-all"
            :class="plan.popular ? 'border-primary-500 shadow-lg scale-105' : 'border-gray-100'"
          >
            <div v-if="plan.popular" class="text-xs font-semibold text-primary-500 mb-2">MOST POPULAR</div>
            <h3 class="text-lg font-bold text-gray-900">{{ plan.name }}</h3>
            <div class="mt-3 mb-4">
              <span class="text-3xl font-bold text-gray-900">${{ plan.price }}</span>
              <span class="text-sm text-gray-500">/mo</span>
            </div>
            <UButton :color="plan.popular ? 'primary' : 'neutral'" variant="solid" block class="mb-4">
              Get Started
            </UButton>
            <ul class="space-y-2">
              <li v-for="feature in plan.features" :key="feature" class="flex items-center gap-2 text-sm text-gray-600">
                <Icon name="heroicons:check" class="w-4 h-4 text-green-500 shrink-0" />
                {{ feature }}
              </li>
            </ul>
          </div>
        </div>
        <div class="text-center mt-8">
          <NuxtLink to="/pricing" class="text-primary-500 font-medium text-sm hover:underline">
            View all plans →
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA Banner -->
    <section class="py-20">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Learn Smarter and Faster, Not Harder</h2>
        <p class="text-gray-600 mb-8">Join millions of learners using NoteGPT to boost their productivity.</p>
        <UButton to="/dashboard" color="primary" size="lg" class="px-8">
          Get Started Free
        </UButton>
      </div>
    </section>

    <!-- FAQ -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
        <div class="space-y-3">
          <div
            v-for="faq in faqs"
            :key="faq.question"
            class="bg-white rounded-lg border border-gray-100"
          >
            <button
              class="w-full flex items-center justify-between p-4 text-left"
              @click="faq.open = !faq.open"
            >
              <span class="font-medium text-gray-900 text-sm">{{ faq.question }}</span>
              <Icon
                :name="faq.open ? 'heroicons:chevron-up' : 'heroicons:chevron-down'"
                class="w-4 h-4 text-gray-400 shrink-0"
              />
            </button>
            <div v-if="faq.open" class="px-4 pb-4">
              <p class="text-sm text-gray-600">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const activeTab = ref('youtube')

const toolTabs = [
  { id: 'youtube', label: 'AI YouTube' },
  { id: 'transcriber', label: 'AI Transcriber' },
  { id: 'summarizer', label: 'AI Summarizer' },
  { id: 'voices', label: 'AI Voices' },
  { id: 'images', label: 'AI Images' },
  { id: 'study', label: 'AI Study' },
  { id: 'more', label: 'More Tools' },
]

const toolsByTab: Record<string, Array<{ name: string; icon: string; to: string; description: string }>> = {
  youtube: [
    { name: 'YouTube Summarizer', icon: 'heroicons:play-circle', to: '/youtube-video-summarizer', description: 'Summarize any YouTube video instantly' },
    { name: 'Transcript Generator', icon: 'heroicons:document-text', to: '/youtube-transcript-generator', description: 'Get full transcripts from videos' },
    { name: 'Subtitle Downloader', icon: 'heroicons:arrow-down-tray', to: '/youtube-subtitle-downloader', description: 'Download subtitles in any language' },
    { name: 'YouTube to Text', icon: 'heroicons:language', to: '/youtube-to-text', description: 'Convert video content to text' },
  ],
  transcriber: [
    { name: 'Audio to Text', icon: 'heroicons:microphone', to: '/audio-to-text-converter', description: 'Transcribe audio files accurately' },
    { name: 'Video to Text', icon: 'heroicons:video-camera', to: '/video-to-text', description: 'Extract text from video files' },
    { name: 'Speech to Text', icon: 'heroicons:speaker-wave', to: '/speech-to-text', description: 'Real-time speech transcription' },
    { name: 'Image to Text', icon: 'heroicons:photo', to: '/image-to-text', description: 'OCR text extraction from images' },
  ],
  summarizer: [
    { name: 'PDF Summarizer', icon: 'heroicons:document', to: '/pdf-summary', description: 'Summarize PDF documents' },
    { name: 'Article Summarizer', icon: 'heroicons:newspaper', to: '/article-summary', description: 'Condense long articles' },
    { name: 'Book Summarizer', icon: 'heroicons:book-open', to: '/book-summary', description: 'Get key insights from books' },
    { name: 'AI Text Summarizer', icon: 'heroicons:document-text', to: '/ai-text-summarizer', description: 'Summarize any text content' },
  ],
  voices: [
    { name: 'Text to Speech', icon: 'heroicons:speaker-wave', to: '/text-to-speech', description: 'Convert text to natural speech' },
    { name: 'AI Voice Generator', icon: 'heroicons:microphone', to: '/ai-voice-generator', description: 'Generate AI voices' },
    { name: 'AI Voice Cloning', icon: 'heroicons:user-circle', to: '/ai-voice-cloning', description: 'Clone any voice with AI' },
    { name: 'AI Podcast Generator', icon: 'heroicons:radio', to: '/ai-podcast-generator', description: 'Create AI-powered podcasts' },
  ],
  images: [
    { name: 'AI Image Generator', icon: 'heroicons:sparkles', to: '/ai-image-generator', description: 'Generate images from text' },
    { name: 'AI Background Remover', icon: 'heroicons:scissors', to: '/ai-background-remover', description: 'Remove backgrounds instantly' },
    { name: 'AI Image Enhancer', icon: 'heroicons:arrow-up-circle', to: '/ai-image-enhancer', description: 'Enhance image quality' },
    { name: 'AI Image Editor', icon: 'heroicons:paint-brush', to: '/ai-image-editor', description: 'Edit images with AI' },
  ],
  study: [
    { name: 'AI Flashcard Maker', icon: 'heroicons:rectangle-stack', to: '/ai-flashcard-maker', description: 'Create flashcards automatically' },
    { name: 'AI Quiz Generator', icon: 'heroicons:question-mark-circle', to: '/ai-quiz-generator', description: 'Generate quizzes from content' },
    { name: 'AI Math Solver', icon: 'heroicons:calculator', to: '/ai-math-solver', description: 'Solve math problems step by step' },
    { name: 'AI Homework Helper', icon: 'heroicons:academic-cap', to: '/ai-homework-helper', description: 'Get help with homework' },
  ],
  more: [
    { name: 'AI Presentation Maker', icon: 'heroicons:presentation-chart-bar', to: '/ai-presentation-maker', description: 'Create presentations with AI' },
    { name: 'AI Mind Map', icon: 'heroicons:map', to: '/ai-mind-map-generator', description: 'Generate mind maps' },
    { name: 'AI Detector', icon: 'heroicons:shield-check', to: '/ai-detector', description: 'Detect AI-generated content' },
    { name: 'PDF Translator', icon: 'heroicons:language', to: '/pdf-translator', description: 'Translate PDF documents' },
  ],
}

const currentTools = computed(() => toolsByTab[activeTab.value] || toolsByTab.youtube)

const personas = [
  { title: 'Students', description: 'Ace your exams with AI-powered study tools', gradient: 'from-blue-500 to-blue-700' },
  { title: 'Educators', description: 'Create engaging content and assessments effortlessly', gradient: 'from-purple-500 to-purple-700' },
  { title: 'Professionals', description: 'Boost productivity with smart summarization', gradient: 'from-emerald-500 to-emerald-700' },
  { title: 'Researchers', description: 'Extract insights from papers and documents', gradient: 'from-amber-500 to-amber-700' },
  { title: 'Creators', description: 'Generate content, voices, and visuals with AI', gradient: 'from-rose-500 to-rose-700' },
]

const testimonials = [
  { name: 'Sarah M.', role: 'Graduate Student', text: 'NoteGPT has completely transformed how I study. The YouTube summarizer saves me hours every week.' },
  { name: 'James K.', role: 'High School Teacher', text: 'I use the quiz generator and flashcard maker daily. My students love the interactive content.' },
  { name: 'Priya R.', role: 'Content Creator', text: 'The AI voice tools are incredible. I can create podcast content in minutes instead of hours.' },
  { name: 'Michael T.', role: 'PhD Researcher', text: 'The PDF summarizer helps me get through research papers 10x faster. Essential tool.' },
  { name: 'Lisa W.', role: 'Marketing Manager', text: 'AI presentations and mind maps have made my workflow so much more efficient.' },
  { name: 'David C.', role: 'Software Engineer', text: 'Great for summarizing technical talks and documentation. The transcript feature is spot on.' },
]

const privacyFeatures = [
  { icon: 'heroicons:shield-check', title: 'End-to-End Encryption', description: 'Your data is encrypted at rest and in transit' },
  { icon: 'heroicons:lock-closed', title: 'No Data Selling', description: 'We never sell your personal information' },
  { icon: 'heroicons:trash', title: 'Data Deletion', description: 'Delete your data anytime with one click' },
  { icon: 'heroicons:server', title: 'Secure Servers', description: 'Enterprise-grade infrastructure protection' },
  { icon: 'heroicons:eye-slash', title: 'Private by Default', description: 'Your notes are private unless you share them' },
  { icon: 'heroicons:document-check', title: 'GDPR Compliant', description: 'Full compliance with data protection regulations' },
]

const plans = [
  {
    name: 'Basic',
    price: '2.08',
    popular: false,
    features: ['200 Basic Quotas/mo', 'YouTube Summarizer', 'PDF Summarizer', 'AI Chat', 'Note Taking'],
  },
  {
    name: 'Unlimited',
    price: '14.5',
    popular: true,
    features: ['Unlimited Basic Quotas', '2,800 Premium Credits/mo', 'All AI Tools', 'Priority Support', 'Advanced Models'],
  },
  {
    name: 'Pro',
    price: '9',
    popular: false,
    features: ['1,000 Basic Quotas/mo', '100 Premium Credits/mo', 'All AI Tools', 'Standard Support', 'Voice & Image Tools'],
  },
]

const faqs = reactive([
  { question: 'What is NoteGPT?', answer: 'NoteGPT is an AI-powered learning assistant that helps you summarize videos, PDFs, and articles, create flashcards and quizzes, and chat with AI models.', open: false },
  { question: 'Is NoteGPT free to use?', answer: 'Yes! NoteGPT offers a free tier with limited quotas. You can upgrade to Basic, Pro, or Unlimited plans for more features and higher limits.', open: false },
  { question: 'How does the YouTube Summarizer work?', answer: 'Simply paste a YouTube URL and our AI will extract the transcript, analyze the content, and generate a concise summary with key points.', open: false },
  { question: 'What AI models are available?', answer: 'NoteGPT supports multiple AI models including GPT-5, Claude, Gemini, and DeepSeek. Premium plans unlock access to the most advanced models.', open: false },
  { question: 'Can I use NoteGPT for my school?', answer: 'Absolutely! We offer special education pricing for schools and institutions. Contact us for bulk licensing options.', open: false },
  { question: 'Is my data secure?', answer: 'Yes. We use end-to-end encryption, never sell your data, and are fully GDPR compliant. You can delete your data at any time.', open: false },
  { question: 'Do you offer refunds?', answer: 'Yes, we offer a 24-hour refund policy on all plans. No questions asked.', open: false },
  { question: 'What file formats are supported?', answer: 'We support PDF, PPT, DOCX, images (PNG, JPG), audio (MP3, WAV), and video files for summarization and transcription.', open: false },
])
</script>
