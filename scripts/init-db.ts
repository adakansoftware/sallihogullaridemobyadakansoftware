import { createPool, loadLocalEnv, withTransaction } from './helpers.ts'

async function main() {
  await loadLocalEnv()
  const pool = createPool()

  try {
    await withTransaction(pool, async (client) => {
      await client.query(`
        CREATE TABLE IF NOT EXISTS projects (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          summary VARCHAR(280) NOT NULL DEFAULT '',
          description TEXT NOT NULL DEFAULT '',
          location TEXT NOT NULL DEFAULT '',
          category TEXT NOT NULL DEFAULT '',
          cover_image TEXT NOT NULL DEFAULT '',
          card_image TEXT,
          status TEXT NOT NULL,
          featured BOOLEAN NOT NULL DEFAULT FALSE,
          tags JSONB NOT NULL DEFAULT '[]'::jsonb,
          media JSONB NOT NULL DEFAULT '[]'::jsonb,
          created_at TIMESTAMPTZ NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL
        )
      `)

      await client.query(`
        CREATE TABLE IF NOT EXISTS messages (
          id TEXT PRIMARY KEY,
          reference TEXT NOT NULL,
          name TEXT NOT NULL,
          phone TEXT NOT NULL DEFAULT '',
          email TEXT NOT NULL DEFAULT '',
          subject TEXT NOT NULL,
          message TEXT NOT NULL,
          is_read BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL
        )
      `)

      await client.query(`
        CREATE TABLE IF NOT EXISTS site_settings (
          id INTEGER PRIMARY KEY,
          company_name TEXT NOT NULL,
          company_short_name TEXT NOT NULL,
          contact_phone TEXT NOT NULL,
          contact_phone_secondary TEXT NOT NULL,
          contact_email TEXT NOT NULL,
          contact_email_secondary TEXT NOT NULL,
          address TEXT NOT NULL,
          service_area TEXT NOT NULL,
          working_hours TEXT NOT NULL,
          founded_year TEXT NOT NULL,
          instagram_url TEXT NOT NULL,
          whatsapp_url TEXT NOT NULL,
          hero_title TEXT NOT NULL,
          hero_description TEXT NOT NULL,
          quote_notice TEXT NOT NULL
        )
      `)

      await client.query(`CREATE INDEX IF NOT EXISTS projects_status_idx ON projects(status)`)
      await client.query(`CREATE INDEX IF NOT EXISTS projects_featured_idx ON projects(featured)`)
      await client.query(`CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at DESC)`)
      await client.query(`CREATE INDEX IF NOT EXISTS messages_is_read_idx ON messages(is_read)`)
    })

    console.log('PostgreSQL schema is ready.')
  } finally {
    await pool.end()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
