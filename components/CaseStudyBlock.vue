<script setup lang="ts">
defineProps<{ html: string }>()
</script>

<template>
  <div v-if="html" class="case-study-content" v-html="html" />
  <p v-else class="font-mono text-sm text-mute">Case study untuk project ini sedang disiapkan.</p>
</template>

<style scoped>
.case-study-content :deep(h2) {
  font-family: var(--font-display);
  margin-top: 2.5em;
  margin-bottom: 0.75em;
  font-size: clamp(1.8rem, 2.5vw, 2.75rem);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: var(--color-ink);
}

.case-study-content :deep(h3) {
  font-family: var(--font-display);
  margin-top: 2em;
  margin-bottom: 0.5em;
  font-size: clamp(1.35rem, 1.8vw, 1.9rem);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--color-ink);
}

.case-study-content :deep(p),
.case-study-content :deep(li) {
  font-family: var(--font-sans);
  font-size: clamp(1.05rem, 0.4vw + 0.95rem, 1.2rem);
  line-height: 1.75;
  color: var(--color-ink);
}

.case-study-content :deep(p) {
  margin-block: 1.4em;
}

.case-study-content :deep(ul),
.case-study-content :deep(ol) {
  margin: 1.5em 0;
  padding-left: 1.5em;
}

.case-study-content :deep(ul) { list-style: square; }
.case-study-content :deep(ol) { list-style: decimal; }

.case-study-content :deep(blockquote) {
  margin: 2.25em 0;
  border-left: 3px solid var(--color-signal);
  padding-left: 1.5em;
  color: var(--color-mute);
  font-style: italic;
}

.case-study-content :deep(a) {
  color: var(--color-signal);
  text-decoration: underline;
  text-underline-offset: 0.25em;
  font-weight: 500;
}

.case-study-content :deep(code) {
  font-family: var(--font-mono);
  background: rgba(20, 18, 15, 0.07);
  padding: 0.15em 0.4em;
  font-size: 0.88em;
  border-radius: 3px;
}

.case-study-content :deep(pre) {
  overflow-x: auto;
  background: var(--color-void);
  color: var(--color-paper);
  padding: 1.25rem;
  border-radius: 4px;
  margin: 1.5em 0;
}

.case-study-content :deep(hr) {
  margin: 3.5rem 0;
  border: 0;
  border-top: 1px solid var(--color-line-light);
}
</style>
