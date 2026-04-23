"use client";

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

type Props = {
  mode?: 'create' | 'edit'
  project?: {
    id: string
    title: string
    slug?: string
    summary?: string
    description?: string
    location?: string
    category?: string
    coverImage?: string
    status?: 'Taslak' | 'Yayında'
    featured?: boolean
    tags?: string[]
    media?: Array<{ id: string }>
  }
}

function FieldLabel({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-3">
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-1 text-xs leading-6 text-white/45">{description}</div>
    </div>
  )
}

function createPreviewSlug(value: string) {
  return value
    .toLocaleLowerCase('tr-TR')
    .replaceAll('ı', 'i')
    .replaceAll('İ', 'i')
    .replaceAll('ğ', 'g')
    .replaceAll('Ğ', 'g')
    .replaceAll('ü', 'u')
    .replaceAll('Ü', 'u')
    .replaceAll('ş', 's')
    .replaceAll('Ş', 's')
    .replaceAll('ö', 'o')
    .replaceAll('Ö', 'o')
    .replaceAll('ç', 'c')
    .replaceAll('Ç', 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function ProjectForm({ mode = 'create', project }: Props) {
  const router = useRouter()
  const [title, setTitle] = useState(project?.title || '')
  const [summary, setSummary] = useState(project?.summary || '')
  const [description, setDescription] = useState(project?.description || '')
  const [location, setLocation] = useState(project?.location || '')
  const [category, setCategory] = useState(project?.category || '')
  const [coverImage, setCoverImage] = useState(project?.coverImage || '')
  const [status, setStatus] = useState<'Taslak' | 'Yayında'>(project?.status || 'Yayında')
  const [featured, setFeatured] = useState(Boolean(project?.featured))
  const [tags, setTags] = useState((project?.tags || []).join(', '))
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const editorialStats = useMemo(
    () => [
      { label: 'Etiket', value: tags.split(',').map((item) => item.trim()).filter(Boolean).length },
      { label: 'Ozet', value: summary.trim().length },
      { label: 'Detay', value: description.trim().length },
    ],
    [description, summary, tags],
  )

  const generatedSlug = useMemo(() => createPreviewSlug(title), [title])
  const checklist = useMemo(
    () => [
      { label: 'Baslik', complete: title.trim().length >= 3 },
      { label: 'Ozet', complete: summary.trim().length >= 20 },
      { label: 'Detay', complete: description.trim().length >= 40 },
      { label: 'Kapak gorseli', complete: coverImage.trim().length > 0 || Boolean(project?.media?.length) },
    ],
    [coverImage, description, project?.media?.length, summary, title],
  )
  const completedChecklistCount = checklist.filter((item) => item.complete).length

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    const url = mode === 'create' ? '/api/projects' : `/api/projects/${project?.id}`
    const method = mode === 'create' ? 'POST' : 'PATCH'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, summary, description, location, category, coverImage, status, featured, tags }),
    })

    const data = await res.json().catch(() => ({}))
    setLoading(false)

    if (!res.ok) {
      const nextMessage = data.message || 'Kayit basarisiz.'
      setError(nextMessage)
      toast.error(nextMessage)
      return
    }

    if (mode === 'create') {
      toast.success('Proje olusturuldu.')
      router.push(`/admin/projects/${data.id}`)
      return
    }

    setMessage('Proje guncellendi.')
    toast.success('Proje guncellendi.')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <FieldLabel title="Temel Bilgiler" description="Baslik, kategori, lokasyon ve kapak yolunu duzenleyin." />
          <div className="grid gap-4 md:grid-cols-2">
            <input className="input-premium w-full" placeholder="Proje basligi" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <input className="input-premium w-full" placeholder="Lokasyon" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input className="input-premium w-full" placeholder="Kategori" value={category} onChange={(e) => setCategory(e.target.value)} />
            <input className="input-premium w-full" placeholder="Etiketler (virgulle)" value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>
          <div className="mt-4">
            <input className="input-premium w-full" placeholder="Kapak gorseli yolu: /images/... veya /uploads/..." value={coverImage} onChange={(e) => setCoverImage(e.target.value)} />
          </div>
          <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/55">
            Tip: Kapak secimini en guvenli sekilde medya yukleyip o kaydi kapak olarak isaretleyerek yapabilirsiniz.
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
            <FieldLabel title="Yayin Kontrolleri" description="Yayin durumunu ve one cikarma secimini belirleyin." />
            <div className="grid gap-4">
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/75">
                <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                One cikan proje olarak isaretle
              </label>
              <select className="input-premium w-full" value={status} onChange={(e) => setStatus(e.target.value as 'Taslak' | 'Yayında')}>
                <option value="Yayında">Yayinda</option>
                <option value="Taslak">Taslak</option>
              </select>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-white/55">
                Bu kayit admin listeleme, public proje detay ve proje kartlarini ayni veri kaynagi uzerinden besler.
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
            <div className="section-eyebrow mb-4">Icerik Ozeti</div>
            <div className="grid grid-cols-3 gap-3">
              {editorialStats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">{item.label}</div>
                  <div className="mt-3 text-2xl text-white">{item.value}</div>
                </div>
              ))}
            </div>
            {mode === 'edit' ? (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white/55">
                Mevcut medya: {project?.media?.length || 0} kayit
              </div>
            ) : null}
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm font-semibold text-white">Yayin Kontrol Listesi</div>
              <div className="text-xs text-white/45">{completedChecklistCount}/{checklist.length} tamam</div>
            </div>
            <div className="space-y-3">
              {checklist.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
                  <span className="text-white/75">{item.label}</span>
                  <span className={item.complete ? 'text-emerald-300' : 'text-amber-300'}>
                    {item.complete ? 'Hazir' : 'Eksik'}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white/55">
              Slug onizlemesi: <span className="text-white/80">/projects/{project?.slug || generatedSlug || 'proje-basligi'}</span>
            </div>
            {mode === 'edit' && status === 'Yayında' ? (
              <a
                href={`/projects/${project?.slug || generatedSlug}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex h-11 items-center rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white/80 transition hover:bg-white/[0.05]"
              >
                Public sayfayi ac
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
        <FieldLabel title="Kisa Ozet" description="Kartlarda ve one cikan alanlarda gorunen kisa metin." />
        <textarea className="textarea-premium w-full" placeholder="Kisa ozet" value={summary} onChange={(e) => setSummary(e.target.value)} />
      </div>

      <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
        <FieldLabel title="Detayli Aciklama" description="Public proje detay gorunumunde yer alacak ana aciklama metni." />
        <textarea className="textarea-premium min-h-[240px] w-full" placeholder="Detayli aciklama" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      {error ? <p className="rounded-2xl border border-red-400/15 bg-red-400/8 px-4 py-3 text-sm text-red-300">{error}</p> : null}
      {message ? <p className="rounded-2xl border border-emerald-400/15 bg-emerald-400/8 px-4 py-3 text-sm text-emerald-300">{message}</p> : null}

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-premium h-12 px-6" disabled={loading}>
          {loading ? 'Kaydediliyor...' : mode === 'create' ? 'Projeyi Olustur' : 'Degisiklikleri Kaydet'}
        </button>
      </div>
    </form>
  )
}
