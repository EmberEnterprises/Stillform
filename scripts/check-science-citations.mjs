/**
 * check-science-citations.mjs — fabrication guard for the Library's science set.
 *
 * For every source string in scienceLibrary.js, confirms the lead author + year
 * actually appear in Stillform_Science_Sheet.md (the vetted source of truth).
 * Nothing in the Library's science may come from anywhere but the Sheet.
 *
 *   STRONG  — lead author and a cited year co-occur on the same Sheet line
 *   SOFT    — author and year both present in the Sheet, but not same line (eyeball)
 *   MISSING — author or year not found in the Sheet → fabrication risk, FAILS
 *
 * Run: node scripts/check-science-citations.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { SCIENCE_ENTRIES } from "../src/v2/lib/scienceLibrary.js";

const here = dirname(fileURLToPath(import.meta.url));
const sheetPath = join(here, "..", "Stillform_Science_Sheet.md");
const sheet = readFileSync(sheetPath, "utf8");
const sheetLines = sheet.split("\n");
const sheetLower = sheet.toLowerCase();

// Lead surname = first run of letters (incl. accented), skipping a leading quote.
function leadSurname(src) {
  const m = src.match(/[A-Za-zÀ-ÿ]+/);
  return m ? m[0] : null;
}
function years(src) {
  return [...src.matchAll(/\b(19|20)\d{2}\b/g)].map((m) => m[0]);
}

let strong = 0, soft = 0, missing = 0, total = 0;
const problems = [];

for (const entry of SCIENCE_ENTRIES) {
  for (const src of entry.sources || []) {
    total++;
    const surname = leadSurname(src);
    const ys = years(src);
    const sLower = (surname || "").toLowerCase();

    const authorPresent = sLower && sheetLower.includes(sLower);
    const yearsPresent = ys.filter((y) => sheet.includes(y));

    if (ys.length === 0) {
      // No year cited (e.g. "Davidson (Center for Healthy Minds)") — author-only check.
      if (authorPresent) { strong++; }
      else { missing++; problems.push(`MISSING  [${entry.id}] author "${surname}" not in Sheet :: ${src}`); }
      continue;
    }

    const sameLine = sheetLines.some(
      (ln) => sLower && ln.toLowerCase().includes(sLower) && ys.some((y) => ln.includes(y))
    );

    if (sameLine) {
      strong++;
    } else if (authorPresent && yearsPresent.length) {
      soft++;
      problems.push(`SOFT     [${entry.id}] "${surname}" + ${yearsPresent.join("/")} present but not same line :: ${src}`);
    } else {
      missing++;
      const why = !authorPresent ? `author "${surname}"` : `year(s) ${ys.join("/")}`;
      problems.push(`MISSING  [${entry.id}] ${why} not in Sheet :: ${src}`);
    }
  }
}

console.log(`\nScience citation check — ${SCIENCE_ENTRIES.length} entries, ${total} sources`);
console.log(`  STRONG (same-line)   : ${strong}`);
console.log(`  SOFT   (eyeball)     : ${soft}`);
console.log(`  MISSING (fabrication): ${missing}\n`);
if (problems.length) {
  console.log(problems.join("\n") + "\n");
}
if (missing > 0) {
  console.error(`RESULT: FAIL — ${missing} source(s) not grounded in the Science Sheet.`);
  process.exit(1);
}
console.log(`RESULT: PASS — every citation is grounded in the Science Sheet.${soft ? ` (${soft} soft, listed above for an eyeball.)` : ""}`);
