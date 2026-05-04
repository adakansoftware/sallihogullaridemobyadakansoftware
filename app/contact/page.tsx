import type { Metadata } from 'next'
import { ContactSection } from '@/components/contact-section'
import { CTASection } from '@/components/cta-section'
import { PageHero } from '@/components/page-hero'
import { SiteFrame } from '@/components/site-frame'
import { buildShareMetadata, getCanonicalUrl } from '@/lib/seo'
import { readSettings } from '@/lib/store'

export const metadata: Metadata = {
  title: 'Adana Hafriyat Teklifi ve İletişim',
  description: 'Adana’da hafriyat, temel kazısı, dolgu, damperli nakliyat, lowbed nakliyat veya arazöz ihtiyacınız için Sallıhoğulları Hafriyat ile iletişime geçin.',
  alternates: {
    canonical: getCanonicalUrl('/contact'),
  },
  ...buildShareMetadata({
    title: 'Adana Hafriyat Teklifi ve İletişim | Sallıhoğulları',
    description: 'Adana’da hafriyat, temel kazısı, dolgu, damperli nakliyat, lowbed nakliyat veya arazöz ihtiyacınız için Sallıhoğulları Hafriyat ile iletişime geçin.',
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
