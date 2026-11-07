// End-to-end verification against a real production server.
//
// Prerequisites: a production build must exist (`npm run build`).
// The script boots `next start` on a dedicated port with isolated admin
// credentials, exercises the public site, auth, contact and project CRUD
// flows over real HTTP, cleans up everything it created, and shuts the
// server down.

import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import path from 'node:path'
import process from 'node:process'

const PORT = Number(process.env.E2E_PORT || 3311)
const ORIGIN = `http://127.0.0.1:${PORT}`
const ADMIN_EMAIL = 'e2e@example.com'
const ADMIN_PASSWORD = 'e2e-test-password-123'
const ADMIN_SESSION_SECRET = 'e2e-session-secret-0123456789abcdef'
const BUILD_ID_FILE = path.join(process.cwd(), '.next', 'BUILD_ID')
const NEXT_BIN = path.join(process.cwd(), 'node_modules', 'next', 'dist', 'bin', 'next')

const PROJECT_PAYLOAD = {
  title: 'E2E Doğrulama Projesi',
  summary: 'E2E testi tarafından oluşturulan geçici proje kaydı.',
  description: 'Bu proje E2E doğrulama süreci tarafından oluşturulur ve test sonunda silinir.',
  location: 'Adana',
  category: 'E2E',
  coverImage: '/images/dump-truck.jpg',
  status: 'Taslak',
  featured: false,
  tags: ['E2E'],
}

const CONTACT_PAYLOAD = {
  name: 'E2E Test Kullanıcısı',
  phone: '05551112233',
  email: 'e2e-lead@example.com',
  subject: 'E2E Test Teklif Talebi',
  message: 'Bu talep E2E test sürecinden gelmektedir ve sonrasında silinmektedir.',
}

type Server = ReturnType<typeof spawn>

let server: Server | null = null
let adminCookie = ''
let createdProjectId: string | undefined
let contactReference: string | undefined

function step(message: string) {
  process.stdout.write(`ok - ${message}\n`)
}

async function request(pathname: string, init: RequestInit = {}) {
  return fetch(`${ORIGIN}${pathname}`, init)
}

function postJson(pathname: string, body: unknown, extraHeaders: Record<string, string> = {}) {
  return request(pathname, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: ORIGIN,
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  })
}

function patchJson(pathname: string, body: unknown, extraHeaders: Record<string, string> = {}) {
  return request(pathname, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      origin: ORIGIN,
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  })
}

function loginRequest(email: string, password: string, origin = ORIGIN) {
  return request('/api/auth/login', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin,
    },
    body: JSON.stringify({ email, password }),
  })
}

function extractSessionCookie(response: Response) {
  const setCookieValues =
    typeof response.headers.getSetCookie === 'function'
      ? response.headers.getSetCookie()
      : [response.headers.get('set-cookie') || '']

  const sessionCookie = setCookieValues.find((value) => value.includes('admin_session'))
  assert.ok(sessionCookie, 'login response should set the admin session cookie')
  return sessionCookie.split(';')[0]
}

async function startServer() {
  assert.ok(existsSync(BUILD_ID_FILE), 'Production build missing. Run `npm run build` before `npm run test:e2e`.')

  // A real scrypt hash for the isolated test password. The server prefers
  // ADMIN_PASSWORD_HASH over the plaintext ADMIN_PASSWORD, and an explicit
  // env value also overrides any hash a developer may have in .env.
  const { hashPasswordWithScrypt } = await import('../lib/password-hash.ts')
  const adminPasswordHash = hashPasswordWithScrypt(ADMIN_PASSWORD)

  server = spawn(process.execPath, [NEXT_BIN, 'start', '-p', String(PORT)], {
    env: {
      ...process.env,
      NODE_ENV: 'production',
      ADMIN_EMAIL,
      ADMIN_PASSWORD,
      ADMIN_PASSWORD_HASH: adminPasswordHash,
      ADMIN_SESSION_SECRET,
      APP_ORIGIN: ORIGIN,
      NEXT_PUBLIC_SITE_URL: ORIGIN,
      CONTENT_STORE: 'file',
      RATE_LIMIT_STORE: 'memory',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  server.stdout?.on('data', () => undefined)
  server.stderr?.on('data', () => undefined)

  const deadline = Date.now() + 60_000

  for (;;) {
    if (server.exitCode !== null) {
      throw new Error(`Server exited unexpectedly during startup (code ${server.exitCode}).`)
    }

    try {
      const response = await request('/api/health')
      if (response.status > 0) return
    } catch {
      // Server not ready yet.
    }

    if (Date.now() > deadline) {
      throw new Error('Server did not become ready within 60 seconds.')
    }

    await new Promise((resolve) => setTimeout(resolve, 250))
  }
}

async function stopServer() {
  if (!server || server.exitCode !== null) return

  const exited = new Promise<void>((resolve) => {
    server?.once('exit', () => resolve())
    setTimeout(resolve, 10_000)
  })

  server.kill()
  await exited
}

async function deleteProjectIfExists(projectId?: string) {
  if (!projectId) return

  const response = await request(`/api/projects/${projectId}`, {
    method: 'DELETE',
    headers: { origin: ORIGIN, cookie: adminCookie },
  })

  if (response.ok) step(`cleanup: test project removed (${projectId})`)
}

async function deleteMessageByReference(reference?: string) {
  if (!reference) return

  const response = await request('/api/messages', { headers: { cookie: adminCookie, origin: ORIGIN } })
  if (!response.ok) return

  const messages = (await response.json()) as Array<{ id: string; reference?: string }>
  const match = messages.find((message) => message.reference === reference)
  if (!match) return

  const deleted = await request(`/api/messages/${match.id}`, {
    method: 'DELETE',
    headers: { origin: ORIGIN, cookie: adminCookie },
  })

  if (deleted.ok) step(`cleanup: test message removed (${match.id})`)
}

async function cleanupContactOutbox(reference?: string) {
  if (!reference) return

  const outboxPath = path.join(process.cwd(), 'data', 'email-outbox.json')
  let entries: unknown
  try {
    entries = JSON.parse(await readFile(outboxPath, 'utf8'))
  } catch {
    return
  }

  if (!Array.isArray(entries)) return
  const next = entries.filter((entry) => {
    if (!entry || typeof entry !== 'object') return false
    return (entry as { reference?: string }).reference !== reference
  })

  if (next.length === entries.length) return
  await writeFile(outboxPath, JSON.stringify(next, null, 2), 'utf8')
  step(`cleanup: outbox entry removed (${reference})`)
}

async function verifyPublicPages() {
  const home = await request('/')
  assert.equal(home.status, 200)
  assert.match(await home.text(), /Hafriyat/)
  step('home page renders')

  const sitemap = await request('/sitemap.xml')
  assert.equal(sitemap.status, 200)
  assert.match(await sitemap.text(), /<urlset/)
  step('sitemap responds')

  const robots = await request('/robots.txt')
  assert.equal(robots.status, 200)
  assert.match(await robots.text(), /Disallow: \/admin/)
  step('robots disallows admin')

  const loginPage = await request('/admin/login')
  assert.equal(loginPage.status, 200)
  step('admin login page renders')

  const notFound = await request('/this-page-does-not-exist')
  assert.equal(notFound.status, 404)
  step('unknown route returns 404')
}

async function verifyAuthAndGuards() {
  const crossOrigin = await loginRequest(ADMIN_EMAIL, 'whatever-password', 'https://evil.example.com')
  assert.equal(crossOrigin.status, 403)
  step('cross-origin login rejected')

  const wrongPassword = await loginRequest(ADMIN_EMAIL, 'definitely-wrong-password')
  assert.equal(wrongPassword.status, 401)
  step('wrong credentials rejected')

  const login = await loginRequest(ADMIN_EMAIL, ADMIN_PASSWORD)
  assert.equal(login.status, 200)
  adminCookie = extractSessionCookie(login)
  assert.ok(adminCookie.includes('admin_session'))
  step('admin login succeeds and sets session cookie')

  const unauthenticated = await postJson('/api/projects', PROJECT_PAYLOAD)
  assert.equal(unauthenticated.status, 401)
  step('project create without session rejected')

  // Same-origin request without a session: the origin check passes and the
  // session check rejects with 401.
  const unauthMessages = await request('/api/messages', { headers: { origin: ORIGIN } })
  assert.equal(unauthMessages.status, 401)
  step('message list without session rejected')
}

async function verifyProjectCrud() {
  const created = await postJson('/api/projects', PROJECT_PAYLOAD, { cookie: adminCookie })
  assert.equal(created.status, 201)
  const project = (await created.json()) as { id: string; slug: string; title: string; status: string }
  assert.ok(project.id)
  assert.ok(project.slug)
  assert.equal(project.status, 'Taslak')
  createdProjectId = project.id
  step('project created')

  const fetched = await request(`/api/projects/${project.id}`, { headers: { cookie: adminCookie } })
  assert.equal(fetched.status, 200)
  assert.equal(((await fetched.json()) as { title: string }).title, PROJECT_PAYLOAD.title)
  step('project fetched by id')

  const publicView = await request(`/api/projects/${project.id}`)
  assert.equal(publicView.status, 404)
  step('draft project hidden from public')

  const publicList = await request('/api/projects')
  const publicProjects = (await publicList.json()) as Array<{ id: string }>
  assert.ok(!publicProjects.some((item) => item.id === project.id))
  step('draft project excluded from public list')

  const adminList = await request('/api/projects', { headers: { cookie: adminCookie } })
  const adminProjects = (await adminList.json()) as Array<{ id: string }>
  assert.ok(adminProjects.some((item) => item.id === project.id))
  step('draft project visible to admin list')

  const updated = await patchJson(`/api/projects/${project.id}`, { ...PROJECT_PAYLOAD, title: 'E2E Güncellenmiş Proje' }, { cookie: adminCookie })
  assert.equal(updated.status, 200)
  assert.equal(((await updated.json()) as { title: string }).title, 'E2E Güncellenmiş Proje')
  step('project updated')

  const deleted = await request(`/api/projects/${project.id}`, {
    method: 'DELETE',
    headers: { origin: ORIGIN, cookie: adminCookie },
  })
  assert.equal(deleted.status, 200)
  step('project deleted')

  const afterDelete = await request(`/api/projects/${project.id}`, { headers: { cookie: adminCookie } })
  assert.equal(afterDelete.status, 404)
  step('deleted project returns 404')

  createdProjectId = undefined
}

async function verifyContactFlow() {
  const submitted = await postJson('/api/contact', CONTACT_PAYLOAD)
  assert.equal(submitted.status, 201)
  const result = (await submitted.json()) as { reference: string }
  assert.ok(result.reference)
  contactReference = result.reference
  step('contact submission accepted')

  // The E2E server runs in production mode without a RESEND_API_KEY, so the
  // notification fails and must land in the persistent outbox instead of
  // being lost.
  const outboxPath = path.join(process.cwd(), 'data', 'email-outbox.json')
  const outboxEntries = JSON.parse(await readFile(outboxPath, 'utf8')) as Array<{ reference: string }>
  assert.ok(
    outboxEntries.some((entry) => entry.reference === result.reference),
    'failed contact mail should be queued in the email outbox',
  )
  step('contact email failure queued in outbox')

  const duplicate = await postJson('/api/contact', CONTACT_PAYLOAD)
  assert.equal(duplicate.status, 429)
  step('duplicate contact submission rate limited')

  const invalid = await postJson('/api/contact', { ...CONTACT_PAYLOAD, name: 'x' })
  assert.equal(invalid.status, 400)
  step('invalid contact payload rejected')
}

async function verifyMessageLifecycle(reference: string) {
  const list = await request('/api/messages', { headers: { cookie: adminCookie, origin: ORIGIN } })
  assert.equal(list.status, 200)
  const messages = (await list.json()) as Array<{ id: string; reference?: string; isRead: boolean }>
  const match = messages.find((message) => message.reference === reference)
  assert.ok(match, 'submitted contact message should appear in the admin list')
  step('contact message visible in admin list')

  const read = await patchJson(`/api/messages/${match.id}`, { isRead: true }, { cookie: adminCookie })
  assert.equal(read.status, 200)
  step('message read state updated')
}

async function verifyFleetApi() {
  const fetched = await request('/api/fleet', { headers: { cookie: adminCookie, origin: ORIGIN } })
  assert.equal(fetched.status, 200)
  const content = (await fetched.json()) as { stats: unknown[]; items: unknown[] }
  assert.ok(Array.isArray(content.items))
  step('fleet content fetched by admin')

  const updated = await patchJson('/api/fleet', content, { cookie: adminCookie })
  assert.equal(updated.status, 200)
  step('fleet content round-trip update accepted')
}

async function verifyAdminRateLimitIsolation() {
  // Anonymous mutations must be rejected by the admin check before the
  // shared rate-limit bucket is touched, so an anonymous flood cannot lock
  // the admin out of their own budget.
  for (let attempt = 0; attempt < 25; attempt += 1) {
    const response = await patchJson('/api/settings', { companyName: 'nope' })
    assert.equal(response.status, 401)
  }
  step('anonymous settings mutations rejected without consuming admin rate budget')

  const current = await request('/api/settings', { headers: { cookie: adminCookie, origin: ORIGIN } })
  assert.equal(current.status, 200)
  const settings = await current.json()
  const updated = await patchJson('/api/settings', settings, { cookie: adminCookie })
  assert.equal(updated.status, 200)
  step('authenticated settings mutation still allowed after anonymous flood')
}

async function verifyLoginRateLimit() {
  let rateLimited = false

  for (let attempt = 0; attempt < 8 && !rateLimited; attempt += 1) {
    const response = await loginRequest(ADMIN_EMAIL, 'definitely-wrong-password')
    rateLimited = response.status === 429
  }

  assert.ok(rateLimited, 'repeated login attempts should hit the rate limit')
  step('login rate limit enforced')
}

async function run() {
  try {
    await startServer()
    step(`server ready on ${ORIGIN}`)

    await verifyPublicPages()
    await verifyAuthAndGuards()

    // The CRUD flow deletes its own project on success; the created id is
    // tracked so a mid-flow failure still triggers cleanup in finally.
    await verifyProjectCrud()

    await verifyContactFlow()
    if (contactReference) {
      await verifyMessageLifecycle(contactReference)
    }

    await verifyFleetApi()
    await verifyAdminRateLimitIsolation()

    await verifyLoginRateLimit()

    const health = await request('/api/health')
    assert.equal(health.status, 200)
    step('health endpoint reports ready')

    process.stdout.write('E2E verification passed.\n')
  } finally {
    await deleteProjectIfExists(createdProjectId)
    await deleteMessageByReference(contactReference)
    await cleanupContactOutbox(contactReference)
    await stopServer()
  }
}

run().catch((error) => {
  console.error('E2E verification failed:', error)
  process.exitCode = 1
})
