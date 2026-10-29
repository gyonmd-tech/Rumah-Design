import { describe, expect, it } from 'vitest'
import { renderSafeMarkdown } from '~/utils/markdown'

// renderSafeMarkdown output is injected with v-html on public project pages,
// so these cases guard the XSS boundary.
describe('renderSafeMarkdown', () => {
  it('returns an empty string for empty input', async () => {
    expect(await renderSafeMarkdown('')).toBe('')
    expect(await renderSafeMarkdown(null)).toBe('')
  })

  it('renders allowed markdown', async () => {
    const html = await renderSafeMarkdown('## Proses\n\n**Tebal** dan *miring*\n\n- satu\n- dua')
    expect(html).toContain('<h2>Proses</h2>')
    expect(html).toContain('<strong>Tebal</strong>')
    expect(html).toContain('<em>miring</em>')
    expect(html).toContain('<li>satu</li>')
  })

  it('removes script and style elements with their content', async () => {
    const html = await renderSafeMarkdown('Halo\n\n<script>alert(1)</script>\n\n<style>body{display:none}</style>')
    expect(html).not.toMatch(/<script|alert\(1\)|<style|display:none/)
    expect(html).toContain('Halo')
  })

  it('strips event handler attributes', async () => {
    const html = await renderSafeMarkdown('<img src="https://example.com/a.png" onerror="alert(1)">\n\n<p onclick="alert(2)">teks</p>')
    expect(html).not.toMatch(/onerror|onclick|alert/)
    expect(html).toContain('src="https://example.com/a.png"')
  })

  it('drops javascript: and data: URLs', async () => {
    const html = await renderSafeMarkdown('[klik](javascript:alert(1))\n\n<a href="JaVaScRiPt:alert(2)">x</a>\n\n<img src="data:image/svg+xml;base64,PHN2Zz4=">')
    expect(html).not.toMatch(/javascript:|data:image/i)
  })

  it('removes embeds and elements outside the allowlist', async () => {
    const html = await renderSafeMarkdown('<iframe src="https://evil.example"></iframe><svg onload="alert(1)"></svg><form action="/x"><input></form>\n\n# Judul')
    expect(html).not.toMatch(/<iframe|<svg|<form|<input|<h1|onload/)
  })

  it('hardens links to open in a new tab without opener access', async () => {
    const html = await renderSafeMarkdown('[demo](https://example.com)')
    expect(html).toContain('href="https://example.com"')
    expect(html).toContain('target="_blank"')
    expect(html).toContain('rel="noopener noreferrer"')
  })

  it('lazy-loads images', async () => {
    const html = await renderSafeMarkdown('![shot](https://example.com/shot.png)')
    expect(html).toContain('loading="lazy"')
    expect(html).toContain('decoding="async"')
  })
})
