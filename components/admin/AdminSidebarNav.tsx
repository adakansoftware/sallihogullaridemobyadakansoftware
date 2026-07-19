"use client";

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FolderKanban, LayoutDashboard, Mail, Settings, Truck } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projeler', icon: FolderKanban },
  { href: '/admin/fleet', label: 'Filo', icon: Truck },
  { href: '/admin/messages', label: 'Mesajlar', icon: Mail },
  { href: '/admin/settings', label: 'Site Ayarları', icon: Settings },
]

function isActive(pathname: string, href: string) {
  if (href === '/admin') return pathname === '/admin'
  return pathname.startsWith(href)
}

export function AdminSidebarNav({ unreadCount }: { unreadCount: number }) {
  const pathname = usePathname()

  return (
    <nav className="mt-8 space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon
        const active = isActive(pathname, item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`admin-nav-link ${active ? 'admin-nav-link-active' : ''}`}
          >
            <span className="flex items-center gap-3">
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </span>
            {item.href === '/admin/messages' ? (
              <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-xs text-amber-300">
                {unreadCount}
              </span>
            ) : null}
          </Link>
        )
      })}
    </nav>
  )
}
