// otherReadApi.test.mjs — run: node src/v2/lib/__tests__/otherReadApi.test.mjs
//
// Locks the CLIENT-side safety contract for "the other read": it must fail
// CLOSED. Anything that isn't an explicit, well-formed arguable:true counter-read
// becomes a safe not-arguable / error — never a fabricated counter-argument.
import assert from "node:assert";

let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };

// swap global.fetch per case
function mockFetch(impl) { globalThis.fetch = impl; }

const { getOtherRead } = await import("../otherReadApi.js");

// ── input guard: too-short thought never hits the network ─────────────────
let called = false;
mockFetch(async () => { called = true; return { status: 200, ok: true, json: async () => ({}) }; });
let r = await getOtherRead({ thought: "no" });
ok(r.arguable === false && r.error, "thought < 4 chars → error, no counter-read");
ok(called === false, "short thought never calls the network");

// ── arguable:true + well-formed → passes through ──────────────────────────
mockFetch(async () => ({ status: 200, ok: true, json: async () => ({ arguable: true, other_read: "Here is one other way to read it.", note: null }) }));
r = await getOtherRead({ thought: "they're all done with me" });
ok(r.arguable === true && r.otherRead === "Here is one other way to read it.", "well-formed counter-read passes through");
ok(r.error === null, "no error on success");

// ── arguable:false + note → not-arguable (the refusal path) ───────────────
mockFetch(async () => ({ status: 200, ok: true, json: async () => ({ arguable: false, other_read: null, note: "That reads as a real boundary." }) }));
r = await getOtherRead({ thought: "I won't be spoken to that way" });
ok(r.arguable === false && r.otherRead === null, "refusal → not arguable, no counter-read");
ok(r.note === "That reads as a real boundary.", "refusal note surfaced");
ok(r.error === null, "refusal is not an error");

// ── crisis short-circuit shape → crisis flag, no counter-read ─────────────
mockFetch(async () => ({ status: 200, ok: true, json: async () => ({ arguable: false, other_read: null, note: "…real person, not a counter-argument.", isCrisis: true }) }));
r = await getOtherRead({ thought: "some heavy thing" });
ok(r.arguable === false && r.crisis === true, "crisis payload → crisis flag set");
ok(r.otherRead === null, "crisis → never a counter-read");

// ── FAIL CLOSED: arguable:true but other_read missing → NOT a counter-read ─
mockFetch(async () => ({ status: 200, ok: true, json: async () => ({ arguable: true, other_read: null }) }));
r = await getOtherRead({ thought: "a real distortion here" });
ok(r.arguable === false || r.error, "arguable:true w/ empty other_read never yields a phantom counter-read");
ok(!r.otherRead, "no counter-read text when the model gave none");

// ── FAIL CLOSED: garbage/missing arguable field → not arguable ────────────
mockFetch(async () => ({ status: 200, ok: true, json: async () => ({ foo: "bar" }) }));
r = await getOtherRead({ thought: "a real distortion here" });
ok(r.arguable === false, "missing arguable field → not arguable (fail closed)");
ok(!r.otherRead, "no counter-read on malformed payload");

// ── FAIL CLOSED: arguable is a truthy non-true value → not arguable ───────
mockFetch(async () => ({ status: 200, ok: true, json: async () => ({ arguable: "yes", other_read: "sneaky" }) }));
r = await getOtherRead({ thought: "a real distortion here" });
ok(r.arguable === false, "arguable must be strictly true; 'yes' → not arguable");
ok(r.otherRead === null, "no counter-read when arguable isn't strictly true");

// ── status codes → clean errors, never a counter-read ─────────────────────
for (const [status, label] of [[403, "origin"], [429, "rate limit"], [500, "server"]]) {
  mockFetch(async () => ({ status, ok: false, json: async () => ({}) }));
  r = await getOtherRead({ thought: "a real distortion here" });
  ok(r.arguable === false && r.error && !r.otherRead, `HTTP ${status} (${label}) → error, no counter-read`);
}

// ── network throw → error, never a counter-read ───────────────────────────
mockFetch(async () => { throw new Error("network down"); });
r = await getOtherRead({ thought: "a real distortion here" });
ok(r.arguable === false && r.error && !r.otherRead, "network throw → error, fail closed");

// ── empty-string other_read on arguable:true → error, no phantom ──────────
mockFetch(async () => ({ status: 200, ok: true, json: async () => ({ arguable: true, other_read: "   " }) }));
r = await getOtherRead({ thought: "a real distortion here" });
ok(!r.otherRead, "whitespace-only counter-read is treated as empty");

console.log(`otherReadApi.test.mjs — ${n}/${n} PASS`);
