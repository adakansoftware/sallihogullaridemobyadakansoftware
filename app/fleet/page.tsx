import type { Metadata } from 'next'
import { CTASection } from '@/components/cta-section'
import { FleetSection } from '@/components/fleet-section'
import { PageHero } from '@/components/page-hero'
import { SiteFrame } from '@/components/site-frame'
import { WhyUsSection } from '@/components/why-us-section'
import { getCanonicalUrl } from '@/lib/seo'
import { readSettings } from '@/lib/store'

export const metadata: Metadata = {
  title: 'Filo',
  description: 'Ekskavator, damperli kamyon, lowbed ve saha destek araclarindan olusan makine parkimizi inceleyin.',
  alternates: {
    canonical: getCanonicalUrl('/fleet'),
  },
  openGraph: {
    url: getCanonicalUrl('/fleet'),
  },
}

export default async function FleetPage() {
  const settings = await readSettings()

  return (
    <SiteFrame settings={settings}>
      <PageHero
        eyebrow="Makine Parki"
        title="Operasyonu tasiyan guclu arac ve ekipman altyapisi"
        description="Ekskavatorlerden damperli kamyonlara, lowbed cozumlerinden saha destek araclarina kadar isin temposunu kaldiran filomuzu inceleyin."
        image="/images/dump-truck.jpg"
        primaryCta={{ href: '/services', label: 'Hizmet Alanlarini Gorun' }}
      />
      <FleetSection />
      <WhyUsSection />
      <CTASection />
    </SiteFrame>
  )
}
