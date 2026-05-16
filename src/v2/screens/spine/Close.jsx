import React, { useState, useRef } from "react";
import EditorialBlock from "../../components/EditorialBlock.jsx";
import Button from "../../components/Button.jsx";

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
 * Phase 3.5 item #2 (locked May 16, 2026): Close was previously a passive
 * display screen that showed the AI's final reframe verbatim as "What
 * landed", auto-crediting AI text as the user's takeaway. This violated
 * Pillar A (user-led principle) — the metacognitive consolidation moment
 * had no user input. Live audit caught this on May 16 deploy.
 *
 * The rebuild: Close is now an active step. User types what landed FOR
 * THEM in their own words. Return home becomes available only after a
 * minimum-substantive entry (4+ chars trimmed — matches the threadEntry
 * derivation floor). Optional "Anchor on what surfaced" affordance
 * seeds the textarea with the frame from Reframe (AI's last response, or
 * user's last SelfReframe answer); user can keep, edit, or discard.
 * Seeding into the textarea preserves user-led control — even if the
 * user accepts the surfaced frame, they had to choose it, and they can
 * shape it.
 *
 * Naming symmetry with Notice: Notice = "Name what's present." (entry).
 * Close = "Name what landed." (exit). Both are active practice moments.
 *
 * @param {string|null} surfacedFrame — the frame from Reframe (AI's last reply or SelfReframe's last answer). May be null.
 * @param {function(string): void} onReturnHome — called with the user's named takeaway
 */
const MIN_TAKEAWAY_LEN = 4;

export default function Close({ surfacedFrame, onReturnHome }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  const trimmed = text.trim();
  const canReturn = trimmed.length >= MIN_TAKEAWAY_LEN;

  const handleAnchor = () => {
    if (!surfacedFrame) return;
    setText(surfacedFrame);
    // Focus + cursor at end so the user can immediately edit. The anchor
    // is a seed, not a substitute for engagement.
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.focus();
      try {
        el.setSelectionRange(surfacedFrame.length, surfacedFrame.length);
      } catch {
        /* setSelectionRange isn't always supported on every textarea state */
      }
    });
  };

  const handleReturn = () => {
    if (!canReturn) return;
    onReturnHome(trimmed);
  };

  return (
    <main className="sf-page sf-page--hero">
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
          onClick={handleReturn}
          disabled={!canReturn}
          style={
            !canReturn
              ? { opacity: 0.4, cursor: "default", pointerEvents: "none" }
              : undefined
          }
        >
          Return home
        </Button>
      </div>
    </main>
  );
}
