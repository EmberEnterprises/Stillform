import React, { useState, useRef, useEffect } from "react";
import { draftStatement } from "../../lib/reframeApi.js";
import EditorialBlock from "../../components/EditorialBlock.jsx";
import Button from "../../components/Button.jsx";
import MonoLabel from "../../components/MonoLabel.jsx";
import BreathingSession from "../../components/BreathingSession.jsx";
import { getSessionCount } from "../../lib/sessions.js";
import { recordPredictionError } from "../../lib/predictionErrors.js";
import { getPendingPredictions, recordOutcome } from "../../lib/predictionLog.js";

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

export default function Close({ surfacedFrame, breathingOffer = null, beat = null, onReturnHome, onWantScript = null }) {
  const [step, setStep] = useState("compose");
  const [text, setText] = useState("");
  // PCE.1: structured close — forward implementation intention + lock-in.
  const [nextMove, setNextMove] = useState("");
  const [lockedIn, setLockedIn] = useState(false);
  const textareaRef = useRef(null);
  const microCreditFiredRef = useRef(false);
  const breathingOfferShownRef = useRef(false);
  // EOD-only: optional prediction-error catch (Precision Framework §4/§5 #1).
  const [peText, setPeText] = useState("");
  const [peMarked, setPeMarked] = useState(false);
  // EOD-only: outcome capture for previously-logged predictions
  // (Precision Framework §5 #2 — What You Bet On). Lazy-init at mount —
  // the pending list reflects what was logged earlier today + prior days.
  // Outcome text tracked per-id; on successful recordOutcome the entry
  // is removed from the local pending list (re-fetch unnecessary).
  const [pendingPredictions, setPendingPredictions] = useState(() => {
    try { return getPendingPredictions(); } catch { return []; }
  });
  const [outcomeTexts, setOutcomeTexts] = useState({});

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

  // EOD-only: mark a disconfirmation to the prediction-error log. Optional —
  // never gates closing the day. The act of logging the "didn't come true" is
  // itself the intervention (framework §4 — the most-missed update signal).
  const handleMarkPredictionError = () => {
    const t = peText.trim();
    if (!t) return;
    if (recordPredictionError({ text: t })) {
      setPeMarked(true);
      try {
        window.plausible?.("Prediction Error Marked", { props: { beat: beat || "unknown" } });
      } catch { /* analytics non-fatal */ }
    }
  };

  // EOD-only: mark outcome for a pending prediction (Precision Framework §5 #2).
  // Outcome is free text (user's own words) — the gap between stated confidence
  // and what actually happened IS the data, per framework. Removes entry from
  // local pending list on success; clears its outcome text. Fail-silent on
  // storage error (recordOutcome returns null and we stay in the pending state).
  const handleMarkOutcome = (id) => {
    const t = (outcomeTexts[id] || "").trim();
    if (!t) return;
    const updated = recordOutcome(id, { outcome: t });
    if (updated) {
      setPendingPredictions((prev) => prev.filter((p) => p.id !== id));
      setOutcomeTexts((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      try {
        window.plausible?.("Prediction Outcome Marked", { props: { beat: beat || "unknown" } });
      } catch { /* analytics non-fatal */ }
    }
  };

  // Plain-language relative-date helper for pending predictions. Falls back
  // to empty string on any parse failure — display layer should handle "".
  const relativeDays = (iso) => {
    if (!iso) return "";
    try {
      const then = new Date(iso);
      const now = new Date();
      const thenDay = new Date(then.getFullYear(), then.getMonth(), then.getDate()).getTime();
      const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const msPerDay = 24 * 60 * 60 * 1000;
      const diffDays = Math.round((nowDay - thenDay) / msPerDay);
      if (diffDays <= 0) return "earlier today";
      if (diffDays === 1) return "yesterday";
      return `${diffDays} days ago`;
    } catch { return ""; }
  };

  // PCE.1: the close payload — takeaway + the forward implementation
  // intention (nextMove) + whether they locked it in. Together nextMove +
  // lockIn are "the frame you landed on" that PCE.2's reconsolidation loop
  // reactivates when the same trigger recurs.
  const buildClosePayload = (lockInOverride) => ({
    takeaway: trimmed,
    nextMove: nextMove.trim() || null,
    lockIn:
      lockInOverride !== undefined
        ? lockInOverride
        : lockedIn
        ? nextMove.trim() || null
        : null,
  });

  // The breathing offer (if configured) sits AFTER the forward beats.
  // Terminal calls in the breathing handlers rebuild the payload from state
  // (flushed by then); the direct-return path takes an explicit
  // lockInOverride so a just-tapped lock-in isn't lost to async state.
  const proceedToBreathOrReturn = (lockInOverride) => {
    if (breathingOffer && resolveBreathingPattern(breathingOffer)) {
      setStep("breathing-offer");
    } else {
      onReturnHome(buildClosePayload(lockInOverride));
    }
  };

  // Phase 6.5c ride-out: optional Scripts hand-off. Quiet, never blocks the
  // close. Seeds the script "situation" from the takeaway the user just named
  // so they don't retype it. Surfaced on the next-move beat (everyone reaches
  // it). The parent (Spine) opens the Scripts surface.
  const handleWantScript = () => {
    if (typeof onWantScript === "function") {
      onWantScript(trimmed || surfacedFrame || "");
    }
  };

  // State-to-Statement (June 2 2026): optional, collapsed by default, one
  // user-initiated AI call. Quiet failure ("Couldn't draft right now"), never
  // gates the close. Draft is editable; Copy uses the clipboard API with a
  // selection fallback.
  const [stOpen, setStOpen] = useState(false);
  const [stDraft, setStDraft] = useState("");
  const [stStatus, setStStatus] = useState("idle"); // idle|loading|ready|failed|copied
  const handleDraftStatement = async () => {
    setStOpen(true);
    setStStatus("loading");
    const r = await draftStatement({ surfacedFrame: surfacedFrame || null, takeaway: trimmed || null });
    if (r && typeof r.draft === "string") {
      setStDraft(r.draft);
      setStStatus("ready");
    } else {
      setStStatus("failed");
    }
  };
  const handleCopyDraft = async () => {
    try {
      await navigator.clipboard.writeText(stDraft);
      setStStatus("copied");
    } catch {
      setStStatus("ready"); // clipboard blocked — text stays selectable
    }
  };

  // Compose → the structured forward close. Always advances to the next-move
  // beat; both forward beats are skippable from there.
  const handlePrimary = () => {
    if (!canReturn) return;
    setStep("next-move");
  };

  // Next-move beat (Gollwitzer implementation intention). With a move named →
  // lock-in beat; skipped → straight on (no lock-in to commit).
  const handleNextMoveContinue = () => {
    if (nextMove.trim()) {
      setStep("lock-in");
    } else {
      proceedToBreathOrReturn(null);
    }
  };
  const handleNextMoveSkip = () => {
    setNextMove("");
    proceedToBreathOrReturn(null);
  };

  // Lock-in beat (Bandura mastery). A one-tap commitment, not a score. The
  // override carries the lock-in past async state on the direct-return path.
  const handleLockIn = () => {
    setLockedIn(true);
    proceedToBreathOrReturn(nextMove.trim() || null);
  };
  const handleLockInSkip = () => {
    proceedToBreathOrReturn(null);
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
    onReturnHome(buildClosePayload());
  };

  const handleBreathingComplete = () => { onReturnHome(buildClosePayload()); };
  const handleBreathingEndEarly = () => { onReturnHome(buildClosePayload()); };

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

  // PCE.1: next-move beat — the implementation intention (Gollwitzer 1999).
  if (step === "next-move") {
    const advancesToLockIn = !!nextMove.trim();
    const primaryLabel = advancesToLockIn
      ? "Continue"
      : breathingOffer && resolveBreathingPattern(breathingOffer)
      ? "Continue"
      : "Return home";
    return (
      <main className="sf-page sf-page--hero">
        <div className="sf-fade-enter">
          <EditorialBlock
            label="Close"
            headline="Your next move."
            headlineSize="lg"
            body="One concrete move for the next time this comes up. Small and specific beats sweeping."
            labelInfoTitle="Why this step"
            labelInfoBody="Naming a specific 'next time X, I'll do Y' before you leave is an implementation intention — it pre-commits the response so it's available under load instead of being decided in the moment. This is the bridge from understanding a pattern to acting differently inside it (Gollwitzer 1999)."
          />
        </div>
        <div
          className="sf-fade-enter sf-fade-enter--delay-1"
          style={{ marginTop: "var(--sf-space-48)" }}
        >
          <textarea
            className="sf-textarea"
            value={nextMove}
            onChange={(e) => setNextMove(e.target.value)}
            placeholder="Next time this comes up, I'll…"
            rows={3}
            aria-label="Name your next move"
            autoFocus
          />
        </div>
        <div
          className="sf-fade-enter sf-fade-enter--delay-3"
          style={{
            marginTop: "var(--sf-space-48)",
            display: "flex",
            alignItems: "center",
            gap: "var(--sf-space-16)",
          }}
        >
          <Button variant="primary" onClick={handleNextMoveContinue}>
            {primaryLabel}
          </Button>
          <button type="button" onClick={handleNextMoveSkip} className="sf-link-quiet">
            Skip this ›
          </button>
        </div>
        {onWantScript && (
          <div
            className="sf-fade-enter sf-fade-enter--delay-3"
            style={{ marginTop: "var(--sf-space-24)" }}
          >
            <button type="button" onClick={handleWantScript} className="sf-link-quiet">
              Need the words for it? ›
            </button>
          </div>
        )}
        <div
          className="sf-fade-enter sf-fade-enter--delay-3"
          style={{ marginTop: "var(--sf-space-12)" }}
        >
          {!stOpen ? (
            <button type="button" onClick={handleDraftStatement} className="sf-link-quiet">
              Turn this into a message ›
            </button>
          ) : (
            <div style={{ marginTop: "var(--sf-space-8)" }}>
              {stStatus === "loading" && (
                <p className="sf-body-sm" style={{ color: "var(--sf-text-quiet)" }}>Drafting…</p>
              )}
              {stStatus === "failed" && (
                <p className="sf-body-sm" style={{ color: "var(--sf-text-quiet)" }}>
                  Couldn't draft right now. Your takeaway is safe — close as usual.
                </p>
              )}
              {(stStatus === "ready" || stStatus === "copied") && (
                <>
                  <textarea
                    value={stDraft}
                    onChange={(e) => { setStDraft(e.target.value); if (stStatus === "copied") setStStatus("ready"); }}
                    rows={4}
                    className="sf-input"
                    style={{ width: "100%" }}
                    aria-label="Message draft"
                  />
                  <button
                    type="button"
                    onClick={handleCopyDraft}
                    className="sf-link-quiet"
                    style={{ marginTop: "var(--sf-space-8)" }}
                  >
                    {stStatus === "copied" ? "Copied ✓" : "Copy message"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    );
  }

  // PCE.1: lock-in beat — a one-tap commitment (Bandura 1977). Not a score.
  if (step === "lock-in") {
    return (
      <main className="sf-page sf-page--hero">
        <div className="sf-fade-enter">
          <EditorialBlock
            label="Close"
            headline="Lock it in."
            headlineSize="lg"
            body={`"${nextMove.trim()}"`}
            labelInfoTitle="Why this step"
            labelInfoBody="Committing to a chosen response — not just naming it — strengthens the belief that you can carry it out, which is the strongest predictor of whether you actually will (Bandura 1977, self-efficacy). One tap. No score, no streak."
          />
        </div>
        <div
          className="sf-fade-enter sf-fade-enter--delay-3"
          style={{
            marginTop: "var(--sf-space-48)",
            display: "flex",
            alignItems: "center",
            gap: "var(--sf-space-16)",
          }}
        >
          <Button variant="primary" onClick={handleLockIn}>
            Lock it in
          </Button>
          <button type="button" onClick={handleLockInSkip} className="sf-link-quiet">
            Not yet ›
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

      {beat === "eod" ? (
        <div
          className="sf-fade-enter sf-fade-enter--delay-2"
          style={{ marginTop: "var(--sf-space-32)" }}
        >
          {peMarked ? (
            <MonoLabel size="xs" tone="faint" style={{ display: "block" }}>
              Marked — the kind of thing the mind forgets to count.
            </MonoLabel>
          ) : (
            <>
              <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-12)" }}>
                Optional — anything you were braced for today that didn't happen?
              </MonoLabel>
              <textarea
                className="sf-textarea"
                value={peText}
                onChange={(e) => setPeText(e.target.value)}
                placeholder="What you expected that didn't come…"
                rows={2}
                aria-label="Mark something you were braced for that didn't happen"
              />
              <div style={{ marginTop: "var(--sf-space-12)" }}>
                <button
                  type="button"
                  onClick={handleMarkPredictionError}
                  disabled={!peText.trim()}
                  className="sf-link-quiet"
                  style={!peText.trim() ? { opacity: 0.4, cursor: "default" } : undefined}
                >
                  Mark it ›
                </button>
              </div>
            </>
          )}
        </div>
      ) : null}

      {beat === "eod" && pendingPredictions.length > 0 ? (
        <div
          className="sf-fade-enter sf-fade-enter--delay-2"
          style={{ marginTop: "var(--sf-space-32)" }}
        >
          <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-16)" }}>
            Pending — what happened?
          </MonoLabel>
          {pendingPredictions.map((p) => {
            const oText = outcomeTexts[p.id] || "";
            const canMark = oText.trim().length > 0;
            return (
              <div
                key={p.id}
                style={{
                  marginBottom: "var(--sf-space-24)",
                  paddingBottom: "var(--sf-space-16)",
                  borderBottom: "1px solid var(--sf-border-quiet)",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "var(--sf-text-quiet)",
                    fontFamily: "var(--sf-font-sans)",
                    fontSize: "13px",
                    lineHeight: 1.55,
                    fontStyle: "italic",
                  }}
                >
                  &ldquo;{p.text}&rdquo;
                </p>
                <p
                  style={{
                    margin: "var(--sf-space-4) 0 var(--sf-space-12) 0",
                    color: "var(--sf-text-quiet)",
                    fontFamily: "var(--sf-font-sans)",
                    fontSize: "12px",
                    lineHeight: 1.55,
                    opacity: 0.7,
                  }}
                >
                  {typeof p.confidence === "number" ? `You were ${p.confidence}% sure` : "You called it"} — {relativeDays(p.loggedAt)}
                </p>
                <textarea
                  className="sf-textarea"
                  value={oText}
                  onChange={(e) =>
                    setOutcomeTexts((prev) => ({ ...prev, [p.id]: e.target.value }))
                  }
                  placeholder="What actually happened…"
                  rows={2}
                  aria-label={`Mark outcome for the prediction "${p.text}"`}
                />
                <div style={{ marginTop: "var(--sf-space-8)" }}>
                  <button
                    type="button"
                    onClick={() => handleMarkOutcome(p.id)}
                    disabled={!canMark}
                    className="sf-link-quiet"
                    style={!canMark ? { opacity: 0.4, cursor: "default" } : undefined}
                  >
                    Mark outcome ›
                  </button>
                </div>
              </div>
            );
          })}
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
          Continue
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
