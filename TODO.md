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
- [ ] Photos: `images/hero.jpg`, `images/portrait.jpg`, and the `gallery` list.
- [ ] Quote: confirm the text and add an attribution (`quotes[0].by`).
- [ ] Event description: will there be a reception or luncheon after the service? Attire guidance?
- [ ] Other weekend events (gathering the night before, family brunch, etc.), if any.
- [ ] Donations: name the charity Marilyn cared about, or confirm GoFundMe (`donate.text`).
- [ ] Family contact email and phone for the footer (`contact`).

## Links (`links` in `content.js`)

- [ ] RSVP Google Form URL (`rsvpForm`, optionally `rsvpFormEmbed`). **Decision: use Google Forms for now**, not a custom backend.
- [ ] Google Photos shared album (`googlePhotosAlbum`).
- [ ] GoFundMe / donation link (`gofundme`).
- [ ] Optional: memories form (`memoriesForm`), livestream (`livestream`).

## Travel

- [ ] Hotel phone numbers and booking URLs (left blank so we don't publish unverified numbers).
- [ ] Group rate / room block, if the family sets one up.
- [ ] Verify SMF drive time (~1.5 h). Consider listing Reno-Tahoe (RNO) as an alternative.
- [ ] Confirm parking at the venue and whether rideshare is reliable locally.
- [ ] Optional `travel.extra`: early-May weather, local tips.

## Technical

- [ ] **Bug:** `.ics` export in `site.js` (`fold`) uses `"\;"`, which is just `";"`, so
      semicolons aren't escaped. Change it to `"\;"`.
- [ ] `og:image` in `index.html` must be an absolute URL to an existing image, or link previews have no picture.
- [ ] GitHub Pages: set **Settings → Pages → Source: GitHub Actions**. Add `CNAME` if using a custom domain.
- [ ] Optional: a single "add the whole weekend to calendar" `.ics` once there are multiple events.

## Done

- [x] Event date set to 2027-05-01 (pending validation), timezone `America/Los_Angeles`.
- [x] Venue: Unitarian Universalist Community of the Mountains, 12582 Squirrel Creek Rd, Grass Valley, CA 95945.
- [x] RSVP deadline: January 31, 2027 (90 days before May 1).
- [x] Airport: Sacramento International (SMF).
- [x] Hotels: Gold Miners Inn (Ascend Collection), The Holbrooke, The National.
