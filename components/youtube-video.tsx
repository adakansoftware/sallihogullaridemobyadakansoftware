import { getYouTubeEmbedUrl } from '@/lib/youtube'

export function YouTubeVideo({ url, title, className }: { url: string; title: string; className?: string }) {
  const embedUrl = getYouTubeEmbedUrl(url)

  if (!embedUrl) {
    return (
      <div className={className}>
        <div className="flex h-full w-full items-center justify-center bg-black/50 px-4 text-center text-sm text-white/60">
          YouTube videosu gosterilemiyor.
        </div>
      </div>
    )
  }

  return (
    <iframe
      src={embedUrl}
      title={title}
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      className={className}
    />
  )
}
