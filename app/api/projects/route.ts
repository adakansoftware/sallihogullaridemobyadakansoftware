import { jsonOk, readJson, withErrorHandling } from '@/lib/http'
import { isAdminAuthenticated } from '@/lib/auth'
import { projectInputSchema } from '@/lib/validation'
import { assertAdminRequest, enforceRateLimit } from '@/lib/security'
import { writeAuditLog } from '@/lib/audit'
import { createProject, listAdminProjects, listPublishedProjects } from '@/lib/project-service'

export async function GET() {
  return withErrorHandling(async () => {
    if (await isAdminAuthenticated()) {
      return jsonOk(await listAdminProjects())
    }

    return jsonOk(await listPublishedProjects())
  })
}

export async function POST(request: Request) {
  return withErrorHandling(async () => {
    const ip = await enforceRateLimit(request, 'admin:projects:create', 20, 10 * 60 * 1000)
    await assertAdminRequest(request)

    const payload = await readJson(request, projectInputSchema)
    const project = await createProject(payload)

    await writeAuditLog({ action: 'project.create', status: 'success', ip, target: project.id })
    return jsonOk(project, { status: 201 })
  })
}

