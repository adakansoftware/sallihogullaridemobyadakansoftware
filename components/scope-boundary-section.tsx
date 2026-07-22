import { scopeBoundaryItems } from '@/lib/site-content'

export function ScopeBoundarySection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-background to-background" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">Plan Sınırları</span>
          <h2 className="text-3xl leading-tight font-black text-foreground sm:text-4xl lg:text-5xl">
            Hangi bilgiler planı kurar, hangi eksikler işi zorlaştırır <span className="text-primary">açıkça ayırıyoruz</span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Bu ayrım, teklif ve operasyon konuşmasını daha net hale getirir. Böylece hangi başlığın başlangıç verisi, hangisinin saha içi karar,
            hangisinin ise gecikme riski olduğunu baştan görmek mümkün olur.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {scopeBoundaryItems.map((group) => (
            <div key={group.title} className="border border-border/40 bg-card p-8">
              <div className="mb-5 text-xl font-black text-foreground">{group.title}</div>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <div key={item} className="border border-border/30 bg-secondary/20 px-4 py-3 text-sm font-medium text-foreground">
                    {item}
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
