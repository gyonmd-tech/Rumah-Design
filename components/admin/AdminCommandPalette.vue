<script setup lang="ts">
import type { Database, Project } from '~/types/database.types'

const isOpen = ref(false)
const query = ref('')
const selectedIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)

const client = useSupabaseClient<Database>()
const router = useRouter()

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
  icon: string
  category: 'Halaman' | 'Project' | 'Aksi Cepat'
  action: () => void | Promise<void>
}

const staticActions: CommandAction[] = [
  {
    id: 'nav-projects',
    title: 'Manajemen Projects',
    subtitle: 'Katalog dan manajemen portofolio',
    icon: '📁',
    category: 'Halaman',
    action: () => navigateTo('/admin/projects'),
  },
  {
    id: 'nav-new-project',
    title: 'Tambah Project Baru',
    subtitle: 'Buka form editor untuk project baru',
    icon: '➕',
    category: 'Aksi Cepat',
    action: () => navigateTo('/admin/projects/new'),
  },
  {
    id: 'nav-seo',
    title: 'SEO Health Center',
    subtitle: 'Audit SEO & skor kualitas metadata',
    icon: '⚡',
    category: 'Halaman',
    action: () => navigateTo('/admin/seo'),
  },
  {
    id: 'nav-media',
    title: 'Media Library',
    subtitle: 'Pengelola file dan bucket storage',
    icon: '🖼️',
    category: 'Halaman',
    action: () => navigateTo('/admin/media'),
  },
  {
    id: 'nav-settings',
    title: 'Pengaturan Platform',
    subtitle: 'Identitas, SEO global, dan diagnostik',
    icon: '⚙️',
    category: 'Halaman',
    action: () => navigateTo('/admin/settings'),
  },
  {
    id: 'act-view-site',
    title: 'Lihat Website Publik',
    subtitle: 'Buka beranda di tab baru',
    icon: '↗',
    category: 'Aksi Cepat',
    action: () => window.open('/', '_blank'),
  },
  {
    id: 'act-view-sitemap',
    title: 'Buka sitemap.xml',
    subtitle: 'Periksa daftar URL indeks mesin pencari',
    icon: '🗺️',
    category: 'Aksi Cepat',
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
          subtitle: `/${p.slug} · [${p.category}] · ${p.status.toUpperCase()}`,
          icon: p.status === 'published' ? '🟢' : '⚪',
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
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:pt-20 bg-void/75 backdrop-blur-sm font-sans"
        role="dialog"
        aria-modal="true"
        @click.self="closePalette"
      >
        <div
          class="w-full max-w-2xl overflow-hidden rounded-3xl bg-paper text-ink shadow-2xl border border-ink/15 transform transition-all flex flex-col max-h-[85vh] sm:max-h-[75vh]"
        >
          <!-- Search Header Input -->
          <div class="relative flex items-center border-b border-ink/10 px-4 sm:px-5 py-3.5 bg-white/90">
            <span class="text-mute font-mono text-base mr-3">🔍</span>
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              class="w-full bg-transparent font-sans text-sm sm:text-base text-ink placeholder-mute focus:outline-hidden"
              placeholder="Ketik rute, judul project, atau aksi (mis. Projects, SEO, Media)..."
            >
            <button
              type="button"
              class="rounded-full bg-ink/5 px-2.5 py-1 font-mono text-[0.65rem] font-bold text-mute uppercase hover:bg-ink/10"
              @click="closePalette"
            >
              ESC
            </button>
          </div>

          <!-- Results Scroll Area -->
          <div class="overflow-y-auto p-2 sm:p-3 space-y-1 flex-1">
            <div v-if="!filteredResults.length" class="py-10 text-center text-mute font-mono text-xs">
              Tidak ada hasil untuk "{{ query }}"
            </div>

            <button
              v-for="(item, idx) in filteredResults"
              :key="item.id"
              type="button"
              class="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl text-left transition-all cursor-pointer group"
              :class="idx === selectedIndex ? 'bg-ink text-paper font-semibold shadow-xs' : 'hover:bg-ink/5 text-ink'"
              @mouseenter="selectedIndex = idx"
              @click="executeAction(item)"
            >
              <div class="flex items-center gap-3 min-w-0">
                <span class="flex size-8 shrink-0 items-center justify-center rounded-xl bg-ink/5 group-hover:bg-ink/10 text-sm" :class="idx === selectedIndex ? '!bg-paper/20 !text-paper' : ''">
                  {{ item.icon }}
                </span>
                <div class="min-w-0">
                  <p class="truncate text-xs sm:text-sm font-semibold" :class="idx === selectedIndex ? 'text-paper' : 'text-ink'">
                    {{ item.title }}
                  </p>
                  <p v-if="item.subtitle" class="truncate text-[0.68rem] sm:text-xs font-mono" :class="idx === selectedIndex ? 'text-paper/70' : 'text-mute'">
                    {{ item.subtitle }}
                  </p>
                </div>
              </div>

              <div class="shrink-0 flex items-center gap-2">
                <span class="rounded-full px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-wider" :class="idx === selectedIndex ? 'bg-paper/20 text-paper' : 'bg-ink/5 text-mute'">
                  {{ item.category }}
                </span>
                <span v-if="idx === selectedIndex" class="font-mono text-xs opacity-80">↵</span>
              </div>
            </button>
          </div>

          <!-- Footer Hints -->
          <div class="flex items-center justify-between border-t border-ink/10 bg-white/70 px-4 py-2.5 font-mono text-[0.65rem] text-mute">
            <div class="flex items-center gap-3">
              <span><kbd class="rounded bg-ink/10 px-1 py-0.5 font-bold">↑↓</kbd> Navigasi</span>
              <span><kbd class="rounded bg-ink/10 px-1 py-0.5 font-bold">↵</kbd> Buka</span>
              <span><kbd class="rounded bg-ink/10 px-1 py-0.5 font-bold">ESC</kbd> Tutup</span>
            </div>
            <span class="hidden sm:inline">Rumah Design Command Studio</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
