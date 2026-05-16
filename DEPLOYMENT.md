# Deployment Notes

## Hosting Assumptions

- One writable application instance
- Persistent storage for `data/`
- Environment variables managed outside the repository

## Required Runtime Expectations

- Node.js version compatible with Next.js 16
- Read/write access to `data/`
- Stable origin configuration through `APP_ORIGIN` and `NEXT_PUBLIC_SITE_URL`
- If you use hashed admin credentials, provide `ADMIN_PASSWORD_HASH`; otherwise provide `ADMIN_PASSWORD`
- The current defaults are `CONTENT_STORE=file` and `RATE_LIMIT_STORE=memory`

## Recommended Release Flow

1. Update environment variables.
2. Restore or attach persisted `data/` and any curated `public/images/` assets.
3. Run `npm run test`.
4. Run `npm run lint`.
5. Run `npm run build`.
6. Deploy the application.
7. Verify `/api/health`.
8. Verify admin login and one sample content update.
9. Confirm contact form submission and one admin-side project/media update.

## Backup Guidance

- Back up `data/` together with any custom files kept under `public/images/`.
- Keep recovery copies of the generated `.bak` JSON files.
- Before major content migrations, take a fresh snapshot.

## Operational Warnings

- File-based persistence is not ideal for horizontal scaling.
- The current rate limiter is in-memory only, so limits reset on restart and are not shared across instances.
- Concurrent edits are hardened, but a shared database is still the correct future upgrade for larger teams.
- The upload API is intentionally disabled in this build; production image management currently relies on controlled `public/images` assets or a future object-storage integration.
- If the live domain changes, update both `APP_ORIGIN` and `NEXT_PUBLIC_SITE_URL` together.
- See [PRODUCTION_MIGRATION.md](C:\Users\adaka\Desktop\sali_admin_full\PRODUCTION_MIGRATION.md) before moving to multi-instance or serverless production.
