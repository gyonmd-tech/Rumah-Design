import type { ProjectCategory, ProjectStatus } from '~/types/database.types'

export interface ProjectFormPayload {
  title: string
  slug: string
  description: string
  liveUrl: string
  repoUrl: string
  category: ProjectCategory
  styleTags: string[]
  techStack: string[]
  status: ProjectStatus
  previewMediaUrl?: string
  seoTitle?: string
  seoDescription?: string
  focusKeyword?: string
  thumbnailFile: File | null
}


