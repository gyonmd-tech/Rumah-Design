import assert from 'node:assert/strict'
const base = process.env.SEO_TEST_ORIGIN || 'http://127.0.0.1:3100'
async function get(path) {
  const response = await fetch(base + path, { signal: AbortSignal.timeout(45000), headers: { Accept: 'text/html' } })
  return { response, body: await response.text() }
}
const publicPaths = ['/', '/about', '/contact', '/layanan', '/proses', '/layanan/ui-ux-design', '/layanan/frontend-development', '/layanan/fullstack-development']
const titles = new Set()
for (const path of publicPaths) {
  const { response, body } = await get(path)
  assert.equal(response.status, 200, path)
  const title = body.match(/<title>(.*?)<\/title>/s)?.[1]
  assert.ok(title && !titles.has(title), path + ' unique title')
  titles.add(title)
  if (path.startsWith('/layanan/')) assert.ok(body.includes('Service') && body.includes('Hasil kerja yang dapat dibahas'), path)
  assert.ok(body.includes('Hygione Darriyan'), path)
  assert.equal((body.match(/rel="canonical"/g) || []).length, 1, path + ' canonical count')
  assert.ok(!body.includes('hello@rumahdesign.dev'), path)
  assert.ok(!body.includes('6281234567890'), path)
  const scripts = [...body.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
  assert.ok(scripts.length > 0, path + ' structured data')
  for (const script of scripts) JSON.parse(script[1])
  console.log(path, response.status, 'SSR brand, canonical, JSON-LD OK')
}
const { response: missing, body: errorHtml } = await get('/project/seo-regression-definitely-missing')
assert.equal(missing.status, 404)
assert.ok(errorHtml.includes('noindex'))
const { response: missingService } = await get('/layanan/tidak-ada')
assert.equal(missingService.status, 404)
const projects = await fetch(base + '/api/projects').then(r => r.json())
assert.ok(projects.length > 0, 'Requires at least one published project')
for (const project of projects.slice(0, 2)) {
  const { response, body } = await get('/project/' + project.slug)
  assert.equal(response.status, 200)
  assert.ok(body.includes('CreativeWork') && body.includes('BreadcrumbList'))
  assert.ok(body.includes('Hygione Darriyan'))
  assert.equal((body.match(/rel="canonical"/g) || []).length, 1)
  console.log(project.slug, 'SSR project metadata OK')
}
const { body: sitemap, response: sitemapResponse } = await get('/sitemap.xml')
assert.equal(sitemapResponse.status, 200)
for (const path of publicPaths) assert.ok(sitemap.includes(path + '</loc>'), path + ' sitemap')
for (const project of projects) assert.ok(sitemap.includes('/project/' + project.slug), project.slug + ' sitemap')
assert.ok(!/<loc>[^<]*\/admin/.test(sitemap))
const { body: robots } = await get('/robots.txt')
assert.ok(robots.includes('/admin'))
const { body: login } = await get('/admin/login')
assert.ok(login.includes('noindex'))
console.log('HTTP SEO smoke checks passed; published projects:', projects.length)

