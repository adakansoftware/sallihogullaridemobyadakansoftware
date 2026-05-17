import { promises as fs } from 'node:fs'
import path from 'node:path'
import { Pool, type PoolClient } from 'pg'

function stripQuotes(value: string) {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1)
  }

  return value
}

export async function loadLocalEnv() {
  const envPath = path.join(process.cwd(), '.env')

  try {
    const raw = await fs.readFile(envPath, 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue

      const separator = trimmed.indexOf('=')
      if (separator === -1) continue

      const key = trimmed.slice(0, separator).trim()
      const value = stripQuotes(trimmed.slice(separator + 1).trim())
      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  } catch {
    // .env is optional; CI or hosting may provide env vars directly.
  }
}

export function createPool() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL bulunamadı.')
  }

  return new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 2,
  })
}

export async function withTransaction<T>(pool: Pool, run: (client: PoolClient) => Promise<T>) {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')
    const result = await run(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function readJsonFile<T>(relativePath: string): Promise<T> {
  const filePath = path.join(process.cwd(), relativePath)
  const raw = await fs.readFile(filePath, 'utf8')
  return JSON.parse(raw) as T
}
