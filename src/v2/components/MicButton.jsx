/**
 * MicButton — the voice-dictation affordance for any text field.
 *
 * Recovered from v1, restyled to the prestige spec: a hairline-ruled mono
 * tag (not a filled pill, not an emoji). Resting state is quiet; listening
 * state warms to the spec terracotta with a slow pulse. Renders nothing when
 * the browser has no SpeechRecognition (graceful, never a dead control).
 *
 * @param {{ onTranscript: (text: string) => void }} props
 */
import { useSpeechToText } from "../lib/useSpeechToText.js";

export default function MicButton({ onTranscript }) {
  const speech = useSpeechToText(onTranscript);
  if (!speech.supported) return null;

  const on = speech.listening;
  return (
    <button
      type="button"
      onClick={speech.toggle}
      aria-label={on ? "Stop dictation" : "Dictate with voice"}
      aria-pressed={on}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        background: "transparent",
        border: "none",
        borderTop: `0.5px solid ${on ? "var(--sf-state-negative, #B47A6A)" : "var(--sf-border-emphasis, rgba(255,255,255,0.10))"}`,
        borderBottom: `0.5px solid ${on ? "var(--sf-state-negative, #B47A6A)" : "var(--sf-border-emphasis, rgba(255,255,255,0.10))"}`,
        padding: "7px 14px",
        fontFamily: "var(--sf-font-mono, monospace)",
        fontSize: "10px",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: on ? "var(--sf-state-negative, #B47A6A)" : "var(--sf-text-quiet, rgba(232,234,240,0.62))",
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
        transition: "color 0.2s, border-color 0.2s",
        animation: on ? "sfPulse 1.6s ease-in-out infinite" : "none",
      }}
    >
      {/* simple mic glyph drawn in SVG — no emoji, matches the engraved mono look */}
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="2" width="6" height="12" rx="3" />
        <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
      </svg>
      {on ? "Listening" : "Speak"}
    </button>
  );
}
