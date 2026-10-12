/* =========================================================================
   content.js — EVERYTHING you'd want to edit lives in this one file.
   Change the text, add events, add photos, paste in your links.
   Anything set to "" (empty) is treated as "not ready yet" and the site
   shows a gentle placeholder for it.
   ========================================================================= */

window.SITE = {
  // ---------------------------------------------------------------- Her ---
  person: {
    name: "Dr. Marilyn Winters",
    shortName: "Marilyn",          // used in sentences like "Celebrating Marilyn"
    born: "January 29, 1929",
    died: "May 20, 2026",
    tagline: "A life well lived, a legacy well loved.",
    heroImage: "images/hero.jpg",   // drop a photo here (landscape works best)
    portraitImage: "images/portrait.jpg", // optional portrait for Her Story
  },

  // -------------------------------------------------------- Her story ---
  // TODO: paste the obituary here. Each string is one paragraph.
  // Leave the array empty [] to show a placeholder.
  story: [
    // "Marilyn was born on a snowy January morning in 1929 ...",
  ],

  // Optional short quotes shown as pull-quotes between sections.
  quotes: [
    // TODO: confirm quote and attribution (by: is empty).
    { text: "Those we love don't go away; they walk beside us every day.", by: "" },
  ],

  // --------------------------------------------------------- Schedule ---
  // Dates must be YYYY-MM-DD and times HH:MM (24h) so the calendar buttons work.
  // Leave start/end as "" until confirmed: the page shows "Time to be announced"
  // and hides the add-to-calendar buttons. See TODO.md for open items.
  timezone: "America/Los_Angeles",
  events: [
    {
      title: "Celebration of Life",
      // TODO(unvalidated): date NOT confirmed. It is either Sat May 1 or Sun May 2, 2027.
      // Confirm with the family and the venue, then remove the notes line below.
      date: "2027-05-01",
      start: "", // TODO: service start time (HH:MM, 24h)
      end: "",   // TODO: service end time (HH:MM, 24h)
      venue: "Unitarian Universalist Community of the Mountains",
      address: "12582 Squirrel Creek Rd, Grass Valley, CA 95945",
      description: "A service celebrating Marilyn's life.", // TODO: reception/luncheon after?
      dressCode: "", // TODO: attire guidance, if any
      notes: "Date and time to be confirmed.",
    },
    // TODO: add any other weekend events (gathering the night before, family
    // brunch, etc.) once they're decided.
  ],

  // ------------------------------------------------- Travel & lodging ---
  travel: {
    intro: "For those travelling in for the weekend, here is everything you need to know.",
    airports: [
      // TODO: verify drive time and consider adding Reno-Tahoe (RNO) as an alternative.
      { name: "Sacramento International Airport (SMF)", detail: "The nearest major airport, roughly 1.5 hours' drive from Grass Valley." },
    ],
    // TODO: hotel phone numbers, booking URLs, and any group rate / room block.
    hotels: [
      {
        name: "Gold Miners Inn Grass Valley, an Ascend Collection Hotel",
        detail: "In downtown Grass Valley.",
        address: "121 Bank St, Grass Valley, CA 95945",
        phone: "",
        url: "",
      },
      {
        name: "The Holbrooke",
        detail: "Historic hotel on Main Street in downtown Grass Valley.",
        address: "212 W Main St, Grass Valley, CA 95945",
        phone: "",
        url: "",
      },
      {
        name: "The National",
        detail: "Historic hotel in downtown Nevada City, a short drive from Grass Valley.",
        address: "211 Broad St, Nevada City, CA 95959",
        phone: "",
        url: "",
      },
    ],
    // TODO: confirm parking at the venue and whether rideshare is reliable in the area.
    gettingAround: "A car is recommended for getting between Sacramento and Grass Valley.",
    extra: "", // TODO (optional): weather in early May, local tips
  },

  // ----------------------------------------------------------- Gallery ---
  // Drop image files into /images and list them here. Captions optional.
  // Tip: keep images under ~500 KB each so the page stays fast.
  // TODO: add photos (also images/hero.jpg and images/portrait.jpg).
  gallery: [
    // { src: "images/1950-wedding.jpg", caption: "Marilyn and Grandpa, 1950" },
    // { src: "images/graduation.jpg",   caption: "Medical school graduation" },
  ],

  // ------------------------------------------------------------- Links ---
  // Paste the real URLs between the quotes. Empty = placeholder shown.
  links: {
    // TODO: fill in all links below (RSVP uses Google Forms for now).
    googlePhotosAlbum: "",   // shared album where guests can add photos
    gofundme: "",            // donation page
    rsvpForm: "",            // Google Form URL (the "Send" > link one)
    rsvpFormEmbed: "",       // optional: Google Form "Embed HTML" src URL to show the form inline
    memoriesForm: "",        // optional: a second form for written memories
    livestream: "",          // optional: link for those who can't attend
  },

  // Deadline shown next to the RSVP button, or "" to hide.
  rsvpBy: "January 31, 2027", // 90 days before May 1, 2027

  // Donation framing. If she had a preferred charity, mention it here.
  // TODO: name the charity / confirm GoFundMe as the donation route.
  donate: {
    heading: "In lieu of flowers",
    text: "The family has set up a memorial fund in Marilyn's honor. Contributions will support causes she cared about deeply.",
  },

  // ------------------------------------------------------------ Contact ---
  // TODO: family contact email/phone.
  contact: {
    name: "The Winters Family",
    email: "",   // e.g. "family@example.com"
    phone: "",
  },
};
