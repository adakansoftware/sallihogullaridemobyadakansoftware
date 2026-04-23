import { readSettings, writeSettings, type SiteSettings } from '@/lib/store'

export async function getSiteSettings() {
  return readSettings()
}

export async function updateSiteSettings(input: SiteSettings) {
  const current = await readSettings()
  const nextSettings = { ...current, ...input }
  await writeSettings(nextSettings)
  return nextSettings
}
