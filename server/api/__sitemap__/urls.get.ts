import type { Database } from '~/types/database.types'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
  const { data, error } = await client
    .from('projects')
    .select('slug, updated_at')
    .eq('status', 'published')
    .abortSignal(AbortSignal.timeout(5000))

  if (error) throw createError({ statusCode: 500, statusMessage: 'Sitemap gagal dibuat' })

  return [
    { loc: '/', changefreq: 'weekly', priority: 1 },
    { loc: '/about', changefreq: 'monthly', priority: 0.6 },
    ...(data ?? []).map(project => ({
      loc: `/project/${project.slug}`,
      lastmod: project.updated_at,
      changefreq: 'monthly',
      priority: 0.8,
    })),
  ]
})
