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
  title: 'Saha Çalışmaları ve Referanslar',
  description: 'Gaziantep hafriyat, dolgu, kazı, damperli nakliyat ve şantiye operasyonu çalışmalarını görselleri ve kapsam bilgileriyle inceleyin.',
  alternates: {
    canonical: getCanonicalUrl('/projects'),
  },
  ...buildShareMetadata({
    title: 'Saha Çalışmaları ve Referanslar | Sallıhoğulları',
    description: 'Gaziantep hafriyat, dolgu, kazı, damperli nakliyat ve şantiye operasyonu çalışmalarını görselleri ve kapsam bilgileriyle inceleyin.',
    pathname: '/projects',
  }),
}

export default async function ProjectsPage() {
  const [settings, projects] = await Promise.all([getSiteSettings(), listPublishedProjects()])

  return (
    <SiteFrame settings={settings}>
      <PageHero
        eyebrow="Saha Çalışmaları"
        title="Hafriyat, dolgu ve nakliyat işlerinden çalışma kapsamları"
        description="Kazı, yükleme, damperli nakliyat, dolgu ve zemin hazırlığı süreçlerinin farklı saha ihtiyaçlarında nasıl planlandığını inceleyin."
        image="/images/project-1.jpg"
        primaryCta={{ href: '/contact', label: 'Benzer Bir İş İçin Görüşün' }}
      />
      <ProjectsSection projects={projects} />
      <MediaSection />
      <CTASection settings={settings} />
    </SiteFrame>
  )
}
