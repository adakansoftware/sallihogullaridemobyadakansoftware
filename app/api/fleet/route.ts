import { jsonNoStore, jsonOk, readJson, withErrorHandling } from '@/lib/http'
import { writeAuditLog } from '@/lib/audit'
import { getFleetContent, updateFleetContent } from '@/lib/fleet-service'
import { assertRequestBodySize, assertRequestContentType } from '@/lib/request-guards'
import { assertAdminRequest, enforceRateLimit } from '@/lib/security'
import { fleetContentSchema } from '@/lib/validation'

const FLEET_MUTATION_MAX_BYTES = 96 * 1024

export async function GET(request: Request) {
  return withErrorHandling(async () => {
    await assertAdminRequest(request)
    return jsonNoStore(await getFleetContent())
  })
}

export async function PATCH(request: Request) {
  return withErrorHandling(async () => {
    const ip = await enforceRateLimit(request, 'admin:fleet:update', 20, 10 * 60 * 1000)
    await assertAdminRequest(request)
    assertRequestContentType(request, ['application/json'])
    assertRequestBodySize(request, FLEET_MUTATION_MAX_BYTES)

    const payload = await readJson(request, fleetContentSchema, FLEET_MUTATION_MAX_BYTES)
    const nextContent = await updateFleetContent(payload)

    await writeAuditLog({ action: 'fleet.update', status: 'success', ip })
    return jsonOk(nextContent)
  })
}
