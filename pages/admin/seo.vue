<script setup lang="ts">
import type { Database, Project } from '~/types/database.types'
import { analyzeSeoQuality } from '~/utils/seo'

definePageMeta({ middleware: 'admin', layout: 'admin' })
useSeoMeta({ title: 'SEO Health Center — Admin Rumah Design', robots: 'noindex, nofollow' })

const client = useSupabaseClient<Database>()

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
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-wrap items-end justify-between gap-5 border-b border-ink/12 pb-6">
      <div>
        <div class="inline-flex items-center gap-2 rounded-full bg-ink/5 px-3 py-1 font-mono text-[0.7rem] font-bold text-mute uppercase tracking-widest">
          <span class="size-1.5 rounded-full bg-signal" />
          <span>Search Engine Optimization</span>
        </div>
        <h1 class="mt-3 font-display text-4xl font-bold text-ink tracking-tight">SEO Health Center</h1>
      </div>
      <div class="flex items-center gap-3">
        <a
          href="/sitemap.xml"
          target="_blank"
          class="button-secondary text-xs"
        >
          Lihat sitemap.xml ↗
        </a>
      </div>
    </div>

    <!-- SEO Performance Overview Cards -->
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div class="rounded-3xl bg-white/85 p-5 border border-ink/10 shadow-xs space-y-1">
        <span class="font-mono text-[0.7rem] font-bold uppercase tracking-wider text-mute">Skor Rata-rata</span>
        <div class="flex items-baseline gap-1">
          <p class="font-display text-3xl font-bold" :class="seoReport.avgScore >= 80 ? 'text-emerald-600' : 'text-amber-600'">
            {{ seoReport.avgScore }}
          </p>
          <span class="font-mono text-xs text-mute">/ 100</span>
        </div>
      </div>

      <div class="rounded-3xl bg-white/85 p-5 border border-ink/10 shadow-xs space-y-1">
        <span class="font-mono text-[0.7rem] font-bold uppercase tracking-wider text-emerald-700">Skor Grade A</span>
        <p class="font-display text-3xl font-bold text-emerald-600">
          {{ seoReport.gradeACount }} <span class="text-xs font-mono text-mute font-normal">project</span>
        </p>
      </div>

      <div class="rounded-3xl bg-white/85 p-5 border border-ink/10 shadow-xs space-y-1">
        <span class="font-mono text-[0.7rem] font-bold uppercase tracking-wider text-amber-700">Perlu Optimasi</span>
        <p class="font-display text-3xl font-bold text-amber-600">
          {{ seoReport.needsAttention.length }} <span class="text-xs font-mono text-mute font-normal">project</span>
        </p>
      </div>

      <div class="rounded-3xl bg-white/85 p-5 border border-ink/10 shadow-xs space-y-1">
        <span class="font-mono text-[0.7rem] font-bold uppercase tracking-wider text-mute">Index Status</span>
        <p class="font-display text-2xl font-bold text-ink">
          Robots Enabled
        </p>
      </div>
    </div>

    <!-- Platform Infrastructure Checklist -->
    <div class="rounded-3xl bg-white/85 p-6 sm:p-8 border border-ink/10 shadow-xs space-y-4">
      <h3 class="font-display text-xl font-bold text-ink">Infrastruktur SEO Rumah Design</h3>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-2xl bg-emerald-50/70 p-4 border border-emerald-200/80 space-y-1">
          <div class="flex items-center gap-2 font-mono text-xs font-bold text-emerald-900">
            <span class="size-1.5 rounded-full bg-emerald-600" />
            <span>Server-Side Rendered</span>
          </div>
          <p class="text-xs text-emerald-800/90 font-sans leading-relaxed">HTML penuh dirender di server sebelum dikirim ke crawler.</p>
        </div>

        <div class="rounded-2xl bg-emerald-50/70 p-4 border border-emerald-200/80 space-y-1">
          <div class="flex items-center gap-2 font-mono text-xs font-bold text-emerald-900">
            <span class="size-1.5 rounded-full bg-emerald-600" />
            <span>Auto Sitemap XML</span>
          </div>
          <p class="text-xs text-emerald-800/90 font-sans leading-relaxed">Daftar slug project published terdaftar di /sitemap.xml.</p>
        </div>

        <div class="rounded-2xl bg-emerald-50/70 p-4 border border-emerald-200/80 space-y-1">
          <div class="flex items-center gap-2 font-mono text-xs font-bold text-emerald-900">
            <span class="size-1.5 rounded-full bg-emerald-600" />
            <span>Open Graph Tags</span>
          </div>
          <p class="text-xs text-emerald-800/90 font-sans leading-relaxed">Pratinjau kartu sosial kaya untuk Twitter, LinkedIn & WA.</p>
        </div>

        <div class="rounded-2xl bg-emerald-50/70 p-4 border border-emerald-200/80 space-y-1">
          <div class="flex items-center gap-2 font-mono text-xs font-bold text-emerald-900">
            <span class="size-1.5 rounded-full bg-emerald-600" />
            <span>Schema.org JSON-LD</span>
          </div>
          <p class="text-xs text-emerald-800/90 font-sans leading-relaxed">Structured data CreativeWork terpasang di tiap halaman.</p>
        </div>
      </div>
    </div>

    <!-- Projects Detailed SEO Health Audit Table -->
    <div class="rounded-3xl bg-white/90 border border-ink/10 shadow-xs overflow-hidden">
      <div class="p-6 border-b border-ink/10 flex items-center justify-between">
        <div>
          <h3 class="font-display text-xl font-bold text-ink">Audit SEO per Project</h3>
          <p class="text-xs text-mute font-sans mt-0.5">Analisis metrik judul, deskripsi, panjang konten, dan kata kunci tiap karya.</p>
        </div>
      </div>

      <div v-if="status === 'pending'" class="p-8 text-center font-mono text-xs text-mute">
        Menganalisis performa SEO project…
      </div>

      <div v-else-if="!seoReport.analyzed.length" class="p-10 text-center font-mono text-xs text-mute">
        Belum ada project untuk diaudit.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[850px] border-collapse text-left font-sans text-sm">
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
            <tr v-for="item in seoReport.analyzed" :key="item.project.id" class="hover:bg-ink/[0.02] transition-colors">
              <td class="p-4 pl-6 font-display font-bold text-ink">
                <p>{{ item.project.title }}</p>
                <span class="font-mono text-xs text-mute font-normal">/{{ item.project.slug }}</span>
              </td>

              <td class="p-4 text-center">
                <span
                  class="rounded-full px-3 py-1 font-mono text-xs font-bold border"
                  :class="item.analysis.colorClass"
                >
                  {{ item.analysis.score }} ({{ item.analysis.grade }})
                </span>
              </td>

              <td class="p-4 font-mono text-xs">
                <span v-if="item.project.focus_keyword" class="rounded-md bg-ink/5 px-2 py-1 text-ink font-semibold">
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
                  class="rounded-full bg-ink/5 hover:bg-signal hover:text-white px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-ink transition-all"
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
