// Practice Signals — Affect Labeling stimulus library
// CFM Phase 1 · May 7, 2026 · Author: Claude (draft for Arlin's review + tweak)
//
// 30 scenarios spanning universal triggers. Each scenario flashes for ~1-2
// seconds; the user picks the chip that fits best. Latency (ms) and accuracy
// (matches primary or secondary acceptable chip) are the measurement.
//
// Chip set (canonical, from src/App.jsx ~11383):
//   excited, focused, settled, anxious, angry, stuck, mixed, flat, distant
//
// Authoring criteria per CFM Phase 1 audit Decision 3:
// - Each scenario has ONE primary chip — the modal answer two raters would agree on
// - Optional `secondary` — second acceptable chip if the scenario is genuinely ambiguous
// - Rater agreement (yes/no/disputed) marked after Arlin + second-rater pass
// - Disputed scenarios DON'T ship to users — drop or rewrite
//
// Coverage:
//   Work conflict / status (6): #1, #5, #11, #15, #21, #25
//   Social rejection / ambiguity (6): #2, #6, #12, #16, #22, #26
//   Parenting (3): #3, #13, #23
//   Health / body (3): #7, #17, #27
//   Financial pressure (3): #4, #14, #24
//   Identity / impostor (3): #8, #18, #28
//   Positive / success / anticipation (3): #9, #19, #29
//   Ambiguity / unsaid (3): #10, #20, #30

export const AFFECT_LABELING_STIMULI = [
  // ─── Work conflict / status ──────────────────────────────────────────
  { id: 1, scenario: "You walk into a meeting and three colleagues stop talking when they see you.", primary: "anxious", secondary: "stuck" },
  { id: 5, scenario: "Your manager schedules a 1:1 with no agenda for tomorrow morning.", primary: "anxious", secondary: "stuck" },
  { id: 11, scenario: "A coworker takes credit for an idea you brought up two weeks ago.", primary: "angry", secondary: "stuck" },
  { id: 15, scenario: "You're cc'd on an email chain about a decision you weren't part of.", primary: "stuck", secondary: "angry" },
  { id: 21, scenario: "Your work was singled out as 'great example' in front of the whole team.", primary: "excited", secondary: "focused" },
  { id: 25, scenario: "The deadline is in three hours and you haven't started the part that scares you.", primary: "stuck", secondary: "anxious" },

  // ─── Social rejection / ambiguity ───────────────────────────────────
  { id: 2, scenario: "A close friend hasn't replied to your last two messages over five days.", primary: "anxious", secondary: "distant" },
  { id: 6, scenario: "You said something at dinner and the table went quiet for a beat too long.", primary: "anxious", secondary: "stuck" },
  { id: 12, scenario: "You see your group made plans on a thread you weren't added to.", primary: "distant", secondary: "anxious" },
  { id: 16, scenario: "Someone you respect publicly disagreed with you in a Slack channel.", primary: "anxious", secondary: "angry" },
  { id: 22, scenario: "A friend you haven't talked to in a year just asked if you want to catch up.", primary: "mixed", secondary: "excited" },
  { id: 26, scenario: "You're at a party where you only know the host, who's now busy.", primary: "distant", secondary: "stuck" },

  // ─── Parenting ──────────────────────────────────────────────────────
  { id: 3, scenario: "Your kid asks why you didn't pick them up on time and you have no good answer.", primary: "stuck", secondary: "flat" },
  { id: 13, scenario: "Your kid's teacher emailed asking if you can talk this week.", primary: "anxious", secondary: "stuck" },
  { id: 23, scenario: "You watch your kid handle something hard, on their own, and they handle it well.", primary: "settled", secondary: "excited" },

  // ─── Health / body ──────────────────────────────────────────────────
  { id: 7, scenario: "A test result your doctor ordered came back with one number flagged.", primary: "anxious", secondary: "stuck" },
  { id: 17, scenario: "Your body feels unfamiliar today — slower, heavier, not quite yours.", primary: "flat", secondary: "distant" },
  { id: 27, scenario: "You finally slept eight hours and woke up before your alarm.", primary: "settled", secondary: "focused" },

  // ─── Financial pressure ─────────────────────────────────────────────
  { id: 4, scenario: "Your card got declined at checkout and the line behind you is six people deep.", primary: "anxious", secondary: "stuck" },
  { id: 14, scenario: "You're staring at a subscription auto-renewal that hit your card today.", primary: "angry", secondary: "stuck" },
  { id: 24, scenario: "Someone in your circle just bought a house and you're nowhere close.", primary: "mixed", secondary: "flat" },

  // ─── Identity / impostor ────────────────────────────────────────────
  { id: 8, scenario: "You're about to walk into a room where everyone has a degree you don't.", primary: "anxious", secondary: "distant" },
  { id: 18, scenario: "Someone called you an expert and you're not sure they're right.", primary: "mixed", secondary: "anxious" },
  { id: 28, scenario: "You realize you've been holding your tongue for a year about something that matters.", primary: "stuck", secondary: "angry" },

  // ─── Positive / success / anticipation ──────────────────────────────
  { id: 9, scenario: "You've been preparing for tomorrow for a month and it's finally tomorrow.", primary: "excited", secondary: "focused" },
  { id: 19, scenario: "The thing you've been working toward for two years just landed.", primary: "excited", secondary: "settled" },
  { id: 29, scenario: "You finished early and have an unscheduled hour with no obligations.", primary: "settled", secondary: "focused" },

  // ─── Ambiguity / unsaid ─────────────────────────────────────────────
  { id: 10, scenario: "Your partner said 'we should talk later' and walked out.", primary: "anxious", secondary: "stuck" },
  { id: 20, scenario: "Someone left you on read for two hours after a long, vulnerable message.", primary: "anxious", secondary: "stuck" },
  { id: 30, scenario: "A weekend you'd been looking forward to is suddenly wide open and unplanned.", primary: "mixed", secondary: "settled" },
];

// Inter-rater agreement column (filled after Arlin + second rater review).
// Format: { id: number, agreement: "yes" | "no" | "disputed", notes?: string }
// Disputed entries are dropped or rewritten before shipping. This array is
// loaded by the affect-labeling exercise to filter the stimulus pool.
export const AFFECT_LABELING_RATER_AGREEMENT = [
  // To be filled in during May 9 review.
  // Example: { id: 1, agreement: "yes" },
  //          { id: 5, agreement: "disputed", notes: "Could be 'stuck' or 'flat' — too ambiguous" },
];

// Helper: returns scenarios with rater agreement === "yes" (or all if no
// agreement data exists yet — useful during dev).
export const getValidatedAffectStimuli = () => {
  if (AFFECT_LABELING_RATER_AGREEMENT.length === 0) {
    return AFFECT_LABELING_STIMULI;
  }
  const okIds = new Set(
    AFFECT_LABELING_RATER_AGREEMENT
      .filter((r) => r.agreement === "yes")
      .map((r) => r.id)
  );
  return AFFECT_LABELING_STIMULI.filter((s) => okIds.has(s.id));
};
