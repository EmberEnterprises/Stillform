/* P1 umbrella note — rain window intersecting a calendar event. */
import assert from "node:assert";
const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};
// consent gates
store.set("stillform_weather_consent", "yes");
store.set("stillform_calendar_consent", "yes");

const amb = await import("../ambientSignals.js");
const cal = await import("../calendarData.js");
const cs = await import("../conciergeSignals.js");
let n = 0; const ok = (name, f) => { f(); n++; console.log("PASS", name); };

const now = Date.now();
const rainAt = now + 2 * 60 * 60 * 1000; // 2h ahead

ok("umbrella fires when rain lines up with an event", () => {
  amb.setWeather({ tempC: 12, condition: "rain", nextRain: { at: rainAt, probability: 80 }, at: now });
  cal.setCalendarEvents([{ title: "Dentist", start: new Date(rainAt).toISOString() }]);
  const u = cs.getUmbrellaNote(now, { includeDismissed: true });
  assert.ok(u && /umbrella by the door/.test(u.note));
  assert.ok(/Dentist/.test(u.note));
});
ok("stays silent when it's dry", () => {
  amb.setWeather({ tempC: 20, condition: "clear", nextRain: null, at: now });
  assert.strictEqual(cs.getUmbrellaNote(now, { includeDismissed: true }), null);
});
ok("stays silent when no event straddles the rain", () => {
  amb.setWeather({ tempC: 12, condition: "rain", nextRain: { at: rainAt, probability: 80 }, at: now });
  cal.setCalendarEvents([{ title: "Far off", start: new Date(now + 20 * 60 * 60 * 1000).toISOString() }]);
  assert.strictEqual(cs.getUmbrellaNote(now, { includeDismissed: true }), null);
});
console.log(`umbrellaNote: ${n}/3 pass`);
