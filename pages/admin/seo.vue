<script setup lang="ts">
import AdminIcon from '~/components/admin/AdminIcon.vue'
import type { Database, Project } from '~/types/database.types'
import { analyzeSeoQuality } from '~/utils/seo'

definePageMeta({ middleware: 'admin', layout: 'admin' })
useSeoMeta({ title: 'SEO Health Center — Studio Admin Hygione Darriyan', robots: 'noindex, nofollow' })

const client = useSupabaseClient<Database>()
const searchQuery = ref('')
const selectedFilter = ref<'all' | 'needs_attention' | 'grade_a'>('all')

const { data: projects, status } = await useAsyncData('admin-seo-projects', async () => {
  const { data, error } = await client
    .from('projects')
    .select('*')
    .order('updated_at', { ascending: false })
  if (error) throw error
  return (data as Project[]) ?? []
})

const seoReport = computed(() => {
  const list = projects.value || []
  const analyzed = list.map((project) => {
    const analysis = analyzeSeoQuality({
      title: project.title,
      slug: project.slug,
      description: project.description,
      seoTitle: project.seo_title,
      seoDescription: project.seo_description,
      focusKeyword: project.focus_keyword,
      liveUrl: project.live_url,
      thumbnailUrl: project.thumbnail_url,
    })
    return { project, analysis }
  })

  const total = analyzed.length
  const avgScore = total > 0 ? Math.round(analyzed.reduce((acc, curr) => acc + curr.analysis.score, 0) / total) : 0
  const gradeACount = analyzed.filter(item => item.analysis.grade === 'A').length
  const needsAttention = analyzed.filter(item => item.analysis.score < 75)

  return { total, avgScore, gradeACount, needsAttention, analyzed }
})

const filteredProjects = computed(() => {
  let list = seoReport.value.analyzed

  if (selectedFilter.value === 'needs_attention') {
    list = list.filter(item => item.analysis.score < 75)
  }
  else if (selectedFilter.value === 'grade_a') {
    list = list.filter(item => item.analysis.grade === 'A')
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(item =>
      item.project.title.toLowerCase().includes(q)
      || item.project.slug.toLowerCase().includes(q)
      || (item.project.focus_keyword ?? '').toLowerCase().includes(q),
    )
  }

  return list
})

// Installed features, not measured runtime health or Google indexing status.
const infraChecks = [
  {
    id: 'ssr',
    label: 'SSR Hydration',
    description: 'Seluruh HTML dirender di server sebelum dikirim ke bot pencari.',
  },
  {
    id: 'sitemap',
    label: 'Sitemap Dinamis',
    description: 'Slug project published terdaftar otomatis di /sitemap.xml.',
  },
  {
    id: 'og',
    label: 'Open Graph & Twitter',
    description: 'Kartu share multimedia kaya untuk WhatsApp, Twitter, dan LinkedIn.',
  },
  {
    id: 'schema',
    label: 'JSON-LD Schema.org',
    description: 'Structured data CreativeWork terpasang di tiap halaman project.',
  },
]
</script>

<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-5 border-b border-ink/10 pb-6">
      <div>
        <div class="inline-flex items-center gap-2 rounded-full bg-ink/5 border border-ink/10 px-3 py-1 font-mono text-[0.68rem] font-bold text-mute uppercase tracking-widest">
          <AdminIcon name="seo" size="12" />
          <span>Search Engine Optimization</span>
        </div>
        <h1 class="mt-2.5 font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
          SEO Health Center
        </h1>
        <p class="mt-1 font-sans text-xs sm:text-sm text-mute">
          Audit kualitas konten dan metadata project. Skor ini adalah panduan internal; status indeks, impresi, dan klik perlu diperiksa di Google Search Console.
        </p>
      </div>

      <a
        href="/sitemap.xml"
        target="_blank"
        rel="noopener"
        class="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-ink/5 border border-ink/15 px-4 py-2.5 font-mono text-xs font-semibold text-ink transition-all cursor-pointer shadow-2xs"
      >
        <AdminIcon name="sitemap" size="13" />
        <span>Lihat sitemap.xml</span>
        <AdminIcon name="external" size="11" class="text-mute" />
      </a>
    </div>

    <!-- Score & Status Metric Cards -->
    <div class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <div class="rounded-2xl bg-white/90 p-5 border border-ink/10 shadow-2xs space-y-2">
        <div class="flex items-center justify-between">
          <span class="font-mono text-[0.68rem] font-bold uppercase tracking-wider text-mute">Skor Rata-Rata</span>
          <div class="size-7 rounded-lg bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600">
            <AdminIcon name="seo" size="14" />
          </div>
        </div>
        <div class="flex items-baseline gap-1">
          <p class="font-display text-3xl font-bold" :class="seoReport.avgScore >= 80 ? 'text-emerald-600' : 'text-amber-600'">
            {{ seoReport.avgScore }}
          </p>
          <span class="font-mono text-xs text-mute">/ 100</span>
        </div>
        <p class="font-mono text-[0.65rem] text-mute">Dibobotkan dari {{ seoReport.total }} project</p>
      </div>

      <div class="rounded-2xl bg-white/90 p-5 border border-ink/10 shadow-2xs space-y-2">
        <div class="flex items-center justify-between">
          <span class="font-mono text-[0.68rem] font-bold uppercase tracking-wider text-emerald-800">Grade A (Optimal)</span>
          <div class="size-7 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600">
            <AdminIcon name="check-circle" size="14" />
          </div>
        </div>
        <p class="font-display text-3xl font-bold text-emerald-600">{{ seoReport.gradeACount }}</p>
        <p class="font-mono text-[0.65rem] text-mute">Memenuhi seluruh standar Google SERP</p>
      </div>

      <div class="rounded-2xl bg-white/90 p-5 border border-ink/10 shadow-2xs space-y-2">
        <div class="flex items-center justify-between">
          <span class="font-mono text-[0.68rem] font-bold uppercase tracking-wider text-amber-800">Perlu Optimasi</span>
          <div class="size-7 rounded-lg bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600">
            <AdminIcon name="alert" size="14" />
          </div>
        </div>
        <p class="font-display text-3xl font-bold text-amber-600">{{ seoReport.needsAttention.length }}</p>
        <p class="font-mono text-[0.65rem] text-mute">Skor di bawah 75 / 100</p>
      </div>

      <div class="rounded-2xl bg-white/90 p-5 border border-ink/10 shadow-2xs space-y-2">
        <div class="flex items-center justify-between">
          <span class="font-mono text-[0.68rem] font-bold uppercase tracking-wider text-mute">Index Crawler</span>
          <div class="size-7 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600">
            <AdminIcon name="globe" size="14" />
          </div>
        </div>
        <p class="font-display text-2xl font-bold text-emerald-600 tracking-tight">Perlu verifikasi</p>
        <p class="font-mono text-[0.65rem] text-mute">Cek indeks di Search Console</p>
      </div>
    </div>

    <!-- Technical Infrastructure SEO Checklist -->
    <div class="rounded-2xl bg-white/95 border border-ink/10 shadow-2xs overflow-hidden">
      <div class="px-6 py-5 border-b border-ink/10 flex items-center gap-3">
        <div class="size-8 rounded-lg bg-ink/5 border border-ink/10 flex items-center justify-center text-ink/70">
          <AdminIcon name="database" size="15" />
        </div>
        <div>
          <h2 class="font-display text-lg font-bold text-ink">Infrastruktur SEO & Arsitektur Mesin Pencari</h2>
          <p class="font-mono text-[0.68rem] text-mute">Fitur yang dikonfigurasi. Verifikasi respons production; daftar ini bukan hasil audit otomatis.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-px bg-ink/5">
        <div
          v-for="check in infraChecks"
          :key="check.id"
          class="bg-white/95 p-5 flex items-start gap-3.5"
        >
          <div class="size-8 shrink-0 rounded-xl flex items-center justify-center mt-0.5 bg-ink/5 text-ink/70 border border-ink/10"
          >
            <AdminIcon name="globe" size="14" />
          </div>
          <div>
            <p class="font-mono text-xs font-bold text-ink uppercase tracking-wider">{{ check.label }}</p>
            <p class="font-sans text-xs text-mute mt-0.5">{{ check.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Per-Project SEO Audit Table -->
    <div class="rounded-2xl bg-white/95 border border-ink/10 shadow-2xs overflow-hidden">
      <!-- Table Header + Controls -->
      <div class="px-6 py-5 border-b border-ink/10 space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="font-display text-lg font-bold text-ink">Audit Kualitas SEO per Project</h2>
            <p class="font-mono text-[0.68rem] text-mute">Analisa metrik judul, deskripsi, panjang konten, dan kata kunci tiap karya.</p>
          </div>

          <!-- Filter Segmented Control -->
          <div class="flex items-center rounded-xl bg-ink/5 p-1 font-mono text-xs">
            <button
              type="button"
              class="rounded-lg px-3 py-1.5 font-bold transition-all cursor-pointer"
              :class="selectedFilter === 'all' ? 'bg-ink text-paper shadow-2xs' : 'text-mute hover:text-ink'"
              @click="selectedFilter = 'all'"
            >
              Semua ({{ seoReport.total }})
            </button>
            <button
              type="button"
              class="rounded-lg px-3 py-1.5 font-bold transition-all cursor-pointer"
              :class="selectedFilter === 'needs_attention' ? 'bg-amber-600 text-white shadow-2xs' : 'text-mute hover:text-ink'"
              @click="selectedFilter = 'needs_attention'"
            >
              Perlu Optimasi ({{ seoReport.needsAttention.length }})
            </button>
            <button
              type="button"
              class="rounded-lg px-3 py-1.5 font-bold transition-all cursor-pointer"
              :class="selectedFilter === 'grade_a' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-mute hover:text-ink'"
              @click="selectedFilter = 'grade_a'"
            >
              Grade A ({{ seoReport.gradeACount }})
            </button>
          </div>
        </div>

        <!-- Search -->
        <div class="relative max-w-sm">
          <AdminIcon name="search" size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
          <input
            v-model="searchQuery"
            type="search"
            class="field !min-h-9 pl-8 font-mono text-xs !rounded-xl !w-full"
            placeholder="Cari project atau keyword..."
          >
        </div>
      </div>

      <!-- Loading -->
      <div v-if="status === 'pending'" class="p-10 text-center font-mono text-xs text-mute animate-pulse">
        Menganalisa data SEO…
      </div>

      <!-- Table Content -->
      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[700px] border-collapse text-left font-sans text-sm">
          <thead>
            <tr class="border-b border-ink/10 font-mono text-[0.68rem] uppercase tracking-wider text-mute bg-ink/[0.02]">
              <th class="py-3.5 px-5">Project</th>
              <th class="py-3.5 px-4 text-center">Skor & Grade</th>
              <th class="py-3.5 px-4">Target Keyword</th>
              <th class="py-3.5 px-4">Kel. Konten</th>
              <th class="py-3.5 px-4">Diagnosa Audit</th>
              <th class="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-ink/8">
            <tr
              v-for="{ project, analysis } in filteredProjects"
              :key="project.id"
              class="hover:bg-ink/[0.015] transition-colors"
            >
              <!-- Project Title & Slug -->
              <td class="py-4 px-5">
                <div class="space-y-0.5 max-w-[220px]">
                  <NuxtLink
                    :to="`/admin/projects/${project.id}/edit?tab=seo`"
                    class="font-display font-bold text-ink hover:text-signal transition-colors block truncate text-sm"
                    :title="project.title"
                  >
                    {{ project.title }}
                  </NuxtLink>
                  <span class="font-mono text-[0.68rem] text-mute block truncate">/project/{{ project.slug }}</span>
                </div>
              </td>

              <!-- SEO Score Badge -->
              <td class="py-4 px-4 text-center">
                <div class="inline-flex flex-col items-center gap-0.5">
                  <span
                    class="rounded-md px-2.5 py-0.5 font-mono text-xs font-bold border"
                    :class="analysis.colorClass"
                  >
                    {{ analysis.score }} / 100
                  </span>
                  <span class="font-mono text-[0.62rem] text-mute uppercase">
                    Grade {{ analysis.grade }}
                  </span>
                </div>
              </td>

              <!-- Target Keyword & Occurrences -->
              <td class="py-4 px-4">
                <div v-if="project.focus_keyword" class="space-y-0.5">
                  <p class="font-mono text-xs text-ink truncate max-w-[160px]" :title="project.focus_keyword">
                    {{ project.focus_keyword }}
                  </p>
                  <p class="font-mono text-[0.68rem] text-mute">
                    {{ analysis.keywordCount ?? 0 }} kemunculan
                  </p>
                </div>
                <span v-else class="font-mono text-[0.68rem] text-mute italic">Belum diatur</span>
              </td>

              <!-- Word Count -->
              <td class="py-4 px-4">
                <div>
                  <p class="font-mono text-xs text-ink font-bold">{{ analysis.wordCount }} kata</p>
                  <p class="font-mono text-[0.68rem]" :class="analysis.wordCount >= 300 ? 'text-emerald-600' : 'text-amber-600'">
                    {{ analysis.wordCount >= 300 ? 'Memadai' : 'Terlalu singkat' }}
                  </p>
                </div>
              </td>

              <!-- Diagnosis Issues -->
              <td class="py-4 px-4">
                <div class="space-y-1 max-w-[240px]">
                  <template v-for="issue in analysis.auditItems.filter(a => a.status !== 'pass').slice(0, 2)" :key="issue.id">
                    <div
                      class="flex items-start gap-1.5 rounded-lg px-2 py-1 font-mono text-[0.65rem] leading-tight"
                      :class="issue.status === 'warning' ? 'bg-amber-50 text-amber-900' : 'bg-rose-50 text-rose-900'"
                    >
                      <AdminIcon name="alert" size="11" class="mt-px shrink-0" />
                      <span class="line-clamp-2">{{ issue.message }}</span>
                    </div>
                  </template>
                  <span
                    v-if="analysis.auditItems.filter(a => a.status === 'pass').length === analysis.auditItems.length"
                    class="inline-flex items-center gap-1 font-mono text-[0.68rem] text-emerald-700"
                  >
                    <AdminIcon name="check" size="11" />
                    <span>Semua cek lolos</span>
                  </span>
                </div>
              </td>

              <!-- Action Button -->
              <td class="py-4 px-4 text-right whitespace-nowrap">
                <NuxtLink
                  :to="`/admin/projects/${project.id}/edit`"
                  class="inline-flex items-center gap-1.5 rounded-lg bg-signal/10 hover:bg-signal hover:text-ink text-ink font-bold px-3 py-1.5 font-mono text-[0.7rem] uppercase transition-all"
                >
                  <AdminIcon name="seo" size="11" />
                  <span>Optimasi</span>
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="filteredProjects.length === 0" class="p-12 text-center font-mono text-xs text-mute">
          Tidak ada project yang cocok dengan filter aktif.
        </div>
      </div>
    </div>
  </div>
</template>
