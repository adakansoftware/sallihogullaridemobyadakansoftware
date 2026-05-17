import type { Metadata } from 'next'
import { ContactSection } from '@/components/contact-section'
import { CTASection } from '@/components/cta-section'
import { PageHero } from '@/components/page-hero'
import { SiteFrame } from '@/components/site-frame'
import { buildShareMetadata, getCanonicalUrl } from '@/lib/seo'
import { getSiteSettings } from '@/lib/settings-service'

export const metadata: Metadata = {
  title: {
    absolute: 'İletişim | Sallıhoğulları Hafriyat',
  },
  description: 'Hafriyat, temel kazısı, dolgu, nakliyat ve iş makinesi hizmetleri için Sallıhoğulları Hafriyat ile teklif ve iletişim talebi oluşturun.',
  alternates: {
    canonical: getCanonicalUrl('/contact'),
  },
  ...buildShareMetadata({
    title: 'İletişim | Sallıhoğulları Hafriyat',
    description: 'Hafriyat, temel kazısı, dolgu, nakliyat ve iş makinesi hizmetleri için Sallıhoğulları Hafriyat ile teklif ve iletişim talebi oluşturun.',
    pathname: '/contact',
  }),
}

export default async function ContactPage() {
  const settings = await getSiteSettings()

  return (
    <SiteFrame settings={settings}>
      <PageHero
        title="Sahanız için net keşif, doğru ekipman ve uygulanabilir teklif"
        description="Lokasyon, metraj, malzeme türü ve çalışma takvimini paylaşın; kazı, dolgu veya nakliyat ihtiyacınız için sahaya uygun ekip, araç ve teklif planı çıkaralım."
        image="/images/lowbed.jpg"
        primaryCta={{ href: settings.whatsappUrl, label: 'WhatsApp ile Görüşün' }}
      />
      <ContactSection settings={settings} />
      <CTASection settings={settings} />
    </SiteFrame>
  )
}
