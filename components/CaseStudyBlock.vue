<script setup lang="ts">
defineProps<{ html: string }>()
</script>

<template>
  <div v-if="html" class="case-study" v-html="html" />
  <p v-else class="text-muted">Case study untuk project ini sedang disiapkan.</p>
</template>

<style scoped>
.case-study :deep(h2),
.case-study :deep(h3) {
  margin-top: 2.5em;
  margin-bottom: 0.65em;
  font-size: clamp(1.55rem, 3vw, 2.5rem);
  line-height: 1;
  letter-spacing: -0.04em;
}
.case-study :deep(h3) { font-size: clamp(1.25rem, 2.2vw, 1.8rem); }
.case-study :deep(p),
.case-study :deep(li) { font-size: clamp(1.05rem, 1.6vw, 1.25rem); line-height: 1.75; }
.case-study :deep(p) { margin-block: 1.2em; }
.case-study :deep(ul),
.case-study :deep(ol) { margin: 1.25em 0; padding-left: 1.4em; }
.case-study :deep(ul) { list-style: disc; }
.case-study :deep(ol) { list-style: decimal; }
.case-study :deep(blockquote) { margin: 2em 0; border-left: 3px solid #ff4d00; padding-left: 1.25em; color: #6c6b64; }
.case-study :deep(a) { color: #ff4d00; text-decoration: underline; text-underline-offset: 0.2em; }
.case-study :deep(code) { background: #dedbd2; padding: 0.15em 0.35em; font-size: 0.9em; }
.case-study :deep(pre) { overflow-x: auto; background: #171714; color: white; padding: 1rem; }
.case-study :deep(hr) { margin: 3rem 0; border: 0; border-top: 1px solid #d8d5cc; }
</style>
