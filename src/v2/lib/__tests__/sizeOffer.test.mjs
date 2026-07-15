import assert from "node:assert";
globalThis.localStorage = { getItem:()=>null, setItem:()=>{}, removeItem:()=>{} };
const cs = await import("../conciergeSignals.js");
let n=0; const ok=(name,f)=>{f();n++;console.log("PASS",name);};
ok("12+ min = full", () => { assert.strictEqual(cs.sizeOfferToWindow(15).size, "full"); });
ok("5-11 min = scan", () => { assert.strictEqual(cs.sizeOfferToWindow(7).size, "scan"); });
ok("2-4 min = breath, phrased 'short version'", () => { const r=cs.sizeOfferToWindow(3); assert.strictEqual(r.size,"breath"); assert.ok(/short version/.test(r.label)); });
ok("under 2 min = nothing fits, silent", () => { const r=cs.sizeOfferToWindow(1); assert.strictEqual(r.fits,false); assert.strictEqual(r.label,null); });
console.log(`sizeOffer: ${n}/4 pass`);
