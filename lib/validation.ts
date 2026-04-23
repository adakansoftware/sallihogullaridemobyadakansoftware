import { z } from 'zod'

const MAX_PROJECT_TAGS = 12

function normalizeString(value: string) {
  return value.replace(/[\u0000-\u001F\u007F]+/g, ' ').replace(/\s+/g, ' ').trim()
}

function safeText(min: number, max: number, requiredMessage: string) {
  return z
    .string()
    .trim()
    .min(min, requiredMessage)
    .max(max, `Metin en fazla ${max} karakter olabilir.`)
    .refine((value) => !/[<>]/.test(value), 'Güvenli olmayan karakterler kullanılamaz.')
    .transform(normalizeString)
}

function isSafeAssetUrl(value: string) {
  if (!value) return true
  if (value.startsWith('/')) {
    return value.startsWith('/images/') || value.startsWith('/uploads/')
  }

  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

function isSafeExternalUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:'
  } catch {
    return false
  }
}

export const projectStatusSchema = z.enum(['Taslak', 'Yayında'])
export const resourceTypeSchema = z.enum(['image', 'video'])

export const loginSchema = z.object({
  email: z.string().trim().email('Geçerli bir e-posta girin.').transform((value) => value.toLowerCase()),
  password: z.string().min(8, 'Şifre en az 8 karakter olmalıdır.').max(128, 'Şifre çok uzun.'),
})

export const messageInputSchema = z.object({
  name: safeText(2, 80, 'Ad soyad zorunludur.'),
  phone: z
    .string()
    .trim()
    .max(24, 'Telefon çok uzun.')
    .regex(/^[0-9+\-\s()]*$/, 'Telefon formatı geçersiz.')
    .or(z.literal(''))
    .transform((value) => (typeof value === 'string' ? normalizeString(value) : value)),
  email: z
    .string()
    .trim()
    .email('Geçerli bir e-posta girin.')
    .or(z.literal(''))
    .transform((value) => value.trim().toLowerCase()),
  subject: safeText(2, 120, 'Konu zorunludur.'),
  message: safeText(10, 2000, 'Mesaj en az 10 karakter olmalıdır.'),
})

export const tagsSchema = z.union([z.array(z.string()), z.string()]).transform((value) => {
  const items = Array.isArray(value) ? value : value.split(',')
  return [...new Set(items.map((item) => normalizeString(item)).filter(Boolean))].slice(0, MAX_PROJECT_TAGS)
})

export const projectInputSchema = z.object({
  title: safeText(3, 120, 'Proje başlığı zorunludur.'),
  slug: z.string().trim().max(140, 'Slug çok uzun.').transform(normalizeString).optional().default(''),
  summary: z.string().trim().max(280, 'Kısa özet en fazla 280 karakter olabilir.').transform(normalizeString).default(''),
  description: z.string().trim().max(4000, 'Detaylı açıklama çok uzun.').transform(normalizeString).default(''),
  location: z.string().trim().max(120, 'Lokasyon çok uzun.').transform(normalizeString).default(''),
  category: z.string().trim().max(80, 'Kategori çok uzun.').transform(normalizeString).default(''),
  coverImage: z.string().trim().max(500, 'Kapak görsel adresi çok uzun.').refine(isSafeAssetUrl, 'Kapak görsel adresi güvenli değil.').default(''),
  status: projectStatusSchema.default('Yayında'),
  featured: z.boolean().default(false),
  tags: tagsSchema.default([]),
})

export const settingsSchema = z.object({
  companyName: safeText(3, 120, 'Firma adı zorunludur.'),
  companyShortName: safeText(2, 40, 'Kısa marka adı zorunludur.'),
  contactPhone: z.string().trim().min(8, 'Telefon zorunludur.').max(24, 'Telefon çok uzun.').transform(normalizeString),
  contactPhoneSecondary: z.string().trim().max(24, 'İkincil telefon çok uzun.').transform(normalizeString),
  contactEmail: z.string().trim().email('Geçerli bir e-posta girin.'),
  contactEmailSecondary: z.string().trim().email('Geçerli bir ikinci e-posta girin.').or(z.literal('')),
  address: safeText(5, 180, 'Adres zorunludur.'),
  serviceArea: safeText(3, 120, 'Hizmet bölgesi zorunludur.'),
  workingHours: safeText(3, 120, 'Çalışma saatleri zorunludur.'),
  foundedYear: z.string().trim().regex(/^\d{4}$/, 'Kuruluş yılı 4 haneli olmalıdır.').transform(normalizeString),
  instagramUrl: z.string().trim().refine(isSafeExternalUrl, 'Geçerli bir HTTPS Instagram bağlantısı girin.'),
  whatsappUrl: z.string().trim().refine(isSafeExternalUrl, 'Geçerli bir HTTPS WhatsApp bağlantısı girin.'),
  heroTitle: safeText(8, 160, 'Hero başlığı zorunludur.'),
  heroDescription: safeText(12, 320, 'Hero açıklaması zorunludur.'),
  quoteNotice: safeText(8, 220, 'Teklif notu zorunludur.'),
})

export const messageStateSchema = z.object({
  isRead: z.boolean(),
})

export const mediaInputSchema = z.object({
  title: z.string().trim().max(120, 'Medya başlığı çok uzun.').transform(normalizeString).default(''),
  fileUrl: z.string().trim().min(1, 'Medya dosyası zorunludur.').max(500, 'Medya adresi çok uzun.').refine((value) => value.startsWith('/uploads/'), 'Yalnızca yönetilen yüklemeler kabul edilir.'),
  fileType: z.string().trim().min(3, 'Dosya türü zorunludur.').max(80, 'Dosya türü çok uzun.').transform(normalizeString),
  resourceType: resourceTypeSchema,
  thumbnailUrl: z.string().trim().max(500, 'Önizleme adresi çok uzun.').refine((value) => !value || value.startsWith('/uploads/'), 'Önizleme adresi güvenli değil.').default(''),
  isCover: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0, 'Sıralama negatif olamaz.').max(9999, 'Sıralama çok büyük.').default(0),
})

export const mediaUpdateSchema = z.object({
  title: z.string().trim().max(120, 'Medya başlığı çok uzun.').transform(normalizeString).optional(),
  sortOrder: z.coerce.number().int().min(0, 'Sıralama negatif olamaz.').max(9999, 'Sıralama çok büyük.').optional(),
  isCover: z.boolean().optional(),
})

export const storedProjectMediaSchema = z.object({
  id: z.string().min(1),
  title: z.string().max(120).catch(''),
  fileUrl: z.string().min(1),
  fileType: z.string().min(1),
  resourceType: resourceTypeSchema,
  thumbnailUrl: z.string().optional(),
  isCover: z.boolean(),
  sortOrder: z.coerce.number().int().min(0).max(9999),
  createdAt: z.string().min(1),
})

export const storedProjectSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1),
  summary: z.string().catch(''),
  description: z.string().catch(''),
  location: z.string().catch(''),
  category: z.string().catch(''),
  coverImage: z.string().catch(''),
  status: projectStatusSchema.catch('Taslak'),
  featured: z.boolean().catch(false),
  tags: z.array(z.string()).catch([]),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
  media: z.array(storedProjectMediaSchema).catch([]),
})

export const storedProjectsSchema = z.array(storedProjectSchema)

export const storedAdminMessageSchema = z.object({
  id: z.string().min(1),
  reference: z.string().min(1).optional(),
  name: z.string().min(1),
  phone: z.string().catch(''),
  email: z.string().catch(''),
  subject: z.string().catch(''),
  message: z.string().catch(''),
  isRead: z.boolean().catch(false),
  createdAt: z.string().min(1),
})

export const storedMessagesSchema = z.array(storedAdminMessageSchema)
export const storedSettingsSchema = settingsSchema
