# Memories backend (Cloudflare Worker)

Powers the **Share a Memory** form on the site. Guests submit their name, email,
a written memory, and optional photos/videos. **No sign-in needed for guests.**

Where things land (all in the family's Google account):

- **Google Sheet "Memories"**: one row per submission (time, name, email, memory, file count, link to files).
- **Drive folder "Marilyn Winters - Memories"**: one subfolder per submission holding its photos/videos.

How uploads work: the Worker checks the spam test, saves the text to the Sheet,
and asks Drive for one upload link per file. The guest's browser then uploads
each file **straight to Google Drive**, so big videos never pass through the
Worker (whose request limit is 100 MB). The defaults allow 10 files, up to 1 GB each.

---

## One-time setup (~45 min)

Commands below are for **PowerShell** (Windows). Run them from the `worker` folder.

### 1. Google Cloud: OAuth client

1. Go to <https://console.cloud.google.com/> and create a project (e.g. `gma-memorial`).
2. **APIs & Services → Library**: enable **Google Drive API** and **Google Sheets API**.
3. **APIs & Services → OAuth consent screen**: choose **External**, fill in the app name
   and your email. No scopes need adding here.
4. **Important:** set **Publishing status → In production**. In "Testing" mode Google
   expires the refresh token after 7 days and the form silently stops working.
   (The app only uses the non-sensitive `drive.file` scope, so no Google review is needed.
   You'll see an "unverified app" warning once when you sign in. Click
   *Advanced → Go to … (unsafe)*. That's expected for your own app.)
5. **APIs & Services → Credentials → Create credentials → OAuth client ID**,
   type **Desktop app**. Copy the client ID and secret.

### 2. Create the Sheet + Drive folder and get a refresh token

```powershell
cd worker
npm install
$env:GOOGLE_CLIENT_ID="...apps.googleusercontent.com"
$env:GOOGLE_CLIENT_SECRET="..."
npm run google-setup
```

Open the printed link and sign in with the **Google account that should own the memories**
(the family account). The script creates the folder and Sheet and prints:
`DRIVE_FOLDER_ID`, `SHEET_ID`, and the refresh token.

`drive.file` means the Worker can only see files it created. It can't read anything
else in that Google account.

### 3. Cloudflare: Turnstile (spam check)

1. Sign up / log in at <https://dash.cloudflare.com/> (free plan is fine).
2. **Turnstile → Add widget**. Hostnames: `harrymwinters.github.io` (and `localhost` for testing).
   Mode: **Managed**. Copy the **site key** and **secret key**.

### 4. Deploy the Worker

1. Put `DRIVE_FOLDER_ID` and `SHEET_ID` into `wrangler.toml`. These are IDs, not secrets, so they're fine to commit.
2. If the site uses a custom domain, add it to `ALLOWED_ORIGINS` in `wrangler.toml`.
3. Then:

```powershell
npx wrangler login
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET
npx wrangler secret put GOOGLE_REFRESH_TOKEN
npx wrangler secret put TURNSTILE_SECRET
npx wrangler deploy
```

`deploy` prints a URL like `https://gma-memorial-memories.<account>.workers.dev`.

### 5. Point the site at it

In `content.js`:

```js
memories: {
  endpoint: "https://gma-memorial-memories.<account>.workers.dev/memories",
  turnstileSiteKey: "<Turnstile site key>",
  ...
}
```

Push, wait for GitHub Pages to deploy, then **test on the live site with a real photo
and a phone video.** Check that the row appears in the Sheet and the files land in the
Drive folder. (The browser-to-Drive upload step can only be tested against real Google.)

---

## Local development

```powershell
cd worker
"DEV_SKIP_TURNSTILE=true" | Out-File -Encoding ascii .dev.vars   # skip the spam check locally
npm run dev                                                      # http://localhost:8787
```

Secrets for local dev go in `.dev.vars` too (`GOOGLE_CLIENT_ID=...` etc., one per line).
That file is git-ignored. Set `memories.endpoint` to `http://localhost:8787/memories`,
leave `turnstileSiteKey` empty, and serve the site on port 8000 (`python -m http.server 8000`).

Tests (Google and Turnstile are mocked): `npm test`

## Changing limits

`MAX_FILES` / `MAX_FILE_MB` in `wrangler.toml` are enforced by the Worker. Keep
`memories.maxFiles` / `maxFileMB` in `content.js` in sync so guests see the right limits.
