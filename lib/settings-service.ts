import { cache } from 'react'
import { getSettingsRepository } from '@/lib/content-repository'
import type { SiteSettings } from '@/lib/store'

// Settings are read several times per request (layout metadata, page bodies,
// API guards). React's request-scoped cache keeps that to a single storage hit
// without serving stale data across requests or hiding admin mutations.
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  return getSettingsRepository().get()
})

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
