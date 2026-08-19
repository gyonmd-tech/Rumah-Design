export interface SeoAuditItem {
  id: string
  label: string
  status: 'pass' | 'warning' | 'fail'
  message: string
  points: number
  maxPoints: number
}

export interface SeoAnalysisResult {
  score: number
  grade: 'A' | 'B' | 'C' | 'D'
  colorClass: string
  wordCount: number
  readingTimeMinutes: number
  auditItems: SeoAuditItem[]
  serpTitle: string
  serpDescription: string
}

/**
 * Strips markdown formatting to pure text
 */
export function stripMarkdown(markdown: string | null | undefined): string {
  if (!markdown) return ''
  return markdown
    .replace(/^#+\s+/gm, '') // headings
    .replace(/\*\*([^*]+)\*\*/g, '$1') // bold
    .replace(/\*([^*]+)\*/g, '$1') // italic
    .replace(/__([^_]+)__/g, '$1') // bold
    .replace(/_([^_]+)_/g, '$1') // italic
    .replace(/`([^`]+)`/g, '$1') // inline code
    .replace(/```[\s\S]*?```/g, '') // code blocks
    .replace(/!\[([^\]]*)\]\(([^)]*)\)/g, '') // images
    .replace(/\[([^\]]+)\]\(([^)]*)\)/g, '$1') // links
    .replace(/^\s*[-*+]\s+/gm, '') // lists
    .replace(/^\s*\d+\.\s+/gm, '') // numbered lists
    .replace(/^\s*>\s+/gm, '') // blockquotes
    .replace(/\n+/g, ' ')
    .trim()
}

/**
 * Calculates word count and reading time in minutes
 */
export function calculateContentMetrics(markdown: string | null | undefined) {
  const text = stripMarkdown(markdown)
  if (!text) {
    return { wordCount: 0, charCount: 0, readingTimeMinutes: 0 }
  }
  const words = text.split(/\s+/).filter(Boolean)
  const wordCount = words.length
  const charCount = text.length
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 180))
  return { wordCount, charCount, readingTimeMinutes }
}

/**
 * Analyzes SEO quality and returns a score from 0-100 with comprehensive checklist
 */
export function analyzeSeoQuality(params: {
  title: string
  slug: string
  description?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
  focusKeyword?: string | null
  liveUrl?: string | null
  thumbnailUrl?: string | null
}): SeoAnalysisResult {
  const {
    title = '',
    slug = '',
    description = '',
    seoTitle = '',
    seoDescription = '',
    focusKeyword = '',
    liveUrl = '',
    thumbnailUrl = '',
  } = params

  const effectiveTitle = (seoTitle?.trim() || title?.trim())
  const effectiveDescription = (seoDescription?.trim() || stripMarkdown(description)).slice(0, 300)
  const normalizedKeyword = focusKeyword?.trim().toLowerCase() || ''

  const { wordCount, readingTimeMinutes } = calculateContentMetrics(description)
  const auditItems: SeoAuditItem[] = []

  // 1. Title Length Audit (15 pts)
  const titleLength = effectiveTitle.length
  if (titleLength >= 40 && titleLength <= 65) {
    auditItems.push({
      id: 'title-length',
      label: 'Panjang Judul SEO',
      status: 'pass',
      message: `Sangat optimal (${titleLength} karakter, standar 40-65).`,
      points: 15,
      maxPoints: 15,
    })
  }
  else if (titleLength >= 20 && titleLength <= 80) {
    auditItems.push({
      id: 'title-length',
      label: 'Panjang Judul SEO',
      status: 'warning',
      message: `Cukup baik (${titleLength} karakter). Idealnya 40–65 karakter agar tidak terpotong di Google.`,
      points: 10,
      maxPoints: 15,
    })
  }
  else {
    auditItems.push({
      id: 'title-length',
      label: 'Panjang Judul SEO',
      status: 'fail',
      message: titleLength === 0 ? 'Judul belum diisi.' : `Terlalu pendek/panjang (${titleLength} karakter). Disarankan 40–65 karakter.`,
      points: 0,
      maxPoints: 15,
    })
  }

  // 2. Meta Description Length Audit (15 pts)
  const descLength = effectiveDescription.length
  if (descLength >= 120 && descLength <= 160) {
    auditItems.push({
      id: 'desc-length',
      label: 'Panjang Meta Deskripsi',
      status: 'pass',
      message: `Sangat pas (${descLength} karakter, rekomendasi 120-160).`,
      points: 15,
      maxPoints: 15,
    })
  }
  else if (descLength >= 70 && descLength <= 200) {
    auditItems.push({
      id: 'desc-length',
      label: 'Panjang Meta Deskripsi',
      status: 'warning',
      message: `Dapat ditingkatkan (${descLength} karakter). Targetkan 120–160 karakter untuk snippet SERP maksimal.`,
      points: 9,
      maxPoints: 15,
    })
  }
  else {
    auditItems.push({
      id: 'desc-length',
      label: 'Panjang Meta Deskripsi',
      status: 'fail',
      message: descLength === 0 ? 'Meta deskripsi masih kosong.' : `Panjang tidak ideal (${descLength} karakter).`,
      points: 0,
      maxPoints: 15,
    })
  }

  // 3. Slug Audit (10 pts)
  const isSlugValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
  if (isSlugValid && slug.length >= 3 && slug.length <= 60) {
    auditItems.push({
      id: 'slug-format',
      label: 'Struktur Slug URL',
      status: 'pass',
      message: `Slug bersih dan ramah mesin pencari (/${slug}).`,
      points: 10,
      maxPoints: 10,
    })
  }
  else {
    auditItems.push({
      id: 'slug-format',
      label: 'Struktur Slug URL',
      status: 'fail',
      message: 'Slug harus lowercase, angka, dan pemisah tanda hubung tanpa spasi.',
      points: 0,
      maxPoints: 10,
    })
  }

  // 4. Focus Keyword Audit (Title & Description) (20 pts)
  if (normalizedKeyword) {
    const inTitle = effectiveTitle.toLowerCase().includes(normalizedKeyword)
    const inDesc = effectiveDescription.toLowerCase().includes(normalizedKeyword)

    if (inTitle && inDesc) {
      auditItems.push({
        id: 'keyword-usage',
        label: 'Penempatan Target Kata Kunci',
        status: 'pass',
        message: `Kata kunci “${focusKeyword}” ditemukan di Judul dan Meta Deskripsi.`,
        points: 20,
        maxPoints: 20,
      })
    }
    else if (inTitle || inDesc) {
      auditItems.push({
        id: 'keyword-usage',
        label: 'Penempatan Target Kata Kunci',
        status: 'warning',
        message: `Kata kunci ditemukan di ${inTitle ? 'Judul' : 'Deskripsi'}, namun belum lengkap di keduanya.`,
        points: 12,
        maxPoints: 20,
      })
    }
    else {
      auditItems.push({
        id: 'keyword-usage',
        label: 'Penempatan Target Kata Kunci',
        status: 'fail',
        message: `Kata kunci “${focusKeyword}” belum muncul di Judul maupun Deskripsi.`,
        points: 4,
        maxPoints: 20,
      })
    }
  }
  else {
    auditItems.push({
      id: 'keyword-usage',
      label: 'Target Kata Kunci',
      status: 'warning',
      message: 'Belum menetapkan target kata kunci spesifik (mis: "Landing Page SaaS", "Dashboard").',
      points: 6,
      maxPoints: 20,
    })
  }

  // 5. Content Length & Depth Audit (15 pts)
  if (wordCount >= 180) {
    auditItems.push({
      id: 'content-depth',
      label: 'Kedalaman Case Study',
      status: 'pass',
      message: `Konten narasi memadai (${wordCount} kata, estimasi baca ${readingTimeMinutes} mnt).`,
      points: 15,
      maxPoints: 15,
    })
  }
  else if (wordCount >= 70) {
    auditItems.push({
      id: 'content-depth',
      label: 'Kedalaman Case Study',
      status: 'warning',
      message: `Cukup singkat (${wordCount} kata). Tambahkan narasi problem, proses & solusi (>180 kata).`,
      points: 9,
      maxPoints: 15,
    })
  }
  else {
    auditItems.push({
      id: 'content-depth',
      label: 'Kedalaman Case Study',
      status: 'fail',
      message: `Terlalu tipis (${wordCount} kata). Mesin pencari menyukai case study yang komprehensif.`,
      points: 2,
      maxPoints: 15,
    })
  }

  // 6. Heading Hierarchy Audit (10 pts)
  const hasHeadings = /^##\s+/m.test(description || '')
  if (hasHeadings) {
    auditItems.push({
      id: 'heading-structure',
      label: 'Struktur Heading (H2/H3)',
      status: 'pass',
      message: 'Case study memiliki struktur sub-heading (##) yang jelas.',
      points: 10,
      maxPoints: 10,
    })
  }
  else {
    auditItems.push({
      id: 'heading-structure',
      label: 'Struktur Heading (H2/H3)',
      status: 'warning',
      message: 'Gunakan heading Markdown (## Masalah, ## Solusi) untuk mempermudah pembaca & crawler.',
      points: 4,
      maxPoints: 10,
    })
  }

  // 7. Visual / Thumbnail Audit (10 pts)
  if (thumbnailUrl && (thumbnailUrl.startsWith('https://') || thumbnailUrl.startsWith('blob:'))) {
    auditItems.push({
      id: 'thumbnail-media',
      label: 'Thumbnail & Open Graph Asset',
      status: 'pass',
      message: 'Thumbnail visual telah disiapkan untuk preview kartu sosial & Google.',
      points: 10,
      maxPoints: 10,
    })
  }
  else {
    auditItems.push({
      id: 'thumbnail-media',
      label: 'Thumbnail & Open Graph Asset',
      status: 'fail',
      message: 'Thumbnail belum diunggah. Visual menarik kunci CTR tinggi di social & SERP.',
      points: 0,
      maxPoints: 10,
    })
  }

  // 8. Live URL Validity (5 pts)
  if (liveUrl && liveUrl.startsWith('https://')) {
    auditItems.push({
      id: 'live-url',
      label: 'Keamanan Live Demo (HTTPS)',
      status: 'pass',
      message: 'Tautan demo eksternal memakai protokol HTTPS terenkripsi.',
      points: 5,
      maxPoints: 5,
    })
  }
  else {
    auditItems.push({
      id: 'live-url',
      label: 'Keamanan Live Demo (HTTPS)',
      status: 'fail',
      message: 'Tautan live demo harus diawali dengan https://',
      points: 0,
      maxPoints: 5,
    })
  }

  // Total Score Calculation
  const totalEarned = auditItems.reduce((acc, item) => acc + item.points, 0)
  const totalMax = auditItems.reduce((acc, item) => acc + item.maxPoints, 0)
  const score = Math.round((totalEarned / (totalMax || 1)) * 100)

  let grade: 'A' | 'B' | 'C' | 'D' = 'D'
  let colorClass = 'text-rose-600 bg-rose-50 border-rose-200'

  if (score >= 85) {
    grade = 'A'
    colorClass = 'text-emerald-700 bg-emerald-50 border-emerald-300'
  }
  else if (score >= 70) {
    grade = 'B'
    colorClass = 'text-teal-700 bg-teal-50 border-teal-300'
  }
  else if (score >= 50) {
    grade = 'C'
    colorClass = 'text-amber-700 bg-amber-50 border-amber-300'
  }

  const serpTitle = effectiveTitle ? `${effectiveTitle} — Rumah Design` : 'Judul Project — Rumah Design'
  const serpDescription = effectiveDescription || 'Showcase karya frontend dan narasi proses desain produk.'

  return {
    score,
    grade,
    colorClass,
    wordCount,
    readingTimeMinutes,
    auditItems,
    serpTitle,
    serpDescription,
  }
}
