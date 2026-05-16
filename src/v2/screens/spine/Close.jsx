import React, { useState, useRef, useEffect } from "react";
import EditorialBlock from "../../components/EditorialBlock.jsx";
import Button from "../../components/Button.jsx";
import MonoLabel from "../../components/MonoLabel.jsx";
import BreathingSession from "../../components/BreathingSession.jsx";
import { getSessionCount } from "../../lib/sessions.js";

/**
 * Close — the closing step of the spine.
 *
 * Per STILLFORM_CANON.md §7.1 (Structured Metacognitive Arc, locked May 16, 2026):
 *
 *   "Close requires the user to name what landed (free-text input), with
 *   optional 'Keep AI's frame' affordance for anchoring. AI doesn't TELL
 *   the user what they're feeling — asks what user hasn't asked
 *   themselves. The line between metacognitive partner and therapist is
 *   enforced architecturally: user must reply (Spine), user must name
 *   takeaway (Close)."
 *
 * Per canon §6 (rumination guard): "Build closing rituals — sessions END."
 *
 * Phase 3.5 item #2 (locked May 16, 2026): Close is an active step.
 * User types what landed FOR THEM in their own words. Return home
 * becomes available only after a minimum-substantive entry (4+ chars
 * trimmed). Optional "Anchor on what surfaced" affordance seeds the
 * textarea with the frame from Reframe; user can keep, edit, or
 * discard.
 *
 * Phase 4 #6 + #7 (locked May 16, 2026):
 *
 *   #6 Micro-credit. After Close mounts, read total lifetime session
 *   count from sessions.js. If the session about to complete hits a
 *   defined milestone (1, 5, 10, 25, 50, 100, then multiples of 100),
 *   render a quiet mono-label above the editorial block — operator-
 *   tier voice, no "ACHIEVEMENT" gamification, no streaks, no points.
 *   Fires "Micro Credit Shown" Plausible event with count + milestone.
 *
 *   #7 Breathing offer. When caller passes a breathingOffer pattern id
 *   (from config.close.breathingOffer — set on EOD to "deep-regulate"
 *   and morning to "box"), Close becomes a step machine: compose →
 *   breathing-offer (Start / Skip) → breathing-running → onReturnHome.
 *   Skip OR breathing complete both fire onReturnHome with the named
 *   takeaway. The breathing happens BETWEEN takeaway-named and actual
 *   exit — a regulated body before the user re-enters the day or
 *   sleep. Fires "Breathing Offer Shown / Tapped / Skipped" Plausible.
 *
 * Naming symmetry with Notice: Notice = "Name what's present." (entry).
 * Close = "Name what landed." (exit). Both are active practice moments.
 *
 * @param {string|null} surfacedFrame — frame from Reframe (AI's last reply or SelfReframe's last answer). May be null.
 * @param {"deep-regulate"|"cyclic-sighing"|"quick-reset"|"box"|null} [breathingOffer]
 *   Pattern to offer before exit. If null/undefined, no offer shown — primary action becomes Return home directly.
 * @param {"morning"|"main"|"eod"|"wind-down"|null} [beat]  Locked beat — passed as a Plausible prop only.
 * @param {function(string): void} onReturnHome — called with the user's named takeaway
 */
const MIN_TAKEAWAY_LEN = 4;

export default function Close({ surfacedFrame, breathingOffer = null, beat = null, onReturnHome }) {
  const [step, setStep] = useState("compose");
  const [text, setText] = useState("");
  const textareaRef = useRef(null);
  const microCreditFiredRef = useRef(false);
  const breathingOfferShownRef = useRef(false);

  // Phase 4 #6: micro-credit derivation. Read current session count ONCE
  // at mount — the count reflects sessions completed BEFORE this one
  // (this session's save fires in Spine's handleCloseReturn AFTER Return
  // home is tapped). So the upcoming session is count + 1.
  const [microCredit] = useState(() => {
    try {
      const prior = getSessionCount();
      const upcoming = prior + 1;
      return deriveMicroCredit(upcoming);
    } catch {
      return null;
    }
  });

  // Phase 4 #6: fire "Micro Credit Shown" once when a credit renders.
  useEffect(() => {
    if (microCredit && step === "compose" && !microCreditFiredRef.current) {
      microCreditFiredRef.current = true;
      try {
        window.plausible?.("Micro Credit Shown", {
          props: {
            beat: beat || "unknown",
            count: microCredit.count,
            milestone: microCredit.milestone,
          },
        });
      } catch { /* analytics non-fatal */ }
    }
  }, [microCredit, step, beat]);

  // Phase 4 #7: fire "Breathing Offer Shown" once when we land on offer.
  useEffect(() => {
    if (step === "breathing-offer" && !breathingOfferShownRef.current) {
      breathingOfferShownRef.current = true;
      try {
        window.plausible?.("Breathing Offer Shown", {
          props: { beat: beat || "unknown", pattern: breathingOffer },
        });
      } catch { /* analytics non-fatal */ }
    }
  }, [step, beat, breathingOffer]);

  const trimmed = text.trim();
  const canReturn = trimmed.length >= MIN_TAKEAWAY_LEN;

  const handleAnchor = () => {
    if (!surfacedFrame) return;
    setText(surfacedFrame);
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.focus();
      try {
        el.setSelectionRange(surfacedFrame.length, surfacedFrame.length);
      } catch {
        /* setSelectionRange isn't always supported */
      }
    });
  };

  // Phase 4 #7: primary action depends on whether breathing is offered.
  // With offer → advance to breathing-offer step. Without → onReturnHome.
  const handlePrimary = () => {
    if (!canReturn) return;
    if (breathingOffer && resolveBreathingPattern(breathingOffer)) {
      setStep("breathing-offer");
    } else {
      onReturnHome(trimmed);
    }
  };

  const handleStartBreathing = () => {
    try {
      window.plausible?.("Breathing Offer Tapped", {
        props: { beat: beat || "unknown", pattern: breathingOffer },
      });
    } catch { /* non-fatal */ }
    setStep("breathing-running");
  };

  const handleSkipBreathing = () => {
    try {
      window.plausible?.("Breathing Offer Skipped", {
        props: { beat: beat || "unknown", pattern: breathingOffer },
      });
    } catch { /* non-fatal */ }
    onReturnHome(trimmed);
  };

  const handleBreathingComplete = () => { onReturnHome(trimmed); };
  const handleBreathingEndEarly = () => { onReturnHome(trimmed); };

  // ---------------- Render ----------------

  // Breathing-running step: BreathingSession returns its own <main>.
  if (step === "breathing-running") {
    const pattern = resolveBreathingPattern(breathingOffer);
    return (
      <BreathingSession
        pattern={pattern}
        onComplete={handleBreathingComplete}
        onSkip={handleBreathingEndEarly}
      />
    );
  }

  // Breathing-offer step: Start / Skip card.
  if (step === "breathing-offer") {
    const offerCopy = BREATHING_OFFER_COPY[breathingOffer] || BREATHING_OFFER_COPY.default;
    return (
      <main className="sf-page sf-page--hero">
        <div className="sf-fade-enter">
          <EditorialBlock
            label="Close"
            headline={offerCopy.headline}
            headlineSize="lg"
            body={offerCopy.body}
            labelInfoTitle={offerCopy.infoTitle}
            labelInfoBody={offerCopy.infoBody}
          />
        </div>
        <div
          className="sf-fade-enter sf-fade-enter--delay-2"
          style={{
            marginTop: "var(--sf-space-48)",
            display: "flex",
            alignItems: "center",
            gap: "var(--sf-space-16)",
          }}
        >
          <Button variant="primary" onClick={handleStartBreathing}>
            Start
          </Button>
          <button
            type="button"
            onClick={handleSkipBreathing}
            className="sf-link-quiet"
          >
            Skip to home ›
          </button>
        </div>
      </main>
    );
  }

  // Default: compose step.
  return (
    <main className="sf-page sf-page--hero">
      {microCredit ? (
        <div
          className="sf-fade-enter"
          style={{ marginBottom: "var(--sf-space-24)" }}
        >
          <MonoLabel size="xs" tone="faint" style={{ display: "block" }}>
            {microCredit.label}
          </MonoLabel>
        </div>
      ) : null}

      <div className="sf-fade-enter">
        <EditorialBlock
          label="Close"
          headline="Name what landed."
          headlineSize="lg"
          body="What you name here becomes part of your library."
          labelInfoTitle="Close"
          labelInfoBody="Closing the rep matters. The brain encodes what you ended on, not what you spent most time on. Naming what landed in your own words — not what the AI said — is the metacognitive consolidation this step is for. The session doesn't compound until you name it. Stickgold & Walker on consolidation windows; Wells 2009 on rumination guardrails; Kross 2014 on user-led self-distancing."
        />
      </div>

      <div
        className="sf-fade-enter sf-fade-enter--delay-1"
        style={{ marginTop: "var(--sf-space-48)" }}
      >
        <textarea
          ref={textareaRef}
          className="sf-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What landed for you…"
          rows={4}
          aria-label="Name what landed for you"
        />
      </div>

      {surfacedFrame ? (
        <div
          className="sf-fade-enter sf-fade-enter--delay-2"
          style={{ marginTop: "var(--sf-space-16)" }}
        >
          <button
            type="button"
            onClick={handleAnchor}
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
              fontFamily: "var(--sf-font-mono)",
              fontSize: "11px",
              letterSpacing: "0.08em",
              color: "var(--sf-text-quiet)",
              textTransform: "uppercase",
              WebkitTapHighlightColor: "transparent",
            }}
            aria-label="Anchor on what surfaced during the reframe"
          >
            ↩ Anchor on what surfaced
          </button>
        </div>
      ) : null}

      <div
        className="sf-fade-enter sf-fade-enter--delay-3"
        style={{ marginTop: "var(--sf-space-48)" }}
      >
        <Button
          variant="primary"
          onClick={handlePrimary}
          disabled={!canReturn}
          style={
            !canReturn
              ? { opacity: 0.4, cursor: "default", pointerEvents: "none" }
              : undefined
          }
        >
          {breathingOffer && resolveBreathingPattern(breathingOffer)
            ? "Continue"
            : "Return home"}
        </Button>
      </div>
    </main>
  );
}

/* -----------------------------------------------------------------------
 * MICRO-CREDIT DERIVATION (Phase 4 #6, locked May 16, 2026)
 *
 * Operator-tier voice. No "ACHIEVEMENT" label. No streaks. No score. Just
 * a quiet count at meaningful waypoints — sessions named into being.
 *
 * Milestones: 1, 5, 10, 25, 50, 100, then multiples of 100.
 *
 * Why these: first rep matters (anchoring the practice), early small
 * milestones (5, 10) catch the user before they drift, 25/50 mark
 * sustained engagement, 100 marks a meaningfully changed library, after
 * that every 100 is a clean re-acknowledgment without becoming noise.
 *
 * @param {number} n  the session count this close represents (1-indexed)
 * @returns {{count: number, milestone: string, label: string} | null}
 * -------------------------------------------------------------------- */
export function deriveMicroCredit(n) {
  if (!Number.isInteger(n) || n < 1) return null;

  if (n === 1)   return { count: 1,   milestone: "first",        label: "First rep named — it counts now." };
  if (n === 5)   return { count: 5,   milestone: "five",         label: "Five reps named." };
  if (n === 10)  return { count: 10,  milestone: "ten",          label: "Ten reps named." };
  if (n === 25)  return { count: 25,  milestone: "twenty-five",  label: "Twenty-five reps named." };
  if (n === 50)  return { count: 50,  milestone: "fifty",        label: "Fifty reps named." };
  if (n === 100) return { count: 100, milestone: "hundred",      label: "One hundred reps named — different than the day you started." };
  if (n > 100 && n % 100 === 0) {
    return { count: n, milestone: "multiple-of-100", label: `${n} reps named.` };
  }
  return null;
}

/* -----------------------------------------------------------------------
 * BREATHING OFFER RESOLUTION (Phase 4 #7)
 *
 * Maps the beatConfig.close.breathingOffer value to BreathingSession
 * pattern keys. beatConfig uses "box" for morning, which doesn't map
 * exactly to any pattern BreathingSession ships yet (box-breathing is
 * 4-4-4-4, distinct from quick-reset's 4-4-6). For Phase 4, "box" maps
 * to "quick-reset" — both ~1 min priming patterns; deliberate
 * shortcut documented here. Full box-breathing pattern adds in polish.
 *
 * @param {string|null} offer  config.close.breathingOffer value
 * @returns {string|null}  BreathingSession pattern key, or null if unresolvable
 * -------------------------------------------------------------------- */
function resolveBreathingPattern(offer) {
  if (!offer) return null;
  if (offer === "deep-regulate") return "deep-regulate";
  if (offer === "cyclic-sighing") return "cyclic-sighing";
  if (offer === "quick-reset") return "quick-reset";
  if (offer === "box") return "quick-reset"; // Box → Quick Reset shortcut for Phase 4.
  return null;
}

/* -----------------------------------------------------------------------
 * BREATHING OFFER COPY — operator-tier prompts per pattern.
 * -------------------------------------------------------------------- */
const BREATHING_OFFER_COPY = {
  "deep-regulate": {
    headline: "Deep Regulate?",
    body: "Three minutes of downregulation breathing before you close.",
    infoTitle: "Deep Regulate",
    infoBody: "4-4-8-2 pattern (inhale 4s · hold 4s · exhale 8s · rest 2s) over ~3 minutes. Extended exhale recruits the parasympathetic nervous system and lowers physiological arousal — useful at end-of-day or after high-load work (Jerath et al. 2006; Brown & Gerbarg 2005).",
  },
  "cyclic-sighing": {
    headline: "Cyclic Sighing?",
    body: "Five minutes. The most-studied breath pattern for downregulation.",
    infoTitle: "Cyclic Sighing",
    infoBody: "Balban et al. 2023 (Cell Reports Medicine, n=111 RCT). Two consecutive nasal inhales, then long oral exhale. 1:2 inhale-to-exhale ratio. Outperformed mindfulness meditation, box breathing, and cyclic hyperventilation for mood improvement and physiological arousal reduction across one month of daily practice.",
  },
  "quick-reset": {
    headline: "Quick Reset?",
    body: "One minute. Just enough to land before you head back.",
    infoTitle: "Quick Reset",
    infoBody: "4-4-6 pattern over ~1 minute. Fast enough to do between meetings or before transitions — long enough to interrupt the previous state's cognitive momentum.",
  },
  "box": {
    headline: "Quick Reset?",
    body: "One minute. Priming-oriented breath before the day starts.",
    infoTitle: "Quick Reset",
    infoBody: "Box-style cadence over ~1 minute. Settles the nervous system without dropping arousal too far — useful at morning open when you want to start regulated but engaged.",
  },
  default: {
    headline: "Take a moment?",
    body: "Quick breath before you close.",
    infoTitle: "Breathing",
    infoBody: "A brief breath pattern to land in your body before you move on.",
  },
};
