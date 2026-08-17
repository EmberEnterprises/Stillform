/* #1 account deletion — client order-of-operations + safety. */
import assert from "node:assert";
const store = new Map();
globalThis.localStorage = {
  getItem:(k)=>store.has(k)?store.get(k):null,
  setItem:(k,v)=>store.set(k,String(v)),
  removeItem:(k)=>store.delete(k),
  key:(i)=>[...store.keys()][i] ?? null,
  get length(){ return store.size; },
};
globalThis.indexedDB = undefined; // no IDB in the test env

// seed an authed session + some practice data
store.set("stillform_v2_auth", JSON.stringify({ access_token:"tok", expires_at: Date.now()+3600000, email:"a@b.co", user_id:"u1" }));
store.set("stillform_v2_sessions", JSON.stringify([{ id:"s1" }]));
store.set("stillform_v2_journal", JSON.stringify([{ id:"j1" }]));
store.set("unrelated_key", "keepme");

const da = await import("../deleteAccount.js");
let n=0; const ok=(name,f)=>{f();n++;console.log("PASS",name);};
let async_pass=0;

// --- server FAILS: local data must be preserved ---
globalThis.fetch = async () => ({ ok:false, status:502, json: async () => ({ error:"server boom" }) });
{
  const r = await da.deleteAccount();
  assert.strictEqual(r.ok, false, "should report failure");
  assert.ok(store.has("stillform_v2_sessions"), "MUST NOT wipe local data when server fails");
  console.log("PASS server-fail preserves local data"); async_pass++;
}

// --- server SUCCEEDS: local stillform* wiped, unrelated key kept ---
globalThis.fetch = async () => ({ ok:true, status:200, json: async () => ({ ok:true, deleted:{ personalDataTables:["stillform_subscription_state"] } }) });
{
  const r = await da.deleteAccount();
  assert.strictEqual(r.ok, true, "should succeed");
  assert.ok(!store.has("stillform_v2_sessions"), "sessions wiped");
  assert.ok(!store.has("stillform_v2_journal"), "journal wiped");
  assert.ok(!store.has("stillform_v2_auth"), "auth wiped");
  assert.ok(store.has("unrelated_key"), "non-stillform keys untouched");
  assert.ok(r.receipt && r.receipt.localKeysRemoved >= 1, "receipt reports keys removed");
  assert.ok(!("deviceKeyCleared" in r.receipt), "no false device-key claim in receipt");
  console.log("PASS server-success wipes stillform* only + honest receipt"); async_pass++;
}

// --- no token: refuses without calling fetch ---
store.clear();
{
  let called = false;
  globalThis.fetch = async () => { called = true; return { ok:true, json: async()=>({ok:true}) }; };
  const r = await da.deleteAccount();
  assert.strictEqual(r.ok, false, "no token => refuse");
  assert.strictEqual(called, false, "must not call server without a token");
  console.log("PASS no-token refuses before any server call"); async_pass++;
}

console.log(`deleteAccount: ${async_pass}/3 async checks pass`);
