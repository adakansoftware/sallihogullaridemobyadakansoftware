import type { Metadata } from 'next'
import { CTASection } from '@/components/cta-section'
import { MediaSection } from '@/components/media-section'
import { PageHero } from '@/components/page-hero'
import { ProjectsSection } from '@/components/projects-section'
import { SiteFrame } from '@/components/site-frame'
import { listPublishedProjects } from '@/lib/project-service'
import { getCanonicalUrl } from '@/lib/seo'
import { getSiteSettings } from '@/lib/settings-service'

export const metadata: Metadata = {
  title: 'Projeler',
  description: 'Tamamlanan hafriyat, kazi, tasima ve saha operasyon projelerimizi detaylariyla inceleyin.',
  alternates: {
    canonical: getCanonicalUrl('/projects'),
  },
  openGraph: {
    url: getCanonicalUrl('/projects'),
  },
}

export default async function ProjectsPage() {
  const [settings, projects] = await Promise.all([getSiteSettings(), listPublishedProjects()])

  return (
    <SiteFrame settings={settings}>
      <PageHero
        eyebrow="Referans Projeler"
        title="Sahada teslim edilmis operasyon kayitlari"
        description="Kazi, nakliye ve zemin hazirligi projelerimizi gorselleri ve saha detaylariyla inceleyin."
        image="/images/project-1.jpg"
        primaryCta={{ href: '/contact', label: 'Benzer Bir Operasyon Planlayin' }}
      />
      <ProjectsSection projects={projects} />
      <MediaSection />
      <CTASection />
    </SiteFrame>
  )
}
