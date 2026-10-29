import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

// Admin-only: imported solely by the client-rendered /admin studio, so the
// Supabase SDK stays out of public bundles (ADR-002).
let client: SupabaseClient<Database> | null = null

export function useSupabaseUser() {
  return useState<User | null>('supabase-user', () => null)
}

// The type parameter keeps existing `useSupabaseClient<Database>()` calls valid.
export function useSupabaseClient<_T = Database>(): SupabaseClient<Database> {
  if (!client) {
    const { url, key } = useRuntimeConfig().public.supabase
    client = createClient<Database>(url, key)
    const user = useSupabaseUser()
    client.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
    })
  }
  return client
}
