## Production Migration Plan

This project currently runs with:

- `CONTENT_STORE=file`
- `RATE_LIMIT_STORE=memory`
- admin media managed through controlled `public/images` assets

That is intentional for simple local development, but it is not the final architecture for multi-instance or serverless production.

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

### Phase 2: Shared Content Storage

Replace file-backed content repositories with a shared database.

Recommended mapping:

- `projects` -> relational table or document collection
- `messages` -> relational table or document collection
- `settings` -> single-row settings table or keyed document

Suggested options:

- PostgreSQL for structured relational storage
- SQLite only if you still remain single-instance
- a managed document database only if the team prefers schema-light content operations

Implementation steps:

1. Keep `lib/content-repository.ts` as the boundary
2. Add database-backed repository implementations beside the file-backed ones
3. Switch repository selection by `CONTENT_STORE`
4. Migrate existing `data/projects.json`, `data/messages.json`, and `data/settings.json`
5. Leave file mode available for local development

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

- File storage is not safe for horizontally scaled production by itself
- Memory rate limiting is not shared across instances
- Upload API is intentionally disabled
- Health output warns about these defaults in production
