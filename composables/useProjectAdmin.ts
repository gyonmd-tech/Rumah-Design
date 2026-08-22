import type { Database, Project, ProjectStatus } from '~/types/database.types'
import type { ProjectFormPayload } from '~/types/project-form'
import { isValidHttpsUrl, PROJECT_CATEGORIES, PROJECT_LIMITS, validateTags } from '~/utils/project'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_IMAGE_SIZE = 10 * 1024 * 1024

function validateProjectPayload(payload: ProjectFormPayload) {
  const errors: string[] = []
  const title = payload.title.trim()
  const description = payload.description.trim()
  const styleTags = payload.styleTags.map(tag => tag.trim()).filter(Boolean)
  const techStack = payload.techStack.map(tag => tag.trim()).filter(Boolean)

  if (!title || title.length > PROJECT_LIMITS.title) errors.push(`Judul wajib diisi dan maksimal ${PROJECT_LIMITS.title} karakter.`)
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(payload.slug.trim())) errors.push('Slug project tidak valid.')
  if (!PROJECT_CATEGORIES.some(category => category.value === payload.category)) errors.push('Kategori project tidak valid.')
  if (!isValidHttpsUrl(payload.liveUrl.trim())) errors.push('Live URL wajib berupa HTTPS yang valid.')
  if (payload.repoUrl.trim() && !isValidHttpsUrl(payload.repoUrl.trim())) errors.push('Repository URL harus berupa HTTPS yang valid.')
  if (payload.previewMediaUrl?.trim() && !isValidHttpsUrl(payload.previewMediaUrl.trim())) errors.push('Preview media URL harus berupa HTTPS yang valid.')
  if (description.length > PROJECT_LIMITS.description) errors.push(`Case study maksimal ${PROJECT_LIMITS.description.toLocaleString('id-ID')} karakter.`)
  if ((payload.seoTitle?.trim().length ?? 0) > PROJECT_LIMITS.seoTitle) errors.push(`Meta title maksimal ${PROJECT_LIMITS.seoTitle} karakter.`)
  if ((payload.seoDescription?.trim().length ?? 0) > PROJECT_LIMITS.seoDescription) errors.push(`Meta description maksimal ${PROJECT_LIMITS.seoDescription} karakter.`)
  if ((payload.focusKeyword?.trim().length ?? 0) > PROJECT_LIMITS.focusKeyword) errors.push(`Focus keyword maksimal ${PROJECT_LIMITS.focusKeyword} karakter.`)
  errors.push(...validateTags(styleTags, 'Style tags'), ...validateTags(techStack, 'Tech stack'))

  if (payload.status === 'published') {
    if (description.length < 80) errors.push('Project published memerlukan case study minimal 80 karakter.')
    if (!styleTags.length) errors.push('Project published memerlukan minimal satu style tag.')
    if (!techStack.length) errors.push('Project published memerlukan minimal satu teknologi.')
  }

  if (errors.length) throw new Error(errors.join(' '))
  return { title, description, styleTags, techStack }
}

function throwProjectWriteError(error: { code?: string, message: string }): never {
  if (error.code === '23505') throw new Error('Slug sudah digunakan oleh project lain.')
  if (error.code === '23514') throw new Error('Data project tidak memenuhi aturan database. Periksa kategori, URL, dan panjang konten.')
  throw error
}

export function useProjectAdmin() {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  async function uploadThumbnail(file: File) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) throw new Error('Gunakan gambar JPG, PNG, WebP, atau GIF.')
    if (file.size > MAX_IMAGE_SIZE) throw new Error('Ukuran thumbnail maksimal 10 MB.')
    if (!user.value?.sub) throw new Error('Sesi admin tidak ditemukan.')

    const extension = file.type === 'image/jpeg' ? 'jpg' : file.type.split('/')[1]
    const path = `${user.value.sub}/${Date.now()}-${crypto.randomUUID()}.${extension}`
    const { error } = await client.storage.from('project-media').upload(path, file, {
      cacheControl: '31536000',
      contentType: file.type,
      upsert: false,
    })
    if (error) throw error
    return client.storage.from('project-media').getPublicUrl(path).data.publicUrl
  }

  async function saveProject(payload: ProjectFormPayload, existing?: Project) {
    const normalized = validateProjectPayload(payload)
    let thumbnailUrl = existing?.thumbnail_url ?? ''
    if (payload.thumbnailFile) thumbnailUrl = await uploadThumbnail(payload.thumbnailFile)
    if (!thumbnailUrl) throw new Error('Thumbnail wajib diunggah.')

    const values = {
      title: normalized.title,
      slug: payload.slug.trim(),
      description: normalized.description || null,
      live_url: payload.liveUrl.trim(),
      repo_url: payload.repoUrl.trim() || null,
      category: payload.category,
      style_tags: normalized.styleTags,
      tech_stack: normalized.techStack,
      thumbnail_url: thumbnailUrl,
      preview_media_url: payload.previewMediaUrl?.trim() || null,
      status: payload.status,
      seo_title: payload.seoTitle?.trim() || null,
      seo_description: payload.seoDescription?.trim() || null,
      focus_keyword: payload.focusKeyword?.trim() || null,
    }


    if (existing) {
      const { data, error } = await client.from('projects').update(values).eq('id', existing.id).select().single()
      if (error) throwProjectWriteError(error)
      return data as Project
    }

    const { data, error } = await client.from('projects').insert(values).select().single()
    if (error) throwProjectWriteError(error)
    return data as Project
  }

  async function toggleProjectStatus(id: string, newStatus: ProjectStatus) {
    if (newStatus === 'published') {
      const { data: project, error: readError } = await client.from('projects').select().eq('id', id).single()
      if (readError) throw readError
      if (!project.description || project.description.trim().length < 80 || !project.style_tags.length || !project.tech_stack.length || !project.thumbnail_url) {
        throw new Error('Lengkapi case study, style tag, tech stack, dan thumbnail sebelum menerbitkan project.')
      }
    }
    const { data, error } = await client.from('projects').update({ status: newStatus }).eq('id', id).select().single()
    if (error) throwProjectWriteError(error)
    return data as Project
  }

  async function deleteProject(id: string) {
    const { error } = await client.from('projects').delete().eq('id', id)
    if (error) throw error
  }

  return { saveProject, toggleProjectStatus, deleteProject, uploadThumbnail }
}

