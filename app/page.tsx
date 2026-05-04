import type { Metadata } from 'next'
import { CTASection } from '@/components/cta-section'
import { FloatingWhatsApp } from '@/components/floating-whatsapp'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/hero'
import { Navbar } from '@/components/navbar'
import { ProjectsSection } from '@/components/projects-section'
import { ServicesSection } from '@/components/services-section'
import { StatsSection } from '@/components/stats-section'
import { WhyUsSection } from '@/components/why-us-section'
import { buildShareMetadata, getCanonicalUrl } from '@/lib/seo'
import { readProjects, readSettings } from '@/lib/store'

export const metadata: Metadata = {
  title: 'Adana Hafriyat ve Damperli Nakliyat',
  description: 'Adana merkezli Sallıhoğulları Hafriyat ile temel kazısı, dolgu, damperli nakliyat, malzeme taşıma ve hafriyat nakliyesi hizmetlerini inceleyin.',
  alternates: {
    canonical: getCanonicalUrl('/'),
  },
  ...buildShareMetadata({
    title: 'Adana Hafriyat ve Damperli Nakliyat | Sallıhoğulları',
    description: 'Adana merkezli Sallıhoğulları Hafriyat ile temel kazısı, dolgu, damperli nakliyat, malzeme taşıma ve hafriyat nakliyesi hizmetlerini inceleyin.',
    pathname: '/',
  }),
}

export default async function Home() {
  const [settings, projects] = await Promise.all([readSettings(), readProjects()])

  return (
    <main className="min-h-screen">
      <Navbar settings={settings} />
      <Hero settings={settings} />
      <StatsSection />
      <ServicesSection />
      <ProjectsSection projects={projects} />
      <WhyUsSection />
      <CTASection settings={settings} />
      <FloatingWhatsApp settings={settings} />
      <Footer settings={settings} />
    </main>
  )
}
