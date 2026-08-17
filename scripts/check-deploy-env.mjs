const enforce = process.env.VERCEL === '1' || process.argv.includes('--force')
if (!enforce) {
  console.log('check-deploy-env: dilewati di environment lokal')
  process.exit(0)
}

const errors = []
const required = ['NUXT_PUBLIC_SITE_URL', 'SUPABASE_URL', 'SUPABASE_KEY']
for (const key of required) {
  if (!process.env[key]?.trim()) errors.push(`${key} wajib diisi`)
}

for (const key of ['NUXT_PUBLIC_SITE_URL', 'SUPABASE_URL']) {
  const value = process.env[key]
  if (!value) continue
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:') errors.push(`${key} wajib memakai HTTPS`)
    if (['localhost', '127.0.0.1'].includes(url.hostname)) errors.push(`${key} tidak boleh memakai localhost`)
  }
  catch {
    errors.push(`${key} bukan URL yang valid`)
  }
}

const supabaseKey = process.env.SUPABASE_KEY ?? ''
if (supabaseKey.length < 20) errors.push('SUPABASE_KEY tidak tampak seperti publishable/anon key yang valid')
if (supabaseKey.startsWith('sb_secret_')) errors.push('SUPABASE_KEY tidak boleh menggunakan secret key')

if (supabaseKey.split('.').length === 3) {
  try {
    const payload = JSON.parse(Buffer.from(supabaseKey.split('.')[1], 'base64url').toString('utf8'))
    if (payload.role === 'service_role') errors.push('SUPABASE_KEY tidak boleh menggunakan service-role key')
  }
  catch {
    errors.push('Format JWT SUPABASE_KEY tidak valid')
  }
}

if (errors.length) {
  console.error('check-deploy-env: GAGAL')
  errors.forEach(error => console.error(`- ${error}`))
  process.exit(1)
}

console.log('check-deploy-env: OK')
