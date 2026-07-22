import { quoteConfidenceBands } from '@/lib/site-content'

export function QuoteConfidenceSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">Teklif Güveni</span>
          <h2 className="text-3xl leading-tight font-black text-foreground sm:text-4xl lg:text-5xl">
            Hangi noktada daha sağlam teklif verilebildiğini <span className="text-primary">şeffaf biçimde gösteriyoruz</span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Her teklif aynı netlik seviyesinde hazırlanmaz. Aşağıdaki bantlar, veri kalitesi arttıkça planın ve teklifin neden daha güvenli hale geldiğini açıkça gösterir.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {quoteConfidenceBands.map((band) => (
            <div key={band.title} className="border border-border/40 bg-card p-8">
              <div className="mb-4 text-xl font-black text-foreground">{band.title}</div>
              <div className="space-y-3">
                {band.signals.map((signal) => (
                  <div key={signal} className="border border-border/30 bg-secondary/20 px-4 py-3 text-sm font-medium text-foreground">
                    {signal}
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-border/30 pt-6">
                <p className="text-sm leading-7 text-muted-foreground">{band.result}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
