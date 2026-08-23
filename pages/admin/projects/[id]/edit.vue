<script setup lang="ts">
import type { Database, Project } from '~/types/database.types'
import type { ProjectFormPayload } from '~/types/project-form'

definePageMeta({ middleware: 'admin', layout: 'admin' })
useSeoMeta({ title: 'Edit Project — Studio Admin Rumah Design', robots: 'noindex, nofollow' })

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
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-ink/12 pb-6">
      <div>
        <div class="flex items-center gap-2">
          <div class="inline-flex items-center gap-2 rounded-full bg-ink/5 px-3 py-1 font-mono text-[0.7rem] font-bold text-mute uppercase tracking-widest">
            <span class="size-1.5 rounded-full bg-signal" />
            <span>Editor Project Studio</span>
          </div>
          <span
            class="rounded-full px-2.5 py-0.5 font-mono text-[0.68rem] font-bold uppercase tracking-wider"
            :class="project.status === 'published' ? 'bg-emerald-100 text-emerald-900' : 'bg-ink/10 text-mute'"
          >
            {{ project.status }}
          </span>
        </div>
        <h1 class="mt-2 sm:mt-3 font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
          {{ project.title }}
        </h1>
        <div class="flex items-center gap-2 mt-1 font-mono text-xs text-mute">
          <span>/project/{{ project.slug }}</span>
          <span>·</span>
          <NuxtLink :to="`/project/${project.slug}`" target="_blank" class="text-signal hover:underline">
            Lihat Halaman Publik ↗
          </NuxtLink>
        </div>
      </div>

      <NuxtLink to="/admin/projects" class="rounded-full bg-white/80 hover:bg-white border border-ink/10 px-4 py-2 font-mono text-xs font-semibold text-ink transition-all cursor-pointer shadow-xs w-full sm:w-auto text-center">
        ← Kembali ke Daftar
      </NuxtLink>
    </div>

    <AdminProjectForm :project="project" :busy="busy" @submit="save" />
  </div>
</template>
