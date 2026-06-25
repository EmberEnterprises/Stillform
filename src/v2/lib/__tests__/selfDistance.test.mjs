// Unit harness for the self-distancing re-voicing primitive (Phase 1 / M2).
// Run: node src/v2/lib/__tests__/selfDistance.test.mjs
import { revoice } from "../selfDistance.js";

let pass = 0, fail = 0;
const eq = (got, want, label) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log((ok ? "  ✓ " : "  ✗ ") + label +
    (ok ? "" : `\n      got:  ${JSON.stringify(got)}\n      want: ${JSON.stringify(want)}`));
  ok ? pass++ : fail++;
};

// second person — the core deterministic path
eq(revoice("I brace for a verdict that rarely comes").text, "You brace for a verdict that rarely comes", "bare I + sentence-start cap");
eq(revoice("When the criticism hits, I brace").text, "When the criticism hits, you brace", "mid-sentence I stays lowercase");
eq(revoice("I'm exhausted and my chest is tight").text, "You're exhausted and your chest is tight", "I'm + my");
eq(revoice("I am the problem").text, "You are the problem", "I am -> you are");
eq(revoice("I was sure I'd fail").text, "You were sure you'd fail", "I was / I'd");
eq(revoice("I've carried this myself").text, "You've carried this yourself", "I've + myself");
eq(revoice("My fear is mine to hold").text, "Your fear is yours to hold", "My + mine");
eq(revoice("It scares me").text, "It scares you", "object me");
eq(revoice("I brace for a verdict that rarely comes").draft, false, "second person draft=false");

// third person — pronouns swap, verbs intentionally NOT conjugated (draft)
const t = revoice("I brace for a verdict that rarely comes", { person: "third", name: "Arlin" });
eq(t.text, "Arlin brace for a verdict that rarely comes", "third: pronoun->name (verb left)");
eq(t.draft, true, "third person draft=true (verb agreement deferred)");
eq(revoice("I am tired", { person: "third", name: "Arlin" }).text, "Arlin is tired", "third: I am -> Name is");

// integrity guards — never transforms nothing, never crashes
eq(revoice(""), null, "empty -> null");
eq(revoice("   "), null, "whitespace -> null");
eq(revoice(null), null, "non-string -> null");
eq(revoice("the verdict rarely comes"), null, "no first-person marker -> null");
eq(revoice("I brace", { person: "third" }), null, "third without name -> null");

console.log(`\n  ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
