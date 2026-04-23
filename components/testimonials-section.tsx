"use client"

import { Quote, Star } from 'lucide-react'
import type { SiteSettings } from '@/lib/store'
import { collaborationPrinciples, partnerSectors } from '@/lib/site-content'

export function TestimonialsSection({ settings }: { settings: SiteSettings }) {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-background to-background" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">Çalışma Modeli</span>
          <h2 className="mb-6 text-3xl leading-tight font-black text-foreground sm:text-4xl lg:text-5xl">
            İş birliğini <span className="text-primary">nasıl yürüttüğümüz</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {settings.companyName} ile çalışan ekiplerin sahada en çok ihtiyaç duyduğu netlik, disiplin ve teslim yaklaşımı
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {collaborationPrinciples.map((principle) => (
            <div key={principle.title} className="group border border-border/40 bg-card p-8 transition-colors hover:border-primary/30">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center bg-primary/10">
                  <Quote className="h-5 w-5 text-primary" />
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
              </div>

              <p className="mb-8 leading-relaxed text-foreground/90">&ldquo;{principle.body}&rdquo;</p>

              <div className="flex items-center gap-4 border-t border-border/40 pt-6">
                <div className="flex h-12 w-12 items-center justify-center bg-secondary">
                  <span className="text-lg font-bold text-primary">{principle.title.charAt(0)}</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">{principle.title}</div>
                  <div className="text-sm text-muted-foreground">{principle.accent}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-border/30 pt-12">
          <p className="mb-8 text-center text-sm uppercase tracking-wider text-muted-foreground">Çalıştığımız İş Alanları</p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
            {partnerSectors.map((partner) => (
              <span key={partner} className="text-xl font-bold text-foreground/30 transition-colors hover:text-foreground/50">
                {partner}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
