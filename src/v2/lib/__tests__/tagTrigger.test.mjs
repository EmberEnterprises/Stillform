// Mock a minimal localStorage before importing the module.
const _store = new Map();
global.localStorage = {
  getItem: (k) => (_store.has(k) ? _store.get(k) : null),
  setItem: (k, v) => _store.set(k, String(v)),
  removeItem: (k) => _store.delete(k),
  clear: () => _store.clear(),
};

const { tagTrigger, getTriggerProfile } = await import("../triggerProfile.js");

let pass = 0, fail = 0;
const ok = (name, cond) => cond ? (pass++, console.log("  ✓", name)) : (fail++, console.log("  ✗ FAIL:", name));

// new label → created with one encounter, canonical label returned
{
  const label = tagTrigger("Conflict");
  ok("new label returns canonical label", label === "Conflict");
  const p = getTriggerProfile();
  const t = p.triggers.find((x) => x.label === "Conflict");
  ok("trigger created", !!t);
  ok("encounterCount = 1 after first tag", t && t.encounterCount === 1);
}

// same label (different case) → matches existing, increments, no duplicate
{
  const label = tagTrigger("conflict");
  ok("case-insensitive match returns existing canonical label", label === "Conflict");
  const p = getTriggerProfile();
  const matches = p.triggers.filter((x) => x.label.toLowerCase() === "conflict");
  ok("no duplicate created", matches.length === 1);
  ok("encounterCount = 2 after second tag", matches[0].encounterCount === 2);
}

// empty / invalid → null, nothing logged
{
  ok("empty label → null", tagTrigger("") === null);
  ok("whitespace label → null", tagTrigger("   ") === null);
  ok("non-string → null", tagTrigger(null) === null);
}

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
