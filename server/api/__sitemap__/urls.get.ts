import { SERVICES } from '~/utils/portfolio-content'
import type { Database } from '~/types/database.types'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
  const { data, error } = await client
    .from('projects')
    .select('slug, updated_at, thumbnail_url')
    .eq('status', 'published')
    .abortSignal(AbortSignal.timeout(10000))

  if (error) throw createError({ statusCode: 500, statusMessage: 'Sitemap gagal dibuat' })

  return [
    { loc: '/', changefreq: 'weekly', priority: 1 },
    { loc: '/karya', changefreq: 'weekly', priority: 0.9 },
    { loc: '/about', changefreq: 'monthly', priority: 0.8 },
    { loc: '/contact', changefreq: 'monthly', priority: 0.8 },
    { loc: '/layanan', changefreq: 'monthly', priority: 0.8 },
    { loc: '/proses', changefreq: 'monthly', priority: 0.7 },
    ...SERVICES.map(service => ({ loc: '/layanan/' + service.slug, changefreq: 'monthly', priority: 0.8 })),
    ...(data ?? []).map(project => ({
      loc: `/project/${project.slug}`,
      lastmod: project.updated_at,
      images: project.thumbnail_url ? [{ loc: project.thumbnail_url }] : [],
      changefreq: 'monthly',
      priority: 0.8,
    })),
  ]
})
