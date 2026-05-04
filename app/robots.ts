import type { MetadataRoute } from 'next'
import { getMetadataBase } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  const metadataBase = getMetadataBase()

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: new URL('/sitemap.xml', metadataBase).toString(),
    host: metadataBase.origin,
  }
}
