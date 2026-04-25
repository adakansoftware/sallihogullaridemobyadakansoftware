"use client";

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export function MediaActions({
  mediaId,
  initialTitle,
  initialSortOrder,
  initialIsCover,
}: {
  mediaId: string
  initialTitle: string
  initialSortOrder: number
  initialIsCover: boolean
}) {
  const router = useRouter()
  const [title, setTitle] = useState(initialTitle)
  const [sortOrder, setSortOrder] = useState(initialSortOrder)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function save(payload: Record<string, unknown>, successMessage: string) {
    if (saving) return

    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/media/${mediaId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        const message = data.message || 'Medya guncellenemedi.'
        setError(message)
        toast.error(message)
        return
      }

      toast.success(successMessage)
      router.refresh()
    } catch {
      const message = 'Medya kaydi guncellenirken baglanti sorunu olustu.'
      setError(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-3">
      <input className="input-premium h-11 w-full" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Medya basligi" />
      <div className="flex flex-wrap items-center gap-3">
        <input type="number" className="input-premium h-11 w-28" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
        <button onClick={() => save({ title, sortOrder }, 'Medya duzenlendi.')} type="button" className="btn-ghost-premium h-11 px-4">
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
        {!initialIsCover ? (
          <button onClick={() => save({ isCover: true }, 'Kapak görseli güncellendi.')} type="button" className="btn-premium h-11 px-4">
            Kapaga Al
          </button>
        ) : (
          <span className="rounded-full border border-amber-400/25 px-3 py-2 text-xs text-amber-300">Kapak Görseli</span>
        )}
      </div>
      {error ? <p role="alert" aria-live="assertive" className="text-xs text-red-400">{error}</p> : null}
    </div>
  )
}
