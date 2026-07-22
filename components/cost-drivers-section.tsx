import { costDriverItems } from '@/lib/site-content'

export function CostDriversSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">Maliyet Sürücüleri</span>
          <h2 className="text-3xl leading-tight font-black text-foreground sm:text-4xl lg:text-5xl">
            Teklifi ve saha planını en çok <span className="text-primary">hangi değişkenlerin etkilediğini</span> açıkça gösteriyoruz
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Fiyat ve plan çoğu zaman tek bir rakamdan değil, birkaç kritik saha değişkeninin birleşiminden doğar. Bu bölüm, teklifin neden
            yüzeysel değil sahaya göre hazırlanması gerektiğini somutlaştırır.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {costDriverItems.map((item) => (
            <div key={item.title} className="border border-border/40 bg-card p-8">
              <div className="mb-4 text-xl font-black text-foreground">{item.title}</div>
              <p className="text-sm leading-7 text-muted-foreground">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
