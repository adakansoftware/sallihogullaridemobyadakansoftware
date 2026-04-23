import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { StatsSection } from '@/components/stats-section'
import { ServicesSection } from '@/components/services-section'
import { ProjectsSection } from '@/components/projects-section'
import { WhyUsSection } from '@/components/why-us-section'
import { CTASection } from '@/components/cta-section'
import { Footer } from '@/components/footer'
import { PageTransition } from '@/components/page-transition'
import { readProjects, readSettings } from '@/lib/store'

export const metadata: Metadata = {
  title: 'Ana Sayfa',
  description: 'Premium hafriyat, damperli nakliyat ve saha operasyon çözümlerimizi güçlü görseller ve referans projelerle keşfedin.',
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
