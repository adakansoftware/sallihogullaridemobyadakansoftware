import type { Metadata } from 'next'
import { CTASection } from '@/components/cta-section'
import { MediaSection } from '@/components/media-section'
import { PageHero } from '@/components/page-hero'
import { ProjectsSection } from '@/components/projects-section'
import { SiteFrame } from '@/components/site-frame'
import { listPublishedProjects } from '@/lib/project-service'
import { buildShareMetadata, getCanonicalUrl } from '@/lib/seo'
import { getSiteSettings } from '@/lib/settings-service'

export const metadata: Metadata = {
  title: 'Projeler',
  description: 'Hafriyat, kazı, dolgu, nakliye ve saha operasyonu örneklerini görselleri ve kapsam bilgileriyle inceleyin.',
  alternates: {
    canonical: getCanonicalUrl('/projects'),
  },
  ...buildShareMetadata({
    title: 'Projeler | Sallıhoğulları',
    description: 'Hafriyat, kazı, dolgu, nakliye ve saha operasyonu örneklerini görselleri ve kapsam bilgileriyle inceleyin.',
    pathname: '/projects',
  }),
}

export default async function ProjectsPage() {
  const [settings, projects] = await Promise.all([getSiteSettings(), listPublishedProjects()])

  return (
    <SiteFrame settings={settings}>
      <PageHero
        eyebrow="Referans Projeler"
        title="Sahada yürütülen operasyon örnekleri"
        description="Kazı, nakliye ve zemin hazırlığı işlerini görselleri, lokasyonları ve saha kapsamlarıyla inceleyin."
        image="/images/project-1.jpg"
        primaryCta={{ href: '/contact', label: 'Benzer Bir Operasyon Planlayın' }}
      />
      <ProjectsSection projects={projects} />
      <MediaSection />
      <CTASection />
    </SiteFrame>
  )
}
