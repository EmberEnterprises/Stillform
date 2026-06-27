// Run: node src/v2/lib/__tests__/predictionLog.test.mjs
//
// Covers predictionLog.js — the forward (prospective) prediction log:
// log a prediction + stated confidence in the moment, mark the outcome later.
// These assert the REAL contract read from the source, with attention to the
// subtle confidence rule and the pending/resolved split that the surfaces rely on.
const mem = new Map();
const ls = { getItem: (k) => (mem.has(k) ? mem.get(k) : null), setItem: (k, v) => mem.set(k, String(v)), removeItem: (k) => mem.delete(k) };
globalThis.localStorage = ls;
globalThis.window = { localStorage: ls };

const {
  getPredictionLog, savePredictionLog, recordPrediction, recordOutcome,
  getPendingPredictions, getResolvedPredictions, getAllPredictions,
  hasAnyPrediction, hasPendingPrediction, getPredictionCount,
} = await import("../predictionLog.js");

let pass = 0, fail = 0;
const ok = (name, cond) => { if (cond) { pass++; console.log("  \u2713", name); } else { fail++; console.log("  \u2717 FAIL:", name); } };

const KEY = "stillform_prediction_log";
const seed = (entries) => mem.set(KEY, JSON.stringify({ entries }));
const reset = () => mem.clear();

// 1) honest-empty reads (no data / corrupt / non-array)
{
  reset();
  ok("no data \u2192 {entries:[]}", JSON.stringify(getPredictionLog()) === JSON.stringify({ entries: [] }));
  ok("count 0, hasAny false", getPredictionCount() === 0 && hasAnyPrediction() === false);
  mem.set(KEY, "{not json");
  ok("corrupt JSON \u2192 {entries:[]}", getPredictionLog().entries.length === 0);
  mem.set(KEY, JSON.stringify({ entries: "nope" }));
  ok("non-array entries \u2192 {entries:[]}", getPredictionLog().entries.length === 0);
}

// 2) recordPrediction — text guard + entry shape + trim
{
  reset();
  ok("empty text \u2192 null", recordPrediction({ text: "" }) === null);
  ok("whitespace text \u2192 null", recordPrediction({ text: "   " }) === null);
  ok("missing arg \u2192 null", recordPrediction() === null);
  const e = recordPrediction({ text: "  the call will go badly  ", confidence: 80 });
  ok("valid \u2192 entry returned with id + loggedAt", !!e && typeof e.id === "string" && typeof e.loggedAt === "string");
  ok("text trimmed", e.text === "the call will go badly");
  ok("confidence stored", e.confidence === 80);
  ok("starts pending (outcome + outcomeAt null)", e.outcome === null && e.outcomeAt === null);
  ok("persisted (count 1)", getPredictionCount() === 1);
}

// 3) recordPrediction — the subtle confidence contract
{
  reset();
  const a = recordPrediction({ text: "p", confidence: null });
  ok("confidence null \u2192 recorded, confidence null", !!a && a.confidence === null);
  const b = recordPrediction({ text: "p", confidence: "" });
  ok("confidence '' \u2192 recorded, confidence null", !!b && b.confidence === null);
  const c0 = recordPrediction({ text: "p", confidence: 0 });
  ok("confidence 0 \u2192 preserved as 0 (not coerced to null)", !!c0 && c0.confidence === 0);
  const c100 = recordPrediction({ text: "p", confidence: 100 });
  ok("confidence 100 \u2192 valid boundary", !!c100 && c100.confidence === 100);
  ok("confidence 150 (out of range) \u2192 whole prediction null", recordPrediction({ text: "p", confidence: 150 }) === null);
  ok("confidence -5 \u2192 null", recordPrediction({ text: "p", confidence: -5 }) === null);
  ok("confidence 'abc' (NaN) \u2192 null", recordPrediction({ text: "p", confidence: "abc" }) === null);
}

// 4) recordOutcome — guards + resolve-in-place (update, not insert)
{
  reset();
  const e = recordPrediction({ text: "bet", confidence: 50 });
  ok("bad id (non-string) \u2192 null", recordOutcome(123, { outcome: "x" }) === null);
  ok("empty id \u2192 null", recordOutcome("", { outcome: "x" }) === null);
  ok("empty outcome \u2192 null", recordOutcome(e.id, { outcome: "  " }) === null);
  ok("nonexistent id \u2192 null", recordOutcome("pred_nope", { outcome: "x" }) === null);
  const r = recordOutcome(e.id, { outcome: "  it went fine  " });
  ok("valid outcome \u2192 entry resolved + trimmed", !!r && r.outcome === "it went fine");
  ok("outcomeAt stamped", typeof r.outcomeAt === "string");
  ok("count unchanged (update not insert)", getPredictionCount() === 1);
}

// 5) pending vs resolved split + newest-first ordering
{
  reset();
  seed([
    { id: "a", text: "older pending", confidence: null, loggedAt: "2026-06-01T10:00:00Z", outcome: null, outcomeAt: null },
    { id: "b", text: "newer pending", confidence: null, loggedAt: "2026-06-03T10:00:00Z", outcome: null, outcomeAt: null },
    { id: "c", text: "resolved", confidence: 70, loggedAt: "2026-06-02T10:00:00Z", outcome: "happened", outcomeAt: "2026-06-04T10:00:00Z" },
  ]);
  const pend = getPendingPredictions();
  ok("pending = 2, newest-first", pend.length === 2 && pend[0].id === "b" && pend[1].id === "a");
  const res = getResolvedPredictions();
  ok("resolved = 1", res.length === 1 && res[0].id === "c");
  ok("getAll = 3 newest-first", getAllPredictions().length === 3 && getAllPredictions()[0].id === "b");
  ok("hasPending true", hasPendingPrediction() === true);
}

// 6) hasPending false when every entry resolved
{
  reset();
  seed([{ id: "x", text: "t", confidence: null, loggedAt: "2026-06-01T10:00:00Z", outcome: "done", outcomeAt: "2026-06-02T10:00:00Z" }]);
  ok("all resolved \u2192 hasPending false", hasPendingPrediction() === false);
  ok("hasAny still true", hasAnyPrediction() === true);
}

// 7) savePredictionLog guard
{
  reset();
  ok("save invalid store \u2192 false", savePredictionLog({ nope: 1 }) === false);
  ok("save valid store \u2192 true", savePredictionLog({ entries: [] }) === true);
}

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
