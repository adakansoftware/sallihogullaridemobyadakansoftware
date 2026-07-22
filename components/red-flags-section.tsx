import { redFlagItems } from '@/lib/site-content'

export function RedFlagsSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-background to-background" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">Kırmızı Bayraklar</span>
          <h2 className="text-3xl leading-tight font-black text-foreground sm:text-4xl lg:text-5xl">
            İşi başlamadan zorlaştırabilecek <span className="text-primary">erken uyarı işaretlerini</span> netleştiriyoruz
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Bazı detaylar küçük görünür ama sahada asıl kırılma onlardan gelir. Bu başlıklar, hangi durumda önce netlik gerektiğini daha açık hale getirir.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {redFlagItems.map((item) => (
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
