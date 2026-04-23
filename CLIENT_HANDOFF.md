# Client Handoff Notes

## Access

- Admin login route: `/admin/login`
- Credentials are provided through server environment variables, not committed in the repository.
- Rotate the final admin password before go-live.

## Where Content Is Managed

- Company profile and public contact details: `/admin/settings`
- Projects and gallery media: `/admin/projects`
- Contact requests from the website: `/admin/messages`

## File Storage Model

- Structured content is stored in `data/`
- Uploaded media is stored in `public/uploads`
- Backup files may exist beside the JSON files as `.bak`

## Operational Boundaries

- This product is intended for a single writable deployment target.
- It is appropriate for a premium corporate website with moderate admin traffic.
- For larger editorial teams, approval workflows, or horizontal scaling, a database-backed migration should be planned.

## Recommended Support Routine

- Back up `data/` and `public/uploads/` together.
- Verify `/api/health` after deployment.
- Re-run `npm run test`, `npm run lint`, and `npm run build` before major updates.
