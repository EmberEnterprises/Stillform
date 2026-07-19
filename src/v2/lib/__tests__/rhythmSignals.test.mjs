/* P8 time-of-day, P9 day-of-week, P10 immediate decompression, P12 learned prefs. */
import assert from "node:assert";
const store = new Map();
globalThis.localStorage = { getItem:(k)=>store.has(k)?store.get(k):null, setItem:(k,v)=>store.set(k,String(v)), removeItem:(k)=>store.delete(k) };
store.set("stillform_calendar_consent","yes");
const eng = await import("../discoveryEngine.js");
const find = await import("../discoveryFindings.js");
const eod = await import("../eodDecompression.js");
const cal = await import("../calendarData.js");
const lp = await import("../learnedPreferences.js");
let n=0; const ok=(name,f)=>{f();n++;console.log("PASS",name);};

const entry = (isoDate, chip="tense") => ({ chip, triggers:[], loggedAt: isoDate });

/* ---- P8 ---- */
ok("P8 finds a real time-of-day concentration", () => {
  const es = [];
  for (let i=0;i<10;i++){ const d=new Date(2026,0,5+i,15,30); es.push(entry(d.toISOString())); }
  const r = eng.findPatterns(es);
  const tod = r.candidates.filter(c=>c.kind==="time-of-day");
  assert.ok(tod.length >= 1, "should surface a concentrated band");
  assert.strictEqual(tod[0].band.id, "late-afternoon");
});
ok("P8 silent on an evenly spread record", () => {
  const es = [];
  const hours=[6,10,13,16,19,23,7,11,14,17];
  hours.forEach((h,i)=>{ const d=new Date(2026,0,5+i,h,0); es.push(entry(d.toISOString())); });
  const r = eng.findPatterns(es);
  assert.strictEqual(r.candidates.filter(c=>c.kind==="time-of-day").length, 0);
});

/* ---- P9 ---- */
ok("P9 finds a day-of-week concentration from THEIR record", () => {
  const es = [];
  // 8 Tuesdays + 2 others
  for (let i=0;i<8;i++){ const d=new Date(2026,0,6+i*7,12,0); es.push(entry(d.toISOString())); } // Jan 6 2026 = Tuesday
  es.push(entry(new Date(2026,0,8,12,0).toISOString()));
  es.push(entry(new Date(2026,0,9,12,0).toISOString()));
  const r = eng.findPatterns(es);
  const dow = r.candidates.filter(c=>c.kind==="day-of-week");
  assert.ok(dow.length >= 1);
  assert.strictEqual(dow[0].day.label, "Tuesday");
});

/* ---- candidate id/label handle the new kinds (the caught defect) ---- */
ok("new kinds get real ids, not co:undefined", () => {
  const todId = find.candidateId({ kind:"time-of-day", band:{ id:"evening", label:"evening" } });
  const dowId = find.candidateId({ kind:"day-of-week", day:{ index:2, label:"Tuesday" } });
  assert.strictEqual(todId, "tod:evening");
  assert.strictEqual(dowId, "dow:2");
  assert.ok(!/undefined/.test(todId + dowId));
});
ok("new kinds get plain-language labels", () => {
  const l1 = find.candidateLabel({ kind:"time-of-day", band:{ id:"evening", label:"evening" } });
  const l2 = find.candidateLabel({ kind:"day-of-week", day:{ index:2, label:"Tuesday" } });
  assert.ok(/evening/.test(l1) && /Tuesday/.test(l2));
});

/* ---- P10 ---- */
ok("P10 offers set-down for a FLAGGED event that just ended", () => {
  store.set("stillform_v2_trigger_profile", JSON.stringify({ triggers:[{ id:"trig_test_1", label:"review" }] }));
  const now = Date.now();
  const start = new Date(now - 65*60000).toISOString();
  const end = new Date(now - 5*60000).toISOString();
  cal.setCalendarEvents([{ title:"Performance review", start, end }]);
  const d = eod.getImmediateDecompression(now, { includeDismissed:true });
  assert.ok(d && /just ended/.test(d.note), "flagged just-ended event should offer");
});
ok("P10 silent for an ordinary unflagged meeting", () => {
  const now = Date.now();
  cal.setCalendarEvents([{ title:"Coffee catchup", start:new Date(now-65*60000).toISOString(), end:new Date(now-5*60000).toISOString() }]);
  assert.strictEqual(eod.getImmediateDecompression(now, { includeDismissed:true }), null);
});

/* ---- P12 ---- */
ok("P12 honest-empty below the evidence floor", () => {
  store.set("stillform_v2_sessions", JSON.stringify([{ id:"a", mode:"calm" }]));
  assert.strictEqual(lp.getHabitualEntry(), null);
});
ok("P12 names a real habit and calls it a default, not a lock", () => {
  const ss = [];
  for (let i=0;i<6;i++) ss.push({ id:"s"+i, mode:"calm" });
  store.set("stillform_v2_sessions", JSON.stringify(ss));
  const h = lp.getHabitualEntry();
  assert.ok(h && /default/.test(h.line));
  assert.ok(/changes/.test(h.line));
});
ok("P12 quiet-day uses THEIR record, no assumed week", () => {
  const d = [];
  for (let i=0;i<5;i++) d.push({ at: new Date(2026,0,4+i*7,10,0).getTime() }); // Sundays
  const q = lp.getQuietDay(d);
  assert.ok(q && q.dayLabel === "Sunday");
});
console.log(`rhythmSignals: ${n}/10 pass`);
