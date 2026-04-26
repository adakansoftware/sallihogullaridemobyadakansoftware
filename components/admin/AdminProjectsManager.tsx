"use client";

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { Project } from '@/lib/store'

type SortKey = 'updated-desc' | 'updated-asc' | 'title-asc' | 'title-desc'

function sortProjects(projects: Project[], sortKey: SortKey) {
  const sorted = [...projects]

  switch (sortKey) {
    case 'updated-asc':
      return sorted.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
    case 'title-asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title, 'tr'))
    case 'title-desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title, 'tr'))
    case 'updated-desc':
    default:
      return sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }
}

export function AdminProjectsManager({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | 'Yayında' | 'Taslak'>('all')
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>('updated-desc')

  const filteredProjects = useMemo(() => {
    const matched = projects.filter((project) => {
      const matchesQuery =
        !query ||
        [project.title, project.location, project.category, project.summary, ...project.tags]
          .join(' ')
          .toLowerCase()
          .includes(query.toLowerCase())

      const matchesStatus = status === 'all' || project.status === status
      const matchesFeatured = !featuredOnly || project.featured

      return matchesQuery && matchesStatus && matchesFeatured
    })

    return sortProjects(matched, sortKey)
  }, [featuredOnly, projects, query, sortKey, status])

  const publishedCount = filteredProjects.filter((project) => project.status === 'Yayında').length
  const draftCount = filteredProjects.filter((project) => project.status === 'Taslak').length
  const totalMediaCount = filteredProjects.reduce((sum, project) => sum + project.media.length, 0)

  return (
    <div className="space-y-6">
      <div className="industrial-border rounded-[28px] bg-white/[0.04] p-5">
        <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr_0.6fr_0.7fr_auto]">
          <input
            className="input-premium"
            placeholder="Proje adı, konum veya etiket ara"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Projelerde ara"
          />
          <select className="input-premium" value={status} onChange={(event) => setStatus(event.target.value as typeof status)} aria-label="Proje durumuna göre filtrele">
            <option value="all">Tüm durumlar</option>
            <option value="Yayında">Yayında</option>
            <option value="Taslak">Taslak</option>
          </select>
          <select className="input-premium" value={sortKey} onChange={(event) => setSortKey(event.target.value as SortKey)} aria-label="Projeleri sırala">
            <option value="updated-desc">En yeni güncelleme</option>
            <option value="updated-asc">En eski güncelleme</option>
            <option value="title-asc">Başlık A-Z</option>
            <option value="title-desc">Başlık Z-A</option>
          </select>
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
            <input type="checkbox" checked={featuredOnly} onChange={(event) => setFeaturedOnly(event.target.checked)} aria-label="Sadece öne çıkan projeleri göster" />
            Öne çıkanlar
          </label>
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/55">{filteredProjects.length} kayıt</div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <span className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/65">Yayında: {publishedCount}</span>
          <span className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/65">Taslak: {draftCount}</span>
          <span className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/65">Medya: {totalMediaCount}</span>
        </div>
      </div>

      <div className="industrial-border rounded-[32px] bg-white/[0.04] p-4 md:p-6">
        <div className="hidden grid-cols-[minmax(0,1.4fr)_0.8fr_0.7fr_0.8fr_auto] gap-3 border-b border-white/10 px-4 pb-4 text-[11px] uppercase tracking-[0.18em] text-white/35 lg:grid">
          <span>Proje</span>
          <span>Durum</span>
          <span>Medya</span>
          <span>Güncelleme</span>
          <span className="text-right">İşlem</span>
        </div>

        <div className="grid gap-4 pt-4">
          {filteredProjects.map((project) => (
            <div key={project.id} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 transition hover:border-amber-400/20">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_0.8fr_0.7fr_0.8fr_auto] lg:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="break-words text-xl font-medium text-white">{project.title}</h2>
                    {project.featured ? <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs text-amber-300">Öne Çıkan</span> : null}
                  </div>
                  <div className="mt-2 break-words text-sm text-white/45">{project.category || 'Kategori yok'} • {project.location || 'Lokasyon yok'}</div>
                  {project.summary ? <p className="mt-3 max-w-3xl break-words text-white/65">{project.summary}</p> : null}
                  {project.tags.length ? <div className="mt-3 flex flex-wrap gap-2">{project.tags.map((tag) => <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/65">{tag}</span>)}</div> : null}
                </div>

                <div>
                  <div className={`inline-flex rounded-full px-3 py-1 text-xs ${project.status === 'Yayında' ? 'bg-emerald-400/10 text-emerald-300' : 'bg-white/10 text-white/60'}`}>
                    {project.status}
                  </div>
                </div>

                <div className="text-sm text-white/70">{project.media.length} medya</div>

                <div className="text-sm text-white/55">{new Date(project.updatedAt).toLocaleDateString('tr-TR')}</div>

                <div className="flex justify-start lg:justify-end">
                  <Link href={`/admin/projects/${project.id}`} className="btn-ghost-premium inline-flex h-11 items-center px-5">
                    Düzenle
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {filteredProjects.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-white/10 bg-black/20 p-10 text-center text-white/50">
              Bu filtrelerle eşleşen proje bulunamadı.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
