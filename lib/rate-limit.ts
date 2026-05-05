type RateLimitOptions = {
  limit: number
  windowMs: number
}

type Bucket = {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()
const MAX_BUCKETS = 5000

function pruneExpiredBuckets(now = Date.now()) {
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key)
    }
  }
}

function trimBuckets() {
  pruneExpiredBuckets()
  const retainedKeys = [...buckets.entries()]
    .sort((left, right) => right[1].resetAt - left[1].resetAt)
    .slice(0, MAX_BUCKETS)
    .map(([key]) => key)
  const retained = new Set(retainedKeys)

  for (const key of buckets.keys()) {
    if (!retained.has(key)) {
      buckets.delete(key)
    }
  }
}

export async function checkRateLimit(key: string, options: RateLimitOptions) {
  pruneExpiredBuckets()

  const now = Date.now()
  const current = buckets.get(key)

  if (!current || current.resetAt <= now) {
    const next = { count: 1, resetAt: now + options.windowMs }
    buckets.set(key, next)
    trimBuckets()
    return { allowed: true, remaining: options.limit - 1, resetAt: next.resetAt }
  }

  if (current.count >= options.limit) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt }
  }

  current.count += 1
  buckets.set(key, current)
  trimBuckets()
  return { allowed: true, remaining: options.limit - current.count, resetAt: current.resetAt }
}
