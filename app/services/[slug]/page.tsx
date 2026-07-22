import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CTASection } from '@/components/cta-section'
import { PageHero } from '@/components/page-hero'
import { SiteFrame } from '@/components/site-frame'
import { buildShareMetadata, getCanonicalUrl } from '@/lib/seo'
import { findServiceBySlug, getServiceHref, serviceDetails } from '@/lib/services-data'
import { getSiteSettings } from '@/lib/settings-service'

type ServiceDetailPageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return serviceDetails.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const service = findServiceBySlug(slug)

  if (!service) {
    return {}
  }

  return {
    title: {
      absolute: `${service.title} | Sallıhoğulları Hafriyat`,
    },
    description: service.metaDescription,
    alternates: {
      canonical: getCanonicalUrl(getServiceHref(service.slug)),
    },
    ...buildShareMetadata({
      title: `${service.title} | Sallıhoğulları Hafriyat`,
      description: service.metaDescription,
      pathname: getServiceHref(service.slug),
    }),
  }
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params
  const service = findServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  const settings = await getSiteSettings()

  return (
    <SiteFrame settings={settings}>
      <PageHero
        title={service.title}
        description={service.description}
        image={service.image}
        primaryCta={{ href: '/contact', label: 'Teklif ve Keşif Talebi Oluşturun' }}
      />

      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />
        <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
          <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-8">
              <div className="glass-card p-8 lg:p-10">
                <div className="section-eyebrow mb-4">Hizmet Detayı</div>
                <h2 className="text-3xl font-black text-foreground sm:text-4xl">{service.title}</h2>
                <p className="mt-6 text-lg leading-8 text-muted-foreground">{service.description}</p>
                <p className="mt-6 text-base leading-8 text-muted-foreground">{service.scope}</p>
                <p className="mt-6 text-base leading-8 text-muted-foreground">
                  Sahadaki erişim koşulları, günlük iş programı, makine-kamyon dengesi ve teslim temposu birlikte değerlendirilerek uygulamaya uygun çalışma planı oluşturulur.
                </p>
              </div>

              <div className="glass-card p-8 lg:p-10">
                <div className="section-eyebrow mb-4">Bu Hizmet Nerelerde Tercih Edilir?</div>
                <div className="grid gap-4 md:grid-cols-3">
                  {service.useCases.map((item) => (
                    <div key={item} className="rounded-2xl border border-border/50 bg-card/60 p-5">
                      <div className="text-sm font-semibold leading-6 text-foreground">{item}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-8 lg:p-10">
                <div className="section-eyebrow mb-4">İşleyiş Adımları</div>
                <div className="grid gap-4">
                  {service.process.map((step, index) => (
                    <div key={step} className="flex gap-4 rounded-2xl border border-border/50 bg-card/60 p-5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-black text-primary">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-7 text-muted-foreground">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="glass-card p-8">
                <div className="section-eyebrow mb-4">Operasyon Başlıkları</div>
                <div className="grid gap-3">
                  {service.highlights.map((highlight) => (
                    <div key={highlight} className="rounded-2xl border border-border/50 bg-card/60 px-4 py-4 text-sm font-medium text-foreground">
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-8">
                <div className="section-eyebrow mb-4">İşleyiş</div>
                <p className="text-sm leading-7 text-muted-foreground">
                  Lokasyon, metraj, malzeme türü ve çalışma takvimi paylaşıldıktan sonra doğru ekipman, sevkiyat düzeni ve günlük saha akışı netleştirilir.
                </p>
              </div>

              <div className="glass-card p-8">
                <div className="section-eyebrow mb-4">Neden Bu Yaklaşım?</div>
                <p className="text-sm leading-7 text-muted-foreground">
                  Plansız başlayan hafriyat ve nakliyat işleri çoğu zaman kamyon beklemesi, eksik ekipman yönlendirmesi veya sahada tekrar eden işlere neden olur.
                  Daha kapsamlı planlama yaklaşımımız, işin başında doğru kurguyu oluşturarak uygulama sırasında daha kontrollü ilerleme sağlar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection settings={settings} />
    </SiteFrame>
  )
}
