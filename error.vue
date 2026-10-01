<script setup lang="ts">
const props = defineProps<{ error: { statusCode?: number, statusMessage?: string } }>()
const code = computed(() => props.error.statusCode ?? 500)
useSeoMeta({ robots: 'noindex, nofollow', title: () => `Error ${code.value} — Hygione Darriyan` })
useHead({ htmlAttrs: { class: 'site-root' } })
</script>

<template>
  <div class="site error-page">
    <main class="error-page__inner wrap">
      <span class="sticker sticker--pink" style="--sticker-rotate: -8deg">Error {{ code }}</span>
      <h1 class="title-xl">
        <template v-if="code === 404">
          Halaman <span class="alt">tidak ditemukan.</span>
        </template>
        <template v-else>
          Ada sesuatu <span class="alt">yang belum beres.</span>
        </template>
      </h1>
      <p v-if="error.statusMessage" class="p-m muted">
        {{ error.statusMessage }}
      </p>
      <SiteButton label="Kembali ke beranda" href="/" />
    </main>
  </div>
</template>

<style scoped>
.error-page__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: calc(1.5 * var(--u));
  min-height: 100svh;
  text-align: center;
}

.error-page__inner .title-xl {
  max-width: 12ch;
}

.error-page__inner .alt {
  display: block;
  margin-top: 0.08em;
  line-height: 0.9;
  color: var(--c-signal);
}
</style>
