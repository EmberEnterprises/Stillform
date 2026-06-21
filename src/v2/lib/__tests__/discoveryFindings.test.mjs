// Mock window.localStorage (signalLog uses window.localStorage; findings uses
// window or bare localStorage) before importing.
const _store = new Map();
const shim = {
  getItem: (k) => (_store.has(k) ? _store.get(k) : null),
  setItem: (k, v) => _store.set(k, String(v)),
  removeItem: (k) => _store.delete(k),
  clear: () => _store.clear(),
};
global.localStorage = shim;
global.window = { localStorage: shim };

const { recordSignal } = await import("../signalLog.js");
const {
  findingKey, confirmFinding, rejectFinding, getFindingStatus,
  getConfirmedFindings, describeFinding, getNextFinding, formatConfirmedFindingsForAI,
} = await import("../discoveryFindings.js");

let pass = 0, fail = 0;
const ok = (name, cond) => cond ? (pass++, console.log("  ✓", name)) : (fail++, console.log("  ✗ FAIL:", name));

// --- findingKey stability + order semantics ---
{
  const co1 = { kind: "co-occurrence", a: { type: "feel", value: "Exhausted" }, b: { type: "trigger", value: "conflict" } };
  const co2 = { kind: "co-occurrence", a: { type: "trigger", value: "conflict" }, b: { type: "feel", value: "exhausted" } };
  ok("co-occurrence key is order-independent + case-folded", findingKey(co1) === findingKey(co2));
  const s1 = { kind: "sequence", from: { type: "trigger", value: "conflict" }, to: { type: "feel", value: "exhausted" } };
  const s2 = { kind: "sequence", from: { type: "feel", value: "exhausted" }, to: { type: "trigger", value: "conflict" } };
  ok("sequence key is order-dependent", findingKey(s1) !== findingKey(s2));
}

// --- describeFinding: correlation only, never causal ---
{
  const co = { kind: "co-occurrence", a: { type: "feel", value: "anxious" }, b: { type: "trigger", value: "email" }, support: 4 };
  const seq = { kind: "sequence", from: { type: "trigger", value: "conflict" }, to: { type: "feel", value: "exhausted" }, support: 3, medianLagDays: 2 };
  const dCo = describeFinding(co), dSeq = describeFinding(seq);
  ok("co-occurrence phrasing mentions 'together' + count", /together/.test(dCo) && /4/.test(dCo));
  ok("sequence phrasing mentions lag + count", /2 days/.test(dSeq) && /3/.test(dSeq));
  const causal = /(cause|because|makes you|leads to|due to)/i;
  ok("phrasing is never causal", !causal.test(dCo) && !causal.test(dSeq));
}

// --- confirm / reject / status ---
{
  const c = { kind: "co-occurrence", a: { type: "feel", value: "stuck" }, b: { type: "trigger", value: "deadline" }, support: 3 };
  confirmFinding(c);
  ok("confirm → status confirmed", getFindingStatus(findingKey(c)) === "confirmed");
  ok("confirmed appears in getConfirmedFindings", getConfirmedFindings().some((x) => findingKey(x) === findingKey(c)));
  const r = { kind: "sequence", from: { type: "trigger", value: "review" }, to: { type: "feel", value: "flat" }, support: 3, medianLagDays: 1 };
  rejectFinding(r);
  ok("reject → status rejected", getFindingStatus(findingKey(r)) === "rejected");
  ok("formatConfirmedFindingsForAI returns a string with confirmed", /stuck/.test(formatConfirmedFindingsForAI() || ""));
}

// --- getNextFinding: honest empty, surfacing, no-resurface ---
{
  _store.clear(); // fresh signal log + findings
  ok("getNextFinding → null with no data", getNextFinding() === null);

  // seed 9 occurrences; 3 co-occur exhausted+conflict (support 3 ≥ minSupport)
  for (let i = 0; i < 3; i++) recordSignal({ chip: "exhausted", triggers: ["conflict"], beat: "main", mode: "calm" });
  for (const c of ["calm", "focused", "tired", "calm", "focused", "calm"]) recordSignal({ chip: c, beat: "main", mode: "calm" });

  const next = getNextFinding();
  ok("getNextFinding surfaces the co-occurrence", !!next && /exhausted/.test(next.text) && /conflict/.test(next.text));

  // reject it → must never resurface; nothing else strong enough → null
  rejectFinding(next.candidate);
  ok("rejected finding does NOT resurface", getNextFinding() === null);
  ok("rejected status persists", getFindingStatus(next.key) === "rejected");
}

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
