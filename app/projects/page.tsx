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
  title: {
    absolute: 'Projelerimiz | Sallıhoğulları Hafriyat',
  },
  description: 'Sallıhoğulları Hafriyat’ın tamamlanan hafriyat, temel kazısı, dolgu, nakliyat ve saha hazırlığı çalışmalarını inceleyin.',
  alternates: {
    canonical: getCanonicalUrl('/projects'),
  },
  ...buildShareMetadata({
    title: 'Projelerimiz | Sallıhoğulları Hafriyat',
    description: 'Sallıhoğulları Hafriyat’ın tamamlanan hafriyat, temel kazısı, dolgu, nakliyat ve saha hazırlığı çalışmalarını inceleyin.',
    pathname: '/projects',
  }),
}

export default async function ProjectsPage() {
  const [settings, projects] = await Promise.all([getSiteSettings(), listPublishedProjects()])

  return (
    <SiteFrame settings={settings}>
      <PageHero
        title="Sahada yürütülen hafriyat ve nakliyat işlerinden örnekler"
        description="Temel kazısı, hafriyat nakliyesi, dolgu, damperli sevkiyat ve zemin hazırlığı işlerinde çalışma kapsamının sahaya göre nasıl planlandığını inceleyin."
        image="/images/project-1.jpg"
        primaryCta={{ href: '/contact', label: 'Benzer İş İçin Görüşelim' }}
      />
      <ProjectsSection projects={projects} />
      <MediaSection />
      <CTASection settings={settings} />
    </SiteFrame>
  )
}
