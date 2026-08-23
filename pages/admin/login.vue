<script setup lang="ts">
import AdminIcon from '~/components/admin/AdminIcon.vue'
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
  <main class="min-h-screen bg-[#edeae4] text-ink font-body selection:bg-signal selection:text-white lg:grid lg:grid-cols-2">
    <!-- Left: Dark Visual Panel -->
    <section class="relative hidden lg:flex lg:flex-col lg:justify-between overflow-hidden bg-[#0d0c0b] p-12">
      <!-- Ambient Background -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_40%,rgba(255,75,20,0.07),transparent)]" />

      <!-- Brand Header -->
      <div class="relative z-10">
        <NuxtLink to="/" class="inline-flex items-center gap-2.5 group">
          <SiteLogo :dark="true" />
          <span class="rounded-full bg-white/[0.08] border border-white/[0.08] px-2.5 py-0.5 font-mono text-[0.62rem] font-bold uppercase tracking-wider text-[#8a8478] group-hover:text-white transition-colors">
            Admin Portal
          </span>
        </NuxtLink>
      </div>

      <!-- Central Editorial Copy -->
      <div class="relative z-10 space-y-8">
        <div class="space-y-4">
          <div class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[0.68rem] font-bold text-[#8a8478] uppercase tracking-widest">
            <span class="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Studio Management System</span>
          </div>
          <h1 class="font-display text-4xl xl:text-5xl font-bold text-white tracking-tight leading-[1.1]">
            Rumah Design<br />
            <span class="text-[#8a8478]">Content Studio</span>
          </h1>
          <p class="font-sans text-sm leading-relaxed text-[#8a8478] max-w-sm">
            Platform pengelolaan portofolio dan case study editorial karya frontend Anda.
            Publish, audit SEO, dan kelola media dari satu dasbor terintegrasi.
          </p>
        </div>

        <!-- Feature Pills -->
        <div class="flex flex-wrap gap-2">
          <div
            v-for="feat in ['Projects CMS', 'SEO Audit', 'Media Library', 'SERP Simulator', 'Command Palette']"
            :key="feat"
            class="rounded-xl bg-white/[0.04] border border-white/[0.06] px-3 py-1.5 font-mono text-[0.7rem] text-[#8a8478]"
          >
            {{ feat }}
          </div>
        </div>
      </div>

      <!-- Footer Attribution -->
      <div class="relative z-10 flex items-center gap-2 font-mono text-[0.65rem] text-[#8a8478]/60">
        <span class="size-1.5 rounded-full bg-emerald-400" />
        <span>Powered by Nuxt 3 · Supabase · Vercel</span>
      </div>
    </section>

    <!-- Right: Login Form Panel -->
    <section class="flex min-h-screen flex-col items-center justify-center px-6 py-12 sm:px-8 lg:px-16">
      <!-- Mobile: Brand Logo -->
      <div class="mb-8 lg:hidden">
        <NuxtLink to="/" class="inline-flex items-center gap-2">
          <SiteLogo />
        </NuxtLink>
      </div>

      <div class="w-full max-w-sm space-y-8">
        <!-- Form Header -->
        <div class="space-y-1.5">
          <h2 class="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            Masuk ke Studio
          </h2>
          <p class="font-sans text-sm text-mute">
            Gunakan email dan sandi admin Supabase Auth Anda.
          </p>
        </div>

        <!-- Error Alert -->
        <div
          v-if="errorMessage"
          role="alert"
          class="rounded-2xl border border-signal/30 bg-signal/5 p-4 space-y-2"
        >
          <div class="flex items-center gap-2 font-mono text-xs font-bold text-signal uppercase tracking-wider">
            <AdminIcon name="alert" size="14" />
            <span>Gagal Masuk</span>
          </div>
          <p class="font-sans text-xs leading-relaxed text-signal/90">{{ errorMessage }}</p>

          <!-- Whitelist Help Box -->
          <div v-if="isForbidden" class="mt-3 rounded-xl border border-amber-300/40 bg-amber-50 p-3.5 space-y-2">
            <p class="font-mono text-[0.68rem] font-bold text-amber-900 uppercase tracking-wider">
              Cara Mendaftarkan Akun Admin:
            </p>
            <ol class="font-mono text-[0.7rem] text-amber-900 space-y-1.5 list-decimal list-inside leading-relaxed">
              <li>Buka <strong>Supabase Dashboard</strong> → <em>Table Editor</em> → tabel <code class="bg-amber-100 rounded px-1">public.admin_users</code></li>
              <li>Klik <strong>Insert Row</strong></li>
              <li>Salin <strong>User UUID</strong> dari tab <em>Authentication → Users</em></li>
              <li>Isi kolom <code class="bg-amber-100 rounded px-1">user_id</code> dengan UUID tersebut, lalu simpan</li>
              <li>Coba login kembali</li>
            </ol>
          </div>
        </div>

        <!-- Login Form -->
        <form class="space-y-4" @submit.prevent="login">
          <!-- Email Field -->
          <div class="space-y-1.5">
            <label for="l-email" class="font-mono text-xs font-bold text-ink uppercase tracking-wider block">
              Email Supabase Auth
            </label>
            <input
              id="l-email"
              v-model="email"
              type="email"
              autocomplete="email"
              class="field font-sans !rounded-xl"
              placeholder="admin@studio.dev"
              required
            >
          </div>

          <!-- Password Field -->
          <div class="space-y-1.5">
            <label for="l-password" class="font-mono text-xs font-bold text-ink uppercase tracking-wider block">
              Kata Sandi
            </label>
            <div class="relative">
              <input
                id="l-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                class="field font-sans !rounded-xl pr-11"
                placeholder="••••••••••••"
                required
              >
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-mute hover:text-ink transition-colors cursor-pointer"
                :title="showPassword ? 'Sembunyikan' : 'Tampilkan'"
                @click="showPassword = !showPassword"
              >
                <AdminIcon :name="showPassword ? 'eye-off' : 'eye'" size="16" />
              </button>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-signal text-white hover:bg-[#e63d10] py-3 font-mono text-sm font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer disabled:opacity-60 hover:scale-[1.01] active:scale-[0.99] mt-2"
            :disabled="busy"
          >
            <AdminIcon :name="busy ? 'refresh' : 'arrow-right'" size="16" :class="busy ? 'animate-spin' : ''" />
            <span>{{ busy ? 'Memverifikasi...' : 'Masuk ke Studio' }}</span>
          </button>
        </form>

        <!-- Footer -->
        <div class="flex items-center justify-between border-t border-ink/10 pt-5 font-mono text-[0.68rem] text-mute">
          <NuxtLink to="/" class="hover:text-ink transition-colors inline-flex items-center gap-1">
            <AdminIcon name="arrow-left" size="12" />
            <span>Kembali ke Website</span>
          </NuxtLink>
          <span>Studio v2</span>
        </div>
      </div>
    </section>
  </main>
</template>
