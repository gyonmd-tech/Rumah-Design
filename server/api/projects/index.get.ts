import { serverSupabaseClient } from '#supabase/server'
import type { Database, Project } from '~/types/database.types'
import { fallbackProjects } from '~/utils/fallbackProjects'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient<Database>(event)
    const { data, error } = await client
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .abortSignal(AbortSignal.timeout(5000))

    if (error || !data || data.length === 0) {
      return fallbackProjects as unknown as Project[]
    }
    return data as Project[]
  } catch (err) {
    console.error('Server error in /api/projects, using fallback:', err)
    return fallbackProjects as unknown as Project[]
  }
})
