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
  title: 'Gaziantep Hafriyat ve Damperli Nakliyat',
  description: 'Gaziantep merkezli Sallıhoğulları Hafriyat ile temel kazısı, dolgu, damperli nakliyat, malzeme sevkiyatı ve şantiye lojistiği hizmetlerini inceleyin.',
  alternates: {
    canonical: getCanonicalUrl('/'),
  },
  ...buildShareMetadata({
    title: 'Gaziantep Hafriyat ve Damperli Nakliyat | Sallıhoğulları',
    description: 'Gaziantep merkezli Sallıhoğulları Hafriyat ile temel kazısı, dolgu, damperli nakliyat, malzeme sevkiyatı ve şantiye lojistiği hizmetlerini inceleyin.',
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
