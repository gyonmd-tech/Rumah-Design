<script setup lang="ts">
defineProps<{ html: string }>()
</script>

<template>
  <div v-if="html" class="case-study-content" v-html="html" />
  <p v-else class="font-mono text-sm text-mute">Case study untuk project ini sedang disiapkan.</p>
</template>

<style scoped>
.case-study-content {
  word-break: break-word;
  overflow-wrap: break-word;
}

.case-study-content :deep(h2) {
  font-family: var(--font-display);
  margin-top: 2em;
  margin-bottom: 0.6em;
  font-size: clamp(1.4rem, 2vw + 0.8rem, 2.5rem);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: var(--color-ink);
}

.case-study-content :deep(h3) {
  font-family: var(--font-display);
  margin-top: 1.6em;
  margin-bottom: 0.45em;
  font-size: clamp(1.15rem, 1.4vw + 0.75rem, 1.8rem);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--color-ink);
}

.case-study-content :deep(p),
.case-study-content :deep(li) {
  font-family: var(--font-sans);
  font-size: clamp(0.95rem, 0.35vw + 0.85rem, 1.15rem);
  line-height: 1.7;
  color: var(--color-ink);
}

.case-study-content :deep(p) {
  margin-block: 1.2em;
}

.case-study-content :deep(ul),
.case-study-content :deep(ol) {
  margin: 1.2em 0;
  padding-left: 1.25em;
}

.case-study-content :deep(ul) { list-style: square; }
.case-study-content :deep(ol) { list-style: decimal; }

.case-study-content :deep(blockquote) {
  margin: 1.8em 0;
  border-left: 3px solid var(--color-signal);
  padding-left: 1.2em;
  color: var(--color-mute);
  font-style: italic;
  background: rgba(20, 18, 15, 0.02);
  padding-block: 0.6em;
  border-radius: 0 0.5rem 0.5rem 0;
}

.case-study-content :deep(a) {
  color: var(--color-signal);
  text-decoration: underline;
  text-underline-offset: 0.25em;
  font-weight: 500;
  word-break: break-all;
}

.case-study-content :deep(code) {
  font-family: var(--font-mono);
  background: rgba(20, 18, 15, 0.07);
  padding: 0.15em 0.4em;
  font-size: 0.85em;
  border-radius: 4px;
  word-break: break-word;
}

.case-study-content :deep(pre) {
  overflow-x: auto;
  background: var(--color-void);
  color: var(--color-paper);
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  margin: 1.4em 0;
  max-width: 100%;
}

.case-study-content :deep(pre code) {
  background: transparent;
  padding: 0;
  color: inherit;
  font-size: 0.85rem;
}

.case-study-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 1rem;
  margin-block: 1.5rem;
}

.case-study-content :deep(table) {
  width: 100%;
  overflow-x: auto;
  display: block;
  border-collapse: collapse;
  margin-block: 1.5rem;
}

.case-study-content :deep(hr) {
  margin: 2.5rem 0;
  border: 0;
  border-top: 1px solid var(--color-line-light);
}
</style>
