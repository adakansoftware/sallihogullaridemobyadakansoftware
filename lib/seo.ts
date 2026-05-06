import type { Metadata } from 'next'
import type { SiteSettings } from '@/lib/store'
import { env } from '@/lib/env'

export const DEFAULT_SHARE_IMAGE = '/images/hero-main.jpg'
const SEO_BRAND = 'Sallıhoğulları Hafriyat'
const SEO_LOCALITY = 'Adana'
const DEFAULT_DESCRIPTION =
  'Sallıhoğulları Hafriyat; hafriyat, temel kazısı, dolgu, damperli nakliyat, lowbed taşımacılık, arazöz, beko loder, ekskavatör ve iş makinesi hizmetleri sunar.'

const BRAND_ALIASES = [
  'Sallıhoğulları Hafriyat',
  'Sallihogullari Hafriyat',
  'Sallihogullari',
  'Salihoğulları Hafriyat',
  'Salihoğulları',
  'Salihogullari Hafriyat',
  'Salihogullari',
]

const SEO_KEYWORDS = [
  ...BRAND_ALIASES,
  'Adana hafriyat',
  'Adana hafriyat firması',
  'Adana hafriyat nakliyesi',
  'Adana damperli nakliyat',
  'Adana lowbed nakliyat',
  'Adana arazöz',
  'Adana su tankeri',
  'Adana temel kazısı',
  'Adana dolgu işleri',
  'Adana iş makinesi hizmetleri',
  'Adana ekskavatör hizmeti',
  'Adana beko loder hizmeti',
  'Adana inşaat sahası hazırlığı',
  'hafriyat',
  'hafriyat nakliyesi',
  'temel kazısı',
  'dolgu işleri',
  'damperli nakliyat',
  'lowbed taşımacılık',
  'arazöz',
  'su tankeri',
  'beko loder hizmeti',
  'ekskavatör hizmeti',
  'iş makinesi hizmetleri',
  'inşaat sahası hazırlığı',
  'moloz ve hafriyat taşıma',
  'mıcır taşıma',
  'kum taşıma',
  'toprak taşıma',
]

const SEO_SERVICES = [
  'Hafriyat Hizmeti',
  'Temel Kazısı',
  'Dolgu ve Zemin Hazırlığı',
  'Damperli Nakliyat',
  'Lowbed Taşımacılık',
  'Arazöz Hizmeti',
  'Beko Loder Hizmeti',
  'Ekskavatör Hizmeti',
  'İş Makinesi Hizmetleri',
  'İnşaat Sahası Hazırlığı',
  'Moloz ve Hafriyat Taşıma',
]

const SEO_AREAS = ['Adana', 'Hatay', 'Antakya', 'İskenderun', 'Osmaniye', 'Mersin']

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
  const title = `${SEO_BRAND} | Hafriyat, Temel Kazısı ve İş Makinesi Hizmetleri`
  const description = DEFAULT_DESCRIPTION

  return {
    metadataBase,
    title: {
      default: title,
      template: `${SEO_BRAND} | %s`,
    },
    description,
    applicationName: SEO_BRAND,
    authors: [{ name: SEO_BRAND }],
    creator: SEO_BRAND,
    publisher: SEO_BRAND,
    manifest: '/manifest.webmanifest',
    alternates: {
      canonical: '/',
    },
    category: 'business',
    keywords: Array.from(new Set([SEO_BRAND, settings.companyName, settings.companyShortName, ...SEO_KEYWORDS, settings.serviceArea])),
    formatDetection: {
      telephone: false,
      email: false,
      address: false,
    },
    ...buildShareMetadata({ title, description, pathname: '/', siteName: SEO_BRAND }),
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
        { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
        { url: '/icon.png', sizes: '192x192', type: 'image/png' },
      ],
      apple: '/apple-icon.png',
    },
  }
}

export function buildOrganizationJsonLd(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness', 'HomeAndConstructionBusiness'],
    '@id': getCanonicalUrl('/#organization'),
    name: SEO_BRAND,
    url: getMetadataBase().toString(),
    description: DEFAULT_DESCRIPTION,
    legalName: SEO_BRAND,
    slogan: 'Hafriyat, temel kazısı ve iş makinesi hizmetleri',
    foundingDate: settings.foundedYear,
    identifier: SEO_BRAND,
    keywords: SEO_KEYWORDS,
    alternateName: Array.from(new Set([settings.companyShortName, settings.companyName, ...BRAND_ALIASES])),
    logo: getCanonicalUrl('/images/salihogullari-logo-small.png'),
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
      ...SEO_AREAS.map((area) => ({
        '@type': 'AdministrativeArea',
        name: area,
      })),
      settings.serviceArea,
    ],
    knowsAbout: SEO_SERVICES,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${SEO_BRAND} hizmetleri`,
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
        contactType: 'sales',
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
    name: SEO_BRAND,
    alternateName: BRAND_ALIASES,
    url: getMetadataBase().toString(),
    inLanguage: 'tr-TR',
    publisher: {
      '@id': getCanonicalUrl('/#organization'),
    },
    potentialAction: {
      '@type': 'ContactAction',
      target: getCanonicalUrl('/contact'),
      name: 'Hafriyat ve iş makinesi hizmetleri için teklif talebi',
    },
  }
}

export function buildServicesJsonLd(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': getCanonicalUrl('/services#services'),
    name: `${SEO_BRAND} hizmetleri`,
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
