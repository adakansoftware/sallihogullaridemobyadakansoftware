const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{6,20}$/

export function getYouTubeVideoId(value: string) {
  try {
    const url = new URL(value.trim())
    const host = url.hostname.replace(/^www\./, '').replace(/^m\./, '')

    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0]
      return id && YOUTUBE_ID_PATTERN.test(id) ? id : null
    }

    if (host !== 'youtube.com' && host !== 'youtube-nocookie.com') {
      return null
    }

    const watchId = url.searchParams.get('v')
    if (watchId && YOUTUBE_ID_PATTERN.test(watchId)) return watchId

    const [, kind, id] = url.pathname.split('/')
    if (['embed', 'shorts', 'live'].includes(kind) && id && YOUTUBE_ID_PATTERN.test(id)) {
      return id
    }

    return null
  } catch {
    return null
  }
}

export function isYouTubeUrl(value: string) {
  return Boolean(getYouTubeVideoId(value))
}

export function getYouTubeEmbedUrl(value: string) {
  const id = getYouTubeVideoId(value)
  return id ? `https://www.youtube.com/embed/${id}` : ''
}

export function getYouTubeWatchUrl(value: string) {
  const id = getYouTubeVideoId(value)
  return id ? `https://www.youtube.com/watch?v=${id}` : value
}
