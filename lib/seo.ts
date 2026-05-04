import type { Metadata } from 'next'
import type { SiteSettings } from '@/lib/store'
import { env } from '@/lib/env'

export const DEFAULT_SHARE_IMAGE = '/images/hero-main.jpg'
const DEFAULT_DESCRIPTION = 'Adana merkezli Sallıhoğulları Hafriyat; hafriyat, dolgu, temel kazısı, damperli nakliyat, low-bed, hafriyat nakliyesi ve malzeme taşıma işleri için saha odaklı çözüm sunar.'

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
  const title = `${settings.companyName} | Adana Hafriyat ve Damperli Nakliyat`
  const description = DEFAULT_DESCRIPTION

  return {
    metadataBase,
    title: {
      default: title,
      template: `%s | ${settings.companyShortName}`,
    },
    description,
    applicationName: settings.companyName,
    authors: [{ name: settings.companyName }],
    creator: settings.companyName,
    publisher: settings.companyName,
    alternates: {
      canonical: '/',
    },
    category: 'business',
    keywords: [
      settings.companyName,
      settings.companyShortName,
      'Adana hafriyat',
      'Adana damperli nakliyat',
      'Adana temel kazısı',
      'Adana dolgu işleri',
      'hafriyat',
      'temel kazısı',
      'altyapı kazıları',
      'dolgu',
      'damperli nakliyat',
      'low-bed taşımacılık',
      'mıcır taşıma',
      'kum taşıma',
      'toprak taşıma',
      'iş makinesi',
      'saha çalışması',
      settings.serviceArea,
    ],
    formatDetection: {
      telephone: false,
      email: false,
      address: false,
    },
    ...buildShareMetadata({ title, description, pathname: '/', siteName: settings.companyName }),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    verification: env.GOOGLE_SITE_VERIFICATION ? { google: env.GOOGLE_SITE_VERIFICATION } : undefined,
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
    '@type': ['Organization', 'LocalBusiness'],
    '@id': getCanonicalUrl('/#organization'),
    name: settings.companyName,
    alternateName: settings.companyShortName,
    url: getMetadataBase().toString(),
    description: DEFAULT_DESCRIPTION,
    logo: getCanonicalUrl('/images/sallihogullari-logo-small.png'),
    image: getCanonicalUrl(DEFAULT_SHARE_IMAGE),
    telephone: settings.contactPhone,
    email: settings.contactEmail,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
      addressLocality: 'Adana',
      addressCountry: 'TR',
    },
    areaServed: [
      {
        '@type': 'AdministrativeArea',
        name: 'Adana',
      },
      settings.serviceArea,
    ],
    openingHours: 'Mo-Sa 07:00-19:00',
    priceRange: 'Teklif ile',
    sameAs: [settings.instagramUrl, settings.whatsappUrl].filter(Boolean),
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
    '@id': getCanonicalUrl('/#website'),
    name: settings.companyName,
    url: getMetadataBase().toString(),
    inLanguage: 'tr-TR',
    publisher: {
      '@id': getCanonicalUrl('/#organization'),
    },
    potentialAction: {
      '@type': 'ContactAction',
      target: getCanonicalUrl('/contact'),
      name: 'Teklif ve saha keşfi talebi',
    },
  }
}

export function buildServicesJsonLd(settings: SiteSettings) {
  const services = [
    'Hafriyat',
    'Temel kazısı',
    'Dolgu işleri',
    'Altyapı kazıları',
    'Damperli nakliyat',
    'Malzeme sevkiyatı',
    'Low-bed taşımacılık',
    'Saha içi taşıma',
  ]

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': getCanonicalUrl('/services#services'),
    name: `${settings.companyShortName} hizmetleri`,
    itemListElement: services.map((service, index) => ({
      '@type': 'Service',
      position: index + 1,
      name: service,
      areaServed: 'Adana',
      provider: {
        '@id': getCanonicalUrl('/#organization'),
      },
    })),
  }
}
