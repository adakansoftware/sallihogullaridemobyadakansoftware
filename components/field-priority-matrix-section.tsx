import { fieldPriorityMatrix } from '@/lib/site-content'

export function FieldPriorityMatrixSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-background to-background" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">Saha Öncelik Matrisi</span>
          <h2 className="text-3xl leading-tight font-black text-foreground sm:text-4xl lg:text-5xl">
            Sahada neyin önce çözüleceğini <span className="text-primary">rastgele değil, sırayla tanımlıyoruz</span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Doğru sıra kurulmadığında ekipman güçlü olsa bile iş akışı zayıflar. Bu matris, başlangıçta hangi başlığın neden daha kritik olduğunu gösterir.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
          {fieldPriorityMatrix.map((item, index) => (
            <div key={item.title} className="border border-border/40 bg-card p-8">
              <div className="mb-4 text-sm font-black text-primary">0{index + 1}</div>
              <div className="mb-3 text-xl font-black text-foreground">{item.title}</div>
              <p className="text-sm leading-7 text-muted-foreground">{item.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
