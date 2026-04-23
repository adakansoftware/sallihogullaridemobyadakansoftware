import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { readSettings } from '@/lib/store'
import './globals.css'

function getMetadataBase() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!siteUrl) {
    return new URL('http://localhost:3000')
  }

  try {
    return new URL(siteUrl)
  } catch {
    return new URL('http://localhost:3000')
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await readSettings()
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
    keywords: [
      settings.companyName,
      'hafriyat',
      'kazı',
      'damperli nakliyat',
      'lowbed taşımacılık',
      'iş makinesi',
      'şantiye operasyonu',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'tr_TR',
      siteName: settings.companyName,
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
    icons: {
      icon: [
        { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
        { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      apple: '/apple-icon.png',
    },
  }
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className="bg-background" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

