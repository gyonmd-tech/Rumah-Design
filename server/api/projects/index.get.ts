import { serverSupabaseClient } from '#supabase/server'
import type { Database, ProjectSummary } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
  let lastError: unknown

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const { data, error } = await client
        .from('projects')
        .select('id, title, slug, description, category, style_tags, tech_stack, thumbnail_url, preview_media_url')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .abortSignal(AbortSignal.timeout(10000))

      if (error) throw error

      setResponseHeader(event, 'Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
      return (data ?? []) as ProjectSummary[]
    }
    catch (error) {
      lastError = error
      if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 250))
    }
  }

  console.error('Server error in /api/projects after retry:', lastError)
  throw createError({
    statusCode: 503,
    statusMessage: 'Daftar project sementara tidak tersedia',
  })
})
