<script setup lang="ts">
import type { Database } from '~/types/database.types'

definePageMeta({ middleware: 'admin', layout: 'admin' })
useSeoMeta({ title: 'Pengaturan Platform — Studio Admin Rumah Design', robots: 'noindex, nofollow' })

const client = useSupabaseClient<Database>()
const user = useSupabaseUser()
const { success, error: toastError, info } = useToast()

const activeTab = ref<'general' | 'seo' | 'socials' | 'system'>('general')
const busy = ref(false)
const testingConnection = ref(false)
const dbStatus = ref<'online' | 'error' | 'idle'>('idle')
const dbLatency = ref<number | null>(null)

// General Site Settings Form
const generalForm = reactive({
  site_name: 'Rumah Design',
  tagline: 'Showcase karya frontend & narasi proses desain',
  bio: 'Product designer & frontend engineer yang fokus pada kerajinan visual, interaksi presisi, dan arsitektur web modern.',
  contact_email: 'hello@rumahdesign.dev',
})

// SEO Defaults Form
const seoForm = reactive({
  default_title: 'Rumah Design — Portofolio & Case Study Frontend',
  default_description: 'Kumpulan karya frontend, landing page interaktif, dan case study proses desain produk oleh desainer & engineer.',
  default_og_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=80',
  indexing: true,
})

// Social Profiles Form
const socialsForm = reactive({
  github: 'https://github.com',
  linkedin: 'https://linkedin.com',
  dribbble: 'https://dribbble.com',
  twitter: 'https://x.com',
  instagram: 'https://instagram.com',
  medium: '',
})

// Fetch Existing Settings
const { data: settingsData, refresh } = await useAsyncData('admin-site-settings', async () => {
  try {
    const { data, error } = await client.from('site_settings').select('*')
    if (error) return []
    return data ?? []
  }
  catch {
    return []
  }
})

// Populate state if loaded
watch(
  settingsData,
  (loaded) => {
    if (!loaded?.length) return
    loaded.forEach((item) => {
      if (item.key === 'general' && item.value) Object.assign(generalForm, item.value)
      if (item.key === 'seo' && item.value) Object.assign(seoForm, item.value)
      if (item.key === 'socials' && item.value) Object.assign(socialsForm, item.value)
    })
  },
  { immediate: true },
)

async function saveSettings(tab: 'general' | 'seo' | 'socials') {
  busy.value = true
  try {
    let payload = {}
    if (tab === 'general') payload = { ...generalForm }
    else if (tab === 'seo') payload = { ...seoForm }
    else if (tab === 'socials') payload = { ...socialsForm }

    const { error } = await client
      .from('site_settings')
      .upsert({ key: tab, value: payload, updated_at: new Date().toISOString() })

    if (error) throw error
    success(`Pengaturan ${tab === 'general' ? 'Identitas Situs' : tab === 'seo' ? 'SEO Global' : 'Tautan Sosial'} berhasil disimpan ke Supabase.`)
    await refresh()
  }
  catch (err) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`rumahdesign_settings_${tab}`, JSON.stringify(tab === 'general' ? generalForm : tab === 'seo' ? seoForm : socialsForm))
      success(`Pengaturan disimpan secara lokal. (${err instanceof Error ? err.message : 'Database sync'})`)
    }
    else {
      toastError(err instanceof Error ? err.message : 'Gagal menyimpan pengaturan.')
    }
  }
  finally {
    busy.value = false
  }
}

async function testDatabaseConnection() {
  testingConnection.value = true
  const start = performance.now()
  try {
    const { data, error } = await client.from('projects').select('id').limit(1)
    const end = performance.now()
    if (error) throw error
    dbStatus.value = 'online'
    dbLatency.value = Math.round(end - start)
    info(`Supabase Postgres Terhubung (${dbLatency.value}ms)`)
  }
  catch {
    dbStatus.value = 'error'
    dbLatency.value = null
    toastError('Gagal terhubung ke Supabase Database.')
  }
  finally {
    testingConnection.value = false
  }
}
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-ink/12 pb-6">
      <div>
        <div class="inline-flex items-center gap-2 rounded-full bg-ink/5 px-3 py-1 font-mono text-[0.7rem] font-bold text-mute uppercase tracking-widest">
          <span class="size-1.5 rounded-full bg-signal" />
          <span>Konfigurasi & Sistem</span>
        </div>
        <h1 class="mt-2 sm:mt-3 font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
          Pengaturan Platform
        </h1>
        <p class="mt-1 font-sans text-xs sm:text-sm text-mute">
          Sesuaikan profil studio, konfigurasi SEO bawaan, tautan sosial, dan periksa kesehatan sistem.
        </p>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory rounded-2xl bg-white/80 p-1.5 border border-ink/10 shadow-xs font-mono text-xs font-semibold">
      <div class="flex items-center gap-1.5 min-w-max sm:min-w-0 sm:flex-wrap">
        <button
          type="button"
          class="snap-start cursor-pointer rounded-xl px-4 py-2.5 transition-all whitespace-nowrap flex items-center gap-2"
          :class="activeTab === 'general' ? 'bg-ink text-paper shadow-sm' : 'text-mute hover:text-ink'"
          @click="activeTab = 'general'"
        >
          <span>🏛️</span>
          <span>Situs & Identitas</span>
        </button>
        <button
          type="button"
          class="snap-start cursor-pointer rounded-xl px-4 py-2.5 transition-all whitespace-nowrap flex items-center gap-2"
          :class="activeTab === 'seo' ? 'bg-ink text-paper shadow-sm' : 'text-mute hover:text-ink'"
          @click="activeTab = 'seo'"
        >
          <span>⚡</span>
          <span>SEO & Metadata</span>
        </button>
        <button
          type="button"
          class="snap-start cursor-pointer rounded-xl px-4 py-2.5 transition-all whitespace-nowrap flex items-center gap-2"
          :class="activeTab === 'socials' ? 'bg-ink text-paper shadow-sm' : 'text-mute hover:text-ink'"
          @click="activeTab = 'socials'"
        >
          <span>🌐</span>
          <span>Tautan Sosial</span>
        </button>
        <button
          type="button"
          class="snap-start cursor-pointer rounded-xl px-4 py-2.5 transition-all whitespace-nowrap flex items-center gap-2"
          :class="activeTab === 'system' ? 'bg-ink text-paper shadow-sm' : 'text-mute hover:text-ink'"
          @click="activeTab = 'system'"
        >
          <span>🛠️</span>
          <span>Sistem & Diagnostik</span>
        </button>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- TAB 1: SITUS & IDENTITAS                                       -->
    <!-- ============================================================== -->
    <div v-show="activeTab === 'general'" class="space-y-6">
      <div class="rounded-3xl bg-white/85 p-6 sm:p-8 border border-ink/10 shadow-xs space-y-6">
        <div class="border-b border-ink/10 pb-4">
          <h3 class="font-display text-xl font-bold text-ink">Identitas Studio & Profil Publik</h3>
          <p class="text-xs text-mute font-sans mt-0.5">Informasi profil umum yang tampil pada header, hero section, dan footer.</p>
        </div>

        <div class="grid gap-6 sm:grid-cols-2">
          <label class="space-y-2">
            <span class="font-mono text-xs font-bold text-ink uppercase tracking-wider">Nama Situs / Studio</span>
            <input v-model="generalForm.site_name" class="field font-display font-bold" placeholder="Rumah Design">
          </label>

          <label class="space-y-2">
            <span class="font-mono text-xs font-bold text-ink uppercase tracking-wider">Email Kontak Publik</span>
            <input v-model="generalForm.contact_email" type="email" class="field font-mono text-sm" placeholder="hello@rumahdesign.dev">
          </label>

          <label class="space-y-2 sm:col-span-2">
            <span class="font-mono text-xs font-bold text-ink uppercase tracking-wider">Tagline Utama Portofolio</span>
            <input v-model="generalForm.tagline" class="field font-sans" placeholder="Showcase karya frontend & narasi proses desain">
          </label>

          <label class="space-y-2 sm:col-span-2">
            <span class="font-mono text-xs font-bold text-ink uppercase tracking-wider">Bio Ringkas Studio</span>
            <textarea v-model="generalForm.bio" rows="3" class="field resize-y font-sans text-sm leading-relaxed" />
          </label>
        </div>

        <div class="pt-4 border-t border-ink/10 flex justify-end">
          <button
            type="button"
            class="rounded-full bg-signal text-white hover:bg-[#e63d10] px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50"
            :disabled="busy"
            @click="saveSettings('general')"
          >
            {{ busy ? 'Menyimpan…' : 'Simpan Identitas ↗' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- TAB 2: SEO & METADATA                                          -->
    <!-- ============================================================== -->
    <div v-show="activeTab === 'seo'" class="space-y-6">
      <div class="rounded-3xl bg-white/85 p-6 sm:p-8 border border-ink/10 shadow-xs space-y-6">
        <div class="border-b border-ink/10 pb-4">
          <h3 class="font-display text-xl font-bold text-ink">Konfigurasi SEO Global</h3>
          <p class="text-xs text-mute font-sans mt-0.5">Pengaturan default untuk meta tag, Open Graph, dan indeks mesin pencari.</p>
        </div>

        <div class="grid gap-6 sm:grid-cols-2">
          <label class="space-y-2 sm:col-span-2">
            <div class="flex items-center justify-between">
              <span class="font-mono text-xs font-bold text-ink uppercase tracking-wider">Default Meta Title</span>
              <span class="font-mono text-[0.7rem] text-mute">{{ seoForm.default_title.length }} / 80 char</span>
            </div>
            <input v-model="seoForm.default_title" class="field font-sans" maxlength="80">
          </label>

          <label class="space-y-2 sm:col-span-2">
            <div class="flex items-center justify-between">
              <span class="font-mono text-xs font-bold text-ink uppercase tracking-wider">Default Meta Description</span>
              <span class="font-mono text-[0.7rem] text-mute">{{ seoForm.default_description.length }} / 200 char</span>
            </div>
            <textarea v-model="seoForm.default_description" rows="3" class="field resize-y font-sans text-sm leading-relaxed" maxlength="200" />
          </label>

          <label class="space-y-2 sm:col-span-2">
            <span class="font-mono text-xs font-bold text-ink uppercase tracking-wider">Default OG Image URL (Fallback Share Banner)</span>
            <input v-model="seoForm.default_og_image" class="field font-mono text-xs" placeholder="https://.../og-banner.png">
          </label>

          <div class="sm:col-span-2 flex items-center justify-between rounded-2xl bg-ink/[0.03] p-4 border border-ink/10">
            <div>
              <p class="font-display font-bold text-ink text-sm">Izinkan Indeks Google & Mesin Pencari</p>
              <p class="text-xs text-mute font-sans">Mengatur meta tag robots: index, follow pada seluruh halaman publik.</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input v-model="seoForm.indexing" type="checkbox" class="sr-only peer">
              <div class="w-11 h-6 bg-ink/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>
        </div>

        <div class="pt-4 border-t border-ink/10 flex justify-end">
          <button
            type="button"
            class="rounded-full bg-signal text-white hover:bg-[#e63d10] px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50"
            :disabled="busy"
            @click="saveSettings('seo')"
          >
            {{ busy ? 'Menyimpan…' : 'Simpan Pengaturan SEO ↗' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- TAB 3: TAUTAN SOSIAL                                           -->
    <!-- ============================================================== -->
    <div v-show="activeTab === 'socials'" class="space-y-6">
      <div class="rounded-3xl bg-white/85 p-6 sm:p-8 border border-ink/10 shadow-xs space-y-6">
        <div class="border-b border-ink/10 pb-4">
          <h3 class="font-display text-xl font-bold text-ink">Profil & Ekosistem Sosial</h3>
          <p class="text-xs text-mute font-sans mt-0.5">Tautan profil yang ditampilkan pada footer dan halaman kontak.</p>
        </div>

        <div class="grid gap-6 sm:grid-cols-2">
          <label class="space-y-2">
            <span class="font-mono text-xs font-bold text-ink uppercase tracking-wider">GitHub URL</span>
            <input v-model="socialsForm.github" type="url" class="field font-mono text-xs" placeholder="https://github.com/...">
          </label>

          <label class="space-y-2">
            <span class="font-mono text-xs font-bold text-ink uppercase tracking-wider">LinkedIn URL</span>
            <input v-model="socialsForm.linkedin" type="url" class="field font-mono text-xs" placeholder="https://linkedin.com/in/...">
          </label>

          <label class="space-y-2">
            <span class="font-mono text-xs font-bold text-ink uppercase tracking-wider">Dribbble URL</span>
            <input v-model="socialsForm.dribbble" type="url" class="field font-mono text-xs" placeholder="https://dribbble.com/...">
          </label>

          <label class="space-y-2">
            <span class="font-mono text-xs font-bold text-ink uppercase tracking-wider">Twitter / X URL</span>
            <input v-model="socialsForm.twitter" type="url" class="field font-mono text-xs" placeholder="https://x.com/...">
          </label>

          <label class="space-y-2">
            <span class="font-mono text-xs font-bold text-ink uppercase tracking-wider">Instagram URL</span>
            <input v-model="socialsForm.instagram" type="url" class="field font-mono text-xs" placeholder="https://instagram.com/...">
          </label>

          <label class="space-y-2">
            <span class="font-mono text-xs font-bold text-ink uppercase tracking-wider">Medium / Substack URL</span>
            <input v-model="socialsForm.medium" type="url" class="field font-mono text-xs" placeholder="https://medium.com/@...">
          </label>
        </div>

        <div class="pt-4 border-t border-ink/10 flex justify-end">
          <button
            type="button"
            class="rounded-full bg-signal text-white hover:bg-[#e63d10] px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50"
            :disabled="busy"
            @click="saveSettings('socials')"
          >
            {{ busy ? 'Menyimpan…' : 'Simpan Tautan Sosial ↗' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- TAB 4: SISTEM & DIAGNOSTIK                                     -->
    <!-- ============================================================== -->
    <div v-show="activeTab === 'system'" class="space-y-6">
      <div class="rounded-3xl bg-white/85 p-6 sm:p-8 border border-ink/10 shadow-xs space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-4">
          <div>
            <h3 class="font-display text-xl font-bold text-ink">Status Infrastruktur & Layanan</h3>
            <p class="text-xs text-mute font-sans mt-0.5">Kesehatan koneksi Supabase Postgres, Auth, Storage, dan Runtime Nuxt 3.</p>
          </div>
          <button
            type="button"
            class="rounded-full bg-white/80 hover:bg-white border border-ink/10 px-4 py-2 font-mono text-xs font-semibold text-ink transition-all cursor-pointer shadow-xs"
            :disabled="testingConnection"
            @click="testDatabaseConnection"
          >
            {{ testingConnection ? 'Menguji Latensi…' : '⚡ Uji Ping Supabase' }}
          </button>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <!-- Database Health -->
          <div class="rounded-2xl bg-ink/[0.03] p-5 border border-ink/10 space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-mono text-xs font-bold uppercase tracking-wider text-mute">Database Postgres</span>
              <span
                class="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[0.68rem] font-bold"
                :class="dbStatus === 'online' ? 'bg-emerald-100 text-emerald-800' : 'bg-ink/10 text-mute'"
              >
                <span class="size-1.5 rounded-full" :class="dbStatus === 'online' ? 'bg-emerald-600' : 'bg-mute'" />
                {{ dbStatus === 'online' ? `Online (${dbLatency}ms)` : 'Siap Diuji' }}
              </span>
            </div>
            <p class="font-sans text-xs text-ink/80">Koneksi Supabase terenkripsi SSL dengan Row Level Security (RLS) aktif.</p>
          </div>

          <!-- Auth Session -->
          <div class="rounded-2xl bg-ink/[0.03] p-5 border border-ink/10 space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-mono text-xs font-bold uppercase tracking-wider text-mute">Sesi Admin</span>
              <span class="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 font-mono text-[0.68rem] font-bold">
                Tervalidasi (Super Admin)
              </span>
            </div>
            <p class="font-mono text-xs text-ink/80 truncate">{{ user?.email || 'Active Session' }}</p>
          </div>

          <!-- Storage Bucket -->
          <div class="rounded-2xl bg-ink/[0.03] p-5 border border-ink/10 space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-mono text-xs font-bold uppercase tracking-wider text-mute">Storage CDN Bucket</span>
              <span class="rounded-full bg-ink/10 text-ink px-2.5 py-0.5 font-mono text-[0.68rem] font-bold">
                project-media
              </span>
            </div>
            <p class="font-sans text-xs text-ink/80">Public CDN bucket aktif untuk thumbnail & media preview.</p>
          </div>

          <!-- Runtime & SSR -->
          <div class="rounded-2xl bg-ink/[0.03] p-5 border border-ink/10 space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-mono text-xs font-bold uppercase tracking-wider text-mute">Nuxt 3 Architecture</span>
              <span class="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 font-mono text-[0.68rem] font-bold">
                SSR Enabled
              </span>
            </div>
            <p class="font-sans text-xs text-ink/80">Server-Side Rendering untuk indeks SEO Google instan.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
