import { z } from 'zod'
import { getComparableOrigin } from '@/lib/origin'

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    ADMIN_EMAIL: z.string().trim().email('ADMIN_EMAIL geçerli bir e-posta olmalıdır.'),
    ADMIN_PASSWORD: z.string().min(12, 'ADMIN_PASSWORD en az 12 karakter olmalıdır.'),
    ADMIN_SESSION_SECRET: z.string().min(32, 'ADMIN_SESSION_SECRET en az 32 karakter olmalıdır.'),
    APP_ORIGIN: z.string().trim().url('APP_ORIGIN geçerli bir URL olmalıdır.').optional(),
    NEXT_PUBLIC_SITE_URL: z.string().trim().url('NEXT_PUBLIC_SITE_URL geçerli bir URL olmalıdır.').optional(),
    GOOGLE_SITE_VERIFICATION: z.string().trim().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.APP_ORIGIN && value.NEXT_PUBLIC_SITE_URL) {
      const appOrigin = getComparableOrigin(value.APP_ORIGIN)
      const publicOrigin = getComparableOrigin(value.NEXT_PUBLIC_SITE_URL)

      if (appOrigin && publicOrigin && appOrigin !== publicOrigin) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "APP_ORIGIN ve NEXT_PUBLIC_SITE_URL aynı origin'e işaret etmelidir.",
          path: ['NEXT_PUBLIC_SITE_URL'],
        })
      }
    }
  })

const parsedEnv = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET || process.env.AUTH_SECRET,
  APP_ORIGIN: process.env.APP_ORIGIN,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  GOOGLE_SITE_VERIFICATION: process.env.GOOGLE_SITE_VERIFICATION,
})

if (!parsedEnv.success) {
  const message = parsedEnv.error.issues.map((issue) => issue.message).join(' ')
  throw new Error(`Ortam değişkenleri güvenli değil: ${message}`)
}

export const env = parsedEnv.data
