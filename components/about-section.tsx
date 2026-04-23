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
              Türkiye&apos;nin <span className="text-primary">Güvenilir Gücü</span>
            </h2>

            <div className="space-y-5 leading-relaxed text-muted-foreground">
              <p className="text-lg">
                {settings.foundedYear} yılında kurulan {settings.companyName}, güçlü makine parkı ve disiplinli saha organizasyonuyla hafriyat, damperli nakliyat ve ağır taşıma operasyonlarında güvenilir çözüm ortağıdır.
              </p>
              <p>
                {settings.serviceArea}. Operasyon planlamasından sevkiyata kadar her aşamada kontrollü, zamanında ve sahaya uygun bir iş akışı yürütüyoruz.
              </p>
              <p>
                Müteahhitlik firmaları, sanayi bölgeleri ve özel sektör yatırımcıları için altyapı kazısından malzeme nakliyesine kadar uzanan kapsamlı bir hizmet çerçevesi sunuyoruz.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border/30 pt-10">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h4 className="mb-1 font-bold text-foreground">Vizyonumuz</h4>
                <p className="text-xs text-muted-foreground">Sahada güven veren lider çözüm ortağı olmak</p>
              </div>
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center bg-primary/10">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h4 className="mb-1 font-bold text-foreground">Misyonumuz</h4>
                <p className="text-xs text-muted-foreground">Kaliteli, kontrollü ve sürdürülebilir operasyon sunmak</p>
              </div>
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h4 className="mb-1 font-bold text-foreground">Değerlerimiz</h4>
                <p className="text-xs text-muted-foreground">Güven, disiplin, süreklilik</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 border border-border/40 bg-card p-8">
              <div className="mb-2 text-6xl font-black text-primary lg:text-7xl">25+</div>
              <div className="text-lg font-semibold text-foreground">Yıllık Sektör Tecrübesi</div>
              <p className="mt-2 text-sm text-muted-foreground">{settings.foundedYear}&apos;dan bu yana farklı ölçeklerde saha ve taşımacılık operasyonları yönetiyoruz.</p>
            </div>
            <div className="border border-border/40 bg-card p-6">
              <div className="mb-1 text-4xl font-black text-primary">1.200+</div>
              <div className="text-sm text-muted-foreground">Tamamlanan İş</div>
            </div>
            <div className="border border-border/40 bg-card p-6">
              <div className="mb-1 text-4xl font-black text-primary">150+</div>
              <div className="text-sm text-muted-foreground">Uzman Personel</div>
            </div>
            <div className="border border-border/40 bg-card p-6">
              <div className="mb-1 text-4xl font-black text-primary">81</div>
              <div className="text-sm text-muted-foreground">İl Kapsama</div>
            </div>
            <div className="border border-border/40 bg-card p-6">
              <div className="mb-1 text-4xl font-black text-primary">%100</div>
              <div className="text-sm text-muted-foreground">Operasyon Takibi</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
