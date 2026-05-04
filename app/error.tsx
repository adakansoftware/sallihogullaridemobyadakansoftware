"use client";

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function RootError({ reset }: ErrorProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-6 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.08),transparent_32%)]" />
      <div className="container-shell relative z-10 flex min-h-[80vh] items-center justify-center">
        <div className="w-full max-w-3xl rounded-[36px] border border-white/10 bg-white/[0.025] p-8 text-center md:p-12">
          <div className="section-eyebrow mb-4">Geçici sorun</div>
          <h1 className="font-display text-5xl leading-[0.95] text-white md:text-6xl">Sayfa şimdi yüklenemedi</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/60">
            Bağlantı veya sunucu tarafında kısa süreli bir aksaklık oluştu. Sayfayı yeniden deneyebilirsiniz.
          </p>
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-12 items-center bg-primary px-6 text-xs font-bold uppercase tracking-wider text-primary-foreground transition hover:bg-primary/90"
            >
              Tekrar dene
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
