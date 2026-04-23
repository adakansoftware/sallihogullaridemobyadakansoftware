import { constants, promises as fs } from 'fs'
import path from 'path'
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
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

    const [dataState, uploadsState] = await Promise.all([checkPathState(dataDir), checkPathState(uploadsDir)])
    const dataReady = dataState.exists && dataState.writable
    const uploadsReady = (uploadsState.exists && uploadsState.writable) || uploadsState.type === 'missing'
    const ready = dataReady && uploadsReady

    return jsonNoStore(
      {
        status: ready ? 'ok' : 'degraded',
        checkedAt: new Date().toISOString(),
        runtime: {
          nodeEnv: env.NODE_ENV,
          appOriginConfigured: Boolean(env.APP_ORIGIN),
          siteUrlConfigured: Boolean(env.NEXT_PUBLIC_SITE_URL),
        },
        storage: {
          data: dataState,
          uploads: uploadsState,
        },
        notes: uploadsState.type === 'missing' ? ['uploads directory will be created automatically on first successful upload'] : [],
      },
      { status: ready ? 200 : 503 },
    )
  })
}
