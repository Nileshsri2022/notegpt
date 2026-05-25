<template>
  <ToolPageLayout
    title="AI Image Generator"
    description="Generate stunning images from text descriptions using AI."
    category="AI Images"
    category-icon="heroicons:photo"
    :tabs="navTabs"
  >
    <!-- Prompt Input -->
    <div class="bg-white rounded-[10px] border border-gray-200 p-6 mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Describe your image</label>
      <UTextarea
        v-model="prompt"
        placeholder="A serene mountain landscape at sunset with golden light..."
        :rows="3"
        class="w-full"
      />
    </div>

    <!-- Style Selector -->
    <div class="bg-white rounded-[10px] border border-gray-200 p-6 mb-6">
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

    <!-- Size Selector -->
    <div class="bg-white rounded-[10px] border border-gray-200 p-6 mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">Size</label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="size in sizes"
          :key="size.id"
          class="px-4 py-2 rounded-[8px] text-sm font-medium transition-colors"
          :class="selectedSize === size.id
            ? 'bg-primary-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          @click="selectedSize = size.id"
        >
          {{ size.label }}
        </button>
      </div>
    </div>

    <!-- Generate Button -->
    <div class="flex justify-center mb-6">
      <UButton
        color="primary"
        size="lg"
        :disabled="!prompt.trim()"
        @click="showComingSoon"
      >
        Generate Image
      </UButton>
    </div>

    <!-- Coming Soon State -->
    <div class="bg-white rounded-[10px] border border-gray-200 p-8 text-center">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 mb-4">
        <Icon name="heroicons:sparkles" class="w-8 h-8 text-primary-500" />
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
      <p class="text-gray-500 max-w-md mx-auto">
        AI Image Generation is currently under development. We're integrating advanced image models to bring you stunning AI-generated artwork.
      </p>
      <div class="mt-6 p-4 bg-gray-50 rounded-[8px] max-w-sm mx-auto">
        <p class="text-sm text-gray-600">
          <Icon name="heroicons:bell" class="w-4 h-4 inline mr-1" />
          Stay tuned for updates!
        </p>
      </div>
    </div>
  </ToolPageLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'auth' })

const toast = useToast()

const prompt = ref('')
const selectedStyle = ref('realistic')
const selectedSize = ref('1:1')

const navTabs = [
  { label: 'Image Generator', to: '/ai-image-generator' },
  { label: 'Background Remover', to: '/ai-background-remover' },
  { label: 'Image Enhancer', to: '/ai-image-enhancer' },
  { label: 'Image Editor', to: '/ai-image-editor' },
]

const styles = [
  { id: 'realistic', label: 'Realistic' },
  { id: 'anime', label: 'Anime' },
  { id: 'digital-art', label: 'Digital Art' },
  { id: 'oil-painting', label: 'Oil Painting' },
  { id: 'watercolor', label: 'Watercolor' },
  { id: '3d-render', label: '3D Render' },
]

const sizes = [
  { id: '1:1', label: '1:1' },
  { id: '16:9', label: '16:9' },
  { id: '9:16', label: '9:16' },
  { id: '4:3', label: '4:3' },
]

function showComingSoon() {
  toast.add({
    title: 'Coming Soon',
    description: 'AI Image Generation will be available soon!',
    color: 'info',
  })
}
</script>
