export function normalizeAdminNextTarget(value: string | null | undefined) {
  if (!value) return '/admin'
  if (!value.startsWith('/admin')) return '/admin'
  if (value.startsWith('//')) return '/admin'
  if (value.includes('://')) return '/admin'
  if (/[\r\n]/.test(value)) return '/admin'

  const [pathname] = value.split('?')
  if (!pathname || !/^\/admin(?:\/[\w-]+)*$/.test(pathname)) {
    return '/admin'
  }

  return value
}
