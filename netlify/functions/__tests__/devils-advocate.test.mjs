// devils-advocate.test.mjs — run: node netlify/functions/__tests__/devils-advocate.test.mjs
//
// Locks the SERVER-side safety guards for "the other read". The one that matters
// most: crisis language must short-circuit BEFORE the model is ever called.
import assert from "node:assert";

let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };

const { handler } = await import("../devils-advocate.js");

// unique IP per call so the per-IP rate limiter doesn't bleed across cases
let ipSeq = 0;
function evt({ method = "POST", origin, body = "{}", ip } = {}) {
  const headers = { "x-forwarded-for": ip || `10.0.0.${++ipSeq}` };
  if (origin) headers.origin = origin;
  return { httpMethod: method, headers, body };
}
const parse = (res) => JSON.parse(res.body || "{}");

// ── CORS / method / origin ────────────────────────────────────────────────
let res = await handler(evt({ method: "OPTIONS" }));
ok(res.statusCode === 204, "OPTIONS → 204");

res = await handler(evt({ method: "GET" }));
ok(res.statusCode === 405, "GET → 405 method not allowed");

res = await handler(evt({ method: "POST", origin: "https://evil.example.com", body: JSON.stringify({ thought: "a real distortion" }) }));
ok(res.statusCode === 403, "disallowed origin → 403");

// no-origin (native app) is allowed through to validation
res = await handler(evt({ body: "not json" }));
ok(res.statusCode === 400, "invalid JSON → 400");

// ── input validation ──────────────────────────────────────────────────────
res = await handler(evt({ body: JSON.stringify({ thought: "no" }) }));
ok(res.statusCode === 400, "thought < 4 chars → 400");

res = await handler(evt({ body: JSON.stringify({}) }));
ok(res.statusCode === 400, "missing thought → 400");

// ── ★ CRISIS SHORT-CIRCUIT BEFORE THE MODEL ★ ─────────────────────────────
process.env.OPENAI_API_KEY = "test-key"; // key present, so this proves it's the
                                          // crisis check returning early, not the key check
let fetchCalled = false;
globalThis.fetch = async () => { fetchCalled = true; throw new Error("model must NOT be called on crisis"); };

for (const phrase of ["I want to kill myself", "I'm going to hurt myself", "I don't want to be alive"]) {
  fetchCalled = false;
  res = await handler(evt({ body: JSON.stringify({ thought: phrase }) }));
  const p = parse(res);
  ok(res.statusCode === 200, `crisis "${phrase.slice(0, 18)}…" → 200 (graceful)`);
  ok(p.arguable === false && p.isCrisis === true, "crisis → arguable:false + isCrisis:true");
  ok(p.other_read === null, "crisis → never a counter-read");
  ok(fetchCalled === false, "crisis NEVER reaches the model (fetch not called)");
}

// ── model path: valid counter-read passes through ─────────────────────────
globalThis.fetch = async () => ({
  ok: true,
  json: async () => ({ choices: [{ message: { content: JSON.stringify({ arguable: true, other_read: "One honest other read.", note: null }) } }] }),
});
res = await handler(evt({ body: JSON.stringify({ thought: "they are all done with me" }) }));
let p = parse(res);
ok(res.statusCode === 200 && p.arguable === true, "valid model output → 200 arguable:true");
ok(p.other_read === "One honest other read.", "counter-read passes through");

// ── server FAIL CLOSED: model says arguable but gives no text → not arguable
globalThis.fetch = async () => ({
  ok: true,
  json: async () => ({ choices: [{ message: { content: JSON.stringify({ arguable: true, other_read: "" }) } }] }),
});
res = await handler(evt({ body: JSON.stringify({ thought: "they are all done with me" }) }));
p = parse(res);
ok(res.statusCode === 200 && p.arguable === false, "arguable:true w/ empty text → server returns not-arguable");
ok(p.other_read === null, "no phantom counter-read from the server");

// ── refusal passes through (arguable:false + note) ────────────────────────
globalThis.fetch = async () => ({
  ok: true,
  json: async () => ({ choices: [{ message: { content: JSON.stringify({ arguable: false, other_read: null, note: "That's a real boundary." }) } }] }),
});
res = await handler(evt({ body: JSON.stringify({ thought: "I will not be yelled at" }) }));
p = parse(res);
ok(res.statusCode === 200 && p.arguable === false && p.note === "That's a real boundary.", "refusal passes through with note");

// ── malformed model output (non-JSON content) → 502, never a counter-read ─
globalThis.fetch = async () => ({ ok: true, json: async () => ({ choices: [{ message: { content: "not json at all" } }] }) });
res = await handler(evt({ body: JSON.stringify({ thought: "they are all done with me" }) }));
ok(res.statusCode === 502, "malformed model JSON → 502 (no fabricated output)");

// ── missing API key (non-crisis) → 500 ────────────────────────────────────
delete process.env.OPENAI_API_KEY;
res = await handler(evt({ body: JSON.stringify({ thought: "they are all done with me" }) }));
ok(res.statusCode === 500, "no API key (non-crisis) → 500");

// ── rate limit: 9th request from one IP → 429 ─────────────────────────────
process.env.OPENAI_API_KEY = "test-key";
globalThis.fetch = async () => ({ ok: true, json: async () => ({ choices: [{ message: { content: JSON.stringify({ arguable: false, other_read: null, note: "n" }) } }] }) });
const rlIp = "203.0.113.7";
let got429 = false;
for (let i = 0; i < 12; i++) {
  const rr = await handler(evt({ body: JSON.stringify({ thought: "a testable thought here" }), ip: rlIp }));
  if (rr.statusCode === 429) { got429 = true; break; }
}
ok(got429, "per-IP rate limit trips (429) within the window");

console.log(`devils-advocate.test.mjs — ${n}/${n} PASS`);
