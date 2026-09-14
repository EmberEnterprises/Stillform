// dayBridge.test.mjs — run: node src/v2/lib/__tests__/dayBridge.test.mjs
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

const { getTomorrowAnchorForToday, getYesterdayEodArtifact } = await import("../dayBridge.js");
const { localDateKey } = await import("../beat.js");

const now = new Date(2026, 8, 14, 8, 30); // Sep 14 2026, 08:30 local
const yesterday = new Date(2026, 8, 13, 22, 0);
const lastWeek = new Date(2026, 8, 6, 22, 0);

// 1. no anchor → null
store.clear();
assert.strictEqual(getTomorrowAnchorForToday(now), null);

// 2. anchor set last night → surfaces today
store.set("stillform_tomorrow_anchor", JSON.stringify({ date: localDateKey(yesterday), anchor: "  one call before noon ", source: "v2-spine" }));
assert.deepStrictEqual(getTomorrowAnchorForToday(now), { anchor: "one call before noon", setOn: localDateKey(yesterday) });

// 3. anchor set after midnight (today) still belongs to this morning
store.set("stillform_tomorrow_anchor", JSON.stringify({ date: localDateKey(now), anchor: "walk first" }));
assert.strictEqual(getTomorrowAnchorForToday(now).anchor, "walk first");

// 4. stale anchor (a week old) never surfaces
store.set("stillform_tomorrow_anchor", JSON.stringify({ date: localDateKey(lastWeek), anchor: "old" }));
assert.strictEqual(getTomorrowAnchorForToday(now), null);

// 5. empty / malformed → null, never throws
store.set("stillform_tomorrow_anchor", JSON.stringify({ date: localDateKey(yesterday), anchor: "   " }));
assert.strictEqual(getTomorrowAnchorForToday(now), null);
store.set("stillform_tomorrow_anchor", "{not json");
assert.strictEqual(getTomorrowAnchorForToday(now), null);

// 6. yesterday's EOD artifact → text; today's or older → ""
store.set("stillform_eod_artifact", JSON.stringify({ date: localDateKey(yesterday), artifact: "The day taught patience.", savedAt: 1 }));
assert.strictEqual(getYesterdayEodArtifact(now), "The day taught patience.");
store.set("stillform_eod_artifact", JSON.stringify({ date: localDateKey(now), artifact: "today's", savedAt: 1 }));
assert.strictEqual(getYesterdayEodArtifact(now), "");
store.set("stillform_eod_artifact", JSON.stringify({ date: localDateKey(lastWeek), artifact: "old", savedAt: 1 }));
assert.strictEqual(getYesterdayEodArtifact(now), "");

// 7. length caps
store.set("stillform_tomorrow_anchor", JSON.stringify({ date: localDateKey(yesterday), anchor: "x".repeat(500) }));
assert.strictEqual(getTomorrowAnchorForToday(now).anchor.length, 200);

console.log("dayBridge.test.mjs: all assertions passed");
