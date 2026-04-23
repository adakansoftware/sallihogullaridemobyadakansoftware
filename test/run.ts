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
  const { readJsonFileWithBackup } = await import('../lib/file-storage.ts')
  const { createSlug, ensureUniqueSlug } = await import('../lib/slug.ts')
  const { hasAllowedUploadExtension, sanitizeUploadBaseName } = await import('../lib/upload-policy.ts')
  const { isAllowedFileSignature } = await import('../lib/upload-security.ts')

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

  assert.equal(sanitizeUploadBaseName('../../../teklif formu!!.jpg'), 'teklif-formu')
  assert.equal(hasAllowedUploadExtension('photo.jpeg', 'jpg'), true)
  assert.equal(hasAllowedUploadExtension('photo.png', 'jpg'), false)
  assert.equal(hasAllowedUploadExtension('clip.mov', 'mov'), true)

  const jpegBuffer = new Uint8Array([0xff, 0xd8, 0xff, 0xee, 0x00])
  const fakeBuffer = new Uint8Array([0x00, 0x11, 0x22, 0x33, 0x44])

  assert.equal(isAllowedFileSignature('image/jpeg', jpegBuffer), true)
  assert.equal(isAllowedFileSignature('image/jpeg', fakeBuffer), false)

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

  await rm(tempDir, { recursive: true, force: true })
  console.log('Lightweight verification passed.')
}

run()
