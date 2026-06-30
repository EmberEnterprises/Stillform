/*
 * strengths.test.mjs — run: node src/v2/lib/__tests__/strengths.test.mjs
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
  getStrengths, addUserStrength, confirmStrength, rejectCandidate,
  isConfirmed, isRejected, updateStrength, removeStrength,
  formatStrengthsForAI, strengthId,
  setPendingCandidate, getPendingCandidate, clearPendingCandidate,
} = await import("../strengths.js");

let pass = 0, fail = 0;
const ok = (name, cond) => { if (cond) { pass++; } else { fail++; console.log("  FAIL:", name); } };
const reset = () => { store = {}; };

// 1) honest-empty on fresh + corrupt
reset();
ok("fresh → []", getStrengths().length === 0);
ok("fresh → format null", formatStrengthsForAI() === null);
store["stillform_v2_strengths"] = "{ not json";
ok("corrupt → []", getStrengths().length === 0);

// 2) user authors one
reset();
const r = addUserStrength({ strength: "Reading a room", whereItShows: "I clock tension fast", leanInto: "Name what I notice out loud, sooner" });
ok("addUser returns record", r && r.strength === "Reading a room" && r.source === "user");
ok("getStrengths has 1", getStrengths().length === 1);
ok("isConfirmed by id", isConfirmed(strengthId("Reading a room")));

// 3) blank field rejected, not stored
reset();
ok("blank where → null", addUserStrength({ strength: "X", whereItShows: "  ", leanInto: "y" }) === null);
ok("blank not stored", getStrengths().length === 0);
ok("missing lean → null", addUserStrength({ strength: "X", whereItShows: "y" }) === null);

// 4) dedup by strength → update in place, not duplicate
reset();
addUserStrength({ strength: "Focus", whereItShows: "a", leanInto: "b" });
addUserStrength({ strength: "focus", whereItShows: "c", leanInto: "d" }); // same id (slug)
const dl = getStrengths();
ok("dedup → 1 record", dl.length === 1);
ok("dedup → fields updated", dl[0].whereItShows === "c" && dl[0].leanInto === "d");

// 5) AI candidate confirm (source ai)
reset();
const aiRec = confirmStrength({ strength: "Persistence", whereItShows: "I don't quit early", leanInto: "Pick one hard thing this week", source: "ai" });
ok("ai confirm stored", aiRec && aiRec.source === "ai");
ok("ai confirm visible", getStrengths().some((s) => s.strength === "Persistence"));

// 6) reject never resurfaces; confirm after reject un-rejects
reset();
rejectCandidate({ strength: "Humor", whereItShows: "x", leanInto: "y" });
ok("rejected flagged", isRejected(strengthId("Humor")));
ok("rejected not in confirmed", !getStrengths().some((s) => s.strength === "Humor"));
confirmStrength({ strength: "Humor", whereItShows: "x", leanInto: "y", source: "user" });
ok("confirm after reject → un-rejected", !isRejected(strengthId("Humor")));
ok("confirm after reject → stored", getStrengths().some((s) => s.strength === "Humor"));

// 7) update edits fields, blank ignored
reset();
addUserStrength({ strength: "Curiosity", whereItShows: "I ask the next question", leanInto: "Follow one tangent fully" });
const id = strengthId("Curiosity");
updateStrength(id, { leanInto: "Chase one rabbit hole a day", whereItShows: "  " });
const up = getStrengths()[0];
ok("update changes lean", up.leanInto === "Chase one rabbit hole a day");
ok("update ignores blank where", up.whereItShows === "I ask the next question");

// 8) remove
reset();
addUserStrength({ strength: "Kindness", whereItShows: "default to it", leanInto: "one act a day" });
removeStrength(strengthId("Kindness"));
ok("removed", getStrengths().length === 0);

// 9) format: content, most-recent first, cap 5, null when empty
reset();
for (let i = 1; i <= 6; i++) addUserStrength({ strength: "S" + i, whereItShows: "w" + i, leanInto: "l" + i });
const fmt = formatStrengthsForAI();
ok("format non-null", typeof fmt === "string" && fmt.length > 0);
ok("format caps at 5 lines", fmt.split("\n").length === 5);
ok("format most-recent first", fmt.split("\n")[0].startsWith("S6 —"));

// 10) pending AI candidate: stash, read, never re-nag, self-heal, clear
reset();
setPendingCandidate({ strength: "Calm under fire", whereItShows: "I slow down when others speed up", leanInto: "Be the one who names the next step" });
ok("pending stored", getPendingCandidate()?.strength === "Calm under fire");
ok("pending blank → null", setPendingCandidate({ strength: "x", whereItShows: "", leanInto: "y" }) === null);
confirmStrength({ strength: "Calm under fire", whereItShows: "I slow down when others speed up", leanInto: "Be the one who names the next step", source: "ai" });
ok("pending cleared on confirm", getPendingCandidate() === null);
ok("no re-stash of confirmed", setPendingCandidate({ strength: "Calm under fire", whereItShows: "a", leanInto: "b" }) === null);

reset();
rejectCandidate({ strength: "Patience", whereItShows: "x", leanInto: "y" });
ok("no stash of rejected", setPendingCandidate({ strength: "Patience", whereItShows: "x", leanInto: "y" }) === null);

reset();
setPendingCandidate({ strength: "Grit", whereItShows: "stay late", leanInto: "one rep more" });
rejectCandidate(strengthId("Grit"));
ok("reject clears pending (self-heal)", getPendingCandidate() === null);

reset();
setPendingCandidate({ strength: "Warmth", whereItShows: "w", leanInto: "l" });
clearPendingCandidate();
ok("clearPending works", getPendingCandidate() === null);

console.log(`\nstrengths.test: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
