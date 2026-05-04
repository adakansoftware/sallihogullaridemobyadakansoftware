import Image from "next/image"
import Link from "next/link"
import { Phone, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { isRealPhoneValue } from "@/lib/contact-utils"
import type { SiteSettings } from "@/lib/store"

export function CTASection({ settings }: { settings: SiteSettings }) {
  const hasPhone = isRealPhoneValue(settings.contactPhone)

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/cta-bg.jpg"
          alt="Hafriyat operasyonu"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-background/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/60" />
      </div>

      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-4 block">
              Sahanız İçin Netleşelim
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-foreground leading-tight mb-6">
              Kazı, dolgu ve nakliyat ihtiyacınızı{" "}
              <span className="text-primary">sahaya uygun iş planına dönüştürelim</span>
            </h2>

            <p className="text-lg text-muted-foreground max-w-lg mb-10 leading-relaxed">
              Lokasyon, metraj, malzeme türü ve çalışma takvimini paylaşın; doğru makine, kamyon ve sevkiyat planını birlikte netleştirelim.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {hasPhone ? (
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 w-full px-8 text-sm uppercase tracking-wider gap-2 sm:w-auto">
                  <a href={`tel:${settings.contactPhone.replace(/\s+/g, '')}`}>
                    <Phone className="w-5 h-5" />
                    Hemen Ara
                  </a>
                </Button>
              ) : null}
              <Button asChild size="lg" variant="outline" className="border-border/50 bg-secondary/30 hover:bg-secondary/50 text-foreground font-bold h-14 w-full px-8 text-sm uppercase tracking-wider gap-2 sm:w-auto">
                <Link href="/contact">
                  Keşif Talebi
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 min-[380px]:grid-cols-2">
            <div className="bg-card/80 backdrop-blur border border-border/40 p-8 text-center">
              <div className="text-4xl lg:text-5xl font-black text-primary mb-2">25+</div>
              <div className="text-sm text-muted-foreground">Saha Tecrübesi</div>
            </div>
            <div className="bg-card/80 backdrop-blur border border-border/40 p-8 text-center">
              <div className="text-4xl lg:text-5xl font-black text-primary mb-2">7/24</div>
              <div className="text-sm text-muted-foreground">Günlük Takip</div>
            </div>
            <div className="bg-card/80 backdrop-blur border border-border/40 p-8 text-center">
              <div className="text-4xl lg:text-5xl font-black text-primary mb-2">Planlı</div>
              <div className="text-sm text-muted-foreground">Planlı Akış</div>
            </div>
            <div className="bg-card/80 backdrop-blur border border-border/40 p-8 text-center">
              <div className="text-4xl lg:text-5xl font-black text-primary mb-2">30+</div>
              <div className="text-sm text-muted-foreground">Araç ve Makine</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
