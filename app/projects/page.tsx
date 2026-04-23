import type { Metadata } from 'next'
import { CTASection } from '@/components/cta-section'
import { MediaSection } from '@/components/media-section'
import { PageHero } from '@/components/page-hero'
import { ProjectsSection } from '@/components/projects-section'
import { SiteFrame } from '@/components/site-frame'
import { listPublishedProjects } from '@/lib/project-service'
import { getSiteSettings } from '@/lib/settings-service'

export const metadata: Metadata = {
  title: 'Projeler',
  description: 'Tamamlanan hafriyat, kazı, taşıma ve saha operasyon projelerimizi detaylarıyla inceleyin.',
}

export default async function ProjectsPage() {
  const [settings, projects] = await Promise.all([getSiteSettings(), listPublishedProjects()])

  return (
    <SiteFrame settings={settings}>
      <PageHero
        eyebrow="Referans Projeler"
        title="Sahada teslim edilmiş operasyon kayıtları"
        description="Kazı, nakliye ve zemin hazırlığı projelerimizi görselleri ve saha detaylarıyla inceleyin."
        image="/images/project-1.jpg"
        primaryCta={{ href: '/contact', label: 'Benzer Bir Operasyon Planlayın' }}
      />
      <ProjectsSection projects={projects} />
      <MediaSection />
      <CTASection />
    </SiteFrame>
  )
}
