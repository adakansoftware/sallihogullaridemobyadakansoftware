import path from 'path'
import { z } from 'zod'
import { readJsonFileWithBackup, restorePrimaryJsonFile, writeJsonFileAtomic } from '@/lib/file-storage'
import { adminIssueUpdateSchema, adminIssueStatusSchema, storedAdminIssueStatesSchema } from '@/lib/validation'

export type AdminIssueStatus = z.infer<typeof adminIssueStatusSchema>
export type AdminIssueState = {
  id: string
  status: AdminIssueStatus
  note: string
  updatedAt: string
}

const issueStatusFile = path.join(/*turbopackIgnore: true*/ process.cwd(), 'data', 'admin-issue-status.json')
const defaultIssueStates: AdminIssueState[] = []

export async function listAdminIssueStates() {
  const parsed = await readJsonFileWithBackup(issueStatusFile, storedAdminIssueStatesSchema, defaultIssueStates)

  if (parsed.source === 'backup') {
    await restorePrimaryJsonFile(issueStatusFile, parsed.data)
  }

  return parsed.data
}

export async function getAdminIssueStateMap() {
  const items = await listAdminIssueStates()
  return Object.fromEntries(items.map((item) => [item.id, item])) as Record<string, AdminIssueState>
}

export async function updateAdminIssueState(id: string, input: unknown) {
  const payload = adminIssueUpdateSchema.parse(input)
  const items = await listAdminIssueStates()
  const nextItem: AdminIssueState = {
    id,
    status: payload.status,
    note: payload.note,
    updatedAt: new Date().toISOString(),
  }

  const nextItems = items.some((item) => item.id === id)
    ? items.map((item) => (item.id === id ? nextItem : item))
    : [...items, nextItem]

  await writeJsonFileAtomic(issueStatusFile, storedAdminIssueStatesSchema.parse(nextItems))
  return nextItem
}
