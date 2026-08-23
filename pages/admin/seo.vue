<script setup lang="ts">
import type { Database, Project } from '~/types/database.types'
import { analyzeSeoQuality } from '~/utils/seo'

definePageMeta({ middleware: 'admin', layout: 'admin' })
useSeoMeta({ title: 'SEO Health Center — Studio Admin Rumah Design', robots: 'noindex, nofollow' })

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
    return {
      project,
      analysis,
    }
  })

  const total = analyzed.length
  const avgScore = total > 0 ? Math.round(analyzed.reduce((acc, curr) => acc + curr.analysis.score, 0) / total) : 0
  const gradeACount = analyzed.filter(item => item.analysis.grade === 'A').length
  const needsAttention = analyzed.filter(item => item.analysis.score < 75)

  return {
    total,
    avgScore,
    gradeACount,
    needsAttention,
    analyzed,
  }
})

const filteredAuditList = computed(() => {
  let list = seoReport.value.analyzed || []

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(item =>
      item.project.title.toLowerCase().includes(q)
      || item.project.slug.toLowerCase().includes(q)
      || (item.project.focus_keyword && item.project.focus_keyword.toLowerCase().includes(q)),
    )
  }

  if (selectedFilter.value === 'needs_attention') {
    list = list.filter(item => item.analysis.score < 75)
  }
  else if (selectedFilter.value === 'grade_a') {
    list = list.filter(item => item.analysis.grade === 'A')
  }

  return list
})
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-ink/12 pb-6">
      <div>
        <div class="inline-flex items-center gap-2 rounded-full bg-ink/5 px-3 py-1 font-mono text-[0.7rem] font-bold text-mute uppercase tracking-widest">
          <span class="size-1.5 rounded-full bg-signal" />
          <span>Search Engine Optimization</span>
        </div>
        <h1 class="mt-2 sm:mt-3 font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
          SEO Health Center
        </h1>
        <p class="mt-1 font-sans text-xs sm:text-sm text-mute">
          Pantau kesehatan metadata, audit kata kunci, dan performa indeks mesin pencari portofolio.
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <a
          href="/sitemap.xml"
          target="_blank"
          class="rounded-full bg-white/80 hover:bg-white border border-ink/10 px-4 py-2 font-mono text-xs font-semibold text-ink transition-all cursor-pointer shadow-xs"
        >
          Lihat sitemap.xml ↗
        </a>
      </div>
    </div>

    <!-- SEO Performance Overview Cards -->
    <div class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <div class="rounded-3xl bg-white/85 p-5 border border-ink/10 shadow-xs space-y-2">
        <div class="flex items-center justify-between">
          <span class="font-mono text-[0.7rem] font-bold uppercase tracking-wider text-mute">Skor Rata-rata</span>
          <span class="font-mono text-base">⚡</span>
        </div>
        <div class="flex items-baseline gap-1">
          <p class="font-display text-3xl sm:text-4xl font-bold" :class="seoReport.avgScore >= 80 ? 'text-emerald-600' : 'text-amber-600'">
            {{ seoReport.avgScore }}
          </p>
          <span class="font-mono text-xs text-mute">/ 100</span>
        </div>
        <p class="font-mono text-[0.68rem] text-mute">Diukur dari {{ seoReport.total }} project terdaftar</p>
      </div>

      <div class="rounded-3xl bg-white/85 p-5 border border-ink/10 shadow-xs space-y-2">
        <div class="flex items-center justify-between">
          <span class="font-mono text-[0.7rem] font-bold uppercase tracking-wider text-emerald-800">Grade A (Optimal)</span>
          <span class="size-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
        </div>
        <p class="font-display text-3xl sm:text-4xl font-bold text-emerald-600">
          {{ seoReport.gradeACount }}
        </p>
        <p class="font-mono text-[0.68rem] text-mute">Memenuhi seluruh standar Google SERP</p>
      </div>

      <div class="rounded-3xl bg-white/85 p-5 border border-ink/10 shadow-xs space-y-2">
        <div class="flex items-center justify-between">
          <span class="font-mono text-[0.7rem] font-bold uppercase tracking-wider text-amber-800">Perlu Optimasi</span>
          <span class="size-2 rounded-full bg-amber-500" />
        </div>
        <p class="font-display text-3xl sm:text-4xl font-bold text-amber-600">
          {{ seoReport.needsAttention.length }}
        </p>
        <p class="font-mono text-[0.68rem] text-mute">Skor di bawah 75 / 100</p>
      </div>

      <div class="rounded-3xl bg-white/85 p-5 border border-ink/10 shadow-xs space-y-2">
        <div class="flex items-center justify-between">
          <span class="font-mono text-[0.7rem] font-bold uppercase tracking-wider text-mute">Index Crawler</span>
          <span class="font-mono text-base">🤖</span>
        </div>
        <p class="font-display text-2xl sm:text-3xl font-bold text-ink">
          Robots OK
        </p>
        <p class="font-mono text-[0.68rem] text-emerald-700">Publik terindeks, admin privat</p>
      </div>
    </div>

    <!-- Platform Infrastructure Checklist -->
    <div class="rounded-3xl bg-white/85 p-6 sm:p-8 border border-ink/10 shadow-xs space-y-4">
      <div>
        <h3 class="font-display text-lg sm:text-xl font-bold text-ink">Infrastruktur SEO & Arsitektur Mesin Pencari</h3>
        <p class="text-xs text-mute font-sans mt-0.5">Komponen teknis yang terpasang otomatis untuk mempercepat crawling Google.</p>
      </div>

      <div class="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-2xl bg-emerald-50/80 p-4 border border-emerald-200/80 space-y-1">
          <div class="flex items-center gap-2 font-mono text-xs font-bold text-emerald-900">
            <span class="size-1.5 rounded-full bg-emerald-600" />
            <span>SSR Hydration</span>
          </div>
          <p class="text-xs text-emerald-800/90 font-sans leading-relaxed">Seluruh HTML dirender di server sebelum dikirim ke bot pencari.</p>
        </div>

        <div class="rounded-2xl bg-emerald-50/80 p-4 border border-emerald-200/80 space-y-1">
          <div class="flex items-center gap-2 font-mono text-xs font-bold text-emerald-900">
            <span class="size-1.5 rounded-full bg-emerald-600" />
            <span>Sitemap Dinamis</span>
          </div>
          <p class="text-xs text-emerald-800/90 font-sans leading-relaxed">Slug project published terdaftar otomatis di /sitemap.xml.</p>
        </div>

        <div class="rounded-2xl bg-emerald-50/80 p-4 border border-emerald-200/80 space-y-1">
          <div class="flex items-center gap-2 font-mono text-xs font-bold text-emerald-900">
            <span class="size-1.5 rounded-full bg-emerald-600" />
            <span>Open Graph & Twitter</span>
          </div>
          <p class="text-xs text-emerald-800/90 font-sans leading-relaxed">Kartu share multimedia kaya untuk WA, Twitter, dan LinkedIn.</p>
        </div>

        <div class="rounded-2xl bg-emerald-50/80 p-4 border border-emerald-200/80 space-y-1">
          <div class="flex items-center gap-2 font-mono text-xs font-bold text-emerald-900">
            <span class="size-1.5 rounded-full bg-emerald-600" />
            <span>JSON-LD Schema</span>
          </div>
          <p class="text-xs text-emerald-800/90 font-sans leading-relaxed">Structured data CreativeWork terpasang di tiap halaman karya.</p>
        </div>
      </div>
    </div>

    <!-- Projects Detailed SEO Health Audit Table -->
    <div class="rounded-3xl bg-white/90 border border-ink/10 shadow-xs overflow-hidden">
      <!-- Toolbar Filter -->
      <div class="p-5 sm:p-6 border-b border-ink/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 class="font-display text-lg sm:text-xl font-bold text-ink">Audit Kualitas SEO per Project</h3>
          <p class="text-xs text-mute font-sans mt-0.5">Analisis metrik judul, deskripsi, panjang konten, dan kata kunci tiap karya.</p>
        </div>

        <div class="flex items-center gap-2 flex-wrap font-mono text-xs">
          <input
            v-model="searchQuery"
            type="search"
            class="field font-sans text-xs !min-h-9 !py-1.5 !px-3 !rounded-xl"
            placeholder="Cari project..."
          >
          <select v-model="selectedFilter" class="field !min-h-9 !py-1.5 !px-3 font-mono cursor-pointer !rounded-xl">
            <option value="all">Semua Project</option>
            <option value="needs_attention">Perlu Optimasi (< 75)</option>
            <option value="grade_a">Grade A (≥ 80)</option>
          </select>
        </div>
      </div>

      <div v-if="status === 'pending'" class="p-10 text-center font-mono text-xs text-mute">
        Menganalisis performa SEO project…
      </div>

      <div v-else-if="!filteredAuditList.length" class="p-10 sm:p-14 text-center font-mono text-xs text-mute">
        Tidak ada project yang cocok dengan filter audit.
      </div>

      <!-- Desktop & Tablet Table View -->
      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[880px] border-collapse text-left font-sans text-sm">
          <thead>
            <tr class="border-b border-ink/10 font-mono text-xs uppercase tracking-wider text-mute bg-ink/[0.02]">
              <th class="p-4 pl-6">Project</th>
              <th class="p-4 text-center">Skor & Grade</th>
              <th class="p-4">Target Keyword</th>
              <th class="p-4">Kedalaman Konten</th>
              <th class="p-4">Diagnosa Audit</th>
              <th class="p-4 pr-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-ink/10">
            <tr v-for="item in filteredAuditList" :key="item.project.id" class="hover:bg-ink/[0.02] transition-colors">
              <td class="p-4 pl-6 font-display font-bold text-ink">
                <p class="text-base">{{ item.project.title }}</p>
                <span class="font-mono text-xs text-mute font-normal">/project/{{ item.project.slug }}</span>
              </td>

              <td class="p-4 text-center">
                <span
                  class="rounded-full px-3 py-1 font-mono text-xs font-bold border"
                  :class="item.analysis.colorClass"
                >
                  {{ item.analysis.score }} / 100 ({{ item.analysis.grade }})
                </span>
              </td>

              <td class="p-4 font-mono text-xs">
                <span v-if="item.project.focus_keyword" class="rounded-md bg-ink/5 px-2.5 py-1 text-ink font-semibold">
                  {{ item.project.focus_keyword }}
                </span>
                <span v-else class="text-mute italic">Belum diset</span>
              </td>

              <td class="p-4 font-mono text-xs text-mute">
                <p class="font-bold text-ink">{{ item.analysis.wordCount }} kata</p>
                <p class="text-[0.68rem]">~{{ item.analysis.readingTimeMinutes }} menit baca</p>
              </td>

              <td class="p-4 text-xs font-sans">
                <div class="space-y-1">
                  <div
                    v-for="check in item.analysis.auditItems.filter(a => a.status !== 'pass').slice(0, 2)"
                    :key="check.id"
                    class="flex items-center gap-1.5 text-amber-800"
                  >
                    <span class="size-1.5 rounded-full bg-amber-600 shrink-0" />
                    <span class="truncate max-w-xs">{{ check.label }}: {{ check.message }}</span>
                  </div>
                  <p v-if="!item.analysis.auditItems.some(a => a.status !== 'pass')" class="text-emerald-700 font-bold flex items-center gap-1.5">
                    <span class="size-1.5 rounded-full bg-emerald-600" />
                    <span>Semua kriteria SEO terpenuhi</span>
                  </p>
                </div>
              </td>

              <td class="p-4 pr-6 text-right whitespace-nowrap">
                <NuxtLink
                  :to="`/admin/projects/${item.project.id}/edit`"
                  class="rounded-full bg-ink/5 hover:bg-signal hover:text-white px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-ink transition-all inline-block"
                >
                  Optimasi ↗
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
