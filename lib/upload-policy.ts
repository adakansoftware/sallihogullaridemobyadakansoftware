import path from 'path'

export const MAX_UPLOAD_FILE_SIZE = 25 * 1024 * 1024

export const ALLOWED_UPLOAD_TYPES: Record<string, { extension: string; resourceType: 'image' | 'video' }> = {
  'image/jpeg': { extension: 'jpg', resourceType: 'image' },
  'image/png': { extension: 'png', resourceType: 'image' },
  'image/webp': { extension: 'webp', resourceType: 'image' },
  'image/avif': { extension: 'avif', resourceType: 'image' },
  'video/mp4': { extension: 'mp4', resourceType: 'video' },
  'video/webm': { extension: 'webm', resourceType: 'video' },
  'video/quicktime': { extension: 'mov', resourceType: 'video' },
}

export function sanitizeUploadBaseName(name: string) {
  return path
    .basename(name, path.extname(name))
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
}

export function hasAllowedUploadExtension(name: string, expectedExtension: string) {
  const extension = path.extname(name).replace(/^\./, '').toLowerCase()
  if (!extension) return false

  if (expectedExtension === 'jpg') {
    return extension === 'jpg' || extension === 'jpeg'
  }

  return extension === expectedExtension
}
