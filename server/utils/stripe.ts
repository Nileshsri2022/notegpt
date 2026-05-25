import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function useStripe(): Stripe {
  if (!_stripe) {
    const config = useRuntimeConfig()
    if (!config.stripeSecretKey) {
      throw new Error('NUXT_STRIPE_SECRET_KEY is not configured')
    }
    _stripe = new Stripe(config.stripeSecretKey)
  }
  return _stripe
}

// Plan configuration
export const PLANS = {
  basic: {
    name: 'Basic',
    priceMonthly: 249, // cents ($2.49/mo)
    basicQuotas: 200,
    premiumCredits: 0,
    features: ['200 Basic Quotas/mo', 'YouTube Summarizer', 'PDF Summarizer', 'AI Chat', 'Note Taking'],
  },
  pro: {
    name: 'Pro',
    priceMonthly: 900, // cents ($9/mo)
    basicQuotas: 1000,
    premiumCredits: 100,
    features: ['1,000 Basic Quotas/mo', '100 Premium Credits/mo', 'All AI Tools', 'Standard Support', 'Voice & Image Tools'],
  },
  unlimited: {
    name: 'Unlimited',
    priceMonthly: 1450, // cents ($14.50/mo)
    basicQuotas: 999999,
    premiumCredits: 2800,
    features: ['Unlimited Basic Quotas', '2,800 Premium Credits/mo', 'All AI Tools', 'Priority Support', 'Advanced Models'],
  },
} as const

export type PlanId = keyof typeof PLANS
