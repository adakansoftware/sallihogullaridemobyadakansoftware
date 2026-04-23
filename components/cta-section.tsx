"use client"

import Image from "next/image"
import Link from "next/link"
import { Phone, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/cta-bg.jpg"
          alt="Hafriyat operasyonu"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/60" />
      </div>
      
      {/* Accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
      
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-4 block">
              Projeniz İçin Hazırız
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-foreground leading-tight mb-6">
              Güçlü Ekipman,{" "}
              <span className="text-primary">Güvenilir Çözümler</span>
            </h2>

            <p className="text-lg text-muted-foreground max-w-lg mb-10 leading-relaxed">
              Hafriyat, taşımacılık ve iş makinesi ihtiyaçlarınız için hemen bizimle iletişime geçin. 
              Ücretsiz keşif ve rekabetçi fiyat teklifi sunalım.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 px-8 text-sm uppercase tracking-wider gap-2"
              >
                <a href="tel:+902125550000">
                  <Phone className="w-5 h-5" />
                  Hemen Ara
                </a>
              </Button>
              <Button 
                asChild
                size="lg" 
                variant="outline" 
                className="border-border/50 bg-secondary/30 hover:bg-secondary/50 text-foreground font-bold h-14 px-8 text-sm uppercase tracking-wider gap-2"
              >
                <Link href="/contact">
                  Online Teklif Al
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card/80 backdrop-blur border border-border/40 p-8 text-center">
              <div className="text-4xl lg:text-5xl font-black text-primary mb-2">%100</div>
              <div className="text-sm text-muted-foreground">Müşteri Memnuniyeti</div>
            </div>
            <div className="bg-card/80 backdrop-blur border border-border/40 p-8 text-center">
              <div className="text-4xl lg:text-5xl font-black text-primary mb-2">7/24</div>
              <div className="text-sm text-muted-foreground">Destek Hattı</div>
            </div>
            <div className="bg-card/80 backdrop-blur border border-border/40 p-8 text-center">
              <div className="text-4xl lg:text-5xl font-black text-primary mb-2">1.200+</div>
              <div className="text-sm text-muted-foreground">Başarılı Proje</div>
            </div>
            <div className="bg-card/80 backdrop-blur border border-border/40 p-8 text-center">
              <div className="text-4xl lg:text-5xl font-black text-primary mb-2">85+</div>
              <div className="text-sm text-muted-foreground">Araç Filosu</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
