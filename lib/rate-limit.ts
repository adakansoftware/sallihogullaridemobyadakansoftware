import { getRateLimitStore } from '@/lib/rate-limit-store'

type RateLimitOptions = {
  limit: number
  windowMs: number
}

const MAX_BUCKETS = 5000

function pruneExpiredBuckets(now = Date.now()) {
  const store = getRateLimitStore()
  for (const [key, bucket] of store.entries()) {
    if (bucket.resetAt <= now) {
      store.delete(key)
    }
  }
}

function trimBuckets() {
  const store = getRateLimitStore()
  pruneExpiredBuckets()
  const retainedKeys = [...store.entries()]
    .sort((left, right) => right[1].resetAt - left[1].resetAt)
    .slice(0, MAX_BUCKETS)
    .map(([key]) => key)
  const retained = new Set(retainedKeys)

  for (const [key] of store.entries()) {
    if (!retained.has(key)) {
      store.delete(key)
    }
  }
}

export async function checkRateLimit(key: string, options: RateLimitOptions) {
  const store = getRateLimitStore()
  pruneExpiredBuckets()

  const now = Date.now()
  const current = store.get(key)

  if (!current || current.resetAt <= now) {
    const next = { count: 1, resetAt: now + options.windowMs }
    store.set(key, next)
    trimBuckets()
    return { allowed: true, remaining: options.limit - 1, resetAt: next.resetAt }
  }

  if (current.count >= options.limit) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt }
  }

  current.count += 1
  store.set(key, current)
  trimBuckets()
  return { allowed: true, remaining: options.limit - current.count, resetAt: current.resetAt }
}
