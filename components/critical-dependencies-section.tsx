import { criticalDependencyItems } from '@/lib/site-content'

export function CriticalDependenciesSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-background to-background" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">Kritik Bağımlılıklar</span>
          <h2 className="text-3xl leading-tight font-black text-foreground sm:text-4xl lg:text-5xl">
            İşin gerçek akışını belirleyen <span className="text-primary">gizli bağlantıları</span> görünür kılıyoruz
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Bazı projelerde asıl sorun tek bir iş kaleminde değil, iki farklı akışın birbirine bağlı olmasında ortaya çıkar.
            Bu başlıklar, sahadaki zincir etkilerini daha net okumaya yardımcı olur.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {criticalDependencyItems.map((item) => (
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
