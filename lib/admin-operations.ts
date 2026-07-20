import { getSiteAssetHealth } from '@/lib/asset-health'
import { listAuditEntries } from '@/lib/audit-service'
import { getFleetContent } from '@/lib/fleet-service'
import { listAdminMessages } from '@/lib/message-service'
import { listAdminProjects } from '@/lib/project-service'

export type OperationDomain = 'projects' | 'messages' | 'fleet' | 'audit'
export type OperationSeverity = 'high' | 'medium' | 'low'

export type OperationIssue = {
  id: string
  domain: OperationDomain
  severity: OperationSeverity
  title: string
  description: string
  stat: string
  href: string
}

function hoursSince(value: string) {
  const time = new Date(value).getTime()
  if (!Number.isFinite(time)) return 0
  return (Date.now() - time) / (1000 * 60 * 60)
}

function parseLeadingNumber(value: string) {
  const match = value.match(/\d+/)
  return match ? Number.parseInt(match[0], 10) : 0
}

function buildOperationsScore(issues: OperationIssue[]) {
  const penalty = issues.reduce((sum, issue) => {
    if (issue.severity === 'high') return sum + 18
    if (issue.severity === 'medium') return sum + 9
    return sum + 4
  }, 0)

  return Math.max(0, 100 - penalty)
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

export async function getAdminOperationsCenter() {
  const snapshot = await getAdminOperationsSnapshot()
  const issues: OperationIssue[] = []

  if (snapshot.projectHealth.publishedWithoutMedia.length) {
    issues.push({
      id: 'projects-without-media',
      domain: 'projects',
      severity: 'high',
      title: 'Yayındaki bazı projelerde medya yok',
      description: 'Canlıdaki proje kartları ve detayları görsel desteği olmadan kalabilir.',
      stat: `${snapshot.projectHealth.publishedWithoutMedia.length} proje`,
      href: '/admin/projects',
    })
  }

  if (snapshot.projectHealth.publishedWithoutSummary.length) {
    issues.push({
      id: 'projects-with-weak-summary',
      domain: 'projects',
      severity: 'medium',
      title: 'Yayındaki bazı projelerin özet metni zayıf',
      description: 'Kısa ve zayıf özetler kart kalitesini ve yönetim görünürlüğünü düşürüyor.',
      stat: `${snapshot.projectHealth.publishedWithoutSummary.length} proje`,
      href: '/admin/projects',
    })
  }

  if (snapshot.projectHealth.staleDrafts.length) {
    issues.push({
      id: 'stale-drafts',
      domain: 'projects',
      severity: 'low',
      title: 'Uzun süredir bekleyen taslak projeler var',
      description: 'Taslakta kalan projeler içerik akışını yavaşlatıyor olabilir.',
      stat: `${snapshot.projectHealth.staleDrafts.length} proje`,
      href: '/admin/projects',
    })
  }

  if (snapshot.projectHealth.stalePublished.length) {
    issues.push({
      id: 'stale-published',
      domain: 'projects',
      severity: 'low',
      title: 'Uzun süredir güncellenmeyen yayınlar var',
      description: 'Sitedeki bazı yayınlar uzun süredir el değmeden kalmış görünüyor.',
      stat: `${snapshot.projectHealth.stalePublished.length} proje`,
      href: '/admin/projects',
    })
  }

  if (snapshot.projectHealth.missingAssets.length) {
    issues.push({
      id: 'missing-assets',
      domain: 'projects',
      severity: 'high',
      title: 'Kırık medya referansları bulundu',
      description: 'Bazı görsel veya medya dosya yolları artık erişilebilir değil.',
      stat: `${snapshot.projectHealth.missingAssets.length} kayıt`,
      href: '/admin/projects',
    })
  }

  if (snapshot.projectHealth.orphanUploads.length) {
    issues.push({
      id: 'orphan-uploads',
      domain: 'projects',
      severity: 'medium',
      title: 'Kullanılmayan upload dosyaları birikmiş',
      description: 'Projelerden kopmuş dosyalar depolama alanını gereksiz büyütüyor olabilir.',
      stat: `${snapshot.projectHealth.orphanUploads.length} dosya`,
      href: '/admin',
    })
  }

  if (snapshot.messageQueue.unread24h.length) {
    issues.push({
      id: 'messages-unread-24h',
      domain: 'messages',
      severity: 'high',
      title: '24 saati aşan okunmamış mesajlar var',
      description: 'Talep kuyruğunda geri dönüş bekleyen mesajlar gecikmeye başlamış.',
      stat: `${snapshot.messageQueue.unread24h.length} mesaj`,
      href: '/admin/messages',
    })
  }

  if (snapshot.messageQueue.unread72h.length) {
    issues.push({
      id: 'messages-unread-72h',
      domain: 'messages',
      severity: 'high',
      title: '72 saati aşan bekleyen mesajlar var',
      description: 'Bazı talepler kritik derecede bekliyor olabilir.',
      stat: `${snapshot.messageQueue.unread72h.length} mesaj`,
      href: '/admin/messages',
    })
  }

  if (snapshot.fleetHealth.countMismatch.length) {
    issues.push({
      id: 'fleet-count-mismatch',
      domain: 'fleet',
      severity: 'high',
      title: 'Filo toplam adetleri ile model adetleri uyuşmuyor',
      description: 'Üst karttaki toplam sayı ile alt model kartlarındaki toplam farklı görünüyor.',
      stat: `${snapshot.fleetHealth.countMismatch.length} kategori`,
      href: '/admin/fleet',
    })
  }

  if (snapshot.fleetHealth.duplicateSpecs.length) {
    issues.push({
      id: 'fleet-duplicate-specs',
      domain: 'fleet',
      severity: 'low',
      title: 'Bazı filo etiketleri tekrar ediyor',
      description: 'Tekrarlanan marka ve etiketler içerik düzenini zayıflatıyor.',
      stat: `${snapshot.fleetHealth.duplicateSpecs.length} kategori`,
      href: '/admin/fleet',
    })
  }

  if (snapshot.fleetHealth.missingImages.length) {
    issues.push({
      id: 'fleet-missing-images',
      domain: 'fleet',
      severity: 'medium',
      title: 'Filo içeriklerinde eksik görsel var',
      description: 'Kategori veya alt model kartlarının bir kısmı görselsiz kalmış olabilir.',
      stat: `${snapshot.fleetHealth.missingImages.length} kategori`,
      href: '/admin/fleet',
    })
  }

  if (snapshot.auditHealth.failedOrRejected7d.length) {
    issues.push({
      id: 'audit-risky-7d',
      domain: 'audit',
      severity: 'medium',
      title: 'Son 7 günde başarısız veya reddedilen işlemler arttı',
      description: 'Yönetim akışında beklenmeyen giriş veya işlem denemeleri kayda geçti.',
      stat: `${snapshot.auditHealth.failedOrRejected7d.length} kayıt`,
      href: '/admin/activity',
    })
  }

  if (snapshot.auditHealth.failedLogins7d.length) {
    issues.push({
      id: 'audit-failed-logins',
      domain: 'audit',
      severity: 'medium',
      title: 'Başarısız admin girişleri var',
      description: 'Giriş denemeleri incelenmeye değer bir yoğunluğa ulaşmış olabilir.',
      stat: `${snapshot.auditHealth.failedLogins7d.length} kayıt`,
      href: '/admin/activity',
    })
  }

  const score = buildOperationsScore(issues)
  const summary = {
    total: issues.length,
    high: issues.filter((issue) => issue.severity === 'high').length,
    medium: issues.filter((issue) => issue.severity === 'medium').length,
    low: issues.filter((issue) => issue.severity === 'low').length,
    score,
  }

  return { snapshot, issues, summary }
}
