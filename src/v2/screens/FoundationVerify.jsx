import React from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import HairlineDivider from "../components/HairlineDivider.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import Button from "../components/Button.jsx";
import InstrumentCard from "../components/InstrumentCard.jsx";

/**
 * FoundationVerify — the first v2 screen. Not a product surface.
 *
 * Purpose: render every primitive once, against the calibrated palette,
 * so we can verify on phone that the foundation lands at editorial-luxury
 * quality before any product surface gets built on top.
 *
 * What to look for on a phone screenshot:
 *   - Ground reads as cinematic (subtle radial center brightness, not flat)
 *   - Hairlines feel printed-not-drawn (0.5px, faint)
 *   - Cormorant headlines have refined weight at the specified scale
 *   - Mono labels feel engraved (wide letter-spacing, small caps)
 *   - Cream tone (#EDE8DC) on headlines reads warmer than pure white body
 *   - Amber accent appears only as hairline + word emphasis, never as fill
 *   - Buttons feel dignified, not loud
 *   - Negative space breathes (48-64px top, 24px paragraph rhythm)
 *
 * Anchor: STILLFORM_DESIGN_SYSTEM.md "how to use this spec"
 */
export default function FoundationVerify() {
  return (
    <div className="sf-page sf-page--hero">

      <div className="sf-fade-enter" style={{ marginBottom: "var(--sf-space-48)" }}>
        <MonoLabel size="xs" tone="faint">
          Stillform · v2 foundation · verify
        </MonoLabel>
      </div>

      {/* HERO — single display-xl moment per screen. */}
      <div className="sf-fade-enter">
        <EditorialBlock
          headline="The foundation."
          headlineSize="xl"
          body={
            <>
              This screen exists to verify the design tokens render at editorial-luxury quality
              before any product surface is built on top. If the type, color, spacing, and motion
              read as Aesop, MUBI, or Cartier — the foundation is correct. If anything reads as
              wellness-default — the calibration is wrong and the tokens get the fix before any
              screen gets built.
            </>
          }
        />
      </div>

      <div style={{ height: "var(--sf-space-80)" }} aria-hidden="true" />

      {/* SECTION — typography scale check. */}
      <div className="sf-fade-enter sf-fade-enter--delay-1">
        <MonoLabel size="xs" style={{ display: "block", marginBottom: "var(--sf-space-16)" }}>
          The scale
        </MonoLabel>

        <h3 className="sf-display-lg" style={{ margin: 0 }}>
          Display large.
        </h3>
        <div style={{ height: "var(--sf-space-16)" }} aria-hidden="true" />

        <h3 className="sf-display-md" style={{ margin: 0 }}>
          Display medium.
        </h3>
        <div style={{ height: "var(--sf-space-16)" }} aria-hidden="true" />

        <h3 className="sf-display-sm" style={{ margin: 0 }}>
          Display small.
        </h3>
        <div style={{ height: "var(--sf-space-24)" }} aria-hidden="true" />

        <p className="sf-body-lg" style={{ margin: 0 }}>
          Body large — for paragraphs that carry editorial weight. Line height
          1.65 gives Aesop's reading rhythm; measure stays under 62 characters.
        </p>
        <div style={{ height: "var(--sf-space-16)" }} aria-hidden="true" />

        <p className="sf-body-md" style={{ margin: 0 }}>
          Body medium — the default. Most product copy lives here. Sentence case,
          DM Sans regular, line height 1.55.
        </p>
        <div style={{ height: "var(--sf-space-16)" }} aria-hidden="true" />

        <p className="sf-body-sm" style={{ margin: 0, color: "var(--sf-text-quiet)" }}>
          Body small — secondary text, captions, supporting detail.
        </p>
      </div>

      <div style={{ height: "var(--sf-space-64)" }} aria-hidden="true" />

      {/* SECTION — dividers. */}
      <div className="sf-fade-enter sf-fade-enter--delay-2">
        <MonoLabel size="xs" style={{ display: "block", marginBottom: "var(--sf-space-24)" }}>
          Hairlines
        </MonoLabel>

        <HairlineDivider width="full" weight="printed" />
        <div style={{ height: "var(--sf-space-16)" }} aria-hidden="true" />
        <MonoLabel size="xs" tone="faint">Full · printed</MonoLabel>

        <div style={{ height: "var(--sf-space-32)" }} aria-hidden="true" />
        <HairlineDivider width="full" weight="hairline" />
        <div style={{ height: "var(--sf-space-16)" }} aria-hidden="true" />
        <MonoLabel size="xs" tone="faint">Full · hairline</MonoLabel>

        <div style={{ height: "var(--sf-space-32)" }} aria-hidden="true" />
        <HairlineDivider width="medium" weight="accent" />
        <div style={{ height: "var(--sf-space-16)" }} aria-hidden="true" />
        <MonoLabel size="xs" tone="faint">Medium · accent (the only place amber appears as a line)</MonoLabel>
      </div>

      <div style={{ height: "var(--sf-space-64)" }} aria-hidden="true" />

      {/* SECTION — buttons. */}
      <div className="sf-fade-enter sf-fade-enter--delay-2">
        <MonoLabel size="xs" style={{ display: "block", marginBottom: "var(--sf-space-24)" }}>
          Action vocabulary
        </MonoLabel>

        <div style={{ display: "flex", gap: "var(--sf-space-12)", flexWrap: "wrap" }}>
          <Button variant="primary">Continue</Button>
          <Button variant="secondary">Not now</Button>
          <Button variant="ghost">Skip</Button>
        </div>

        <div style={{ height: "var(--sf-space-24)" }} aria-hidden="true" />

        <p className="sf-body-sm" style={{ margin: 0, color: "var(--sf-text-faint)" }}>
          Primary buttons are dark with amber hairline + amber text. Never amber fill.
          That's the Hermès convention — the action is dignified, not loud.
        </p>
      </div>

      <div style={{ height: "var(--sf-space-64)" }} aria-hidden="true" />

      {/* SECTION — instrument card (used sparingly). */}
      <div className="sf-fade-enter sf-fade-enter--delay-3">
        <MonoLabel size="xs" style={{ display: "block", marginBottom: "var(--sf-space-24)" }}>
          Instrument card
        </MonoLabel>

        <InstrumentCard>
          <MonoLabel size="xs">Session · 14 minutes</MonoLabel>
          <div style={{ height: "var(--sf-space-12)" }} aria-hidden="true" />
          <p className="sf-body-md" style={{ margin: 0 }}>
            Used when an enclosed surface is genuinely needed. Most v2 surfaces
            prefer typography + hairlines over cards.
          </p>
        </InstrumentCard>
      </div>

      <div style={{ height: "var(--sf-space-80)" }} aria-hidden="true" />

      {/* FOOTER — quiet identity. */}
      <div className="sf-fade-enter sf-fade-enter--delay-3" style={{ textAlign: "center" }}>
        <MonoLabel size="xs" tone="faint">
          Stillform · v2 · foundation only
        </MonoLabel>
      </div>

    </div>
  );
}
