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
# Optional alternative to ADMIN_PASSWORD:
# ADMIN_PASSWORD_HASH=scrypt:<salt-base64url>:<hash-base64url>
ADMIN_SESSION_SECRET=use-a-long-random-secret
APP_ORIGIN=https://example.com
NEXT_PUBLIC_SITE_URL=https://example.com
```

## Production Notes

- `APP_ORIGIN` and `NEXT_PUBLIC_SITE_URL` should match the live domain.
- In production, configure at least one of `APP_ORIGIN` or `NEXT_PUBLIC_SITE_URL`; if both are set, they must point to the same origin.
- `data/` must be readable and writable in production.
- The current build keeps the upload API disabled; image assets are expected under `public/images` and video embeds should use YouTube URLs.
- This project uses file-based persistence and is best deployed to a single writable instance.
- Keep `data/` and `public/uploads/` in backups together.
- Use strong, client-specific admin credentials before handoff.
- Rate limiting is currently memory-backed, so it is local-instance only unless replaced with a shared store.

## Operations

- Health endpoint: `/api/health`
- Sitemap: `/sitemap.xml`
- Robots: `/robots.txt`
- Web manifest: `/manifest.webmanifest`
- KVKK page: `/kvkk-aydinlatma-metni`

## Handoff Documents

- [README_ADMIN.md](C:\Users\adaka\Desktop\sali_admin_full\README_ADMIN.md)
- [CLIENT_HANDOFF.md](C:\Users\adaka\Desktop\sali_admin_full\CLIENT_HANDOFF.md)
- [DELIVERY_CHECKLIST.md](C:\Users\adaka\Desktop\sali_admin_full\DELIVERY_CHECKLIST.md)
- [DEPLOYMENT.md](C:\Users\adaka\Desktop\sali_admin_full\DEPLOYMENT.md)
