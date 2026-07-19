import { AdminActivityFeed } from '@/components/admin/AdminActivityFeed'
import { getAuditSummary, listAuditEntries } from '@/lib/audit-service'

export default async function AdminActivityPage() {
  const [entries, summary] = await Promise.all([listAuditEntries(120), getAuditSummary()])

  return (
    <div className="space-y-6">
      <div>
        <div className="section-eyebrow mb-4">Denetim Akışı</div>
        <h1 className="font-display text-4xl text-white sm:text-5xl md:text-6xl">Panel Aktivitesi</h1>
        <p className="mt-3 max-w-3xl text-white/60">
          Giriş denemeleri, içerik güncellemeleri ve yönetim işlemlerinin son kayıtlarını arama ve durum filtresiyle izleyin.
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

      <AdminActivityFeed entries={entries} latestAt={summary.latestAt} />
    </div>
  )
}
