// triggerDecay.test.mjs — run: node src/v2/lib/__tests__/triggerDecay.test.mjs
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

const { getTriggerDecay, formatTriggerProfileForAI } = await import("../triggerProfile.js");
const { RETIRED_MIN_SESSIONS, RETIRED_MIN_DAYS, PATTERN_CONFIRMED_DAYS } = await import("../biasProfile.js");

let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };
const eq = (a, b, m) => { assert.strictEqual(a, b, m); n++; };

const DAY = 86400000;
const iso = (daysAgo) => new Date(Date.now() - daysAgo * DAY).toISOString();
// Detection-active sessions injected (the biasProfile engine counts these).
const sessions = (count, sinceDaysAgo) =>
  Array.from({ length: count }, (_, i) => ({
    timestamp: iso(sinceDaysAgo - 1 - i * 0.01),
  }));

// ── tier walk on the SHARED engine ─────────────────────────────────────────
eq(getTriggerDecay({ encounterCount: 0 }).tier, "provisional", "0 encounters → provisional");
eq(getTriggerDecay({ encounterCount: 1, lastSeen: iso(1) }).tier, "emerging", "1 encounter → emerging");
eq(
  getTriggerDecay({ encounterCount: PATTERN_CONFIRMED_DAYS, lastSeen: iso(1) }).tier,
  "confirmed",
  "threshold encounters, recent → confirmed"
);

const stale = { encounterCount: PATTERN_CONFIRMED_DAYS + 2, lastSeen: iso(RETIRED_MIN_DAYS + 10) };
eq(
  getTriggerDecay(stale, sessions(RETIRED_MIN_SESSIONS + 2, RETIRED_MIN_DAYS + 9)).tier,
  "retired",
  "confirmed + long-unseen across active practice → retired"
);
ok(
  getTriggerDecay(stale, sessions(RETIRED_MIN_SESSIONS + 2, RETIRED_MIN_DAYS + 9)).quiet.daysSince >= RETIRED_MIN_DAYS,
  "quiet carries daysSince"
);

// re-detection resets: recent lastSeen → back to confirmed
eq(
  getTriggerDecay({ encounterCount: 9, lastSeen: iso(0) }, sessions(20, 40)).tier,
  "confirmed",
  "fresh lastSeen walks the tier back — nothing stored, nothing to migrate"
);

// an EMERGING trigger never retires (was never established)
eq(
  getTriggerDecay({ encounterCount: 1, lastSeen: iso(400) }, sessions(30, 300)).tier,
  "emerging",
  "non-confirmed never retires — nothing to retire"
);

// malformed fails closed
eq(getTriggerDecay(null).tier, "provisional", "null entry fails closed");
eq(getTriggerDecay({ encounterCount: 9, lastSeen: "junk" }).tier, "confirmed", "bad lastSeen → confirmed, no quiet");

// ── AI annotation ──────────────────────────────────────────────────────────
const TP_KEY = "stillform_v2_trigger_profile";
store.clear();
store.set(
  TP_KEY,
  JSON.stringify({
    triggers: [
      { id: "t1", label: "deadline pressure", category: "work", encounterCount: 6, lastSeen: iso(1) },
      { id: "t2", label: "family calls", category: "people", encounterCount: 5, lastSeen: iso(200) },
    ],
  })
);
// t2: long-unseen — but sessions store is empty here, so the engine can't count
// detection-active practice → stays confirmed (fail-toward-live is CORRECT: never
// declare quiet without evidence of continued practice).
let s = formatTriggerProfileForAI();
ok(s.includes('"deadline pressure"'), "live trigger present");
ok(!s.includes("gone quiet"), "no quiet claim without detection-active session evidence");

// seed the sessions store the engine reads → t2 now retires
store.set(
  "stillform_v2_sessions",
  JSON.stringify(sessions(RETIRED_MIN_SESSIONS + 4, 60))
);
s = formatTriggerProfileForAI();
ok(s.includes("gone quiet"), "stale trigger annotated for the AI");
ok(s.includes("treat as HISTORY"), "annotation carries the instruction");
ok(s.indexOf("deadline pressure") < s.indexOf("family calls") || s.includes('"deadline pressure" [work] (6'), "live trigger unannotated + ordering intact");
ok(!s.match(/"deadline pressure"[^,]*gone quiet/), "live trigger NOT annotated");

console.log(`triggerDecay.test.mjs — ${n}/${n} PASS`);
