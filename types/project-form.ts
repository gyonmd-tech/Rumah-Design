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
  thumbnailFile: File | null
}
