<script setup lang="ts">
import AdminModal from '~/components/admin/AdminModal.vue'
import type { Database } from '~/types/database.types'

definePageMeta({ middleware: 'admin', layout: 'admin' })
useSeoMeta({ title: 'Media Library — Admin Rumah Design', robots: 'noindex, nofollow' })

const client = useSupabaseClient<Database>()
const { uploadThumbnail } = useProjectAdmin()
const { success, error: toastError, info } = useToast()

const searchQuery = ref('')
const isUploading = ref(false)
const isDragOver = ref(false)
const assetToDelete = ref<{ name: string, id?: string } | null>(null)
const isDeleting = ref(false)

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
  <div class="space-y-6 sm:space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-ink/12 pb-5">
      <div>
        <div class="inline-flex items-center gap-2 rounded-full bg-ink/5 px-3 py-1 font-mono text-[0.7rem] font-bold text-mute uppercase tracking-widest">
          <span class="size-1.5 rounded-full bg-signal" />
          <span>Supabase Storage</span>
        </div>
        <h1 class="mt-2 sm:mt-3 font-display text-2xl sm:text-3xl md:text-4xl font-bold text-ink tracking-tight">Media Library</h1>
      </div>

      <div>
        <label class="button-primary cursor-pointer text-xs w-full sm:w-auto text-center inline-flex">
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4"
            class="hidden"
            :disabled="isUploading"
            @change="onFileSelect"
          >
          {{ isUploading ? 'Mengunggah…' : '+ Unggah Media Baru' }}
        </label>
      </div>
    </div>

    <!-- Drag & Drop Upload Banner -->
    <div
      class="flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border-2 border-dashed p-6 sm:p-10 transition-all text-center cursor-pointer bg-white/60"
      :class="isDragOver ? 'border-signal bg-signal/5' : 'border-ink/20 hover:border-signal/50'"
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
      <p class="font-display font-bold text-ink text-sm sm:text-base">
        Tarik & Lepas Gambar ke sini atau ketuk untuk unggah
      </p>
      <p class="mt-1 font-mono text-[0.68rem] sm:text-xs text-mute">
        Bucket: <span class="font-bold text-ink">project-media</span> · Max 10 MB per file
      </p>
    </div>

    <!-- Search Toolbar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl bg-white/80 p-3.5 sm:p-4 border border-ink/10 shadow-xs">
      <div class="relative flex-1 max-w-md">
        <input
          v-model="searchQuery"
          type="search"
          class="field font-sans text-xs sm:text-sm !min-h-10"
          placeholder="Cari nama file media..."
        >
      </div>
      <p class="font-mono text-xs text-mute pr-2">
        {{ filteredMedia.length }} aset tersimpan
      </p>
    </div>

    <!-- Media Grid -->
    <div v-if="status === 'pending'" class="p-10 text-center font-mono text-xs text-mute rounded-2xl sm:rounded-3xl bg-white/70 border border-ink/10">
      Memuat file media…
    </div>

    <div v-else-if="!filteredMedia.length" class="p-8 sm:p-12 text-center rounded-2xl sm:rounded-3xl bg-white/70 border border-ink/10 space-y-2">
      <p class="font-display text-lg sm:text-xl font-bold text-ink">Belum ada file media.</p>
      <p class="font-mono text-xs text-mute">Unggah thumbnail project untuk mulai mengisi storage.</p>
    </div>

    <div v-else class="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4">
      <div
        v-for="item in filteredMedia"
        :key="item.id || item.name"
        class="group overflow-hidden rounded-2xl sm:rounded-3xl border border-ink/10 bg-white/90 shadow-xs flex flex-col justify-between transition-all hover:shadow-md"
      >
        <!-- Preview Container -->
        <div class="relative aspect-[16/10] w-full bg-ink/5 overflow-hidden">
          <img
            :src="item.url"
            :alt="item.name"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          >
          <button
            type="button"
            class="absolute top-2 right-2 rounded-full bg-void/80 text-white px-2 py-0.5 sm:px-2.5 sm:py-1 text-[0.62rem] sm:text-[0.65rem] font-mono uppercase font-bold opacity-85 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-signal active:scale-95"
            title="Hapus Media"
            @click="promptDeleteAsset(item)"
          >
            Hapus
          </button>
        </div>

        <!-- Info & Copy URL -->
        <div class="p-3 sm:p-3.5 space-y-1.5 sm:space-y-2">
          <p class="font-mono text-[0.72rem] sm:text-xs text-ink truncate font-medium" :title="item.name">
            {{ item.name }}
          </p>
          <div class="flex items-center justify-between font-mono text-[0.65rem] sm:text-[0.68rem] text-mute">
            <span>{{ formatBytes(item.size) }}</span>
            <button
              type="button"
              class="font-bold text-signal hover:underline cursor-pointer"
              @click="copyUrl(item.url)"
            >
              Salin URL
            </button>
          </div>
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
