<script setup lang="ts">
import AdminCommandPalette from '~/components/admin/AdminCommandPalette.vue'
import AdminIcon from '~/components/admin/AdminIcon.vue'
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

// User initial for avatar
const userInitial = computed(() => {
  if (!user.value?.email) return 'A'
  return user.value.email.charAt(0).toUpperCase()
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
    <!-- Desktop Sidebar (Dark Studio Aesthetic) -->
    <aside class="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 lg:z-40 border-r border-ink/12 bg-[#0d0c0b] text-[#f5f3ef] justify-between p-6 shadow-2xl">
      <!-- Top Brand & Navigation -->
      <div class="space-y-6">
        <!-- Logo & Studio Tag & Status Radar -->
        <div class="border-b border-white/[0.08] pb-5 space-y-3.5">
          <div class="flex items-center justify-between gap-2 min-w-0">
            <NuxtLink to="/admin/projects" class="group flex items-center gap-2 min-w-0 shrink">
              <SiteLogo :dark="true" class="shrink-0" />
              <span class="rounded-full bg-white/[0.08] border border-white/[0.08] px-2 py-0.5 font-mono text-[0.6rem] font-bold uppercase tracking-wider text-[#8a8478] group-hover:text-white transition-colors truncate">
                Studio
              </span>
            </NuxtLink>

            <span class="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-950/80 px-2 py-0.5 font-mono text-[0.6rem] font-bold text-emerald-400 border border-emerald-500/30">
              <span class="size-1.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
              <span class="size-1.5 -ml-2.5 rounded-full bg-emerald-400 relative" />
              <span>LIVE</span>
            </span>
          </div>

          <!-- Quick Command Trigger Button -->
          <button
            type="button"
            class="w-full flex items-center justify-between rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] px-3 py-2 font-mono text-xs text-[#8a8478] hover:text-white transition-all cursor-pointer group"
            @click="openCommandPalette"
          >
            <span class="flex items-center gap-2">
              <AdminIcon name="search" size="13" class="text-[#8a8478] group-hover:text-white transition-colors" />
              <span class="text-[0.72rem] tracking-wide">Cari atau perintah...</span>
            </span>
            <kbd class="rounded bg-white/[0.08] border border-white/[0.08] px-1.5 py-0.5 text-[0.62rem] font-bold text-white/70 group-hover:text-white transition-all">
              ⌘K
            </kbd>
          </button>
        </div>

        <!-- Navigation Menu -->
        <nav class="space-y-1 font-mono text-xs uppercase tracking-wider" aria-label="Navigasi Admin">
          <span class="block px-3 pb-1.5 text-[0.65rem] font-bold text-[#8a8478]/80 tracking-widest">
            Workspace
          </span>

          <NuxtLink
            to="/admin/projects"
            class="group flex items-center justify-between rounded-xl px-3.5 py-2.5 font-semibold text-[#8a8478] transition-all hover:bg-white/[0.06] hover:text-white"
            active-class="!bg-white/[0.12] !text-white !font-bold border border-white/10 shadow-xs"
          >
            <span class="flex items-center gap-2.5">
              <AdminIcon name="projects" size="15" class="transition-transform group-hover:scale-110" />
              <span class="text-[0.75rem]">Projects</span>
            </span>
            <span class="size-1.5 rounded-full bg-signal" />
          </NuxtLink>

          <NuxtLink
            to="/admin/seo"
            class="group flex items-center justify-between rounded-xl px-3.5 py-2.5 font-semibold text-[#8a8478] transition-all hover:bg-white/[0.06] hover:text-white"
            active-class="!bg-white/[0.12] !text-white !font-bold border border-white/10 shadow-xs"
          >
            <span class="flex items-center gap-2.5">
              <AdminIcon name="seo" size="15" class="transition-transform group-hover:scale-110" />
              <span class="text-[0.75rem]">SEO Center</span>
            </span>
          </NuxtLink>

          <NuxtLink
            to="/admin/media"
            class="group flex items-center justify-between rounded-xl px-3.5 py-2.5 font-semibold text-[#8a8478] transition-all hover:bg-white/[0.06] hover:text-white"
            active-class="!bg-white/[0.12] !text-white !font-bold border border-white/10 shadow-xs"
          >
            <span class="flex items-center gap-2.5">
              <AdminIcon name="media" size="15" class="transition-transform group-hover:scale-110" />
              <span class="text-[0.75rem]">Media Library</span>
            </span>
          </NuxtLink>

          <NuxtLink
            to="/admin/settings"
            class="group flex items-center justify-between rounded-xl px-3.5 py-2.5 font-semibold text-[#8a8478] transition-all hover:bg-white/[0.06] hover:text-white"
            active-class="!bg-white/[0.12] !text-white !font-bold border border-white/10 shadow-xs"
          >
            <span class="flex items-center gap-2.5">
              <AdminIcon name="settings" size="15" class="transition-transform group-hover:scale-110" />
              <span class="text-[0.75rem]">Pengaturan</span>
            </span>
          </NuxtLink>
        </nav>

        <!-- External Quick Links -->
        <div class="space-y-1 font-mono text-xs uppercase tracking-wider pt-4 border-t border-white/[0.08]">
          <span class="block px-3 pb-1.5 text-[0.65rem] font-bold text-[#8a8478]/80 tracking-widest">
            Akses Publik
          </span>
          <NuxtLink
            to="/"
            target="_blank"
            class="flex items-center justify-between rounded-xl px-3.5 py-2 text-[#8a8478] hover:text-signal hover:bg-signal/10 transition-all text-[0.72rem]"
          >
            <span class="flex items-center gap-2">
              <AdminIcon name="globe" size="13" />
              <span>Lihat Website</span>
            </span>
            <AdminIcon name="external" size="12" class="text-signal" />
          </NuxtLink>

          <NuxtLink
            to="/sitemap.xml"
            target="_blank"
            class="flex items-center justify-between rounded-xl px-3.5 py-2 text-[#8a8478] hover:text-signal hover:bg-signal/10 transition-all text-[0.72rem]"
          >
            <span class="flex items-center gap-2">
              <AdminIcon name="sitemap" size="13" />
              <span>Sitemap.xml</span>
            </span>
            <AdminIcon name="external" size="12" class="text-signal" />
          </NuxtLink>
        </div>
      </div>

      <!-- Bottom User Profile & Logout -->
      <div class="border-t border-white/[0.08] pt-4 space-y-3 font-mono text-xs">
        <div class="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-3 flex items-center gap-3">
          <div class="size-8 rounded-xl bg-signal/20 border border-signal/40 flex items-center justify-center text-signal font-bold text-xs shrink-0">
            {{ userInitial }}
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between">
              <span class="text-[0.62rem] text-[#8a8478] uppercase font-bold tracking-wider">Super Admin</span>
              <span class="text-[0.58rem] font-mono text-emerald-400">SSR</span>
            </div>
            <p class="truncate text-[0.72rem] font-semibold text-white/90" :title="user?.email">
              {{ user?.email || 'Admin User' }}
            </p>
          </div>
        </div>

        <button
          type="button"
          class="w-full flex items-center justify-center gap-2 rounded-xl bg-white/[0.04] hover:bg-rose-950/40 hover:text-rose-300 hover:border-rose-500/30 border border-white/[0.08] py-2.5 font-bold uppercase tracking-wider text-[#8a8478] transition-all cursor-pointer text-xs"
          @click="logout"
        >
          <AdminIcon name="logout" size="14" />
          <span>Keluar Portal</span>
        </button>
      </div>
    </aside>

    <!-- Mobile Top Header & Navigation Drawer -->
    <header class="lg:hidden sticky top-0 z-40 border-b border-ink/10 bg-[#0d0c0b] text-white px-4 py-3 shadow-md">
      <div class="flex items-center justify-between">
        <NuxtLink to="/admin/projects" class="flex items-center gap-2">
          <SiteLogo :dark="true" />
          <span class="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[0.65rem] font-bold uppercase text-white/80">
            Studio
          </span>
        </NuxtLink>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="flex items-center justify-center size-8 rounded-full bg-white/10 text-white cursor-pointer hover:bg-white/20"
            title="Command Palette"
            @click="openCommandPalette"
          >
            <AdminIcon name="search" size="14" />
          </button>
          <button
            type="button"
            class="flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 px-3.5 py-1.5 font-mono text-xs font-bold uppercase text-white transition-all cursor-pointer"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <AdminIcon :name="mobileMenuOpen ? 'close' : 'list'" size="14" />
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
        <div v-show="mobileMenuOpen" class="mt-3 pt-3 border-t border-white/10 space-y-1.5 font-mono text-xs uppercase tracking-wider">
          <NuxtLink
            to="/admin/projects"
            class="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-white/70 hover:bg-white/10 hover:text-white font-semibold"
            active-class="!bg-white/20 !text-white !font-bold"
            @click="mobileMenuOpen = false"
          >
            <span class="flex items-center gap-2">
              <AdminIcon name="projects" size="14" />
              <span>Projects</span>
            </span>
            <span class="size-1.5 rounded-full bg-signal" />
          </NuxtLink>

          <NuxtLink
            to="/admin/seo"
            class="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-white/70 hover:bg-white/10 hover:text-white font-semibold"
            active-class="!bg-white/20 !text-white !font-bold"
            @click="mobileMenuOpen = false"
          >
            <span class="flex items-center gap-2">
              <AdminIcon name="seo" size="14" />
              <span>SEO Center</span>
            </span>
          </NuxtLink>

          <NuxtLink
            to="/admin/media"
            class="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-white/70 hover:bg-white/10 hover:text-white font-semibold"
            active-class="!bg-white/20 !text-white !font-bold"
            @click="mobileMenuOpen = false"
          >
            <span class="flex items-center gap-2">
              <AdminIcon name="media" size="14" />
              <span>Media Library</span>
            </span>
          </NuxtLink>

          <NuxtLink
            to="/admin/settings"
            class="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-white/70 hover:bg-white/10 hover:text-white font-semibold"
            active-class="!bg-white/20 !text-white !font-bold"
            @click="mobileMenuOpen = false"
          >
            <span class="flex items-center gap-2">
              <AdminIcon name="settings" size="14" />
              <span>Pengaturan</span>
            </span>
          </NuxtLink>

          <!-- User session info in mobile menu -->
          <div class="pt-3 pb-1 border-t border-white/10 space-y-2">
            <div class="flex items-center justify-between text-[0.72rem] text-white/60 px-1">
              <span class="truncate max-w-[200px]">{{ user?.email }}</span>
              <span class="size-1.5 rounded-full bg-emerald-400" />
            </div>

            <div class="flex items-center justify-between pt-1 font-bold">
              <NuxtLink to="/" target="_blank" class="rounded-full bg-white/10 hover:bg-signal/20 hover:text-signal px-3 py-1 text-signal text-[0.72rem] flex items-center gap-1">
                <span>Lihat Web</span>
                <AdminIcon name="external" size="10" />
              </NuxtLink>
              <button type="button" class="rounded-full bg-rose-950/60 text-rose-300 hover:bg-rose-900 px-3 py-1 text-[0.72rem] cursor-pointer transition-colors" @click="logout">
                Keluar ↗
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </header>

    <!-- Main Content Area -->
    <div class="flex-1 lg:pl-72 flex flex-col min-w-0">
      <!-- Top Sub-Header Bar (Desktop) -->
      <header class="hidden lg:flex items-center justify-between border-b border-ink/10 bg-[#edeae4]/80 backdrop-blur-md px-8 py-3 sticky top-0 z-30">
        <div class="flex items-center gap-2 font-mono text-xs text-mute">
          <NuxtLink to="/admin/projects" class="hover:text-ink transition-colors">Studio</NuxtLink>
          <span class="text-mute/40">/</span>
          <span class="text-ink font-bold">{{ currentTitle }}</span>
        </div>

        <div class="flex items-center gap-3">
          <button
            type="button"
            class="flex items-center gap-2 rounded-full bg-white/80 hover:bg-white border border-ink/10 px-3.5 py-1.5 font-mono text-xs text-mute hover:text-ink transition-all cursor-pointer shadow-2xs"
            @click="openCommandPalette"
          >
            <AdminIcon name="search" size="12" class="text-mute" />
            <span>Pencarian Cepat</span>
            <kbd class="rounded bg-ink/5 px-1.5 py-0.5 text-[0.62rem] font-bold border border-ink/10">⌘K</kbd>
          </button>
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
