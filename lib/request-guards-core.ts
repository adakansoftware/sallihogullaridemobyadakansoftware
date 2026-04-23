export function getComparableOrigin(value: string | null) {
  if (!value) return null

  try {
    return new URL(value).origin
  } catch {
    return null
  }
}

export function hasMatchingOrigin(origin: string | null, allowedOrigin: string) {
  return !origin || origin === allowedOrigin
}

export function isTrustedOriginRequest(request: Request, allowedOrigin: string | null) {
  if (!allowedOrigin) return true

  const requestOrigin = getComparableOrigin(request.headers.get('origin'))
  const refererOrigin = getComparableOrigin(request.headers.get('referer'))

  if (!requestOrigin && !refererOrigin) {
    return false
  }

  return hasMatchingOrigin(requestOrigin, allowedOrigin) && hasMatchingOrigin(refererOrigin, allowedOrigin)
}

export function isAllowedRequestContentType(request: Request, allowedContentTypes: string[]) {
  const contentType = request.headers.get('content-type')?.toLowerCase() || ''
  return allowedContentTypes.some((value) => contentType.includes(value))
}

export function isRequestBodyWithinLimit(request: Request, maxBytes: number) {
  const contentLength = Number(request.headers.get('content-length'))
  return !Number.isFinite(contentLength) || contentLength <= maxBytes
}
