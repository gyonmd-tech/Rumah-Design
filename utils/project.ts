import type { ProjectCategory } from '~/types/database.types'

export const PROJECT_CATEGORIES: Array<{ value: ProjectCategory, label: string }> = [
  { value: 'landing-page', label: 'Landing page' },
  { value: 'web-app', label: 'Web app' },
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'e-commerce', label: 'E-commerce' },
  { value: 'blog-editorial', label: 'Blog / editorial' },
  { value: 'saas', label: 'SaaS' },
  { value: 'ai-tool', label: 'AI tool' },
  { value: 'mobile-app', label: 'Mobile app' },
  { value: 'game-interactive', label: 'Game / interactive' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'experimental', label: 'Eksperimental' },
  { value: 'lainnya', label: 'Lainnya' },
]

export const STYLE_TAG_SUGGESTIONS = [
  'Minimal',
  'Light',
  'Dark Mode',
  'Bold Typography',
  'Editorial',
  'Bento Grid',
  'Micro-interactions',
  'Data-rich',
  'Enterprise',
  'Gamified',
  'Retro',
  'Neobrutalism',
  'Experimental',
  '3D / Interactive',
] as const

export const TECH_STACK_SUGGESTIONS = [
  'Nuxt 3',
  'Vue 3',
  'Next.js',
  'React',
  'TypeScript',
  'Vite',
  'Tailwind CSS',
  'Supabase',
  'PostgreSQL',
  'Prisma',
  'Neon',
  'Tigris',
  'Better Auth',
  'Express',
  'GSAP',
  'Framer Motion',
  'Three.js',
  'Recharts',
  'Vercel',
  'Netlify',
] as const

export const PROJECT_LIMITS = {
  title: 120,
  description: 50_000,
  seoTitle: 100,
  seoDescription: 200,
  focusKeyword: 120,
  tags: 16,
  tagLength: 50,
} as const

export function categoryLabel(value: ProjectCategory) {
  return PROJECT_CATEGORIES.find(category => category.value === value)?.label ?? value
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function parseTags(value: string) {
  const seen = new Set<string>()
  return value
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean)
    .filter((tag) => {
      const normalized = tag.toLocaleLowerCase('id-ID')
      if (seen.has(normalized)) return false
      seen.add(normalized)
      return true
    })
}

export function isValidHttpsUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:'
      && Boolean(url.hostname)
      && !url.username
      && !url.password
  }
  catch {
    return false
  }
}

export function validateTags(tags: string[], label: string) {
  const errors: string[] = []
  if (tags.length > PROJECT_LIMITS.tags) {
    errors.push(`${label} maksimal ${PROJECT_LIMITS.tags} item.`)
  }
  if (tags.some(tag => tag.length > PROJECT_LIMITS.tagLength)) {
    errors.push(`Setiap ${label.toLowerCase()} maksimal ${PROJECT_LIMITS.tagLength} karakter.`)
  }
  return errors
}

export function excerpt(value: string | null, length = 155) {
  if (!value) return 'Project frontend pilihan dari Rumah Design.'
  const plain = value
    .replace(/[#*_>`~\[\]()!-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return plain.length > length ? `${plain.slice(0, length - 1).trim()}…` : plain
}
