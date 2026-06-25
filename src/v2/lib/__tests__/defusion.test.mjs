import { defuse } from "../defusion.js";

let pass = 0, fail = 0;
function ok(name, cond) {
  if (cond) { pass++; console.log("  ✓", name); }
  else { fail++; console.log("  ✗ FAIL:", name); }
}

ok("wraps a non-I statement, lowercasing the opener",
  defuse("everyone hates me") === "I'm having the thought that everyone hates me");
ok("keeps the pronoun I capitalized (I'm)",
  defuse("I'm a failure") === "I'm having the thought that I'm a failure");
ok("keeps I've capitalized",
  defuse("I've ruined everything") === "I'm having the thought that I've ruined everything");
ok("lowercases a possessive opener (My)",
  defuse("My chest is tight") === "I'm having the thought that my chest is tight");
ok("trims surrounding whitespace",
  defuse("   nothing will change   ") === "I'm having the thought that nothing will change");
ok("empty → null", defuse("") === null);
ok("whitespace → null", defuse("   ") === null);
ok("non-string → null", defuse(42) === null);
ok("null → null", defuse(null) === null);
ok("over-length → null", defuse("x".repeat(601)) === null);

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
