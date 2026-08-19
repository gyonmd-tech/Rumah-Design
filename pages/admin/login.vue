<script setup lang="ts">
import type { Database } from '~/types/database.types'

definePageMeta({ layout: false })
useSeoMeta({ title: 'Admin Login — Rumah Design', robots: 'noindex, nofollow' })

const route = useRoute()
const client = useSupabaseClient<Database>()
const email = ref('')
const password = ref('')
const busy = ref(false)
const message = ref(route.query.error === 'forbidden' ? 'Akun ini tidak terdaftar sebagai admin.' : '')

async function login() {
  busy.value = true
  message.value = ''
  const { error } = await client.auth.signInWithPassword({ email: email.value.trim(), password: password.value })
  if (error) {
    message.value = 'Email atau password tidak sesuai.'
    busy.value = false
    return
  }

  const { data: isAdmin, error: adminError } = await client.rpc('is_admin')
  if (adminError || !isAdmin) {
    await client.auth.signOut()
    message.value = 'Akun ini tidak memiliki akses admin.'
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
    <!-- Left Visual Panel -->
    <section class="hidden border-r border-ink/10 bg-void p-12 text-paper lg:flex lg:flex-col lg:justify-between">
      <NuxtLink to="/" class="inline-flex items-center gap-3">
        <SiteLogo :dark="true" />
      </NuxtLink>
      <div class="space-y-4">
        <div class="inline-flex items-center gap-2 rounded-full bg-signal/15 px-3 py-1 font-mono text-xs font-semibold text-signal uppercase tracking-[0.14em]">
          <span class="size-1.5 rounded-full bg-signal" />
          <span>Private Workspace</span>
        </div>
        <p class="font-display text-display-l text-paper max-w-[12ch] leading-tight">
          Rawat karya dalam satu rumah.
        </p>
      </div>
      <p class="font-mono text-xs text-paper/50">
        Rumah Design Content Studio v2
      </p>
    </section>

    <!-- Right Login Form -->
    <section class="grid place-items-center px-6 py-16">
      <div class="w-full max-w-md space-y-8 rounded-3xl bg-white/80 p-8 sm:p-10 border border-ink/10 shadow-lg">
        <div class="lg:hidden">
          <NuxtLink to="/" class="inline-flex items-center gap-2">
            <SiteLogo />
          </NuxtLink>
        </div>

        <div>
          <div class="inline-flex items-center gap-2 rounded-full bg-ink/5 px-3 py-1 font-mono text-[0.7rem] font-bold text-mute uppercase tracking-widest">
            <span class="size-1.5 rounded-full bg-signal" />
            <span>Admin Access</span>
          </div>
          <h1 class="mt-3 font-display text-3xl font-bold text-ink">
            Masuk Portal
          </h1>
          <p class="mt-2 font-body text-sm text-mute">
            Kelola project, case study, dan status publikasi portofolio.
          </p>
        </div>

        <div v-if="message" role="alert" class="border border-signal/40 bg-signal/5 p-4 text-xs font-mono text-signal rounded-2xl">
          {{ message }}
        </div>

        <form class="space-y-5" @submit.prevent="login">
          <fieldset :disabled="busy" class="space-y-5 disabled:opacity-60">
            <div class="space-y-2">
              <label for="admin-email" class="block font-mono text-xs font-bold text-ink uppercase tracking-wider">
                Email
              </label>
              <input
                id="admin-email"
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="admin@rumahdesign.id"
                class="field"
                required
              >
            </div>

            <div class="space-y-2">
              <label for="admin-password" class="block font-mono text-xs font-bold text-ink uppercase tracking-wider">
                Password
              </label>
              <input
                id="admin-password"
                v-model="password"
                type="password"
                autocomplete="current-password"
                placeholder="••••••••"
                class="field"
                required
              >
            </div>

            <button type="submit" class="button-primary w-full cursor-pointer mt-2">
              {{ busy ? 'Memeriksa Akses…' : 'Masuk ke Admin ↗' }}
            </button>
          </fieldset>
        </form>

        <div class="border-t border-ink/10 pt-6 text-center">
          <NuxtLink to="/" class="font-mono text-xs text-mute hover:text-signal transition-colors">
            ← Kembali ke Beranda
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>
