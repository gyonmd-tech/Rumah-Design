<script setup lang="ts">
usePortfolioPageSeo({
  title: 'Hubungi Saya',
  description: 'Mulai diskusi proyek baru, konsultasi arsitektur frontend, atau eksplorasi kolaborasi produk digital dengan Hygione Darriyan.',
  path: '/contact',
})

const siteSettings = usePublicSiteSettings()
const config = useRuntimeConfig()
const email = computed(() => siteSettings.value.general.contact_email || 'paroarro07@gmail.com')
const whatsapp = computed(() => String(config.public.whatsappNumber || '').replace(/\D/g, ''))

const SERVICES = [
  'Landing Page Interaktif',
  'Web App / SaaS Antarmuka',
  'Design System & Tokens',
  'Frontend Architecture',
  'UI/UX & Visual Design',
  'Fullstack Development & Integrasi API',
  'Audit UI & Performa Web',
]
const TIMELINES = ['1-2 Minggu (Cepat)', '3-4 Minggu (Standar)', '1-2 Bulan (Komprehensif)', 'Fleksibel / Diskusi Lanjut']

const CONTACT_FAQS = [
  { question: 'Bagaimana alur kerja sama proyek di Hygione Darriyan?', answer: 'Saya memulai dengan sesi alignment singkat (memahami tujuan bisnis & referensi visual), menyusun prototipe interaktif fungsional, melakukan iterasi cepat, lalu mengeksekusi kode frontend produksi hingga deploy.' },
  { question: 'Apakah bisa mengerjakan frontend saja dari file Figma yang sudah ada?', answer: 'Sangat bisa. Saya mengonversi file desain Figma Anda menjadi arsitektur kode frontend yang rapi (Nuxt 3/Vue/React), responsif di seluruh breakpoint perangkat, dan dilengkapi animasi micro-interaction yang halus.' },
  { question: 'Berapa perkiraan waktu pengerjaan untuk satu proyek?', answer: 'Estimasi mengikuti jumlah halaman atau fitur, kompleksitas integrasi, dan kesiapan konten. Saya akan membahas jadwal setelah kebutuhan dan batas pekerjaan dipahami.' },
  { question: 'Bagaimana model komunikasi dan pelaporan progres?', answer: 'Kanal komunikasi dan checkpoint ditentukan saat awal kolaborasi. Masukan dikumpulkan per tahap, dengan tautan desain atau versi yang bisa dicoba bila sudah tersedia.' },
]

const form = reactive({ service: SERVICES[0], timeline: TIMELINES[3], name: '', from: '', brief: '' })
const status = ref('')
const emailCopied = ref(false)

const subject = computed(() => `[Project Inquiry] ${form.service} — ${form.name.trim() || 'Diskusi Proyek'}`)
const body = computed(() => [
  'Halo Hygione Darriyan,',
  '',
  'Saya tertarik untuk berdiskusi mengenai proyek digital berikut:',
  '',
  `- Kategori Layanan: ${form.service}`,
  `- Estimasi Timeline: ${form.timeline}`,
  `- Nama / Perusahaan: ${form.name.trim() || '-'}`,
  `- Email Kontak: ${form.from.trim() || '-'}`,
  '',
  'Ringkasan Kebutuhan / Brief:',
  form.brief.trim() || '(Belum diisi)',
  '',
  'Terima kasih!',
].join('\n'))
const mailto = computed(() => `mailto:${email.value}?subject=${encodeURIComponent(subject.value)}&body=${encodeURIComponent(body.value)}`)
const whatsappUrl = computed(() => whatsapp.value
  ? `https://wa.me/${whatsapp.value}?text=${encodeURIComponent(`Halo Hygione Darriyan, saya ingin konsultasi proyek "${form.service}". Nama saya ${form.name.trim() || 'klien'}.`)}`
  : '')

function flash(message: string) {
  status.value = message
  setTimeout(() => (status.value = ''), 3200)
}

function openEmail() {
  window.location.href = mailto.value
}

async function copyBrief() {
  const text = [
    '[PROJECT INQUIRY — HYGIONE DARRIYAN]',
    `Kategori: ${form.service}`,
    `Timeline: ${form.timeline}`,
    `Nama: ${form.name.trim() || '-'}`,
    `Email: ${form.from.trim() || '-'}`,
    `Brief: ${form.brief.trim() || '-'}`,
  ].join('\n')
  try {
    await navigator.clipboard.writeText(text)
    flash('Ringkasan brief proyek berhasil disalin ke clipboard!')
  }
  catch (error) {
    flash(`Gagal menyalin brief: ${(error as Error).message}`)
  }
}

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(email.value)
    emailCopied.value = true
    flash('Alamat email berhasil disalin!')
    setTimeout(() => (emailCopied.value = false), 2000)
  }
  catch (error) {
    flash(`Gagal menyalin email: ${(error as Error).message}`)
  }
}

const root = ref<HTMLElement | null>(null)
useSiteMotion(root, ({ gsap, reduced }) => {
  if (reduced) return
  gsap.from('.contact-hero__sticker', { scale: 0, rotation: -40, duration: 1, ease: 'back.out(1.8)', delay: 0.7 })
})
</script>

<template>
  <main id="main" ref="root">
    <header class="contact-hero wrap">
      <span class="sticker sticker--pink contact-hero__sticker" style="--sticker-rotate: -8deg" aria-hidden="true">Menerima proyek pilihan</span>
      <p class="kicker" data-reveal>
        Diskusi Proyek & Kolaborasi
      </p>
      <h1 class="title-xl contact-hero__title" data-reveal="chars">
        Mari wujudkan ide digital <span class="alt">berikutnya bersama saya.</span>
      </h1>
      <p class="p-l contact-hero__intro" data-reveal>
        Ceritakan apa yang sedang Anda bangun, siapa penggunanya, dan bagian yang membutuhkan bantuan. Brief singkat sudah cukup untuk memulai pembicaraan tentang desain, frontend, atau fullstack development.
      </p>
      <div class="contact-hero__actions" data-reveal="el">
        <SiteButton label="Tulis email langsung" :href="`mailto:${email}`" icon="mail" variant="pink" />
        <SiteButton v-if="whatsappUrl" label="WhatsApp direct" :href="whatsappUrl" icon="external" />
        <SiteButton label="Isi brief singkat" to="#brief" icon="down" variant="ink" />
      </div>
    </header>

    <section id="brief" class="brief section theme-dark" data-nav-theme="dark" aria-labelledby="brief-title">
      <div class="wrap brief__grid">
        <div class="brief__intro">
          <p class="kicker" data-scroll-reveal>
            Step 1 · Pilih kebutuhan
          </p>
          <h2 id="brief-title" class="title-l" data-scroll-reveal>
            Apa yang ingin <span class="alt">Anda bangun?</span>
          </h2>

          <div class="card frame frame--amber" data-scroll-reveal="el">
            <p class="label">
              Ketersediaan kolaborasi
            </p>
            <p class="title-xs">
              Menerima proyek pilihan
            </p>
            <p class="p-s">
              Lokasi: Citayam, Kota Depok, Jawa Barat, Indonesia (GMT+7)<br>
              Waktu diskusi disepakati bersama
            </p>
            <div class="card__email">
              <span class="label">Email kontak</span>
              <a :href="`mailto:${email}`" class="card__address">{{ email }}</a>
              <SiteButton
                class="card__copy"
                :label="emailCopied ? 'Tersalin!' : 'Copy'"
                :icon="emailCopied ? 'check' : 'copy'"
                variant="ink"
                @click="copyEmail"
              />
            </div>
          </div>
        </div>

        <form class="brief__form" @submit.prevent="openEmail">
          <fieldset class="form-field">
            <legend class="label">
              Kategori layanan
            </legend>
            <div class="choices">
              <label v-for="item in SERVICES" :key="item" class="choice">
                <input v-model="form.service" type="radio" name="service" :value="item">
                <span>{{ item }}</span>
              </label>
            </div>
          </fieldset>

          <fieldset class="form-field">
            <legend class="label">
              Ekspektasi timeline
            </legend>
            <div class="choices">
              <label v-for="item in TIMELINES" :key="item" class="choice choice--alt">
                <input v-model="form.timeline" type="radio" name="timeline" :value="item">
                <span>{{ item }}</span>
              </label>
            </div>
          </fieldset>

          <div class="field-row">
            <label class="form-field">
              <span class="label">Nama / Brand</span>
              <input v-model="form.name" type="text" name="name" autocomplete="name" placeholder="misal: Alex Studio" maxlength="120">
            </label>
            <label class="form-field">
              <span class="label">Email Anda</span>
              <input v-model="form.from" type="email" name="email" autocomplete="email" placeholder="alex@studio.com" maxlength="160">
            </label>
          </div>

          <label class="form-field">
            <span class="label">Ringkasan kebutuhan / tautan Figma</span>
            <textarea v-model="form.brief" name="brief" rows="5" maxlength="2000" placeholder="Ceritakan gambaran singkat proyek, target audiens, atau sertakan tautan dokumen/Figma..." />
          </label>

          <p class="p-s muted">
            Tombol berikut membuka aplikasi email Anda dengan ringkasan brief. Pesan baru terkirim setelah Anda menekan kirim di aplikasi email.
          </p>

          <div class="brief__actions">
            <SiteButton label="Lanjutkan ke email" type="submit" icon="mail" variant="pink" />
            <SiteButton label="Salin brief" icon="copy" variant="light" @click="copyBrief" />
          </div>
          <p class="brief__status p-s" role="status" aria-live="polite">
            {{ status }}
          </p>
        </form>
      </div>
    </section>

    <section class="contact-faq section wrap" aria-labelledby="contact-faq-title">
      <div class="contact-faq__head">
        <p class="kicker" data-scroll-reveal>
          Seputar model kolaborasi & delivery
        </p>
        <h2 id="contact-faq-title" class="title-l" data-scroll-reveal>
          Hal yang sering <span class="alt">ditanyakan</span>
        </h2>
      </div>
      <SiteFaqList :items="CONTACT_FAQS" />
    </section>
  </main>
</template>

<style scoped>
.contact-hero {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: calc(1.5 * var(--u));
  min-height: 100svh;
  padding-block: calc(9 * var(--u)) calc(5 * var(--u));
  text-align: center;
}

.contact-hero__sticker {
  font-size: var(--fs-p-l);
}

.contact-hero__title {
  max-width: 13ch;
}

.contact-hero__title .alt {
  display: block;
  margin-top: 0.08em;
  line-height: 0.9;
  color: var(--c-signal);
}

.contact-hero__intro {
  max-width: 42ch;
}

.contact-hero__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: calc(0.75 * var(--u));
}

.brief__grid {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: calc(3 * var(--u)) calc(2 * var(--gutter));
  align-items: start;
}

.brief__intro {
  position: sticky;
  top: calc(7 * var(--u));
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: calc(1.25 * var(--u));
}

.card {
  display: grid;
  gap: calc(0.75 * var(--u));
  width: 100%;
  max-width: calc(26 * var(--u));
  margin-top: var(--u);
  padding: calc(1.5 * var(--u));
  color: var(--c-ink);
  rotate: -2deg;
}

.card__email {
  display: grid;
  gap: calc(0.35 * var(--u));
  padding-top: calc(0.75 * var(--u));
  border-top: 1px solid currentColor;
}

.card__address {
  font-family: var(--font-serif);
  font-size: var(--fs-p-l);
  line-height: 1.1;
  word-break: break-all;
}

.card__copy {
  justify-self: start;
}

.brief__form {
  display: grid;
  gap: calc(1.75 * var(--u));
}

.form-field {
  display: grid;
  gap: calc(0.6 * var(--u));
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.form-field legend {
  margin-bottom: calc(0.6 * var(--u));
  padding: 0;
}

.form-field input,
.form-field textarea {
  width: 100%;
  padding: calc(0.8 * var(--u)) var(--u);
  border: 2px solid var(--c-line);
  background: transparent;
  color: var(--c-paper);
  font-size: var(--fs-p-m);
  transition: border-color 0.25s ease;
}

.form-field input::placeholder,
.form-field textarea::placeholder {
  color: rgba(245, 242, 234, 0.45);
}

.form-field input:focus,
.form-field textarea:focus {
  border-color: var(--c-cyan);
  outline: none;
}

.form-field textarea {
  resize: vertical;
  min-height: calc(9 * var(--u));
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--u);
}

.choices {
  display: flex;
  flex-wrap: wrap;
  gap: calc(0.4 * var(--u));
}

.choice {
  position: relative;
  cursor: pointer;
}

.choice input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.choice span {
  display: inline-block;
  padding: calc(0.55 * var(--u)) calc(0.85 * var(--u));
  border: 2px solid var(--c-line);
  font-size: var(--fs-p-xs);
  font-weight: 800;
  line-height: 1;
  text-transform: uppercase;
  transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
}

.choice--alt span {
  font-family: var(--font-serif);
  font-size: var(--fs-p-m);
  font-weight: 400;
  text-transform: none;
}

.choice:hover span {
  border-color: var(--c-paper);
}

.choice input:checked + span {
  background: var(--c-cyan);
  border-color: var(--c-cyan);
  color: var(--c-ink);
}

.choice input:focus-visible + span {
  outline: 2px solid var(--c-cyan);
  outline-offset: 3px;
}

.brief__actions {
  display: flex;
  flex-wrap: wrap;
  gap: calc(0.75 * var(--u));
}

.brief__status {
  min-height: 1.5em;
  color: var(--c-cyan);
}

.contact-faq {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: calc(3 * var(--u)) var(--gutter);
}

.contact-faq__head {
  display: flex;
  flex-direction: column;
  gap: var(--u);
}

@media (max-width: 991px) {
  .brief__grid,
  .contact-faq {
    grid-template-columns: 1fr;
  }

  .brief__intro {
    position: relative;
    top: 0;
  }
}

@media (max-width: 767px) {
  .field-row {
    grid-template-columns: 1fr;
  }
}
</style>
