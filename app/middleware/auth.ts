export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  if (!user.value) {
    return navigateTo('/login', {
      redirectCode: 302,
      replace: true,
    })
  }
})
