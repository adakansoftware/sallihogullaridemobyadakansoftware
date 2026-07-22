import { operationsModelSteps, servicePromises } from '@/lib/site-content'

export function OperationsModelSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-background to-background" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">Operasyon Modeli</span>
            <h2 className="max-w-3xl text-3xl leading-tight font-black text-foreground sm:text-4xl lg:text-5xl">
              İşin neden daha kontrollü ilerlediğini <span className="text-primary">adım adım görün</span>
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Hafriyat ve nakliyat işlerinde başarı çoğu zaman tek bir güçlü araçtan değil; sahayı doğru okumak, ekipmanı doğru eşleştirmek
              ve günlük akışı karıştırmadan yürütmekten gelir.
            </p>

            <div className="mt-10 space-y-4">
              {operationsModelSteps.map((item) => (
                <div key={item.step} className="flex gap-5 border border-border/40 bg-card p-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-primary/10 text-lg font-black text-primary">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            {servicePromises.map((item) => (
              <div key={item.title} className="border border-border/40 bg-card p-8">
                <div className="mb-3 text-xl font-black text-foreground">{item.title}</div>
                <p className="text-sm leading-7 text-muted-foreground">{item.body}</p>
              </div>
            ))}

            <div className="border border-border/40 bg-primary/8 p-8">
              <div className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-primary">Nerede Fark Oluşur?</div>
              <p className="text-base leading-8 text-muted-foreground">
                İşin başlamasından önce kurulan doğru plan, çoğu zaman saha başladıktan sonra çözülemeyen gecikmeleri baştan azaltır.
                Bu nedenle yaklaşımımızın merkezinde daha fazla araç değil, daha doğru kurgu yer alır.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
