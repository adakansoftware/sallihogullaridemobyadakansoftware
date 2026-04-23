# Salihogullari Corporate Platform

Production-ready corporate website and admin panel built with Next.js 16.

## Project Scope

- Public routes: `/`, `/about`, `/services`, `/projects`, `/projects/[slug]`, `/fleet`, `/contact`
- Admin routes: `/admin/login`, `/admin`, `/admin/projects`, `/admin/messages`, `/admin/settings`
- Content storage: JSON files under `data/`
- Upload storage: `public/uploads`
- Auth model: environment-based admin credentials with secure session cookie

## Quick Start

1. Install dependencies:

```powershell
npm install
```

2. Create the local environment file:

```powershell
Copy-Item .env.example .env
```

3. Update `.env` with the real production-safe values.

4. Run verification:

```powershell
npm run test
npm run lint
npm run build
```

5. Start local development:

```powershell
npm run dev
```

## Required Environment

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=use-a-strong-password
ADMIN_SESSION_SECRET=use-a-long-random-secret
APP_ORIGIN=https://example.com
NEXT_PUBLIC_SITE_URL=https://example.com
```

## Production Notes

- `APP_ORIGIN` and `NEXT_PUBLIC_SITE_URL` should match the live domain.
- `data/` must be readable and writable in production.
- `public/uploads/` should be writable in production. The folder can be created automatically on the first successful upload.
- This project uses file-based persistence and is best deployed to a single writable instance.
- Keep `data/` and `public/uploads/` in backups together.
- Use strong, client-specific admin credentials before handoff.
- A healthy `/api/health` response may still report a missing uploads directory before the first upload, which is expected for a fresh demo deployment.

## Operations

- Health endpoint: `/api/health`
- Sitemap: `/sitemap.xml`
- Robots: `/robots.txt`
- Web manifest: `/manifest.webmanifest`

## Handoff Documents

- [README_ADMIN.md](C:\Users\adaka\Desktop\sali_admin_full\README_ADMIN.md)
- [CLIENT_HANDOFF.md](C:\Users\adaka\Desktop\sali_admin_full\CLIENT_HANDOFF.md)
- [DELIVERY_CHECKLIST.md](C:\Users\adaka\Desktop\sali_admin_full\DELIVERY_CHECKLIST.md)
- [DEPLOYMENT.md](C:\Users\adaka\Desktop\sali_admin_full\DEPLOYMENT.md)
