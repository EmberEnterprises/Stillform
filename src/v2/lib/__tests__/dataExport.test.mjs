/* Data export — gathers the record, excludes secrets, parses values. */
import assert from "node:assert";
const store = new Map();
globalThis.localStorage = {
  getItem:(k)=>store.has(k)?store.get(k):null,
  setItem:(k,v)=>store.set(k,String(v)),
  removeItem:(k)=>store.delete(k),
  key:(i)=>[...store.keys()][i] ?? null,
  get length(){ return store.size; },
};
const de = await import("../dataExport.js");
let n=0; const ok=(name,f)=>{f();n++;console.log("PASS",name);};

store.set("stillform_v2_sessions", JSON.stringify([{id:"s1"}]));
store.set("stillform_signal_log", JSON.stringify([{chip:"tense"}]));
store.set("stillform_v2_auth", JSON.stringify({access_token:"SECRET"}));
store.set("stillform_install_id", "device-123");
store.set("unrelated_app_key", "ignore-me");

ok("gathers stillform keys, parsed", () => {
  const r = de.gatherRecord();
  assert.ok(r.data["stillform_v2_sessions"], "sessions included");
  assert.deepStrictEqual(r.data["stillform_signal_log"], [{chip:"tense"}], "parsed to object");
});
ok("EXCLUDES auth token and install id (secrets never exported)", () => {
  const r = de.gatherRecord();
  assert.ok(!("stillform_v2_auth" in r.data), "auth must be excluded");
  assert.ok(!("stillform_install_id" in r.data), "install id must be excluded");
});
ok("ignores non-stillform keys", () => {
  const r = de.gatherRecord();
  assert.ok(!("unrelated_app_key" in r.data));
});
ok("record has metadata shape", () => {
  const r = de.gatherRecord();
  assert.ok(r.exportedAt && r.app === "Stillform" && typeof r.keys === "number");
});
console.log(`dataExport: ${n}/4 pass`);
