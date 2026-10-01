import assert from 'node:assert/strict'
const origin = process.env.SEO_CANONICAL_ORIGIN || 'https://hygionedarriyan.vercel.app'
const oldOrigin = process.env.SEO_OLD_ORIGIN || 'https://rumah-design.vercel.app'
const fetchOrigin = process.env.SEO_TEST_ORIGIN || origin
async function get(path) {
  const response = await fetch(fetchOrigin + path, { signal: AbortSignal.timeout(45000) })
  return { response, body: await response.text() }
}
function attribute(tag, name) { return tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1] }
const { response: api, body: data } = await get('/api/projects')
assert.equal(api.status, 200)
const projects = JSON.parse(data)
assert.ok(projects.length > 0)
const paths = ['/', '/about', '/contact', '/layanan', '/proses', '/layanan/ui-ux-design', '/layanan/frontend-development', '/layanan/fullstack-development', ...projects.map(p => '/project/' + p.slug)]
for (const path of paths) {
  const { response, body } = await get(path)
  assert.equal(response.status, 200, path)
  const canonical = [...body.matchAll(/<link\b[^>]*>/g)].map(m => m[0]).filter(t => attribute(t, 'rel') === 'canonical')
  assert.equal(canonical.length, 1, path)
  assert.equal(attribute(canonical[0], 'href'), origin + path, path + ' canonical origin')
  assert.ok(!body.includes(oldOrigin), path + ' must not reference old origin')
  const tags = [...body.matchAll(/<meta\b[^>]*>/g)].map(m => m[0])
  const ogUrl = tags.find(t => attribute(t, 'property') === 'og:url')
  assert.equal(attribute(ogUrl || '', 'content'), origin + path, path + ' og:url')
  for (const script of body.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) JSON.parse(script[1])
  console.log('SEO', path, 'OK')
}
const { body: sitemap } = await get('/sitemap.xml')
assert.ok(!sitemap.includes(oldOrigin))
for (const path of paths) assert.ok(sitemap.includes(`<loc>${origin}${path}</loc>`), path + ' sitemap origin')
const { body: robots } = await get('/robots.txt')
assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`))
assert.ok(!robots.includes(oldOrigin))
for (const path of [...paths, '/robots.txt', '/sitemap.xml', '/og-image.png', '/admin/login', '/layanan/ui-ux-design?ref=domain-check']) {
  const response = await fetch(oldOrigin + path, { redirect: 'manual', signal: AbortSignal.timeout(30000) })
  assert.ok([301, 308].includes(response.status), path + ' permanent redirect: ' + response.status)
  assert.equal(response.headers.get('location'), origin + path, path + ' path/query preserved')
}
const { response: image } = await get('/og-image.png')
assert.equal(image.status, 200)
assert.match(image.headers.get('content-type'), /^image\//)
console.log(`Domain migration passed: ${paths.length} pages, ${projects.length} published projects, canonical/OG/JSON-LD/sitemap/robots and permanent redirects.`)
