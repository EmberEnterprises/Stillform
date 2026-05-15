import React, { useState, useRef, useEffect } from "react";
import Button from "../../components/Button.jsx";
import MonoLabel from "../../components/MonoLabel.jsx";
import { SELF_PROMPTS, SELF_MODE_INFO } from "../../lib/selfMode.js";

/**
 * SelfReframe — the self-led practice surface.
 *
 * First-class alternative to the AI Reframe. Same Notice → Reframe →
 * Close spine; the user writes their way through four metacognitive
 * prompts instead of conversing with the AI.
 *
 * Triggers (handled by Spine.jsx):
 *   1. User opts in from Notice ("Or self-led ›" link)
 *   2. Auto-fallback when reframe.js errors persistently (Reframe surface
 *      shows "Switch to self-led" prominently in error state)
 *
 * Visual: one prompt per sub-beat. Editorial headline + body + textarea
 * + Continue button. After the fourth prompt, advances to Close with the
 * full set of answers + the last answer as the takeaway.
 *
 * No step counter (per canon §10 — step counters collapse practice into
 * form transactions). Sequential prompts, tap to advance, you're done
 * when you're done.
 *
 * @param {string} precisionName — what the user named in Notice
 * @param {function({history, takeaway}): void} onContinue
 * @param {function(): void} onExit
 */
export default function SelfReframe({ precisionName, onContinue, onExit }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [draft, setDraft] = useState("");
  const textareaRef = useRef(null);

  // Focus textarea on each prompt advance.
  useEffect(() => {
    if (textareaRef.current) {
      const t = setTimeout(() => textareaRef.current?.focus(), 350);
      return () => clearTimeout(t);
    }
  }, [index]);

  const currentPrompt = SELF_PROMPTS[index];
  const isLast = index === SELF_PROMPTS.length - 1;
  const canAdvance = draft.trim().length > 0;

  const handleAdvance = () => {
    if (!canAdvance) return;

    const nextAnswers = { ...answers, [currentPrompt.id]: draft.trim() };
    setAnswers(nextAnswers);
    setDraft("");

    if (isLast) {
      // Bundle answers into a synthetic "history" the Close surface can read.
      // The takeaway is the user's "next move" answer — agency-forward.
      const history = [
        { role: "user", text: precisionName },
        ...SELF_PROMPTS.map((p) => ({
          role: "user",
          text: nextAnswers[p.id] || "",
          promptId: p.id,
        })),
      ];
      onContinue({
        history,
        takeaway: nextAnswers.move || nextAnswers[currentPrompt.id],
      });
    } else {
      setIndex(index + 1);
    }
  };

  return (
    <main className="sf-page">
      <div
        className="sf-fade-enter"
        style={{ marginBottom: "var(--sf-space-32)" }}
      >
        <MonoLabel
          size="xs"
          tone="faint"
          infoTitle={SELF_MODE_INFO.title}
          infoBody={SELF_MODE_INFO.body}
        >
          Reframe · self-led
        </MonoLabel>
      </div>

      <div
        // Keyed by prompt index so each new prompt fades in.
        key={currentPrompt.id}
        className="sf-fade-enter sf-fade-enter--delay-1"
      >
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--sf-font-serif)",
            fontSize: "var(--sf-text-display-sm)",
            lineHeight: "var(--sf-leading-display)",
            fontWeight: 400,
            color: "var(--sf-text-cream)",
            letterSpacing: "-0.01em",
          }}
        >
          {currentPrompt.headline}
        </h1>
        {currentPrompt.body ? (
          <p
            style={{
              margin: "var(--sf-space-12) 0 0",
              fontFamily: "var(--sf-font-sans)",
              fontSize: "var(--sf-text-body-md)",
              lineHeight: "var(--sf-leading-body)",
              color: "var(--sf-text-quiet)",
              fontWeight: 300,
            }}
          >
            {currentPrompt.body}
          </p>
        ) : null}
      </div>

      <div
        className="sf-fade-enter sf-fade-enter--delay-2"
        style={{ marginTop: "var(--sf-space-48)" }}
      >
        <textarea
          ref={textareaRef}
          className="sf-textarea"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Take your time."
          rows={4}
          aria-label={currentPrompt.headline}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              handleAdvance();
            }
          }}
        />
      </div>

      <div
        className="sf-fade-enter sf-fade-enter--delay-3"
        style={{
          marginTop: "var(--sf-space-32)",
          display: "flex",
          alignItems: "center",
          gap: "var(--sf-space-16)",
        }}
      >
        <Button
          variant="primary"
          onClick={handleAdvance}
          disabled={!canAdvance}
          aria-disabled={!canAdvance}
        >
          {isLast ? "Close" : "Continue"}
        </Button>
        <Button variant="ghost" onClick={onExit}>
          Back
        </Button>
      </div>
    </main>
  );
}
