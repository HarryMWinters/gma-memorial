# TODO

Open work for the memorial site. Inline `TODO` comments in `content.js`,
`site.js`, and `index.html` point back to these items. Remove an item (and its
inline comment) when it's done.

## Unvalidated: confirm before sharing the site widely

- [ ] **Service date.** Set to **Saturday, May 1, 2027**, but this has NOT been
      validated. It may be Sunday, May 2. Confirm with the family and the venue,
      then remove the "Date and time to be confirmed." note from the event in
      `content.js`.
- [ ] **Service start/end time.** Blank for now. The page shows "Time to be
      announced" and hides the calendar buttons until `start` is set.

## Content

- [ ] Obituary / Her Story (`story`).
- [ ] Photos: hero, portrait and 3 gallery photos added. Add captions and more gallery photos.
- [ ] Event description: will there be a reception or luncheon after the service?
- [ ] Other weekend events (gathering the night before, family brunch, etc.), if any.
- [ ] Family contact email for the footer (`contact.email`); email only, no phone. Isaac may have set one up.

## Links (`links` in `content.js`)

- [ ] RSVP Google Form URL (`rsvpForm`, optionally `rsvpFormEmbed`). **Decision: use Google Forms for now**, not a custom backend.
- [ ] Public guest list (`guestListCsv`). Code is in place; it stays hidden until the link is set.
      Form questions: Name(s); Will you be joining us? (Yes, I'll be there / Sorry, I can't make it);
      Number in your party; Show my name on the public guest list? (Yes / No).
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

- [x] Event date set to 2027-05-01 (pending validation), timezone `America/Los_Angeles`.
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
