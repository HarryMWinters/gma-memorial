#!/usr/bin/env node
/* One-time Google setup for the memories Worker. No dependencies.
 *
 *   GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... node scripts/google-setup.mjs
 *
 * 1. Opens a Google sign-in (do it with the family account that should own the files).
 * 2. Creates a Drive folder "Marilyn Winters - Memories" and a Sheet "Memories" inside it.
 * 3. Prints the refresh token + IDs and the exact wrangler commands to store them.
 *
 * Uses only the drive.file scope: the Worker can see files it created, nothing else
 * in the account.
 */
import http from "node:http";
import { randomBytes } from "node:crypto";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const FOLDER_NAME = process.env.FOLDER_NAME || "Marilyn Winters - Memories";
if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (OAuth client of type 'Desktop app'). See worker/README.md.");
  process.exit(1);
}

const SCOPE = "https://www.googleapis.com/auth/drive.file";
const state = randomBytes(16).toString("hex");

const code = await new Promise((resolve, reject) => {
  const server = http.createServer((req, res) => {
    const u = new URL(req.url, "http://127.0.0.1");
    if (u.pathname !== "/") { res.writeHead(404).end(); return; }
    const err = u.searchParams.get("error");
    if (err || u.searchParams.get("state") !== state) {
      res.end("Sign-in failed. You can close this tab and check the terminal.");
      server.close(); reject(new Error(err || "state mismatch")); return;
    }
    res.end("Signed in. You can close this tab and return to the terminal.");
    server.close(); resolve({ code: u.searchParams.get("code"), redirect: server.redirect });
  });
  server.listen(0, "127.0.0.1", () => {
    server.redirect = `http://127.0.0.1:${server.address().port}`;
    const auth = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    auth.search = new URLSearchParams({
      client_id: CLIENT_ID, redirect_uri: server.redirect, response_type: "code",
      scope: SCOPE, access_type: "offline", prompt: "consent", state,
    });
    console.log("\nOpen this URL in your browser and sign in with the account that should own the memories:\n");
    console.log(auth.toString() + "\n");
  });
});

const tokRes = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ code: code.code, client_id: CLIENT_ID, client_secret: CLIENT_SECRET, redirect_uri: code.redirect, grant_type: "authorization_code" }),
});
const tok = await tokRes.json();
if (!tok.refresh_token) { console.error("No refresh token returned:", tok); process.exit(1); }
const H = { Authorization: `Bearer ${tok.access_token}`, "Content-Type": "application/json" };

async function call(url, body, method = "POST") {
  const r = await fetch(url, { method, headers: H, body: body && JSON.stringify(body) });
  const data = await r.json();
  if (!r.ok) { console.error(`Google API error ${r.status}:`, data); process.exit(1); }
  return data;
}

const folder = await call("https://www.googleapis.com/drive/v3/files?fields=id", { name: FOLDER_NAME, mimeType: "application/vnd.google-apps.folder" });
const sheet = await call("https://sheets.googleapis.com/v4/spreadsheets", {
  properties: { title: "Memories" },
  sheets: [{ properties: { title: "Memories", gridProperties: { frozenRowCount: 1 } } }],
});
await call(`https://sheets.googleapis.com/v4/spreadsheets/${sheet.spreadsheetId}/values/Memories!A1:F1?valueInputOption=RAW`,
  { values: [["Submitted (UTC)", "Name", "Email", "Memory", "Files", "Files folder"]] }, "PUT");
// Put the sheet inside the folder so everything lives in one place.
await call(`https://www.googleapis.com/drive/v3/files/${sheet.spreadsheetId}?addParents=${folder.id}&removeParents=root&fields=id`, {}, "PATCH");

console.log(`
Done. Drive folder: https://drive.google.com/drive/folders/${folder.id}
      Sheet:        https://docs.google.com/spreadsheets/d/${sheet.spreadsheetId}

1) In worker/wrangler.toml set:
     DRIVE_FOLDER_ID = "${folder.id}"
     SHEET_ID = "${sheet.spreadsheetId}"

2) Store the secrets (paste each value when prompted):
     npx wrangler secret put GOOGLE_CLIENT_ID       # ${CLIENT_ID}
     npx wrangler secret put GOOGLE_CLIENT_SECRET
     npx wrangler secret put GOOGLE_REFRESH_TOKEN

   Refresh token (treat like a password, don't commit it):
     ${tok.refresh_token}
`);
