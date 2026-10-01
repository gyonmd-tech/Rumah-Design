<script setup lang="ts">
import AdminIcon from '~/components/admin/AdminIcon.vue'
import type { Database } from '~/types/database.types'

definePageMeta({ middleware: 'admin', layout: 'admin' })
useSeoMeta({ title: 'Media Library — Studio Admin Hygione Darriyan', robots: 'noindex, nofollow' })

const client = useSupabaseClient<Database>()
const user = useSupabaseUser()
const { success, error: toastError } = useToast()

const MAX_MEDIA_SIZE = 10 * 1024 * 1024
const ALLOWED_MEDIA_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
}

const isUploading = ref(false)
const isDragOver = ref(false)
const uploadProgress = ref(0)
const searchQuery = ref('')
const lightboxItem = ref<{ url: string; name: string } | null>(null)

interface MediaFile {
  id: string
  name: string
  path: string
  url: string
  size: number
  created_at: string
  metadata?: { mimetype?: string }
}

const { data: files, refresh } = await useAsyncData('admin-media-files', async () => {
  const userId = user.value?.id
  if (!userId) return []

  const { data, error } = await client.storage
    .from('project-media')
    .list(userId, { sortBy: { column: 'created_at', order: 'desc' }, limit: 100 })

  if (error) throw error

  return await Promise.all(
    (data ?? []).map(async (file) => {
      const path = userId + '/' + file.name
      const { data: urlData } = client.storage
        .from('project-media')
        .getPublicUrl(path)
      return {
        id: file.id ?? path,
        name: file.name,
        path,
        url: urlData.publicUrl,
        size: file.metadata?.size ?? 0,
        created_at: file.created_at ?? '',
        metadata: file.metadata as MediaFile['metadata'],
      } satisfies MediaFile
    }),
  )
})

const filteredFiles = computed(() => {
  if (!files.value) return []
  if (!searchQuery.value.trim()) return files.value
  const q = searchQuery.value.toLowerCase()
  return files.value.filter(f => f.name.toLowerCase().includes(q))
})

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function isImage(file: MediaFile): boolean {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)
}

async function uploadFiles(rawFiles: File[]) {
  if (!rawFiles.length) return

  const userId = user.value?.id
  if (!userId) {
    toastError('Sesi admin tidak ditemukan. Silakan login ulang.')
    return
  }

  isUploading.value = true
  uploadProgress.value = 0

  let successCount = 0
  for (let i = 0; i < rawFiles.length; i++) {
    const file = rawFiles[i]
    const extension = ALLOWED_MEDIA_TYPES[file.type]
    if (!extension) {
      toastError(`Format "${file.name}" tidak didukung.`)
      continue
    }
    if (file.size > MAX_MEDIA_SIZE) {
      toastError(`Ukuran "${file.name}" melebihi 10 MB.`)
      continue
    }

    const baseName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-z0-9-]/gi, '-').toLowerCase()
    const path = `${userId}/${baseName || 'media'}-${crypto.randomUUID()}.${extension}`

    const { error } = await client.storage
      .from('project-media')
      .upload(path, file, {
        cacheControl: '31536000',
        contentType: file.type,
        upsert: false,
      })

    if (!error) {
      successCount++
    }
    else {
      toastError(`Gagal mengunggah "${file.name}": ${error.message}`)
    }

    uploadProgress.value = Math.round(((i + 1) / rawFiles.length) * 100)
  }

  isUploading.value = false
  if (successCount > 0) {
    success(`${successCount} berkas berhasil diunggah.`)
    await refresh()
  }
}

function onFileInput(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files?.length) {
    uploadFiles(Array.from(input.files))
    input.value = ''
  }
}

function onDrop(e: DragEvent) {
  isDragOver.value = false
  const dropped = e.dataTransfer?.files
  if (dropped?.length) {
    uploadFiles(Array.from(dropped))
  }
}

async function copyUrl(url: string) {
  try {
    await navigator.clipboard.writeText(url)
    success('URL berkas disalin ke clipboard.')
  }
  catch {
    toastError('Gagal menyalin URL.')
  }
}

async function copyMarkdown(file: MediaFile) {
  const alt = file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ')
  const md = `![${alt}](${file.url})`
  try {
    await navigator.clipboard.writeText(md)
    success('Markdown snippet disalin ke clipboard.')
  }
  catch {
    toastError('Gagal menyalin markdown.')
  }
}

const fileToDelete = ref<MediaFile | null>(null)
const isDeleting = ref(false)

function promptDeleteFile(file: MediaFile) {
  fileToDelete.value = file
}

async function confirmDeleteFile() {
  if (!fileToDelete.value) return
  isDeleting.value = true
  const { error } = await client.storage
    .from('project-media')
    .remove([fileToDelete.value.path])

  if (error) {
    toastError(`Gagal menghapus: ${error.message}`)
  }
  else {
    success(`"${fileToDelete.value.name}" berhasil dihapus.`)
    fileToDelete.value = null
    await refresh()
  }
  isDeleting.value = false
}
</script>

<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-5 border-b border-ink/10 pb-6">
      <div>
        <div class="inline-flex items-center gap-2 rounded-full bg-ink/5 border border-ink/10 px-3 py-1 font-mono text-[0.68rem] font-bold text-mute uppercase tracking-widest">
          <AdminIcon name="media" size="12" />
          <span>Supabase Storage — project-media</span>
        </div>
        <h1 class="mt-2.5 font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
          Media Library
        </h1>
        <p class="mt-1 font-sans text-xs sm:text-sm text-mute">
          Kelola aset visual proyek. Unggah, salin URL, dan hapus berkas dari bucket Supabase Storage.
        </p>
      </div>

      <div class="flex items-center gap-2 font-mono text-xs">
        <span class="text-mute">{{ filteredFiles.length }} berkas</span>
      </div>
    </div>

    <!-- Drag & Drop Upload Zone -->
    <div
      class="relative rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-8 sm:p-12 transition-all text-center"
      :class="isDragOver ? 'border-signal bg-signal/5 scale-[1.01]' : 'border-ink/20 bg-white/60 hover:border-signal/40'"
      @dragover.prevent="isDragOver = true"
      @dragleave.prevent="isDragOver = false"
      @drop.prevent="onDrop"
    >
      <!-- Upload Progress Overlay -->
      <div v-if="isUploading" class="space-y-4 w-full max-w-sm mx-auto">
        <div class="size-12 rounded-2xl bg-signal/10 flex items-center justify-center mx-auto text-signal">
          <AdminIcon name="upload" size="20" class="animate-pulse" />
        </div>
        <p class="font-display font-bold text-ink">Mengunggah berkas...</p>
        <div class="h-1.5 w-full rounded-full bg-ink/10 overflow-hidden">
          <div
            class="h-full rounded-full bg-signal transition-all duration-300"
            :style="{ width: `${uploadProgress}%` }"
          />
        </div>
        <p class="font-mono text-xs text-mute">{{ uploadProgress }}% selesai</p>
      </div>

      <!-- Default Upload State -->
      <div v-else class="space-y-4">
        <div class="size-12 rounded-2xl bg-ink/5 flex items-center justify-center mx-auto text-ink/60 border border-ink/10">
          <AdminIcon name="upload" size="20" />
        </div>
        <div>
          <p class="font-display text-base sm:text-lg font-bold text-ink">
            Tarik & Lepas berkas ke sini
          </p>
          <p class="font-sans text-xs sm:text-sm text-mute mt-0.5">
            Atau klik tombol di bawah untuk memilih dari perangkat Anda
          </p>
        </div>
        <label class="inline-flex items-center gap-2 rounded-xl bg-signal text-ink hover:bg-signal/90 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shadow-sm shadow-signal/20 hover:scale-[1.02] active:scale-98">
          <AdminIcon name="upload" size="13" />
          <span>Pilih Berkas</span>
          <input type="file" multiple accept="image/*,video/*,.gif" class="hidden" @change="onFileInput">
        </label>
        <p class="font-mono text-[0.68rem] text-mute">WebP, PNG, JPG, GIF, SVG, MP4 — Maks. 10 MB per berkas</p>
      </div>
    </div>

    <!-- Search & Grid -->
    <div class="space-y-4">
      <!-- Search bar -->
      <div class="relative max-w-sm">
        <AdminIcon name="search" size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
        <input
          v-model="searchQuery"
          type="search"
          class="field !min-h-9 pl-8 font-mono text-xs !rounded-xl !w-full"
          placeholder="Cari nama berkas..."
        >
      </div>

      <!-- Empty State -->
      <div v-if="!filteredFiles.length" class="rounded-2xl border border-ink/10 bg-white/85 p-12 text-center shadow-2xs">
        <div class="size-12 rounded-2xl bg-ink/5 flex items-center justify-center mx-auto text-ink/50 mb-4">
          <AdminIcon name="media" size="20" />
        </div>
        <p class="font-display font-bold text-ink">Tidak ada berkas di library.</p>
        <p class="font-mono text-xs text-mute mt-1">Unggah aset visual portofolio melalui zona upload di atas.</p>
      </div>

      <!-- Media Grid -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        <div
          v-for="file in filteredFiles"
          :key="file.id"
          class="group rounded-2xl border border-ink/10 bg-white/95 overflow-hidden shadow-2xs hover:shadow-md transition-all"
        >
          <!-- Thumbnail / File Type Preview -->
          <div class="relative aspect-[4/3] bg-ink/5 overflow-hidden cursor-pointer" @click="lightboxItem = { url: file.url, name: file.name }">
            <img
              v-if="isImage(file)"
              :src="file.url"
              :alt="file.name"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            >
            <div v-else class="h-full flex items-center justify-center text-mute">
              <AdminIcon name="media" size="24" />
            </div>

            <!-- Hover overlay -->
            <div class="absolute inset-0 bg-ink/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div class="size-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <AdminIcon name="eye" size="16" class="text-white" />
              </div>
            </div>
          </div>

          <!-- File Info & Actions -->
          <div class="p-3 space-y-2">
            <p class="font-mono text-[0.65rem] text-ink font-semibold truncate" :title="file.name">
              {{ file.name }}
            </p>
            <p class="font-mono text-[0.62rem] text-mute">{{ formatBytes(file.size) }}</p>

            <!-- Action Buttons Row -->
            <div class="flex items-center gap-1 font-mono text-[0.65rem]">
              <button
                type="button"
                class="flex-1 rounded-lg bg-ink/5 hover:bg-ink hover:text-paper py-1 text-ink transition-all cursor-pointer font-semibold flex items-center justify-center gap-1"
                title="Salin URL publik"
                @click="copyUrl(file.url)"
              >
                <AdminIcon name="copy" size="11" />
                <span>URL</span>
              </button>
              <button
                type="button"
                class="flex-1 rounded-lg bg-ink/5 hover:bg-ink hover:text-paper py-1 text-ink transition-all cursor-pointer font-semibold flex items-center justify-center gap-1"
                title="Salin Markdown ![alt](url)"
                @click="copyMarkdown(file)"
              >
                <AdminIcon name="code" size="11" />
                <span>MD</span>
              </button>
              <button
                type="button"
                class="rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white p-1 text-rose-600 transition-all cursor-pointer"
                title="Hapus berkas"
                @click="promptDeleteFile(file)"
              >
                <AdminIcon name="trash" size="11" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="lightboxItem"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          @click.self="lightboxItem = null"
        >
          <div class="relative max-w-4xl w-full bg-[#0d0c0b] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <div class="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <p class="font-mono text-xs text-white/80 truncate">{{ lightboxItem.name }}</p>
              <button
                type="button"
                class="text-white/60 hover:text-white cursor-pointer"
                @click="lightboxItem = null"
              >
                <AdminIcon name="close" size="16" />
              </button>
            </div>
            <div class="p-4">
              <img :src="lightboxItem.url" :alt="lightboxItem.name" class="max-h-[75vh] w-full object-contain rounded-xl">
            </div>
            <div class="flex items-center justify-end gap-2 px-5 pb-5">
              <button
                type="button"
                class="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white px-4 py-2 font-mono text-xs font-bold transition-all cursor-pointer"
                @click="copyUrl(lightboxItem.url); lightboxItem = null"
              >
                <AdminIcon name="copy" size="12" />
                <span>Salin URL</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <AdminModal
      :show="Boolean(fileToDelete)"
      :title="`Hapus &quot;${fileToDelete?.name}&quot;?`"
      message="Berkas ini akan dihapus permanen dari Supabase Storage dan tidak dapat dipulihkan."
      confirm-label="Hapus Permanen"
      cancel-label="Batal"
      :danger="true"
      :busy="isDeleting"
      @confirm="confirmDeleteFile"
      @cancel="fileToDelete = null"
    />
  </div>
</template>
