"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Menu, Phone, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SiteSettings } from '@/lib/store'
import { siteQuickLinks } from '@/lib/site-content'

export function Navbar({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'border-b border-border/40 bg-background/95 backdrop-blur-xl' : 'bg-gradient-to-b from-background/80 to-transparent'
      }`}
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <nav className="flex h-20 items-center justify-between lg:h-24">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center bg-primary">
              <span className="text-lg font-black tracking-tighter text-primary-foreground">{settings.companyShortName.slice(0, 2).toUpperCase()}</span>
            </div>
            <div className="hidden flex-col leading-tight sm:flex">
              <span className="text-lg font-bold uppercase tracking-tight text-foreground">{settings.companyName}</span>
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">{settings.serviceArea}</span>
            </div>
          </Link>

          <div className="hidden items-center gap-0 lg:flex">
            {siteQuickLinks.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group relative px-5 py-2.5 text-[13px] font-semibold uppercase tracking-wide transition-colors duration-300 ${
                    isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-1 left-5 right-5 h-0.5 origin-left bg-primary transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              )
            })}
          </div>

          <div className="hidden items-center gap-5 lg:flex">
            <a href={`tel:${settings.contactPhone.replace(/\s+/g, '')}`} className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <Phone className="h-4 w-4 text-primary" />
              <span className="font-semibold">{settings.contactPhone}</span>
            </a>
            <Button asChild className="h-11 gap-2 bg-primary px-6 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90">
              <Link href="/contact">
                Teklif Al
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <button onClick={() => setIsMobileMenuOpen((value) => !value)} className="p-2 text-foreground lg:hidden" aria-label="Menü">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </div>

      <div
        className={`absolute top-full left-0 right-0 border-b border-border bg-background transition-all duration-300 lg:hidden ${
          isMobileMenuOpen ? 'visible opacity-100' : 'invisible pointer-events-none opacity-0'
        }`}
      >
        <div className="space-y-1 px-6 py-6">
          {siteQuickLinks.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-current={isActive ? 'page' : undefined}
                className={`block px-4 py-3.5 text-base font-semibold uppercase tracking-wide transition-colors ${
                  isActive ? 'bg-secondary/60 text-primary' : 'text-foreground hover:bg-secondary/50 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
          <div className="mt-4 space-y-4 border-t border-border pt-6">
            <a href={`tel:${settings.contactPhone.replace(/\s+/g, '')}`} className="flex items-center gap-3 px-4 py-3 text-muted-foreground">
              <Phone className="h-5 w-5 text-primary" />
              <span className="font-semibold">{settings.contactPhone}</span>
            </a>
            <Button asChild className="h-12 w-full bg-primary font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90">
              <Link href="/contact">Teklif Al</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
