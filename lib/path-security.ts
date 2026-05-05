import path from 'path'

export function isCleanPublicPathUrl(fileUrl: string, rootSegment: 'images' | 'uploads') {
  if (fileUrl.includes('\\') || fileUrl.includes('\0')) return false
  if (!fileUrl.startsWith(`/${rootSegment}/`)) return false

  const segments = fileUrl.split('/').filter(Boolean)
  return segments[0] === rootSegment && !segments.some((segment) => segment === '.' || segment === '..')
}

export function isPathInside(parent: string, child: string) {
  const relative = path.relative(parent, child)
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))
}
