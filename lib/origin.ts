export function getComparableOrigin(value: string | null) {
  if (!value) return null

  try {
    return new URL(value).origin
  } catch {
    return null
  }
}

export function resolveAllowedOrigin(options: {
  appOrigin?: string
  publicSiteUrl?: string
  nodeEnv: 'development' | 'test' | 'production'
  hostHeader: string | null
}) {
  const configuredOrigin = getComparableOrigin(options.appOrigin || options.publicSiteUrl || null)
  if (configuredOrigin) {
    return configuredOrigin
  }

  if (options.nodeEnv === 'production') {
    return null
  }

  if (!options.hostHeader) {
    return null
  }

  const protocol = options.nodeEnv === 'development' ? 'http' : 'https'
  return getComparableOrigin(`${protocol}://${options.hostHeader}`)
}
