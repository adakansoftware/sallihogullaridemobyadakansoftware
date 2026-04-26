"use client"

import { Target, Award, Users } from 'lucide-react'
import type { SiteSettings } from '@/lib/store'

export function AboutSection({ settings }: { settings: SiteSettings }) {
  return (
    <section id="hakkimizda" className="relative overflow-hidden bg-secondary/20 py-24 lg:py-32">
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">Hakkımızda</span>
            <h2 className="mb-6 text-3xl leading-tight font-black text-foreground sm:text-4xl lg:text-5xl">
              Sahada <span className="text-primary">güven veren iş disiplini</span>
            </h2>

            <div className="space-y-5 leading-relaxed text-muted-foreground">
              <p className="text-lg">
                {settings.foundedYear} yılından bu yana {settings.companyName}, hafriyat, kazı, dolgu ve damperli nakliyat işlerinde planlı saha yönetimiyle çalışan bir çözüm ortağıdır.
              </p>
              <p>
                {settings.serviceArea}. İşin kapsamına göre makine, kamyon ve ekip koordinasyonunu aynı takvim içinde kurarak sahadaki akışı netleştiriyoruz.
              </p>
              <p>
                Müteahhitlik firmaları, sanayi sahaları, altyapı ekipleri ve özel sektör yatırımları için zemin hazırlığından malzeme sevkiyatına kadar kontrollü bir operasyon çerçevesi sunuyoruz.
              </p>
            </div>

            <div className="mt-10 grid gap-6 border-t border-border/30 pt-10 sm:grid-cols-3">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h4 className="mb-1 font-bold text-foreground">Yaklaşımımız</h4>
                <p className="text-xs text-muted-foreground">İşe başlamadan önce net saha planı</p>
              </div>
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center bg-primary/10">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h4 className="mb-1 font-bold text-foreground">Çalışma Tarzı</h4>
                <p className="text-xs text-muted-foreground">Kontrollü, zamanında ve takip edilebilir iş akışı</p>
              </div>
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h4 className="mb-1 font-bold text-foreground">Değerlerimiz</h4>
                <p className="text-xs text-muted-foreground">Güven, disiplin, açık iletişim</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 min-[380px]:grid-cols-2">
            <div className="col-span-2 border border-border/40 bg-card p-8">
              <div className="mb-2 text-6xl font-black text-primary lg:text-7xl">25+</div>
              <div className="text-lg font-semibold text-foreground">Yıllık Saha Deneyimi</div>
              <p className="mt-2 text-sm text-muted-foreground">{settings.foundedYear}&apos;dan bu yana farklı ölçeklerde hafriyat, nakliye ve şantiye lojistiği işleri yürütüyoruz.</p>
            </div>
            <div className="border border-border/40 bg-card p-6">
              <div className="mb-1 text-4xl font-black text-primary">85+</div>
              <div className="text-sm text-muted-foreground">Araç ve Makine</div>
            </div>
            <div className="border border-border/40 bg-card p-6">
              <div className="mb-1 text-4xl font-black text-primary">7/24</div>
              <div className="text-sm text-muted-foreground">Operasyon Takibi</div>
            </div>
            <div className="border border-border/40 bg-card p-6">
              <div className="mb-1 text-4xl font-black text-primary">TR</div>
              <div className="text-sm text-muted-foreground">Proje Bazlı Hizmet</div>
            </div>
            <div className="border border-border/40 bg-card p-6">
              <div className="mb-1 text-4xl font-black text-primary">%100</div>
              <div className="text-sm text-muted-foreground">Saha Planı Odağı</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
