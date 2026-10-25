# Notes for agents

- Static site, no build. All content lives in `content.js`; `site.js` renders it.
- **Read `TODO.md` first.** It is the source of truth for open work. Keep it updated:
  check off or remove items you finish, add items you discover.
- The service date (2027-05-01) is **unvalidated**: it could be May 2. Don't present it as confirmed.
- RSVP uses Google Forms for now. Don't build a custom backend unless asked.
- The **memories form** is the exception: custom form + Cloudflare Worker in `worker/`
  (Sheet + Drive via the family's OAuth refresh token, `drive.file` scope). Run `npm test` in `worker/` after changes.
  Never commit secrets; they live in `wrangler secret` / `.dev.vars`.
- Don't invent venue details, phone numbers, or links. Leave them blank and add a TODO.
