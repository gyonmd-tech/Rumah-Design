import { marked } from 'marked'
import rehypeParse from 'rehype-parse'
import rehypeSanitize, { type Options as SanitizeSchema } from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import type { Element, Root } from 'hast'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'

const markdownSchema: SanitizeSchema = {
  tagNames: [
    'p', 'br', 'strong', 'em', 'del', 'blockquote', 'ul', 'ol', 'li',
    'h2', 'h3', 'h4', 'a', 'code', 'pre', 'hr', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ],
  attributes: {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'loading', 'decoding'],
    th: ['align'],
    td: ['align'],
  },
  protocols: {
    href: ['http', 'https', 'mailto'],
    src: ['http', 'https'],
  },
}

function secureRichContent() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'a') {
        node.properties.target = '_blank'
        node.properties.rel = ['noopener', 'noreferrer']
      }
      if (node.tagName === 'img') {
        node.properties.loading = 'lazy'
        node.properties.decoding = 'async'
      }
    })
  }
}

export async function renderSafeMarkdown(markdown: string | null) {
  if (!markdown) return ''
  const rendered = marked.parse(markdown, { async: false, breaks: true, gfm: true }) as string

  const result = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeSanitize, markdownSchema)
    .use(secureRichContent)
    .use(rehypeStringify)
    .process(rendered)

  return String(result)
}
