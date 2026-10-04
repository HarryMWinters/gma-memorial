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
  // Paste the obituary here. Each string is one paragraph.
  // Leave the array empty [] to show a placeholder.
  story: [
    // "Marilyn was born on a snowy January morning in 1929 ...",
  ],

  // Optional short quotes shown as pull-quotes between sections.
  quotes: [
    { text: "Those we love don't go away; they walk beside us every day.", by: "" },
  ],

  // --------------------------------------------------------- Schedule ---
  // Dates must be YYYY-MM-DD and times HH:MM (24h) so the calendar buttons work.
  // Set timezone to the IANA zone of the venue, e.g. "America/Chicago".
  timezone: "America/New_York",
  events: [
    {
      title: "Visitation & Reception",
      date: "2026-11-13",
      start: "17:00",
      end: "20:00",
      venue: "Venue Name",
      address: "123 Main Street, City, ST 00000",
      description: "Join the family for an informal evening of stories, photos, and refreshments.",
      dressCode: "Casual",
      notes: "All are welcome. Children welcome.",
    },
    {
      title: "Memorial Service",
      date: "2026-11-14",
      start: "11:00",
      end: "12:00",
      venue: "Church or Chapel Name",
      address: "456 Church Road, City, ST 00000",
      description: "A service celebrating Marilyn's life, followed by a luncheon.",
      dressCode: "Semi-formal",
      notes: "Luncheon to follow at the same location.",
    },
    {
      title: "Family Brunch",
      date: "2026-11-15",
      start: "10:00",
      end: "12:00",
      venue: "Family Home",
      address: "789 Oak Lane, City, ST 00000",
      description: "A relaxed farewell brunch before everyone heads home.",
      dressCode: "Casual",
      notes: "",
    },
  ],

  // ------------------------------------------------- Travel & lodging ---
  travel: {
    intro: "For those travelling in for the weekend, here is everything you need to know.",
    airports: [
      { name: "Nearest Airport (XXX)", detail: "About 30 minutes from the venues." },
    ],
    hotels: [
      {
        name: "Hotel Name",
        detail: "A block of rooms is reserved under \"Winters Memorial\" through Oct 31.",
        address: "100 Hotel Drive, City, ST 00000",
        phone: "(555) 555-0100",
        url: "",
      },
      {
        name: "Second Hotel Name",
        detail: "A short drive from the church; ask for the group rate.",
        address: "200 Inn Street, City, ST 00000",
        phone: "(555) 555-0200",
        url: "",
      },
    ],
    gettingAround: "Parking is available at all venues. Rideshare is readily available in the area.",
    extra: "", // anything else: weather, what to bring, local tips
  },

  // ----------------------------------------------------------- Gallery ---
  // Drop image files into /images and list them here. Captions optional.
  // Tip: keep images under ~500 KB each so the page stays fast.
  gallery: [
    // { src: "images/1950-wedding.jpg", caption: "Marilyn and Grandpa, 1950" },
    // { src: "images/graduation.jpg",   caption: "Medical school graduation" },
  ],

  // ------------------------------------------------------------- Links ---
  // Paste the real URLs between the quotes. Empty = placeholder shown.
  links: {
    googlePhotosAlbum: "",   // shared album where guests can add photos
    gofundme: "",            // donation page
    rsvpForm: "",            // Google Form URL (the "Send" > link one)
    rsvpFormEmbed: "",       // optional: Google Form "Embed HTML" src URL to show the form inline
    memoriesForm: "",        // optional: a second form for written memories
    livestream: "",          // optional: link for those who can't attend
  },

  // Deadline shown next to the RSVP button, or "" to hide.
  rsvpBy: "November 1, 2026",

  // Donation framing. If she had a preferred charity, mention it here.
  donate: {
    heading: "In lieu of flowers",
    text: "The family has set up a memorial fund in Marilyn's honor. Contributions will support causes she cared about deeply.",
  },

  // ------------------------------------------------------------ Contact ---
  contact: {
    name: "The Winters Family",
    email: "",   // e.g. "family@example.com"
    phone: "",
  },
};
