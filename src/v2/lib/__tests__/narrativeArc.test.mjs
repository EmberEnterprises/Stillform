// Run: node src/v2/lib/__tests__/narrativeArc.test.mjs
const mem = new Map();
const ls = { getItem: (k) => (mem.has(k) ? mem.get(k) : null), setItem: (k, v) => mem.set(k, String(v)), removeItem: (k) => mem.delete(k) };
globalThis.localStorage = ls;
globalThis.window = { localStorage: ls };

const { assembleNarrativeArc } = await import("../narrativeArc.js");

let pass = 0, fail = 0;
const ok = (name, cond) => { if (cond) { pass++; console.log("  \u2713", name); } else { fail++; console.log("  \u2717 FAIL:", name); } };

const session = (dateKey, takeaway, mode = "calm", precisionName = "named") => ({ dateKey, precisionName, takeaway, mode, selectedChip: null, surfacedFrame: null, nextMove: null, lockIn: null, beat: "main" });
const seedSessions = (arr) => mem.set("stillform_v2_sessions", JSON.stringify(arr));
const seedFindings = (labels) => mem.set("stillform_discovery_findings", JSON.stringify({ confirmed: labels.map((l, i) => ({ id: `f${i}`, kind: "co-occurrence", label: l, confirmedAt: i + 1 })), rejected: [] }));
const seedPE = (texts) => mem.set("stillform_prediction_errors", JSON.stringify({ entries: texts.map((t, i) => ({ id: `pe${i}`, text: t, markedAt: `2026-06-0${i + 1}T10:00:00Z` })) }));

// 1) honest empty below minBeats
{
  seedSessions([session("2026-6-1", "first"), session("2026-6-2", "second")]);
  const a = assembleNarrativeArc();
  ok("below minBeats \u2192 ready:false", a.ready === false && a.reason === "not_enough_beats");
  ok("below minBeats \u2192 empty arrays", a.beats.length === 0 && a.span === null);
}

// 2) assembles beats chronologically once ready
{
  seedSessions([session("2026-6-3", "third"), session("2026-6-1", "first"), session("2026-6-2", "second")]);
  seedFindings(["\u201ctired\u201d and \u201clate nights\u201d tend to show up near each other."]);
  seedPE(["I was braced for the call to go badly. It didn't."]);
  const a = assembleNarrativeArc();
  ok("ready when \u2265 minBeats", a.ready === true);
  ok("beats sorted oldest\u2192newest", a.beats[0].takeaway === "first" && a.beats[2].takeaway === "third");
  ok("beat carries takeaway + mode", a.beats[0].mode === "calm" && typeof a.beats[0].takeaway === "string");
  ok("threads = confirmed labels", a.threads.length === 1 && a.threads[0].includes("tired"));
  ok("turningPoints = prediction-error texts", a.turningPoints.length === 1 && a.turningPoints[0].text.includes("braced"));
  ok("span computed", a.span.beatCount === 3 && a.span.firstDate === "2026-6-1" && a.span.lastDate === "2026-6-3");
}

// 3) sessions without a takeaway are excluded from beats
{
  seedSessions([session("2026-6-1", "a"), { dateKey: "2026-6-2", takeaway: null, mode: "calm" }, session("2026-6-3", "b"), session("2026-6-4", "c")]);
  seedFindings([]); seedPE([]);
  const a = assembleNarrativeArc();
  ok("no-takeaway session excluded from beats", a.beats.length === 3 && !a.beats.some((b) => b.takeaway == null));
  ok("empty threads/turningPoints tolerated", a.threads.length === 0 && a.turningPoints.length === 0);
}

// 4) no data at all → honest empty, no throw
{
  mem.clear();
  const a = assembleNarrativeArc();
  ok("no data \u2192 ready:false, no throw", a.ready === false && a.beats.length === 0);
}

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
