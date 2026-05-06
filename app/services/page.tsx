import type { Metadata } from 'next'
import { CTASection } from '@/components/cta-section'
import { PageHero } from '@/components/page-hero'
import { ServicesSection } from '@/components/services-section'
import { SiteFrame } from '@/components/site-frame'
import { WhyUsSection } from '@/components/why-us-section'
import { buildShareMetadata, getCanonicalUrl } from '@/lib/seo'
import { readSettings } from '@/lib/store'

export const metadata: Metadata = {
  title: {
    absolute: 'Hafriyat ve İş Makinesi Hizmetleri | Sallıhoğulları Hafriyat',
  },
  description: 'Hafriyat, temel kazısı, dolgu, damperli nakliyat, lowbed, arazöz, beko loder ve ekskavatör hizmetlerini inceleyin.',
  alternates: {
    canonical: getCanonicalUrl('/services'),
  },
  ...buildShareMetadata({
    title: 'Hafriyat ve İş Makinesi Hizmetleri | Sallıhoğulları Hafriyat',
    description: 'Hafriyat, temel kazısı, dolgu, damperli nakliyat, lowbed, arazöz, beko loder ve ekskavatör hizmetlerini inceleyin.',
    pathname: '/services',
  }),
}

export default async function ServicesPage() {
  const settings = await readSettings()

  return (
    <SiteFrame settings={settings}>
      <PageHero
        title="Kazı, dolgu ve nakliyatta sahaya göre kurulan iş planı"
        description="Temel kazısı, hafriyat nakliyesi, dolgu, damperli nakliyat, lowbed ve arazöz desteğini; sahanın erişimine, zemin durumuna, malzeme türüne ve çalışma takvimine göre planlıyoruz."
        image="/images/excavator.jpg"
        primaryCta={{ href: '/projects', label: 'Yürütülen İşleri İnceleyin' }}
      />
      <ServicesSection cardHref="/contact#iletisim" />
      <WhyUsSection />
      <CTASection settings={settings} />
    </SiteFrame>
  )
}
