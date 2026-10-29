import { describe, expect, it } from 'vitest'
import { excerpt, isValidHttpsUrl, parseTags, slugify, validateTags } from '~/utils/project'

describe('slugify', () => {
  it('produces slugs accepted by the database check', () => {
    for (const input of ['Ecoshire — Modern Hobbit Retreat', '  Café Déjà Vu!  ', 'API v2.0 / Beta']) {
      expect(slugify(input)).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    }
    expect(slugify('Café Déjà Vu')).toBe('cafe-deja-vu')
  })
})

describe('parseTags', () => {
  it('trims, drops empties and de-duplicates case-insensitively', () => {
    expect(parseTags(' Minimal, minimal ,, Dark Mode,DARK MODE ')).toEqual(['Minimal', 'Dark Mode'])
  })
})

describe('isValidHttpsUrl', () => {
  it('accepts plain https URLs', () => {
    expect(isValidHttpsUrl('https://example.com/demo?x=1')).toBe(true)
  })

  it('rejects other protocols, credentials and garbage', () => {
    for (const value of ['http://example.com', 'javascript:alert(1)', 'https://user:pass@example.com', 'ftp://example.com', 'example.com', '']) {
      expect(isValidHttpsUrl(value)).toBe(false)
    }
  })
})

describe('validateTags', () => {
  it('flags too many or too long tags', () => {
    expect(validateTags(Array.from({ length: 17 }, (_, i) => `t${i}`), 'Style tags')).toHaveLength(1)
    expect(validateTags(['x'.repeat(51)], 'Style tags')).toHaveLength(1)
    expect(validateTags(['Minimal'], 'Style tags')).toEqual([])
  })
})

describe('excerpt', () => {
  it('falls back when there is no description', () => {
    expect(excerpt(null)).toBe('Project frontend pilihan dari Hygione Darriyan.')
  })

  it('strips markdown and HTML into plain text', () => {
    expect(excerpt('## Judul\n\n**Tebal** dan [tautan](https://x.com) <b>html</b>')).toBe('Judul Tebal dan tautan html')
  })

  it('truncates to the requested length with an ellipsis', () => {
    const result = excerpt('kata '.repeat(100), 50)
    expect(result.length).toBeLessThanOrEqual(50)
    expect(result.endsWith('…')).toBe(true)
  })
})
