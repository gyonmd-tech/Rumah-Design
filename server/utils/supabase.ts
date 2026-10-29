import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

let client: SupabaseClient<Database> | null = null

/** Anonymous, session-less client for public reads; RLS limits it to published data. */
export function useServerSupabase() {
  if (!client) {
    const { url, key } = useRuntimeConfig().public.supabase
    client = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    })
  }
  return client
}
