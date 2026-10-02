/** Fonts used only by the admin studio, kept off the public pages. */
export function useAdminFonts() {
  useHead({
    link: [
      { rel: 'preconnect', href: 'https://api.fontshare.com', crossorigin: '' },
      { key: 'admin-fontshare', rel: 'stylesheet', href: 'https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=general-sans@500,600,700&display=swap' },
      { key: 'admin-plex', rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap' },
    ],
  })
}
