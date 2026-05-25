<template>
  <div class="min-h-[80vh] flex items-center justify-center py-12">
    <div class="w-full max-w-md mx-auto px-4">
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span class="text-white font-bold text-lg">N</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">Welcome to NoteGPT</h1>
          <p class="text-sm text-gray-500 mt-2">Sign in to access your AI learning tools</p>
        </div>

        <!-- Google OAuth -->
        <UButton
          block
          size="lg"
          variant="outline"
          class="mb-4"
          @click="signInWithGoogle"
        >
          <Icon name="simple-icons:google" class="w-5 h-5 mr-2" />
          Continue with Google
        </UButton>

        <!-- Divider -->
        <div class="flex items-center gap-3 my-6">
          <div class="flex-1 h-px bg-gray-200"></div>
          <span class="text-xs text-gray-400">or</span>
          <div class="flex-1 h-px bg-gray-200"></div>
        </div>

        <!-- Email form -->
        <form @submit.prevent="signInWithEmail" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <UInput v-model="email" type="email" placeholder="you@example.com" size="lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <UInput v-model="password" type="password" placeholder="••••••••" size="lg" />
          </div>
          <UButton type="submit" color="primary" block size="lg">
            Sign In
          </UButton>
        </form>

        <p class="text-center text-sm text-gray-500 mt-6">
          Don't have an account?
          <NuxtLink to="/signup" class="text-primary-500 font-medium hover:underline">Sign up</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const email = ref('')
const password = ref('')

const signInWithGoogle = () => {
  // TODO: Implement Supabase Google OAuth
  console.log('Google sign in')
}

const signInWithEmail = () => {
  // TODO: Implement Supabase email auth
  console.log('Email sign in', email.value)
}
</script>
