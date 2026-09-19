/**
 * crisisLanguage.js — ONE crisis-language detector for the whole app.
 *
 * Stranger test 2026-09-15: "I keep thinking everyone would be better off if I
 * wasn't here" did NOT open the crisis door. Five backend functions carried
 * five different keyword lists, all tuned to explicit words ("suicide", "kill
 * myself") and none to the way people actually say it. This file is the
 * single source. netlify/functions/_crisisLanguage.js is a byte-identical
 * copy (esbuild can't reach outside the functions dir); the lockstep test
 * fails the build if the two ever drift.
 *
 * Doctrine: err toward the door. A false open costs one screen a person can
 * dismiss; a false close costs the thing the app exists to protect. But
 * ordinary frustration ("this is killing me", "dying to leave", "I can't do
 * this anymore" about a deadline) must NOT trip it — those are practice.
 *
 * Categories (all case-insensitive, apostrophes optional):
 *   A. explicit: suicide, kill myself, end my life, take my life
 *   B. self-harm: hurt/cut/harm myself, self-harm, overdose
 *   C. passive ideation — the ones the old lists missed:
 *      better off without me / if I wasn't here / if I were gone
 *      don't want to be here (anymore) / wake up / be alive / exist
 *      wish I was dead / were dead / wasn't born
 *      no reason to live / go on; not worth living; can't go on
 *      tired of living / being alive; done with life; done living
 *      go to sleep and not wake up; rather not be alive; rather be dead
 *      nobody would miss / notice / care (if I was gone)
 *      disappear forever / stop existing / want out of this life
 *   D. harm to or from others (kept from the old lists): abuse, threats
 *      to kill or hurt, sexual violence — these route to the door too.
 */

export const CRISIS_PATTERNS = [
  // A. explicit
  /\bsuicid/i,
  /\bkill(ing)? myself\b/i,
  /\b(end|ending|take|taking) my (own )?life\b/i,
  /\bend it all\b/i,
  /\b(thinking about|thought about|think about|considering|planning on|planning to|been thinking of) (ending it|ending things|ending everything|killing myself|dying|suicide|not being here|checking out for good)\b/i,
  /\b(want|wanna|going|gonna|ready) to (end it|end everything|end things|die|be dead)\b/i,
  // B. self-harm
  /\bself[- ]?harm/i,
  /\b(hurt|hurting|cut|cutting|harm|harming) myself\b/i,
  /\boverdos/i,
  /\b(take|taking|took|swallow|swallowing) (all|the whole bottle of|too many|a bottle of|every) (of )?(my |the )?(pills|meds|medication|medications)\b/i,
  // C. passive ideation
  /\bbetter off (without me|if i (wasnt|werent|was not|were not|was never|had never been) (here|around|alive|born)|if i (were|was) gone|if i (disappeared|died|left|vanished))/i,
  /\b(world|everyone|everybody|they|my (family|kids|children|wife|husband|partner)) would be better (off|without me)\b/i,
  /\b(dont|do not|didnt|never) want to (be here|be around|be alive|exist|live|wake up|keep going|go on|be in this world)( anymore| any more)?\b/i,
  /\bwish i (was|were) (dead|gone|not here|never born)\b/i,
  /\bwish i(d| had| was| were|)? ?(wasnt|werent|was not|were not|had never been|never been|never was|was never) (born|here|alive)\b/i,
  /\bno (reason|point) (to|in) (live|living|go on|going on|keep going|carrying on|wake up|waking up)\b/i,
  /\b(life|it) (isnt|is not|aint|is no longer) worth (living|it anymore|it any more)\b/i,
  /\bnot worth living\b/i,
  /\bcant go on\b/i,
  /\b(tired|sick) of (living|being alive|this life|existing)\b/i,
  /\bdone (with|living) (life|this life|living)\b/i,
  /\b(go to sleep|fall asleep|close my eyes) and (not|never) wake up\b/i,
  /\brather (be dead|not be alive|not be here|not wake up|not exist)\b/i,
  /\b(nobody|no one|no-one) would (miss|notice|care)( if i| whether i)?\b/i,
  /\b(disappear|vanish) (forever|for good|and never come back)\b/i,
  /\bstop existing\b/i,
  /\bwant out of (this life|life|everything|this world)\b/i,
  /\bgive up on (life|living|everything)\b/i,
  /\b(cant|can not|cannot) (do this|take this|do it|take it|go on) (anymore|any more)\b.*\b(life|alive|die|dead|here|end)\b/i,
  // D. harm to / from others
  /\b(abuse|abusing|abused|domestic violence)\b/i,
  /\b(threaten|threatens|threatened|threatening) (to )?(kill|hurt|harm)\b/i,
  /\b(rape|raped|molest|molested|assault|assaulted)\b/i,
  /\b(going|gonna|want) to (kill|hurt|harm) (him|her|them|someone|somebody|everyone|my)\b/i,
];

/** Lowercase + strip apostrophes (typed and curly) so "wasn't" == "wasnt". */
export function normalizeForCrisis(text) {
  return String(text || "").toLowerCase().replace(/[\u2019\u2018']/g, "");
}

/**
 * @param {string} text
 * @returns {boolean} true when the text carries crisis language (open the door)
 */
export function hasCrisisLanguage(text) {
  if (!text || typeof text !== "string") return false;
  const t = normalizeForCrisis(text);
  return CRISIS_PATTERNS.some((re) => re.test(t));
}
