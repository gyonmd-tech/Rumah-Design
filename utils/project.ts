import type { ProjectCategory } from '~/types/database.types'

export const PROJECT_CATEGORIES: Array<{ value: ProjectCategory, label: string }> = [
  { value: 'landing-page', label: 'Landing page' },
  { value: 'web-app', label: 'Web app' },
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'lainnya', label: 'Eksperimen' },
]

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
  return [...new Set(value.split(',').map(tag => tag.trim()).filter(Boolean))]
}

export function excerpt(value: string | null, length = 155) {
  if (!value) return 'Project frontend pilihan dari Rumah Design.'
  const plain = value
    .replace(/[#*_>`~\[\]()!-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return plain.length > length ? `${plain.slice(0, length - 1).trim()}…` : plain
}
