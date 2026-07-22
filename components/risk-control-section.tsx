import { riskControlItems } from '@/lib/site-content'

export function RiskControlSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="mb-14 max-w-3xl">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">Saha Risk Kontrolü</span>
          <h2 className="text-3xl leading-tight font-black text-foreground sm:text-4xl lg:text-5xl">
            İşi sadece planlamıyor, <span className="text-primary">aksamaya yol açan riskleri de baştan okuyoruz</span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Hafriyat ve nakliyat işlerinde gecikmenin büyük kısmı sahada değil, hazırlık aşamasında kaçırılan detaylarda başlar.
            Bu yüzden operasyon yaklaşımımız riskleri iş başladıktan sonra değil, başlamadan önce görünür hale getirmeye dayanır.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {riskControlItems.map((item) => (
            <div key={item.risk} className="border border-border/40 bg-card p-8">
              <div className="mb-3 text-lg font-black text-foreground">{item.risk}</div>
              <p className="text-sm leading-7 text-muted-foreground">
                <span className="font-semibold text-foreground">Sahadaki etkisi:</span> {item.effect}
              </p>
              <div className="mt-5 border-t border-border/30 pt-5">
                <p className="text-sm leading-7 text-muted-foreground">
                  <span className="font-semibold text-primary">Nasıl kontrol ediyoruz:</span> {item.control}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
