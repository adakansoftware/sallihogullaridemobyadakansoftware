import type { PoolClient } from 'pg'
import { withDbTransaction, runQuery } from '@/lib/db'
import { defaultSiteSettings } from '@/lib/file-defaults'
import type { MessageRepository, ProjectRepository, SettingsRepository } from '@/lib/content-repository'
import { storedMessagesSchema, storedProjectsSchema, storedSettingsSchema } from '@/lib/validation'
import type { AdminMessage, Project, SiteSettings } from '@/lib/store'

async function insertProjects(client: PoolClient, projects: Project[]) {
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
        JSON.stringify(project.tags),
        JSON.stringify(project.media),
        project.createdAt,
        project.updatedAt,
      ],
    )
  }
}

async function insertMessages(client: PoolClient, messages: AdminMessage[]) {
  for (const message of messages) {
    await client.query(
      `
        INSERT INTO messages (
          id, reference, name, phone, email, subject, message, is_read, created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::timestamptz)
      `,
      [message.id, message.reference, message.name, message.phone, message.email, message.subject, message.message, message.isRead, message.createdAt],
    )
  }
}

function mapProjectRow(row: Record<string, unknown>): Project {
  return storedProjectsSchema.element.parse({
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    description: row.description,
    location: row.location,
    category: row.category,
    coverImage: row.cover_image,
    cardImage: row.card_image ?? undefined,
    status: row.status,
    featured: row.featured,
    tags: row.tags,
    media: row.media,
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
  })
}

function mapMessageRow(row: Record<string, unknown>): AdminMessage {
  const parsed = storedMessagesSchema.element.parse({
    id: row.id,
    reference: row.reference,
    name: row.name,
    phone: row.phone,
    email: row.email,
    subject: row.subject,
    message: row.message,
    isRead: row.is_read,
    createdAt: new Date(String(row.created_at)).toISOString(),
  })

  return {
    ...parsed,
    reference: parsed.reference || String(row.id).slice(0, 8).toUpperCase(),
  }
}

function normalizeMessages(messages: AdminMessage[]) {
  return storedMessagesSchema.parse(messages).map((message) => ({
    ...message,
    reference: message.reference || message.id.slice(0, 8).toUpperCase(),
  }))
}

export class PostgresProjectRepository implements ProjectRepository {
  async list() {
    const result = await runQuery(
      `
        SELECT id, title, slug, summary, description, location, category, cover_image, card_image,
               status, featured, tags, media, created_at, updated_at
        FROM projects
        ORDER BY created_at DESC, id ASC
      `,
    )

    return result.rows.map((row) => mapProjectRow(row))
  }

  async save(projects: Project[]) {
    const normalized = storedProjectsSchema.parse(projects)

    await withDbTransaction(async (client) => {
      await client.query('DELETE FROM projects')
      await insertProjects(client, normalized)
    })
  }

  async findById(id: string) {
    const result = await runQuery(
      `
        SELECT id, title, slug, summary, description, location, category, cover_image, card_image,
               status, featured, tags, media, created_at, updated_at
        FROM projects
        WHERE id = $1
      `,
      [id],
    )

    return result.rows[0] ? mapProjectRow(result.rows[0]) : null
  }

  async findBySlug(slug: string) {
    const result = await runQuery(
      `
        SELECT id, title, slug, summary, description, location, category, cover_image, card_image,
               status, featured, tags, media, created_at, updated_at
        FROM projects
        WHERE slug = $1
      `,
      [slug],
    )

    return result.rows[0] ? mapProjectRow(result.rows[0]) : null
  }
}

export class PostgresMessageRepository implements MessageRepository {
  async list() {
    const result = await runQuery(
      `
        SELECT id, reference, name, phone, email, subject, message, is_read, created_at
        FROM messages
        ORDER BY created_at DESC, id ASC
      `,
    )

    return result.rows.map((row) => mapMessageRow(row))
  }

  async save(messages: AdminMessage[]) {
    const normalized = normalizeMessages(messages)

    await withDbTransaction(async (client) => {
      await client.query('DELETE FROM messages')
      await insertMessages(client, normalized)
    })
  }

  async mutate<T>(updater: (messages: AdminMessage[]) => Promise<{ messages: AdminMessage[]; result: T }> | { messages: AdminMessage[]; result: T }) {
    return withDbTransaction(async (client) => {
      const result = await client.query(
        `
          SELECT id, reference, name, phone, email, subject, message, is_read, created_at
          FROM messages
          ORDER BY created_at DESC, id ASC
          FOR UPDATE
        `,
      )

      const currentMessages = result.rows.map((row) => mapMessageRow(row))
      const next = await updater(currentMessages)
      const normalized = normalizeMessages(next.messages)

      await client.query('DELETE FROM messages')
      await insertMessages(client, normalized)
      return next.result
    })
  }
}

export class PostgresSettingsRepository implements SettingsRepository {
  async get() {
    const result = await runQuery(
      `
        SELECT company_name, company_short_name, contact_phone, contact_phone_secondary,
               contact_email, contact_email_secondary, address, service_area, working_hours,
               founded_year, instagram_url, whatsapp_url, hero_title, hero_description, quote_notice
        FROM site_settings
        WHERE id = 1
      `,
    )

    if (!result.rows[0]) {
      await this.save(defaultSiteSettings)
      return defaultSiteSettings
    }

    const row = result.rows[0]
    return storedSettingsSchema.parse({
      companyName: row.company_name,
      companyShortName: row.company_short_name,
      contactPhone: row.contact_phone,
      contactPhoneSecondary: row.contact_phone_secondary,
      contactEmail: row.contact_email,
      contactEmailSecondary: row.contact_email_secondary,
      address: row.address,
      serviceArea: row.service_area,
      workingHours: row.working_hours,
      foundedYear: row.founded_year,
      instagramUrl: row.instagram_url,
      whatsappUrl: row.whatsapp_url,
      heroTitle: row.hero_title,
      heroDescription: row.hero_description,
      quoteNotice: row.quote_notice,
    })
  }

  async save(settings: SiteSettings) {
    const normalized = storedSettingsSchema.parse(settings)

    await runQuery(
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
        normalized.companyName,
        normalized.companyShortName,
        normalized.contactPhone,
        normalized.contactPhoneSecondary,
        normalized.contactEmail,
        normalized.contactEmailSecondary,
        normalized.address,
        normalized.serviceArea,
        normalized.workingHours,
        normalized.foundedYear,
        normalized.instagramUrl,
        normalized.whatsappUrl,
        normalized.heroTitle,
        normalized.heroDescription,
        normalized.quoteNotice,
      ],
    )
  }
}
