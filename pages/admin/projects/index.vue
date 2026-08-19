<script setup lang="ts">
import AdminModal from '~/components/admin/AdminModal.vue'
import type { Database, Project, ProjectCategory, ProjectStatus } from '~/types/database.types'
import { PROJECT_CATEGORIES, categoryLabel } from '~/utils/project'
import { analyzeSeoQuality } from '~/utils/seo'

definePageMeta({ middleware: 'admin', layout: 'admin' })
useSeoMeta({ title: 'Projects Studio — Admin Rumah Design', robots: 'noindex, nofollow' })

const client = useSupabaseClient<Database>()
const { toggleProjectStatus, deleteProject } = useProjectAdmin()
const { success, error: toastError, info } = useToast()

const searchQuery = ref('')
const selectedCategory = ref<string>('all')
const selectedStatus = ref<string>('all')
const sortBy = ref<'updated_desc' | 'updated_asc' | 'title_asc'>('updated_desc')

// Modal state
const projectToDelete = ref<Project | null>(null)
const isDeleting = ref(false)

const { data: projects, status, refresh } = await useAsyncData('admin-projects', async () => {
  const { data, error } = await client
    .from('projects')
    .select('*')
    .order('updated_at', { ascending: false })
  if (error) throw error
  return (data as Project[]) ?? []
})

// Calculate Stats & SEO metrics
const stats = computed(() => {
  const list = projects.value || []
  const total = list.length
  const published = list.filter(p => p.status === 'published').length
  const draft = list.filter(p => p.status === 'draft').length

  const scores = list.map((p) => {
    const analysis = analyzeSeoQuality({
      title: p.title,
      slug: p.slug,
      description: p.description,
      seoTitle: p.seo_title,
      seoDescription: p.seo_description,
      focusKeyword: p.focus_keyword,
      liveUrl: p.live_url,
      thumbnailUrl: p.thumbnail_url,
    })
    return analysis.score
  })

  const avgSeo = total > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / total) : 0

  return { total, published, draft, avgSeo }
})

// Filtered & Sorted Projects
const filteredProjects = computed(() => {
  if (!projects.value) return []
  let result = [...projects.value]

  // Filter Search
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    result = result.filter(p =>
      p.title.toLowerCase().includes(q)
      || p.slug.toLowerCase().includes(q)
      || p.category.toLowerCase().includes(q)
      || p.tech_stack.some(t => t.toLowerCase().includes(q))
      || p.style_tags.some(s => s.toLowerCase().includes(q)),
    )
  }

  // Filter Category
  if (selectedCategory.value !== 'all') {
    result = result.filter(p => p.category === selectedCategory.value)
  }

  // Filter Status
  if (selectedStatus.value !== 'all') {
    result = result.filter(p => p.status === selectedStatus.value)
  }

  // Sorting
  if (sortBy.value === 'title_asc') {
    result.sort((a, b) => a.title.localeCompare(b.title))
  }
  else if (sortBy.value === 'updated_asc') {
    result.sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime())
  }
  else {
    result.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
  }

  return result
})

function getProjectSeoScore(project: Project) {
  return analyzeSeoQuality({
    title: project.title,
    slug: project.slug,
    description: project.description,
    seoTitle: project.seo_title,
    seoDescription: project.seo_description,
    focusKeyword: project.focus_keyword,
    liveUrl: project.live_url,
    thumbnailUrl: project.thumbnail_url,
  })
}

async function quickToggleStatus(project: Project) {
  const newStatus: ProjectStatus = project.status === 'published' ? 'draft' : 'published'
  try {
    await toggleProjectStatus(project.id, newStatus)
    project.status = newStatus
    success(`Status project "${project.title}" diubah menjadi ${newStatus}.`)
  }
  catch (err) {
    toastError(err instanceof Error ? err.message : 'Gagal memperbarui status project.')
  }
}

async function copyPublicLink(project: Project) {
  const url = `${window.location.origin}/project/${project.slug}`
  try {
    await navigator.clipboard.writeText(url)
    info(`Tautan disalin: ${url}`)
  }
  catch {
    info(`URL: ${url}`)
  }
}

function promptDelete(project: Project) {
  projectToDelete.value = project
}

async function confirmDelete() {
  if (!projectToDelete.value) return
  isDeleting.value = true
  try {
    await deleteProject(projectToDelete.value.id)
    success(`Project "${projectToDelete.value.title}" berhasil dihapus.`)
    await refresh()
  }
  catch (err) {
    toastError(err instanceof Error ? err.message : 'Gagal menghapus project.')
  }
  finally {
    isDeleting.value = false
    projectToDelete.value = null
  }
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header & Action Bar -->
    <div class="flex flex-wrap items-end justify-between gap-5 border-b border-ink/12 pb-6">
      <div>
        <div class="inline-flex items-center gap-2 rounded-full bg-ink/5 px-3 py-1 font-mono text-[0.7rem] font-bold text-mute uppercase tracking-widest">
          <span class="size-1.5 rounded-full bg-signal" />
          <span>Katalog & Editorial</span>
        </div>
        <h1 class="mt-3 font-display text-4xl font-bold text-ink tracking-tight">Manajemen Project</h1>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink to="/admin/projects/new" class="button-primary">
          + Tambah Project Baru
        </NuxtLink>
      </div>
    </div>

    <!-- Analytics & Stats Cards Grid -->
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div class="rounded-3xl bg-white/85 p-5 border border-ink/10 shadow-xs space-y-1">
        <span class="font-mono text-[0.7rem] font-bold uppercase tracking-wider text-mute">Total Project</span>
        <p class="font-display text-3xl font-bold text-ink">{{ stats.total }}</p>
      </div>
      <div class="rounded-3xl bg-white/85 p-5 border border-ink/10 shadow-xs space-y-1">
        <span class="font-mono text-[0.7rem] font-bold uppercase tracking-wider text-emerald-700">Published</span>
        <p class="font-display text-3xl font-bold text-emerald-600">{{ stats.published }}</p>
      </div>
      <div class="rounded-3xl bg-white/85 p-5 border border-ink/10 shadow-xs space-y-1">
        <span class="font-mono text-[0.7rem] font-bold uppercase tracking-wider text-mute">Draft</span>
        <p class="font-display text-3xl font-bold text-ink/70">{{ stats.draft }}</p>
      </div>
      <div class="rounded-3xl bg-white/85 p-5 border border-ink/10 shadow-xs space-y-1">
        <span class="font-mono text-[0.7rem] font-bold uppercase tracking-wider text-mute">Rata-rata SEO</span>
        <div class="flex items-baseline gap-1">
          <p class="font-display text-3xl font-bold" :class="stats.avgSeo >= 80 ? 'text-emerald-600' : 'text-amber-600'">
            {{ stats.avgSeo }}
          </p>
          <span class="font-mono text-xs text-mute">/ 100</span>
        </div>
      </div>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white/80 p-4 border border-ink/10 shadow-xs">
      <!-- Search Input without icon -->
      <div class="relative flex-1 min-w-[240px] max-w-md">
        <input
          v-model="searchQuery"
          type="search"
          class="field font-sans text-sm"
          placeholder="Cari judul, slug, teknologi, atau tag..."
        >
      </div>

      <!-- Filters & Sorting Controls -->
      <div class="flex flex-wrap items-center gap-2.5 font-mono text-xs">
        <!-- Category Filter -->
        <select v-model="selectedCategory" class="field !min-h-10 !py-1 !px-3 font-mono cursor-pointer !w-auto">
          <option value="all">Semua Kategori</option>
          <option v-for="cat in PROJECT_CATEGORIES" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
        </select>

        <!-- Status Filter -->
        <select v-model="selectedStatus" class="field !min-h-10 !py-1 !px-3 font-mono cursor-pointer !w-auto">
          <option value="all">Semua Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <!-- Sort Filter -->
        <select v-model="sortBy" class="field !min-h-10 !py-1 !px-3 font-mono cursor-pointer !w-auto">
          <option value="updated_desc">Terbaru Diperbarui</option>
          <option value="updated_asc">Terlama Diperbarui</option>
          <option value="title_asc">Judul (A–Z)</option>
        </select>
      </div>
    </div>

    <!-- Projects Table & List -->
    <div v-if="status === 'pending'" class="animate-pulse rounded-3xl bg-white/70 p-12 text-center font-mono text-xs text-mute border border-ink/10">
      Memuat daftar project…
    </div>

    <div v-else-if="!filteredProjects.length" class="rounded-3xl border border-ink/10 bg-white/80 p-12 text-center shadow-xs space-y-4">
      <p class="font-display text-2xl font-bold text-ink">Tidak ada project ditemukan.</p>
      <p class="font-mono text-xs text-mute">Coba ubah kata kunci pencarian atau reset filter.</p>
      <button
        v-if="searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'"
        type="button"
        class="button-secondary text-xs mt-2"
        @click="searchQuery = ''; selectedCategory = 'all'; selectedStatus = 'all'"
      >
        Reset Filter
      </button>
    </div>

    <div v-else class="overflow-hidden rounded-3xl border border-ink/10 bg-white/90 shadow-xs">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[900px] border-collapse text-left font-sans">
          <thead>
            <tr class="border-b border-ink/10 font-mono text-xs uppercase tracking-wider text-mute bg-ink/[0.02]">
              <th class="p-4 pl-6">Project & Visual</th>
              <th class="p-4">Kategori & Tags</th>
              <th class="p-4 text-center">Skor SEO</th>
              <th class="p-4">Status</th>
              <th class="p-4">Pembaruan</th>
              <th class="p-4 pr-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-ink/10 text-sm">
            <tr v-for="project in filteredProjects" :key="project.id" class="hover:bg-ink/[0.02] transition-colors">
              <!-- Title & Thumbnail -->
              <td class="p-4 pl-6">
                <div class="flex items-center gap-4">
                  <div class="relative aspect-[16/10] w-24 shrink-0 overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 shadow-xs">
                    <img :src="project.thumbnail_url" alt="" class="h-full w-full object-cover">
                  </div>
                  <div class="min-w-0">
                    <NuxtLink
                      :to="`/admin/projects/${project.id}/edit`"
                      class="font-display font-bold text-ink hover:text-signal transition-colors text-base block truncate max-w-xs sm:max-w-sm"
                    >
                      {{ project.title }}
                    </NuxtLink>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="font-mono text-xs text-mute">/{{ project.slug }}</span>
                      <button
                        type="button"
                        class="text-[0.68rem] font-mono text-signal hover:underline cursor-pointer"
                        title="Salin Link Publik"
                        @click="copyPublicLink(project)"
                      >
                        Salin URL
                      </button>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Category & Tags -->
              <td class="p-4">
                <div class="space-y-1">
                  <span class="inline-block rounded-full bg-ink/5 px-2.5 py-0.5 font-mono text-xs font-semibold text-ink">
                    {{ categoryLabel(project.category) }}
                  </span>
                  <p class="font-mono text-[0.68rem] text-mute truncate max-w-[160px]">
                    {{ project.style_tags.join(', ') || 'No tags' }}
                  </p>
                </div>
              </td>

              <!-- Realtime SEO Score Badge -->
              <td class="p-4 text-center">
                <div class="inline-flex flex-col items-center gap-0.5">
                  <span
                    class="rounded-full px-2.5 py-0.5 font-mono text-xs font-bold border"
                    :class="getProjectSeoScore(project).colorClass"
                  >
                    {{ getProjectSeoScore(project).score }} / 100
                  </span>
                  <span class="font-mono text-[0.65rem] text-mute uppercase">
                    Grade {{ getProjectSeoScore(project).grade }}
                  </span>
                </div>
              </td>

              <!-- Status Switcher Button -->
              <td class="p-4">
                <button
                  type="button"
                  class="group inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[0.7rem] font-bold uppercase tracking-wider transition-all cursor-pointer"
                  :class="project.status === 'published' ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200' : 'bg-ink/10 text-mute hover:bg-ink/15'"
                  title="Klik untuk mengubah status"
                  @click="quickToggleStatus(project)"
                >
                  <span class="size-1.5 rounded-full" :class="project.status === 'published' ? 'bg-emerald-600' : 'bg-mute'" />
                  <span>{{ project.status }}</span>
                </button>
              </td>

              <!-- Updated Time -->
              <td class="p-4 font-mono text-xs text-mute whitespace-nowrap">
                {{ new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(project.updated_at)) }}
              </td>

              <!-- Action Menu -->
              <td class="p-4 pr-6 text-right whitespace-nowrap">
                <div class="flex justify-end items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
                  <NuxtLink
                    :to="`/admin/projects/${project.id}/edit`"
                    class="rounded-full bg-ink/5 hover:bg-ink hover:text-paper px-3.5 py-1.5 text-ink transition-all"
                  >
                    Edit ↗
                  </NuxtLink>
                  <button
                    type="button"
                    class="cursor-pointer rounded-full bg-signal/10 hover:bg-signal hover:text-white px-3.5 py-1.5 text-signal transition-all"
                    @click="promptDelete(project)"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Confirmation Modal for Delete -->
    <AdminModal
      :show="Boolean(projectToDelete)"
      :title="`Hapus Project “${projectToDelete?.title}”?`"
      message="Tindakan ini permanen dan akan menghapus seluruh data portofolio beserta case study dari database."
      confirm-label="Hapus Permanen"
      cancel-label="Batal"
      :danger="true"
      :busy="isDeleting"
      @confirm="confirmDelete"
      @cancel="projectToDelete = null"
    />
  </div>
</template>
