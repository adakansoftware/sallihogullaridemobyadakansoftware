import { serviceDecisionGuides } from '@/lib/site-content'

export function ServiceDecisionGuide() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="mb-14 max-w-3xl">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">Hizmet Seçim Rehberi</span>
          <h2 className="text-3xl leading-tight font-black text-foreground sm:text-4xl lg:text-5xl">
            Hangi iş için <span className="text-primary">hangi kombinasyonun doğru olduğunu</span> daha net görün
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Bazı işlerde tek bir hizmet yeterli olurken bazı sahalarda doğru sonuç, birkaç operasyon başlığının birlikte planlanmasıyla alınır.
            Aşağıdaki çerçeve, işin karakterine göre hangi yaklaşımın daha doğru olduğunu hızlıca görmenizi sağlar.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {serviceDecisionGuides.map((guide) => (
            <div key={guide.title} className="border border-border/40 bg-card p-8">
              <div className="mb-4 text-lg font-black text-foreground">{guide.title}</div>
              <p className="text-sm leading-7 text-muted-foreground">{guide.summary}</p>

              <div className="mt-6">
                <div className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-primary">Önerilen Hizmetler</div>
                <div className="flex flex-wrap gap-2">
                  {guide.recommended.map((item) => (
                    <span key={item} className="border border-border/40 bg-secondary/40 px-3 py-2 text-sm font-medium text-foreground">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-border/30 pt-6">
                <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">Planlamada Öncelik</div>
                <p className="text-sm leading-7 text-muted-foreground">{guide.focus}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
