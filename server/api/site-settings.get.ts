import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/database.types'
import { DEFAULT_SITE_SETTINGS, mergeSiteSettings } from '~/utils/site-settings'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient<Database>(event)
    const { data, error } = await client
      .from('site_settings')
      .select('key, value')
      .in('key', ['general', 'seo', 'socials'])
      .abortSignal(AbortSignal.timeout(10000))

    if (error) throw error

    setResponseHeader(event, 'Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600')
    return mergeSiteSettings(data ?? [])
  }
  catch (error) {
    console.error('Unable to load public site settings:', error)
    return DEFAULT_SITE_SETTINGS
  }
})
