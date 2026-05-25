export default defineNuxtRouteMiddleware((to) => {
  const { hasQuota, profile } = useProfile()
  const toast = useToast()

  // Only check quota on tool pages
  const toolRoutes = [
    '/youtube-video-summarizer',
    '/text-to-speech',
    '/ai-chat',
  ]

  const isToolRoute = toolRoutes.some(route => to.path === route || to.path.startsWith(route + '/'))

  if (isToolRoute && profile.value && !hasQuota.value) {
    toast.add({
      title: 'Quota Exhausted',
      description: 'You have used all your free credits. Upgrade to continue.',
      color: 'warning',
    })
    return navigateTo('/pricing')
  }
})
