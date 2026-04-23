import Link from 'next/link'
import { AdminProjectsManager } from '@/components/admin/AdminProjectsManager'
import { readProjects } from '@/lib/store'

export default async function AdminProjectsPage() {
  const projects = await readProjects()
  const publishedCount = projects.filter((project) => project.status === 'Yayında').length
  const featuredCount = projects.filter((project) => project.featured).length

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="section-eyebrow mb-4">Proje Yönetimi</div>
          <h1 className="font-display text-6xl text-white">Projeler</h1>
          <p className="mt-3 max-w-3xl text-white/60">Projeleri ekleyin, düzenleyin ve öne çıkan referansları yönetin.</p>
        </div>
        <Link href="/admin/projects/new" className="btn-premium inline-flex h-12 items-center px-6">Yeni Proje Ekle</Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="industrial-border rounded-[24px] bg-white/[0.04] p-5">
          <div className="data-label text-white/40">Toplam Proje</div>
          <div className="mt-3 text-4xl font-black text-white">{projects.length}</div>
        </div>
        <div className="industrial-border rounded-[24px] bg-white/[0.04] p-5">
          <div className="data-label text-white/40">Yayında</div>
          <div className="mt-3 text-4xl font-black text-white">{publishedCount}</div>
        </div>
        <div className="industrial-border rounded-[24px] bg-white/[0.04] p-5">
          <div className="data-label text-white/40">Öne Çıkan</div>
          <div className="mt-3 text-4xl font-black text-white">{featuredCount}</div>
        </div>
      </div>

      <AdminProjectsManager projects={projects} />
    </div>
  )
}
