# TODO

Open work for the memorial site. Inline `TODO` comments in `content.js`,
`site.js`, and `index.html` point back to these items. Remove an item (and its
inline comment) when it's done.

## Schedule

- [ ] **Service end time.** Blank for now; the page shows "2 PM" and calendar entries assume one hour.
- [ ] **Friday night dinner** (Apr 30, the evening before the service): venue, address and time are blank.
      Fill them in on the event in `content.js` and remove its "Location and time to be announced." note.

## Content

- [ ] Obituary / Her Story (`story`).
- [ ] Photos: hero, portrait and 3 gallery photos added. Add captions and more gallery photos.
- [ ] Event description: will there be a reception or luncheon after the service?
- [ ] Other weekend events (family brunch, etc.), if any.
- [ ] Family contact email for the footer (`contact.email`); email only, no phone. Isaac may have set one up.

## Links (`links` in `content.js`)

- [ ] **Submit one real RSVP on a phone** to check the embedded form: after Submit the page should scroll back up to the "response recorded" message. Delete the test row from the Sheet afterwards.
      If the form's questions change, re-check the iframe heights in `styles.css` (`.form-embed iframe`).
- [ ] Public guest list (`guestListCsv`). Code is in place; it stays hidden until the link is set.
      The live form has no "Show my name on the public guest list? (Yes / No)" question yet; add it first.
      The formula below assumes columns B = name, C = attending, D = party size, E = opt-in; the live form
      has Email in C, so adjust the columns to the real Sheet.
      In the responses Sheet, add a tab "Guest list" with in A1:
      `=QUERY('Form Responses 1'!A:E, "select B, D where C starts with 'Yes' and E starts with 'Yes'", 1)`
      then File > Share > Publish to web > that tab only > CSV, and paste the URL into `guestListCsv`.
      Only names + party size are public; emails and messages stay private.
- [ ] Optional: livestream (`livestream`).

## Memories form (`worker/`, `memories` in `content.js`)

Setup is done (see `worker/README.md`). Worker: `https://gma-memorial-memories.marilynwinters.workers.dev`.

- [ ] **Live test with a real photo and a phone video.** The browser-to-Drive upload (resumable session + CORS) can't be tested without real Google.
- [ ] Optional, later: show selected memories on the site (needs a family review step first).

## Travel

- [ ] Hotel phone numbers and booking URLs (left blank so we don't publish unverified numbers).
- [ ] Group rate / room block, if the family sets one up.
- [ ] Confirm whether rideshare is reliable locally.
- [ ] Optional `travel.extra`: early-May weather, local tips.

## Technical

- [ ] GitHub Pages: set **Settings → Pages → Source: GitHub Actions**. (CNAME for marilynwinters.com is in place.)
- [ ] Optional: a single "add the whole weekend to calendar" `.ics` once there are multiple events.

## Done

- [x] Tagline: "Professor, wife, mother, grandmother, and friend."
- [x] Quote: Pooh "braver than you believe", credited to Christopher Robin to Pooh.
- [x] Dress code: smart casual.
- [x] Parking available at the church.

- [x] Service set to Saturday, May 1, 2027 at 2 PM, timezone `America/Los_Angeles`.
- [x] Venue: Unitarian Universalist Community of the Mountains, 12582 Squirrel Creek Rd, Grass Valley, CA 95945.
- [x] RSVP deadline: January 31, 2027 (90 days before May 1).
- [x] Airport: Sacramento International (SMF).
- [x] Hotels: Gold Miners Inn (Ascend Collection), The Holbrooke, The National.
- [x] Donations go to UUCM (Unitarian Universalist Community of the Mountains).
- [x] SMF drive time ~1h10 (family-confirmed). RNO added as alternative (~1.5 h, estimate).
- [x] Fixed `.ics` semicolon escaping.
- [x] `og:image` / `og:url` now absolute.
- [x] UUCM donation link wired to the "Give in Her Memory" button (`links.donate`).
- [x] Service address confirmed: 12582 Squirrel Creek Rd, Grass Valley, CA 95945.
- [x] Memories form built: custom form on the site + Cloudflare Worker -> Google Sheet + Drive folder (no guest sign-in).
- [x] Custom domain marilynwinters.com: og tags and Worker ALLOWED_ORIGINS updated.
- [x] Memories backend set up: Google OAuth app in production, Drive folder + Sheet created, Turnstile widget, Worker secrets set and deployed, `memories.endpoint` / `turnstileSiteKey` set.
- [x] Dropped the Google Photos shared album: the Share a Memory form takes photos and videos.
- [x] RSVP wired to the Google Form, embedded inline (`links.rsvpFormEmbed`, with `links.rsvpForm` as the new-tab fallback): full name, email, attending, party size, dietary restrictions, message.
- [x] Friday night dinner added to the schedule (details TBD) plus a "Come early, stay a while" note (`scheduleNote`).
- [x] No dinner headcount needed: the RSVP form stays service-only.
- [x] Airbnb and Vrbo flagged as lodging options under the hotels (`travel.rentals`).
