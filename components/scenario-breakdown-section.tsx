import { scenarioBreakdownItems } from '@/lib/site-content'

export function ScenarioBreakdownSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-background to-background" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">Saha Senaryoları</span>
          <h2 className="text-3xl leading-tight font-black text-foreground sm:text-4xl lg:text-5xl">
            Her iş aynı yapıda ilerlemez; bu yüzden <span className="text-primary">senaryoya göre farklı odaklar kuruyoruz</span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Bazı işlerde ağırlık kazıda, bazılarında nakliyatta, bazılarında ise etap geçişindedir. Bu ayrımı baştan yapmak, doğru operasyon
            omurgasını daha hızlı kurmamıza yardımcı olur.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {scenarioBreakdownItems.map((item) => (
            <div key={item.title} className="border border-border/40 bg-card p-8">
              <div className="mb-3 text-xl font-black text-foreground">{item.title}</div>
              <p className="text-sm leading-7 text-muted-foreground">{item.summary}</p>
              <div className="mt-5 space-y-2">
                {item.focus.map((focus) => (
                  <div key={focus} className="border border-border/30 bg-secondary/20 px-4 py-3 text-sm font-medium text-foreground">
                    {focus}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
