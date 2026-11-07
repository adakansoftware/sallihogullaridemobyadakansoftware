import type { PoolClient } from 'pg'
import { withDbTransaction, runQuery } from './db.ts'
import { defaultSiteSettings } from './file-defaults.ts'
import type { FleetRepository, MessageRepository, ProjectRepository, SettingsRepository, FleetContent } from './content-repository.ts'
import { fleetContentSchema, storedMessagesSchema, storedProjectsSchema, storedSettingsSchema } from './validation.ts'
import type { AdminMessage, Project, SiteSettings } from './store.ts'

const UPSERT_CHUNK_SIZE = 50

function buildProjectValues(project: Project, values: unknown[], base: number) {
  values.push(
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
  )

  return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8}, $${base + 9}, $${base + 10}, $${base + 11}, $${base + 12}::jsonb, $${base + 13}::jsonb, $${base + 14}::timestamptz, $${base + 15}::timestamptz)`
}

// Chunked multi-row upsert. Chunks keep the generated SQL and parameter count
// bounded for large project lists.
async function upsertProjects(client: PoolClient, projects: Project[]) {
  for (let offset = 0; offset < projects.length; offset += UPSERT_CHUNK_SIZE) {
    const chunk = projects.slice(offset, offset + UPSERT_CHUNK_SIZE)
    const values: unknown[] = []
    const rows = chunk.map((project, index) => buildProjectValues(project, values, index * 15))

    await client.query(
      `
        INSERT INTO projects (
          id, title, slug, summary, description, location, category, cover_image, card_image,
          status, featured, tags, media, created_at, updated_at
        )
        VALUES ${rows.join(', ')}
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          slug = EXCLUDED.slug,
          summary = EXCLUDED.summary,
          description = EXCLUDED.description,
          location = EXCLUDED.location,
          category = EXCLUDED.category,
          cover_image = EXCLUDED.cover_image,
          card_image = EXCLUDED.card_image,
          status = EXCLUDED.status,
          featured = EXCLUDED.featured,
          tags = EXCLUDED.tags,
          media = EXCLUDED.media,
          created_at = EXCLUDED.created_at,
          updated_at = EXCLUDED.updated_at
      `,
      values,
    )
  }
}

function buildMessageValues(message: AdminMessage, values: unknown[], base: number) {
  values.push(
    message.id,
    message.reference,
    message.name,
    message.phone,
    message.email,
    message.subject,
    message.message,
    message.isRead,
    message.createdAt,
  )

  return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8}, $${base + 9}::timestamptz)`
}

async function upsertMessages(client: PoolClient, messages: AdminMessage[]) {
  for (let offset = 0; offset < messages.length; offset += UPSERT_CHUNK_SIZE) {
    const chunk = messages.slice(offset, offset + UPSERT_CHUNK_SIZE)
    const values: unknown[] = []
    const rows = chunk.map((message, index) => buildMessageValues(message, values, index * 9))

    await client.query(
      `
        INSERT INTO messages (
          id, reference, name, phone, email, subject, message, is_read, created_at
        )
        VALUES ${rows.join(', ')}
        ON CONFLICT (id) DO UPDATE SET
          reference = EXCLUDED.reference,
          name = EXCLUDED.name,
          phone = EXCLUDED.phone,
          email = EXCLUDED.email,
          subject = EXCLUDED.subject,
          message = EXCLUDED.message,
          is_read = EXCLUDED.is_read,
          created_at = EXCLUDED.created_at
      `,
      values,
    )
  }
}

// Removes rows whose id is no longer present in the normalized next state.
// Runs before the upsert inside the same transaction, so the whole save is
// atomic. Known theoretical limitation: a slug moved from a deleted row to a
// different row can still collide with the UNIQUE constraint mid-rewrite;
// services never generate slug swaps, so this is accepted and documented.
async function deleteMissingRows(client: PoolClient, table: 'projects' | 'messages', keepIds: string[]) {
  if (keepIds.length === 0) {
    await client.query(`DELETE FROM ${table}`)
    return
  }

  await client.query(`DELETE FROM ${table} WHERE id <> ALL($1::text[])`, [keepIds])
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

const defaultFleetContent: FleetContent = { stats: [], items: [] }

export class PostgresFleetRepository implements FleetRepository {
  async get() {
    const result = await runQuery('SELECT content FROM fleet_content WHERE id = 1')

    if (!result.rows[0]) {
      return defaultFleetContent
    }

    return fleetContentSchema.parse(result.rows[0].content)
  }

  async save(content: FleetContent) {
    const normalized = fleetContentSchema.parse(content)

    await runQuery(
      `
        INSERT INTO fleet_content (id, content, updated_at)
        VALUES (1, $1::jsonb, NOW())
        ON CONFLICT (id) DO UPDATE SET
          content = EXCLUDED.content,
          updated_at = NOW()
      `,
      [JSON.stringify(normalized)],
    )
  }
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
      await deleteMissingRows(client, 'projects', normalized.map((project) => project.id))
      await upsertProjects(client, normalized)
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

  async mutate<T>(updater: (projects: Project[]) => Promise<{ projects: Project[]; result: T }> | { projects: Project[]; result: T }) {
    return withDbTransaction(async (client) => {
      const result = await client.query(
        `
          SELECT id, title, slug, summary, description, location, category, cover_image, card_image,
                 status, featured, tags, media, created_at, updated_at
          FROM projects
          ORDER BY created_at DESC, id ASC
          FOR UPDATE
        `,
      )

      const currentProjects = result.rows.map((row) => mapProjectRow(row))
      const next = await updater(currentProjects)
      const normalized = storedProjectsSchema.parse(next.projects)

      await deleteMissingRows(client, 'projects', normalized.map((project) => project.id))
      await upsertProjects(client, normalized)
      return next.result
    })
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
      await deleteMissingRows(client, 'messages', normalized.map((message) => message.id))
      await upsertMessages(client, normalized)
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

      await deleteMissingRows(client, 'messages', normalized.map((message) => message.id))
      await upsertMessages(client, normalized)
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

  async mutate<T>(updater: (settings: SiteSettings) => Promise<{ settings: SiteSettings; result: T }> | { settings: SiteSettings; result: T }) {
    return withDbTransaction(async (client) => {
      const result = await client.query(
        `
          SELECT company_name, company_short_name, contact_phone, contact_phone_secondary,
                 contact_email, contact_email_secondary, address, service_area, working_hours,
                 founded_year, instagram_url, whatsapp_url, hero_title, hero_description, quote_notice
          FROM site_settings
          WHERE id = 1
          FOR UPDATE
        `,
      )

      const currentSettings = result.rows[0]
        ? storedSettingsSchema.parse({
            companyName: result.rows[0].company_name,
            companyShortName: result.rows[0].company_short_name,
            contactPhone: result.rows[0].contact_phone,
            contactPhoneSecondary: result.rows[0].contact_phone_secondary,
            contactEmail: result.rows[0].contact_email,
            contactEmailSecondary: result.rows[0].contact_email_secondary,
            address: result.rows[0].address,
            serviceArea: result.rows[0].service_area,
            workingHours: result.rows[0].working_hours,
            foundedYear: result.rows[0].founded_year,
            instagramUrl: result.rows[0].instagram_url,
            whatsappUrl: result.rows[0].whatsapp_url,
            heroTitle: result.rows[0].hero_title,
            heroDescription: result.rows[0].hero_description,
            quoteNotice: result.rows[0].quote_notice,
          })
        : defaultSiteSettings

      const next = await updater(currentSettings)
      const normalized = storedSettingsSchema.parse(next.settings)

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

      return next.result
    })
  }
}
