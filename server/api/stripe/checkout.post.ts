import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
import { useStripe, PLANS, type PlanId } from '../../utils/stripe'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { planId, interval = 'monthly' } = body as { planId: PlanId; interval?: 'monthly' | 'yearly' }

  if (!planId || !PLANS[planId]) {
    throw createError({ statusCode: 400, message: 'Invalid plan' })
  }

  const stripe = useStripe()
  const plan = PLANS[planId]

  // Get or create Stripe customer
  const supabase = await serverSupabaseClient(event)
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  let customerId = profile?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id

    // Save customer ID to profile
    await supabase
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id)
  }

  // Calculate price (30% off for yearly)
  const unitAmount = interval === 'yearly'
    ? Math.round(plan.priceMonthly * 12 * 0.7) // 30% off yearly
    : plan.priceMonthly

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `NoteGPT ${plan.name} Plan`,
            description: plan.features.join(', '),
          },
          unit_amount: unitAmount,
          recurring: {
            interval: interval === 'yearly' ? 'year' : 'month',
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      supabase_user_id: user.id,
      plan_id: planId,
    },
    success_url: `${getRequestURL(event).origin}/pricing?success=true`,
    cancel_url: `${getRequestURL(event).origin}/pricing?canceled=true`,
    allow_promotion_codes: true,
  })

  return { url: session.url }
})
