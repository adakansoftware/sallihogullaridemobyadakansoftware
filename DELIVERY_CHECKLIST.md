# Delivery Checklist

## Technical Verification

- Run `npm run test`
- Run `npm run lint`
- Run `npm run build`
- Confirm `/api/health` returns `ok` or the expected storage warnings for the target environment
- Confirm `/sitemap.xml`, `/robots.txt`, and `/manifest.webmanifest` respond correctly

## Production Environment

- Set `APP_ORIGIN` to the live domain
- Set `NEXT_PUBLIC_SITE_URL` to the live domain
- Set a strong `ADMIN_PASSWORD`
- Set a long random `ADMIN_SESSION_SECRET`
- Confirm `data/` is writable
- Confirm `public/uploads/` is writable

## Content Review

- Confirm company name, phone, email, address, and service area
- Confirm all public projects and media are client-approved
- Remove or archive any unneeded uploaded files
- Confirm contact form submissions are received under `/admin/messages`

## Admin Review

- Confirm login/logout works on the live domain
- Confirm project create, update, publish, and delete flows
- Confirm upload, cover assignment, reorder, and media delete flows
- Confirm settings updates persist correctly

## Backup and Recovery

- Back up `data/` before release
- Back up `public/uploads/` together with `data/`
- Preserve `.bak` files for recovery support
