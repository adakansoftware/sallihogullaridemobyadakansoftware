"use client";

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export function MediaUploader({ projectId }: { projectId: string }) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [sortOrder, setSortOrder] = useState(0)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleYouTubeAdd(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return

    const nextYoutubeUrl = youtubeUrl.trim()
    if (!nextYoutubeUrl) {
      const message = 'YouTube bağlantısı girin.'
      setError(message)
      toast.error(message)
      return
    }

    setLoading(true)
    setError('')

    try {
      const saveRes = await fetch(`/api/projects/${projectId}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim() || 'YouTube videosu',
          fileUrl: nextYoutubeUrl,
          fileType: 'video/youtube',
          resourceType: 'video',
          thumbnailUrl: '',
          isCover: false,
          sortOrder,
        }),
      })

      const saveData = await saveRes.json().catch(() => ({}))
      if (!saveRes.ok) {
        throw new Error(saveData.message || 'YouTube videosu eklenemedi.')
      }

      setTitle('')
      setSortOrder(0)
      setYoutubeUrl('')
      toast.success('YouTube videosu eklendi.')
      router.refresh()
    } catch (youtubeError) {
      const message = youtubeError instanceof Error ? youtubeError.message : 'YouTube videosu eklenemedi.'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div aria-busy={loading} className="space-y-8">
      {error ? (
        <p role="alert" aria-live="assertive" className="rounded-2xl border border-red-400/15 bg-red-400/8 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <div className="rounded-[24px] border border-white/10 bg-black/20 p-4 text-sm leading-7 text-white/55">
        Dosya yükleme bu kurulumda kapalıdır. Fotoğraflar proje klasöründeki görsel yollarıyla yönetilir; video eklemek için YouTube bağlantısı kullanılır.
      </div>

      <form onSubmit={handleYouTubeAdd} className="space-y-5">
        <div>
          <div className="text-sm font-semibold text-white">YouTube Videosu</div>
          <div className="mt-1 text-xs leading-6 text-white/45">
            Video dosyası yüklenmez. YouTube paylaşım bağlantısını buraya ekleyin.
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <input className="input-premium w-full" placeholder="Video başlığı" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input
            type="number"
            className="input-premium w-full"
            placeholder="Sıra"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
          />
        </div>
        <input
          className="input-premium w-full"
          placeholder="YouTube linki: https://www.youtube.com/watch?v=..."
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
        />
        <button className="btn-premium h-12 px-6" type="submit" disabled={loading}>
          {loading ? 'Ekleniyor...' : 'YouTube Videosu Ekle'}
        </button>
      </form>
    </div>
  )
}
