import { readJson, jsonError, jsonOk, withErrorHandling } from '@/lib/http'
import { loginSchema } from '@/lib/validation'
import { setAdminSession, validateAdminCredentials } from '@/lib/auth'
import { assertTrustedMutationRequest, enforceIdentifierRateLimit, enforceRateLimit, fingerprint } from '@/lib/security'
import { writeAuditLog } from '@/lib/audit'

const LOGIN_WINDOW_MS = 10 * 60 * 1000
const LOGIN_LIMIT = 5
const LOGIN_IDENTITY_LIMIT = 8

export async function POST(request: Request) {
  return withErrorHandling(async () => {
    assertTrustedMutationRequest(request)
    const ip = await enforceRateLimit(request, 'login', LOGIN_LIMIT, LOGIN_WINDOW_MS)
    const credentials = await readJson(request, loginSchema)
    await enforceIdentifierRateLimit(credentials.email, 'login:email', LOGIN_IDENTITY_LIMIT, LOGIN_WINDOW_MS)

    if (!validateAdminCredentials(credentials.email, credentials.password)) {
      await writeAuditLog({
        action: 'admin.login',
        status: 'failure',
        ip,
        target: fingerprint(credentials.email),
        detail: 'invalid_credentials',
      })

      return jsonError(401, 'E-posta veya şifre hatalı.')
    }

    await setAdminSession()
    await writeAuditLog({
      action: 'admin.login',
      status: 'success',
      ip,
      target: fingerprint(credentials.email),
    })

    return jsonOk({ success: true })
  })
}

