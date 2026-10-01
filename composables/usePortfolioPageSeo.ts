import { serializeJsonLd } from '~/utils/structured-data'

export function usePortfolioPageSeo(options: { title: string; description: string; path: string; service?: string }) {
  const origin = String(useRuntimeConfig().public.siteUrl).replace(/\/+$/, '')
  const url = origin + options.path
  const title = options.title + ' — Hygione Darriyan'
  useSeoMeta({
    title, description: options.description,
    ogTitle: title, ogDescription: options.description, ogUrl: url, ogType: 'website',
    twitterTitle: title, twitterDescription: options.description,
  })
  useHead({
    link: [{ rel: 'canonical', href: url }],
    script: [{
      type: 'application/ld+json',
      innerHTML: serializeJsonLd({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebPage', '@id': url + '#page', url, name: title,
            description: options.description, inLanguage: 'id',
            isPartOf: { '@id': origin + '/#website' },
            author: { '@id': origin + '/#person' },
            ...(options.service ? { mainEntity: {
              '@type': 'Service', '@id': url + '#service', name: options.service,
              serviceType: options.service, description: options.description,
              provider: { '@id': origin + '/#person' }, url,
            } } : {}),
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Beranda', item: origin + '/' },
              ...(options.service ? [{ '@type': 'ListItem', position: 2, name: 'Layanan', item: origin + '/layanan' }] : []),
              { '@type': 'ListItem', position: options.service ? 3 : 2, name: options.title, item: url },
            ],
          },
        ],
      }),
    }],
  })
}
