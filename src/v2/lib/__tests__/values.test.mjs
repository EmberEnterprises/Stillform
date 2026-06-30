/*
 * values.test.mjs — run: node src/v2/lib/__tests__/values.test.mjs
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
  getValues, addUserValue, confirmValue, rejectCandidate,
  isConfirmed, isRejected, updateValue, removeValue,
  formatValuesForAI, valueId,
  setPendingCandidate, getPendingCandidate, clearPendingCandidate,
} = await import("../values.js");

let pass = 0, fail = 0;
const ok = (name, cond) => { if (cond) { pass++; } else { fail++; console.log("  FAIL:", name); } };
const reset = () => { store = {}; };

// 1) honest-empty on fresh + corrupt
reset();
ok("fresh → []", getValues().length === 0);
ok("fresh → format null", formatValuesForAI() === null);
store["stillform_v2_values"] = "{ not json";
ok("corrupt → []", getValues().length === 0);

// 2) user authors one
reset();
const r = addUserValue({ value: "Be someone my kid relies on", lookLike: "Present, not on my phone", oneStep: "Phone in a drawer at dinner" });
ok("addUser returns record", r && r.value === "Be someone my kid relies on" && r.source === "user");
ok("getValues has 1", getValues().length === 1);
ok("isConfirmed by id", isConfirmed(valueId("Be someone my kid relies on")));

// 3) blank field rejected, not stored
reset();
ok("blank lookLike → null", addUserValue({ value: "X", lookLike: "  ", oneStep: "y" }) === null);
ok("blank not stored", getValues().length === 0);
ok("missing step → null", addUserValue({ value: "X", lookLike: "y" }) === null);

// 4) dedup by value → update in place, not duplicate
reset();
addUserValue({ value: "Craft", lookLike: "a", oneStep: "b" });
addUserValue({ value: "craft", lookLike: "c", oneStep: "d" }); // same id (slug)
const dl = getValues();
ok("dedup → 1 record", dl.length === 1);
ok("dedup → fields updated", dl[0].lookLike === "c" && dl[0].oneStep === "d");

// 5) AI candidate confirm (source ai)
reset();
const aiRec = confirmValue({ value: "Steadiness", lookLike: "I keep promises to myself", oneStep: "One small promise kept today", source: "ai" });
ok("ai confirm stored", aiRec && aiRec.source === "ai");
ok("ai confirm visible", getValues().some((v) => v.value === "Steadiness"));

// 6) reject never resurfaces; confirm after reject un-rejects
reset();
rejectCandidate({ value: "Adventure", lookLike: "x", oneStep: "y" });
ok("rejected flagged", isRejected(valueId("Adventure")));
ok("rejected not in confirmed", !getValues().some((v) => v.value === "Adventure"));
confirmValue({ value: "Adventure", lookLike: "x", oneStep: "y", source: "user" });
ok("confirm after reject → un-rejected", !isRejected(valueId("Adventure")));
ok("confirm after reject → stored", getValues().some((v) => v.value === "Adventure"));

// 7) update edits fields, blank ignored
reset();
addUserValue({ value: "Honesty", lookLike: "I say the hard thing", oneStep: "One honest sentence today" });
const id = valueId("Honesty");
updateValue(id, { oneStep: "Tell them the real reason", lookLike: "  " });
const up = getValues()[0];
ok("update changes step", up.oneStep === "Tell them the real reason");
ok("update ignores blank lookLike", up.lookLike === "I say the hard thing");

// 8) remove
reset();
addUserValue({ value: "Health", lookLike: "move daily", oneStep: "walk after lunch" });
removeValue(valueId("Health"));
ok("removed", getValues().length === 0);

// 9) format: content, most-recent first, cap 5, null when empty
reset();
for (let i = 1; i <= 6; i++) addUserValue({ value: "V" + i, lookLike: "k" + i, oneStep: "s" + i });
const fmt = formatValuesForAI();
ok("format non-null", typeof fmt === "string" && fmt.length > 0);
ok("format caps at 5 lines", fmt.split("\n").length === 5);
ok("format most-recent first", fmt.split("\n")[0].startsWith("V6 —"));

// 10) pending AI candidate: stash, read, never re-nag, self-heal, clear
reset();
setPendingCandidate({ value: "Showing up", lookLike: "I don't ghost what matters", oneStep: "Reply to the one I've been avoiding" });
ok("pending stored", getPendingCandidate()?.value === "Showing up");
ok("pending blank → null", setPendingCandidate({ value: "x", lookLike: "", oneStep: "y" }) === null);
confirmValue({ value: "Showing up", lookLike: "I don't ghost what matters", oneStep: "Reply to the one I've been avoiding", source: "ai" });
ok("pending cleared on confirm", getPendingCandidate() === null);
ok("no re-stash of confirmed", setPendingCandidate({ value: "Showing up", lookLike: "a", oneStep: "b" }) === null);

reset();
rejectCandidate({ value: "Discipline", lookLike: "x", oneStep: "y" });
ok("no stash of rejected", setPendingCandidate({ value: "Discipline", lookLike: "x", oneStep: "y" }) === null);

reset();
setPendingCandidate({ value: "Patience", lookLike: "slow to react", oneStep: "one breath before replying" });
rejectCandidate(valueId("Patience"));
ok("reject clears pending (self-heal)", getPendingCandidate() === null);

reset();
setPendingCandidate({ value: "Curiosity", lookLike: "k", oneStep: "s" });
clearPendingCandidate();
ok("clearPending works", getPendingCandidate() === null);

console.log(`\nvalues.test: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
