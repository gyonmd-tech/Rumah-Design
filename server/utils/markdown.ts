import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

export function renderSafeMarkdown(markdown: string | null) {
  if (!markdown) return ''
  const rendered = marked.parse(markdown, { async: false, breaks: true, gfm: true }) as string

  return sanitizeHtml(rendered, {
    allowedTags: [
      'p', 'br', 'strong', 'em', 's', 'blockquote', 'ul', 'ol', 'li',
      'h2', 'h3', 'h4', 'a', 'code', 'pre', 'hr',
    ],
    allowedAttributes: { a: ['href', 'title', 'target', 'rel'] },
    allowedSchemes: ['https', 'http', 'mailto'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { target: '_blank', rel: 'noopener noreferrer' }),
    },
  })
}
