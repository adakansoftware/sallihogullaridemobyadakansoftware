"use client";

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export function ToggleReadButton({ messageId, isRead }: { messageId: string; isRead: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleToggle() {
    setLoading(true)
    setError('')

    const res = await fetch(`/api/messages/${messageId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isRead: !isRead }),
    })
    const data = await res.json().catch(() => ({}))
    setLoading(false)

    if (!res.ok) {
      const message = data.message || 'Mesaj güncellenemedi.'
      setError(message)
      toast.error(message)
      return
    }

    toast.success(isRead ? 'Mesaj tekrar yeni olarak işaretlendi.' : 'Mesaj okundu olarak işaretlendi.')
    router.refresh()
  }

  return (
    <div className="space-y-2">
      <button onClick={handleToggle} disabled={loading} className="btn-ghost-premium h-10 px-4">
        {loading ? '...' : isRead ? 'Yeniden Yeni Yap' : 'Okundu Yap'}
      </button>
      {error ? <div className="text-xs text-red-300">{error}</div> : null}
    </div>
  )
}
