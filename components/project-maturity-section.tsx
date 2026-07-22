import { projectMaturitySignals } from '@/lib/site-content'

export function ProjectMaturitySection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-background to-background" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">Proje Olgunluğu</span>
          <h2 className="text-3xl leading-tight font-black text-foreground sm:text-4xl lg:text-5xl">
            İşin hangi aşamada olduğunu okuyup <span className="text-primary">doğru hazırlık seviyesini görün</span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Her proje aynı netlikte başlamaz. Bu yüzden sadece “iş var mı” sorusuna değil, projenin ne kadar olgunlaştığına da bakmak gerekir.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {projectMaturitySignals.map((signal) => (
            <div key={signal.title} className="border border-border/40 bg-card p-8">
              <div className="mb-4 text-xl font-black text-foreground">{signal.title}</div>
              <div className="space-y-2">
                {signal.indicators.map((item) => (
                  <div key={item} className="border border-border/30 bg-secondary/20 px-4 py-3 text-sm font-medium text-foreground">
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-border/30 pt-6">
                <p className="text-sm leading-7 text-muted-foreground">{signal.outcome}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
