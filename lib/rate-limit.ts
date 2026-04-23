import path from 'path'
import { ensureTextFile, readJsonFileWithBackup, writeJsonFileAtomic } from '@/lib/file-storage'

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
const emptyRateLimitState: RateLimitState = {}
const buckets = new Map<string, Bucket>()
const MAX_PERSISTED_BUCKETS = 5000

function isValidBucket(value: unknown): value is Bucket {
  if (!value || typeof value !== 'object') return false
  const bucket = value as Bucket
  return Number.isFinite(bucket.count) && bucket.count >= 0 && Number.isFinite(bucket.resetAt) && bucket.resetAt > 0
}

function pruneExpiredBuckets(now = Date.now()) {
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key)
    }
  }
}

async function loadPersistedBuckets() {
  try {
    const parsed = await readJsonFileWithBackup(rateLimitFile, {
      parse(value: unknown) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
          throw new Error('invalid_rate_limit_state')
        }

        const nextState: RateLimitState = {}
        for (const [key, bucket] of Object.entries(value)) {
          if (isValidBucket(bucket)) {
            nextState[key] = bucket
          }
        }

        return nextState
      },
    }, emptyRateLimitState)
    const now = Date.now()

    for (const [key, bucket] of Object.entries(parsed.data)) {
      if (bucket.resetAt > now) {
        buckets.set(key, bucket)
      }
    }
  } catch {
    // Rate limit persistence must not break request handling.
  }
}

async function persistBuckets() {
  pruneExpiredBuckets()
  const payload: RateLimitState = {}
  const retainedBuckets = [...buckets.entries()]
    .sort((left, right) => right[1].resetAt - left[1].resetAt)
    .slice(0, MAX_PERSISTED_BUCKETS)

  for (const [key, bucket] of retainedBuckets) {
    payload[key] = bucket
  }

  await ensureTextFile(rateLimitFile, '{}')
  await writeJsonFileAtomic(rateLimitFile, payload)
}

let hydrated = false

async function hydrateRateLimitBuckets() {
  if (hydrated) return
  hydrated = true
  await loadPersistedBuckets()
}

export async function checkRateLimit(key: string, options: RateLimitOptions) {
  await hydrateRateLimitBuckets()
  pruneExpiredBuckets()

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
