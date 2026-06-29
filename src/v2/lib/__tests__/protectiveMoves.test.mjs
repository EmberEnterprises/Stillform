/*
 * protectiveMoves.test.mjs — run: node src/v2/lib/__tests__/protectiveMoves.test.mjs
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
  getProtectiveMoves, addUserProtectiveMove, confirmProtectiveMove, rejectCandidate,
  isConfirmed, isRejected, updateProtectiveMove, removeProtectiveMove,
  formatProtectiveMovesForAI, protectiveMoveId,
  setPendingCandidate, getPendingCandidate, clearPendingCandidate,
} = await import("../protectiveMoves.js");

let pass = 0, fail = 0;
const ok = (name, cond) => { if (cond) { pass++; } else { fail++; console.log("  FAIL:", name); } };
const reset = () => { store = {}; };

// 1) honest-empty on fresh + corrupt
reset();
ok("fresh → []", getProtectiveMoves().length === 0);
ok("fresh → format null", formatProtectiveMovesForAI() === null);
store["stillform_v2_protective_moves"] = "{ this is not json";
ok("corrupt store → []", getProtectiveMoves().length === 0);

// 2) user authors one
reset();
const r = addUserProtectiveMove({ move: "Going still under conflict", protectedEdge: "It kept me safe as a kid", costEdge: "I disappear when I should speak" });
ok("addUser returns record", r && r.move === "Going still under conflict" && r.source === "user");
ok("getProtectiveMoves has 1", getProtectiveMoves().length === 1);
ok("isConfirmed by id", isConfirmed(protectiveMoveId("Going still under conflict")));

// 3) blank field rejected, not stored
reset();
ok("blank protected → null", addUserProtectiveMove({ move: "X", protectedEdge: "  ", costEdge: "y" }) === null);
ok("blank not stored", getProtectiveMoves().length === 0);
ok("missing cost → null", addUserProtectiveMove({ move: "X", protectedEdge: "y" }) === null);

// 4) dedup by move → update in place, not duplicate
reset();
addUserProtectiveMove({ move: "Smoothing it over", protectedEdge: "a", costEdge: "b" });
addUserProtectiveMove({ move: "smoothing it over", protectedEdge: "c", costEdge: "d" }); // same id (slug)
const dl = getProtectiveMoves();
ok("dedup → 1 record", dl.length === 1);
ok("dedup → fields updated", dl[0].protectedEdge === "c" && dl[0].costEdge === "d");

// 5) AI candidate confirm (source ai)
reset();
const aiRec = confirmProtectiveMove({ move: "Retreating into analysis", protectedEdge: "Thinking made me feel in control", costEdge: "I stall instead of acting", source: "ai" });
ok("ai confirm stored", aiRec && aiRec.source === "ai");
ok("ai confirm visible", getProtectiveMoves().some((m) => m.move === "Retreating into analysis"));

// 6) reject never resurfaces; confirm after reject un-rejects
reset();
rejectCandidate({ move: "Joking it off", protectedEdge: "x", costEdge: "y" });
ok("rejected flagged", isRejected(protectiveMoveId("Joking it off")));
ok("rejected not in confirmed", !getProtectiveMoves().some((m) => m.move === "Joking it off"));
confirmProtectiveMove({ move: "Joking it off", protectedEdge: "x", costEdge: "y", source: "user" });
ok("confirm after reject → un-rejected", !isRejected(protectiveMoveId("Joking it off")));
ok("confirm after reject → stored", getProtectiveMoves().some((m) => m.move === "Joking it off"));

// 7) update edits edges, blank ignored
reset();
addUserProtectiveMove({ move: "Taking charge", protectedEdge: "No one else would", costEdge: "I steamroll the room" });
const id = protectiveMoveId("Taking charge");
updateProtectiveMove(id, { costEdge: "I stop hearing people", protectedEdge: "  " });
const up = getProtectiveMoves()[0];
ok("update changes cost", up.costEdge === "I stop hearing people");
ok("update ignores blank protected", up.protectedEdge === "No one else would");

// 8) remove
reset();
addUserProtectiveMove({ move: "Withdrawing", protectedEdge: "space", costEdge: "isolation" });
removeProtectiveMove(protectiveMoveId("Withdrawing"));
ok("removed", getProtectiveMoves().length === 0);

// 9) format: content, most-recent first, cap 5, null when empty
reset();
for (let i = 1; i <= 6; i++) addUserProtectiveMove({ move: "M" + i, protectedEdge: "p" + i, costEdge: "c" + i });
const fmt = formatProtectiveMovesForAI();
ok("format non-null", typeof fmt === "string" && fmt.length > 0);
ok("format caps at 5 lines", fmt.split("\n").length === 5);
ok("format most-recent first", fmt.split("\n")[0].startsWith("M6 —"));

// 10) pending AI candidate: stash, read, never re-nag, self-heal, clear
reset();
setPendingCandidate({ move: "Getting away", protectedEdge: "Exits kept me safe", costEdge: "I leave before things resolve" });
ok("pending stored", getPendingCandidate()?.move === "Getting away");
ok("pending blank → null", setPendingCandidate({ move: "x", protectedEdge: "", costEdge: "y" }) === null);
confirmProtectiveMove({ move: "Getting away", protectedEdge: "Exits kept me safe", costEdge: "I leave before things resolve", source: "ai" });
ok("pending cleared on confirm", getPendingCandidate() === null);
ok("no re-stash of confirmed", setPendingCandidate({ move: "Getting away", protectedEdge: "a", costEdge: "b" }) === null);

reset();
rejectCandidate({ move: "Bracing for the worst", protectedEdge: "x", costEdge: "y" });
ok("no stash of rejected", setPendingCandidate({ move: "Bracing for the worst", protectedEdge: "x", costEdge: "y" }) === null);

reset();
setPendingCandidate({ move: "Over-preparing", protectedEdge: "readiness", costEdge: "exhaustion" });
rejectCandidate(protectiveMoveId("Over-preparing"));
ok("reject clears pending (self-heal)", getPendingCandidate() === null);

reset();
setPendingCandidate({ move: "Deflecting", protectedEdge: "p", costEdge: "c" });
clearPendingCandidate();
ok("clearPending works", getPendingCandidate() === null);

console.log(`\nprotectiveMoves.test: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
