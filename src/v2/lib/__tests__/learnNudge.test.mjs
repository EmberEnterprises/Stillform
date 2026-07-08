// learnNudge.test.mjs — the earned next-lesson nudge contract.
// Doctrine under test (concierge, corrected 2026-07-08): EARNED (never nudge a
// user who hasn't engaged with the Track), REAL (a concrete next lesson),
// POLITE (dismissal remembered; re-engagement reopens it), honest-empty.
import assert from "node:assert";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => void store.set(k, String(v)),
  removeItem: (k) => void store.delete(k),
  clear: () => store.clear(),
};
const reset = () => store.clear();

const tp = await import("../trackProgress.js");
const LESSONS = [{ id: "l1" }, { id: "l2" }, { id: "l3" }];
let passed = 0;
const ok = (name, fn) => { fn(); passed++; console.log("PASS " + name); };

ok("never nudges a user who has not engaged (earned rule)", () => {
  reset();
  assert.strictEqual(tp.getNextLessonNudge(LESSONS), null);
});

ok("honest-empty on bad input", () => {
  reset();
  assert.strictEqual(tp.getNextLessonNudge(null), null);
  assert.strictEqual(tp.getNextLessonNudge([]), null);
});

ok("after one practice, offers the first unpracticed lesson in order", () => {
  reset();
  tp.recordPractice("l1");
  assert.deepStrictEqual(tp.getNextLessonNudge(LESSONS), { id: "l2" });
});

ok("a marked-but-unpracticed move leads over registry order", () => {
  reset();
  tp.recordPractice("l1");
  tp.toggleWorkingOn("l3");
  assert.deepStrictEqual(tp.getNextLessonNudge(LESSONS), { id: "l3" });
});

ok("working-on alone counts as engagement", () => {
  reset();
  tp.toggleWorkingOn("l2");
  assert.deepStrictEqual(tp.getNextLessonNudge(LESSONS), { id: "l2" });
});

ok("dismissal silences the nudge (polite rule)", () => {
  reset();
  tp.recordPractice("l1");
  assert.notStrictEqual(tp.getNextLessonNudge(LESSONS), null);
  tp.dismissLessonNudge();
  assert.strictEqual(tp.getNextLessonNudge(LESSONS), null);
});

ok("practicing again after a dismissal reopens the conversation", () => {
  reset();
  tp.recordPractice("l1");
  tp.dismissLessonNudge();
  assert.strictEqual(tp.getNextLessonNudge(LESSONS), null);
  tp.recordPractice("l2"); // re-engagement postdates the dismissal
  assert.deepStrictEqual(tp.getNextLessonNudge(LESSONS), { id: "l3" });
});

ok("a stale dismissal (past the quiet window) no longer silences", () => {
  reset();
  tp.recordPractice("l1");
  const old = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString();
  store.set("stillform_v2_track_nudge", JSON.stringify({ dismissedAt: old }));
  assert.deepStrictEqual(tp.getNextLessonNudge(LESSONS), { id: "l2" });
});

ok("everything practiced = nothing honest to offer", () => {
  reset();
  tp.recordPractice("l1");
  tp.recordPractice("l2");
  tp.recordPractice("l3");
  assert.strictEqual(tp.getNextLessonNudge(LESSONS), null);
});

console.log(`learnNudge: ${passed}/9 pass`);
