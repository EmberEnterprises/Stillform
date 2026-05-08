// Layer 2.39 systematic sweep — for every SECURE_KEYS entry, find all
// readers and writers and classify by storage mechanism.
import { readFileSync } from "node:fs";

const src = readFileSync("src/App.jsx", "utf8");

const secureMatch = src.match(/const\s+SECURE_KEYS\s*=\s*\[([^\]]+)\]/s);
const secureKeys = [...secureMatch[1].matchAll(/"([^"]+)"/g)].map(m => m[1]);

const lines = src.split("\n");

// Patterns to detect:
const READ_PATTERNS = [
  { name: "secureRead",          re: (k) => new RegExp(`secureRead\\(['"]${k}['"]`)},
  { name: "raw localStorage.getItem", re: (k) => new RegExp(`localStorage\\.getItem\\(['"]${k}['"]`) },
  { name: "readArrayFromStorage",re: (k) => new RegExp(`readArrayFromStorage\\(['"]${k}['"]`) },
  { name: "readJSON",            re: (k) => new RegExp(`readJSON\\(['"]${k}['"]`) },
];
// Pattern-detect writes inside known wrapper functions by reading the
// function body. After Path A migration these wrappers use secureWrite.
const wrapperBody = (fnName) => {
  const start = src.indexOf(`const ${fnName} = `);
  if (start < 0) return null;
  const end = src.indexOf("\n};", start);
  if (end < 0) return null;
  return src.slice(start, end + 3);
};

const wrapperWritesEncrypted = (fnName) => {
  const body = wrapperBody(fnName);
  if (!body) return false;
  return body.includes("secureWrite(");
};
const wrapperWritesRaw = (fnName) => {
  const body = wrapperBody(fnName);
  if (!body) return false;
  return body.includes("localStorage.setItem(");
};

console.log(`# SECURE_KEYS storage mechanism audit\n`);
console.log(`Found ${secureKeys.length} SECURE_KEYS entries.\n`);

const inconsistent = [];
const writeRawPlaintext = [];
const writeEncrypted = [];

for (const key of secureKeys) {
  const reads = [];
  const writes = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const p of READ_PATTERNS) {
      if (p.re(key) && p.re(key).test(line)) reads.push({ ln: i + 1, mech: p.name, src: line.trim().slice(0, 110) });
    }
    // Direct write detection — secureWrite, localStorage.setItem, secureSet
    if (new RegExp(`secureWrite\\(['"]${key}['"]`).test(line)) writes.push({ ln: i + 1, mech: "secureWrite", src: line.trim().slice(0, 110) });
    if (new RegExp(`localStorage\\.setItem\\(['"]${key}['"]`).test(line)) writes.push({ ln: i + 1, mech: "raw localStorage.setItem", src: line.trim().slice(0, 110) });
    if (new RegExp(`secureSet\\(['"]${key}['"]`).test(line)) writes.push({ ln: i + 1, mech: "secureSet (async)", src: line.trim().slice(0, 110) });
  }
  // Wrapper-body inspection — replaces previous hardcoded assumptions.
  // Detects what the wrapper functions ACTUALLY do, not what they used to do.
  if (key === "stillform_sessions") {
    if (wrapperWritesEncrypted("setSessionsInStorage")) {
      writes.push({ ln: 0, mech: "secureWrite (via setSessionsInStorage wrapper)", src: "wrapper inspected" });
    } else if (wrapperWritesRaw("setSessionsInStorage")) {
      writes.push({ ln: 0, mech: "raw localStorage.setItem (via setSessionsInStorage wrapper)", src: "wrapper inspected" });
    }
  }
  if (key === "stillform_checkin_history" || key === "stillform_eod_history") {
    if (wrapperWritesEncrypted("appendDailyLoopHistory")) {
      writes.push({ ln: 0, mech: "secureWrite (via appendDailyLoopHistory wrapper, secure branch)", src: "wrapper inspected" });
    } else if (wrapperWritesRaw("appendDailyLoopHistory")) {
      writes.push({ ln: 0, mech: "raw localStorage.setItem (via appendDailyLoopHistory wrapper)", src: "wrapper inspected" });
    }
  }
  if (key === "stillform_loop_nudge_events") {
    if (wrapperWritesEncrypted("appendLoopNudgeEvent")) {
      writes.push({ ln: 0, mech: "secureWrite (via appendLoopNudgeEvent wrapper)", src: "wrapper inspected" });
    } else if (wrapperWritesRaw("appendLoopNudgeEvent")) {
      writes.push({ ln: 0, mech: "raw localStorage.setItem (via appendLoopNudgeEvent wrapper)", src: "wrapper inspected" });
    }
  }
  
  const readMechs = [...new Set(reads.map(r => r.mech))];
  const writeMechs = [...new Set(writes.map(w => w.mech))];
  
  const isEncryptedWrite = writeMechs.some(m => m.includes("secureWrite") || m === "secureSet (async)");
  const isRawWrite = writeMechs.some(m => m.includes("raw localStorage.setItem"));
  
  if (isRawWrite) writeRawPlaintext.push(key);
  else if (isEncryptedWrite) writeEncrypted.push(key);
  
  // Mismatch detection
  const hasSecureRead = readMechs.includes("secureRead");
  const hasRawRead = readMechs.some(m => m.includes("raw localStorage.getItem") || m === "readArrayFromStorage");
  
  let status;
  if (writes.length === 0) status = "[NO WRITERS — read-only? or initialized elsewhere?]";
  else if (isRawWrite && hasSecureRead) status = "⚠️ MISMATCH: writes raw, reads via secureRead (stale-read bug)";
  else if (isEncryptedWrite && hasRawRead) {
    // bio_filter exists check is OK
    if (key === "stillform_bio_filter") status = "✓ EXISTS check via raw is allowed (bio_filter)";
    else status = "⚠️ MISMATCH: writes encrypted, reads raw (would see envelope)";
  }
  else if (isRawWrite && !isEncryptedWrite) status = "⚠️ NOT ACTUALLY ENCRYPTED AT REST (writes raw localStorage)";
  else if (isEncryptedWrite) status = "✓ Encrypted at rest";
  else status = "? indeterminate";
  
  if (status.includes("⚠️")) inconsistent.push({ key, status, reads, writes });
  
  console.log(`## ${key}`);
  console.log(`Status: ${status}`);
  console.log(`Reads (${reads.length}): ${readMechs.join(", ") || "none"}`);
  console.log(`Writes (${writes.length}): ${writeMechs.join(", ") || "none"}`);
  console.log();
}

console.log("\n# SUMMARY");
console.log(`Encrypted at rest (secureWrite path): ${writeEncrypted.length} keys`);
writeEncrypted.forEach(k => console.log(`  ✓ ${k}`));
console.log(`\nNOT encrypted at rest (raw localStorage.setItem): ${writeRawPlaintext.length} keys`);
writeRawPlaintext.forEach(k => console.log(`  ⚠️ ${k}`));
console.log(`\nMismatches needing fixes: ${inconsistent.length}`);
inconsistent.forEach(i => console.log(`  - ${i.key}: ${i.status}`));
