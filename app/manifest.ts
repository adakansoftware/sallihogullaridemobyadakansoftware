import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sallıhoğulları Hafriyat',
    short_name: 'Sallıhoğulları',
    description: 'Adana merkezli hafriyat, damperli nakliyat, lowbed ve arazöz hizmetleri.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050505',
    theme_color: '#050505',
    lang: 'tr-TR',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  }
}
