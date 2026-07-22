import type { Metadata } from 'next'
import { AboutSection } from '@/components/about-section'
import { CTASection } from '@/components/cta-section'
import { OperationsModelSection } from '@/components/operations-model-section'
import { PageHero } from '@/components/page-hero'
import { SiteFrame } from '@/components/site-frame'
import { StatsSection } from '@/components/stats-section'
import { TestimonialsSection } from '@/components/testimonials-section'
import { buildShareMetadata, getCanonicalUrl } from '@/lib/seo'
import { getSiteSettings } from '@/lib/settings-service'

export const metadata: Metadata = {
  title: {
    absolute: 'Hakkımızda | Sallıhoğulları Hafriyat',
  },
  description: 'Sallıhoğulları Hafriyat’ın hafriyat, temel kazısı, dolgu, nakliyat ve iş makinesi hizmetlerindeki saha tecrübesini inceleyin.',
  alternates: {
    canonical: getCanonicalUrl('/about'),
  },
  ...buildShareMetadata({
    title: 'Hakkımızda | Sallıhoğulları Hafriyat',
    description: 'Sallıhoğulları Hafriyat’ın hafriyat, temel kazısı, dolgu, nakliyat ve iş makinesi hizmetlerindeki saha tecrübesini inceleyin.',
    pathname: '/about',
  }),
}

export default async function AboutPage() {
  const settings = await getSiteSettings()

  return (
    <SiteFrame settings={settings}>
      <PageHero
        title={`${settings.companyName} saha çalışma disiplini`}
        description="Hafriyat, temel kazısı, dolgu ve damperli nakliyat işlerinde sahayı önceden okuyup makine, kamyon ve sevkiyat planını aynı iş akışında yöneten çalışma düzenimizi inceleyin."
        image="/images/project-2.jpg"
        primaryCta={{ href: '/contact', label: 'Saha İhtiyacını Görüşelim' }}
      />
      <StatsSection />
      <AboutSection settings={settings} />
      <OperationsModelSection />
      <TestimonialsSection settings={settings} />
      <CTASection settings={settings} />
    </SiteFrame>
  )
}
