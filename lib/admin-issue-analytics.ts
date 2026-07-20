import { getAdminIssueCatalogMap } from '@/lib/admin-issue-catalog'
import type { OperationDomain } from '@/lib/admin-operations'
import { listAdminIssueHistory, syncAdminIssueTracker, type AdminIssueState, type AdminIssueStatus } from '@/lib/admin-issue-tracker'

type PrioritySeverity = 'high' | 'medium' | 'low'

export type AdminIssueAnalyticsItem = {
  id: string
  title: string
  href: string
  status: AdminIssueStatus
  severity: PrioritySeverity
  domain: OperationDomain | 'insights'
  ageHours: number
  overSla: boolean
  reopenCount: number
  updatedAt: string
  riskScore: number
  recommendation: string
}

export type AdminIssueAnalyticsResult = {
  summary: {
    tracked: number
    open: number
    monitoring: number
    resolved: number
    staleOpen48h: number
    staleOpen7d: number
    reopened: number
    slaBreaches: number
    avgResolveHours: number
    healthScore: number
    transitionCount7d: number
  }
  domainSummary: Array<{
    domain: OperationDomain | 'insights'
    tracked: number
    active: number
    resolved: number
    slaBreaches: number
    reopened: number
    avgAgeHours: number
    healthScore: number
  }>
  trend7d: Array<{
    dayKey: string
    opened: number
    resolved: number
    updated: number
  }>
  focus: {
    hottestDomain: OperationDomain | 'insights' | null
    highestPressureCount: number
    recoveryRate: number
    weeklyDirection: 'up' | 'down' | 'stable'
    weeklyDelta: number
    recommendation: string
  }
  weeklyComparison: {
    currentOpened: number
    currentResolved: number
    previousOpened: number
    previousResolved: number
    openedDelta: number
    resolvedDelta: number
    netPressureDelta: number
    momentum: 'accelerating' | 'improving' | 'stable'
  }
  playbooks: Array<{
    domain: OperationDomain | 'insights'
    label: string
    priority: 'critical' | 'watch' | 'stable'
    issueCount: number
    slaBreaches: number
    healthScore: number
    action: string
    reason: string
  }>
  watchlist: AdminIssueAnalyticsItem[]
  recentTransitions: Array<{
    issueId: string
    at: string
    fromStatus?: AdminIssueStatus
    toStatus: AdminIssueStatus
    note: string
    source: 'manual' | 'sync'
    title: string
    href: string
    severity: PrioritySeverity
    domain: OperationDomain | 'insights'
  }>
}

function hoursSince(value: string) {
  const time = new Date(value).getTime()
  if (!Number.isFinite(time)) return 0
  return Math.max(0, (Date.now() - time) / (1000 * 60 * 60))
}

function hoursBetween(start: string, end: string) {
  const startTime = new Date(start).getTime()
  const endTime = new Date(end).getTime()
  if (!Number.isFinite(startTime) || !Number.isFinite(endTime)) return 0
  return Math.max(0, (endTime - startTime) / (1000 * 60 * 60))
}

function getSlaHours(severity: PrioritySeverity) {
  if (severity === 'high') return 48
  if (severity === 'medium') return 72
  return 120
}

function getSeverityWeight(severity: PrioritySeverity) {
  if (severity === 'high') return 0
  if (severity === 'medium') return 1
  return 2
}

function buildHealthScore(input: { active: number; slaBreaches: number; reopened: number; staleOpen7d: number }) {
  const penalty = input.active * 4 + input.slaBreaches * 12 + input.reopened * 5 + input.staleOpen7d * 7
  return Math.max(0, 100 - penalty)
}

function buildRiskScore(input: { severity: PrioritySeverity; ageHours: number; overSla: boolean; reopenCount: number; status: AdminIssueStatus }) {
  const severityBase = input.severity === 'high' ? 55 : input.severity === 'medium' ? 35 : 20
  const ageComponent = Math.min(25, Math.round(input.ageHours / 8))
  const slaComponent = input.overSla ? 15 : 0
  const reopenComponent = Math.min(10, input.reopenCount * 3)
  const statusAdjustment = input.status === 'monitoring' ? -5 : 0
  return Math.max(0, Math.min(100, severityBase + ageComponent + slaComponent + reopenComponent + statusAdjustment))
}

function buildRecommendation(input: { domain: OperationDomain | 'insights'; severity: PrioritySeverity; overSla: boolean; reopenCount: number; status: AdminIssueStatus }) {
  if (input.overSla && input.domain === 'messages') return 'Mesaj kuyruğunu öne çekip geri dönüş sırasını hemen temizleyin.'
  if (input.overSla && input.domain === 'projects') return 'Canlı proje tarafında eksik medya ve özet alanlarını aynı oturumda kapatın.'
  if (input.overSla && input.domain === 'fleet') return 'Filo kartlarındaki adet ve görsel tutarsızlıklarını aynı gün senkronlayın.'
  if (input.overSla && input.domain === 'audit') return 'Denetim kayıtlarını ve başarısız giriş nedenlerini hemen inceleyin.'
  if (input.reopenCount > 0) return 'Tekrar açılan bu issue için kalıcı çözüm notu ve kontrol listesi ekleyin.'
  if (input.status === 'monitoring') return 'İzleme durumunu kısa aralıkla kontrol edip kalıcı çözüme bağlayın.'
  if (input.severity === 'high') return 'Bu issue için ilk müdahaleyi bugün tamamlayın.'
  return 'Bu kaydı normal operasyon akışında planlı şekilde kapatın.'
}

function getDomainLabel(domain: OperationDomain | 'insights') {
  if (domain === 'projects') return 'Projeler'
  if (domain === 'messages') return 'Mesajlar'
  if (domain === 'fleet') return 'Filo'
  if (domain === 'audit') return 'Denetim'
  return 'İçgörüler'
}

function buildDomainPlaybook(input: {
  domain: OperationDomain | 'insights'
  issueCount: number
  active: number
  slaBreaches: number
  healthScore: number
  reopened: number
}) {
  const label = getDomainLabel(input.domain)
  if (input.slaBreaches > 0) {
    return {
      domain: input.domain,
      label,
      priority: 'critical' as const,
      issueCount: input.issueCount,
      slaBreaches: input.slaBreaches,
      healthScore: input.healthScore,
      action:
        input.domain === 'messages'
          ? 'Geri dönüş kuyruğunu bugün temizleyin ve 72 saati aşan mesajları ilk sıraya alın.'
          : input.domain === 'projects'
            ? 'Yayındaki içerik eksiklerini aynı oturumda kapatın ve medya/özet kalitesini senkronlayın.'
            : input.domain === 'fleet'
              ? 'Filo adet, görsel ve model tutarsızlıklarını tek seferde dengeleyin.'
              : input.domain === 'audit'
                ? 'Riskli giriş ve reddedilen işlem akışlarını anlık incelemeye alın.'
                : 'İçgörüleri doğrudan aksiyona çevirip açık uyarıları aynı gün kapatın.',
      reason: `${input.slaBreaches} SLA kaçağı var; bu alan ilk müdahale sırasına alınmalı.`,
    }
  }

  if (input.active >= 3 || input.reopened > 0) {
    return {
      domain: input.domain,
      label,
      priority: 'watch' as const,
      issueCount: input.issueCount,
      slaBreaches: input.slaBreaches,
      healthScore: input.healthScore,
      action: 'Açık kayıtları kısa çevrimlerle takip edin ve tekrar açılanlar için kalıcı çözüm notu oluşturun.',
      reason: `${input.active} aktif kayıt ve ${input.reopened} tekrar açılma sinyali mevcut.`,
    }
  }

  return {
    domain: input.domain,
    label,
    priority: 'stable' as const,
    issueCount: input.issueCount,
    slaBreaches: input.slaBreaches,
    healthScore: input.healthScore,
    action: 'Mevcut ritmi koruyun ve yeni açık kayıt oluşumunu günlük kontrolle sınırlayın.',
    reason: 'Alan dengeli görünüyor; yalnızca düzenli bakım ve hızlı kontrol yeterli.',
  }
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function toDayKey(value: string | Date) {
  const date = typeof value === 'string' ? new Date(value) : value
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function isActive(state: AdminIssueState) {
  return state.status === 'open' || state.status === 'monitoring'
}

export async function getAdminIssueAnalytics(): Promise<AdminIssueAnalyticsResult> {
  const [states, history, catalog] = await Promise.all([
    syncAdminIssueTracker(),
    listAdminIssueHistory(),
    getAdminIssueCatalogMap(),
  ])

  const trackedStates = states.filter((state) => catalog[state.id])
  const activeStates = trackedStates.filter(isActive)
  const resolvedStates = trackedStates.filter((state) => state.status === 'resolved')
  const staleOpen48h = activeStates.filter((state) => hoursSince(state.firstSeenAt) >= 48)
  const staleOpen7d = activeStates.filter((state) => hoursSince(state.firstSeenAt) >= 7 * 24)
  const reopenedIssues = trackedStates.filter((state) => state.reopenCount > 0)
  const now = new Date()
  const trend7d = Array.from({ length: 7 }, (_, offset) => {
    const date = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - offset)))
    const dayKey = toDayKey(date)
    const opened = history.filter((entry) => entry.source === 'sync' && toDayKey(entry.at) === dayKey).length
    const resolved = history.filter((entry) => entry.toStatus === 'resolved' && toDayKey(entry.at) === dayKey).length
    const updated = history.filter((entry) => entry.source === 'manual' && toDayKey(entry.at) === dayKey).length
    return { dayKey, opened, resolved, updated }
  })
  const transitionCount7d = trend7d.reduce((sum, item) => sum + item.updated + item.resolved, 0)
  const firstHalf = trend7d.slice(0, 3)
  const secondHalf = trend7d.slice(-3)
  const firstHalfPressure = firstHalf.reduce((sum, item) => sum + item.opened - item.resolved, 0)
  const secondHalfPressure = secondHalf.reduce((sum, item) => sum + item.opened - item.resolved, 0)
  const weeklyDelta = secondHalfPressure - firstHalfPressure
  const weeklyDirection = weeklyDelta > 1 ? 'up' : weeklyDelta < -1 ? 'down' : 'stable'

  const slaBreaches = trackedStates.filter((state) => {
    const issue = catalog[state.id]
    if (!issue) return false
    const limit = getSlaHours(issue.severity)
    if (state.status === 'resolved' && state.resolvedAt) {
      return hoursBetween(state.firstSeenAt, state.resolvedAt) > limit
    }
    return hoursSince(state.firstSeenAt) > limit
  })

  const resolutionDurations = resolvedStates
    .filter((state) => state.resolvedAt)
    .map((state) => hoursBetween(state.firstSeenAt, state.resolvedAt!))
    .filter((value) => value > 0)

  const avgResolveHours =
    resolutionDurations.length > 0
      ? resolutionDurations.reduce((sum, value) => sum + value, 0) / resolutionDurations.length
      : 0

  const domainSummary = (['projects', 'messages', 'fleet', 'audit', 'insights'] as const).map((domain) => {
    const items = trackedStates.filter((state) => catalog[state.id]?.domain === domain)
    const active = items.filter(isActive)
    const ages = active.map((state) => hoursSince(state.firstSeenAt))
    const domainBreaches = items.filter((state) => {
      const issue = catalog[state.id]
      if (!issue) return false
      const limit = getSlaHours(issue.severity)
      if (state.status === 'resolved' && state.resolvedAt) {
        return hoursBetween(state.firstSeenAt, state.resolvedAt) > limit
      }
      return hoursSince(state.firstSeenAt) > limit
    })

    return {
      domain,
      tracked: items.length,
      active: active.length,
      resolved: items.filter((state) => state.status === 'resolved').length,
      slaBreaches: domainBreaches.length,
      reopened: items.filter((state) => state.reopenCount > 0).length,
      avgAgeHours: ages.length > 0 ? ages.reduce((sum, value) => sum + value, 0) / ages.length : 0,
      healthScore: buildHealthScore({
        active: active.length,
        slaBreaches: domainBreaches.length,
        reopened: items.filter((state) => state.reopenCount > 0).length,
        staleOpen7d: active.filter((state) => hoursSince(state.firstSeenAt) >= 7 * 24).length,
      }),
    }
  })

  const hottestDomainEntry = [...domainSummary].sort((left, right) => {
    const pressureLeft = left.active + left.slaBreaches * 2 + left.reopened
    const pressureRight = right.active + right.slaBreaches * 2 + right.reopened
    return pressureRight - pressureLeft
  })[0]
  const totalClosed = trend7d.reduce((sum, item) => sum + item.resolved, 0)
  const totalOpened = trend7d.reduce((sum, item) => sum + item.opened, 0)
  const recoveryRate = totalOpened > 0 ? Math.min(100, Math.round((totalClosed / totalOpened) * 100)) : totalClosed > 0 ? 100 : 0
  const currentWindow = trend7d.slice(-3)
  const previousWindow = trend7d.slice(0, 3)
  const currentOpened = currentWindow.reduce((sum, item) => sum + item.opened, 0)
  const currentResolved = currentWindow.reduce((sum, item) => sum + item.resolved, 0)
  const previousOpened = previousWindow.reduce((sum, item) => sum + item.opened, 0)
  const previousResolved = previousWindow.reduce((sum, item) => sum + item.resolved, 0)
  const openedDelta = currentOpened - previousOpened
  const resolvedDelta = currentResolved - previousResolved
  const netPressureDelta = (currentOpened - currentResolved) - (previousOpened - previousResolved)
  const momentum = netPressureDelta > 1 ? 'accelerating' : netPressureDelta < -1 ? 'improving' : 'stable'
  const focusRecommendation =
    hottestDomainEntry?.slaBreaches
      ? `${hottestDomainEntry.domain === 'insights' ? 'İçgörü' : hottestDomainEntry.domain} alanındaki SLA kaçaklarını ilk öncelik yapın.`
      : weeklyDirection === 'up'
        ? 'Son günlerde operasyon baskısı artıyor; açık kayıtları aynı gün içinde kapatmaya odaklanın.'
        : weeklyDirection === 'down'
          ? 'İyileşme eğilimi var; tekrar açılan kayıtları kalıcı çözüme çevirin.'
          : 'Operasyon temposu dengede; yüksek öncelikli kayıtları düzenli takipte tutun.'

  const playbooks = domainSummary
    .map((domain) =>
      buildDomainPlaybook({
        domain: domain.domain,
        issueCount: domain.tracked,
        active: domain.active,
        slaBreaches: domain.slaBreaches,
        healthScore: domain.healthScore,
        reopened: domain.reopened,
      })
    )
    .sort((left, right) => {
      const weight = { critical: 0, watch: 1, stable: 2 }
      if (weight[left.priority] !== weight[right.priority]) return weight[left.priority] - weight[right.priority]
      return left.healthScore - right.healthScore
    })

  const watchlist = activeStates
    .map((state) => {
      const issue = catalog[state.id]
      if (!issue) return null
      const ageHours = hoursSince(state.firstSeenAt)
      const overSla = ageHours > getSlaHours(issue.severity)
      return {
        id: state.id,
        title: issue.title,
        href: issue.href,
        status: state.status,
        severity: issue.severity,
        domain: issue.domain,
        ageHours,
        overSla,
        reopenCount: state.reopenCount,
        updatedAt: state.updatedAt,
        riskScore: buildRiskScore({
          severity: issue.severity,
          ageHours,
          overSla,
          reopenCount: state.reopenCount,
          status: state.status,
        }),
        recommendation: buildRecommendation({
          domain: issue.domain,
          severity: issue.severity,
          overSla,
          reopenCount: state.reopenCount,
          status: state.status,
        }),
      }
    })
    .filter((item): item is AdminIssueAnalyticsItem => item !== null)
    .sort((left, right) => {
      if (left.overSla !== right.overSla) return left.overSla ? -1 : 1
      if (left.riskScore !== right.riskScore) return right.riskScore - left.riskScore
      const severityOrder = getSeverityWeight(left.severity) - getSeverityWeight(right.severity)
      if (severityOrder !== 0) return severityOrder
      return right.ageHours - left.ageHours
    })

  const recentTransitions = history
    .filter((entry) => catalog[entry.issueId])
    .slice(-8)
    .reverse()
    .map((entry) => ({
      ...entry,
      title: catalog[entry.issueId].title,
      href: catalog[entry.issueId].href,
      severity: catalog[entry.issueId].severity,
      domain: catalog[entry.issueId].domain,
    }))

  return {
    summary: {
      tracked: trackedStates.length,
      open: trackedStates.filter((state) => state.status === 'open').length,
      monitoring: trackedStates.filter((state) => state.status === 'monitoring').length,
      resolved: resolvedStates.length,
      staleOpen48h: staleOpen48h.length,
      staleOpen7d: staleOpen7d.length,
      reopened: reopenedIssues.length,
      slaBreaches: slaBreaches.length,
      avgResolveHours,
      healthScore: buildHealthScore({
        active: activeStates.length,
        slaBreaches: slaBreaches.length,
        reopened: reopenedIssues.length,
        staleOpen7d: staleOpen7d.length,
      }),
      transitionCount7d,
    },
    domainSummary,
    trend7d,
    focus: {
      hottestDomain: hottestDomainEntry?.domain ?? null,
      highestPressureCount: hottestDomainEntry ? hottestDomainEntry.active + hottestDomainEntry.slaBreaches * 2 + hottestDomainEntry.reopened : 0,
      recoveryRate,
      weeklyDirection,
      weeklyDelta,
      recommendation: focusRecommendation,
    },
    weeklyComparison: {
      currentOpened,
      currentResolved,
      previousOpened,
      previousResolved,
      openedDelta,
      resolvedDelta,
      netPressureDelta,
      momentum,
    },
    playbooks,
    watchlist,
    recentTransitions,
  }
}
