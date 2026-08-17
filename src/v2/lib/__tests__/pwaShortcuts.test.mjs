/* P19 PWA shortcuts — manifest integrity + ?go= param mapping. */
import assert from "node:assert";
import fs from "node:fs";
let n=0; const ok=(name,f)=>{f();n++;console.log("PASS",name);};

const manifest = JSON.parse(fs.readFileSync(new URL("../../../../public/manifest.json", import.meta.url), "utf-8"));

ok("manifest declares exactly the three shortcuts", () => {
  assert.ok(Array.isArray(manifest.shortcuts));
  assert.strictEqual(manifest.shortcuts.length, 3);
});
ok("each shortcut has a name, a ?go= url, and an icon", () => {
  const gos = manifest.shortcuts.map((s) => s.url);
  assert.deepStrictEqual(gos.sort(), ["/?go=breathe", "/?go=reframe", "/?go=state"]);
  for (const s of manifest.shortcuts) {
    assert.ok(s.name && s.url && Array.isArray(s.icons) && s.icons.length >= 1);
  }
});
ok("shortcut urls map to the three real destinations only", () => {
  const valid = new Set(["breathe", "state", "reframe"]);
  for (const s of manifest.shortcuts) {
    const go = new URLSearchParams(s.url.split("?")[1]).get("go");
    assert.ok(valid.has(go), `unexpected go target: ${go}`);
  }
});
console.log(`pwaShortcuts: ${n}/3 pass`);
