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
  title: 'Adana Hafriyat ve Nakliyat İşleri',
  description: 'Adana’da hafriyat, temel kazısı, dolgu, damperli nakliyat ve saha hazırlığı kapsamında yürütülen iş örneklerini ve çalışma kapsamlarını inceleyin.',
  alternates: {
    canonical: getCanonicalUrl('/projects'),
  },
  ...buildShareMetadata({
    title: 'Salihoğulları Hafriyat | Adana Hafriyat ve Nakliyat İşleri',
    description: 'Adana’da hafriyat, temel kazısı, dolgu, damperli nakliyat ve saha hazırlığı kapsamında yürütülen iş örneklerini ve çalışma kapsamlarını inceleyin.',
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
