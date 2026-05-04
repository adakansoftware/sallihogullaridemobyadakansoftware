import type { Metadata } from 'next'
import { AboutSection } from '@/components/about-section'
import { CTASection } from '@/components/cta-section'
import { PageHero } from '@/components/page-hero'
import { SiteFrame } from '@/components/site-frame'
import { StatsSection } from '@/components/stats-section'
import { TestimonialsSection } from '@/components/testimonials-section'
import { buildShareMetadata, getCanonicalUrl } from '@/lib/seo'
import { readSettings } from '@/lib/store'

export const metadata: Metadata = {
  title: 'Hakkımızda',
  description: 'Sallıhoğulları Hafriyat’ın Adana’te hafriyat, dolgu ve damperli nakliyat işlerindeki saha disiplini, ekipman planı ve çalışma yaklaşımını inceleyin.',
  alternates: {
    canonical: getCanonicalUrl('/about'),
  },
  ...buildShareMetadata({
    title: 'Hakkımızda | Sallıhoğulları',
    description: 'Sallıhoğulları Hafriyat’ın Adana’te hafriyat, dolgu ve damperli nakliyat işlerindeki saha disiplini, ekipman planı ve çalışma yaklaşımını inceleyin.',
    pathname: '/about',
  }),
}

export default async function AboutPage() {
  const settings = await readSettings()

  return (
    <SiteFrame settings={settings}>
      <PageHero
        eyebrow="Firma Profili"
        title={`${settings.companyName} çalışma anlayışı`}
        description="Hafriyat, dolgu ve damperli nakliyat işlerinde sahayı önceden okuyan, doğru makine-kamyon planı kuran ve günlük akışı takip eden çalışma düzenimizi inceleyin."
        image="/images/project-2.jpg"
        primaryCta={{ href: '/contact', label: 'Sahanız İçin Görüşelim' }}
      />
      <StatsSection />
      <AboutSection settings={settings} />
      <TestimonialsSection settings={settings} />
      <CTASection settings={settings} />
    </SiteFrame>
  )
}
