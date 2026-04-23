import type { MetadataRoute } from 'next'
import { listPublishedProjects } from '@/lib/project-service'
import { getMetadataBase } from '@/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const metadataBase = getMetadataBase()
  const projects = await listPublishedProjects()
  const now = new Date()

  const staticRoutes = ['/', '/about', '/services', '/projects', '/fleet', '/contact']

  return [
    ...staticRoutes.map((route) => ({
      url: new URL(route, metadataBase).toString(),
      lastModified: now,
      changeFrequency: (route === '/' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
      priority: route === '/' ? 1 : route === '/contact' ? 0.8 : 0.7,
    })),
    ...projects.map((project) => ({
      url: new URL(`/projects/${project.slug}`, metadataBase).toString(),
      lastModified: new Date(project.updatedAt || project.createdAt),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
  ]
}
