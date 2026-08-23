<script setup lang="ts">
import type { ProjectFormPayload } from '~/types/project-form'

definePageMeta({ middleware: 'admin', layout: 'admin' })
useSeoMeta({ title: 'Tambah Project Baru — Studio Admin Rumah Design', robots: 'noindex, nofollow' })

const { saveProject } = useProjectAdmin()
const { success, error: toastError } = useToast()
const busy = ref(false)

async function save(payload: ProjectFormPayload) {
  busy.value = true
  try {
    await saveProject(payload)
    success(`Project "${payload.title}" berhasil disimpan.`)
    await navigateTo('/admin/projects')
  }
  catch (error) {
    toastError(error instanceof Error ? error.message : 'Project gagal disimpan.')
  }
  finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-8">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-ink/12 pb-6">
      <div>
        <div class="inline-flex items-center gap-2 rounded-full bg-ink/5 px-3 py-1 font-mono text-[0.7rem] font-bold text-mute uppercase tracking-widest">
          <span class="size-1.5 rounded-full bg-signal" />
          <span>Editor Project Studio</span>
        </div>
        <h1 class="mt-2 sm:mt-3 font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
          Tambah Project Baru
        </h1>
        <p class="mt-1 font-sans text-xs sm:text-sm text-mute">
          Lengkapi informasi portofolio, upload visual thumbnail, dan tulis case study.
        </p>
      </div>

      <NuxtLink to="/admin/projects" class="rounded-full bg-white/80 hover:bg-white border border-ink/10 px-4 py-2 font-mono text-xs font-semibold text-ink transition-all cursor-pointer shadow-xs w-full sm:w-auto text-center">
        ← Kembali ke Daftar
      </NuxtLink>
    </div>

    <AdminProjectForm :busy="busy" @submit="save" />
  </div>
</template>
