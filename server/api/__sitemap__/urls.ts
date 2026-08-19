import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient<Database>(event)
    const { data } = await client
      .from('projects')
      .select('slug, updated_at')
      .eq('status', 'published')
    
    if (!data) return []
    
    return data.map(project => ({
      loc: `/project/${project.slug}`,
      lastmod: project.updated_at,
    }))
  } catch (error) {
    console.error('Error generating sitemap urls:', error)
    return []
  }
})
