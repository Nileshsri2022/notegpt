import { useStripe, PLANS, type PlanId } from '../../utils/stripe'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const stripe = useStripe()

  // Get raw body for signature verification
  const body = await readRawBody(event)
  if (!body) {
    throw createError({ statusCode: 400, message: 'No body' })
  }

  const signature = getHeader(event, 'stripe-signature')

  let stripeEvent
  try {
    if (config.stripeWebhookSecret && signature) {
      stripeEvent = stripe.webhooks.constructEvent(body, signature, config.stripeWebhookSecret)
    } else {
      // In development without webhook secret, parse directly
      stripeEvent = JSON.parse(body)
    }
  } catch (err: any) {
    throw createError({ statusCode: 400, message: `Webhook Error: ${err.message}` })
  }

  // Create admin Supabase client for webhook operations
  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceRoleKey as string
  )

  switch (stripeEvent.type) {
    case 'checkout.session.completed': {
      const session = stripeEvent.data.object
      const userId = session.metadata?.supabase_user_id
      const planId = session.metadata?.plan_id as PlanId

      if (userId && planId && PLANS[planId]) {
        const plan = PLANS[planId]
        await supabase
          .from('profiles')
          .update({
            plan: planId,
            basic_quotas_limit: plan.basicQuotas,
            premium_credits_limit: plan.premiumCredits,
            basic_quotas_used: 0,
            premium_credits_used: 0,
            stripe_subscription_id: session.subscription,
          })
          .eq('id', userId)

        // Log subscription
        await supabase.from('subscriptions').insert({
          user_id: userId,
          stripe_subscription_id: session.subscription,
          stripe_customer_id: session.customer,
          plan: planId,
          status: 'active',
          current_period_start: new Date().toISOString(),
        })
      }
      break
    }

    case 'customer.subscription.updated': {
      const subscription = stripeEvent.data.object
      const customerId = subscription.customer

      // Find user by customer ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (profile) {
        const status = subscription.status === 'active' ? 'active' : subscription.status
        await supabase
          .from('subscriptions')
          .update({ status })
          .eq('stripe_subscription_id', subscription.id)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = stripeEvent.data.object
      const customerId = subscription.customer

      // Find user and downgrade to free
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (profile) {
        await supabase
          .from('profiles')
          .update({
            plan: 'free',
            basic_quotas_limit: 10,
            premium_credits_limit: 0,
            basic_quotas_used: 0,
            premium_credits_used: 0,
            stripe_subscription_id: null,
          })
          .eq('id', profile.id)

        await supabase
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', subscription.id)
      }
      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = stripeEvent.data.object
      const customerId = invoice.customer

      // Reset quotas on successful renewal
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, plan')
        .eq('stripe_customer_id', customerId)
        .single()

      if (profile && profile.plan !== 'free') {
        await supabase
          .from('profiles')
          .update({
            basic_quotas_used: 0,
            premium_credits_used: 0,
          })
          .eq('id', profile.id)
      }
      break
    }
  }

  return { received: true }
})
