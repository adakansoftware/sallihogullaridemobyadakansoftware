import { coordinationTriggers } from '@/lib/site-content'

export function CoordinationTriggersSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-background to-background" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">Saha Koordinasyonu</span>
          <h2 className="text-3xl leading-tight font-black text-foreground sm:text-4xl lg:text-5xl">
            İş sürerken ortaya çıkan değişikliklere <span className="text-primary">nasıl cevap verdiğimizi</span> baştan gösteriyoruz
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            İyi plan yalnızca başlangıçta değil, değişim anlarında da kendini belli eder. Bu başlık; sahada en sık karşılaşılan kırılma anlarına
            nasıl yaklaştığımızı açıkça ortaya koyar.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {coordinationTriggers.map((item) => (
            <div key={item.trigger} className="border border-border/40 bg-card p-8">
              <div className="mb-4 text-lg font-black text-foreground">{item.trigger}</div>
              <p className="text-sm leading-7 text-muted-foreground">
                <span className="font-semibold text-primary">Yanıtımız:</span> {item.response}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
