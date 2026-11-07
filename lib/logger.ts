import path from 'path'
import { appendCappedTextFile } from './file-storage.ts'

// Minimal structured logger. Every entry is a single JSON line
// (`{at, level, message, ...fields, error?}`) written to the console; error
// entries are additionally appended to `data/error.log` (fire-and-forget,
// capped). This module must not import `lib/env` (or anything that does):
// `lib/http` is imported by every route and a cycle would break boot.

export type LogFields = Record<string, unknown>

export type SerializedError = {
  name: string
  message: string
  stack?: string
}

const errorLogFile = path.join(/*turbopackIgnore: true*/ process.cwd(), 'data', 'error.log')
const MAX_ERROR_LOG_BYTES = 512 * 1024
const RETAIN_ERROR_LOG_BYTES = 384 * 1024

export function serializeError(error: unknown): SerializedError {
  if (error instanceof Error) {
    return { name: error.name, message: error.message, stack: error.stack }
  }

  return { name: 'NonError', message: String(error) }
}

function writeLog(level: 'info' | 'warn' | 'error', message: string, fields?: LogFields) {
  const entry: Record<string, unknown> = { at: new Date().toISOString(), level, message, ...fields }

  if (entry.error !== undefined) {
    entry.error = serializeError(entry.error)
  }

  const line = JSON.stringify(entry)

  if (level === 'error') {
    console.error(line)
  } else if (level === 'warn') {
    console.warn(line)
  } else {
    console.log(line)
  }

  if (level === 'error') {
    void appendCappedTextFile(errorLogFile, `${line}\n`, MAX_ERROR_LOG_BYTES, RETAIN_ERROR_LOG_BYTES).catch(() => {})
  }
}

export function logInfo(message: string, fields?: LogFields) {
  writeLog('info', message, fields)
}

export function logWarn(message: string, fields?: LogFields) {
  writeLog('warn', message, fields)
}

export function logError(message: string, fields?: LogFields) {
  writeLog('error', message, fields)
}
