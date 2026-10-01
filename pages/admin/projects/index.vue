<script setup lang="ts">
import AdminIcon from '~/components/admin/AdminIcon.vue'
import AdminModal from '~/components/admin/AdminModal.vue'
import type { Database, Project, ProjectCategory, ProjectStatus } from '~/types/database.types'
import { PROJECT_CATEGORIES, categoryLabel } from '~/utils/project'
import { analyzeSeoQuality } from '~/utils/seo'

definePageMeta({ middleware: 'admin', layout: 'admin' })
useSeoMeta({ title: 'Manajemen Projects — Studio Admin Hygione Darriyan', robots: 'noindex, nofollow' })

const client = useSupabaseClient<Database>()
const { toggleProjectStatus, deleteProject } = useProjectAdmin()
const { success, error: toastError, info } = useToast()

const searchQuery = ref('')
const selectedCategory = ref<string>('all')
const selectedStatus = ref<string>('all')
const selectedSeoGrade = ref<string>('all')
const sortBy = ref<'updated_desc' | 'updated_asc' | 'title_asc' | 'seo_desc' | 'seo_asc'>('updated_desc')
const viewMode = ref<'table' | 'grid' | 'list'>('table')

// Modal state for delete
const projectToDelete = ref<Project | null>(null)
const isDeleting = ref(false)

const { data: projects, status, refresh } = await useAsyncData('admin-projects-list', async () => {
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
  const gradeACount = list.filter((p) => {
    const s = analyzeSeoQuality({
      title: p.title,
      slug: p.slug,
      description: p.description,
      seoTitle: p.seo_title,
      seoDescription: p.seo_description,
      focusKeyword: p.focus_keyword,
      liveUrl: p.live_url,
      thumbnailUrl: p.thumbnail_url,
    }).score
    return s >= 80
  }).length

  return { total, published, draft, avgSeo, gradeACount }
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

  // Filter SEO Grade
  if (selectedSeoGrade.value !== 'all') {
    result = result.filter((p) => {
      const score = getProjectSeoScore(p).score
      if (selectedSeoGrade.value === 'A') return score >= 80
      if (selectedSeoGrade.value === 'B') return score >= 65 && score < 80
      if (selectedSeoGrade.value === 'C') return score < 65
      return true
    })
  }

  // Sorting
  if (sortBy.value === 'title_asc') {
    result.sort((a, b) => a.title.localeCompare(b.title))
  }
  else if (sortBy.value === 'updated_asc') {
    result.sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime())
  }
  else if (sortBy.value === 'seo_desc') {
    result.sort((a, b) => getProjectSeoScore(b).score - getProjectSeoScore(a).score)
  }
  else if (sortBy.value === 'seo_asc') {
    result.sort((a, b) => getProjectSeoScore(a).score - getProjectSeoScore(b).score)
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
    success(`Status "${project.title}" diubah ke ${newStatus.toUpperCase()}`)
  }
  catch (err) {
    toastError(err instanceof Error ? err.message : 'Gagal memperbarui status.')
  }
}

async function copyPublicLink(project: Project) {
  const url = `${window.location.origin}/project/${project.slug}`
  try {
    await navigator.clipboard.writeText(url)
    success(`Tautan disalin: /project/${project.slug}`)
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

function exportJsonBackup() {
  if (!projects.value?.length) return
  const blob = new Blob([JSON.stringify(projects.value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `hygione-darriyan-projects-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
  success('Backup data JSON project berhasil diunduh.')
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-5 border-b border-ink/10 pb-6">
      <div>
        <div class="inline-flex items-center gap-2 rounded-full bg-ink/5 border border-ink/10 px-3 py-1 font-mono text-[0.68rem] font-bold text-mute uppercase tracking-widest">
          <span class="size-1.5 rounded-full bg-signal" />
          <span>Katalog & Kurasi Portofolio</span>
        </div>
        <h1 class="mt-2.5 font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
          Manajemen Projects
        </h1>
        <p class="mt-1 font-sans text-xs sm:text-sm text-mute">
          Kelola metadata karya, atur status publikasi, dan pantau kualitas SEO setiap case study.
        </p>
      </div>

      <div class="flex items-center gap-2.5 flex-wrap">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-xl bg-white hover:bg-ink/5 border border-ink/15 px-3.5 py-2 font-mono text-xs font-semibold text-ink transition-all cursor-pointer shadow-2xs"
          title="Unduh backup JSON"
          @click="exportJsonBackup"
        >
          <AdminIcon name="download" size="13" />
          <span>Export JSON</span>
        </button>

        <NuxtLink
          to="/admin/projects/new"
          class="inline-flex items-center gap-2 rounded-xl bg-signal text-ink hover:bg-signal/90 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider shadow-xs shadow-signal/20 transition-all hover:scale-[1.02] active:scale-98"
        >
          <AdminIcon name="plus" size="14" stroke-width="2.5" />
          <span>Tambah Project</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Stat Metric Cards -->
    <div class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <div class="rounded-2xl bg-white/90 p-5 border border-ink/10 shadow-2xs space-y-2">
        <div class="flex items-center justify-between">
          <span class="font-mono text-[0.68rem] font-bold uppercase tracking-wider text-mute">Total Karya</span>
          <div class="size-7 rounded-lg bg-ink/5 flex items-center justify-center text-ink/70">
            <AdminIcon name="projects" size="14" />
          </div>
        </div>
        <p class="font-display text-3xl font-bold text-ink">{{ stats.total }}</p>
        <p class="font-mono text-[0.65rem] text-mute">{{ stats.gradeACount }} berkategori Grade A</p>
      </div>

      <div class="rounded-2xl bg-white/90 p-5 border border-ink/10 shadow-2xs space-y-2">
        <div class="flex items-center justify-between">
          <span class="font-mono text-[0.68rem] font-bold uppercase tracking-wider text-emerald-800">Published</span>
          <div class="size-7 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600">
            <AdminIcon name="check-circle" size="14" />
          </div>
        </div>
        <p class="font-display text-3xl font-bold text-emerald-600">{{ stats.published }}</p>
        <p class="font-mono text-[0.65rem] text-mute">Tampil di halaman publik</p>
      </div>

      <div class="rounded-2xl bg-white/90 p-5 border border-ink/10 shadow-2xs space-y-2">
        <div class="flex items-center justify-between">
          <span class="font-mono text-[0.68rem] font-bold uppercase tracking-wider text-mute">Draft / Privat</span>
          <div class="size-7 rounded-lg bg-ink/5 flex items-center justify-center text-mute">
            <AdminIcon name="clock" size="14" />
          </div>
        </div>
        <p class="font-display text-3xl font-bold text-ink/70">{{ stats.draft }}</p>
        <p class="font-mono text-[0.65rem] text-mute">Hanya terlihat di admin</p>
      </div>

      <div class="rounded-2xl bg-white/90 p-5 border border-ink/10 shadow-2xs space-y-2">
        <div class="flex items-center justify-between">
          <span class="font-mono text-[0.68rem] font-bold uppercase tracking-wider text-mute">Rata-Rata SEO</span>
          <div class="size-7 rounded-lg bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600">
            <AdminIcon name="seo" size="14" />
          </div>
        </div>
        <div class="flex items-baseline gap-1">
          <p class="font-display text-3xl font-bold" :class="stats.avgSeo >= 80 ? 'text-emerald-600' : 'text-amber-600'">
            {{ stats.avgSeo }}
          </p>
          <span class="font-mono text-xs text-mute">/ 100</span>
        </div>
        <p class="font-mono text-[0.65rem] text-mute">{{ stats.avgSeo >= 80 ? 'Kualitas metadata prima' : 'Perlu optimasi SEO' }}</p>
      </div>
    </div>

    <!-- Toolbar: Search, Filters, and Segmented View Switcher -->
    <div class="space-y-3 rounded-2xl bg-white/90 p-3.5 sm:p-4 border border-ink/10 shadow-2xs">
      <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <!-- Search Input -->
        <div class="relative flex-1">
          <AdminIcon name="search" size="14" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-mute" />
          <input
            v-model="searchQuery"
            type="search"
            class="field pl-9.5 font-sans text-xs sm:text-sm !min-h-10 !rounded-xl"
            placeholder="Cari judul, slug, kategori, teknologi, atau style tag..."
          >
        </div>

        <!-- Segmented View Switcher -->
        <div class="flex items-center justify-between sm:justify-end gap-2 border-t lg:border-t-0 pt-2 lg:pt-0 border-ink/5">
          <div class="flex items-center rounded-xl bg-ink/5 p-1 font-mono text-xs">
            <button
              type="button"
              class="rounded-lg px-3 py-1.5 font-bold transition-all cursor-pointer flex items-center gap-1.5"
              :class="viewMode === 'table' ? 'bg-ink text-paper shadow-2xs' : 'text-mute hover:text-ink'"
              @click="viewMode = 'table'"
            >
              <AdminIcon name="table" size="13" />
              <span class="hidden sm:inline">Tabel</span>
            </button>
            <button
              type="button"
              class="rounded-lg px-3 py-1.5 font-bold transition-all cursor-pointer flex items-center gap-1.5"
              :class="viewMode === 'grid' ? 'bg-ink text-paper shadow-2xs' : 'text-mute hover:text-ink'"
              @click="viewMode = 'grid'"
            >
              <AdminIcon name="grid" size="13" />
              <span class="hidden sm:inline">Grid Kartu</span>
            </button>
            <button
              type="button"
              class="rounded-lg px-3 py-1.5 font-bold transition-all cursor-pointer flex items-center gap-1.5"
              :class="viewMode === 'list' ? 'bg-ink text-paper shadow-2xs' : 'text-mute hover:text-ink'"
              @click="viewMode = 'list'"
            >
              <AdminIcon name="list" size="13" />
              <span class="hidden sm:inline">List</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Filters & Sorting Row -->
      <div class="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 font-mono text-xs pt-1">
        <!-- Category Filter -->
        <select v-model="selectedCategory" class="field !min-h-9 !py-1.5 !px-3 font-mono cursor-pointer !w-full sm:!w-auto !rounded-xl">
          <option value="all">Semua Kategori</option>
          <option v-for="cat in PROJECT_CATEGORIES" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
        </select>

        <!-- Status Filter -->
        <select v-model="selectedStatus" class="field !min-h-9 !py-1.5 !px-3 font-mono cursor-pointer !w-full sm:!w-auto !rounded-xl">
          <option value="all">Semua Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <!-- SEO Grade Filter -->
        <select v-model="selectedSeoGrade" class="field !min-h-9 !py-1.5 !px-3 font-mono cursor-pointer !w-full sm:!w-auto !rounded-xl">
          <option value="all">Semua Grade SEO</option>
          <option value="A">Grade A (≥ 80)</option>
          <option value="B">Grade B (65–79)</option>
          <option value="C">Grade C (< 65)</option>
        </select>

        <!-- Sort Filter -->
        <select v-model="sortBy" class="field !min-h-9 !py-1.5 !px-3 font-mono cursor-pointer col-span-2 sm:col-span-1 !w-full sm:!w-auto !rounded-xl sm:ml-auto">
          <option value="updated_desc">Terbaru Diperbarui</option>
          <option value="updated_asc">Terlama Diperbarui</option>
          <option value="title_asc">Judul (A–Z)</option>
          <option value="seo_desc">Skor SEO (Tertinggi)</option>
          <option value="seo_asc">Skor SEO (Terendah)</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="status === 'pending'" class="animate-pulse rounded-2xl bg-white/70 p-12 text-center font-mono text-xs text-mute border border-ink/10">
      Memuat data project…
    </div>

    <!-- Empty State -->
    <div v-else-if="!filteredProjects.length" class="rounded-2xl border border-ink/10 bg-white/85 p-10 sm:p-14 text-center shadow-2xs space-y-3">
      <p class="font-display text-2xl font-bold text-ink">Tidak ada project ditemukan.</p>
      <p class="font-mono text-xs text-mute max-w-md mx-auto">
        Kriteria pencarian atau filter tidak cocok dengan data project.
      </p>
      <button
        v-if="searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all' || selectedSeoGrade !== 'all'"
        type="button"
        class="inline-flex items-center gap-1.5 rounded-xl bg-ink/5 hover:bg-ink hover:text-paper px-4 py-2 font-mono text-xs font-bold uppercase transition-all cursor-pointer"
        @click="searchQuery = ''; selectedCategory = 'all'; selectedStatus = 'all'; selectedSeoGrade = 'all'"
      >
        <AdminIcon name="refresh" size="12" />
        <span>Reset Filter</span>
      </button>
    </div>

    <!-- ========================================== -->
    <!-- VIEW 1: STUDIO TABLE VIEW                  -->
    <!-- ========================================== -->
    <div v-else-if="viewMode === 'table'" class="overflow-hidden rounded-2xl border border-ink/10 bg-white/95 shadow-2xs">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[920px] border-collapse text-left font-sans text-sm">
          <thead>
            <tr class="border-b border-ink/10 font-mono text-[0.68rem] uppercase tracking-wider text-mute bg-ink/[0.02]">
              <th class="py-3.5 px-5">Project & Identitas</th>
              <th class="py-3.5 px-4">Kategori & Tags</th>
              <th class="py-3.5 px-4 text-center">Skor SEO</th>
              <th class="py-3.5 px-4">Status</th>
              <th class="py-3.5 px-4">Diperbarui</th>
              <th class="py-3.5 px-5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-ink/8">
            <tr v-for="project in filteredProjects" :key="project.id" class="hover:bg-ink/[0.015] transition-colors group">
              <!-- Title & Thumbnail (Fixed Wrapping & Alignment) -->
              <td class="py-4 px-5">
                <div class="flex items-center gap-3.5">
                  <div class="relative aspect-[16/10] w-20 shrink-0 overflow-hidden rounded-xl border border-ink/10 bg-ink/10 shadow-2xs">
                    <img :src="project.thumbnail_url" :alt="project.title" class="h-full w-full object-cover" loading="lazy">
                  </div>
                  <div class="min-w-0 max-w-[280px]">
                    <NuxtLink
                      :to="`/admin/projects/${project.id}/edit`"
                      class="font-display font-bold text-ink hover:text-signal transition-colors text-[0.95rem] block truncate leading-tight"
                      :title="project.title"
                    >
                      {{ project.title }}
                    </NuxtLink>
                    <div class="flex items-center gap-2 mt-1 font-mono text-[0.7rem] text-mute flex-wrap">
                      <span class="truncate max-w-[140px]" :title="project.slug">/{{ project.slug }}</span>
                      <span class="text-mute/30">·</span>
                      <button
                        type="button"
                        class="text-signal hover:underline cursor-pointer inline-flex items-center gap-1"
                        title="Salin Link Publik"
                        @click="copyPublicLink(project)"
                      >
                        <AdminIcon name="copy" size="10" />
                        <span>Salin</span>
                      </button>
                      <span class="text-mute/30">·</span>
                      <a
                        :href="project.live_url"
                        target="_blank"
                        rel="noopener"
                        class="text-mute hover:text-ink transition-colors inline-flex items-center gap-0.5"
                        title="Buka Demo Eksternal"
                      >
                        <span>Demo</span>
                        <AdminIcon name="external" size="10" />
                      </a>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Category & Style Tags -->
              <td class="py-4 px-4">
                <div class="space-y-1 max-w-[180px]">
                  <span class="inline-block rounded-md bg-ink/5 px-2 py-0.5 font-mono text-[0.7rem] font-semibold text-ink">
                    {{ categoryLabel(project.category) }}
                  </span>
                  <p class="font-mono text-[0.68rem] text-mute truncate" :title="project.style_tags.join(', ')">
                    {{ project.style_tags.join(', ') || 'No tags' }}
                  </p>
                </div>
              </td>

              <!-- Real-time SEO Score Badge -->
              <td class="py-4 px-4 text-center">
                <div class="inline-flex flex-col items-center gap-0.5">
                  <span
                    class="rounded-md px-2.5 py-0.5 font-mono text-xs font-bold border"
                    :class="getProjectSeoScore(project).colorClass"
                  >
                    {{ getProjectSeoScore(project).score }} / 100
                  </span>
                  <span class="font-mono text-[0.62rem] text-mute uppercase">
                    Grade {{ getProjectSeoScore(project).grade }}
                  </span>
                </div>
              </td>

              <!-- Status Switcher Button -->
              <td class="py-4 px-4">
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[0.68rem] font-bold uppercase tracking-wider transition-all cursor-pointer border"
                  :class="project.status === 'published' ? 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100' : 'bg-ink/5 text-mute border-ink/10 hover:bg-ink/10'"
                  title="Klik untuk mengubah status"
                  @click="quickToggleStatus(project)"
                >
                  <span class="size-1.5 rounded-full" :class="project.status === 'published' ? 'bg-emerald-600' : 'bg-mute'" />
                  <span>{{ project.status }}</span>
                </button>
              </td>

              <!-- Updated Time -->
              <td class="py-4 px-4 font-mono text-xs text-mute whitespace-nowrap">
                {{ new Intl.DateTimeFormat('id-ID', { dateStyle: 'short' }).format(new Date(project.updated_at)) }}
              </td>

              <!-- Action Buttons -->
              <td class="py-4 px-5 text-right whitespace-nowrap">
                <div class="flex justify-end items-center gap-1.5 font-mono text-xs">
                  <NuxtLink
                    :to="`/admin/projects/${project.id}/edit`"
                    class="inline-flex items-center gap-1 rounded-lg bg-ink/5 hover:bg-ink hover:text-paper px-2.5 py-1.5 text-ink transition-all font-semibold text-[0.7rem]"
                    title="Edit Project"
                  >
                    <AdminIcon name="edit" size="12" />
                    <span>Edit</span>
                  </NuxtLink>
                  <button
                    type="button"
                    class="cursor-pointer rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white px-2.5 py-1.5 text-rose-600 transition-all font-semibold text-[0.7rem]"
                    title="Hapus Project"
                    @click="promptDelete(project)"
                  >
                    <AdminIcon name="trash" size="12" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- VIEW 2: GRID CARDS VIEW                    -->
    <!-- ========================================== -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="rounded-2xl border border-ink/10 bg-white/95 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
      >
        <div>
          <!-- Thumbnail & Badges -->
          <div class="relative aspect-[16/10] w-full bg-ink/10 overflow-hidden">
            <img :src="project.thumbnail_url" :alt="project.title" class="h-full w-full object-cover" loading="lazy">
            <div class="absolute top-3 left-3 flex items-center gap-1.5">
              <span class="rounded-md bg-void/80 text-white backdrop-blur-md px-2 py-0.5 font-mono text-[0.65rem] font-bold uppercase">
                {{ categoryLabel(project.category) }}
              </span>
            </div>
            <div class="absolute top-3 right-3">
              <span
                class="rounded-md px-2 py-0.5 font-mono text-[0.65rem] font-bold border backdrop-blur-md"
                :class="getProjectSeoScore(project).colorClass"
              >
                SEO {{ getProjectSeoScore(project).score }} ({{ getProjectSeoScore(project).grade }})
              </span>
            </div>
          </div>

          <!-- Body Info -->
          <div class="p-5 space-y-3">
            <div>
              <NuxtLink
                :to="`/admin/projects/${project.id}/edit`"
                class="font-display text-base font-bold text-ink hover:text-signal transition-colors block truncate"
              >
                {{ project.title }}
              </NuxtLink>
              <div class="flex items-center gap-2 mt-1">
                <span class="font-mono text-xs text-mute truncate">/{{ project.slug }}</span>
                <button
                  type="button"
                  class="text-[0.68rem] font-mono text-signal hover:underline cursor-pointer"
                  @click="copyPublicLink(project)"
                >
                  Salin
                </button>
              </div>
            </div>

            <!-- Tech Tags -->
            <div class="flex flex-wrap gap-1">
              <span
                v-for="tech in project.tech_stack.slice(0, 3)"
                :key="tech"
                class="rounded bg-ink/5 px-1.5 py-0.5 font-mono text-[0.65rem] text-ink/80"
              >
                {{ tech }}
              </span>
              <span v-if="project.tech_stack.length > 3" class="font-mono text-[0.65rem] text-mute self-center">
                +{{ project.tech_stack.length - 3 }}
              </span>
            </div>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="p-4 pt-0 flex items-center justify-between border-t border-ink/5 mt-2 pt-3">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[0.68rem] font-bold uppercase tracking-wider transition-all cursor-pointer border"
            :class="project.status === 'published' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-ink/5 text-mute border-ink/10'"
            @click="quickToggleStatus(project)"
          >
            <span class="size-1.5 rounded-full" :class="project.status === 'published' ? 'bg-emerald-600' : 'bg-mute'" />
            <span>{{ project.status }}</span>
          </button>

          <div class="flex items-center gap-1.5 font-mono text-xs">
            <NuxtLink
              :to="`/admin/projects/${project.id}/edit`"
              class="inline-flex items-center gap-1 rounded-lg bg-ink/5 hover:bg-ink hover:text-paper px-2.5 py-1 text-ink transition-all font-semibold text-[0.7rem]"
            >
              <AdminIcon name="edit" size="11" />
              <span>Edit</span>
            </NuxtLink>
            <button
              type="button"
              class="cursor-pointer rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white px-2 py-1 text-rose-600 transition-all"
              @click="promptDelete(project)"
            >
              <AdminIcon name="trash" size="11" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- VIEW 3: COMPACT LIST VIEW                  -->
    <!-- ========================================== -->
    <div v-else-if="viewMode === 'list'" class="space-y-2">
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="rounded-xl border border-ink/10 bg-white/95 p-3.5 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div class="size-10 rounded-lg overflow-hidden bg-ink/10 shrink-0 border border-ink/10">
            <img :src="project.thumbnail_url" :alt="project.title" class="h-full w-full object-cover">
          </div>
          <div class="min-w-0">
            <NuxtLink
              :to="`/admin/projects/${project.id}/edit`"
              class="font-display font-bold text-ink hover:text-signal truncate block text-sm sm:text-base"
            >
              {{ project.title }}
            </NuxtLink>
            <div class="flex items-center gap-2 font-mono text-xs text-mute">
              <span>/{{ project.slug }}</span>
              <span>·</span>
              <span>{{ categoryLabel(project.category) }}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between sm:justify-end gap-3 font-mono text-xs">
          <span
            class="rounded px-2 py-0.5 font-bold border text-[0.68rem]"
            :class="getProjectSeoScore(project).colorClass"
          >
            SEO {{ getProjectSeoScore(project).score }}
          </span>

          <button
            type="button"
            class="rounded-full px-2.5 py-0.5 font-bold uppercase cursor-pointer border text-[0.68rem]"
            :class="project.status === 'published' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-ink/5 text-mute border-ink/10'"
            @click="quickToggleStatus(project)"
          >
            {{ project.status }}
          </button>

          <div class="flex items-center gap-1.5">
            <NuxtLink
              :to="`/admin/projects/${project.id}/edit`"
              class="rounded-lg bg-ink/5 hover:bg-ink hover:text-paper px-2.5 py-1 text-ink font-semibold text-[0.7rem] transition-all inline-flex items-center gap-1"
            >
              <AdminIcon name="edit" size="11" />
              <span>Edit</span>
            </NuxtLink>
            <button
              type="button"
              class="rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white px-2 py-1 text-rose-600 transition-all cursor-pointer"
              @click="promptDelete(project)"
            >
              <AdminIcon name="trash" size="11" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal for Delete -->
    <AdminModal
      :show="Boolean(projectToDelete)"
      :title="`Hapus Project “${projectToDelete?.title}”?`"
      message="Tindakan ini permanen dan akan menghapus seluruh data portofolio beserta case study dari database Supabase."
      confirm-label="Hapus Permanen"
      cancel-label="Batal"
      :danger="true"
      :busy="isDeleting"
      @confirm="confirmDelete"
      @cancel="projectToDelete = null"
    />
  </div>
</template>
