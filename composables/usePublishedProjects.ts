import type { ProjectSummary } from '~/types/database.types'

/** Published projects, fetched once during SSR and shared across public pages. */
export function usePublishedProjects() {
  return useAsyncData('published-projects', () => $fetch<ProjectSummary[]>('/api/projects'), {
    default: () => [] as ProjectSummary[],
  })
}

/** Frame colors cycled across project cards, in brand order. */
export const FRAME_COLORS = ['signal', 'pink', 'cyan', 'amber', 'violet'] as const
export type FrameColor = typeof FRAME_COLORS[number]

export function frameColor(index: number): FrameColor {
  return FRAME_COLORS[((index % FRAME_COLORS.length) + FRAME_COLORS.length) % FRAME_COLORS.length]
}

export function isVideoUrl(url: string | null | undefined) {
  return Boolean(url && /\.(mp4|webm|mov)(\?.*)?$/i.test(url))
}
