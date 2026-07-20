import Link from 'next/link'
import { AlertTriangle, FolderKanban, Mail, ShieldAlert, Truck } from 'lucide-react'
import { AdminOperationsBoard } from '@/components/admin/AdminOperationsBoard'
import { getAdminOperationsCenter } from '@/lib/admin-operations'

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'Tarih yok'
    : date.toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' })
}

function scoreTone(score: number) {
  if (score >= 85) return 'text-emerald-300'
  if (score >= 65) return 'text-amber-300'
  return 'text-red-300'
}

export default async function AdminOperationsPage() {
  const { snapshot, issues, summary } = await getAdminOperationsCenter()

  const cards = [
    {
      label: 'Proje Riski',
      value:
        snapshot.projectHealth.publishedWithoutMedia.length +
        snapshot.projectHealth.publishedWithoutSummary.length +
        snapshot.projectHealth.staleDrafts.length +
        snapshot.projectHealth.stalePublished.length,
      icon: FolderKanban,
    },
    {
      label: 'Mesaj Kuyruğu',
      value: snapshot.messageQueue.unread24h.length,
      icon: Mail,
    },
    {
      label: 'Filo Uyarısı',
      value:
        snapshot.fleetHealth.countMismatch.length +
        snapshot.fleetHealth.duplicateSpecs.length +
        snapshot.fleetHealth.missingImages.length,
      icon: Truck,
    },
    {
      label: 'Denetim Riski',
      value: snapshot.auditHealth.failedOrRejected7d.length,
      icon: ShieldAlert,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <div className="section-eyebrow mb-4">Operasyon Masası</div>
        <h1 className="font-display text-4xl text-white sm:text-5xl md:text-6xl">Canlı Operasyon Durumu</h1>
        <p className="mt-3 max-w-3xl text-white/60">
          Projeler, mesaj kuyruğu, filo bütünlüğü ve denetim kayıtları artık yalnızca sayıyla değil, filtrelenebilir sorun
          listesi ve operasyon skoru ile izlenir.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="admin-kpi rounded-[24px] p-5">
              <div className="flex items-center justify-between">
                <div className="data-label text-white/45">{card.label}</div>
                <Icon className="h-5 w-5 text-amber-300" />
              </div>
              <div className="mt-3 text-4xl text-white">{card.value}</div>
            </div>
          )
        })}
        <div className="admin-kpi rounded-[24px] p-5">
          <div className="data-label text-white/45">Operasyon Skoru</div>
          <div className={`mt-3 text-4xl ${scoreTone(summary.score)}`}>{summary.score}</div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="admin-surface rounded-[32px] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-4xl text-white">Odak Özeti</h2>
            <Link href="/admin/insights" className="text-amber-300 hover:text-amber-200">İçgörülere Git</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="admin-surface-muted rounded-[24px] p-4">
              <div className="data-label text-white/40">Toplam issue</div>
              <div className="mt-3 text-3xl text-white">{summary.total}</div>
            </div>
            <div className="admin-surface-muted rounded-[24px] p-4">
              <div className="data-label text-white/40">Yüksek öncelik</div>
              <div className="mt-3 text-3xl text-red-300">{summary.high}</div>
            </div>
            <div className="admin-surface-muted rounded-[24px] p-4">
              <div className="data-label text-white/40">Orta öncelik</div>
              <div className="mt-3 text-3xl text-amber-300">{summary.medium}</div>
            </div>
            <div className="admin-surface-muted rounded-[24px] p-4">
              <div className="data-label text-white/40">Düşük öncelik</div>
              <div className="mt-3 text-3xl text-sky-300">{summary.low}</div>
            </div>
          </div>
        </section>

        <section className="admin-surface rounded-[32px] p-6">
          <div className="mb-5 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-300" />
            <h2 className="font-display text-4xl text-white">En Acil Sinyal</h2>
          </div>
          {issues[0] ? (
            <div className="rounded-[24px] border border-amber-400/15 bg-amber-400/8 p-5">
              <div className="text-xl text-white">{issues[0].title}</div>
              <p className="mt-3 text-sm leading-7 text-amber-100/90">{issues[0].description}</p>
              <div className="mt-4 text-sm text-amber-100/80">{issues[0].stat}</div>
              <Link href={issues[0].href} className="mt-4 inline-flex text-sm font-medium text-white transition hover:text-amber-100">
                Müdahaleye Git
              </Link>
            </div>
          ) : (
            <div className="rounded-[24px] border border-emerald-400/15 bg-emerald-400/8 p-5 text-sm text-emerald-200">
              Şu an dikkat gerektiren operasyon sinyali görünmüyor.
            </div>
          )}
        </section>
      </div>

      <AdminOperationsBoard issues={issues} score={summary.score} />

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="admin-surface rounded-[32px] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-4xl text-white">Mesaj Kuyruğu</h2>
            <Link href="/admin/messages" className="text-amber-300 hover:text-amber-200">Mesajlara Git</Link>
          </div>
          <div className="space-y-4">
            <div className="admin-surface-muted rounded-[24px] p-4">
              <div className="text-lg text-white">24+ saat bekleyen</div>
              <div className="mt-2 text-sm text-white/45">{snapshot.messageQueue.unread24h.length} mesaj</div>
            </div>
            <div className="admin-surface-muted rounded-[24px] p-4">
              <div className="text-lg text-white">72+ saat bekleyen</div>
              <div className="mt-2 text-sm text-white/45">{snapshot.messageQueue.unread72h.length} mesaj</div>
            </div>
            <div className="admin-surface-muted rounded-[24px] p-4">
              <div className="text-lg text-white">7+ gün bekleyen</div>
              <div className="mt-2 text-sm text-white/45">{snapshot.messageQueue.unread7d.length} mesaj</div>
            </div>
            {snapshot.messageQueue.unread24h[0] ? (
              <div className="rounded-[24px] border border-amber-400/15 bg-amber-400/8 p-4 text-sm text-amber-100">
                En eski açık talep: {snapshot.messageQueue.unread24h[0].name} • {formatDate(snapshot.messageQueue.unread24h[0].createdAt)}
              </div>
            ) : null}
          </div>
        </section>

        <section className="admin-surface rounded-[32px] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-4xl text-white">Denetim Riski</h2>
            <Link href="/admin/activity" className="text-amber-300 hover:text-amber-200">Aktiviteye Git</Link>
          </div>
          <div className="space-y-4">
            <div className="admin-surface-muted rounded-[24px] p-4">
              <div className="text-lg text-white">7 gündeki riskli kayıt</div>
              <div className="mt-2 text-sm text-white/45">{snapshot.auditHealth.failedOrRejected7d.length} kayıt</div>
            </div>
            <div className="admin-surface-muted rounded-[24px] p-4">
              <div className="text-lg text-white">Başarısız admin girişleri</div>
              <div className="mt-2 text-sm text-white/45">{snapshot.auditHealth.failedLogins7d.length} kayıt</div>
            </div>
            {snapshot.auditHealth.failedOrRejected7d[0] ? (
              <div className="rounded-[24px] border border-red-400/15 bg-red-400/8 p-4 text-sm text-red-100">
                Son riskli kayıt: {snapshot.auditHealth.failedOrRejected7d[0].action} • {formatDate(snapshot.auditHealth.failedOrRejected7d[0].at)}
              </div>
            ) : (
              <div className="rounded-[24px] border border-emerald-400/15 bg-emerald-400/8 p-4 text-sm text-emerald-200">
                Son 7 günde dikkat çeken başarısız veya reddedilen işlem görünmüyor.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
