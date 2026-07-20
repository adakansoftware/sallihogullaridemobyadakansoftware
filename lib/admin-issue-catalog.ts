import { getAdminInsights } from '@/lib/admin-insights'
import { getAdminOperationsCenter, type OperationDomain } from '@/lib/admin-operations'

export type AdminIssueCatalogEntry = {
  id: string
  title: string
  href: string
  severity: 'high' | 'medium' | 'low'
  domain: OperationDomain | 'insights'
}

export async function getAdminIssueCatalog() {
  const [insights, operations] = await Promise.all([getAdminInsights(), getAdminOperationsCenter()])
  const catalog = new Map<string, AdminIssueCatalogEntry>()

  for (const insight of insights) {
    catalog.set(insight.id, {
      id: insight.id,
      title: insight.title,
      href: insight.href,
      severity: insight.severity,
      domain: 'insights',
    })
  }

  for (const issue of operations.issues) {
    catalog.set(issue.id, {
      id: issue.id,
      title: issue.title,
      href: issue.href,
      severity: issue.severity,
      domain: issue.domain,
    })
  }

  return [...catalog.values()]
}

export async function getAdminIssueCatalogMap() {
  const items = await getAdminIssueCatalog()
  return Object.fromEntries(items.map((item) => [item.id, item])) as Record<string, AdminIssueCatalogEntry>
}
