import React from "react";

/**
 * ErrorBoundary — Phase 12 launch-plumbing, pulled forward. v2 had none: a
 * render error anywhere white-screened the whole app, including the
 * always-free Quick Breathe valve (CANON §291). This catches render errors
 * and shows a calm, on-voice fallback with a reload path instead of a blank
 * screen.
 *
 * Deliberately self-contained: the fallback uses only inline styles + design
 * tokens, no other Stillform components, so a fault in the component tree
 * can't also take out the fallback.
 */

const LABEL = {
  fontFamily: "var(--sf-font-sans)",
  fontSize: "12px",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--sf-text-faint)",
  marginBottom: "var(--sf-space-16)",
};

const HEAD = {
  fontFamily: "var(--sf-font-serif)",
  fontSize: "30px",
  lineHeight: 1.15,
  color: "var(--sf-text-primary)",
  margin: 0,
};

const BODY = {
  fontFamily: "var(--sf-font-sans)",
  fontSize: "16px",
  lineHeight: 1.5,
  color: "var(--sf-text-secondary)",
  marginTop: "var(--sf-space-16)",
};

const BTN = {
  marginTop: "var(--sf-space-32)",
  fontFamily: "var(--sf-font-sans)",
  fontSize: "14px",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "var(--sf-text-primary)",
  background: "transparent",
  border: "1px solid var(--sf-accent-line)",
  borderRadius: "999px",
  padding: "12px 28px",
  cursor: "pointer",
};

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    try {
      console.error("Stillform render error:", error, info && info.componentStack);
      if (typeof window !== "undefined" && typeof window.plausible === "function") {
        window.plausible("App Error");
      }
    } catch {
      /* non-fatal */
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="sf-v2">
        <main className="sf-page sf-page--hero">
          <div style={{ marginTop: "var(--sf-space-64)" }}>
            <div style={LABEL}>Stillform</div>
            <h1 style={HEAD}>Something glitched.</h1>
            <p style={BODY}>That&rsquo;s on us, not you. A reload usually clears it &mdash; your history is saved.</p>
            <button type="button" style={BTN} onClick={() => window.location.reload()}>
              Reload
            </button>
          </div>
        </main>
      </div>
    );
  }
}
