import type { Metadata } from 'next'
import { CTASection } from '@/components/cta-section'
import { OperationsModelSection } from '@/components/operations-model-section'
import { PageHero } from '@/components/page-hero'
import { ServiceDecisionGuide } from '@/components/service-decision-guide'
import { ServicesSection } from '@/components/services-section'
import { SiteFrame } from '@/components/site-frame'
import { WhyUsSection } from '@/components/why-us-section'
import { buildShareMetadata, getCanonicalUrl } from '@/lib/seo'
import { getSiteSettings } from '@/lib/settings-service'

export const metadata: Metadata = {
  title: {
    absolute: 'Hafriyat ve İş Makinesi Hizmetleri | Sallıhoğulları Hafriyat',
  },
  description: 'Hafriyat, temel kazısı, dolgu, damperli nakliyat, lowbed, arazöz, beko loder ve ekskavatör hizmetlerini inceleyin.',
  alternates: {
    canonical: getCanonicalUrl('/services'),
  },
  ...buildShareMetadata({
    title: 'Hafriyat ve İş Makinesi Hizmetleri | Sallıhoğulları Hafriyat',
    description: 'Hafriyat, temel kazısı, dolgu, damperli nakliyat, lowbed, arazöz, beko loder ve ekskavatör hizmetlerini inceleyin.',
    pathname: '/services',
  }),
}

export default async function ServicesPage() {
  const settings = await getSiteSettings()

  return (
    <SiteFrame settings={settings}>
      <PageHero
        title="Kazıdan sevkiyata sahada işleyen plan"
        description="Temel kazısı, hafriyat nakliyesi, dolgu, damperli nakliyat, lowbed ve arazöz desteğini sahanın erişimine, zemin durumuna, malzeme türüne ve çalışma takvimine göre planlıyoruz."
        image="/images/excavator.jpg"
        primaryCta={{ href: '/projects', label: 'Saha İşlerini İnceleyin' }}
      />
      <ServicesSection />
      <ServiceDecisionGuide />
      <OperationsModelSection />
      <WhyUsSection />
      <CTASection settings={settings} />
    </SiteFrame>
  )
}
