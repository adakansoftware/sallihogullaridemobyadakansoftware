import type { Metadata } from 'next'
import { ServicesSection } from '@/components/services-section'
import { WhyUsSection } from '@/components/why-us-section'
import { CTASection } from '@/components/cta-section'
import { PageHero } from '@/components/page-hero'
import { SiteFrame } from '@/components/site-frame'
import { readSettings } from '@/lib/store'

export const metadata: Metadata = {
  title: 'Hizmetler',
  description: 'Hafriyat, damperli nakliyat, lowbed taşımacılık ve saha operasyon çözümlerimizi inceleyin.',
}

export default async function ServicesPage() {
  const settings = await readSettings()

  return (
    <SiteFrame settings={settings}>
      <PageHero
        eyebrow="Hizmet Alanları"
        title="Hafriyat, taşıma ve saha operasyonlarında kapsamlı çözümler"
        description="Temel kazısı, damperli nakliyat, lowbed sevkiyat ve iş makinesi operasyonlarını tek çatı altında, planlı ve kontrollü şekilde yürütüyoruz."
        image="/images/excavator.jpg"
        primaryCta={{ href: '/projects', label: 'Referans Projeleri İnceleyin' }}
      />
      <ServicesSection />
      <WhyUsSection />
      <CTASection />
    </SiteFrame>
  )
}
