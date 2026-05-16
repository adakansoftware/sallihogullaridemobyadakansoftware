import crypto from 'crypto'

const SCRYPT_PREFIX = 'scrypt'
const SCRYPT_KEYLEN = 64

function safeEqual(left: Buffer, right: Buffer) {
  if (left.length !== right.length) return false
  return crypto.timingSafeEqual(left, right)
}

export function hashPasswordWithScrypt(password: string, salt?: Buffer) {
  const nextSalt = salt || crypto.randomBytes(16)
  const derived = crypto.scryptSync(password, nextSalt, SCRYPT_KEYLEN)
  return `${SCRYPT_PREFIX}:${nextSalt.toString('base64url')}:${derived.toString('base64url')}`
}

export function isValidPasswordHashFormat(value: string) {
  const [prefix, salt, derived] = value.split(':')
  return prefix === SCRYPT_PREFIX && Boolean(salt) && Boolean(derived)
}

export function verifyPasswordAgainstHash(password: string, encodedHash: string) {
  if (!isValidPasswordHashFormat(encodedHash)) return false

  const [, saltEncoded, derivedEncoded] = encodedHash.split(':')

  try {
    const salt = Buffer.from(saltEncoded, 'base64url')
    const expected = Buffer.from(derivedEncoded, 'base64url')
    const actual = crypto.scryptSync(password, salt, expected.length || SCRYPT_KEYLEN)
    return safeEqual(actual, expected)
  } catch {
    return false
  }
}
