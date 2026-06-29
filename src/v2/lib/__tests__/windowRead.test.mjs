/*
 * windowRead.test.mjs — run: node src/v2/lib/__tests__/windowRead.test.mjs
 * Integrity bar: never store blank/invalid; honest-empty + fail-silent;
 * AI candidate never re-proposes a field the user already set; self-heal.
 */
let store = {};
globalThis.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; },
  clear: () => { store = {}; },
};

const {
  getWindowRead, hasWindowRead, setTilt, setEarliestSignal, clearField, clearWindowRead,
  setPendingCandidate, getPendingCandidate, clearPendingCandidate, formatWindowReadForAI,
} = await import("../windowRead.js");

let pass = 0, fail = 0;
const ok = (name, cond) => { if (cond) { pass++; } else { fail++; console.log("  FAIL:", name); } };
const reset = () => { store = {}; };

// 1) honest-empty fresh + corrupt
reset();
ok("fresh → nulls", getWindowRead().tilt === null && getWindowRead().earliestSignal === null);
ok("fresh → !has", !hasWindowRead());
ok("fresh → format null", formatWindowReadForAI() === null);
store["stillform_v2_window_read"] = "{bad json";
ok("corrupt → nulls", getWindowRead().tilt === null);

// 2) set tilt — valid only
reset();
ok("invalid tilt → null", setTilt("panic") === null);
ok("invalid not stored", getWindowRead().tilt === null);
ok("revved stored", setTilt("revved") === "revved" && getWindowRead().tilt === "revved");
ok("has after set", hasWindowRead());
ok("flat overwrites", setTilt("flat") === "flat" && getWindowRead().tilt === "flat");
ok("shifts valid", setTilt("shifts") === "shifts");

// 3) earliest signal — non-blank only
reset();
ok("blank signal → null", setEarliestSignal("   ") === null);
ok("blank not stored", getWindowRead().earliestSignal === null);
ok("signal stored", setEarliestSignal("my jaw tightens") === "my jaw tightens");
ok("signal read back", getWindowRead().earliestSignal === "my jaw tightens");

// 4) format
reset();
setTilt("revved"); setEarliestSignal("chest goes tight");
const fmt = formatWindowReadForAI();
ok("format has tilt", /revved/.test(fmt));
ok("format has tell", /chest goes tight/.test(fmt));

// 5) clear a field / clear all
reset();
setTilt("flat"); setEarliestSignal("shoulders");
clearField("earliestSignal");
ok("field cleared", getWindowRead().earliestSignal === null && getWindowRead().tilt === "flat");
clearWindowRead();
ok("cleared all", !hasWindowRead());

// 6) AI candidate: proposes only unset fields
reset();
setTilt("revved"); // tilt already set
const c1 = setPendingCandidate({ tilt: "flat", earliestSignal: "throat tightens" });
ok("candidate skips set tilt", c1 && !c1.tilt && c1.earliestSignal === "throat tightens");
ok("pending readable", getPendingCandidate()?.earliestSignal === "throat tightens");

reset();
ok("candidate invalid+blank → null", setPendingCandidate({ tilt: "x", earliestSignal: "" }) === null);

// 7) self-heal: user sets the field the candidate proposed → candidate drops it
reset();
setPendingCandidate({ tilt: "flat", earliestSignal: "gut drops" });
setEarliestSignal("gut drops"); // user sets it themselves
const heal = getPendingCandidate();
ok("self-heal drops earliestSignal", heal && !heal.earliestSignal && heal.tilt === "flat");
setTilt("flat");
ok("self-heal fully clears", getPendingCandidate() === null);

// 8) confirm-via-setter clears that pending field; clearPending works
reset();
setPendingCandidate({ tilt: "revved" });
setTilt("revved", "ai"); // user accepted the AI proposal
ok("accept clears pending", getPendingCandidate() === null);
ok("accepted tilt stored", getWindowRead().tilt === "revved");

reset();
setPendingCandidate({ earliestSignal: "hands shake" });
clearPendingCandidate();
ok("clearPending works", getPendingCandidate() === null);

console.log(`\nwindowRead.test: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
