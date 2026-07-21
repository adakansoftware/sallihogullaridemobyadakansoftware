import { promises as fs } from 'fs'
import path from 'path'
import { appendTextFileSerialized } from '@/lib/file-storage'

type AuditEvent = {
  action: string
  ip?: string
  status: 'success' | 'failure' | 'rejected'
  target?: string
  detail?: string
}

const auditFile = path.join(/*turbopackIgnore: true*/ process.cwd(), 'data', 'audit.log')

function truncate(value: string | undefined, maxLength: number) {
  if (!value) return undefined
  return value.slice(0, maxLength)
}

export async function writeAuditLog(event: AuditEvent) {
  try {
    await fs.mkdir(path.dirname(auditFile), { recursive: true })
    await appendTextFileSerialized(
      auditFile,
      `${JSON.stringify({
        at: new Date().toISOString(),
        action: truncate(event.action, 80),
        status: event.status,
        ip: truncate(event.ip, 120),
        target: truncate(event.target, 160),
        detail: truncate(event.detail, 240),
      })}\n`,
    )
  } catch {
    // Audit logging must never block primary flows.
  }
}
