<script setup lang="ts">
import { responsiveImage } from '~/utils/image'
import type { ProjectSummary } from '~/types/database.types'
import { SERVICES, SERVICE_SHORT_NAMES } from '~/utils/portfolio-content'

const props = defineProps<{ projects: ProjectSummary[] }>()

const cards = computed(() => SERVICES.map((service, index) => {
  const related = props.projects.find(project => (service.projectSlugs as readonly string[]).includes(project.slug))
    ?? props.projects[index]
  return {
    slug: service.slug,
    title: SERVICE_SHORT_NAMES[service.slug] ?? service.name,
    short: service.short,
    image: related?.thumbnail_url ?? null,
    imageAlt: related ? `Contoh karya: ${related.title}` : '',
    color: (['signal', 'pink', 'cyan'] as const)[index % 3],
  }
}))
</script>

<template>
  <ul class="services" data-scroll-group data-collage>
    <li v-for="(card, index) in cards" :key="card.slug" class="services__item" data-collage-item :style="{ '--tilt': ['-4deg', '2.5deg', '-2deg'][index % 3] }">
      <NuxtLink
        :to="`/layanan/${card.slug}`"
        :class="['service', 'frame', `frame--${card.color}`]"
        data-cursor="Lihat layanan →"
        data-scroll-reveal="el"
        data-collage-inner
      >
        <span class="service__media">
          <img v-if="card.image" v-bind="responsiveImage(card.image, '(min-width: 768px) 22vw, 80vw')" :alt="card.imageAlt" loading="lazy" decoding="async">
        </span>
        <div class="service__body">
          <h3 class="title-m service__title">{{ card.title }}</h3>
          <span class="service__short">{{ card.short }}</span>
        </div>
      </NuxtLink>
    </li>
  </ul>
</template>

<style scoped>
.services {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: calc(2 * var(--u));
  width: min(100%, calc(66 * var(--u)));
  margin-inline: auto;
}

.service {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: var(--frame-fg);
  rotate: var(--tilt);
}

.service__media {
  display: block;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: var(--c-ink);
}

.service__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.service__body {
  display: flex;
  flex-direction: column;
  gap: calc(0.5 * var(--u));
  padding: calc(1.1 * var(--u)) calc(0.25 * var(--u)) calc(0.35 * var(--u));
}

.service__short {
  font-family: var(--font-serif);
  font-size: var(--fs-p-l);
  line-height: 1.05;
  letter-spacing: -0.01em;
}

@media (max-width: 767px) {
  .services {
    grid-template-columns: 1fr;
    gap: calc(2.5 * var(--u));
    max-width: calc(19 * var(--u));
  }
}
</style>
