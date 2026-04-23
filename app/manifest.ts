import type { MetadataRoute } from 'next'
import { readSettings } from '@/lib/store'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await readSettings()

  return {
    name: settings.companyName,
    short_name: settings.companyShortName,
    description: settings.heroDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#050505',
    theme_color: '#050505',
    lang: 'tr-TR',
    icons: [
      {
        src: '/icon-light-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
