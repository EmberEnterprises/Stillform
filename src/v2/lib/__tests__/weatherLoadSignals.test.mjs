/* P4 heat/cold-as-hardware, P5 leave-earlier, P6 seasonal dark, P7 clearest window. */
import assert from "node:assert";
const store = new Map();
globalThis.localStorage = { getItem:(k)=>store.has(k)?store.get(k):null, setItem:(k,v)=>store.set(k,String(v)), removeItem:(k)=>store.delete(k) };
store.set("stillform_weather_consent","yes");
store.set("stillform_calendar_consent","yes");
const amb = await import("../ambientSignals.js");
const cal = await import("../calendarData.js");
const cs = await import("../conciergeSignals.js");
let n=0; const ok=(name,f)=>{f();n++;console.log("PASS",name);};
const at=(h,m=0)=>{const d=new Date();d.setHours(h,m,0,0);return d;};

/* ---- P4 ---- */
ok("P4 fires on a hot day, frames it as weather not self", () => {
  amb.setWeather({ tempC: 34, condition:"clear", at: Date.now() });
  const t = cs.getTempHardwareNote(Date.now(), { includeDismissed:true });
  assert.ok(t && /the weather, not you/.test(t.note));
  assert.strictEqual(t.kind, "heat");
});
ok("P4 fires on a cold day", () => {
  amb.setWeather({ tempC: -9, condition:"snow", at: Date.now() });
  const t = cs.getTempHardwareNote(Date.now(), { includeDismissed:true });
  assert.ok(t && t.kind === "cold");
});
ok("P4 silent at a normal temperature", () => {
  amb.setWeather({ tempC: 18, condition:"clear", at: Date.now() });
  assert.strictEqual(cs.getTempHardwareNote(Date.now(), { includeDismissed:true }), null);
});

/* ---- P5 ---- */
ok("P5 fires when rough weather precedes a soon event", () => {
  amb.setWeather({ tempC: 5, condition:"rain", at: Date.now() });
  const soon = at(new Date().getHours()+1);
  cal.setCalendarEvents([{ title:"Clinic", start: soon.toISOString(), durationMin:60 }]);
  const l = cs.getLeaveEarlierNote(Date.now(), { includeDismissed:true });
  assert.ok(l && /ten minutes early/.test(l.note));
});
ok("P5 silent in clear weather", () => {
  amb.setWeather({ tempC: 20, condition:"clear", at: Date.now() });
  assert.strictEqual(cs.getLeaveEarlierNote(Date.now(), { includeDismissed:true }), null);
});

/* ---- P6 ---- */
ok("P6 fires on a short-daylight afternoon", () => {
  amb.setWeather({ tempC: 2, condition:"overcast", daylightHours: 8.5, at: Date.now() });
  const evening = at(17).getTime();
  const d = cs.getSeasonalDarkNote(evening, { includeDismissed:true });
  assert.ok(d && /the season, not a verdict/.test(d.note));
});
ok("P6 silent when daylight is long", () => {
  amb.setWeather({ tempC: 20, condition:"clear", daylightHours: 15, at: Date.now() });
  assert.strictEqual(cs.getSeasonalDarkNote(at(17).getTime(), { includeDismissed:true }), null);
});

/* ---- P7 ---- */
ok("P7 names the longest open stretch", () => {
  const now = at(9).getTime();
  cal.setCalendarEvents([{ title:"Standup", start: at(9,30).toISOString(), end: at(10).toISOString() }]);
  const c = cs.getClearestWindow(now, { includeDismissed:true });
  assert.ok(c && c.minutes >= 60);
  assert.ok(/uninterrupted/.test(c.note));
});
ok("P7 silent when the day is chopped into small pieces", () => {
  const now = at(9).getTime();
  const evs = [];
  for (let h = 9; h < 18; h++) evs.push({ title:"m"+h, start: at(h,10).toISOString(), end: at(h,55).toISOString() });
  cal.setCalendarEvents(evs);
  assert.strictEqual(cs.getClearestWindow(now, { includeDismissed:true }), null);
});
console.log(`weatherLoadSignals: ${n}/9 pass`);
