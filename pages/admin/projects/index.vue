<script setup lang="ts">
import type { Database, Project } from '~/types/database.types'
import { categoryLabel } from '~/utils/project'

definePageMeta({ middleware: 'admin', layout: 'admin' })
useSeoMeta({ title: 'Projects — Admin Rumah Design', robots: 'noindex, nofollow' })

const client = useSupabaseClient<Database>()
const { deleteProject } = useProjectAdmin()
const deletingId = ref('')
const pageError = ref('')

const { data: projects, status, refresh } = await useAsyncData('admin-projects', async () => {
  const { data, error } = await client.from('projects').select('*').order('updated_at', { ascending: false })
  if (error) throw error
  return data as Project[]
})

async function remove(project: Project) {
  if (!confirm(`Hapus project “${project.title}”? Tindakan ini tidak dapat dibatalkan.`)) return
  deletingId.value = project.id
  pageError.value = ''
  try {
    await deleteProject(project.id)
    await refresh()
  }
  catch (error) {
    pageError.value = error instanceof Error ? error.message : 'Project gagal dihapus.'
  }
  finally {
    deletingId.value = ''
  }
}
</script>

<template>
  <div>
    <div class="flex flex-wrap items-end justify-between gap-5">
      <div><p class="eyebrow text-muted">Content manager</p><h1 class="mt-2 text-5xl font-medium tracking-[-0.055em]">Projects</h1></div>
      <NuxtLink to="/admin/projects/new" class="button-primary">Tambah project</NuxtLink>
    </div>
    <p v-if="pageError" role="alert" class="mt-6 border border-red-700/30 bg-red-50 p-4 text-sm text-red-900">{{ pageError }}</p>

    <div v-if="status === 'pending'" class="mt-8 animate-pulse bg-white p-8 text-muted">Memuat project…</div>
    <div v-else-if="!projects?.length" class="mt-8 border border-line bg-paper p-10 text-center">
      <p class="text-2xl font-semibold">Belum ada project.</p><p class="mt-2 text-muted">Tambahkan karya pertama untuk mulai mengisi homepage.</p>
    </div>
    <div v-else class="mt-8 overflow-x-auto border border-line bg-paper">
      <table class="w-full min-w-[760px] border-collapse text-left">
        <thead><tr class="border-b border-line text-xs uppercase tracking-[0.12em] text-muted"><th class="p-4">Project</th><th class="p-4">Kategori</th><th class="p-4">Status</th><th class="p-4">Diperbarui</th><th class="p-4 text-right">Aksi</th></tr></thead>
        <tbody>
          <tr v-for="project in projects" :key="project.id" class="border-b border-line last:border-0">
            <td class="p-4"><div class="flex items-center gap-4"><img :src="project.thumbnail_url" alt="" class="aspect-[4/3] w-20 object-cover"><div><p class="font-semibold">{{ project.title }}</p><p class="mt-1 text-xs text-muted">/{{ project.slug }}</p></div></div></td>
            <td class="p-4 text-sm">{{ categoryLabel(project.category) }}</td>
            <td class="p-4"><span class="rounded-full px-3 py-1 text-xs font-semibold" :class="project.status === 'published' ? 'bg-green-100 text-green-900' : 'bg-ink/10 text-muted'">{{ project.status }}</span></td>
            <td class="p-4 text-sm text-muted">{{ new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(project.updated_at)) }}</td>
            <td class="p-4"><div class="flex justify-end gap-4 text-xs font-bold uppercase tracking-[0.1em]"><NuxtLink :to="`/admin/projects/${project.id}/edit`" class="hover:text-accent">Edit</NuxtLink><button type="button" class="cursor-pointer hover:text-red-700" :disabled="deletingId === project.id" @click="remove(project)">{{ deletingId === project.id ? 'Menghapus…' : 'Hapus' }}</button></div></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
