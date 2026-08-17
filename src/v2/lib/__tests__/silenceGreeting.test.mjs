/* P15 deliberate silence, P16 threshold greeting. */
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

/* ---- P15 ---- */
ok("P15 speaks on a clear, light day", () => {
  amb.setWeather({ tempC: 20, condition:"clear", nextRain:null, at: Date.now() });
  cal.setCalendarEvents([]);
  const d = cs.getDeliberateSilence(at(8).getTime(), { includeDismissed:true });
  assert.ok(d && /the day is yours/.test(d.note));
});
ok("P15 silent when the day has real events", () => {
  cal.setCalendarEvents([
    { title:"A", start: at(10).toISOString(), end: at(11).toISOString() },
    { title:"B", start: at(14).toISOString(), end: at(15).toISOString() },
  ]);
  assert.strictEqual(cs.getDeliberateSilence(at(8).getTime(), { includeDismissed:true }), null);
});
ok("P15 silent when weather has something to say", () => {
  cal.setCalendarEvents([]);
  amb.setWeather({ tempC: 12, condition:"rain", nextRain:{ at: at(16).getTime(), probability: 80 }, at: Date.now() });
  assert.strictEqual(cs.getDeliberateSilence(at(8).getTime(), { includeDismissed:true }), null);
});
ok("P15 never speaks over a live voice", () => {
  amb.setWeather({ tempC: 20, condition:"clear", nextRain:null, at: Date.now() });
  cal.setCalendarEvents([]);
  assert.strictEqual(cs.getDeliberateSilence(at(8).getTime(), { includeDismissed:true, otherVoicesActive:true }), null);
});

/* ---- P16 ---- */
ok("P16 orients with day + calendar + weather", () => {
  amb.setWeather({ tempC: 15, condition:"clear", nextRain:{ at: at(16).getTime(), probability: 70 }, at: Date.now() });
  cal.setCalendarEvents([
    { title:"A", start: at(10).toISOString(), end: at(11).toISOString() },
    { title:"B", start: at(14).toISOString(), end: at(15).toISOString() },
  ]);
  const g = cs.getThresholdGreeting(at(7).getTime());
  assert.ok(g && /things on the calendar/.test(g.line));
  assert.ok(/Rain around 4 PM/.test(g.line));
});
ok("P16 returns null when there's nothing to orient (empty day, no weather)", () => {
  cal.setCalendarEvents([]);
  amb.setWeather({ tempC: 20, condition:"clear", nextRain:null, at: Date.now() });
  // just a weekday is not orientation
  assert.strictEqual(cs.getThresholdGreeting(at(7).getTime()), null);
});
ok("P16 handles a single event singular-cased", () => {
  cal.setCalendarEvents([{ title:"One", start: at(10).toISOString(), end: at(11).toISOString() }]);
  amb.setWeather({ tempC: 20, condition:"clear", nextRain:null, at: Date.now() });
  const g = cs.getThresholdGreeting(at(7).getTime());
  assert.ok(g && /One thing on the calendar/.test(g.line));
});
console.log(`silenceGreeting: ${n}/7 pass`);
