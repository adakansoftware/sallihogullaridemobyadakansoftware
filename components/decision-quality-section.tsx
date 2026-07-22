import { decisionQualityItems } from '@/lib/site-content'

export function DecisionQualitySection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-background to-background" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">Karar Kalitesi</span>
          <h2 className="text-3xl leading-tight font-black text-foreground sm:text-4xl lg:text-5xl">
            Daha iyi başlangıcın temelinde <span className="text-primary">daha kaliteli karar verisi</span> olduğunu görün
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Sahada başarıyı yalnızca ekipman gücü değil, başlangıçta verilen kararların kalitesi belirler. Bu çerçeve; neyin kararı güçlendirdiğini,
            neyin zayıflattığını ve iyi sonucun hangi zeminde üretildiğini gösterir.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {decisionQualityItems.map((item) => (
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
