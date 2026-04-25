import type { Metadata } from 'next'
import { ContactSection } from '@/components/contact-section'
import { CTASection } from '@/components/cta-section'
import { PageHero } from '@/components/page-hero'
import { SiteFrame } from '@/components/site-frame'
import { getCanonicalUrl } from '@/lib/seo'
import { readSettings } from '@/lib/store'

export const metadata: Metadata = {
  title: 'İletişim',
  description: 'Teklif, saha keşfi, hafriyat, damperli nakliyat ve operasyon planlaması için Sallıhoğulları ile iletişime geçin.',
  alternates: {
    canonical: getCanonicalUrl('/contact'),
  },
  openGraph: {
    url: getCanonicalUrl('/contact'),
  },
}

export default async function ContactPage() {
  const settings = await readSettings()

  return (
    <SiteFrame settings={settings}>
      <PageHero
        eyebrow="İletişim"
        title="Teklif, planlama ve saha görüşmeleri için bize ulaşın"
        description="Projenizin lokasyonunu, kapsamını ve saha ihtiyaçlarını paylaşın; uygun ekipman, sevkiyat ve teklif yapısını birlikte netleştirelim."
        image="/images/lowbed.jpg"
        primaryCta={{ href: settings.whatsappUrl, label: 'WhatsApp ile Ulaşın' }}
      />
      <ContactSection settings={settings} />
      <CTASection />
    </SiteFrame>
  )
}
