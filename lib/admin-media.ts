import { auditProjectAssets } from '@/lib/asset-health'
import { listAdminProjects } from '@/lib/project-service'
import type { Project, ProjectMedia } from '@/lib/store'

export type AdminMediaEntry = {
  media: ProjectMedia
  project: Pick<Project, 'id' | 'title' | 'slug' | 'status' | 'category' | 'location'>
  broken: boolean
}

export async function listAdminMediaEntries() {
  const projects = await listAdminProjects()
  const entries: AdminMediaEntry[] = []

  for (const project of projects) {
    const issues = await auditProjectAssets(project)
    const brokenFiles = new Set(issues.map((issue) => issue.fileUrl))

    for (const media of project.media) {
      entries.push({
        media,
        project: {
          id: project.id,
          title: project.title,
          slug: project.slug,
          status: project.status,
          category: project.category,
          location: project.location,
        },
        broken: media.resourceType === 'image' && brokenFiles.has(media.fileUrl),
      })
    }
  }

  return entries.sort((left, right) => {
    const leftTime = new Date(left.media.createdAt).getTime()
    const rightTime = new Date(right.media.createdAt).getTime()
    return rightTime - leftTime
  })
}
