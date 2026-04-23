import type { Metadata } from 'next'
import { AboutSection } from '@/components/about-section'
import { CTASection } from '@/components/cta-section'
import { PageHero } from '@/components/page-hero'
import { SiteFrame } from '@/components/site-frame'
import { StatsSection } from '@/components/stats-section'
import { TestimonialsSection } from '@/components/testimonials-section'
import { getCanonicalUrl } from '@/lib/seo'
import { readSettings } from '@/lib/store'

export const metadata: Metadata = {
  title: 'Hakkimizda',
  description: 'Kurumsal yaklasimimizi, saha disiplinimizi ve operasyon gucumuzu daha yakindan inceleyin.',
  alternates: {
    canonical: getCanonicalUrl('/about'),
  },
  openGraph: {
    url: getCanonicalUrl('/about'),
  },
}

export default async function AboutPage() {
  const settings = await readSettings()

  return (
    <SiteFrame settings={settings}>
      <PageHero
        eyebrow="Kurumsal Profil"
        title={`${settings.companyName} hakkinda`}
        description="Kurulus hikayemiz, saha disiplinimiz ve operasyon yaklasimimizla projelere nasil deger kattigimizi daha yakindan inceleyin."
        image="/images/project-2.jpg"
        primaryCta={{ href: '/contact', label: 'Bizimle Iletisime Gecin' }}
      />
      <StatsSection />
      <AboutSection settings={settings} />
      <TestimonialsSection settings={settings} />
      <CTASection />
    </SiteFrame>
  )
}
