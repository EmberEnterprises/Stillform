import React, { useState, useEffect } from "react";
import EditorialBlock from "../components/EditorialBlock.jsx";
import MonoLabel from "../components/MonoLabel.jsx";
import Button from "../components/Button.jsx";
import HairlineDivider from "../components/HairlineDivider.jsx";
import AccountSection from "../components/AccountSection.jsx";
import { startCheckout } from "../lib/subscriptionApi.js";

/**
 * Paywall — Phase 8b. The value-framing surface that was missing (UAT: a
 * tester hit the bare subscription page post-calibration and it read as a
 * "money grab"). This leads with WHAT STILLFORM IS before the ask.
 *
 * Framing is law-bound (STILLFORM_FRAMING_LAW / CANON): Stillform is a
 * metacognition practice that produces cognitive expansion — sharper thinking,
 * better decisions, deeper self-understanding. Composure is a felt outcome,
 * never the pitch. No "regulate / calm / wellness" language anywhere here.
 *
 * Free boundary (CANON §291): Quick Breathe stays free, always — stated
 * outright so the ask doesn't feel like it's locking the safety valve.
 *
 * DEFAULT COPY — drafted from locked positioning for Arlin to assess on
 * screen. Reachable for review at ?paywall=1 (no permanent entry point until
 * the timing/gating decision is made — that's 8c).
 *
 * Checkout sends the user to Lemon Squeezy via startCheckout(variant). Until
 * the LS checkout URLs are configured in subscriptionApi.js, the CTA shows an
 * "almost ready" line instead of a dead link.
 */

const LIST = {
  listStyle: "none",
  margin: 0,
  padding: 0,
};

const LIST_ITEM = {
  fontFamily: "var(--sf-font-serif)",
  fontSize: "17px",
  lineHeight: 1.5,
  color: "var(--sf-text-primary)",
  paddingLeft: "var(--sf-space-16)",
  position: "relative",
  marginBottom: "var(--sf-space-12)",
};

const ITEM_MARK = {
  position: "absolute",
  left: 0,
  color: "var(--sf-accent)",
};

const FREE_NOTE = {
  fontFamily: "var(--sf-font-sans)",
  fontSize: "13px",
  lineHeight: 1.5,
  color: "var(--sf-text-faint)",
  marginTop: "var(--sf-space-16)",
};

const ERR = {
  fontFamily: "var(--sf-font-sans)",
  fontSize: "13px",
  lineHeight: 1.5,
  color: "var(--sf-text-secondary)",
  marginTop: "var(--sf-space-16)",
};

function planStyle(selected) {
  return {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    width: "100%",
    textAlign: "left",
    padding: "var(--sf-space-16)",
    borderRadius: "12px",
    border: `1px solid ${selected ? "var(--sf-accent-line)" : "var(--sf-border-quiet)"}`,
    background: selected ? "var(--sf-surface-raised)" : "transparent",
    cursor: "pointer",
    marginBottom: "var(--sf-space-12)",
    transition: "border-color 160ms ease, background 160ms ease",
  };
}

const PLAN_NAME = {
  fontFamily: "var(--sf-font-sans)",
  fontSize: "14px",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "var(--sf-text-primary)",
};

const PLAN_SUB = {
  fontFamily: "var(--sf-font-sans)",
  fontSize: "12px",
  color: "var(--sf-text-faint)",
  marginTop: "4px",
};

const PLAN_PRICE = {
  fontFamily: "var(--sf-font-serif)",
  fontSize: "22px",
  color: "var(--sf-text-primary)",
  whiteSpace: "nowrap",
};

const PLAN_UNIT = {
  fontSize: "13px",
  color: "var(--sf-text-faint)",
};

function PlanOption({ id, name, price, sub, selected, onSelect }) {
  return (
    <button type="button" style={planStyle(selected)} aria-pressed={selected} onClick={() => onSelect(id)}>
      <span>
        <span style={{ display: "block", ...PLAN_NAME }}>{name}</span>
        <span style={{ display: "block", ...PLAN_SUB }}>{sub}</span>
      </span>
      <span style={PLAN_PRICE}>
        {price}
        <span style={PLAN_UNIT}> /mo</span>
      </span>
    </button>
  );
}

export default function Paywall({ onClose }) {
  const [variant, setVariant] = useState("annual");
  const [error, setError] = useState("");

  useEffect(() => {
    try { window.plausible?.("Paywall Viewed"); } catch { /* non-fatal */ }
  }, []);

  const handleStart = () => {
    setError("");
    try { window.plausible?.("Checkout Started", { props: { variant } }); } catch { /* non-fatal */ }
    const res = startCheckout(variant);
    if (!res.ok) {
      setError(
        res.error === "not_configured"
          ? "Almost ready — checkout goes live the moment the plan links are set."
          : "Couldn't open checkout. Try again."
      );
    }
  };

  return (
    <main className="sf-page sf-page--hero">
      <div className="sf-fade-enter">
        <EditorialBlock
          label="The practice"
          headline="What you're actually building."
          headlineSize="lg"
          body="Stillform is a metacognition practice. Each session, you name what your mind is doing with a little more precision — and that precision compounds. Over time you read your own patterns faster, make sharper calls under pressure, and understand yourself at a finer grain. Composure is just the part you feel first."
        />
      </div>

      <div className="sf-fade-enter sf-fade-enter--delay-1" style={{ marginTop: "var(--sf-space-48)" }}>
        <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-16)" }}>
          What's included
        </MonoLabel>
        <ul style={LIST}>
          <li style={LIST_ITEM}><span style={ITEM_MARK}>·</span>Unlimited Reframe — the full practice, with your AI partner</li>
          <li style={LIST_ITEM}><span style={ITEM_MARK}>·</span>Your pattern work, and how it shifts over time</li>
          <li style={LIST_ITEM}><span style={ITEM_MARK}>·</span>The roadmap, and every profile you build</li>
        </ul>
        <p style={FREE_NOTE}>Quick Breathe stays free, always. The stabilization valve is never behind a wall.</p>
      </div>

      <div className="sf-fade-enter sf-fade-enter--delay-2" style={{ marginTop: "var(--sf-space-48)" }}>
        <MonoLabel size="xs" tone="faint" style={{ display: "block", marginBottom: "var(--sf-space-16)" }}>
          Choose a plan
        </MonoLabel>
        <PlanOption
          id="annual"
          name="Annual"
          price="$9.99"
          sub="Billed $119.88 a year · save 33%"
          selected={variant === "annual"}
          onSelect={setVariant}
        />
        <PlanOption
          id="monthly"
          name="Monthly"
          price="$14.99"
          sub="Billed monthly"
          selected={variant === "monthly"}
          onSelect={setVariant}
        />
      </div>

      <div
        className="sf-fade-enter sf-fade-enter--delay-3"
        style={{ marginTop: "var(--sf-space-48)", display: "flex", alignItems: "center", gap: "var(--sf-space-16)", flexWrap: "wrap" }}
      >
        <Button variant="primary" onClick={handleStart}>Start</Button>
        <button type="button" onClick={onClose} className="sf-link-quiet">Not now ›</button>
      </div>

      {error ? <p style={ERR}>{error}</p> : null}

      {/* Log in / sign up — relocated here from Settings (Arlin, June 23): the
          subscription surface is where account + access live, so logging in or
          signing up lands you in one place, not buried in Settings. */}
      <div className="sf-fade-enter sf-fade-enter--delay-3" style={{ marginTop: "var(--sf-space-64)" }}>
        <HairlineDivider />
        <MonoLabel size="xs" tone="faint" style={{ display: "block", margin: "var(--sf-space-24) 0 var(--sf-space-16)" }}>
          Log in or sign up
        </MonoLabel>
        <AccountSection />
      </div>
    </main>
  );
}
