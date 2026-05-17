## Production Storage Modes

This project now supports two content storage modes:

- `CONTENT_STORE=file`
- `CONTENT_STORE=postgres`

Media remains intentionally simple in both cases:

- admin media managed through controlled `public/images` assets
- upload API disabled by design

### Phase 1: Safe Single-Instance Production

Use this setup if you want the current codebase online quickly without changing behavior:

- Run a single Node.js instance or a single container
- Mount a persistent writable volume for the `data/` directory
- Keep `public/images` managed through repository-controlled assets
- Keep `RATE_LIMIT_STORE=memory`

This is acceptable when:

- there is only one running app instance
- restarts are infrequent
- admin edits are low volume

### Postgres Mode

Use this mode when:

- you want to deploy on Vercel or another stateless platform
- you want persistent admin/contact data without a writable local disk

Implementation already exists in the repo. Setup steps:

1. Set `CONTENT_STORE=postgres`
2. Set `DATABASE_URL`
3. Run `npm run db:init`
4. If needed, run `npm run db:import:file-data`

Current Postgres storage shape:

- `projects` table with `tags` and `media` stored as `jsonb`
- `messages` table
- `site_settings` singleton table

This keeps the current application model simple and avoids over-engineering for a low-volume site.

### Phase 3: Shared Rate Limiting

Replace the in-memory rate limit store with a shared backend.

Recommended options:

- Upstash Redis
- Redis Cloud
- another low-latency shared KV or Redis-compatible service

Implementation steps:

1. Keep `lib/rate-limit-store.ts` as the boundary
2. Add a Redis-backed store implementation
3. Switch store selection by `RATE_LIMIT_STORE`
4. Preserve existing limit keys and windows to avoid behavior drift

### Phase 4: Managed Media Uploads

If admin-managed uploads are needed later, do not re-open arbitrary local disk uploads without guardrails.

Recommended direction:

- object storage such as S3, Cloudflare R2, or Vercel Blob
- signed upload flow
- strict MIME allowlist
- server-side size enforcement
- image-only transformations if required

Keep the current `public/images` workflow if media is curated manually and low volume.

### Phase 5: Operational Hardening

Before scaling out, also add:

- real E2E tests for admin login, contact submit, project CRUD
- backup and restore procedure for database and media
- structured application logs
- alerting on repeated auth failures and contact abuse

### Current Honest Limitations

- File mode is not safe for horizontally scaled production by itself
- Memory rate limiting is not shared across instances
- Upload API is intentionally disabled
- Health output warns when production still uses file mode or memory-only rate limiting
