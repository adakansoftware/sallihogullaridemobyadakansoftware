# Admin Operations Guide

This project includes a protected admin panel for content management and operational follow-up.

## Admin Areas

- `/admin/login`: secure login screen
- `/admin`: overview dashboard
- `/admin/projects`: project and media management
- `/admin/messages`: contact form inbox
- `/admin/settings`: company profile and site-wide content

## Daily Usage

1. Log in with the environment-based admin credentials.
2. Update company-wide information from `/admin/settings`.
3. Create or edit projects from `/admin/projects`.
4. Upload gallery media only from the admin panel.
5. Review incoming contact requests from `/admin/messages`.

## Safe Editing Expectations

- Project cover images should point to `/images/...` or managed `/uploads/...` paths.
- Uploaded files are validated before they are saved.
- Deleting a project also evaluates whether related uploaded files are still referenced elsewhere.
- Draft content stays out of the public project listing until published.

## Before Production Handoff

- Replace the default admin password.
- Confirm the live domain is configured in both `APP_ORIGIN` and `NEXT_PUBLIC_SITE_URL`.
- Confirm `data/` and `public/uploads/` are writable on the target host.
- Run `npm run test`, `npm run lint`, and `npm run build`.

## Support Notes

- This is a file-backed operational CMS for a corporate website.
- It is suitable for moderate editorial/admin activity on a single writable deployment target.
- If the client later needs multiple concurrent editors or multi-instance hosting, plan a database migration.
