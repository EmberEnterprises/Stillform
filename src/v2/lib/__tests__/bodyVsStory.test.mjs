/*
 * bodyVsStory.test.mjs — run: node src/v2/lib/__tests__/bodyVsStory.test.mjs
 * Integrity bar: deterministic mirror only — honest-empty, fail-silent, never
 * fabricates; surfaces only the body-states the user actually logged.
 */
let store = {};
const mockLS = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; },
  clear: () => { store = {}; },
};
globalThis.localStorage = mockLS;
// signalLog reads window.localStorage via safeLocalStorage() — provide it.
globalThis.window = { localStorage: mockLS };

const { recordSignal } = await import("../signalLog.js");
const {
  getBodyStoryReadings, getBodyStoryCount, bodyStateLabel, chipLabel,
  bodyCheckOptions, isLowState,
} = await import("../bodyVsStory.js");

let pass = 0, fail = 0;
const ok = (name, cond) => { if (cond) { pass++; } else { fail++; console.log("  FAIL:", name); } };
const reset = () => { store = {}; };

// 1) honest-empty on fresh + corrupt
reset();
ok("fresh → []", getBodyStoryReadings().length === 0);
ok("fresh → count 0", getBodyStoryCount() === 0);
store["stillform_signal_log"] = "{ not json";
ok("corrupt → []", getBodyStoryReadings().length === 0);
ok("corrupt → count 0", getBodyStoryCount() === 0);

// 2) clear-only / no-body entries are excluded
reset();
recordSignal({ chip: "anxious", body: ["clear"] });
recordSignal({ chip: "focused", body: [] });
recordSignal({ chip: "settled" }); // no body
ok("clear-only excluded", getBodyStoryReadings().length === 0);
ok("clear-only count 0", getBodyStoryCount() === 0);

// 3) a low body-state is surfaced, paired with the feeling
reset();
recordSignal({ chip: "anxious", body: ["depleted"] });
const r = getBodyStoryReadings();
ok("one low reading", r.length === 1);
ok("body label mapped", r[0].bodyLabels.includes("Depleted"));
ok("feeling label mapped", r[0].feeling === "Anxious");
ok("count 1", getBodyStoryCount() === 1);

// 4) low body with no chip → feeling null, still surfaced
reset();
recordSignal({ body: ["pain"] });
const r2 = getBodyStoryReadings();
ok("low w/o chip surfaced", r2.length === 1 && r2[0].feeling === null);
ok("pain label", r2[0].bodyLabels.includes("In pain"));

// 5) most-recent first + cap
reset();
recordSignal({ chip: "flat", body: ["sleep-deprived"] });   // oldest
recordSignal({ chip: "angry", body: ["hormonal"] });
recordSignal({ chip: "stuck", body: ["depleted"] });        // newest
const r3 = getBodyStoryReadings();
ok("most-recent first", r3[0].feeling === "Stuck");
ok("count 3", getBodyStoryCount() === 3);
// cap
reset();
for (let i = 0; i < 8; i++) recordSignal({ chip: "anxious", body: ["depleted"] });
ok("cap default 5", getBodyStoryReadings().length === 5);
ok("custom cap 3", getBodyStoryReadings(3).length === 3);
ok("count counts all 8", getBodyStoryCount() === 8);

// 6) only non-clear states count even when mixed with clear
reset();
recordSignal({ chip: "anxious", body: ["clear", "depleted"] });
const r4 = getBodyStoryReadings();
ok("mixed clear+low surfaced", r4.length === 1);
ok("only low label shown", r4[0].bodyLabels.length === 1 && r4[0].bodyLabels[0] === "Depleted");

// 7) helpers
ok("bodyStateLabel maps", bodyStateLabel("sleep-deprived") === "No sleep");
ok("bodyStateLabel fallback", bodyStateLabel("unknownX") === "unknownX");
ok("chipLabel maps", chipLabel("distant") === "Distant");
ok("isLowState true", isLowState("depleted") === true);
ok("isLowState clear false", isLowState("clear") === false);
ok("options include clear + lows", bodyCheckOptions().some((o) => o.id === "clear") && bodyCheckOptions().some((o) => o.id === "pain"));

console.log(`\nbodyVsStory.test: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
