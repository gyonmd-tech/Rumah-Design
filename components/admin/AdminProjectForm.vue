<script setup lang="ts">
import type { Project, ProjectCategory, ProjectStatus } from '~/types/database.types'
import type { ProjectFormPayload } from '~/types/project-form'
import { renderSafeMarkdown } from '~/utils/markdown'
import {
  isValidHttpsUrl,
  PROJECT_CATEGORIES,
  PROJECT_LIMITS,
  parseTags,
  slugify,
  STYLE_TAG_SUGGESTIONS,
  TECH_STACK_SUGGESTIONS,
  validateTags,
} from '~/utils/project'
import { analyzeSeoQuality } from '~/utils/seo'

interface FormProps {
  project?: Project
  busy?: boolean
}

const props = withDefaults(defineProps<FormProps>(), {
  busy: false,
})

const emit = defineEmits<{ submit: [payload: ProjectFormPayload] }>()

const activeTab = ref<'general' | 'media' | 'content' | 'seo'>('general')
const serpDevice = ref<'desktop' | 'mobile'>('desktop')
const markdownView = ref<'write' | 'preview' | 'split'>('write')

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
  previewMediaUrl: props.project?.preview_media_url ?? '',
  seoTitle: props.project?.seo_title ?? '',
  seoDescription: props.project?.seo_description ?? '',
  focusKeyword: props.project?.focus_keyword ?? '',
})

const isSlugLocked = ref(Boolean(props.project))
const thumbnailFile = ref<File | null>(null)
const thumbnailPreview = ref(props.project?.thumbnail_url ?? '')
const isDragOver = ref(false)
const errors = ref<string[]>([])

// Real-time SEO Analysis
const seoAnalysis = computed(() => {
  return analyzeSeoQuality({
    title: form.title,
    slug: form.slug,
    description: form.description,
    seoTitle: form.seoTitle,
    seoDescription: form.seoDescription,
    focusKeyword: form.focusKeyword,
    liveUrl: form.liveUrl,
    thumbnailUrl: thumbnailPreview.value,
  })
})

// Markdown preview render
const renderedMarkdown = ref('<p class="text-mute italic">Belum ada konten case study untuk dipratinjau.</p>')
let markdownRenderVersion = 0

watch(
  () => form.description,
  async (markdown) => {
    const version = ++markdownRenderVersion
    try {
      const html = await renderSafeMarkdown(markdown)
      if (version === markdownRenderVersion) {
        renderedMarkdown.value = html || '<p class="text-mute italic">Belum ada konten case study untuk dipratinjau.</p>'
      }
    }
    catch {
      if (version === markdownRenderVersion) {
        renderedMarkdown.value = '<p class="text-signal">Gagal merender markdown.</p>'
      }
    }
  },
  { immediate: true },
)

function onTitleInput() {
  if (!isSlugLocked.value) {
    form.slug = slugify(form.title)
  }
}

function onSlugInput() {
  isSlugLocked.value = true
  form.slug = slugify(form.slug)
}

function unlockSlug() {
  isSlugLocked.value = false
  form.slug = slugify(form.title)
}

// Tag helpers
function addTechTag(tag: string) {
  const current = parseTags(form.techStack)
  if (!current.includes(tag)) {
    form.techStack = [...current, tag].join(', ')
  }
}

function removeTechTag(tag: string) {
  const current = parseTags(form.techStack)
  form.techStack = current.filter(t => t !== tag).join(', ')
}

function addStyleTag(tag: string) {
  const current = parseTags(form.styleTags)
  if (!current.includes(tag)) {
    form.styleTags = [...current, tag].join(', ')
  }
}

function removeStyleTag(tag: string) {
  const current = parseTags(form.styleTags)
  form.styleTags = current.filter(t => t !== tag).join(', ')
}

// Markdown formatting tools
function insertMarkdown(syntax: string, placeholder = 'teks') {
  const textarea = document.getElementById('project-markdown-editor') as HTMLTextAreaElement | null
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selected = form.description.substring(start, end) || placeholder
  const before = form.description.substring(0, start)
  const after = form.description.substring(end)

  let replacement = ''
  if (syntax === 'bold') replacement = `**${selected}**`
  else if (syntax === 'italic') replacement = `*${selected}*`
  else if (syntax === 'h2') replacement = `\n## ${selected}\n`
  else if (syntax === 'h3') replacement = `\n### ${selected}\n`
  else if (syntax === 'quote') replacement = `\n> ${selected}\n`
  else if (syntax === 'code') replacement = `\`${selected}\``
  else if (syntax === 'codeblock') replacement = `\n\`\`\`javascript\n${selected}\n\`\`\`\n`
  else if (syntax === 'link') replacement = `[${selected}](https://)`
  else if (syntax === 'image') replacement = `![${selected}](https://)`
  else if (syntax === 'list') replacement = `\n- ${selected}\n- item berikutnya`
  else if (syntax === 'hr') replacement = `\n---\n`

  form.description = before + replacement + after
}

// Image handling
function onFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    thumbnailFile.value = file
    thumbnailPreview.value = URL.createObjectURL(file)
  }
}

function onDrop(e: DragEvent) {
  isDragOver.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file && file.type.startsWith('image/')) {
    thumbnailFile.value = file
    thumbnailPreview.value = URL.createObjectURL(file)
  }
}

function removeThumbnail() {
  thumbnailFile.value = null
  thumbnailPreview.value = ''
}

function validateAndSubmit() {
  errors.value = []

  const title = form.title.trim()
  const slug = form.slug.trim()
  const liveUrl = form.liveUrl.trim()
  const repoUrl = form.repoUrl.trim()
  const techStack = parseTags(form.techStack)
  const styleTags = parseTags(form.styleTags)

  if (!title) errors.value.push('Judul project wajib diisi.')
  if (!slug) errors.value.push('Slug URL wajib diisi.')
  if (!liveUrl) {
    errors.value.push('Live URL wajib diisi.')
  }
  else if (!isValidHttpsUrl(liveUrl)) {
    errors.value.push('Live URL harus dimulai dengan https://')
  }

  if (repoUrl && !isValidHttpsUrl(repoUrl)) {
    errors.value.push('Repo URL harus dimulai dengan https://')
  }

  if (!thumbnailFile.value && !thumbnailPreview.value) {
    errors.value.push('Thumbnail project wajib diunggah.')
  }

  const techError = validateTags(techStack, 'Tech stack')
  if (techError) errors.value.push(techError)

  const styleError = validateTags(styleTags, 'Style tags')
  if (styleError) errors.value.push(styleError)

  if (errors.value.length > 0) {
    // Jump to the first error tab if needed
    if (errors.value.some(e => e.includes('Thumbnail'))) activeTab.value = 'media'
    else activeTab.value = 'general'
    return
  }

  emit('submit', {
    title,
    slug,
    description: form.description.trim() || undefined,
    liveUrl,
    repoUrl: repoUrl || undefined,
    category: form.category,
    styleTags,
    techStack,
    status: form.status,
    thumbnailFile: thumbnailFile.value ?? undefined,
    thumbnailUrl: thumbnailPreview.value || undefined,
    previewMediaUrl: form.previewMediaUrl.trim() || undefined,
    seoTitle: form.seoTitle.trim() || undefined,
    seoDescription: form.seoDescription.trim() || undefined,
    focusKeyword: form.focusKeyword.trim() || undefined,
  })
}
</script>

<template>
  <form class="space-y-8" @submit.prevent="validateAndSubmit">
    <!-- Validation Errors Notification -->
    <div
      v-if="errors.length"
      role="alert"
      class="rounded-3xl border border-signal/40 bg-signal/5 p-5 text-xs font-sans text-signal space-y-2"
    >
      <div class="flex items-center gap-2 font-bold font-mono uppercase tracking-wider">
        <span>⚠️</span>
        <span>Harap perbaiki kesalahan berikut:</span>
      </div>
      <ul class="list-disc list-inside space-y-1 pl-1">
        <li v-for="err in errors" :key="err">{{ err }}</li>
      </ul>
    </div>

    <!-- Navigation Tabs for Editor Studio -->
    <div class="overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory rounded-2xl bg-white/80 p-1.5 border border-ink/10 shadow-xs font-mono text-xs font-semibold">
      <div class="flex items-center gap-1.5 min-w-max sm:min-w-0 sm:flex-wrap">
        <button
          type="button"
          class="snap-start cursor-pointer rounded-xl px-4 py-2.5 transition-all whitespace-nowrap flex items-center gap-2"
          :class="activeTab === 'general' ? 'bg-ink text-paper shadow-sm' : 'text-mute hover:text-ink'"
          @click="activeTab = 'general'"
        >
          <span>📝</span>
          <span>Informasi & Taksonomi</span>
        </button>

        <button
          type="button"
          class="snap-start cursor-pointer rounded-xl px-4 py-2.5 transition-all whitespace-nowrap flex items-center gap-2"
          :class="activeTab === 'media' ? 'bg-ink text-paper shadow-sm' : 'text-mute hover:text-ink'"
          @click="activeTab = 'media'"
        >
          <span>🎨</span>
          <span>Visual & Media</span>
          <span v-if="thumbnailPreview" class="size-1.5 rounded-full bg-emerald-500" />
        </button>

        <button
          type="button"
          class="snap-start cursor-pointer rounded-xl px-4 py-2.5 transition-all whitespace-nowrap flex items-center gap-2"
          :class="activeTab === 'content' ? 'bg-ink text-paper shadow-sm' : 'text-mute hover:text-ink'"
          @click="activeTab = 'content'"
        >
          <span>📖</span>
          <span>Case Study & Editorial</span>
        </button>

        <button
          type="button"
          class="snap-start cursor-pointer rounded-xl px-4 py-2.5 transition-all whitespace-nowrap flex items-center gap-2"
          :class="activeTab === 'seo' ? 'bg-ink text-paper shadow-sm' : 'text-mute hover:text-ink'"
          @click="activeTab = 'seo'"
        >
          <span>⚡</span>
          <span>SEO & SERP Simulator</span>
          <span
            class="rounded-full px-1.5 py-0.2 font-mono text-[0.62rem] font-bold border"
            :class="seoAnalysis.colorClass"
          >
            {{ seoAnalysis.score }}
          </span>
        </button>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- TAB 1: INFORMASI & TAKSONOMI                                   -->
    <!-- ============================================================== -->
    <div v-show="activeTab === 'general'" class="space-y-6">
      <div class="rounded-3xl bg-white/85 p-6 sm:p-8 border border-ink/10 shadow-xs space-y-6">
        <div class="border-b border-ink/10 pb-4">
          <h3 class="font-display text-xl font-bold text-ink">Metadata & Taksonomi Karya</h3>
          <p class="text-xs text-mute font-sans mt-0.5">Identitas utama, URL eksternal, kategori, dan tag teknologi.</p>
        </div>

        <div class="grid gap-6 sm:grid-cols-2">
          <!-- Title Input -->
          <div class="space-y-2 sm:col-span-2">
            <div class="flex items-center justify-between">
              <label for="p-title" class="font-mono text-xs font-bold text-ink uppercase tracking-wider">
                Judul Project <span class="text-signal">*</span>
              </label>
              <span class="font-mono text-[0.7rem] text-mute">{{ form.title.length }} / 120</span>
            </div>
            <input
              id="p-title"
              v-model="form.title"
              type="text"
              maxlength="120"
              class="field font-display font-bold text-base sm:text-lg"
              placeholder="Contoh: Pundi — Modern Financial Dashboard"
              required
              @input="onTitleInput"
            >
          </div>

          <!-- Slug Input -->
          <div class="space-y-2 sm:col-span-2">
            <div class="flex items-center justify-between">
              <label for="p-slug" class="font-mono text-xs font-bold text-ink uppercase tracking-wider">
                Slug URL <span class="text-signal">*</span>
              </label>
              <button
                v-if="isSlugLocked"
                type="button"
                class="font-mono text-[0.7rem] text-signal hover:underline cursor-pointer"
                @click="unlockSlug"
              >
                🔄 Sinkronkan dengan Judul
              </button>
            </div>
            <div class="relative flex items-center">
              <span class="absolute left-3.5 font-mono text-xs text-mute select-none">/project/</span>
              <input
                id="p-slug"
                v-model="form.slug"
                type="text"
                class="field font-mono text-xs sm:text-sm pl-20"
                placeholder="nama-project-anda"
                required
                @input="onSlugInput"
              >
            </div>
          </div>

          <!-- Category Selection -->
          <div class="space-y-2">
            <label for="p-category" class="font-mono text-xs font-bold text-ink uppercase tracking-wider">
              Kategori Project <span class="text-signal">*</span>
            </label>
            <select id="p-category" v-model="form.category" class="field font-mono text-xs cursor-pointer">
              <option v-for="cat in PROJECT_CATEGORIES" :key="cat.value" :value="cat.value">
                {{ cat.label }} ({{ cat.value }})
              </option>
            </select>
          </div>

          <!-- Publication Status -->
          <div class="space-y-2">
            <span class="font-mono text-xs font-bold text-ink uppercase tracking-wider block">
              Status Publikasi <span class="text-signal">*</span>
            </span>
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                class="flex items-center justify-center gap-2 rounded-xl p-2.5 font-mono text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer"
                :class="form.status === 'published' ? 'bg-emerald-50 text-emerald-900 border-emerald-500 shadow-xs' : 'bg-ink/[0.02] text-mute border-ink/10 hover:border-ink/20'"
                @click="form.status = 'published'"
              >
                <span class="size-2 rounded-full bg-emerald-500" />
                <span>Published</span>
              </button>

              <button
                type="button"
                class="flex items-center justify-center gap-2 rounded-xl p-2.5 font-mono text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer"
                :class="form.status === 'draft' ? 'bg-ink/10 text-ink border-ink/40 shadow-xs' : 'bg-ink/[0.02] text-mute border-ink/10 hover:border-ink/20'"
                @click="form.status = 'draft'"
              >
                <span class="size-2 rounded-full bg-mute" />
                <span>Draft</span>
              </button>
            </div>
          </div>

          <!-- Live URL -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label for="p-live-url" class="font-mono text-xs font-bold text-ink uppercase tracking-wider">
                Live URL Demo <span class="text-signal">*</span>
              </label>
              <a
                v-if="form.liveUrl && form.liveUrl.startsWith('https://')"
                :href="form.liveUrl"
                target="_blank"
                rel="noopener"
                class="font-mono text-[0.7rem] text-signal hover:underline"
              >
                Uji Tautan ↗
              </a>
            </div>
            <input
              id="p-live-url"
              v-model="form.liveUrl"
              type="url"
              class="field font-mono text-xs"
              placeholder="https://my-app.vercel.app"
              required
            >
          </div>

          <!-- Repo URL -->
          <div class="space-y-2">
            <label for="p-repo-url" class="font-mono text-xs font-bold text-ink uppercase tracking-wider">
              Repositori GitHub (Opsional)
            </label>
            <input
              id="p-repo-url"
              v-model="form.repoUrl"
              type="url"
              class="field font-mono text-xs"
              placeholder="https://github.com/username/repo"
            >
          </div>

          <!-- Tech Stack Tags -->
          <div class="space-y-2 sm:col-span-2">
            <div class="flex items-center justify-between">
              <label for="p-tech-stack" class="font-mono text-xs font-bold text-ink uppercase tracking-wider">
                Tech Stack (Pisahkan dengan koma)
              </label>
              <span class="font-mono text-[0.7rem] text-mute">{{ parseTags(form.techStack).length }} / 16 tag</span>
            </div>
            <input
              id="p-tech-stack"
              v-model="form.techStack"
              type="text"
              class="field font-mono text-xs"
              placeholder="Nuxt 3, Vue, Tailwind CSS, TypeScript, Supabase"
            >

            <!-- Tech Suggestions -->
            <div class="space-y-1.5 pt-1">
              <span class="font-mono text-[0.68rem] text-mute block">Saran cepat:</span>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="tag in TECH_STACK_SUGGESTIONS"
                  :key="tag"
                  type="button"
                  class="rounded-full px-2.5 py-0.5 font-mono text-[0.68rem] transition-all cursor-pointer"
                  :class="parseTags(form.techStack).includes(tag) ? 'bg-ink text-paper font-bold' : 'bg-ink/5 text-ink hover:bg-ink/10'"
                  @click="parseTags(form.techStack).includes(tag) ? removeTechTag(tag) : addTechTag(tag)"
                >
                  {{ parseTags(form.techStack).includes(tag) ? '✓ ' : '+ ' }}{{ tag }}
                </button>
              </div>
            </div>
          </div>

          <!-- Style Tags -->
          <div class="space-y-2 sm:col-span-2">
            <div class="flex items-center justify-between">
              <label for="p-style-tags" class="font-mono text-xs font-bold text-ink uppercase tracking-wider">
                Style Tags / Estetika Visual (Pisahkan dengan koma)
              </label>
              <span class="font-mono text-[0.7rem] text-mute">{{ parseTags(form.styleTags).length }} / 16 tag</span>
            </div>
            <input
              id="p-style-tags"
              v-model="form.styleTags"
              type="text"
              class="field font-mono text-xs"
              placeholder="Minimalist, Dark Mode, Neo-brutalism, Micro-interactions"
            >

            <!-- Style Suggestions -->
            <div class="space-y-1.5 pt-1">
              <span class="font-mono text-[0.68rem] text-mute block">Saran cepat:</span>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="tag in STYLE_TAG_SUGGESTIONS"
                  :key="tag"
                  type="button"
                  class="rounded-full px-2.5 py-0.5 font-mono text-[0.68rem] transition-all cursor-pointer"
                  :class="parseTags(form.styleTags).includes(tag) ? 'bg-ink text-paper font-bold' : 'bg-ink/5 text-ink hover:bg-ink/10'"
                  @click="parseTags(form.styleTags).includes(tag) ? removeStyleTag(tag) : addStyleTag(tag)"
                >
                  {{ parseTags(form.styleTags).includes(tag) ? '✓ ' : '+ ' }}{{ tag }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- TAB 2: VISUAL & MEDIA                                          -->
    <!-- ============================================================== -->
    <div v-show="activeTab === 'media'" class="space-y-6">
      <div class="rounded-3xl bg-white/85 p-6 sm:p-8 border border-ink/10 shadow-xs space-y-6">
        <div class="border-b border-ink/10 pb-4">
          <h3 class="font-display text-xl font-bold text-ink">Visual Showcase & Asset Portofolio</h3>
          <p class="text-xs text-mute font-sans mt-0.5">Thumbnail beresolusi tinggi dan media hover showcase (GIF / Video MP4).</p>
        </div>

        <!-- Thumbnail Upload Section -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="font-mono text-xs font-bold text-ink uppercase tracking-wider">
              Thumbnail Utama (16:10 / 16:9) <span class="text-signal">*</span>
            </span>
            <span class="font-mono text-[0.7rem] text-mute">Maksimal 10 MB (WebP, PNG, JPG)</span>
          </div>

          <div
            class="relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-6 sm:p-10 transition-all text-center bg-white/60 overflow-hidden"
            :class="isDragOver ? 'border-signal bg-signal/5' : 'border-ink/20 hover:border-signal/50'"
            @dragover.prevent="isDragOver = true"
            @dragleave.prevent="isDragOver = false"
            @drop.prevent="onDrop"
          >
            <!-- When Thumbnail Exists -->
            <div v-if="thumbnailPreview" class="space-y-4 w-full max-w-md">
              <div class="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-ink/15 shadow-md bg-ink/5">
                <img :src="thumbnailPreview" alt="Thumbnail Preview" class="h-full w-full object-cover">
              </div>
              <div class="flex items-center justify-center gap-3 font-mono text-xs">
                <label class="rounded-full bg-ink/5 hover:bg-ink hover:text-paper px-4 py-2 font-bold transition-all cursor-pointer">
                  <input type="file" accept="image/*" class="hidden" @change="onFileSelect">
                  Ganti Gambar 🔄
                </label>
                <button
                  type="button"
                  class="rounded-full bg-signal/10 hover:bg-signal hover:text-white px-4 py-2 font-bold text-signal transition-all cursor-pointer"
                  @click="removeThumbnail"
                >
                  Hapus
                </button>
              </div>
            </div>

            <!-- When Empty -->
            <div v-else class="space-y-3">
              <div class="size-12 rounded-2xl bg-ink/5 flex items-center justify-center mx-auto text-xl">
                🖼️
              </div>
              <div>
                <p class="font-display font-bold text-ink text-sm sm:text-base">
                  Tarik & Lepas Thumbnail ke sini
                </p>
                <p class="font-sans text-xs text-mute mt-0.5">
                  atau pilih file dari perangkat komputer Anda
                </p>
              </div>
              <label class="inline-flex rounded-full bg-signal text-white hover:bg-[#e63d10] px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shadow-xs">
                <input type="file" accept="image/*" class="hidden" @change="onFileSelect">
                Pilih Berkas Gambar
              </label>
            </div>
          </div>
        </div>

        <!-- Preview Media URL (MP4/WebM/GIF) -->
        <div class="space-y-2 pt-4 border-t border-ink/10">
          <div class="flex items-center justify-between">
            <label for="p-preview-media" class="font-mono text-xs font-bold text-ink uppercase tracking-wider">
              Preview Media URL (Animasi Hover / MP4 / GIF)
            </label>
            <span class="font-mono text-[0.7rem] text-mute">Opsional</span>
          </div>
          <input
            id="p-preview-media"
            v-model="form.previewMediaUrl"
            type="url"
            class="field font-mono text-xs"
            placeholder="https://.../preview.mp4 atau https://.../animation.gif"
          >
          <p class="font-sans text-xs text-mute">
            Jika diisi, kartu project di homepage akan memutar preview video/GIF ini saat di-hover oleh pengunjung.
          </p>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- TAB 3: CASE STUDY & EDITORIAL MARKDOWN                         -->
    <!-- ============================================================== -->
    <div v-show="activeTab === 'content'" class="space-y-6">
      <div class="rounded-3xl bg-white/85 p-6 sm:p-8 border border-ink/10 shadow-xs space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/10 pb-4">
          <div>
            <h3 class="font-display text-xl font-bold text-ink">Editor Case Study & Narasi Desain</h3>
            <p class="text-xs text-mute font-sans mt-0.5">Tulis proses eksplorasi, keputusan arsitektur, dan tantangan teknis.</p>
          </div>

          <!-- View Switcher (Write / Preview / Split) -->
          <div class="flex items-center rounded-2xl bg-ink/5 p-1 font-mono text-xs">
            <button
              type="button"
              class="rounded-xl px-3 py-1.5 font-bold transition-all cursor-pointer"
              :class="markdownView === 'write' ? 'bg-ink text-paper shadow-xs' : 'text-mute hover:text-ink'"
              @click="markdownView = 'write'"
            >
              Write
            </button>
            <button
              type="button"
              class="rounded-xl px-3 py-1.5 font-bold transition-all cursor-pointer"
              :class="markdownView === 'preview' ? 'bg-ink text-paper shadow-xs' : 'text-mute hover:text-ink'"
              @click="markdownView = 'preview'"
            >
              Preview
            </button>
            <button
              type="button"
              class="hidden lg:block rounded-xl px-3 py-1.5 font-bold transition-all cursor-pointer"
              :class="markdownView === 'split' ? 'bg-ink text-paper shadow-xs' : 'text-mute hover:text-ink'"
              @click="markdownView = 'split'"
            >
              Split View
            </button>
          </div>
        </div>

        <!-- Markdown Formatting Toolbar -->
        <div v-show="markdownView !== 'preview'" class="flex flex-wrap items-center gap-1.5 p-2 rounded-2xl bg-ink/[0.03] border border-ink/10 font-mono text-xs">
          <button type="button" class="px-2.5 py-1 rounded-lg hover:bg-ink/10 font-bold" title="Tebal" @click="insertMarkdown('bold')">B</button>
          <button type="button" class="px-2.5 py-1 rounded-lg hover:bg-ink/10 italic font-serif" title="Miring" @click="insertMarkdown('italic')">I</button>
          <span class="text-ink/20">|</span>
          <button type="button" class="px-2.5 py-1 rounded-lg hover:bg-ink/10 font-bold" title="Heading 2" @click="insertMarkdown('h2')">H2</button>
          <button type="button" class="px-2.5 py-1 rounded-lg hover:bg-ink/10 font-bold" title="Heading 3" @click="insertMarkdown('h3')">H3</button>
          <span class="text-ink/20">|</span>
          <button type="button" class="px-2.5 py-1 rounded-lg hover:bg-ink/10" title="Kutipan" @click="insertMarkdown('quote')">" Quote</button>
          <button type="button" class="px-2.5 py-1 rounded-lg hover:bg-ink/10" title="Kode Baris" @click="insertMarkdown('code')">`Code`</button>
          <button type="button" class="px-2.5 py-1 rounded-lg hover:bg-ink/10" title="Blok Kode" @click="insertMarkdown('codeblock')">``` Block</button>
          <button type="button" class="px-2.5 py-1 rounded-lg hover:bg-ink/10" title="Tautan Link" @click="insertMarkdown('link')">🔗 Link</button>
          <button type="button" class="px-2.5 py-1 rounded-lg hover:bg-ink/10" title="Gambar" @click="insertMarkdown('image')">🖼️ Img</button>
          <button type="button" class="px-2.5 py-1 rounded-lg hover:bg-ink/10" title="Daftar Poin" @click="insertMarkdown('list')">• List</button>
          <button type="button" class="px-2.5 py-1 rounded-lg hover:bg-ink/10" title="Garis Pembatas" @click="insertMarkdown('hr')">— HR</button>
        </div>

        <!-- Editor Work Area -->
        <div :class="markdownView === 'split' ? 'grid grid-cols-2 gap-6' : ''">
          <!-- Textarea Write -->
          <div v-show="markdownView === 'write' || markdownView === 'split'" class="space-y-2">
            <textarea
              id="project-markdown-editor"
              v-model="form.description"
              rows="18"
              class="field font-mono text-xs sm:text-sm leading-relaxed p-4 !min-h-[420px] resize-y"
              placeholder="Tulis narasi desain di sini...&#10;&#10;## Latar Belakang & Masalah&#10;Jelaskan konteks pembuatan project...&#10;&#10;## Keputusan Desain & Frontend&#10;Jelaskan solusi dan keunikan interaksi..."
            />
          </div>

          <!-- HTML Preview Pane -->
          <div
            v-show="markdownView === 'preview' || markdownView === 'split'"
            class="rounded-2xl border border-ink/10 bg-[#faf8f5] p-6 sm:p-8 min-h-[420px] max-h-[600px] overflow-y-auto"
          >
            <div class="prose prose-ink max-w-none text-sm font-sans leading-relaxed" v-html="renderedMarkdown" />
          </div>
        </div>

        <!-- Content Metrics Footer -->
        <div class="flex items-center justify-between font-mono text-xs text-mute pt-2 border-t border-ink/10">
          <div class="flex items-center gap-4">
            <span>{{ seoAnalysis.wordCount }} kata</span>
            <span>~{{ seoAnalysis.readingTimeMinutes }} menit estimasi baca</span>
          </div>
          <span>Sanitized HTML Render</span>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- TAB 4: SEO & SERP SIMULATOR                                    -->
    <!-- ============================================================== -->
    <div v-show="activeTab === 'seo'" class="space-y-6">
      <div class="rounded-3xl bg-white/85 p-6 sm:p-8 border border-ink/10 shadow-xs space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/10 pb-4">
          <div>
            <h3 class="font-display text-xl font-bold text-ink">SEO Health & SERP Simulator</h3>
            <p class="text-xs text-mute font-sans mt-0.5">Optimasi meta tag untuk mesin pencari Google dan kartu share media sosial.</p>
          </div>

          <div class="flex items-center gap-2">
            <span class="font-mono text-xs text-mute">Skor SEO Project:</span>
            <span
              class="rounded-full px-3 py-1 font-mono text-xs font-bold border"
              :class="seoAnalysis.colorClass"
            >
              {{ seoAnalysis.score }} / 100 (Grade {{ seoAnalysis.grade }})
            </span>
          </div>
        </div>

        <div class="grid gap-6 sm:grid-cols-2">
          <!-- Focus Keyword -->
          <div class="space-y-2 sm:col-span-2">
            <label for="p-keyword" class="font-mono text-xs font-bold text-ink uppercase tracking-wider">
              Focus Target Keyword
            </label>
            <input
              id="p-keyword"
              v-model="form.focusKeyword"
              type="text"
              class="field font-mono text-xs sm:text-sm"
              placeholder="Contoh: financial dashboard frontend case study"
            >
            <p class="font-sans text-xs text-mute">
              Kata kunci utama yang ingin ditargetkan agar project mudah ditemukan di Google.
            </p>
          </div>

          <!-- SEO Meta Title -->
          <div class="space-y-2 sm:col-span-2">
            <div class="flex items-center justify-between">
              <label for="p-seo-title" class="font-mono text-xs font-bold text-ink uppercase tracking-wider">
                Custom SEO Meta Title
              </label>
              <span class="font-mono text-[0.7rem]" :class="form.seoTitle.length > 60 ? 'text-amber-600 font-bold' : 'text-mute'">
                {{ form.seoTitle.length }} / 60 char (Ideal: 40–60)
              </span>
            </div>
            <input
              id="p-seo-title"
              v-model="form.seoTitle"
              type="text"
              maxlength="100"
              class="field font-sans text-sm"
              :placeholder="form.title ? `${form.title} — Rumah Design` : 'Judul yang tampil di tab browser & Google'"
            >
          </div>

          <!-- SEO Meta Description -->
          <div class="space-y-2 sm:col-span-2">
            <div class="flex items-center justify-between">
              <label for="p-seo-desc" class="font-mono text-xs font-bold text-ink uppercase tracking-wider">
                Custom SEO Meta Description
              </label>
              <span class="font-mono text-[0.7rem]" :class="form.seoDescription.length > 160 ? 'text-amber-600 font-bold' : 'text-mute'">
                {{ form.seoDescription.length }} / 160 char (Ideal: 120–160)
              </span>
            </div>
            <textarea
              id="p-seo-desc"
              v-model="form.seoDescription"
              rows="3"
              maxlength="200"
              class="field font-sans text-sm leading-relaxed"
              placeholder="Deskripsi ringkas yang menarik klik pembaca saat muncul di hasil pencarian Google..."
            />
          </div>
        </div>

        <!-- Google SERP Simulator -->
        <div class="rounded-2xl border border-ink/10 bg-[#f8f9fa] p-5 sm:p-6 space-y-3">
          <div class="flex items-center justify-between">
            <span class="font-mono text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-2">
              <span>🌐</span>
              <span>Google SERP Preview</span>
            </span>
            <div class="flex items-center gap-1 font-mono text-[0.68rem]">
              <button
                type="button"
                class="px-2.5 py-1 rounded-lg font-bold"
                :class="serpDevice === 'desktop' ? 'bg-ink text-paper' : 'text-mute hover:text-ink'"
                @click="serpDevice = 'desktop'"
              >
                Desktop
              </button>
              <button
                type="button"
                class="px-2.5 py-1 rounded-lg font-bold"
                :class="serpDevice === 'mobile' ? 'bg-ink text-paper' : 'text-mute hover:text-ink'"
                @click="serpDevice = 'mobile'"
              >
                Mobile
              </button>
            </div>
          </div>

          <!-- Google Search Snippet -->
          <div class="bg-white p-4 rounded-xl border border-black/5 shadow-xs max-w-xl font-sans space-y-1">
            <div class="flex items-center gap-2 text-xs text-[#202124]">
              <span class="rounded-full bg-ink/10 size-4 flex items-center justify-center text-[0.6rem]">R</span>
              <span class="truncate">https://rumah-design.vercel.app › project › {{ form.slug || 'slug-project' }}</span>
            </div>
            <h4 class="text-[#1a0dab] hover:underline text-base sm:text-lg font-medium leading-snug cursor-pointer truncate">
              {{ form.seoTitle || form.title || 'Judul Project Portofolio — Rumah Design' }}
            </h4>
            <p class="text-[#4d5156] text-xs sm:text-sm leading-relaxed line-clamp-2">
              {{ form.seoDescription || form.description?.slice(0, 150) || 'Kumpulan karya frontend dan narasi proses desain portofolio Rumah Design.' }}
            </p>
          </div>
        </div>

        <!-- Real-time SEO Diagnostic Checklist -->
        <div class="rounded-2xl bg-ink/[0.02] p-5 border border-ink/10 space-y-3">
          <span class="font-mono text-xs font-bold text-ink uppercase tracking-wider block">
            Diagnosa Kualitas SEO:
          </span>
          <div class="grid gap-2 sm:grid-cols-2">
            <div
              v-for="check in seoAnalysis.auditItems"
              :key="check.id"
              class="flex items-start gap-2.5 p-2.5 rounded-xl border text-xs font-sans"
              :class="{
                'bg-emerald-50/80 border-emerald-200 text-emerald-900': check.status === 'pass',
                'bg-amber-50/80 border-amber-200 text-amber-900': check.status === 'warn',
                'bg-rose-50/80 border-rose-200 text-rose-900': check.status === 'fail',
              }"
            >
              <span class="font-bold text-sm shrink-0 leading-none mt-0.5">
                {{ check.status === 'pass' ? '✓' : check.status === 'warn' ? '!' : '✕' }}
              </span>
              <div>
                <span class="font-bold font-mono text-[0.7rem] uppercase block">{{ check.label }}</span>
                <span class="text-[0.75rem] opacity-90">{{ check.message }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- STICKY ACTION BAR AT BOTTOM                                    -->
    <!-- ============================================================== -->
    <div class="sticky bottom-4 z-30 flex items-center justify-between gap-4 rounded-3xl bg-paper/95 backdrop-blur-md p-4 border border-ink/15 shadow-xl font-mono text-xs">
      <div class="flex items-center gap-3">
        <NuxtLink to="/admin/projects" class="rounded-full bg-ink/5 hover:bg-ink/10 px-4 py-2.5 font-bold uppercase tracking-wider text-mute hover:text-ink transition-all">
          ← Batal
        </NuxtLink>
        <span class="hidden sm:inline text-mute">
          {{ form.status === 'published' ? '🟢 Siap dipublikasikan' : '⚪ Disimpan sebagai Draft' }}
        </span>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="submit"
          class="rounded-full bg-signal text-white hover:bg-[#e63d10] px-6 py-2.5 font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50"
          :disabled="busy"
        >
          {{ busy ? 'Menyimpan ke Supabase…' : (project ? 'Perbarui Project ↗' : 'Terbitkan Project ↗') }}
        </button>
      </div>
    </div>
  </form>
</template>
