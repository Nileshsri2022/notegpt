export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/pricing',
    '/about-us',
    '/contact-us',
    '/privacy',
    '/terms',
    '/faq',
    '/blog',
    '/free-tools',
    '/confirm',
  ]

  const isPublic = publicRoutes.some(
    route => to.path === route || to.path.startsWith(route + '/')
  )

  if (!isPublic && !user.value) {
    return navigateTo('/login')
  }
})
