import type { Metadata } from 'next'
import { CTASection } from '@/components/cta-section'
import { FleetSection } from '@/components/fleet-section'
import { PageHero } from '@/components/page-hero'
import { SiteFrame } from '@/components/site-frame'
import { WhyUsSection } from '@/components/why-us-section'
import { buildShareMetadata, getCanonicalUrl } from '@/lib/seo'
import { readSettings } from '@/lib/store'

export const metadata: Metadata = {
  title: 'Filo',
  description: 'Ekskavatör, damperli kamyon, lowbed ve saha destek araçlarından oluşan makine parkını inceleyin.',
  alternates: {
    canonical: getCanonicalUrl('/fleet'),
  },
  ...buildShareMetadata({
    title: 'Filo | Sallıhoğulları',
    description: 'Ekskavatör, damperli kamyon, lowbed ve saha destek araçlarından oluşan makine parkını inceleyin.',
    pathname: '/fleet',
  }),
}

export default async function FleetPage() {
  const settings = await readSettings()

  return (
    <SiteFrame settings={settings}>
      <PageHero
        eyebrow="Makine Parkı"
        title="Operasyonu taşıyan güçlü araç ve ekipman altyapısı"
        description="Ekskavatörlerden damperli kamyonlara, lowbed çözümlerinden saha destek araçlarına kadar işin temposunu taşıyan filomuzu inceleyin."
        image="/images/dump-truck.jpg"
        primaryCta={{ href: '/services', label: 'Hizmet Alanlarını Görün' }}
      />
      <FleetSection />
      <WhyUsSection />
      <CTASection />
    </SiteFrame>
  )
}
