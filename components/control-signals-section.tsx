import { controlSignalItems } from '@/lib/site-content'

export function ControlSignalsSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">Saha Kontrol Sinyalleri</span>
          <h2 className="text-3xl leading-tight font-black text-foreground sm:text-4xl lg:text-5xl">
            İşin rayında gidip gitmediğini <span className="text-primary">erken okuyan sinyaller</span> tanımlıyoruz
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Sağlıklı saha akışı, çoğu zaman büyük raporlardan önce küçük işaretlerle kendini belli eder. Bu sinyaller, gün içinde neyin normal,
            neyin zorlanma, neyin acil müdahale gerektirdiğini daha görünür hale getirir.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {controlSignalItems.map((item) => (
            <div key={item.title} className="border border-border/40 bg-card p-8">
              <div className="mb-5 text-xl font-black text-foreground">{item.title}</div>
              <div className="space-y-3">
                {item.points.map((point) => (
                  <div key={point} className="border border-border/30 bg-secondary/20 px-4 py-3 text-sm font-medium text-foreground">
                    {point}
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
