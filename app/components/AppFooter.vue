<template>
  <footer class="bg-gray-900 text-white pt-16 pb-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
        <!-- Brand -->
        <div class="md:col-span-1">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">N</span>
            </div>
            <span class="text-lg font-bold">NoteGPT</span>
          </div>
          <p class="text-sm text-gray-400 mb-4">Your All-in-One AI Learning Assistant</p>
          <div class="flex gap-3">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <Icon name="simple-icons:x" class="w-5 h-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <Icon name="simple-icons:discord" class="w-5 h-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <Icon name="simple-icons:facebook" class="w-5 h-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <Icon name="simple-icons:youtube" class="w-5 h-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <Icon name="simple-icons:linkedin" class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- Products -->
        <div>
          <h3 class="font-semibold text-sm mb-4">Products</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/youtube-video-summarizer" class="text-sm text-gray-400 hover:text-white transition-colors">YouTube Summarizer</NuxtLink></li>
            <li><NuxtLink to="/ai-chat" class="text-sm text-gray-400 hover:text-white transition-colors">AI Chat</NuxtLink></li>
            <li><NuxtLink to="/pdf-summary" class="text-sm text-gray-400 hover:text-white transition-colors">PDF Summarizer</NuxtLink></li>
            <li><NuxtLink to="/text-to-speech" class="text-sm text-gray-400 hover:text-white transition-colors">Text to Speech</NuxtLink></li>
            <li><NuxtLink to="/ai-image-generator" class="text-sm text-gray-400 hover:text-white transition-colors">AI Image Generator</NuxtLink></li>
          </ul>
        </div>

        <!-- Features -->
        <div>
          <h3 class="font-semibold text-sm mb-4">Features</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/ai-flashcard-maker" class="text-sm text-gray-400 hover:text-white transition-colors">AI Flashcards</NuxtLink></li>
            <li><NuxtLink to="/ai-quiz-generator" class="text-sm text-gray-400 hover:text-white transition-colors">AI Quiz</NuxtLink></li>
            <li><NuxtLink to="/ai-mind-map-generator" class="text-sm text-gray-400 hover:text-white transition-colors">Mind Maps</NuxtLink></li>
            <li><NuxtLink to="/ai-presentation-maker" class="text-sm text-gray-400 hover:text-white transition-colors">AI Presentations</NuxtLink></li>
            <li><NuxtLink to="/ai-voice-generator" class="text-sm text-gray-400 hover:text-white transition-colors">AI Voice</NuxtLink></li>
          </ul>
        </div>

        <!-- AI Tools -->
        <div>
          <h3 class="font-semibold text-sm mb-4">AI Tools</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/ai-detector" class="text-sm text-gray-400 hover:text-white transition-colors">AI Detector</NuxtLink></li>
            <li><NuxtLink to="/ai-humanizer" class="text-sm text-gray-400 hover:text-white transition-colors">AI Humanizer</NuxtLink></li>
            <li><NuxtLink to="/ai-essay-writer" class="text-sm text-gray-400 hover:text-white transition-colors">AI Essay Writer</NuxtLink></li>
            <li><NuxtLink to="/ai-math-solver" class="text-sm text-gray-400 hover:text-white transition-colors">AI Math Solver</NuxtLink></li>
            <li><NuxtLink to="/free-tools" class="text-sm text-gray-400 hover:text-white transition-colors">All Tools</NuxtLink></li>
          </ul>
        </div>

        <!-- About -->
        <div>
          <h3 class="font-semibold text-sm mb-4">About</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/about-us" class="text-sm text-gray-400 hover:text-white transition-colors">About Us</NuxtLink></li>
            <li><NuxtLink to="/contact-us" class="text-sm text-gray-400 hover:text-white transition-colors">Contact Us</NuxtLink></li>
            <li><NuxtLink to="/privacy" class="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</NuxtLink></li>
            <li><NuxtLink to="/terms" class="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</NuxtLink></li>
            <li><NuxtLink to="/blog" class="text-sm text-gray-400 hover:text-white transition-colors">Blog</NuxtLink></li>
          </ul>
        </div>
      </div>

      <!-- Bottom -->
      <div class="border-t border-gray-800 pt-8 text-center">
        <p class="text-sm text-gray-500">&copy; {{ new Date().getFullYear() }} NoteGPT. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>
