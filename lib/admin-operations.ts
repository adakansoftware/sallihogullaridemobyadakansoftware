import { getSiteAssetHealth } from '@/lib/asset-health'
import { listAuditEntries } from '@/lib/audit-service'
import { getFleetContent } from '@/lib/fleet-service'
import { listAdminMessages } from '@/lib/message-service'
import { listAdminProjects } from '@/lib/project-service'

function hoursSince(value: string) {
  const time = new Date(value).getTime()
  if (!Number.isFinite(time)) return 0
  return (Date.now() - time) / (1000 * 60 * 60)
}

function parseLeadingNumber(value: string) {
  const match = value.match(/\d+/)
  return match ? Number.parseInt(match[0], 10) : 0
}

export async function getAdminOperationsSnapshot() {
  const [projects, messages, fleetContent, assetHealth, auditEntries] = await Promise.all([
    listAdminProjects(),
    listAdminMessages(),
    getFleetContent(),
    getSiteAssetHealth(),
    listAuditEntries(150),
  ])

  const publishedWithoutMedia = projects.filter((project) => project.status === 'Yayında' && project.media.length === 0)
  const publishedWithoutSummary = projects.filter((project) => project.status === 'Yayında' && project.summary.trim().length < 20)
  const staleDrafts = projects.filter((project) => project.status === 'Taslak' && hoursSince(project.updatedAt) >= 14 * 24)
  const stalePublished = projects.filter((project) => project.status === 'Yayında' && hoursSince(project.updatedAt) >= 120 * 24)

  const unread24h = messages.filter((message) => !message.isRead && hoursSince(message.createdAt) >= 24)
  const unread72h = messages.filter((message) => !message.isRead && hoursSince(message.createdAt) >= 72)
  const unread7d = messages.filter((message) => !message.isRead && hoursSince(message.createdAt) >= 7 * 24)

  const fleetCountMismatch = fleetContent.items.filter((item) => {
    const itemCount = parseLeadingNumber(item.count)
    const modelCount = item.models.reduce((sum, model) => sum + parseLeadingNumber(model.quantity), 0)
    return itemCount !== modelCount
  })

  const fleetDuplicateSpecs = fleetContent.items.filter((item) => {
    const normalized = item.specs.map((spec) => spec.toLocaleLowerCase('tr-TR'))
    return new Set(normalized).size !== normalized.length
  })

  const fleetMissingImages = fleetContent.items.filter((item) => !item.image || item.models.some((model) => !model.image))

  const failedOrRejected7d = auditEntries.filter((entry) => (entry.status === 'failure' || entry.status === 'rejected') && hoursSince(entry.at) <= 7 * 24)
  const failedLogins7d = auditEntries.filter((entry) => entry.action === 'admin.login' && entry.status === 'failure' && hoursSince(entry.at) <= 7 * 24)

  return {
    projectHealth: {
      publishedWithoutMedia,
      publishedWithoutSummary,
      staleDrafts,
      stalePublished,
      missingAssets: assetHealth.missingAssets,
      orphanUploads: assetHealth.orphanUploads,
    },
    messageQueue: {
      unread24h,
      unread72h,
      unread7d,
    },
    fleetHealth: {
      countMismatch: fleetCountMismatch,
      duplicateSpecs: fleetDuplicateSpecs,
      missingImages: fleetMissingImages,
    },
    auditHealth: {
      failedOrRejected7d,
      failedLogins7d,
    },
  }
}
