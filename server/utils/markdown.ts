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
    'h2', 'h3', 'h4', 'a', 'code', 'pre', 'hr',
  ],
  attributes: {
    a: ['href', 'title', 'target', 'rel'],
  },
  protocols: {
    href: ['http', 'https', 'mailto'],
  },
}

function secureExternalLinks() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'a') return
      node.properties.target = '_blank'
      node.properties.rel = ['noopener', 'noreferrer']
    })
  }
}

export async function renderSafeMarkdown(markdown: string | null) {
  if (!markdown) return ''
  const rendered = marked.parse(markdown, { async: false, breaks: true, gfm: true }) as string

  const result = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeSanitize, markdownSchema)
    .use(secureExternalLinks)
    .use(rehypeStringify)
    .process(rendered)

  return String(result)
}
