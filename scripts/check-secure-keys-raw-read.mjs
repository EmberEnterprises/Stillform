#!/usr/bin/env node
// SECURE_KEYS raw-localStorage-read scanner.
//
// Audit philosophy v1.3 Layer 2.38: any localStorage.getItem on a SECURE_KEYS
// key returns the encrypted envelope { __enc: true, ... } for encrypted users,
// NOT the actual data. Reading raw silently produces empty arrays / wrong types.
//
// This scanner reads the SECURE_KEYS array from src/App.jsx, then scans the
// same file for any localStorage.getItem calls on those keys. Allow-listed
// exceptions are inline-commented with `// SECURE-KEYS-ALLOW: <reason>` —
// currently only the bio_filter EXISTS check (which uses !! and works on
// either envelope or plaintext).

import { readFileSync } from "node:fs";

const src = readFileSync("src/App.jsx", "utf8");

// Extract SECURE_KEYS array contents.
const secureMatch = src.match(/const\s+SECURE_KEYS\s*=\s*\[([^\]]+)\]/s);
if (!secureMatch) {
  console.error("SECURE_KEYS array not found in src/App.jsx");
  process.exit(1);
}
const secureKeys = [...secureMatch[1].matchAll(/"([^"]+)"/g)].map(m => m[1]);

if (secureKeys.length === 0) {
  console.error("SECURE_KEYS array parsed empty");
  process.exit(1);
}

// Scan src/App.jsx line-by-line for localStorage.getItem|setItem on any SECURE_KEYS key.
const lines = src.split("\n");
const violations = [];
const ALLOW_MARKER = "SECURE-KEYS-ALLOW";

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (const key of secureKeys) {
    const pattern = new RegExp(`localStorage\\.(getItem|setItem)\\(['"]${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`);
    if (pattern.test(line)) {
      // Check if this line OR the line above has an allow marker.
      const prevLine = i > 0 ? lines[i - 1] : "";
      if (line.includes(ALLOW_MARKER) || prevLine.includes(ALLOW_MARKER)) {
        continue; // explicitly allowed
      }
      violations.push({ line: i + 1, key, text: line.trim() });
    }
  }
}

// Allowed-by-design legacy: bio_filter EXISTS check (uses !! truthy presence,
// which works on either encrypted envelope or plaintext value).
const KNOWN_ALLOWED_LINES = [
  // line ~3767: const bioFilterSet = (() => { try { return !!localStorage.getItem("stillform_bio_filter"); } catch ...
];

const realViolations = violations.filter(v => {
  // bio_filter EXISTS check uses `!!localStorage.getItem("stillform_bio_filter")`
  // — that's truthy presence, works for both envelope and plaintext. Allow it.
  if (v.key === "stillform_bio_filter" && v.text.includes("!!localStorage.getItem")) return false;
  return true;
});

if (realViolations.length > 0) {
  console.error(`✗ Found ${realViolations.length} raw localStorage read(s) on SECURE_KEYS data:\n`);
  realViolations.forEach(v => {
    console.error(`  L${v.line} (${v.key}): ${v.text}`);
  });
  console.error(`\nFix: replace localStorage.getItem("${realViolations[0].key}") with secureRead("${realViolations[0].key}", default).`);
  console.error(`If the read MUST stay raw (e.g., presence check via !!), add // SECURE-KEYS-ALLOW: <reason> on or above the line.`);
  process.exit(1);
}

console.log(`✓ SECURE_KEYS guard: scanned ${secureKeys.length} encrypted keys; no unsafe raw reads.`);
process.exit(0);
