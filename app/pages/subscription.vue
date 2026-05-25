<template>
  <div>
    <NuxtLayout name="dashboard">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Subscription Management</h1>

        <!-- Current Plan -->
        <div class="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Current Plan</h2>
              <p class="text-sm text-gray-500 mt-1">Manage your subscription and billing</p>
            </div>
            <span
              class="px-3 py-1 rounded-full text-sm font-bold"
              :class="planBadgeClass"
            >
              {{ currentPlanName }}
            </span>
          </div>

          <!-- Quota Usage -->
          <div class="space-y-3 mb-6">
            <div>
              <div class="flex items-center justify-between text-sm mb-1">
                <span class="text-gray-600">Basic Quotas</span>
                <span class="text-gray-900 font-medium">
                  {{ profile?.basic_quotas_used || 0 }} / {{ profile?.basic_quotas_limit || 10 }}
                </span>
              </div>
              <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-[#2E83FB] rounded-full transition-all"
                  :style="{ width: `${basicQuotaPercent}%` }"
                />
              </div>
            </div>
            <div v-if="(profile?.premium_credits_limit || 0) > 0">
              <div class="flex items-center justify-between text-sm mb-1">
                <span class="text-gray-600">Premium Credits</span>
                <span class="text-gray-900 font-medium">
                  {{ profile?.premium_credits_used || 0 }} / {{ profile?.premium_credits_limit || 0 }}
                </span>
              </div>
              <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-purple-500 rounded-full transition-all"
                  :style="{ width: `${premiumQuotaPercent}%` }"
                />
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap gap-3">
            <UButton
              v-if="currentPlan === 'free'"
              color="primary"
              to="/pricing"
            >
              Upgrade Plan
            </UButton>
            <UButton
              v-else
              color="primary"
              variant="soft"
              :loading="portalLoading"
              @click="openBillingPortal"
            >
              Manage Billing
            </UButton>
            <UButton
              v-if="currentPlan !== 'free'"
              color="neutral"
              variant="ghost"
              to="/pricing"
            >
              Change Plan
            </UButton>
          </div>
        </div>

        <!-- Plan Features -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="font-semibold text-gray-900 mb-4">Plan Features</h3>
          <ul class="space-y-2">
            <li
              v-for="feature in currentFeatures"
              :key="feature"
              class="flex items-center gap-2 text-sm text-gray-600"
            >
              <Icon name="heroicons:check-circle-solid" class="w-4 h-4 text-green-500 shrink-0" />
              {{ feature }}
            </li>
          </ul>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'auth' })

const toast = useToast()
const { profile } = useProfile()
const portalLoading = ref(false)

const currentPlan = computed(() => profile.value?.plan || 'free')

const currentPlanName = computed(() => {
  switch (currentPlan.value) {
    case 'unlimited': return 'Unlimited'
    case 'pro': return 'Pro'
    case 'basic': return 'Basic'
    default: return 'Free'
  }
})

const planBadgeClass = computed(() => {
  switch (currentPlan.value) {
    case 'unlimited': return 'bg-amber-100 text-amber-700'
    case 'pro': return 'bg-purple-100 text-purple-700'
    case 'basic': return 'bg-blue-100 text-blue-700'
    default: return 'bg-gray-100 text-gray-600'
  }
})

const basicQuotaPercent = computed(() => {
  const used = profile.value?.basic_quotas_used || 0
  const limit = profile.value?.basic_quotas_limit || 10
  return Math.min((used / limit) * 100, 100)
})

const premiumQuotaPercent = computed(() => {
  const used = profile.value?.premium_credits_used || 0
  const limit = profile.value?.premium_credits_limit || 1
  return Math.min((used / limit) * 100, 100)
})

const currentFeatures = computed(() => {
  switch (currentPlan.value) {
    case 'unlimited':
      return ['Unlimited Basic Quotas', '2,800 Premium Credits/mo', 'All AI Tools', 'Priority Support', 'Advanced Models']
    case 'pro':
      return ['1,000 Basic Quotas/mo', '100 Premium Credits/mo', 'All AI Tools', 'Standard Support', 'Voice & Image Tools']
    case 'basic':
      return ['200 Basic Quotas/mo', 'YouTube Summarizer', 'PDF Summarizer', 'AI Chat', 'Note Taking']
    default:
      return ['10 Basic Quotas/mo', 'YouTube Summarizer', 'PDF Summarizer', 'AI Chat (limited)']
  }
})

async function openBillingPortal() {
  portalLoading.value = true
  try {
    const { url } = await $fetch('/api/stripe/portal', { method: 'POST' })
    if (url) window.location.href = url
  } catch (err: any) {
    toast.add({ title: 'Error', description: err.data?.message || 'Failed to open billing portal.', color: 'error' })
  } finally {
    portalLoading.value = false
  }
}
</script>
