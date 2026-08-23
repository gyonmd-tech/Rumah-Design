<script setup lang="ts">
import AdminCommandPalette from '~/components/admin/AdminCommandPalette.vue'
import AdminToast from '~/components/admin/AdminToast.vue'

const client = useSupabaseClient()
const user = useSupabaseUser()
const route = useRoute()
const mobileMenuOpen = ref(false)
const commandPaletteRef = ref<{ open: () => void } | null>(null)

// Current section title for breadcrumb
const currentTitle = computed(() => {
  if (route.path.startsWith('/admin/projects/new')) return 'Tambah Project Baru'
  if (route.path.includes('/edit')) return 'Edit Project'
  if (route.path.startsWith('/admin/projects')) return 'Manajemen Projects'
  if (route.path.startsWith('/admin/seo')) return 'SEO Health Center'
  if (route.path.startsWith('/admin/media')) return 'Media Library'
  if (route.path.startsWith('/admin/settings')) return 'Pengaturan Platform'
  return 'Dashboard'
})

async function logout() {
  await client.auth.signOut()
  await navigateTo('/admin/login')
}

function openCommandPalette() {
  commandPaletteRef.value?.open()
}
</script>

<template>
  <div class="min-h-screen bg-[#edeae4] text-ink font-body selection:bg-signal selection:text-white flex flex-col lg:flex-row">
    <!-- Desktop Sidebar -->
    <aside class="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 lg:z-40 border-r border-ink/10 bg-paper justify-between p-6">
      <!-- Top Brand & Navigation Section -->
      <div class="space-y-7">
        <!-- Logo & Studio Tag & Status -->
        <div class="border-b border-ink/10 pb-5 space-y-3">
          <div class="flex items-center justify-between">
            <NuxtLink to="/admin/projects" class="group flex items-center gap-2.5">
              <SiteLogo />
              <span class="rounded-full bg-ink/5 px-2.5 py-0.5 font-mono text-[0.65rem] font-bold uppercase tracking-wider text-mute group-hover:bg-ink group-hover:text-paper transition-all">
                Studio
              </span>
            </NuxtLink>

            <span class="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[0.62rem] font-bold text-emerald-700 border border-emerald-200">
              <span class="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE</span>
            </span>
          </div>

          <!-- Quick Command Trigger Button -->
          <button
            type="button"
            class="w-full flex items-center justify-between rounded-2xl bg-ink/5 hover:bg-ink/10 px-3.5 py-2 font-mono text-xs text-mute transition-all cursor-pointer group"
            @click="openCommandPalette"
          >
            <span class="flex items-center gap-2">
              <span class="text-xs">🔍</span>
              <span class="text-[0.72rem] font-medium text-ink/80">Cari / Perintah</span>
            </span>
            <kbd class="rounded-lg bg-ink/10 px-2 py-0.5 text-[0.65rem] font-bold text-ink/70 group-hover:bg-ink group-hover:text-paper transition-all">
              ⌘K
            </kbd>
          </button>
        </div>

        <!-- Navigation Menu -->
        <nav class="space-y-1.5 font-mono text-xs uppercase tracking-wider" aria-label="Navigasi Admin">
          <span class="block px-3 pb-1 text-[0.68rem] font-bold text-mute/70 tracking-widest">
            Workspace Studio
          </span>

          <NuxtLink
            to="/admin/projects"
            class="flex items-center justify-between rounded-2xl px-4 py-3 font-semibold text-mute transition-all hover:bg-ink/5 hover:text-ink"
            active-class="!bg-ink !text-paper !font-bold shadow-xs"
          >
            <span class="flex items-center gap-2.5">
              <span>📁</span>
              <span>Projects</span>
            </span>
            <span class="size-1.5 rounded-full bg-signal" />
          </NuxtLink>

          <NuxtLink
            to="/admin/seo"
            class="flex items-center justify-between rounded-2xl px-4 py-3 font-semibold text-mute transition-all hover:bg-ink/5 hover:text-ink"
            active-class="!bg-ink !text-paper !font-bold shadow-xs"
          >
            <span class="flex items-center gap-2.5">
              <span>⚡</span>
              <span>SEO Center</span>
            </span>
          </NuxtLink>

          <NuxtLink
            to="/admin/media"
            class="flex items-center justify-between rounded-2xl px-4 py-3 font-semibold text-mute transition-all hover:bg-ink/5 hover:text-ink"
            active-class="!bg-ink !text-paper !font-bold shadow-xs"
          >
            <span class="flex items-center gap-2.5">
              <span>🖼️</span>
              <span>Media Library</span>
            </span>
          </NuxtLink>

          <NuxtLink
            to="/admin/settings"
            class="flex items-center justify-between rounded-2xl px-4 py-3 font-semibold text-mute transition-all hover:bg-ink/5 hover:text-ink"
            active-class="!bg-ink !text-paper !font-bold shadow-xs"
          >
            <span class="flex items-center gap-2.5">
              <span>⚙️</span>
              <span>Pengaturan</span>
            </span>
          </NuxtLink>
        </nav>

        <!-- External Quick Links -->
        <div class="space-y-1.5 font-mono text-xs uppercase tracking-wider pt-4 border-t border-ink/10">
          <span class="block px-3 pb-1 text-[0.68rem] font-bold text-mute/70 tracking-widest">
            Akses Publik
          </span>
          <NuxtLink
            to="/"
            target="_blank"
            class="flex items-center justify-between rounded-2xl px-4 py-2.5 text-mute hover:text-signal hover:bg-signal/5 transition-all"
          >
            <span>Lihat Website</span>
            <span class="font-bold text-signal">↗</span>
          </NuxtLink>
          <NuxtLink
            to="/sitemap.xml"
            target="_blank"
            class="flex items-center justify-between rounded-2xl px-4 py-2.5 text-mute hover:text-signal hover:bg-signal/5 transition-all"
          >
            <span>Sitemap.xml</span>
            <span class="font-bold text-signal">↗</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Bottom User Profile & Logout -->
      <div class="border-t border-ink/10 pt-5 space-y-3 font-mono text-xs">
        <div class="rounded-2xl bg-ink/5 p-3.5 space-y-1 border border-ink/5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="size-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
              <span class="text-[0.68rem] text-mute uppercase font-bold tracking-wider">Super Admin</span>
            </div>
            <span class="text-[0.62rem] font-mono text-mute">SSR Mode</span>
          </div>
          <p class="truncate text-[0.75rem] font-bold text-ink" :title="user?.email">
            {{ user?.email || 'Admin User' }}
          </p>
        </div>

        <button
          type="button"
          class="w-full flex items-center justify-center gap-1.5 rounded-full bg-ink/5 hover:bg-signal/15 hover:text-signal py-2.5 font-bold uppercase tracking-wider text-mute transition-colors cursor-pointer"
          @click="logout"
        >
          <span>Keluar Portal</span>
          <span class="font-bold">↗</span>
        </button>
      </div>
    </aside>

    <!-- Mobile Top Header & Navigation Drawer -->
    <header class="lg:hidden sticky top-0 z-40 border-b border-ink/10 bg-paper/95 backdrop-blur-md px-4 py-3 shadow-xs">
      <div class="flex items-center justify-between">
        <NuxtLink to="/admin/projects" class="flex items-center gap-2">
          <SiteLogo />
          <span class="rounded-full bg-ink/5 px-2 py-0.5 font-mono text-[0.65rem] font-bold uppercase text-mute">
            Studio
          </span>
        </NuxtLink>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="flex items-center justify-center size-8 rounded-full bg-ink/5 hover:bg-ink/10 text-ink cursor-pointer"
            title="Command Palette"
            @click="openCommandPalette"
          >
            🔍
          </button>
          <button
            type="button"
            class="flex items-center gap-1.5 rounded-full bg-ink/5 hover:bg-ink/10 px-3.5 py-1.5 font-mono text-xs font-bold uppercase text-ink transition-all cursor-pointer active:scale-95"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <span>{{ mobileMenuOpen ? '✕' : '☰' }}</span>
            <span>{{ mobileMenuOpen ? 'Tutup' : 'Menu' }}</span>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Drawer -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-show="mobileMenuOpen" class="mt-3 pt-3 border-t border-ink/10 space-y-1.5 font-mono text-xs uppercase tracking-wider">
          <NuxtLink
            to="/admin/projects"
            class="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-mute hover:bg-ink/5 hover:text-ink font-semibold"
            active-class="!bg-ink !text-paper !font-bold"
            @click="mobileMenuOpen = false"
          >
            <span class="flex items-center gap-2">📁 <span>Projects</span></span>
            <span class="size-1.5 rounded-full bg-signal" />
          </NuxtLink>

          <NuxtLink
            to="/admin/seo"
            class="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-mute hover:bg-ink/5 hover:text-ink font-semibold"
            active-class="!bg-ink !text-paper !font-bold"
            @click="mobileMenuOpen = false"
          >
            <span class="flex items-center gap-2">⚡ <span>SEO Center</span></span>
          </NuxtLink>

          <NuxtLink
            to="/admin/media"
            class="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-mute hover:bg-ink/5 hover:text-ink font-semibold"
            active-class="!bg-ink !text-paper !font-bold"
            @click="mobileMenuOpen = false"
          >
            <span class="flex items-center gap-2">🖼️ <span>Media Library</span></span>
          </NuxtLink>

          <NuxtLink
            to="/admin/settings"
            class="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-mute hover:bg-ink/5 hover:text-ink font-semibold"
            active-class="!bg-ink !text-paper !font-bold"
            @click="mobileMenuOpen = false"
          >
            <span class="flex items-center gap-2">⚙️ <span>Pengaturan</span></span>
          </NuxtLink>

          <!-- User session info in mobile menu -->
          <div class="pt-3 pb-1 border-t border-ink/10 space-y-2">
            <div class="flex items-center justify-between text-[0.72rem] text-mute px-1">
              <span class="truncate max-w-[200px]">{{ user?.email }}</span>
              <span class="size-1.5 rounded-full bg-emerald-500" />
            </div>

            <div class="flex items-center justify-between pt-1 font-bold">
              <NuxtLink to="/" target="_blank" class="rounded-full bg-ink/5 hover:bg-signal/15 hover:text-signal px-3 py-1 text-signal text-[0.72rem]">
                Lihat Web ↗
              </NuxtLink>
              <button type="button" class="rounded-full bg-signal/10 text-signal hover:bg-signal hover:text-white px-3 py-1 text-[0.72rem] cursor-pointer transition-colors" @click="logout">
                Keluar ↗
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </header>

    <!-- Main Content Shell (Fluid root scrolling without overflow locks) -->
    <div class="flex-1 lg:pl-72 flex flex-col min-w-0">
      <!-- Top Sub-Header Bar (Desktop) -->
      <header class="hidden lg:flex items-center justify-between border-b border-ink/10 bg-paper/60 backdrop-blur-md px-8 py-3.5 sticky top-0 z-30">
        <div class="flex items-center gap-2 font-mono text-xs text-mute">
          <NuxtLink to="/admin/projects" class="hover:text-ink transition-colors">Admin</NuxtLink>
          <span>/</span>
          <span class="text-ink font-semibold">{{ currentTitle }}</span>
        </div>

        <div class="flex items-center gap-3">
          <button
            type="button"
            class="flex items-center gap-2 rounded-full bg-ink/5 hover:bg-ink/10 px-3.5 py-1.5 font-mono text-xs text-mute hover:text-ink transition-all cursor-pointer"
            @click="openCommandPalette"
          >
            <span>🔍</span>
            <span>Cari cepat</span>
            <kbd class="rounded bg-ink/10 px-1.5 py-0.5 text-[0.62rem] font-bold">⌘K</kbd>
          </button>

          <NuxtLink
            to="/admin/projects/new"
            class="rounded-full bg-signal text-white hover:bg-[#e63d10] px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-wider shadow-xs transition-all hover:scale-105"
          >
            + New Project
          </NuxtLink>
        </div>
      </header>

      <!-- Slot Main Content -->
      <main class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <slot />
      </main>
    </div>

    <!-- Global Command Palette Modal -->
    <AdminCommandPalette ref="commandPaletteRef" />

    <!-- Global Toast Container -->
    <AdminToast />
  </div>
</template>
