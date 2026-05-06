import type { Metadata } from 'next'
import { AboutSection } from '@/components/about-section'
import { CTASection } from '@/components/cta-section'
import { PageHero } from '@/components/page-hero'
import { SiteFrame } from '@/components/site-frame'
import { StatsSection } from '@/components/stats-section'
import { TestimonialsSection } from '@/components/testimonials-section'
import { buildShareMetadata, getCanonicalUrl } from '@/lib/seo'
import { readSettings } from '@/lib/store'

export const metadata: Metadata = {
  title: 'Adana Hafriyat Firması Hakkında',
  description: 'Salihoğulları Hafriyat’ın Adana’da hafriyat, dolgu, damperli nakliyat ve saha hazırlığı işlerindeki çalışma düzenini, ekipman planını ve saha yaklaşımını inceleyin.',
  alternates: {
    canonical: getCanonicalUrl('/about'),
  },
  ...buildShareMetadata({
    title: 'Salihoğulları Hafriyat | Adana Hafriyat Firması Hakkında',
    description: 'Salihoğulları Hafriyat’ın Adana’da hafriyat, dolgu, damperli nakliyat ve saha hazırlığı işlerindeki çalışma düzenini, ekipman planını ve saha yaklaşımını inceleyin.',
    pathname: '/about',
  }),
}

export default async function AboutPage() {
  const settings = await readSettings()

  return (
    <SiteFrame settings={settings}>
      <PageHero
        title={`${settings.companyName} saha çalışma anlayışı`}
        description="Hafriyat, dolgu, temel kazısı ve damperli nakliyat işlerinde önce sahayı okuyan, sonra makine-kamyon planını kuran ve günlük akışı takip eden çalışma düzenimizi inceleyin."
        image="/images/project-2.jpg"
        primaryCta={{ href: '/contact', label: 'İş Kapsamını Görüşelim' }}
      />
      <StatsSection />
      <AboutSection settings={settings} />
      <TestimonialsSection settings={settings} />
      <CTASection settings={settings} />
    </SiteFrame>
  )
}
