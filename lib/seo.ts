import type { Metadata } from 'next'
import type { SiteSettings } from '@/lib/store'

export const DEFAULT_SHARE_IMAGE = '/images/hero-main.jpg'

export function getMetadataBase() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || process.env.APP_ORIGIN?.trim()
  if (!siteUrl) {
    return new URL('http://localhost:3000')
  }

  try {
    return new URL(siteUrl)
  } catch {
    return new URL('http://localhost:3000')
  }
}

export function buildShareMetadata({
  title,
  description,
  pathname,
  image = DEFAULT_SHARE_IMAGE,
  type = 'website',
  siteName,
}: {
  title: string
  description: string
  pathname: string
  image?: string
  type?: 'website' | 'article'
  siteName?: string
}): Pick<Metadata, 'openGraph' | 'twitter'> {
  const imageUrl = getCanonicalUrl(image)

  return {
    openGraph: {
      title,
      description,
      type,
      locale: 'tr_TR',
      siteName,
      url: getCanonicalUrl(pathname),
      images: [
        {
          url: imageUrl,
          width: 1600,
          height: 900,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export function getCanonicalUrl(pathname = '/') {
  return new URL(pathname, getMetadataBase()).toString()
}

export function buildDefaultMetadata(settings: SiteSettings): Metadata {
  const metadataBase = getMetadataBase()
  const title = settings.companyName
  const description = settings.heroDescription

  return {
    metadataBase,
    title: {
      default: title,
      template: `%s | ${settings.companyShortName}`,
    },
    description,
    applicationName: settings.companyName,
    alternates: {
      canonical: '/',
    },
    category: 'business',
    keywords: [
      settings.companyName,
      settings.companyShortName,
      'hafriyat',
      'kazı',
      'damperli nakliyat',
      'lowbed taşımacılık',
      'iş makinesi',
      'şantiye operasyonu',
      settings.serviceArea,
    ],
    ...buildShareMetadata({ title, description, pathname: '/', siteName: settings.companyName }),
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: [
        { url: '/images/sallihogullari-logo-small.png', type: 'image/png' },
      ],
      apple: '/images/sallihogullari-logo-small.png',
    },
  }
}

export function buildOrganizationJsonLd(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.companyName,
    alternateName: settings.companyShortName,
    url: getMetadataBase().toString(),
    logo: getCanonicalUrl('/images/sallihogullari-logo-small.png'),
    image: getCanonicalUrl(DEFAULT_SHARE_IMAGE),
    telephone: settings.contactPhone,
    email: settings.contactEmail,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
      addressCountry: 'TR',
    },
    areaServed: settings.serviceArea,
    sameAs: [settings.instagramUrl].filter(Boolean),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: settings.contactPhone,
        contactType: 'customer support',
        areaServed: 'TR',
        availableLanguage: ['tr'],
      },
    ],
  }
}

export function buildWebsiteJsonLd(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings.companyName,
    url: getMetadataBase().toString(),
    inLanguage: 'tr-TR',
  }
}
