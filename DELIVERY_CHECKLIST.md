# Delivery Checklist

## Before client handoff

- Confirm `.env` values are set for production domain and strong admin credentials.
- Run `npm run test`.
- Run `npm run lint`.
- Run `npm run build`.
- Verify `data/` is writable in the deployment environment.
- Verify `public/uploads/` is writable in the deployment environment.
- Confirm admin login works on the live domain.
- Confirm contact form creates records in `data/messages.json`.
- Confirm project create/update/delete works from `/admin/projects`.
- Confirm upload, cover image assignment, and media deletion work from the admin panel.
- Confirm sitemap and robots endpoints respond: `/sitemap.xml`, `/robots.txt`.

## Content review

- Replace demo admin credentials with client credentials.
- Review company name, phone, email, address, and service area in admin settings.
- Review all public project entries for final client-approved text and media.
- Remove any unused uploaded files if the dashboard reports orphan uploads.

## Backup / recovery

- Back up `data/` before major edits or deployments.
- Back up `public/uploads/` together with `data/`.
- If a primary JSON file is corrupted, the app can recover from `.bak` files when available.

## Operational notes

- This product uses file-based persistence, so it is best suited to a single writable deployment target.
- For horizontal scaling or very high write concurrency, migrate persistence to a database-backed store.
