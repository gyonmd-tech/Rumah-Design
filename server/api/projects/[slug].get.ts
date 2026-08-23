import { serverSupabaseClient } from '#supabase/server'
import type { Database, Project } from '~/types/database.types'
import { renderSafeMarkdown } from '../../utils/markdown'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw createError({ statusCode: 400, statusMessage: 'Slug tidak valid' })
  }

  const client = await serverSupabaseClient<Database>(event)
  let lastError: unknown

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const { data, error } = await client
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .abortSignal(AbortSignal.timeout(10000))
        .maybeSingle()

      if (error) throw error
      if (!data) {
        throw createError({ statusCode: 404, statusMessage: 'Project tidak ditemukan' })
      }

      const project = data as Project
      setResponseHeader(event, 'Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
      return {
        ...project,
        description_html: await renderSafeMarkdown(project.description || ''),
      }
    }
    catch (error) {
      if (isError(error) && error.statusCode === 404) throw error
      lastError = error
      if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 250))
    }
  }

  console.error(`Error querying database for slug "${slug}" after retry:`, lastError)
  throw createError({
    statusCode: 503,
    statusMessage: 'Detail project sementara tidak tersedia',
  })
})
