import type { Metadata } from 'next'
import { CTASection } from '@/components/cta-section'
import { PageHero } from '@/components/page-hero'
import { ServicesSection } from '@/components/services-section'
import { SiteFrame } from '@/components/site-frame'
import { WhyUsSection } from '@/components/why-us-section'
import { getCanonicalUrl } from '@/lib/seo'
import { readSettings } from '@/lib/store'

export const metadata: Metadata = {
  title: 'Hizmetler',
  description: 'Hafriyat, damperli nakliyat, lowbed tasimacilik ve saha operasyon cozumlerimizi inceleyin.',
  alternates: {
    canonical: getCanonicalUrl('/services'),
  },
  openGraph: {
    url: getCanonicalUrl('/services'),
  },
}

export default async function ServicesPage() {
  const settings = await readSettings()

  return (
    <SiteFrame settings={settings}>
      <PageHero
        eyebrow="Hizmet Alanlari"
        title="Hafriyat, tasima ve saha operasyonlarinda kapsamli cozumler"
        description="Temel kazisi, damperli nakliyat, lowbed sevkiyat ve is makinesi operasyonlarini tek cati altinda, planli ve kontrollu sekilde yurutuyoruz."
        image="/images/excavator.jpg"
        primaryCta={{ href: '/projects', label: 'Referans Projeleri Inceleyin' }}
      />
      <ServicesSection />
      <WhyUsSection />
      <CTASection />
    </SiteFrame>
  )
}
