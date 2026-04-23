import { jsonNoStore, jsonOk, readJson, withErrorHandling } from '@/lib/http'
import { settingsSchema } from '@/lib/validation'
import { assertAdminRequest, enforceRateLimit } from '@/lib/security'
import { assertRequestBodySize, assertRequestContentType } from '@/lib/request-guards'
import { writeAuditLog } from '@/lib/audit'
import { getSiteSettings, updateSiteSettings } from '@/lib/settings-service'

const SETTINGS_MUTATION_MAX_BYTES = 16 * 1024

export async function GET(request: Request) {
  return withErrorHandling(async () => {
    await assertAdminRequest(request)
    return jsonNoStore(await getSiteSettings())
  })
}

export async function PATCH(request: Request) {
  return withErrorHandling(async () => {
    const ip = await enforceRateLimit(request, 'admin:settings:update', 20, 10 * 60 * 1000)
    await assertAdminRequest(request)
    assertRequestContentType(request, ['application/json'])
    assertRequestBodySize(request, SETTINGS_MUTATION_MAX_BYTES)

    const payload = await readJson(request, settingsSchema)
    const nextSettings = await updateSiteSettings(payload)

    await writeAuditLog({ action: 'settings.update', status: 'success', ip })
    return jsonOk(nextSettings)
  })
}
