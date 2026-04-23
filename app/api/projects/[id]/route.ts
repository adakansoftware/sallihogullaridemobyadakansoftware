import { jsonError, jsonOk, readJson, withErrorHandling } from '@/lib/http'
import { isAdminAuthenticated } from '@/lib/auth'
import { projectInputSchema } from '@/lib/validation'
import { assertAdminRequest, enforceRateLimit } from '@/lib/security'
import { assertRequestBodySize, assertRequestContentType } from '@/lib/request-guards'
import { writeAuditLog } from '@/lib/audit'
import { deleteProject, findAdminProjectById, updateProject } from '@/lib/project-service'

type Params = { params: Promise<{ id: string }> }
const PROJECT_MUTATION_MAX_BYTES = 32 * 1024

export async function GET(_: Request, { params }: Params) {
  return withErrorHandling(async () => {
    const { id } = await params
    const project = await findAdminProjectById(id)
    if (!project) return jsonError(404, 'Proje bulunamadı.')

    if (project.status !== 'Yayında' && !(await isAdminAuthenticated())) {
      return jsonError(404, 'Proje bulunamadı.')
    }

    return jsonOk(project)
  })
}

export async function PATCH(request: Request, { params }: Params) {
  return withErrorHandling(async () => {
    const ip = await enforceRateLimit(request, 'admin:projects:update', 40, 10 * 60 * 1000)
    await assertAdminRequest(request)
    assertRequestContentType(request, ['application/json'])
    assertRequestBodySize(request, PROJECT_MUTATION_MAX_BYTES)

    const { id } = await params
    const payload = await readJson(request, projectInputSchema)
    const project = await updateProject(id, payload)
    if (!project) return jsonError(404, 'Proje bulunamadı.')

    await writeAuditLog({ action: 'project.update', status: 'success', ip, target: id })
    return jsonOk(project)
  })
}

export async function DELETE(request: Request, { params }: Params) {
  return withErrorHandling(async () => {
    const ip = await enforceRateLimit(request, 'admin:projects:delete', 15, 10 * 60 * 1000)
    await assertAdminRequest(request)

    const { id } = await params
    const deleted = await deleteProject(id)

    if (!deleted) {
      return jsonError(404, 'Proje bulunamadı.')
    }

    await writeAuditLog({ action: 'project.delete', status: 'success', ip, target: id })
    return jsonOk({ success: true })
  })
}
