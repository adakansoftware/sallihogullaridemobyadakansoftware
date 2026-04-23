import type { Metadata } from 'next'
import { ContactSection } from '@/components/contact-section'
import { CTASection } from '@/components/cta-section'
import { PageHero } from '@/components/page-hero'
import { SiteFrame } from '@/components/site-frame'
import { getCanonicalUrl } from '@/lib/seo'
import { readSettings } from '@/lib/store'

export const metadata: Metadata = {
  title: 'Iletisim',
  description: 'Teklif, saha planlamasi ve operasyon gorusmeleri icin bizimle iletisime gecin.',
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
        eyebrow="Iletisim"
        title="Teklif, planlama ve operasyon gorusmeleri icin bize ulasin"
        description="Projenizin lokasyonunu, kapsamini ve saha ihtiyaclarini paylasin; size uygun operasyon plani ve teklif yapisini birlikte olusturalim."
        image="/images/lowbed.jpg"
        primaryCta={{ href: settings.whatsappUrl, label: 'WhatsApp ile Ulasin' }}
      />
      <ContactSection settings={settings} />
      <CTASection />
    </SiteFrame>
  )
}
