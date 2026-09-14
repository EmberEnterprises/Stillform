/**
 * check-chip-definitions.mjs — doc↔code lockstep guard for the feel chips
 * (board B20, 2026-09-14). CHIP_DEFINITIONS.md is the doc of record; the
 * registry is src/v2/lib/chipDefinitions.js. The doc's own rule: "ships
 * together". This makes it mechanical: same ids, no more, no fewer, and the
 * per-beat subsets in beatConfig.js only use ids the registry knows.
 * Run: node scripts/check-chip-definitions.mjs
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const doc = readFileSync(join(root, "CHIP_DEFINITIONS.md"), "utf8");
const { CHIP_DEFINITIONS } = await import("../src/v2/lib/chipDefinitions.js");
const beatSrc = readFileSync(join(root, "src", "v2", "lib", "beatConfig.js"), "utf8");

// Doc: the "### Name" headings between "## The 9 definitions" and the next "## "
const section = doc.split(/^## The 9 definitions/m)[1]?.split(/^## /m)[0] || "";
const docIds = [...section.matchAll(/^### ([A-Za-z]+)\s*$/gm)].map((m) => m[1].toLowerCase());
const codeIds = Object.keys(CHIP_DEFINITIONS);

const problems = [];
for (const id of docIds) if (!codeIds.includes(id)) problems.push(`doc defines "${id}" but chipDefinitions.js lacks it`);
for (const id of codeIds) if (!docIds.includes(id)) problems.push(`chipDefinitions.js has "${id}" but CHIP_DEFINITIONS.md lacks it`);

// beatConfig subsets must only name registry ids
const subsetIds = [...beatSrc.matchAll(/selectChips\(\[([^\]]*)\]\)/g)]
  .flatMap((m) => [...m[1].matchAll(/"([a-z-]+)"/g)].map((x) => x[1]));
for (const id of new Set(subsetIds)) if (!codeIds.includes(id)) problems.push(`beatConfig.js selects "${id}" which is not in chipDefinitions.js`);

console.log(`chip ids — doc: ${docIds.length}, code: ${codeIds.length}, beatConfig references: ${new Set(subsetIds).size}`);
if (problems.length) {
  for (const p of problems) console.log("  ✗ " + p);
  console.log("RESULT: FAIL — chip definitions out of lockstep.");
  process.exit(1);
}
console.log("RESULT: PASS — CHIP_DEFINITIONS.md, chipDefinitions.js and beatConfig.js agree.");
