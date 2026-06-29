/*
 * vulnerabilities.test.mjs — run: node src/v2/lib/__tests__/vulnerabilities.test.mjs
 * Integrity bar: never store blank/fabricated; rejected never resurfaces;
 * honest-empty + fail-silent reads; user corrections stick.
 */
let store = {};
globalThis.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; },
  clear: () => { store = {}; },
};

const {
  getVulnerabilities, addUserVulnerability, confirmVulnerability, rejectCandidate,
  isConfirmed, isRejected, updateVulnerability, removeVulnerability,
  formatVulnerabilitiesForAI, vulnerabilityId,
  setPendingCandidate, getPendingCandidate, clearPendingCandidate,
} = await import("../vulnerabilities.js");

let pass = 0, fail = 0;
const ok = (name, cond) => { if (cond) { pass++; } else { fail++; console.log("  FAIL:", name); } };
const reset = () => { store = {}; };

// 1) honest-empty on fresh + corrupt
reset();
ok("fresh → []", getVulnerabilities().length === 0);
ok("fresh → format null", formatVulnerabilitiesForAI() === null);
store["stillform_v2_vulnerabilities"] = "{ this is not json";
ok("corrupt store → []", getVulnerabilities().length === 0);

// 2) user authors one
reset();
const r = addUserVulnerability({ trait: "Need for attention", costEdge: "I spiral when ignored", strengthEdge: "I go all in and give fully" });
ok("addUser returns record", r && r.trait === "Need for attention" && r.source === "user");
ok("getVulnerabilities has 1", getVulnerabilities().length === 1);
ok("isConfirmed by id", isConfirmed(vulnerabilityId("Need for attention")));

// 3) blank field rejected, not stored
reset();
ok("blank cost → null", addUserVulnerability({ trait: "X", costEdge: "  ", strengthEdge: "y" }) === null);
ok("blank not stored", getVulnerabilities().length === 0);
ok("missing strength → null", addUserVulnerability({ trait: "X", costEdge: "y" }) === null);

// 4) dedup by trait → update in place, not duplicate
reset();
addUserVulnerability({ trait: "Pride", costEdge: "a", strengthEdge: "b" });
addUserVulnerability({ trait: "pride", costEdge: "c", strengthEdge: "d" }); // same id (slug)
const dl = getVulnerabilities();
ok("dedup → 1 record", dl.length === 1);
ok("dedup → fields updated", dl[0].costEdge === "c" && dl[0].strengthEdge === "d");

// 5) AI candidate confirm (source ai)
reset();
const aiRec = confirmVulnerability({ trait: "Vigilance", costEdge: "I brace for threat", strengthEdge: "I read a room fast", source: "ai" });
ok("ai confirm stored", aiRec && aiRec.source === "ai");
ok("ai confirm visible", getVulnerabilities().some((v) => v.trait === "Vigilance"));

// 6) reject never resurfaces; confirm after reject un-rejects
reset();
rejectCandidate({ trait: "Restlessness", costEdge: "x", strengthEdge: "y" });
ok("rejected flagged", isRejected(vulnerabilityId("Restlessness")));
ok("rejected not in confirmed", !getVulnerabilities().some((v) => v.trait === "Restlessness"));
confirmVulnerability({ trait: "Restlessness", costEdge: "x", strengthEdge: "y", source: "user" });
ok("confirm after reject → un-rejected", !isRejected(vulnerabilityId("Restlessness")));
ok("confirm after reject → stored", getVulnerabilities().some((v) => v.trait === "Restlessness"));

// 7) update edits edges, blank ignored
reset();
addUserVulnerability({ trait: "Empathy", costEdge: "I absorb others' stress", strengthEdge: "I connect deeply" });
const id = vulnerabilityId("Empathy");
updateVulnerability(id, { costEdge: "I take on too much", strengthEdge: "  " });
const up = getVulnerabilities()[0];
ok("update changes cost", up.costEdge === "I take on too much");
ok("update ignores blank strength", up.strengthEdge === "I connect deeply");

// 8) remove
reset();
addUserVulnerability({ trait: "Drive", costEdge: "burnout", strengthEdge: "output" });
removeVulnerability(vulnerabilityId("Drive"));
ok("removed", getVulnerabilities().length === 0);

// 9) format: content, most-recent first, cap 5, null when empty
reset();
for (let i = 1; i <= 6; i++) addUserVulnerability({ trait: "T" + i, costEdge: "c" + i, strengthEdge: "s" + i });
const fmt = formatVulnerabilitiesForAI();
ok("format non-null", typeof fmt === "string" && fmt.length > 0);
ok("format caps at 5 lines", fmt.split("\n").length === 5);
ok("format most-recent first", fmt.split("\n")[0].startsWith("T6 —"));

// 10) pending AI candidate: stash, read, never re-nag, self-heal, clear
reset();
setPendingCandidate({ trait: "Need to be right", costEdge: "I dig in", strengthEdge: "I prepare hard" });
ok("pending stored", getPendingCandidate()?.trait === "Need to be right");
ok("pending blank → null", setPendingCandidate({ trait: "x", costEdge: "", strengthEdge: "y" }) === null);
confirmVulnerability({ trait: "Need to be right", costEdge: "I dig in", strengthEdge: "I prepare hard", source: "ai" });
ok("pending cleared on confirm", getPendingCandidate() === null);
ok("no re-stash of confirmed", setPendingCandidate({ trait: "Need to be right", costEdge: "a", strengthEdge: "b" }) === null);

reset();
rejectCandidate({ trait: "Impatience", costEdge: "x", strengthEdge: "y" });
ok("no stash of rejected", setPendingCandidate({ trait: "Impatience", costEdge: "x", strengthEdge: "y" }) === null);

reset();
setPendingCandidate({ trait: "Restless drive", costEdge: "burnout", strengthEdge: "output" });
rejectCandidate(vulnerabilityId("Restless drive"));
ok("reject clears pending (self-heal)", getPendingCandidate() === null);

reset();
setPendingCandidate({ trait: "Worry", costEdge: "c", strengthEdge: "s" });
clearPendingCandidate();
ok("clearPending works", getPendingCandidate() === null);

console.log(`\nvulnerabilities.test: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
