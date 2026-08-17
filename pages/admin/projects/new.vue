<script setup lang="ts">
import type { ProjectFormPayload } from '~/types/project-form'

definePageMeta({ middleware: 'admin', layout: 'admin' })
useSeoMeta({ title: 'Project baru — Admin Rumah Design', robots: 'noindex, nofollow' })

const { saveProject } = useProjectAdmin()
const busy = ref(false)
const pageError = ref('')

async function save(payload: ProjectFormPayload) {
  busy.value = true
  pageError.value = ''
  try {
    await saveProject(payload)
    await navigateTo('/admin/projects')
  }
  catch (error) {
    pageError.value = error instanceof Error ? error.message : 'Project gagal disimpan.'
  }
  finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-5xl">
    <p class="eyebrow text-muted">Projects / New</p><h1 class="mt-2 text-5xl font-medium tracking-[-0.055em]">Tambah project</h1>
    <p v-if="pageError" role="alert" class="mt-6 border border-red-700/30 bg-red-50 p-4 text-sm text-red-900">{{ pageError }}</p>
    <div class="mt-8 border border-line bg-paper p-5 sm:p-8"><AdminProjectForm :busy="busy" @submit="save" /></div>
  </div>
</template>
