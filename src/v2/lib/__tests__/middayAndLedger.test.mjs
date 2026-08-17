/* P23 midday beat + P27 learned-preference forget/allow. */
import assert from "node:assert";
const store = new Map();
globalThis.localStorage = { getItem:(k)=>store.has(k)?store.get(k):null, setItem:(k,v)=>store.set(k,String(v)), removeItem:(k)=>store.delete(k) };
store.set("stillform_calendar_consent","yes");
const cal = await import("../calendarData.js");
const cs = await import("../conciergeSignals.js");
const lp = await import("../learnedPreferences.js");
let n=0; const ok=(name,f)=>{f();n++;console.log("PASS",name);};
const at=(h,m=0)=>{const d=new Date();d.setHours(h,m,0,0);return d;};

/* ---- P23 ---- */
ok("P23 silent outside the midday window", () => {
  cal.setCalendarEvents([{ title:"X", start: at(16).toISOString(), end: at(17).toISOString() }]);
  assert.strictEqual(cs.getMiddayBeat(at(9).getTime(), { includeDismissed:true }), null);
  assert.strictEqual(cs.getMiddayBeat(at(16).getTime(), { includeDismissed:true }), null);
});
ok("P23 names the next thing during the midday window", () => {
  cal.setCalendarEvents([
    { title:"Standup", start: at(9).toISOString(), end: at(9,30).toISOString() },
    { title:"Review", start: at(14).toISOString(), end: at(15).toISOString() },
  ]);
  const m = cs.getMiddayBeat(at(12).getTime(), { includeDismissed:true });
  assert.ok(m && /Next up: Review/.test(m.note));
  assert.ok(/2 PM/.test(m.note));
});
ok("P23 speaks the open-afternoon line only if the morning had events", () => {
  cal.setCalendarEvents([{ title:"Morning thing", start: at(9).toISOString(), end: at(10).toISOString() }]);
  const m = cs.getMiddayBeat(at(12).getTime(), { includeDismissed:true });
  assert.ok(m && /afternoon is yours/.test(m.note));
});
ok("P23 silent on a fully empty day (P15 owns that)", () => {
  cal.setCalendarEvents([]);
  assert.strictEqual(cs.getMiddayBeat(at(12).getTime(), { includeDismissed:true }), null);
});

/* ---- P27 ---- */
ok("P27 forget removes a learned preference from the ledger", () => {
  store.delete("stillform_v2_learned_forgotten");
  const ss = []; for (let i=0;i<6;i++) ss.push({ id:"s"+i, mode:"calm" });
  store.set("stillform_v2_sessions", JSON.stringify(ss));
  let led = lp.getLearnedPreferences([]);
  assert.ok(led.some((l) => l.id === "habitual-entry"));
  lp.forgetLearnedPreference("habitual-entry");
  led = lp.getLearnedPreferences([]);
  assert.ok(!led.some((l) => l.id === "habitual-entry"), "forgotten pref should be gone");
});
ok("P27 allow re-permits a forgotten preference", () => {
  lp.allowLearnedPreference("habitual-entry");
  const led = lp.getLearnedPreferences([]);
  assert.ok(led.some((l) => l.id === "habitual-entry"), "allowed pref returns if habit holds");
});
console.log(`middayAndLedger: ${n}/6 pass`);
