<script setup lang="ts">
import AdminIcon from '~/components/admin/AdminIcon.vue'
import type { Database, Project } from '~/types/database.types'
import type { ProjectFormPayload } from '~/types/project-form'

definePageMeta({ middleware: 'admin', layout: 'admin' })
useSeoMeta({ title: 'Edit Project — Studio Admin Hygione Darriyan', robots: 'noindex, nofollow' })

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
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-ink/10 pb-6">
      <div class="min-w-0 flex-1">
        <div class="flex items-center flex-wrap gap-2">
          <div class="inline-flex items-center gap-2 rounded-full bg-ink/5 border border-ink/10 px-3 py-1 font-mono text-[0.68rem] font-bold text-mute uppercase tracking-widest">
            <AdminIcon name="edit" size="12" />
            <span>Editor Project Studio</span>
          </div>
          <span
            class="rounded-full px-2.5 py-0.5 font-mono text-[0.68rem] font-bold uppercase tracking-wider border"
            :class="project.status === 'published' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-ink/5 text-mute border-ink/10'"
          >
            {{ project.status }}
          </span>
        </div>

        <h1 class="mt-2.5 font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight truncate" :title="project.title">
          {{ project.title }}
        </h1>

        <div class="flex items-center gap-3 mt-1 font-mono text-xs text-mute">
          <span class="truncate max-w-[200px]">/project/{{ project.slug }}</span>
          <span class="text-mute/40">·</span>
          <a
            :href="`/project/${project.slug}`"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-1 text-signal hover:underline whitespace-nowrap"
          >
            <span>Lihat Publik</span>
            <AdminIcon name="external" size="10" />
          </a>
        </div>
      </div>

      <NuxtLink
        to="/admin/projects"
        class="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-ink/5 border border-ink/15 px-4 py-2.5 font-mono text-xs font-semibold text-ink transition-all cursor-pointer shadow-2xs w-full sm:w-auto justify-center shrink-0"
      >
        <AdminIcon name="arrow-left" size="12" />
        <span>Kembali ke Daftar</span>
      </NuxtLink>
    </div>

    <AdminProjectForm :project="project" :busy="busy" @submit="save" />
  </div>
</template>
