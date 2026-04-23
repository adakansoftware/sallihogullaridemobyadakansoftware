"use client"

import Image from 'next/image'
import { fleetItems, fleetStats } from '@/lib/site-content'

export function FleetSection() {
  return (
    <section id="filo" className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-background to-background" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">Araç Filomuz</span>
          <h2 className="mb-6 text-3xl leading-tight font-black text-foreground sm:text-4xl lg:text-5xl">
            Güçlü <span className="text-primary">Makine Parkı</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Saha tipine göre konumlanan iş makineleri ve taşıma altyapısıyla operasyon temposunu kesintiye uğratmadan ilerletiyoruz.
          </p>
        </div>

        <div className="mb-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {fleetStats.map((stat) => (
            <div key={stat.label} className="border border-border/40 bg-card p-6 text-center">
              <div className="mb-1 text-3xl font-black text-primary lg:text-4xl">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {fleetItems.map((item) => (
            <div key={item.name} className="group hover-lift relative overflow-hidden border border-border/40 bg-card">
              <div className="flex flex-col lg:flex-row">
                <div className="relative h-64 w-full shrink-0 lg:h-auto lg:w-1/2">
                  <Image src={item.image} alt={item.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 hidden bg-gradient-to-r from-transparent to-background/80 lg:block" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent lg:hidden" />

                  <div className="absolute top-4 left-4 bg-primary px-4 py-2 text-primary-foreground">
                    <span className="text-2xl font-black">{item.count}</span>
                    <span className="ml-1 text-xs font-medium">Adet</span>
                  </div>
                </div>

                <div className="flex flex-col justify-center p-6 lg:p-8">
                  <div className="mb-3 flex items-center gap-3">
                    <h3 className="text-xl font-black text-foreground lg:text-2xl">{item.name}</h3>
                    <span className="bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">{item.capacity}</span>
                  </div>

                  <p className="mb-5 leading-relaxed text-muted-foreground">{item.description}</p>

                  <div>
                    <span className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">Markalar</span>
                    <div className="flex flex-wrap gap-2">
                      {item.specs.map((spec) => (
                        <span key={spec} className="bg-secondary px-3 py-1.5 text-xs font-medium text-foreground">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
