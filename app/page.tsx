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
  title: 'Adana Hafriyat, Damperli Nakliyat ve Lowbed',
  description: 'Sallıhoğulları Hafriyat; Adana’da temel kazısı, dolgu, damperli nakliyat, lowbed nakliyat, arazöz ve hafriyat nakliyesi için saha odaklı çalışır.',
  alternates: {
    canonical: getCanonicalUrl('/'),
  },
  ...buildShareMetadata({
    title: 'Adana Hafriyat, Damperli Nakliyat ve Lowbed | Sallıhoğulları',
    description: 'Sallıhoğulları Hafriyat; Adana’da temel kazısı, dolgu, damperli nakliyat, lowbed nakliyat, arazöz ve hafriyat nakliyesi için saha odaklı çalışır.',
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
