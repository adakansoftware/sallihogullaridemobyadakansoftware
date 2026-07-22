import { siteComplexitySignals } from '@/lib/site-content'

export function SiteComplexitySection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">Saha Karmaşıklığı</span>
          <h2 className="text-3xl leading-tight font-black text-foreground sm:text-4xl lg:text-5xl">
            İşin ne kadar zorlaşabileceğini <span className="text-primary">başlamadan önce okumaya çalışıyoruz</span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Her saha aynı yoğunlukta risk üretmez. Aşağıdaki çerçeve, işin düşük, orta veya yüksek karmaşıklıkta ilerleme ihtimalini
            daha baştan görünür hale getirir.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {siteComplexitySignals.map((item) => (
            <div key={item.title} className="border border-border/40 bg-card p-8">
              <div className="mb-4 text-xl font-black text-foreground">{item.title}</div>
              <div className="space-y-3">
                {item.markers.map((marker) => (
                  <div key={marker} className="border border-border/30 bg-secondary/20 px-4 py-3 text-sm font-medium text-foreground">
                    {marker}
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-border/30 pt-6">
                <p className="text-sm leading-7 text-muted-foreground">{item.meaning}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
