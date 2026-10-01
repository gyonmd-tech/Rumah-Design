<script setup lang="ts">
defineProps<{ items: ReadonlyArray<{ question: string, answer: string }> }>()
</script>

<template>
  <div class="faq" data-scroll-group>
    <details v-for="item in items" :key="item.question" class="faq__item" data-scroll-reveal="el">
      <summary class="faq__q">
        <span class="title-xs">{{ item.question }}</span>
        <span class="faq__icon" aria-hidden="true" />
      </summary>
      <p class="faq__a p-m muted">
        {{ item.answer }}
      </p>
    </details>
  </div>
</template>

<style scoped>
.faq {
  border-top: 1px solid var(--c-line);
}

.faq__item {
  border-bottom: 1px solid var(--c-line);
}

.faq__q {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--gutter);
  padding-block: calc(1.4 * var(--u));
  cursor: pointer;
  list-style: none;
}

.faq__q::-webkit-details-marker {
  display: none;
}

.faq__q .title-xs {
  text-transform: none;
  font-weight: 700;
  letter-spacing: -0.03em;
}

.faq__icon {
  position: relative;
  flex: none;
  width: calc(2 * var(--u));
  height: calc(2 * var(--u));
  background: var(--c-signal);
  transition: rotate 0.5s var(--ease-site), background-color 0.3s ease;
}

.faq__icon::before,
.faq__icon::after {
  content: '';
  position: absolute;
  inset: 50% 25% auto;
  height: 2px;
  margin-top: -1px;
  background: var(--c-white);
}

.faq__icon::after {
  rotate: 90deg;
}

.faq__item[open] .faq__icon {
  rotate: 135deg;
  background: var(--c-pink);
}

.faq__a {
  max-width: 60ch;
  padding-bottom: calc(1.5 * var(--u));
}
</style>
