// shiftLog.test.mjs — run: node src/v2/lib/__tests__/shiftLog.test.mjs
import assert from "node:assert";
const store = new Map();
const ls = { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k), clear: () => store.clear() };
globalThis.localStorage = ls; globalThis.window = { localStorage: ls };
const { classifyShift, recordShift, getShiftSummary, getShiftLine, formatShiftForAI, getShifts } = await import("../shiftLog.js");

assert.strictEqual(classifyShift("anxious", "settled"), "softer");
assert.strictEqual(classifyShift("anxious", "anxious"), "same");
assert.strictEqual(classifyShift("anxious", "angry"), "same");
assert.strictEqual(classifyShift("settled", "anxious"), "harder");
assert.strictEqual(classifyShift("anxious", "mixed"), "softer");
assert.strictEqual(classifyShift("settled", "unsure"), "harder");
assert.strictEqual(classifyShift("mixed", "flat"), "same");
assert.strictEqual(classifyShift("nope", "settled"), null);

store.clear();
const T = Date.now();
assert.strictEqual(getShiftLine({ now: T }), null, "no line under 3 records");
recordShift({ pre: "anxious", post: "settled", sessionId: "s1", now: T - 1000 });
recordShift({ pre: "anxious", post: "settled", sessionId: "s1", now: T - 900 }); // replace, not duplicate
assert.strictEqual(getShifts().length, 1);
recordShift({ pre: "stuck", post: "stuck", sessionId: "s2", now: T - 800 });
recordShift({ pre: "angry", post: "mixed", sessionId: "s3", now: T - 700 });
let s = getShiftSummary({ now: T });
assert.deepStrictEqual([s.total, s.softer, s.same, s.harder], [3, 2, 1, 0]);
assert.strictEqual(getShiftLine({ now: T }), "2 of 3 sessions this month ended softer than they started; 1 landed where they began.");
assert.ok(formatShiftForAI({ now: T }).includes("2 softer, 1 same, 0 harder of 3"));
// 30-day window
recordShift({ pre: "anxious", post: "settled", sessionId: "old", now: T - 40 * 24 * 3600 * 1000 });
assert.strictEqual(getShiftSummary({ now: T }).total, 3);
// all softer line
store.clear();
for (let i = 0; i < 3; i++) recordShift({ pre: "anxious", post: "settled", sessionId: "a" + i, now: T - i });
assert.strictEqual(getShiftLine({ now: T }), "All 3 sessions this month ended softer than they started.");
console.log("shiftLog.test.mjs: all assertions passed");
