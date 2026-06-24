import React from "react";
import BrassCross from "../components/BrassCross.jsx";

/**
 * CrisisResources — the safety handoff surface (Home footer sub-link; named by
 * crisis states elsewhere). This screen existing and working is a safety
 * requirement: a dead end is not acceptable.
 *
 * FRAMING (canon framing law): Stillform is a practice, not a crisis service —
 * this screen never positions the product as a crisis tool. Quiet, fast handoff
 * to people trained for the moment. Plain language, large single-tap targets,
 * no product voice, no upsell.
 *
 * REBUILD (June 23 2026, Arlin): clean V1 formatting, skinned in the HOME
 * aesthetic (warm aura + grain ground, drawn-brass section rule, Cormorant serif
 * name, brass action pills). The opt-in "summary of what you\'ve been working
 * through" data pop-up was REMOVED — surfacing the user\'s own data on a crisis
 * surface is the wrong thing in that moment. No data thing, no dropdown.
 *
 * DELIBERATE: no analytics on this screen — views here are nobody\'s data point.
 * Numbers web-verified June 2 2026 (zero-fabrication). Text links US-only.
 *
 * @param {function(): void} onExit — back to home.
 */

const RESOURCES = [
  {
    meta: "CALL OR TEXT · 24/7 · US",
    name: "988 Suicide & Crisis Lifeline",
    note: "Free, confidential, around the clock. Spanish available.",
    actions: [
      { label: "Call 988", href: "tel:988", aria: "Call 988 now" },
      { label: "Text 988", href: "sms:988", aria: "Text 988 now" },
    ],
  },
  {
    meta: "TEXT · 24/7 · US",
    name: "Crisis Text Line",
    note: "Text-based support with a trained counsellor.",
    actions: [
      { label: "Text HOME to 741741", href: "sms:741741?&body=HOME", aria: "Text HOME to 741741 now" },
    ],
  },
  {
    meta: "CALL · 24/7 · BRAZIL",
    name: "CVV — Centro de Valorização da Vida",
    note: "Gratuito e sigiloso. Emergências: 192 (SAMU).",
    actions: [
      { label: "Ligar 188", href: "tel:188", aria: "Ligar 188 agora" },
      { label: "Chat — cvv.org.br", href: "https://www.cvv.org.br", aria: "Chat CVV", external: true },
    ],
  },
  {
    meta: "CALL · 24/7 · SPAIN",
    name: "Línea 024 — atención a la conducta suicida",
    note: "Gratuita y confidencial. Emergencias: 112.",
    actions: [
      { label: "Llamar 024", href: "tel:024", aria: "Llamar al 024 ahora" },
    ],
  },
  {
    meta: "CALL · 24/7 · MEXICO",
    name: "Línea de la Vida",
    note: "Gratuita y confidencial. Emergencias: 911.",
    actions: [
      { label: "Llamar 800 911 2000", href: "tel:8009112000", aria: "Llamar 800 911 2000 ahora" },
    ],
  },
  {
    meta: "CALL · MON–FRI 09:00–18:00 · ARMENIA",
    name: "Emotional Support Hotline",
    note: "Toll-free, nationwide (MHAI · Yerevan Municipality). Not 24/7 — outside hours, call 112 or use the directory below.",
    actions: [
      { label: "Call 0800 00 900", href: "tel:080000900", aria: "Call 0800 00 900 now" },
      { label: "Call 112", href: "tel:112", aria: "Call 112 now" },
      { label: "Armenia lines", href: "https://findahelpline.com/countries/am", aria: "Armenia helpline directory", external: true },
    ],
  },
  {
    meta: "IMMEDIATE DANGER",
    name: "Emergency services",
    note: "If you or someone else is in immediate danger, call your local emergency number now.",
    actions: [
      { label: "Call 911 (US)", href: "tel:911", aria: "Call 911 now" },
    ],
  },
];

function ResourceRow({ meta, name, note, actions }) {
  return (
    <div style={CARD}>
      <span style={META}>{meta}</span>
      <h2 style={NAME}>{name}</h2>
      {note ? <p style={NOTE}>{note}</p> : null}
      <div style={ACTIONS}>
        {actions.map((a) => (
          <a
            key={a.href + a.label}
            href={a.href}
            style={ACTION}
            aria-label={a.aria}
            {...(a.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {a.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function CrisisResources({ onExit }) {
  return (
    <>
      <div className="sf-home-aura" aria-hidden="true" />
      <div className="sf-home-grain" aria-hidden="true" />
      <main className="sf-page" style={{ paddingTop: "var(--sf-space-32)", position: "relative", zIndex: 1 }}>
        <button type="button" onClick={onExit} style={BACK_BTN} aria-label="Back to home">
          ← back
        </button>

        <header style={{ marginBottom: "var(--sf-space-32)" }}>
          <BrassCross size={22} style={{ display: "block", marginBottom: "var(--sf-space-16)" }} />
          <div className="sf-sec-head">
            <span className="sf-sec-head-lbl">Crisis Resources</span>
            <div className="sf-sec-rule" />
          </div>
          <h1 style={H1}>If it&rsquo;s heavier than practice right now.</h1>
          <p style={LEAD}>
            Stillform is a practice, not a crisis service. The lines below are
            staffed by people trained for exactly this moment — free,
            confidential, around the clock.
          </p>
        </header>

        {RESOURCES.map((r) => (
          <ResourceRow key={r.name} {...r} />
        ))}

        <p style={{ ...NOTE, marginTop: "var(--sf-space-24)" }}>
          Anywhere else,{" "}
          <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" style={INLINE_LINK}>
            findahelpline.com
          </a>{" "}
          lists crisis lines by country.
        </p>
        <p style={{ ...NOTE, marginTop: "var(--sf-space-8)", marginBottom: "var(--sf-space-48)" }}>
          Reaching out is not a failure of the practice. It is the strongest read
          of the moment there is.
        </p>
      </main>
    </>
  );
}

const BACK_BTN = {
  background: "transparent", border: "none", color: "var(--sf-text-faint)",
  fontFamily: "var(--sf-font-mono)", fontSize: "11px", letterSpacing: "0.14em",
  textTransform: "uppercase", cursor: "pointer", padding: "8px 0",
  marginBottom: "var(--sf-space-24)", WebkitTapHighlightColor: "transparent",
};
const H1 = {
  fontFamily: "var(--sf-font-serif)", fontSize: "30px", fontWeight: 400,
  lineHeight: 1.2, color: "var(--sf-text-cream)", margin: "var(--sf-space-12) 0 var(--sf-space-12)",
};
const LEAD = {
  fontFamily: "var(--sf-font-sans)", fontWeight: 300, fontSize: "15px",
  lineHeight: 1.6, color: "var(--sf-text-faint)", margin: 0,
};
const CARD = {
  borderTop: "0.5px solid var(--sf-border-hairline)",
  padding: "var(--sf-space-24) 0",
};
const META = {
  display: "block", fontFamily: "var(--sf-font-mono)", fontSize: "10px",
  letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--sf-accent-line)",
  marginBottom: "var(--sf-space-8)",
};
const NAME = {
  fontFamily: "var(--sf-font-serif)", fontSize: "21px", fontWeight: 400,
  lineHeight: 1.3, color: "var(--sf-text-cream)", margin: 0,
};
const NOTE = {
  fontFamily: "var(--sf-font-sans)", fontWeight: 300, fontSize: "13.5px",
  lineHeight: 1.55, color: "var(--sf-text-faint)", margin: "var(--sf-space-8) 0 0",
};
const ACTIONS = {
  display: "flex", flexWrap: "wrap", gap: "var(--sf-space-8)",
  marginTop: "var(--sf-space-16)",
};
const ACTION = {
  display: "inline-flex", alignItems: "center", minHeight: "44px",
  padding: "0 18px", border: "1px solid var(--sf-accent-line)", borderRadius: "8px",
  color: "var(--sf-accent)", fontFamily: "var(--sf-font-sans)", fontSize: "14px",
  fontWeight: 400, textDecoration: "none", WebkitTapHighlightColor: "transparent",
};
const INLINE_LINK = {
  color: "var(--sf-accent)", textDecoration: "underline", textUnderlineOffset: "3px",
};
