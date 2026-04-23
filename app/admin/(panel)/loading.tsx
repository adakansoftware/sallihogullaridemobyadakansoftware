export default function AdminPanelLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
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
