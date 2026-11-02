import type { ClickTarget } from '~/types/database.types'

export const CLICK_TARGETS: readonly ClickTarget[] = ['demo', 'repo']

export function isClickTarget(value: unknown): value is ClickTarget {
  return typeof value === 'string' && (CLICK_TARGETS as readonly string[]).includes(value)
}

/** Common crawlers and link previewers; their requests are not clicks. */
const BOT_RE = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|headless|lighthouse/i

export function isLikelyBot(userAgent: string | undefined | null) {
  return !userAgent || BOT_RE.test(userAgent)
}

type SessionStore = Pick<Storage, 'getItem' | 'setItem'>

/**
 * True the first time a visitor clicks this link in the current browser
 * session. Without usable storage every click counts.
 */
export function firstClickInSession(storage: SessionStore | undefined, slug: string, target: ClickTarget) {
  if (!storage) return true
  const key = `click:${slug}:${target}`
  try {
    if (storage.getItem(key)) return false
    storage.setItem(key, '1')
  }
  catch {
    // Storage blocked (private mode, quota): count the click.
  }
  return true
}

/** Records an outbound click without delaying the navigation. */
export function trackOutboundClick(slug: string, target: ClickTarget) {
  if (!import.meta.client) return
  let storage: Storage | undefined
  try {
    storage = window.sessionStorage
  }
  catch {
    storage = undefined
  }
  if (!firstClickInSession(storage, slug, target)) return

  const url = `/api/projects/${encodeURIComponent(slug)}/click`
  const body = JSON.stringify({ target })
  try {
    if (navigator.sendBeacon?.(url, new Blob([body], { type: 'application/json' }))) return
  }
  catch {
    // Fall through to fetch.
  }
  fetch(url, { method: 'POST', body, headers: { 'content-type': 'application/json' }, keepalive: true }).catch(() => {})
}
