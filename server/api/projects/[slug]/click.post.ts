import { isClickTarget, isLikelyBot } from '~/utils/outbound'

/**
 * Records a live demo / repository click (ADR-009). Always answers 204 so the
 * endpoint does not reveal whether a project exists; failures are logged only.
 */
export default defineEventHandler(async (event) => {
  setResponseStatus(event, 204)
  const slug = getRouterParam(event, 'slug')
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null
  if (isLikelyBot(getHeader(event, 'user-agent'))) return null

  const body = await readBody<{ target?: unknown }>(event).catch(() => null)
  const target = body?.target
  if (!isClickTarget(target)) return null

  const { error } = await useServerSupabase()
    .rpc('record_project_click', { p_slug: slug, p_target: target })
    .abortSignal(AbortSignal.timeout(5000))
  if (error) console.error('Unable to record project click:', error.message)
  return null
})
