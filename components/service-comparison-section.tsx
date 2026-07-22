import { serviceComparisonRows } from '@/lib/site-content'

export function ServiceComparisonSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">Karşılaştırmalı Bakış</span>
          <h2 className="text-3xl leading-tight font-black text-foreground sm:text-4xl lg:text-5xl">
            Hizmetleri sadece isim olarak değil, <span className="text-primary">sahadaki rolüne göre karşılaştırın</span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Aşağıdaki çerçeve, hangi hizmetin hangi iş karakterinde öne çıktığını ve planlama yükünün ne kadar yoğun olduğunu hızlıca okumayı kolaylaştırır.
          </p>
        </div>

        <div className="overflow-hidden border border-border/40 bg-card">
          <div className="hidden grid-cols-[1.2fr_1.1fr_1.1fr_0.6fr] border-b border-border/30 bg-secondary/20 px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground lg:grid">
            <div>Hizmet</div>
            <div>En Uygun Senaryo</div>
            <div>Sahadaki Belirleyici İhtiyaç</div>
            <div>Planlama Yükü</div>
          </div>

          <div className="divide-y divide-border/30">
            {serviceComparisonRows.map((row) => (
              <div key={row.service} className="grid gap-4 px-6 py-6 lg:grid-cols-[1.2fr_1.1fr_1.1fr_0.6fr] lg:gap-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary lg:hidden">Hizmet</div>
                  <div className="text-base font-bold text-foreground">{row.service}</div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary lg:hidden">En Uygun Senaryo</div>
                  <p className="text-sm leading-7 text-muted-foreground">{row.bestFor}</p>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary lg:hidden">Belirleyici İhtiyaç</div>
                  <p className="text-sm leading-7 text-muted-foreground">{row.siteNeed}</p>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary lg:hidden">Planlama Yükü</div>
                  <span className="inline-flex border border-border/40 bg-secondary/30 px-3 py-2 text-sm font-semibold text-foreground">
                    {row.planningWeight}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
