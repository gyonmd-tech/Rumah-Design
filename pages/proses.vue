<script setup lang="ts">
import { WORK_STEPS } from '~/utils/portfolio-content'

usePortfolioPageSeo({
  title: 'Proses Kerja Desain & Pengembangan Web',
  description: 'Kenali proses kolaborasi Hygione Darriyan, dari brief, user flow dan prototype hingga implementasi, pengujian, deployment, serta serah terima.',
  path: '/proses',
})

const COLORS = ['signal', 'pink', 'cyan', 'amber', 'violet'] as const
const active = ref(0)

const root = ref<HTMLElement | null>(null)
useSiteMotion(root, ({ ScrollTrigger }) => {
  const steps = root.value!.querySelectorAll<HTMLElement>('.step')
  const triggers = [...steps].map((step, index) => ScrollTrigger.create({
    trigger: step,
    start: 'top 55%',
    end: 'bottom 55%',
    onToggle: (self) => {
      if (self.isActive) active.value = index
    },
  }))
  return () => triggers.forEach(trigger => trigger.kill())
})
</script>

<template>
  <main id="main" ref="root">
    <header class="process-hero wrap">
      <p class="kicker" data-reveal>
        Proses / Dari kebutuhan ke implementasi
      </p>
      <h1 class="title-xxl process-hero__title" data-reveal="chars">
        Langkah yang jelas, <span class="alt">ruang untuk bereksplorasi.</span>
      </h1>
      <p class="p-l process-hero__intro" data-reveal>
        Setiap produk punya tantangan berbeda. Saya menggunakan tahapan yang bisa ditinjau bersama agar keputusan desain dan teknis tetap terhubung dengan tujuan awal.
      </p>
      <SiteArrowLink label="Lihat tahapannya" to="#tahapan" direction="down" />
    </header>

    <section id="tahapan" class="steps" aria-labelledby="steps-title">
      <h2 id="steps-title" class="sr-only">
        Bagaimana kolaborasinya berjalan
      </h2>
      <div class="steps__list">
        <p class="kicker steps__kicker" data-scroll-reveal>
          Bagaimana kolaborasinya berjalan
        </p>
        <article v-for="(step, index) in WORK_STEPS" :key="step.title" class="step" :data-active="active === index || undefined">
          <span class="step__num">{{ String(index + 1).padStart(2, '0') }}</span>
          <h3 class="title-m">
            {{ step.title }}
          </h3>
          <p class="p-m">
            {{ step.detail }}
          </p>
          <p class="step__output">
            <span class="label">Yang dibawa ke tahap berikutnya:</span>
            <span class="step__output-text">{{ step.output }}</span>
          </p>
        </article>
      </div>
      <div :class="['steps__panel', `panel--${COLORS[active % COLORS.length]}`]" aria-hidden="true">
        <span class="steps__big" :key="active">{{ String(active + 1).padStart(2, '0') }}</span>
        <span class="steps__caption title-s">{{ WORK_STEPS[active].title }}</span>
        <span class="steps__progress">
          <span v-for="(_, index) in WORK_STEPS" :key="index" :class="{ on: index <= active }" />
        </span>
      </div>
    </section>

    <section class="notes section wrap" aria-label="Komunikasi dan scope" data-scroll-group>
      <article class="note frame frame--amber" data-scroll-reveal="el">
        <h2 class="title-s">
          Komunikasi yang bisa ditindaklanjuti.
        </h2>
        <p class="p-m">
          Masukan paling membantu menjelaskan masalah dan konteksnya: bagian mana yang terasa membingungkan, siapa yang terdampak, serta hasil yang diharapkan. Catatan dikumpulkan pada checkpoint yang disepakati supaya setiap revisi punya arah.
        </p>
      </article>
      <article class="note frame frame--cyan" data-scroll-reveal="el">
        <h2 class="title-s">
          Scope boleh berkembang, asal jelas.
        </h2>
        <p class="p-m">
          Ide baru sering muncul ketika prototype mulai bisa dicoba. Kita menilai apakah perubahan diperlukan untuk tujuan awal atau sebaiknya masuk iterasi berikutnya. Dampaknya terhadap waktu dan pekerjaan dibahas sebelum dikerjakan.
        </p>
      </article>
    </section>

    <section class="after section theme-dark" data-nav-theme="dark" aria-labelledby="after-title">
      <div class="wrap after__inner">
        <h2 id="after-title" class="title-xl" data-scroll-reveal>
          Apa yang terjadi <span class="alt">setelah rilis?</span>
        </h2>
        <p class="p-m muted" data-scroll-reveal>
          Serah terima mencakup hasil desain atau kode sesuai pekerjaan, cara menjalankan produk, dan konfigurasi yang perlu diketahui. Kepemilikan akun layanan serta akses deployment ditentukan sejak awal. Pemantauan, perbaikan lanjutan, dan pengembangan fitur berikutnya dapat dibahas sebagai scope terpisah.
        </p>
        <div class="after__links">
          <SiteButton label="Pilih layanan yang sesuai" to="/layanan" variant="pink" />
          <SiteButton label="Lihat implementasinya dalam karya" to="/karya" variant="light" />
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.process-hero {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  gap: calc(1.5 * var(--u));
  min-height: 92svh;
  padding-top: calc(9 * var(--u));
  padding-bottom: calc(4 * var(--u));
}

.process-hero__title {
  max-width: 12ch;
  font-size: var(--fs-xl);
}

.process-hero__title .alt {
  display: block;
  margin-top: 0.08em;
  line-height: 0.9;
  color: var(--c-signal);
}

.process-hero__intro {
  max-width: 44ch;
}

.steps {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
}

.steps__list {
  padding: calc(4 * var(--u)) var(--gutter) calc(10 * var(--u));
}

.steps__kicker {
  margin-bottom: calc(2 * var(--u));
}

.step {
  display: grid;
  gap: var(--u);
  min-height: 70svh;
  align-content: center;
  padding-block: calc(3 * var(--u));
  border-top: 1px solid var(--c-line);
  opacity: 0.35;
  transition: opacity 0.5s ease;
}

.step[data-active] {
  opacity: 1;
}

.step .p-m {
  max-width: 42ch;
}

.step__num {
  font-family: var(--font-serif);
  font-size: var(--fs-s);
  line-height: 0.85;
  color: var(--c-signal);
}

.step__output {
  display: grid;
  gap: calc(0.35 * var(--u));
  max-width: 42ch;
  padding: var(--u);
  background: var(--c-paper-deep);
}

.step__output-text {
  font-family: var(--font-serif);
  font-size: var(--fs-p-l);
  line-height: 1.1;
}

.steps__panel {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: calc(1.5 * var(--u));
  height: 100svh;
  background: var(--panel);
  color: var(--panel-fg);
  transition: background-color 0.6s var(--ease-site), color 0.6s ease;
}

.panel--signal { --panel: var(--c-signal); --panel-fg: var(--c-white); }
.panel--violet { --panel: var(--c-violet); --panel-fg: var(--c-white); }
.panel--pink { --panel: var(--c-pink); --panel-fg: var(--c-ink); }
.panel--cyan { --panel: var(--c-cyan); --panel-fg: var(--c-ink); }
.panel--amber { --panel: var(--c-amber); --panel-fg: var(--c-ink); }

.steps__big {
  font-family: var(--font-serif);
  font-size: calc(20 * var(--u));
  line-height: 0.75;
  animation: big-in 0.7s var(--ease-site) both;
}

@keyframes big-in {
  from {
    transform: translateY(30%) rotate(-8deg);
    opacity: 0;
  }
}

.steps__caption {
  max-width: 12ch;
  text-align: center;
}

.steps__progress {
  display: flex;
  gap: calc(0.4 * var(--u));
}

.steps__progress span {
  width: calc(2 * var(--u));
  height: calc(0.35 * var(--u));
  background: currentColor;
  opacity: 0.25;
  transition: opacity 0.4s ease;
}

.steps__progress span.on {
  opacity: 1;
}

.notes {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: calc(2.5 * var(--u));
}

.note {
  display: grid;
  align-content: start;
  gap: var(--u);
  padding: calc(2 * var(--u));
  color: var(--frame-fg);
  rotate: -1.5deg;
}

.note:nth-child(2) {
  rotate: 1.5deg;
  margin-top: calc(3 * var(--u));
}

.after__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(1.5 * var(--u));
  text-align: center;
}

.after__inner .title-xl {
  max-width: 13ch;
}

.after__inner .p-m {
  max-width: 50ch;
}

.after__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: calc(0.75 * var(--u));
}

@media (max-width: 991px) {
  .steps {
    grid-template-columns: 1fr;
  }

  .steps__panel {
    display: none;
  }

  .step {
    min-height: 0;
    opacity: 1;
  }

  .notes {
    grid-template-columns: 1fr;
  }

  .note:nth-child(2) {
    margin-top: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .steps__big {
    animation: none;
  }
}
</style>
