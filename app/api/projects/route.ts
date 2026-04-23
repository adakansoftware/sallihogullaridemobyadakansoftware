import { jsonNoStore, jsonOk, readJson, withErrorHandling } from '@/lib/http'
import { isAdminAuthenticated } from '@/lib/auth'
import { projectInputSchema } from '@/lib/validation'
import { assertAdminRequest, enforceRateLimit } from '@/lib/security'
import { assertRequestBodySize, assertRequestContentType } from '@/lib/request-guards'
import { writeAuditLog } from '@/lib/audit'
import { createProject, listAdminProjects, listPublishedProjects } from '@/lib/project-service'

const PROJECT_MUTATION_MAX_BYTES = 32 * 1024

export async function GET() {
  return withErrorHandling(async () => {
    if (await isAdminAuthenticated()) {
      return jsonNoStore(await listAdminProjects())
    }

    return jsonNoStore(await listPublishedProjects())
  })
}

export async function POST(request: Request) {
  return withErrorHandling(async () => {
    const ip = await enforceRateLimit(request, 'admin:projects:create', 20, 10 * 60 * 1000)
    await assertAdminRequest(request)
    assertRequestContentType(request, ['application/json'])
    assertRequestBodySize(request, PROJECT_MUTATION_MAX_BYTES)

    const payload = await readJson(request, projectInputSchema)
    const project = await createProject(payload)

    await writeAuditLog({ action: 'project.create', status: 'success', ip, target: project.id })
    return jsonOk(project, { status: 201 })
  })
}
