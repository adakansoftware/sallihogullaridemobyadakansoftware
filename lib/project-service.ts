import {
  assertManagedUploadExists,
  assertPublicAssetExists,
  getProjectById,
  getProjectBySlug,
  isPublicAssetUrl,
  makeId,
  readProjects,
  safeDeleteManagedUploadIfOrphan,
  writeProjects,
  type Project,
  type ProjectMedia,
} from '@/lib/store'
import { createSlug, ensureUniqueSlug } from '@/lib/slug'

type ProjectInput = {
  title: string
  slug?: string
  summary: string
  description: string
  location: string
  category: string
  coverImage: string
  status: 'Taslak' | 'Yayında'
  featured: boolean
  tags: string[]
}

type ProjectMediaInput = {
  title: string
  fileUrl: string
  fileType: string
  resourceType: 'image' | 'video'
  thumbnailUrl?: string
  isCover: boolean
  sortOrder: number
}

type ProjectMediaUpdateInput = {
  title?: string
  sortOrder?: number
  isCover?: boolean
}

const fallbackGalleryPool = [
  '/images/gallery-1.jpg',
  '/images/gallery-2.jpg',
  '/images/gallery-3.jpg',
  '/images/gallery-4.jpg',
  '/images/excavator.jpg',
  '/images/dump-truck.jpg',
  '/images/lowbed.jpg',
  '/images/backhoe.jpg',
]

function sortMedia(media: ProjectMedia[]) {
  return [...media].sort((left, right) => {
    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder
    }

    const leftCreatedAt = new Date(left.createdAt).getTime()
    const rightCreatedAt = new Date(right.createdAt).getTime()
    if (leftCreatedAt !== rightCreatedAt) {
      return leftCreatedAt - rightCreatedAt
    }

    return left.id.localeCompare(right.id, 'tr')
  })
}

function normalizeMediaCollection(media: ProjectMedia[]) {
  return sortMedia(media).map((item, index) => ({
    ...item,
    sortOrder: index,
    thumbnailUrl: item.thumbnailUrl || item.fileUrl,
  }))
}

function normalizeProjectMedia(project: Project) {
  const sortedMedia = normalizeMediaCollection(project.media)
  const coverMedia = sortedMedia.find((item) => item.isCover) || sortedMedia[0]
  const coverImage = coverMedia?.fileUrl || project.coverImage || ''

  return {
    ...project,
    coverImage,
    media: sortedMedia.map((item) => ({
      ...item,
      isCover: item.id === coverMedia?.id,
    })),
  }
}

function finalizeProjects(projects: Project[]) {
  return projects.map((project) => normalizeProjectMedia(project))
}

async function validateProjectCoverImage(coverImage: string) {
  if (!coverImage || !isPublicAssetUrl(coverImage)) return

  const exists = await assertPublicAssetExists(coverImage)
  if (!exists) {
    throw new Error('Kapak görseli bulunamadı. Lütfen mevcut bir /images veya /uploads dosyası seçin.')
  }
}

export async function listAdminProjects() {
  const projects = await readProjects()
  return projects.map(normalizeProjectMedia)
}

export async function listPublishedProjects() {
  const projects = await listAdminProjects()
  return projects.filter((project) => project.status === 'Yayında')
}

export async function findAdminProjectById(id: string) {
  const project = await getProjectById(id)
  return project ? normalizeProjectMedia(project) : null
}

export async function findAdminProjectBySlug(slug: string) {
  const project = await getProjectBySlug(slug)
  return project ? normalizeProjectMedia(project) : null
}

export async function findPublishedProjectBySlug(slug: string) {
  const project = await findAdminProjectBySlug(slug)
  if (!project || project.status !== 'Yayında') return null
  return project
}

export async function createProject(input: ProjectInput) {
  const now = new Date().toISOString()
  const projects = await readProjects()
  const slug = ensureUniqueSlug(createSlug(input.slug || input.title), projects)
  await validateProjectCoverImage(input.coverImage)

  const project: Project = normalizeProjectMedia({
    id: makeId(),
    title: input.title,
    slug,
    summary: input.summary,
    description: input.description,
    location: input.location,
    category: input.category,
    coverImage: input.coverImage,
    status: input.status,
    featured: input.featured,
    tags: input.tags,
    createdAt: now,
    updatedAt: now,
    media: [],
  })

  projects.unshift(project)
  await writeProjects(finalizeProjects(projects))
  return project
}

export async function updateProject(id: string, input: ProjectInput) {
  const projects = await readProjects()
  const index = projects.findIndex((item) => item.id === id)
  if (index === -1) return null

  const current = normalizeProjectMedia(projects[index])
  const nextCoverImage = input.coverImage || current.coverImage
  await validateProjectCoverImage(nextCoverImage)

  const nextProject: Project = normalizeProjectMedia({
    ...current,
    title: input.title,
    slug: ensureUniqueSlug(createSlug(input.slug || input.title), projects, id),
    summary: input.summary,
    description: input.description,
    location: input.location,
    category: input.category,
    coverImage: nextCoverImage,
    status: input.status,
    featured: input.featured,
    tags: input.tags,
    updatedAt: new Date().toISOString(),
  })

  projects[index] = nextProject
  await writeProjects(finalizeProjects(projects))
  return nextProject
}

export async function deleteProject(id: string) {
  const projects = await readProjects()
  const project = projects.find((item) => item.id === id)
  if (!project) return false

  const nextProjects = finalizeProjects(projects.filter((item) => item.id !== id))

  await writeProjects(nextProjects)

  for (const media of project.media) {
    await safeDeleteManagedUploadIfOrphan(media.fileUrl, nextProjects)
    if (media.thumbnailUrl && media.thumbnailUrl !== media.fileUrl) {
      await safeDeleteManagedUploadIfOrphan(media.thumbnailUrl, nextProjects)
    }
  }

  await safeDeleteManagedUploadIfOrphan(project.coverImage, nextProjects)
  return true
}

export async function attachMediaToProject(projectId: string, input: ProjectMediaInput) {
  const projects = await readProjects()
  const projectIndex = projects.findIndex((item) => item.id === projectId)
  if (projectIndex === -1) return null

  const fileExists = await assertManagedUploadExists(input.fileUrl)
  if (!fileExists) {
    throw new Error('Yüklenen dosya bulunamadı veya taşınmış olabilir.')
  }

  if (input.thumbnailUrl) {
    const thumbnailExists = await assertManagedUploadExists(input.thumbnailUrl)
    if (!thumbnailExists) {
      throw new Error('Önizleme dosyası bulunamadı veya taşınmış olabilir.')
    }
  }

  const currentProject = normalizeProjectMedia(projects[projectIndex])
  if (currentProject.media.some((item) => item.fileUrl === input.fileUrl && item.title === input.title)) {
    throw new Error('Aynı medya kaydı bu projeye zaten eklenmiş.')
  }

  const media: ProjectMedia = {
    id: makeId(),
    title: input.title,
    fileUrl: input.fileUrl,
    fileType: input.fileType,
    resourceType: input.resourceType,
    thumbnailUrl: input.thumbnailUrl || input.fileUrl,
    isCover: input.isCover,
    sortOrder: input.sortOrder,
    createdAt: new Date().toISOString(),
  }

  const nextMedia = sortMedia([
    ...currentProject.media.map((item) => ({ ...item, isCover: input.isCover ? false : item.isCover })),
    media,
  ])

  const nextProject = normalizeProjectMedia({
    ...currentProject,
    media: nextMedia,
    coverImage: input.isCover || !currentProject.coverImage ? input.fileUrl : currentProject.coverImage,
    updatedAt: new Date().toISOString(),
  })

  projects[projectIndex] = nextProject
  await writeProjects(finalizeProjects(projects))
  return nextProject.media.find((item) => item.id === media.id) || media
}

export async function updateProjectMedia(mediaId: string, input: ProjectMediaUpdateInput) {
  const projects = await readProjects()
  let updatedMedia: ProjectMedia | null = null

  const nextProjects = finalizeProjects(
    projects.map((project) => {
      const hasMedia = project.media.some((item) => item.id === mediaId)
      if (!hasMedia) return project

      const nextMedia = sortMedia(
        project.media.map((item) => {
          if (item.id !== mediaId) {
            return input.isCover ? { ...item, isCover: false } : item
          }

          updatedMedia = {
            ...item,
            title: input.title ?? item.title,
            sortOrder: input.sortOrder ?? item.sortOrder,
            isCover: input.isCover ?? item.isCover,
          }

          return updatedMedia
        }),
      )

      return normalizeProjectMedia({
        ...project,
        media: nextMedia,
        updatedAt: new Date().toISOString(),
      })
    }),
  )

  if (!updatedMedia) return null

  await writeProjects(nextProjects)
  return updatedMedia
}

export async function deleteProjectMedia(mediaId: string) {
  const projects = await readProjects()
  let removedFileUrl = ''
  let removedThumbUrl = ''
  let deleted = false

  const nextProjects = finalizeProjects(
    projects.map((project) => {
      const removedMedia = project.media.find((item) => item.id === mediaId)
      if (!removedMedia) return project

      deleted = true
      removedFileUrl = removedMedia.fileUrl
      removedThumbUrl = removedMedia.thumbnailUrl || ''

      return normalizeProjectMedia({
        ...project,
        media: project.media.filter((item) => item.id !== mediaId),
        coverImage: removedMedia.isCover || project.coverImage === removedMedia.fileUrl ? '' : project.coverImage,
        updatedAt: new Date().toISOString(),
      })
    }),
  )

  if (!deleted) return false

  await writeProjects(nextProjects)
  await safeDeleteManagedUploadIfOrphan(removedFileUrl, nextProjects)
  if (removedThumbUrl && removedThumbUrl !== removedFileUrl) {
    await safeDeleteManagedUploadIfOrphan(removedThumbUrl, nextProjects)
  }

  return true
}

export function buildProjectGallery(project: Project) {
  const normalized = normalizeProjectMedia(project)
  const mediaUrls = new Set(normalized.media.map((item) => item.fileUrl))
  const fallbackMedia: ProjectMedia[] = fallbackGalleryPool
    .filter((fileUrl) => fileUrl !== normalized.coverImage && !mediaUrls.has(fileUrl))
    .slice(0, Math.max(0, 4 - normalized.media.length))
    .map((fileUrl, index) => ({
      id: `fallback-${normalized.id}-${index}`,
      title: `${normalized.title} ek görünüm ${index + 1}`,
      fileUrl,
      fileType: 'image/jpeg',
      resourceType: 'image',
      thumbnailUrl: fileUrl,
      isCover: false,
      sortOrder: normalized.media.length + index + 1,
      createdAt: normalized.updatedAt,
    }))

  return [...normalized.media, ...fallbackMedia]
}

export function buildProjectScopes(project: Project) {
  return project.tags.slice(0, 4).length
    ? project.tags.slice(0, 4)
    : ['Hafriyat koordinasyonu', 'Nakliye planı', 'Saha ekipman yönetimi']
}

export function buildProjectHighlights(project: Project) {
  return [
    {
      label: 'Operasyon kategorisi',
      value: project.category || 'Saha operasyonu',
      note: 'Kazı, sevkiyat ve saha koordinasyonu aynı operasyon planı içinde birlikte yürütülür.',
    },
    {
      label: 'Saha lokasyonu',
      value: project.location || 'Türkiye',
      note: 'Projenin ritmi, sevkiyat planı ve ekipman yoğunluğu lokasyon şartlarına göre şekillenir.',
    },
    {
      label: 'Medya kapsamı',
      value: `${Math.max(project.media.length, 1)}+ kayıt`,
      note: 'Kapak görseline ek olarak iş akışını destekleyen saha kareleri ve operasyon görüntüleri sunulur.',
    },
  ]
}
