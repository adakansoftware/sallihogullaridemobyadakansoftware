import type { Metadata } from 'next'
import { CTASection } from '@/components/cta-section'
import { FleetSection } from '@/components/fleet-section'
import { PageHero } from '@/components/page-hero'
import { SiteFrame } from '@/components/site-frame'
import { WhyUsSection } from '@/components/why-us-section'
import { buildShareMetadata, getCanonicalUrl } from '@/lib/seo'
import { readSettings } from '@/lib/store'

export const metadata: Metadata = {
  title: 'Adana Makine Parkı ve Damperli Kamyon Filosu',
  description: 'Sumitomo ekskavatör, Hidromek beko loder, Mercedes Arocs/Axor damperli kamyon, lowbed ve Ford 2524 arazöz / su tankeri filosunu inceleyin.',
  alternates: {
    canonical: getCanonicalUrl('/fleet'),
  },
  ...buildShareMetadata({
    title: 'Adana Makine Parkı ve Damperli Kamyon Filosu | Sallıhoğulları',
    description: 'Sumitomo ekskavatör, Hidromek beko loder, Mercedes Arocs/Axor damperli kamyon, lowbed ve Ford 2524 arazöz / su tankeri filosunu inceleyin.',
    pathname: '/fleet',
  }),
}

export default async function FleetPage() {
  const settings = await readSettings()

  return (
    <SiteFrame settings={settings}>
      <PageHero
        eyebrow="Makine Parkı"
        title="Saha ihtiyacına göre yönlendirilen makine ve kamyon altyapısı"
        description="Ekskavatör, beko loder, damperli kamyon, lowbed ve arazöz / su tankeri desteğiyle kazı, yükleme, taşıma ve saha düzenleme işlerini aynı operasyon planında ele alıyoruz."
        image="/images/dump-truck.jpg"
        primaryCta={{ href: '/services', label: 'Hizmet Kapsamını Görün' }}
      />
      <FleetSection />
      <WhyUsSection />
      <CTASection settings={settings} />
    </SiteFrame>
  )
}
