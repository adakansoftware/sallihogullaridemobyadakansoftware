export default function RootLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-8 lg:py-32">
        <div className="space-y-6">
          <div className="h-4 w-28 animate-pulse bg-white/10" />
          <div className="h-16 max-w-3xl animate-pulse bg-white/10" />
          <div className="h-6 max-w-2xl animate-pulse bg-white/5" />
        </div>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          <div className="h-72 animate-pulse border border-white/10 bg-white/[0.03]" />
          <div className="h-72 animate-pulse border border-white/10 bg-white/[0.03]" />
          <div className="h-72 animate-pulse border border-white/10 bg-white/[0.03]" />
        </div>
      </div>
    </main>
  )
}
