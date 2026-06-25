import { findPatterns, findDisconfirmingInstance } from "../discoveryEngine.js";

const BASE = new Date("2026-05-01T09:00:00Z").getTime();
const DAY = 24 * 60 * 60 * 1000;
function entry(dayOffset, chip, triggers = []) {
  return {
    id: `t_${dayOffset}_${Math.random().toString(36).slice(2, 6)}`,
    chip,
    triggers,
    beat: "main",
    mode: "calm",
    loggedAt: new Date(BASE + dayOffset * DAY).toISOString(),
    dateKey: "x",
  };
}

let pass = 0, fail = 0;
function ok(name, cond) {
  if (cond) { pass++; console.log("  ✓", name); }
  else { fail++; console.log("  ✗ FAIL:", name); }
}

// --- TEST 1: honest empty state below minEntries ---
{
  const log = [entry(0, "tense"), entry(1, "tired"), entry(2, "calm")];
  const r = findPatterns(log);
  ok("below minEntries → ready:false", r.ready === false && r.reason === "not_enough_data");
  ok("below minEntries → no candidates", r.candidates.length === 0);
}

// --- TEST 2: co-occurrence (same entry), ≥ minSupport ---
{
  const log = [
    entry(0, "exhausted", ["conflict"]),  // co-occur 1
    entry(1, "calm"),
    entry(2, "exhausted", ["conflict"]),  // co-occur 2
    entry(3, "focused"),
    entry(4, "exhausted", ["conflict"]),  // co-occur 3
    entry(5, "tired"),
    entry(6, "calm"),
    entry(7, "focused"),
    entry(8, "calm"),
  ];
  const r = findPatterns(log);
  ok("≥minEntries → ready:true", r.ready === true);
  const co = r.candidates.find(
    (c) => c.kind === "co-occurrence" &&
      ((c.a.value === "exhausted" && c.b.value === "conflict") ||
       (c.b.value === "exhausted" && c.a.value === "conflict")),
  );
  ok("finds exhausted↔conflict co-occurrence", !!co);
  ok("co-occurrence support = 3", co && co.support === 3);
  ok("co-occurrence types tagged (feel + trigger)", co &&
    [co.a.type, co.b.type].sort().join(",") === "feel,trigger");
}

// --- TEST 3: lag-sequence (conflict → ~2 days → exhausted), ≥ minSupport ---
{
  const log = [
    entry(0, "calm", ["conflict"]),       // conflict day 0
    entry(2, "exhausted"),                // exhausted day 2  (lag 2)
    entry(5, "calm", ["conflict"]),       // conflict day 5
    entry(7, "exhausted"),                // exhausted day 7  (lag 2)
    entry(10, "focused", ["conflict"]),   // conflict day 10
    entry(12, "exhausted"),               // exhausted day 12 (lag 2)
    entry(14, "calm"),
    entry(16, "focused"),
    entry(18, "calm"),
  ];
  const r = findPatterns(log, { lagDays: 4 });
  ok("sequence test → ready:true", r.ready === true);
  const seq = r.candidates.find(
    (c) => c.kind === "sequence" && c.from.value === "conflict" && c.to.value === "exhausted",
  );
  ok("finds conflict → exhausted sequence", !!seq);
  ok("sequence support = 3", seq && seq.support === 3);
  ok("sequence median lag = 2 days", seq && seq.medianLagDays === 2);
}

// --- TEST 4: support threshold — a pair seen only twice is NOT emitted ---
{
  const log = [
    entry(0, "anxious", ["email"]),  // anxious↔email co-occur 1
    entry(1, "calm"),
    entry(2, "anxious", ["email"]),  // anxious↔email co-occur 2  (only twice)
    entry(3, "calm"),
    entry(4, "focused"),
    entry(5, "tired"),
    entry(6, "calm"),
    entry(7, "focused"),
    entry(8, "calm"),
    entry(9, "tired"),
  ];
  const r = findPatterns(log);
  const weak = r.candidates.find(
    (c) => c.kind === "co-occurrence" &&
      ((c.a.value === "anxious" && c.b.value === "email") ||
       (c.b.value === "anxious" && c.a.value === "email")),
  );
  ok("pair seen only twice (< minSupport 3) is NOT emitted", !weak);
}

// --- TEST 5: lag beyond window is not counted as sequence ---
{
  const log = [
    entry(0, "calm", ["deadline"]),
    entry(10, "exhausted"),  // 10 days later — outside lagDays 4
    entry(20, "calm", ["deadline"]),
    entry(30, "exhausted"),  // 10 days later
    entry(40, "calm", ["deadline"]),
    entry(50, "exhausted"),  // 10 days later
    entry(60, "calm"),
    entry(70, "focused"),
  ];
  const r = findPatterns(log, { lagDays: 4 });
  const seq = r.candidates.find(
    (c) => c.kind === "sequence" && c.from.value === "deadline" && c.to.value === "exhausted",
  );
  ok("sequence outside lag window is NOT emitted", !seq);
}

// --- findDisconfirmingInstance (M1 reconsolidation mismatch) ---
const SEQ = { kind: "sequence", from: { type: "trigger", value: "meeting" }, to: { type: "feel", value: "drained" } };
{
  // pattern held historically, most-recent meeting had NO drained follow, window elapsed
  const log = [entry(0,"",["meeting"]),entry(2,"drained"),entry(7,"",["meeting"]),entry(9,"drained"),
               entry(14,"",["meeting"]),entry(16,"drained"),entry(19,"calm"),entry(21,"",["meeting"]),entry(27,"focused")];
  const m = findDisconfirmingInstance(log, SEQ);
  ok("seq break: surfaces likely mismatch", !!m && m.trigger.value === "meeting" && m.expected.value === "drained");
}
{
  // most-recent meeting DID get drained within window → null
  const log = [entry(0,"",["meeting"]),entry(2,"drained"),entry(7,"",["meeting"]),entry(9,"drained"),
               entry(14,"",["meeting"]),entry(16,"drained"),entry(21,"",["meeting"]),entry(23,"drained")];
  ok("seq confirmed by most-recent → null", findDisconfirmingInstance(log, SEQ) === null);
}
{
  // meeting is the very last entry → premature, window not elapsed → null
  const log = [entry(0,"",["meeting"]),entry(2,"drained"),entry(7,"",["meeting"]),entry(9,"drained"),entry(14,"",["meeting"])];
  ok("seq premature (window not elapsed) → null", findDisconfirmingInstance(log, SEQ) === null);
}
{
  // feel+feel co-occurrence has no trigger→feel direction → null
  const co = { kind: "co-occurrence", a: { type: "feel", value: "x" }, b: { type: "feel", value: "y" } };
  ok("co-occurrence with no direction → null", findDisconfirmingInstance([entry(0,"x"),entry(1,"y")], co) === null);
}
{
  // co-occurrence trigger+feel, most-recent trigger entry lacks the feel → mismatch
  const co = { kind: "co-occurrence", a: { type: "trigger", value: "meeting" }, b: { type: "feel", value: "drained" } };
  const log = [entry(0,"drained",["meeting"]),entry(5,"drained",["meeting"]),entry(10,"drained",["meeting"]),entry(15,"calm",["meeting"])];
  const m = findDisconfirmingInstance(log, co);
  ok("co-occurrence break: surfaces likely mismatch", !!m && m.trigger.value === "meeting");
}
{
  ok("empty entries → null", findDisconfirmingInstance([], SEQ) === null);
  ok("null finding → null", findDisconfirmingInstance([entry(0,"",["meeting"])], null) === null);
}

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
