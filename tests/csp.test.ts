import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { buildContentSecurityPolicy, inlineScriptHashes } from '~/utils/csp'

const sha = (text: string) => `'sha256-${createHash('sha256').update(text).digest('base64')}'`

describe('inlineScriptHashes', () => {
  it('hashes executable inline scripts exactly as written', () => {
    const motion = "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js-motion')"
    const html = `<head><script>${motion}</script></head><body><script type="module">window.__NUXT__={}</script></body>`
    expect(inlineScriptHashes(html)).toEqual([sha(motion), sha('window.__NUXT__={}')])
  })

  it('skips external scripts and data blocks', () => {
    const html = [
      '<script type="module" src="/_nuxt/entry.js" crossorigin></script>',
      '<script type="application/ld+json">{"@type":"Person"}</script>',
      '<script type="application/json" id="__NUXT_DATA__" data-ssr="true">[1]</script>',
    ].join('')
    expect(inlineScriptHashes(html)).toEqual([])
  })

  it('de-duplicates identical scripts', () => {
    expect(inlineScriptHashes('<script>a()</script><script>a()</script>')).toHaveLength(1)
  })
})

describe('buildContentSecurityPolicy', () => {
  it('never allows unsafe-inline or unsafe-eval scripts', () => {
    const csp = buildContentSecurityPolicy({ scriptHashes: [sha('a()')] })
    const scriptSrc = csp.split('; ').find(d => d.startsWith('script-src '))
    expect(scriptSrc).toBe(`script-src 'self' ${sha('a()')}`)
    expect(csp).not.toMatch(/script-src[^;]*unsafe/)
    expect(csp).toContain("script-src-attr 'none'")
    expect(csp).toContain("frame-ancestors 'none'")
  })

  it('allows the Supabase origins for connect-src', () => {
    const csp = buildContentSecurityPolicy({ supabaseUrl: 'https://abc.supabase.co' })
    expect(csp).toContain("connect-src 'self' https://abc.supabase.co wss://abc.supabase.co")
  })

  it('tolerates a missing Supabase URL and upgrades requests only on https sites', () => {
    expect(buildContentSecurityPolicy({ siteUrl: 'http://localhost:3000' })).toContain("connect-src 'self'")
    expect(buildContentSecurityPolicy({ siteUrl: 'http://localhost:3000' })).not.toContain('upgrade-insecure-requests')
    expect(buildContentSecurityPolicy({ siteUrl: 'https://hygionedarriyan.vercel.app' })).toContain('upgrade-insecure-requests')
  })
})
