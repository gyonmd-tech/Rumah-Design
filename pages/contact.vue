<script setup lang="ts">
const { animateHeroReveal, setupCardsBatch } = useMotion()
const { success: showToast } = useToast()

const headlineLine1 = ref<HTMLElement | null>(null)
const headlineLine2 = ref<HTMLElement | null>(null)
const eyebrowRef = ref<HTMLElement | null>(null)
const introRef = ref<HTMLElement | null>(null)
const inquiryContainerRef = ref<HTMLElement | null>(null)
const faqContainerRef = ref<HTMLElement | null>(null)

let inquiryCtx: ReturnType<typeof setupCardsBatch> | null = null
let faqCtx: ReturnType<typeof setupCardsBatch> | null = null

// Form State
const selectedService = ref('Landing Page Interaktif')
const selectedTimeline = ref('1–2 Minggu')
const clientName = ref('')
const clientEmail = ref('')
const projectBrief = ref('')
const isCopied = ref(false)

const servicesList = [
  'Landing Page Interaktif',
  'Web App / SaaS Antarmuka',
  'Design System & Tokens',
  'Frontend Architecture',
  'Audit UI & Performa Web',
]

const timelineList = [
  '1–2 Minggu (Cepat)',
  '3–4 Minggu (Standar)',
  '1–2 Bulan (Komprehensif)',
  'Fleksibel / Diskusi Lanjut',
]

const studioEmail = 'hello@rumahdesign.dev'
const whatsappNumber = '6281234567890'

// Generate mailto link
const mailtoHref = computed(() => {
  const subject = encodeURIComponent(`[Project Inquiry] ${selectedService.value} — ${clientName.value || 'Diskusi Proyek'}`)
  const body = encodeURIComponent(
`Halo Rumah Design,

Saya tertarik untuk berdiskusi mengenai proyek digital berikut:

• Kategori Layanan: ${selectedService.value}
• Estimasi Timeline: ${selectedTimeline.value}
• Nama / Perusahaan: ${clientName.value || '-'}
• Email Kontak: ${clientEmail.value || '-'}

Ringkasan Kebutuhan / Brief:
${projectBrief.value || '(Belum diisi)'}

Terima kasih!`
  )
  return `mailto:${studioEmail}?subject=${subject}&body=${body}`
})

// WhatsApp href
const whatsappHref = computed(() => {
  const text = encodeURIComponent(
    `Halo Rumah Design, saya ingin konsultasi proyek "${selectedService.value}". Nama saya ${clientName.value || 'klien'}.`
  )
  return `https://wa.me/${whatsappNumber}?text=${text}`
})

const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText(studioEmail)
    isCopied.value = true
    showToast('Alamat email berhasil disalin!')
    setTimeout(() => {
      isCopied.value = false
    }, 2500)
  } catch (err) {
    console.error('Gagal menyalin email:', err)
  }
}

const copyBriefSummary = async () => {
  const summaryText = 
`[PROJECT INQUIRY — RUMAH DESIGN]
Kategori: ${selectedService.value}
Timeline: ${selectedTimeline.value}
Nama: ${clientName.value || '-'}
Email: ${clientEmail.value || '-'}
Brief: ${projectBrief.value || '-'}`

  try {
    await navigator.clipboard.writeText(summaryText)
    showToast('Ringkasan brief proyek berhasil disalin ke clipboard!')
  } catch (err) {
    console.error('Gagal menyalin brief:', err)
  }
}

onMounted(() => {
  document.documentElement.classList.add('light-mode')

  const lines = [headlineLine1.value, headlineLine2.value].filter(Boolean) as HTMLElement[]
  animateHeroReveal({
    headlineLines: lines,
    eyebrow: eyebrowRef.value,
    intro: introRef.value,
  })

  nextTick(() => {
    if (inquiryContainerRef.value) {
      inquiryCtx = setupCardsBatch(inquiryContainerRef.value, '.inquiry-step-block')
    }
    if (faqContainerRef.value) {
      faqCtx = setupCardsBatch(faqContainerRef.value, '.faq-card')
    }
  })
})

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('light-mode')
  }
  if (inquiryCtx) {
    inquiryCtx.revert()
    inquiryCtx = null
  }
  if (faqCtx) {
    faqCtx.revert()
    faqCtx = null
  }
})

const siteConfig = useSiteConfig()

useSeoMeta({
  title: 'Hubungi Studio — Rumah Design',
  description: 'Mulai diskusi proyek baru, konsultasi arsitektur frontend, atau eksplorasi kolaborasi produk digital dengan Rumah Design.',
  ogTitle: 'Hubungi Studio — Rumah Design',
  ogDescription: 'Kirim brief singkat atau hubungi langsung untuk mewujudkan landing page, web app, dan sistem desain produk Anda.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: `${siteConfig.url}/contact` }],
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Hubungi Rumah Design',
      description: 'Halaman kontak dan inquiry proyek digital studio Rumah Design.',
      url: `${siteConfig.url}/contact`,
      mainEntity: {
        '@type': 'Organization',
        name: 'Rumah Design',
        email: studioEmail,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Jakarta',
          addressCountry: 'ID',
        },
      },
    }),
  }],
})

const faqs = [
  {
    q: 'Bagaimana alur kerja sama proyek di Rumah Design?',
    a: 'Kami memulai dengan sesi alignment singkat (memahami tujuan bisnis & referensi visual), menyusun prototipe interaktif fungsional, melakukan iterasi cepat, lalu mengeksekusi kode frontend produksi hingga deploy.',
  },
  {
    q: 'Apakah bisa mengerjakan frontend saja dari file Figma yang sudah ada?',
    a: 'Sangat bisa. Kami mengonversi file desain Figma Anda menjadi arsitektur kode frontend yang rapi (Nuxt 3/Vue/React), responsif di seluruh breakpoint perangkat, dan dilengkapi animasi micro-interaction yang halus.',
  },
  {
    q: 'Berapa perkiraan waktu pengerjaan untuk satu proyek?',
    a: 'Untuk landing page interaktif dengan motion khusus biasanya memakan waktu 1–2 minggu. Untuk aplikasi SaaS berbasis data atau dashboard kompleks berkisar antara 3–6 minggu.',
  },
  {
    q: 'Bagaimana model komunikasi dan pelaporan progres?',
    a: 'Komunikasi berlangsung transparan melalui Telegram / WhatsApp / Slack dengan staging preview link aktif yang dapat diakses kapan saja untuk memantau perkembangan secara langsung.',
  },
]
</script>

<template>
  <div class="min-h-screen bg-paper text-ink pt-28 sm:pt-32 pb-20 sm:pb-28 relative z-20 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
    <div class="page-shell space-y-16 sm:space-y-24">
      <!-- 1. HERO SECTION -->
      <section class="border-b border-ink/12 pb-12 sm:pb-16">
        <div ref="eyebrowRef" class="inline-flex items-center gap-2 rounded-full bg-ink/5 border border-ink/10 px-3.5 py-1.5">
          <span class="relative flex size-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
            <span class="relative inline-flex size-2 rounded-full bg-signal" />
          </span>
          <span class="font-mono text-[0.7rem] sm:text-xs font-semibold text-mute uppercase tracking-[0.14em]">
            Terbuka Untuk Proyek Baru · 2026
          </span>
        </div>

        <h1 class="mt-4 sm:mt-6 font-display text-display-l text-ink max-w-[18ch] tracking-tight font-bold">
          <span class="block overflow-hidden">
            <span ref="headlineLine1" class="inline-block will-change-transform">Mari wujudkan ide digital</span>
          </span>
          <span class="block overflow-hidden">
            <span ref="headlineLine2" class="inline-block text-signal will-change-transform">berikutnya bersama kami.</span>
          </span>
        </h1>

        <div ref="introRef" class="mt-6 sm:mt-8 max-w-2xl space-y-4 text-body-l text-ink/90 font-sans leading-relaxed">
          <p>
            Punya ide produk baru, kebutuhan landing page bernuansa editorial, atau ingin merombak antarmuka aplikasi menjadi lebih bertenaga? Ceritakan kebutuhan Anda di bawah ini.
          </p>
        </div>
      </section>

      <!-- 2. INTERACTIVE INQUIRY BUILDER & DIRECT CONTACT GRID -->
      <section ref="inquiryContainerRef" class="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <!-- Left: Interactive Brief Builder Form -->
        <div class="inquiry-step-block space-y-8 rounded-3xl bg-white/85 p-6 sm:p-10 border border-ink/10 shadow-sm">
          <div class="space-y-2 border-b border-ink/8 pb-4">
            <div class="inline-flex items-center gap-2 font-mono text-xs font-bold text-signal uppercase tracking-widest">
              <span>{ Step 1 · Pilih Kebutuhan }</span>
            </div>
            <h2 class="font-display text-xl sm:text-2xl font-bold text-ink">
              Apa yang ingin Anda bangun?
            </h2>
          </div>

          <!-- Service Tags Selection -->
          <div class="space-y-3">
            <label class="font-mono text-xs font-semibold uppercase tracking-wider text-mute">
              Kategori Layanan
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="service in servicesList"
                :key="service"
                type="button"
                class="rounded-full px-4 py-2 text-xs font-mono font-medium transition-all duration-200 border"
                :class="selectedService === service ? 'bg-signal text-white border-signal shadow-xs scale-105' : 'bg-ink/5 text-ink/80 border-ink/10 hover:border-signal hover:text-signal'"
                @click="selectedService = service"
              >
                {{ service }}
              </button>
            </div>
          </div>

          <!-- Timeline Selector -->
          <div class="space-y-3">
            <label class="font-mono text-xs font-semibold uppercase tracking-wider text-mute">
              Ekspektasi Timeline
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="time in timelineList"
                :key="time"
                type="button"
                class="rounded-full px-3.5 py-1.5 text-xs font-mono font-medium transition-all duration-200 border"
                :class="selectedTimeline === time ? 'bg-ink text-white border-ink shadow-xs' : 'bg-ink/5 text-ink/80 border-ink/10 hover:border-ink'"
                @click="selectedTimeline = time"
              >
                {{ time }}
              </button>
            </div>
          </div>

          <!-- Form Fields -->
          <div class="space-y-4 pt-2">
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-1.5">
                <label for="client-name" class="font-mono text-xs font-semibold uppercase tracking-wider text-mute">
                  Nama / Brand
                </label>
                <input
                  id="client-name"
                  v-model="clientName"
                  type="text"
                  placeholder="misal: Alex Studio"
                  class="field text-sm"
                >
              </div>

              <div class="space-y-1.5">
                <label for="client-email" class="font-mono text-xs font-semibold uppercase tracking-wider text-mute">
                  Email Anda
                </label>
                <input
                  id="client-email"
                  v-model="clientEmail"
                  type="email"
                  placeholder="alex@studio.com"
                  class="field text-sm"
                >
              </div>
            </div>

            <div class="space-y-1.5">
              <label for="project-brief" class="font-mono text-xs font-semibold uppercase tracking-wider text-mute">
                Ringkasan Kebutuhan / Tautan Figma
              </label>
              <textarea
                id="project-brief"
                v-model="projectBrief"
                rows="4"
                placeholder="Ceritakan gambaran singkat proyek, target audiens, atau sertakan tautan dokumen/Figma..."
                class="field text-sm leading-relaxed"
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <RadialRevealButton
              :href="mailtoHref"
              variant="primary"
              label="Kirim via Email Client"
              add-icon
              :icon="{ symbol: '↗', size: 14, side: 'right' }"
              padding="0.85rem 1.6rem"
              custom-class="grow text-center shadow-md text-xs sm:text-sm"
            />
            <RadialRevealButton
              variant="dark"
              label="Salin Brief"
              padding="0.85rem 1.4rem"
              custom-class="text-center text-xs"
              @click="copyBriefSummary"
            />
          </div>
        </div>

        <!-- Right: Direct Channels & Studio Availability Card -->
        <div class="space-y-6">
          <!-- Availability Card -->
          <div class="inquiry-step-block rounded-3xl bg-[#14120f] text-paper p-6 sm:p-8 border border-white/10 space-y-5">
            <div class="flex items-center justify-between border-b border-white/10 pb-4">
              <span class="font-mono text-xs font-bold text-signal uppercase tracking-widest">
                [ Studio Availability ]
              </span>
              <span class="size-2 rounded-full bg-signal animate-pulse" />
            </div>

            <div class="space-y-2">
              <p class="font-display text-lg font-bold text-paper">
                Menerima Proyek Pilihan
              </p>
              <p class="font-mono text-xs text-paper/70 leading-relaxed">
                Lokasi: Jakarta, ID (GMT+7)<br>
                Waktu Respons: &lt; 24 Jam Kerja
              </p>
            </div>

            <div class="pt-2 border-t border-white/10 space-y-3">
              <p class="font-mono text-[0.7rem] uppercase tracking-wider text-paper/50">
                Email Resmi Studio
              </p>
              <div class="flex items-center justify-between gap-2 rounded-xl bg-white/5 p-3 border border-white/10">
                <span class="font-mono text-xs text-paper truncate font-semibold">{{ studioEmail }}</span>
                <button
                  type="button"
                  class="rounded-lg bg-white/10 px-2.5 py-1 font-mono text-[0.68rem] text-white hover:bg-signal transition-colors shrink-0"
                  @click="copyEmail"
                >
                  {{ isCopied ? 'Tersalin!' : 'Copy' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Fast Direct Reach Cards -->
          <div class="inquiry-step-block rounded-3xl bg-white/80 p-6 sm:p-8 border border-ink/10 shadow-xs space-y-4">
            <div class="font-mono text-xs font-bold text-signal uppercase tracking-widest">
              <span>{ Alternatif Cepat }</span>
            </div>
            <h3 class="font-display text-base sm:text-lg font-bold text-ink">
              Diskusi Langsung
            </h3>
            <p class="text-xs text-mute leading-relaxed">
              Lebih menyukai diskusi cepat via chat pesan instan?
            </p>

            <a
              :href="whatsappHref"
              target="_blank"
              rel="noopener noreferrer"
              class="w-full flex items-center justify-between gap-2 rounded-2xl bg-ink/5 hover:bg-ink hover:text-white p-4 border border-ink/10 transition-all group"
            >
              <div class="flex items-center gap-3">
                <span class="text-lg">💬</span>
                <div>
                  <p class="font-mono text-xs font-bold group-hover:text-white">WhatsApp Direct</p>
                  <p class="font-mono text-[0.68rem] text-mute group-hover:text-white/70">Mulai obrolan singkat</p>
                </div>
              </div>
              <span class="font-mono text-xs group-hover:translate-x-1 transition-transform">↗</span>
            </a>

            <!-- Social Links Mini Strip -->
            <div class="pt-2 border-t border-ink/8 space-y-2">
              <p class="font-mono text-[0.68rem] uppercase tracking-wider text-mute">
                Kanal Profesional
              </p>
              <div class="flex flex-wrap gap-2">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="rounded-lg bg-ink/5 px-2.5 py-1 font-mono text-[0.68rem] font-medium text-ink/80 hover:text-signal hover:bg-signal/10 transition-colors"
                >
                  GitHub ↗
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="rounded-lg bg-ink/5 px-2.5 py-1 font-mono text-[0.68rem] font-medium text-ink/80 hover:text-signal hover:bg-signal/10 transition-colors"
                >
                  LinkedIn ↗
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="rounded-lg bg-ink/5 px-2.5 py-1 font-mono text-[0.68rem] font-medium text-ink/80 hover:text-signal hover:bg-signal/10 transition-colors"
                >
                  X (Twitter) ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. FAQS SECTION -->
      <section class="space-y-8 border-t border-ink/12 pt-12 sm:pt-16">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-ink/10 pb-4">
          <div>
            <div class="inline-flex items-center gap-2 font-mono text-xs font-bold text-signal uppercase tracking-widest">
              <span>{ Pertanyaan Umum }</span>
            </div>
            <h2 class="mt-2 font-display text-display-m text-ink">
              Hal yang sering ditanyakan
            </h2>
          </div>
          <p class="font-mono text-xs text-mute uppercase tracking-wider">
            Seputar model kolaborasi & delivery
          </p>
        </div>

        <div ref="faqContainerRef" class="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
          <div
            v-for="(faq, i) in faqs"
            :key="i"
            class="faq-card will-change-transform rounded-2xl sm:rounded-3xl bg-white/80 p-6 sm:p-7 border border-ink/10 shadow-xs space-y-2.5"
          >
            <h3 class="font-display text-base sm:text-lg font-bold text-ink">
              {{ faq.q }}
            </h3>
            <p class="text-xs sm:text-sm text-mute leading-relaxed font-sans">
              {{ faq.a }}
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
