import { kickoffQuestionGroups } from '@/lib/site-content'

export function ProjectKickoffSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">Kickoff Çerçevesi</span>
          <h2 className="text-3xl leading-tight font-black text-foreground sm:text-4xl lg:text-5xl">
            İlk görüşmede doğru soruları sorup <span className="text-primary">işin omurgasını daha baştan kuruyoruz</span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Sağlam başlangıç çoğu zaman daha uzun toplantıdan değil, daha doğru sorulardan gelir. Bu bölüm ilk temas anında hangi başlıkların
            netleştirilmesinin projeyi daha sağlıklı kurguladığını görünür hale getirir.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {kickoffQuestionGroups.map((group) => (
            <div key={group.title} className="border border-border/40 bg-card p-8">
              <div className="mb-5 text-xl font-black text-foreground">{group.title}</div>
              <div className="space-y-3">
                {group.questions.map((question) => (
                  <div key={question} className="border border-border/30 bg-secondary/20 px-4 py-3 text-sm leading-7 text-muted-foreground">
                    {question}
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
