import type { Metadata } from 'next'
import { AboutSection } from '@/components/about-section'
import { StatsSection } from '@/components/stats-section'
import { TestimonialsSection } from '@/components/testimonials-section'
import { CTASection } from '@/components/cta-section'
import { PageHero } from '@/components/page-hero'
import { SiteFrame } from '@/components/site-frame'
import { readSettings } from '@/lib/store'

export const metadata: Metadata = {
  title: 'Hakkımızda',
  description: 'Kurumsal yaklaşımımızı, saha disiplinimizi ve operasyon gücümüzü daha yakından inceleyin.',
}

export default async function AboutPage() {
  const settings = await readSettings()

  return (
    <SiteFrame settings={settings}>
      <PageHero
        eyebrow="Kurumsal Profil"
        title={`${settings.companyName} hakkında`}
        description="Kuruluş hikayemiz, saha disiplinimiz ve operasyon yaklaşımımızla projelere nasıl değer kattığımızı daha yakından inceleyin."
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
