import React, { useState, useEffect } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import Button from "../components/Button.jsx";

/**
 * Onboarding — Phase 10a + 10b. The front door. A brand-new user used to land
 * on Home with no idea what Stillform is; this is the first thing they see now.
 * A short two-beat flow: the frame, then how the practice works, then in.
 *
 * Framing is law-bound (STILLFORM_FRAMING_LAW / CANON): Stillform is a
 * metacognition practice that produces cognitive expansion — sharper thinking,
 * better decisions, deeper self-understanding. Composure is the felt outcome,
 * never the pitch. Stated PURELY POSITIVELY — no "it's not meditation / not
 * calming down" define-by-negation (banned). Mirrors the paywall frame so the
 * front door and the ask tell one consistent story.
 *
 * DEFAULT COPY for Arlin to assess on screen. 10c (guided calibration) and
 * 10d (hand into the first session) come next; for now the last beat marks
 * onboarded and drops into Home.
 */
export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState("frame"); // frame → how

  useEffect(() => {
    try { window.plausible?.("Onboarding Started"); } catch { /* non-fatal */ }
  }, []);

  const finish = () => {
    try { window.plausible?.("Onboarding Completed"); } catch { /* non-fatal */ }
    onComplete();
  };

  if (step === "frame") {
    return (
      <main className="sf-page sf-page--hero">
        <div className="sf-fade-enter">
          <EditorialBlock
            label="Stillform"
            headline="Get sharper at reading your own mind."
            headlineSize="xl"
            body="Stillform is a metacognition practice. Each time you use it, you name what your mind is actually doing — with a little more precision than last time. That precision compounds: you read your own patterns faster, decide better under pressure, and understand yourself at a finer grain."
          />
        </div>
        <div className="sf-fade-enter sf-fade-enter--delay-2" style={{ marginTop: "var(--sf-space-48)" }}>
          <Button variant="primary" onClick={() => setStep("how")}>Continue</Button>
        </div>
      </main>
    );
  }

  // step === "how"
  return (
    <main className="sf-page sf-page--hero">
      <div className="sf-fade-enter">
        <EditorialBlock
          label="How it works"
          headline="Name what your mind is doing."
          headlineSize="lg"
          body="A session is short. Something's on your mind — you bring it in. The practice moves you past the coarse label — stressed, stuck, fine — to a precise read of what your mind is actually doing underneath it. You leave with one clear takeaway. Do that enough times and the read gets faster, until you catch your own patterns as they happen."
        />
      </div>
      <div className="sf-fade-enter sf-fade-enter--delay-2" style={{ marginTop: "var(--sf-space-48)", display: "flex", alignItems: "center", gap: "var(--sf-space-16)" }}>
        <Button variant="primary" onClick={finish}>Begin</Button>
        <button type="button" onClick={() => setStep("frame")} className="sf-link-quiet">Back ›</button>
      </div>
    </main>
  );
}
