function startsWithBytes(buffer: Uint8Array, signature: number[]) {
  if (buffer.length < signature.length) return false
  return signature.every((byte, index) => buffer[index] === byte)
}

function includesAscii(buffer: Uint8Array, token: string, offset = 0) {
  const tokenBytes = new TextEncoder().encode(token)
  for (let i = offset; i <= buffer.length - tokenBytes.length; i += 1) {
    const matches = tokenBytes.every((byte, index) => buffer[i + index] === byte)
    if (matches) return true
  }
  return false
}

export function isAllowedFileSignature(mimeType: string, buffer: Uint8Array) {
  switch (mimeType) {
    case 'image/jpeg':
      return startsWithBytes(buffer, [0xff, 0xd8, 0xff])
    case 'image/png':
      return startsWithBytes(buffer, [0x89, 0x50, 0x4e, 0x47])
    case 'image/webp':
      return includesAscii(buffer, 'WEBP', 8) && includesAscii(buffer, 'RIFF', 0)
    case 'image/avif':
      return includesAscii(buffer, 'ftypavif', 4) || includesAscii(buffer, 'ftypavis', 4)
    case 'video/mp4':
      return includesAscii(buffer, 'ftyp', 4)
    case 'video/webm':
      return startsWithBytes(buffer, [0x1a, 0x45, 0xdf, 0xa3])
    case 'video/quicktime':
      return includesAscii(buffer, 'ftypqt', 4)
    default:
      return false
  }
}

