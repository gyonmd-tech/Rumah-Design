export default defineNuxtRouteMiddleware(async (to) => {
  const client = useSupabaseClient()
  const { data: { session } } = await client.auth.getSession()
  if (!session) {
    return navigateTo(`/admin/login?next=${encodeURIComponent(to.fullPath)}`)
  }
  useSupabaseUser().value = session.user

  const { data, error } = await client.rpc('is_admin')
  if (error || !data) {
    await client.auth.signOut()
    return navigateTo('/admin/login?error=forbidden')
  }
})
