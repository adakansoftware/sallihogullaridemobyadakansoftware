import type { SiteSettings } from '@/lib/store'

export function AdminFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-10">
      <div className="industrial-border rounded-[28px] bg-white/[0.03] px-5 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="data-label text-white/40">Panel Alt Bilgisi</div>
            <div className="mt-1 text-sm text-white/60">
              © {new Date().getFullYear()} {settings.companyName}. Tüm hakları saklıdır.
            </div>
          </div>
          <div className="text-sm text-white/55">
            Design by{' '}
            <a
              href="https://www.instagram.com/adakansoftware"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white transition-colors hover:text-amber-300"
            >
              Adakan Software
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
