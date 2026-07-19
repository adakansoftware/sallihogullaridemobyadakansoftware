import { promises as fs } from 'fs'
import path from 'path'

export type AuditEntry = {
  at: string
  action: string
  status: 'success' | 'failure' | 'rejected'
  ip?: string
  target?: string
  detail?: string
}

const auditFile = path.join(/*turbopackIgnore: true*/ process.cwd(), 'data', 'audit.log')

function isAuditEntry(value: unknown): value is AuditEntry {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.at === 'string' &&
    typeof candidate.action === 'string' &&
    (candidate.status === 'success' || candidate.status === 'failure' || candidate.status === 'rejected')
  )
}

function safeDate(value: string) {
  const parsed = new Date(value).getTime()
  return Number.isFinite(parsed) ? parsed : 0
}

export async function listAuditEntries(limit = 50) {
  try {
    const raw = await fs.readFile(auditFile, 'utf8')
    const entries = raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line)
        } catch {
          return null
        }
      })
      .filter(isAuditEntry)
      .sort((left, right) => safeDate(right.at) - safeDate(left.at))

    return entries.slice(0, Math.max(0, limit))
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException
    if (nodeError.code === 'ENOENT') {
      return []
    }

    throw error
  }
}

export async function getAuditSummary() {
  const entries = await listAuditEntries(200)
  const summary = {
    total: entries.length,
    success: entries.filter((entry) => entry.status === 'success').length,
    failure: entries.filter((entry) => entry.status === 'failure').length,
    rejected: entries.filter((entry) => entry.status === 'rejected').length,
    uniqueActions: new Set(entries.map((entry) => entry.action)).size,
    latestAt: entries[0]?.at || '',
  }

  return summary
}

export function formatAuditAction(action: string) {
  return action
    .split('.')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' / ')
}
