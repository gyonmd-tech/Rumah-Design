import type { Database, Project, ProjectStatus } from '~/types/database.types'
import type { ProjectFormPayload } from '~/types/project-form'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_IMAGE_SIZE = 10 * 1024 * 1024

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
    let thumbnailUrl = existing?.thumbnail_url ?? ''
    if (payload.thumbnailFile) thumbnailUrl = await uploadThumbnail(payload.thumbnailFile)
    if (!thumbnailUrl) throw new Error('Thumbnail wajib diunggah.')

    const values = {
      title: payload.title.trim(),
      slug: payload.slug.trim(),
      description: payload.description.trim() || null,
      live_url: payload.liveUrl.trim(),
      repo_url: payload.repoUrl.trim() || null,
      category: payload.category,
      style_tags: payload.styleTags,
      tech_stack: payload.techStack,
      thumbnail_url: thumbnailUrl,
      preview_media_url: payload.previewMediaUrl?.trim() || existing?.preview_media_url || null,
      status: payload.status,
      seo_title: payload.seoTitle?.trim() || null,
      seo_description: payload.seoDescription?.trim() || null,
      focus_keyword: payload.focusKeyword?.trim() || null,
    }


    if (existing) {
      const { data, error } = await client.from('projects').update(values).eq('id', existing.id).select().single()
      if (error) throw error
      return data as Project
    }

    const { data, error } = await client.from('projects').insert(values).select().single()
    if (error) throw error
    return data as Project
  }

  async function toggleProjectStatus(id: string, newStatus: ProjectStatus) {
    const { data, error } = await client.from('projects').update({ status: newStatus }).eq('id', id).select().single()
    if (error) throw error
    return data as Project
  }

  async function deleteProject(id: string) {
    const { error } = await client.from('projects').delete().eq('id', id)
    if (error) throw error
  }

  return { saveProject, toggleProjectStatus, deleteProject, uploadThumbnail }
}

