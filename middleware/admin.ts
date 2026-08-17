import type { Database } from '~/types/database.types'

export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()
  if (!user.value) {
    return navigateTo(`/admin/login?next=${encodeURIComponent(to.fullPath)}`)
  }

  const client = useSupabaseClient<Database>()
  const { data, error } = await client.rpc('is_admin')
  if (error || !data) {
    await client.auth.signOut()
    return navigateTo('/admin/login?error=forbidden')
  }
})
