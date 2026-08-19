import type { Project } from '~/types/database.types'

export const fallbackProjects: (Project & { case_study?: string })[] = [
  {
    id: 'demo-1',
    slug: 'pundi-financial-dashboard',
    title: 'Pundi — Financial Dashboard',
    description: 'Dashboard analitik finansial enterprise dengan visualisasi arus kas real-time, audit rekonsiliasi otomatis, dan arsitektur data-dense.',
    case_study: `## Ringkasan Proyek
Pundi adalah platform dashboard analitik keuangan enterprise yang dirancang untuk mengelola arus kas bervolume tinggi, rekonsiliasi transaksi otomatis, dan visualisasi tren multi-mata uang secara instan.

### Tantangan Desain
- Mengorganisir ratusan titik data keuangan ke dalam hierarki visual yang jelas tanpa membebani kognitif pengguna.
- Mempertahankan performa visual 60fps saat rendering grafik interaktif real-time.

### Solusi & Rekayasa Frontend
1. **Tipografi Berbasis Angka Tabular**: Menggunakan font mono dengan tabular figures untuk mencegah angka bergeser saat nilai ter-update.
2. **Komponen Modular Data-Dense**: Widget analitik dapat diposisikan ulang dengan drag-and-drop dinamis.
3. **Arsitektur Caching**: Memanfaatkan SWR dan WebSocket serverless untuk meminimalkan beban latensi.`,
    thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    preview_media_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    live_url: 'https://demo.pundi.id',
    repo_url: 'https://github.com',
    status: 'published',
    category: 'dashboard',
    style_tags: ['Modern', 'Light', 'Enterprise'],
    tech_stack: ['Next.js', 'React', 'Tailwind CSS', 'Lucide Icons'],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'demo-2',
    slug: 'arrobuild-platform',
    title: 'ArroBuild — SaaS Builder',
    description: 'Sistem pembuatan aplikasi modular dengan fondasi backend terotomasi, dark mode berkontras tinggi, dan animasi interaktif.',
    case_study: `## Ringkasan Proyek
ArroBuild memungkinkan pengembang menyusun aplikasi modular lengkap dengan skema basis data dan antarmuka terintegrasi hanya dalam beberapa menit.

### Pendekatan Desain
- Tampilan mode gelap dengan saturasi tinggi (*cyber-dark neon accents*).
- Mikro-interaksi pada setiap aksi tombol untuk memberikan kepastian eksekusi perintah sistem.`,
    thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    preview_media_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    live_url: 'https://demo.arrobuild.com',
    repo_url: 'https://github.com',
    status: 'published',
    category: 'web-app',
    style_tags: ['Dark', 'Neon', 'Bold'],
    tech_stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    created_at: '2026-01-02T00:00:00Z',
    updated_at: '2026-01-02T00:00:00Z',
  },
  {
    id: 'demo-3',
    slug: 'hybloggyon-editorial',
    title: 'HyBloggyon — Editorial Studio',
    description: 'Media publikasi editorial dengan tipografi fluid, layout asimetris dinamis, dan sistem rendering artikel markdown berkecepatan tinggi.',
    case_study: `## Ringkasan Proyek
HyBloggyon mengeksplorasi estetika majalah cetak kelas atas ke dalam format web modern dengan layout asimetris dan transisi antar bab yang mulus.`,
    thumbnail_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
    preview_media_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
    live_url: 'https://hybloggyon.dev',
    repo_url: 'https://github.com',
    status: 'published',
    category: 'web-app',
    style_tags: ['Editorial', 'Typography', 'Monochrome'],
    tech_stack: ['React', 'Vite', 'Tailwind CSS', 'MDX', 'GSAP'],
    created_at: '2026-01-03T00:00:00Z',
    updated_at: '2026-01-03T00:00:00Z',
  },
  {
    id: 'demo-4',
    slug: 'smart-presence-platform',
    title: 'Smart Presence Platform',
    description: 'Platform presensi berbasis geofencing dan biometrik cerdas dengan dashboard analitik performa kehadiran karyawan.',
    case_study: `## Ringkasan Proyek
Sistem absensi cerdas berbasis koordinat geofencing dan verifikasi wajah dengan analitik rekapitulasi kehadiran instan.`,
    thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    preview_media_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    live_url: 'https://smartpresence.io',
    repo_url: 'https://github.com',
    status: 'published',
    category: 'web-app',
    style_tags: ['Modern', 'Light', 'Data-rich'],
    tech_stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'PostgreSQL'],
    created_at: '2026-01-04T00:00:00Z',
    updated_at: '2026-01-04T00:00:00Z',
  },
  {
    id: 'demo-5',
    slug: 'veloce-motion-system',
    title: 'Veloce — Kinetic Design System',
    description: 'Design system interaktif dengan pustaka token gerak kinetik, komponen micro-interaction, dan live playground berbasis WebGL.',
    case_study: `## Ringkasan Proyek
Pustaka token gerak kinetik dan komponen UI berkinerja tinggi untuk aplikasi web masa depan.`,
    thumbnail_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
    preview_media_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
    live_url: 'https://veloce.design',
    repo_url: 'https://github.com',
    status: 'published',
    category: 'lainnya',
    style_tags: ['Kinetic', 'Interactive', 'Dark'],
    tech_stack: ['Vue 3', 'GSAP ScrollTrigger', 'Three.js', 'Tailwind'],
    created_at: '2026-01-05T00:00:00Z',
    updated_at: '2026-01-05T00:00:00Z',
  },
  {
    id: 'demo-6',
    slug: 'lumina-architectural-agency',
    title: 'Lumina — Architecture Studio',
    description: 'Website portofolio arsitektur premium dengan transisi halaman mulus, galeri horizontal scrub, dan tipografi display berbobot.',
    case_study: `## Ringkasan Proyek
Portofolio arsitektur premium dengan fokus pada visual skala besar, transisi halaman tanpa flicker, dan tipografi berwibawa.`,
    thumbnail_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    preview_media_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    live_url: 'https://lumina.studio',
    repo_url: 'https://github.com',
    status: 'published',
    category: 'landing-page',
    style_tags: ['Minimalist', 'Editorial', 'Light'],
    tech_stack: ['Nuxt 3 SSR', 'TypeScript', 'Tailwind CSS', 'Lenis'],
    created_at: '2026-01-06T00:00:00Z',
    updated_at: '2026-01-06T00:00:00Z',
  },
  {
    id: 'demo-7',
    slug: 'kroma-generative-canvas',
    title: 'Kroma — Generative UI Canvas',
    description: 'Eksperimen antarmuka generatif berbasis shader GLSL dengan kontrol parameter real-time dan ekspor palet warna instan.',
    case_study: `## Ringkasan Proyek
Eksperimen shader GLSL generatif yang menghasilkan pola visual dinamis untuk background web generasi baru.`,
    thumbnail_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
    preview_media_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
    live_url: 'https://kroma.gl',
    repo_url: 'https://github.com',
    status: 'published',
    category: 'lainnya',
    style_tags: ['Experimental', 'Color', 'Creative'],
    tech_stack: ['WebGL', 'GLSL', 'Canvas API', 'TypeScript'],
    created_at: '2026-01-07T00:00:00Z',
    updated_at: '2026-01-07T00:00:00Z',
  },
  {
    id: 'demo-8',
    slug: 'nexus-cloud-infrastructure',
    title: 'Nexus — Cloud Node Monitor',
    description: 'Aplikasi pemantauan topologi server multi-region dengan visualisasi metrik performa latensi dan peringatan insiden otomatis.',
    case_study: `## Ringkasan Proyek
Dashboard visualisasi topologi cluster server global dengan grafik latensi real-time dan sistem notifikasi insiden.`,
    thumbnail_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop',
    preview_media_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop',
    live_url: 'https://nexus.cloud',
    repo_url: 'https://github.com',
    status: 'published',
    category: 'dashboard',
    style_tags: ['Dark', 'Technical', 'Enterprise'],
    tech_stack: ['Next.js', 'React', 'D3.js', 'Tailwind CSS', 'WebSockets'],
    created_at: '2026-01-08T00:00:00Z',
    updated_at: '2026-01-08T00:00:00Z',
  },
]
