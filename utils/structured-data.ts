/** Escape untrusted text inside an inline JSON-LD script element. */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
}
export const PORTFOLIO_TOPICS = ['IT support', 'UI/UX design', 'Visual design', 'Frontend development', 'Fullstack development', 'Web application development', 'Artificial intelligence integration', 'Design system', 'Prototyping', 'Responsive web design']
