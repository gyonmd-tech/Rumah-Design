// Responsive delivery for project media stored in Supabase Storage.
// Public object URLs are rewritten to the Storage image-transformation
// endpoint, which resizes and serves WebP/AVIF to browsers that accept it.
// Non-Supabase URLs pass through untouched.

const OBJECT_PATH = '/storage/v1/object/public/'
const RENDER_PATH = '/storage/v1/render/image/public/'

/** Default widths cover 1x–2x for the card sizes used on the public site. */
export const IMAGE_WIDTHS = [480, 768, 1080, 1440, 1920] as const

export function isTransformable(url: string | null | undefined): url is string {
  return Boolean(url && url.includes(OBJECT_PATH) && !/\.(gif|svg)(\?|$)/i.test(url))
}

export function imageUrl(url: string, width: number, quality = 82) {
  if (!isTransformable(url)) return url
  const base = url.replace(OBJECT_PATH, RENDER_PATH).split('?')[0]
  return `${base}?width=${width}&quality=${quality}&resize=contain`
}

export function imageSrcset(url: string | null | undefined, widths: readonly number[] = IMAGE_WIDTHS) {
  if (!isTransformable(url)) return undefined
  return widths.map(width => `${imageUrl(url, width)} ${width}w`).join(', ')
}

/** Props for an <img>: small default src plus a srcset the browser picks from. */
export function responsiveImage(url: string, sizes: string, fallbackWidth = 1080, widths: readonly number[] = IMAGE_WIDTHS) {
  return {
    src: isTransformable(url) ? imageUrl(url, fallbackWidth) : url,
    srcset: imageSrcset(url, widths),
    sizes: isTransformable(url) ? sizes : undefined,
  }
}
