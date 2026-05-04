import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { FloatingWhatsApp } from '@/components/floating-whatsapp'
import { PageTransition } from '@/components/page-transition'
import type { SiteSettings } from '@/lib/store'

export function SiteFrame({ settings, children }: { settings: SiteSettings; children: React.ReactNode }) {
  return (
    <main className="min-h-screen">
      <Navbar settings={settings} />
      <PageTransition>{children}</PageTransition>
      <FloatingWhatsApp settings={settings} />
      <Footer settings={settings} />
    </main>
  )
}
