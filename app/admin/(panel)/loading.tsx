import Image from 'next/image'

export default function AdminPanelLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="brand-logo-pulse relative h-14 w-20 overflow-hidden bg-black">
          <Image
            src="/images/sallihogullari-logo-small.png"
            alt="Sallıhoğulları logo"
            fill
            sizes="80px"
            className="object-contain"
          />
        </div>
        <div className="h-4 w-32 animate-pulse bg-white/10" />
        <div className="h-16 max-w-2xl animate-pulse bg-white/10" />
        <div className="h-5 max-w-xl animate-pulse bg-white/5" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="h-36 animate-pulse rounded-[28px] border border-white/10 bg-white/[0.04]" />
        <div className="h-36 animate-pulse rounded-[28px] border border-white/10 bg-white/[0.04]" />
        <div className="h-36 animate-pulse rounded-[28px] border border-white/10 bg-white/[0.04]" />
        <div className="h-36 animate-pulse rounded-[28px] border border-white/10 bg-white/[0.04]" />
      </div>
    </div>
  )
}
