import { goNoGoSignals } from '@/lib/site-content'

export function GoNoGoSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">Başla / Netleştir</span>
          <h2 className="text-3xl leading-tight font-black text-foreground sm:text-4xl lg:text-5xl">
            İşin hemen başlayıp başlayamayacağını <span className="text-primary">erken sinyallerle ayırıyoruz</span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Her proje aynı hızla mobilize edilmez. Bazı işler için saha hazırdır, bazıları içinse önce birkaç kritik belirsizliğin çözülmesi gerekir.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {goNoGoSignals.map((group) => (
            <div key={group.title} className="border border-border/40 bg-card p-8">
              <div className="mb-5 text-xl font-black text-foreground">{group.title}</div>
              <div className="space-y-3">
                {group.signals.map((signal) => (
                  <div key={signal} className="border border-border/30 bg-secondary/20 px-4 py-3 text-sm font-medium text-foreground">
                    {signal}
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-border/30 pt-6">
                <p className="text-sm leading-7 text-muted-foreground">{group.decision}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
