import { cache } from 'react'
import { fleetContentSchema } from '@/lib/validation'
import { getFleetRepository, type FleetContent } from '@/lib/content-repository'

export type { FleetContent }
export type FleetItem = FleetContent['items'][number]
export type FleetModel = FleetItem['models'][number]
export type FleetStat = FleetContent['stats'][number]

function assertUniqueSlugs(items: FleetItem[]) {
  const seen = new Set<string>()

  for (const item of items) {
    if (seen.has(item.slug)) {
      throw new Error(`Duplicate fleet slug detected: ${item.slug}`)
    }

    seen.add(item.slug)
  }
}

function assertNonEmptyModels(items: FleetItem[]) {
  for (const item of items) {
    if (item.models.length === 0) {
      throw new Error(`Fleet item must include at least one model: ${item.slug}`)
    }
  }
}

function assertModelCounts(items: FleetItem[]) {
  for (const item of items) {
    if (item.models.length !== item.modelCount) {
      throw new Error(`Fleet item model count mismatch: ${item.slug}`)
    }

    const uniqueNames = new Set(item.models.map((model) => model.name.toLocaleLowerCase('tr-TR')))
    if (uniqueNames.size !== item.models.length) {
      throw new Error(`Fleet item has duplicate model cards: ${item.slug}`)
    }
  }
}

function assertFleetInvariants(content: FleetContent) {
  assertUniqueSlugs(content.items)
  assertNonEmptyModels(content.items)
  assertModelCounts(content.items)
}

// Request-scoped cache: fleet list, stats and detail pages share one storage
// read per request. Admin fleet updates write through updateFleetContent and
// are unaffected.
export const getFleetContent = cache(async () => {
  const content = await getFleetRepository().get()
  assertFleetInvariants(content)
  return content
})

export async function updateFleetContent(input: unknown) {
  const content = fleetContentSchema.parse(input)

  assertFleetInvariants(content)

  await getFleetRepository().save(content)
  return content
}

export async function listFleetItems() {
  const content = await getFleetContent()
  return content.items
}

export async function listFleetStats() {
  const content = await getFleetContent()
  return content.stats
}

export function getFleetHref(slug: string) {
  return `/fleet/${slug}`
}

export async function findFleetBySlug(slug: string) {
  const items = await listFleetItems()
  return items.find((item) => item.slug === slug) || null
}
