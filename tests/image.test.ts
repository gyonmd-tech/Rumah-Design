import { describe, expect, it } from 'vitest'
import { imageSrcset, imageUrl, responsiveImage } from '~/utils/image'

const STORAGE = 'https://abc.supabase.co/storage/v1/object/public/project-media/uid/shot.png'

describe('image helpers', () => {
  it('rewrites Storage objects to the render endpoint', () => {
    expect(imageUrl(STORAGE, 480)).toBe('https://abc.supabase.co/storage/v1/render/image/public/project-media/uid/shot.png?width=480&quality=82&resize=contain')
  })

  it('leaves external URLs, GIFs and SVGs untouched', () => {
    for (const url of ['https://images.example.com/a.png', STORAGE.replace('.png', '.gif'), STORAGE.replace('.png', '.svg')]) {
      expect(imageUrl(url, 480)).toBe(url)
      expect(imageSrcset(url)).toBeUndefined()
    }
  })

  it('builds a srcset and sizes only for transformable images', () => {
    const props = responsiveImage(STORAGE, '50vw')
    expect(props.srcset?.split(', ')).toHaveLength(5)
    expect(props.sizes).toBe('50vw')
    expect(responsiveImage('https://example.com/a.png', '50vw').sizes).toBeUndefined()
  })
})
