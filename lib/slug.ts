export function replaceTurkishLetters(value: string) {
  return value
    .replaceAll('ı', 'i')
    .replaceAll('İ', 'i')
    .replaceAll('ğ', 'g')
    .replaceAll('Ğ', 'g')
    .replaceAll('ü', 'u')
    .replaceAll('Ü', 'u')
    .replaceAll('ş', 's')
    .replaceAll('Ş', 's')
    .replaceAll('ö', 'o')
    .replaceAll('Ö', 'o')
    .replaceAll('ç', 'c')
    .replaceAll('Ç', 'c')
}

export function createSlug(value: string) {
  return replaceTurkishLetters(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function ensureUniqueSlug(
  slug: string,
  items: Array<{ id: string; slug: string }>,
  excludeId?: string,
  fallbackSeed = 'proje',
) {
  const normalized = createSlug(slug) || createSlug(`${fallbackSeed}-${Date.now()}`)
  let candidate = normalized
  let suffix = 2

  while (items.some((item) => item.id !== excludeId && item.slug === candidate)) {
    candidate = `${normalized}-${suffix}`
    suffix += 1
  }

  return candidate
}
