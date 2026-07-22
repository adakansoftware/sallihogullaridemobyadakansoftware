import { endOfDayReviewItems } from '@/lib/site-content'

export function EndOfDayReviewSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-background to-background" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">Gün Sonu Değerlendirmesi</span>
          <h2 className="text-3xl leading-tight font-black text-foreground sm:text-4xl lg:text-5xl">
            Sahayı sadece başlatmayı değil, <span className="text-primary">gün sonunda doğru okumayı da</span> önemsiyoruz
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Bir günün sonunda doğru soru sorulmazsa aynı sorun ertesi gün yeniden yaşanır. Bu değerlendirme başlıkları, sahadaki öğrenmeyi bir
            sonraki güne taşımaya yardımcı olur.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {endOfDayReviewItems.map((item) => (
            <div key={item.title} className="border border-border/40 bg-card p-8">
              <div className="mb-4 text-lg font-black text-foreground">{item.title}</div>
              <p className="text-sm leading-7 text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
