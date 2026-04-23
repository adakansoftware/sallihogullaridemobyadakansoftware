import { promises as fs } from 'fs'
import path from 'path'

type RateLimitOptions = {
  limit: number
  windowMs: number
}

type Bucket = {
  count: number
  resetAt: number
}

type RateLimitState = Record<string, Bucket>

const rateLimitFile = path.join(process.cwd(), 'data', 'rate-limit.json')
const buckets = new Map<string, Bucket>()
let fileSyncPromise: Promise<void> = Promise.resolve()

async function ensureRateLimitFile() {
  await fs.mkdir(path.dirname(rateLimitFile), { recursive: true })

  try {
    await fs.access(rateLimitFile)
  } catch {
    await fs.writeFile(rateLimitFile, '{}', 'utf8')
  }
}

async function loadPersistedBuckets() {
  await ensureRateLimitFile()

  try {
    const raw = await fs.readFile(rateLimitFile, 'utf8')
    const parsed = JSON.parse(raw) as RateLimitState
    const now = Date.now()

    for (const [key, bucket] of Object.entries(parsed)) {
      if (bucket.resetAt > now) {
        buckets.set(key, bucket)
      }
    }
  } catch {
    // Rate limit persistence must not break request handling.
  }
}

async function persistBuckets() {
  const now = Date.now()
  const payload: RateLimitState = {}

  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt > now) {
      payload[key] = bucket
    }
  }

  fileSyncPromise = fileSyncPromise
    .catch(() => undefined)
    .then(async () => {
      await ensureRateLimitFile()
      await fs.writeFile(rateLimitFile, JSON.stringify(payload, null, 2), 'utf8')
    })

  await fileSyncPromise
}

let hydrated = false

async function hydrateRateLimitBuckets() {
  if (hydrated) return
  hydrated = true
  await loadPersistedBuckets()
}

export async function checkRateLimit(key: string, options: RateLimitOptions) {
  await hydrateRateLimitBuckets()

  const now = Date.now()
  const current = buckets.get(key)

  if (!current || current.resetAt <= now) {
    const next = { count: 1, resetAt: now + options.windowMs }
    buckets.set(key, next)
    await persistBuckets()
    return { allowed: true, remaining: options.limit - 1, resetAt: next.resetAt }
  }

  if (current.count >= options.limit) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt }
  }

  current.count += 1
  buckets.set(key, current)
  await persistBuckets()
  return { allowed: true, remaining: options.limit - current.count, resetAt: current.resetAt }
}
