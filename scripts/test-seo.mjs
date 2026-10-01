import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import ts from 'typescript'

async function loadTs(path) {
  const code = ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText
  return import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'))
}
const { serializeJsonLd } = await loadTs('../utils/structured-data.ts')
const payload = { name: '</script><script>alert(1)</script>', description: 'UI & UX > mockup' }
const json = serializeJsonLd(payload)
assert.ok(!json.includes('<'))
assert.deepEqual(JSON.parse(json), payload)

const { mergeSiteSettings } = await loadTs('../utils/site-settings.ts')
const merged = mergeSiteSettings([
  { key: 'general', value: { site_name: 'Rumah Design', contact_email: 'hello@rumahdesign.dev' } },
  { key: 'seo', value: { default_title: 'Rumah Design — Portofolio & Case Study Frontend', indexing: false } },
  { key: 'socials', value: { github: 'https://github.com', linkedin: 'https://linkedin.com/in/example', twitter: 'https://' } },
])
assert.equal(merged.general.site_name, 'Hygione Darriyan')
assert.equal(merged.general.contact_email, 'paroarro07@gmail.com')
assert.equal(merged.seo.indexing, false)
assert.equal(merged.socials.github, '')
assert.equal(merged.socials.twitter, '')
assert.equal(merged.socials.linkedin, 'https://linkedin.com/in/example')
const custom = mergeSiteSettings([{ key: 'seo', value: { default_title: 'My custom title' } }])
assert.equal(custom.seo.default_title, 'My custom title')

const { analyzeSeoQuality, stripMarkdown } = await loadTs('../utils/seo.ts')
assert.equal(analyzeSeoQuality({ title: 'Example', slug: 'example', seoTitle: 'Custom title' }).serpTitle, 'Custom title')
assert.equal(analyzeSeoQuality({ title: 'Example', slug: 'example' }).serpTitle, 'Example — Hygione Darriyan')
assert.equal(stripMarkdown('## Title\n[Demo](https://example.com) ![image](https://example.com/image.png)'), 'Title Demo')
const validEnv = { ...process.env, VERCEL: '1', VERCEL_ENV: 'production', SUPABASE_URL: 'https://example.supabase.co', SUPABASE_KEY: 'public-placeholder-key-for-validation', NUXT_PUBLIC_SITE_URL: 'https://example.com' }
for (const [url, expected] of [['', 1], ['http://localhost:3000', 1], ['https://example.com/path', 1], ['https://example.com', 0]]) {
  const result = spawnSync(process.execPath, ['scripts/check-deploy-env.mjs'], { env: { ...validEnv, NUXT_PUBLIC_SITE_URL: url }, encoding: 'utf8' })
  assert.equal(result.status, expected, result.stdout + result.stderr)
}
console.log('SEO regression checks passed: JSON-LD escaping, legacy settings, indexing preference, custom metadata, markdown, production environment guard.')

