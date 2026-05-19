const MAX_SESSION_TOKEN_LENGTH = 512
const MAX_SESSION_PAYLOAD_LENGTH = 384
const SESSION_SIGNATURE_LENGTH = 43
const BASE64URL_PATTERN = /^[A-Za-z0-9_-]+$/

type SessionPayload = {
  sub: 'admin'
  exp: number
  iat: number
}

function isValidSessionPayload(value: unknown): value is SessionPayload {
  if (!value || typeof value !== 'object') return false

  const candidate = value as Record<string, unknown>
  return (
    candidate.sub === 'admin' &&
    typeof candidate.exp === 'number' &&
    Number.isInteger(candidate.exp) &&
    candidate.exp > 0 &&
    typeof candidate.iat === 'number' &&
    Number.isInteger(candidate.iat) &&
    candidate.iat >= 0
  )
}

function decodeBase64UrlToText(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const paddingLength = (4 - (normalized.length % 4)) % 4
  const padded = normalized.padEnd(normalized.length + paddingLength, '=')

  if (typeof atob !== 'function') {
    return null
  }

  try {
    const binary = atob(padded)
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  } catch {
    return null
  }
}

function decodeBase64UrlToBytes(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const paddingLength = (4 - (normalized.length % 4)) % 4
  const padded = normalized.padEnd(normalized.length + paddingLength, '=')

  if (typeof atob !== 'function') {
    return null
  }

  try {
    const binary = atob(padded)
    return Uint8Array.from(binary, (char) => char.charCodeAt(0))
  } catch {
    return null
  }
}

function isValidTokenShape(token: string | undefined) {
  if (!token) return false
  if (token.length > MAX_SESSION_TOKEN_LENGTH) return false

  const segments = token.split('.')
  if (segments.length !== 2) return false

  const [encodedPayload, signature] = segments
  if (!encodedPayload || !signature) return false
  if (encodedPayload.length > MAX_SESSION_PAYLOAD_LENGTH) return false
  if (signature.length !== SESSION_SIGNATURE_LENGTH) return false
  if (!BASE64URL_PATTERN.test(encodedPayload) || !BASE64URL_PATTERN.test(signature)) return false

  return true
}

async function signSessionPayload(encodedPayload: string, secret: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )

  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(encodedPayload))
  const bytes = new Uint8Array(signature)
  let binary = ''

  for (const value of bytes) {
    binary += String.fromCharCode(value)
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function safeEqualBase64Url(left: string, right: string) {
  const leftBytes = decodeBase64UrlToBytes(left)
  const rightBytes = decodeBase64UrlToBytes(right)

  if (!leftBytes || !rightBytes || leftBytes.length !== rightBytes.length) {
    return false
  }

  let diff = 0
  for (let index = 0; index < leftBytes.length; index += 1) {
    diff |= leftBytes[index] ^ rightBytes[index]
  }

  return diff === 0
}

export async function isValidSignedAdminSessionTokenEdge(token: string | undefined, secret: string) {
  if (!isValidTokenShape(token)) return false

  const safeToken = token as string
  const [encodedPayload, signature] = safeToken.split('.')
  const expectedSignature = await signSessionPayload(encodedPayload, secret)

  if (!safeEqualBase64Url(expectedSignature, signature)) {
    return false
  }

  const rawPayload = decodeBase64UrlToText(encodedPayload)
  if (!rawPayload) {
    return false
  }

  try {
    const payload = JSON.parse(rawPayload) as unknown
    if (!isValidSessionPayload(payload)) {
      return false
    }

    const now = Math.floor(Date.now() / 1000)
    return payload.sub === 'admin' && payload.iat <= now && payload.exp > now
  } catch {
    return false
  }
}
