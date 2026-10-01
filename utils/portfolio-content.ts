export const SERVICES = [
  {
    slug: 'ui-ux-design',
    name: 'UI/UX & Visual Design',
    short: 'Alur yang masuk akal. Visual yang punya karakter.',
    description: 'Perancangan UI/UX dan desain visual oleh Hygione Darriyan: user flow, wireframe, prototype Figma, dan design system untuk website serta aplikasi.',
    intro: 'Produk yang nyaman digunakan dimulai dari keputusan kecil yang tepat: informasi mana yang muncul lebih dulu, bagaimana orang berpindah halaman, dan apa yang terjadi setelah sebuah tombol ditekan.',
    paragraphs: [
      'Saya membantu menerjemahkan kebutuhan produk menjadi alur pengguna dan antarmuka yang jelas. Pembahasan dimulai dari siapa yang akan memakai produk, tugas yang ingin diselesaikan, serta kendala pada pengalaman yang ada. Referensi visual digunakan untuk menyamakan arah, lalu diolah menjadi identitas yang sesuai dengan konteks produk.',
      'Wireframe membantu menata struktur sebelum masuk ke warna dan detail tampilan. Dari sana, eksplorasi tipografi, ruang, komponen, serta keadaan interaksi disusun menjadi desain yang dapat ditinjau bersama. Prototype digunakan untuk membicarakan alur dan menguji asumsi; bentuk evaluasinya disesuaikan dengan akses pengguna dan ruang lingkup pekerjaan.',
      'Karena saya juga mengembangkan antarmuka, keputusan desain mempertimbangkan perilaku di browser. Responsivitas, keterbacaan, navigasi keyboard, dan keadaan kosong maupun error dibicarakan sejak tahap desain. Hasil akhirnya dapat menjadi bahan implementasi tim Anda atau dilanjutkan ke pengembangan frontend bersama saya.',
    ],
    deliverables: ['Pemetaan kebutuhan dan user flow', 'Wireframe halaman atau fitur prioritas', 'Desain antarmuka dan prototype Figma', 'Komponen, style guide, dan catatan interaksi'],
    suitable: 'Untuk ide produk yang perlu divisualisasikan, antarmuka yang sulit dipahami, atau identitas visual yang belum konsisten di berbagai halaman.',
    prepare: 'Bawa tujuan produk, gambaran pengguna, contoh alur yang bermasalah, dan referensi yang Anda suka. Jika belum punya brief lengkap, kita bisa menyusunnya dari masalah yang paling penting.',
    scope: 'Jumlah halaman, kedalaman prototype, kebutuhan riset, dan detail design system disepakati terlebih dahulu. Validasi dengan pengguna nyata memerlukan rencana dan partisipan tersendiri; saya tidak menganggap preferensi visual sebagai bukti keberhasilan UX.',
    projectSlugs: ['ecoshire-modern-hobbit-retreat', 'pundi', 'zetta-street'],
    projectContext: 'Jelajahi pendekatan visual dan antarmuka pada karya berikut. Detail proses dan teknologi tersedia di masing-masing case study.',
  },
  {
    slug: 'frontend-development',
    name: 'Frontend Development',
    short: 'Dari desain menjadi pengalaman yang hidup di browser.',
    description: 'Pengembangan frontend oleh Hygione Darriyan: Figma ke website responsif, landing page, dashboard, Vue/Nuxt, React, dan antarmuka berbasis TypeScript.',
    intro: 'Desain yang baik perlu bertahan saat dipakai: ketika layar mengecil, koneksi melambat, isi konten bertambah, atau pengguna menavigasi tanpa mouse.',
    paragraphs: [
      'Saya membangun antarmuka web dari desain yang sudah tersedia maupun dari proses desain yang dikerjakan bersama. Fokusnya adalah menerjemahkan hierarki visual dan perilaku interaksi menjadi komponen yang konsisten. Landing page, website portofolio, dashboard, dan antarmuka aplikasi memiliki kebutuhan yang berbeda; arsitektur dipilih mengikuti kebutuhan tersebut.',
      'Implementasi dapat menggunakan ekosistem Vue/Nuxt atau React dengan TypeScript. Struktur komponen, pengelolaan state, serta integrasi data dirancang supaya perubahan konten dan fitur tidak menuntut penulisan ulang seluruh halaman. Keadaan loading, validasi form, pesan error, dan respons pada ukuran layar berbeda menjadi bagian dari pekerjaan antarmuka.',
      'Motion digunakan ketika membantu orientasi dan memberi umpan balik. Pengaturan reduced motion, navigasi keyboard, struktur heading, dan ukuran aset diperhatikan agar pengalaman tetap nyaman. Untuk halaman publik yang perlu ditemukan melalui pencarian, rendering dan metadata direncanakan sesuai framework serta karakter kontennya.',
    ],
    deliverables: ['Komponen antarmuka yang dapat digunakan ulang', 'Layout responsif dan keadaan interaksi', 'Integrasi API yang tersedia sesuai scope', 'Kode sumber, catatan setup, dan panduan deployment'],
    suitable: 'Untuk desain Figma yang siap dibangun, landing page baru, atau antarmuka aplikasi yang membutuhkan implementasi lebih konsisten.',
    prepare: 'Siapkan akses desain, konten, aset visual, daftar halaman, serta dokumentasi API bila ada. Jelaskan juga perangkat dan browser prioritas agar pengujian punya sasaran yang jelas.',
    scope: 'Frontend mencakup bagian yang dipakai pengguna di browser. Pembuatan database, aturan akses, dan API baru dibahas sebagai pekerjaan fullstack. Target performa ditentukan bersama dan diperiksa pada lingkungan deployment sebenarnya.',
    projectSlugs: ['granger-sportainment-platform', 'hybloggyon', 'pianaxis-creative-disruptor'],
    projectContext: 'Lihat variasi implementasi antarmuka, navigasi konten, dan interaksi visual pada project berikut.',
  },
  {
    slug: 'fullstack-development',
    name: 'Fullstack Development',
    short: 'Antarmuka, data, dan logika produk yang saling terhubung.',
    description: 'Fullstack development oleh Hygione Darriyan: aplikasi web, dashboard, autentikasi, API, dan database yang terhubung dengan pengalaman pengguna.',
    intro: 'Aplikasi yang fungsional membutuhkan lebih dari halaman yang selesai. Data harus tersimpan dengan tepat, akses pengguna dibatasi, dan setiap perubahan punya alur yang dapat dipahami.',
    paragraphs: [
      'Saya membantu mengembangkan aplikasi web dari antarmuka hingga kebutuhan di sisi server. Pekerjaan dimulai dengan memetakan entitas data, peran pengguna, dan alur utama produk. Ini membantu menentukan fitur minimum yang perlu berjalan sebelum menambah integrasi atau skenario yang lebih kompleks.',
      'Autentikasi, validasi input, aturan akses, serta relasi database dirancang bersama dengan pengalaman pengguna. Dashboard, pengelolaan konten, dan fitur berbasis data perlu memperjelas siapa yang bisa membaca atau mengubah informasi. Secret disimpan pada lingkungan server, sementara aturan penting tidak hanya bergantung pada validasi di browser.',
      'Pilihan stack mengikuti kebutuhan aplikasi dan konteks tim. Karya dalam portofolio mencakup penggunaan TypeScript, PostgreSQL, Prisma, Supabase, serta ekosistem React/Next.js. Integrasi layanan pihak ketiga dibahas berdasarkan dokumentasi, batas penggunaan, biaya, dan data yang dibutuhkan, agar keputusan teknis tetap dapat dipertanggungjawabkan.',
    ],
    deliverables: ['Antarmuka untuk alur produk yang disepakati', 'Model data, migration, dan aturan akses', 'API, autentikasi, serta validasi input', 'Dokumentasi konfigurasi dan serah terima deployment'],
    suitable: 'Untuk MVP, dashboard internal, atau aplikasi yang perlu mengelola akun, menyimpan data, dan menghubungkan beberapa layanan.',
    prepare: 'Ceritakan proses yang ingin dipindahkan ke aplikasi, jenis pengguna, data yang dikelola, serta integrasi yang dibutuhkan. Contoh spreadsheet atau alur manual sering membantu menjelaskan kebutuhan awal.',
    scope: 'Fitur, model akses, kebutuhan hosting, dan tanggung jawab operasional disepakati sebelum implementasi. Biaya layanan eksternal serta pemeliharaan setelah peluncuran dibahas terpisah sesuai kebutuhan, bukan diasumsikan otomatis termasuk.',
    projectSlugs: ['smart-presence-platform', 'arrobuild', 'warrior-quest-log'],
    projectContext: 'Karya berikut memberi konteks tentang aplikasi berbasis data, autentikasi, dan integrasi teknologi. Baca case study untuk melihat scope setiap project.',
  },
] as const

/** Short labels for big display headings. */
export const SERVICE_SHORT_NAMES: Record<string, string> = {
  'ui-ux-design': 'UI/UX',
  'frontend-development': 'Frontend',
  'fullstack-development': 'Fullstack',
}

export const WORK_STEPS = [
  { title: 'Memahami masalah', detail: 'Kita mulai dari tujuan, pengguna, dan hambatan yang ingin diselesaikan. Saya merangkum kebutuhan serta pertanyaan terbuka agar keputusan berikutnya punya dasar yang sama.', output: 'Brief, prioritas, dan batas pekerjaan.' },
  { title: 'Menyusun arah', detail: 'Alur pengguna, struktur halaman, dan referensi visual dipetakan sebelum detail dibuat. Untuk aplikasi berbasis data, tahap ini juga membahas peran pengguna dan informasi yang perlu disimpan.', output: 'User flow, struktur konten, dan rencana teknis awal.' },
  { title: 'Merancang dan meninjau', detail: 'Wireframe berkembang menjadi antarmuka serta prototype. Kita meninjau hierarki, interaksi, dan konsistensi komponen. Masukan dikumpulkan per tahap supaya revisi tetap terarah.', output: 'Desain yang disepakati beserta catatan interaksinya.' },
  { title: 'Membangun dan memeriksa', detail: 'Komponen diimplementasikan, dihubungkan dengan data bila dibutuhkan, dan diperiksa pada skenario utama. Ukuran layar, validasi, keadaan error, serta akses pengguna menjadi bagian dari pengujian sesuai scope.', output: 'Versi yang dapat dicoba dan daftar hasil pemeriksaan.' },
  { title: 'Meluncurkan dan menyerahkan', detail: 'Konfigurasi deployment, akses, dan dokumentasi ditinjau sebelum rilis. Setelah itu kita mencatat hal yang perlu dipantau serta menentukan apakah diperlukan iterasi atau dukungan lanjutan.', output: 'Produk yang dirilis, kode atau file desain, serta panduan serah terima.' },
] as const

export const HOME_FAQS = [
  { question: 'Apa yang dikerjakan Hygione Darriyan?', answer: 'Saya bekerja pada UI/UX dan desain visual, pengembangan frontend, serta aplikasi fullstack. Anda dapat memulai dari satu kebutuhan, misalnya desain antarmuka atau implementasi Figma, maupun membahas produk dari awal hingga deployment.' },
  { question: 'Apakah project di portofolio bisa dicoba?', answer: 'Halaman project menyertakan tautan live demo eksternal, teknologi yang digunakan, dan case study. Ketersediaan demo mengikuti deployment masing-masing project.' },
  { question: 'Bagaimana jika saya belum punya brief lengkap?', answer: 'Mulai dari masalah yang ingin diselesaikan, siapa yang akan memakai produk, dan referensi yang membantu menjelaskan arah Anda. Dari sana, kita bisa menyusun prioritas serta scope awal.' },
  { question: 'Berapa biaya dan lama pengerjaannya?', answer: 'Estimasi dibuat setelah kebutuhan, jumlah halaman atau fitur, kesiapan konten, dan integrasi dipahami. Kirim gambaran singkat melalui halaman kontak agar pembahasannya sesuai dengan kebutuhan Anda.' },
] as const
