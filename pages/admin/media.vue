<script setup lang="ts">
import AdminModal from '~/components/admin/AdminModal.vue'
import type { Database } from '~/types/database.types'

definePageMeta({ middleware: 'admin', layout: 'admin' })
useSeoMeta({ title: 'Media Library — Studio Admin Rumah Design', robots: 'noindex, nofollow' })

const client = useSupabaseClient<Database>()
const { uploadThumbnail } = useProjectAdmin()
const { success, error: toastError, info } = useToast()

const searchQuery = ref('')
const isUploading = ref(false)
const isDragOver = ref(false)
const assetToDelete = ref<{ name: string, id?: string } | null>(null)
const isDeleting = ref(false)
const previewModalUrl = ref<string | null>(null)

interface MediaFileItem {
  id: string
  name: string
  url: string
  created_at: string
  size: number
}

const { data: mediaFiles, status, refresh } = await useAsyncData('admin-media-files', async () => {
  const { data: user } = await client.auth.getUser()
  if (!user?.user) return []

  try {
    const { data, error } = await client.storage.from('project-media').list(user.user.id, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    })

    if (error) throw error
    if (!data) return []

    return data.map(file => ({
      id: file.id,
      name: file.name,
      url: client.storage.from('project-media').getPublicUrl(`${user.user.id}/${file.name}`).data.publicUrl,
      created_at: file.created_at || new Date().toISOString(),
      size: file.metadata?.size || 0,
    })) as MediaFileItem[]
  }
  catch {
    return []
  }
})

const filteredMedia = computed(() => {
  if (!mediaFiles.value) return []
  if (!searchQuery.value.trim()) return mediaFiles.value
  const q = searchQuery.value.toLowerCase().trim()
  return mediaFiles.value.filter(item => item.name.toLowerCase().includes(q))
})

async function handleUpload(files: FileList | null) {
  if (!files || !files.length) return
  isUploading.value = true
  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      await uploadThumbnail(file)
    }
    success(`Berhasil mengunggah ${files.length} file ke storage.`)
    await refresh()
  }
  catch (err) {
    toastError(err instanceof Error ? err.message : 'Gagal mengunggah media.')
  }
  finally {
    isUploading.value = false
  }
}

function onFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  handleUpload(input.files)
  input.value = ''
}

function onDrop(e: DragEvent) {
  isDragOver.value = false
  handleUpload(e.dataTransfer?.files ?? null)
}

async function copyUrl(url: string) {
  try {
    await navigator.clipboard.writeText(url)
    success('URL media berhasil disalin ke clipboard.')
  }
  catch {
    info(`URL: ${url}`)
  }
}

async function copyMarkdownSnippet(item: MediaFileItem) {
  const snippet = `![${item.name}](${item.url})`
  try {
    await navigator.clipboard.writeText(snippet)
    success('Snippet Markdown disalin: ' + snippet)
  }
  catch {
    info(snippet)
  }
}

function promptDeleteAsset(item: MediaFileItem) {
  assetToDelete.value = item
}

async function confirmDeleteAsset() {
  if (!assetToDelete.value) return
  isDeleting.value = true
  try {
    const { data: user } = await client.auth.getUser()
    if (!user?.user) throw new Error('Sesi admin tidak ditemukan')

    const path = `${user.user.id}/${assetToDelete.value.name}`
    const { error } = await client.storage.from('project-media').remove([path])
    if (error) throw error

    success('File berhasil dihapus dari storage.')
    await refresh()
  }
  catch (err) {
    toastError(err instanceof Error ? err.message : 'Gagal menghapus file.')
  }
  finally {
    isDeleting.value = false
    assetToDelete.value = null
  }
}

function formatBytes(bytes: number) {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-ink/12 pb-6">
      <div>
        <div class="inline-flex items-center gap-2 rounded-full bg-ink/5 px-3 py-1 font-mono text-[0.7rem] font-bold text-mute uppercase tracking-widest">
          <span class="size-1.5 rounded-full bg-signal" />
          <span>Supabase Storage Bucket</span>
        </div>
        <h1 class="mt-2 sm:mt-3 font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
          Media Library
        </h1>
        <p class="mt-1 font-sans text-xs sm:text-sm text-mute">
          Kelola aset visual thumbnail, ilustrasi case study, dan video preview.
        </p>
      </div>

      <div>
        <label class="rounded-full bg-signal text-white hover:bg-[#e63d10] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer inline-flex items-center gap-2 hover:scale-105 active:scale-95">
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4"
            class="hidden"
            :disabled="isUploading"
            @change="onFileSelect"
          >
          <span>{{ isUploading ? 'Mengunggah…' : '+ Unggah Media Baru' }}</span>
        </label>
      </div>
    </div>

    <!-- Drag & Drop Upload Zone -->
    <div
      class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 sm:p-12 transition-all text-center cursor-pointer bg-white/70 shadow-xs"
      :class="isDragOver ? 'border-signal bg-signal/5 scale-[1.01]' : 'border-ink/20 hover:border-signal/50'"
      @dragover.prevent="isDragOver = true"
      @dragleave.prevent="isDragOver = false"
      @drop.prevent="onDrop"
      @click="($refs.uploadInput as HTMLInputElement).click()"
    >
      <input
        ref="uploadInput"
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif,video/mp4"
        class="hidden"
        @change="onFileSelect"
      >
      <div class="size-12 rounded-2xl bg-ink/5 flex items-center justify-center text-2xl mb-2">
        ☁️
      </div>
      <p class="font-display font-bold text-ink text-base sm:text-lg">
        Tarik & Lepas Gambar / Video ke sini untuk Mengunggah
      </p>
      <p class="mt-1 font-mono text-xs text-mute">
        Bucket: <span class="font-bold text-ink">project-media</span> · Format didukung: WebP, PNG, JPG, GIF, MP4 · Max 10 MB
      </p>
    </div>

    <!-- Search & Summary Toolbar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 rounded-3xl bg-white/85 p-4 border border-ink/10 shadow-xs">
      <div class="relative flex-1 max-w-md">
        <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-mute text-xs">🔍</span>
        <input
          v-model="searchQuery"
          type="search"
          class="field pl-9 font-sans text-xs sm:text-sm !min-h-10 !rounded-2xl"
          placeholder="Cari nama berkas media..."
        >
      </div>
      <p class="font-mono text-xs text-mute pr-2">
        Menampilkan <span class="font-bold text-ink">{{ filteredMedia.length }}</span> aset tersimpan
      </p>
    </div>

    <!-- Media Grid -->
    <div v-if="status === 'pending'" class="p-12 text-center font-mono text-xs text-mute rounded-3xl bg-white/70 border border-ink/10">
      Memuat daftar file media…
    </div>

    <div v-else-if="!filteredMedia.length" class="p-10 sm:p-16 text-center rounded-3xl bg-white/85 border border-ink/10 space-y-3">
      <p class="font-display text-2xl font-bold text-ink">Belum ada file media.</p>
      <p class="font-mono text-xs text-mute">Unggah thumbnail project untuk mulai mengisi storage.</p>
    </div>

    <div v-else class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      <div
        v-for="item in filteredMedia"
        :key="item.id || item.name"
        class="group overflow-hidden rounded-3xl border border-ink/10 bg-white/90 shadow-xs flex flex-col justify-between transition-all hover:shadow-md"
      >
        <!-- Preview Container -->
        <div class="relative aspect-[16/10] w-full bg-ink/5 overflow-hidden cursor-pointer" @click="previewModalUrl = item.url">
          <img
            :src="item.url"
            :alt="item.name"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          >
          <div class="absolute inset-0 bg-void/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span class="rounded-full bg-white/90 text-ink px-3 py-1 font-mono text-[0.65rem] font-bold shadow-xs">
              🔍 Perbesar
            </span>
          </div>
          <button
            type="button"
            class="absolute top-2 right-2 rounded-full bg-void/80 text-white px-2.5 py-1 text-[0.65rem] font-mono uppercase font-bold opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-signal active:scale-95"
            title="Hapus Media"
            @click.stop="promptDeleteAsset(item)"
          >
            Hapus
          </button>
        </div>

        <!-- Info & Actions -->
        <div class="p-4 space-y-2">
          <p class="font-mono text-xs text-ink truncate font-medium" :title="item.name">
            {{ item.name }}
          </p>
          <div class="flex items-center justify-between font-mono text-[0.68rem] text-mute pt-1 border-t border-ink/5">
            <span>{{ formatBytes(item.size) }}</span>
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="font-bold text-ink hover:text-signal transition-colors cursor-pointer"
                title="Salin snippet markdown"
                @click="copyMarkdownSnippet(item)"
              >
                MD
              </button>
              <span>·</span>
              <button
                type="button"
                class="font-bold text-signal hover:underline cursor-pointer"
                title="Salin URL publik"
                @click="copyUrl(item.url)"
              >
                Salin URL
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <div
      v-if="previewModalUrl"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm"
      @click="previewModalUrl = null"
    >
      <div class="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-paper p-2 border border-ink/20 shadow-2xl" @click.stop>
        <img :src="previewModalUrl" alt="Media Full Preview" class="max-h-[80vh] w-auto object-contain rounded-2xl">
        <div class="flex justify-between items-center p-3 font-mono text-xs">
          <a :href="previewModalUrl" target="_blank" class="text-signal hover:underline">Buka Berkas Asli ↗</a>
          <button type="button" class="rounded-full bg-ink/10 px-3 py-1 font-bold" @click="previewModalUrl = null">Tutup (ESC)</button>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal for Delete Media -->
    <AdminModal
      :show="Boolean(assetToDelete)"
      :title="`Hapus berkas “${assetToDelete?.name}”?`"
      message="File ini akan dihapus dari Supabase Storage. Project yang menautkan URL ini mungkin tidak dapat menampilkan gambar."
      confirm-label="Hapus Berkas"
      cancel-label="Batal"
      :danger="true"
      :busy="isDeleting"
      @confirm="confirmDeleteAsset"
      @cancel="assetToDelete = null"
    />
  </div>
</template>
