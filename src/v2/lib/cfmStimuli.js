/**
 * cfmStimuli.js — CFM Phase 1 stimulus registry (v2).
 *
 * Arlin-authored / approved first pass (June 23, 2026). This is the source of
 * truth the Phase 1 exercise surface reads. Content is hers — editable here at
 * any time; the readable companion draft is `CFM_stimulus_first_pass.md`.
 *
 * AFFECT_LABELING_STIMULI (30): three per feel chip (chipDefinitions.js
 * vocabulary), each in a different life domain so coverage isn't skewed. The
 * `targetChip` is a coverage/authoring aid only — the user names the feeling
 * themselves; the measure is the granularity + speed of their naming, never a
 * match against this key.
 *
 * DEFUSION_STIMULI (15): one distressing thought per cognitive distortion on
 * the Bias Profile watch-list (`distortion` cross-references biasChips.js
 * `spine`), so defusing them feeds the pattern work the app already does. The
 * scorer (netlify/functions/cognitive-defusion-score.js) rates each
 * user-generated frame distinct / reworded / same.
 *
 * SAFETY: every defusion thought is ordinary-life distressing (work,
 * performance, relationships, everyday). None touch self-harm, worthlessness,
 * body, or crisis content. Preserve that line on any edit.
 */

export const AFFECT_LABELING_STIMULI = Object.freeze([
  { id: "al_01", targetChip: "excited", domain: "work", text: "A project you pitched just got the green light, and three new ideas are already racing ahead of you." },
  { id: "al_02", targetChip: "excited", domain: "creative", text: "You're halfway through something and it's clicking faster than you can get it down." },
  { id: "al_03", targetChip: "excited", domain: "social", text: "Someone you've wanted to work with just said yes, and the night feels wide open." },
  { id: "al_04", targetChip: "focused", domain: "work", text: "The noise has dropped away and you're moving through the task like the next step is already lit." },
  { id: "al_05", targetChip: "focused", domain: "skill", text: "You're mid-rep on something hard and your hands know it before your head does." },
  { id: "al_06", targetChip: "focused", domain: "decision", text: "The options are in front of you and, for once, the right one is obvious and quiet." },
  { id: "al_07", targetChip: "settled", domain: "everyday", text: "Nothing's pulling at you. The coffee's warm, the morning's yours, and you don't need it to be anything else." },
  { id: "al_08", targetChip: "settled", domain: "body", text: "You just put down something you'd been holding for weeks, and your shoulders finally drop." },
  { id: "al_09", targetChip: "settled", domain: "relationship", text: "You're sitting with someone in easy silence — nothing to prove, nothing to fix." },
  { id: "al_10", targetChip: "anxious", domain: "work", text: "The message just says \"can we talk?\" and your stomach is already three steps ahead." },
  { id: "al_11", targetChip: "anxious", domain: "health", text: "You felt something off in your body this morning and now you can't stop checking for it." },
  { id: "al_12", targetChip: "anxious", domain: "money", text: "The number in the account is fine for now — but \"for now\" is doing a lot of work." },
  { id: "al_13", targetChip: "angry", domain: "relationship", text: "They said the thing again — the one they know lands — and the heat goes straight up your neck." },
  { id: "al_14", targetChip: "angry", domain: "work", text: "You did the work, and someone else is in the room taking the credit for it." },
  { id: "al_15", targetChip: "angry", domain: "self", text: "You saw the mistake coming, said nothing, and now you're furious at yourself for it." },
  { id: "al_16", targetChip: "flat", domain: "everyday", text: "The day is technically fine and you can't find a single part of it you care about." },
  { id: "al_17", targetChip: "flat", domain: "work", text: "The list is long, none of it matters, and you're staring at the first item like it's a wall." },
  { id: "al_18", targetChip: "flat", domain: "self", text: "People keep asking what's wrong, and the honest answer is \"nothing,\" which is somehow worse." },
  { id: "al_19", targetChip: "stuck", domain: "decision", text: "You've made the pros-and-cons list twice and you're no closer than when you started." },
  { id: "al_20", targetChip: "stuck", domain: "work", text: "You know the answer is in there somewhere, but every time you reach for it the thread slips." },
  { id: "al_21", targetChip: "stuck", domain: "relationship", text: "You keep replaying the conversation, looking for the line that would've fixed it." },
  { id: "al_22", targetChip: "mixed", domain: "relationship", text: "You ended it and you're relieved — and the relief keeps catching on something that aches." },
  { id: "al_23", targetChip: "mixed", domain: "work", text: "You got the offer you wanted, and your first feeling underneath the joy was fear." },
  { id: "al_24", targetChip: "mixed", domain: "family", text: "You're proud of them for leaving, and you can't quite forgive them for it either." },
  { id: "al_25", targetChip: "distant", domain: "everyday", text: "You're in the room, people are talking, and it's all happening behind glass." },
  { id: "al_26", targetChip: "distant", domain: "stress", text: "The day got loud, and somewhere in it you quietly stepped out of your own body." },
  { id: "al_27", targetChip: "distant", domain: "social", text: "You're nodding along and you couldn't say what the last five minutes were about." },
  { id: "al_28", targetChip: "unsure", domain: "body", text: "There's something sitting in your chest and you genuinely can't tell if it's dread or excitement." },
  { id: "al_29", targetChip: "unsure", domain: "everyday", text: "Someone asks how you're doing, you open your mouth, and nothing true comes out." },
  { id: "al_30", targetChip: "unsure", domain: "self", text: "It's not a good day or a bad day. It's a day with a weather you don't have a word for." },
]);

export const DEFUSION_STIMULI = Object.freeze([
  { id: "df_01", distortion: "all-or-nothing", domain: "work", text: "If this launch isn't perfect, the whole thing is a failure." },
  { id: "df_02", distortion: "catastrophizing", domain: "health", text: "This headache won't go away — something must be seriously wrong with me." },
  { id: "df_03", distortion: "discounting the positive", domain: "work", text: "Sure, they praised it, but they were just being polite." },
  { id: "df_04", distortion: "emotional reasoning", domain: "self", text: "I feel like a fraud, so I must actually be one." },
  { id: "df_05", distortion: "labeling", domain: "work", text: "I missed the deadline. I'm just an unreliable person." },
  { id: "df_06", distortion: "magnification and minimization", domain: "social", text: "I stumbled over one sentence in there and everyone definitely noticed." },
  { id: "df_07", distortion: "mental filter", domain: "work", text: "The review had one criticism in it, so the whole review was bad." },
  { id: "df_08", distortion: "mind-reading", domain: "relationship", text: "They didn't text back. They're obviously done with me." },
  { id: "df_09", distortion: "overgeneralization", domain: "dating", text: "That date went nowhere. This always happens to me." },
  { id: "df_10", distortion: "personalization", domain: "family", text: "My friend seemed off all night — I must have done something." },
  { id: "df_11", distortion: "should", domain: "self", text: "I should be so much further along by now." },
  { id: "df_12", distortion: "fortune-telling", domain: "work", text: "There's no point pitching it — they're going to say no anyway." },
  { id: "df_13", distortion: "blame", domain: "relationship", text: "If they had just listened, none of this would have happened." },
  { id: "df_14", distortion: "disqualifying", domain: "self", text: "Anyone could have done what I did. It doesn't count." },
  { id: "df_15", distortion: "what-if spiral", domain: "everyday", text: "What if I made the wrong call and I only realize it when it's too late?" },
]);

/** All affect-labeling stimuli (frozen). */
export function getAffectLabelingStimuli() {
  return AFFECT_LABELING_STIMULI;
}

/** All defusion stimuli (frozen). */
export function getDefusionStimuli() {
  return DEFUSION_STIMULI;
}

/** Coverage summary for the authoring view — counts per chip / distortion / domain. */
export function getStimulusCoverage() {
  const tally = (arr, key) =>
    arr.reduce((acc, s) => { acc[s[key]] = (acc[s[key]] || 0) + 1; return acc; }, {});
  return {
    affect: { total: AFFECT_LABELING_STIMULI.length, byChip: tally(AFFECT_LABELING_STIMULI, "targetChip"), byDomain: tally(AFFECT_LABELING_STIMULI, "domain") },
    defusion: { total: DEFUSION_STIMULI.length, byDistortion: tally(DEFUSION_STIMULI, "distortion"), byDomain: tally(DEFUSION_STIMULI, "domain") },
  };
}

export default { AFFECT_LABELING_STIMULI, DEFUSION_STIMULI };
