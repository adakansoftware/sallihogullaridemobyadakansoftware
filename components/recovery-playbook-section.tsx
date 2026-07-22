import { recoveryPlaybookItems } from '@/lib/site-content'

export function RecoveryPlaybookSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-background to-background" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">Toparlama Kılavuzu</span>
          <h2 className="text-3xl leading-tight font-black text-foreground sm:text-4xl lg:text-5xl">
            Plan zorlandığında <span className="text-primary">nasıl yeniden denge kurduğumuzu</span> açıkça gösteriyoruz
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            İyi operasyon sadece sorunsuz başlayabilen değil, zorlandığında hızlı toparlanabilen operasyondur. Bu kılavuz, aksama anında nasıl sadeleştiğimizi gösterir.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {recoveryPlaybookItems.map((item) => (
            <div key={item.title} className="border border-border/40 bg-card p-8">
              <div className="mb-5 text-xl font-black text-foreground">{item.title}</div>
              <div className="space-y-3">
                {item.steps.map((step) => (
                  <div key={step} className="border border-border/30 bg-secondary/20 px-4 py-3 text-sm font-medium text-foreground">
                    {step}
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
