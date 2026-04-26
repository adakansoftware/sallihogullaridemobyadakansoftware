import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AdminFooter } from '@/components/admin/AdminFooter'
import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { LogoutButton } from '@/components/admin/LogoutButton'
import { isAdminAuthenticated } from '@/lib/auth'
import { readMessages, readSettings } from '@/lib/store'

export const metadata: Metadata = {
  title: 'Admin Panel',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminPanelLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login')
  }

  const [settings, messages] = await Promise.all([readSettings(), readMessages()])
  const unreadCount = messages.filter((item) => !item.isRead).length

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.08),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.06),transparent_30%)]" />
      <div className="relative grid min-h-screen lg:grid-cols-[320px_1fr]">
        <aside className="border-r border-white/10 bg-black/55 p-6 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
          <Link href="/admin" className="block rounded-[30px] border border-white/10 bg-white/[0.035] p-5 transition hover:border-amber-400/15 hover:bg-white/[0.05]">
            <div className="section-eyebrow mb-3">Yönetim Merkezi</div>
            <div className="break-words font-display text-[clamp(0.96rem,0.92rem+0.34vw,1.08rem)] leading-[1.1] tracking-[0.04em] text-white">
              {settings.companyShortName.toUpperCase()}
            </div>
            <div className="mt-3 break-words text-sm text-white/55">{settings.companyName}</div>
          </Link>

          <nav className="mt-8 space-y-2">
            <Link href="/admin" className="block rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white/80 transition hover:bg-white/[0.06]">Dashboard</Link>
            <Link href="/admin/projects" className="block rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white/80 transition hover:bg-white/[0.06]">Projeler</Link>
            <Link href="/admin/messages" className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white/80 transition hover:bg-white/[0.06]">
              <span>Mesajlar</span>
              <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-xs text-amber-300">{unreadCount}</span>
            </Link>
            <Link href="/admin/settings" className="block rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white/80 transition hover:bg-white/[0.06]">Site Ayarları</Link>
          </nav>

          <div className="mt-8 rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
            <div className="data-label text-white/40">İletişim</div>
            <div className="mt-3 text-2xl text-white">Hazır</div>
            <p className="mt-2 break-words text-sm text-white/55">{settings.serviceArea}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/55">
              <span className="max-w-full break-all rounded-full border border-white/10 px-3 py-1">{settings.contactPhone}</span>
              <span className="max-w-full break-all rounded-full border border-white/10 px-3 py-1">{settings.contactEmail}</span>
            </div>
          </div>

          <div className="mt-8">
            <LogoutButton />
          </div>
        </aside>

        <main className="flex min-h-screen min-w-0 flex-col p-4 md:p-8">
          <AdminTopbar settings={settings} unreadCount={unreadCount} />
          <div className="flex-1 pt-6">
            <div className="rounded-[28px] border border-white/8 bg-white/[0.025] p-4 md:rounded-[34px] md:p-7">
              {children}
            </div>
          </div>
          <AdminFooter settings={settings} />
        </main>
      </div>
    </div>
  )
}
