import { jsonOk, readJson, withErrorHandling } from '@/lib/http'
import { settingsSchema } from '@/lib/validation'
import { assertAdminRequest, enforceRateLimit } from '@/lib/security'
import { writeAuditLog } from '@/lib/audit'
import { getSiteSettings, updateSiteSettings } from '@/lib/settings-service'

export async function GET(request: Request) {
  return withErrorHandling(async () => {
    await assertAdminRequest(request)
    return jsonOk(await getSiteSettings())
  })
}

export async function PATCH(request: Request) {
  return withErrorHandling(async () => {
    const ip = await enforceRateLimit(request, 'admin:settings:update', 20, 10 * 60 * 1000)
    await assertAdminRequest(request)

    const payload = await readJson(request, settingsSchema)
    const nextSettings = await updateSiteSettings(payload)

    await writeAuditLog({ action: 'settings.update', status: 'success', ip })
    return jsonOk(nextSettings)
  })
}
