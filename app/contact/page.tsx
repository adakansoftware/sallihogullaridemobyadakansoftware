import type { Metadata } from 'next'
import { ContactSection } from '@/components/contact-section'
import { CTASection } from '@/components/cta-section'
import { PageHero } from '@/components/page-hero'
import { SiteFrame } from '@/components/site-frame'
import { buildShareMetadata, getCanonicalUrl } from '@/lib/seo'
import { readSettings } from '@/lib/store'

export const metadata: Metadata = {
  title: 'İletişim ve Teklif',
  description: 'Gaziantep hafriyat, dolgu, temel kazısı ve damperli nakliyat işleriniz için Sallıhoğulları Hafriyat ile iletişime geçin, saha bilgisi paylaşın.',
  alternates: {
    canonical: getCanonicalUrl('/contact'),
  },
  ...buildShareMetadata({
    title: 'İletişim ve Teklif | Sallıhoğulları',
    description: 'Gaziantep hafriyat, dolgu, temel kazısı ve damperli nakliyat işleriniz için Sallıhoğulları Hafriyat ile iletişime geçin, saha bilgisi paylaşın.',
    pathname: '/contact',
  }),
}

export default async function ContactPage() {
  const settings = await readSettings()

  return (
    <SiteFrame settings={settings}>
      <PageHero
        eyebrow="İletişim"
        title="Sahanız için net keşif, doğru ekipman ve uygulanabilir plan"
        description="Lokasyon, metraj, malzeme türü ve çalışma takvimini paylaşın; kazı, dolgu veya nakliyat ihtiyacınız için sahaya uygun ekip ve teklif planı çıkaralım."
        image="/images/lowbed.jpg"
        primaryCta={{ href: settings.whatsappUrl, label: 'WhatsApp ile Görüşün' }}
      />
      <ContactSection settings={settings} />
      <CTASection settings={settings} />
    </SiteFrame>
  )
}
