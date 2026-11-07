import path from 'path'
import type { z } from 'zod'
import { updateJsonFileAtomic } from './file-storage.ts'
import { deliverContactMailOnce, type ContactMailPayload } from './email.ts'
import { logWarn, serializeError } from './logger.ts'
import { storedEmailOutboxSchema } from './validation.ts'

// Persistent outbox for contact mails that could not be delivered. The
// submission itself is already stored in the admin message list; the outbox
// only exists so a provider outage does not silently drop the notification.
//
// A queued entry starts with `attempts: 0` and no `lastAttemptAt`: it has
// never been retried by the flusher, so the next flush picks it up. Only a
// failed flush retry sets `lastAttemptAt` (10-minute backoff) and increments
// `attempts`; entries that reach MAX_OUTBOX_ATTEMPTS are dropped.

export type EmailOutboxEntry = z.infer<typeof storedEmailOutboxSchema.element>

const outboxFile = path.join(/*turbopackIgnore: true*/ process.cwd(), 'data', 'email-outbox.json')

export const MAX_OUTBOX_ATTEMPTS = 5
export const OUTBOX_RETRY_AFTER_MS = 10 * 60 * 1000
export const OUTBOX_FLUSH_BATCH = 3
export const MAX_OUTBOX_ENTRIES = 50

function truncateError(error: unknown) {
  return serializeError(error).message.slice(0, 500) || 'unknown error'
}

export function selectPendingOutboxEntries(entries: EmailOutboxEntry[], now = Date.now()) {
  return entries
    .filter((entry) => entry.attempts < MAX_OUTBOX_ATTEMPTS)
    .filter((entry) => {
      if (!entry.lastAttemptAt) return true

      const lastAttempt = new Date(entry.lastAttemptAt).getTime()
      // A malformed timestamp is treated as "never attempted" so the entry
      // self-heals instead of being stuck forever.
      const lastAttemptAt = Number.isFinite(lastAttempt) ? lastAttempt : 0
      return now - lastAttemptAt >= OUTBOX_RETRY_AFTER_MS
    })
    .slice(0, OUTBOX_FLUSH_BATCH)
}

export async function queueContactMailFailure(payload: ContactMailPayload, reference: string, error: unknown) {
  return updateJsonFileAtomic(outboxFile, storedEmailOutboxSchema, [], (entries) => {
    const now = new Date().toISOString()
    const errorMessage = truncateError(error)
    const existingIndex = entries.findIndex((entry) => entry.reference === reference)

    if (existingIndex !== -1) {
      // A repeated failure for the same reference refreshes the payload and
      // the last error; the flush counters are owned by the flusher.
      const next = [...entries]
      next[existingIndex] = {
        ...next[existingIndex],
        payload,
        error: errorMessage,
      }
      return next
    }

    const entry: EmailOutboxEntry = {
      reference,
      payload,
      error: errorMessage,
      attempts: 0,
      createdAt: now,
    }

    return [...entries, entry].slice(-MAX_OUTBOX_ENTRIES)
  })
}

export async function flushContactMailOutbox(send: (payload: ContactMailPayload, reference: string) => Promise<void> = deliverContactMailOnce) {
  let resent = 0
  let dropped = 0

  await updateJsonFileAtomic(outboxFile, storedEmailOutboxSchema, [], async (entries) => {
    const pending = selectPendingOutboxEntries(entries, Date.now())
    if (pending.length === 0) return entries

    const delivered = new Set<string>()
    const failures = new Map<string, string>()

    for (const entry of pending) {
      try {
        await send(entry.payload, entry.reference)
        delivered.add(entry.reference)
        resent += 1
      } catch (error) {
        failures.set(entry.reference, truncateError(error))
      }
    }

    const now = new Date().toISOString()
    const nextEntries: EmailOutboxEntry[] = []

    for (const entry of entries) {
      if (delivered.has(entry.reference)) continue

      if (failures.has(entry.reference)) {
        const attempts = entry.attempts + 1
        if (attempts >= MAX_OUTBOX_ATTEMPTS) {
          dropped += 1
          logWarn('email-outbox-entry-dropped', { reference: entry.reference, attempts })
          continue
        }

        nextEntries.push({ ...entry, attempts, lastAttemptAt: now, error: failures.get(entry.reference) || entry.error })
        continue
      }

      nextEntries.push(entry)
    }

    return nextEntries
  })

  return { resent, dropped }
}
