import Link from 'next/link'
import { AlertTriangle, FolderKanban, Mail, ShieldAlert, Truck } from 'lucide-react'
import { AdminIssueResolutionBoard } from '@/components/admin/AdminIssueResolutionBoard'
import { AdminOperationsBoard } from '@/components/admin/AdminOperationsBoard'
import { getAdminIssueAnalytics } from '@/lib/admin-issue-analytics'
import { getSyncedAdminIssueStateMap } from '@/lib/admin-issue-tracker'
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

function getDomainLabel(domain: 'projects' | 'messages' | 'fleet' | 'audit') {
  if (domain === 'projects') return 'Projeler'
  if (domain === 'messages') return 'Mesajlar'
  if (domain === 'fleet') return 'Filo'
  return 'Denetim'
}

function getAnalyticsDomainLabel(domain: 'projects' | 'messages' | 'fleet' | 'audit' | 'insights') {
  if (domain === 'insights') return 'İçgörüler'
  return getDomainLabel(domain)
}

export default async function AdminOperationsPage() {
  const [{ snapshot, issues, summary }, issueStateMap, issueAnalytics] = await Promise.all([
    getAdminOperationsCenter(),
    getSyncedAdminIssueStateMap(),
    getAdminIssueAnalytics(),
  ])

  const trackedIssues = issues.map((issue) => {
    const state = issueStateMap[issue.id]
    return {
      ...issue,
      domainLabel: getDomainLabel(issue.domain),
      status: state?.status ?? 'open',
      note: state?.note ?? '',
      updatedAt: state?.updatedAt,
    }
  })

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

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="admin-surface rounded-[32px] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-4xl text-white">Operasyon Sağlığı</h2>
            <Link href="/admin" className="text-amber-300 hover:text-amber-200">Dashboard</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="admin-surface-muted rounded-[24px] p-4">
              <div className="data-label text-white/40">Sağlık skoru</div>
              <div className={`mt-3 text-3xl ${scoreTone(issueAnalytics.summary.healthScore)}`}>{issueAnalytics.summary.healthScore}</div>
            </div>
            <div className="admin-surface-muted rounded-[24px] p-4">
              <div className="data-label text-white/40">SLA kaçağı</div>
              <div className={`mt-3 text-3xl ${issueAnalytics.summary.slaBreaches ? 'text-red-300' : 'text-emerald-300'}`}>{issueAnalytics.summary.slaBreaches}</div>
            </div>
            <div className="admin-surface-muted rounded-[24px] p-4">
              <div className="data-label text-white/40">7 günlük geçiş</div>
              <div className="mt-3 text-3xl text-white">{issueAnalytics.summary.transitionCount7d}</div>
            </div>
            <div className="admin-surface-muted rounded-[24px] p-4">
              <div className="data-label text-white/40">Toparlanma</div>
              <div className={`mt-3 text-3xl ${issueAnalytics.focus.recoveryRate >= 100 ? 'text-emerald-300' : issueAnalytics.focus.recoveryRate >= 60 ? 'text-amber-300' : 'text-red-300'}`}>
                %{issueAnalytics.focus.recoveryRate}
              </div>
            </div>
          </div>
          <div className="mt-5 rounded-[24px] border border-white/10 bg-black/20 p-4 text-sm text-white/60">
            En yoğun alan {issueAnalytics.focus.hottestDomain ? getAnalyticsDomainLabel(issueAnalytics.focus.hottestDomain) : 'yok'}.
            Baskı skoru: <span className="text-white">{issueAnalytics.focus.highestPressureCount}</span>.
          </div>
        </section>

        <section className="admin-surface rounded-[32px] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-4xl text-white">7 Günlük Akış</h2>
            <Link href="/admin/insights" className="text-amber-300 hover:text-amber-200">Takibi Aç</Link>
          </div>
          <div className="space-y-4">
            {issueAnalytics.trend7d.map((item) => (
              <div key={item.dayKey} className="admin-surface-muted rounded-[24px] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-base font-medium text-white">{new Date(item.dayKey).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })}</div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">{item.updated + item.resolved} hareket</span>
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-3 text-sm text-white/45">
                  <div>Açılan: <span className="text-white">{item.opened}</span></div>
                  <div>Çözülen: <span className="text-white">{item.resolved}</span></div>
                  <div>Güncellenen: <span className="text-white">{item.updated}</span></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <AdminIssueResolutionBoard
        title="Çözüm Takibi"
        description="Filtrelenmiş sorun listesine ek olarak, her issue için müdahale durumu ve kısa not saklayın."
        issues={trackedIssues}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="admin-surface rounded-[32px] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-4xl text-white">Alan Baskısı</h2>
            <Link href="/admin" className="text-amber-300 hover:text-amber-200">Özet</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {issueAnalytics.domainSummary.map((domain) => (
              <div key={domain.domain} className="admin-surface-muted rounded-[24px] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-lg text-white">{getAnalyticsDomainLabel(domain.domain)}</div>
                  <span className={`rounded-full px-3 py-1 text-xs ${scoreTone(domain.healthScore)}`}>
                    {domain.healthScore}/100
                  </span>
                </div>
                <div className="mt-3 text-sm text-white/45">{domain.tracked} takip • {domain.resolved} çözüldü</div>
                <div className="mt-2 text-sm text-white/45">Aktif: {domain.active} • SLA: {domain.slaBreaches}</div>
                <div className="mt-2 text-sm text-white/45">Tekrar: {domain.reopened} • Yaş: {domain.avgAgeHours > 0 ? `${Math.round(domain.avgAgeHours)} saat` : '0 saat'}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-surface rounded-[32px] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-4xl text-white">Son Issue Geçişleri</h2>
            <Link href="/admin/insights" className="text-amber-300 hover:text-amber-200">Takibi Aç</Link>
          </div>
          <div className="space-y-4">
            {issueAnalytics.recentTransitions.map((entry) => (
              <div key={`${entry.issueId}-${entry.at}`} className="admin-surface-muted rounded-[24px] p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-base font-medium text-white">{entry.title}</div>
                  <span className={`rounded-full px-3 py-1 text-xs ${
                    entry.toStatus === 'resolved'
                      ? 'bg-emerald-400/10 text-emerald-300'
                      : entry.toStatus === 'monitoring'
                        ? 'bg-amber-400/10 text-amber-300'
                        : 'bg-red-400/10 text-red-300'
                  }`}>
                    {entry.toStatus === 'resolved' ? 'Çözüldü' : entry.toStatus === 'monitoring' ? 'İzlemede' : 'Açık'}
                  </span>
                </div>
                <div className="mt-2 text-sm text-white/45">
                  {formatDate(entry.at)} • {getAnalyticsDomainLabel(entry.domain)}
                </div>
                <div className="mt-2 text-sm text-white/60">
                  {entry.fromStatus ? `${entry.fromStatus} → ${entry.toStatus}` : `${entry.toStatus} olarak kayda girdi`}
                </div>
                <div className="mt-2 text-sm text-white/45">{entry.note || 'Not girilmedi'}</div>
                <Link href={entry.href} className="mt-3 inline-flex text-sm font-medium text-amber-300 transition hover:text-amber-200">
                  Issue&apos;ya Git
                </Link>
              </div>
            ))}
            {issueAnalytics.recentTransitions.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-white/10 p-8 text-white/50">Henüz issue geçiş kaydı yok.</div>
            ) : null}
          </div>
        </section>
      </div>

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
