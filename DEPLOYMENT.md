# Deployment Notes

## Hosting Assumptions

- File mode: one writable application instance and persistent storage for `data/`
- Postgres mode: reachable PostgreSQL database and no writable disk requirement for content
- Environment variables managed outside the repository

## Required Runtime Expectations

- Node.js version compatible with Next.js 16
- If `CONTENT_STORE=file`, read/write access to `data/`
- If `CONTENT_STORE=postgres`, a valid `DATABASE_URL`
- Stable origin configuration through `APP_ORIGIN` and `NEXT_PUBLIC_SITE_URL`
- If you use hashed admin credentials, provide `ADMIN_PASSWORD_HASH`; otherwise provide `ADMIN_PASSWORD`
- The current defaults are `CONTENT_STORE=file` and `RATE_LIMIT_STORE=memory`
- For multi-instance PostgreSQL deployments, set both `CONTENT_STORE=postgres` and `RATE_LIMIT_STORE=postgres`
- `RESEND_API_KEY` (optional, min 20 chars): enables contact e-mail notifications. Without it, production still accepts submissions (201) but the notification is queued for retry in `data/email-outbox.json`
- `RESEND_FROM` (optional): must be a valid e-mail address if set; a malformed value stops boot by design

## Recommended Release Flow

1. Update environment variables.
2. If using file mode, restore or attach persisted `data/` and any curated `public/images/` assets.
3. If using Postgres mode, run `npm run db:init` once against the target database. Run it on every existing deployment after upgrading to the version that added `fleet_content` and `audit_log`; it is idempotent.
4. If migrating existing JSON content, run `npm run db:import:file-data` before switching production traffic. It imports projects, messages, settings and fleet content idempotently. Add `-- --with-audit` only if you also want to replace the database audit log with `data/audit.log` (destructive: existing `audit_log` rows are deleted).
5. For shared rate limiting, set `RATE_LIMIT_STORE=postgres` after `npm run db:init` has created `rate_limit_buckets`.
6. Run `npm run test`.
7. Run `npm run lint` and `npm run typecheck`.
8. Run `npm run build`.
9. Deploy the application.
10. Verify `/api/health`.
11. Verify admin login and one sample content update.
12. Confirm contact form submission and one admin-side project/media update.
13. If `RESEND_API_KEY` is set, confirm the sending domain is verified in Resend: a Resend-side `result.error` is now treated as a failed delivery and ends up in the retry outbox instead of being silently ignored.

## Backup Guidance

- Back up `data/` together with any custom files kept under `public/images/` when using file mode.
- Back up the PostgreSQL database together with `public/images/` when using Postgres mode.
- `data/error.log` (structured error log, 512KB cap) and `data/email-outbox.json` (pending contact mail retries) live under `data/` in both modes; include them in file-mode backups and check them during incident triage.
- Keep recovery copies of the generated `.bak` JSON files.
- Before major content migrations, take a fresh snapshot.

## Operational Warnings

- File-based persistence is not ideal for horizontal scaling.
- The current rate limiter is in-memory only, so limits reset on restart and are not shared across instances.
- Concurrent edits are hardened, but a shared database is still the correct future upgrade for larger teams.
- The upload API is intentionally disabled in this build; production image management currently relies on controlled `public/images` assets or a future object-storage integration.
- If the live domain changes, update both `APP_ORIGIN` and `NEXT_PUBLIC_SITE_URL` together.
- See [PRODUCTION_MIGRATION.md](C:\Users\adaka\Desktop\sali_admin_full\PRODUCTION_MIGRATION.md) before moving to multi-instance or serverless production.
