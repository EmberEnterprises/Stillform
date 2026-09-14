// beatWindows.test.mjs — run: node src/v2/lib/__tests__/beatWindows.test.mjs
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

const { getBeatWindows, getCurrentBeat, localDateKey } = await import("../beat.js");

// Anchor the fixture on the REAL today so the done-flag reader (real-clock date) lines up.
const T = new Date();
const at = (h, m = 0, dayOffset = 0) => new Date(T.getFullYear(), T.getMonth(), T.getDate() + dayOffset, h, m);
const sunsetOn = (h, m, dayOffset = 0) => at(h, m, dayOffset).getTime();

// 1. no weather → the old clock exactly
store.clear();
assert.deepStrictEqual(getBeatWindows(at(12)), { eodStart: 19, windDownStart: 21, source: "clock" });
assert.strictEqual(getCurrentBeat(at(18, 59)), "morning");
assert.strictEqual(getCurrentBeat(at(19, 0)), "eod");
assert.strictEqual(getCurrentBeat(at(21, 0)), "wind-down");

// 2. September sunset 19:05 → EOD opens 19:05, wind-down 21:05
store.set("stillform_weather", JSON.stringify({ sunsetMs: sunsetOn(19, 5), at: Date.now() }));
let w = getBeatWindows(at(12));
assert.strictEqual(w.source, "sunset");
assert.ok(Math.abs(w.eodStart - (19 + 5 / 60)) < 1e-9);
assert.ok(Math.abs(w.windDownStart - (21 + 5 / 60)) < 1e-9);
assert.strictEqual(getCurrentBeat(at(19, 0)), "morning");
assert.strictEqual(getCurrentBeat(at(19, 6)), "eod");
assert.strictEqual(getCurrentBeat(at(21, 6)), "wind-down");

// 3. December sunset 16:30 → clamped: EOD 17:30, wind-down 20:30
store.set("stillform_weather", JSON.stringify({ sunsetMs: sunsetOn(16, 30) }));
w = getBeatWindows(at(12));
assert.strictEqual(w.eodStart, 17.5);
assert.strictEqual(w.windDownStart, 20.5);
assert.strictEqual(getCurrentBeat(at(17, 45)), "eod");
assert.strictEqual(getCurrentBeat(at(20, 45)), "wind-down");

// 4. June sunset 20:30 → clamped: EOD 19:30, wind-down 21:30
store.set("stillform_weather", JSON.stringify({ sunsetMs: sunsetOn(20, 30) }));
w = getBeatWindows(at(12));
assert.strictEqual(w.eodStart, 19.5);
assert.strictEqual(w.windDownStart, 21.5);

// 5. stale sunset (another day) → clock fallback
store.set("stillform_weather", JSON.stringify({ sunsetMs: sunsetOn(19, 5, -1) }));
assert.strictEqual(getBeatWindows(at(12)).source, "clock");

// 6. done flags still respected under sunset windows
store.set("stillform_weather", JSON.stringify({ sunsetMs: sunsetOn(19, 5) }));
store.set("stillform_eod_today", JSON.stringify({ date: localDateKey(new Date()) })); // flag reader uses the real clock date
assert.strictEqual(getCurrentBeat(at(19, 30)), "main");

// 7. malformed weather → fallback, never throws
store.set("stillform_weather", "{nope");
assert.strictEqual(getBeatWindows(at(12)).source, "clock");

console.log("beatWindows.test.mjs: all assertions passed");
