// Run: node src/v2/lib/__tests__/predictionErrors.test.mjs
//
// Covers predictionErrors.js — the disconfirmation log (retrospective: "I was
// braced for X, it didn't happen"). Asserts the REAL contract from source:
// guarded record, honest-empty reads, chronological history, newest-first recents.
const mem = new Map();
const ls = { getItem: (k) => (mem.has(k) ? mem.get(k) : null), setItem: (k, v) => mem.set(k, String(v)), removeItem: (k) => mem.delete(k) };
globalThis.localStorage = ls;
globalThis.window = { localStorage: ls };

const {
  getPredictionErrors, savePredictionErrors, recordPredictionError,
  getPredictionErrorHistory, getRecentPredictionErrors,
  hasPredictionError, getPredictionErrorCount,
} = await import("../predictionErrors.js");

let pass = 0, fail = 0;
const ok = (name, cond) => { if (cond) { pass++; console.log("  \u2713", name); } else { fail++; console.log("  \u2717 FAIL:", name); } };

const KEY = "stillform_prediction_errors";
const seed = (entries) => mem.set(KEY, JSON.stringify({ entries }));
const reset = () => mem.clear();

// 1) honest-empty reads (no data / corrupt / non-array)
{
  reset();
  ok("no data \u2192 {entries:[]}", getPredictionErrors().entries.length === 0);
  ok("count 0, has false", getPredictionErrorCount() === 0 && hasPredictionError() === false);
  mem.set(KEY, "{broken");
  ok("corrupt JSON \u2192 {entries:[]}", getPredictionErrors().entries.length === 0);
  mem.set(KEY, JSON.stringify({ entries: 42 }));
  ok("non-array entries \u2192 {entries:[]}", getPredictionErrors().entries.length === 0);
}

// 2) recordPredictionError — guard + shape + trim
{
  reset();
  ok("empty text \u2192 null", recordPredictionError({ text: "" }) === null);
  ok("whitespace text \u2192 null", recordPredictionError({ text: "   " }) === null);
  ok("missing arg \u2192 null", recordPredictionError() === null);
  const e = recordPredictionError({ text: "  braced for the worst, it was fine  " });
  ok("valid \u2192 entry, text trimmed", !!e && e.text === "braced for the worst, it was fine");
  ok("shape {id,text,markedAt}", typeof e.id === "string" && typeof e.text === "string" && typeof e.markedAt === "string");
  ok("persisted (count 1, has true)", getPredictionErrorCount() === 1 && hasPredictionError() === true);
}

// 3) history is chronological (oldest \u2192 newest by markedAt), regardless of insert order
{
  reset();
  seed([
    { id: "c", text: "third", markedAt: "2026-06-03T10:00:00Z" },
    { id: "a", text: "first", markedAt: "2026-06-01T10:00:00Z" },
    { id: "b", text: "second", markedAt: "2026-06-02T10:00:00Z" },
  ]);
  const h = getPredictionErrorHistory();
  ok("history oldest\u2192newest", h[0].text === "first" && h[1].text === "second" && h[2].text === "third");
  ok("count 3", getPredictionErrorCount() === 3);
}

// 4) recents are newest-first, respect n, default to 5
{
  reset();
  seed([
    { id: "a", text: "1", markedAt: "2026-06-01T10:00:00Z" },
    { id: "b", text: "2", markedAt: "2026-06-02T10:00:00Z" },
    { id: "c", text: "3", markedAt: "2026-06-03T10:00:00Z" },
    { id: "d", text: "4", markedAt: "2026-06-04T10:00:00Z" },
    { id: "e", text: "5", markedAt: "2026-06-05T10:00:00Z" },
    { id: "f", text: "6", markedAt: "2026-06-06T10:00:00Z" },
  ]);
  const r2 = getRecentPredictionErrors(2);
  ok("recent(2) newest-first", r2.length === 2 && r2[0].text === "6" && r2[1].text === "5");
  const rDef = getRecentPredictionErrors();
  ok("recent() default 5, newest-first", rDef.length === 5 && rDef[0].text === "6" && rDef[4].text === "2");
}

// 5) savePredictionErrors guard
{
  reset();
  ok("save invalid store \u2192 false", savePredictionErrors({ nope: 1 }) === false);
  ok("save valid store \u2192 true", savePredictionErrors({ entries: [] }) === true);
}

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
