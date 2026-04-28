import type { Metadata } from 'next'
import { CTASection } from '@/components/cta-section'
import { PageHero } from '@/components/page-hero'
import { ServicesSection } from '@/components/services-section'
import { SiteFrame } from '@/components/site-frame'
import { WhyUsSection } from '@/components/why-us-section'
import { buildShareMetadata, getCanonicalUrl } from '@/lib/seo'
import { readSettings } from '@/lib/store'

export const metadata: Metadata = {
  title: 'Hizmetler',
  description: 'Hafriyat, kazı, dolgu, damperli nakliyat, lowbed taşımacılık ve şantiye lojistiği hizmetlerini inceleyin.',
  alternates: {
    canonical: getCanonicalUrl('/services'),
  },
  ...buildShareMetadata({
    title: 'Hizmetler | Sallıhoğulları',
    description: 'Hafriyat, kazı, dolgu, damperli nakliyat, lowbed taşımacılık ve şantiye lojistiği hizmetlerini inceleyin.',
    pathname: '/services',
  }),
}

export default async function ServicesPage() {
  const settings = await readSettings()

  return (
    <SiteFrame settings={settings}>
      <PageHero
        eyebrow="Hizmet Alanları"
        title="Hafriyat, taşıma ve saha operasyonlarında kapsamlı çözümler"
        description="Temel kazısı, dolgu, damperli nakliyat, lowbed sevkiyat ve iş makinesi operasyonlarını tek plan içinde, kontrollü şekilde yürütüyoruz."
        image="/images/excavator.jpg"
        primaryCta={{ href: '/projects', label: 'Referans Projeleri İnceleyin' }}
      />
      <ServicesSection />
      <WhyUsSection />
      <CTASection />
    </SiteFrame>
  )
}
