// crisisLanguage.test.mjs — run: node src/v2/lib/__tests__/crisisLanguage.test.mjs
import assert from "node:assert";
import { readFileSync } from "node:fs";
const { hasCrisisLanguage } = await import("../crisisLanguage.js");

// 1. Lockstep: the server copy must be byte-identical to the client source.
const a = readFileSync(new URL("../crisisLanguage.js", import.meta.url), "utf8");
const b = readFileSync(new URL("../../../../netlify/functions/_crisisLanguage.js", import.meta.url), "utf8");
assert.strictEqual(a, b, "netlify/functions/_crisisLanguage.js must be a byte-identical copy of src/v2/lib/crisisLanguage.js");

// 2. MUST open the door — the way people actually say it.
const positives = [
  "I keep thinking everyone would be better off if I wasn't here.",
  "Everyone would be better off without me",
  "my kids would be better off if I was gone",
  "I don't want to be here anymore",
  "I don’t want to wake up tomorrow",      // curly apostrophe
  "honestly i just dont want to exist",
  "wish I was dead",
  "I wish I'd never been born",
  "there's no reason to keep going",
  "no point in living like this",
  "life isn't worth it anymore",
  "I can't go on",
  "I'm so tired of living",
  "I'm done with life",
  "I want to go to sleep and not wake up",
  "I'd rather not be alive",
  "nobody would miss me",
  "no one would notice if I was gone",
  "I want to disappear forever",
  "I've been thinking about ending it",
  "I want to end my life",
  "I've been cutting myself again",
  "thinking about taking all my pills",
  "I can't do this anymore, I'd be better off dead",
  "he threatened to kill me",
  "my husband has been abusing me",
  "I'm going to hurt him if he says that again",
  "suicidal thoughts all week",
];
for (const s of positives) assert.ok(hasCrisisLanguage(s), `MISSED: "${s}"`);

// 3. MUST NOT open the door — ordinary intensity that is the practice.
const negatives = [
  "Boss moved the deadline up two days and my jaw is already locking.",
  "this project is killing me",
  "I'm dying to get out of this meeting",
  "I'm dead tired after that call",
  "I can't do this anymore, the spreadsheet is a mess",
  "I want to disappear for the weekend and read",
  "kill it at the presentation tomorrow",
  "the deadline is going to end me lol",
  "I could have died of embarrassment",
  "my sister didn't text back and I've decided she's angry at me",
  "three things due today and I keep opening the same email",
  "I want to end this contract",
  "she's going to kill me when she sees the bill",
  "I feel like giving up on this draft",
  "not worth the effort to reply",
  "I'm done with this job",
];
for (const s of negatives) assert.ok(!hasCrisisLanguage(s), `FALSE ALARM: "${s}"`);

console.log(`crisisLanguage.test.mjs: lockstep OK · ${positives.length} positives caught · ${negatives.length} negatives clear`);
