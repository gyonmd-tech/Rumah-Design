<script setup lang="ts">
import AdminIcon from '~/components/admin/AdminIcon.vue'
import type { Database, Project } from '~/types/database.types'

const isOpen = ref(false)
const query = ref('')
const selectedIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)

const client = useSupabaseClient<Database>()

const { data: projects } = await useAsyncData('command-palette-projects', async () => {
  try {
    const { data } = await client
      .from('projects')
      .select('id, title, slug, category, status')
      .order('updated_at', { ascending: false })
      .limit(20)
    return (data as Project[]) ?? []
  }
  catch {
    return []
  }
})

interface CommandAction {
  id: string
  title: string
  subtitle?: string
  iconName: string
  category: 'Workspace' | 'Project' | 'Tautan'
  action: () => unknown | Promise<unknown>
}

const staticActions: CommandAction[] = [
  {
    id: 'nav-projects',
    title: 'Manajemen Projects',
    subtitle: 'Katalog dan manajemen portofolio',
    iconName: 'projects',
    category: 'Workspace',
    action: () => navigateTo('/admin/projects'),
  },
  {
    id: 'nav-new-project',
    title: 'Tambah Project Baru',
    subtitle: 'Buka form editor untuk karya baru',
    iconName: 'plus',
    category: 'Workspace',
    action: () => navigateTo('/admin/projects/new'),
  },
  {
    id: 'nav-seo',
    title: 'SEO Health Center',
    subtitle: 'Audit SEO & skor kualitas metadata',
    iconName: 'seo',
    category: 'Workspace',
    action: () => navigateTo('/admin/seo'),
  },
  {
    id: 'nav-media',
    title: 'Media Library',
    subtitle: 'Pengelola file dan bucket storage',
    iconName: 'media',
    category: 'Workspace',
    action: () => navigateTo('/admin/media'),
  },
  {
    id: 'nav-settings',
    title: 'Pengaturan Platform',
    subtitle: 'Identitas, SEO global, dan diagnostik',
    iconName: 'settings',
    category: 'Workspace',
    action: () => navigateTo('/admin/settings'),
  },
  {
    id: 'act-view-site',
    title: 'Buka Website Publik',
    subtitle: 'Lihat beranda live di tab baru',
    iconName: 'globe',
    category: 'Tautan',
    action: () => window.open('/', '_blank'),
  },
  {
    id: 'act-view-sitemap',
    title: 'Buka sitemap.xml',
    subtitle: 'Daftar URL indeks mesin pencari',
    iconName: 'sitemap',
    category: 'Tautan',
    action: () => window.open('/sitemap.xml', '_blank'),
  },
]

const filteredResults = computed(() => {
  const q = query.value.trim().toLowerCase()
  const list: CommandAction[] = []

  // Static commands filter
  staticActions.forEach((item) => {
    if (!q || item.title.toLowerCase().includes(q) || item.subtitle?.toLowerCase().includes(q)) {
      list.push(item)
    }
  })

  // Projects filter
  if (projects.value?.length) {
    projects.value.forEach((p) => {
      if (!q || p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) {
        list.push({
          id: `project-${p.id}`,
          title: p.title,
          subtitle: `/project/${p.slug} · [${p.category}] · ${p.status.toUpperCase()}`,
          iconName: 'projects',
          category: 'Project',
          action: () => navigateTo(`/admin/projects/${p.id}/edit`),
        })
      }
    })
  }

  return list
})

function openPalette() {
  isOpen.value = true
  query.value = ''
  selectedIndex.value = 0
  nextTick(() => {
    inputRef.value?.focus()
  })
}

function closePalette() {
  isOpen.value = false
  query.value = ''
}

async function executeAction(item: CommandAction) {
  closePalette()
  await item.action()
}

function onKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    if (isOpen.value) closePalette()
    else openPalette()
    return
  }

  if (!isOpen.value) return

  if (e.key === 'Escape') {
    closePalette()
  }
  else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (filteredResults.value.length > 0) {
      selectedIndex.value = (selectedIndex.value + 1) % filteredResults.value.length
    }
  }
  else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (filteredResults.value.length > 0) {
      selectedIndex.value = (selectedIndex.value - 1 + filteredResults.value.length) % filteredResults.value.length
    }
  }
  else if (e.key === 'Enter') {
    e.preventDefault()
    const target = filteredResults.value[selectedIndex.value]
    if (target) {
      executeAction(target)
    }
  }
}

watch(query, () => {
  selectedIndex.value = 0
})

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})

defineExpose({
  open: openPalette,
  close: closePalette,
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-98"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-98"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:pt-24 bg-black/70 backdrop-blur-md font-sans"
        role="dialog"
        aria-modal="true"
        @click.self="closePalette"
      >
        <div
          class="w-full max-w-2xl overflow-hidden rounded-2xl bg-[#0b1020] text-[#f5f3ef] shadow-2xl border border-white/[0.12] transform transition-all flex flex-col max-h-[85vh] sm:max-h-[70vh]"
        >
          <!-- Search Header Input -->
          <div class="relative flex items-center border-b border-white/[0.08] px-4 sm:px-5 py-3.5 bg-white/[0.02]">
            <AdminIcon name="search" size="16" class="text-[#8a8478] mr-3.5" />
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              class="w-full bg-transparent font-sans text-sm sm:text-base text-[#f5f3ef] placeholder-[#8a8478] focus:outline-hidden"
              placeholder="Cari rute studio, judul project, atau aksi cepat..."
            >
            <button
              type="button"
              class="rounded-lg bg-white/[0.08] border border-white/[0.08] px-2 py-0.5 font-mono text-[0.62rem] font-bold text-[#8a8478] uppercase hover:text-white transition-colors cursor-pointer"
              @click="closePalette"
            >
              ESC
            </button>
          </div>

          <!-- Results Scroll Area -->
          <div class="overflow-y-auto p-2 sm:p-2.5 space-y-1 flex-1">
            <div v-if="!filteredResults.length" class="py-12 text-center text-[#8a8478] font-mono text-xs">
              Tidak ada hasil untuk "{{ query }}"
            </div>

            <button
              v-for="(item, idx) in filteredResults"
              :key="item.id"
              type="button"
              class="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer group"
              :class="idx === selectedIndex ? 'bg-white/[0.1] text-white font-semibold' : 'hover:bg-white/[0.04] text-[#8a8478]'"
              @mouseenter="selectedIndex = idx"
              @click="executeAction(item)"
            >
              <div class="flex items-center gap-3 min-w-0">
                <span
                  class="flex size-7 shrink-0 items-center justify-center rounded-lg border transition-colors"
                  :class="idx === selectedIndex ? 'bg-signal/20 border-signal/40 text-signal' : 'bg-white/[0.04] border-white/[0.08] text-[#8a8478] group-hover:text-white'"
                >
                  <AdminIcon :name="item.iconName" size="13" />
                </span>
                <div class="min-w-0">
                  <p class="truncate text-xs sm:text-sm font-semibold" :class="idx === selectedIndex ? 'text-white' : 'text-[#f5f3ef]/90'">
                    {{ item.title }}
                  </p>
                  <p v-if="item.subtitle" class="truncate text-[0.68rem] font-mono" :class="idx === selectedIndex ? 'text-[#f5f3ef]/60' : 'text-[#8a8478]'">
                    {{ item.subtitle }}
                  </p>
                </div>
              </div>

              <div class="shrink-0 flex items-center gap-2">
                <span
                  class="rounded-md px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider border"
                  :class="idx === selectedIndex ? 'bg-white/[0.12] text-white border-white/20' : 'bg-white/[0.04] text-[#8a8478] border-white/[0.06]'"
                >
                  {{ item.category }}
                </span>
                <span v-if="idx === selectedIndex" class="font-mono text-xs text-signal">↵</span>
              </div>
            </button>
          </div>

          <!-- Footer Hints -->
          <div class="flex items-center justify-between border-t border-white/[0.08] bg-black/40 px-4 py-2 font-mono text-[0.65rem] text-[#8a8478]">
            <div class="flex items-center gap-3">
              <span><kbd class="rounded bg-white/[0.08] border border-white/[0.08] px-1.5 py-0.5 font-bold text-white/70">↑↓</kbd> Navigasi</span>
              <span><kbd class="rounded bg-white/[0.08] border border-white/[0.08] px-1.5 py-0.5 font-bold text-white/70">↵</kbd> Pilih</span>
              <span><kbd class="rounded bg-white/[0.08] border border-white/[0.08] px-1.5 py-0.5 font-bold text-white/70">ESC</kbd> Tutup</span>
            </div>
            <span class="hidden sm:inline">Hygione Darriyan Command Studio</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
