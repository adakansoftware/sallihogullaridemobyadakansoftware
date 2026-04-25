import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'
import { z } from 'zod'
import { readJsonFileWithBackup, restorePrimaryJsonFile, writeJsonFileAtomic } from '@/lib/file-storage'
import { storedMessagesSchema, storedProjectsSchema, storedSettingsSchema } from '@/lib/validation'

export type ProjectMedia = {
  id: string
  title: string
  fileUrl: string
  fileType: string
  resourceType: 'image' | 'video'
  thumbnailUrl?: string
  isCover: boolean
  sortOrder: number
  createdAt: string
}

export type Project = {
  id: string
  title: string
  slug: string
  summary: string
  description: string
  location: string
  category: string
  coverImage: string
  status: 'Taslak' | 'Yayında'
  featured: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
  media: ProjectMedia[]
}

export type AdminMessage = {
  id: string
  reference: string
  name: string
  phone: string
  email: string
  subject: string
  message: string
  isRead: boolean
  createdAt: string
}

export type SiteSettings = {
  companyName: string
  companyShortName: string
  contactPhone: string
  contactPhoneSecondary: string
  contactEmail: string
  contactEmailSecondary: string
  address: string
  serviceArea: string
  workingHours: string
  foundedYear: string
  instagramUrl: string
  whatsappUrl: string
  heroTitle: string
  heroDescription: string
  quoteNotice: string
}

const dataDir = path.join(process.cwd(), 'data')
const publicDir = path.join(process.cwd(), 'public')
const uploadsDir = path.join(publicDir, 'uploads')
const projectsFile = path.join(dataDir, 'projects.json')
const messagesFile = path.join(dataDir, 'messages.json')
const settingsFile = path.join(dataDir, 'settings.json')

const defaultSettings: SiteSettings = {
  companyName: 'Sallıhoğulları Hafriyat',
  companyShortName: 'Sallıhoğulları',
  contactPhone: '+90 555 555 55 55',
  contactPhoneSecondary: '+90 532 555 55 55',
  contactEmail: 'info@salihogullari.com',
  contactEmailSecondary: 'teklif@salihogullari.com',
  address: 'Gaziantep, Türkiye',
  serviceArea: 'Gaziantep merkezli, Türkiye geneli proje bazlı operasyon',
  workingHours: 'Pazartesi - Cumartesi / 07:00 - 19:00',
  foundedYear: '1999',
  instagramUrl: 'https://instagram.com/salihogullarihafriyat',
  whatsappUrl: 'https://wa.me/905555555555',
  heroTitle: 'Hafriyat ve damperli nakliyatta, planlı saha operasyonu',
  heroDescription: 'Kazı, dolgu, malzeme sevkiyatı, lowbed taşıma ve iş makinesi desteğinde şantiye temposuna uyumlu profesyonel saha gücü.',
  quoteNotice: 'Lokasyon, metraj ve çalışma kapsamını paylaşın; size uygun operasyon planı ve teklif yapısını hazırlayalım.',
}

const defaultProjects: Project[] = [
  {
    id: 'proj-basaksehir-metro',
    title: 'Başakşehir Metro Altyapı Projesi',
    slug: 'basaksehir-metro-altyapi-projesi',
    summary: 'Metro hattı güzergahında disiplinli hafriyat, temel kazı ve kontrollü saha lojistiği operasyonu.',
    description: 'Başakşehir metro hattı boyunca yürütülen bu operasyon, kademeli saha planlaması, güvenli sevkiyat ve çoklu ekipman koordinasyonu ile teslim edildi.',
    location: 'İstanbul',
    category: 'Altyapı Kazısı',
    coverImage: '/images/project-1.jpg',
    status: 'Yayında',
    featured: true,
    tags: ['Metro', 'Altyapı', 'Kazı'],
    createdAt: '2026-01-10T09:00:00.000Z',
    updatedAt: '2026-01-10T09:00:00.000Z',
    media: [
      {
        id: 'media-basaksehir-1',
        title: 'Saha genel görünümü',
        fileUrl: '/images/project-1.jpg',
        fileType: 'image/jpeg',
        resourceType: 'image',
        thumbnailUrl: '/images/project-1.jpg',
        isCover: true,
        sortOrder: 0,
        createdAt: '2026-01-10T09:00:00.000Z',
      },
      {
        id: 'media-basaksehir-2',
        title: 'Kazı aksı ve ekipman yerleşimi',
        fileUrl: '/images/gallery-1.jpg',
        fileType: 'image/jpeg',
        resourceType: 'image',
        thumbnailUrl: '/images/gallery-1.jpg',
        isCover: false,
        sortOrder: 1,
        createdAt: '2026-01-10T09:05:00.000Z',
      },
      {
        id: 'media-basaksehir-3',
        title: 'Saha lojistik geçiş koridoru',
        fileUrl: '/images/excavator.jpg',
        fileType: 'image/jpeg',
        resourceType: 'image',
        thumbnailUrl: '/images/excavator.jpg',
        isCover: false,
        sortOrder: 2,
        createdAt: '2026-01-10T09:10:00.000Z',
      },
      {
        id: 'media-basaksehir-4',
        title: 'Kontrollü sevkiyat ritmi',
        fileUrl: '/images/gallery-2.jpg',
        fileType: 'image/jpeg',
        resourceType: 'image',
        thumbnailUrl: '/images/gallery-2.jpg',
        isCover: false,
        sortOrder: 3,
        createdAt: '2026-01-10T09:15:00.000Z',
      },
    ],
  },
  {
    id: 'proj-organize-sanayi',
    title: 'Organize Sanayi Genişleme Operasyonu',
    slug: 'organize-sanayi-genisleme-operasyonu',
    summary: 'Tesviye, dolgu ve altyapı hazırlık akışlarını kapsayan geniş ölçekli saha düzenleme operasyonu.',
    description: 'Sanayi bölgesi genişleme sahasında zemin hazırlığı, malzeme yönetimi ve operasyon temposu aynı takvim içinde birleştirildi.',
    location: 'Kocaeli',
    category: 'Saha Hazırlığı',
    coverImage: '/images/project-2.jpg',
    status: 'Yayında',
    featured: false,
    tags: ['Sanayi', 'Dolgu', 'Tesviye'],
    createdAt: '2026-01-08T09:00:00.000Z',
    updatedAt: '2026-01-08T09:00:00.000Z',
    media: [
      {
        id: 'media-organize-1',
        title: 'Hazırlık sahası',
        fileUrl: '/images/project-2.jpg',
        fileType: 'image/jpeg',
        resourceType: 'image',
        thumbnailUrl: '/images/project-2.jpg',
        isCover: true,
        sortOrder: 0,
        createdAt: '2026-01-08T09:00:00.000Z',
      },
      {
        id: 'media-organize-2',
        title: 'Dolgu planlama katmanı',
        fileUrl: '/images/gallery-3.jpg',
        fileType: 'image/jpeg',
        resourceType: 'image',
        thumbnailUrl: '/images/gallery-3.jpg',
        isCover: false,
        sortOrder: 1,
        createdAt: '2026-01-08T09:05:00.000Z',
      },
      {
        id: 'media-organize-3',
        title: 'Saha açılış parçası',
        fileUrl: '/images/dump-truck.jpg',
        fileType: 'image/jpeg',
        resourceType: 'image',
        thumbnailUrl: '/images/dump-truck.jpg',
        isCover: false,
        sortOrder: 2,
        createdAt: '2026-01-08T09:10:00.000Z',
      },
      {
        id: 'media-organize-4',
        title: 'Tesviye akış görünümü',
        fileUrl: '/images/gallery-4.jpg',
        fileType: 'image/jpeg',
        resourceType: 'image',
        thumbnailUrl: '/images/gallery-4.jpg',
        isCover: false,
        sortOrder: 3,
        createdAt: '2026-01-08T09:15:00.000Z',
      },
    ],
  },
  {
    id: 'proj-lojistik-merkezi',
    title: 'Lojistik Merkezi Temel Kazısı',
    slug: 'lojistik-merkezi-temel-kazisi',
    summary: 'Derin temel kazısı, hafriyat nakliyesi ve sıkı saha temposunu bir araya getiren teslim odaklı proje.',
    description: 'Lojistik merkezinin temel kazısı sürecinde sınırlı erişim alanlarına rağmen makine parkı ve damperli nakliyat senkronize edildi.',
    location: 'Ankara',
    category: 'Temel Kazısı',
    coverImage: '/images/project-3.jpg',
    status: 'Yayında',
    featured: false,
    tags: ['Temel Kazısı', 'Lojistik', 'Nakliyat'],
    createdAt: '2026-01-06T09:00:00.000Z',
    updatedAt: '2026-01-06T09:00:00.000Z',
    media: [
      {
        id: 'media-lojistik-1',
        title: 'Kazı alanı',
        fileUrl: '/images/project-3.jpg',
        fileType: 'image/jpeg',
        resourceType: 'image',
        thumbnailUrl: '/images/project-3.jpg',
        isCover: true,
        sortOrder: 0,
        createdAt: '2026-01-06T09:00:00.000Z',
      },
      {
        id: 'media-lojistik-2',
        title: 'Derin kazıda ekipman ritmi',
        fileUrl: '/images/lowbed.jpg',
        fileType: 'image/jpeg',
        resourceType: 'image',
        thumbnailUrl: '/images/lowbed.jpg',
        isCover: false,
        sortOrder: 1,
        createdAt: '2026-01-06T09:05:00.000Z',
      },
      {
        id: 'media-lojistik-3',
        title: 'Nakliye ve saha destek akışı',
        fileUrl: '/images/gallery-2.jpg',
        fileType: 'image/jpeg',
        resourceType: 'image',
        thumbnailUrl: '/images/gallery-2.jpg',
        isCover: false,
        sortOrder: 2,
        createdAt: '2026-01-06T09:10:00.000Z',
      },
      {
        id: 'media-lojistik-4',
        title: 'Operasyon yoğunluğu panoraması',
        fileUrl: '/images/gallery-1.jpg',
        fileType: 'image/jpeg',
        resourceType: 'image',
        thumbnailUrl: '/images/gallery-1.jpg',
        isCover: false,
        sortOrder: 3,
        createdAt: '2026-01-06T09:15:00.000Z',
      },
    ],
  },
  {
    id: 'proj-otoyol-baglanti',
    title: 'Otoyol Bağlantı Yolu Dolgu Çalışması',
    slug: 'otoyol-baglanti-yolu-dolgu-calismasi',
    summary: 'Yol altyapısı için dolgu, tesviye ve malzeme akışını kapsayan uzun soluklu saha operasyonu.',
    description: 'Bağlantı yolu projesinde dolgu planlaması, kamyon sevkiyat ritmi ve saha dengeleme işleri birlikte ele alındı.',
    location: 'Bursa',
    category: 'Yol Yapımı',
    coverImage: '/images/project-4.jpg',
    status: 'Yayında',
    featured: false,
    tags: ['Yol', 'Dolgu', 'Saha Operasyonu'],
    createdAt: '2026-01-04T09:00:00.000Z',
    updatedAt: '2026-01-04T09:00:00.000Z',
    media: [
      {
        id: 'media-otoyol-1',
        title: 'Bağlantı yolu sahası',
        fileUrl: '/images/project-4.jpg',
        fileType: 'image/jpeg',
        resourceType: 'image',
        thumbnailUrl: '/images/project-4.jpg',
        isCover: true,
        sortOrder: 0,
        createdAt: '2026-01-04T09:00:00.000Z',
      },
      {
        id: 'media-otoyol-2',
        title: 'Dolgu hattında sevkiyat temposu',
        fileUrl: '/images/dump-truck.jpg',
        fileType: 'image/jpeg',
        resourceType: 'image',
        thumbnailUrl: '/images/dump-truck.jpg',
        isCover: false,
        sortOrder: 1,
        createdAt: '2026-01-04T09:05:00.000Z',
      },
      {
        id: 'media-otoyol-3',
        title: 'Yol platformu saha yayılımı',
        fileUrl: '/images/gallery-4.jpg',
        fileType: 'image/jpeg',
        resourceType: 'image',
        thumbnailUrl: '/images/gallery-4.jpg',
        isCover: false,
        sortOrder: 2,
        createdAt: '2026-01-04T09:10:00.000Z',
      },
      {
        id: 'media-otoyol-4',
        title: 'Makine ve dolgu koordinasyonu',
        fileUrl: '/images/backhoe.jpg',
        fileType: 'image/jpeg',
        resourceType: 'image',
        thumbnailUrl: '/images/backhoe.jpg',
        isCover: false,
        sortOrder: 3,
        createdAt: '2026-01-04T09:15:00.000Z',
      },
    ],
  },
]

function normalizeMessageReference(id: string) {
  return id.split('-').at(0)?.toUpperCase() || id.slice(0, 8).toUpperCase()
}

function normalizeMessages(messages: z.infer<typeof storedMessagesSchema>): AdminMessage[] {
  return messages.map((message) => ({
    ...message,
    reference: message.reference || normalizeMessageReference(message.id),
  }))
}

export async function readProjects(): Promise<Project[]> {
  const parsed = await readJsonFileWithBackup(projectsFile, storedProjectsSchema, defaultProjects)
  if (parsed.source !== 'primary') {
    await restorePrimaryJsonFile(projectsFile, parsed.data)
  }
  return parsed.data
}

export async function writeProjects(projects: Project[]) {
  await writeJsonFileAtomic(projectsFile, storedProjectsSchema.parse(projects))
}

export async function getProjectById(id: string) {
  const projects = await readProjects()
  return projects.find((project) => project.id === id) || null
}

export async function getProjectBySlug(slug: string) {
  const projects = await readProjects()
  return projects.find((project) => project.slug === slug) || null
}

export async function readMessages(): Promise<AdminMessage[]> {
  const parsed = await readJsonFileWithBackup(messagesFile, storedMessagesSchema, [])
  const normalized = normalizeMessages(parsed.data)
  if (parsed.source !== 'primary' || JSON.stringify(parsed.data) !== JSON.stringify(normalized)) {
    await restorePrimaryJsonFile(messagesFile, normalized)
  }
  return normalized
}

export async function writeMessages(messages: AdminMessage[]) {
  await writeJsonFileAtomic(messagesFile, storedMessagesSchema.parse(messages))
}

export async function readSettings(): Promise<SiteSettings> {
  const parsed = await readJsonFileWithBackup(settingsFile, storedSettingsSchema, defaultSettings)
  const normalized = { ...defaultSettings, ...parsed.data }
  if (parsed.source !== 'primary' || JSON.stringify(parsed.data) !== JSON.stringify(normalized)) {
    await restorePrimaryJsonFile(settingsFile, normalized)
  }
  return normalized
}

export async function writeSettings(settings: SiteSettings) {
  await writeJsonFileAtomic(settingsFile, storedSettingsSchema.parse(settings))
}

export function makeId() {
  return crypto.randomUUID()
}

export function parseTags(value: string) {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

export function isManagedUploadUrl(fileUrl: string) {
  return fileUrl.startsWith('/uploads/')
}

export function isPublicAssetUrl(fileUrl: string) {
  return fileUrl.startsWith('/images/') || isManagedUploadUrl(fileUrl)
}

export function resolvePublicAssetPath(fileUrl: string) {
  if (!isPublicAssetUrl(fileUrl)) return null

  const relative = fileUrl.replace(/^\/+/, '')
  const resolved = path.resolve(publicDir, relative)
  if (!resolved.startsWith(publicDir)) return null
  return resolved
}

export async function assertPublicAssetExists(fileUrl: string) {
  const filePath = resolvePublicAssetPath(fileUrl)
  if (!filePath) return false

  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

export function resolveManagedUploadPath(fileUrl: string) {
  if (!isManagedUploadUrl(fileUrl)) return null

  const relative = fileUrl.replace(/^\/+/, '')
  const resolved = path.resolve(publicDir, relative)
  if (!resolved.startsWith(uploadsDir)) return null
  return resolved
}

export async function assertManagedUploadExists(fileUrl: string) {
  return assertPublicAssetExists(fileUrl)
}

export function collectManagedUploadUrls(projects: Project[]) {
  const references = new Set<string>()

  for (const project of projects) {
    if (isManagedUploadUrl(project.coverImage)) {
      references.add(project.coverImage)
    }

    for (const media of project.media) {
      if (isManagedUploadUrl(media.fileUrl)) {
        references.add(media.fileUrl)
      }

      if (media.thumbnailUrl && isManagedUploadUrl(media.thumbnailUrl)) {
        references.add(media.thumbnailUrl)
      }
    }
  }

  return references
}

export async function safeDeleteManagedUpload(fileUrl: string) {
  const filePath = resolveManagedUploadPath(fileUrl)
  if (!filePath) return

  try {
    await fs.unlink(filePath)
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException
    if (nodeError.code !== 'ENOENT') {
      throw error
    }
  }
}

export async function safeDeleteManagedUploadIfOrphan(fileUrl: string, projects: Project[]) {
  if (!isManagedUploadUrl(fileUrl)) return

  const references = collectManagedUploadUrls(projects)
  if (references.has(fileUrl)) return

  await safeDeleteManagedUpload(fileUrl)
}
