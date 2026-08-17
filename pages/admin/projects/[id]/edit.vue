<script setup lang="ts">
import type { Database, Project } from '~/types/database.types'
import type { ProjectFormPayload } from '~/types/project-form'

definePageMeta({ middleware: 'admin', layout: 'admin' })
useSeoMeta({ title: 'Edit project — Admin Rumah Design', robots: 'noindex, nofollow' })

const route = useRoute()
const client = useSupabaseClient<Database>()
const { saveProject } = useProjectAdmin()
const busy = ref(false)
const pageError = ref('')

const { data: project } = await useAsyncData(`admin-project-${route.params.id}`, async () => {
  const { data, error } = await client.from('projects').select('*').eq('id', String(route.params.id)).maybeSingle()
  if (error) throw error
  if (!data) throw createError({ statusCode: 404, statusMessage: 'Project tidak ditemukan' })
  return data as Project
})

async function save(payload: ProjectFormPayload) {
  if (!project.value) return
  busy.value = true
  pageError.value = ''
  try {
    await saveProject(payload, project.value)
    await navigateTo('/admin/projects')
  }
  catch (error) {
    pageError.value = error instanceof Error ? error.message : 'Project gagal diperbarui.'
  }
  finally {
    busy.value = false
  }
}
</script>

<template>
  <div v-if="project" class="mx-auto max-w-5xl">
    <p class="eyebrow text-muted">Projects / Edit</p><h1 class="mt-2 text-5xl font-medium tracking-[-0.055em]">{{ project.title }}</h1>
    <p v-if="pageError" role="alert" class="mt-6 border border-red-700/30 bg-red-50 p-4 text-sm text-red-900">{{ pageError }}</p>
    <div class="mt-8 border border-line bg-paper p-5 sm:p-8"><AdminProjectForm :project="project" :busy="busy" @submit="save" /></div>
  </div>
</template>
