import Link from 'next/link'
import { getSiteAssetHealth } from '@/lib/asset-health'
import { readMessages, readProjects, readSettings } from '@/lib/store'

export default async function AdminDashboardPage() {
  const [projects, messages, settings, assetHealth] = await Promise.all([
    readProjects(),
    readMessages(),
    readSettings(),
    getSiteAssetHealth(),
  ])

  const mediaCount = projects.reduce((sum, project) => sum + project.media.length, 0)
  const featuredCount = projects.filter((project) => project.featured).length
  const unreadCount = messages.filter((item) => !item.isRead).length
  const publishedCount = projects.filter((project) => project.status === 'Yayında').length
  const draftCount = projects.length - publishedCount
  const projectsWithoutMedia = projects.filter((project) => project.media.length === 0).length
  const missingAssetCount = assetHealth.missingAssets.length
  const orphanUploadCount = assetHealth.orphanUploads.length

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="section-eyebrow mb-4">Yönetim Özeti</div>
          <h1 className="font-display text-6xl text-white md:text-7xl">Operasyon Dashboard</h1>
          <p className="mt-3 max-w-3xl text-white/60">
            {settings.companyName} icin guncel icerik, medya ve iletisim akisini tek bir merkezden takip edin.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/projects/new" className="btn-premium inline-flex h-12 items-center px-6">Yeni Proje</Link>
          <Link href="/admin/projects" className="btn-ghost-premium inline-flex h-12 items-center px-6">Icerik Akisi</Link>
          <Link href="/admin/settings" className="btn-ghost-premium inline-flex h-12 items-center px-6">Ayarlar</Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="industrial-border hover-lift rounded-[28px] bg-white/[0.04] p-6">
          <div className="data-label text-white/45">Toplam Proje</div>
          <div className="stat-value mt-3 text-5xl text-white">{projects.length}</div>
        </div>
        <div className="industrial-border hover-lift rounded-[28px] bg-white/[0.04] p-6">
          <div className="data-label text-white/45">Toplam Medya</div>
          <div className="stat-value mt-3 text-5xl text-white">{mediaCount}</div>
        </div>
        <div className="industrial-border hover-lift rounded-[28px] bg-white/[0.04] p-6">
          <div className="data-label text-white/45">Okunmamis Mesaj</div>
          <div className="stat-value mt-3 text-5xl text-white">{unreadCount}</div>
        </div>
        <div className="industrial-border hover-lift rounded-[28px] bg-white/[0.04] p-6">
          <div className="data-label text-white/45">One Cikan Proje</div>
          <div className="stat-value mt-3 text-5xl text-white">{featuredCount}</div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="industrial-border rounded-[32px] bg-white/[0.04] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-4xl text-white">Icerik Sagligi</h2>
            <Link href="/admin/projects" className="text-amber-300 hover:text-amber-200">Projelere Git</Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
              <div className="data-label text-white/40">Yayında</div>
              <div className="mt-3 text-3xl text-white">{publishedCount}</div>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
              <div className="data-label text-white/40">Taslak</div>
              <div className="mt-3 text-3xl text-white">{draftCount}</div>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
              <div className="data-label text-white/40">Medyasiz Proje</div>
              <div className="mt-3 text-3xl text-white">{projectsWithoutMedia}</div>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
              <div className="data-label text-white/40">Bozuk Referans</div>
              <div className={`mt-3 text-3xl ${missingAssetCount || orphanUploadCount ? 'text-amber-300' : 'text-emerald-300'}`}>
                {missingAssetCount + orphanUploadCount}
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-lg font-medium text-white">Eksik medya kayitlari</div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/55">{missingAssetCount}</span>
              </div>
              {assetHealth.missingAssets.length ? (
                <div className="space-y-3">
                  {assetHealth.missingAssets.slice(0, 5).map((issue) => (
                    <div key={`${issue.projectId}-${issue.kind}-${issue.fileUrl}`} className="rounded-2xl border border-amber-400/15 bg-amber-400/8 px-4 py-3 text-sm text-white/70">
                      <div className="font-medium text-white">{issue.projectTitle}</div>
                      <div className="mt-1 text-white/55">{issue.kind} • {issue.fileUrl}</div>
                    </div>
                  ))}
                  {assetHealth.missingAssets.length > 5 ? (
                    <div className="text-sm text-white/45">Toplam {assetHealth.missingAssets.length} bozuk medya referansi bulundu.</div>
                  ) : null}
                </div>
              ) : (
                <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/8 px-4 py-4 text-sm text-emerald-200">
                  Public tarafta kirik `/images` veya `/uploads` referansi bulunmadi.
                </div>
              )}
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-lg font-medium text-white">Orphan upload dosyalari</div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/55">{orphanUploadCount}</span>
              </div>
              {assetHealth.orphanUploads.length ? (
                <div className="space-y-3">
                  {assetHealth.orphanUploads.slice(0, 5).map((fileUrl) => (
                    <div key={fileUrl} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/65">
                      {fileUrl}
                    </div>
                  ))}
                  {assetHealth.orphanUploads.length > 5 ? (
                    <div className="text-sm text-white/45">Toplam {assetHealth.orphanUploads.length} kullanilmayan upload dosyasi var.</div>
                  ) : null}
                </div>
              ) : (
                <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/8 px-4 py-4 text-sm text-emerald-200">
                  Yukleme klasorunde projelerden kopmus dosya gorunmuyor.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="industrial-border rounded-[32px] bg-white/[0.04] p-6">
          <div className="data-label text-white/45">Operasyon Özeti</div>
          <div className="mt-3 text-2xl text-white">{settings.heroTitle}</div>
          <p className="mt-3 text-white/60">{settings.quoteNotice}</p>
          <div className="mt-6 grid gap-3">
            <Link href="/" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white/75 transition hover:bg-white/[0.05]">
              Public anasayfayi ac
            </Link>
            <Link href="/projects" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white/75 transition hover:bg-white/[0.05]">
              Projeler sayfasini kontrol et
            </Link>
            <Link href="/contact" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white/75 transition hover:bg-white/[0.05]">
              İletişim akışına git
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="industrial-border rounded-[32px] bg-white/[0.04] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-4xl text-white">Son Projeler</h2>
            <Link href="/admin/projects" className="text-amber-300 hover:text-amber-200">Tümünü Gör</Link>
          </div>
          <div className="space-y-4">
            {projects.slice(0, 5).map((project) => (
              <div key={project.id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-lg font-medium text-white">{project.title}</div>
                  <div className="data-label mt-1 text-white/45">{project.category || 'Kategori yok'} • {project.media.length} medya • {project.status}</div>
                </div>
                <Link href={`/admin/projects/${project.id}`} className="btn-ghost-premium inline-flex h-10 items-center px-4">Düzenle</Link>
              </div>
            ))}
            {projects.length === 0 ? <div className="rounded-[24px] border border-dashed border-white/10 p-8 text-white/50">Henuz proje yok.</div> : null}
          </div>
        </div>

        <div className="space-y-8">
          <div className="industrial-border rounded-[32px] bg-white/[0.04] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-4xl text-white">Son Mesajlar</h2>
              <Link href="/admin/messages" className="text-amber-300 hover:text-amber-200">Tümünü Gör</Link>
            </div>
            <div className="space-y-4">
              {messages.slice(0, 4).map((message) => (
                <div key={message.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-base font-medium text-white">{message.name}</div>
                    <span className={`rounded-full px-2 py-1 text-xs ${message.isRead ? 'bg-white/10 text-white/60' : 'bg-amber-400/10 text-amber-300'}`}>
                      {message.isRead ? 'Okundu' : 'Yeni'}
                    </span>
                  </div>
                  <div className="data-label mt-2 text-white/45">{message.subject}</div>
                  <p className="mt-3 line-clamp-2 text-sm text-white/60">{message.message}</p>
                </div>
              ))}
              {messages.length === 0 ? <div className="rounded-[24px] border border-dashed border-white/10 p-6 text-white/50">Henuz mesaj yok.</div> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
