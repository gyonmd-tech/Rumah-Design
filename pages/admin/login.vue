<script setup lang="ts">
import type { Database } from '~/types/database.types'

definePageMeta({ layout: false })
useSeoMeta({ title: 'Admin login — Rumah Design', robots: 'noindex, nofollow' })

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
  <main class="grid min-h-screen bg-canvas lg:grid-cols-2">
    <section class="hidden border-r border-ink/20 p-10 lg:flex lg:flex-col lg:justify-between">
      <NuxtLink to="/" class="eyebrow">Rumah Design</NuxtLink>
      <p class="max-w-[9ch] text-[clamp(4rem,8vw,8rem)] font-medium leading-[0.84] tracking-[-0.07em]">Rawat karya dalam satu rumah.</p>
      <p class="eyebrow text-muted">Private workspace</p>
    </section>
    <section class="grid place-items-center px-5 py-12">
      <form class="w-full max-w-md" @submit.prevent="login">
        <NuxtLink to="/" class="eyebrow lg:hidden">Rumah Design</NuxtLink>
        <p class="eyebrow mt-12 text-muted lg:mt-0">Admin</p>
        <h1 class="mt-3 text-5xl font-medium tracking-[-0.055em]">Masuk</h1>
        <p class="mt-3 text-muted">Kelola project, case study, dan status publikasi.</p>
        <p v-if="message" role="alert" class="mt-6 border border-red-700/30 bg-red-50 p-4 text-sm text-red-900">{{ message }}</p>
        <fieldset :disabled="busy" class="mt-8 space-y-5 disabled:opacity-60">
          <label class="block space-y-2"><span class="eyebrow text-muted">Email</span><input v-model="email" type="email" autocomplete="email" class="field" required></label>
          <label class="block space-y-2"><span class="eyebrow text-muted">Password</span><input v-model="password" type="password" autocomplete="current-password" class="field" required></label>
          <button type="submit" class="button-primary w-full cursor-pointer">{{ busy ? 'Memeriksa…' : 'Masuk ke admin' }}</button>
        </fieldset>
      </form>
    </section>
  </main>
</template>
