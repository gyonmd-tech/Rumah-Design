import { describe, expect, it } from 'vitest'
import { firstClickInSession, isClickTarget, isLikelyBot } from '~/utils/outbound'

function memoryStorage() {
  const map = new Map<string, string>()
  return {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => { map.set(key, value) },
  }
}

describe('isClickTarget', () => {
  it('accepts only demo and repo', () => {
    expect(isClickTarget('demo')).toBe(true)
    expect(isClickTarget('repo')).toBe(true)
    for (const value of ['Demo', 'live', '', null, undefined, 1, { target: 'demo' }]) {
      expect(isClickTarget(value)).toBe(false)
    }
  })
})

describe('isLikelyBot', () => {
  it('flags crawlers, previewers and missing user agents', () => {
    for (const ua of ['Googlebot/2.1', 'Mozilla/5.0 (compatible; bingbot/2.0)', 'facebookexternalhit/1.1', 'HeadlessChrome/120', 'Chrome-Lighthouse', '', undefined, null]) {
      expect(isLikelyBot(ua)).toBe(true)
    }
  })

  it('lets regular browsers through', () => {
    expect(isLikelyBot('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36')).toBe(false)
    expect(isLikelyBot('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1')).toBe(false)
  })
})

describe('firstClickInSession', () => {
  it('counts each link once per session', () => {
    const storage = memoryStorage()
    expect(firstClickInSession(storage, 'ecoshire', 'demo')).toBe(true)
    expect(firstClickInSession(storage, 'ecoshire', 'demo')).toBe(false)
    expect(firstClickInSession(storage, 'ecoshire', 'repo')).toBe(true)
    expect(firstClickInSession(storage, 'hybloggyon', 'demo')).toBe(true)
  })

  it('counts the click when storage is missing or throws', () => {
    expect(firstClickInSession(undefined, 'ecoshire', 'demo')).toBe(true)
    const broken = { getItem: () => { throw new Error('blocked') }, setItem: () => {} }
    expect(firstClickInSession(broken, 'ecoshire', 'demo')).toBe(true)
  })
})
