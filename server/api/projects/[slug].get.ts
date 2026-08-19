import { serverSupabaseClient } from '#supabase/server'
import type { Database, Project } from '~/types/database.types'
import { renderSafeMarkdown } from '../../utils/markdown'
import { fallbackProjects } from '~/utils/fallbackProjects'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw createError({ statusCode: 400, statusMessage: 'Slug tidak valid' })
  }

  try {
    const client = await serverSupabaseClient<Database>(event)
    const { data, error } = await client
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .abortSignal(AbortSignal.timeout(5000))
      .maybeSingle()

    if (data && !error) {
      const project = data as Project
      return {
        ...project,
        description_html: await renderSafeMarkdown(project.description || ''),
      }
    }
  } catch (err) {
    console.error(`Error querying database for slug "${slug}":`, err)
  }

  // Fallback to demo projects dataset
  const fallback = fallbackProjects.find((p) => p.slug === slug)
  if (fallback) {
    return {
      ...fallback,
      description_html: await renderSafeMarkdown(fallback.case_study || fallback.description || ''),
    } as unknown as Project & { description_html: string }
  }

  throw createError({ statusCode: 404, statusMessage: 'Project tidak ditemukan' })
})
