import { promises as fs } from 'fs'
import path from 'path'

type AuditEvent = {
  action: string
  ip?: string
  status: 'success' | 'failure' | 'rejected'
  target?: string
  detail?: string
}

const auditFile = path.join(process.cwd(), 'data', 'audit.log')
let auditWriteQueue = Promise.resolve()

function truncate(value: string | undefined, maxLength: number) {
  if (!value) return undefined
  return value.slice(0, maxLength)
}

export async function writeAuditLog(event: AuditEvent) {
  auditWriteQueue = auditWriteQueue
    .catch(() => undefined)
    .then(async () => {
      try {
        await fs.mkdir(path.dirname(auditFile), { recursive: true })
        await fs.appendFile(
          auditFile,
          `${JSON.stringify({
            at: new Date().toISOString(),
            action: truncate(event.action, 80),
            status: event.status,
            ip: truncate(event.ip, 120),
            target: truncate(event.target, 160),
            detail: truncate(event.detail, 240),
          })}\n`,
          'utf8',
        )
      } catch {
        // Audit logging must never block primary flows.
      }
    })

  return auditWriteQueue
}
