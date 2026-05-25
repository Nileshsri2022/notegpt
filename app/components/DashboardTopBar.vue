<template>
  <header class="flex items-center justify-between h-14 px-4 border-b border-gray-100 bg-white">
    <div class="flex items-center gap-3">
      <!-- Mobile menu button -->
      <button class="lg:hidden text-gray-500 hover:text-gray-700">
        <Icon name="heroicons:bars-3" class="w-6 h-6" />
      </button>
    </div>

    <div class="flex items-center gap-3">
      <UButton variant="ghost" size="sm" icon="i-heroicons-cog-6-tooth" />
      <div class="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
        <span class="text-white text-sm font-medium">U</span>
      </div>
    </div>
  </header>
</template>
