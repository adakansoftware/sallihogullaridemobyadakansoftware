import { getSettingsRepository } from '@/lib/content-repository'
import type { SiteSettings } from '@/lib/store'

export async function getSiteSettings() {
  return getSettingsRepository().get()
}

export async function updateSiteSettings(input: SiteSettings) {
  const repository = getSettingsRepository()
  const current = await repository.get()
  const nextSettings = { ...current, ...input }
  await repository.save(nextSettings)
  return nextSettings
}
