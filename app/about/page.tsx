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
  description: 'Sallıhoğulları Hafriyat’ın saha disiplini, çalışma yaklaşımı ve hafriyat-nakliyat operasyon gücünü inceleyin.',
  alternates: {
    canonical: getCanonicalUrl('/about'),
  },
  ...buildShareMetadata({
    title: 'Hakkımızda | Sallıhoğulları',
    description: 'Sallıhoğulları Hafriyat’ın saha disiplini, çalışma yaklaşımı ve hafriyat-nakliyat operasyon gücünü inceleyin.',
    pathname: '/about',
  }),
}

export default async function AboutPage() {
  const settings = await readSettings()

  return (
    <SiteFrame settings={settings}>
      <PageHero
        eyebrow="Kurumsal Profil"
        title={`${settings.companyName} hakkında`}
        description="Saha deneyimimiz, planlama disiplinimiz ve işin temposuna göre kurduğumuz operasyon yaklaşımını yakından inceleyin."
        image="/images/project-2.jpg"
        primaryCta={{ href: '/contact', label: 'Bizimle İletişime Geçin' }}
      />
      <StatsSection />
      <AboutSection settings={settings} />
      <TestimonialsSection settings={settings} />
      <CTASection />
    </SiteFrame>
  )
}
