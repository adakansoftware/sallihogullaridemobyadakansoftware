import type { Metadata } from 'next'
import { CTASection } from '@/components/cta-section'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/hero'
import { Navbar } from '@/components/navbar'
import { PageTransition } from '@/components/page-transition'
import { ProjectsSection } from '@/components/projects-section'
import { ServicesSection } from '@/components/services-section'
import { StatsSection } from '@/components/stats-section'
import { WhyUsSection } from '@/components/why-us-section'
import { getCanonicalUrl } from '@/lib/seo'
import { readProjects, readSettings } from '@/lib/store'

export const metadata: Metadata = {
  title: 'Ana Sayfa',
  description: 'Premium hafriyat, damperli nakliyat ve saha operasyon cozumlerimizi guclu gorseller ve referans projelerle kesfedin.',
  alternates: {
    canonical: getCanonicalUrl('/'),
  },
  openGraph: {
    url: getCanonicalUrl('/'),
  },
}

export default async function Home() {
  const [settings, projects] = await Promise.all([readSettings(), readProjects()])

  return (
    <main className="min-h-screen">
      <Navbar settings={settings} />
      <PageTransition>
        <Hero settings={settings} />
        <StatsSection />
        <ServicesSection />
        <ProjectsSection projects={projects} />
        <WhyUsSection />
        <CTASection />
      </PageTransition>
      <Footer settings={settings} />
    </main>
  )
}
