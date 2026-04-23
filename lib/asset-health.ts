import { promises as fs } from 'fs'
import path from 'path'
import {
  assertPublicAssetExists,
  collectManagedUploadUrls,
  isPublicAssetUrl,
  readProjects,
  type Project,
} from '@/lib/store'

export type AssetIssueKind = 'cover' | 'media' | 'thumbnail'

export type AssetIssue = {
  projectId: string
  projectTitle: string
  kind: AssetIssueKind
  fileUrl: string
}

function buildProjectAssetChecks(project: Project) {
  const checks: Array<{ kind: AssetIssueKind; fileUrl: string }> = []

  if (project.coverImage) {
    checks.push({ kind: 'cover', fileUrl: project.coverImage })
  }

  for (const media of project.media) {
    checks.push({ kind: 'media', fileUrl: media.fileUrl })

    if (media.thumbnailUrl) {
      checks.push({ kind: 'thumbnail', fileUrl: media.thumbnailUrl })
    }
  }

  return checks
}

export async function auditProjectAssets(project: Project) {
  const issues: AssetIssue[] = []

  for (const asset of buildProjectAssetChecks(project)) {
    if (!asset.fileUrl || !isPublicAssetUrl(asset.fileUrl)) continue

    const exists = await assertPublicAssetExists(asset.fileUrl)
    if (!exists) {
      issues.push({
        projectId: project.id,
        projectTitle: project.title,
        kind: asset.kind,
        fileUrl: asset.fileUrl,
      })
    }
  }

  return issues
}

export async function getSiteAssetHealth() {
  const projects = await readProjects()
  const missingAssets: AssetIssue[] = []

  for (const project of projects) {
    missingAssets.push(...(await auditProjectAssets(project)))
  }

  const referencedUploads = collectManagedUploadUrls(projects)
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  let orphanUploads: string[] = []

  try {
    const uploadEntries = await fs.readdir(uploadDir, { withFileTypes: true })
    orphanUploads = uploadEntries
      .filter((entry) => entry.isFile())
      .map((entry) => `/uploads/${entry.name}`)
      .filter((fileUrl) => !referencedUploads.has(fileUrl))
      .sort((left, right) => left.localeCompare(right, 'tr'))
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException
    if (nodeError.code !== 'ENOENT') {
      throw error
    }
  }

  return {
    projectCount: projects.length,
    managedUploadReferenceCount: referencedUploads.size,
    missingAssets,
    orphanUploads,
  }
}
