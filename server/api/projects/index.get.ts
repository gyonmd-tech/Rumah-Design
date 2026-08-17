import { serverSupabaseClient } from '#supabase/server'
import type { Database, Project } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
  const { data, error } = await client
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .abortSignal(AbortSignal.timeout(5000))

  if (error) throw createError({ statusCode: 502, statusMessage: 'Project gagal dimuat' })
  return data as Project[]
})
