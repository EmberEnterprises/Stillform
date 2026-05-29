import React from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import Button from "../components/Button.jsx";

/**
 * Onboarding — Phase 10a. The front-door frame. A brand-new user used to land
 * on Home with no idea what Stillform is; this is the first thing they see now.
 *
 * Framing is law-bound (STILLFORM_FRAMING_LAW / CANON): Stillform is a
 * metacognition practice that produces cognitive expansion — sharper thinking,
 * better decisions, deeper self-understanding. Composure is the felt outcome,
 * never the pitch. Stated PURELY POSITIVELY — no "it's not meditation / not
 * calming down" define-by-negation (banned). Mirrors the paywall frame so the
 * front door and the ask tell one consistent story.
 *
 * DEFAULT COPY for Arlin to assess on screen. This is 10a (the intro only);
 * 10b "how it works", 10c guided calibration, and 10d hand-off into the first
 * session come next. For now Begin marks onboarded and drops into Home.
 */
export default function Onboarding({ onComplete }) {
  return (
    <main className="sf-page sf-page--hero">
      <div className="sf-fade-enter">
        <EditorialBlock
          label="Stillform"
          headline="Get sharper at reading your own mind."
          headlineSize="xl"
          body="Stillform is a metacognition practice. Each time you use it, you name what your mind is actually doing — with a little more precision than last time. That precision compounds: you read your own patterns faster, decide better under pressure, and understand yourself at a finer grain. Composure is just the part you feel first."
        />
      </div>

      <div className="sf-fade-enter sf-fade-enter--delay-2" style={{ marginTop: "var(--sf-space-48)" }}>
        <Button variant="primary" onClick={onComplete}>Begin</Button>
      </div>
    </main>
  );
}
