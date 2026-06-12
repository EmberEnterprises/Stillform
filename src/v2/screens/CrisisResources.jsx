import React from "react";
import MonoLabel from "../components/MonoLabel.jsx";
import HairlineDivider from "../components/HairlineDivider.jsx";

/**
 * CrisisResources — the safety handoff surface.
 *
 * Reachable from the HomeFooter sub-link, and named by the crisis states in
 * Scripts and Rehearsal ("Stillform has a Crisis Resources screen"). This
 * screen existing and working is a safety requirement: the moment the app
 * detects crisis it points people here, so a dead end is not acceptable.
 *
 * FRAMING (canon framing law): Stillform is a practice, not a crisis
 * service — this screen never positions the product as a crisis tool. It is
 * a quiet, fast handoff to people trained for that moment. Plain language,
 * large single-tap targets (tel:/sms: links — one tap dials or opens a
 * pre-filled text), no product voice, no upsell, nothing in the way.
 *
 * DELIBERATE: no analytics event on this screen. Tracking visits to a
 * crisis surface is invasive; views here are nobody's data point.
 *
 * Resources (US): 988 Suicide & Crisis Lifeline (call/text, 24/7, free,
 * confidential; Spanish available) · Crisis Text Line (text HOME to 741741)
 * · 911 for immediate danger.
 * International (launch markets, each number web-verified June 2 2026 —
 * zero-fabrication: numbers only ship verified, hours stated honestly):
 *   Brazil — CVV 188 (24/7, free; emergency 192 SAMU)
 *   Spain — 024 Ministry of Health line (24/7, free; emergency 112)
 *   Mexico — Línea de la Vida 800 911 2000 (24/7, free; emergency 911)
 *   Armenia — Emotional Support Hotline 0800 00 900 (Mon–Fri 09:00–18:00,
 *     toll-free — NOT 24/7, stated as such; emergency 112 / 911)
 * Text links are US-only: the only verified text lines. No sms: links are
 * invented for call-only services. Everywhere else: findahelpline.com.
 *
 * @param {function(): void} onExit — back to home.
 */
export default function CrisisResources({ onExit }) {
  return (
    <div style={WRAP}>
      <button type="button" onClick={onExit} style={BACK_BTN} aria-label="Back to home">
        ← Back
      </button>

      <header style={{ marginBottom: "var(--sf-space-24)" }}>
        <MonoLabel size="xs">CRISIS RESOURCES</MonoLabel>
        <h1 style={H1}>If it's heavier than practice right now.</h1>
        <p style={LEAD}>
          Stillform is a practice, not a crisis service. The lines below are
          staffed by people trained for exactly this moment — free,
          confidential, around the clock.
        </p>
      </header>

      <div style={CARD}>
        <MonoLabel size="xs" tone="faint">CALL OR TEXT · 24/7 · US</MonoLabel>
        <h2 style={H2}>988 Suicide &amp; Crisis Lifeline</h2>
        <div style={ROW}>
          <a href="tel:988" style={ACTION} aria-label="Call 988 now">
            Call 988
          </a>
          <a href="sms:988" style={ACTION} aria-label="Text 988 now">
            Text 988
          </a>
        </div>
      </div>

      <div style={CARD}>
        <MonoLabel size="xs" tone="faint">TEXT · 24/7 · US</MonoLabel>
        <h2 style={H2}>Crisis Text Line</h2>
        <div style={ROW}>
          <a
            href="sms:741741?&body=HOME"
            style={ACTION}
            aria-label="Text HOME to 741741 now"
          >
            Text HOME to 741741
          </a>
        </div>
      </div>


      <div style={CARD}>
        <MonoLabel size="xs" tone="faint">CALL · 24/7 · BRAZIL</MonoLabel>
        <h2 style={H2}>CVV — Centro de Valorização da Vida</h2>
        <p style={NOTE}>Gratuito e sigiloso. Emergência: SAMU 192.</p>
        <div style={{ ...ROW, marginTop: "var(--sf-space-12)" }}>
          <a href="tel:188" style={ACTION} aria-label="Ligar 188 agora">
            Ligar 188
          </a>
          <a
            href="https://www.cvv.org.br"
            target="_blank"
            rel="noopener noreferrer"
            style={ACTION}
            aria-label="Chat CVV"
          >
            Chat — cvv.org.br
          </a>
        </div>
      </div>

      <div style={CARD}>
        <MonoLabel size="xs" tone="faint">CALL · 24/7 · SPAIN</MonoLabel>
        <h2 style={H2}>Línea 024 — atención a la conducta suicida</h2>
        <p style={NOTE}>Gratuita y confidencial. Emergencias: 112.</p>
        <div style={{ ...ROW, marginTop: "var(--sf-space-12)" }}>
          <a href="tel:024" style={ACTION} aria-label="Llamar al 024 ahora">
            Llamar 024
          </a>
        </div>
      </div>

      <div style={CARD}>
        <MonoLabel size="xs" tone="faint">CALL · 24/7 · MEXICO</MonoLabel>
        <h2 style={H2}>Línea de la Vida</h2>
        <p style={NOTE}>Gratuita y confidencial. Emergencias: 911.</p>
        <div style={{ ...ROW, marginTop: "var(--sf-space-12)" }}>
          <a href="tel:8009112000" style={ACTION} aria-label="Llamar 800 911 2000 ahora">
            Llamar 800 911 2000
          </a>
        </div>
      </div>

      <div style={CARD}>
        <MonoLabel size="xs" tone="faint">CALL · MON–FRI 09:00–18:00 · ARMENIA</MonoLabel>
        <h2 style={H2}>Emotional Support Hotline</h2>
        <p style={NOTE}>
          Toll-free, nationwide (MHAI · Yerevan Municipality). Not 24/7 —
          outside hours, call 112 or use the directory below.
          {/* Number verified June 2 2026: findahelpline (helpline-verified
              Feb 26 2026) + mha.am + Armenian press (Dec 2025). Hours stated
              honestly on-screen because the line is NOT 24/7. */}
        </p>
        <div style={{ ...ROW, marginTop: "var(--sf-space-12)" }}>
          <a href="tel:080000900" style={ACTION} aria-label="Call 0800 00 900 now">
            Call 0800 00 900
          </a>
          <a href="tel:112" style={ACTION} aria-label="Call 112 now">
            Call 112
          </a>
          <a
            href="https://findahelpline.com/countries/am"
            target="_blank"
            rel="noopener noreferrer"
            style={ACTION}
            aria-label="Armenia helpline directory"
          >
            Armenia lines
          </a>
        </div>
      </div>

      <div style={CARD}>
        <MonoLabel size="xs" tone="faint">IMMEDIATE DANGER</MonoLabel>
        <h2 style={H2}>Emergency services</h2>
        <p style={NOTE}>
          If you or someone else is in immediate danger, call your local
          emergency number now.
        </p>
        <div style={ROW}>
          <a href="tel:911" style={ACTION} aria-label="Call 911 now">
            Call 911 (US)
          </a>
        </div>
      </div>

      <HairlineDivider />

      <p style={{ ...NOTE, marginTop: "var(--sf-space-16)" }}>
        Anywhere else:{" "}
        <a
          href="https://findahelpline.com"
          target="_blank"
          rel="noopener noreferrer"
          style={INLINE_LINK}
        >
          findahelpline.com
        </a>{" "}
        lists crisis lines by country.
      </p>

      <p style={{ ...NOTE, marginTop: "var(--sf-space-8)" }}>
        Reaching out is not a failure of the practice. It is the strongest
        read of the moment there is.
      </p>
    </div>
  );
}

/* ---- styles ---- */

const WRAP = {
  minHeight: "100dvh",
  padding:
    "calc(env(safe-area-inset-top, 0px) + var(--sf-space-24)) var(--sf-space-24) calc(env(safe-area-inset-bottom, 0px) + var(--sf-space-32))",
  maxWidth: "520px",
  margin: "0 auto",
};

const BACK_BTN = {
  background: "transparent",
  border: "none",
  color: "var(--sf-text-quiet)",
  fontFamily: "var(--sf-font-mono)",
  fontSize: "13px",
  letterSpacing: "0.08em",
  padding: "12px 0",
  marginBottom: "var(--sf-space-8)",
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
};

const H1 = {
  margin: "var(--sf-space-12) 0 var(--sf-space-12)",
  color: "var(--sf-text-primary)",
  fontFamily: "var(--sf-font-serif)",
  fontSize: "var(--sf-text-display-sm, 28px)",
  lineHeight: 1.2,
  fontWeight: 400,
};

const LEAD = {
  margin: 0,
  color: "var(--sf-text-cream)",
  fontFamily: "var(--sf-font-sans)",
  fontSize: "var(--sf-text-body-md)",
  lineHeight: "var(--sf-leading-body)",
  fontWeight: 300,
};

const CARD = {
  // Synthesis restyle (June 2, Arlin's live-walk catch): a ruled manuscript
  // section, not a rounded app card. The rule separates; the page carries.
  padding: "var(--sf-space-20) 0 var(--sf-space-24)",
  marginBottom: "var(--sf-space-8)",
  background: "transparent",
  border: "none",
  borderTop: "1px solid var(--sf-accent-line)",
  borderRadius: 0,
};

const H2 = {
  margin: "var(--sf-space-8) 0 var(--sf-space-12)",
  color: "var(--sf-text-primary)",
  fontFamily: "var(--sf-font-serif)",
  fontSize: "22px",
  fontWeight: 460,
  lineHeight: 1.25,
};

const ROW = {
  display: "flex",
  gap: "var(--sf-space-12)",
  flexWrap: "wrap",
};

const ACTION = {
  // Large single-tap targets: tel:/sms: links dial or open a pre-filled
  // text in one tap. Visually unmissable without shouting.
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  // The fill STAYS — this is the one screen where an unmissable filled
  // target is functionally right. The pill goes: square corners, calmer
  // weight. Big and certain, in the system's voice.
  minHeight: "54px",
  padding: "0 var(--sf-space-20)",
  flex: "1 1 auto",
  background: "var(--sf-text-primary, #ECE3D0)",
  color: "var(--sf-ground-deep, #151009)",
  borderRadius: "2px",
  fontFamily: "var(--sf-font-sans)",
  fontSize: "17px",
  fontWeight: 500,
  letterSpacing: "0.01em",
  textDecoration: "none",
  WebkitTapHighlightColor: "transparent",
};

const NOTE = {
  margin: 0,
  color: "var(--sf-text-quiet)",
  fontFamily: "var(--sf-font-sans)",
  fontSize: "var(--sf-text-body-sm, 14px)",
  lineHeight: "var(--sf-leading-body)",
  fontWeight: 300,
};

const INLINE_LINK = {
  color: "var(--sf-text-cream)",
  textDecorationColor: "var(--sf-border-emphasis)",
  textUnderlineOffset: "3px",
};

/* International lines live as full cards above — each number web-verified
   June 2 2026 (Brazil CVV 188 · Spain 024 · Mexico 800 911 2000 · Armenia
   0800 00 900, Mon–Fri 09:00–18:00 stated honestly on-screen). */
