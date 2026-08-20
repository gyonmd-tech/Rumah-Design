const isForce = process.argv.includes('--force')
const isVercel = process.env.VERCEL === '1'

if (!isVercel && !isForce) {
  console.log('check-deploy-env: dilewati di environment lokal')
  process.exit(0)
}

const warnings = []
const errors = []
const required = ['NUXT_PUBLIC_SITE_URL', 'SUPABASE_URL', 'SUPABASE_KEY']

for (const key of required) {
  if (!process.env[key]?.trim()) {
    if (isForce) {
      errors.push(`${key} wajib diisi`)
    } else {
      warnings.push(`${key} belum diatur di Vercel Dashboard. Supabase client tidak dapat terhubung.`)
    }
  }
}

for (const key of ['NUXT_PUBLIC_SITE_URL', 'SUPABASE_URL']) {
  const value = process.env[key]
  if (!value) continue
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:') warnings.push(`${key} sebaiknya memakai HTTPS`)
    if (['localhost', '127.0.0.1'].includes(url.hostname)) warnings.push(`${key} tidak boleh memakai localhost di production`)
  } catch {
    warnings.push(`${key} bukan URL yang valid`)
  }
}

const supabaseKey = process.env.SUPABASE_KEY ?? ''
if (supabaseKey) {
  if (supabaseKey.length < 20) warnings.push('SUPABASE_KEY tidak tampak seperti publishable/anon key yang valid')
  if (supabaseKey.startsWith('sb_secret_')) {
    errors.push('SUPABASE_KEY tidak boleh menggunakan secret key!')
  }

  if (supabaseKey.split('.').length === 3) {
    try {
      const payload = JSON.parse(Buffer.from(supabaseKey.split('.')[1], 'base64url').toString('utf8'))
      if (payload.role === 'service_role') {
        errors.push('SUPABASE_KEY tidak boleh menggunakan service-role key!')
      }
    } catch {
      warnings.push('Format JWT SUPABASE_KEY tidak dapat didekode')
    }
  }
}

if (warnings.length) {
  console.warn('\n[check-deploy-env: PERINGATAN]')
  warnings.forEach(w => console.warn(`⚠️  ${w}`))
  console.warn('')
}

if (errors.length) {
  console.error('\n[check-deploy-env: GAGAL]')
  errors.forEach(e => console.error(`❌ ${e}`))
  process.exit(1)
}

console.log('check-deploy-env: OK (Siap di-deploy)')
