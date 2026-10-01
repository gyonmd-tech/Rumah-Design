<script setup lang="ts">
import type { ProjectSummary } from '~/types/database.types'
import { categoryLabel } from '~/utils/project'

const props = withDefaults(defineProps<{
  project: ProjectSummary
  ratio?: string
  eager?: boolean
}>(), {
  ratio: '4 / 3',
  eager: false,
})

const video = ref<HTMLVideoElement | null>(null)
const hasVideo = computed(() => isVideoUrl(props.project.preview_media_url))
const hoverImage = computed(() => !hasVideo.value && props.project.preview_media_url && props.project.preview_media_url !== props.project.thumbnail_url
  ? props.project.preview_media_url
  : null)

function play() {
  video.value?.play().catch(() => {})
}
function stop() {
  if (!video.value) return
  video.value.pause()
  video.value.currentTime = 0
}
</script>

<template>
  <NuxtLink
    :to="`/project/${project.slug}`"
    class="work-card"
    data-cursor="Lihat case →"
    @pointerenter="play"
    @pointerleave="stop"
    @focus="play"
    @blur="stop"
  >
    <span class="work-card__media" :style="{ aspectRatio: ratio }">
      <img
        :src="project.thumbnail_url"
        :alt="`Tampilan ${project.title}`"
        :loading="eager ? 'eager' : 'lazy'"
        decoding="async"
      >
      <img v-if="hoverImage" class="work-card__alt" :src="hoverImage" alt="" loading="lazy" decoding="async">
      <video
        v-if="hasVideo"
        ref="video"
        class="work-card__alt"
        :src="project.preview_media_url!"
        muted
        loop
        playsinline
        preload="none"
        aria-hidden="true"
      />
    </span>
    <div class="work-card__meta">
      <h3 class="title-s work-card__title">{{ project.title }}</h3>
      <span class="work-card__cat">{{ categoryLabel(project.category) }}</span>
    </div>
  </NuxtLink>
</template>

<style scoped>
.work-card {
  display: flex;
  flex-direction: column;
  gap: calc(1 * var(--u));
}

.work-card__media {
  position: relative;
  display: block;
  overflow: hidden;
  background: var(--c-paper-deep);
}

.work-card__media img,
.work-card__media video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  transition: scale 0.9s var(--ease-site), opacity 0.4s ease;
}

.work-card__alt {
  position: absolute;
  inset: 0;
  opacity: 0;
}

.work-card__meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(0.35 * var(--u));
  text-align: center;
}

.work-card__title {
  font-size: var(--fs-s);
}

.work-card__cat {
  font-family: var(--font-serif);
  font-size: var(--fs-p-l);
  line-height: 1;
  color: var(--c-ink-soft);
}

@media (hover: hover) and (pointer: fine) {
  .work-card:hover .work-card__alt,
  .work-card:focus-visible .work-card__alt {
    opacity: 1;
  }
}
</style>
