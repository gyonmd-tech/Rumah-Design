import { createHash } from 'node:crypto'

// Server/build-time only (imported by nuxt.config.ts and server/plugins/csp.ts).

export interface CspOptions {
  /** Supabase project URL; its https and wss origins are allowed for connect-src. */
  supabaseUrl?: string
  /** Site origin; https sites also get upgrade-insecure-requests. */
  siteUrl?: string
  /** CSP source expressions ('sha256-…') for the page's inline scripts. */
  scriptHashes?: string[]
}

export function buildContentSecurityPolicy({ supabaseUrl, siteUrl, scriptHashes = [] }: CspOptions = {}) {
  let supabaseOrigins: string[] = []
  try {
    const origin = new URL(supabaseUrl || '').origin
    if (origin !== 'null') supabaseOrigins = [origin, origin.replace(/^https:/, 'wss:')]
  }
  catch {
    // No Supabase URL configured: connect-src stays 'self'.
  }

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    ['script-src', "'self'", ...scriptHashes].join(' '),
    "script-src-attr 'none'",
    // Studio fonts still come from Fontshare and Google (composables/useAdminFonts.ts).
    "style-src 'self' 'unsafe-inline' https://api.fontshare.com https://fonts.googleapis.com",
    "font-src 'self' data: https://cdn.fontshare.com https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "media-src 'self' blob: https:",
    ['connect-src', "'self'", ...supabaseOrigins].join(' '),
    ...(siteUrl?.startsWith('https://') ? ['upgrade-insecure-requests'] : []),
  ].join('; ')
}

const SCRIPT_RE = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi
const EXECUTABLE_TYPES = new Set(['', 'module', 'text/javascript', 'application/javascript'])

/**
 * Hashes every inline script the browser would execute. Data blocks such as
 * JSON-LD and Nuxt's payload (type="application/json") are not subject to
 * script-src, and external scripts are covered by 'self'.
 */
export function inlineScriptHashes(html: string) {
  const hashes = new Set<string>()
  for (const [, attrs, content] of html.matchAll(SCRIPT_RE)) {
    if (/\ssrc\s*=/i.test(` ${attrs}`)) continue
    const type = attrs.match(/\btype\s*=\s*["']?([^"'\s>]*)/i)?.[1]?.toLowerCase() ?? ''
    if (!EXECUTABLE_TYPES.has(type)) continue
    hashes.add(`'sha256-${createHash('sha256').update(content, 'utf8').digest('base64')}'`)
  }
  return [...hashes]
}
