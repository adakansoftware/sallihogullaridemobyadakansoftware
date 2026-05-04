import type { Metadata } from 'next'
import type { SiteSettings } from '@/lib/store'
import { env } from '@/lib/env'

export const DEFAULT_SHARE_IMAGE = '/images/hero-main.jpg'
const SEO_LOCALITY = 'Adana'
const DEFAULT_DESCRIPTION =
  'Sallıhoğulları Hafriyat; Adana merkezli hafriyat, temel kazısı, dolgu, damperli nakliyat, lowbed nakliyat ve arazöz hizmetlerinde saha odaklı çalışır.'

const SEO_KEYWORDS = [
  'Sallıhoğulları Hafriyat',
  'Sallıhoğulları',
  'Adana hafriyat',
  'Adana hafriyat firması',
  'Adana hafriyat nakliyesi',
  'Adana damperli nakliyat',
  'Adana lowbed nakliyat',
  'Adana arazöz',
  'Adana su tankeri',
  'Adana temel kazısı',
  'Adana dolgu işleri',
  'hafriyat',
  'hafriyat nakliyesi',
  'temel kazısı',
  'dolgu işleri',
  'damperli nakliyat',
  'lowbed nakliyat',
  'arazöz',
  'su tankeri',
  'mıcır taşıma',
  'kum taşıma',
  'toprak taşıma',
]

const SEO_SERVICES = [
  'Hafriyat',
  'Temel kazısı',
  'Dolgu işleri',
  'Damperli nakliyat',
  'Hafriyat nakliyesi',
  'Lowbed nakliyat',
  'Arazöz ve su tankeri desteği',
  'Malzeme taşıma',
]

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
      template: `${settings.companyName} | %s`,
    },
    description,
    applicationName: settings.companyName,
    authors: [{ name: settings.companyName }],
    creator: settings.companyName,
    publisher: settings.companyName,
    manifest: '/manifest.webmanifest',
    alternates: {
      canonical: '/',
    },
    category: 'business',
    keywords: Array.from(new Set([settings.companyName, settings.companyShortName, ...SEO_KEYWORDS, settings.serviceArea])),
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
    '@type': ['Organization', 'LocalBusiness', 'HomeAndConstructionBusiness'],
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
      addressLocality: SEO_LOCALITY,
      addressCountry: 'TR',
    },
    areaServed: [
      {
        '@type': 'AdministrativeArea',
        name: SEO_LOCALITY,
      },
      settings.serviceArea,
    ],
    knowsAbout: SEO_SERVICES,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${settings.companyShortName} hizmetleri`,
      itemListElement: SEO_SERVICES.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service,
          areaServed: SEO_LOCALITY,
        },
      })),
    },
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
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': getCanonicalUrl('/services#services'),
    name: `${settings.companyShortName} hizmetleri`,
    itemListElement: SEO_SERVICES.map((service, index) => ({
      '@type': 'Service',
      position: index + 1,
      name: service,
      areaServed: SEO_LOCALITY,
      provider: {
        '@id': getCanonicalUrl('/#organization'),
      },
    })),
  }
}
