import { getRateLimitStore } from '@/lib/rate-limit-store'
import { runQuery } from '@/lib/db'
import { env } from '@/lib/env'

type RateLimitOptions = {
  limit: number
  windowMs: number
}

const MAX_BUCKETS = 5000
const POSTGRES_PRUNE_INTERVAL_MS = 5 * 60 * 1000
let lastPostgresPruneAt = 0

type PostgresRateLimitBucket = {
  count: number
  reset_at: Date
}

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

async function pruneExpiredPostgresBuckets() {
  const now = Date.now()
  if (now - lastPostgresPruneAt < POSTGRES_PRUNE_INTERVAL_MS) return

  lastPostgresPruneAt = now
  await runQuery('DELETE FROM rate_limit_buckets WHERE reset_at <= NOW()')
}

async function checkPostgresRateLimit(key: string, options: RateLimitOptions) {
  await pruneExpiredPostgresBuckets()

  const result = await runQuery<PostgresRateLimitBucket>(
    `
      INSERT INTO rate_limit_buckets (bucket_key, count, reset_at, updated_at)
      VALUES ($1, 1, NOW() + ($2 * INTERVAL '1 millisecond'), NOW())
      ON CONFLICT (bucket_key) DO UPDATE SET
        count = CASE
          WHEN rate_limit_buckets.reset_at <= NOW() THEN 1
          ELSE rate_limit_buckets.count + 1
        END,
        reset_at = CASE
          WHEN rate_limit_buckets.reset_at <= NOW() THEN NOW() + ($2 * INTERVAL '1 millisecond')
          ELSE rate_limit_buckets.reset_at
        END,
        updated_at = NOW()
      WHERE rate_limit_buckets.reset_at <= NOW() OR rate_limit_buckets.count < $3
      RETURNING count, reset_at
    `,
    [key, options.windowMs, options.limit],
  )

  const bucket = result.rows[0]
  if (!bucket) {
    return { allowed: false, remaining: 0, resetAt: Date.now() + options.windowMs }
  }

  const resetAt = new Date(bucket.reset_at).getTime()
  return {
    allowed: true,
    remaining: Math.max(0, options.limit - bucket.count),
    resetAt: Number.isFinite(resetAt) ? resetAt : Date.now() + options.windowMs,
  }
}

export async function checkRateLimit(key: string, options: RateLimitOptions) {
  if (env.RATE_LIMIT_STORE === 'postgres') {
    return checkPostgresRateLimit(key, options)
  }

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
