export async function readRequestTextWithinLimit(request: Request, maxBytes?: number) {
  if (typeof maxBytes !== 'number') {
    return request.text()
  }

  const reader = request.body?.getReader()
  if (!reader) return ''

  const decoder = new TextDecoder()
  let totalBytes = 0
  let text = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      totalBytes += value.byteLength
      if (totalBytes > maxBytes) {
        await reader.cancel().catch(() => undefined)
        throw new RangeError('Request body exceeds the configured limit.')
      }

      text += decoder.decode(value, { stream: true })
    }

    return text + decoder.decode()
  } finally {
    reader.releaseLock()
  }
}
