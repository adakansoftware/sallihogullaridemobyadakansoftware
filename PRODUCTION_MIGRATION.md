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
   - By default this imports projects, messages, site settings and fleet content (all idempotent upserts).
   - `npm run db:import:file-data -- --with-audit` additionally replaces `audit_log` with the contents of `data/audit.log`. This is destructive: existing database audit rows are deleted first. Use it only for the initial file-to-db migration.



Current Postgres storage shape:

- `projects` table with `tags` and `media` stored as `jsonb`
- `messages` table
- `site_settings` singleton table
- `fleet_content` singleton table (JSONB document, upserted)
- `audit_log` append-only table (queried by `/admin/activity`, pruned after 180 days)

Projects and messages are persisted with chunked multi-row `INSERT ... ON CONFLICT (id) DO UPDATE` upserts plus a same-transaction delete-diff, so rows are updated in place instead of full DELETE+reinsert. Known theoretical limitation: moving a slug from a deleted project to another project in the same save can collide with the `projects.slug` UNIQUE constraint mid-rewrite; the services never generate such swaps and the transaction stays atomic.

This keeps the current application model simple and avoids over-engineering for a low-volume site.

### Phase 3: Shared Rate Limiting

PostgreSQL deployments can use the built-in shared rate limiter now:

1. Set `CONTENT_STORE=postgres`
2. Set `RATE_LIMIT_STORE=postgres`
3. Run `npm run db:init` to create `rate_limit_buckets`

The database upsert is atomic, so login and contact limits are shared across application instances. Redis/KV remains a suitable future option for much higher request volumes.

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

- backup and restore procedure for database and media
- alerting on repeated auth failures and contact abuse

Already shipped:

- real E2E tests for admin login, contact submit, project CRUD, fleet API and rate-limit isolation
- structured application logs (`lib/logger.ts`): JSON lines on the console, error entries additionally appended to `data/error.log` (512KB cap). Unknown route exceptions are logged with a route context tag.
- contact e-mail resilience: failed notifications are queued in `data/email-outbox.json` and retried (max 5 attempts, 10-minute backoff, batches of 3) whenever a later contact submission fails delivery

### Resend environment variables

- `RESEND_API_KEY` (optional): Resend API key, minimum 20 characters. Without it, production contact submissions still return 201 but the e-mail notification fails and is queued in the outbox; development logs a mock instead.
- `RESEND_FROM` (optional): verified sender e-mail address. A malformed value now fails boot (env validation) instead of silently sending from a wrong address.
- Behavior change: a Resend response with `result.error` set is now treated as a failed delivery (it was previously ignored). After deploying, verify the sending domain is verified in Resend so notifications actually go out.

### Current Honest Limitations

- File mode is not safe for horizontally scaled production by itself
- Memory rate limiting is not shared across instances; use `RATE_LIMIT_STORE=postgres` with PostgreSQL deployments
- Upload API is intentionally disabled
- Health output warns when production still uses file mode or memory-only rate limiting
- The e-mail outbox (`data/email-outbox.json`) is file-based even in Postgres mode; it is retried opportunistically on later contact failures, not on a timer
