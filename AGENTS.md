# Notes for agents

- Static site, no build. All content lives in `content.js`; `site.js` renders it.
- **Read `TODO.md` first.** It is the source of truth for open work. Keep it updated:
  check off or remove items you finish, add items you discover.
- The service is Saturday, May 1, 2027 at 2 PM (set by Harry, 2026-11-14). End time is not set yet.
- RSVP uses Google Forms for now. Don't build a custom backend unless asked.
- The **memories form** is the exception: custom form + Cloudflare Worker in `worker/`
  (Sheet + Drive via the family's OAuth refresh token, `drive.file` scope). Run `npm test` in `worker/` after changes.
  Never commit secrets; they live in `wrangler secret` / `.dev.vars`.
- Don't invent venue details, phone numbers, or links. Leave them blank and add a TODO.
