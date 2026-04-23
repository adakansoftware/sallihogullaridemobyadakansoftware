"use client"

import { siteStats } from '@/lib/site-content'

export function StatsSection() {
  return (
    <section className="relative overflow-hidden border-y border-border/30 py-6">
      <div className="absolute inset-0 bg-secondary/40" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-8 lg:justify-between lg:gap-4">
          {siteStats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-4 px-4">
              <div className="text-4xl font-black tracking-tight text-primary lg:text-5xl">{stat.value}</div>
              <div className="flex flex-col">
                <span className="text-sm font-bold uppercase tracking-wide text-foreground">{stat.label}</span>
                <span className="text-xs text-muted-foreground">{stat.sublabel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
