/* Link Sentinel — target parsing + crisis classification (pure logic, no network). */
import assert from "node:assert";
const sentinel = await import("../link-sentinel.js");
let n=0; const ok=(name,f)=>{f();n++;console.log("PASS",name);};

ok("parses /go/ targets from netlify.toml", () => {
  const targets = (sentinel._readGoTargets || sentinel.default._readGoTargets)();
  assert.ok(Array.isArray(targets));
  assert.ok(targets.length >= 3, "should find the seeded /go/ targets");
  for (const t of targets) {
    assert.ok(t.id && t.from.startsWith("/go/") && t.to.startsWith("http"));
  }
});
ok("crisis ids are classified for the fast cadence", () => {
  assert.ok((sentinel._CRISIS_IDS || sentinel.default._CRISIS_IDS).has("helpline"));
  assert.ok((sentinel._CRISIS_IDS || sentinel.default._CRISIS_IDS).has("cvv"));
  assert.ok(!(sentinel._CRISIS_IDS || sentinel.default._CRISIS_IDS).has("some-marketing-page"));
});
ok("every parsed target has a resolvable id (no empty ids)", () => {
  const targets = (sentinel._readGoTargets || sentinel.default._readGoTargets)();
  for (const t of targets) assert.ok(t.id.length > 0);
});
console.log(`linkSentinel: ${n}/3 pass`);
