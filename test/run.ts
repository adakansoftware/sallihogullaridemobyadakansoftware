import assert from 'node:assert/strict'
import { createSlug, ensureUniqueSlug, replaceTurkishLetters } from '../lib/slug.ts'
import { hasAllowedUploadExtension, sanitizeUploadBaseName } from '../lib/upload-policy.ts'
import { isAllowedFileSignature } from '../lib/upload-security.ts'

function run() {
  assert.equal(replaceTurkishLetters('Çığ ÖŞÜ çğışöü'), 'cig osu cgisou')

  assert.equal(createSlug('Başakşehir Metro Altyapı Projesi'), 'basaksehir-metro-altyapi-projesi')
  assert.equal(createSlug('  test   proje ###  '), 'test-proje')

  const projects = [
    { id: '1', slug: 'demo-proje' },
    { id: '2', slug: 'demo-proje-2' },
  ]

  assert.equal(ensureUniqueSlug('demo proje', projects), 'demo-proje-3')
  assert.equal(ensureUniqueSlug('demo proje', projects, '1'), 'demo-proje')

  assert.equal(sanitizeUploadBaseName('../../../teklif formu!!.jpg'), 'teklif-formu')
  assert.equal(hasAllowedUploadExtension('photo.jpeg', 'jpg'), true)
  assert.equal(hasAllowedUploadExtension('photo.png', 'jpg'), false)
  assert.equal(hasAllowedUploadExtension('clip.mov', 'mov'), true)

  const jpegBuffer = new Uint8Array([0xff, 0xd8, 0xff, 0xee, 0x00])
  const fakeBuffer = new Uint8Array([0x00, 0x11, 0x22, 0x33, 0x44])

  assert.equal(isAllowedFileSignature('image/jpeg', jpegBuffer), true)
  assert.equal(isAllowedFileSignature('image/jpeg', fakeBuffer), false)

  console.log('Lightweight verification passed.')
}

run()
