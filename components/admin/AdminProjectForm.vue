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

const props = defineProps<{
  project?: Project
  busy?: boolean
}>()

const emit = defineEmits<{ submit: [payload: ProjectFormPayload] }>()

const activeTab = ref<'content' | 'media' | 'seo'>('content')
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

const STYLE_SUGGESTIONS = STYLE_TAG_SUGGESTIONS
const TECH_SUGGESTIONS = TECH_STACK_SUGGESTIONS

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

// Preview admin harus melewati sanitizer yang sama dengan halaman publik.
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

function toggleSlugLock() {
  isSlugLocked.value = !isSlugLocked.value
  if (!isSlugLocked.value) {
    form.slug = slugify(form.title)
  }
}

function appendTag(type: 'style' | 'tech', tag: string) {
  if (type === 'style') {
    const current = parseTags(form.styleTags)
    if (!current.includes(tag)) {
      form.styleTags = [...current, tag].join(', ')
    }
  }
  else {
    const current = parseTags(form.techStack)
    if (!current.includes(tag)) {
      form.techStack = [...current, tag].join(', ')
    }
  }
}

function insertMarkdown(syntax: string, placeholder = '') {
  const textarea = document.getElementById('case-study-textarea') as HTMLTextAreaElement | null
  if (!textarea) return
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selected = form.description.substring(start, end) || placeholder

  let formatted = ''
  switch (syntax) {
    case 'h2': formatted = `\n## ${selected || 'Sub Judul'}\n`; break
    case 'h3': formatted = `\n### ${selected || 'Sub Bagian'}\n`; break
    case 'bold': formatted = `**${selected || 'teks tebal'}**`; break
    case 'italic': formatted = `*${selected || 'teks miring'}*`; break
    case 'link': formatted = `[${selected || 'Teks Tautan'}](https://)`; break
    case 'code': formatted = `\`${selected || 'kode'}\``; break
    case 'quote': formatted = `\n> ${selected || 'Kutipan penting'}\n`; break
    case 'list': formatted = `\n- ${selected || 'Poin list'}\n`; break
    case 'image': formatted = `\n![${selected || 'Keterangan Gambar'}](https://)\n`; break
  }

  form.description = form.description.substring(0, start) + formatted + form.description.substring(end)
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + formatted.length, start + formatted.length)
  })
}

function handleFileSelection(file: File | null) {
  if (!file) return
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
    errors.value = ['Gunakan format gambar JPG, PNG, WebP, atau GIF.']
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    errors.value = ['Ukuran file maksimal 10 MB.']
    return
  }
  thumbnailFile.value = file
  thumbnailPreview.value = URL.createObjectURL(file)
}

function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0] ?? null
  handleFileSelection(file)
}

function onDropFile(e: DragEvent) {
  isDragOver.value = false
  const file = e.dataTransfer?.files?.[0] ?? null
  handleFileSelection(file)
}

const submitLabel = computed(() => {
  if (props.busy) return 'Menyimpan…'
  if (form.status === 'draft') return props.project ? 'Perbarui Draft ↗' : 'Simpan Draft ↗'
  return props.project ? 'Perbarui Project ↗' : 'Terbitkan Project ↗'
})

function submit() {
  errors.value = []
  const styleTags = parseTags(form.styleTags)
  const techStack = parseTags(form.techStack)

  if (!form.title.trim() || form.title.trim().length > PROJECT_LIMITS.title) errors.value.push(`Judul wajib diisi dan maksimal ${PROJECT_LIMITS.title} karakter.`)
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) errors.value.push('Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.')
  if (!isValidHttpsUrl(form.liveUrl)) errors.value.push('Live URL wajib berupa HTTPS yang valid (https://...).')
  if (form.repoUrl && !isValidHttpsUrl(form.repoUrl)) errors.value.push('Repository URL harus berupa HTTPS yang valid.')
  if (form.previewMediaUrl && !isValidHttpsUrl(form.previewMediaUrl)) errors.value.push('Preview media URL harus berupa HTTPS yang valid.')
  if (form.description.length > PROJECT_LIMITS.description) errors.value.push(`Case study maksimal ${PROJECT_LIMITS.description.toLocaleString('id-ID')} karakter.`)
  if (form.seoTitle.length > PROJECT_LIMITS.seoTitle) errors.value.push(`Meta title maksimal ${PROJECT_LIMITS.seoTitle} karakter.`)
  if (form.seoDescription.length > PROJECT_LIMITS.seoDescription) errors.value.push(`Meta description maksimal ${PROJECT_LIMITS.seoDescription} karakter.`)
  if (form.focusKeyword.length > PROJECT_LIMITS.focusKeyword) errors.value.push(`Focus keyword maksimal ${PROJECT_LIMITS.focusKeyword} karakter.`)
  errors.value.push(...validateTags(styleTags, 'Style tags'), ...validateTags(techStack, 'Tech stack'))
  if (!props.project && !thumbnailFile.value && !thumbnailPreview.value) errors.value.push('Thumbnail wajib diunggah.')
  if (thumbnailFile.value && thumbnailFile.value.size > 10 * 1024 * 1024) errors.value.push('Ukuran thumbnail maksimal 10 MB.')

  if (form.status === 'published') {
    if (form.description.trim().length < 80) errors.value.push('Project published memerlukan case study minimal 80 karakter.')
    if (!styleTags.length) errors.value.push('Project published memerlukan minimal satu style tag.')
    if (!techStack.length) errors.value.push('Project published memerlukan minimal satu teknologi.')
  }

  if (errors.value.length) {
    if (errors.value.some(error => /thumbnail|preview media/i.test(error))) activeTab.value = 'media'
    else if (errors.value.some(error => /meta|keyword/i.test(error))) activeTab.value = 'seo'
    else activeTab.value = 'content'
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  emit('submit', {
    title: form.title.trim(),
    slug: form.slug,
    description: form.description.trim(),
    liveUrl: form.liveUrl.trim(),
    repoUrl: form.repoUrl.trim(),
    category: form.category,
    styleTags,
    techStack,
    status: form.status,
    previewMediaUrl: form.previewMediaUrl.trim(),
    seoTitle: form.seoTitle.trim(),
    seoDescription: form.seoDescription.trim(),
    focusKeyword: form.focusKeyword.trim(),
    thumbnailFile: thumbnailFile.value,
  })
}
</script>

<template>
  <form class="space-y-8" novalidate @submit.prevent="submit">
    <!-- Validation Alerts -->
    <div
      v-if="errors.length"
      role="alert"
      aria-live="assertive"
      class="rounded-3xl border border-signal/40 bg-signal/10 p-5 text-xs font-mono text-signal shadow-sm"
    >
      <div class="font-bold uppercase tracking-wider">
        Periksa kembali data formulir berikut:
      </div>
      <ul class="mt-2.5 list-disc space-y-1 pl-5">
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </div>

    <!-- Header Navigation Tabs & Quick SEO Pill -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-ink/12 pb-4">
      <div class="overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory rounded-2xl bg-white/70 p-1.5 border border-ink/10 shadow-xs font-mono text-xs font-semibold">
        <div role="tablist" aria-label="Bagian formulir project" class="flex items-center gap-1.5 min-w-max sm:min-w-0">
          <button
            id="project-tab-content"
            type="button"
            role="tab"
            aria-controls="project-panel-content"
            :aria-selected="activeTab === 'content'"
            class="snap-start cursor-pointer rounded-xl px-3 sm:px-4 py-2 transition-all whitespace-nowrap"
            :class="activeTab === 'content' ? 'bg-ink text-paper shadow-sm' : 'text-mute hover:text-ink'"
            @click="activeTab = 'content'"
          >
            1. Konten
          </button>
          <button
            id="project-tab-media"
            type="button"
            role="tab"
            aria-controls="project-panel-media"
            :aria-selected="activeTab === 'media'"
            class="snap-start cursor-pointer rounded-xl px-3 sm:px-4 py-2 transition-all whitespace-nowrap"
            :class="activeTab === 'media' ? 'bg-ink text-paper shadow-sm' : 'text-mute hover:text-ink'"
            @click="activeTab = 'media'"
          >
            2. Media
          </button>
          <button
            id="project-tab-seo"
            type="button"
            role="tab"
            aria-controls="project-panel-seo"
            :aria-selected="activeTab === 'seo'"
            class="snap-start cursor-pointer rounded-xl px-3 sm:px-4 py-2 transition-all flex items-center gap-1.5 whitespace-nowrap"
            :class="activeTab === 'seo' ? 'bg-ink text-paper shadow-sm' : 'text-mute hover:text-ink'"
            @click="activeTab = 'seo'"
          >
            <span>3. SEO</span>
            <span
              class="rounded-full px-1.5 py-0.5 text-[0.62rem] font-bold uppercase"
              :class="seoAnalysis.score >= 80 ? 'bg-emerald-500 text-white' : seoAnalysis.score >= 50 ? 'bg-amber-500 text-ink' : 'bg-rose-500 text-white'"
            >
              {{ seoAnalysis.score }}
            </span>
          </button>
        </div>
      </div>

      <!-- Live SEO Score Overview Badge -->
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-2 rounded-2xl bg-white/80 border border-ink/10 px-3 py-1.5 shadow-xs">
          <span class="font-mono text-[0.68rem] sm:text-xs text-mute uppercase tracking-wider">SEO:</span>
          <span
            class="font-mono text-[0.68rem] sm:text-xs font-bold rounded-full px-2 py-0.5 border"
            :class="seoAnalysis.colorClass"
          >
            {{ seoAnalysis.score }} / 100 (Grade {{ seoAnalysis.grade }})
          </span>
        </div>
      </div>
    </div>

    <!-- TAB 1: KONTEN & DETAIL -->
    <div id="project-panel-content" v-show="activeTab === 'content'" role="tabpanel" aria-labelledby="project-tab-content" class="space-y-6">
      <fieldset :disabled="busy" class="grid gap-6 lg:grid-cols-2 rounded-3xl bg-white/85 p-6 sm:p-8 border border-ink/10 shadow-xs">
        <!-- Title Field -->
        <label class="space-y-2 lg:col-span-2">
          <div class="flex items-center justify-between">
            <span class="font-mono text-xs font-bold text-ink uppercase tracking-wider">Judul Project *</span>
            <span class="font-mono text-[0.7rem] text-mute">{{ form.title.length }} / 120 karakter</span>
          </div>
          <input
            v-model="form.title"
            class="field text-lg font-medium font-display"
            placeholder="misal: Pundi — Financial Analytics Platform"
            maxlength="120"
            required
            @input="onTitleInput"
          >
        </label>

        <!-- Slug Field with Lock/Unlock -->
        <label class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-mono text-xs font-bold text-ink uppercase tracking-wider">Slug URL *</span>
            <button
              type="button"
              class="font-mono text-[0.7rem] text-signal hover:underline cursor-pointer"
              @click="toggleSlugLock"
            >
              {{ isSlugLocked ? 'Edit Manual' : 'Kunci Slug' }}
            </button>
          </div>
          <div class="relative flex items-center">
            <span class="absolute left-4 font-mono text-xs text-mute">/project/</span>
            <input
              v-model="form.slug"
              class="field pl-20 font-mono text-sm"
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              placeholder="pundi-analytics"
              required
              @input="onSlugInput"
            >
          </div>
        </label>

        <!-- Category Field -->
        <label class="space-y-2">
          <span class="font-mono text-xs font-bold text-ink uppercase tracking-wider">Kategori *</span>
          <select v-model="form.category" class="field cursor-pointer">
            <option v-for="category in PROJECT_CATEGORIES" :key="category.value" :value="category.value">
              {{ category.label }}
            </option>
          </select>
        </label>

        <!-- Status Field -->
        <label class="space-y-2">
          <span class="font-mono text-xs font-bold text-ink uppercase tracking-wider">Status Publikasi *</span>
          <select v-model="form.status" class="field cursor-pointer">
            <option value="draft">Draft (Hanya di Admin)</option>
            <option value="published">Published (Tayang Publik)</option>
          </select>
        </label>

        <!-- Focus Keyword for Content -->
        <label class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-mono text-xs font-bold text-ink uppercase tracking-wider">Target Kata Kunci</span>
            <span class="font-mono text-[0.7rem] text-mute">Untuk analisa SEO</span>
          </div>
          <input
            v-model="form.focusKeyword"
            class="field"
            placeholder="misal: Dashboard Keuangan, Landing Page SaaS"
          >
        </label>

        <!-- Live Demo URL -->
        <label class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-mono text-xs font-bold text-ink uppercase tracking-wider">Live URL (Demo) *</span>
            <a
              v-if="form.liveUrl && isValidHttpsUrl(form.liveUrl)"
              :href="form.liveUrl"
              target="_blank"
              class="font-mono text-[0.7rem] text-signal hover:underline"
            >
              Uji Tautan ↗
            </a>
          </div>
          <input
            v-model="form.liveUrl"
            type="url"
            class="field font-mono text-sm"
            placeholder="https://pundi.vercel.app"
            required
          >
        </label>

        <!-- Repo URL -->
        <label class="space-y-2">
          <span class="font-mono text-xs font-bold text-ink uppercase tracking-wider">Repository URL (Opsional)</span>
          <input
            v-model="form.repoUrl"
            type="url"
            class="field font-mono text-sm"
            placeholder="https://github.com/username/repo"
          >
        </label>

        <!-- Style Tags Input & Suggestion Chips -->
        <div class="space-y-2.5 lg:col-span-2">
          <div class="flex items-center justify-between">
            <span class="font-mono text-xs font-bold text-ink uppercase tracking-wider">Style Tags (Gaya Visual)</span>
            <span class="font-mono text-[0.7rem] text-mute">Pisahkan dengan koma</span>
          </div>
          <input
            v-model="form.styleTags"
            class="field"
            placeholder="Minimal, Dark Mode, Bento Grid, Editorial"
          >
          <div class="flex flex-wrap items-center gap-1.5 pt-1">
            <span class="font-mono text-[0.68rem] text-mute mr-1">Rekomendasi:</span>
            <button
              v-for="tag in STYLE_SUGGESTIONS"
              :key="tag"
              type="button"
              class="rounded-full bg-ink/5 hover:bg-signal/15 hover:text-signal px-2.5 py-0.5 font-mono text-[0.68rem] text-mute transition-colors cursor-pointer"
              @click="appendTag('style', tag)"
            >
              + {{ tag }}
            </button>
          </div>
        </div>

        <!-- Tech Stack Input & Suggestion Chips -->
        <div class="space-y-2.5 lg:col-span-2">
          <div class="flex items-center justify-between">
            <span class="font-mono text-xs font-bold text-ink uppercase tracking-wider">Tech Stack (Teknologi)</span>
            <span class="font-mono text-[0.7rem] text-mute">Pisahkan dengan koma</span>
          </div>
          <input
            v-model="form.techStack"
            class="field"
            placeholder="Nuxt 3, Vue 3, Tailwind CSS, Supabase, GSAP"
          >
          <div class="flex flex-wrap items-center gap-1.5 pt-1">
            <span class="font-mono text-[0.68rem] text-mute mr-1">Rekomendasi:</span>
            <button
              v-for="tech in TECH_SUGGESTIONS"
              :key="tech"
              type="button"
              class="rounded-full bg-ink/5 hover:bg-signal/15 hover:text-signal px-2.5 py-0.5 font-mono text-[0.68rem] text-mute transition-colors cursor-pointer"
              @click="appendTag('tech', tech)"
            >
              + {{ tech }}
            </button>
          </div>
        </div>

        <!-- Case Study Markdown Section with Toolbar and Live Preview -->
        <div class="space-y-3 lg:col-span-2 pt-2">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-2">
            <div class="flex items-center gap-2">
              <span class="font-mono text-xs font-bold text-ink uppercase tracking-wider">Case Study (Markdown)</span>
              <span class="rounded-full bg-ink/5 px-2 py-0.5 font-mono text-[0.68rem] text-mute">
                {{ seoAnalysis.wordCount }} kata · ~{{ seoAnalysis.readingTimeMinutes }} mnt baca
              </span>
            </div>

            <!-- View Mode Switcher -->
            <div class="flex items-center gap-1 rounded-xl bg-ink/5 p-1 font-mono text-xs font-semibold">
              <button
                type="button"
                class="cursor-pointer rounded-lg px-2.5 py-1 transition-all"
                :class="markdownView === 'write' ? 'bg-white text-ink shadow-xs' : 'text-mute hover:text-ink'"
                @click="markdownView = 'write'"
              >
                Editor
              </button>
              <button
                type="button"
                class="cursor-pointer rounded-lg px-2.5 py-1 transition-all"
                :class="markdownView === 'preview' ? 'bg-white text-ink shadow-xs' : 'text-mute hover:text-ink'"
                @click="markdownView = 'preview'"
              >
                Pratinjau Live
              </button>
              <button
                type="button"
                class="hidden md:inline-block cursor-pointer rounded-lg px-2.5 py-1 transition-all"
                :class="markdownView === 'split' ? 'bg-white text-ink shadow-xs' : 'text-mute hover:text-ink'"
                @click="markdownView = 'split'"
              >
                Split View
              </button>
            </div>
          </div>

          <!-- Markdown Toolbar (Clean Textual Buttons with Mobile Horizontal Scroll) -->
          <div class="overflow-x-auto no-scrollbar scroll-smooth flex items-center gap-1 rounded-2xl bg-ink/[0.03] p-1.5 border border-ink/10 font-mono text-xs">
            <button
              type="button"
              class="shrink-0 rounded-lg px-2.5 py-1 hover:bg-white hover:shadow-xs text-ink font-bold cursor-pointer transition-all"
              title="Heading 2"
              @click="insertMarkdown('h2')"
            >
              H2
            </button>
            <button
              type="button"
              class="shrink-0 rounded-lg px-2.5 py-1 hover:bg-white hover:shadow-xs text-ink font-bold cursor-pointer transition-all"
              title="Heading 3"
              @click="insertMarkdown('h3')"
            >
              H3
            </button>
            <span class="shrink-0 h-4 w-px bg-ink/15 mx-1" />
            <button
              type="button"
              class="shrink-0 rounded-lg px-2.5 py-1 hover:bg-white hover:shadow-xs text-ink font-bold cursor-pointer transition-all"
              title="Tebal (Bold)"
              @click="insertMarkdown('bold')"
            >
              Bold
            </button>
            <button
              type="button"
              class="shrink-0 rounded-lg px-2.5 py-1 hover:bg-white hover:shadow-xs text-ink italic cursor-pointer transition-all"
              title="Miring (Italic)"
              @click="insertMarkdown('italic')"
            >
              Italic
            </button>
            <button
              type="button"
              class="shrink-0 rounded-lg px-2.5 py-1 hover:bg-white hover:shadow-xs text-ink cursor-pointer transition-all"
              title="Kode Inline"
              @click="insertMarkdown('code')"
            >
              Code
            </button>
            <span class="shrink-0 h-4 w-px bg-ink/15 mx-1" />
            <button
              type="button"
              class="shrink-0 rounded-lg px-2.5 py-1 hover:bg-white hover:shadow-xs text-ink cursor-pointer transition-all"
              title="Daftar (List)"
              @click="insertMarkdown('list')"
            >
              List
            </button>
            <button
              type="button"
              class="shrink-0 rounded-lg px-2.5 py-1 hover:bg-white hover:shadow-xs text-ink cursor-pointer transition-all"
              title="Kutipan (Quote)"
              @click="insertMarkdown('quote')"
            >
              Quote
            </button>
            <button
              type="button"
              class="shrink-0 rounded-lg px-2.5 py-1 hover:bg-white hover:shadow-xs text-ink cursor-pointer transition-all"
              title="Tautan (Link)"
              @click="insertMarkdown('link')"
            >
              Link
            </button>
          </div>

          <!-- Markdown Content Body -->
          <div :class="markdownView === 'split' ? 'grid grid-cols-2 gap-4' : ''">
            <!-- Textarea -->
            <textarea
              v-show="markdownView === 'write' || markdownView === 'split'"
              id="case-study-textarea"
              v-model="form.description"
              class="field min-h-80 resize-y font-mono text-sm leading-relaxed"
              placeholder="## Latar Belakang & Masalah&#10;Jelaskan problem yang ingin diselesaikan...&#10;&#10;## Proses Desain&#10;Eksplorasi layout, tipografi, dan interaksi...&#10;&#10;## Solusi & Hasil&#10;Fitur utama dan dampak performa..."
            />

            <!-- Live Preview -->
            <div
              v-show="markdownView === 'preview' || markdownView === 'split'"
              class="min-h-80 overflow-y-auto rounded-2xl border border-ink/10 bg-paper/50 p-6 font-sans text-sm leading-relaxed prose prose-stone max-w-none shadow-xs"
              v-html="renderedMarkdown"
            />
          </div>
        </div>
      </fieldset>
    </div>

    <!-- TAB 2: MEDIA & VISUAL -->
    <div id="project-panel-media" v-show="activeTab === 'media'" role="tabpanel" aria-labelledby="project-tab-media" class="space-y-6">
      <div class="rounded-3xl bg-white/85 p-6 sm:p-8 border border-ink/10 shadow-xs space-y-6">
        <div>
          <h3 class="font-display text-xl font-bold text-ink">Thumbnail & Aset Visual</h3>
          <p class="mt-1 text-xs text-mute font-sans">Unggah gambar resolusi tinggi (rekomendasi rasio 16:10, minimal 1600x1000px untuk hasil tajam).</p>
        </div>

        <!-- Clean Drag and Drop Dropzone -->
        <div
          class="relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 transition-all text-center cursor-pointer"
          :class="isDragOver ? 'border-signal bg-signal/5' : 'border-ink/20 hover:border-signal/50 bg-paper/30'"
          @dragover.prevent="isDragOver = true"
          @dragleave.prevent="isDragOver = false"
          @drop.prevent="onDropFile"
          @click="($refs.fileInput as HTMLInputElement).click()"
        >
          <input
            ref="fileInput"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            class="hidden"
            @change="onFileChange"
          >

          <p class="font-display font-bold text-ink text-base">
            Tarik & Lepas Berkas Gambar ke Sini, atau <span class="text-signal underline">Pilih Berkas</span>
          </p>
          <p class="mt-1.5 font-mono text-xs text-mute">
            Mendukung format JPG, PNG, WebP, GIF (Maksimal 10 MB)
          </p>
        </div>

        <!-- Thumbnail Preview -->
        <div v-if="thumbnailPreview" class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="font-mono text-xs font-bold text-ink uppercase tracking-wider">Pratinjau Thumbnail Aktif</span>
            <button
              type="button"
              class="font-mono text-xs text-signal hover:underline cursor-pointer"
              @click="thumbnailPreview = ''; thumbnailFile = null"
            >
              Hapus Gambar
            </button>
          </div>
          <div class="aspect-[16/10] max-w-xl overflow-hidden rounded-3xl border border-ink/15 shadow-sm bg-ink/5">
            <img :src="thumbnailPreview" alt="Thumbnail Preview" class="h-full w-full object-cover">
          </div>
        </div>

        <!-- Optional Preview Media URL -->
        <div class="pt-4 border-t border-ink/10 space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-mono text-xs font-bold text-ink uppercase tracking-wider">Preview Media URL (Opsional Video/GIF)</span>
            <span class="font-mono text-[0.7rem] text-mute">Untuk interaksi hover preview</span>
          </div>
          <input
            v-model="form.previewMediaUrl"
            class="field font-mono text-sm"
            placeholder="https://.../preview.mp4 atau .gif"
          >
        </div>
      </div>
    </div>

    <!-- TAB 3: SEO & SOCIAL SHARING -->
    <div id="project-panel-seo" v-show="activeTab === 'seo'" role="tabpanel" aria-labelledby="project-tab-seo" class="space-y-8">
      <!-- Top SEO Scorecard & Audit Breakdown -->
      <div class="grid gap-6 lg:grid-cols-[1.2fr_1.8fr]">
        <!-- Gauge Card -->
        <div class="rounded-3xl bg-white/85 p-6 sm:p-7 border border-ink/10 shadow-xs flex flex-col justify-between">
          <div>
            <span class="font-mono text-xs font-bold text-mute uppercase tracking-widest">Kesehatan SEO</span>
            <div class="mt-4 flex items-center gap-5">
              <div
                class="flex size-24 shrink-0 flex-col items-center justify-center rounded-3xl border-2 font-display"
                :class="seoAnalysis.colorClass"
              >
                <span class="text-3xl font-bold leading-none">{{ seoAnalysis.score }}</span>
                <span class="font-mono text-[0.65rem] font-bold uppercase tracking-wider mt-1">Skor / 100</span>
              </div>
              <div class="space-y-1">
                <p class="font-display text-2xl font-bold text-ink">
                  Grade {{ seoAnalysis.grade }}
                </p>
                <p class="text-xs text-mute font-sans leading-relaxed">
                  {{ seoAnalysis.score >= 80 ? 'Optimal! Halaman siap bersaing di halaman pertama mesin pencari dan media sosial.' : 'Perlu beberapa penyesuaian untuk mencapai visibilitas maksimal.' }}
                </p>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-5 border-t border-ink/10 grid grid-cols-2 gap-3 font-mono text-xs">
            <div class="rounded-2xl bg-ink/[0.03] p-3 border border-ink/5">
              <p class="text-mute text-[0.7rem]">Jumlah Kata</p>
              <p class="font-bold text-ink text-base mt-0.5">{{ seoAnalysis.wordCount }} kata</p>
            </div>
            <div class="rounded-2xl bg-ink/[0.03] p-3 border border-ink/5">
              <p class="text-mute text-[0.7rem]">Waktu Baca</p>
              <p class="font-bold text-ink text-base mt-0.5">~{{ seoAnalysis.readingTimeMinutes }} menit</p>
            </div>
          </div>
        </div>

        <!-- Realtime Audit Checklist (Minimalist Indicator Dot) -->
        <div class="rounded-3xl bg-white/85 p-6 sm:p-7 border border-ink/10 shadow-xs space-y-3.5">
          <span class="font-mono text-xs font-bold text-ink uppercase tracking-widest">Daftar Audit SEO Otomatis</span>
          <div class="space-y-2 max-h-72 overflow-y-auto pr-1">
            <div
              v-for="item in seoAnalysis.auditItems"
              :key="item.id"
              class="flex items-start gap-3 rounded-2xl p-3 border transition-colors"
              :class="{
                'bg-emerald-50/60 border-emerald-200 text-emerald-900': item.status === 'pass',
                'bg-amber-50/60 border-amber-200 text-amber-900': item.status === 'warning',
                'bg-rose-50/60 border-rose-200 text-rose-900': item.status === 'fail',
              }"
            >
              <span
                class="mt-1.5 size-2 rounded-full shrink-0"
                :class="{
                  'bg-emerald-600': item.status === 'pass',
                  'bg-amber-600': item.status === 'warning',
                  'bg-rose-600': item.status === 'fail',
                }"
              />
              <div class="flex-1 min-w-0 text-xs">
                <div class="flex items-center justify-between">
                  <span class="font-bold">{{ item.label }}</span>
                  <span class="font-mono text-[0.68rem] opacity-75">{{ item.points }}/{{ item.maxPoints }} pts</span>
                </div>
                <p class="mt-0.5 opacity-90 leading-relaxed font-sans">{{ item.message }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SEO Custom Overrides Form -->
      <div class="rounded-3xl bg-white/85 p-6 sm:p-8 border border-ink/10 shadow-xs space-y-6">
        <h3 class="font-display text-xl font-bold text-ink">Kustomisasi Meta Tag SEO</h3>

        <div class="grid gap-6 lg:grid-cols-2">
          <!-- Custom SEO Title -->
          <label class="space-y-2 lg:col-span-2">
            <div class="flex items-center justify-between">
              <span class="font-mono text-xs font-bold text-ink uppercase tracking-wider">Custom SEO Title (Opsional)</span>
              <span class="font-mono text-[0.7rem]" :class="form.seoTitle.length >= 40 && form.seoTitle.length <= 65 ? 'text-emerald-600 font-bold' : 'text-mute'">
                {{ form.seoTitle.length }} / 60 karakter (Rekomendasi 40–65)
              </span>
            </div>
            <input
              v-model="form.seoTitle"
              class="field font-sans"
              :placeholder="`${form.title || 'Judul Project'} — Portofolio & Case Study`"
              maxlength="100"
            >
            <small class="block font-mono text-[0.7rem] text-mute">Jika dikosongkan, judul utama project akan otomatis digunakan.</small>
          </label>

          <!-- Custom SEO Description -->
          <label class="space-y-2 lg:col-span-2">
            <div class="flex items-center justify-between">
              <span class="font-mono text-xs font-bold text-ink uppercase tracking-wider">Custom SEO Meta Description</span>
              <span class="font-mono text-[0.7rem]" :class="form.seoDescription.length >= 120 && form.seoDescription.length <= 160 ? 'text-emerald-600 font-bold' : 'text-mute'">
                {{ form.seoDescription.length }} / 160 karakter (Rekomendasi 120–160)
              </span>
            </div>
            <textarea
              v-model="form.seoDescription"
              class="field min-h-24 resize-y font-sans text-sm leading-relaxed"
              placeholder="Tulis ringkasan menarik yang membuat audiens ingin mengklik di Google Search atau media sosial..."
              maxlength="200"
            />
          </label>
        </div>
      </div>

      <!-- Live SERP Simulator (Google Search Preview) -->
      <div class="rounded-3xl bg-white/85 p-6 sm:p-8 border border-ink/10 shadow-xs space-y-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 class="font-display text-xl font-bold text-ink">Simulator Google Search (SERP)</h3>
            <p class="text-xs text-mute font-sans">Simulasi tampilan halaman project Anda saat muncul di hasil pencarian Google.</p>
          </div>

          <!-- Device Switcher -->
          <div class="flex items-center gap-1 rounded-xl bg-ink/5 p-1 font-mono text-xs font-semibold">
            <button
              type="button"
              class="cursor-pointer rounded-lg px-3 py-1 transition-all"
              :class="serpDevice === 'desktop' ? 'bg-white text-ink shadow-xs' : 'text-mute hover:text-ink'"
              @click="serpDevice = 'desktop'"
            >
              Desktop
            </button>
            <button
              type="button"
              class="cursor-pointer rounded-lg px-3 py-1 transition-all"
              :class="serpDevice === 'mobile' ? 'bg-white text-ink shadow-xs' : 'text-mute hover:text-ink'"
              @click="serpDevice = 'mobile'"
            >
              Mobile
            </button>
          </div>
        </div>

        <!-- Google SERP Frame -->
        <div
          class="rounded-2xl bg-white p-5 sm:p-6 border border-ink/15 shadow-sm transition-all"
          :class="serpDevice === 'mobile' ? 'max-w-md mx-auto' : 'w-full'"
        >
          <!-- URL breadcrumb line -->
          <div class="flex items-center gap-2 text-xs font-sans text-[#202124]">
            <span class="flex size-5 items-center justify-center rounded-full bg-ink/10 text-[0.6rem] font-bold">RD</span>
            <div class="flex flex-col leading-tight">
              <span class="text-[0.75rem] font-medium">Rumah Design</span>
              <span class="text-[0.68rem] text-[#5f6368]">https://rumahdesign.dev › project › {{ form.slug || 'slug-project' }}</span>
            </div>
          </div>

          <!-- SERP Title -->
          <h4 class="mt-2 font-sans text-lg font-normal text-[#1a0dab] hover:underline cursor-pointer leading-snug">
            {{ seoAnalysis.serpTitle }}
          </h4>

          <!-- SERP Snippet -->
          <p class="mt-1 font-sans text-xs text-[#4d5156] leading-relaxed line-clamp-2">
            {{ seoAnalysis.serpDescription }}
          </p>
        </div>
      </div>

      <!-- Social Share Card Preview (Open Graph) -->
      <div class="rounded-3xl bg-white/85 p-6 sm:p-8 border border-ink/10 shadow-xs space-y-5">
        <div>
          <h3 class="font-display text-xl font-bold text-ink">Simulator Kartu Berbagi Sosial (Open Graph)</h3>
          <p class="text-xs text-mute font-sans">Tampilan preview saat link dibagikan di Twitter/X, LinkedIn, WhatsApp, atau Slack.</p>
        </div>
        <div class="max-w-lg overflow-hidden rounded-2xl border border-ink/15 bg-white shadow-md">
          <div class="relative aspect-[16/9] w-full bg-[#121110]/5 overflow-hidden">
            <img
              v-if="thumbnailPreview"
              :src="thumbnailPreview"
              alt="OG Preview"
              class="h-full w-full object-cover"
            >
            <div v-else class="flex h-full w-full items-center justify-center font-mono text-xs text-mute">
              Belum ada gambar thumbnail
            </div>
          </div>
          <div class="p-4 space-y-1 bg-white">
            <span class="font-mono text-[0.68rem] text-mute uppercase tracking-wider">rumahdesign.dev</span>
            <p class="font-display font-bold text-ink text-base line-clamp-1">
              {{ form.title || 'Judul Project Portofolio' }}
            </p>
            <p class="text-xs text-mute font-sans line-clamp-2 leading-relaxed">
              {{ form.seoDescription || seoAnalysis.serpDescription }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky Bottom Submit Actions Bar -->
    <div class="sticky bottom-3 sm:bottom-4 z-30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl sm:rounded-3xl bg-paper/95 backdrop-blur-md p-3.5 sm:p-5 border border-ink/15 shadow-xl">
      <div class="flex items-center gap-2.5">
        <span
          class="size-2.5 rounded-full shrink-0"
          :class="form.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'"
        />
        <span class="font-mono text-xs font-bold uppercase tracking-wider text-ink truncate">
          Status: {{ form.status === 'published' ? 'Siap Dipublikasikan' : 'Draft Tersimpan' }}
        </span>
      </div>

      <div class="flex items-center justify-end gap-2.5">
        <NuxtLink to="/admin/projects" class="button-secondary text-xs flex-1 sm:flex-none text-center">
          Batal
        </NuxtLink>
        <button
          type="submit"
          class="button-primary text-xs cursor-pointer flex-1 sm:flex-none text-center"
          :disabled="busy"
        >
          {{ submitLabel }}
        </button>
      </div>
    </div>
  </form>
</template>
