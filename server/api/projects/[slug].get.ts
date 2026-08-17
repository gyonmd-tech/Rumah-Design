import { serverSupabaseClient } from '#supabase/server'
import type { Database, Project } from '~/types/database.types'
import { renderSafeMarkdown } from '../../utils/markdown'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw createError({ statusCode: 400, statusMessage: 'Slug tidak valid' })
  }

  const client = await serverSupabaseClient<Database>(event)
  const { data, error } = await client
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .abortSignal(AbortSignal.timeout(5000))
    .maybeSingle()

  if (error) throw createError({ statusCode: 502, statusMessage: 'Project gagal dimuat' })
  if (!data) throw createError({ statusCode: 404, statusMessage: 'Project tidak ditemukan' })

  const project = data as Project
  return { ...project, description_html: renderSafeMarkdown(project.description) }
})
