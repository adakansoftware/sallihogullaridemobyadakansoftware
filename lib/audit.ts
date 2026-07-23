import { promises as fs } from 'fs'
import path from 'path'
import { ensureParentDir, runSerializedFileWrite } from '@/lib/file-storage'
import { env } from '@/lib/env'
import { anonymizeAuditIp as anonymizeAuditIpWithSecret } from '@/lib/audit-core'

type AuditEvent = {
  action: string
  ip?: string
  status: 'success' | 'failure' | 'rejected'
  target?: string
  detail?: string
}

const auditFile = path.join(/*turbopackIgnore: true*/ process.cwd(), 'data', 'audit.log')
const MAX_AUDIT_LOG_BYTES = 1024 * 1024
const RETAIN_AUDIT_LOG_BYTES = 768 * 1024

function truncate(value: string | undefined, maxLength: number) {
  if (!value) return undefined
  return value.slice(0, maxLength)
}

export function anonymizeAuditIp(ip: string | undefined) {
  return anonymizeAuditIpWithSecret(ip, env.ADMIN_SESSION_SECRET)
}

async function appendAuditEntry(entry: string) {
  await runSerializedFileWrite(auditFile, async () => {
    await ensureParentDir(auditFile)
    const stat = await fs.stat(auditFile).catch(() => null)

    if (stat && stat.size + Buffer.byteLength(entry, 'utf8') > MAX_AUDIT_LOG_BYTES) {
      const existing = await fs.readFile(auditFile, 'utf8').catch(() => '')
      const retainedStart = Math.max(0, existing.length - RETAIN_AUDIT_LOG_BYTES)
      const firstCompleteEntry = existing.indexOf('\n', retainedStart)
      const retained = firstCompleteEntry === -1 ? '' : existing.slice(firstCompleteEntry + 1)
      await fs.writeFile(auditFile, retained, 'utf8')
    }

    await fs.appendFile(auditFile, entry, 'utf8')
  })
}

export async function writeAuditLog(event: AuditEvent) {
  try {
    await appendAuditEntry(
      `${JSON.stringify({
        at: new Date().toISOString(),
        action: truncate(event.action, 80),
        status: event.status,
        ip: anonymizeAuditIp(event.ip),
        target: truncate(event.target, 160),
        detail: truncate(event.detail, 240),
      })}\n`,
    )
  } catch {
    // Audit logging must never block primary flows.
  }
}
