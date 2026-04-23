import { ApiError } from '@/lib/api-error'
import {
  isAllowedRequestContentType,
  isRequestBodyWithinLimit,
  isTrustedOriginRequest,
} from '@/lib/request-guards-core'

export function assertTrustedOriginHeaders(request: Request, allowedOrigin: string | null) {
  if (!isTrustedOriginRequest(request, allowedOrigin)) {
    throw new ApiError(403, 'Istek kaynagi dogrulanamadi.')
  }
}

export function assertRequestContentType(request: Request, allowedContentTypes: string[]) {
  if (!isAllowedRequestContentType(request, allowedContentTypes)) {
    throw new ApiError(415, 'Istek icerigi beklenen formatta degil.')
  }
}

export function assertRequestBodySize(request: Request, maxBytes: number) {
  if (!isRequestBodyWithinLimit(request, maxBytes)) {
    throw new ApiError(413, 'Istek boyutu siniri asildi.')
  }
}
