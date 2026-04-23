import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  ADMIN_EMAIL: z.string().trim().email('ADMIN_EMAIL geçerli bir e-posta olmalıdır.'),
  ADMIN_PASSWORD: z.string().min(12, 'ADMIN_PASSWORD en az 12 karakter olmalıdır.'),
  ADMIN_SESSION_SECRET: z.string().min(32, 'ADMIN_SESSION_SECRET en az 32 karakter olmalıdır.'),
  APP_ORIGIN: z.string().trim().url('APP_ORIGIN geçerli bir URL olmalıdır.').optional(),
  NEXT_PUBLIC_SITE_URL: z.string().trim().url('NEXT_PUBLIC_SITE_URL geçerli bir URL olmalıdır.').optional(),
})

const parsedEnv = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET || process.env.AUTH_SECRET,
  APP_ORIGIN: process.env.APP_ORIGIN,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
})

if (!parsedEnv.success) {
  const message = parsedEnv.error.issues.map((issue) => issue.message).join(' ')
  throw new Error(`Ortam değişkenleri güvenli değil: ${message}`)
}

export const env = parsedEnv.data

