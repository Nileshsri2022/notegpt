<template>
  <div class="min-h-[80vh] flex items-center justify-center py-12">
    <div class="w-full max-w-md mx-auto px-4">
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span class="text-white font-bold text-lg">N</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">Create Your Account</h1>
          <p class="text-sm text-gray-500 mt-2">Start learning smarter with AI</p>
        </div>

        <!-- Error message -->
        <div v-if="errorMsg" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {{ errorMsg }}
        </div>

        <!-- Success message -->
        <div v-if="successMsg" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
          {{ successMsg }}
        </div>

        <!-- Google OAuth -->
        <UButton
          block
          size="lg"
          variant="outline"
          class="mb-4"
          @click="signUpWithGoogle"
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
        <form @submit.prevent="signUpWithEmail" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <UInput v-model="fullName" type="text" placeholder="John Doe" size="lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <UInput v-model="email" type="email" placeholder="you@example.com" size="lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <UInput v-model="password" type="password" placeholder="••••••••" size="lg" />
          </div>
          <UButton type="submit" color="primary" block size="lg" :loading="loading">
            Create Account
          </UButton>
        </form>

        <p class="text-center text-sm text-gray-500 mt-6">
          Already have an account?
          <NuxtLink to="/login" class="text-primary-500 font-medium hover:underline">Sign in</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()

const fullName = ref('')
const email = ref('')
const password = ref('')
const errorMsg = ref('')
const successMsg = ref('')
const loading = ref(false)

const signUpWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/confirm`,
    },
  })
  if (error) errorMsg.value = error.message
}

const signUpWithEmail = async () => {
  if (!email.value || !password.value || !fullName.value) {
    errorMsg.value = 'Please fill in all fields'
    return
  }
  loading.value = true
  errorMsg.value = ''
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: { full_name: fullName.value },
    },
  })
  if (error) {
    errorMsg.value = error.message
  } else {
    successMsg.value = 'Check your email for a confirmation link!'
  }
  loading.value = false
}
</script>
