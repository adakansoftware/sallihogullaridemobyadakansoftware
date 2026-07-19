import { getSiteAssetHealth } from '@/lib/asset-health'
import { listAuditEntries } from '@/lib/audit-service'
import { getFleetContent } from '@/lib/fleet-service'
import { listAdminMessages } from '@/lib/message-service'
import { listAdminProjects } from '@/lib/project-service'

export type InsightSeverity = 'high' | 'medium' | 'low'

export type AdminInsight = {
  id: string
  title: string
  description: string
  severity: InsightSeverity
  href: string
  stat: string
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

export async function getAdminInsights() {
  const [projects, messages, fleetContent, assetHealth, auditEntries] = await Promise.all([
    listAdminProjects(),
    listAdminMessages(),
    getFleetContent(),
    getSiteAssetHealth(),
    listAuditEntries(120),
  ])

  const insights: AdminInsight[] = []

  const overdueUnreadMessages = messages.filter((message) => !message.isRead && hoursSince(message.createdAt) >= 24)
  if (overdueUnreadMessages.length) {
    insights.push({
      id: 'messages-overdue',
      title: 'Bekleyen okunmamış mesajlar var',
      description: '24 saatten uzun süredir okunmamış talepler panelde bekliyor.',
      severity: 'high',
      href: '/admin/messages',
      stat: `${overdueUnreadMessages.length} mesaj`,
    })
  }

  const publishedWithoutMedia = projects.filter((project) => project.status === 'Yayında' && project.media.length === 0)
  if (publishedWithoutMedia.length) {
    insights.push({
      id: 'projects-without-media',
      title: 'Yayındaki bazı projelerde medya yok',
      description: 'Canlıda görünen projelerin bir kısmı medya desteği olmadan yayında kalmış.',
      severity: 'high',
      href: '/admin/projects',
      stat: `${publishedWithoutMedia.length} proje`,
    })
  }

  if (assetHealth.missingAssets.length) {
    insights.push({
      id: 'missing-assets',
      title: 'Kırık medya referansları bulundu',
      description: 'Projelerde mevcut olmayan görsel veya medya yolları tespit edildi.',
      severity: 'high',
      href: '/admin/projects',
      stat: `${assetHealth.missingAssets.length} kayıt`,
    })
  }

  if (assetHealth.orphanUploads.length) {
    insights.push({
      id: 'orphan-uploads',
      title: 'Kullanılmayan yükleme dosyaları var',
      description: 'Uploads klasöründe projelerden bağımsız kalmış dosyalar depoyu şişiriyor olabilir.',
      severity: 'medium',
      href: '/admin',
      stat: `${assetHealth.orphanUploads.length} dosya`,
    })
  }

  const fleetCountMismatch = fleetContent.items.filter((item) => parseLeadingNumber(item.count) !== item.models.reduce((sum, model) => sum + parseLeadingNumber(model.quantity), 0))
  if (fleetCountMismatch.length) {
    insights.push({
      id: 'fleet-count-mismatch',
      title: 'Filo adetleri ile model toplamları uyuşmuyor',
      description: 'Bazı filo kategorilerinde üst karttaki toplam adet ile model bazlı adetler farklı görünüyor.',
      severity: 'high',
      href: '/admin/fleet',
      stat: `${fleetCountMismatch.length} kategori`,
    })
  }

  const duplicateFleetSpecs = fleetContent.items.filter((item) => new Set(item.specs.map((spec) => spec.toLocaleLowerCase('tr-TR'))).size !== item.specs.length)
  if (duplicateFleetSpecs.length) {
    insights.push({
      id: 'fleet-duplicate-specs',
      title: 'Tekrarlanan filo etiketleri var',
      description: 'Bazı kategori etiketleri aynı kart içinde tekrar ediyor ve içerik kalitesini düşürüyor.',
      severity: 'low',
      href: '/admin/fleet',
      stat: `${duplicateFleetSpecs.length} kategori`,
    })
  }

  const recentRiskyAudit = auditEntries.filter((entry) => (entry.status === 'failure' || entry.status === 'rejected') && hoursSince(entry.at) <= 7 * 24)
  if (recentRiskyAudit.length) {
    insights.push({
      id: 'recent-risky-audit',
      title: 'Son günlerde başarısız veya reddedilen işlemler arttı',
      description: 'Giriş veya yönetim işlemlerinde başarısız denemeler son 7 gün içinde kayda geçti.',
      severity: 'medium',
      href: '/admin/activity',
      stat: `${recentRiskyAudit.length} kayıt`,
    })
  }

  const featuredProjects = projects.filter((project) => project.featured)
  if (projects.length > 0 && featuredProjects.length === 0) {
    insights.push({
      id: 'missing-featured-project',
      title: 'Öne çıkan proje seçilmemiş',
      description: 'Ana vitrin alanlarında kullanılabilecek işaretlenmiş proje görünmüyor.',
      severity: 'low',
      href: '/admin/projects',
      stat: '0 proje',
    })
  }

  return insights.sort((left, right) => {
    const weight = { high: 0, medium: 1, low: 2 }
    return weight[left.severity] - weight[right.severity]
  })
}

export async function getAdminInsightsSummary() {
  const insights = await getAdminInsights()
  return {
    total: insights.length,
    high: insights.filter((item) => item.severity === 'high').length,
    medium: insights.filter((item) => item.severity === 'medium').length,
    low: insights.filter((item) => item.severity === 'low').length,
  }
}
