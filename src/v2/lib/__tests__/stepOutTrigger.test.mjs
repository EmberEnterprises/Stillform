// stepOutTrigger.test.mjs — run: node src/v2/lib/__tests__/stepOutTrigger.test.mjs
//
// The Step Out trigger is the values-clean detector: a loop the user ALREADY
// confirmed whose own token RECURRED in recent signals. Pure arithmetic over the
// user's own tokens — no AI, no inference. These tests lock the detection, the
// active-window gate, and the dismissal state machine.
import assert from "node:assert";

const store = new Map();
const ls = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};
globalThis.localStorage = ls;
globalThis.window = { localStorage: ls };

const {
  getActiveLoopOffer, markStepOutOffered, markStepOutDismissed, markStepOutAccepted, _config,
} = await import("../stepOutTrigger.js");

let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };

const F_KEY = "stillform_discovery_findings";
const S_KEY = "stillform_signal_log";
const D_KEY = "stillform_stepout_dismissals";

const seedFindings = (confirmed) => store.set(F_KEY, JSON.stringify({ confirmed, rejected: [] }));
const seedSignals = (entries) => store.set(S_KEY, JSON.stringify({ entries }));
const isoAgo = (days) => new Date(Date.now() - days * 86400000).toISOString();

// a confirmed sequence loop: conflict → exhausted (tokens live in the label's curly quotes)
const LOOP = {
  id: "seq:conflict>exhausted",
  kind: "sequence",
  label: "\u201cconflict\u201d tends to precede \u201cexhausted\u201d by about 2 days.",
  confirmedAt: Date.now(),
};

// ── honest-empty: nothing confirmed → no offer ────────────────────────────
store.clear();
ok(getActiveLoopOffer() === null, "no confirmed findings → null");

// ── confirmed loop but no matching recent signal → no offer ───────────────
store.clear();
seedFindings([LOOP]);
seedSignals([{ chip: "calm", triggers: [], body: [], loggedAt: isoAgo(0) }]);
ok(getActiveLoopOffer() === null, "confirmed loop, token not recurring → null");

// ── confirmed loop + recent matching signal → OFFER ───────────────────────
store.clear();
seedFindings([LOOP]);
seedSignals([{ chip: "exhausted", triggers: ["conflict"], body: [], loggedAt: isoAgo(0) }]);
let offer = getActiveLoopOffer();
ok(offer && offer.findingId === "seq:conflict>exhausted", "active loop → offer with findingId");
ok(offer.label === LOOP.label, "offer carries the loop label");

// ── ★ active-window gate: an OLD matching signal must NOT count ────────────
// (regression guard for the ISO-string loggedAt fix — window is real)
store.clear();
seedFindings([LOOP]);
seedSignals([{ chip: "exhausted", triggers: ["conflict"], body: [], loggedAt: isoAgo(_config.ACTIVE_WINDOW_DAYS + 2) }]);
ok(getActiveLoopOffer() === null, "matching signal older than the active window → null");

// signal exactly inside the window still counts
store.clear();
seedFindings([LOOP]);
seedSignals([{ chip: "exhausted", triggers: [], body: [], loggedAt: isoAgo(_config.ACTIVE_WINDOW_DAYS - 1) }]);
ok(getActiveLoopOffer() !== null, "matching signal inside the window → offer");

// ── cadence: re-fire window gates a second immediate surface ──────────────
store.clear();
seedFindings([LOOP]);
seedSignals([{ chip: "exhausted", triggers: ["conflict"], body: [], loggedAt: isoAgo(0) }]);
ok(getActiveLoopOffer() !== null, "eligible before any offer");
markStepOutOffered("seq:conflict>exhausted");
ok(getActiveLoopOffer() === null, "just offered → re-fire window blocks a second surface");

// after the re-fire window elapses, eligible again
store.set(D_KEY, JSON.stringify({ "seq:conflict>exhausted": { dismissals: 0, lastOfferedAt: Date.now() - (_config.REFIRE_WINDOW_MS + 1000) } }));
ok(getActiveLoopOffer() !== null, "past the re-fire window → eligible again");

// ── cadence: MAX_DISMISSALS closes the loop ───────────────────────────────
store.clear();
seedFindings([LOOP]);
seedSignals([{ chip: "exhausted", triggers: ["conflict"], body: [], loggedAt: isoAgo(0) }]);
for (let i = 0; i < _config.MAX_DISMISSALS; i++) {
  // move lastOfferedAt back so the re-fire window doesn't mask the dismissal cap
  const d = JSON.parse(store.get(D_KEY) || "{}");
  if (d["seq:conflict>exhausted"]) { d["seq:conflict>exhausted"].lastOfferedAt = 0; store.set(D_KEY, JSON.stringify(d)); }
  markStepOutDismissed("seq:conflict>exhausted");
}
// force the window open; only the dismissal cap should still block it
const d2 = JSON.parse(store.get(D_KEY) || "{}");
d2["seq:conflict>exhausted"].lastOfferedAt = 0;
store.set(D_KEY, JSON.stringify(d2));
ok(getActiveLoopOffer() === null, "dismissed MAX times → loop closed, never re-offers");

// ── most-recently-confirmed active loop wins ──────────────────────────────
store.clear();
const OLDER = { id: "co:a|b", kind: "co-occurrence", label: "\u201ca\u201d and \u201cb\u201d tend to show up near each other.", confirmedAt: Date.now() - 100000 };
const NEWER = { id: "co:x|y", kind: "co-occurrence", label: "\u201cx\u201d and \u201cy\u201d tend to show up near each other.", confirmedAt: Date.now() };
seedFindings([OLDER, NEWER]);
seedSignals([{ chip: "b", triggers: [], body: [], loggedAt: isoAgo(0) }, { chip: "y", triggers: [], body: [], loggedAt: isoAgo(0) }]);
offer = getActiveLoopOffer();
ok(offer && offer.findingId === "co:x|y", "most-recently-confirmed active loop is offered first");

// ── accepted quiets it within the window ──────────────────────────────────
store.clear();
seedFindings([LOOP]);
seedSignals([{ chip: "exhausted", triggers: [], body: [], loggedAt: isoAgo(0) }]);
markStepOutAccepted("seq:conflict>exhausted");
ok(getActiveLoopOffer() === null, "accepted → quiet within the re-fire window (not counted as dismissal)");

console.log(`stepOutTrigger.test.mjs — ${n}/${n} PASS`);
