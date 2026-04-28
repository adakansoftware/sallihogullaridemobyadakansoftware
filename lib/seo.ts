import type { Metadata } from 'next'
import type { SiteSettings } from '@/lib/store'

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
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'tr_TR',
      siteName: settings.companyName,
      url: metadataBase.toString(),
      images: [
        {
          url: '/images/hero-main.jpg',
          width: 1600,
          height: 900,
          alt: settings.companyName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/hero-main.jpg'],
    },
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
    image: getCanonicalUrl('/images/hero-main.jpg'),
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
