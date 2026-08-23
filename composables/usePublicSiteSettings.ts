import { DEFAULT_SITE_SETTINGS, type PublicSiteSettings } from '~/utils/site-settings'

export function usePublicSiteSettings() {
  return useState<PublicSiteSettings>(
    'public-site-settings',
    () => structuredClone(DEFAULT_SITE_SETTINGS),
  )
}
