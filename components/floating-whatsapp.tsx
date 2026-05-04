import { Instagram, MessageCircle } from 'lucide-react'
import { isRealWhatsAppUrl } from '@/lib/contact-utils'
import type { SiteSettings } from '@/lib/store'

export function FloatingWhatsApp({ settings }: { settings: SiteSettings }) {
  const hasWhatsApp = isRealWhatsAppUrl(settings.whatsappUrl)
  const hasInstagram = Boolean(settings.instagramUrl)

  if (!hasWhatsApp && !hasInstagram) return null

  return (
    <div className="fixed right-5 bottom-5 z-40 flex flex-col items-end gap-3 md:right-6 md:bottom-6">
      {hasInstagram ? (
        <a
          href={settings.instagramUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram profilini aç"
          className="group flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-pink-300/25 bg-gradient-to-br from-pink-500 via-rose-500 to-amber-400 text-white shadow-[0_18px_45px_rgba(244,63,94,0.24)] transition-all duration-300 hover:w-48 focus-visible:w-48 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300/70"
        >
          <Instagram className="h-6 w-6 shrink-0 transition-transform duration-300 group-hover:scale-105" />
          <span className="ml-0 max-w-0 whitespace-nowrap text-sm font-bold uppercase tracking-wider opacity-0 transition-all duration-300 group-hover:ml-3 group-hover:max-w-36 group-hover:opacity-100 group-focus-visible:ml-3 group-focus-visible:max-w-36 group-focus-visible:opacity-100">
            Instagram
          </span>
        </a>
      ) : null}

      {hasWhatsApp ? (
        <a
          href={settings.whatsappUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp ile yaz"
          className="group flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-emerald-300/25 bg-emerald-500 text-white shadow-[0_18px_45px_rgba(16,185,129,0.28)] transition-all duration-300 hover:w-52 hover:bg-emerald-500/95 focus-visible:w-52 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70"
        >
          <MessageCircle className="h-6 w-6 shrink-0 transition-transform duration-300 group-hover:scale-105" />
          <span className="ml-0 max-w-0 whitespace-nowrap text-sm font-bold uppercase tracking-wider opacity-0 transition-all duration-300 group-hover:ml-3 group-hover:max-w-40 group-hover:opacity-100 group-focus-visible:ml-3 group-focus-visible:max-w-40 group-focus-visible:opacity-100">
            WhatsApp ile yaz
          </span>
        </a>
      ) : null}
    </div>
  )
}
