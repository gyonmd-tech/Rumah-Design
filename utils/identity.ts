export const PERSONAL_IDENTITY = {
  brandName: 'Hygione Darriyan',
  fullName: 'Hygione Heparre Paro Arro Darriyan',
  alternateNames: ['Hygione Darriyan', 'Hygione Heparre', 'gyon.md', 'gyonmd'],
  email: 'paroarro07@gmail.com',
  headline: 'IT Support · UI/UX Designer · Frontend & Fullstack Developer',
  publicBio: 'Hygione Heparre Paro Arro Darriyan, dikenal sebagai Hygione Darriyan, adalah praktisi IT support, UI/UX designer, frontend dan fullstack developer asal Citayam, Kota Depok, Indonesia. Ia merancang pengalaman digital dan membangun aplikasi web dari antarmuka hingga backend.',
  location: {
    city: 'Citayam, Kota Depok',
    region: 'Jawa Barat',
    country: 'Indonesia',
    countryCode: 'ID',
  },
  profiles: {
    github: 'https://github.com/gyonmd-tech',
    linkedin: 'https://www.linkedin.com/in/hygione-heparre-paro-arro-darriyan-910724327',
    instagram: 'https://www.instagram.com/gyon.md/',
  },
} as const

export const PERSONAL_PROFILE_URLS = Object.values(PERSONAL_IDENTITY.profiles)
