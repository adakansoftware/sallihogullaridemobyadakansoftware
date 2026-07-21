import assert from 'node:assert/strict'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

async function run() {
  process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com'
  process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'super-secure-password'
  process.env.ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || '12345678901234567890123456789012'
  process.env.APP_ORIGIN = process.env.APP_ORIGIN || 'https://example.com'
  process.env.NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  const { normalizeAdminNextTarget } = await import('../lib/admin-redirect.ts')
  const { readJsonFileWithBackup, updateJsonFileAtomic } = await import('../lib/file-storage.ts')
  const { getComparableOrigin, resolveAllowedOrigin } = await import('../lib/origin.ts')
  const { hashPasswordWithScrypt, isValidPasswordHashFormat, verifyPasswordAgainstHash } = await import('../lib/password-hash.ts')
  const { createSignedAdminSessionToken, isValidSignedAdminSessionToken } = await import('../lib/session-token-core.ts')
  const { createSlug, ensureUniqueSlug } = await import('../lib/slug.ts')
  const {
    isAllowedRequestContentType,
    isRequestBodyWithinLimit,
    isTrustedOriginRequest,
  } = await import('../lib/request-guards-core.ts')
  const { isCleanPublicPathUrl, isPathInside } = await import('../lib/path-security.ts')

  assert.equal(createSlug('Demo Metro Projesi'), 'demo-metro-projesi')
  assert.equal(createSlug('  test   proje ###  '), 'test-proje')

  const projects = [
    { id: '1', slug: 'demo-proje' },
    { id: '2', slug: 'demo-proje-2' },
  ]

  assert.equal(ensureUniqueSlug('demo proje', projects), 'demo-proje-3')
  assert.equal(ensureUniqueSlug('demo proje', projects, '1'), 'demo-proje')

  assert.equal(normalizeAdminNextTarget('/admin'), '/admin')
  assert.equal(normalizeAdminNextTarget('/admin/projects/new'), '/admin/projects/new')
  assert.equal(normalizeAdminNextTarget('https://evil.example.com/admin'), '/admin')
  assert.equal(normalizeAdminNextTarget('/contact'), '/admin')
  assert.equal(normalizeAdminNextTarget('/admin/projects/../../settings'), '/admin')
  assert.equal(normalizeAdminNextTarget('//evil.example.com/admin'), '/admin')
  assert.equal(normalizeAdminNextTarget('/admin/%2f%2fevil.example.com'), '/admin')
  assert.equal(normalizeAdminNextTarget('/admin\r\nLocation: https://evil.example.com'), '/admin')
  assert.equal(isValidSignedAdminSessionToken(undefined, process.env.ADMIN_SESSION_SECRET), false)
  assert.equal(isValidSignedAdminSessionToken('invalid.token.extra', process.env.ADMIN_SESSION_SECRET), false)
  assert.equal(isValidSignedAdminSessionToken('eyJmb28iOiJiYXIifQ.invalid', process.env.ADMIN_SESSION_SECRET), false)
  assert.equal(isValidSignedAdminSessionToken('a'.repeat(513), process.env.ADMIN_SESSION_SECRET), false)
  assert.equal(isValidSignedAdminSessionToken(`${'a'.repeat(385)}.${'b'.repeat(43)}`, process.env.ADMIN_SESSION_SECRET), false)
  assert.equal(isValidSignedAdminSessionToken(createSignedAdminSessionToken(process.env.ADMIN_SESSION_SECRET, 60), process.env.ADMIN_SESSION_SECRET), true)

  const hashedPassword = hashPasswordWithScrypt('super-secure-password', Buffer.alloc(16, 7))
  assert.equal(isValidPasswordHashFormat(hashedPassword), true)
  assert.equal(verifyPasswordAgainstHash('super-secure-password', hashedPassword), true)
  assert.equal(verifyPasswordAgainstHash('wrong-password', hashedPassword), false)

  assert.equal(getComparableOrigin('https://example.com/path?q=1'), 'https://example.com')
  assert.equal(getComparableOrigin('not-a-url'), null)
  assert.equal(
    resolveAllowedOrigin({
      appOrigin: 'https://example.com/app',
      publicSiteUrl: undefined,
      nodeEnv: 'production',
      hostHeader: 'evil.example.com',
    }),
    'https://example.com',
  )
  assert.equal(
    resolveAllowedOrigin({
      appOrigin: undefined,
      publicSiteUrl: undefined,
      nodeEnv: 'production',
      hostHeader: 'preview.evil.example.com',
    }),
    null,
  )
  assert.equal(
    resolveAllowedOrigin({
      appOrigin: undefined,
      publicSiteUrl: undefined,
      nodeEnv: 'development',
      hostHeader: 'localhost:3000',
    }),
    'http://localhost:3000',
  )

  assert.equal(isCleanPublicPathUrl('/uploads/photo.jpg', 'uploads'), true)
  assert.equal(isCleanPublicPathUrl('/uploads/../images/logo.png', 'uploads'), false)
  assert.equal(isCleanPublicPathUrl('/uploads\\photo.jpg', 'uploads'), false)
  assert.equal(isCleanPublicPathUrl('/images/hero-main.jpg', 'images'), true)
  assert.equal(isCleanPublicPathUrl('/images/../uploads/photo.jpg', 'images'), false)
  assert.equal(isPathInside(path.join('public', 'uploads'), path.join('public', 'uploads', 'photo.jpg')), true)
  assert.equal(isPathInside(path.join('public', 'uploads'), path.join('public', 'uploads2', 'photo.jpg')), false)

  assert.equal(
    isAllowedRequestContentType(
      new Request('https://example.com/api/messages', {
        method: 'POST',
        headers: { 'content-type': 'application/json; charset=utf-8' },
      }),
      ['application/json'],
    ),
    true,
  )
  assert.equal(
    isAllowedRequestContentType(
      new Request('https://example.com/api/messages', {
        method: 'POST',
        headers: { 'content-type': 'text/plain; application/json' },
      }),
      ['application/json'],
    ),
    false,
  )
  assert.equal(
    isAllowedRequestContentType(
      new Request('https://example.com/api/messages', {
        method: 'POST',
        headers: { 'content-type': 'text/plain' },
      }),
      ['application/json'],
    ),
    false,
  )

  assert.equal(
    isRequestBodyWithinLimit(
      new Request('https://example.com/api/messages', {
        method: 'POST',
        headers: { 'content-length': '128' },
      }),
      256,
    ),
    true,
  )
  assert.equal(
    isRequestBodyWithinLimit(
      new Request('https://example.com/api/messages', {
        method: 'POST',
        headers: { 'content-length': '1024' },
      }),
      256,
    ),
    false,
  )
  assert.equal(
    isRequestBodyWithinLimit(
      new Request('https://example.com/api/messages', {
        method: 'POST',
        headers: { 'content-length': '-1' },
      }),
      256,
    ),
    false,
  )
  assert.equal(
    isRequestBodyWithinLimit(
      new Request('https://example.com/api/messages', {
        method: 'POST',
        headers: { 'content-length': 'not-a-number' },
      }),
      256,
    ),
    false,
  )

  assert.equal(
    isTrustedOriginRequest(
      new Request('https://example.com/api/projects', {
        method: 'POST',
        headers: {
          origin: 'https://example.com',
          referer: 'https://example.com/admin/projects',
        },
      }),
      'https://example.com',
    ),
    true,
  )
  assert.equal(
    isTrustedOriginRequest(
      new Request('https://example.com/api/projects', {
        method: 'POST',
        headers: {
          origin: 'https://evil.example.com',
          referer: 'https://evil.example.com/form',
        },
      }),
      'https://example.com',
    ),
    false,
  )
  assert.equal(
    isTrustedOriginRequest(
      new Request('https://example.com/api/projects', {
        method: 'POST',
        headers: {
          origin: 'https://example.com',
        },
      }),
      null,
    ),
    false,
  )

  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'sali-storage-test-'))
  const primaryFile = path.join(tempDir, 'projects.json')
  const backupFile = `${primaryFile}.bak`

  await writeFile(primaryFile, '{"invalid"', 'utf8')
  await writeFile(backupFile, JSON.stringify([{ id: 'backup-project' }], null, 2), 'utf8')

  const parsed = await readJsonFileWithBackup(
    primaryFile,
    {
      parse(value: unknown) {
        assert.ok(Array.isArray(value))
        return value as Array<{ id: string }>
      },
    },
    [],
  )

  assert.equal(parsed.source, 'backup')
  assert.equal(parsed.data[0]?.id, 'backup-project')

  const queueFile = path.join(tempDir, 'messages.json')
  const arraySchema = {
    parse(value: unknown) {
      assert.ok(Array.isArray(value))
      return value as string[]
    },
  }

  await Promise.all([
    updateJsonFileAtomic(queueFile, arraySchema, [], async (current) => {
      await new Promise((resolve) => setTimeout(resolve, 20))
      return [...current, 'first']
    }),
    updateJsonFileAtomic(queueFile, arraySchema, [], async (current) => {
      await new Promise((resolve) => setTimeout(resolve, 5))
      return [...current, 'second']
    }),
  ])

  const queued = await readJsonFileWithBackup(queueFile, arraySchema, [])
  assert.deepEqual(queued.data.sort(), ['first', 'second'])

  await rm(tempDir, { recursive: true, force: true })
  process.stdout.write('Lightweight verification passed.\n')
}

run()
