import { firstDaySuccessItems } from '@/lib/site-content'

export function FirstDaySuccessSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">İlk Gün Başarısı</span>
          <h2 className="text-3xl leading-tight font-black text-foreground sm:text-4xl lg:text-5xl">
            İşin ilk gününde neyin doğru gitmesi gerektiğini <span className="text-primary">başlangıçtan önce tarif ediyoruz</span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Sahadaki ilk gün çoğu zaman tüm operasyonun tonunu belirler. Bu yüzden ilk saatlerde doğru kurgu, yalnızca verimi değil sonraki günlerin
            düzeltme ihtiyacını da doğrudan etkiler.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {firstDaySuccessItems.map((item) => (
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
