import Link from 'next/link'
import { Bell, ExternalLink, Sparkles } from 'lucide-react'
import type { SiteSettings } from '@/lib/store'

export function AdminTopbar({ settings, unreadCount }: { settings: SiteSettings; unreadCount: number }) {
  return (
    <div className="admin-surface sticky top-0 z-20 min-w-0 rounded-[28px] px-5 py-4 backdrop-blur-xl">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="section-eyebrow mb-3">Kontrol Merkezi</div>
          <div className="text-2xl font-semibold tracking-[-0.02em] text-white">Yönetim Paneli</div>
          <p className="mt-2 max-w-2xl text-sm text-white/55">
            İçerik, medya ve mesaj akışını tek ekrandan hızlı şekilde yönetin.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="admin-surface-muted min-w-0 rounded-2xl px-4 py-3">
            <div className="data-label text-white/40">Marka</div>
            <div className="mt-2 max-w-[180px] truncate text-sm text-white/80 sm:max-w-none">{settings.companyShortName}</div>
          </div>
          <div className="admin-surface-muted rounded-2xl px-4 py-3">
            <div className="data-label text-white/40">Durum</div>
            <div className="mt-2 flex items-center gap-2 text-sm text-emerald-300">
              <Sparkles className="h-4 w-4" />
              Panel aktif
            </div>
          </div>
          <div className="admin-surface-muted rounded-2xl px-4 py-3">
            <div className="data-label text-white/40">Okunmamış</div>
            <div className="mt-2 flex items-center gap-2 text-sm text-white/80">
              <Bell className="h-4 w-4 text-amber-300" />
              {unreadCount} mesaj
            </div>
          </div>
          <Link href="/" className="btn-ghost-premium inline-flex h-[58px] items-center justify-center gap-2 px-5">
            Siteyi Gör
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
