import { buildContentSecurityPolicy, inlineScriptHashes } from '~/utils/csp'

/**
 * Replaces the route-rule CSP on rendered HTML with one that allows exactly the
 * page's inline scripts by hash, so 'unsafe-inline' is not needed (ADR-005).
 * Hashes instead of nonces because public pages are cached by ISR: the header
 * is computed from the same HTML that gets cached with it.
 */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:response', (response) => {
    if (typeof response.body !== 'string') return
    const config = useRuntimeConfig()
    response.headers = {
      ...response.headers,
      'content-security-policy': buildContentSecurityPolicy({
        supabaseUrl: config.public.supabase.url,
        siteUrl: config.public.siteUrl,
        scriptHashes: inlineScriptHashes(response.body),
      }),
    }
  })
})
