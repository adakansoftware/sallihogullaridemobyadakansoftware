import { getAdminIssueCatalogMap } from '@/lib/admin-issue-catalog'
import { updateAdminIssueState } from '@/lib/admin-issue-tracker'
import { writeAuditLog } from '@/lib/audit'
import { jsonError, jsonOk, readJson, withErrorHandling } from '@/lib/http'
import { assertRequestBodySize, assertRequestContentType } from '@/lib/request-guards'
import { assertAdminRequest, enforceRateLimit } from '@/lib/security'
import { adminIssueUpdateSchema } from '@/lib/validation'

type Params = { params: Promise<{ id: string }> }

const ISSUE_UPDATE_MAX_BYTES = 2048

export async function PATCH(request: Request, { params }: Params) {
  return withErrorHandling(async () => {
    const ip = await enforceRateLimit(request, 'admin:issues:update', 80, 10 * 60 * 1000)
    await assertAdminRequest(request)
    assertRequestContentType(request, ['application/json'])
    assertRequestBodySize(request, ISSUE_UPDATE_MAX_BYTES)

    const { id } = await params
    const issueId = id.trim()
    if (!issueId) {
      return jsonError(400, 'Sorun kimliği geçersiz.')
    }

    const catalog = await getAdminIssueCatalogMap()
    if (!catalog[issueId]) {
      return jsonError(404, 'Takip edilecek issue bulunamadı.')
    }

    const payload = await readJson(request, adminIssueUpdateSchema, ISSUE_UPDATE_MAX_BYTES)
    const updated = await updateAdminIssueState(issueId, payload)

    await writeAuditLog({
      action: 'admin.issue.update',
      status: 'success',
      ip,
      target: issueId,
      detail: `${catalog[issueId].domain}:${payload.status}`,
    })

    return jsonOk(updated)
  })
}
