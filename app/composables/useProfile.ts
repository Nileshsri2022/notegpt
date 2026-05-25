import type { Tables } from '~/types/database.types'

export const useProfile = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const profile = useState<Tables<'profiles'> | null>('profile', () => null)

  const fetchProfile = async () => {
    if (!user.value) {
      profile.value = null
      return
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .single()

    if (!error && data) {
      profile.value = data
    }
  }

  const hasQuota = computed(() => {
    if (!profile.value) return false
    if (profile.value.plan === 'unlimited') return true
    return profile.value.basic_quotas_used < profile.value.basic_quotas_limit
  })

  const hasPremiumQuota = computed(() => {
    if (!profile.value) return false
    if (profile.value.plan === 'unlimited') return true
    return profile.value.premium_credits_used < profile.value.premium_credits_limit
  })

  const remainingQuota = computed(() => {
    if (!profile.value) return 0
    if (profile.value.plan === 'unlimited') return Infinity
    return profile.value.basic_quotas_limit - profile.value.basic_quotas_used
  })

  const remainingPremiumQuota = computed(() => {
    if (!profile.value) return 0
    if (profile.value.plan === 'unlimited') return Infinity
    return profile.value.premium_credits_limit - profile.value.premium_credits_used
  })

  /**
   * Consume quota for a tool usage.
   * Returns true if quota was available and consumed, false otherwise.
   */
  const consumeQuota = async (tool: string, isPremium = false): Promise<boolean> => {
    if (!user.value || !profile.value) return false

    // Check if quota is available
    if (isPremium) {
      if (profile.value.plan !== 'unlimited' && profile.value.premium_credits_used >= profile.value.premium_credits_limit) {
        return false
      }
    } else {
      if (profile.value.plan !== 'unlimited' && profile.value.basic_quotas_used >= profile.value.basic_quotas_limit) {
        return false
      }
    }

    // Log usage
    await supabase.from('usage_logs').insert({
      user_id: user.value.id,
      tool,
      is_premium: isPremium,
    })

    // Increment usage counter
    if (isPremium) {
      await supabase
        .from('profiles')
        .update({ premium_credits_used: profile.value.premium_credits_used + 1 })
        .eq('id', user.value.id)
    } else {
      await supabase
        .from('profiles')
        .update({ basic_quotas_used: profile.value.basic_quotas_used + 1 })
        .eq('id', user.value.id)
    }

    // Refresh profile to get updated counts
    await fetchProfile()
    return true
  }

  // Legacy alias
  const useQuota = consumeQuota

  // Auto-fetch on user change
  watch(user, () => fetchProfile(), { immediate: true })

  return {
    profile,
    hasQuota,
    hasPremiumQuota,
    remainingQuota,
    remainingPremiumQuota,
    fetchProfile,
    consumeQuota,
    useQuota,
  }
}
