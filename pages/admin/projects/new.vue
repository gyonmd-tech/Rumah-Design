<script setup lang="ts">
import type { ProjectFormPayload } from '~/types/project-form'

definePageMeta({ middleware: 'admin', layout: 'admin' })
useSeoMeta({ title: 'Tambah Project — Admin Rumah Design', robots: 'noindex, nofollow' })

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
    <div class="flex flex-wrap items-end justify-between gap-5 border-b border-ink/12 pb-6">
      <div>
        <div class="inline-flex items-center gap-2 rounded-full bg-ink/5 px-3 py-1 font-mono text-[0.7rem] font-bold text-mute uppercase tracking-widest">
          <span class="size-1.5 rounded-full bg-signal" />
          <span>Editor Project</span>
        </div>
        <h1 class="mt-3 font-display text-4xl font-bold text-ink tracking-tight">Tambah Project Baru</h1>
      </div>
      <NuxtLink to="/admin/projects" class="button-secondary text-xs">
        ← Kembali ke Daftar
      </NuxtLink>
    </div>

    <AdminProjectForm :busy="busy" @submit="save" />
  </div>
</template>

