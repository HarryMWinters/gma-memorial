/* site.js — reads window.SITE (content.js) and fills the page.
   You shouldn't need to edit this file to change content. */
(function () {
  "use strict";
  const S = window.SITE || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const has = (v) => Array.isArray(v) ? v.length > 0 : !!(v && String(v).trim());
  const linkOK = (u) => has(u) && /^https?:\/\//i.test(u);

  /* ------------------------------------------------------ basics -- */
  const P = S.person || {};
  $$("[data-name]").forEach((n) => (n.textContent = P.name || ""));
  $$("[data-short-name]").forEach((n) => (n.textContent = P.shortName || P.name || ""));
  $$("[data-born]").forEach((n) => (n.textContent = P.born || ""));
  $$("[data-died]").forEach((n) => (n.textContent = P.died || ""));
  $$("[data-tagline]").forEach((n) => (n.textContent = P.tagline || ""));
  if (P.name) document.title = `${P.name} · ${yearOf(P.born)} – ${yearOf(P.died)}`;

  function yearOf(s) { const m = String(s || "").match(/\d{4}/); return m ? m[0] : ""; }

  /* -------------------------------------------------------- hero -- */
  const heroImg = $("#hero-img");
  if (heroImg && has(P.heroImage)) {
    heroImg.addEventListener("load", () => heroImg.classList.add("is-loaded"));
    heroImg.addEventListener("error", () => heroImg.remove());
    heroImg.src = P.heroImage;
  } else if (heroImg) heroImg.remove();

  /* ----------------------------------------------------- dates -- */
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const DOW = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  function parseDate(ymd) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd || "");
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }
  function fmtTime(hm) {
    const m = /^(\d{1,2}):(\d{2})$/.exec(hm || "");
    if (!m) return "";
    let h = +m[1]; const min = m[2]; const ap = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return min === "00" ? `${h} ${ap}` : `${h}:${min} ${ap}`;
  }
  function timeRange(a, b) {
    const fa = fmtTime(a), fb = fmtTime(b);
    if (fa && fb) {
      const sameAP = fa.slice(-2) === fb.slice(-2);
      return sameAP ? `${fa.slice(0, -3)} – ${fb}` : `${fa} – ${fb}`;
    }
    return fa || "";
  }
  function dateRangeLabel(dates) {
    const ds = dates.filter(Boolean).sort((a, b) => a - b);
    if (!ds.length) return "";
    const a = ds[0], b = ds[ds.length - 1];
    if (a.getTime() === b.getTime()) return `${MONTHS[a.getMonth()]} ${a.getDate()}, ${a.getFullYear()}`;
    if (a.getMonth() === b.getMonth()) return `${MONTHS[a.getMonth()]} ${a.getDate()}–${b.getDate()}, ${a.getFullYear()}`;
    return `${MONTHS[a.getMonth()]} ${a.getDate()} – ${MONTHS[b.getMonth()]} ${b.getDate()}, ${b.getFullYear()}`;
  }

  const events = Array.isArray(S.events) ? S.events : [];
  const eventDates = events.map((e) => parseDate(e.date));
  const weekendLabel = dateRangeLabel(eventDates);
  const heroWeekend = $("#hero-weekend");
  if (heroWeekend) heroWeekend.textContent = weekendLabel ? `Memorial Weekend · ${weekendLabel}` : "";

  /* ------------------------------------------------------- story -- */
  const storyBody = $("#story-body");
  if (storyBody) {
    if (has(S.story)) {
      storyBody.innerHTML = S.story.map((p) => `<p>${esc(p)}</p>`).join("");
    } else {
      storyBody.innerHTML = `<div class="placeholder">${esc(P.shortName || "Her")}'s story is being written and will appear here soon.<br><small>Family: paste the obituary into the <code>story</code> list in <code>content.js</code>.</small></div>`;
    }
  }
  const portraitWrap = $("#story-portrait"), portraitImg = $("#portrait-img");
  if (portraitWrap && portraitImg && has(P.portraitImage)) {
    portraitImg.addEventListener("load", () => {
      portraitWrap.hidden = false;
      $(".story-layout").classList.add("has-portrait");
    });
    portraitImg.alt = P.name || "";
    portraitImg.src = P.portraitImage;
  }

  /* ------------------------------------------------------- quote -- */
  if (has(S.quotes)) {
    const q = S.quotes[0];
    $("#quote-text").textContent = q.text || "";
    $("#quote-by").textContent = q.by || "";
    $("#quote-band").hidden = false;
  }

  /* ---------------------------------------------------- schedule -- */
  const tz = S.timezone || "";
  const pad = (n) => String(n).padStart(2, "0");
  function icsStamp(ymd, hm) { return `${ymd.replace(/-/g, "")}T${(hm || "00:00").replace(":", "")}00`; }
  function gcalLink(e) {
    if (!parseDate(e.date)) return "";
    const end = e.end || e.start;
    const u = new URL("https://calendar.google.com/calendar/render");
    u.searchParams.set("action", "TEMPLATE");
    u.searchParams.set("text", `${e.title} · ${P.name || ""}`.trim());
    u.searchParams.set("dates", `${icsStamp(e.date, e.start)}/${icsStamp(e.date, end)}`);
    if (tz) u.searchParams.set("ctz", tz);
    u.searchParams.set("details", [e.description, e.notes].filter(Boolean).join("\n"));
    u.searchParams.set("location", [e.venue, e.address].filter(Boolean).join(", "));
    return u.toString();
  }
  function icsBlob(e) {
    const tzp = tz ? `;TZID=${tz}` : "";
    const now = new Date();
    const stamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}00Z`;
    const fold = (s) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\;");
    const lines = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Memorial Site//EN", "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:${e.date}-${e.start}-${(e.title || "").replace(/\W+/g, "")}@memorial`,
      `DTSTAMP:${stamp}`,
      `DTSTART${tzp}:${icsStamp(e.date, e.start)}`,
      `DTEND${tzp}:${icsStamp(e.date, e.end || e.start)}`,
      `SUMMARY:${fold(`${e.title} · ${P.name || ""}`.trim())}`,
      `LOCATION:${fold([e.venue, e.address].filter(Boolean).join(", "))}`,
      `DESCRIPTION:${fold([e.description, e.notes].filter(Boolean).join("\n"))}`,
      "END:VEVENT", "END:VCALENDAR",
    ];
    return new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  }
  const mapLink = (addr) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;

  const list = $("#events");
  const lede = $("#schedule-lede");
  if (list) {
    if (!events.length) {
      list.innerHTML = `<li class="placeholder">The weekend schedule will be posted here soon.</li>`;
    } else {
      if (lede) lede.textContent = `Please join us ${weekendLabel ? "on " + weekendLabel + " " : ""}as we gather to remember ${P.shortName || P.name}. All are welcome at every event unless noted.`;
      list.innerHTML = events.map((e, i) => {
        const d = parseDate(e.date);
        const dateHtml = d
          ? `<span class="dow">${DOW[d.getDay()]}</span><span class="day">${d.getDate()}</span><span class="mon">${MONTHS[d.getMonth()].slice(0, 3)}</span>`
          : `<span class="mon">${esc(e.date || "Date TBD")}</span>`;
        const meta = [
          e.dressCode ? `<span><strong>Attire:</strong> ${esc(e.dressCode)}</span>` : "",
          e.notes ? `<span>${esc(e.notes)}</span>` : "",
        ].filter(Boolean).join("");
        return `
        <li class="event reveal">
          <div class="event-date" aria-label="${d ? esc(`${DOW[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`) : ""}">${dateHtml}</div>
          <article class="event-card">
            <h3>${esc(e.title)}</h3>
            <p class="event-time">${esc(timeRange(e.start, e.end))}</p>
            ${e.venue ? `<p class="event-venue">${esc(e.venue)}</p>` : ""}
            ${e.address ? `<p class="event-address">${esc(e.address)}</p>` : ""}
            ${e.description ? `<p class="event-desc">${esc(e.description)}</p>` : ""}
            ${meta ? `<div class="event-meta">${meta}</div>` : ""}
            <div class="event-actions">
              ${e.address ? `<a class="btn btn-outline btn-sm" target="_blank" rel="noopener" href="${mapLink(e.address)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>Map</a>` : ""}
              ${d ? `<a class="btn btn-outline btn-sm" target="_blank" rel="noopener" href="${gcalLink(e)}">Google Calendar</a>
              <button class="btn btn-outline btn-sm" type="button" data-ics="${i}">Apple / Outlook</button>` : ""}
            </div>
          </article>
        </li>`;
      }).join("");
      list.addEventListener("click", (ev) => {
        const b = ev.target.closest("[data-ics]");
        if (!b) return;
        const e = events[+b.dataset.ics];
        const url = URL.createObjectURL(icsBlob(e));
        const a = document.createElement("a");
        a.href = url; a.download = `${(e.title || "event").replace(/[^\w]+/g, "-").toLowerCase()}.ics`;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      });
    }
  }
  const L = S.links || {};
  if (linkOK(L.livestream)) {
    const n = $("#livestream-note");
    n.innerHTML = `Can't be with us in person? <a href="${esc(L.livestream)}" target="_blank" rel="noopener">Watch the service online</a>.`;
    n.hidden = false;
  }

  /* ------------------------------------------------------ travel -- */
  const T = S.travel || {};
  $("#travel-intro").textContent = T.intro || "";
  $("#airports").innerHTML = has(T.airports)
    ? T.airports.map((a) => `<li><strong>${esc(a.name)}</strong>${a.detail ? ` — ${esc(a.detail)}` : ""}</li>`).join("")
    : `<li class="placeholder">Airport details coming soon.</li>`;
  $("#getting-around").textContent = T.gettingAround || "";
  if (has(T.extra)) { const x = $("#travel-extra"); x.textContent = T.extra; x.hidden = false; }
  $("#hotels").innerHTML = has(T.hotels)
    ? T.hotels.map((h) => `
      <li class="hotel">
        <h4>${esc(h.name)}</h4>
        ${h.detail ? `<p>${esc(h.detail)}</p>` : ""}
        ${h.address ? `<p>${esc(h.address)}</p>` : ""}
        <div class="hotel-links">
          ${h.phone ? `<a href="tel:${esc(h.phone.replace(/[^\d+]/g, ""))}">${esc(h.phone)}</a>` : ""}
          ${h.address ? `<a href="${mapLink(h.address)}" target="_blank" rel="noopener">Map</a>` : ""}
          ${linkOK(h.url) ? `<a href="${esc(h.url)}" target="_blank" rel="noopener">Book a room</a>` : ""}
        </div>
      </li>`).join("")
    : `<li class="placeholder">Hotel recommendations coming soon.</li>`;

  /* ----------------------------------------------------- gallery -- */
  const grid = $("#gallery-grid");
  const photos = Array.isArray(S.gallery) ? S.gallery.filter((g) => has(g.src)) : [];
  if (grid) {
    if (!photos.length) {
      grid.innerHTML = `
        <div class="gallery-empty">
          <div class="placeholder">Photos of ${esc(P.shortName || "her")} are on their way.<br>
          <small>Family: drop images in the <code>images/</code> folder and list them under <code>gallery</code> in <code>content.js</code>.</small></div>
          <div class="gallery-frames" aria-hidden="true"><div></div><div></div><div></div><div></div></div>
        </div>`;
    } else {
      grid.innerHTML = photos.map((g, i) => `
        <button class="gallery-item reveal" type="button" data-index="${i}" aria-label="${esc(g.caption || `Photo ${i + 1}`)}">
          <img src="${esc(g.src)}" alt="${esc(g.caption || "")}" loading="lazy" decoding="async">
          ${g.caption ? `<figcaption>${esc(g.caption)}</figcaption>` : ""}
        </button>`).join("");
      initLightbox(photos);
    }
  }

  function initLightbox(items) {
    const lb = $("#lightbox"), img = $("#lb-img"), cap = $("#lb-caption");
    let idx = 0, lastFocus = null;
    const show = (i) => {
      idx = (i + items.length) % items.length;
      img.src = items[idx].src; img.alt = items[idx].caption || "";
      cap.textContent = items[idx].caption || "";
    };
    const open = (i) => { lastFocus = document.activeElement; show(i); lb.hidden = false; document.body.style.overflow = "hidden"; $(".lb-close").focus(); };
    const close = () => { lb.hidden = true; document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); };
    grid.addEventListener("click", (e) => { const b = e.target.closest("[data-index]"); if (b) open(+b.dataset.index); });
    $(".lb-close").addEventListener("click", close);
    $(".lb-prev").addEventListener("click", () => show(idx - 1));
    $(".lb-next").addEventListener("click", () => show(idx + 1));
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
    document.addEventListener("keydown", (e) => {
      if (lb.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(idx - 1);
      else if (e.key === "ArrowRight") show(idx + 1);
    });
    let x0 = null;
    lb.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
    lb.addEventListener("touchend", (e) => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) show(dx < 0 ? idx + 1 : idx - 1);
    });
  }

  /* ------------------------------------------------ share photos -- */
  const share = $("#share-actions");
  if (linkOK(L.googlePhotosAlbum)) {
    share.innerHTML = `<a class="btn btn-primary" href="${esc(L.googlePhotosAlbum)}" target="_blank" rel="noopener">Open the Shared Album</a>`;
  } else {
    share.innerHTML = `<span class="btn btn-primary is-disabled" aria-disabled="true">Shared Album — Link Coming Soon</span>`;
  }
  if (linkOK(L.memoriesForm)) {
    const n = $("#memories-note");
    n.innerHTML = `Prefer words to pictures? <a href="${esc(L.memoriesForm)}" target="_blank" rel="noopener">Share a memory or story</a> and we'll collect them for the family.`;
    n.hidden = false;
  }

  /* -------------------------------------------------------- rsvp -- */
  if (has(S.rsvpBy)) $("#rsvp-by").textContent = ` Kindly reply by ${S.rsvpBy}.`;
  const rsvp = $("#rsvp-body");
  if (linkOK(L.rsvpFormEmbed)) {
    rsvp.innerHTML = `<div class="form-embed"><iframe src="${esc(L.rsvpFormEmbed)}" title="RSVP form" loading="lazy">Loading…</iframe></div>
      <p class="section-note">Trouble with the form? <a href="${esc(L.rsvpForm || L.rsvpFormEmbed)}" target="_blank" rel="noopener">Open it in a new tab</a>.</p>`;
  } else if (linkOK(L.rsvpForm)) {
    rsvp.innerHTML = `<div class="cta-row"><a class="btn btn-primary" href="${esc(L.rsvpForm)}" target="_blank" rel="noopener">RSVP Now</a></div>`;
  } else {
    rsvp.innerHTML = `<div class="cta-row"><span class="btn btn-primary is-disabled" aria-disabled="true">RSVP — Opening Soon</span></div>`;
  }

  /* ------------------------------------------------------ donate -- */
  const D = S.donate || {};
  if (has(D.heading)) $("#donate-eyebrow").textContent = D.heading;
  $("#donate-text").textContent = D.text || "";
  $("#donate-actions").innerHTML = linkOK(L.gofundme)
    ? `<a class="btn btn-gold" href="${esc(L.gofundme)}" target="_blank" rel="noopener">Give in Her Memory</a>`
    : `<span class="btn btn-gold is-disabled" aria-disabled="true">Donation Link Coming Soon</span>`;

  /* ------------------------------------------------------ footer -- */
  const C = S.contact || {};
  const bits = [];
  if (has(C.email)) bits.push(`<a href="mailto:${esc(C.email)}">${esc(C.email)}</a>`);
  if (has(C.phone)) bits.push(`<a href="tel:${esc(C.phone.replace(/[^\d+]/g, ""))}">${esc(C.phone)}</a>`);
  $("#footer-contact").innerHTML = bits.length
    ? `Questions? Reach ${esc(C.name || "the family")} at ${bits.join(" · ")}.`
    : (has(C.name) ? `With love, ${esc(C.name)}` : "");

  /* --------------------------------------------------------- nav -- */
  const header = $(".site-header"), toggle = $(".nav-toggle"), menu = $("#nav-menu");
  const onScroll = () => header.classList.toggle("is-solid", window.scrollY > 40);
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
  toggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  });
  menu.addEventListener("click", (e) => {
    if (e.target.tagName === "A" && document.body.classList.contains("nav-open")) toggle.click();
  });

  /* ------------------------------------------------------ reveal -- */
  $$(".section > .container > *:not(.timeline):not(.gallery-grid), .event-card, .hotel, .quote-band .pull-quote").forEach((n) => n.classList.add("reveal"));
  const pending = () => $$(".reveal:not(.is-visible)");
  const inView = (n) => { const r = n.getBoundingClientRect(); return r.bottom > 0 && r.top < window.innerHeight * 0.96; };
  // Plain geometry check: runs on load/scroll/resize so nothing can stay hidden.
  let ticking = false;
  const check = () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => { pending().forEach((n) => { if (inView(n)) n.classList.add("is-visible"); }); ticking = false; });
  };
  window.addEventListener("scroll", check, { passive: true });
  window.addEventListener("resize", check);
  window.addEventListener("load", check);
  check();
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -4% 0px", threshold: 0.01 });
    pending().forEach((n) => io.observe(n));
  }
  // Last resort: after a few seconds, reveal anything still hidden.
  setTimeout(() => pending().forEach((n) => n.classList.add("is-visible")), 6000);
})();
