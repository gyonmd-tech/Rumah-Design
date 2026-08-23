<script setup lang="ts">
import AdminIcon from '~/components/admin/AdminIcon.vue'
import type { Database } from '~/types/database.types'
import { isValidHttpsUrl } from '~/utils/project'

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

const generalForm = reactive({
  site_name: 'Rumah Design',
  tagline: 'Showcase karya frontend & narasi proses desain',
  bio: 'Product designer & frontend engineer yang fokus pada kerajinan visual, interaksi presisi, dan arsitektur web modern.',
  contact_email: 'hello@rumahdesign.dev',
})

const seoForm = reactive({
  default_title: 'Rumah Design — Portofolio & Case Study Frontend',
  default_description: 'Kumpulan karya frontend, landing page interaktif, dan case study proses desain produk oleh desainer & engineer.',
  default_og_image: '',
  indexing: true,
})

const socialsForm = reactive({
  github: 'https://github.com',
  linkedin: 'https://linkedin.com',
  dribbble: 'https://dribbble.com',
  twitter: 'https://x.com',
  instagram: 'https://instagram.com',
  medium: '',
})

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

function validateSettings(tab: 'general' | 'seo' | 'socials') {
  const errors: string[] = []

  if (tab === 'general') {
    if (!generalForm.site_name.trim() || generalForm.site_name.length > 80) {
      errors.push('Nama situs wajib diisi dan maksimal 80 karakter.')
    }
    if (generalForm.tagline.length > 160) errors.push('Tagline maksimal 160 karakter.')
    if (generalForm.bio.length > 1000) errors.push('Bio maksimal 1.000 karakter.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(generalForm.contact_email.trim())) {
      errors.push('Email kontak tidak valid.')
    }
  }

  if (tab === 'seo') {
    if (!seoForm.default_title.trim() || seoForm.default_title.length > 100) {
      errors.push('Default SEO title wajib diisi dan maksimal 100 karakter.')
    }
    if (!seoForm.default_description.trim() || seoForm.default_description.length > 200) {
      errors.push('Default meta description wajib diisi dan maksimal 200 karakter.')
    }
    if (seoForm.default_og_image && !isValidHttpsUrl(seoForm.default_og_image)) {
      errors.push('Default OG image harus berupa URL HTTPS yang valid.')
    }
  }

  if (tab === 'socials') {
    for (const [platform, url] of Object.entries(socialsForm)) {
      if (url && !isValidHttpsUrl(url)) {
        errors.push(`URL ${platform} harus berupa HTTPS yang valid.`)
      }
    }
  }

  if (errors.length) throw new Error(errors.join(' '))
}

async function saveSettings(tab: 'general' | 'seo' | 'socials') {
  busy.value = true
  try {
    validateSettings(tab)
    let payload = {}
    if (tab === 'general') payload = { ...generalForm }
    else if (tab === 'seo') payload = { ...seoForm }
    else if (tab === 'socials') payload = { ...socialsForm }

    const { error } = await client
      .from('site_settings')
      .upsert({ key: tab, value: payload, updated_at: new Date().toISOString() })

    if (error) throw error
    const labels = { general: 'Identitas Situs', seo: 'SEO Global', socials: 'Tautan Sosial' }
    success(`Pengaturan ${labels[tab]} berhasil disimpan.`)
    await refresh()
  }
  catch (err) {
    toastError(err instanceof Error ? err.message : 'Gagal menyimpan pengaturan.')
  }
  finally {
    busy.value = false
  }
}

async function testDatabaseConnection() {
  testingConnection.value = true
  dbStatus.value = 'idle'
  const start = performance.now()
  try {
    const { error } = await client.from('projects').select('id').limit(1)
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

const tabs = [
  { id: 'general', label: 'Situs & Identitas', icon: 'projects' },
  { id: 'seo', label: 'SEO & Metadata', icon: 'seo' },
  { id: 'socials', label: 'Ekosistem Sosial', icon: 'external' },
  { id: 'system', label: 'Diagnostik Sistem', icon: 'database' },
] as const
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-8">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-5 border-b border-ink/10 pb-6">
      <div>
        <div class="inline-flex items-center gap-2 rounded-full bg-ink/5 border border-ink/10 px-3 py-1 font-mono text-[0.68rem] font-bold text-mute uppercase tracking-widest">
          <AdminIcon name="settings" size="12" />
          <span>Konfigurasi & Sistem</span>
        </div>
        <h1 class="mt-2.5 font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
          Pengaturan Platform
        </h1>
        <p class="mt-1 font-sans text-xs sm:text-sm text-mute">
          Sesuaikan profil studio, konfigurasi SEO bawaan, tautan sosial, dan kesehatan sistem.
        </p>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="overflow-x-auto no-scrollbar rounded-2xl bg-white/80 p-1.5 border border-ink/10 shadow-2xs font-mono text-xs font-semibold">
      <div class="flex items-center gap-1.5 min-w-max sm:min-w-0 sm:flex-wrap">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          class="snap-start cursor-pointer rounded-xl px-4 py-2 transition-all whitespace-nowrap flex items-center gap-2"
          :class="activeTab === tab.id ? 'bg-ink text-paper shadow-2xs' : 'text-mute hover:text-ink'"
          @click="activeTab = tab.id"
        >
          <AdminIcon :name="tab.icon" size="13" />
          <span>{{ tab.label }}</span>
        </button>
      </div>
    </div>

    <!-- ============================= -->
    <!-- TAB 1: SITUS & IDENTITAS       -->
    <!-- ============================= -->
    <div v-show="activeTab === 'general'" class="rounded-2xl bg-white/95 border border-ink/10 shadow-2xs">
      <div class="px-6 sm:px-8 py-6 border-b border-ink/10">
        <h2 class="font-display text-xl font-bold text-ink">Identitas & Profil Studio</h2>
        <p class="text-xs text-mute font-sans mt-0.5">Nama situs, tagline, bio singkat, dan kontak utama.</p>
      </div>

      <form class="p-6 sm:p-8 space-y-5" @submit.prevent="saveSettings('general')">
        <div class="space-y-2">
          <label for="s-site-name" class="font-mono text-xs font-bold text-ink uppercase tracking-wider block">
            Nama Situs Studio
          </label>
          <input
            id="s-site-name"
            v-model="generalForm.site_name"
            type="text"
            class="field font-display font-bold text-base !rounded-xl"
            placeholder="Rumah Design"
          >
        </div>

        <div class="space-y-2">
          <label for="s-tagline" class="font-mono text-xs font-bold text-ink uppercase tracking-wider block">
            Tagline Studio
          </label>
          <input
            id="s-tagline"
            v-model="generalForm.tagline"
            type="text"
            class="field font-sans !rounded-xl"
            placeholder="Showcase karya frontend & narasi proses desain"
          >
        </div>

        <div class="space-y-2">
          <label for="s-bio" class="font-mono text-xs font-bold text-ink uppercase tracking-wider block">
            Bio / Deskripsi Singkat
          </label>
          <textarea
            id="s-bio"
            v-model="generalForm.bio"
            rows="3"
            class="field font-sans leading-relaxed !rounded-xl"
            placeholder="Deskripsi singkat studio Anda..."
          />
        </div>

        <div class="space-y-2">
          <label for="s-email" class="font-mono text-xs font-bold text-ink uppercase tracking-wider block">
            Email Kontak Publik
          </label>
          <input
            id="s-email"
            v-model="generalForm.contact_email"
            type="email"
            class="field font-mono !rounded-xl"
            placeholder="hello@studio.dev"
          >
        </div>

        <div class="flex justify-end pt-2">
          <button
            type="submit"
            class="inline-flex items-center gap-2 rounded-xl bg-signal text-white hover:bg-[#e63d10] px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
            :disabled="busy"
          >
            <AdminIcon :name="busy ? 'refresh' : 'check'" size="13" :class="busy ? 'animate-spin' : ''" />
            <span>{{ busy ? 'Menyimpan...' : 'Simpan Identitas' }}</span>
          </button>
        </div>
      </form>
    </div>

    <!-- ============================= -->
    <!-- TAB 2: SEO & METADATA          -->
    <!-- ============================= -->
    <div v-show="activeTab === 'seo'" class="rounded-2xl bg-white/95 border border-ink/10 shadow-2xs">
      <div class="px-6 sm:px-8 py-6 border-b border-ink/10">
        <h2 class="font-display text-xl font-bold text-ink">SEO Global & Konfigurasi Indexing</h2>
        <p class="text-xs text-mute font-sans mt-0.5">Default meta title, deskripsi, OG Image, dan kontrol indeks mesin pencari.</p>
      </div>

      <form class="p-6 sm:p-8 space-y-5" @submit.prevent="saveSettings('seo')">
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label for="s-def-title" class="font-mono text-xs font-bold text-ink uppercase tracking-wider">
              Default SEO Title
            </label>
            <span class="font-mono text-[0.7rem]" :class="seoForm.default_title.length > 60 ? 'text-amber-600 font-bold' : 'text-mute'">
              {{ seoForm.default_title.length }} / 60
            </span>
          </div>
          <input
            id="s-def-title"
            v-model="seoForm.default_title"
            type="text"
            class="field font-sans !rounded-xl"
          >
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label for="s-def-desc" class="font-mono text-xs font-bold text-ink uppercase tracking-wider">
              Default Meta Description
            </label>
            <span class="font-mono text-[0.7rem]" :class="seoForm.default_description.length > 160 ? 'text-amber-600 font-bold' : 'text-mute'">
              {{ seoForm.default_description.length }} / 160
            </span>
          </div>
          <textarea
            id="s-def-desc"
            v-model="seoForm.default_description"
            rows="3"
            class="field font-sans leading-relaxed !rounded-xl"
          />
        </div>

        <div class="space-y-2">
          <label for="s-og-image" class="font-mono text-xs font-bold text-ink uppercase tracking-wider block">
            Default OG Image URL (1200×630)
          </label>
          <input
            id="s-og-image"
            v-model="seoForm.default_og_image"
            type="url"
            class="field font-mono text-xs !rounded-xl"
            placeholder="https://..."
          >
        </div>

        <div class="flex items-center justify-between rounded-xl border border-ink/10 bg-ink/[0.02] px-4 py-3.5">
          <div>
            <p class="font-mono text-xs font-bold text-ink">Pengindeksan Mesin Pencari (Robots)</p>
            <p class="font-sans text-xs text-mute mt-0.5">
              Aktifkan agar halaman publik terindeks oleh Google, Bing, dan mesin pencari lainnya.
            </p>
          </div>
          <button
            type="button"
            class="relative size-11 rounded-xl cursor-pointer transition-all"
            :class="seoForm.indexing ? 'bg-emerald-500' : 'bg-ink/15'"
            @click="seoForm.indexing = !seoForm.indexing"
          >
            <span
              class="absolute inset-1 bg-white rounded-lg shadow-sm transition-transform"
              :class="seoForm.indexing ? 'translate-x-4' : 'translate-x-0'"
            />
          </button>
        </div>

        <div class="flex justify-end pt-2">
          <button
            type="submit"
            class="inline-flex items-center gap-2 rounded-xl bg-signal text-white hover:bg-[#e63d10] px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
            :disabled="busy"
          >
            <AdminIcon :name="busy ? 'refresh' : 'check'" size="13" :class="busy ? 'animate-spin' : ''" />
            <span>{{ busy ? 'Menyimpan...' : 'Simpan Pengaturan SEO' }}</span>
          </button>
        </div>
      </form>
    </div>

    <!-- ============================= -->
    <!-- TAB 3: EKOSISTEM SOSIAL       -->
    <!-- ============================= -->
    <div v-show="activeTab === 'socials'" class="rounded-2xl bg-white/95 border border-ink/10 shadow-2xs">
      <div class="px-6 sm:px-8 py-6 border-b border-ink/10">
        <h2 class="font-display text-xl font-bold text-ink">Ekosistem Tautan Sosial</h2>
        <p class="text-xs text-mute font-sans mt-0.5">Profil platform sosial dan repositori yang ditampilkan di halaman publik.</p>
      </div>

      <form class="p-6 sm:p-8 space-y-4" @submit.prevent="saveSettings('socials')">
        <div
          v-for="(field, key) in { github: 'GitHub', linkedin: 'LinkedIn', dribbble: 'Dribbble', twitter: 'X / Twitter', instagram: 'Instagram', medium: 'Medium Blog' }"
          :key="key"
          class="space-y-1.5"
        >
          <label :for="`s-${key}`" class="font-mono text-xs font-bold text-ink uppercase tracking-wider block">
            {{ field }}
          </label>
          <div class="relative">
            <AdminIcon name="external" size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
            <input
              :id="`s-${key}`"
              v-model="socialsForm[key as keyof typeof socialsForm]"
              type="url"
              class="field font-mono text-xs pl-8 !rounded-xl"
              :placeholder="`https://${key}.com/username`"
            >
          </div>
        </div>

        <div class="flex justify-end pt-2">
          <button
            type="submit"
            class="inline-flex items-center gap-2 rounded-xl bg-signal text-white hover:bg-[#e63d10] px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
            :disabled="busy"
          >
            <AdminIcon :name="busy ? 'refresh' : 'check'" size="13" :class="busy ? 'animate-spin' : ''" />
            <span>{{ busy ? 'Menyimpan...' : 'Simpan Tautan Sosial' }}</span>
          </button>
        </div>
      </form>
    </div>

    <!-- ============================= -->
    <!-- TAB 4: DIAGNOSTIK SISTEM      -->
    <!-- ============================= -->
    <div v-show="activeTab === 'system'" class="space-y-4">
      <!-- Session Info -->
      <div class="rounded-2xl bg-white/95 border border-ink/10 shadow-2xs">
        <div class="px-6 sm:px-8 py-6 border-b border-ink/10">
          <h2 class="font-display text-xl font-bold text-ink">Sesi & Akun Admin</h2>
          <p class="text-xs text-mute font-sans mt-0.5">Informasi sesi aktif Supabase Auth dan status akun.</p>
        </div>

        <div class="p-6 sm:p-8 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="rounded-xl border border-ink/10 bg-ink/[0.02] p-4 space-y-1">
              <span class="font-mono text-[0.68rem] text-mute uppercase font-bold tracking-wider block">Email Admin</span>
              <p class="font-mono text-sm text-ink font-bold truncate">{{ user?.email || '—' }}</p>
            </div>
            <div class="rounded-xl border border-ink/10 bg-ink/[0.02] p-4 space-y-1">
              <span class="font-mono text-[0.68rem] text-mute uppercase font-bold tracking-wider block">User ID (UUID)</span>
              <p class="font-mono text-xs text-ink truncate" :title="user?.id">{{ user?.id?.slice(0, 8) }}...{{ user?.id?.slice(-6) }}</p>
            </div>
            <div class="rounded-xl border border-ink/10 bg-ink/[0.02] p-4 space-y-1">
              <span class="font-mono text-[0.68rem] text-mute uppercase font-bold tracking-wider block">Provider Auth</span>
              <p class="font-mono text-xs text-ink">{{ user?.app_metadata?.provider || 'email' }}</p>
            </div>
            <div class="rounded-xl border border-ink/10 bg-ink/[0.02] p-4 space-y-1">
              <span class="font-mono text-[0.68rem] text-mute uppercase font-bold tracking-wider block">Konfirmasi Email</span>
              <p class="font-mono text-xs" :class="user?.email_confirmed_at ? 'text-emerald-600 font-bold' : 'text-amber-600'">
                {{ user?.email_confirmed_at ? 'Terverifikasi' : 'Belum terverifikasi' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Supabase Connection Test -->
      <div class="rounded-2xl bg-white/95 border border-ink/10 shadow-2xs">
        <div class="px-6 sm:px-8 py-6 border-b border-ink/10">
          <h2 class="font-display text-xl font-bold text-ink">Diagnostik Koneksi Database</h2>
          <p class="text-xs text-mute font-sans mt-0.5">Uji latensi dan status koneksi ke Supabase Postgres secara real-time.</p>
        </div>

        <div class="p-6 sm:p-8 space-y-5">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-ink/10 bg-ink/[0.02] p-5">
            <div class="flex items-center gap-3.5">
              <div
                class="size-10 rounded-xl border flex items-center justify-center transition-colors"
                :class="{
                  'bg-emerald-50 border-emerald-200 text-emerald-600': dbStatus === 'online',
                  'bg-rose-50 border-rose-200 text-signal': dbStatus === 'error',
                  'bg-ink/5 border-ink/10 text-mute': dbStatus === 'idle',
                }"
              >
                <AdminIcon name="database" size="16" />
              </div>
              <div>
                <p class="font-mono text-xs font-bold text-ink uppercase tracking-wider">Supabase Postgres</p>
                <div class="flex items-center gap-2 mt-0.5">
                  <span
                    class="size-1.5 rounded-full"
                    :class="{
                      'bg-emerald-500 animate-pulse': dbStatus === 'online',
                      'bg-signal': dbStatus === 'error',
                      'bg-mute': dbStatus === 'idle',
                    }"
                  />
                  <p class="font-mono text-[0.72rem]" :class="dbStatus === 'online' ? 'text-emerald-700' : dbStatus === 'error' ? 'text-signal' : 'text-mute'">
                    <template v-if="dbStatus === 'online'">
                      Online — Latensi {{ dbLatency }}ms
                    </template>
                    <template v-else-if="dbStatus === 'error'">
                      Koneksi gagal — Periksa environment variable SUPABASE_URL
                    </template>
                    <template v-else>
                      Belum diuji
                    </template>
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-xl bg-ink text-paper hover:bg-ink/80 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap"
              :disabled="testingConnection"
              @click="testDatabaseConnection"
            >
              <AdminIcon :name="testingConnection ? 'refresh' : 'database'" size="13" :class="testingConnection ? 'animate-spin' : ''" />
              <span>{{ testingConnection ? 'Mengukur...' : 'Uji Koneksi' }}</span>
            </button>
          </div>

          <!-- System Info -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div class="rounded-xl border border-ink/10 bg-ink/[0.02] p-3.5 space-y-1">
              <span class="text-[0.65rem] text-mute uppercase font-bold tracking-wider block">Framework</span>
              <p class="text-ink font-semibold">Nuxt 3 (SSR)</p>
            </div>
            <div class="rounded-xl border border-ink/10 bg-ink/[0.02] p-3.5 space-y-1">
              <span class="text-[0.65rem] text-mute uppercase font-bold tracking-wider block">Backend</span>
              <p class="text-ink font-semibold">Supabase (Postgres)</p>
            </div>
            <div class="rounded-xl border border-ink/10 bg-ink/[0.02] p-3.5 space-y-1">
              <span class="text-[0.65rem] text-mute uppercase font-bold tracking-wider block">Deployment</span>
              <p class="text-ink font-semibold">Vercel Edge</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
