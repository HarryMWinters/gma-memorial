import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import worker, { _resetTokenCache } from "../src/index.js";

const ORIGIN = "https://harrymwinters.github.io";
const env = {
  ALLOWED_ORIGINS: `${ORIGIN},http://localhost:8000`,
  DRIVE_FOLDER_ID: "ROOT", SHEET_ID: "SHEET", MAX_FILES: "3", MAX_FILE_MB: "10",
  GOOGLE_CLIENT_ID: "cid", GOOGLE_CLIENT_SECRET: "csec", GOOGLE_REFRESH_TOKEN: "rt",
  TURNSTILE_SECRET: "tsec",
};

let calls;
function mockFetch({ turnstileOk = true } = {}) {
  calls = [];
  globalThis.fetch = async (url, init = {}) => {
    url = String(url);
    calls.push({ url, init });
    if (url.includes("turnstile")) return Response.json({ success: turnstileOk });
    if (url.startsWith("https://oauth2.googleapis.com/token")) return Response.json({ access_token: "AT", expires_in: 3600 });
    if (url.startsWith("https://www.googleapis.com/drive/v3/files")) return Response.json({ id: "SUBFOLDER" });
    if (url.includes(":append")) return Response.json({});
    if (url.startsWith("https://www.googleapis.com/upload/drive/v3/files")) {
      const name = JSON.parse(init.body).name;
      return new Response("{}", { headers: { Location: `https://upload.example/${encodeURIComponent(name)}` } });
    }
    throw new Error("unexpected fetch " + url);
  };
}

const post = (body, origin = ORIGIN) => new Request("https://w.example/memories", {
  method: "POST", headers: { "Content-Type": "application/json", Origin: origin }, body: JSON.stringify(body),
});
const good = { name: "Aunt Jo", email: "jo@example.com", memory: "She taught me to fish.", turnstileToken: "tok" };

beforeEach(() => { _resetTokenCache(); mockFetch(); });

test("text-only memory is appended to the sheet as RAW, no folder created", async () => {
  const r = await worker.fetch(post(good), env);
  assert.equal(r.status, 200);
  assert.equal(r.headers.get("Access-Control-Allow-Origin"), ORIGIN);
  assert.deepEqual(await r.json(), { ok: true, uploads: [] });
  const append = calls.find((c) => c.url.includes(":append"));
  assert.match(append.url, /valueInputOption=RAW/);
  const row = JSON.parse(append.init.body).values[0];
  assert.deepEqual(row.slice(1), ["Aunt Jo", "jo@example.com", "She taught me to fish.", "0", ""]);
  assert.ok(!calls.some((c) => c.url.startsWith("https://www.googleapis.com/drive/v3/files")));
});

test("files: creates subfolder, saves row with folder link, returns one upload URL per file", async () => {
  const files = [{ name: "beach.jpg", type: "image/jpeg", size: 1000 }, { name: "toast.mov", type: "video/quicktime", size: 2000 }];
  const r = await worker.fetch(post({ ...good, files }), env);
  const data = await r.json();
  assert.equal(r.status, 200, JSON.stringify(data));
  assert.deepEqual(data.uploads.map((u) => u.url), ["https://upload.example/beach.jpg", "https://upload.example/toast.mov"]);
  const folder = calls.find((c) => c.url.startsWith("https://www.googleapis.com/drive/v3/files"));
  assert.deepEqual(JSON.parse(folder.init.body).parents, ["ROOT"]);
  const row = JSON.parse(calls.find((c) => c.url.includes(":append")).init.body).values[0];
  assert.equal(row[5], "https://drive.google.com/drive/folders/SUBFOLDER");
  const up = calls.filter((c) => c.url.startsWith("https://www.googleapis.com/upload"));
  assert.equal(up.length, 2);
  assert.equal(up[0].init.headers.Origin, ORIGIN);
  assert.equal(up[0].init.headers["X-Upload-Content-Length"], "1000");
  assert.deepEqual(JSON.parse(up[1].init.body).parents, ["SUBFOLDER"]);
  // access token fetched once and reused
  assert.equal(calls.filter((c) => c.url.includes("oauth2")).length, 1);
});

test("photo-only submission (no text) is allowed", async () => {
  const r = await worker.fetch(post({ ...good, memory: "", files: [{ name: "a.png", type: "image/png", size: 5 }] }), env);
  assert.equal(r.status, 200);
});

const bad = [
  ["missing name", { ...good, name: " " }, /name/],
  ["bad email", { ...good, email: "nope" }, /email/],
  ["nothing to save", { ...good, memory: "" }, /memory or add/],
  ["non-media file", { ...good, files: [{ name: "x.exe", type: "application/octet-stream", size: 5 }] }, /photo or video/],
  ["too big", { ...good, files: [{ name: "big.mp4", type: "video/mp4", size: 11 * 1024 * 1024 }] }, /larger than 10 MB/],
  ["too many", { ...good, files: Array(4).fill({ name: "a.jpg", type: "image/jpeg", size: 1 }) }, /at most 3/],
  ["no turnstile token", { ...good, turnstileToken: "" }, /spam check/],
];
for (const [label, body, re] of bad) {
  test(`rejects: ${label}`, async () => {
    const r = await worker.fetch(post(body), env);
    assert.equal(r.status, 400);
    assert.match((await r.json()).error, re);
    assert.ok(!calls.some((c) => c.url.includes("googleapis")), "no Google calls on invalid input");
  });
}

test("rejects failed turnstile", async () => {
  mockFetch({ turnstileOk: false });
  const r = await worker.fetch(post(good), env);
  assert.equal(r.status, 400);
  assert.ok(!calls.some((c) => c.url.includes("googleapis")));
});

test("honeypot silently succeeds without saving", async () => {
  const r = await worker.fetch(post({ ...good, website: "spam.biz" }), env);
  assert.equal(r.status, 200);
  assert.equal(calls.length, 0);
});

test("unknown origin is refused, preflight allowed for known origin", async () => {
  assert.equal((await worker.fetch(post(good, "https://evil.example"), env)).status, 403);
  const pre = await worker.fetch(new Request("https://w.example/memories", { method: "OPTIONS", headers: { Origin: ORIGIN } }), env);
  assert.equal(pre.status, 204);
  assert.equal(pre.headers.get("Access-Control-Allow-Origin"), ORIGIN);
});

test("Google failure returns a friendly 500", async () => {
  globalThis.fetch = async (url) => String(url).includes("turnstile") ? Response.json({ success: true }) : new Response("boom", { status: 500 });
  const orig = console.error; console.error = () => {};
  const r = await worker.fetch(post(good), env);
  console.error = orig;
  assert.equal(r.status, 500);
  assert.match((await r.json()).error, /try again/);
});
