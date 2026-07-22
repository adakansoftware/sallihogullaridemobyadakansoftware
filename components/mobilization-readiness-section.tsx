import { mobilizationReadinessSteps } from '@/lib/site-content'

export function MobilizationReadinessSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">Mobilizasyon Hazırlığı</span>
          <h2 className="text-3xl leading-tight font-black text-foreground sm:text-4xl lg:text-5xl">
            Sahaya çıkmadan önce <span className="text-primary">hangi eşiğin geçilmesi gerektiğini</span> netleştiriyoruz
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Doğru mobilizasyon, yalnızca araç hazırlığı değil; karar kalitesinin yeterli seviyeye gelmesi demektir. Bu adımlar, sahaya çıkmadan
            önce hangi netliğin oluşması gerektiğini açıkça gösterir.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
          {mobilizationReadinessSteps.map((item, index) => (
            <div key={item.title} className="border border-border/40 bg-card p-8">
              <div className="mb-4 text-sm font-black text-primary">0{index + 1}</div>
              <div className="mb-3 text-xl font-black text-foreground">{item.title}</div>
              <p className="text-sm leading-7 text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
