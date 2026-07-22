import services from '@/data/services.json'

export type ServiceDetail = {
  slug: string
  title: string
  description: string
  metaDescription: string
  image: string
  highlights: string[]
  scope: string
  useCases: string[]
  process: string[]
  planningPoints: string[]
  deliverables: string[]
  faq: Array<{
    question: string
    answer: string
  }>
}

export const serviceDetails = services as ServiceDetail[]

export function getServiceHref(slug: string) {
  return `/services/${slug}`
}

export function findServiceBySlug(slug: string) {
  return serviceDetails.find((service) => service.slug === slug) || null
}
