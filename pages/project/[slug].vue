<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import type { Project } from '~/types/database.types'
import { categoryLabel, excerpt } from '~/utils/project'
import { serializeJsonLd } from '~/utils/structured-data'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const siteOrigin = String(useRuntimeConfig().public.siteUrl).replace(/\/+$/, '')

const { data: project, error } = await useAsyncData(
  () => `project-${slug.value}`,
  () => $fetch<Project & { description_html: string }>(`/api/projects/${encodeURIComponent(slug.value)}`),
)

if (error.value || !project.value) {
  const status = error.value?.statusCode ?? 404
  throw createError({
    statusCode: status,
    statusMessage: status === 404 ? 'Project tidak ditemukan' : 'Detail project sementara tidak tersedia',
    fatal: true,
  })
}

const { data: projects } = await usePublishedProjects()
const index = computed(() => Math.max(0, projects.value.findIndex(item => item.slug === slug.value)))
const color = computed(() => frameColor(index.value))
const next = computed(() => {
  if (projects.value.length < 2) return null
  return projects.value[(index.value + 1) % projects.value.length]
})
const previewIsVideo = computed(() => isVideoUrl(project.value?.preview_media_url))
const previewImage = computed(() => {
  const url = project.value?.preview_media_url
  return url && !previewIsVideo.value && url !== project.value?.thumbnail_url ? url : null
})

const url = computed(() => `${siteOrigin}/project/${slug.value}`)
const title = computed(() => project.value?.seo_title || `${project.value?.title} — Hygione Darriyan`)
const description = computed(() => project.value?.seo_description || excerpt(project.value?.description ?? null))

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: () => project.value?.thumbnail_url,
  ogUrl: url,
  ogType: 'article',
  articlePublishedTime: () => project.value?.created_at,
  articleModifiedTime: () => project.value?.updated_at,
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: () => project.value?.thumbnail_url,
})

useHead(() => ({
  link: [{ rel: 'canonical', href: url.value }],
  script: project.value
    ? [{
        key: 'project-jsonld',
        type: 'application/ld+json',
        innerHTML: serializeJsonLd({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'CreativeWork',
              '@id': `${url.value}#work`,
              name: project.value.title,
              headline: title.value,
              description: description.value,
              image: project.value.thumbnail_url,
              url: url.value,
              genre: categoryLabel(project.value.category),
              keywords: [...(project.value.tech_stack ?? []), ...(project.value.style_tags ?? [])].join(', '),
              dateCreated: project.value.created_at,
              dateModified: project.value.updated_at,
              inLanguage: 'id',
              author: { '@id': `${siteOrigin}/#person` },
              ...(project.value.live_url ? { sameAs: project.value.live_url } : {}),
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Beranda', item: `${siteOrigin}/` },
                { '@type': 'ListItem', position: 2, name: 'Karya', item: `${siteOrigin}/karya` },
                { '@type': 'ListItem', position: 3, name: project.value.title, item: url.value },
              ],
            },
          ],
        }),
      }]
    : [],
}))

const root = ref<HTMLElement | null>(null)
useSiteMotion(root, ({ gsap, reduced }) => {
  if (reduced) return
  const figures = gsap.utils.toArray<HTMLElement>('.case-hero__figure', root.value!)
  gsap.from(figures, { yPercent: 18, rotation: (i: number) => (i % 2 ? 8 : -8), autoAlpha: 0, duration: 1.2, ease: 'expo.out', stagger: 0.15, delay: 0.2 })
})
</script>

<template>
  <main v-if="project" id="main" ref="root">
    <article>
      <section class="case-hero">
        <div class="case-hero__text">
          <NuxtLink to="/karya" class="case-hero__back label">
            <ArrowLeft :stroke-width="2.5" aria-hidden="true" />
            Kembali ke karya
          </NuxtLink>
          <p class="kicker" data-reveal>
            {{ categoryLabel(project.category) }} oleh Hygione Darriyan.
          </p>
          <h1 class="title-l case-hero__title" data-reveal>
            {{ project.title }}
          </h1>
          <p class="p-l case-hero__lede" data-reveal>
            {{ excerpt(project.description, 220) }}
          </p>
          <div class="case-hero__actions" data-reveal="el">
            <SiteButton label="Buka live demo" :href="project.live_url" icon="external" />
            <SiteButton v-if="project.repo_url" label="Lihat repository" :href="project.repo_url" icon="external" variant="ink" />
          </div>

          <dl class="facts" data-reveal="el">
            <div>
              <dt class="label">
                Kategori
              </dt>
              <dd>{{ categoryLabel(project.category) }}</dd>
            </div>
            <div v-if="project.tech_stack?.length">
              <dt class="label">
                Tech stack
              </dt>
              <dd>
                <ul class="tags">
                  <li v-for="tech in project.tech_stack" :key="tech">
                    {{ tech }}
                  </li>
                </ul>
              </dd>
            </div>
            <div v-if="project.style_tags?.length">
              <dt class="label">
                Pendekatan
              </dt>
              <dd>
                <ul class="tags tags--alt">
                  <li v-for="tag in project.style_tags" :key="tag">
                    <NuxtLink :to="{ path: '/karya', query: { gaya: tag } }">
                      {{ tag }}
                    </NuxtLink>
                  </li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>

        <div :class="['case-hero__panel', `panel--${color}`]">
          <figure class="case-hero__figure frame frame--paper">
            <img :src="project.thumbnail_url" :alt="`Tampilan utama ${project.title}`" fetchpriority="high" decoding="async">
            <figcaption class="label">
              Tampilan utama
            </figcaption>
          </figure>
          <figure v-if="previewImage || previewIsVideo" class="case-hero__figure case-hero__figure--second frame frame--paper">
            <video v-if="previewIsVideo" :src="project.preview_media_url!" autoplay muted loop playsinline aria-label="Detail interaksi" />
            <img v-else :src="previewImage!" :alt="`Detail interaksi ${project.title}`" loading="lazy" decoding="async">
            <figcaption class="label">
              Detail interaksi
            </figcaption>
          </figure>
          <a :href="project.live_url" target="_blank" rel="noopener noreferrer" class="sticker sticker--paper case-hero__sticker" style="--sticker-rotate: 8deg">
            Live demo ↗<span class="sr-only"> (tab baru)</span>
          </a>
        </div>
      </section>

      <section v-if="project.description_html" class="case-study section wrap" aria-labelledby="case-title">
        <h2 id="case-title" class="title-xl case-study__title" data-scroll-reveal>
          Case study <span class="alt">{{ project.title }}</span>
        </h2>
        <!-- description_html is sanitized server-side (utils/markdown.ts) -->
        <div class="prose case-study__body" v-html="project.description_html" />
      </section>
    </article>

    <nav v-if="next" class="next theme-dark" data-nav-theme="dark" aria-label="Project berikutnya">
      <NuxtLink :to="`/project/${next.slug}`" class="next__link wrap" data-cursor="Project berikutnya →">
        <span class="kicker">Berikutnya</span>
        <span class="title-xl next__title">{{ next.title }}</span>
        <img :src="next.thumbnail_url" alt="" class="next__img" loading="lazy" decoding="async">
      </NuxtLink>
      <div class="next__all">
        <SiteArrowLink label="Semua karya" to="/karya" />
      </div>
    </nav>
  </main>
</template>

<style scoped>
.case-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100svh;
}

.case-hero__text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: calc(1.25 * var(--u));
  padding: calc(8 * var(--u)) var(--gutter) calc(4 * var(--u));
}

.case-hero__back {
  display: inline-flex;
  align-items: center;
  gap: calc(0.4 * var(--u));
  margin-bottom: var(--u);
}

.case-hero__back svg {
  width: calc(1 * var(--u));
  height: calc(1 * var(--u));
  transition: translate 0.4s var(--ease-site);
}

.case-hero__back:hover svg {
  translate: -0.3em 0;
}

.case-hero__title {
  max-width: 12ch;
  overflow-wrap: anywhere;
}

.case-hero__lede {
  max-width: 34ch;
}

.case-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: calc(0.75 * var(--u));
}

.facts {
  display: grid;
  gap: calc(1 * var(--u));
  width: 100%;
  max-width: calc(32 * var(--u));
  margin-top: var(--u);
  padding-top: calc(1.25 * var(--u));
  border-top: 1px solid var(--c-line);
}

.facts > div {
  display: grid;
  grid-template-columns: calc(8 * var(--u)) 1fr;
  gap: var(--u);
}

.facts dt {
  padding-top: 0.25em;
  color: var(--c-ink-soft);
}

.facts dd {
  margin: 0;
  font-family: var(--font-serif);
  font-size: var(--fs-p-l);
  line-height: 1.1;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: calc(0.35 * var(--u));
}

.tags li {
  padding: calc(0.3 * var(--u)) calc(0.55 * var(--u));
  background: var(--c-ink);
  color: var(--c-paper);
  font-family: var(--font-grotesk);
  font-size: var(--fs-p-xs);
  font-weight: 700;
  text-transform: uppercase;
}

.tags--alt li {
  padding: 0;
  background: none;
  color: inherit;
}

.tags--alt a {
  display: inline-block;
  padding: calc(0.3 * var(--u)) calc(0.55 * var(--u));
  border: 1.5px solid var(--c-ink);
  font-family: var(--font-serif);
  font-size: var(--fs-p-m);
  font-weight: 400;
  text-transform: none;
}

.tags--alt a:hover {
  background: var(--c-signal);
  border-color: var(--c-signal);
  color: var(--c-white);
}

.case-hero__panel {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: calc(2 * var(--u));
  height: 100svh;
  padding: calc(6 * var(--u)) calc(3 * var(--u)) calc(3 * var(--u));
  overflow: hidden;
  background: var(--panel);
}

.panel--signal { --panel: var(--c-signal); }
.panel--violet { --panel: var(--c-violet); }
.panel--pink { --panel: var(--c-pink); }
.panel--cyan { --panel: var(--c-cyan); }
.panel--amber { --panel: var(--c-amber); }

.frame--paper {
  --frame: var(--c-paper);
  padding: calc(0.6 * var(--u)) calc(0.6 * var(--u)) calc(0.4 * var(--u));
}

.case-hero__figure {
  width: 100%;
  max-width: calc(36 * var(--u));
  margin: 0;
  rotate: -2deg;
  box-shadow: 0 calc(1 * var(--u)) calc(3 * var(--u)) rgba(11, 16, 32, 0.25);
}

.case-hero__figure img,
.case-hero__figure video {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  object-position: top center;
  background: var(--c-ink);
}

.case-hero__figure figcaption {
  padding-top: calc(0.4 * var(--u));
  color: var(--c-ink-soft);
}

.case-hero__figure--second {
  max-width: calc(26 * var(--u));
  align-self: flex-end;
  margin-top: calc(-6 * var(--u));
  rotate: 3deg;
}

.case-hero__sticker {
  position: absolute;
  top: calc(6 * var(--u));
  right: calc(3 * var(--u));
}

.case-study {
  display: grid;
  grid-template-columns: 1fr minmax(0, calc(44 * var(--u)));
  gap: calc(3 * var(--u)) var(--gutter);
  align-items: start;
}

.case-study__title {
  position: sticky;
  top: calc(7 * var(--u));
}

.case-study__title .alt {
  display: block;
  margin-top: 0.1em;
  overflow-wrap: anywhere;
  line-height: 0.9;
}

.next {
  padding-block: calc(7 * var(--u)) calc(5 * var(--u));
  overflow: hidden;
}

.next__link {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--u);
  text-align: center;
}

.next__title {
  position: relative;
  z-index: 1;
  max-width: 16ch;
  transition: color 0.4s ease;
}

.next__img {
  position: absolute;
  top: 50%;
  left: 50%;
  width: calc(22 * var(--u));
  aspect-ratio: 16 / 10;
  object-fit: cover;
  border: calc(0.5 * var(--u)) solid var(--c-paper);
  translate: -50% -40%;
  rotate: -6deg;
  scale: 0.6;
  opacity: 0;
  transition: scale 0.6s var(--ease-site), opacity 0.4s ease, rotate 0.6s var(--ease-site);
}

@media (hover: hover) and (pointer: fine) {
  .next__link:hover .next__img {
    scale: 1;
    opacity: 1;
    rotate: 4deg;
  }

  .next__link:hover .next__title {
    color: var(--c-cyan);
  }
}

.next__all {
  display: flex;
  justify-content: center;
  margin-top: calc(3 * var(--u));
}

.next__all :deep(.arrow-link) {
  color: var(--c-paper);
}

@media (max-width: 991px) {
  .case-hero {
    grid-template-columns: 1fr;
  }

  .case-hero__panel {
    position: relative;
    height: auto;
    min-height: 70svh;
    padding-top: calc(4 * var(--u));
  }

  .case-study {
    grid-template-columns: 1fr;
  }

  .case-study__title {
    position: static;
  }
}

@media (max-width: 767px) {
  .case-hero__text {
    padding-top: calc(7 * var(--u));
  }

  .case-hero__panel {
    padding-inline: var(--gutter);
  }

  .case-hero__figure--second {
    margin-top: calc(-2 * var(--u));
  }

  .facts > div {
    grid-template-columns: 1fr;
    gap: calc(0.4 * var(--u));
  }
}
</style>
