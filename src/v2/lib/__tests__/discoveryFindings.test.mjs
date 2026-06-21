// window.localStorage mock (the store uses window.localStorage via safeLocalStorage)
const _m = new Map();
global.window = {
  localStorage: {
    getItem: (k) => (_m.has(k) ? _m.get(k) : null),
    setItem: (k, v) => _m.set(k, String(v)),
    removeItem: (k) => _m.delete(k),
    clear: () => _m.clear(),
  },
};

const {
  candidateKey, confirmFinding, rejectFinding, getDecision,
  getConfirmedFindings, getTopUnsurfacedFinding, describeFinding,
} = await import("../discoveryFindings.js");

const BASE = new Date("2026-05-01T09:00:00Z").getTime();
const DAY = 86400000;
const entry = (d, chip, triggers = []) => ({
  id: `t_${d}_${Math.random().toString(36).slice(2, 6)}`,
  chip, triggers, beat: "main", mode: "calm",
  loggedAt: new Date(BASE + d * DAY).toISOString(), dateKey: "x",
});

let pass = 0, fail = 0;
const ok = (n, c) => c ? (pass++, console.log("  ✓", n)) : (fail++, console.log("  ✗ FAIL:", n));

// --- candidateKey: co-occurrence unordered, sequence ordered ---
{
  const co1 = { kind: "co-occurrence", a: { type: "feel", value: "Exhausted" }, b: { type: "trigger", value: "conflict" }, support: 3 };
  const co2 = { kind: "co-occurrence", a: { type: "trigger", value: "conflict" }, b: { type: "feel", value: "exhausted" }, support: 3 };
  ok("co-occurrence key is order-independent", candidateKey(co1) === candidateKey(co2));
  const s1 = { kind: "sequence", from: { type: "trigger", value: "conflict" }, to: { type: "feel", value: "exhausted" }, support: 3, medianLagDays: 2 };
  const s2 = { kind: "sequence", from: { type: "feel", value: "exhausted" }, to: { type: "trigger", value: "conflict" }, support: 3, medianLagDays: 2 };
  ok("sequence key IS order-dependent", candidateKey(s1) !== candidateKey(s2));
}

// --- describeFinding: correlation, never causation; carries support ---
{
  const co = { kind: "co-occurrence", a: { type: "feel", value: "anxious" }, b: { type: "trigger", value: "deadline" }, support: 4 };
  const d = describeFinding(co);
  ok("co-occurrence sentence has support count", d.includes("4"));
  ok("description avoids causal language", !/cause|because|makes you|leads to/i.test(d));
  const seq = { kind: "sequence", from: { type: "trigger", value: "conflict" }, to: { type: "feel", value: "exhausted" }, support: 3, medianLagDays: 2 };
  const ds = describeFinding(seq);
  ok("sequence sentence uses 'tended to' framing", /tended to come before/.test(ds));
  ok("sequence sentence avoids causal language", !/cause|because|makes you|leads to/i.test(ds));
}

// --- orchestrator: surface strongest, confirm/reject, no-resurface ---
{
  // co-occurrence support 4 (isolated >lag-window from the rest so it forms no
  // incidental sequences) + a meeting→stuck sequence support 3 later
  const log = [
    entry(0, "exhausted", ["conflict"]),
    entry(0.1, "exhausted", ["conflict"]),
    entry(0.2, "exhausted", ["conflict"]),
    entry(0.3, "exhausted", ["conflict"]),     // co-occ support 4, isolated
    entry(20, "calm", ["meeting"]),
    entry(22, "stuck"),                         // meeting→stuck (lag 2)
    entry(25, "calm", ["meeting"]),
    entry(27, "stuck"),                         // lag 2
    entry(30, "calm", ["meeting"]),
    entry(32, "stuck"),                         // lag 2  → sequence support 3
    entry(34, "focused"),
  ];
  const top = getTopUnsurfacedFinding(log);
  ok("top finding is the strongest (co-occurrence support 4)", top && top.kind === "co-occurrence" && top.support === 4);

  confirmFinding(top);
  ok("confirmed finding records decision", getDecision(top) === "confirmed");
  ok("confirmed finding is in getConfirmedFindings", getConfirmedFindings().some((c) => candidateKey(c) === candidateKey(top)));

  const next = getTopUnsurfacedFinding(log);
  ok("confirmed finding does not resurface; next candidate surfaces", next && candidateKey(next) !== candidateKey(top));

  rejectFinding(next);
  ok("rejected finding records decision", getDecision(next) === "rejected");
  ok("rejected finding is NOT in confirmed set", !getConfirmedFindings().some((c) => candidateKey(c) === candidateKey(next)));

  const after = getTopUnsurfacedFinding(log);
  ok("rejected finding never resurfaces", !after || candidateKey(after) !== candidateKey(next));
}

// --- honest empty: below data floor → null ---
{
  const thin = [entry(0, "calm"), entry(1, "tired")];
  ok("below data floor → no finding surfaced", getTopUnsurfacedFinding(thin) === null);
}

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
