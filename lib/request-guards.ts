import { ApiError } from '@/lib/api-error'
import {
  isAllowedRequestContentType,
  isRequestBodyWithinLimit,
  isTrustedOriginRequest,
} from '@/lib/request-guards-core'

export function assertTrustedOriginHeaders(request: Request, allowedOrigin: string | null) {
  if (!allowedOrigin) {
    throw new ApiError(403, 'Güvenilir site origin ayarı eksik.')
  }

  if (!isTrustedOriginRequest(request, allowedOrigin)) {
    throw new ApiError(403, 'İstek kaynağı doğrulanamadı.')
  }
}

export function assertRequestContentType(request: Request, allowedContentTypes: string[]) {
  if (!isAllowedRequestContentType(request, allowedContentTypes)) {
    throw new ApiError(415, 'İstek içeriği beklenen formatta değil.')
  }
}

export function assertRequestBodySize(request: Request, maxBytes: number) {
  if (!isRequestBodyWithinLimit(request, maxBytes)) {
    throw new ApiError(413, 'İstek boyutu sınırı aşıldı.')
  }
}
