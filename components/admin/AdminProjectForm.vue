<script setup lang="ts">
import type { Project, ProjectCategory, ProjectStatus } from '~/types/database.types'
import type { ProjectFormPayload } from '~/types/project-form'
import { PROJECT_CATEGORIES, parseTags, slugify } from '~/utils/project'

const props = defineProps<{
  project?: Project
  busy?: boolean
}>()
const emit = defineEmits<{ submit: [payload: ProjectFormPayload] }>()

const form = reactive({
  title: props.project?.title ?? '',
  slug: props.project?.slug ?? '',
  description: props.project?.description ?? '',
  liveUrl: props.project?.live_url ?? '',
  repoUrl: props.project?.repo_url ?? '',
  category: (props.project?.category ?? 'web-app') as ProjectCategory,
  styleTags: props.project?.style_tags.join(', ') ?? '',
  techStack: props.project?.tech_stack.join(', ') ?? '',
  status: (props.project?.status ?? 'draft') as ProjectStatus,
})
const thumbnailFile = ref<File | null>(null)
const thumbnailPreview = ref(props.project?.thumbnail_url ?? '')
const errors = ref<string[]>([])
let slugWasEdited = Boolean(props.project)

function onTitleInput() {
  if (!slugWasEdited) form.slug = slugify(form.title)
}

function onSlugInput() {
  slugWasEdited = true
  form.slug = slugify(form.slug)
}

function onFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0] ?? null
  thumbnailFile.value = file
  if (file) thumbnailPreview.value = URL.createObjectURL(file)
}

function validHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === 'https:'
  }
  catch {
    return false
  }
}

function submit() {
  errors.value = []
  if (!form.title.trim() || form.title.trim().length > 120) errors.value.push('Judul wajib diisi dan maksimal 120 karakter.')
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) errors.value.push('Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.')
  if (!validHttpsUrl(form.liveUrl)) errors.value.push('Live URL wajib berupa HTTPS yang valid.')
  if (form.repoUrl && !validHttpsUrl(form.repoUrl)) errors.value.push('Repository URL harus berupa HTTPS yang valid.')
  if (!props.project && !thumbnailFile.value) errors.value.push('Thumbnail wajib dipilih.')
  if (thumbnailFile.value && thumbnailFile.value.size > 10 * 1024 * 1024) errors.value.push('Ukuran thumbnail maksimal 10 MB.')
  if (errors.value.length) return

  emit('submit', {
    title: form.title,
    slug: form.slug,
    description: form.description,
    liveUrl: form.liveUrl,
    repoUrl: form.repoUrl,
    category: form.category,
    styleTags: parseTags(form.styleTags),
    techStack: parseTags(form.techStack),
    status: form.status,
    thumbnailFile: thumbnailFile.value,
  })
}
</script>

<template>
  <form class="space-y-8" novalidate @submit.prevent="submit">
    <div v-if="errors.length" role="alert" class="border border-red-700/30 bg-red-50 p-4 text-sm text-red-900">
      <p class="font-semibold">Periksa kembali data berikut:</p>
      <ul class="mt-2 list-disc space-y-1 pl-5"><li v-for="error in errors" :key="error">{{ error }}</li></ul>
    </div>

    <fieldset :disabled="busy" class="grid gap-6 lg:grid-cols-2 disabled:opacity-60">
      <label class="space-y-2">
        <span class="eyebrow text-muted">Judul *</span>
        <input v-model="form.title" class="field" maxlength="120" required @input="onTitleInput">
      </label>
      <label class="space-y-2">
        <span class="eyebrow text-muted">Slug *</span>
        <input v-model="form.slug" class="field" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required @input="onSlugInput">
      </label>
      <label class="space-y-2">
        <span class="eyebrow text-muted">Kategori *</span>
        <select v-model="form.category" class="field">
          <option v-for="category in PROJECT_CATEGORIES" :key="category.value" :value="category.value">{{ category.label }}</option>
        </select>
      </label>
      <label class="space-y-2">
        <span class="eyebrow text-muted">Status *</span>
        <select v-model="form.status" class="field"><option value="draft">Draft</option><option value="published">Published</option></select>
      </label>
      <label class="space-y-2 lg:col-span-2">
        <span class="eyebrow text-muted">Live URL *</span>
        <input v-model="form.liveUrl" type="url" class="field" placeholder="https://..." required>
      </label>
      <label class="space-y-2 lg:col-span-2">
        <span class="eyebrow text-muted">Repository URL</span>
        <input v-model="form.repoUrl" type="url" class="field" placeholder="https://github.com/...">
      </label>
      <label class="space-y-2">
        <span class="eyebrow text-muted">Style tags</span>
        <input v-model="form.styleTags" class="field" placeholder="Minimal, Bold, Light">
        <small class="text-muted">Pisahkan dengan koma.</small>
      </label>
      <label class="space-y-2">
        <span class="eyebrow text-muted">Tech stack</span>
        <input v-model="form.techStack" class="field" placeholder="Nuxt, Tailwind, Supabase">
        <small class="text-muted">Pisahkan dengan koma.</small>
      </label>
      <label class="space-y-2 lg:col-span-2">
        <span class="eyebrow text-muted">Case study (Markdown)</span>
        <textarea v-model="form.description" class="field min-h-72 resize-y" placeholder="## Masalah&#10;..." />
      </label>
      <label class="space-y-3 lg:col-span-2">
        <span class="eyebrow text-muted">Thumbnail {{ project ? '' : '*' }}</span>
        <input type="file" accept="image/jpeg,image/png,image/webp" class="field cursor-pointer" @change="onFile">
        <small class="block text-muted">JPG, PNG, atau WebP. Maksimal 10 MB. Rasio rekomendasi 4:3 atau 16:10.</small>
        <img v-if="thumbnailPreview" :src="thumbnailPreview" alt="Preview thumbnail" class="mt-3 aspect-[16/10] w-full max-w-xl border border-line object-cover">
      </label>
    </fieldset>

    <div class="flex flex-wrap items-center gap-3 border-t border-line pt-6">
      <button type="submit" class="button-primary cursor-pointer" :disabled="busy">{{ busy ? 'Menyimpan…' : 'Simpan project' }}</button>
      <NuxtLink to="/admin/projects" class="button-secondary">Batal</NuxtLink>
    </div>
  </form>
</template>
