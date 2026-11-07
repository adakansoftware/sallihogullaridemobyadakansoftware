import path from 'path'
import { appendCappedTextFile } from '@/lib/file-storage'
import { env } from '@/lib/env'
import { runQuery } from '@/lib/db'
import { logError } from '@/lib/logger'
import { anonymizeAuditIp as anonymizeAuditIpWithSecret } from '@/lib/audit-core'

type AuditEvent = {
  action: string
  ip?: string
  status: 'success' | 'failure' | 'rejected'
  target?: string
  detail?: string
}

type AuditLogEntry = {
  at: string
  action: string
  status: 'success' | 'failure' | 'rejected'
  ip?: string
  target?: string
  detail?: string
}

const auditFile = path.join(/*turbopackIgnore: true*/ process.cwd(), 'data', 'audit.log')
const MAX_AUDIT_LOG_BYTES = 1024 * 1024
const RETAIN_AUDIT_LOG_BYTES = 768 * 1024
const AUDIT_PRUNE_INTERVAL_MS = 60 * 60 * 1000
const AUDIT_RETENTION_DAYS = 180

function truncate(value: string | undefined, maxLength: number) {
  if (!value) return undefined
  return value.slice(0, maxLength)
}

export function anonymizeAuditIp(ip: string | undefined) {
  return anonymizeAuditIpWithSecret(ip, env.ADMIN_SESSION_SECRET)
}

async function appendAuditEntry(entry: string) {
  await appendCappedTextFile(auditFile, entry, MAX_AUDIT_LOG_BYTES, RETAIN_AUDIT_LOG_BYTES)
}

// Pruning runs at most once per hour per process; the DELETE is idempotent so
// a skipped or repeated run is harmless.
let lastAuditPruneAt = 0

async function appendAuditEntryToPostgres(entry: AuditLogEntry) {
  const now = Date.now()

  if (now - lastAuditPruneAt >= AUDIT_PRUNE_INTERVAL_MS) {
    lastAuditPruneAt = now
    await runQuery(`DELETE FROM audit_log WHERE at < NOW() - INTERVAL '${AUDIT_RETENTION_DAYS} days'`)
  }

  await runQuery(
    'INSERT INTO audit_log (at, action, status, ip, target, detail) VALUES ($1::timestamptz, $2, $3, $4, $5, $6)',
    [entry.at, entry.action, entry.status, entry.ip, entry.target, entry.detail],
  )
}

export async function writeAuditLog(event: AuditEvent) {
  const entry: AuditLogEntry = {
    at: new Date().toISOString(),
    action: truncate(event.action, 80) || 'unknown',
    status: event.status,
    ip: anonymizeAuditIp(event.ip),
    target: truncate(event.target, 160),
    detail: truncate(event.detail, 240),
  }

  try {
    if (env.CONTENT_STORE === 'postgres') {
      await appendAuditEntryToPostgres(entry)
    } else {
      await appendAuditEntry(`${JSON.stringify(entry)}\n`)
    }
  } catch (error) {
    // Audit logging must never block primary flows.
    logError('audit-write-failed', { error, action: entry.action })
  }
}
