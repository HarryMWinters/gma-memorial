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
    tagline: "Professor, wife, mother, grandmother, and friend.",
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
    {
      text: "If ever there is tomorrow when we're not together, there is something you must always remember: you are braver than you believe, stronger than you seem, and smarter than you think. But the most important thing is, even if we're apart, I'll always be with you.",
      by: "Christopher Robin to Pooh",
    },
  ],

  // --------------------------------------------------------- Schedule ---
  // Dates must be YYYY-MM-DD and times HH:MM (24h) so the calendar buttons work.
  // Leave start as "" until confirmed: the page shows "Time to be announced"
  // and hides the add-to-calendar buttons. A blank end means a 1-hour calendar entry. See TODO.md for open items.
  timezone: "America/Los_Angeles",
  events: [
    {
      title: "Friday Night Dinner",
      // The evening before the service. Moves with the service date if that changes.
      date: "2027-04-30",
      start: "", // TODO: dinner time (HH:MM, 24h)
      end: "",
      venue: "",   // TODO: dinner venue
      address: "", // TODO: dinner address
      description: "Join the family for dinner the evening before the service: a chance to gather, catch up, and start sharing stories.",
      notes: "Location and time to be announced.",
    },
    {
      title: "Celebration of Life",
      date: "2027-05-01",
      start: "14:00",
      end: "",   // TODO: service end time (HH:MM, 24h). Calendar entries assume 1 hour until set.
      venue: "Unitarian Universalist Community of the Mountains",
      address: "12582 Squirrel Creek Rd, Grass Valley, CA 95945",
      description: "A service celebrating Marilyn's life.", // TODO: reception/luncheon after?
      dressCode: "Smart casual, though we suspect she'd quietly hand out marks for a great outfit.",
    },
  ],

  // Shown under the schedule. Set heading and text to "" to hide.
  scheduleNote: {
    heading: "Come early, stay a while",
    text: "You are warmly welcome to arrive a few days early or stay on afterwards. The family will be around Grass Valley and would love the time together to reminisce, share stories, and honor Marilyn and all she meant to us.",
  },

  // ------------------------------------------------- Travel & lodging ---
  travel: {
    intro: "For those traveling in for the weekend, here is everything you need to know.",
    airports: [
      { name: "Sacramento International Airport (SMF)", detail: "The nearest major airport, about a 1 hour 10 minutes' drive from the service." },
      { name: "Reno-Tahoe International Airport (RNO)", detail: "An alternative, roughly a 2-hour drive over I-80." },
    ],
    // TODO: hotel phone numbers, booking URLs, and any group rate/room block.
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
    // Short note shown under the hotels. Set text to "" to hide.
    rentals: {
      text: "Vacation rentals are a good option too, especially for families or longer stays. Look for places in Grass Valley or Nevada City.",
      links: [
        { label: "Airbnb", url: "https://www.airbnb.com/" },
        { label: "Vrbo", url: "https://www.vrbo.com/" },
      ],
    },
    // TODO: confirm whether rideshare is reliable in the area.
    gettingAround: "A car is recommended for getting between Sacramento and Grass Valley. Parking is available at the church.",
    extra: "", // TODO (optional): weather in early May, local tips
  },

  // ----------------------------------------------------------- Gallery ---
  // Drop image files into /images and list them here. Captions optional.
  // Tip: keep images under ~500 KB each so the page stays fast.
  // TODO: add photos (also images/hero.jpg and images/portrait.jpg).
  gallery: [
    { src: "images/lake-tahoe.jpg", caption: "Modelling her Lake Tahoe sweats, a true style moment" },
    { src: "images/christmas.jpg", caption: "Marilyn and Harry at Christmas" },
    { src: "images/story-time.jpg", caption: "Story time, with the dog listening in" },
    { src: "images/family-living-room.jpg", caption: "Silly faces with the grandkids. She held her own." },
  ],

  // ------------------------------------------------------------- Links ---
  // Paste the real URLs between the quotes. Empty = placeholder shown.
  links: {
    // TODO: fill in all links below (RSVP uses Google Forms for now).
    donate: "https://secure.myvanco.com/L-ZFZ1/campaign/C-1408Z", // UUCM online giving (button reads "Give in Her Memory")
    rsvpForm: "https://forms.gle/yedajqoPykdKxu6E7", // Google Form URL (the "Send" > link one)
    rsvpFormEmbed: "https://docs.google.com/forms/d/e/1FAIpQLSe9wcr6blV7k53ipfreaNekvIlECsCf-fSyEubexMuHFNxHPg/viewform?embedded=true", // optional: Google Form "Embed HTML" src URL to show the form inline
    livestream: "",          // optional: link for those who can't attend
    guestListCsv: "",        // optional: public "Who's coming" list. Google Sheet tab of opted-in
                             // names, published via File > Share > Publish to web > CSV. See TODO.md.
  },

  // ---------------------------------------------------------- Memories ---
  // Guest memory form: name, email, a written memory, photos/videos.
  // Backend lives in worker/ (see worker/README.md). Leave endpoint "" to show
  // a "coming soon" placeholder instead of the form.
  memories: {
    endpoint: "https://gma-memorial-memories.marilynwinters.workers.dev/memories",
    turnstileSiteKey: "0x4AAAAAAFsFgU-S2h1WKQv2",  // Cloudflare Turnstile site key (spam check)
    maxFiles: 10,          // keep in sync with MAX_FILES in worker/wrangler.toml
    maxFileMB: 1024,       // keep in sync with MAX_FILE_MB
  },

  // Deadline shown next to the RSVP button, or "" to hide.
  rsvpBy: "January 31, 2027", // 90 days before May 1, 2027

  // Donation framing. If she had a preferred charity, mention it here.
  donate: {
    heading: "In lieu of flowers",
    text: "The family asks that donations in Marilyn's memory be made to the Unitarian Universalist Community of the Mountains (UUCM) in Grass Valley.",
  },

  // ------------------------------------------------------------ Contact ---
  // TODO: family contact email/phone.
  contact: {
    name: "The Winters Family",
    email: "",   // e.g. "family@example.com"
    phone: "",
  },
};
