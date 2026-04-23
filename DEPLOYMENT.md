# Deployment Notes

## Hosting Assumptions

- One writable application instance
- Persistent storage for `data/`
- Persistent storage for `public/uploads/`
- Environment variables managed outside the repository

## Required Runtime Expectations

- Node.js version compatible with Next.js 16
- Read/write access to `data/`
- Read/write access to `public/uploads/` or permission to create it on first upload
- Stable origin configuration through `APP_ORIGIN` and `NEXT_PUBLIC_SITE_URL`

## Recommended Release Flow

1. Update environment variables.
2. Restore or attach persisted `data/` and `public/uploads/`.
3. Run `npm run test`.
4. Run `npm run lint`.
5. Run `npm run build`.
6. Deploy the application.
7. Verify `/api/health`.
8. Verify admin login and one sample content update.
9. Confirm the first upload creates `public/uploads/` successfully if the folder was not pre-provisioned.

## Backup Guidance

- Back up `data/` and `public/uploads/` together.
- Keep recovery copies of the generated `.bak` JSON files.
- Before major content migrations, take a fresh snapshot.

## Operational Warnings

- File-based persistence is not ideal for horizontal scaling.
- Concurrent edits are hardened, but a shared database is still the correct future upgrade for larger teams.
- If the live domain changes, update both `APP_ORIGIN` and `NEXT_PUBLIC_SITE_URL` together.
