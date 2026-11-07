// Imports file-mode runtime data into PostgreSQL.
//
// Default run: projects, messages, site settings and fleet content are
// upserted (idempotent). The audit log is NOT touched.
//
// `--with-audit`: DESTRUCTIVE for audit_log — the table is emptied and
// replaced with the contents of data/audit.log. Existing database audit
// entries are lost. Use only for the initial file-to-db migration.

import { promises as fs } from 'node:fs'
import path from 'node:path'
import type { Pool } from 'pg'
import { createPool, loadLocalEnv, readJsonFile, withTransaction } from './helpers.ts'

type Project = {
  id: string
  title: string
  slug: string
  summary: string
  description: string
  location: string
  category: string
  coverImage: string
  cardImage?: string
  status: string
  featured: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
  media: unknown[]
}

type Message = {
  id: string
  reference?: string
  name: string
  phone: string
  email: string
  subject: string
  message: string
  isRead: boolean
  createdAt: string
}

type SiteSettings = {
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

function ensureReference(message: Message) {
  return message.reference || message.id.slice(0, 8).toUpperCase()
}

type FleetContent = {
  stats: unknown[]
  items: unknown[]
}

type AuditEntry = {
  at: string
  action: string
  status: 'success' | 'failure' | 'rejected'
  ip?: string
  target?: string
  detail?: string
}

function isAuditEntry(value: unknown): value is AuditEntry {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.at === 'string' &&
    typeof candidate.action === 'string' &&
    (candidate.status === 'success' || candidate.status === 'failure' || candidate.status === 'rejected')
  )
}

async function importAuditLog(pool: Pool) {
  const auditFile = path.join(process.cwd(), 'data', 'audit.log')
  const raw = await fs.readFile(auditFile, 'utf8').catch(() => '')

  const entries = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line)
      } catch {
        return null
      }
    })
    .filter(isAuditEntry)

  if (entries.length === 0) {
    console.log('No audit entries found in data/audit.log; audit_log left untouched.')
    return
  }

  await withTransaction(pool, async (client) => {
    await client.query('DELETE FROM audit_log')

    for (let offset = 0; offset < entries.length; offset += 200) {
      const chunk = entries.slice(offset, offset + 200)
      const values: unknown[] = []
      const rows = chunk.map((entry, index) => {
        const base = index * 6
        values.push(entry.at, entry.action, entry.status, entry.ip || null, entry.target || null, entry.detail || null)
        return `($${base + 1}::timestamptz, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6})`
      })

      await client.query(
        `INSERT INTO audit_log (at, action, status, ip, target, detail) VALUES ${rows.join(', ')}`,
        values,
      )
    }
  })

  console.log(`Imported ${entries.length} audit entries into audit_log (--with-audit; previous rows were deleted).`)
}

async function main() {
  await loadLocalEnv()
  const pool = createPool()

  try {
    const [projects, messages, settings, fleet] = await Promise.all([
      readJsonFile<Project[]>('data/projects.json'),
      readJsonFile<Message[]>('data/messages.json'),
      readJsonFile<SiteSettings>('data/settings.json'),
      readJsonFile<FleetContent>('data/fleet.json'),
    ])

    await withTransaction(pool, async (client) => {
      await client.query('DELETE FROM projects')
      await client.query('DELETE FROM messages')

      for (const project of projects) {
        await client.query(
          `
            INSERT INTO projects (
              id, title, slug, summary, description, location, category, cover_image, card_image,
              status, featured, tags, media, created_at, updated_at
            )
            VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9,
              $10, $11, $12::jsonb, $13::jsonb, $14::timestamptz, $15::timestamptz
            )
          `,
          [
            project.id,
            project.title,
            project.slug,
            project.summary,
            project.description,
            project.location,
            project.category,
            project.coverImage,
            project.cardImage || null,
            project.status,
            project.featured,
            JSON.stringify(project.tags || []),
            JSON.stringify(project.media || []),
            project.createdAt,
            project.updatedAt,
          ],
        )
      }

      for (const message of messages) {
        await client.query(
          `
            INSERT INTO messages (
              id, reference, name, phone, email, subject, message, is_read, created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::timestamptz)
          `,
          [message.id, ensureReference(message), message.name, message.phone || '', message.email || '', message.subject, message.message, message.isRead, message.createdAt],
        )
      }

      await client.query(
        `
          INSERT INTO site_settings (
            id, company_name, company_short_name, contact_phone, contact_phone_secondary,
            contact_email, contact_email_secondary, address, service_area, working_hours,
            founded_year, instagram_url, whatsapp_url, hero_title, hero_description, quote_notice
          )
          VALUES (
            1, $1, $2, $3, $4,
            $5, $6, $7, $8, $9,
            $10, $11, $12, $13, $14, $15
          )
          ON CONFLICT (id) DO UPDATE SET
            company_name = EXCLUDED.company_name,
            company_short_name = EXCLUDED.company_short_name,
            contact_phone = EXCLUDED.contact_phone,
            contact_phone_secondary = EXCLUDED.contact_phone_secondary,
            contact_email = EXCLUDED.contact_email,
            contact_email_secondary = EXCLUDED.contact_email_secondary,
            address = EXCLUDED.address,
            service_area = EXCLUDED.service_area,
            working_hours = EXCLUDED.working_hours,
            founded_year = EXCLUDED.founded_year,
            instagram_url = EXCLUDED.instagram_url,
            whatsapp_url = EXCLUDED.whatsapp_url,
            hero_title = EXCLUDED.hero_title,
            hero_description = EXCLUDED.hero_description,
            quote_notice = EXCLUDED.quote_notice
        `,
        [
          settings.companyName,
          settings.companyShortName,
          settings.contactPhone,
          settings.contactPhoneSecondary,
          settings.contactEmail,
          settings.contactEmailSecondary,
          settings.address,
          settings.serviceArea,
          settings.workingHours,
          settings.foundedYear,
          settings.instagramUrl,
          settings.whatsappUrl,
          settings.heroTitle,
          settings.heroDescription,
          settings.quoteNotice,
        ],
      )

      await client.query(
        `
          INSERT INTO fleet_content (id, content, updated_at)
          VALUES (1, $1::jsonb, NOW())
          ON CONFLICT (id) DO UPDATE SET
            content = EXCLUDED.content,
            updated_at = NOW()
        `,
        [JSON.stringify(fleet)],
      )
    })

    if (process.argv.includes('--with-audit')) {
      await importAuditLog(pool)
    }

    console.log(`Imported ${projects.length} projects, ${messages.length} messages, site settings, and fleet content into PostgreSQL.`)
  } finally {
    await pool.end()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
