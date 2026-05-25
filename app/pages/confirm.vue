<template>
  <div class="min-h-[80vh] flex items-center justify-center">
    <div class="text-center">
      <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name="heroicons:check" class="w-6 h-6 text-primary-500" />
      </div>
      <p class="text-gray-600">Confirming your account...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

// Supabase handles the token exchange automatically via the module
// Just redirect to dashboard after a short delay
onMounted(() => {
  setTimeout(() => {
    router.push('/dashboard')
  }, 1000)
})
</script>
