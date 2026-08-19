<script setup lang="ts">
import AdminToast from '~/components/admin/AdminToast.vue'

const client = useSupabaseClient()
const user = useSupabaseUser()
const mobileMenuOpen = ref(false)

async function logout() {
  await client.auth.signOut()
  await navigateTo('/admin/login')
}
</script>

<template>
  <div class="min-h-screen bg-[#edeae4] text-ink font-body selection:bg-signal selection:text-white flex flex-col lg:flex-row">
    <!-- Desktop Sidebar -->
    <aside class="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 lg:z-40 border-r border-ink/10 bg-paper justify-between p-6 overflow-y-auto">
      <!-- Top Brand & Navigation -->
      <div class="space-y-8">
        <!-- Logo & Studio Tag -->
        <div class="flex items-center justify-between border-b border-ink/10 pb-5">
          <NuxtLink to="/admin/projects" class="group flex items-center gap-2.5">
            <SiteLogo />
            <span class="rounded-full bg-ink/5 px-2.5 py-0.5 font-mono text-[0.65rem] font-bold uppercase tracking-wider text-mute">
              Studio
            </span>
          </NuxtLink>
        </div>

        <!-- Navigation Menu -->
        <div class="space-y-1.5 font-mono text-xs uppercase tracking-wider">
          <span class="block px-3 pb-2 text-[0.68rem] font-bold text-mute/80 tracking-widest">
            Menu Utama
          </span>

          <NuxtLink
            to="/admin/projects"
            class="flex items-center justify-between rounded-2xl px-4 py-3 font-semibold text-mute transition-all hover:bg-ink/5 hover:text-ink"
            active-class="!bg-ink !text-paper !font-bold shadow-xs"
          >
            <span>Projects</span>
            <span class="size-1.5 rounded-full bg-signal" />
          </NuxtLink>

          <NuxtLink
            to="/admin/seo"
            class="flex items-center justify-between rounded-2xl px-4 py-3 font-semibold text-mute transition-all hover:bg-ink/5 hover:text-ink"
            active-class="!bg-ink !text-paper !font-bold shadow-xs"
          >
            <span>SEO Center</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/media"
            class="flex items-center justify-between rounded-2xl px-4 py-3 font-semibold text-mute transition-all hover:bg-ink/5 hover:text-ink"
            active-class="!bg-ink !text-paper !font-bold shadow-xs"
          >
            <span>Media Library</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/settings"
            class="flex items-center justify-between rounded-2xl px-4 py-3 font-semibold text-mute transition-all hover:bg-ink/5 hover:text-ink"
            active-class="!bg-ink !text-paper !font-bold shadow-xs"
          >
            <span>Pengaturan</span>
          </NuxtLink>
        </div>

        <!-- Quick Links -->
        <div class="space-y-1.5 font-mono text-xs uppercase tracking-wider pt-4 border-t border-ink/10">
          <span class="block px-3 pb-2 text-[0.68rem] font-bold text-mute/80 tracking-widest">
            Akses Web
          </span>
          <NuxtLink
            to="/"
            target="_blank"
            class="flex items-center justify-between rounded-2xl px-4 py-2.5 text-mute hover:text-signal hover:bg-signal/5 transition-all"
          >
            <span>Lihat Website</span>
            <span class="font-bold">↗</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Bottom User & Logout -->
      <div class="border-t border-ink/10 pt-5 space-y-3 font-mono text-xs">
        <div class="rounded-2xl bg-ink/5 p-3 space-y-1">
          <div class="flex items-center gap-2">
            <span class="size-1.5 rounded-full bg-emerald-500" />
            <span class="text-[0.68rem] text-mute uppercase font-bold tracking-wider">Admin Aktif</span>
          </div>
          <p class="truncate text-[0.75rem] font-bold text-ink" :title="user?.email">
            {{ user?.email }}
          </p>
        </div>

        <button
          type="button"
          class="w-full flex items-center justify-center rounded-full bg-ink/5 hover:bg-signal/15 hover:text-signal py-2.5 font-bold uppercase tracking-wider text-mute transition-colors cursor-pointer"
          @click="logout"
        >
          Keluar ↗
        </button>
      </div>
    </aside>

    <!-- Mobile Header -->
    <header class="lg:hidden sticky top-0 z-40 border-b border-ink/10 bg-paper/95 backdrop-blur-md px-4 py-3">
      <div class="flex items-center justify-between">
        <NuxtLink to="/admin/projects" class="flex items-center gap-2">
          <SiteLogo />
          <span class="rounded-full bg-ink/5 px-2 py-0.5 font-mono text-[0.65rem] font-bold uppercase text-mute">
            Studio
          </span>
        </NuxtLink>

        <button
          type="button"
          class="rounded-xl bg-ink/5 px-3 py-1.5 font-mono text-xs font-bold uppercase text-ink cursor-pointer"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          {{ mobileMenuOpen ? 'Tutup' : 'Menu' }}
        </button>
      </div>

      <!-- Mobile Dropdown Menu -->
      <div v-show="mobileMenuOpen" class="mt-3 pt-3 border-t border-ink/10 space-y-2 font-mono text-xs uppercase tracking-wider">
        <NuxtLink
          to="/admin/projects"
          class="block rounded-xl px-3 py-2 text-mute hover:text-ink"
          active-class="!bg-ink !text-paper !font-bold"
          @click="mobileMenuOpen = false"
        >
          Projects
        </NuxtLink>
        <NuxtLink
          to="/admin/seo"
          class="block rounded-xl px-3 py-2 text-mute hover:text-ink"
          active-class="!bg-ink !text-paper !font-bold"
          @click="mobileMenuOpen = false"
        >
          SEO Center
        </NuxtLink>
        <NuxtLink
          to="/admin/media"
          class="block rounded-xl px-3 py-2 text-mute hover:text-ink"
          active-class="!bg-ink !text-paper !font-bold"
          @click="mobileMenuOpen = false"
        >
          Media Library
        </NuxtLink>
        <NuxtLink
          to="/admin/settings"
          class="block rounded-xl px-3 py-2 text-mute hover:text-ink"
          active-class="!bg-ink !text-paper !font-bold"
          @click="mobileMenuOpen = false"
        >
          Pengaturan
        </NuxtLink>
        <div class="pt-2 border-t border-ink/10 flex items-center justify-between">
          <NuxtLink to="/" target="_blank" class="text-signal py-1">
            Lihat Web ↗
          </NuxtLink>
          <button type="button" class="text-mute hover:text-signal" @click="logout">
            Keluar ↗
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <div class="flex-1 lg:pl-72 flex flex-col min-w-0">
      <main class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        <slot />
      </main>
    </div>

    <!-- Global Toast Container -->
    <AdminToast />
  </div>
</template>
