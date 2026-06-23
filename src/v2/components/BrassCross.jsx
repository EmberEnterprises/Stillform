import React from "react";

/**
 * BrassCross — a small, calm brass cross, the Crisis safety mark.
 *
 * Per Arlin (June 23 2026): Crisis carries a brass cross — in the home footer
 * link and as the emblem on the Crisis Resources page. Drawn as two hairline
 * strokes (not a heavy glyph) so it reads as a considered care mark, dignified
 * rather than alarming, and stays small enough on home to keep Crisis
 * visually subordinate (canon framing law).
 */
export default function BrassCross({ size = 12, stroke = 1.25, style }) {
  const c = size / 2;
  const a = size * 0.18;
  const b = size * 0.82;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      style={{ display: "inline-block", flex: "0 0 auto", ...style }}
    >
      <line x1={c} y1={a} x2={c} y2={b} stroke="var(--sf-accent)" strokeWidth={stroke} strokeLinecap="round" />
      <line x1={a} y1={c} x2={b} y2={c} stroke="var(--sf-accent)" strokeWidth={stroke} strokeLinecap="round" />
    </svg>
  );
}
