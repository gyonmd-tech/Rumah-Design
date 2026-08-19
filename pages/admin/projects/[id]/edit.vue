<script setup lang="ts">
import type { Database, Project } from '~/types/database.types'
import type { ProjectFormPayload } from '~/types/project-form'

definePageMeta({ middleware: 'admin', layout: 'admin' })
useSeoMeta({ title: 'Edit Project — Admin Rumah Design', robots: 'noindex, nofollow' })

const route = useRoute()
const client = useSupabaseClient<Database>()
const { saveProject } = useProjectAdmin()
const { success, error: toastError } = useToast()
const busy = ref(false)

const { data: project } = await useAsyncData(`admin-project-${route.params.id}`, async () => {
  const { data, error } = await client.from('projects').select('*').eq('id', String(route.params.id)).maybeSingle()
  if (error) throw error
  if (!data) throw createError({ statusCode: 404, statusMessage: 'Project tidak ditemukan' })
  return data as Project
})

async function save(payload: ProjectFormPayload) {
  if (!project.value) return
  busy.value = true
  try {
    await saveProject(payload, project.value)
    success(`Project "${payload.title}" berhasil diperbarui.`)
    await navigateTo('/admin/projects')
  }
  catch (error) {
    toastError(error instanceof Error ? error.message : 'Project gagal diperbarui.')
  }
  finally {
    busy.value = false
  }
}
</script>

<template>
  <div v-if="project" class="mx-auto max-w-5xl space-y-8">
    <div class="flex flex-wrap items-end justify-between gap-5 border-b border-ink/12 pb-6">
      <div>
        <div class="inline-flex items-center gap-2 rounded-full bg-ink/5 px-3 py-1 font-mono text-[0.7rem] font-bold text-mute uppercase tracking-widest">
          <span class="size-1.5 rounded-full bg-signal" />
          <span>Editor Project</span>
        </div>
        <h1 class="mt-3 font-display text-4xl font-bold text-ink tracking-tight">{{ project.title }}</h1>
      </div>
      <NuxtLink to="/admin/projects" class="button-secondary text-xs">
        ← Kembali ke Daftar
      </NuxtLink>
    </div>

    <AdminProjectForm :project="project" :busy="busy" @submit="save" />
  </div>
</template>

