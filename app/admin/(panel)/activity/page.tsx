import { Activity, AlertTriangle, Ban, CheckCircle2 } from 'lucide-react'
import { formatAuditAction, getAuditSummary, listAuditEntries } from '@/lib/audit-service'

function formatAuditDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'Tarih yok'
    : date.toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' })
}

export default async function AdminActivityPage() {
  const [entries, summary] = await Promise.all([listAuditEntries(60), getAuditSummary()])

  return (
    <div className="space-y-6">
      <div>
        <div className="section-eyebrow mb-4">Denetim Akışı</div>
        <h1 className="font-display text-4xl text-white sm:text-5xl md:text-6xl">Panel Aktivitesi</h1>
        <p className="mt-3 max-w-3xl text-white/60">
          Giriş denemeleri, içerik güncellemeleri ve yönetim işlemlerinin son kayıtlarını buradan izleyin.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <div className="admin-kpi rounded-[24px] p-5">
          <div className="data-label text-white/45">Toplam Kayıt</div>
          <div className="mt-3 text-4xl text-white">{summary.total}</div>
        </div>
        <div className="admin-kpi rounded-[24px] p-5">
          <div className="data-label text-white/45">Başarılı</div>
          <div className="mt-3 text-4xl text-emerald-300">{summary.success}</div>
        </div>
        <div className="admin-kpi rounded-[24px] p-5">
          <div className="data-label text-white/45">Başarısız</div>
          <div className="mt-3 text-4xl text-amber-300">{summary.failure}</div>
        </div>
        <div className="admin-kpi rounded-[24px] p-5">
          <div className="data-label text-white/45">Reddedilen</div>
          <div className="mt-3 text-4xl text-red-300">{summary.rejected}</div>
        </div>
        <div className="admin-kpi rounded-[24px] p-5">
          <div className="data-label text-white/45">İşlem Türü</div>
          <div className="mt-3 text-4xl text-white">{summary.uniqueActions}</div>
        </div>
      </div>

      <div className="admin-surface rounded-[32px] p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-4xl text-white">Son Kayıtlar</h2>
          <div className="text-sm text-white/45">
            Son güncelleme: {summary.latestAt ? formatAuditDate(summary.latestAt) : 'Kayıt yok'}
          </div>
        </div>

        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={`${entry.at}-${entry.action}-${entry.target || 'na'}`} className="admin-surface-muted rounded-[24px] p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-lg font-medium text-white">{formatAuditAction(entry.action)}</div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        entry.status === 'success'
                          ? 'bg-emerald-400/10 text-emerald-300'
                          : entry.status === 'failure'
                            ? 'bg-amber-400/10 text-amber-300'
                            : 'bg-red-400/10 text-red-300'
                      }`}
                    >
                      {entry.status === 'success' ? 'Başarılı' : entry.status === 'failure' ? 'Başarısız' : 'Reddedildi'}
                    </span>
                  </div>

                  <div className="mt-2 text-sm text-white/45">{formatAuditDate(entry.at)}</div>

                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                      <div className="data-label text-white/35">IP</div>
                      <div className="mt-2 break-all text-sm text-white/70">{entry.ip || 'Yok'}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                      <div className="data-label text-white/35">Hedef</div>
                      <div className="mt-2 break-all text-sm text-white/70">{entry.target || 'Yok'}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                      <div className="data-label text-white/35">Detay</div>
                      <div className="mt-2 break-words text-sm text-white/70">{entry.detail || 'Yok'}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  {entry.status === 'success' ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                  ) : entry.status === 'failure' ? (
                    <AlertTriangle className="h-5 w-5 text-amber-300" />
                  ) : (
                    <Ban className="h-5 w-5 text-red-300" />
                  )}
                </div>
              </div>
            </div>
          ))}

          {entries.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-white/10 p-10 text-center text-white/50">
              <Activity className="mx-auto mb-4 h-6 w-6 text-white/35" />
              Henüz audit kaydı görünmüyor.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
