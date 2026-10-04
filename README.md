# In Memory of Dr. Marilyn Winters

A static memorial website for Marilyn's memorial weekend: her story, the schedule,
travel and lodging, photos, a shared photo album, RSVP, and a memorial fund.

No build step, no dependencies. Open `index.html` in a browser and it works.

## Editing the site

Everything you'd want to change is in **`content.js`**:

| Want to…                              | Edit this in `content.js`             |
| ------------------------------------- | ------------------------------------- |
| Paste the obituary                    | `story` (one string per paragraph)    |
| Add / change events                   | `events`                              |
| Hotels, airports, parking             | `travel`                              |
| Add photos to the gallery             | drop files in `images/`, list in `gallery` |
| Google Photos album link              | `links.googlePhotosAlbum`             |
| GoFundMe link                         | `links.gofundme`                      |
| RSVP Google Form                      | `links.rsvpForm` (and optionally `links.rsvpFormEmbed`) |
| Livestream link                       | `links.livestream`                    |
| Contact info in the footer            | `contact`                             |

Anything left as `""` or `[]` shows a tasteful "coming soon" placeholder,
so you can publish before every detail is final.

### Getting the Google Form embed URL
In the Form editor: **Send → `<>` (Embed HTML)** and copy only the URL inside `src="..."`.

### Changing colours or fonts
Tokens live at the top of `styles.css` under `:root`.

## Previewing locally

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploying (GitHub Pages)

1. Push this repo to GitHub.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Every push to `main` deploys automatically via `.github/workflows/pages.yml`.
4. Optional custom domain: add it under Settings → Pages and create a file named
   `CNAME` in the repo root containing just the domain.
