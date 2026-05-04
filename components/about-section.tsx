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
              Sahada işi <span className="text-primary">başından sonuna takip eden ekip</span>
            </h2>

            <div className="space-y-5 leading-relaxed text-muted-foreground">
              <p className="text-lg">
                {settings.foundedYear} yılından bu yana {settings.companyName}, hafriyat, dolgu, kazı ve damperli nakliyat işlerinde sahayı okuyarak hareket eden, işi planlayan ve günlük akışı takip eden bir saha ekibidir.
              </p>
              <p>
                {settings.serviceArea}. Çalışmaya başlamadan önce erişim, yükleme noktası, döküm güzergahı ve sevkiyat temposunu netleştirerek makine ve kamyon organizasyonunu aynı plan içinde kuruyoruz.
              </p>
              <p>
                Müteahhitler, sanayi sahaları, parsel hazırlıkları ve altyapı ekipleri için yalnızca araç yönlendiren değil; sahadaki işin düzenli ilerlemesini takip eden bir çalışma yaklaşımı sunuyoruz.
              </p>
            </div>

            <div className="mt-10 grid gap-6 border-t border-border/30 pt-10 sm:grid-cols-3">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h4 className="mb-1 font-bold text-foreground">İşe Bakışımız</h4>
                <p className="text-xs text-muted-foreground">Saha görülür, erişim ve sevkiyat planı netleşir, iş öyle başlar</p>
              </div>
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center bg-primary/10">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h4 className="mb-1 font-bold text-foreground">Çalışma Düzeni</h4>
                <p className="text-xs text-muted-foreground">Makine, kamyon ve saha ekibi aynı günlük programda ilerler</p>
              </div>
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h4 className="mb-1 font-bold text-foreground">Önceliğimiz</h4>
                <p className="text-xs text-muted-foreground">Net iletişim, düzenli saha akışı ve temiz teslim anlayışı</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 min-[380px]:grid-cols-2">
            <div className="col-span-2 border border-border/40 bg-card p-8">
              <div className="mb-2 text-6xl font-black text-primary lg:text-7xl">25+</div>
              <div className="text-lg font-semibold text-foreground">Sahada Biriken Tecrübe</div>
              <p className="mt-2 text-sm text-muted-foreground">{settings.foundedYear}&apos;dan bu yana farklı ölçeklerde hafriyat, nakliye, dolgu ve şantiye hazırlığı işleri yürütüyoruz.</p>
            </div>
            <div className="border border-border/40 bg-card p-6">
              <div className="mb-1 text-4xl font-black text-primary">30+</div>
              <div className="text-sm text-muted-foreground">Makine ve Nakliye Gücü</div>
            </div>
            <div className="border border-border/40 bg-card p-6">
              <div className="mb-1 text-4xl font-black text-primary">7/24</div>
              <div className="text-sm text-muted-foreground">Günlük İş Takibi</div>
            </div>
            <div className="border border-border/40 bg-card p-6">
              <div className="mb-1 text-4xl font-black text-primary">TR</div>
              <div className="text-sm text-muted-foreground">Bölgesel Hizmet</div>
            </div>
            <div className="border border-border/40 bg-card p-6">
              <div className="mb-1 text-4xl font-black text-primary">%100</div>
              <div className="text-sm text-muted-foreground">Planlı Çalışma</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
