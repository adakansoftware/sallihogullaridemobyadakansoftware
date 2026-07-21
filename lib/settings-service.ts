import { getSettingsRepository } from '@/lib/content-repository'
import type { SiteSettings } from '@/lib/store'

export async function getSiteSettings() {
  return getSettingsRepository().get()
}

export async function updateSiteSettings(input: SiteSettings) {
  const repository = getSettingsRepository()
  return repository.mutate((current) => {
    const nextSettings = { ...current, ...input }
    return {
      settings: nextSettings,
      result: nextSettings,
    }
  })
}
