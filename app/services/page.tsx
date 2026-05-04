import type { Metadata } from 'next'
import { CTASection } from '@/components/cta-section'
import { PageHero } from '@/components/page-hero'
import { ServicesSection } from '@/components/services-section'
import { SiteFrame } from '@/components/site-frame'
import { WhyUsSection } from '@/components/why-us-section'
import { buildShareMetadata, getCanonicalUrl } from '@/lib/seo'
import { readSettings } from '@/lib/store'

export const metadata: Metadata = {
  title: 'Adana Hafriyat ve Nakliyat Hizmetleri',
  description: 'Adana’da hafriyat, temel kazısı, dolgu işleri, damperli nakliyat, lowbed nakliyat, arazöz ve su tankeri hizmet kapsamlarını inceleyin.',
  alternates: {
    canonical: getCanonicalUrl('/services'),
  },
  ...buildShareMetadata({
    title: 'Sallıhoğulları Hafriyat | Adana Hafriyat ve Nakliyat Hizmetleri',
    description: 'Adana’da hafriyat, temel kazısı, dolgu işleri, damperli nakliyat, lowbed nakliyat, arazöz ve su tankeri hizmet kapsamlarını inceleyin.',
    pathname: '/services',
  }),
}

export default async function ServicesPage() {
  const settings = await readSettings()

  return (
    <SiteFrame settings={settings}>
      <PageHero
        eyebrow="Hizmet Alanları"
        title="Kazıdan sevkiyata kadar sahada işleyen net operasyon düzeni"
        description="Temel kazısı, hafriyat nakliyesi, dolgu, damperli nakliyat, lowbed nakliyat ve arazöz desteğini sahanın erişim, zemin ve zaman ihtiyacına göre planlıyoruz."
        image="/images/excavator.jpg"
        primaryCta={{ href: '/projects', label: 'Saha Çalışmalarını İnceleyin' }}
      />
      <ServicesSection />
      <WhyUsSection />
      <CTASection settings={settings} />
    </SiteFrame>
  )
}
