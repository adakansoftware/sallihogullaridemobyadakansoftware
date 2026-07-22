import { rapidAssessmentItems } from '@/lib/site-content'

export function RapidAssessmentSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-background to-background" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">Hızlı Ön Teşhis</span>
          <h2 className="text-3xl leading-tight font-black text-foreground sm:text-4xl lg:text-5xl">
            İşi ilk konuşmada daha doğru okumak için <span className="text-primary">hangi sırayla baktığımızı</span> gösteriyoruz
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Doğru ön değerlendirme, uzun analizden çok doğru sırayla sorulan birkaç kritik soruya dayanır. Bu çerçeve, ilk temasın
            nasıl daha verimli hale geldiğini gösterir.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {rapidAssessmentItems.map((item) => (
            <div key={item.title} className="border border-border/40 bg-card p-8">
              <div className="mb-5 text-xl font-black text-foreground">{item.title}</div>
              <div className="space-y-3">
                {item.points.map((point) => (
                  <div key={point} className="border border-border/30 bg-secondary/20 px-4 py-3 text-sm font-medium text-foreground">
                    {point}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
