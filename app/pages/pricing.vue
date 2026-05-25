<template>
  <div class="py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-bold text-center text-gray-900 mb-4">Pricing Plans</h1>
      <p class="text-center text-gray-600 mb-10">One-time payment, no auto-renew. 24-hour refund policy.</p>

      <!-- Plan Tabs -->
      <div class="flex justify-center gap-2 mb-12">
        <button
          v-for="tab in billingTabs"
          :key="tab.id"
          class="px-5 py-2 rounded-full text-sm font-medium transition-colors"
          :class="activeBilling === tab.id
            ? 'bg-primary-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          @click="activeBilling = tab.id"
        >
          {{ tab.label }}
          <span v-if="tab.badge" class="ml-1 text-xs opacity-80">{{ tab.badge }}</span>
        </button>
      </div>

      <!-- Plans Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div
          v-for="plan in currentPlans"
          :key="plan.name"
          class="relative bg-white rounded-2xl p-8 border-2 transition-all"
          :class="plan.popular ? 'border-primary-500 shadow-xl' : 'border-gray-100 hover:border-gray-200'"
        >
          <!-- Popular badge -->
          <div v-if="plan.popular" class="absolute -top-3 left-1/2 -translate-x-1/2">
            <span class="bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              MOST POPULAR
            </span>
          </div>

          <!-- Save badge -->
          <div v-if="plan.save" class="mb-3">
            <span class="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
              Save {{ plan.save }}
            </span>
          </div>

          <h3 class="text-xl font-bold text-gray-900">{{ plan.name }}</h3>
          <div class="mt-4 mb-6">
            <span class="text-4xl font-bold text-gray-900">${{ plan.price }}</span>
            <span class="text-gray-500">/{{ activeBilling === 'annually' ? 'yr' : 'mo' }}</span>
            <div v-if="plan.monthlyEquiv && activeBilling === 'annually'" class="text-sm text-gray-500 mt-1">
              ${{ plan.monthlyEquiv }}/mo
            </div>
          </div>

          <UButton
            :color="plan.popular ? 'primary' : 'neutral'"
            variant="solid"
            block
            size="lg"
            class="mb-6"
          >
            Get {{ plan.name }}
          </UButton>

          <div class="space-y-3">
            <div class="text-sm font-medium text-gray-900 mb-2">Includes:</div>
            <div
              v-for="feature in plan.features"
              :key="feature"
              class="flex items-start gap-2 text-sm text-gray-600"
            >
              <Icon name="heroicons:check-circle-solid" class="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              <span>{{ feature }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div class="text-center mt-12 space-y-2">
        <p class="text-sm text-gray-500">✓ One-time payment, no auto-renewal</p>
        <p class="text-sm text-gray-500">✓ 24-hour refund guarantee</p>
        <p class="text-sm text-gray-500">✓ Cancel anytime</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const activeBilling = ref('annually')

const billingTabs = [
  { id: 'annually', label: 'Annually', badge: 'Save 50%' },
  { id: 'monthly', label: 'Monthly', badge: '' },
  { id: 'education', label: 'Education', badge: '' },
  { id: 'team', label: 'SaveTogether', badge: '' },
]

const plansByBilling: Record<string, Array<any>> = {
  annually: [
    {
      name: 'Basic',
      price: '25',
      monthlyEquiv: '2.08',
      save: '30%',
      popular: false,
      features: ['200 Basic Quotas/month', '0 Premium Credits', 'YouTube Summarizer', 'PDF Summarizer', 'AI Chat', 'Note Taking & Folders'],
    },
    {
      name: 'Unlimited',
      price: '174',
      monthlyEquiv: '14.5',
      save: '50%',
      popular: true,
      features: ['Unlimited Basic Quotas', '2,800 Premium Credits/month', 'All AI Tools Access', 'Advanced AI Models', 'Priority Support', 'Voice & Image Generation'],
    },
    {
      name: 'Pro',
      price: '108',
      monthlyEquiv: '9',
      save: '10%',
      popular: false,
      features: ['1,000 Basic Quotas/month', '100 Premium Credits/month', 'All AI Tools Access', 'Standard AI Models', 'Standard Support', 'Voice & Image Tools'],
    },
  ],
  monthly: [
    {
      name: 'Basic',
      price: '2.99',
      save: null,
      popular: false,
      features: ['200 Basic Quotas/month', '0 Premium Credits', 'YouTube Summarizer', 'PDF Summarizer', 'AI Chat', 'Note Taking & Folders'],
    },
    {
      name: 'Unlimited',
      price: '29',
      save: null,
      popular: true,
      features: ['Unlimited Basic Quotas', '2,800 Premium Credits/month', 'All AI Tools Access', 'Advanced AI Models', 'Priority Support', 'Voice & Image Generation'],
    },
    {
      name: 'Pro',
      price: '9.99',
      save: null,
      popular: false,
      features: ['1,000 Basic Quotas/month', '100 Premium Credits/month', 'All AI Tools Access', 'Standard AI Models', 'Standard Support', 'Voice & Image Tools'],
    },
  ],
  education: [
    {
      name: 'Student',
      price: '15',
      monthlyEquiv: '1.25',
      save: '60%',
      popular: false,
      features: ['500 Basic Quotas/month', '50 Premium Credits', 'All Summarizers', 'AI Study Tools', 'Flashcards & Quizzes'],
    },
    {
      name: 'School',
      price: '99',
      monthlyEquiv: '8.25',
      save: '50%',
      popular: true,
      features: ['Unlimited Basic Quotas', '1,000 Premium Credits/month', 'All AI Tools', 'Admin Dashboard', 'Bulk Licensing', 'Priority Support'],
    },
    {
      name: 'Teacher',
      price: '49',
      monthlyEquiv: '4.08',
      save: '40%',
      popular: false,
      features: ['1,000 Basic Quotas/month', '200 Premium Credits', 'Quiz & Flashcard Generator', 'Presentation Maker', 'Grading Tools'],
    },
  ],
  team: [
    {
      name: '3 People',
      price: '45',
      monthlyEquiv: '3.75',
      save: '40%',
      popular: false,
      features: ['600 Basic Quotas/month each', '100 Premium Credits each', 'Shared workspace', 'All AI Tools'],
    },
    {
      name: '5 People',
      price: '65',
      monthlyEquiv: '5.42',
      save: '55%',
      popular: true,
      features: ['1,000 Basic Quotas/month each', '200 Premium Credits each', 'Shared workspace', 'All AI Tools', 'Team admin'],
    },
    {
      name: '10 People',
      price: '110',
      monthlyEquiv: '9.17',
      save: '60%',
      popular: false,
      features: ['Unlimited Basic Quotas each', '500 Premium Credits each', 'Shared workspace', 'All AI Tools', 'Team admin', 'Priority Support'],
    },
  ],
}

const currentPlans = computed(() => plansByBilling[activeBilling.value] || plansByBilling.annually)
</script>
