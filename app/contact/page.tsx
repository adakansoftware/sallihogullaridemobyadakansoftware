import type { Metadata } from 'next'
import { ContactSection } from '@/components/contact-section'
import { CTASection } from '@/components/cta-section'
import { PageHero } from '@/components/page-hero'
import { SiteFrame } from '@/components/site-frame'
import { readSettings } from '@/lib/store'

export const metadata: Metadata = {
  title: 'İletişim',
  description: 'Teklif, saha planlaması ve operasyon görüşmeleri için bizimle iletişime geçin.',
}

export default async function ContactPage() {
  const settings = await readSettings()

  return (
    <SiteFrame settings={settings}>
      <PageHero
        eyebrow="İletişim"
        title="Teklif, planlama ve operasyon görüşmeleri için bize ulaşın"
        description="Projenizin lokasyonunu, kapsamını ve saha ihtiyaçlarını paylaşın; size uygun operasyon planı ve teklif yapısını birlikte oluşturalım."
        image="/images/lowbed.jpg"
        primaryCta={{ href: settings.whatsappUrl, label: 'WhatsApp ile Ulaşın' }}
      />
      <ContactSection settings={settings} />
      <CTASection />
    </SiteFrame>
  )
}
