import { describe, expect, it } from 'vitest'
import { validateProjectPayload } from '~/composables/useProjectAdmin'
import type { ProjectFormPayload } from '~/types/project-form'

const LONG_CASE_STUDY = 'Case study yang cukup panjang untuk memenuhi batas publish minimal delapan puluh karakter di database.'

function payload(overrides: Partial<ProjectFormPayload> = {}): ProjectFormPayload {
  return {
    title: 'EcoShire',
    slug: 'ecoshire',
    description: LONG_CASE_STUDY,
    liveUrl: 'https://ecoshire.example.com',
    repoUrl: '',
    category: 'web-app',
    styleTags: ['Minimal'],
    techStack: ['Nuxt 3'],
    status: 'published',
    thumbnailFile: null,
    ...overrides,
  }
}

describe('validateProjectPayload', () => {
  it('accepts a publish-ready project and normalizes whitespace', () => {
    const result = validateProjectPayload(payload({ title: '  EcoShire  ', styleTags: [' Minimal ', ''] }))
    expect(result.title).toBe('EcoShire')
    expect(result.styleTags).toEqual(['Minimal'])
  })

  it('mirrors the database publish-readiness check', () => {
    expect(() => validateProjectPayload(payload({ description: 'pendek' }))).toThrow(/minimal 80 karakter/)
    expect(() => validateProjectPayload(payload({ styleTags: [] }))).toThrow(/style tag/)
    expect(() => validateProjectPayload(payload({ techStack: [] }))).toThrow(/teknologi/)
  })

  it('allows incomplete drafts', () => {
    expect(() => validateProjectPayload(payload({ status: 'draft', description: '', styleTags: [], techStack: [] }))).not.toThrow()
  })

  it('rejects invalid slugs, categories and non-https URLs', () => {
    expect(() => validateProjectPayload(payload({ slug: 'Bad Slug' }))).toThrow(/Slug/)
    expect(() => validateProjectPayload(payload({ category: 'unknown' as ProjectFormPayload['category'] }))).toThrow(/Kategori/)
    expect(() => validateProjectPayload(payload({ liveUrl: 'http://insecure.example.com' }))).toThrow(/Live URL/)
    expect(() => validateProjectPayload(payload({ repoUrl: 'javascript:alert(1)' }))).toThrow(/Repository URL/)
    expect(() => validateProjectPayload(payload({ previewMediaUrl: 'ftp://x.example' }))).toThrow(/Preview media/)
  })

  it('enforces SEO field limits', () => {
    expect(() => validateProjectPayload(payload({ seoTitle: 'x'.repeat(101) }))).toThrow(/Meta title/)
    expect(() => validateProjectPayload(payload({ seoDescription: 'x'.repeat(201) }))).toThrow(/Meta description/)
  })
})
