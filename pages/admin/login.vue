<script setup lang="ts">
import type { Database } from '~/types/database.types'

definePageMeta({ layout: false })
useSeoMeta({ title: 'Studio Portal Login — Rumah Design', robots: 'noindex, nofollow' })

const route = useRoute()
const client = useSupabaseClient<Database>()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const busy = ref(false)
const errorMessage = ref(route.query.error === 'forbidden' ? 'Akun Anda belum didaftarkan sebagai Admin di database.' : '')
const isForbidden = computed(() => errorMessage.value.includes('admin') || errorMessage.value.includes('whitelist') || route.query.error === 'forbidden')

async function login() {
  busy.value = true
  errorMessage.value = ''

  const { error } = await client.auth.signInWithPassword({
    email: email.value.trim(),
    password: password.value,
  })

  if (error) {
    errorMessage.value = 'Email atau kata sandi tidak cocok dengan data Supabase Auth.'
    busy.value = false
    return
  }

  // Check admin whitelist in public.admin_users
  const { data: isAdmin, error: adminError } = await client.rpc('is_admin')
  if (adminError || !isAdmin) {
    await client.auth.signOut()
    errorMessage.value = 'Akun Supabase Anda belum memiliki hak akses Admin (User ID belum terdaftar di tabel public.admin_users).'
    busy.value = false
    return
  }

  const next = typeof route.query.next === 'string' && route.query.next.startsWith('/admin/')
    ? route.query.next
    : '/admin/projects'
  await navigateTo(next)
}
</script>

<template>
  <main class="grid min-h-screen bg-paper text-ink lg:grid-cols-2">
    <!-- Left Visual Panel (Editorial Showcase) -->
    <section class="hidden border-r border-ink/10 bg-void p-12 text-paper lg:flex lg:flex-col lg:justify-between relative overflow-hidden">
      <!-- Background subtle gradient aura -->
      <div class="absolute -top-24 -left-24 size-96 rounded-full bg-signal/15 blur-3xl pointer-events-none" />
      <div class="absolute -bottom-24 -right-24 size-96 rounded-full bg-signal/10 blur-3xl pointer-events-none" />

      <div class="relative z-10">
        <NuxtLink to="/" class="inline-flex items-center gap-3 group">
          <SiteLogo :dark="true" />
        </NuxtLink>
      </div>

      <div class="space-y-6 relative z-10 max-w-lg">
        <div class="inline-flex items-center gap-2 rounded-full bg-signal/15 px-3 py-1 font-mono text-xs font-semibold text-signal uppercase tracking-[0.14em]">
          <span class="size-1.5 rounded-full bg-signal animate-pulse" />
          <span>Private Studio Workspace</span>
        </div>
        <h2 class="font-display text-4xl sm:text-5xl font-bold text-paper leading-[1.08] tracking-tight">
          Pusat Kurasi & Editorial Portofolio.
        </h2>
        <p class="font-sans text-sm text-paper/70 leading-relaxed">
          Kelola metadata karya, studio case study, optimasi SEO real-time, dan aset multimedia dari satu dashboard terpadu.
        </p>

        <!-- Feature chips -->
        <div class="flex flex-wrap gap-2 pt-2">
          <span class="rounded-full bg-white/10 px-3 py-1 font-mono text-[0.7rem] text-paper/90 border border-white/10">
            ⚡ SSR Architecture
          </span>
          <span class="rounded-full bg-white/10 px-3 py-1 font-mono text-[0.7rem] text-paper/90 border border-white/10">
            🔒 Supabase RLS Protected
          </span>
          <span class="rounded-full bg-white/10 px-3 py-1 font-mono text-[0.7rem] text-paper/90 border border-white/10">
            📊 Real-time SEO Scoring
          </span>
        </div>
      </div>

      <div class="flex items-center justify-between font-mono text-xs text-paper/50 relative z-10 border-t border-white/10 pt-6">
        <span>Rumah Design Studio v2.5</span>
        <span>Secure Session</span>
      </div>
    </section>

    <!-- Right Login Form -->
    <section class="grid place-items-center px-4 sm:px-8 py-10 sm:py-16">
      <div class="w-full max-w-md space-y-7 rounded-3xl bg-white/85 p-6 sm:p-10 border border-ink/10 shadow-xl">
        <div class="lg:hidden flex items-center justify-between">
          <NuxtLink to="/" class="inline-flex items-center gap-2">
            <SiteLogo />
          </NuxtLink>
          <span class="rounded-full bg-ink/5 px-2.5 py-0.5 font-mono text-[0.65rem] font-bold uppercase text-mute">
            Studio
          </span>
        </div>

        <div>
          <div class="inline-flex items-center gap-2 rounded-full bg-ink/5 px-3 py-1 font-mono text-[0.68rem] sm:text-[0.7rem] font-bold text-mute uppercase tracking-widest">
            <span class="size-1.5 rounded-full bg-signal" />
            <span>Admin Portal</span>
          </div>
          <h1 class="mt-2 sm:mt-3 font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            Masuk ke Studio
          </h1>
          <p class="mt-1 font-sans text-xs sm:text-sm text-mute">
            Akses khusus kurator & administrator Rumah Design.
          </p>
        </div>

        <!-- Error / Warning Alert with Whitelist Helper -->
        <div
          v-if="errorMessage"
          role="alert"
          class="border rounded-2xl p-4 text-xs font-sans space-y-2 transition-all"
          :class="isForbidden ? 'border-amber-500/50 bg-amber-50 text-amber-900' : 'border-signal/40 bg-signal/5 text-signal'"
        >
          <div class="flex items-start gap-2">
            <span class="font-bold text-sm leading-none shrink-0 mt-0.5">{{ isForbidden ? '⚠️' : '✕' }}</span>
            <p class="leading-relaxed">{{ errorMessage }}</p>
          </div>

          <div v-if="isForbidden" class="mt-2 pt-2 border-t border-amber-200/80 font-mono text-[0.68rem] text-amber-800 space-y-1">
            <p class="font-bold uppercase tracking-wider">💡 Panduan Admin Whitelist:</p>
            <p>Masukkan User UID Anda ke tabel <code class="bg-amber-100 px-1 py-0.5 rounded text-amber-950 font-bold">public.admin_users</code> di SQL Editor Supabase untuk mengaktifkan akses akun.</p>
          </div>
        </div>

        <form class="space-y-4 sm:space-y-5" @submit.prevent="login">
          <fieldset :disabled="busy" class="space-y-4 sm:space-y-5 disabled:opacity-60">
            <div class="space-y-1.5">
              <label for="admin-email" class="block font-mono text-xs font-bold text-ink uppercase tracking-wider">
                Email Terdaftar
              </label>
              <input
                id="admin-email"
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="admin@rumahdesign.id"
                class="field font-sans text-sm"
                required
              >
            </div>

            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label for="admin-password" class="block font-mono text-xs font-bold text-ink uppercase tracking-wider">
                  Kata Sandi
                </label>
                <button
                  type="button"
                  class="font-mono text-[0.7rem] text-mute hover:text-signal transition-colors cursor-pointer"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? 'Sembunyikan' : 'Lihat Sandi' }}
                </button>
              </div>
              <input
                id="admin-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="••••••••••••"
                class="field font-sans text-sm"
                required
              >
            </div>

            <button
              type="submit"
              class="w-full flex items-center justify-center gap-2 rounded-full bg-signal text-white hover:bg-[#e63d10] py-3.5 font-mono text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              <span>{{ busy ? 'Memeriksa Kredensial…' : 'Masuk ke Studio Portal' }}</span>
              <span v-if="!busy" class="font-bold">↗</span>
            </button>
          </fieldset>
        </form>

        <div class="border-t border-ink/10 pt-5 text-center">
          <NuxtLink to="/" class="font-mono text-xs text-mute hover:text-signal transition-colors py-1 inline-flex items-center gap-1.5">
            <span>←</span>
            <span>Kembali ke Website Publik</span>
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>
