"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function LoginForm({ nextPath = '/admin' }: { nextPath?: string }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return

    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json().catch(() => ({}))
    setLoading(false)

    if (!res.ok) {
      const message = data.message || 'Giris basarisiz.'
      setError(message)
      toast.error(message)
      return
    }

    toast.success('Giris basarili.')
    router.push(nextPath)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={loading} className="industrial-border premium-shadow w-full max-w-md rounded-[30px] bg-white/[0.045] p-8 md:p-9">
      <div className="section-eyebrow mb-4">Admin girisi</div>
      <h1 className="font-display text-5xl text-white">Yonetim Paneli</h1>
      <p className="mt-3 text-white/60">Yalnizca yetkili kullanicilar icin guvenli giris alani.</p>

      <div className="mt-8 space-y-5">
        <div>
          <label htmlFor="admin-email" className="mb-2 block text-sm font-medium text-white/70">E-posta</label>
          <input
            id="admin-email"
            type="email"
            className="input-premium w-full"
            placeholder="admin@firma.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            inputMode="email"
            required
          />
        </div>

        <div>
          <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-white/70">Sifre</label>
          <input
            id="admin-password"
            type="password"
            className="input-premium w-full"
            placeholder="Sifrenizi girin"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
      </div>

      {error ? <p role="alert" className="mt-4 rounded-2xl border border-red-400/15 bg-red-400/8 px-4 py-3 text-sm text-red-300">{error}</p> : null}

      <button type="submit" disabled={loading} className="btn-premium mt-6 h-12 w-full px-6">
        {loading ? 'Giris yapiliyor...' : 'Giris Yap'}
      </button>
    </form>
  )
}
