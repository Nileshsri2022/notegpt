<template>
  <header class="sticky top-0 z-50 bg-white border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2">
          <div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">N</span>
          </div>
          <span class="text-xl font-bold text-gray-900">NoteGPT</span>
        </NuxtLink>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-8">
          <div class="relative group">
            <button class="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-primary-500 transition-colors">
              Products
              <Icon name="heroicons:chevron-down" class="w-4 h-4" />
            </button>
          </div>
          <NuxtLink to="/pricing" class="text-sm font-medium text-gray-700 hover:text-primary-500 transition-colors">
            Pricing
          </NuxtLink>
        </nav>

        <!-- Right side -->
        <div class="flex items-center gap-3">
          <UButton variant="ghost" size="sm" class="hidden md:flex">
            English
            <Icon name="heroicons:chevron-down" class="w-3 h-3 ml-1" />
          </UButton>
          <UButton to="/login" color="primary" size="sm">
            Log In
          </UButton>
        </div>
      </div>
    </div>
  </header>
</template>
