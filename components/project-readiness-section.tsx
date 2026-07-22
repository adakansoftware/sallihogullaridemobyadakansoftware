import { projectReadinessBlocks, quoteReadinessChecklist } from '@/lib/site-content'

export function ProjectReadinessSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-background to-background" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">Proje Hazırlığı</span>
            <h2 className="text-3xl leading-tight font-black text-foreground sm:text-4xl lg:text-5xl">
              Sağlıklı teklif ve güçlü başlangıç için <span className="text-primary">hangi bilgilerin kritik olduğunu</span> netleştirin
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Doğru teklif çoğu zaman daha fazla bilgi istemekten değil, doğru bilgiyi istemekten doğar. Aşağıdaki çerçeve; ilk görüşmede
              hangi başlıkların işi hızlandırdığını ve planın hangi aşamalarda güç kazandığını açıkça gösterir.
            </p>

            <div className="mt-10 space-y-4">
              {projectReadinessBlocks.map((item) => (
                <div key={item.title} className="border border-border/40 bg-card p-6">
                  <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-border/40 bg-card p-8 lg:p-10">
            <div className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-primary">İlk Görüşme Kontrol Listesi</div>
            <div className="space-y-3">
              {quoteReadinessChecklist.map((item, index) => (
                <div key={item} className="flex gap-4 border border-border/30 bg-secondary/20 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-primary/10 text-sm font-black text-primary">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-7 text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
