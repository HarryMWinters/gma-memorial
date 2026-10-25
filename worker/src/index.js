/* Memories backend for the memorial site (Cloudflare Worker).
 *
 * POST /memories  (JSON)
 *   { name, email, memory, files: [{ name, type, size }], turnstileToken, website }
 *   - verifies Cloudflare Turnstile (spam protection)
 *   - appends a row to the Google Sheet: time, name, email, memory, #files, folder link
 *   - if files: creates a Drive subfolder for this submission and one resumable
 *     upload session per file. Returns the session URLs; the browser PUTs each
 *     file straight to Google Drive, so big videos never pass through the Worker.
 *
 * Google auth uses an OAuth refresh token for the family's own Google account
 * (scope drive.file), so files are owned by that account. See worker/README.md.
 */

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const DRIVE_FILES = "https://www.googleapis.com/drive/v3/files";
const DRIVE_UPLOAD = "https://www.googleapis.com/upload/drive/v3/files";
const SHEETS = "https://sheets.googleapis.com/v4/spreadsheets";
const TURNSTILE_VERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const LIMITS = { name: 200, email: 254, memory: 20000, fileName: 200 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = allowedOrigins(env);
    const cors = allowed.includes(origin)
      ? { "Access-Control-Allow-Origin": origin, "Vary": "Origin" }
      : {};

    if (request.method === "OPTIONS") {
      if (!cors["Access-Control-Allow-Origin"]) return new Response(null, { status: 403 });
      return new Response(null, {
        status: 204,
        headers: { ...cors, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "86400" },
      });
    }

    const url = new URL(request.url);
    try {
      if (url.pathname !== "/memories") throw new HttpError(404, "Not found");
      if (request.method !== "POST") throw new HttpError(405, "Method not allowed");
      if (!cors["Access-Control-Allow-Origin"]) throw new HttpError(403, "Origin not allowed");
      const body = await readJson(request);
      const result = await handleMemory(body, request, env, origin);
      return json(result, 200, cors);
    } catch (err) {
      const status = err instanceof HttpError ? err.status : 500;
      if (status === 500) console.error(err);
      return json({ ok: false, error: status === 500 ? "Something went wrong saving your memory. Please try again." : err.message }, status, cors);
    }
  },
};

async function handleMemory(body, request, env, origin) {
  // Honeypot: real people never fill the hidden "website" field.
  if (typeof body.website === "string" && body.website.trim()) return { ok: true, uploads: [] };

  const sub = validate(body, env);
  await verifyTurnstile(body.turnstileToken, request, env);

  const token = await getAccessToken(env);
  const now = new Date();
  let folderId = "";
  if (sub.files.length) {
    folderId = await createFolder(token, `${now.toISOString().slice(0, 10)} ${sub.name}`, env.DRIVE_FOLDER_ID);
  }

  // Save the text first so the memory is kept even if an upload fails later.
  await appendRow(token, env.SHEET_ID, [
    now.toISOString(), sub.name, sub.email, sub.memory, String(sub.files.length),
    folderId ? `https://drive.google.com/drive/folders/${folderId}` : "",
  ]);

  const uploads = [];
  for (const f of sub.files) {
    uploads.push({ name: f.name, url: await startUpload(token, f, folderId, origin) });
  }
  return { ok: true, uploads };
}

/* ---------------------------------------------------------------- validation */
export function validate(body, env) {
  const str = (v) => (typeof v === "string" ? v.trim() : "");
  const name = str(body.name), email = str(body.email), memory = str(body.memory);
  const maxFiles = Number(env.MAX_FILES || 10);
  const maxBytes = Number(env.MAX_FILE_MB || 1024) * 1024 * 1024;

  if (!name) throw new HttpError(400, "Please enter your name.");
  if (name.length > LIMITS.name) throw new HttpError(400, "Name is too long.");
  if (!email || email.length > LIMITS.email || !EMAIL_RE.test(email)) throw new HttpError(400, "Please enter a valid email address.");
  if (memory.length > LIMITS.memory) throw new HttpError(400, `Please keep your memory under ${LIMITS.memory.toLocaleString("en-US")} characters.`);

  const files = Array.isArray(body.files) ? body.files : [];
  if (files.length > maxFiles) throw new HttpError(400, `Please upload at most ${maxFiles} files at a time.`);
  const clean = files.map((f) => {
    const type = str(f && f.type).toLowerCase();
    const size = Number(f && f.size);
    const fname = (str(f && f.name) || "upload").replace(/[\\/\u0000-\u001f]/g, "_").slice(0, LIMITS.fileName);
    if (!/^(image|video)\/[\w.+-]+$/.test(type)) throw new HttpError(400, `"${fname}" isn't a photo or video.`);
    if (!Number.isFinite(size) || size <= 0) throw new HttpError(400, `"${fname}" looks empty.`);
    if (size > maxBytes) throw new HttpError(400, `"${fname}" is larger than ${env.MAX_FILE_MB || 1024} MB.`);
    return { name: fname, type, size };
  });

  if (!memory && !clean.length) throw new HttpError(400, "Please write a memory or add a photo or video.");
  return { name, email, memory, files: clean };
}

async function verifyTurnstile(token, request, env) {
  if (env.DEV_SKIP_TURNSTILE === "true") return;
  if (!env.TURNSTILE_SECRET) throw new Error("TURNSTILE_SECRET is not configured");
  if (typeof token !== "string" || !token) throw new HttpError(400, "Please complete the spam check and try again.");
  const form = new FormData();
  form.append("secret", env.TURNSTILE_SECRET);
  form.append("response", token);
  const ip = request.headers.get("CF-Connecting-IP");
  if (ip) form.append("remoteip", ip);
  const r = await fetch(TURNSTILE_VERIFY, { method: "POST", body: form });
  const data = await r.json().catch(() => ({}));
  if (!data.success) throw new HttpError(400, "The spam check failed. Please refresh the page and try again.");
}

/* -------------------------------------------------------------------- google */
let cached = { token: "", exp: 0 };

export async function getAccessToken(env) {
  if (cached.token && Date.now() < cached.exp - 60_000) return cached.token;
  const r = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      refresh_token: env.GOOGLE_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || !data.access_token) throw new Error(`Google token refresh failed: ${r.status} ${JSON.stringify(data)}`);
  cached = { token: data.access_token, exp: Date.now() + (data.expires_in || 3600) * 1000 };
  return cached.token;
}
export function _resetTokenCache() { cached = { token: "", exp: 0 }; }

async function google(url, token, init = {}) {
  const r = await fetch(url, { ...init, headers: { Authorization: `Bearer ${token}`, ...(init.headers || {}) } });
  if (!r.ok) throw new Error(`Google API ${init.method || "GET"} ${url.split("?")[0]} failed: ${r.status} ${await r.text()}`);
  return r;
}

async function createFolder(token, name, parentId) {
  const r = await google(`${DRIVE_FILES}?fields=id`, token, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, mimeType: "application/vnd.google-apps.folder", parents: [parentId] }),
  });
  return (await r.json()).id;
}

async function appendRow(token, sheetId, row) {
  // RAW input: nothing a visitor types is ever evaluated as a formula.
  const range = encodeURIComponent("Memories!A:F");
  await google(`${SHEETS}/${sheetId}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, token, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ values: [row] }),
  });
}

async function startUpload(token, file, folderId, origin) {
  // Passing the site's Origin lets the browser upload to the session URL directly (CORS).
  const r = await google(`${DRIVE_UPLOAD}?uploadType=resumable&fields=id`, token, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "X-Upload-Content-Type": file.type,
      "X-Upload-Content-Length": String(file.size),
      Origin: origin,
    },
    body: JSON.stringify({ name: file.name, parents: [folderId] }),
  });
  const loc = r.headers.get("Location");
  if (!loc) throw new Error("Drive did not return an upload URL");
  return loc;
}

/* ------------------------------------------------------------------- helpers */
function allowedOrigins(env) {
  return String(env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
}

async function readJson(request) {
  const len = Number(request.headers.get("Content-Length") || 0);
  if (len > 200_000) throw new HttpError(413, "Submission is too large.");
  try { return await request.json(); } catch { throw new HttpError(400, "Invalid request."); }
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", ...headers } });
}
