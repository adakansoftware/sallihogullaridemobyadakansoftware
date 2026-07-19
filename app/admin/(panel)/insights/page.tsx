import Link from 'next/link'
import { AlertTriangle, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react'
import { getAdminInsights, getAdminInsightsSummary } from '@/lib/admin-insights'

const severityClasses = {
  high: 'border-red-400/20 bg-red-400/8 text-red-200',
  medium: 'border-amber-400/20 bg-amber-400/8 text-amber-200',
  low: 'border-sky-400/20 bg-sky-400/8 text-sky-200',
}

const severityLabels = {
  high: 'Yüksek',
  medium: 'Orta',
  low: 'Düşük',
}

export default async function AdminInsightsPage() {
  const [insights, summary] = await Promise.all([getAdminInsights(), getAdminInsightsSummary()])

  return (
    <div className="space-y-6">
      <div>
        <div className="section-eyebrow mb-4">Operasyon Uyarıları</div>
        <h1 className="font-display text-4xl text-white sm:text-5xl md:text-6xl">İçgörüler</h1>
        <p className="mt-3 max-w-3xl text-white/60">
          Panel, içerik ve filo verilerinden türetilen risk ve aksiyon noktalarını tek yerde toplayın.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="admin-kpi rounded-[24px] p-5">
          <div className="data-label text-white/45">Toplam Uyarı</div>
          <div className="mt-3 text-4xl text-white">{summary.total}</div>
        </div>
        <div className="admin-kpi rounded-[24px] p-5">
          <div className="data-label text-white/45">Yüksek</div>
          <div className="mt-3 text-4xl text-red-300">{summary.high}</div>
        </div>
        <div className="admin-kpi rounded-[24px] p-5">
          <div className="data-label text-white/45">Orta</div>
          <div className="mt-3 text-4xl text-amber-300">{summary.medium}</div>
        </div>
        <div className="admin-kpi rounded-[24px] p-5">
          <div className="data-label text-white/45">Düşük</div>
          <div className="mt-3 text-4xl text-sky-300">{summary.low}</div>
        </div>
      </div>

      <div className="admin-surface rounded-[32px] p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-4xl text-white">Aksiyon Listesi</h2>
          <Link href="/admin" className="text-amber-300 hover:text-amber-200">Dashboard&apos;a Dön</Link>
        </div>

        <div className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.id} className="admin-surface-muted rounded-[24px] p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-lg font-medium text-white">{insight.title}</div>
                    <span className={`rounded-full border px-3 py-1 text-xs ${severityClasses[insight.severity]}`}>
                      {severityLabels[insight.severity]}
                    </span>
                  </div>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-white/60">{insight.description}</p>
                  <div className="mt-4 text-sm text-white/45">Gösterge: {insight.stat}</div>
                </div>

                <Link href={insight.href} className="btn-ghost-premium inline-flex h-11 items-center gap-2 px-5">
                  İncele
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}

          {insights.length === 0 ? (
            <div className="rounded-[24px] border border-emerald-400/15 bg-emerald-400/8 p-10 text-center text-emerald-200">
              <Sparkles className="mx-auto mb-4 h-6 w-6" />
              Şu an öne çıkan operasyon uyarısı görünmüyor.
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="admin-surface rounded-[32px] p-6">
          <div className="mb-4 flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-amber-300" />
            <h2 className="text-2xl text-white">Neden Önemli?</h2>
          </div>
          <p className="text-sm leading-7 text-white/60">
            Bu alan yalnızca ham veriyi listelemek yerine, panelde birikmiş operasyon risklerini görünür kılar.
            Böylece hangi sayfaya önce müdahale etmeniz gerektiği daha net hale gelir.
          </p>
        </div>

        <div className="admin-surface rounded-[32px] p-6">
          <div className="mb-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-300" />
            <h2 className="text-2xl text-white">İleri Adım</h2>
          </div>
          <p className="text-sm leading-7 text-white/60">
            Sonraki aşamada bu içgörüler için filtre, çözüm durumu ve otomatik temizlik aksiyonları da eklenebilir.
          </p>
        </div>
      </div>
    </div>
  )
}
