import { constants, promises as fs } from 'fs'
import path from 'path'
import { isAdminAuthenticated } from '@/lib/auth'
import { env } from '@/lib/env'
import { jsonNoStore, withErrorHandling } from '@/lib/http'

async function checkPathState(targetPath: string) {
  try {
    const stat = await fs.stat(targetPath)
    await fs.access(targetPath, constants.R_OK | constants.W_OK)

    return {
      exists: true,
      writable: true,
      type: stat.isDirectory() ? 'directory' : 'file',
    }
  } catch {
    return {
      exists: false,
      writable: false,
      type: 'missing',
    }
  }
}

export async function GET() {
  return withErrorHandling(async () => {
    const dataDir = path.join(process.cwd(), 'data')

    const dataState = await checkPathState(dataDir)
    const dataReady = dataState.exists && dataState.writable
    const ready = dataReady

    return jsonNoStore(
      (await isAdminAuthenticated()) ? {
        status: ready ? 'ok' : 'degraded',
        checkedAt: new Date().toISOString(),
        runtime: {
          nodeEnv: env.NODE_ENV,
          appOriginConfigured: Boolean(env.APP_ORIGIN),
          siteUrlConfigured: Boolean(env.NEXT_PUBLIC_SITE_URL),
        },
        storage: {
          data: dataState,
        },
      } : {
        status: ready ? 'ok' : 'degraded',
        checkedAt: new Date().toISOString(),
      },
      { status: ready ? 200 : 503 },
    )
  })
}
