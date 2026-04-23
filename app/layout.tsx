import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { buildDefaultMetadata, buildOrganizationJsonLd, buildWebsiteJsonLd } from '@/lib/seo'
import { readSettings } from '@/lib/store'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  return buildDefaultMetadata(await readSettings())
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await readSettings()
  const organizationJsonLd = buildOrganizationJsonLd(settings)
  const websiteJsonLd = buildWebsiteJsonLd(settings)

  return (
    <html lang="tr" className="bg-background" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
