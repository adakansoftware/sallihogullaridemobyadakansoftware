# Client Handoff Notes

## Admin access

- Admin panel route: `/admin/login`
- Credentials come from server environment variables, not from the codebase.
- Rotate admin password before production delivery.

## Where content is managed

- Site settings: `/admin/settings`
- Projects and gallery media: `/admin/projects`
- Incoming contact requests: `/admin/messages`

## How uploads work

- Uploaded files are stored under `public/uploads`.
- Project/media records are stored in JSON files under `data/`.
- Only referenced uploads should remain attached to active content.

## Support boundaries

- The current product is a polished file-backed CMS-style deployment.
- It is suitable for a corporate site with moderate admin activity.
- If the client later needs multiple editors, approval workflows, or high-traffic multi-instance hosting, a database migration should be planned.
