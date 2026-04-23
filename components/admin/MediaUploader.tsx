"use client";

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'video/mp4',
  'video/webm',
  'video/quicktime',
]

const MAX_FILE_SIZE = 25 * 1024 * 1024

export function MediaUploader({ projectId }: { projectId: string }) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [sortOrder, setSortOrder] = useState(0)
  const [isCover, setIsCover] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const selectedFiles = useMemo(() => files, [files])
  const totalSelectedSizeMb = useMemo(
    () => selectedFiles.reduce((sum, file) => sum + file.size, 0) / (1024 * 1024),
    [selectedFiles],
  )

  function handleFileChange(nextFiles: FileList | null) {
    const selected = nextFiles ? Array.from(nextFiles) : []
    const invalidFile = selected.find(
      (file) => file.size <= 0 || file.size > MAX_FILE_SIZE || !ACCEPTED_TYPES.includes(file.type),
    )

    if (invalidFile) {
      const message = 'Gecersiz dosya secildi. Desteklenen turleri kullanin ve dosya basina 25 MB sinirini asmayin.'
      setFiles([])
      setError(message)
      toast.error(message)
      return
    }

    setError('')
    setFiles(selected)
  }

  async function cleanupUploadedFiles(fileUrls: string[]) {
    await Promise.allSettled(
      fileUrls.map((fileUrl) =>
        fetch('/api/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileUrl }),
        }),
      ),
    )
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    if (!selectedFiles.length) {
      const message = 'En az bir dosya secin.'
      setError(message)
      toast.error(message)
      return
    }

    setLoading(true)
    setError('')
    const uploadedUrls: string[] = []

    try {
      for (const [index, file] of selectedFiles.entries()) {
        const fd = new FormData()
        fd.append('file', file)

        const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd })
        const uploadData = await uploadRes.json().catch(() => ({}))
        if (!uploadRes.ok) throw new Error(uploadData.message || 'Medya yuklenemedi.')

        uploadedUrls.push(uploadData.secure_url)

        const saveRes = await fetch(`/api/projects/${projectId}/media`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: selectedFiles.length > 1 ? `${title || 'Medya'} ${index + 1}` : title,
            fileUrl: uploadData.secure_url,
            fileType: file.type,
            resourceType: uploadData.resource_type,
            thumbnailUrl: uploadData.secure_url,
            isCover: index === 0 ? isCover : false,
            sortOrder: sortOrder + index,
          }),
        })

        const saveData = await saveRes.json().catch(() => ({}))
        if (!saveRes.ok) {
          await cleanupUploadedFiles([uploadData.secure_url])
          throw new Error(saveData.message || 'Medya kaydi olusturulamadi.')
        }
      }

      setTitle('')
      setSortOrder(0)
      setIsCover(false)
      setFiles([])
      toast.success(selectedFiles.length > 1 ? 'Medya galerisi guncellendi.' : 'Medya eklendi.')
      router.refresh()
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : 'Yukleme tamamlanamadi.'
      setError(message)
      if (uploadedUrls.length > 1) {
        await cleanupUploadedFiles(uploadedUrls)
      }
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleUpload} className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <input className="input-premium w-full" placeholder="Medya basligi" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input
          type="number"
          className="input-premium w-full"
          placeholder="Baslangic sirasi"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
        />
      </div>

      <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/70">
        <input type="checkbox" checked={isCover} onChange={(e) => setIsCover(e.target.checked)} />
        Ilk dosyayi kapak gorseli yap
      </label>

      <input
        type="file"
        multiple
        accept={ACCEPTED_TYPES.join(',')}
        onChange={(e) => handleFileChange(e.target.files)}
        className="block w-full rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-5 text-sm text-white/70 file:mr-4 file:rounded-full file:border-0 file:bg-amber-400/15 file:px-4 file:py-2 file:text-amber-300"
      />

      <div className="rounded-[24px] border border-white/10 bg-black/20 p-4 text-sm text-white/55">
        Birden fazla gorsel veya video yukleyebilirsiniz. Dosya basina en fazla 25 MB desteklenir.
        {selectedFiles.length ? <div className="mt-2 text-white/70">{selectedFiles.length} dosya • toplam {totalSelectedSizeMb.toFixed(1)} MB</div> : null}
      </div>

      {selectedFiles.length ? (
        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-3 text-xs uppercase tracking-[0.18em] text-white/40">Secilen dosyalar</div>
          <div className="space-y-2">
            {selectedFiles.map((file) => (
              <div key={`${file.name}-${file.size}`} className="flex items-center justify-between gap-4 text-sm text-white/70">
                <span className="truncate">{file.name}</span>
                <span className="shrink-0 text-white/45">{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <button className="btn-premium h-12 px-6" type="submit" disabled={loading}>
        {loading ? 'Yukleniyor...' : 'Fotograf / Video Yukle'}
      </button>
    </form>
  )
}
