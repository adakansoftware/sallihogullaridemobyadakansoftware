import Link from 'next/link'
import type { SiteSettings } from '@/lib/store'

export function AdminTopbar({ settings, unreadCount }: { settings: SiteSettings; unreadCount: number }) {
  return (
    <div className="industrial-border sticky top-0 z-20 rounded-[28px] bg-black/45 px-5 py-4 backdrop-blur-xl">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="section-eyebrow mb-3">Kontrol Merkezi</div>
          <div className="text-2xl font-semibold tracking-[-0.02em] text-white">Yönetim Paneli</div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="data-label text-white/40">Marka</div>
            <div className="mt-2 text-sm text-white/80">{settings.companyShortName}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="data-label text-white/40">Okunmamış</div>
            <div className="mt-2 text-sm text-white/80">{unreadCount} mesaj</div>
          </div>
          <Link href="/" className="btn-ghost-premium inline-flex h-[58px] items-center px-5">
            Siteyi Gör
          </Link>
        </div>
      </div>
    </div>
  )
}
