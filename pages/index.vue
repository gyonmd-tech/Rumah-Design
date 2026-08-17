<script setup lang="ts">
import type { Project, ProjectCategory } from '~/types/database.types'

const { data: projects, status, error, refresh } = await useAsyncData('published-projects', async () => {
  return await $fetch<Project[]>('/api/projects')
})

const category = ref<ProjectCategory | 'all'>('all')
const style = ref('Semua gaya')
const styles = computed(() => [...new Set((projects.value ?? []).flatMap(project => project.style_tags))].sort())
const filteredProjects = computed(() => (projects.value ?? []).filter((project) => {
  const matchesCategory = category.value === 'all' || project.category === category.value
  const matchesStyle = style.value === 'Semua gaya' || project.style_tags.includes(style.value)
  return matchesCategory && matchesStyle
}))

useSeoMeta({
  title: 'Rumah Design — Selected digital work',
  description: 'Kumpulan karya frontend dan cerita proses desain dari seorang product designer yang membangun produknya sendiri.',
  ogTitle: 'Rumah Design — Selected digital work',
  ogDescription: 'Project frontend terpilih, lengkap dengan proses desain dan live demo.',
  ogType: 'website',
})
</script>

<template>
  <div class="page-shell">
    <section class="grid min-h-[min(780px,calc(100vh-5rem))] content-between gap-16 py-12 sm:py-16">
      <div class="max-w-7xl">
        <p class="eyebrow mb-6 text-muted">Product design × frontend</p>
        <h1 class="max-w-[13ch] text-balance text-[clamp(3.8rem,10vw,10rem)] font-medium leading-[0.84] tracking-[-0.07em]">
          Ide yang dirancang untuk benar-benar hidup.
        </h1>
      </div>
      <div class="grid gap-6 border-t border-ink/20 pt-5 md:grid-cols-[1fr_2fr]">
        <p class="eyebrow text-muted">Rumah untuk karya digital</p>
        <p class="max-w-3xl text-pretty text-xl leading-relaxed sm:text-2xl">
          Saya merancang pengalaman dan membangun frontend-nya—dari alur pertama sampai produk yang bisa dicoba langsung.
        </p>
      </div>
    </section>

    <section id="work" class="scroll-mt-8 pt-12 sm:pt-20">
      <div class="mb-8 flex items-end justify-between gap-5">
        <div>
          <p class="eyebrow text-muted">Selected work</p>
          <h2 class="mt-3 text-[clamp(2.5rem,6vw,6rem)] font-medium leading-none tracking-[-0.06em]">Project pilihan</h2>
        </div>
        <p class="hidden text-sm text-muted sm:block">{{ projects?.length ?? 0 }} project</p>
      </div>

      <ProjectFilter v-model:category="category" v-model:style="style" :styles="styles" />

      <div v-if="status === 'pending'" class="grid gap-7 py-10 md:grid-cols-2">
        <div v-for="item in 4" :key="item" class="animate-pulse">
          <div class="aspect-[4/3] bg-ink/10" />
          <div class="mt-4 h-7 w-1/2 bg-ink/10" />
        </div>
      </div>
      <div v-else-if="error" class="my-10 border border-red-700/30 bg-red-50 p-6">
        <p class="font-semibold">Project belum dapat dimuat.</p>
        <p class="mt-2 text-sm text-muted">Periksa konfigurasi Supabase atau coba kembali.</p>
        <button type="button" class="button-secondary mt-5 cursor-pointer" @click="refresh()">Coba lagi</button>
      </div>
      <div v-else-if="filteredProjects.length" class="grid gap-x-7 gap-y-12 py-10 md:grid-cols-2">
        <ProjectCard v-for="(project, index) in filteredProjects" :key="project.id" :project="project" :index="index" />
      </div>
      <div v-else class="my-10 border border-ink/20 p-8 text-center sm:p-14">
        <p class="text-2xl font-semibold tracking-[-0.03em]">Belum ada project pada filter ini.</p>
        <button v-if="projects?.length" type="button" class="button-secondary mt-6 cursor-pointer" @click="category = 'all'; style = 'Semua gaya'">Reset filter</button>
        <p v-else class="mt-3 text-muted">Project pertama sedang disiapkan.</p>
      </div>
    </section>
  </div>
</template>
