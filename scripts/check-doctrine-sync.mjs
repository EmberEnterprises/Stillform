// check-doctrine-sync.mjs — the epistemic doctrine's drift guard.
//
// The doctrine (Arlin, canon-level) is cloned into every AI surface's system
// prompt, adapted per surface but sharing non-negotiable commitments. The
// "keep in sync" comments are honor-system; this guard makes drift a FAILED
// GATE instead of a silent divergence (two surfaces speaking different
// values to the same person is the failure mode).
//
// Presence-guard design (not a full diff — the copies are legitimately
// adapted per surface): every AI-surface file must contain every sentinel,
// case-insensitive. Add new AI surfaces to SURFACES when they're born; add
// new sentinels when the doctrine grows a new non-negotiable.
//
// Run: node scripts/check-doctrine-sync.mjs   (exit 1 on any miss)

import { readFileSync } from "node:fs";

const SURFACES = [
  "netlify/functions/reframe.js",
  "netlify/functions/devils-advocate.js",
  "netlify/functions/re-read.js",
];

const DOCTRINE_SENTINELS = [
  "sole source of truth",   // neither the user nor the AI owns truth alone
  "suggestive",             // delivery is suggestive...
  "deterministic",          // ...never deterministic
  "verdict",                // never a verdict / the craft rule's edge
];

// The canon must carry the doctrine too (the source the clones cite).
const CANON = "STILLFORM_CANON.md";

let failures = 0;
for (const file of [...SURFACES, CANON]) {
  let text;
  try {
    text = readFileSync(file, "utf-8").toLowerCase();
  } catch {
    console.error(`MISSING FILE: ${file}`);
    failures++;
    continue;
  }
  for (const sentinel of DOCTRINE_SENTINELS) {
    if (!text.includes(sentinel)) {
      console.error(`DRIFT: ${file} lost doctrine sentinel "${sentinel}"`);
      failures++;
    }
  }
}

if (failures) {
  console.error(`\nRESULT: FAIL — ${failures} doctrine drift(s). The doctrine is canon-level; re-sync before shipping.`);
  process.exit(1);
}
console.log(`RESULT: PASS — all ${SURFACES.length + 1} doctrine carriers hold all ${DOCTRINE_SENTINELS.length} sentinels.`);
