import { useState, useEffect, useRef, Component } from "react";
import { WidgetBridge } from "./plugins/widgetBridge";
import { integrationBridge } from "./plugins/integrationBridge";

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error("Stillform error:", error, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ background: "#0A0A0C", color: "#E8EAF0", padding: 40, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, color: "#C8922A", marginBottom: 12 }}>Something went wrong.</div>
          <div style={{ fontSize: 14, color: "#9496A1", marginBottom: 16, lineHeight: 1.6 }}>Your data is safe. Tap below to restart.</div>
          <button onClick={() => { this.setState({ error: null }); window.location.href = "/"; }}
            style={{ background: "#C8922A", color: "#0A0A0C", border: "none", padding: "14px 28px", cursor: "pointer", borderRadius: 3, fontSize: 15, fontWeight: 500 }}>
            Restart Stillform
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}


const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=IBM+Plex+Mono:wght@300;400&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-user-select: none; user-select: none; }
  input, textarea { -webkit-user-select: text; user-select: text; }

  :root {
    --bg:         #0A0A0C;
    --surface:    #141418;
    --surface2:   #1A1A1F;
    --border:     rgba(255,255,255,0.07);
    --border-hi:  rgba(255,255,255,0.12);
    --amber:      #C8922A;
    --amber-dim:  rgba(200,146,42,0.25);
    --amber-glow: rgba(200,146,42,0.07);
    --amber-20:   rgba(200,146,42,0.20);
    --text:       #E8EAF0;
    --text-dim:   #9496A1;
    --text-muted: #95979f;
    --green:      #4a8c6a;
    --green-glow: rgba(74,140,106,0.08);
    --r-sm: 2px;
    --r:    3px;
    --r-lg: 6px;
  }

  html, body, #root { height: 100%; background: var(--bg); }

  .app {
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    position: relative;
    overflow-x: hidden;
    /* Grain texture — prestige signal */
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.025'/%3E%3C/svg%3E");
  }

  .app::before {
    content: '';
    position: fixed;
    top: -40%;
    left: -20%;
    width: 60%;
    height: 60%;
    background: radial-gradient(ellipse, rgba(200,146,42,0.03) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 40px;
    border-bottom: 0.5px solid var(--border);
    position: relative;
    z-index: 10;
  }

  .nav-logo {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
    font-size: 18px;
    letter-spacing: 0.08em;
    text-transform: none;
    color: var(--text);
    user-select: none;
    -webkit-user-select: none;
  }

  .nav-logo span { color: var(--amber); }

  .nav-actions { display: flex; gap: 12px; align-items: center; }

  .btn {
    padding: 10px 22px;
    border-radius: var(--r);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0.06em;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }

  .btn-ghost {
    background: transparent;
    color: var(--text-dim);
    border: 0.5px solid var(--border-hi);
  }

  .btn-ghost:hover { border-color: var(--amber-dim); color: var(--amber); }

  .btn-primary {
    background: var(--amber);
    color: var(--btn-primary-text, #0A0A0C);
    font-weight: 500;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.2);
  }

  .btn-primary:hover { opacity: 0.9; }

  .btn-secondary {
    background: var(--surface2);
    color: var(--text);
    border: 0.5px solid var(--border-hi);
  }

  .btn-secondary:hover { border-color: var(--amber-dim); }

  /* HOME */
  .home {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 73px);
    padding: 60px 40px;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  .home-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--amber-glow);
    border: 1px solid var(--amber-dim);
    border-radius: 100px;
    padding: 6px 16px;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--amber);
    margin-bottom: 40px;
  }

  .home-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(52px, 8vw, 88px);
    font-weight: 300;
    line-height: 1.05;
    letter-spacing: -0.01em;
    margin-bottom: 28px;
    color: var(--text);
  }

  .home-title em {
    font-style: italic;
    color: var(--amber);
  }

  .home-sub {
    font-size: 17px;
    line-height: 1.8;
    color: var(--text-dim);
    max-width: 520px;
    margin-bottom: 48px;
    font-weight: 300;
  }

  .home-cta { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-bottom: 80px; }

  .home-features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
    width: 100%;
    max-width: 860px;
    margin-top: 20px;
  }

  .feature-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 24px;
    text-align: left;
    transition: border-color 0.2s;
  }

  .feature-card:hover { border-color: var(--amber-dim); }

  .feature-icon {
    width: 36px;
    height: 36px;
    background: var(--amber-glow);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    font-size: 16px;
  }

  .feature-title { font-size: 14px; font-weight: 500; margin-bottom: 8px; color: var(--text); }
  .feature-desc { font-size: 13px; color: var(--text-dim); line-height: 1.6; }

  /* TOOL SELECTOR */
  .tools {
    max-width: 900px;
    margin: 0 auto;
    padding: 40px 40px 80px;
    position: relative;
    z-index: 1;
  }

  .tools-header { margin-bottom: 40px; }
  .tools-header h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 36px;
    font-weight: 300;
    margin-bottom: 8px;
  }
  .tools-header p { color: var(--text-dim); font-size: 14px; }

  .tools-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  .tool-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 28px 24px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }

  .tool-card:hover {
    border-color: var(--amber-dim);
    background: var(--surface2);
    transform: translateY(-2px);
  }

  .tool-icon { font-size: 28px; margin-bottom: 16px; }
  .tool-name { font-size: 16px; font-weight: 500; margin-bottom: 6px; }
  .tool-desc { font-size: 12px; color: var(--text-dim); line-height: 1.6; }
  .tool-time {
    display: inline-block;
    margin-top: 14px;
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--amber);
    background: var(--amber-glow);
    padding: 3px 10px;
    border-radius: 100px;
  }

  /* INTERVENTION */
  .intervention {
    max-width: 640px;
    margin: 0 auto;
    padding: 40px 40px 80px;
    position: relative;
    z-index: 1;
  }

  .intervention-back {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-dim);
    font-size: 13px;
    cursor: pointer;
    margin-bottom: 40px;
    transition: color 0.2s;
    background: none;
    border: none;
    font-family: 'DM Sans', sans-serif;
  }

  .intervention-back:hover { color: var(--amber); }

  .intervention-header {
    margin-bottom: 40px;
  }

  .intervention-header h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 42px;
    font-weight: 300;
    margin-bottom: 10px;
  }

  .intervention-header p { color: var(--text-dim); font-size: 15px; line-height: 1.7; }

  /* BREATHING */
  .breath-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 0;
  }

  .breath-circle-wrap {
    position: relative;
    width: 280px;
    height: 280px;
    margin-bottom: 24px;
  }

  .breath-svg-ring {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
    position: absolute;
    inset: 0;
  }

  .breath-ring-track {
    fill: none;
    stroke: rgba(255,255,255,0.05);
    stroke-width: 1;
  }

  .breath-ring-arc {
    fill: none;
    stroke: var(--amber);
    stroke-width: 1.5;
    stroke-linecap: butt;
    transition: stroke-dashoffset var(--breath-duration, 4s) linear;
  }

  /* Legacy circle — kept for sigh tool */
  .breath-circle {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform var(--breath-duration, 4s) ease-in-out;
  }

  .breath-circle.expand { transform: scale(1.05); }
  .breath-circle.hold   { transform: scale(1.05); }
  .breath-circle.contract { transform: scale(1); }

  @keyframes breathe-ring {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 0.08; transform: scale(1.5); }
  }

  .breath-inner {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 4px;
  }

  .breath-count {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 52px;
    font-weight: 300;
    color: var(--amber);
    line-height: 1;
    letter-spacing: -0.02em;
  }

  .breath-phase {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 12px;
    text-align: center;
  }

  .breath-instruction {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-style: italic;
    font-weight: 300;
    color: var(--text-dim);
    text-align: center;
    margin-bottom: 8px;
    line-height: 1.3;
    transition: opacity 0.5s ease;
  }

  /* GROUNDING */
  .grounding-steps { display: flex; flex-direction: column; gap: 16px; }

  .ground-step {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 20px 24px;
    transition: all 0.3s;
  }

  .ground-step.active {
    border-color: var(--amber);
    background: var(--amber-glow);
  }

  .ground-step.done {
    border-color: var(--green);
    background: var(--green-glow);
    opacity: 0.7;
  }

  .ground-step-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 8px;
  }

  .ground-number {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--amber-glow);
    border: 1px solid var(--amber-dim);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: var(--amber);
    flex-shrink: 0;
  }

  .ground-step.done .ground-number {
    background: var(--green-glow);
    border-color: var(--green);
    color: var(--green);
  }

  .ground-label { font-size: 15px; font-weight: 500; }
  .ground-desc { font-size: 13px; color: var(--text-dim); line-height: 1.6; padding-left: 42px; }

  .ground-input {
    width: 100%;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 12px 16px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    margin-top: 12px;
    margin-left: 42px;
    width: calc(100% - 42px);
    transition: border-color 0.2s;
    resize: none;
  }

  .ground-input:focus { outline: none; border-color: var(--amber); }

  /* REFRAME */
  .reframe-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 32px;
    margin-bottom: 20px;
  }

  .reframe-question {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px;
    font-weight: 300;
    font-style: italic;
    margin-bottom: 20px;
    line-height: 1.4;
    color: var(--text);
  }

  .reframe-input {
    width: 100%;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 14px 16px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    line-height: 1.6;
    resize: none;
    min-height: 100px;
    transition: border-color 0.2s;
  }

  .reframe-input:focus { outline: none; border-color: var(--amber); }

  .reframe-insight {
    background: var(--amber-glow);
    border: 1px solid var(--amber-dim);
    border-radius: 10px;
    padding: 20px 24px;
    margin-top: 20px;
  }

  .reframe-insight p {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    font-style: italic;
    color: var(--amber);
    line-height: 1.6;
  }

  /* AI CONSULT */
  .ai-container {
    display: flex;
    flex-direction: column;
    max-height: 480px;
    min-height: 300px;
  }

  .ai-messages {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 4px 0 20px;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
    -webkit-overflow-scrolling: touch;
  }

  .message {
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }

  .message.user { flex-direction: row-reverse; }

  .message-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--amber-glow);
    border: 1px solid var(--amber-dim);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    flex-shrink: 0;
  }

  .message.user .message-avatar {
    background: var(--surface2);
    border-color: var(--border);
  }

  .message-bubble {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px 18px;
    font-size: 14px;
    line-height: 1.7;
    max-width: 80%;
    color: var(--text);
  }

  .message.user .message-bubble {
    background: var(--surface2);
  }

  .ai-input-row {
    display: flex;
    gap: 10px;
    padding-top: 16px;
    border-top: 1px solid var(--border);
    align-items: flex-end;
    position: relative;
  }

  .ai-input {
    flex: 1;
    width: 100%;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 12px 16px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    transition: border-color 0.2s;
    min-height: 80px;
    max-height: 160px;
    resize: none;
    line-height: 1.5;
  }

  .ai-input:focus { outline: none; border-color: var(--amber); }

  .btn-send {
    padding: 12px 20px;
    background: var(--amber);
    color: #0e0f11;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }

  .btn-send:hover { background: var(--amber); filter: brightness(1.15); }
  .btn-send:disabled { opacity: 0.5; cursor: not-allowed; }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  @keyframes entrain60 {
    0%, 100% { opacity: 0.85; }
    50% { opacity: 1; }
  }

  @keyframes entrain60glow {
    0%, 100% { box-shadow: 0 0 0 rgba(201,147,58,0); }
    50% { box-shadow: 0 0 18px rgba(201,147,58,0.08); }
  }

  @keyframes deltaFlash {
    0% { opacity: 0; transform: scale(0.8); }
    40% { opacity: 1; transform: scale(1.08); }
    100% { opacity: 1; transform: scale(1); }
  }

  @keyframes deltaGlow {
    0% { text-shadow: 0 0 0 rgba(201,147,58,0); }
    50% { text-shadow: 0 0 28px rgba(201,147,58,0.5); }
    100% { text-shadow: 0 0 12px rgba(201,147,58,0.2); }
  }

  @keyframes uatBannerFlash {
    0%, 100% {
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.03), 0 0 0 rgba(201,147,58,0);
      border-color: var(--amber-dim);
    }
    50% {
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.03), 0 0 18px rgba(201,147,58,0.18);
      border-color: var(--amber);
    }
  }

  /* BODY SCAN */
  .scan-body {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .scan-area {
    background: var(--surface);
    border: 0.5px solid var(--border);
    border-radius: var(--r);
    padding: 12px 16px;
    transition: all 0.25s ease-out;
    cursor: pointer;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.025);
  }

  .scan-area.active {
    border-color: var(--amber);
    background: var(--amber-glow);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.03), 0 0 0 1px var(--amber-dim);
  }

  .scan-area.done {
    border-color: var(--amber-dim);
    opacity: 0.45;
  }

  .scan-area-name {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: var(--text-dim);
    transition: color 0.25s;
    margin-bottom: 3px;
  }

  .scan-area.active .scan-area-name {
    color: var(--amber);
    font-weight: 500;
  }

  .scan-area.done .scan-area-name {
    color: var(--text-muted);
  }

  .scan-area-prompt {
    font-size: 12px;
    color: var(--text-muted);
    line-height: 1.5;
  }

  .tension-bar {
    display: flex;
    gap: 4px;
    margin-top: 12px;
  }

  .tension-dot {
    flex: 1;
    height: 4px;
    border-radius: 2px;
    background: var(--border);
    cursor: pointer;
    transition: background 0.2s;
  }

  .tension-dot.active { background: var(--amber); }

  /* PROGRESS / COMPLETE */
  .complete {
    text-align: center;
    padding: 48px 20px;
  }

  .complete-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--amber-glow);
    border: 0.5px solid var(--amber);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 20px;
    color: var(--amber);
    margin: 0 auto 28px;
    box-shadow: 0 0 24px rgba(200,146,42,0.08);
  }

  .complete h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 42px;
    font-weight: 300;
    margin-bottom: 8px;
  }

  .complete p {
    color: var(--text-dim);
    font-size: 14px;
    line-height: 1.7;
    max-width: 400px;
    margin: 0 auto 8px;
  }

  .complete-data {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 28px;
  }

  /* PRICING */
  .pricing {
    max-width: 800px;
    margin: 0 auto;
    padding: 60px 40px 80px;
    position: relative;
    z-index: 1;
  }

  .pricing-header {
    text-align: center;
    margin-bottom: 48px;
  }

  .pricing-header h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 42px;
    font-weight: 300;
    margin-bottom: 10px;
  }

  .pricing-header p { color: var(--text-dim); font-size: 15px; }

  .pricing-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  @media (max-width: 560px) { .pricing-cards { grid-template-columns: 1fr; } }

  .pricing-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 32px;
    position: relative;
  }

  .pricing-card.featured {
    border-color: var(--amber);
    background: linear-gradient(160deg, rgba(201,147,58,0.06) 0%, var(--surface) 100%);
  }

  .pricing-badge {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--amber);
    color: #0e0f11;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 4px 14px;
    border-radius: 100px;
  }

  .pricing-period { font-size: 12px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }

  .pricing-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 52px;
    font-weight: 300;
    color: var(--text);
    line-height: 1;
    margin-bottom: 4px;
  }

  .pricing-price sup { font-size: 22px; vertical-align: super; }

  .pricing-save { font-size: 12px; color: var(--amber); margin-bottom: 28px; }

  .pricing-features { list-style: none; margin-bottom: 28px; }

  .pricing-features li {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: var(--text-dim);
    padding: 6px 0;
    border-bottom: 1px solid var(--border);
  }

  .pricing-features li:last-child { border-bottom: none; }
  .pricing-features li::before { content: '—'; color: var(--amber); font-size: 11px; }

  /* PRIVACY */
  .privacy {
    max-width: 700px;
    margin: 0 auto;
    padding: 60px 40px 80px;
    position: relative;
    z-index: 1;
  }

  .privacy h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 42px;
    font-weight: 300;
    margin-bottom: 8px;
  }

  .privacy-date { color: var(--text-dim); font-size: 13px; margin-bottom: 40px; }

  .privacy h2 {
    font-size: 16px;
    font-weight: 500;
    margin: 32px 0 12px;
    color: var(--amber);
  }

  .privacy p { font-size: 14px; color: var(--text-dim); line-height: 1.8; margin-bottom: 16px; }

  /* FOOTER */
  .footer {
    border-top: 1px solid var(--border);
    padding: 32px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: gap;
    position: relative;
    z-index: 1;
  }

  .footer-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    font-weight: 300;
    letter-spacing: 0.1em;
    color: var(--text-dim);
  }

  .footer-links {
    display: flex;
    gap: 24px;
  }

  .footer-links button {
    background: none;
    border: none;
    color: var(--text-dim);
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    cursor: pointer;
    transition: color 0.2s;
    letter-spacing: 0.06em;
  }

  .footer-links button:hover { color: var(--amber); }

  .footer-copy { color: var(--text-dim); font-size: 12px; }

  /* DISCLAIMER */
  .disclaimer {
    background: var(--surface);
    border: 1px solid var(--border);
    border-left: 3px solid var(--amber-dim);
    border-radius: 6px;
    padding: 12px 16px;
    font-size: 12px;
    color: var(--text-dim);
    line-height: 1.6;
    margin-bottom: 16px;
  }

  @media (max-width: 640px) {
    .nav { padding: 20px 24px; }
    .home { padding: 40px 24px; }
    .tools { padding: 32px 24px 60px; }
    .intervention { padding: 32px 28px 60px; }
    .pricing { padding: 40px 24px 60px; }
    .privacy { padding: 40px 24px 60px; }
    .footer { padding: 24px; flex-direction: column; gap: 16px; text-align: center; }
    .footer-links { flex-wrap: wrap; justify-content: center; }
    .home-title { font-size: 42px; }
  }

  /* PANIC BUTTON */
  .panic-btn {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    background: radial-gradient(circle at 40% 35%, #1e1408, #0e0a04);
    border: 2px solid var(--amber-dim);
    color: var(--amber);
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    font-weight: 400;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    line-height: 1.4;
    padding: 24px;
    margin-bottom: 16px;
    box-shadow: 0 0 40px rgba(201,147,58,0.08), inset 0 0 30px rgba(201,147,58,0.04);
    transition: all 0.3s ease;
    -webkit-tap-highlight-color: transparent;
  }

  .panic-btn:hover {
    box-shadow: 0 0 60px rgba(201,147,58,0.15), inset 0 0 40px rgba(201,147,58,0.06);
    border-color: var(--amber);
    transform: scale(1.03);
  }

  .panic-btn:active {
    transform: scale(0.97);
  }

  .panic-btn-text {
    letter-spacing: 0.04em;
  }

  /* PANIC MODE */
  .panic-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 73px);
    padding: 40px 24px;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  .panic-instruction {
    font-size: 15px;
    font-style: italic;
    color: var(--text-dim);
    letter-spacing: 0.06em;
    margin-bottom: 48px;
    opacity: 0;
    animation: panicFadeIn 1.5s ease 0.5s forwards;
  }

  @keyframes panicFadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .panic-circle-wrap {
    width: 220px;
    height: 220px;
    margin-bottom: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .panic-circle {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,147,58,0.10) 0%, rgba(201,147,58,0.02) 60%, transparent 100%);
    border: 1px solid var(--amber-dim);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.8s ease-in-out, box-shadow 0.8s ease-in-out;
  }

  .panic-phase {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 300;
    color: var(--amber);
    letter-spacing: 0.08em;
  }

  .panic-counter {
    font-size: 12px;
    color: var(--text-muted);
    letter-spacing: 0.1em;
  }

  .panic-done {
    animation: panicFadeIn 0.8s ease forwards;
  }

  .panic-done-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    font-weight: 300;
    font-style: italic;
    color: var(--text-dim);
    max-width: 280px;
    line-height: 1.6;
    margin-bottom: 32px;
  }

  /* Screen-light mode overlay */
  .screenlight-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.92);
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }
  .screenlight-overlay * { pointer-events: auto; }
  .screenlight-active .breath-circle { opacity: 0.3; }
  .screenlight-active .panic-phase { font-size: 24px; }
  .screenlight-active .panic-counter { opacity: 0.2; }

  /* Reduced motion */
  .reduced-motion .breath-circle { transition: none !important; animation: none !important; }
  .reduced-motion .scan-area { transition: none !important; }
`;

const TOOLS = [
  {
    id: "breathe",
    icon: "◎",
    name: "Breathe",
    desc: "Use breath to steady the system so clear thought is easier to access.",
    time: "3 min"
  },
  {
    id: "scan",
    icon: "◉",
    name: "Body Scan",
    desc: "Read where your system is carrying the signal, then work with it through focused acupressure.",
    time: "10 min"
  },
  {
    id: "reframe",
    icon: "✦",
    name: "Reframe",
    desc: "Clarify the story your mind is building so you can respond from discernment, not momentum.",
    time: "Open"
  },
  {
    id: "metacognition",
    icon: "✦",
    name: "Observe and Choose",
    desc: "Step out of the state, see what your system is doing clearly, and choose your next move deliberately.",
    time: "5 min"
  },
  {
    id: "signals",
    icon: "◇",
    name: "Map Your Signals",
    desc: "Learn where your body warns you first. Build your personal signal profile.",
    time: "2 min",
    level: 2
  },
  {
    id: "bias",
    icon: "⬡",
    name: "Pattern Check",
    desc: "Spot recurring interpretation patterns so you can choose with more clarity.",
    time: "2 min",
    level: 3
  }
];

// Quick post-session journal note
// Haptic feedback utility — sharp click for phase changes, heavy thud for completion
// ─── NATIVE INTEGRATIONS ─────────────────────────────────────────────────────
// Capacitor plugins — gracefully fall back to web APIs if not in native context
const isNative = () => {
  try { return !!(window?.Capacitor?.isNativePlatform?.()); } catch { return false; }
};

// Watch bridge — send breathing pattern to connected Wear OS watch
const watchBridge = {
  async startBreathing(pattern = "quick") {
    if (!isNative()) return;
    try {
      const { Capacitor } = await import('@capacitor/core');
      const WatchBridge = Capacitor.Plugins.WatchBridge;
      if (WatchBridge) await WatchBridge.startBreathing({ pattern });
    } catch {}
  }
};

const haptic = {
  tick: async () => {
    try {
      if (isNative()) {
        const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
        await Haptics.impact({ style: ImpactStyle.Light });
      } else {
        navigator.vibrate?.([8]);
      }
    } catch { try { navigator.vibrate?.([8]); } catch {} }
  },
  complete: async () => {
    try {
      if (isNative()) {
        const { Haptics, NotificationType } = await import('@capacitor/haptics');
        await Haptics.notification({ type: NotificationType.Success });
      } else {
        navigator.vibrate?.([30, 20, 60]);
      }
    } catch { try { navigator.vibrate?.([30, 20, 60]); } catch {} }
  },
  heavy: async () => {
    try {
      if (isNative()) {
        const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
        await Haptics.impact({ style: ImpactStyle.Heavy });
      } else {
        navigator.vibrate?.([60]);
      }
    } catch {}
  }
};

// Push notification setup — runs once on app load in native context
// Biometric lock — Face ID / fingerprint gate for Reframe & Pulse
const biometric = {
  async isAvailable() {
    if (!isNative()) return false;
    try {
      const { BiometricAuth } = await import('@aparajita/capacitor-biometric-auth');
      const result = await BiometricAuth.checkBiometry();
      return result.isAvailable;
    } catch { return false; }
  },
  async getLabel() {
    if (!isNative()) return 'Biometric Lock';
    try {
      const { BiometricAuth, BiometryType } = await import('@aparajita/capacitor-biometric-auth');
      const result = await BiometricAuth.checkBiometry();
      const labels = {
        [BiometryType.touchId]: 'Touch ID', [BiometryType.faceId]: 'Face ID',
        [BiometryType.fingerprintAuthentication]: 'Fingerprint', [BiometryType.faceAuthentication]: 'Face Unlock',
        [BiometryType.irisAuthentication]: 'Iris'
      };
      return labels[result.biometryType] || 'Biometric Lock';
    } catch { return 'Biometric Lock'; }
  },
  async authenticate() {
    try {
      const { BiometricAuth } = await import('@aparajita/capacitor-biometric-auth');
      await BiometricAuth.authenticate({
        reason: 'Unlock to access protected data',
        cancelTitle: 'Cancel',
        allowDeviceCredential: true,
      });
      return true;
    } catch { return false; }
  },
  isEnabled() { try { return localStorage.getItem('stillform_biometric_enabled') === 'yes'; } catch { return false; } },
  setEnabled(v) { try { localStorage.setItem('stillform_biometric_enabled', v ? 'yes' : 'no'); } catch {} },
  async gate() { if (!this.isEnabled()) return true; return this.authenticate(); },
};

const NETLIFY_BASE = (() => {
  try {
    return window?.Capacitor?.isNativePlatform?.()
      ? "https://stillformapp.com"
      : "";
  } catch { return ""; }
})();

const REFRAME_API_URL = (() => {
  try {
    const isNativePlatform = window?.Capacitor?.isNativePlatform?.();
    return isNativePlatform
      ? "https://stillformapp.com/.netlify/functions/reframe"
      : "/.netlify/functions/reframe";
  } catch {
    return "/.netlify/functions/reframe";
  }
})();

const setupPushNotifications = async () => {
  if (!isNative()) return;
  try {
    const { PushNotifications } = await import('@capacitor/push-notifications');
    // Check existing permission first — never prompt if already granted or denied
    const existing = await PushNotifications.checkPermissions();
    if (existing.receive === 'denied') return; // user said no, don't ask again
    const permission = existing.receive === 'granted'
      ? existing
      : await PushNotifications.requestPermissions();
    if (permission.receive === 'granted') {
      await PushNotifications.register();
      PushNotifications.addListener('registration', token => {
        try { localStorage.setItem('stillform_push_token', token.value); } catch {}
      });
      PushNotifications.addListener('pushNotificationReceived', notification => {

      });
      PushNotifications.addListener('pushNotificationActionPerformed', action => {

      });
    }
  } catch {}
};

// Local notification scheduler — for user-configured reminders
const scheduleReminder = async (title, body, hour, minute) => {
  try {
    if (isNative()) {
      const { LocalNotifications } = await import('@capacitor/local-notifications');
      const perm = await LocalNotifications.requestPermissions();
      if (perm.display === 'granted') {
        const now = new Date();
        const scheduled = new Date();
        scheduled.setHours(hour, minute, 0, 0);
        if (scheduled <= now) scheduled.setDate(scheduled.getDate() + 1);
        await LocalNotifications.schedule({
          notifications: [{
            id: Date.now(),
            title,
            body,
            schedule: { at: scheduled, repeats: true, every: 'day' }
          }]
        });
      }
    }
  } catch {}
};

const INTEGRATION_STORAGE_KEYS = {
  calendar: {
    consent: "stillform_calendar_consent",
    error: "stillform_calendar_error",
    retryAt: "stillform_calendar_retry_at",
    data: [
      "stillform_calendar_summary",
      "stillform_calendar_events",
      "stillform_calendar_updated_at"
    ]
  },
  health: {
    consent: "stillform_health_consent",
    error: "stillform_health_error",
    retryAt: "stillform_health_retry_at",
    data: [
      "stillform_health_summary",
      "stillform_health_snapshot",
      "stillform_health_updated_at"
    ]
  }
};

const LOOP_HISTORY_KEYS = {
  morningStart: "stillform_checkin_open_history",
  morning: "stillform_checkin_history",
  eodStart: "stillform_eod_open_history",
  eod: "stillform_eod_history"
};

const LOOP_HISTORY_MAX_ITEMS = 120;
const LOOP_NUDGE_MIN_OPENS = 3;
const LOOP_NUDGE_DROPOFF_THRESHOLD = 40;
const LOOP_NUDGE_MIN_OPENS_LOWER_BOUND = 2;
const LOOP_NUDGE_MIN_OPENS_UPPER_BOUND = 5;
const LOOP_NUDGE_DROPOFF_THRESHOLD_LOWER_BOUND = 25;
const LOOP_NUDGE_DROPOFF_THRESHOLD_UPPER_BOUND = 60;
const LOOP_NUDGE_DISMISSED_DAY_KEY = "stillform_loop_nudge_dismissed_day";
const LOOP_NUDGE_DISMISS_STREAK_KEY = "stillform_loop_nudge_dismiss_streak";
const LOOP_NUDGE_EVENTS_KEY = "stillform_loop_nudge_events";
const LOOP_NUDGE_EVENTS_MAX_ITEMS = 180;
const METRICS_OPT_IN_KEY = "stillform_metrics_opt_in";
const METRICS_LAST_SENT_DAY_KEY = "stillform_metrics_last_sent_day";
const METRICS_LAST_SENT_AT_KEY = "stillform_metrics_last_sent_at";
const METRICS_SCHEMA_VERSION = 1;
const SESSION_STORAGE_KEY = "stillform_sessions";
const COMMUNICATION_EVENTS_KEY = "stillform_communication_events";
const COMMUNICATION_EVENTS_MAX_ITEMS = 240;
const COMMUNICATION_EVENT_SCHEMA_VERSION = 2;
const COMMUNICATION_MEANINGFUL_WORDS_MIN = 6;
const COMMUNICATION_MEANINGFUL_CHARS_MIN = 40;
const NEXT_MOVE_FOLLOW_UP_DELAY_MS = 1000 * 60 * 60 * 2;
const NEXT_MOVE_ACTION_OPTIONS = [
  { id: "send-message", label: "Send message" },
  { id: "ask-clarifying-question", label: "Ask clarifying question" },
  { id: "hold-boundary", label: "Hold boundary" },
  { id: "delay-response", label: "Delay response" },
  { id: "custom", label: "Custom action" }
];
const NEXT_MOVE_ACTION_LABELS = NEXT_MOVE_ACTION_OPTIONS.reduce((acc, item) => {
  acc[item.id] = item.label;
  return acc;
}, {});
const TOOL_DEBRIEF_STORAGE_KEY = "stillform_tool_debriefs";
const TOOL_DEBRIEF_MAX_ITEMS = 320;
const UAT_TRIAL_FREEZE_UNTIL_ISO = "2026-05-10T23:59:59";
const UAT_BOARD_UPDATED_LABEL = "Updated Apr 15";
const UAT_BOARD_LAUNCH_ETA_LABEL = "May 10";
const UAT_FEEDBACK_TEXT_MIN = 8;
const UAT_FEEDBACK_TEXT_MAX = 1000;
const UAT_FEEDBACK_DRAFT_KEY = "stillform_uat_feedback_draft";
const UAT_FEEDBACK_HISTORY_KEY = "stillform_uat_feedback_history";
const UAT_FEEDBACK_HISTORY_MAX_ITEMS = 30;
const UAT_FEEDBACK_HISTORY_CLOUD_FETCH_MAX_ITEMS = 30;
const SHARE_QR_TARGET_URL = "https://stillformapp.com/#home";
const SHARE_QR_IMAGE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=480x480&data=${encodeURIComponent(SHARE_QR_TARGET_URL)}`;
const UAT_FEEDBACK_FLASH_LABEL = "UAT FEEDBACK";
const UAT_MODE_QUERY_PARAM = "uat";
const UAT_MODE_STORAGE_KEY = "stillform_uat_mode";
const UAT_QUESTION_OPTIONS = [
  { id: "confusing", prompt: "What felt confusing today?", placeholder: "Example: The button text was unclear." },
  { id: "friction", prompt: "What felt heavy or annoying?", placeholder: "Example: Too many taps to finish this step." },
  { id: "missing", prompt: "What should be clearer or easier?", placeholder: "Example: Add one line explaining why this tool exists." },
  { id: "working", prompt: "What worked well for you?", placeholder: "Example: The reframe flow felt direct and calm." }
];
const VALID_THEME_IDS = new Set(["dark", "midnight", "suede", "teal", "rose", "light"]);
const VALID_AI_TONE_IDS = new Set(["balanced", "gentle", "direct", "clinical", "motivational"]);
const TOOL_ENTRY_PRIMER_COPY = {
  "thought-first": {
    reframe: "Start with one concrete signal, then separate facts from story.",
    breathe: "Use breath first to cut cognitive noise before analysis.",
    scan: "Use body data to interrupt over-processing before you interpret."
  },
  "body-first": {
    reframe: "Name the body signal first, then translate it into language.",
    breathe: "Downshift physiology first; your cognition clears after the body settles.",
    scan: "Track where activation lives physically before deciding what it means."
  },
  balanced: {
    reframe: "Stabilize and label in sequence: signal first, then clear language.",
    breathe: "Use this as your reset gate before deciding your next move.",
    scan: "Map physical signals, then choose the smallest deliberate adjustment."
  }
};
const TOOL_DEBRIEF_COPY = {
  breathe: {
    prompt: "What shifted most during regulation?",
    "thought-first": [
      "My thinking slowed enough to choose one priority.",
      "I noticed drift early and redirected before spiraling.",
      "I can separate urgency from importance now."
    ],
    "body-first": [
      "My body settled before my thoughts changed.",
      "Breath lowered activation enough to stay deliberate.",
      "I can feel where tension releases first."
    ],
    balanced: [
      "My body and thinking aligned after this round.",
      "I can move from signal to decision with less friction.",
      "I recovered enough to act without rushing."
    ]
  },
  scan: {
    prompt: "What did the scan teach you about your pattern?",
    "thought-first": [
      "Body signals were clearer than my assumptions.",
      "Physical mapping reduced mental over-interpretation.",
      "I can use signal data before analysis now."
    ],
    "body-first": [
      "I identified exactly where activation concentrates first.",
      "Naming the region made regulation faster.",
      "My body gave usable information before language."
    ],
    balanced: [
      "The scan helped me synchronize body and meaning.",
      "I can map signal, then choose action more quickly.",
      "I caught escalation earlier than usual."
    ]
  },
  reframe: {
    prompt: "What processing move will you repeat next time?",
    "thought-first": [
      "I separated facts from story before reacting.",
      "I named a distortion and chose one next step.",
      "I can keep language precise under pressure."
    ],
    "body-first": [
      "I translated activation into clear words without flooding.",
      "I stayed grounded while naming what is true.",
      "I can convert signal into one clean action."
    ],
    balanced: [
      "I regulated first, then chose language deliberately.",
      "I held context without overexplaining.",
      "I can move from signal to statement with integrity."
    ]
  }
};

function toLocalDateKey(input = new Date()) {
  const dt = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(dt.getTime())) return toLocalDateKey(new Date());
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const THEME_PRESETS = {
  dark: {
    "--bg": "#0A0A0C",
    "--surface": "#141418",
    "--surface2": "#1A1A1F",
    "--border": "rgba(255,255,255,0.07)",
    "--border-hi": "rgba(255,255,255,0.12)",
    "--amber": "#C8922A",
    "--amber-dim": "rgba(200,146,42,0.25)",
    "--amber-glow": "rgba(200,146,42,0.07)",
    "--amber-20": "rgba(200,146,42,0.20)",
    "--text": "#E8EAF0",
    "--text-dim": "#9496A1",
    "--text-muted": "#95979f",
    "--green": "#4a8c6a",
    "--green-glow": "rgba(74,140,106,0.08)"
  },
  midnight: {
    "--bg": "#070b18",
    "--surface": "#0f1526",
    "--surface2": "#141d33",
    "--border": "rgba(200,220,255,0.20)",
    "--border-hi": "rgba(200,220,255,0.35)",
    "--amber": "#7aa8ff",
    "--amber-dim": "rgba(122,168,255,0.30)",
    "--amber-glow": "rgba(122,168,255,0.12)",
    "--amber-20": "rgba(122,168,255,0.20)",
    "--text": "#ffffff",
    "--text-dim": "#c8d8f0",
    "--text-muted": "#96aece",
    "--green": "#7abfa4",
    "--green-glow": "rgba(122,191,164,0.12)"
  },
  suede: {
    "--bg": "#000000",
    "--surface": "#1a1612",
    "--surface2": "#231e18",
    "--border": "rgba(255,255,255,0.12)",
    "--border-hi": "rgba(255,255,255,0.22)",
    "--amber": "#c9956a",
    "--amber-dim": "rgba(201,149,106,0.30)",
    "--amber-glow": "rgba(201,149,106,0.10)",
    "--amber-20": "rgba(201,149,106,0.18)",
    "--text": "#ffffff",
    "--text-dim": "#d4c4b0",
    "--text-muted": "#a89070",
    "--green": "#8aab8a",
    "--green-glow": "rgba(138,171,138,0.10)"
  },
  teal: {
    "--bg": "#000000",
    "--surface": "#0a1a1c",
    "--surface2": "#0f2224",
    "--border": "rgba(255,255,255,0.12)",
    "--border-hi": "rgba(255,255,255,0.22)",
    "--amber": "#3dbdb5",
    "--amber-dim": "rgba(61,189,181,0.30)",
    "--amber-glow": "rgba(61,189,181,0.10)",
    "--amber-20": "rgba(61,189,181,0.18)",
    "--text": "#ffffff",
    "--text-dim": "#b0ceca",
    "--text-muted": "#6aa8a2",
    "--green": "#3dbdb5",
    "--green-glow": "rgba(61,189,181,0.10)",
    "--btn-primary-text": "#031a1b"
  },
  rose: {
    "--bg": "#000000",
    "--surface": "#1a0f14",
    "--surface2": "#22141c",
    "--border": "rgba(255,255,255,0.12)",
    "--border-hi": "rgba(255,255,255,0.22)",
    "--amber": "#d4607e",
    "--amber-dim": "rgba(212,96,126,0.30)",
    "--amber-glow": "rgba(212,96,126,0.10)",
    "--amber-20": "rgba(212,96,126,0.18)",
    "--text": "#ffffff",
    "--text-dim": "#d4a8b8",
    "--text-muted": "#a06880",
    "--green": "#d4607e",
    "--green-glow": "rgba(212,96,126,0.10)",
    "--btn-primary-text": "#1a0810"
  },
  light: {
    "--bg": "#f0f2f8",
    "--surface": "#ffffff",
    "--surface2": "#e8ecf4",
    "--border": "rgba(16,24,40,0.18)",
    "--border-hi": "rgba(16,24,40,0.30)",
    "--amber": "#C8922A",
    "--amber-dim": "rgba(200,146,42,0.30)",
    "--amber-glow": "rgba(200,146,42,0.10)",
    "--amber-20": "rgba(200,146,42,0.20)",
    "--text": "#080c14",
    "--text-dim": "#2a2f3e",
    "--text-muted": "#464c60",
    "--green": "#2f7c59",
    "--green-glow": "rgba(47,124,89,0.12)",
  }
};

const HIGH_CONTRAST_OVERLAY = {
  "--bg": "#000000",
  "--surface": "#111114",
  "--surface2": "#18181c",
  "--text": "#ffffff",
  "--text-dim": "#dddddd",
  "--text-muted": "#aaaaaa",
  "--border": "rgba(255,255,255,0.45)",
  "--border-hi": "rgba(255,255,255,0.70)",
};

const HIGH_CONTRAST_OVERLAY_LIGHT = {
  "--bg": "#ffffff",
  "--surface": "#f0f0f0",
  "--surface2": "#e0e0e0",
  "--text": "#000000",
  "--text-dim": "#111111",
  "--text-muted": "#333333",
  "--border": "rgba(0,0,0,0.50)",
  "--border-hi": "rgba(0,0,0,0.75)",
};

const applyThemePreset = (themeId, highContrast = false) => {
  if (typeof document === "undefined") return;
  const preset = THEME_PRESETS[themeId] || THEME_PRESETS.dark;
  const root = document.documentElement;
  Object.entries(preset).forEach(([token, value]) => root.style.setProperty(token, value));
  if (highContrast) {
    const overlay = themeId === "light" ? HIGH_CONTRAST_OVERLAY_LIGHT : HIGH_CONTRAST_OVERLAY;
    Object.entries(overlay).forEach(([token, value]) => root.style.setProperty(token, value));
  }
};

const readArrayFromStorage = (key) => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getSessionsFromStorage = () => readArrayFromStorage(SESSION_STORAGE_KEY);

const setSessionsInStorage = (sessions) => {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(Array.isArray(sessions) ? sessions : []));
  } catch {}
};

const appendSessionToStorage = (entry) => {
  if (!entry) return getSessionCountFromStorage();
  const sessions = getSessionsFromStorage();
  sessions.push(entry);
  setSessionsInStorage(sessions);
  return sessions.length;
};

const appendCommunicationEvent = (entry, maxItems = COMMUNICATION_EVENTS_MAX_ITEMS) => {
  if (!entry) return 0;
  const events = readArrayFromStorage(COMMUNICATION_EVENTS_KEY);
  events.push(entry);
  const bounded = events.slice(-maxItems);
  try { localStorage.setItem(COMMUNICATION_EVENTS_KEY, JSON.stringify(bounded)); } catch {}
  return bounded.length;
};

const updateSessionByTimestamp = (sessionTimestamp, updater) => {
  if (!sessionTimestamp || typeof updater !== "function") return null;
  const sessions = getSessionsFromStorage();
  const index = sessions.findIndex((session) => session?.timestamp === sessionTimestamp);
  if (index < 0) return null;
  const current = sessions[index];
  const updated = updater(current);
  if (!updated || typeof updated !== "object") return null;
  sessions[index] = updated;
  setSessionsInStorage(sessions);
  return updated;
};

const saveSessionNextMove = (sessionTimestamp, nextMove) => {
  if (!sessionTimestamp || !nextMove || typeof nextMove !== "object") return null;
  return updateSessionByTimestamp(sessionTimestamp, (session) => {
    const actionId = String(nextMove.actionId || "").trim();
    if (!actionId) return session;
    const customText = String(nextMove.customText || "").trim().slice(0, 180);
    const fallbackLabel = NEXT_MOVE_ACTION_LABELS[actionId] || "Custom action";
    const label = String(nextMove.label || (actionId === "custom" ? customText : fallbackLabel)).trim() || fallbackLabel;
    const createdAt = String(nextMove.createdAt || new Date().toISOString());
    const dueAt = String(nextMove?.followUp?.dueAt || new Date(Date.now() + NEXT_MOVE_FOLLOW_UP_DELAY_MS).toISOString());
    return {
      ...session,
      nextMove: {
        id: String(nextMove.id || `nextmove_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`),
        actionId,
        label,
        customText: actionId === "custom" ? customText : null,
        createdAt,
        followUp: {
          status: "pending",
          dueAt,
          promptedAt: null,
          answeredAt: null,
          didIt: null,
          helped: null
        }
      }
    };
  });
};

const getNextMoveLabel = (nextMove) => {
  if (!nextMove || typeof nextMove !== "object") return "";
  const customText = String(nextMove.customText || "").trim();
  if (nextMove.actionId === "custom" && customText) return customText;
  const fallback = NEXT_MOVE_ACTION_LABELS[String(nextMove.actionId || "").trim()] || "";
  return String(nextMove.label || fallback).trim();
};

const getPendingNextMoveFollowUpSession = (sessions = getSessionsFromStorage()) => {
  const list = Array.isArray(sessions) ? sessions : [];
  const now = Date.now();
  for (let i = list.length - 1; i >= 0; i -= 1) {
    const session = list[i];
    if (!session || typeof session !== "object") continue;
    const nextMove = session?.nextMove;
    if (!nextMove || typeof nextMove !== "object") continue;
    const followUp = nextMove?.followUp || {};
    if (followUp?.status && followUp.status !== "pending") continue;
    const dueAtMs = new Date(followUp?.dueAt || 0).getTime();
    const dueAt = Number.isFinite(dueAtMs) ? dueAtMs : 0;
    if (dueAt > now) continue;
    const tools = Array.isArray(session?.tools) ? session.tools : [];
    const includesSupportedTool = tools.some((toolId) => {
      const normalized = normalizeSessionToolId(toolId);
      return normalized === "reframe" || normalized === "breathe" || normalized === "scan";
    });
    if (!includesSupportedTool) continue;
    return session;
  }
  return null;
};

const saveSessionNextMoveFollowUp = (sessionTimestamp, { didIt, helped } = {}) => {
  const didItCompleted = didIt === true;
  const didItDeferred = didIt === null;
  const didItRejected = didIt === false;
  if (!sessionTimestamp || (!didItCompleted && !didItDeferred && !didItRejected)) return null;
  return updateSessionByTimestamp(sessionTimestamp, (session) => {
    const existingNextMove = session?.nextMove;
    if (!existingNextMove || typeof existingNextMove !== "object") return session;
    const stamp = new Date().toISOString();
    const existingFollowUp = existingNextMove.followUp || {};
    if (didItDeferred) {
      return {
        ...session,
        nextMove: {
          ...existingNextMove,
          followUp: {
            ...existingFollowUp,
            status: "pending",
            dueAt: new Date(Date.now() + NEXT_MOVE_FOLLOW_UP_DELAY_MS).toISOString(),
            promptedAt: existingFollowUp.promptedAt || stamp,
            answeredAt: null,
            didIt: null,
            helped: null
          }
        }
      };
    }
    return {
      ...session,
      nextMove: {
        ...existingNextMove,
        followUp: {
          ...existingFollowUp,
          status: "answered",
          promptedAt: existingFollowUp.promptedAt || stamp,
          answeredAt: stamp,
          didIt: didItCompleted ? true : false,
          helped: didItCompleted && typeof helped === "boolean" ? helped : null
        }
      }
    };
  });
};

const getToolDebriefsFromStorage = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(TOOL_DEBRIEF_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((entry) => entry && typeof entry === "object") : [];
  } catch {
    return [];
  }
};

const appendToolDebriefToStorage = (entry, maxItems = TOOL_DEBRIEF_MAX_ITEMS) => {
  if (!entry) return getToolDebriefsFromStorage();
  const existing = getToolDebriefsFromStorage();
  const next = [entry, ...existing].slice(0, maxItems);
  try { localStorage.setItem(TOOL_DEBRIEF_STORAGE_KEY, JSON.stringify(next)); } catch {}
  return next;
};

const normalizeSessionToolId = (toolId) => {
  const id = String(toolId || "").trim().toLowerCase();
  if (!id) return null;
  if (id === "body-scan") return "scan";
  if (id === "ground" || id === "sigh") return "breathe";
  if (id === "metacognition") return "metacognition";
  return id;
};

const getPrimarySessionToolId = (session) => {
  const tools = Array.isArray(session?.tools) ? session.tools : [];
  for (const raw of tools) {
    const normalized = normalizeSessionToolId(raw);
    if (!normalized) continue;
    if (normalized === "reframe" || normalized === "breathe" || normalized === "scan") {
      return normalized;
    }
  }
  return null;
};

const getToolFamily = (normalizedToolId) => {
  if (normalizedToolId === "reframe") return "cognitive";
  if (normalizedToolId === "breathe" || normalizedToolId === "scan") return "somatic";
  return null;
};

const getToolEntryPrimer = (toolId, regulationType) => {
  const normalizedTool = toolId === "body-scan" ? "scan" : toolId;
  if (!["reframe", "breathe", "scan"].includes(normalizedTool)) return null;
  const normalizedType = regulationType === "thought-first" || regulationType === "body-first" ? regulationType : "balanced";
  return TOOL_ENTRY_PRIMER_COPY?.[normalizedType]?.[normalizedTool] || TOOL_ENTRY_PRIMER_COPY.balanced[normalizedTool] || null;
};

const getToolDebriefPromptSet = (toolId, regulationType) => {
  const normalizedTool = toolId === "body-scan" ? "scan" : toolId;
  const config = TOOL_DEBRIEF_COPY[normalizedTool] || TOOL_DEBRIEF_COPY.reframe;
  const normalizedType = regulationType === "thought-first" || regulationType === "body-first" ? regulationType : "balanced";
  return {
    prompt: config.prompt,
    options: Array.isArray(config[normalizedType]) && config[normalizedType].length
      ? config[normalizedType]
      : config.balanced
  };
};

const getCommunicationDraftSignals = (value) => {
  const text = String(value || "").trim();
  const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const textLength = text.length;
  const meaningful = textLength >= COMMUNICATION_MEANINGFUL_CHARS_MIN || wordCount >= COMMUNICATION_MEANINGFUL_WORDS_MIN;
  return { textLength, wordCount, meaningful };
};

const getUatFeedbackDraft = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(UAT_FEEDBACK_DRAFT_KEY) || "null");
    if (!parsed || typeof parsed !== "object") return { questionId: UAT_QUESTION_OPTIONS[0]?.id || "confusing", text: "" };
    const fallbackQuestionId = UAT_QUESTION_OPTIONS[0]?.id || "confusing";
    const questionId = UAT_QUESTION_OPTIONS.some((item) => item.id === parsed.questionId)
      ? parsed.questionId
      : fallbackQuestionId;
    const text = String(parsed.text || "").slice(0, UAT_FEEDBACK_TEXT_MAX);
    return { questionId, text };
  } catch {
    return { questionId: UAT_QUESTION_OPTIONS[0]?.id || "confusing", text: "" };
  }
};

const getUatFeedbackHistoryFromStorage = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(UAT_FEEDBACK_HISTORY_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((entry) => normalizeUatFeedbackHistoryEntry(entry))
      .filter(Boolean)
      .slice(0, UAT_FEEDBACK_HISTORY_MAX_ITEMS);
  } catch {
    return [];
  }
};

const normalizeUatFeedbackHistoryEntry = (entry) => {
  if (!entry || typeof entry !== "object") return null;
  const id = String(entry.id || "");
  const submittedAt = String(entry.submittedAt || entry.submitted_at || "");
  const questionId = String(entry.questionId || entry.question_id || "");
  const text = String(entry.text || entry.feedback_text || "");
  if (!submittedAt || !text) return null;
  return {
    id: id || `${submittedAt}_${questionId || "feedback"}`,
    submittedAt,
    questionId,
    text
  };
};

const mergeUatFeedbackHistoryEntries = (entries, maxItems = UAT_FEEDBACK_HISTORY_MAX_ITEMS) => {
  const byKey = new Map();
  for (const raw of Array.isArray(entries) ? entries : []) {
    const entry = normalizeUatFeedbackHistoryEntry(raw);
    if (!entry) continue;
    const dedupeKey = `${entry.id}|${entry.submittedAt}|${entry.questionId}|${entry.text}`;
    if (!byKey.has(dedupeKey)) byKey.set(dedupeKey, entry);
  }
  return [...byKey.values()]
    .sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime())
    .slice(0, maxItems);
};

const appendUatFeedbackHistory = (entry, maxItems = UAT_FEEDBACK_HISTORY_MAX_ITEMS) => {
  if (!entry) return getUatFeedbackHistoryFromStorage();
  const current = getUatFeedbackHistoryFromStorage();
  const next = mergeUatFeedbackHistoryEntries([
    normalizeUatFeedbackHistoryEntry(entry),
    ...current
  ], maxItems);
  try { localStorage.setItem(UAT_FEEDBACK_HISTORY_KEY, JSON.stringify(next)); } catch {}
  return next;
};

const getSessionCountFromStorage = () => getSessionsFromStorage().length;

const toDayKey = (value) => {
  if (!value) return null;
  try {
    const dt = new Date(value);
    if (Number.isNaN(dt.getTime())) return null;
    return dt.toISOString().slice(0, 10);
  } catch {
    return null;
  }
};

const withinDays = (value, days) => {
  if (!value) return false;
  try {
    const dt = new Date(value);
    if (Number.isNaN(dt.getTime())) return false;
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    return dt.getTime() >= cutoff;
  } catch {
    return false;
  }
};

const recentDaySet = (items, days = 14) => new Set(
  (Array.isArray(items) ? items : [])
    .filter((entry) => withinDays(entry?.date || entry?.timestamp, days))
    .map((entry) => toDayKey(entry?.date || entry?.timestamp))
    .filter(Boolean)
);

const toRate = (value) => {
  if (!Number.isFinite(value)) return null;
  const clamped = Math.max(0, Math.min(1, value));
  return Number(clamped.toFixed(4));
};

const buildPerformanceMetricsSnapshot = ({ appVersion, packageVersion, isSubscribed }) => {
  const sessions = readArrayFromStorage("stillform_sessions");
  const pulseEntries = readArrayFromStorage("stillform_journal");
  const savedReframes = readArrayFromStorage("stillform_saved_reframes");
  const morningOpenHistory = readArrayFromStorage(LOOP_HISTORY_KEYS.morningStart);
  const morningHistory = readArrayFromStorage(LOOP_HISTORY_KEYS.morning);
  const eodOpenHistory = readArrayFromStorage(LOOP_HISTORY_KEYS.eodStart);
  const eodHistory = readArrayFromStorage(LOOP_HISTORY_KEYS.eod);
  const loopNudgeEvents = readArrayFromStorage(LOOP_NUDGE_EVENTS_KEY);

  const ratedSessions = sessions.filter((session) => {
    const pre = Number(session?.preRating);
    const post = Number(session?.postRating);
    return Number.isFinite(pre) && Number.isFinite(post);
  });
  const avgDelta = ratedSessions.length
    ? Number((ratedSessions.reduce((sum, session) => (
      sum + (Number(session.postRating) - Number(session.preRating))
    ), 0) / ratedSessions.length).toFixed(4))
    : null;
  const positiveShiftRate = ratedSessions.length
    ? toRate(ratedSessions.filter((session) => (
      Number(session.postRating) - Number(session.preRating) > 0
    )).length / ratedSessions.length)
    : null;
  const protocolRunsTotal = sessions.filter((session) => (
    session?.entryMode && String(session.entryMode).startsWith("protocol-")
  )).length;
  const activeDaysTotal = new Set(
    sessions
      .map((session) => toDayKey(session?.timestamp))
      .filter(Boolean)
  ).size;
  const activeDays14d = new Set(
    sessions
      .filter((session) => withinDays(session?.timestamp, 14))
      .map((session) => toDayKey(session?.timestamp))
      .filter(Boolean)
  ).size;
  const toolUsage = {};
  sessions.forEach((session) => {
    const tools = Array.isArray(session?.tools) ? session.tools : [];
    tools.forEach((tool) => {
      const key = String(tool || "").trim().toLowerCase();
      if (!key) return;
      toolUsage[key] = (toolUsage[key] || 0) + 1;
    });
  });

  const morningOpen14dDays = recentDaySet(morningOpenHistory, 14);
  const morningDone14dDays = recentDaySet(morningHistory, 14);
  const eodOpen14dDays = recentDaySet(eodOpenHistory, 14);
  const eodDone14dDays = recentDaySet(eodHistory, 14);
  const morning14dCount = morningHistory.filter((entry) => withinDays(entry?.date || entry?.timestamp, 14)).length;
  const eod14dCount = eodHistory.filter((entry) => withinDays(entry?.date || entry?.timestamp, 14)).length;
  const loopCompletionRate14d = toRate((morning14dCount + eod14dCount) / (14 * 2));
  const morningCompletionRate14d = toRate(morning14dCount / 14);
  const eodCompletionRate14d = toRate(eod14dCount / 14);

  const loopNudgeShown14d = loopNudgeEvents.filter(
    (entry) => entry?.event === "shown" && withinDays(entry?.date || entry?.timestamp, 14)
  );
  const loopNudgeActioned14d = loopNudgeEvents.filter(
    (entry) => entry?.event === "actioned" && withinDays(entry?.date || entry?.timestamp, 14)
  );
  const loopNudgeDismissed14d = loopNudgeEvents.filter(
    (entry) => entry?.event === "dismissed" && withinDays(entry?.date || entry?.timestamp, 14)
  );
  const recoveredNudges14d = loopNudgeShown14d.filter((entry) => (
    entry?.type === "morning"
      ? morningDone14dDays.has(entry?.date)
      : eodDone14dDays.has(entry?.date)
  )).length;
  const nudgeRecoveryRate14d = loopNudgeShown14d.length
    ? toRate(recoveredNudges14d / loopNudgeShown14d.length)
    : null;

  return {
    schema_version: METRICS_SCHEMA_VERSION,
    generated_at: new Date().toISOString(),
    app_version: appVersion,
    package_version: packageVersion,
    sessions_total: sessions.length,
    rated_sessions: ratedSessions.length,
    avg_delta: avgDelta,
    positive_shift_rate: positiveShiftRate,
    active_days_total: activeDaysTotal,
    active_days_14d: activeDays14d,
    pulse_entries_total: pulseEntries.length,
    saved_reframes_total: savedReframes.length,
    protocol_runs_total: protocolRunsTotal,
    morning_completion_rate_14d: morningCompletionRate14d,
    eod_completion_rate_14d: eodCompletionRate14d,
    loop_completion_rate_14d: loopCompletionRate14d,
    nudge_shown_14d: loopNudgeShown14d.length,
    nudge_actioned_14d: loopNudgeActioned14d.length,
    nudge_dismissed_14d: loopNudgeDismissed14d.length,
    nudge_recovery_rate_14d: nudgeRecoveryRate14d,
    subscription_active_local: isSubscribed === true,
    tool_usage: toolUsage
  };
};

const appendDailyLoopHistory = (storageKey, entry, maxItems = 120) => {
  try {
    const current = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const base = Array.isArray(current) ? current.filter((item) => item?.date !== entry?.date) : [];
    base.push(entry);
    const trimmed = base.slice(-maxItems);
    localStorage.setItem(storageKey, JSON.stringify(trimmed));
  } catch {}
};

const trackMorningStart = (entry) => appendDailyLoopHistory(LOOP_HISTORY_KEYS.morningStart, entry, LOOP_HISTORY_MAX_ITEMS);
const trackMorningComplete = (entry) => appendDailyLoopHistory(LOOP_HISTORY_KEYS.morning, entry, LOOP_HISTORY_MAX_ITEMS);
const trackEodStart = (entry) => appendDailyLoopHistory(LOOP_HISTORY_KEYS.eodStart, entry, LOOP_HISTORY_MAX_ITEMS);
const trackEodComplete = (entry) => appendDailyLoopHistory(LOOP_HISTORY_KEYS.eod, entry, LOOP_HISTORY_MAX_ITEMS);

const appendLoopNudgeEvent = (entry, maxItems = LOOP_NUDGE_EVENTS_MAX_ITEMS) => {
  try {
    const current = JSON.parse(localStorage.getItem(LOOP_NUDGE_EVENTS_KEY) || "[]");
    const list = Array.isArray(current) ? current : [];
    const exists = list.some((item) => (
      item?.event === entry?.event &&
      item?.type === entry?.type &&
      item?.date === entry?.date
    ));
    if (exists) return false;
    const next = [...list, entry].slice(-maxItems);
    localStorage.setItem(LOOP_NUDGE_EVENTS_KEY, JSON.stringify(next));
    return true;
  } catch {
    return false;
  }
};

const trackLoopNudgeTelemetry = (eventName, payload) => {
  try {
    window.plausible(eventName, { props: payload });
  } catch {}
};

const EMPTY_INTEGRATION_CONTEXT = Object.freeze({
  calendar: null,
  health: null,
  calendarConsent: "pending",
  healthConsent: "pending",
  calendarError: null,
  healthError: null,
  calendarLastRetryAt: null,
  healthLastRetryAt: null,
  calendarContext: null,
  healthContext: null,
  upcomingPressure: null,
  hasAny: false,
  hasStale: false,
  calendarSource: null,
  healthSource: null,
  calendarFreshness: null,
  healthFreshness: null
});

// Integration context adapter
// Single source of truth for calendar/health context across the app.
const getIntegrationContext = () => {
  const readConsent = (key) => {
    try {
      const v = localStorage.getItem(key);
      return (v === "granted" || v === "revoked") ? v : "pending";
    } catch {
      return "pending";
    }
  };
  const readString = (key) => {
    try {
      return localStorage.getItem(key) || null;
    } catch {
      return null;
    }
  };
  const parseIsoTime = (v) => {
    if (!v) return null;
    try {
      const d = new Date(v);
      return Number.isNaN(d.getTime()) ? null : d;
    } catch {
      return null;
    }
  };
  const formatFreshness = (updatedAt) => {
    if (!updatedAt) return { label: "Unknown", stale: false };
    const ageMs = Date.now() - updatedAt.getTime();
    const ageHours = ageMs / (1000 * 60 * 60);
    if (ageHours <= 6) return { label: "Fresh", stale: false };
    if (ageHours <= 24) return { label: "Today", stale: false };
    if (ageHours <= 72) return { label: "Aging", stale: false };
    return { label: "Stale", stale: true };
  };
  const calendarConsent = readConsent(INTEGRATION_STORAGE_KEYS.calendar.consent);
  const healthConsent = readConsent(INTEGRATION_STORAGE_KEYS.health.consent);
  const calendarError = readString(INTEGRATION_STORAGE_KEYS.calendar.error);
  const healthError = readString(INTEGRATION_STORAGE_KEYS.health.error);
  const calendarLastRetryAt = parseIsoTime(readString(INTEGRATION_STORAGE_KEYS.calendar.retryAt));
  const healthLastRetryAt = parseIsoTime(readString(INTEGRATION_STORAGE_KEYS.health.retryAt));
  const calendar = (() => {
    try {
      if (calendarConsent === "revoked") return null;
      const summary = localStorage.getItem("stillform_calendar_summary");
      const events = JSON.parse(localStorage.getItem("stillform_calendar_events") || "[]");
      const next = Array.isArray(events) && events.length > 0 ? events[0] : null;
      const updatedAt = parseIsoTime(localStorage.getItem("stillform_calendar_updated_at") || next?.updatedAt || null);
      const freshness = formatFreshness(updatedAt);
      if (summary) {
        return {
          summary,
          source: "summary",
          updatedAt,
          freshness: freshness.label,
          stale: freshness.stale
        };
      }
      if (next?.title) {
        const when = next.start ? ` at ${next.start}` : "";
        return {
          summary: `Upcoming: ${next.title}${when}`,
          source: "event",
          updatedAt,
          freshness: freshness.label,
          stale: freshness.stale
        };
      }
      return null;
    } catch { return null; }
  })();

  const health = (() => {
    try {
      if (healthConsent === "revoked") return null;
      const summary = localStorage.getItem("stillform_health_summary");
      const snap = JSON.parse(localStorage.getItem("stillform_health_snapshot") || "null");
      const updatedAt = parseIsoTime(localStorage.getItem("stillform_health_updated_at") || snap?.updatedAt || null);
      const freshness = formatFreshness(updatedAt);
      if (summary) {
        return {
          summary,
          source: "summary",
          updatedAt,
          freshness: freshness.label,
          stale: freshness.stale
        };
      }
      if (!snap) return null;
      const parts = [];
      if (snap.sleepHours != null) parts.push(`${snap.sleepHours}h sleep`);
      if (snap.hrv != null) parts.push(`HRV ${snap.hrv}`);
      if (snap.restingHr != null) parts.push(`resting HR ${snap.restingHr}`);
      if (snap.readiness) parts.push(`readiness ${snap.readiness}`);
      if (!parts.length) return null;
      return {
        summary: parts.join(", "),
        source: "snapshot",
        updatedAt,
        freshness: freshness.label,
        stale: freshness.stale
      };
    } catch { return null; }
  })();

  const calendarContext = (() => {
    if (!calendar?.summary) return null;
    if (calendar.stale) return `STALE CALENDAR CONTEXT: ${calendar.summary}`;
    return `CALENDAR CONTEXT: ${calendar.summary}`;
  })();
  const healthContext = (() => {
    if (!health?.summary) return null;
    if (health.stale) return `STALE HEALTH CONTEXT: ${health.summary}`;
    return `HEALTH CONTEXT: ${health.summary}`;
  })();

  return {
    calendar,
    health,
    calendarConsent,
    healthConsent,
    calendarError,
    healthError,
    calendarLastRetryAt,
    healthLastRetryAt,
    calendarContext,
    healthContext,
    upcomingPressure: calendar && !calendar.stale ? calendar.summary : null,
    hasAny: !!(calendar || health),
    hasStale: !!(calendar?.stale || health?.stale),
    calendarSource: calendar?.source || null,
    healthSource: health?.source || null,
    calendarFreshness: calendar?.freshness || null,
    healthFreshness: health?.freshness || null
  };
};

// Defensive resolver used at call sites so integration context remains safe
// even if local storage, parsing, or future adapter changes regress.
const resolveIntegrationContext = () => {
  try {
    const ctx = getIntegrationContext();
    if (!ctx || typeof ctx !== "object") return { ...EMPTY_INTEGRATION_CONTEXT };
    return {
      ...EMPTY_INTEGRATION_CONTEXT,
      ...ctx
    };
  } catch {
    return { ...EMPTY_INTEGRATION_CONTEXT };
  }
};

const setPendingSessionEntryContext = (entryMode, entryProtocolId) => {
  try {
    const payload = {
      entryMode: entryMode || null,
      entryProtocolId: entryProtocolId || null,
      createdAt: Date.now()
    };
    localStorage.setItem("stillform_session_entry_context", JSON.stringify(payload));
  } catch {}
};

const consumePendingSessionEntryContext = (maxAgeMs = 2 * 60 * 60 * 1000) => {
  try {
    const raw = localStorage.getItem("stillform_session_entry_context");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    localStorage.removeItem("stillform_session_entry_context");
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.createdAt || (Date.now() - Number(parsed.createdAt)) > maxAgeMs) return null;
    return {
      entryMode: parsed.entryMode || null,
      entryProtocolId: parsed.entryProtocolId || null
    };
  } catch {
    try { localStorage.removeItem("stillform_session_entry_context"); } catch {}
    return null;
  }
};

const launchScenarioProtocolById = async ({
  protocolId,
  setPathway,
  setActiveTool,
  setScreen,
  gateBiometric
}) => {
  const id = String(protocolId || "");
  const setEntry = (mode, protocol) => {
    setPendingSessionEntryContext(mode, protocol);
    try {
      localStorage.setItem("stillform_reframe_entry_mode", mode);
      localStorage.setItem("stillform_reframe_entry_protocol", protocol);
    } catch {}
  };

  // Reframe clarity path
  if (id === "hard-conversation") {
    if (gateBiometric && !(await gateBiometric())) return false;
    setPathway("clarity");
    setEntry("protocol-clarity", id);
    setActiveTool({ id: "reframe", name: "Reframe", mode: "clarity" });
    setScreen("tool");
    return true;
  }
  // Body-first reset
  if (id === "physiological-spike") {
    setPathway("calm");
    setPendingSessionEntryContext("protocol-body-reset", id);
    setActiveTool({ id: "breathe", quickStart: true });
    setScreen("tool");
    return true;
  }
  // Reframe hype path
  if (id === "winning-locked-in") {
    if (gateBiometric && !(await gateBiometric())) return false;
    setPathway("hype");
    setEntry("protocol-hype", id);
    setActiveTool({ id: "reframe", name: "Reframe", mode: "hype" });
    setScreen("tool");
    return true;
  }
  // Conflict reset
  if (id === "after-conflict-reset") {
    setPathway("calm");
    setPendingSessionEntryContext("protocol-body-scan", id);
    setActiveTool({ id: "scan", name: "Body Scan" });
    setScreen("tool");
    return true;
  }
  return false;
};




// Check display preferences
function useDisplayPrefs() {
  const screenLight = (() => { try { return localStorage.getItem("stillform_screenlight") === "on"; } catch { return false; } })();
  const reducedMotion = (() => { try { return localStorage.getItem("stillform_reducedmotion") === "on"; } catch { return false; } })();
  return { screenLight, reducedMotion };
}

function PhysiologicalSighTool({ onComplete }) {
  const totalReps = 3;
  const [rep, setRep] = useState(1);
  const [phase, setPhase] = useState("inhale1");
  const [count, setCount] = useState(2);
  const [running, setRunning] = useState(false);
  const contextEntryRef = useRef(consumePendingSessionEntryContext());

  // TIME-TO-REGULATION
  const startTime = useRef(Date.now());
  const saveSession = () => {
    const elapsed = Date.now() - startTime.current;
    const fmt = (ms) => { const s = Math.round(ms / 1000); const m = Math.floor(s / 60); return m > 0 ? `${m}m ${s % 60}s` : `${s % 60}s`; };
    try {
      const ctx = contextEntryRef.current || {};
      appendSessionToStorage({
        timestamp: new Date().toISOString(),
        duration: elapsed,
        durationFormatted: fmt(elapsed),
        tools: ["sigh"],
        exitPoint: "sigh-complete",
        source: "sigh",
        entryMode: ctx.entryMode || null,
        entryProtocolId: ctx.entryProtocolId || null
      });
      try { window.plausible("Breathing Completed", { props: { duration: fmt(elapsed) } }); } catch {}
    } catch {}
    return elapsed;
  };

  const phases = {
    inhale1: { label: "Inhale", sub: "In through your nose.", next: "inhale2", duration: 2 },
    inhale2: { label: "Inhale again", sub: "One more. Top it off.", next: "exhale", duration: 2 },
    exhale: { label: "Exhale slowly", sub: "Out through your mouth. Slow. All of it.", next: "rest", duration: 6 },
    rest: { label: "Rest", sub: "Rest.", next: null, duration: 2 }
  };

  useEffect(() => {
    if (!running) return;
    if (count === 0) {
      const current = phases[phase];
      if (current.next) {
        setPhase(current.next);
        setCount(phases[current.next].duration);
      } else {
        // Completed a rep
        if (rep < totalReps) {
          setRep(r => r + 1);
          setPhase("inhale1");
          setCount(phases.inhale1.duration);
        } else {
          setRunning(false);
          setPhase("done");
        }
      }
    } else {
      const t = setTimeout(() => setCount(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [count, running, phase, rep]);

  const sighSavedRef = useRef(false);
  const sighElapsedRef = useRef(0);
  if (phase === "done") {
    if (!sighSavedRef.current) { sighSavedRef.current = true; sighElapsedRef.current = saveSession(); }
    const elapsed = sighElapsedRef.current;
    const fmt = (ms) => { const s = Math.round(ms / 1000); const m = Math.floor(s / 60); return m > 0 ? `${m}m ${s % 60}s` : `${s % 60}s`; };
    const count = getSessionCountFromStorage();
    return (
      <div className="complete">
        <div className="complete-icon">✓</div>
        <h2>Reset complete.</h2>
        <p style={{ marginBottom: 8 }}>Three deep sighs. Your head is clearer than it was {fmt(elapsed)} ago.</p>
        {count > 1 && <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>Session #{count}.</div>}
        <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => onComplete("reframe")}>
          Talk through what's happening →
        </button>
        <button className="btn btn-ghost" style={{ marginTop: 10, width: "100%" }} onClick={onComplete}>
          Done
        </button>
        
      </div>
    );
  }

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 4 }}>
          Physiological sigh
        </div>
        <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
          {rep} of {totalReps}
        </div>
      </div>

      <div className="breath-container">
        <div className="breath-circle-wrap">
          <svg className="breath-svg-ring" viewBox="0 0 280 280">
            <g stroke="rgba(255,255,255,0.06)" strokeWidth="1" transform="rotate(90 140 140)">
              <line x1="140" y1="5" x2="140" y2="18"/>
              <line x1="275" y1="140" x2="262" y2="140"/>
              <line x1="140" y1="275" x2="140" y2="262"/>
              <line x1="5" y1="140" x2="18" y2="140"/>
            </g>
            <g stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" transform="rotate(90 140 140)">
              {[30,60,120,150,210,240,300,330].map(deg => {
                const rad = (deg * Math.PI) / 180;
                return <line key={deg} x1={140 + 131*Math.cos(rad)} y1={140 + 131*Math.sin(rad)} x2={140 + 122*Math.cos(rad)} y2={140 + 122*Math.sin(rad)}/>;
              })}
            </g>
            <circle className="breath-ring-track" cx="140" cy="140" r="125"/>
            <circle
              className="breath-ring-arc"
              cx="140" cy="140" r="125"
              style={{
                strokeDasharray: 785,
                strokeDashoffset: phase === "exhale" ? 785 : phase === "rest" ? 196 : 0,
                '--breath-duration': `${phases[phase]?.duration || 2}s`
              }}
            />
            <circle cx="140" cy="140" r="106" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5"/>
          </svg>
          <div className="breath-inner">
            <span className="breath-count">{count}</span>
            <span className="breath-phase">{phases[phase]?.label}</span>
          </div>
        </div>

        {running && phase !== "done" ? (
          <>
            <div className="breath-instruction">{phases[phase]?.sub}</div>
            <div style={{ height: 32 }} />
          </>
        ) : (
          <>
            <div className="breath-instruction" style={{ marginBottom: 24 }}>
              The fastest way to reset your nervous system. Three times.
            </div>
            <button
              className="btn btn-primary"
              style={{ fontSize: 16, padding: "14px 40px" }}
              onClick={() => { setRunning(true); }}
            >
              Begin
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const BREATHING_PATTERNS = [
  { id: "quick", name: "Quick Reset", desc: "60 seconds. Slows your system down fast.", phases: [
    { name: "Inhale", duration: 4, instruction: "In through your nose." },
    { name: "Hold", duration: 4, instruction: "Hold." },
    { name: "Exhale", duration: 6, instruction: "Out through your mouth." }
  ]},
  { id: "deep", name: "Deep Regulate", desc: "3 minutes. Deeper reset. Extended exhale.", phases: [
    { name: "Inhale", duration: 4, instruction: "In through your nose." },
    { name: "Hold", duration: 4, instruction: "Hold." },
    { name: "Exhale", duration: 8, instruction: "Out through your mouth. Long and slow." },
    { name: "Rest", duration: 2, instruction: "Rest." }
  ]}
];

function BreatheGroundTool({ onComplete, pathway, quickStart = false }) {
  const [phase, setPhase] = useState(quickStart ? "breathe" : "pre-rate"); // pre-rate | breathe | ground | post-rate | done
  const [preRating, setPreRating] = useState(null);
  const [postRating, setPostRating] = useState(null);
  const [bioFilter, setBioFilter] = useState(null);
  const contextEntryRef = useRef(consumePendingSessionEntryContext());
  const [debriefTarget, setDebriefTarget] = useState(null);
  const [nextMoveTarget, setNextMoveTarget] = useState(null);
  const regulationType = (() => {
    try {
      const value = localStorage.getItem("stillform_regulation_type");
      return value === "thought-first" || value === "body-first" ? value : "balanced";
    } catch {
      return "balanced";
    }
  })();

  // TIME-TO-REGULATION
  const startTime = useRef(Date.now());
  const latestSessionTimestampRef = useRef(null);
  const formatTime = (ms) => {
    const totalSec = Math.round(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return min > 0 ? `${min}m ${sec}s` : `${sec}s`;
  };
  const saveSession = (tools, exitPoint) => {
    const elapsed = Date.now() - startTime.current;
    const timestamp = new Date().toISOString();
    try {
      const ctx = contextEntryRef.current || {};
      appendSessionToStorage({
        timestamp,
        duration: elapsed,
        durationFormatted: formatTime(elapsed),
        tools,
        exitPoint,
        source: "breathe-ground",
        entryMode: ctx.entryMode || null,
        entryProtocolId: ctx.entryProtocolId || null
      });
    } catch {}
    return { elapsed, timestamp };
  };
  const getSessionCount = () => getSessionCountFromStorage();
  const queueDebriefAndCompleteNow = (redirectTo = null, source = "breathe-ground") => {
    setDebriefTarget({ redirectTo: redirectTo || null, source });
  };
  const queueDebriefAndComplete = (redirectTo = null, source = "breathe-ground") => {
    setNextMoveTarget({ redirectTo: redirectTo || null, source });
  };
  const handleNextMoveConfirm = (nextMove) => {
    const target = nextMoveTarget;
    if (!target) return;
    if (latestSessionTimestampRef.current) {
      saveSessionNextMove(latestSessionTimestampRef.current, nextMove);
    }
    setNextMoveTarget(null);
    queueDebriefAndCompleteNow(target.redirectTo || null, target.source || "breathe-ground-next-move");
  };
  const handleNextMoveSkip = () => {
    const target = nextMoveTarget;
    if (!target) return;
    setNextMoveTarget(null);
    queueDebriefAndCompleteNow(target.redirectTo || null, target.source || "breathe-ground-next-move-skip");
  };
  const completeDebriefGate = (reflectionText) => {
    appendToolDebriefToStorage({
      id: `debrief_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
      date: toLocalDateKey(),
      toolId: "breathe",
      toolFamily: getToolFamily("breathe"),
      regulationType,
      source: debriefTarget?.source || "breathe-ground",
      reflectionText: String(reflectionText || "").trim(),
      route: debriefTarget?.redirectTo || null
    });
    const nextRoute = debriefTarget?.redirectTo || undefined;
    setDebriefTarget(null);
    onComplete(nextRoute);
  };

  // --- BREATHE ---
  const savedPatternId = (() => { try { return localStorage.getItem("stillform_breath_pattern") || "quick"; } catch { return "quick"; } })();
  const [patternId, setPatternId] = useState(savedPatternId);
  const pattern = BREATHING_PATTERNS.find(p => p.id === patternId) || BREATHING_PATTERNS[0];
  const phases = pattern.phases;

  const [started, setStarted] = useState(false);

  const totalCycles = 3; // 3 cycles then check in — don't force more
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [count, setCount] = useState(phases[0].duration);
  const [cycle, setCycle] = useState(1);
  const [running, setRunning] = useState(false);
  const [breatheDone, setBreatheDone] = useState(false);
  const [keepGoing, setKeepGoing] = useState(false);

  // Audio
  const [audioOn, setAudioOn] = useState(() => {
    try { return localStorage.getItem("stillform_audio") === "on"; } catch { return false; }
  });
  const audioCtx = useRef(null);
  const activeOsc = useRef(null);

  useEffect(() => {
    try {
      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.current.state === "suspended") audioCtx.current.resume();
    } catch {}
    return () => {
      try {
        if (activeOsc.current) { activeOsc.current.stop(); activeOsc.current = null; }
        if (audioCtx.current) audioCtx.current.close();
      } catch {}
    };
  }, []);

  const toggleAudio = () => {
    const next = !audioOn;
    setAudioOn(next);
    try { localStorage.setItem("stillform_audio", next ? "on" : "off"); } catch {}
    if (next && audioCtx.current?.state === "suspended") audioCtx.current.resume();
  };

  useEffect(() => {
    if (!running || breatheDone || !audioCtx.current || !audioOn) return;
    const ctx = audioCtx.current;
    if (ctx.state === "suspended") ctx.resume();
    try { if (activeOsc.current) { activeOsc.current.stop(); activeOsc.current = null; } } catch {}

    const p = phases[phaseIdx];
    if (p.name === "Rest") return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;
      const dur = p.duration;

      if (p.name === "Inhale") {
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(280, now + dur);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.5);
        gain.gain.setValueAtTime(0.08, now + dur - 0.3);
        gain.gain.linearRampToValueAtTime(0, now + dur);
      } else if (p.name === "Hold") {
        osc.frequency.setValueAtTime(280, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.3);
        gain.gain.setValueAtTime(0.05, now + dur - 0.3);
        gain.gain.linearRampToValueAtTime(0, now + dur);
      } else if (p.name === "Exhale") {
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.linearRampToValueAtTime(140, now + dur);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.3);
        gain.gain.linearRampToValueAtTime(0.02, now + dur - 0.5);
        gain.gain.linearRampToValueAtTime(0, now + dur);
      }
      osc.start(now);
      osc.stop(now + dur);
      activeOsc.current = osc;
    } catch {}
  }, [phaseIdx, running, breatheDone, audioOn]);

  useEffect(() => {
    if (!running) return;
    if (count === 0) {
      const next = (phaseIdx + 1) % phases.length;
      if (next === 0) {
        const newCycle = cycle + 1;
        if (!keepGoing && newCycle > totalCycles) {
          setBreatheDone(true);
          setRunning(false);
          haptic.complete();
          return;
        }
        if (keepGoing && newCycle > totalCycles + 3) {
          setBreatheDone(true);
          setRunning(false);
          haptic.complete();
          return;
        }
        setCycle(newCycle);
      }
      haptic.tick();
      setPhaseIdx(next);
      setCount(phases[next].duration);
    } else {
      const t = setTimeout(() => setCount(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [count, running, phaseIdx, cycle, keepGoing]);

  // --- GROUND ---
  const steps = [
    { num: 5, sense: "See", label: "5 things you can see", prompt: "Look around. Name them quietly." },
    { num: 4, sense: "Touch", label: "4 things you can touch", prompt: "Feel what's around you right now." },
    { num: 3, sense: "Hear", label: "3 things you can hear", prompt: "Listen. What sounds are there?" },
    { num: 2, sense: "Smell", label: "2 things you can smell", prompt: "What scents are here, even faint?" },
    { num: 1, sense: "Taste", label: "1 thing you can taste", prompt: "What do you taste right now?" }
  ];
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [groundDone, setGroundDone] = useState(false);
  const [groundStepStart, setGroundStepStart] = useState(Date.now());
  const [groundData, setGroundData] = useState([]);
  const [showGroundWrite, setShowGroundWrite] = useState(false);

  const progress = ((cycle - 1) * phases.length + phaseIdx) / (totalCycles * phases.length);
  const bgtBreathScale = (phaseIdx === 0 || phaseIdx === 1) ? 1 : 0;
  const bgtVisualGrounding = (() => { try { return localStorage.getItem("stillform_visual_grounding") !== "off"; } catch { return true; } })();

  const groundSavedRef = useRef(false);
  const groundElapsedRef = useRef(0);
  const groundAutoRef = useRef(false);
  if (nextMoveTarget) {
    return (
      <NextMoveStep
        description="Choose one concrete action while this reset is still fresh."
        onConfirm={handleNextMoveConfirm}
        onSkip={handleNextMoveSkip}
      />
    );
  }
  if (debriefTarget) {
    return (
      <ToolDebriefGate
        toolId="breathe"
        regulationType={regulationType}
        onContinue={completeDebriefGate}
      />
    );
  }
  if (groundDone) {
    if (!groundSavedRef.current) {
      groundSavedRef.current = true;
      const saved = saveSession(["breathe", "ground"], "grounding-complete");
      groundElapsedRef.current = saved?.elapsed || 0;
      latestSessionTimestampRef.current = saved?.timestamp || null;
    }
    if (!groundAutoRef.current) {
      groundAutoRef.current = true;
    }
    const elapsed = groundElapsedRef.current;
    const count = getSessionCount();
    const signalProfile = (() => { try { return JSON.parse(localStorage.getItem("stillform_signal_profile") || "null"); } catch { return null; } })();
    const lastShift = (() => { try { return JSON.parse(localStorage.getItem("stillform_last_shift") || "null"); } catch { return null; } })();
    return (
      <div className="complete">
        <div className="complete-icon" style={{ animation: "pulse 1.2s ease-in-out 3" }}>✓</div>
        <h2>Composure restored.</h2>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 16 }}>
          System calibrated · {formatTime(elapsed)}
        </div>
        {signalProfile?.firstAreas?.length > 0 && (
          <div style={{ background: "var(--surface)", border: "0.5px solid var(--amber-dim)", borderRadius: "var(--r)", padding: "12px 16px", marginBottom: 16, textAlign: "left" }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 8 }}>Signal Shift</div>
            {signalProfile.firstAreas.slice(0, 3).map(area => (
              <div key={area} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{area}</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "var(--amber)" }}>Protocol complete</span>
              </div>
            ))}
            {lastShift !== null && lastShift > 0 && (
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: "0.5px solid var(--border)", fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "var(--amber)", letterSpacing: "0.1em" }}>
                STATE SHIFT +{lastShift} · FUNCTIONAL
              </div>
            )}
          </div>
        )}
        {count > 1 && <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.1em", marginBottom: 16 }}>SESSION {count}</div>}
        {count === 1 && (
          <div style={{ background: "var(--surface)", border: "0.5px solid var(--amber-dim)", borderRadius: "var(--r)", padding: "14px 18px", marginBottom: 16, textAlign: "center" }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 6 }}>First calibration</div>
            <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.5 }}>System is learning you. Each session sharpens the read.</div>
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
          <button className="btn btn-primary" onClick={() => queueDebriefAndComplete("reframe-calm", "grounding-complete-continue")}>
            Continue to Reframe →
          </button>
          <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => queueDebriefAndComplete(undefined, "grounding-complete-exit")}>
            Exit session
          </button>
        </div>
        
      </div>
    );
  }

  const confirmGroundStep = () => {
    const timeOnStep = Date.now() - groundStepStart;
    const entry = {
      step: current + 1,
      sense: steps[current].sense,
      timeMs: timeOnStep,
      wrote: !!(answers[current] || "").trim(),
      text: (answers[current] || "").trim() || null
    };
    const updated = [...groundData, entry];
    setGroundData(updated);
    setShowGroundWrite(false);

    if (current < steps.length - 1) {
      setCurrent(c => c + 1);
      setGroundStepStart(Date.now());
    } else {
      // Save grounding engagement data
      try {
        const gd = JSON.parse(localStorage.getItem("stillform_grounding_data") || "[]");
        gd.push({ timestamp: new Date().toISOString(), steps: updated, skipped: false, totalMs: updated.reduce((s, e) => s + e.timeMs, 0) });
        localStorage.setItem("stillform_grounding_data", JSON.stringify(gd));
      } catch {}
      setGroundDone(true);
    }
  };

  const skipGrounding = () => {
    const timeOnStep = Date.now() - groundStepStart;
    try {
      const gd = JSON.parse(localStorage.getItem("stillform_grounding_data") || "[]");
      gd.push({ timestamp: new Date().toISOString(), steps: [...groundData, { step: current + 1, sense: steps[current].sense, timeMs: timeOnStep, wrote: false, text: null }], skipped: true, skippedAt: current + 1, totalMs: groundData.reduce((s, e) => s + e.timeMs, 0) + timeOnStep });
      localStorage.setItem("stillform_grounding_data", JSON.stringify(gd));
    } catch {}
    setGroundDone(true);
  };

  if (phase === "ground") return (
    <div>
      <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 24, textAlign: "center" }}>
        Grounding — step {current + 1} of 5
      </div>
      <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", padding: "24px 20px", marginBottom: 20, textAlign: "center" }}>
        <div style={{ fontSize: 36, color: "var(--amber)", marginBottom: 8 }}>{steps[current].num}</div>
        <div style={{ fontSize: 20, color: "var(--text)", fontWeight: 500, marginBottom: 8 }}>
          {steps[current].label}
        </div>
        <div style={{ fontSize: 14, color: "var(--text-dim)", marginBottom: 20 }}>
          {steps[current].prompt}
        </div>

        <button
          className="btn btn-primary"
          style={{ width: "100%", fontSize: 15, padding: "14px 0", marginBottom: 10 }}
          onClick={confirmGroundStep}
        >
          {current < steps.length - 1 ? `Found ${steps[current].num} ✓` : "Done ✓"}
        </button>

        {!showGroundWrite ? (
          <button onClick={() => setShowGroundWrite(true)} style={{
            background: "none", border: "none", color: "var(--text-muted)", fontSize: 11,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
          }}>
            I want to write them down
          </button>
        ) : (
          <div style={{ marginTop: 12 }}>
            <div style={{ display: "flex", gap: 6 }}>
              <textarea
                className="ground-input"
                rows={2}
                placeholder="Write or speak what you noticed..."
                value={answers[current] || ""}
                onChange={e => setAnswers(a => ({ ...a, [current]: e.target.value }))}
                style={{ flex: 1, fontSize: 13 }}
                autoFocus
              />
              <MicButton onTranscript={t => setAnswers(a => ({ ...a, [current]: (a[current] || "") + (a[current] ? " " : "") + t }))} />
            </div>
          </div>
        )}
      </div>

      {current < steps.length - 1 && (
        <button onClick={skipGrounding} style={{
          background: "none", border: "none", color: "var(--text-muted)", fontSize: 12,
          cursor: "pointer", fontFamily: "'DM Sans', sans-serif", width: "100%", textAlign: "center"
        }}>
          Skip grounding
        </button>
      )}

      <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 16 }}>
        {steps.map((_, i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i <= current ? "var(--amber)" : "var(--border)", transition: "all 0.3s" }} />
        ))}
      </div>
    </div>
  );

  // Pre-rate: quick 1-5 tap
  if (phase === "pre-rate") return (
    <div style={{ maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, marginBottom: 8 }}>
        How steady are you?
      </h2>
      {(() => { try { const s = JSON.parse(localStorage.getItem("stillform_last_shift") || "null"); if (s) return <div style={{ fontSize: 13, color: s > 0 ? "var(--amber)" : "var(--text-muted)", marginBottom: 16, fontWeight: s > 0 ? 500 : 400 }}>Last session: {s > 0 ? "+" : ""}{s}</div>; } catch {} return null; })()}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, padding: "0 6px" }}>
        <span style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Reactive</span>
        <span style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Composed</span>
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} onClick={() => { setPreRating(n); setPhase("bio-filter"); }} style={{
            width: 56, height: 56, borderRadius: "50%", border: "1px solid var(--border)",
            background: "var(--surface)", color: "var(--text)", fontSize: 20, fontWeight: 500,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
            WebkitTapHighlightColor: "transparent"
          }}>{n}</button>
        ))}
      </div>
    </div>
  );

  // Bio-filter — physical state check before session
  if (phase === "bio-filter") return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, marginBottom: 6 }}>
        State read.
      </h2>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 20 }}>
        <span>Bio-filter · What is your hardware running right now?</span> <button onClick={() => setInfoModal({ title: "Why the bio-filter?", body: "Physical state directly alters emotional perception. Sleep debt amplifies threat detection. Pain demands attentional resources. Hormonal shifts change affective baseline. This check prevents the system from misreading a biological signal as an emotional one." })} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 13, padding: "0 4px", lineHeight: 1 }}>ⓘ</button>
      </div>
      <div style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6, marginBottom: 20 }}>
        Physical state colors perception. The AI filters your input through this — so the read is accurate, not assumed.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
        {[
          { id: "clear", label: "Baseline", desc: "System nominal — no flags", icon: "◎" },
          { id: "activated", label: "Activated", desc: "Adrenaline, butterflies, energy surging", icon: "⚡" },
          { id: "depleted", label: "Low capacity", desc: "Fatigue, low energy, heavy body", icon: "◌" },
          { id: "gut", label: "Gut signal", desc: "Digestive noise — gut-brain axis active", icon: "◉" },
          { id: "sleep", label: "Under-rested", desc: "Your brain is running slower than usual", icon: "◐" },
          { id: "hormonal", label: "Hormonal shift", desc: "Cycle, inflammation, or hormonal fluctuation", icon: "◑" },
          { id: "pain", label: "Pain active", desc: "Chronic or acute — affecting state", icon: "◈" },
          { id: "medicated", label: "Substance active", desc: "Caffeine, meds, alcohol, or other input", icon: "◇" },
        ].map(opt => (
          <button key={opt.id} onClick={() => {
            setBioFilter(opt.id);
            try { localStorage.setItem("stillform_bio_filter", opt.id); } catch {}
            setPhase("breathe");
          }} style={{
            width: "100%", background: bioFilter === opt.id ? "var(--amber-glow)" : "var(--surface)",
            border: `0.5px solid ${bioFilter === opt.id ? "var(--amber-dim)" : "var(--border)"}`,
            borderRadius: "var(--r)", padding: "12px 16px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 12, textAlign: "left",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.025)",
            WebkitTapHighlightColor: "transparent"
          }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, color: "var(--amber)", flexShrink: 0 }}>{opt.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 2 }}>{opt.label}</div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.08em" }}>{opt.desc}</div>
            </div>
          </button>
        ))}
      </div>
      <button onClick={() => { setBioFilter("clear"); setPhase("breathe"); }} style={{
        background: "none", border: "none", color: "var(--text-muted)", fontSize: 11, cursor: "pointer",
        fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase"
      }}>
        Skip →
      </button>
    </div>
  );

  // Breathe phase
  if (!started && phase === "breathe") {
    setStarted(true);
    setRunning(true);
    watchBridge.startBreathing(patternId);
    return null;
  }

  return (
    <div>
      {!breatheDone ? (
        <div className="breath-container" style={{ position: "relative", overflow: "hidden" }}>
          {bgtVisualGrounding && <FractalBreathCanvas breathScale={bgtBreathScale} />}
          <div className="breath-circle-wrap">
            <svg className="breath-svg-ring" viewBox="0 0 280 280">
              {/* Tick marks — cardinal */}
              <g stroke="rgba(255,255,255,0.06)" strokeWidth="1" transform="rotate(90 140 140)">
                <line x1="140" y1="5" x2="140" y2="18"/>
                <line x1="275" y1="140" x2="262" y2="140"/>
                <line x1="140" y1="275" x2="140" y2="262"/>
                <line x1="5" y1="140" x2="18" y2="140"/>
              </g>
              {/* Micro ticks every 30deg */}
              <g stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" transform="rotate(90 140 140)">
                {[30,60,120,150,210,240,300,330].map(deg => {
                  const rad = (deg * Math.PI) / 180;
                  const x1 = 140 + 131 * Math.cos(rad);
                  const y1 = 140 + 131 * Math.sin(rad);
                  const x2 = 140 + 122 * Math.cos(rad);
                  const y2 = 140 + 122 * Math.sin(rad);
                  return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2}/>;
                })}
              </g>
              <circle className="breath-ring-track" cx="140" cy="140" r="125"/>
              <circle
                className="breath-ring-arc"
                cx="140" cy="140" r="125"
                style={{
                  strokeDasharray: 785,
                  strokeDashoffset: phase === "exhale" ? 785 : phase === "rest" ? 196 : 0,
                  '--breath-duration': `${phases[phase]?.duration || 4}s`
                }}
              />
              <circle cx="140" cy="140" r="106" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5"/>
            </svg>
            <div className="breath-inner">
              <span className="breath-count">{count}</span>
              <span className="breath-phase">{phases[phase]?.label}</span>
            </div>
          </div>
          <div className="breath-instruction" style={{ marginTop: 8 }}>{phases[phaseIdx].instruction}</div>
          <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4, marginBottom: 12 }}>
            Round {cycle} of {totalCycles}
          </div>
          <button onClick={toggleAudio} style={{
            background: audioOn ? "var(--amber-glow)" : "var(--surface)",
            border: `1px solid ${audioOn ? "var(--amber-dim)" : "var(--border)"}`,
            borderRadius: 20, padding: "6px 14px", fontSize: 11, cursor: "pointer",
            color: audioOn ? "var(--amber)" : "var(--text-dim)", fontFamily: "'DM Sans', sans-serif",
            marginBottom: 12, transition: "all 0.2s"
          }}>
            {audioOn ? "♪ Sound on" : "♪ Sound off"}
          </button>
          {/* Pattern name shown, no mid-session change — user picks at start */}
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 16, letterSpacing: "0.04em", fontFamily: "'DM Sans', sans-serif" }}>
            {pattern.name}
          </div>
          {!running ? (
            <button className="btn btn-primary" style={{ fontSize: 16, padding: "14px 40px" }} onClick={() => setRunning(true)}>
              Begin
            </button>
          ) : (
            <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => setRunning(false)}>
              Pause
            </button>
          )}
        </div>
      ) : (
        <div className="complete">
          <div className="complete-icon">✓</div>
          <h2>Three rounds done.</h2>
          <p style={{ marginBottom: 24 }}>Nervous system recalibrating. Continue or move on.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button className="btn btn-primary" onClick={() => setPhase("ground")}>
              Ground now →
            </button>
            <button className="btn btn-ghost" onClick={() => {
              setKeepGoing(true);
              setBreatheDone(false);
              setRunning(true);
            }}>
              Keep going
            </button>
            <button className="btn btn-ghost" onClick={() => {
              const saved = saveSession(["breathe"], "breathing-only");
              latestSessionTimestampRef.current = saved?.timestamp || null;
              setPhase("post-rate");
            }} style={{ color: "var(--text-dim)", fontSize: 13 }}>
              Stop here
            </button>
          </div>
        </div>
      )}

      {/* POST-RATE */}
      {phase === "post-rate" && (
        <div style={{ maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, margin: 0 }}>
              Where are you now?
            </h2>
            <button onClick={() => setInfoModal({ title: "Why track this?", body: "Tracking your state after a session measures the shift. The difference between how you came in and how you leave is the data point that builds your composure pattern over time." })} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 13, padding: "0 4px", lineHeight: 1 }}>ⓘ</button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, padding: "0 6px" }}>
            <span style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Reactive</span>
            <span style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Composed</span>
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 24 }}>
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} onClick={() => {
                setPostRating(n);
                const delta = n - (preRating || n);
                try {
                  localStorage.setItem("stillform_last_shift", JSON.stringify(delta));
                  // Save ratings back into the most recent session record
                  const sessions = getSessionsFromStorage();
                  if (sessions.length > 0) {
                    sessions[sessions.length - 1].preRating = preRating || null;
                    sessions[sessions.length - 1].postRating = n;
                    sessions[sessions.length - 1].delta = delta;
                    setSessionsInStorage(sessions);
                  }
                } catch {}
              }} style={{
                width: 56, height: 56, borderRadius: "50%",
                border: `2px solid ${postRating === n ? "var(--amber)" : "var(--border)"}`,
                background: postRating === n ? "var(--amber-glow)" : "var(--surface)",
                color: postRating === n ? "var(--amber)" : "var(--text)", fontSize: 20, fontWeight: 500,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
                WebkitTapHighlightColor: "transparent"
              }}>{n}</button>
            ))}
          </div>
          {postRating && preRating && (() => {
            const delta = postRating - preRating;
            const driftPct = preRating > 0 ? Math.round((delta / preRating) * 100) : 0;
            return (
              <div style={{ marginBottom: 24, animation: delta > 0 ? "deltaFlash 0.5s ease-out" : "none" }}>
                <div style={{
                  fontSize: 48, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
                  color: delta > 0 ? "var(--amber)" : delta === 0 ? "var(--text-dim)" : "var(--text-muted)",
                  marginBottom: 4, lineHeight: 1,
                  animation: delta > 0 ? "deltaGlow 0.8s ease-out forwards" : "none"
                }}>
                  {delta > 0 ? `+${delta}` : delta === 0 ? "0" : `${delta}`}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: delta > 0 ? 8 : 0 }}>
                  {delta >= 3 ? "Significant shift" : delta === 2 ? "Composure increased" : delta === 1 ? "Slight improvement" : delta === 0 ? "Baseline held" : delta === -1 ? "Holding" : "Run again"}
                </div>
                {delta > 0 && (
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "var(--amber)", letterSpacing: "0.14em" }}>
                    SIGNAL DRIFT: -{driftPct}%
                  </div>
                )}
              </div>
            );
          })()}
          {postRating && (() => {
            const delta = postRating - preRating;
            // Auto-advance to ground after 1.5s if positive shift
            if (delta > 0) {
              setTimeout(() => setPhase("ground"), 1500);
            }
            return (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {delta <= 0 ? (
                  <>
                    <button className="btn btn-primary" onClick={() => { setPhase("breathe"); setStarted(false); setBreatheDone(false); setPostRating(null); }}>Try again</button>
                    <button className="btn btn-ghost" onClick={() => queueDebriefAndComplete(undefined, "post-rate-done-for-now")}>Done for now</button>
                  </>
                ) : (
                  <>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 8 }}>Stabilized</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", animation: "pulse 1s ease-in-out infinite" }}>
                      Moving to grounding…
                    </div>
                    <button className="btn btn-ghost" onClick={() => queueDebriefAndComplete("reframe-calm", "post-rate-skip-to-reframe")} style={{ fontSize: 13 }}>Skip to Reframe instead</button>
                    <button className="btn btn-ghost" onClick={() => queueDebriefAndComplete(undefined, "post-rate-exit")} style={{ color: "var(--text-muted)", fontSize: 12 }}>Exit session</button>
                  </>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

function BodyScanTool({ onComplete }) {
  // TIME-TO-REGULATION
  const startTime = useRef(Date.now());
  const latestSessionTimestampRef = useRef(null);
  const contextEntryRef = useRef(consumePendingSessionEntryContext());
  const [debriefTarget, setDebriefTarget] = useState(null);
  const [nextMoveTarget, setNextMoveTarget] = useState(null);
  const regulationType = (() => {
    try {
      const value = localStorage.getItem("stillform_regulation_type");
      return value === "thought-first" || value === "body-first" ? value : "balanced";
    } catch {
      return "balanced";
    }
  })();
  const formatTime = (ms) => {
    const totalSec = Math.round(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return min > 0 ? `${min}m ${sec}s` : `${sec}s`;
  };
  const saveSession = () => {
    const elapsed = Date.now() - startTime.current;
    const timestamp = new Date().toISOString();
    try {
      const ctx = contextEntryRef.current || {};
      appendSessionToStorage({
        timestamp,
        duration: elapsed,
        durationFormatted: formatTime(elapsed),
        tools: ["body-scan"],
        exitPoint: "scan-complete",
        source: "body-scan",
        entryMode: ctx.entryMode || null,
        entryProtocolId: ctx.entryProtocolId || null
      });
      try { window.plausible("Body Scan Completed"); } catch {}
    } catch {}
    return { elapsed, timestamp };
  };
  const getSessionCount = () => getSessionCountFromStorage();
  const queueDebriefAndCompleteNow = (redirectTo = null, source = "body-scan") => {
    setDebriefTarget({ redirectTo: redirectTo || null, source });
  };
  const queueDebriefAndComplete = (redirectTo = null, source = "body-scan") => {
    setNextMoveTarget({ redirectTo: redirectTo || null, source });
  };
  const handleNextMoveConfirm = (nextMove) => {
    const target = nextMoveTarget;
    if (!target) return;
    if (latestSessionTimestampRef.current) {
      saveSessionNextMove(latestSessionTimestampRef.current, nextMove);
    }
    setNextMoveTarget(null);
    queueDebriefAndCompleteNow(target.redirectTo || null, target.source || "body-scan-next-move");
  };
  const handleNextMoveSkip = () => {
    const target = nextMoveTarget;
    if (!target) return;
    setNextMoveTarget(null);
    queueDebriefAndCompleteNow(target.redirectTo || null, target.source || "body-scan-next-move-skip");
  };
  const completeDebriefGate = (reflectionText) => {
    appendToolDebriefToStorage({
      id: `debrief_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
      date: toLocalDateKey(),
      toolId: "scan",
      toolFamily: getToolFamily("scan"),
      regulationType,
      source: debriefTarget?.source || "body-scan",
      reflectionText: String(reflectionText || "").trim(),
      route: debriefTarget?.redirectTo || null
    });
    const nextRoute = debriefTarget?.redirectTo || undefined;
    setDebriefTarget(null);
    onComplete(nextRoute);
  };

  const areas = [
    {
      name: "Jaw & Face",
      prompt: "Unclench your jaw. Let your tongue rest. Soften your eyes.",
      holdObservation: "Notice if the pressure creates a release or more resistance. Either is information.",
      pointEffect: "Interrupt racing thoughts",
      pointName: "GV24.5 — Third Eye Point",
      pointLocation: "Place two fingers between your eyebrows, just above the bridge of your nose.",
      pointInstruction: "Apply firm, steady pressure. Close your eyes. Hold.",
      holdSeconds: 60,
      benefit: "Reduces tension headaches. Interrupts mental overload."
    },
    {
      name: "Shoulders & Neck",
      prompt: "Notice if your shoulders are raised. Let them drop completely.",
      holdObservation: "Feel the weight of your arms. Notice if your neck wants to follow and soften.",
      pointEffect: "Release shoulder tension",
      pointName: "GB21 — Shoulder Well",
      pointLocation: "Find the highest point of your shoulder muscle, halfway between your neck and the edge of your shoulder.",
      pointInstruction: "Press firmly with your thumb or two fingers. You may feel a tender ache — that's the right spot. Hold.",
      holdSeconds: 45,
      benefit: "Primary stress relief point. Releases held tension."
    },
    {
      name: "Chest & Breath",
      prompt: "Is your breath shallow? Take one slow, full breath down to your belly.",
      holdObservation: "Notice your breath without directing it. Is it expanding into the pressure or pulling away?",
      pointEffect: "Interrupt emotional escalation",
      pointName: "CV17 — Sea of Tranquility",
      pointLocation: "Find the center of your breastbone, level with your heart. Place your flat palm here.",
      pointInstruction: "Apply firm, steady pressure with your palm. Breathe into it. Hold.",
      holdSeconds: 60,
      benefit: "Interrupts emotional escalation. Regulates the breath."
    },
    {
      name: "Hands & Arms",
      prompt: "Are your hands gripping anything? Open them fully. Let your arms go heavy.",
      holdObservation: "Notice if the tenderness in the point shifts or spreads. Stay with it.",
      pointEffect: "Reduce stress load",
      pointName: "LI4 — Union Valley",
      pointLocation: "Find the webbing between your thumb and index finger. Pinch the highest point of the muscle there.",
      pointInstruction: "Squeeze firmly — this point is often tender. Switch hands halfway. Hold.",
      holdSeconds: 45,
      benefit: "One of the most effective points for stress and tension overload."
    },
    {
      name: "Gut & Core",
      prompt: "Scan your stomach and core. Notice tightness without trying to fix it.",
      holdObservation: "Notice what your gut is doing — gripping, fluttering, or still. You don't need to interpret it yet.",
      pointEffect: "Stabilize racing heart and nausea",
      pointName: "PC6 — Inner Gate",
      pointLocation: "Turn your wrist palm-up. Measure three finger-widths down from your wrist crease, between the two tendons.",
      pointInstruction: "Press firmly with your thumb. Switch wrists halfway. Hold.",
      holdSeconds: 60,
      benefit: "Regulates the nervous system. Stabilizes heart rate and nausea."
    },
    {
      name: "Legs & Feet",
      prompt: "Feel the full weight of your legs. Press your feet flat into the floor.",
      holdObservation: "Feel the floor beneath you. Notice if the weight of your body starts to settle.",
      pointEffect: "Ground and stabilize",
      pointName: "ST36 — Leg Three Miles",
      pointLocation: "Find the outer edge of your kneecap, then measure four finger-widths straight down your shin.",
      pointInstruction: "Press firmly into the muscle beside the bone. Switch legs halfway. Hold.",
      holdSeconds: 60,
      benefit: "Grounds the nervous system. Restores energy and stability."
    }
  ];

  const [tension, setTension] = useState({});
  const [currentArea, setCurrentArea] = useState(0);
  const [phase, setPhase] = useState("scan");
  const [holdCount, setHoldCount] = useState(0);
  const [holding, setHolding] = useState(false);

  // Scan pace multiplier from Settings
  const paceMultiplier = (() => {
    const p = localStorage.getItem("stillform_scan_pace") || "standard";
    return p === "fast" ? 0.5 : p === "slow" ? 1.75 : 1;
  })();
  const scaledAreas = areas.map(a => ({ ...a, holdSeconds: Math.round(a.holdSeconds * paceMultiplier) }));
  const [done, setDone] = useState(false);
  const [showPointName, setShowPointName] = useState(false);

  // Audio — low grounding tone during holds
  const [audioOn, setAudioOn] = useState(() => {
    try { return localStorage.getItem("stillform_audio") === "on"; } catch { return false; }
  });
  const audioCtx = useRef(null);
  const activeOsc = useRef(null);

  useEffect(() => {
    try {
      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    } catch {}
    return () => {
      try {
        if (activeOsc.current) { activeOsc.current.stop(); activeOsc.current = null; }
        if (audioCtx.current) audioCtx.current.close();
      } catch {}
    };
  }, []);

  const toggleAudio = () => {
    const next = !audioOn;
    setAudioOn(next);
    try { localStorage.setItem("stillform_audio", next ? "on" : "off"); } catch {}
  };

  // Play/stop tone when holding
  useEffect(() => {
    if (!audioOn || !audioCtx.current) return;
    try { if (activeOsc.current) { activeOsc.current.stop(); activeOsc.current = null; } } catch {}

    if (!holding) return;

    try {
      const ctx = audioCtx.current;
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 1);
      osc.start(ctx.currentTime);
      activeOsc.current = osc;
    } catch {}

    return () => {
      try {
        if (activeOsc.current) {
          const ctx = audioCtx.current;
          if (ctx) {
            const gain = ctx.createGain();
            activeOsc.current.disconnect();
            activeOsc.current.connect(gain);
            gain.connect(ctx.destination);
            gain.gain.setValueAtTime(0.06, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
          }
          setTimeout(() => { try { activeOsc.current?.stop(); activeOsc.current = null; } catch {} }, 600);
        }
      } catch {}
    };
  }, [holding, audioOn]);

  useEffect(() => {
    if (!holding) return;
    const target = scaledAreas[currentArea].holdSeconds;
    if (holdCount >= target) { setHolding(false); return; }
    const t = setTimeout(() => setHoldCount(c => c + 1), 1000);
    return () => clearTimeout(t);
  }, [holding, holdCount, currentArea]);

  const startHold = () => { setHoldCount(0); setHolding(true); };

  const handleNext = () => {
    setPhase("scan");
    setHolding(false);
    setHoldCount(0);
    setShowPointName(false);
    if (currentArea < areas.length - 1) {
      haptic.tick();
      setCurrentArea(a => a + 1);
    } else {
      haptic.complete();
      setDone(true);
    }
  };

  const area = scaledAreas[currentArea];
  const holdTarget = area.holdSeconds;
  const holdProgress = Math.min((holdCount / holdTarget) * 100, 100);
  const renderAreaOverview = (areaName) => {
    const highlightStyle = { fill: "var(--amber-20)", stroke: "var(--amber)", strokeWidth: 1 };
    return (
      <svg viewBox="0 0 180 200" width="140" height="140" style={{ overflow: "visible" }} aria-label={`${areaName} body map`}>
        <circle cx="90" cy="24" r="14" fill="none" stroke="rgba(255,255,255,0.50)" strokeWidth="1" />
        <path d="M70 42 L62 74 L66 150 L82 194" fill="none" stroke="rgba(255,255,255,0.50)" strokeWidth="1.2" />
        <path d="M110 42 L118 74 L114 150 L98 194" fill="none" stroke="rgba(255,255,255,0.50)" strokeWidth="1.2" />
        <path d="M66 72 L114 72 L108 126 L72 126 Z" fill="none" stroke="rgba(255,255,255,0.50)" strokeWidth="1.1" />
        <path d="M62 74 L40 102" fill="none" stroke="rgba(255,255,255,0.42)" strokeWidth="1.1" />
        <path d="M118 74 L140 102" fill="none" stroke="rgba(255,255,255,0.42)" strokeWidth="1.1" />
        <path d="M40 102 L38 150" fill="none" stroke="rgba(255,255,255,0.42)" strokeWidth="1.1" />
        <path d="M140 102 L142 150" fill="none" stroke="rgba(255,255,255,0.42)" strokeWidth="1.1" />
        {areaName === "Jaw & Face" && (
          <>
            <ellipse cx="90" cy="30" rx="15" ry="9" {...highlightStyle} />
            <text x="90" y="188" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="9" fontFamily="'IBM Plex Mono', monospace">Face + jaw region</text>
          </>
        )}
        {areaName === "Shoulders & Neck" && (
          <>
            <rect x="58" y="44" width="64" height="16" rx="8" {...highlightStyle} />
            <text x="90" y="188" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="9" fontFamily="'IBM Plex Mono', monospace">Shoulders + neck region</text>
          </>
        )}
        {areaName === "Chest & Breath" && (
          <>
            <rect x="74" y="74" width="32" height="26" rx="10" {...highlightStyle} />
            <text x="90" y="188" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="9" fontFamily="'IBM Plex Mono', monospace">Chest + breath region</text>
          </>
        )}
        {areaName === "Hands & Arms" && (
          <>
            <rect x="31" y="114" width="16" height="22" rx="7" {...highlightStyle} />
            <rect x="133" y="114" width="16" height="22" rx="7" {...highlightStyle} />
            <text x="90" y="188" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="9" fontFamily="'IBM Plex Mono', monospace">Hands + forearms region</text>
          </>
        )}
        {areaName === "Gut & Core" && (
          <>
            <rect x="74" y="100" width="32" height="24" rx="10" {...highlightStyle} />
            <text x="90" y="188" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="9" fontFamily="'IBM Plex Mono', monospace">Gut + core region</text>
          </>
        )}
        {areaName === "Legs & Feet" && (
          <>
            <rect x="70" y="144" width="14" height="36" rx="7" {...highlightStyle} />
            <rect x="96" y="144" width="14" height="36" rx="7" {...highlightStyle} />
            <text x="90" y="188" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="9" fontFamily="'IBM Plex Mono', monospace">Legs + feet region</text>
          </>
        )}
      </svg>
    );
  };

  const scanSavedRef = useRef(false);
  const scanElapsedRef = useRef(0);
  const scanAutoRef = useRef(false);
  if (nextMoveTarget) {
    return (
      <NextMoveStep
        description="Choose one concrete action before leaving Body Scan."
        onConfirm={handleNextMoveConfirm}
        onSkip={handleNextMoveSkip}
      />
    );
  }
  if (debriefTarget) {
    return (
      <ToolDebriefGate
        toolId="scan"
        regulationType={regulationType}
        onContinue={completeDebriefGate}
      />
    );
  }
  if (done) {
    if (!scanSavedRef.current) {
      scanSavedRef.current = true;
      const saved = saveSession();
      scanElapsedRef.current = saved?.elapsed || 0;
      latestSessionTimestampRef.current = saved?.timestamp || null;
    }
    if (!scanAutoRef.current) { scanAutoRef.current = true; setTimeout(() => queueDebriefAndComplete("reframe-calm", "scan-complete-auto"), 2000); }
    const elapsed = scanElapsedRef.current;
    const sessionCount = getSessionCount();
    const signalProfile = (() => { try { return JSON.parse(localStorage.getItem("stillform_signal_profile") || "null"); } catch { return null; } })();
    return (
      <div className="complete">
        <div className="complete-icon" style={{ animation: "pulse 1.2s ease-in-out 3" }}>✓</div>
        <h2>Signal cleared.</h2>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 16 }}>
          System calibrated · {formatTime(elapsed)}
        </div>
        {signalProfile?.firstAreas?.length > 0 && (
          <div style={{ background: "var(--surface)", border: "0.5px solid var(--amber-dim)", borderRadius: "var(--r)", padding: "12px 16px", marginBottom: 16, textAlign: "left" }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 8 }}>Signal Shift</div>
            {signalProfile.firstAreas.slice(0, 3).map(area => (
              <div key={area} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{area}</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "var(--amber)" }}>Pressure released</span>
              </div>
            ))}
          </div>
        )}
        {sessionCount > 1 && <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.1em", marginBottom: 16 }}>SESSION {sessionCount}</div>}
        {sessionCount === 1 && (
          <div style={{ background: "var(--surface)", border: "0.5px solid var(--amber-dim)", borderRadius: "var(--r)", padding: "14px 18px", marginBottom: 16, textAlign: "center" }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 6 }}>First calibration</div>
            <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.5 }}>System is learning you. Each session sharpens the read.</div>
          </div>
        )}
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: 16, animation: "pulse 1s ease-in-out infinite" }}>
          MOVING TO REFRAME…
        </div>
        <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => queueDebriefAndComplete(undefined, "scan-complete-exit")}>Exit session</button>
        
      </div>
    );
  }

  return (
    <div className="scan-body">
      {scaledAreas.map((a, i) => (
        <div key={i} className={`scan-area ${i === currentArea ? "active" : i < currentArea ? "done" : ""}`}
          onClick={() => i <= currentArea && setCurrentArea(i)}>
          <div className="scan-area-name">{a.name}</div>
          {i !== currentArea && <div className="scan-area-prompt">{i < currentArea ? "✓ Complete" : a.prompt}</div>}
          {i === currentArea && phase === "scan" && (
            <>
              <div style={{ display: "flex", justifyContent: "center", marginTop: 10, marginBottom: 10, opacity: 0.95 }}>
                {renderAreaOverview(a.name)}
              </div>
              <div className="scan-area-prompt" style={{ marginTop: 8 }}>{a.prompt}</div>
              <div style={{ marginTop: 12, marginBottom: 12, fontSize: 12, color: "var(--text-dim)", fontStyle: "italic", lineHeight: 1.6 }}>
                Notice what's here. You don't need to change it — just let it be.
              </div>
              <div style={{ marginTop: 4, marginBottom: 8, fontSize: 12, color: "var(--text-dim)", letterSpacing: "0.08em" }}>TENSION LEVEL</div>
              <div className="tension-bar">
                {[1,2,3,4,5].map(n => (
                  <div key={n} className={`tension-dot ${(tension[i] || 0) >= n ? "active" : ""}`}
                    onClick={(e) => { e.stopPropagation(); setTension(t => ({ ...t, [i]: n })); }} />
                ))}
              </div>
              <div style={{ marginTop: 20, display: "flex", gap: 8 }}>
                <button className="btn btn-primary" style={{ flex: 1, fontSize: 13 }}
                  onClick={(e) => { e.stopPropagation(); setPhase("pressure"); }}>
                  Apply pressure here →
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleNext(); }} style={{
                  background: "none", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                  padding: "8px 12px", fontSize: 11, cursor: "pointer",
                  color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif"
                }}>
                  Skip →
                </button>
              </div>
            </>
          )}
          {i === currentArea && phase === "pressure" && (
            <>
              <div style={{ marginTop: 12, marginBottom: 6, fontSize: 12, color: "var(--text-dim)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Step {currentArea + 1} of {scaledAreas.length}
              </div>
              <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6, marginBottom: 6 }}>
                Press the <span style={{ color: "var(--amber)" }}>amber point</span> shown below.
              </div>
              {/* Acupressure point diagram */}
              <div style={{ display: "flex", justifyContent: "center", marginTop: 16, marginBottom: 8 }}>
                <svg viewBox="0 0 160 160" width="140" height="140" style={{ overflow: "visible" }}>
                  {a.name === "Jaw & Face" && <>
                    {/* Head */}
                    <ellipse cx="80" cy="54" rx="28" ry="34" fill="none" stroke="rgba(255,255,255,0.50)" strokeWidth="1.5"/>
                    {/* Neck */}
                    <line x1="72" y1="86" x2="70" y2="102" stroke="rgba(255,255,255,0.42)" strokeWidth="1.5"/>
                    <line x1="88" y1="86" x2="90" y2="102" stroke="rgba(255,255,255,0.42)" strokeWidth="1.5"/>
                    {/* Jaw line */}
                    <path d="M55 68 Q80 82 105 68" fill="none" stroke="rgba(255,255,255,0.42)" strokeWidth="1.2"/>
                    {/* Pressure point — between eyebrows */}
                    <circle cx="80" cy="43" r="5" fill="var(--amber)" opacity="0.9"/>
                    <circle cx="80" cy="43" r="9" fill="none" stroke="var(--amber)" strokeWidth="0.5" opacity="0.3"/>
                    {/* Label */}
                    <text x="80" y="128" textAnchor="middle" fill="rgba(255,255,255,0.72)" fontSize="9" fontFamily="'IBM Plex Mono', monospace">GV24.5 · between eyebrows</text>
                  </>}

                  {a.name === "Shoulders & Neck" && <>
                    {/* Head */}
                    <circle cx="80" cy="28" r="14" fill="none" stroke="rgba(255,255,255,0.50)" strokeWidth="1.5"/>
                    {/* Neck */}
                    <line x1="75" y1="41" x2="74" y2="54" stroke="rgba(255,255,255,0.50)" strokeWidth="1.5"/>
                    <line x1="85" y1="41" x2="86" y2="54" stroke="rgba(255,255,255,0.50)" strokeWidth="1.5"/>
                    {/* Shoulders */}
                    <path d="M74 54 Q60 56 38 70" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.6"/>
                    <path d="M86 54 Q100 56 122 70" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.6"/>
                    {/* Torso top */}
                    <line x1="38" y1="70" x2="42" y2="110" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
                    <line x1="122" y1="70" x2="118" y2="110" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
                    {/* Pressure point — GB21 left shoulder */}
                    <circle cx="56" cy="62" r="5" fill="var(--amber)" opacity="0.9"/>
                    <circle cx="56" cy="62" r="9" fill="none" stroke="var(--amber)" strokeWidth="0.5" opacity="0.3"/>
                    {/* Label */}
                    <text x="80" y="136" textAnchor="middle" fill="rgba(255,255,255,0.72)" fontSize="9" fontFamily="'IBM Plex Mono', monospace">GB21 · shoulder well</text>
                  </>}

                  {a.name === "Chest & Breath" && <>
                    {/* Head */}
                    <circle cx="80" cy="18" r="11" fill="none" stroke="rgba(255,255,255,0.50)" strokeWidth="1.5"/>
                    {/* Neck */}
                    <line x1="76" y1="28" x2="75" y2="36" stroke="rgba(255,255,255,0.42)" strokeWidth="1.5"/>
                    <line x1="84" y1="28" x2="85" y2="36" stroke="rgba(255,255,255,0.42)" strokeWidth="1.5"/>
                    {/* Shoulders */}
                    <path d="M75 36 Q62 38 48 48" fill="none" stroke="rgba(255,255,255,0.52)" strokeWidth="1.5"/>
                    <path d="M85 36 Q98 38 112 48" fill="none" stroke="rgba(255,255,255,0.52)" strokeWidth="1.5"/>
                    {/* Torso / chest */}
                    <path d="M48 48 L44 110 L116 110 L112 48 Z" fill="none" stroke="rgba(255,255,255,0.52)" strokeWidth="1.5"/>
                    {/* Sternum center line */}
                    <line x1="80" y1="48" x2="80" y2="110" stroke="rgba(255,255,255,0.36)" strokeWidth="0.8" strokeDasharray="3,3"/>
                    {/* Pressure point — CV17 center sternum */}
                    <circle cx="80" cy="66" r="5" fill="var(--amber)" opacity="0.9"/>
                    <circle cx="80" cy="66" r="9" fill="none" stroke="var(--amber)" strokeWidth="0.5" opacity="0.3"/>
                    {/* Label */}
                    <text x="80" y="138" textAnchor="middle" fill="rgba(255,255,255,0.72)" fontSize="9" fontFamily="'IBM Plex Mono', monospace">CV17 · center sternum</text>
                  </>}

                  {a.name === "Hands & Arms" && <>
                    {/* Hand outline — palm facing up */}
                    <path d="M60 110 L60 65 Q60 58 56 50 M60 65 Q62 56 64 44 M60 65 Q65 55 70 43 M60 65 Q67 57 75 48 M60 65 Q58 57 52 52" fill="none" stroke="rgba(255,255,255,0.52)" strokeWidth="1.6"/>
                    {/* Palm base */}
                    <path d="M52 52 Q48 70 50 85 Q54 100 60 110 Q66 100 70 85 Q72 70 75 48" fill="none" stroke="rgba(255,255,255,0.50)" strokeWidth="1.5"/>
                    {/* Thumb */}
                    <path d="M52 52 Q44 48 40 56 Q38 64 46 68" fill="none" stroke="rgba(255,255,255,0.52)" strokeWidth="1.5"/>
                    {/* Pressure point — LI4 webbing */}
                    <circle cx="52" cy="57" r="5" fill="var(--amber)" opacity="0.9"/>
                    <circle cx="52" cy="57" r="9" fill="none" stroke="var(--amber)" strokeWidth="0.5" opacity="0.3"/>
                    {/* Label */}
                    <text x="80" y="140" textAnchor="middle" fill="rgba(255,255,255,0.72)" fontSize="9" fontFamily="'IBM Plex Mono', monospace">LI4 · thumb–index web</text>
                  </>}

                  {a.name === "Gut & Core" && <>
                    {/* Arm outline — inner wrist */}
                    <path d="M55 20 L55 100 Q55 112 65 118 Q75 124 85 118 Q95 112 95 100 L95 20" fill="none" stroke="rgba(255,255,255,0.52)" strokeWidth="1.6"/>
                    {/* Wrist crease */}
                    <line x1="52" y1="95" x2="98" y2="95" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2"/>
                    <line x1="52" y1="100" x2="98" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="1.2"/>
                    {/* Two tendons */}
                    <line x1="72" y1="20" x2="72" y2="92" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" strokeDasharray="2,3"/>
                    <line x1="78" y1="20" x2="78" y2="92" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" strokeDasharray="2,3"/>
                    {/* Pressure point — PC6, 3 fingers below wrist */}
                    <circle cx="75" cy="78" r="5" fill="var(--amber)" opacity="0.9"/>
                    <circle cx="75" cy="78" r="9" fill="none" stroke="var(--amber)" strokeWidth="0.5" opacity="0.3"/>
                    {/* 3-finger measurement indicator */}
                    <line x1="104" y1="78" x2="104" y2="95" stroke="rgba(255,255,255,0.50)" strokeWidth="1.2"/>
                    <line x1="101" y1="78" x2="107" y2="78" stroke="rgba(255,255,255,0.50)" strokeWidth="1.2"/>
                    <line x1="101" y1="95" x2="107" y2="95" stroke="rgba(255,255,255,0.50)" strokeWidth="1.2"/>
                    <text x="112" y="88" fill="rgba(255,255,255,0.25)" fontSize="7" fontFamily="'IBM Plex Mono', monospace">3 fin</text>
                    {/* Label */}
                    <text x="80" y="150" textAnchor="middle" fill="rgba(255,255,255,0.72)" fontSize="9" fontFamily="'IBM Plex Mono', monospace">PC6 · inner wrist</text>
                  </>}

                  {a.name === "Legs & Feet" && <>
                    {/* Knee outline */}
                    <ellipse cx="80" cy="42" rx="22" ry="18" fill="none" stroke="rgba(255,255,255,0.52)" strokeWidth="1.5"/>
                    {/* Thigh */}
                    <line x1="64" y1="36" x2="58" y2="10" stroke="rgba(255,255,255,0.50)" strokeWidth="1.6"/>
                    <line x1="96" y1="36" x2="102" y2="10" stroke="rgba(255,255,255,0.50)" strokeWidth="1.6"/>
                    {/* Shin */}
                    <line x1="66" y1="58" x2="62" y2="120" stroke="rgba(255,255,255,0.52)" strokeWidth="1.6"/>
                    <line x1="94" y1="58" x2="98" y2="120" stroke="rgba(255,255,255,0.52)" strokeWidth="1.6"/>
                    {/* Shin bone — tibia */}
                    <line x1="74" y1="58" x2="72" y2="118" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" strokeDasharray="3,3"/>
                    {/* 4-finger measurement */}
                    <line x1="108" y1="62" x2="108" y2="94" stroke="rgba(255,255,255,0.50)" strokeWidth="1.2"/>
                    <line x1="105" y1="62" x2="111" y2="62" stroke="rgba(255,255,255,0.50)" strokeWidth="1.2"/>
                    <line x1="105" y1="94" x2="111" y2="94" stroke="rgba(255,255,255,0.50)" strokeWidth="1.2"/>
                    <text x="115" y="80" fill="rgba(255,255,255,0.25)" fontSize="7" fontFamily="'IBM Plex Mono', monospace">4 fin</text>
                    {/* Pressure point — ST36, 4 fingers below kneecap */}
                    <circle cx="80" cy="94" r="5" fill="var(--amber)" opacity="0.9"/>
                    <circle cx="80" cy="94" r="9" fill="none" stroke="var(--amber)" strokeWidth="0.5" opacity="0.3"/>
                    {/* Label */}
                    <text x="80" y="148" textAnchor="middle" fill="rgba(255,255,255,0.72)" fontSize="9" fontFamily="'IBM Plex Mono', monospace">ST36 · below kneecap</text>
                  </>}
                </svg>
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10 }}>
                Visual legend: amber circle = where to apply pressure.
              </div>

              <div style={{ background: "var(--amber-glow)", border: "1px solid var(--amber-dim)", borderRadius: "var(--r-lg)", padding: "16px 20px" }}>
                <div style={{ fontSize: 15, fontWeight: 500, color: "var(--amber)", marginBottom: 10 }}>{a.pointEffect}</div>
                <div style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.7, marginBottom: 10 }}><strong>Where:</strong> {a.pointLocation}</div>
                <div style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.7, marginBottom: 10 }}><strong>How:</strong> {a.pointInstruction}</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", fontStyle: "italic", marginBottom: 8 }}>{a.benefit}</div>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowPointName(!showPointName); }}
                  style={{ background: "none", border: "none", fontSize: 11, color: "var(--text-muted)", cursor: "pointer", padding: 0, letterSpacing: "0.06em" }}
                >
                  {showPointName ? `▾ ${a.pointName}` : "▸ Acupressure point name"}
                </button>
              </div>
              {!holding && holdCount === 0 && (
                <div style={{ display: "flex", gap: 8, marginTop: 16, alignItems: "center" }}>
                  <button className="btn btn-primary" style={{ flex: 1, fontSize: 13 }}
                    onClick={(e) => { e.stopPropagation(); startHold(); }}>
                    Start {holdTarget}s hold
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); toggleAudio(); }} style={{
                    background: audioOn ? "var(--amber-glow)" : "var(--surface)",
                    border: `1px solid ${audioOn ? "var(--amber-dim)" : "var(--border)"}`,
                    borderRadius: "var(--r-lg)", padding: "8px 12px", fontSize: 11, cursor: "pointer",
                    color: audioOn ? "var(--amber)" : "var(--text-dim)", fontFamily: "'DM Sans', sans-serif"
                  }}>
                    {audioOn ? "♪" : "♪"}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleNext(); }} style={{
                    background: "none", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                    padding: "8px 12px", fontSize: 11, cursor: "pointer",
                    color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif"
                  }}>
                    Skip →
                  </button>
                </div>
              )}
              {(holding || holdCount > 0) && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 8, letterSpacing: "0.08em" }}>
                    {holding ? `HOLDING — ${holdTarget - holdCount}s remaining` : "HOLD COMPLETE"}
                  </div>
                  <div style={{ background: "var(--border)", borderRadius: "var(--r)", height: 4, overflow: "hidden" }}>
                    <div style={{ width: `${holdProgress}%`, height: "100%", background: holdProgress >= 100 ? "var(--green)" : "var(--amber)", transition: "width 1s linear" }} />
                  </div>
                  {holding && (
                    <>
                      {area.holdObservation && (
                        <div style={{ marginTop: 16, fontSize: 13, color: "var(--text-dim)", fontStyle: "italic", lineHeight: 1.7, padding: "12px 16px", background: "var(--surface)", borderRadius: "var(--r-lg)", border: "0.5px solid var(--border)" }}>
                          {area.holdObservation}
                        </div>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); handleNext(); }} style={{
                        background: "none", border: "none", fontSize: 11, color: "var(--text-muted)",
                        cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginTop: 12,
                        letterSpacing: "0.06em"
                      }}>
                        Skip →
                      </button>
                    </>
                  )}
                  {!holding && holdCount >= holdTarget && (() => {
                    setTimeout(() => handleNext(), 1500);
                    return (
                      <div style={{ marginTop: 16 }}>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", animation: "pulse 1s ease-in-out infinite", marginBottom: 8 }}>
                          {currentArea < areas.length - 1 ? "Moving to next area…" : "Scan complete…"}
                        </div>
                        <button className="btn btn-ghost" style={{ fontSize: 12 }}
                          onClick={(e) => { e.stopPropagation(); handleNext(); }}>
                          Skip ahead →
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function ToolDebriefGate({ toolId, regulationType, onContinue }) {
  const promptSet = getToolDebriefPromptSet(toolId, regulationType);
  const [selected, setSelected] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(20);

  useEffect(() => {
    setSecondsLeft(20);
    setSelected("");
  }, [toolId, regulationType]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((prev) => Math.max(0, prev - 1)), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const options = Array.isArray(promptSet?.options) ? promptSet.options : [];
  const continueEnabled = secondsLeft === 0 && !!selected;

  return (
    <div style={{ maxWidth: 460, margin: "0 auto", paddingTop: 10 }}>
      <div style={{ background: "var(--surface)", border: "0.5px solid var(--amber-dim)", borderRadius: "var(--r-lg)", padding: "18px 16px" }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 8 }}>
          Lock in how you processed
        </div>
        <div style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6, marginBottom: 10 }}>
          {promptSet?.prompt || "Choose one line that best fits this session."}
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 12 }}>
          20-second capture required before exit.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
          {options.map((option) => (
            <button
              key={option}
              onClick={() => setSelected(option)}
              style={{
                textAlign: "left",
                background: selected === option ? "var(--amber-glow)" : "var(--surface2)",
                border: `0.5px solid ${selected === option ? "var(--amber-dim)" : "var(--border)"}`,
                borderRadius: "var(--r-sm)",
                padding: "10px 12px",
                color: selected === option ? "var(--amber)" : "var(--text-dim)",
                cursor: "pointer",
                fontSize: 12,
                lineHeight: 1.45,
                fontFamily: "'DM Sans', sans-serif"
              }}
            >
              {option}
            </button>
          ))}
          <button
            onClick={() => setSelected("I need another pass to lock this in.")}
            style={{
              textAlign: "left",
              background: selected === "I need another pass to lock this in." ? "var(--amber-glow)" : "var(--surface2)",
              border: `0.5px solid ${selected === "I need another pass to lock this in." ? "var(--amber-dim)" : "var(--border)"}`,
              borderRadius: "var(--r-sm)",
              padding: "10px 12px",
              color: selected === "I need another pass to lock this in." ? "var(--amber)" : "var(--text-dim)",
              cursor: "pointer",
              fontSize: 12,
              lineHeight: 1.45,
              fontFamily: "'DM Sans', sans-serif"
            }}
          >
            I need another pass to lock this in.
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: secondsLeft > 0 ? "var(--text-muted)" : "var(--amber)", letterSpacing: "0.08em" }}>
            {secondsLeft > 0 ? `READY IN ${secondsLeft}s` : "READY"}
          </div>
          <button
            className="btn btn-primary"
            disabled={!continueEnabled}
            onClick={() => continueEnabled && onContinue(selected)}
            style={{ opacity: continueEnabled ? 1 : 0.45, cursor: continueEnabled ? "pointer" : "not-allowed" }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function NextMoveStep({
  onConfirm,
  onSkip,
  title = "Next Move",
  description = "Choose one concrete action before you leave this session.",
  confirmLabel = "Save next move",
  skipLabel = "Skip for now"
}) {
  const [selectedActionId, setSelectedActionId] = useState(null);
  const [customAction, setCustomAction] = useState("");
  const selectedAction = NEXT_MOVE_ACTION_OPTIONS.find((item) => item.id === selectedActionId) || null;
  const cleanedCustomAction = String(customAction || "").trim().slice(0, 180);
  const ready = !!selectedActionId && (selectedActionId !== "custom" || cleanedCustomAction.length > 0);

  const handleConfirm = () => {
    if (!ready || typeof onConfirm !== "function") return;
    const label = selectedActionId === "custom"
      ? cleanedCustomAction
      : (selectedAction?.label || NEXT_MOVE_ACTION_LABELS[selectedActionId] || "Next move");
    onConfirm({
      id: `nextmove_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      actionId: selectedActionId,
      label,
      customText: selectedActionId === "custom" ? cleanedCustomAction : null,
      createdAt: new Date().toISOString(),
      followUp: {
        dueAt: new Date(Date.now() + NEXT_MOVE_FOLLOW_UP_DELAY_MS).toISOString()
      }
    });
  };

  return (
    <div style={{ maxWidth: 460, margin: "0 auto", paddingTop: 10 }}>
      <div style={{ background: "var(--surface)", border: "0.5px solid var(--amber-dim)", borderRadius: "var(--r-lg)", padding: "18px 16px" }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 8 }}>
          {title}
        </div>
        <div style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6, marginBottom: 12 }}>
          {description}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {NEXT_MOVE_ACTION_OPTIONS.map((item) => {
            const active = selectedActionId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedActionId(item.id)}
                style={{
                  background: active ? "var(--amber-glow)" : "var(--surface2)",
                  border: `0.5px solid ${active ? "var(--amber-dim)" : "var(--border)"}`,
                  borderRadius: 999,
                  padding: "7px 12px",
                  color: active ? "var(--amber)" : "var(--text-dim)",
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif"
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        {selectedActionId === "custom" && (
          <div style={{ marginBottom: 14 }}>
            <textarea
              value={customAction}
              onChange={(event) => setCustomAction(String(event.target.value || "").slice(0, 180))}
              placeholder="Name one specific action you will take."
              rows={3}
              style={{
                width: "100%",
                background: "var(--surface2)",
                border: "0.5px solid var(--border)",
                borderRadius: "var(--r)",
                padding: "10px 12px",
                color: "var(--text)",
                fontSize: 12,
                lineHeight: 1.5,
                fontFamily: "'DM Sans', sans-serif",
                resize: "vertical",
                outline: "none"
              }}
            />
            <div style={{ marginTop: 6, fontSize: 10, color: "var(--text-muted)", textAlign: "right" }}>
              {Math.max(0, 180 - String(customAction || "").length)} characters left
            </div>
          </div>
        )}
        <button
          className="btn btn-primary"
          disabled={!ready}
          onClick={handleConfirm}
          style={{ width: "100%", opacity: ready ? 1 : 0.45, cursor: ready ? "pointer" : "not-allowed" }}
        >
          {confirmLabel}
        </button>
        {typeof onSkip === "function" && (
          <button
            className="btn btn-ghost"
            onClick={onSkip}
            style={{ width: "100%", marginTop: 8 }}
          >
            {skipLabel}
          </button>
        )}
      </div>
    </div>
  );
}

function NextMoveFollowUpCard({ session, onSubmit }) {
  const [didIt, setDidIt] = useState(null);
  const [helped, setHelped] = useState(null);
  const sessionTimestamp = String(session?.timestamp || "");
  const nextMoveLabel = getNextMoveLabel(session?.nextMove) || "that next move";

  useEffect(() => {
    setDidIt(null);
    setHelped(null);
  }, [sessionTimestamp]);

  useEffect(() => {
    if (didIt !== "yes") setHelped(null);
  }, [didIt]);

  if (!sessionTimestamp) return null;

  const helpedRequired = didIt === "yes";
  const submitReady = didIt !== null && (!helpedRequired || helped !== null);
  const handleSubmit = () => {
    if (!submitReady || typeof onSubmit !== "function") return;
    const didItCompleted = didIt === "yes";
    onSubmit({
      sessionTimestamp,
      didIt: didItCompleted ? true : null,
      helped: didItCompleted
        ? (helped === "yes" ? true : helped === "no" ? false : null)
        : null
    });
  };

  return (
    <div style={{ marginBottom: 16, background: "var(--surface)", border: "0.5px solid var(--amber-dim)", borderRadius: "var(--r)", padding: "14px 14px 12px" }}>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 8 }}>
        Next Move follow-up
      </div>
      <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.55, marginBottom: 10 }}>
        You chose: <span style={{ color: "var(--text)" }}>{nextMoveLabel}</span>
      </div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>Did you do it?</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[
            { id: "yes", label: "Yes" },
            { id: "not-yet", label: "Not yet" }
          ].map((item) => {
            const active = didIt === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setDidIt(item.id)}
                style={{
                  background: active ? "var(--amber-glow)" : "transparent",
                  border: `1px solid ${active ? "var(--amber-dim)" : "var(--border)"}`,
                  borderRadius: 999,
                  padding: "5px 11px",
                  fontSize: 11,
                  color: active ? "var(--amber)" : "var(--text-muted)",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif"
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>Did it help?</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", opacity: helpedRequired ? 1 : 0.5 }}>
          {[
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
            { id: "not-sure", label: "Not sure yet" }
          ].map((item) => {
            const active = helped === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (!helpedRequired) return;
                  setHelped(item.id);
                }}
                style={{
                  background: active ? "var(--amber-glow)" : "transparent",
                  border: `1px solid ${active ? "var(--amber-dim)" : "var(--border)"}`,
                  borderRadius: 999,
                  padding: "5px 11px",
                  fontSize: 11,
                  color: active ? "var(--amber)" : "var(--text-muted)",
                  cursor: helpedRequired ? "pointer" : "not-allowed",
                  fontFamily: "'DM Sans', sans-serif"
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        {!helpedRequired && (
          <div style={{ marginTop: 6, fontSize: 10, color: "var(--text-muted)" }}>
            Optional until you complete the action.
          </div>
        )}
      </div>
      <button
        className="btn btn-primary"
        disabled={!submitReady}
        onClick={handleSubmit}
        style={{ width: "100%", opacity: submitReady ? 1 : 0.45, cursor: submitReady ? "pointer" : "not-allowed" }}
      >
        Save follow-up
      </button>
    </div>
  );
}

// Speech-to-text hook — uses Web Speech API (free, built into browsers)
function useSpeechToText(onResult) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const intentionalStop = useRef(false);

  const toggle = () => {
    if (listening) {
      intentionalStop.current = true;
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    intentionalStop.current = false;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) transcript += event.results[i][0].transcript;
      }
      if (transcript) onResult(transcript);
    };
    recognition.onerror = () => { intentionalStop.current = true; setListening(false); };
    recognition.onend = () => {
      // Mobile Chrome kills continuous recognition after each pause
      // Auto-restart unless user intentionally stopped
      if (!intentionalStop.current) {
        try { recognition.start(); } catch { setListening(false); }
      } else {
        setListening(false);
      }
    };
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  useEffect(() => { return () => { intentionalStop.current = true; recognitionRef.current?.stop(); }; }, []);

  const supported = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
  return { listening, toggle, supported };
}

// Reusable mic button for any text field
function MicButton({ onTranscript }) {
  const speech = useSpeechToText(onTranscript);
  if (!speech.supported) return null;
  return (
    <button onClick={speech.toggle} style={{
      background: speech.listening ? "rgba(200,60,60,0.15)" : "var(--surface)",
      border: `1px solid ${speech.listening ? "rgba(200,60,60,0.4)" : "var(--border)"}`,
      borderRadius: "var(--r-lg)", padding: "6px 12px", cursor: "pointer", fontSize: 12,
      color: speech.listening ? "rgba(200,80,80,0.9)" : "var(--text-dim)",
      fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
      animation: speech.listening ? "pulse 1.5s ease-in-out infinite" : "none"
    }}>
      🎙 {speech.listening ? "Listening..." : "Speak"}
    </button>
  );
}

// ─── SUPABASE CLOUD SYNC ─────────────────────────────────────────────────────
const SUPABASE_URL = "https://pxrewildfnbxlygjofpx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4cmV3aWxkZm5ieGx5Z2pvZnB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NTAxMDcsImV4cCI6MjA5MTMyNjEwN30.r3Pdm3XoZVPlUFgKCPLtfkSrHKIxVcwFW4tuUP23Vns";
const APP_VERSION = "1.0.0";
const APP_PACKAGE_VERSION = __APP_PACKAGE_VERSION__;
const APP_BUILD_TIME = __APP_BUILD_TIME__;
const SYNC_KEYS = ["stillform_sessions","stillform_journal","stillform_focus_check_history","stillform_communication_events","stillform_tool_debriefs","stillform_signal_profile","stillform_bias_profile","stillform_saved_reframes","stillform_ai_session_notes","stillform_regulation_type","stillform_breath_pattern","stillform_onboarded","stillform_reminder","stillform_reminder_time","stillform_audio","stillform_scan_pace","stillform_screenlight","stillform_reducedmotion","stillform_visual_grounding","stillform_morning_breath_cue","stillform_subscribed","stillform_trial_start","stillform_qb_position","stillform_checkin_open_history","stillform_checkin_history","stillform_eod_open_history","stillform_eod_history","stillform_loop_nudge_events","stillform_loop_nudge_dismissed_day","stillform_loop_nudge_dismiss_streak","stillform_theme","stillform_high_contrast","stillform_ai_tone","stillform_biometric_enabled"];
const sbFetch = async (path, opts = {}) => {
  const s = (() => { try { return JSON.parse(localStorage.getItem("stillform_sb_session")||"null"); } catch { return null; } })();
  const res = await fetch(SUPABASE_URL + path, { ...opts, headers: { "Content-Type":"application/json", apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${s?.access_token||SUPABASE_ANON_KEY}`, ...(opts.headers||{}) } });
  if (!res.ok) {
    const e = await res.json().catch(()=>({}));
    if (res.status === 429) {
      throw new Error("Too many attempts right now. Please wait about a minute, then try again.");
    }
    throw new Error(e.message||"Supabase "+res.status);
  }
  return res.json().catch(()=>null);
};
const sbGetSession = () => { try { return JSON.parse(localStorage.getItem("stillform_sb_session")||"null"); } catch { return null; } };
const sbSetSession = s => { try { localStorage.setItem("stillform_sb_session", JSON.stringify(s)); } catch {} };
const sbClearSession = () => { try { localStorage.removeItem("stillform_sb_session"); } catch {} };
const sbIsSignedIn = () => !!sbGetSession()?.access_token;
const sbGetUser = () => sbGetSession()?.user || null;
const sbNormalizeSession = (d) => {
  // Supabase returns different shapes for signup vs signin — normalize to same structure
  if (d?.session?.access_token) return { ...d.session, user: d.user || d.session.user };
  if (d?.access_token) return d;
  return null;
};
const sbSignUp = async (email, password) => {
  const d = await sbFetch("/auth/v1/signup", { method:"POST", body: JSON.stringify({email, password}) });
  const session = sbNormalizeSession(d);
  if (session) sbSetSession(session);
  return d;
};
const sbSignIn = async (email, password) => {
  const d = await sbFetch("/auth/v1/token?grant_type=password", { method:"POST", body: JSON.stringify({email, password}) });
  const session = sbNormalizeSession(d);
  if (session) sbSetSession(session);
  return d;
};
const sbSignOut = async () => { try { await sbFetch("/auth/v1/logout", {method:"POST"}); } catch {} sbClearSession(); };
const sbRefreshSession = async () => {
  const s = sbGetSession(); if (!s?.refresh_token) return null;
  try { const d = await sbFetch("/auth/v1/token?grant_type=refresh_token", {method:"POST",body:JSON.stringify({refresh_token:s.refresh_token})}); const session = sbNormalizeSession(d); if (session) { sbSetSession(session); return session; } } catch {}
  sbClearSession(); return null;
};
const getSyncEncKey = async () => {
  try {
    const db = await new Promise((res,rej) => { const r=indexedDB.open("stillform_keys",1); r.onupgradeneeded=e=>e.target.result.createObjectStore("keys"); r.onsuccess=e=>res(e.target.result); r.onerror=()=>rej(r.error); });
    return new Promise((res,rej) => {
      const tx=db.transaction("keys","readwrite"), store=tx.objectStore("keys"), get=store.get("sync_key");
      get.onsuccess = async () => { if (get.result) { res(get.result); return; } const k=await crypto.subtle.generateKey({name:"AES-GCM",length:256},true,["encrypt","decrypt"]); store.put(k,"sync_key"); res(k); };
      get.onerror=()=>rej(get.error);
    });
  } catch { return null; }
};
const encryptForCloud = async data => {
  try {
    const key=await getSyncEncKey(); if (!key) return JSON.stringify(data);
    const iv=crypto.getRandomValues(new Uint8Array(12));
    const enc=await crypto.subtle.encrypt({name:"AES-GCM",iv},key,new TextEncoder().encode(JSON.stringify(data)));
    return JSON.stringify({__enc:true,iv:Array.from(iv),data:Array.from(new Uint8Array(enc))});
  } catch { return JSON.stringify(data); }
};
const decryptFromCloud = async blob => {
  try {
    const p=JSON.parse(blob); if (!p.__enc) return p;
    const key=await getSyncEncKey(); if (!key) return null;
    const dec=await crypto.subtle.decrypt({name:"AES-GCM",iv:new Uint8Array(p.iv)},key,new Uint8Array(p.data));
    return JSON.parse(new TextDecoder().decode(dec));
  } catch { return null; }
};
const UNENCRYPTED_SYNC_KEYS = new Set(["stillform_onboarded", "stillform_regulation_type", "stillform_breath_pattern", "stillform_theme", "stillform_high_contrast", "stillform_ai_tone", "stillform_audio", "stillform_scan_pace", "stillform_screenlight", "stillform_reducedmotion", "stillform_visual_grounding", "stillform_morning_breath_cue", "stillform_reminder", "stillform_reminder_time", "stillform_qb_position","stillform_biometric_enabled"]);

const sbSyncUp = async () => {
  if (!sbIsSignedIn()) return {ok:false,reason:"not_signed_in"};
  const user=sbGetUser(); if (!user?.id) return {ok:false,reason:'no_user_id'}; let uploaded=0; const errors=[];
  for (const key of SYNC_KEYS) {
    try {
      const raw=localStorage.getItem(key); if (raw===null) continue;
      // Non-sensitive routing/preference keys stored as plaintext for cross-device restore
      const enc = UNENCRYPTED_SYNC_KEYS.has(key) ? JSON.stringify(raw) : await encryptForCloud(raw);
      await sbFetch("/rest/v1/user_data?on_conflict=user_id%2Cdata_key",{method:"POST",headers:{"Prefer":"resolution=merge-duplicates"},body:JSON.stringify({user_id:user.id,data_key:key,encrypted_blob:enc,app_version:APP_VERSION})});
      uploaded++;
    } catch { errors.push(key); }
  }
  try { window.plausible?.("Cloud Sync Up",{props:{keys:uploaded}}); } catch {}
  return {ok:errors.length===0,uploaded,errors};
};
const sbSyncDown = async () => {
  if (!sbIsSignedIn()) return {ok:false,reason:"not_signed_in"};
  const user = sbGetUser();
  if (!user?.id) return {ok:false,reason:"no_user_id"};
  let restored=0; const errors=[]; let undecryptable=0; const restoredKeys = new Set();
  // Keys that must never be overwritten with empty/null from cloud
  const CRITICAL_KEYS = new Set(["stillform_onboarded","stillform_regulation_type","stillform_signal_profile","stillform_bias_profile"]);
  try {
    const rows=await sbFetch(`/rest/v1/user_data?select=data_key,encrypted_blob,updated_at&user_id=eq.${encodeURIComponent(user.id)}&order=updated_at.desc`);
    if (!rows?.length) return {ok:true,restored:0};
    for (const row of rows) {
      if (!row?.data_key || restoredKeys.has(row.data_key)) continue;
      try {
        const dec=await decryptFromCloud(row.encrypted_blob);
        if (dec!==null) {
          const val = typeof dec==="string"?dec:JSON.stringify(dec);
          // Never overwrite critical keys with empty/null values from cloud
          if (CRITICAL_KEYS.has(row.data_key) && (!val || val === "null" || val === "")) {
            restoredKeys.add(row.data_key);
            continue;
          }
          // Never overwrite a valid local critical key with a blank cloud value
          if (CRITICAL_KEYS.has(row.data_key)) {
            const local = localStorage.getItem(row.data_key);
            if (local && local !== "null" && local !== "") {
              // Local has data — only overwrite if cloud value is richer
              // For onboarded: keep local if it says "yes"
              if (row.data_key === "stillform_onboarded" && local === "yes") {
                restoredKeys.add(row.data_key);
                continue;
              }
            }
          }
          localStorage.setItem(row.data_key,val);
          restored++;
          restoredKeys.add(row.data_key);
        } else {
          undecryptable++;
        }
      } catch {
        errors.push(row.data_key);
      }
    }
  } catch(e) { return {ok:false,reason:e.message}; }
  try { window.plausible?.("Cloud Sync Down",{props:{keys:restored}}); } catch {}
  return {ok:errors.length===0 && undecryptable===0,restored,undecryptable,errors};
};
const sbDeleteCloudData = async () => {
  if (!sbIsSignedIn()) return { ok: false, reason: "not_signed_in" };
  const user = sbGetUser();
  if (!user?.id) return { ok: false, reason: "no_user_id" };
  const errors = [];
  try {
    await sbFetch(`/rest/v1/user_data?user_id=eq.${encodeURIComponent(user.id)}`, {
      method: "DELETE",
      headers: { Prefer: "return=minimal" }
    });
  } catch (e) {
    errors.push(`user_data:${e?.message || "delete_failed"}`);
  }
  try {
    await sbFetch(`/rest/v1/backups?user_id=eq.${encodeURIComponent(user.id)}`, {
      method: "DELETE",
      headers: { Prefer: "return=minimal" }
    });
  } catch (e) {
    errors.push(`backups:${e?.message || "delete_failed"}`);
  }
  return { ok: errors.length === 0, errors };
};
const sbPreUpdateBackup = async () => {
  if (!sbIsSignedIn()) return {ok:false};
  const user=sbGetUser();
  try {
    const snap={}; for (const k of SYNC_KEYS) { const v=localStorage.getItem(k); if (v!==null) snap[k]=v; }
    await sbFetch("/rest/v1/backups",{method:"POST",body:JSON.stringify({user_id:user.id,backup_blob:await encryptForCloud(snap),app_version:APP_VERSION,trigger_type:"pre-update"})});
    try { window.plausible?.("Pre-Update Backup"); } catch {}
    return {ok:true};
  } catch(e) { return {ok:false,reason:e.message}; }
};
const sbVersionCheck = async () => {
  try { const last=localStorage.getItem("stillform_app_version"); if (last&&last!==APP_VERSION) await sbPreUpdateBackup(); localStorage.setItem("stillform_app_version",APP_VERSION); } catch {}
};
const sbCreateProfile = async () => {
  if (!sbIsSignedIn()) return;
  const user=sbGetUser();
  try { await sbFetch("/rest/v1/user_profiles",{method:"POST",headers:{"Prefer":"resolution=ignore-duplicates"},body:JSON.stringify({id:user.id,app_version:APP_VERSION,last_seen:new Date().toISOString()})}); } catch {}
};
const INSTALL_ID_KEY = "stillform_install_id";
const getOrCreateInstallId = () => {
  try {
    const existing = localStorage.getItem(INSTALL_ID_KEY);
    if (existing) return existing;
    const next = (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function")
      ? crypto.randomUUID()
      : `sf_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(INSTALL_ID_KEY, next);
    return next;
  } catch {
    return null;
  }
};
const sbCheckSubscriptionStatus = async () => {
  const installId = getOrCreateInstallId();
  const token = sbGetSession()?.access_token;
  const params = new URLSearchParams();
  if (installId) params.set("install_id", installId);
  const url = `${NETLIFY_BASE}/.netlify/functions/subscription-status${params.toString() ? `?${params.toString()}` : ""}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  if (!res.ok) throw new Error(`Subscription status ${res.status}`);
  return res.json().catch(() => null);
};
const SUBSCRIBE_PENDING_KEY = "stillform_subscribe_pending_at";
const markSubscribePending = () => {
  try { localStorage.setItem(SUBSCRIBE_PENDING_KEY, String(Date.now())); } catch {}
};
const clearSubscribePending = () => {
  try { localStorage.removeItem(SUBSCRIBE_PENDING_KEY); } catch {}
};
const hasFreshSubscribePending = (windowMs) => {
  try {
    const ts = Number(localStorage.getItem(SUBSCRIBE_PENDING_KEY) || "0");
    if (!ts) return false;
    return Date.now() - ts < windowMs;
  } catch {
    return false;
  }
};
const SUBSCRIPTION_PENDING_GRACE_MS = 20 * 60 * 1000;
// ─────────────────────────────────────────────────────────────────────────────
// ─── ENCRYPTION UTILITY ──────────────────────────────────────────────────────
// Device-local AES-GCM encryption for sensitive conversation data.
// Key is generated once per device and stored in IndexedDB.
// Data is encrypted at rest in localStorage — not readable by other services.
const CryptoStore = (() => {
  const DB_NAME = "stillform_keys";
  const KEY_NAME = "device_key";

  const getDB = () => new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = e => e.target.result.createObjectStore("keys");
    req.onsuccess = e => resolve(e.target.result);
    req.onerror = () => reject(req.error);
  });

  const getOrCreateKey = async () => {
    try {
      const db = await getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction("keys", "readwrite");
        const store = tx.objectStore("keys");
        const getReq = store.get(KEY_NAME);
        getReq.onsuccess = async () => {
          if (getReq.result) { resolve(getReq.result); return; }
          const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
          store.put(key, KEY_NAME);
          resolve(key);
        };
        getReq.onerror = () => reject(getReq.error);
      });
    } catch { return null; }
  };

  const encrypt = async (data) => {
    try {
      const key = await getOrCreateKey();
      if (!key) return data; // fallback to plain if crypto unavailable
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encoded = new TextEncoder().encode(JSON.stringify(data));
      const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
      return { __enc: true, iv: Array.from(iv), data: Array.from(new Uint8Array(encrypted)) };
    } catch { return data; }
  };

  const decrypt = async (stored) => {
    try {
      if (!stored?.__enc) return stored;
      const key = await getOrCreateKey();
      if (!key) return null;
      const iv = new Uint8Array(stored.iv);
      const data = new Uint8Array(stored.data);
      const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
      return JSON.parse(new TextDecoder().decode(decrypted));
    } catch { return null; }
  };

  return { encrypt, decrypt };
})();

// Encrypted get/set for sensitive keys
async function secureGet(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.__enc) return await CryptoStore.decrypt(parsed);
    return parsed;
  } catch { return null; }
}
async function secureSet(key, value) {
  try {
    const encrypted = await CryptoStore.encrypt(value);
    localStorage.setItem(key, JSON.stringify(encrypted));
  } catch {}
}

// ─── IMAGE OCR UTILITY ───────────────────────────────────────────────────────
// Loads Tesseract.js lazily from CDN — only when user taps the upload button
// Extracts text from screenshots (emails, texts, social posts) client-side
// No data leaves the device — all processing happens in the browser
// GPT-4o vision handles image reading


function ReframeTool({ onComplete, mode = "calm", defaultTab = "talk", sharedText = null, onSharedTextConsumed = null, toolBackOverrideRef = null }) {
  const POSITIVE_STATE_PATTERNS = [
    "not so bad",
    "figured it out",
    "figured out",
    "found a way",
    "worked out",
    "working out",
    "in a good place",
    "better now",
    "doing better",
    "feel better now",
    "feeling better now",
    "good now",
    "okay now",
    "calmer now",
    "more clear now",
    "relieved",
    "relief",
    "that helped",
    "it helped",
    "i'm proud",
    "im proud",
    "small win",
    "win today",
    "good news",
    "made it work",
    "got through it"
  ];
  const [activeMode, setActiveMode] = useState(() => {
    return mode !== "calm" ? mode : null;
  });
  const [showPostRating, setShowPostRating] = useState(false);
  const [postNextMoveId, setPostNextMoveId] = useState(null);
  const [showPostInsight, setShowPostInsight] = useState(false);
  const [showStateToStatement, setShowStateToStatement] = useState(false);
  const [postRating, setPostRating] = useState(null);
  const [entryMode, setEntryMode] = useState(null);
  const [entryProtocolId, setEntryProtocolId] = useState(null);
  const [externalAnchorDraft, setExternalAnchorDraft] = useState("");
  const [externalAnchorCopied, setExternalAnchorCopied] = useState(false);
  const [externalAnchorSent, setExternalAnchorSent] = useState(false);
  const [stateToStatementExpanded, setStateToStatementExpanded] = useState(true);
  const [sessionShareSummary, setSessionShareSummary] = useState(null);
  const [postSessionInsight, setPostSessionInsight] = useState(null);
  const [communicationSkipReason, setCommunicationSkipReason] = useState(null);
  const communicationDraftLoggedRef = useRef(false);
  const communicationOpportunityLoggedRef = useRef(false);
  const communicationExpandedRef = useRef(false);
  const stateToStatementSessionIdRef = useRef(null);
  const latestSessionTimestampRef = useRef(null);
  const [selfGuidedActive, setSelfGuidedActive] = useState(false);
  const [activeReframeTab, setActiveReframeTab] = useState("ai"); // "ai" | "self"
  const [showWatchChooseFlow, setShowWatchChooseFlow] = useState(false);
  const [debriefTarget, setDebriefTarget] = useState(null);
  const [nextMoveTarget, setNextMoveTarget] = useState(null);
  const [feelState, setFeelState] = useState(() => {
    // Infer from today's check-in if available — user can always override
    try {
      const checkin = JSON.parse(localStorage.getItem("stillform_checkin_today") || "null");
      if (!checkin) return null;
      const mood = (checkin.mood || "").toLowerCase();
      const stress = checkin.stressEvent;
      if (mood.match(/anxious|anxiety|nervous|worried|scared|dread|panic/)) return "anxious";
      if (mood.match(/angry|rage|furious|frustrated|irritat/)) return "angry";
      if (mood.match(/excit|hyped|pumped|happy|joy|great|amazing|wired/)) return "excited";
      if (stress && mood && mood !== "not set") return "mixed";
      return null;
    } catch { return null; }
  });
  // Auto-route mode from feel state — no user selection needed
  const autoMode = (() => {
    if (activeMode) return activeMode; // manual override still works if set programmatically
    if (feelState === "excited" || feelState === "focused") return "hype";
    if (feelState === "stuck") return "clarity"; // cognitive fog → talk it out
    return "calm"; // default — clarity mode is triggered per-message by input content
  })();
  const aiToneChoice = (() => {
    try {
      const stored = localStorage.getItem("stillform_ai_tone") || "balanced";
      return VALID_AI_TONE_IDS.has(stored) ? stored : "balanced";
    } catch {
      return "balanced";
    }
  })();
  const aiToneLabel = ({
    balanced: "Balanced",
    gentle: "Gentle",
    direct: "Direct",
    clinical: "Clinical",
    motivational: "Motivational"
  })[aiToneChoice] || "Balanced";
  const effectiveMode = autoMode;
  const regulationType = (() => {
    try {
      const value = localStorage.getItem("stillform_regulation_type");
      return value === "thought-first" || value === "body-first" ? value : "balanced";
    } catch {
      return "balanced";
    }
  })();
  const isClarity = effectiveMode === "clarity";
  const isHype = effectiveMode === "hype";
  const openingText = isHype
    ? "What are you walking into? Name it and what's making it hard."
    : "What's on your mind?";
  const STORAGE_KEY = `stillform_reframe_session_${effectiveMode}`;
  const markLastReframeMode = (nextMode) => {
    try { localStorage.setItem("stillform_reframe_last_mode", nextMode); } catch {}
  };

  useEffect(() => {
    try {
      const entry = localStorage.getItem("stillform_reframe_entry_mode");
      if (entry) {
        setEntryMode(entry);
        localStorage.removeItem("stillform_reframe_entry_mode");
      }
    } catch {}
    try {
      const protocol = localStorage.getItem("stillform_reframe_entry_protocol");
      if (protocol) {
        setEntryProtocolId(protocol);
        localStorage.removeItem("stillform_reframe_entry_protocol");
      }
    } catch {}
  }, []);

  // Migrate old conversation from before mode-specific keys
  useEffect(() => {
    try {
      const oldKey = "stillform_reframe_session";
      const oldData = localStorage.getItem(oldKey);
      if (oldData && !localStorage.getItem("stillform_reframe_session_calm")) {
        localStorage.setItem("stillform_reframe_session_calm", oldData);
        localStorage.removeItem(oldKey);
      }
      // Migrate saved reframes missing mode tag
      const saved = JSON.parse(localStorage.getItem("stillform_saved_reframes") || "[]");
      let changed = false;
      saved.forEach(r => { if (!r.mode) { r.mode = "calm"; changed = true; } });
      if (changed) localStorage.setItem("stillform_saved_reframes", JSON.stringify(saved));
    } catch {}
  }, []);


  // TIME-TO-REGULATION
  const startTime = useRef(Date.now());
  const scoreState = (s) => ({ angry:1, anxious:2, flat:2, mixed:3, excited:4, focused:5 }[s] ?? null);
  const toUserFacingInsight = (rawNote) => {
    const cleaned = String(rawNote || "").replace(/\s+/g, " ").trim();
    if (!cleaned) return null;
    const bannedClinical = /(diagnos|disorder|clinical|patholog|bipolar|borderline|narciss|adhd|ptsd|medicat|prescrib|therapy plan|treatment plan)/i;
    const bannedJudgment = /(lazy|broken|toxic|dramatic|hopeless|unstable|crazy|weak|failure|attention-seeking)/i;
    const bannedVulnerable = /(suicid|self-harm|sexual|assault|abuse|violence|addict|overdose)/i;
    if (bannedClinical.test(cleaned) || bannedJudgment.test(cleaned) || bannedVulnerable.test(cleaned)) return null;
    return cleaned.length > 260 ? `${cleaned.slice(0, 257)}...` : cleaned;
  };
  const getLatestUserFacingInsight = () => {
    try {
      const sessions = getSessionsFromStorage();
      if (!Array.isArray(sessions) || sessions.length < 5) return null;
      const notes = JSON.parse(localStorage.getItem("stillform_ai_session_notes") || "[]");
      if (!Array.isArray(notes) || notes.length === 0) return null;
      const latest = [...notes].reverse().find((n) => n?.noteType === "user-facing" || !n?.noteType);
      if (!latest?.note) return null;
      const safeNote = latest.noteType === "user-facing" ? String(latest.note).trim() : toUserFacingInsight(latest.note);
      if (!safeNote) return null;
      return {
        note: safeNote,
        timestamp: latest.timestamp || new Date().toISOString()
      };
    } catch {
      return null;
    }
  };
  const saveSession = (postRating = null) => {
    const elapsed = Date.now() - startTime.current;
    const timestamp = new Date().toISOString();
    const fmt = (ms) => { const s = Math.round(ms / 1000); const m = Math.floor(s / 60); return m > 0 ? `${m}m ${s % 60}s` : `${s % 60}s`; };
    try {
      const entry = { timestamp, duration: elapsed, durationFormatted: fmt(elapsed), tools: ["reframe"], exitPoint: "reframe-done", source: "reframe", mode: effectiveMode, entryMode: entryMode || null, entryProtocolId: entryProtocolId || null, preRating: scoreState(feelState), preState: feelState || null };
      if (postRating) { entry.postRating = scoreState(postRating); entry.postState = postRating; }
      if (entry.preRating && entry.postRating) entry.delta = entry.postRating - entry.preRating;
      appendSessionToStorage(entry);
      // Background cloud sync — non-blocking
      if (sbIsSignedIn()) sbSyncUp().catch(() => {});
    } catch {}

    // Post-session AI summary — background call, non-blocking
    if (messages.length >= 2) {
      const authToken = sbGetSession()?.access_token || "";
      const installId = getOrCreateInstallId();
      fetch(REFRAME_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify({
          input: `INTERNAL — SESSION SUMMARY REQUEST. This is not a user message. Write 2-3 sentences capturing what mattered in this session. Focus on: what they confided, any growth or patterns you noticed, what their current concern is, and what made them feel understood (if anything). Do NOT use clinical labels. Write like a friend's mental note, not a chart entry. Return JSON: { "distortion": null, "reframe": "your session note" }`,
          mode: effectiveMode,
          aiTone: aiToneChoice,
          history: messages.map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text })),
          sessionCount: getSessionCountFromStorage(),
          install_id: installId,
          user_id: sbGetUser()?.id || null
        })
      }).then(r => r.json()).then(data => {
        if (data?.reframe) {
          try {
            const notes = JSON.parse(localStorage.getItem("stillform_ai_session_notes") || "[]");
            const userFacingNote = toUserFacingInsight(data.reframe);
            if (userFacingNote) {
              notes.push({ timestamp: new Date().toISOString(), mode: effectiveMode, note: userFacingNote, noteType: "user-facing" });
            }
            // Keep this feed light and useful.
            if (notes.length > 20) notes.splice(0, notes.length - 20);
            localStorage.setItem("stillform_ai_session_notes", JSON.stringify(notes));
          } catch {}
        }
      }).catch(() => {});
    }
    return { elapsed, timestamp };
  };

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const inputNormalized = String(input || "").trim().toLowerCase();
  const looksLikePositiveState = POSITIVE_STATE_PATTERNS.some((token) => inputNormalized.includes(token));

  // Somatic interrupt — detects rapid typing, shows body nudge
  const keystrokeTimestamps = useRef([]);
  const [somaticNudge, setSomaticNudge] = useState(null);
  const somaticTimeout = useRef(null);
  const somaticNudges = ["Drop your shoulders.", "Unclench your jaw.", "Soften your hands.", "Breathe out slowly.", "Feet on the floor."];
  const checkTypingSpeed = () => {
    const now = Date.now();
    keystrokeTimestamps.current.push(now);
    // Keep last 20 keystrokes
    if (keystrokeTimestamps.current.length > 20) keystrokeTimestamps.current.shift();
    const recent = keystrokeTimestamps.current.filter(t => now - t < 3000);
    // 15+ keystrokes in 3 seconds = rapid typing
    if (recent.length >= 15 && !somaticNudge) {
      setSomaticNudge(somaticNudges[Math.floor(Math.random() * somaticNudges.length)]);
      keystrokeTimestamps.current = [];
      if (somaticTimeout.current) clearTimeout(somaticTimeout.current);
      somaticTimeout.current = setTimeout(() => setSomaticNudge(null), 5000);
    }
  };

  // Pre-fill from share extension
  useEffect(() => {
    if (sharedText) {
      setInput(sharedText);
      if (onSharedTextConsumed) onSharedTextConsumed();
    }
  }, [sharedText]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [pendingImages, setPendingImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // ── GUARDRAILS ─────────────────────────────────────────────────────────
    const allowedTypes = ["image/jpeg","image/jpg","image/png","image/webp","image/gif","image/heic","image/heif"];
    const invalidFile = files.find(f => !allowedTypes.includes(f.type.toLowerCase()));
    if (invalidFile) { setError("Screenshots and photos only (JPG, PNG, WEBP)."); return; }
    if (files.length > 3) { setError("Maximum 3 screenshots at a time."); return; }
    const oversized = files.find(f => f.size > 10 * 1024 * 1024);
    if (oversized) { setError("Each screenshot must be under 10MB."); return; }
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    if (totalSize > 20 * 1024 * 1024) { setError("Total screenshot size must be under 20MB."); return; }

    setOcrLoading(true);
    setError(null);
    try {
      // Convert to base64 for GPT-4o vision — reads bubble layout, who said what
      const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ data: reader.result.split(",")[1], type: file.type });
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const images = await Promise.all(files.map(toBase64));
      setPendingImages(images);
      setInput(prev => prev || "What do I do with this?");
      try { window.plausible("Image Upload", { props: { count: images.length } }); } catch {}
    } catch {
      setError("Failed to load image. Try again.");
    } finally {
      setOcrLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  const messagesEndRef = useRef(null);
  const [savedIds, setSavedIds] = useState(new Set());
  const loadingTimeout = useRef(null);

  // Reset loading on mount (fixes stuck state after app background)
  useEffect(() => {
    setLoading(false);
    return () => { if (loadingTimeout.current) clearTimeout(loadingTimeout.current); };
  }, []);

  // Safety timeout: if loading > 30s, auto-reset
  useEffect(() => {
    if (loading) {
      loadingTimeout.current = setTimeout(() => {
        setLoading(false);
        setError("Connection timed out. Your message is saved — tap Retry to send it again.");
      }, 30000);
    } else {
      if (loadingTimeout.current) clearTimeout(loadingTimeout.current);
    }
  }, [loading]);

  // Load encrypted messages on mount and mode change
  useEffect(() => {
    secureGet(STORAGE_KEY).then(saved => {
      setMessages(Array.isArray(saved) ? saved : []);
    }).catch(() => setMessages([]));
    markLastReframeMode(effectiveMode);
    setSavedIds(new Set());
    setError(null);
  }, [effectiveMode]);

  // Voice input
  const speech = useSpeechToText((transcript) => {
    setInput(prev => prev + (prev ? " " : "") + transcript);
  });

  const saveReframe = (msg, idx) => {
    try {
      const saved = JSON.parse(localStorage.getItem("stillform_saved_reframes") || "[]");
      saved.push({ text: msg.text, distortion: msg.distortion, timestamp: new Date().toISOString(), mode: effectiveMode });
      localStorage.setItem("stillform_saved_reframes", JSON.stringify(saved));
      setSavedIds(prev => new Set([...prev, idx]));
    } catch {}
  };

  const handleDoneForNow = () => {
    // Preserve thread so accidental "Done for now" never loses context.
    secureSet(STORAGE_KEY, messages).catch(() => {});
    setPostRating(null);
    setShowStateToStatement(false);
    setShowPostRating(true);
  };

  const getSavedReframes = () => {
    try { return JSON.parse(localStorage.getItem("stillform_saved_reframes") || "[]").filter(r => r.mode === effectiveMode); } catch { return []; }
  };

  // Persist encrypted messages on every change
  useEffect(() => {
    if (messages.length > 0) {
      secureSet(STORAGE_KEY, messages).catch(() => {});
      markLastReframeMode(effectiveMode);
    }
  }, [messages]);

  const lastAiRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      // Scroll so the latest AI message is visible at the top
      if (lastAiRef.current) {
        lastAiRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, 100);
  }, [messages]);

  const [lastInput, setLastInput] = useState("");

  const buildOfflineFallback = (textToSend) => {
    const priorWins = (() => {
      try {
        const sessions = getSessionsFromStorage();
        return sessions.filter(s => typeof s.delta === "number" && s.delta > 0).slice(-3);
      } catch { return []; }
    })();
    const evidence = priorWins.map(s => {
      const d = s.timestamp ? new Date(s.timestamp) : null;
      const dateStr = d && !Number.isNaN(d.getTime())
        ? d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        : "a prior session";
      return `${dateStr}: shifted +${Number(s.delta).toFixed(1)}`;
    });
    const evidenceLine = evidence.length
      ? `You've shifted before — ${evidence.map(e => e.replace("shifted ", "")).join(", ")}. That's real.`
      : null;
    return [
      "Connection dropped. Work through this on your own for now.",
      "",
      `You said: "${textToSend.trim().slice(0, 200)}${textToSend.trim().length > 200 ? "..." : ""}"`,
      "",
      "Name what you're actually feeling. One word or phrase.",
      "",
      "What's the fact — separate from what your mind is adding to it?",
      "",
      "What would you tell someone you respect if they said exactly this to you?",
      "",
      "One thing you can do in the next 90 seconds. Not later. Now.",
      ...(evidenceLine ? ["", evidenceLine] : [])
    ].join("\n");
  };

  const saveSelfGuidedSession = () => {
    try {
      const elapsedMs = Date.now() - startTime.current;
      appendSessionToStorage({
        timestamp: new Date().toISOString(),
        duration: elapsedMs,
        durationFormatted: `${Math.max(1, Math.round(elapsedMs / 1000))}s`,
        tools: ["reframe"],
        exitPoint: "reframe-offline-fallback",
        source: "reframe",
        mode: effectiveMode,
        entryMode: entryMode || null,
        selfGuided: true,
        preState: feelState || null
      });
    } catch {}
  };

  const runSelfGuidedFallback = (sourceText, reason = null) => {
    const safeInput = (sourceText || lastInput || input || "I'm overloaded and need a reset.").trim();
    const fallbackText = buildOfflineFallback(safeInput);
    setMessages(prev => [...prev, {
      role: "ai",
      text: fallbackText,
      distortion: null,
      selfGuided: true
    }]);
    saveSelfGuidedSession();
    setSelfGuidedActive(true);
    if (reason) setError(`Connection issue detected. ${reason}`);
    else setError(null);
    setLoading(false);
    try { window.plausible("Reframe Offline Fallback", { props: { mode: effectiveMode } }); } catch {}
  };

  const handleSend = async (retryText) => {
    const textToSend = retryText || input;
    if (!textToSend.trim() || loading) return;
    if (error) setError(null);
    const integrationContext = resolveIntegrationContext();
    const imagesForRequest = pendingImages.length > 0 ? pendingImages : undefined;

    const userMsg = { role: "user", text: textToSend, imageCount: imagesForRequest?.length || 0 };
    const prevMessages = retryText ? messages.slice(0, -1) : messages;
    const history = [...prevMessages, userMsg];

    setMessages(retryText ? [...prevMessages, userMsg] : [...messages, userMsg]);
    markLastReframeMode(effectiveMode);
    setLastInput(textToSend);
    if (!retryText) setInput("");
    if (imagesForRequest?.length) setPendingImages([]);
    setLoading(true);
    setError(null);
    try { window.plausible("Reframe Message", { props: { mode: effectiveMode } }); } catch {}
    if (messages.length === 4) { try { window.plausible("Reframe Deep Engagement", { props: { mode: effectiveMode } }); } catch {} }
    // Auto-log feel state to Pulse on first message of session
    if (messages.length === 0 && !retryText && feelState) {
      try {
        const entries = JSON.parse(localStorage.getItem("stillform_journal") || "[]");
        const todayIso = new Date().toISOString().split("T")[0];
        entries.unshift({ id: Date.now(), emotions: [feelState], trigger: "", date: todayIso, timestamp: new Date().toISOString(), source: "reframe-auto" });
        localStorage.setItem("stillform_journal", JSON.stringify(entries));
        try { window.plausible("Pulse Entry", { props: { source: "reframe-auto" } }); } catch {}
      } catch {}
    }

    try {
      const authToken = sbGetSession()?.access_token || "";
      const installId = getOrCreateInstallId();
      const requestBody = JSON.stringify({
          input: textToSend,
          images: imagesForRequest,
          userLocalNowMs: (() => {
            try { return Date.now(); } catch { return null; }
          })(),
          userTimeZone: (() => {
            try { return Intl.DateTimeFormat().resolvedOptions().timeZone || null; } catch { return null; }
          })(),
          mode: (() => {
            // Only force clarity when the user clearly signals repetitive thinking.
            const lower = textToSend.toLowerCase();
            const clarityTriggers = [
              "can't stop thinking",
              "cant stop thinking",
              "can't stop replaying",
              "cant stop replaying",
              "won't stop replaying",
              "wont stop replaying",
              "keep replaying",
              "over and over",
              "same thought",
              "stuck in my head",
              "spiraling",
              "i keep looping",
              "my mind won't stop",
              "my mind wont stop"
            ];
            const looksLikeResolvedOrPositive = POSITIVE_STATE_PATTERNS.some((token) => lower.includes(token));
            const looksLikeLoop = clarityTriggers.some((trigger) => lower.includes(trigger));
            if (!looksLikeResolvedOrPositive && looksLikeLoop && textToSend.split(/\s+/).length < 40) return "clarity";
            return effectiveMode;
          })(),
          history: prevMessages.map(m => ({
            role: m.role === "ai" ? "assistant" : "user",
            content: m.text
          })),
          journalContext: (() => {
            try {
              const entries = JSON.parse(localStorage.getItem("stillform_journal") || "[]");
              if (entries.length === 0) return null;
              const todayIso = new Date().toISOString().split("T")[0];
              const fmtEntry = e => {
                const emotions = e.emotions?.length ? `(${e.emotions.join(", ")})` : "";
                const trigger = e.trigger?.trim();
                const outcome = e.outcome ? ` → ${e.outcome}` : "";
                return trigger ? `${trigger} ${emotions}${outcome}`.trim() : emotions + outcome;
              };
              // Exclude auto-logged state entries from proactive prompt — feelState already passed separately
              const todayManual = entries.filter(e => e.date === todayIso && e.source !== "reframe-auto");
              const older = entries.filter(e => e.date !== todayIso && e.source !== "reframe-auto");
              let ctx = "";
              if (todayManual.length > 0) {
                ctx += "TODAY'S SIGNAL LOG ENTRIES (reference these PROACTIVELY — the user logged these today, ask if this is what's on their mind):\n";
                ctx += todayManual.map(fmtEntry).join("\n");
              }
              if (older.length > 0) {
                if (ctx) ctx += "\n\n";
                ctx += "PREVIOUS SIGNAL LOG ENTRIES (for pattern recognition only):\n";
                ctx += older.slice(-10).map(e => `[${e.date || ""}] ${fmtEntry(e)}`).join("\n");
              }
              return ctx || null;
            } catch { return null; }
          })(),
          checkinContext: (() => {
            try {
              const checkin = JSON.parse(localStorage.getItem("stillform_checkin_today") || "null");
              if (!checkin) return null;
              const parts = [];
              if (checkin.sleep) parts.push(`${checkin.sleep}h sleep`);
              if (checkin.energy) parts.push(`energy: ${checkin.energy}`);
              if (checkin.mood && checkin.mood !== "not set" && checkin.mood !== "undefined") parts.push(`mood: "${checkin.mood}"`);
              if (checkin.stressEvent) parts.push(`stress: ${checkin.stressEvent}`);
              if (checkin.bio?.length) parts.push(`hardware: ${checkin.bio.filter(b => b !== "clear").join(", ")}`);
              if (checkin.tension) {
                const high = Object.entries(checkin.tension).filter(([,v]) => v === 2).map(([k]) => k);
                const mild = Object.entries(checkin.tension).filter(([,v]) => v === 1).map(([k]) => k);
                if (high.length) parts.push(`high tension: ${high.join(", ")}`);
                if (mild.length) parts.push(`mild tension: ${mild.join(", ")}`);
              }
              if (checkin.notes) parts.push(`notes: ${checkin.notes}`);
              return parts.length ? `Today — ${parts.join(", ")}` : null;
            } catch { return null; }
          })(),
          eodContext: (() => {
            try {
              const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
              const eod = JSON.parse(localStorage.getItem("stillform_eod_today") || "null");
              if (!eod || eod.date !== yesterday) return null;
              return `YESTERDAY'S CLOSE: energy level ${eod.energy}, composure held: ${eod.composure}${eod.word ? `, one word: "${eod.word}"` : ""}. Use this as context — don't announce it unless relevant.`;
            } catch { return null; }
          })(),
          calendarContext: integrationContext.calendarContext,
          healthContext: integrationContext.healthContext,
          sessionCount: getSessionCountFromStorage(),
          scienceEvidence: (() => {
            try {
              const sessions = getSessionsFromStorage();
              const rated = sessions.filter((s) => Number.isFinite(s?.preRating) && Number.isFinite(s?.postRating));
              const recent30 = rated.filter((s) => withinDays(s?.timestamp, 30));
              const improved30 = recent30.filter((s) => (s.postRating - s.preRating) > 0).length;
              const acuteShiftRate30d = recent30.length ? Math.round((improved30 / recent30.length) * 100) : null;
              const highActivationRecoveries = recent30.filter((s) => (
                Number.isFinite(s.preRating)
                && Number.isFinite(s.postRating)
                && s.preRating <= 2
                && s.postRating >= 3
              ));
              const avgRecoveryMinutes30d = highActivationRecoveries.length
                ? Math.round(highActivationRecoveries.reduce((sum, s) => sum + (Number(s.duration) || 0), 0) / highActivationRecoveries.length / 60)
                : null;
              const morningHistory = readArrayFromStorage(LOOP_HISTORY_KEYS.morning);
              const eodHistory = readArrayFromStorage(LOOP_HISTORY_KEYS.eod);
              const morning14d = morningHistory.filter((entry) => withinDays(entry?.date || entry?.timestamp, 14)).length;
              const eod14d = eodHistory.filter((entry) => withinDays(entry?.date || entry?.timestamp, 14)).length;
              const loopCompletion14d = Math.round(((morning14d + eod14d) / (14 * 2)) * 100);
              const recent14Rated = rated.filter((s) => withinDays(s?.timestamp, 14));
              const transferDays = new Set(
                recent14Rated
                  .filter((s) => Number.isFinite(s.preRating) && Number.isFinite(s.postRating) && (s.postRating - s.preRating) >= 1)
                  .map((s) => (String(s.timestamp || "").slice(0, 10)))
                  .filter(Boolean)
              );
              const transferScore14d = Math.round((transferDays.size / 14) * 100);
              return {
                acuteShiftRate30d,
                avgRecoveryMinutes30d,
                loopCompletion14d,
                transferScore14d
              };
            } catch {
              return null;
            }
          })(),
          feelState: feelState,
          bioFilter: (() => {
            try {
              const bf = localStorage.getItem("stillform_bio_filter");
              if (!bf || bf === "clear") return null;
              const labels = {
                activated: "activated — adrenaline, butterflies, energy surging through the body",
                depleted: "low capacity — fatigue, low energy, reduced bandwidth",
                gut: "gut signal active — digestive noise, gut-brain axis engaged",
                sleep: "under-rested — brain running slower than usual",
                hormonal: "hormonal shift — cycle, inflammation, or hormonal fluctuation",
                pain: "pain active — chronic or acute, affecting state",
                medicated: "substance active — caffeine, meds, alcohol, or other input influencing state"
              };
              const filters = bf.split(",").map(f => labels[f.trim()]).filter(Boolean);
              if (filters.length === 0) return null;
              return `MULTIPLE HARDWARE STATES ACTIVE: ${filters.join(" + ")}. The combination matters — interpret their state through ALL of these filters simultaneously.`;
            } catch { return null; }
          })(),
          signalProfile: (() => {
            try {
              const p = JSON.parse(localStorage.getItem("stillform_signal_profile") || "null");
              if (!p) return null;
              const parts = [];
              if (p.firstAreas?.length) parts.push(`Body signals first in: ${p.firstAreas.join(", ")}`);
              if (p.preSensations?.length) parts.push(`Pre-escalation sensations: ${p.preSensations.join(", ")}`);
              if (p.triggers?.length) parts.push(`Known triggers: ${p.triggers.join(", ")}`);
              return parts.length ? parts.join(". ") : null;
            } catch { return null; }
          })(),
          biasProfile: (() => {
            try {
              const biases = JSON.parse(localStorage.getItem("stillform_bias_profile") || "null");
              if (!biases?.length) return null;
              return `User's identified decision patterns: ${biases.join(", ")}`;
            } catch { return null; }
          })(),
          priorToolContext: (() => {
            try {
              const sessions = getSessionsFromStorage();
              if (sessions.length === 0) return null;
              const last = sessions[sessions.length - 1];
              if (!last?.tools?.length) return null;
              const toolNames = { breathe: "Breathe (breathing + grounding)", "body-scan": "Body Scan (acupressure)", reframe: "Reframe", sigh: "Physiological Sigh" };
              const used = last.tools.map(t => toolNames[t] || t).filter(Boolean);
              if (!used.length) return null;
              let ctx = `The user just completed: ${used.join(" → ")} before opening Reframe. They've already done physical regulation. You don't need to suggest breathing or grounding — move directly to cognitive work.`;
              // Add grounding pattern if available
              try {
                const gd = JSON.parse(localStorage.getItem("stillform_grounding_data") || "[]");
                if (gd.length > 0) {
                  const recent = gd[gd.length - 1];
                  if (recent.skipped) {
                    ctx += ` They skipped grounding at step ${recent.skippedAt} of 5.`;
                  } else {
                    const wrote = (recent.steps || []).filter(s => s.wrote).length;
                    const totalSec = Math.round((recent.totalMs || 0) / 1000);
                    if (wrote > 0) ctx += ` They engaged with grounding and wrote observations on ${wrote} step${wrote > 1 ? "s" : ""}.`;
                    if (totalSec < 20) ctx += " They moved through grounding quickly — may still be activated.";
                  }
                }
              } catch {}
              return ctx;
            } catch { return null; }
          })(),
          priorModeContext: (() => {
            try {
              const otherModes = ["calm", "clarity", "hype"].filter(m => m !== effectiveMode);
              for (const m of otherModes) {
                const data = JSON.parse(localStorage.getItem(`stillform_reframe_session_${m}`) || "[]");
                if (data.length >= 2) {
                  const recent = data.slice(-4).map(msg => `${msg.role === "ai" ? "Stillform" : "User"}: ${msg.text}`).join("\n");
                  const modeLabel = { calm: "Talk it through", clarity: "Break the loop", hype: "Get ready" }[m];
                  return `USER'S PRIOR CONVERSATION (from ${modeLabel} mode, same session):\n${recent}\nThey switched modes. Use this context — don't make them repeat themselves.`;
                }
              }
              return null;
            } catch { return null; }
          })(),
          regulationType: (() => { try { return localStorage.getItem("stillform_regulation_type") || null; } catch { return null; } })(),
          aiTone: aiToneChoice,
          sessionEntryMode: entryMode,
          sessionNotes: (() => {
            try {
              const notes = JSON.parse(localStorage.getItem("stillform_ai_session_notes") || "[]");
              const internalNotes = (Array.isArray(notes) ? notes : []).filter((n) => n?.noteType !== "user-facing");
              if (internalNotes.length === 0) return null;
              return internalNotes.slice(-5).map(n => `[${n.timestamp.split("T")[0]}] ${n.note}`).join("\n");
            } catch { return null; }
          })(),
          install_id: installId,
          user_id: sbGetUser()?.id || null
        });

      let parsed = null;
      let lastErr = null;
      for (let attempt = 0; attempt < 3; attempt++) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 24000);
        try {
          const response = await fetch(REFRAME_API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
            },
            signal: controller.signal,
            body: requestBody
          });
          clearTimeout(timeout);
          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || "Server error");
          }
          parsed = await response.json();
          break;
        } catch (err) {
          clearTimeout(timeout);
          lastErr = err;
          if (attempt < 2) {
            const backoffMs = [500, 1000, 2000][attempt] || 1000;
            await new Promise(resolve => setTimeout(resolve, backoffMs));
          }
        }
      }

      if (!parsed) {
        runSelfGuidedFallback(textToSend, "Connection dropped. Working through it on your own for now.");
        return;
      }

      if (parsed.crisisDetected) { try { window.plausible("Crisis Detection Triggered"); } catch {} }
      if (parsed.liabilityGuard) { try { window.plausible("Liability Guard Triggered"); } catch {} }
      if (parsed.voiceValidationFailed) {
        try {
          window.plausible("Reframe Voice Guard Triggered", {
            props: {
              repaired: parsed.voiceRepairUsed ? "yes" : "no",
              fallback: parsed.voiceFallbackUsed ? "yes" : "no"
            }
          });
        } catch {}
      }
      setMessages(prev => [...prev, {
        role: "ai",
        text: parsed.reframe,
        distortion: parsed.distortion
      }]);
      setSelfGuidedActive(false);
      setError(null);
    } catch (err) {
      if (err.name === "AbortError") {
        setError("This is taking longer than usual. Check your connection and try again.");
      } else {
        setError(`Couldn't connect: ${err.message}. Your message is saved — tap Retry or Resend.`);
      }
    }
    setLoading(false);
  };

  const reframePrompts = {
    calm: [
      "Name what's happening. The AI helps you see it clearly.",
      "What's the loudest thing right now? Say it.",
      "Something is activated. What is it?",
      "What's on your mind right now?",
      "What's actually driving this?",
      "What's running in the background right now?"
    ],
    clarity: [
      "What thought or question keeps pulling you back?",
      "What's the part your mind keeps returning to?",
      "What are you trying to solve right now?",
      "What's the signal underneath the overthinking?",
      "What keeps snagging your attention?"
    ],
    hype: [
      "What are you about to walk into? Say it.",
      "What's the moment you're preparing for?",
      "Name the situation. Name what's at stake.",
      "What do you need to be sharp for right now?"
    ]
  };
  const promptPool = reframePrompts[effectiveMode] || reframePrompts.calm;
  const rotatingSubtitle = promptPool[Math.floor(Date.now() / 3600000) % promptPool.length];

  const modeConfig = {
    calm: {
      icon: "◎", title: "Talk it out", subtitle: rotatingSubtitle,
      color: "var(--amber)",
      bg: "linear-gradient(180deg, var(--amber-glow) 0%, transparent 50%)",
      border: "var(--amber-dim)",
      inputBg: "var(--amber-glow)",
      aiBubble: "var(--amber-glow)",
      sendBg: "var(--amber)"
    },
    clarity: {
      icon: "✦", title: "Talk it out", subtitle: rotatingSubtitle,
      color: "var(--amber)",
      bg: "linear-gradient(180deg, var(--amber-glow) 0%, transparent 50%)",
      border: "var(--amber-dim)",
      inputBg: "var(--amber-glow)",
      aiBubble: "var(--amber-glow)",
      sendBg: "var(--amber)"
    },
    hype: {
      icon: "◌", title: "Talk it out", subtitle: rotatingSubtitle,
      color: "var(--amber)",
      bg: "linear-gradient(180deg, var(--amber-glow) 0%, transparent 50%)",
      border: "var(--amber-dim)",
      inputBg: "var(--amber-glow)",
      aiBubble: "var(--amber-glow)",
      sendBg: "var(--amber)"
    }
  };
  const mc = modeConfig[effectiveMode] || modeConfig.calm;

  const COMMUNICATION_ACTIONS = {
    opportunity: "state-to-statement-opportunity",
    expanded: "state-to-statement-expanded",
    drafted: "state-to-statement-drafted",
    copied: "state-to-statement-copied",
    shared: "state-to-statement-shared",
    sentConfirmed: "state-to-statement-sent-confirmed",
    completedWithDraft: "state-to-statement-completed-with-draft",
    completedWithoutDraft: "state-to-statement-completed-without-draft",
    skipped: "state-to-statement-skipped"
  };
  const COMMUNICATION_SKIP_REASONS = [
    { id: "not-needed", label: "Not needed for this event" },
    { id: "private-processing", label: "Keeping it internal for now" },
    { id: "send-later", label: "Will send later outside app" }
  ];
  const getStateToStatementSessionId = () => {
    if (!stateToStatementSessionIdRef.current) {
      stateToStatementSessionIdRef.current = `sts_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    }
    return stateToStatementSessionIdRef.current;
  };
  const resetStateToStatementTracking = () => {
    communicationDraftLoggedRef.current = false;
    communicationOpportunityLoggedRef.current = false;
    communicationExpandedRef.current = false;
    stateToStatementSessionIdRef.current = null;
    setCommunicationSkipReason(null);
  };
  const buildAdditionalAnchorCopy = () => {
    const clean = externalAnchorDraft.trim();
    if (!clean) return "";
    return `What Shifted:\n${clean}`;
  };
  const logCommunicationEvent = (eventAction, options = {}) => {
    const stamp = new Date().toISOString();
    const clean = externalAnchorDraft.trim();
    const draftSignals = getCommunicationDraftSignals(clean);
    const entry = {
      id: `comm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      schemaVersion: COMMUNICATION_EVENT_SCHEMA_VERSION,
      timestamp: stamp,
      date: toLocalDateKey(stamp),
      action: eventAction,
      source: "reframe-state-to-statement",
      sessionTimestamp: sessionShareSummary?.timestamp || null,
      stateToStatementSessionId: getStateToStatementSessionId(),
      textLength: draftSignals.textLength,
      wordCount: draftSignals.wordCount,
      meaningfulDraft: draftSignals.meaningful ? "yes" : "no",
      skipReason: options.skipReason || communicationSkipReason || null,
      metadata: options.metadata || null
    };
    appendCommunicationEvent(entry);
    return entry;
  };
  const markStateToStatementOpportunity = ({ source = "unknown" } = {}) => {
    if (communicationOpportunityLoggedRef.current) return;
    communicationOpportunityLoggedRef.current = true;
    logCommunicationEvent(COMMUNICATION_ACTIONS.opportunity, {
      metadata: { source }
    });
  };
  const ensureDraftLogged = () => {
    if (communicationDraftLoggedRef.current) return;
    const clean = externalAnchorDraft.trim();
    if (!clean) return;
    logCommunicationEvent(COMMUNICATION_ACTIONS.drafted);
    communicationDraftLoggedRef.current = true;
  };
  const resolvePostReframeRoute = () => (entryMode === "evening" ? "eod-close" : undefined);
  const queueDebriefAndCompleteNow = (redirectTo = null, source = "reframe") => {
    setDebriefTarget({ redirectTo: redirectTo || null, source });
  };
  const queueDebriefAndComplete = (redirectTo = null, source = "reframe") => {
    setNextMoveTarget({ redirectTo: redirectTo || null, source });
  };
  const handleNextMoveConfirm = (nextMove) => {
    const target = nextMoveTarget;
    if (!target) return;
    if (latestSessionTimestampRef.current) {
      saveSessionNextMove(latestSessionTimestampRef.current, nextMove);
    }
    setNextMoveTarget(null);
    queueDebriefAndCompleteNow(target.redirectTo || null, target.source || "reframe-next-move");
  };
  const completeDebriefGate = (reflectionText) => {
    appendToolDebriefToStorage({
      id: `debrief_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
      date: toLocalDateKey(),
      toolId: "reframe",
      toolFamily: getToolFamily("reframe"),
      regulationType,
      source: debriefTarget?.source || "reframe",
      reflectionText: String(reflectionText || "").trim(),
      route: debriefTarget?.redirectTo || null
    });
    const nextRoute = debriefTarget?.redirectTo || undefined;
    setDebriefTarget(null);
    onComplete(nextRoute);
  };
  const finishReframeSession = ({ postState = null, anchorDraft = null } = {}) => {
    const saved = saveSession(postState);
    latestSessionTimestampRef.current = saved?.timestamp || null;
    // Save inline next move if selected
    if (postNextMoveId && saved?.timestamp) {
      try {
        saveSessionNextMove(saved.timestamp, {
          id: `nextmove_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
          actionId: postNextMoveId,
          label: NEXT_MOVE_ACTION_LABELS[postNextMoveId] || postNextMoveId,
          customText: null,
          createdAt: new Date().toISOString(),
          followUp: { dueAt: new Date(Date.now() + NEXT_MOVE_FOLLOW_UP_DELAY_MS).toISOString() }
        });
      } catch {}
    }
    setPostNextMoveId(null);
    const pre = scoreState(feelState);
    const post = scoreState(postState);
    setSessionShareSummary({
      timestamp: saved?.timestamp || new Date().toISOString(),
      preState: feelState || null,
      postState: postState || null,
      delta: Number.isFinite(pre) && Number.isFinite(post) ? post - pre : null
    });
    communicationDraftLoggedRef.current = false;
    // Handle state-to-statement draft if present
    if (anchorDraft && anchorDraft.trim()) {
      try { ensureDraftLogged(); logCommunicationEvent(COMMUNICATION_ACTIONS.completedWithDraft); } catch {}
    } else {
      try { logCommunicationEvent(COMMUNICATION_ACTIONS.completedWithoutDraft); } catch {}
    }
    resetStateToStatementTracking();
    setPostRating(null);
    setShowPostRating(false);
    setExternalAnchorDraft("");
    setExternalAnchorCopied(false);
    setExternalAnchorSent(false);
    setStateToStatementExpanded(false);
    setPostSessionInsight(null);
    queueDebriefAndComplete(resolvePostReframeRoute(), "reframe-merged-finish");
  };

  const finishStateToStatement = () => {
    ensureDraftLogged();
    const hasDraft = externalAnchorDraft.trim().length > 0;
    logCommunicationEvent(hasDraft ? COMMUNICATION_ACTIONS.completedWithDraft : COMMUNICATION_ACTIONS.completedWithoutDraft);
    try {
      window.plausible("State to Statement Completed", {
        props: {
          has_anchor: hasDraft ? "yes" : "no"
        }
      });
    } catch {}
    setShowStateToStatement(false);
    setExternalAnchorDraft("");
    setExternalAnchorCopied(false);
    setExternalAnchorSent(false);
    setStateToStatementExpanded(false);
    setSessionShareSummary(null);
    setPostSessionInsight(null);
    setShowPostInsight(false);
    resetStateToStatementTracking();
    queueDebriefAndComplete(resolvePostReframeRoute(), "reframe-state-to-statement-complete");
  };

  const skipStateToStatement = (reason = null) => {
    const chosenReason = reason || communicationSkipReason || "not-needed";
    setCommunicationSkipReason(chosenReason);
    logCommunicationEvent(COMMUNICATION_ACTIONS.skipped, { skipReason: chosenReason });
    try { window.plausible("State to Statement Skipped"); } catch {}
    setShowStateToStatement(false);
    setExternalAnchorCopied(false);
    setExternalAnchorDraft("");
    setExternalAnchorSent(false);
    setStateToStatementExpanded(false);
    setSessionShareSummary(null);
    setPostSessionInsight(null);
    setShowPostInsight(false);
    resetStateToStatementTracking();
    queueDebriefAndComplete(resolvePostReframeRoute(), "reframe-state-to-statement-skip");
  };

  const handleMergedWatchChooseComplete = (redirectTo) => {
    if (toolBackOverrideRef) toolBackOverrideRef.current = null;
    if (!redirectTo || redirectTo === "reframe-calm" || redirectTo === "reframe") {
      setShowWatchChooseFlow(false);
      return;
    }
    if (redirectTo === "breathe" || redirectTo === "scan" || redirectTo === "crisis") {
      onComplete(redirectTo);
      return;
    }
    setShowWatchChooseFlow(false);
  };

  const continueFromPostInsight = () => {
    setShowPostInsight(false);
    setStateToStatementExpanded(false);
    setExternalAnchorCopied(false);
    setExternalAnchorSent(false);
    setExternalAnchorDraft("");
    resetStateToStatementTracking();
    markStateToStatementOpportunity({ source: "post-insight-continue" });
    setShowStateToStatement(true);
  };

  const toggleStateToStatementExpanded = () => {
    setStateToStatementExpanded((prev) => {
      const next = !prev;
      if (next && !communicationExpandedRef.current) {
        communicationExpandedRef.current = true;
        logCommunicationEvent(COMMUNICATION_ACTIONS.expanded);
      }
      return next;
    });
  };

  const copyExternalAnchor = async () => {
    const text = buildAdditionalAnchorCopy();
    if (!text.trim()) return;
    try {
      if (navigator?.clipboard?.writeText) await navigator.clipboard.writeText(text);
      ensureDraftLogged();
      logCommunicationEvent(COMMUNICATION_ACTIONS.copied);
      setExternalAnchorCopied(true);
      try { window.plausible("State to Statement Anchor Copied"); } catch {}
    } catch {}
  };
  const shareExternalAnchor = async () => {
    const text = buildAdditionalAnchorCopy();
    if (!text.trim()) return;
    try {
      if (navigator?.share) {
        await navigator.share({ text });
        ensureDraftLogged();
        logCommunicationEvent(COMMUNICATION_ACTIONS.shared);
        try { window.plausible("State to Statement Anchor Shared"); } catch {}
        return;
      }
    } catch (err) {
      if (err?.name === "AbortError") return;
    }
    await copyExternalAnchor();
  };
  const markExternalAnchorSent = () => {
    if (!externalAnchorDraft.trim()) return;
    ensureDraftLogged();
    logCommunicationEvent(COMMUNICATION_ACTIONS.sentConfirmed);
    setExternalAnchorSent(true);
    try { window.plausible("State to Statement Sent Confirmed"); } catch {}
  };

  if (nextMoveTarget) {
    return (
      <NextMoveStep
        description="Choose one concrete action to carry this reframe into real life."
        onConfirm={handleNextMoveConfirm}
      />
    );
  }
  if (debriefTarget) {
    return (
      <ToolDebriefGate
        toolId="reframe"
        regulationType={regulationType}
        onContinue={completeDebriefGate}
      />
    );
  }

  if (showWatchChooseFlow) {
    // Register back override so ← Back closes watch sequence, not exits the tool
    if (toolBackOverrideRef) toolBackOverrideRef.current = () => setShowWatchChooseFlow(false);
    return (
      <div style={{ paddingTop: 12 }}>
        <MetacognitionTool onComplete={handleMergedWatchChooseComplete} />
      </div>
    );
  }

  if (showStateToStatement) {
    return (
      <div style={{ textAlign: "left", padding: "24px 0 8px" }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 10 }}>
          What Shifted
        </div>
        <div style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.7, marginBottom: 16 }}>
          In one line — what shifted? Naming it locks in the regulated state.
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={finishStateToStatement}>
            Finish session
          </button>
          <button className="btn btn-ghost" onClick={toggleStateToStatementExpanded}>
            {stateToStatementExpanded ? "Hide state to statement" : "Add state to statement"}
          </button>
          <button className="btn btn-ghost" onClick={() => skipStateToStatement(communicationSkipReason || "not-needed")}>
            Skip for now
          </button>
        </div>

        {stateToStatementExpanded && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace" }}>
              State-to-Statement (optional)
            </div>
            <textarea
              value={externalAnchorDraft}
              onChange={(e) => {
                setExternalAnchorDraft(e.target.value);
                setExternalAnchorSent(false);
                setCommunicationSkipReason(null);
              }}
              placeholder="In one line — what shifted?"
              rows={3}
              style={{ width: "100%", background: "var(--surface2)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "10px 12px", fontSize: 13, color: "var(--text)", fontFamily: "'DM Sans', sans-serif", outline: "none", resize: "vertical", marginBottom: 12 }}
            />
            <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.6, marginTop: -4, marginBottom: 12 }}>
              Purpose: convert your regulated state into one clear message you can send outside Stillform (Slack, email, text, or talking point).
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn btn-ghost" onClick={copyExternalAnchor} disabled={!externalAnchorDraft.trim()}>
                {externalAnchorCopied ? "Copied" : "Copy statement"}
              </button>
              <button className="btn btn-ghost" onClick={shareExternalAnchor} disabled={!externalAnchorDraft.trim()}>
                Share
              </button>
              <button className="btn btn-ghost" onClick={markExternalAnchorSent} disabled={!externalAnchorDraft.trim()}>
                {externalAnchorSent ? "Sent logged" : "Mark sent"}
              </button>
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                Skip reason (for data quality)
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {COMMUNICATION_SKIP_REASONS.map((item) => (
                  <button
                    key={item.id}
                    className="btn btn-ghost"
                    onClick={() => setCommunicationSkipReason(item.id)}
                    style={{
                      fontSize: 11,
                      padding: "6px 10px",
                      borderColor: communicationSkipReason === item.id ? "var(--amber-dim)" : "var(--border)",
                      color: communicationSkipReason === item.id ? "var(--amber)" : "var(--text-dim)"
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (showPostInsight && postSessionInsight) {
    return (
      <div style={{ textAlign: "left", padding: "36px 0 8px" }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 10 }}>
          What the AI has noticed
        </div>
        <div style={{ background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "14px 16px", marginBottom: 12 }}>
          <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.7, fontStyle: "italic" }}>
            {postSessionInsight.note}
          </div>
          <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 8, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace" }}>
            {new Date(postSessionInsight.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </div>
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 16 }}>
          Guardrails active: insight-only, no labels, no diagnosis.
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={continueFromPostInsight}>
            Continue
          </button>
          <button className="btn btn-ghost" onClick={continueFromPostInsight}>
            Skip insight
          </button>
        </div>
      </div>
    );
  }

  if (showPostRating) {
    const feelChips = [
      { id: "excited", label: "Excited" },
      { id: "focused", label: "Focused" },
      { id: "anxious", label: "Anxious" },
      { id: "angry", label: "Angry" },
      { id: "flat", label: "Flat" },
      { id: "mixed", label: "Mixed" },
      { id: "stuck", label: "Stuck" }
    ];
    // Load insight once when screen appears
    const insight = (() => { try { return getLatestUserFacingInsight(); } catch { return null; } })();
    return (
      <div style={{ padding: "40px 0 8px" }}>
        {/* FEEL CHIPS */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 20 }}>
            Where are you now?
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {feelChips.map(f => (
              <button key={f.id} onClick={() => setPostRating(f.id)} style={{
                background: postRating === f.id ? "var(--amber-glow)" : "transparent",
                border: `1px solid ${postRating === f.id ? "var(--amber-dim)" : "var(--border)"}`,
                borderRadius: 20, padding: "8px 20px", fontSize: 13,
                color: postRating === f.id ? "var(--amber)" : "var(--text-muted)", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s"
              }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* POST SESSION INSIGHT — inline, if available */}
        {insight && (
          <div style={{ marginBottom: 24, padding: "14px 16px", background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r-lg)" }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 8 }}>
              What the AI has noticed
            </div>
            <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.7, fontStyle: "italic" }}>
              {insight.note}
            </div>
          </div>
        )}

        {/* NEXT MOVE — inline pill selector */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
            Next Move
            <button onClick={() => setInfoModal({ title: "Why Next Move?", body: "Forming a specific behavioral intention at the moment of clarity significantly increases follow-through. This is not a to-do list — it is a concrete action taken from a regulated state before the window closes." })} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 13, padding: "0 4px", lineHeight: 1 }}>ⓘ</button>
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10 }}>
            One concrete action before you leave.
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {NEXT_MOVE_ACTION_OPTIONS.filter(o => o.id !== "custom").map(opt => {
              const active = postNextMoveId === opt.id;
              return (
                <button key={opt.id} onClick={() => setPostNextMoveId(active ? null : opt.id)} style={{
                  background: active ? "var(--amber-glow)" : "transparent",
                  border: `1px solid ${active ? "var(--amber-dim)" : "var(--border)"}`,
                  borderRadius: 20, padding: "6px 14px", fontSize: 12,
                  color: active ? "var(--amber)" : "var(--text-muted)",
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s"
                }}>
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* WHAT SHIFTED — optional, expanded by default */}
        <div style={{ marginBottom: 24 }}>
          <button
            onClick={toggleStateToStatementExpanded}
            style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", padding: 0, letterSpacing: "0.03em" }}
          >
            <span>{stateToStatementExpanded ? "▾ Hide" : "▸ What shifted? (optional)"}</span>
            <button onClick={() => setInfoModal({ title: "Why one line?", body: "Takes one line. Naming what changed in your internal state after a session consolidates the regulation. Translating an emotional experience into precise language measurably reduces amygdala activation and locks in the regulated state. The one-line constraint is intentional — precision produces more durable results than open-ended writing." })} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 13, padding: "0 4px", lineHeight: 1 }}>ⓘ</button>
          </button>
          {stateToStatementExpanded && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, lineHeight: 1.6 }}>
                In one line — what shifted? Naming it locks in the regulated state. This is for you, not for sending.
              </div>
              <textarea
                value={externalAnchorDraft}
                onChange={(e) => { setExternalAnchorDraft(e.target.value); setExternalAnchorSent(false); }}
                placeholder="Draft one clear message you can send now."
                rows={3}
                style={{ width: "100%", background: "var(--surface2)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "10px 12px", fontSize: 13, color: "var(--text)", fontFamily: "'DM Sans', sans-serif", outline: "none", resize: "vertical", marginBottom: 10 }}
              />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button className="btn btn-ghost" onClick={copyExternalAnchor} disabled={!externalAnchorDraft.trim()}>
                  {externalAnchorCopied ? "Copied" : "Copy"}
                </button>
                <button className="btn btn-ghost" onClick={shareExternalAnchor} disabled={!externalAnchorDraft.trim()}>
                  Share
                </button>
                <button className="btn btn-ghost" onClick={markExternalAnchorSent} disabled={!externalAnchorDraft.trim()}>
                  {externalAnchorSent ? "Sent logged" : "Mark sent"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* OBSERVE AND CHOOSE nudge — high-activation only */}
        {(feelState === "angry" || feelState === "anxious" || feelState === "mixed") && (
          <div style={{ marginBottom: 24, padding: "14px 16px", background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r-lg)" }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 6 }}>
              Want to go deeper?
            </div>
            <div style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6, marginBottom: 10 }}>
              You came in at a high intensity. Observe and Choose helps you see the pattern under the moment — not just regulate it.
            </div>
            <button onClick={() => {
              try { saveSession(postRating); } catch {}
              setShowPostRating(false);
              onComplete("metacognition");
            }} style={{
              background: "none", border: "0.5px solid var(--amber-dim)", borderRadius: "var(--r)",
              color: "var(--amber)", fontSize: 12, cursor: "pointer", padding: "8px 14px",
              fontFamily: "'DM Sans', sans-serif"
            }}>
              Open Observe and Choose →
            </button>
          </div>
        )}

        {/* FINISH */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <button
            className="btn btn-primary"
            onClick={() => finishReframeSession({ postState: postRating, anchorDraft: externalAnchorDraft })}
          >
            Finish session
          </button>
          {!postRating && (
            <button
              className="btn btn-ghost"
              style={{ fontSize: 13, color: "var(--amber)", borderColor: "var(--amber-dim)" }}
              onClick={() => finishReframeSession({ postState: null, anchorDraft: externalAnchorDraft })}
            >
              Skip and finish
            </button>
          )}
        </div>
      </div>
    );
  }

  const requestDifferentResponse = () => {
    if (loading) return;
    const hasConversationContext = messages.some((m) => m.role === "user") || Boolean(lastInput?.trim());
    if (!hasConversationContext) return;
    try { window.plausible("Reframe Different Response Requested", { props: { mode: effectiveMode } }); } catch {}
    handleSend("Give me a different response to what I just shared. Keep it specific and practical.");
  };

  return (
    <div style={{ background: mc.bg, margin: "-40px -40px 0", padding: "40px 40px 0", borderRadius: "0 0 16px 16px" }}>

      {/* Ghost echo — faint past resilience */}
      {/* Research: Bandura self-efficacy — evidence shown AFTER positive outcome reinforces skill */}
      {/* Only shown when user is not in high-activation state — prevents shame comparison */}
      {(() => {
        try {
          // Suppress during high-activation states — would read as "you used to be better"
          if (feelState === "angry" || feelState === "anxious") return null;
          const bioFilter = (() => { try { return localStorage.getItem("stillform_bio_filter") || ""; } catch { return ""; } })();
          if (bioFilter.includes("activated")) return null;
          const sessions = getSessionsFromStorage();
          const wins = sessions.filter(s => s.delta && s.delta > 0 && s.durationFormatted);
          if (wins.length === 0) return null;
          const win = wins[Math.floor(Math.random() * wins.length)];
          const d = new Date(win.timestamp);
          const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          return (
            <div style={{ fontSize: 11, color: "var(--text-muted)", opacity: 0.3, fontStyle: "italic", marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>
              {dateStr} — you shifted +{win.delta.toFixed(1)} in {win.durationFormatted}.
            </div>
          );
        } catch { return null; }
      })()}

      {/* FEEL STATE — optional single-tap, neutral by default */}
      <div style={{ marginBottom: 16 }}>
        {selfGuidedActive && (
          <div style={{
            background: "var(--amber-glow)",
            border: "1px solid var(--amber-dim)",
            borderRadius: "var(--r-lg)",
            padding: "12px 14px",
            marginBottom: 12
          }}>
            <div style={{ fontSize: 12, color: "var(--amber)", marginBottom: 8, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Offline fallback active
            </div>
            <div style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.5, marginBottom: 10 }}>
              Connection is unstable. Use this guided fallback now — your progress still saves.
            </div>
            <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => runSelfGuidedFallback(lastInput || input)}>
              Open guided fallback →
            </button>
          </div>
        )}
        {/* WHAT IS PRESENT — pre-populated from morning check-in */}
        {(() => {
          const checkin = (() => { try { return JSON.parse(localStorage.getItem("stillform_checkin_today") || "null"); } catch { return null; } })();
          const checkinMood = checkin?.mood || null;
          const checkinTension = checkin ? Object.entries(checkin.tension || {}).filter(([,v]) => v > 0).map(([k]) => k) : [];
          const hasMorningData = checkinMood || checkinTension.length > 0;
          return (
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                  What is present
                  <button onClick={() => setInfoModal({ title: "Why name your state?", body: "Naming your emotional state before a session is not just context-setting — it is the first regulation act. Research shows that translating an emotional experience into language directly reduces activation in the brain\\'s threat-detection center. The feel state you select also adjusts how the system interprets everything you type." })} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 13, padding: "0 4px", lineHeight: 1 }}>ⓘ</button>
                </div>
                {hasMorningData && (
                  <button
                    title="Pre-filled from your morning check-in. Tap to adjust."
                    onClick={() => setInfoModal({ title: "Morning check-in", body: "Your physiological baseline changes every day. Sleep debt, physical tension, and energy level directly alter how you perceive situations before any external stressor arrives. This check sets the context the AI uses in every session that follows." })}
                    style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 11, padding: 0, lineHeight: 1 }}
                  >
                    ⓘ
                  </button>
                )}
              </div>

              {/* LINE 1 — pre-populated from morning check-in */}
              {hasMorningData && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", marginBottom: 6, fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase" }}>
                    From this morning
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {checkinTension.map(area => (
                      <div key={area} style={{
                        background: "var(--surface)", border: "1px solid var(--amber-dim)",
                        borderRadius: 20, padding: "5px 14px", fontSize: 12,
                        color: "var(--amber)", fontFamily: "'DM Sans', sans-serif"
                      }}>
                        {area}
                      </div>
                    ))}
                    {checkinMood && (
                      <div style={{
                        background: "var(--surface)", border: "1px solid var(--amber-dim)",
                        borderRadius: 20, padding: "5px 14px", fontSize: 12,
                        color: "var(--amber)", fontFamily: "'DM Sans', sans-serif"
                      }}>
                        {checkinMood}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* LINE 2 — Anything to add */}
              <div>
                {hasMorningData && (
                  <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", marginBottom: 6, fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase" }}>
                    Anything to add?
                  </div>
                )}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[
                    { id: "excited", label: "Excited" },
                    { id: "focused", label: "Focused" },
                    { id: "anxious", label: "Anxious" },
                    { id: "angry", label: "Angry" },
                    { id: "flat", label: "Flat" },
                    { id: "mixed", label: "Mixed" },
                    { id: "stuck", label: "Stuck" }
                  ].map(f => (
                    <button key={f.id} onClick={() => setFeelState(feelState === f.id ? null : f.id)} style={{
                      background: feelState === f.id ? "var(--amber-glow)" : "transparent",
                      border: `1px solid ${feelState === f.id ? "var(--amber-dim)" : "var(--border)"}`,
                      borderRadius: 20, padding: "5px 14px", fontSize: 12,
                      color: feelState === f.id ? "var(--amber)" : "var(--text-muted)",
                      cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s"
                    }}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* MODE AUTO-DETECTED — from feel state + input content */}

      <div className="disclaimer">
        Your data is encrypted. <button onClick={() => onComplete("crisis")} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "inherit", cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>Crisis resources</button>
      </div>
      <div style={{ marginTop: -6, marginBottom: 10, display: "flex", justifyContent: "center" }}>
        <div style={{
          fontSize: 10,
          color: "var(--text-muted)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          border: "1px solid var(--border)",
          borderRadius: "var(--r)",
          padding: "4px 10px",
          fontFamily: "'IBM Plex Mono', monospace"
        }}>
          Reframe tone: {aiToneLabel}
        </div>
      </div>


      <>

      {/* Error banner */}
      {error && (
        <div style={{
          background: "rgba(200,0,50,0.08)",
          border: "1px solid rgba(200,0,50,0.25)",
          borderRadius: "var(--r-lg)",
          padding: "14px 16px",
          marginBottom: 12
        }}>
          <div style={{ fontSize: 14, color: "#e05", marginBottom: 12, lineHeight: 1.5 }}>{error}</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
            <button className="btn btn-primary" style={{ fontSize: 14 }} onClick={() => handleSend(lastInput || input)}>
              ↺ Retry
            </button>
            <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => runSelfGuidedFallback(lastInput || input)}>
              Continue offline
            </button>
            <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => setError(null)}>
              Dismiss
            </button>
          </div>

        </div>
      )}

      {/* TAB BAR — AI vs Self Mode */}
      <div style={{ display: "flex", gap: 0, marginBottom: 12, borderBottom: "1px solid var(--border)" }}>
        <button
          onClick={() => setActiveReframeTab("ai")}
          style={{
            flex: 1, background: "none", border: "none",
            borderBottom: activeReframeTab === "ai" ? "2px solid var(--amber)" : "2px solid transparent",
            padding: "8px 0", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase",
            color: activeReframeTab === "ai" ? "var(--amber)" : "var(--text-muted)",
            cursor: "pointer", fontFamily: "'IBM Plex Mono', monospace", transition: "all 0.2s"
          }}
        >
          AI
        </button>
        <button
          onClick={() => setActiveReframeTab("self")}
          style={{
            flex: 1, background: "none", border: "none",
            borderBottom: activeReframeTab === "self" ? "2px solid var(--amber)" : "2px solid transparent",
            padding: "8px 0", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase",
            color: activeReframeTab === "self" ? "var(--amber)" : "var(--text-muted)",
            cursor: "pointer", fontFamily: "'IBM Plex Mono', monospace", transition: "all 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6
          }}
        >
          Self Mode
          <span
            title="Work through this on your own without AI. Structured self-observation — for users who prefer to process independently."
            style={{ fontSize: 11, color: "var(--text-muted)", cursor: "help", fontFamily: "sans-serif" }}
          >
            ⓘ
          </span>
        </button>
      </div>

      {/* SELF MODE — MetacognitionTool inline */}
      {activeReframeTab === "self" && (
        <MetacognitionTool onComplete={onComplete} onSessionComplete={() => { setShowPostRating(true); }} />
      )}

      {/* AI MODE */}
      <div className="ai-container" style={{ display: activeReframeTab === "ai" ? "flex" : "none", flexDirection: "column" }}>
        <div className="ai-messages">
          {messages.length === 0 && (
            <>
              {getSavedReframes().length > 0 && (
                <div style={{ marginBottom: 16, padding: "12px 14px", background: mc.aiBubble, border: `1px solid ${mc.border}`, borderRadius: "var(--r-lg)" }}>
                  <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: mc.color, marginBottom: 8 }}>What helped before</div>
                  {getSavedReframes().slice(-2).map((r, i) => (
                    <div key={i} style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6, marginBottom: i < 1 ? 8 : 0, paddingBottom: i < 1 ? 8 : 0, borderBottom: i < 1 ? "1px solid var(--border)" : "none" }}>
                      {r.distortion && <span style={{ color: "var(--amber)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>{r.distortion} — </span>}
                      {r.text.length > 120 ? r.text.slice(0, 120) + "..." : r.text}
                    </div>
                  ))}
                </div>
              )}
              <div style={{ color: "var(--text-dim)", fontSize: 14, lineHeight: 1.7, padding: "8px 0" }}>
                {(() => { try { return getSessionsFromStorage().filter(s => s.tools?.includes("reframe")).length === 0; } catch { return true; } })() && (
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12, padding: "10px 14px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)" }}>
                    This is an AI that learns your patterns. Say what's on your mind — it gets sharper the more you use it.
                  </div>
                )}
                {openingText}
              </div>
            </>
          )}
          {messages.map((msg, i) => {
            const isLastAi = msg.role === "ai" && !messages.slice(i + 1).some(m => m.role === "ai");
            return (
            <div key={i} className={`message ${msg.role}`} ref={isLastAi ? lastAiRef : null}>
              <div className="message-avatar" style={msg.role === "ai" ? { color: mc.color } : {}}>{msg.role === "ai" ? mc.icon : "●"}</div>
              <div className="message-bubble" style={msg.role === "ai" ? { background: mc.aiBubble, borderColor: mc.border } : {}}>
                {msg.distortion && msg.distortion !== "NULL" && msg.distortion !== "null" && (
                  <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: mc.color, marginBottom: 8 }}>
                    {msg.distortion}
                  </div>
                )}
                {msg.role === "ai" ? (
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 300, lineHeight: 1.65, letterSpacing: "0.01em" }}>
                    {msg.text.split(/(\*[^*]+\*)/).map((part, j) =>
                      part.startsWith("*") && part.endsWith("*")
                        ? <em key={j} style={{ fontStyle: "italic", color: mc.color }}>{part.slice(1, -1)}</em>
                        : <span key={j}>{part}</span>
                    )}
                  </div>
                ) : (
                  <div>
                    <div>{msg.text}</div>
                    {msg.imageCount > 0 && (
                      <div style={{ marginTop: 6, fontSize: 11, color: "var(--text-muted)", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.06em" }}>
                        📎 {msg.imageCount} image{msg.imageCount > 1 ? "s" : ""} attached
                      </div>
                    )}
                  </div>
                )}
                {msg.role === "ai" && (
                  <button onClick={() => saveReframe(msg, i)} style={{
                    display: "block", marginTop: 8, background: "none", border: "none",
                    fontSize: 11, color: savedIds.has(i) ? "var(--green)" : "var(--text-muted)",
                    cursor: savedIds.has(i) ? "default" : "pointer", padding: 0,
                    fontFamily: "'DM Sans', sans-serif"
                  }}>
                    {savedIds.has(i) ? "✓ Saved" : "Save this"}
                  </button>
                )}
              </div>
            </div>
            );
          })}
          {/* Escape route — shows after AI response, not during loading */}
          {messages.length > 0 && messages[messages.length - 1]?.role === "ai" && !loading && (
            <div style={{ padding: "8px 0 4px 44px" }}>
              <button
                onClick={requestDifferentResponse}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 12,
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  padding: "4px 0",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "color 0.2s"
                }}
              >
                I want a different response
              </button>
            </div>
          )}
          {loading && (
            <div className="message ai">
              <div className="message-avatar" style={{ color: mc.color }}>{mc.icon}</div>
              <div className="message-bubble" style={{ background: mc.aiBubble, borderColor: mc.border, color: "var(--text-dim)" }}>
                <span style={{ letterSpacing: "0.2em", animation: "pulse 1.5s ease-in-out infinite" }}>···</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {somaticNudge && (
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "var(--amber)",
            letterSpacing: "0.08em", padding: "8px 14px", marginBottom: 8,
            background: "var(--amber-glow)", borderRadius: "var(--r)",
            border: "0.5px solid var(--amber-dim)",
            animation: "deltaFlash 0.6s ease-out", textAlign: "center"
          }}>{somaticNudge}</div>
        )}
        <div className="ai-input-row">
          {loading ? (
            <div style={{ flex: 1, fontSize: 13, color: "var(--text-dim)", padding: "0 12px", display: "flex", alignItems: "center" }}>
              Reading what you wrote<span style={{ animation: "pulse 1.5s ease-in-out infinite" }}>...</span>
            </div>
          ) : (
            <>

            <div style={{ position: "relative", flex: 1 }}>
              <textarea
                className="ai-input"
                style={{ borderColor: input.length > 1800 ? "rgba(200,100,50,0.6)" : mc.border, width: "100%", boxSizing: "border-box" }}
                placeholder={speech.listening ? "Listening..." : isHype ? "What are you about to face?" : (isClarity && !looksLikePositiveState) ? "What keeps pulling your mind back?" : "What's on your mind..."}
                value={input}
                maxLength={2000}
                onChange={e => { setInput(e.target.value); checkTypingSpeed(); }}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                rows={3}
              />
              {input.length > 1600 && (
                <div style={{ position: "absolute", bottom: 6, right: 8, fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.06em", color: input.length > 1900 ? "rgba(200,100,50,0.9)" : "var(--text-muted)", pointerEvents: "none" }}>
                  {2000 - input.length}
                </div>
              )}
              {input.length >= 2000 && (
                <div style={{ position: "absolute", bottom: -20, left: 0, fontSize: 11, color: "rgba(200,100,50,0.9)", fontFamily: "'DM Sans', sans-serif" }}>
                  The AI works best with one focused thought. Try trimming to what matters most.
                </div>
              )}
            </div>
            {/* Continue button — when returning to a conversation with no input typed */}
            {messages.length > 0 && messages[messages.length - 1]?.role === "ai" && !input.trim() && (
              <button onClick={() => handleSend("I need to continue where we left off")} style={{
                position: "absolute", top: -36, right: 0,
                background: "var(--surface)", border: "0.5px solid var(--amber-dim)",
                borderRadius: "var(--r)", padding: "6px 14px", fontSize: 11,
                color: "var(--amber)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
              }}>
                ↺ Continue
              </button>
            )}
            {/* Resend button — when last message is user's and AI never responded */}
            {messages.length > 0 && messages[messages.length - 1]?.role === "user" && !loading && (
              <button onClick={() => handleSend(messages[messages.length - 1].text)} style={{
                position: "absolute", top: -36, right: 0,
                background: "var(--surface)", border: "0.5px solid var(--amber-dim)",
                borderRadius: "var(--r)", padding: "6px 14px", fontSize: 11,
                color: "var(--amber)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
              }}>
                ↺ Resend
              </button>
            )}
            </>
          )}
          {!loading && (
            <>
              {/* Image upload for OCR — emails, texts, social posts */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={ocrLoading}
                title="Upload a screenshot to extract text"
                style={{
                  background: ocrLoading ? "rgba(201,147,42,0.15)" : "var(--surface2)",
                  border: `1px solid ${ocrLoading ? "var(--amber-dim)" : "var(--border)"}`,
                  borderRadius: "var(--r-lg)", width: 40, height: 40, cursor: ocrLoading ? "wait" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, color: ocrLoading ? "var(--amber)" : "var(--text-dim)",
                  transition: "all 0.2s", flexShrink: 0,
                  animation: ocrLoading ? "pulse 1.5s ease-in-out infinite" : "none"
                }}
              >
                {ocrLoading ? "⏳" : "📎"}
              </button>
              {speech.supported && (
                <button onClick={speech.toggle} style={{
                  background: speech.listening ? "rgba(200,60,60,0.2)" : "var(--surface2)",
                  border: speech.listening ? "1px solid rgba(200,60,60,0.4)" : "1px solid var(--border)",
                  borderRadius: "var(--r-lg)", width: 40, height: 40, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, color: speech.listening ? "rgba(200,80,80,0.9)" : "var(--text-dim)",
                  transition: "all 0.2s", flexShrink: 0,
                  animation: speech.listening ? "pulse 1.5s ease-in-out infinite" : "none"
                }}>
                  🎙
                </button>
              )}
            </>
          )}
          {loading ? (
            <button className="btn-send" style={{ background: "var(--surface2)", color: "var(--text-dim)" }} onClick={() => {
              setLoading(false);
              setError("Cancelled. Your message is saved — tap Retry when you're ready.");
            }}>
              Cancel
            </button>
          ) : (
            <button className="btn-send" style={{ background: mc.sendBg }} onClick={() => handleSend()} disabled={!input.trim()}>
              Send
            </button>
          )}
        </div>
        {messages.length === 0 && !loading && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
            <button
              className="btn btn-ghost"
              style={{ fontSize: 13, color: "var(--text-dim)" }}
              onClick={() => {
                setError(null);
                setInput("");
                onComplete();
              }}
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
      {messages.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
            {pendingImages.length > 0 && (
              <div style={{ fontSize: 11, color: "var(--amber)", fontFamily: "'IBM Plex Mono', monospace",
                letterSpacing: "0.06em", padding: "4px 10px", background: "var(--amber-glow)",
                borderRadius: "var(--r)", border: "0.5px solid var(--amber-dim)", marginBottom: 6, textAlign: "center" }}>
                {pendingImages.length} screenshot{pendingImages.length > 1 ? "s" : ""} attached ◎
              </div>
            )}
            {messages.length > 1 && (
              <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={handleDoneForNow}>
                Done for now
              </button>
            )}
            <button className="btn btn-ghost" style={{ fontSize: 13, color: "var(--text-dim)" }} onClick={() => {
              try { localStorage.removeItem(STORAGE_KEY); } catch {}
              setMessages([]);
              setError(null);
              setLoading(false);
              setSelfGuidedActive(false);
              setInput("");
            }}>
              Start fresh
            </button>
          </div>
          
        </div>
      )}
      {messages.length === 0 && loading && (
        <button className="btn btn-ghost" style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 16 }} onClick={() => {
          setLoading(false);
          setError(null);
          setInput("");
        }}>
          Reset
        </button>
      )}
      </>
    </div>
  );
}

function MicroBiasTool({ onComplete }) {
  const [current, setCurrent] = useState(0);
  const [identified, setIdentified] = useState([]);
  const [done, setDone] = useState(false);

  const patterns = [
    {
      name: "Confirmation Loop",
      what: "Once your brain lands on a story, it can keep collecting proof for that story while missing what doesn't fit.",
      example: "You're sure someone is upset with you. You notice every short reply and miss the neutral or warm moments.",
      question: "When you're activated, does your attention narrow around one interpretation?"
    },
    {
      name: "Threat Weighting",
      what: "Your system can assign extra weight to risk cues and less weight to stabilizing cues, especially under pressure.",
      example: "Nine pieces of the day go fine, one part feels off, and your attention stays on the one.",
      question: "Do single negatives tend to dominate your read of the situation?"
    },
    {
      name: "Fast Conclusions",
      what: "Under load, the mind can jump from signal to conclusion before enough evidence is in.",
      example: "A delayed response quickly turns into a complete story about what it means.",
      question: "Do you sometimes reach conclusions before the full picture is available?"
    },
    {
      name: "Overcontrol Mode",
      what: "When uncertainty rises, you may tighten control quickly to reduce discomfort.",
      example: "You start planning every branch and script every line before a conversation begins.",
      question: "When uncertainty is high, do you default to over-planning before acting?"
    }
  ];

  const handleResponse = (recognized) => {
    const nextIdentified = recognized ? [...identified, patterns[current].name] : identified;
    if (recognized) {
      setIdentified(nextIdentified);
    }
    if (current < patterns.length - 1) {
      setCurrent(c => c + 1);
    } else {
      // Save identified patterns
      try {
        localStorage.setItem("stillform_bias_profile", JSON.stringify(nextIdentified));
      } catch {}
      setDone(true);
    }
  };

  if (done) {
    return (
      <div style={{ textAlign: "center", maxWidth: 380, margin: "0 auto" }}>
        <div style={{ fontSize: 28, marginBottom: 16 }}>✦</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, marginBottom: 12 }}>
          Pattern baseline captured.
        </h2>
        <p style={{ color: "var(--text-dim)", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
          This is not a diagnosis. It is a starting map for decision patterns that can appear under load. Reframe uses this signal alongside your check-ins and language to improve pattern recognition over time.
        </p>
        {identified.length > 0 && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "16px 20px", textAlign: "left", marginBottom: 24 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 10 }}>Patterns you recognized today</div>
            {identified.map((b, i) => (
              <div key={i} style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 4 }}>· {b}</div>
            ))}
          </div>
        )}
        {identified.length === 0 && (
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 24 }}>No strong match right now. That is normal. Patterns can shift by context and intensity.</p>
        )}
        <button className="btn btn-ghost" onClick={() => onComplete()}>Done</button>
      </div>
    );
  }

  const pattern = patterns[current];
  return (
    <div style={{ maxWidth: 420, margin: "0 auto" }}>
      <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 24, textAlign: "center" }}>
        Pattern Check · {current + 1} of {patterns.length}
      </div>

      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, marginBottom: 16 }}>
        {pattern.name}
      </h2>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "16px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.6, marginBottom: 12 }}>{pattern.what}</div>
        <div style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6, fontStyle: "italic" }}>{pattern.example}</div>
      </div>

      <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.6, marginBottom: 24 }}>
        {pattern.question}
      </p>

      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleResponse(true)}>
          Shows up for me
        </button>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => handleResponse(false)}>
          Not today
        </button>
      </div>

      <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 24 }}>
        {patterns.map((_, i) => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i <= current ? "var(--amber)" : "var(--border)", transition: "all 0.3s" }} />
        ))}
      </div>
    </div>
  );
}


// ─── OBSERVE ENTRY LITE — single question for balanced users ─────────────────
// Used only when balanced / unclear. Thought-first and body-first route directly.
function ObserveEntryLite({ onClose, onRoute }) {
  const [step, setStep] = useState(0);
  const [signalOrigin, setSignalOrigin] = useState(null);

  const optBtn = () => ({
    width: "100%", padding: "14px 18px",
    background: "var(--surface)", border: "0.5px solid var(--border)",
    borderRadius: "var(--r)", cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif", textAlign: "left",
    WebkitTapHighlightColor: "transparent"
  });

  if (step === 0) return (
    <div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, color: "var(--text)", marginBottom: 4 }}>
        What's louder right now?
      </div>
      <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 16 }}>First read. Don't overthink it.</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { id: "body", label: "My body is loud", sub: "Tension, chest, gut, jaw — something physical" },
          { id: "thought", label: "My mind is looping", sub: "Replaying, anticipating, spiraling" },
          { id: "both", label: "Both", sub: "Hard to separate right now" },
          { id: "unsure", label: "I just feel off", sub: "Something's there, can't place it" },
        ].map(opt => (
          <button key={opt.id} onClick={() => {
            if (opt.id === "body") {
              const bf = (() => { try { return localStorage.getItem("stillform_bio_filter") || ""; } catch { return ""; } })();
              const ob = ["activated","depleted","pain","sleep","medicated","off-baseline","something"].some(s => bf.includes(s));
              onRoute(opt.id, ob ? "understand" : "settle"); return;
            }
            if (opt.id === "thought") { onRoute(opt.id, "understand"); return; }
            setSignalOrigin(opt.id); setStep(1);
          }} style={optBtn()}>
            <span style={{ fontWeight: 500, color: "var(--text)", fontSize: 14 }}>{opt.label}</span>
            <span style={{ fontSize: 12, color: "var(--text-dim)", marginLeft: 8 }}>{opt.sub}</span>
          </button>
        ))}
      </div>
      <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 12, cursor: "pointer", marginTop: 16, padding: "8px 0", fontFamily: "'DM Sans', sans-serif" }}>
        ← Back
      </button>
    </div>
  );

  return (
    <div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, color: "var(--text)", marginBottom: 4 }}>
        What would help first?
      </div>
      <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 16 }}>The system routes from here.</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { id: "settle", label: "Settle first", sub: "Something needs to come down before thinking." },
          { id: "understand", label: "Get clear", sub: "Get some distance from what's happening." },
          { id: "catch", label: "Stay with it", sub: "Notice it without moving yet." },
        ].map(opt => (
          <button key={opt.id} onClick={() => onRoute(signalOrigin, opt.id)} style={optBtn()}>
            <span style={{ fontWeight: 500, color: "var(--text)", fontSize: 14 }}>{opt.label}</span>
            <span style={{ fontSize: 12, color: "var(--text-dim)", marginLeft: 8 }}>{opt.sub}</span>
          </button>
        ))}
      </div>
      <button onClick={() => setStep(0)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 12, cursor: "pointer", marginTop: 16, padding: "8px 0", fontFamily: "'DM Sans', sans-serif" }}>
        ← Back
      </button>
    </div>
  );
}


function MetacognitionTool({ onComplete, onSessionComplete }) {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState({});
  const startTrackedRef = useRef(false);
  if (step === 0 && !startTrackedRef.current) {
    startTrackedRef.current = true;
    try { window.plausible?.("Reframe Watch Sequence Started"); } catch {}
  }

  const recognizedPatternText = String(responses[2] || "").toLowerCase();
  const indicatesNewPattern = /\b(no|not really|never|first time|new|don'?t think so|dont think so)\b/.test(recognizedPatternText);

  const prompts = [
    {
      label: "Notice",
      question: "What's happening in your body right now?",
      sub: "Scan without judgment. Where are you holding it?",
      placeholder: "Where is it sitting right now?"
    },
    {
      label: "Name",
      question: "What thought just fired?",
      sub: "The first one. Before the story built around it.",
      placeholder: "The raw thought. Not the story."
    },
    {
      label: "Recognize",
      question: "Have you been here before?",
      sub: "Is this thought familiar? Does it have a pattern?",
      placeholder: "This pattern tends to show up when..."
    },
    {
      label: "Perspective",
      question: indicatesNewPattern
        ? "What would help you stay steady right now?"
        : "What do you actually need in this moment?",
      sub: indicatesNewPattern
        ? "Something simple. One support, one boundary, or one next step."
        : "Not what you should do. What does this moment actually call for?",
      placeholder: indicatesNewPattern
        ? "Space, clarity, or one concrete action."
        : "What would steady you right now?"
    },
    {
      label: "Choose",
      question: "What are you doing next?",
      sub: "You observed it. You named it. Now decide.",
      placeholder: ""
    }
  ];

  const choices = [
    { label: "Breathe", desc: "Regulate first", action: () => onComplete("breathe") },
    { label: "Sit with it", desc: "I see it. That's enough.", action: () => {
      // Save as metacognition session
      try {
        appendSessionToStorage({
          timestamp: new Date().toISOString(),
          duration: 0,
          tools: ["metacognition"],
          exitPoint: "self-regulated",
          source: "metacognition",
          responses
        });
      } catch {}
      setStep(prompts.length);
    }},
    { label: "Talk it through", desc: "Use Reframe", action: () => onComplete("reframe-calm") },
    { label: "Move on", desc: "No tools needed", action: () => {
      try {
        appendSessionToStorage({
          timestamp: new Date().toISOString(),
          duration: 0,
          tools: ["metacognition"],
          exitPoint: "autonomous",
          source: "metacognition",
          responses
        });
        try { window.plausible?.("Reframe Watch Sequence Autonomous"); } catch {}
      } catch {}
      setStep(prompts.length);
    }}
  ];

  // Completion screen
  if (step >= prompts.length) {
    const autonomousCount = (() => {
      try {
        return getSessionsFromStorage()
          .filter(s => s.source === "metacognition" && (s.exitPoint === "autonomous" || s.exitPoint === "self-regulated")).length;
      } catch { return 0; }
    })();
    const isAutonomous = responses && Object.values(responses).length > 0;
    return (
      <div style={{ textAlign: "center", maxWidth: 320, margin: "0 auto" }}>
        <div style={{ fontSize: 28, marginBottom: 16 }}>✦</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, marginBottom: 12 }}>
          You watched it. You named it. You chose.
        </h2>
        <p style={{ color: "var(--text-dim)", fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
          That's the skill. Seeing your own mind in motion and choosing what to do with it.
        </p>
        {autonomousCount >= 1 && (
          <div style={{ background: "var(--amber-glow)", border: "0.5px solid var(--amber-dim)", borderRadius: "var(--r-lg)", padding: "12px 16px", marginBottom: 20, textAlign: "left" }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 6 }}>
              Signal Awareness
            </div>
            <div style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.6 }}>
              {autonomousCount === 1
                ? "First time choosing without a tool. That's the observer activating."
                : `${autonomousCount} times now. The observer is getting faster.`}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 6 }}>
              This is the skill compounding. The less you need the app, the more it's working.
            </div>
          </div>
        )}
        <button className="btn btn-primary" onClick={() => onSessionComplete ? onSessionComplete() : onComplete()}>Continue →</button>
      </div>
    );
  }

  const prompt = prompts[step];
  const isChoiceStep = step === prompts.length - 1;
  const markStepNotApplicable = () => {
    setResponses((r) => ({ ...r, [step]: "[not-applicable]" }));
    setStep((s) => s + 1);
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 24, textAlign: "center" }}>
        {prompt.label} — {step + 1} of {prompts.length}
      </div>

      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, marginBottom: 8 }}>
        {prompt.question}
      </h2>
      <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>
        {prompt.sub}
      </p>

      {isChoiceStep ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {choices.map((c, i) => (
            <button key={i} onClick={c.action} style={{
              background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
              padding: "14px 18px", textAlign: "left", cursor: "pointer", transition: "all 0.2s"
            }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{c.label}</div>
              <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>{c.desc}</div>
            </button>
          ))}
        </div>
      ) : (
        <>
          <div style={{ display: "flex", gap: 6 }}>
            <textarea
              style={{
                flex: 1, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                padding: "14px 16px", color: "var(--text)", fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                lineHeight: 1.6, resize: "none", minHeight: 80
              }}
              placeholder={prompt.placeholder}
              value={responses[step] || ""}
              onChange={e => setResponses(r => ({ ...r, [step]: e.target.value }))}
              autoFocus
            />
            <MicButton onTranscript={t => setResponses(r => ({ ...r, [step]: (r[step] || "") + (r[step] ? " " : "") + t }))} />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button className="btn btn-primary" style={{ flex: 1 }}
              disabled={!(responses[step] || "").trim()}
              onClick={() => setStep(s => s + 1)}>
              {step === 0 ? "Name it →" : step === 1 ? "Recognize →" : step === 2 ? "Get perspective →" : step === 3 ? "Choose →" : "Next →"}
            </button>
            <button className="btn btn-ghost" style={{ flexShrink: 0 }} onClick={markStepNotApplicable}>
              Skip
            </button>
          </div>
        </>
      )}

      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 24 }}>
        {prompts.map((_, i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i <= step ? "var(--amber)" : "var(--border)", transition: "all 0.3s" }} />
        ))}
      </div>
    </div>
  );
}

function SignalMapTool({ onComplete, skipIntro = false }) {
  const [step, setStep] = useState(skipIntro ? 1 : 0);
  const [signals, setSignals] = useState(() => {
    try { return JSON.parse(localStorage.getItem("stillform_signal_profile")) || {}; } catch { return {}; }
  });

  const bodyAreas = [
    { id: "jaw", label: "Jaw & Face", desc: "Clenching, tightness, or set expression" },
    { id: "shoulders", label: "Shoulders & Neck", desc: "Rising, bracing, or locked posture" },
    { id: "chest", label: "Chest", desc: "Tightness, expansion, or shallow breath" },
    { id: "hands", label: "Hands & Arms", desc: "Gripping, tingling, or restless energy" },
    { id: "gut", label: "Stomach & Core", desc: "Knots, butterflies, or heat" },
    { id: "legs", label: "Legs & Feet", desc: "Restlessness, heaviness, or pacing urge" }
  ];

  const sensations = [
    "Tightness", "Heat", "Numbness", "Racing heart", "Shallow breath", "Nausea", "Trembling", "Brain fog",
    "Surge of energy", "Sudden urgency", "Restless focus", "Butterflies", "Lightness"
  ];

  const triggerGroups = [
    {
      id: "work",
      label: "Work & performance pressure",
      options: [
        "Work / deadlines",
        "Being put on the spot",
        "Public speaking / performing",
        "Waiting for results or news",
        "High-stakes decision",
        "Negotiation or competition",
        "Money / financial pressure"
      ]
    },
    {
      id: "relational",
      label: "Relationships & social dynamics",
      options: [
        "Conflict / confrontation",
        "Difficult conversations",
        "Being judged or evaluated",
        "Feeling disrespected",
        "Feeling invisible or unheard",
        "Rejection or abandonment",
        "Family dynamics",
        "Romantic relationship tension",
        "Parenting moments",
        "Supporting someone else through something hard"
      ]
    },
    {
      id: "internal",
      label: "Internal narrative patterns",
      options: [
        "Self-worth / impostor feelings",
        "Comparison to others",
        "Uncertainty / not knowing",
        "Guilt or shame from the past",
        "Grief / loss / anniversaries",
        "Jealousy",
        "Being alone with your thoughts",
        "Unfinished tasks piling up"
      ]
    },
    {
      id: "body",
      label: "Body & environment load",
      options: [
        "Chronic pain flares",
        "Sleep deprivation",
        "Sensory overload (noise, light, crowds)",
        "Hormonal changes",
        "Hunger or blood sugar drops"
      ]
    },
    {
      id: "positive",
      label: "Positive over-activation",
      options: [
        "Big win or unexpected good news",
        "Excitement before something important",
        "Creative flow or peak performance state",
        "Recognition or praise"
      ]
    }
  ];
  const triggerMigrationMap = {
    "Riding high — risk of overcommitting": "Excitement before something important",
    "A big opportunity opening up": "Big win or unexpected good news",
    "Social situations / networking": "Being judged or evaluated",
    "Making a decision with incomplete information": "High-stakes decision"
  };
  const triggerOptionSet = new Set(triggerGroups.flatMap(group => group.options));
  const [openTriggerGroups, setOpenTriggerGroups] = useState(() => ({
    work: true,
    relational: false,
    internal: false,
    body: false,
    positive: false
  }));

  const save = (key, value) => {
    const updated = { ...signals, [key]: value };
    setSignals(updated);
    try { localStorage.setItem("stillform_signal_profile", JSON.stringify(updated)); } catch {}
  };

  useEffect(() => {
    const current = Array.isArray(signals.triggers) ? signals.triggers : [];
    if (!current.length) return;
    const normalized = current
      .map((item) => triggerMigrationMap[item] || item)
      .filter((item, idx, arr) => triggerOptionSet.has(item) && arr.indexOf(item) === idx);
    const changed = normalized.length !== current.length || normalized.some((item, idx) => item !== current[idx]);
    if (changed) save("triggers", normalized);
  }, []);

  const selectedTriggers = Array.isArray(signals.triggers)
    ? signals.triggers.filter((item, idx, arr) => triggerOptionSet.has(item) && arr.indexOf(item) === idx)
    : [];
  const toggleTriggerGroup = (groupId) => {
    setOpenTriggerGroups((current) => ({ ...current, [groupId]: !current?.[groupId] }));
  };

  const steps = [
    // Step 0: Intro
    () => (
      <div style={{ textAlign: "center", maxWidth: 360, margin: "0 auto" }}>
        <div style={{ fontSize: 28, marginBottom: 16 }}>◎</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, marginBottom: 12 }}>Map Your Signals</h2>
        <p style={{ color: "var(--text-dim)", fontSize: 14, lineHeight: 1.7, marginBottom: 32 }}>
          Your body broadcasts state before your mind catches up. Most people never learn to read the signal. This takes 2 minutes and teaches the app how YOUR system operates.
        </p>
        <button className="btn btn-primary" onClick={() => setStep(1)}>Start →</button>
      </div>
    ),
    // Step 1: Where the body activates first
    () => (
      <div style={{ maxWidth: 400, margin: "0 auto" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 8 }}>Step 1 of 3</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, marginBottom: 8 }}>Where do you activate first?</h2>
        <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 8 }}>Tap the areas that respond first — whether stress, excitement, or anything in between.</p>
        <p style={{ color: "var(--text-dim)", fontSize: 12, marginBottom: 12, lineHeight: 1.6 }}>This changes over time. Update it whenever your patterns shift.</p>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 24 }}>Select all that apply</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {bodyAreas.map(area => {
            const selected = (signals.firstAreas || []).includes(area.id);
            return (
              <button key={area.id} onClick={() => {
                const current = signals.firstAreas || [];
                const updated = selected ? current.filter(a => a !== area.id) : [...current, area.id];
                save("firstAreas", updated);
              }} style={{
                background: selected ? "var(--amber-glow)" : "var(--surface)",
                border: `1px solid ${selected ? "var(--amber)" : "var(--border)"}`,
                borderRadius: "var(--r-lg)", padding: "14px 18px", textAlign: "left", cursor: "pointer", transition: "all 0.2s"
              }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: selected ? "var(--amber)" : "var(--text)" }}>{area.label}</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>{area.desc}</div>
              </button>
            );
          })}
        </div>
        <button className="btn btn-primary" style={{ width: "100%", marginTop: 20 }}
          disabled={!(signals.firstAreas || []).length}
          onClick={() => setStep(2)}>Next →</button>
      </div>
    ),
    // Step 2: What sensations signal a state shift
    () => (
      <div style={{ maxWidth: 400, margin: "0 auto" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 8 }}>Step 2 of 3</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, marginBottom: 8 }}>What signals a state shift?</h2>
        <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 12 }}>The physical sensations that show up when your system is changing gears — up or down.</p>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 24 }}>Select all that apply</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {sensations.map(s => {
            const selected = (signals.preSensations || []).includes(s);
            return (
              <button key={s} onClick={() => {
                const current = signals.preSensations || [];
                const updated = selected ? current.filter(x => x !== s) : [...current, s];
                save("preSensations", updated);
              }} style={{
                background: selected ? "var(--amber-glow)" : "var(--surface)",
                border: `1px solid ${selected ? "var(--amber)" : "var(--border)"}`,
                borderRadius: "var(--r-lg)", padding: "8px 16px", fontSize: 13, cursor: "pointer",
                color: selected ? "var(--amber)" : "var(--text-dim)", transition: "all 0.2s"
              }}>{s}</button>
            );
          })}
        </div>
        <button className="btn btn-primary" style={{ width: "100%", marginTop: 20 }}
          disabled={!(signals.preSensations || []).length}
          onClick={() => setStep(3)}>Next →</button>
      </div>
    ),
    // Step 3: Common triggers
    () => (
      <div style={{ maxWidth: 400, margin: "0 auto" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 8 }}>Step 3 of 3</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, marginBottom: 8 }}>What activates you?</h2>
        <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 8 }}>Choose what fits now. Categories keep this focused and easier to scan.</p>
        <p style={{ color: "var(--text-muted)", fontSize: 11, marginBottom: 12, fontStyle: "italic" }}>This isn't a diagnosis. It's self-knowledge. The more you identify, the earlier you'll catch the wave.</p>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 14 }}>
          {selectedTriggers.length} selected
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {triggerGroups.map((group) => {
            const selectedInGroup = group.options.filter((item) => selectedTriggers.includes(item)).length;
            return (
              <div key={group.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
                <button onClick={() => toggleTriggerGroup(group.id)} style={{
                  width: "100%", background: "none", border: "none", padding: "10px 12px",
                  cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <span style={{ fontSize: 12, color: "var(--text)" }}>{group.label}</span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {selectedInGroup > 0 ? `${selectedInGroup} selected` : ""} {openTriggerGroups[group.id] ? "▾" : "▸"}
                  </span>
                </button>
                {openTriggerGroups[group.id] && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "0 12px 12px" }}>
                    {group.options.map((option) => {
                      const selected = selectedTriggers.includes(option);
                      return (
                        <button key={option} onClick={() => {
                          const updated = selected
                            ? selectedTriggers.filter((value) => value !== option)
                            : [...selectedTriggers, option];
                          save("triggers", updated);
                        }} style={{
                          background: selected ? "var(--amber-glow)" : "var(--surface2)",
                          border: `1px solid ${selected ? "var(--amber)" : "var(--border)"}`,
                          borderRadius: "var(--r-lg)", padding: "8px 12px", fontSize: 12, cursor: "pointer",
                          color: selected ? "var(--amber)" : "var(--text-dim)", transition: "all 0.2s"
                        }}>
                          {option}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {!!selectedTriggers.length && (
          <button onClick={() => save("triggers", [])} style={{
            width: "100%", marginTop: 10, background: "none", border: "1px solid var(--border)",
            borderRadius: "var(--r)", padding: "8px 10px", color: "var(--text-muted)", fontSize: 12,
            fontFamily: "'DM Sans', sans-serif", cursor: "pointer"
          }}>
            Clear trigger selections
          </button>
        )}
        <button className="btn btn-primary" style={{ width: "100%", marginTop: 20 }}
          disabled={!selectedTriggers.length}
          onClick={() => setStep(4)}>Done →</button>
      </div>
    ),
    // Step 4: Profile complete
    () => (
      <div style={{ textAlign: "center", maxWidth: 360, margin: "0 auto" }}>
        <div style={{ fontSize: 28, marginBottom: 16 }}>✦</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, marginBottom: 12 }}>Signal profile saved.</h2>
        <p style={{ color: "var(--text-dim)", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
          Now you know what to watch for. Over time, you'll start catching these signals before they escalate.
        </p>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "16px 20px", textAlign: "left", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)" }}>Your signals</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: "0.14em", color: "var(--text-muted)", textTransform: "uppercase" }}>Telemetry Source: Manual</div>
          </div>
          <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 8 }}>
            <strong style={{ color: "var(--text)" }}>First to respond:</strong> {(signals.firstAreas || []).map(a => bodyAreas.find(b => b.id === a)?.label).join(", ")}
          </div>
          <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 8 }}>
            <strong style={{ color: "var(--text)" }}>State-shift signals:</strong> {(signals.preSensations || []).join(", ")}
          </div>
          <div style={{ fontSize: 13, color: "var(--text-dim)" }}>
            <strong style={{ color: "var(--text)" }}>Common triggers:</strong> {selectedTriggers.length ? selectedTriggers.join(", ") : "None selected yet"}
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => onComplete()}>Done</button>
      </div>
    )
  ];

  return (
    <div>
      {steps[step]()}
    </div>
  );
}

function FractalBreathCanvas({ breathScale = 0.5 }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const startRef = useRef(Date.now());
  const sizeRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let active = true;

    const setup = () => {
      try {
        if (!canvas.parentElement) return;
        const rect = canvas.parentElement.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + "px";
        canvas.style.height = rect.height + "px";
        sizeRef.current = { w: rect.width, h: rect.height };
      } catch {}
    };

    const animate = () => {
      if (!active) return;
      try {
        const ctx = canvas.getContext("2d");
        if (!ctx) { animRef.current = requestAnimationFrame(animate); return; }
        const { w, h } = sizeRef.current;
        if (w === 0 || h === 0) { setup(); animRef.current = requestAnimationFrame(animate); return; }
        const dpr = window.devicePixelRatio || 1;
        const t = (Date.now() - startRef.current) / 1000;
        ctx.save();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.fillStyle = "rgba(10,10,12,0.18)";
        ctx.fillRect(0, 0, w, h);
        // Center glow
        const gr = 60 + breathScale * 100;
        const grd = ctx.createRadialGradient(w / 2, h * 0.55, 0, w / 2, h * 0.55, gr);
        grd.addColorStop(0, `rgba(201,147,58,${0.04 + breathScale * 0.06})`);
        grd.addColorStop(1, "rgba(10,10,12,0)");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, w, h);
        // Particles
        for (let i = 0; i < Math.floor(8 + breathScale * 12); i++) {
          const px = (Math.sin(i * 7.3 + t * 0.05) * 0.5 + 0.5) * w;
          const py = (Math.sin(i * 3.7 + t * 0.04) * 0.5 + 0.5) * h;
          const sz = (1 + Math.sin(i + t * 0.1)) * 1.2 * breathScale;
          ctx.beginPath();
          ctx.arc(px, py, Math.max(0.5, sz), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(201,147,58,${0.1 + breathScale * 0.15})`;
          ctx.fill();
        }
        // Branches — iterative stack, no recursion
        const maxDepth = Math.min(4, Math.floor(3 + breathScale * 2));
        const stack = [
          { x: w / 2, y: h * 0.85, angle: -Math.PI / 2, len: 20 + breathScale * 35, depth: 0, opacity: 0.5 + breathScale * 0.4 },
          { x: w * 0.32, y: h * 0.87, angle: -Math.PI / 2 - 0.12, len: 14 + breathScale * 20, depth: 0, opacity: 0.25 + breathScale * 0.25 },
          { x: w * 0.68, y: h * 0.87, angle: -Math.PI / 2 + 0.12, len: 14 + breathScale * 20, depth: 0, opacity: 0.25 + breathScale * 0.25 }
        ];
        let iterations = 0;
        while (stack.length > 0 && iterations < 200) {
          iterations++;
          const b = stack.pop();
          if (b.depth > maxDepth || b.len < 3) continue;
          const sway = Math.sin(b.x * 0.01 + t * 0.3) * 0.12;
          const a = b.angle + sway;
          const ex = b.x + Math.cos(a) * b.len;
          const ey = b.y + Math.sin(a) * b.len;
          const alpha = b.opacity * (1 - b.depth / (maxDepth + 1)) * 0.7;
          const warmth = b.depth / Math.max(1, maxDepth);
          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          ctx.lineTo(ex, ey);
          ctx.strokeStyle = `rgba(${180 + Math.floor(warmth * 40)},${120 + Math.floor(warmth * 20)},${40 + Math.floor(warmth * 18)},${alpha})`;
          ctx.lineWidth = Math.max(0.5, (maxDepth - b.depth) * 0.9);
          ctx.lineCap = "round";
          ctx.stroke();
          const ba = 0.35 + Math.sin(b.depth + t * 0.1) * 0.12;
          const shrink = 0.65;
          stack.push({ x: ex, y: ey, angle: a - ba, len: b.len * shrink, depth: b.depth + 1, opacity: b.opacity });
          stack.push({ x: ex, y: ey, angle: a + ba, len: b.len * shrink, depth: b.depth + 1, opacity: b.opacity });
        }
        ctx.restore();
      } catch {}
      animRef.current = requestAnimationFrame(animate);
    };

    const initTimer = setTimeout(() => { setup(); animRef.current = requestAnimationFrame(animate); }, 150);
    const resizeHandler = () => setup();
    window.addEventListener("resize", resizeHandler);
    return () => { active = false; clearTimeout(initTimer); if (animRef.current) cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resizeHandler); };
  }, [breathScale]);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

function PanicMode({ onComplete }) {
  // Auto-starting breathing — no Begin button, no choices
  // 4-4-6-2 pattern, 4 cycles, then gently offer next step
  const contextEntryRef = useRef(consumePendingSessionEntryContext());
  const breathPhases = [
    { name: "Inhale", duration: 4, scale: 1.4 },
    { name: "Hold", duration: 4, scale: 1.4 },
    { name: "Exhale", duration: 6, scale: 1.0 },
    { name: "Rest", duration: 2, scale: 1.0 }
  ];
  const totalCycles = 4;

  // TIME-TO-REGULATION — silent timer starts on mount
  const startTime = useRef(Date.now());
  const [regulationTime, setRegulationTime] = useState(null);

  const formatTime = (ms) => {
    const totalSec = Math.round(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return min > 0 ? `${min}m ${sec}s` : `${sec}s`;
  };

  const saveSession = (exitPoint) => {
    const elapsed = Date.now() - startTime.current;
    setRegulationTime(elapsed);
    try {
      const ctx = contextEntryRef.current || {};
      appendSessionToStorage({
        timestamp: new Date().toISOString(),
        duration: elapsed,
        durationFormatted: formatTime(elapsed),
        tools: exitPoint === "grounding" ? ["breathe", "ground"] : ["breathe"],
        source: "panic",
        exitPoint,
        entryMode: ctx.entryMode || null,
        entryProtocolId: ctx.entryProtocolId || null
      });
    } catch {}
    return elapsed;
  };

  const [phaseIdx, setPhaseIdx] = useState(0);
  const [count, setCount] = useState(breathPhases[0].duration);
  const [cycle, setCycle] = useState(1);
  const [breathDone, setBreathDone] = useState(false);
  const [running, setRunning] = useState(true); // auto-start
  const [audioOn, setAudioOn] = useState(() => {
    try { return localStorage.getItem("stillform_audio") === "on"; } catch { return false; }
  });

  const toggleAudio = () => {
    setAudioOn(prev => {
      const next = !prev;
      try { localStorage.setItem("stillform_audio", next ? "on" : "off"); } catch {}
      if (!next) {
        // Stop current tone immediately
        try { if (activeOsc.current) { activeOsc.current.stop(); activeOsc.current = null; } } catch {}
      }
      return next;
    });
  };

  // Audio — gentle tones that guide breathing without words
  const audioCtx = useRef(null);
  const activeOsc = useRef(null);
  const activeGain = useRef(null);

  useEffect(() => {
    // Initialize audio context on mount (user already tapped the panic button)
    try {
      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.current.state === "suspended") audioCtx.current.resume();
    } catch {}
    return () => {
      // Cleanup on unmount
      try {
        if (activeOsc.current) { activeOsc.current.stop(); activeOsc.current = null; }
        if (audioCtx.current) audioCtx.current.close();
      } catch {}
    };
  }, []);

  // Play tone when phase changes
  useEffect(() => {
    if (!running || breathDone || !audioCtx.current || !audioOn) return;
    const ctx = audioCtx.current;
    if (ctx.state === "suspended") ctx.resume();

    // Stop previous tone
    try {
      if (activeOsc.current) { activeOsc.current.stop(); activeOsc.current = null; }
    } catch {}

    const phase = breathPhases[phaseIdx];
    if (phase.name === "Rest") return; // silence during rest

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      const dur = phase.duration;

      if (phase.name === "Inhale") {
        // Ascending tone — 180Hz to 280Hz, gentle fade in
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(280, now + dur);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.5);
        gain.gain.setValueAtTime(0.08, now + dur - 0.3);
        gain.gain.linearRampToValueAtTime(0, now + dur);
      } else if (phase.name === "Hold") {
        // Steady gentle tone at 280Hz
        osc.frequency.setValueAtTime(280, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.3);
        gain.gain.setValueAtTime(0.05, now + dur - 0.3);
        gain.gain.linearRampToValueAtTime(0, now + dur);
      } else if (phase.name === "Exhale") {
        // Descending tone — 280Hz to 140Hz, longer fade out
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.linearRampToValueAtTime(140, now + dur);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.3);
        gain.gain.linearRampToValueAtTime(0.02, now + dur - 0.5);
        gain.gain.linearRampToValueAtTime(0, now + dur);
      }

      osc.start(now);
      osc.stop(now + dur);
      activeOsc.current = osc;
      activeGain.current = gain;
    } catch {}
  }, [phaseIdx, running, breathDone, audioOn]);

  // Grounding
  const groundSteps = [
    { num: 5, prompt: "Name 5 things you can see." },
    { num: 4, prompt: "Name 4 things you can feel." },
    { num: 3, prompt: "Name 3 things you can hear." },
    { num: 2, prompt: "Name 2 things you can smell." },
    { num: 1, prompt: "Name 1 thing you can taste." }
  ];
  const [showGround, setShowGround] = useState(false);
  const [groundStep, setGroundStep] = useState(0);
  const [groundDone, setGroundDone] = useState(false);

  useEffect(() => {
    if (!running || breathDone) return;
    if (count === 0) {
      const next = (phaseIdx + 1) % breathPhases.length;
      if (next === 0) {
        if (cycle >= totalCycles) {
          setBreathDone(true);
          setRunning(false);
          return;
        }
        setCycle(c => c + 1);
      }
      setPhaseIdx(next);
      setCount(breathPhases[next].duration);
    } else {
      const t = setTimeout(() => setCount(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [count, running, phaseIdx, cycle, breathDone]);

  const currentPhase = breathPhases[phaseIdx];
  const circleTransform = `scale(${currentPhase.scale})`;
  const circleGlow = currentPhase.scale > 1.2
    ? "0 0 60px rgba(201,147,58,0.12), 0 0 120px rgba(201,147,58,0.04)"
    : "0 0 20px rgba(201,147,58,0.05)";

  // GROUNDING DONE
  if (groundDone) {
    const elapsed = regulationTime || saveSession("grounding");
    return (
      <div className="panic-screen panic-done">
        <div style={{ fontSize: 28, marginBottom: 16 }}>◎</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: "var(--text)", marginBottom: 8 }}>
          You're here.
        </div>
        <div className="panic-done-text">
          Present. Breathing. Grounded.
        </div>
        <div style={{ fontSize: 14, color: "var(--amber)", marginBottom: 8, letterSpacing: "0.04em" }}>
          Regulated in {formatTime(elapsed)}
        </div>
        {(() => {
          try {
            const sessions = getSessionsFromStorage();
            if (sessions.length > 1) {
              return <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 24 }}>
                Session #{sessions.length}.
              </div>;
            }
          } catch {}
          return <div style={{ marginBottom: 24 }} />;
        })()}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 280 }}>
          <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => onComplete("reframe-calm")}>
            Talk through something
          </button>
          <button className="btn btn-ghost" style={{ width: "100%" }} onClick={() => onComplete()}>
            Done — close
          </button>
          <a onClick={() => onComplete("crisis")} style={{ display: "block", marginTop: 12, fontSize: 12, color: "var(--text-muted)", textAlign: "center", cursor: "pointer" }}>
            Crisis resources →
          </a>
        </div>
        
      </div>
    );
  }

  // GROUNDING ACTIVE
  if (showGround) {
    const step = groundSteps[groundStep];
    return (
      <div className="panic-screen">
        <div style={{ fontSize: 48, fontWeight: 300, color: "var(--amber)", marginBottom: 16, fontFamily: "'Cormorant Garamond', serif" }}>
          {step.num}
        </div>
        <div style={{ fontSize: 16, color: "var(--text-dim)", marginBottom: 32, maxWidth: 260, lineHeight: 1.6 }}>
          {step.prompt}
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
          {groundSteps.map((_, i) => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: "50%",
              background: i <= groundStep ? "var(--amber)" : "var(--border)",
              transition: "all 0.3s ease"
            }} />
          ))}
        </div>
        <button className="btn btn-primary" onClick={() => {
          if (groundStep < groundSteps.length - 1) setGroundStep(s => s + 1);
          else setGroundDone(true);
        }}>
          {groundStep < groundSteps.length - 1 ? "Next →" : "Done"}
        </button>
      </div>
    );
  }

  // BREATHING DONE — offer next step
  if (breathDone && !showGround) {
    return (
      <div className="panic-screen panic-done">
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "var(--amber)", letterSpacing: "0.1em", marginBottom: 12 }}>
          Composure restored
        </div>
        <div className="panic-done-text">
          Baseline reset. You're steady. Proceed.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 280 }}>
          <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => setShowGround(true)}>
            Continue to grounding →
          </button>
          <button className="btn btn-ghost" style={{ width: "100%" }} onClick={() => onComplete("reframe-calm")}>
            Talk through something
          </button>
          <button className="btn btn-ghost" style={{ width: "100%", color: "var(--text-muted)", fontSize: 13 }} onClick={() => {
            saveSession("breathing-only");
            onComplete();
          }}>
            Done — close
          </button>
        </div>
        
      </div>
    );
  }

  // BREATHING ACTIVE — auto-started, one instruction only
  const visualGrounding = (() => { try { return localStorage.getItem("stillform_visual_grounding") !== "off"; } catch { return true; } })();
  const breathScale = (currentPhase.scale - 1.0) / 0.4; // normalize 1.0-1.4 to 0-1
  return (
    <div className="panic-screen" style={{ position: "relative", overflow: "hidden" }}>
      {visualGrounding && <FractalBreathCanvas breathScale={Math.max(0, Math.min(1, breathScale))} />}
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, width: "100%" }}>
      {/* Audio toggle — visible, labeled */}
      <button
        onClick={toggleAudio}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: audioOn ? "var(--amber-glow)" : "var(--surface)",
          border: `1px solid ${audioOn ? "var(--amber-dim)" : "var(--border)"}`,
          borderRadius: "var(--r-lg)",
          padding: "8px 14px",
          fontSize: 12,
          color: audioOn ? "var(--amber)" : "var(--text-dim)",
          cursor: "pointer",
          WebkitTapHighlightColor: "transparent",
          transition: "all 0.2s ease",
          zIndex: 10,
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: "0.04em"
        }}
        aria-label={audioOn ? "Mute audio" : "Unmute audio"}
      >
        {audioOn ? "♪ Sound on" : "♪ Sound off"}
      </button>

      <div className="panic-instruction">
        Follow this circle
      </div>

      <div className="panic-circle-wrap">
        <div className="panic-circle" style={{
          transform: circleTransform,
          boxShadow: circleGlow,
          transitionDuration: `${currentPhase.duration}s`
        }}>
          <span className="panic-phase">{currentPhase.name}</span>
        </div>
      </div>

      <div className="panic-counter">{cycle} of {totalCycles}</div>
      </div>
    </div>
  );
}

const getFocusCheckHistoryFromStorage = () => {
  try {
    const history = JSON.parse(localStorage.getItem("stillform_focus_check_history") || "[]");
    return Array.isArray(history) ? history : [];
  } catch {
    return [];
  }
};

function FocusCheckValidation({
  onBack,
  onCompleteRun = null,
  autoReturnToCaller = false,
  hideBack = false,
  autoStart = false,
  compact = false
}) {
  const [focusCheckMode, setFocusCheckMode] = useState("idle");
  const [focusCheckTrials, setFocusCheckTrials] = useState([]);
  const [focusCheckIndex, setFocusCheckIndex] = useState(0);
  const [focusCheckResponded, setFocusCheckResponded] = useState(false);
  const [focusCheckTrialStartedAt, setFocusCheckTrialStartedAt] = useState(0);
  const [focusCheckStats, setFocusCheckStats] = useState({
    hits: 0,
    misses: 0,
    falseAlarms: 0,
    correctRejects: 0,
    totalGo: 0,
    totalNoGo: 0,
    reactionTimes: []
  });
  const [latestSummary, setLatestSummary] = useState(() => {
    const history = getFocusCheckHistoryFromStorage();
    return history.length ? history[history.length - 1] : null;
  });
  const autoStartedRef = useRef(false);
  const currentFocusTrial = focusCheckTrials[focusCheckIndex] || null;
  const previousSummary = (() => {
    const history = getFocusCheckHistoryFromStorage();
    return history.length > 1 ? history[history.length - 2] : null;
  })();
  const startFocusCheck = () => {
    const trials = Array.from({ length: 30 }, (_, idx) => {
      const type = Math.random() < 0.7 ? "go" : "nogo";
      return { id: `${Date.now()}-${idx}`, type, label: type === "go" ? "GO" : "NO-GO" };
    });
    const totalGo = trials.filter((t) => t.type === "go").length;
    const totalNoGo = trials.length - totalGo;
    setFocusCheckTrials(trials);
    setFocusCheckIndex(0);
    setFocusCheckResponded(false);
    setFocusCheckTrialStartedAt(Date.now());
    setFocusCheckStats({
      hits: 0,
      misses: 0,
      falseAlarms: 0,
      correctRejects: 0,
      totalGo,
      totalNoGo,
      reactionTimes: []
    });
    setFocusCheckMode("running");
  };
  const submitFocusResponse = () => {
    if (focusCheckMode !== "running" || !currentFocusTrial || focusCheckResponded) return;
    const rt = Math.max(0, Date.now() - focusCheckTrialStartedAt);
    setFocusCheckResponded(true);
    setFocusCheckStats((prev) => {
      if (currentFocusTrial.type === "go") {
        return { ...prev, hits: prev.hits + 1, reactionTimes: [...prev.reactionTimes, rt] };
      }
      return { ...prev, falseAlarms: prev.falseAlarms + 1 };
    });
    window.setTimeout(() => {
      setFocusCheckIndex((prev) => prev + 1);
      setFocusCheckResponded(false);
    }, 80);
  };
  useEffect(() => {
    if (focusCheckMode !== "running" || !currentFocusTrial || focusCheckResponded) return;
    setFocusCheckTrialStartedAt(Date.now());
    const timer = window.setTimeout(() => {
      setFocusCheckStats((prev) => {
        if (currentFocusTrial.type === "go") return { ...prev, misses: prev.misses + 1 };
        return { ...prev, correctRejects: prev.correctRejects + 1 };
      });
      setFocusCheckIndex((prev) => prev + 1);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [focusCheckMode, focusCheckIndex, currentFocusTrial?.id, focusCheckResponded]);
  useEffect(() => {
    if (focusCheckMode !== "running") return;
    if (focusCheckIndex < focusCheckTrials.length) return;
    const avgReactionMs = focusCheckStats.reactionTimes.length
      ? Math.round(focusCheckStats.reactionTimes.reduce((sum, value) => sum + value, 0) / focusCheckStats.reactionTimes.length)
      : null;
    const accuracy = focusCheckTrials.length
      ? Math.round(((focusCheckStats.hits + focusCheckStats.correctRejects) / focusCheckTrials.length) * 100)
      : null;
    const inhibition = focusCheckStats.totalNoGo
      ? Math.round((focusCheckStats.correctRejects / focusCheckStats.totalNoGo) * 100)
      : null;
    const entry = {
      timestamp: new Date().toISOString(),
      trials: focusCheckTrials.length,
      accuracy,
      inhibition,
      avgReactionMs,
      falseAlarms: focusCheckStats.falseAlarms
    };
    try {
      const history = getFocusCheckHistoryFromStorage();
      const next = [...history, entry].slice(-20);
      localStorage.setItem("stillform_focus_check_history", JSON.stringify(next));
      setLatestSummary(entry);
    } catch {
      setLatestSummary(entry);
    }
    try { window.plausible("Focus Check Completed"); } catch {}
    if (typeof onCompleteRun === "function") {
      try { onCompleteRun(entry); } catch {}
      if (autoReturnToCaller) {
        setFocusCheckMode("idle");
        return;
      }
    }
    setFocusCheckMode("complete");
  }, [focusCheckMode, focusCheckIndex, focusCheckTrials.length, focusCheckStats, onCompleteRun, autoReturnToCaller]);
  useEffect(() => {
    if (focusCheckMode !== "running") return undefined;
    const onKeyDown = (event) => {
      if (event.key !== " " && event.key !== "Enter") return;
      event.preventDefault();
      submitFocusResponse();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focusCheckMode, submitFocusResponse]);
  useEffect(() => {
    if (!autoStart || autoStartedRef.current) return;
    autoStartedRef.current = true;
    startFocusCheck();
  }, [autoStart]);
  const containerStyle = compact
    ? { background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "14px 16px", marginBottom: 12 }
    : { maxWidth: 480, margin: "0 auto", padding: "48px 24px 80px" };
  return (
    <section style={containerStyle}>
      {!hideBack && <button className="intervention-back" onClick={onBack}>← Back</button>}
      {!compact && <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, marginBottom: 8 }}>Composure Check</h1>}
      <div style={{ fontSize: compact ? 12 : 13, color: "var(--text-dim)", lineHeight: 1.7, marginBottom: 16 }}>
        30-second Go/No-Go validation. Tap for GO. Hold on NO-GO.
        <br />
        This checks response inhibition so you can confirm cognitive readiness before a high-stakes decision, message, or meeting.
      </div>
      <div style={{ background: "var(--surface2)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "14px 16px", marginBottom: 12 }}>
        {focusCheckMode === "running" && currentFocusTrial && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
              Trial {Math.min(focusCheckIndex + 1, focusCheckTrials.length)} / {focusCheckTrials.length}
            </div>
            <div style={{ fontSize: 32, letterSpacing: "0.08em", color: currentFocusTrial.type === "go" ? "var(--amber)" : "var(--text)", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 8 }}>
              {currentFocusTrial.label}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 10 }}>
              {currentFocusTrial.type === "go" ? "Tap now" : "Do not tap"}
            </div>
            <button
              onClick={submitFocusResponse}
              disabled={focusCheckResponded}
              style={{
                background: focusCheckResponded ? "var(--surface2)" : "var(--amber-glow)",
                border: "0.5px solid var(--amber-dim)",
                borderRadius: "var(--r-sm)",
                padding: "10px 16px",
                fontSize: 12,
                color: focusCheckResponded ? "var(--text-muted)" : "var(--amber)",
                cursor: focusCheckResponded ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans', sans-serif"
              }}
            >
              {focusCheckResponded ? "Recorded" : "Respond"}
            </button>
            <div style={{ marginTop: 8, fontSize: 10, color: "var(--text-muted)" }}>Keyboard: Space or Enter</div>
          </div>
        )}
        {focusCheckMode !== "running" && !autoStart && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.6 }}>
              {latestSummary ? "Latest run saved. Run again anytime." : "No run yet. Start when ready."}
            </div>
            <button
              onClick={startFocusCheck}
              style={{
                background: "var(--amber)", color: "#0A0A0C", border: "none", borderRadius: "var(--r)",
                padding: "9px 12px", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap"
              }}
            >
              Start 30s
            </button>
          </div>
        )}
      </div>
      {latestSummary && (
        <div style={{ background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "12px 14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
            <div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Accuracy</div>
              <div style={{ fontSize: 14, color: "var(--amber)", marginTop: 2 }}>{latestSummary.accuracy ?? "N/A"}%</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Inhibition</div>
              <div style={{ fontSize: 14, color: "var(--amber)", marginTop: 2 }}>{latestSummary.inhibition ?? "N/A"}%</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Avg RT</div>
              <div style={{ fontSize: 14, color: "var(--amber)", marginTop: 2 }}>{latestSummary.avgReactionMs ? `${latestSummary.avgReactionMs}ms` : "N/A"}</div>
            </div>
          </div>
          {previousSummary && (
            <div style={{ marginTop: 8, fontSize: 11, color: "var(--text-dim)" }}>
              Delta vs prior: accuracy {latestSummary.accuracy - (previousSummary.accuracy || 0) >= 0 ? "+" : ""}{latestSummary.accuracy - (previousSummary.accuracy || 0)} pts · inhibition {latestSummary.inhibition - (previousSummary.inhibition || 0) >= 0 ? "+" : ""}{latestSummary.inhibition - (previousSummary.inhibition || 0)} pts
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function MyProgress({ onBack }) {
  const [openSections, setOpenSections] = useState({});
  const toggle = (key) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  const [shareCardStatus, setShareCardStatus] = useState("");
  const [viewEntry, setViewEntry] = useState(null);
  const [journalEntries, setJournalEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem("stillform_journal") || "[]"); } catch { return []; }
  });
  const latestFocusHistory = getFocusCheckHistoryFromStorage();
  const focusCheckSummary = latestFocusHistory.length ? latestFocusHistory[latestFocusHistory.length - 1] : null;
  const previousFocusSummary = latestFocusHistory.length > 1 ? latestFocusHistory[latestFocusHistory.length - 2] : null;
  const focusAccuracyDelta = (
    focusCheckSummary
    && previousFocusSummary
    && Number.isFinite(focusCheckSummary.accuracy)
    && Number.isFinite(previousFocusSummary.accuracy)
  ) ? focusCheckSummary.accuracy - previousFocusSummary.accuracy : null;
  const focusInhibitionDelta = (
    focusCheckSummary
    && previousFocusSummary
    && Number.isFinite(focusCheckSummary.inhibition)
    && Number.isFinite(previousFocusSummary.inhibition)
  ) ? focusCheckSummary.inhibition - previousFocusSummary.inhibition : null;
  const focusReactionDelta = (
    focusCheckSummary
    && previousFocusSummary
    && Number.isFinite(focusCheckSummary.avgReactionMs)
    && Number.isFinite(previousFocusSummary.avgReactionMs)
  ) ? focusCheckSummary.avgReactionMs - previousFocusSummary.avgReactionMs : null;

  const sessions = getSessionsFromStorage();
  const savedReframes = (() => { try { return JSON.parse(localStorage.getItem("stillform_saved_reframes") || "[]"); } catch { return []; } })();
  const biasProfile = (() => { try { return JSON.parse(localStorage.getItem("stillform_bias_profile") || "null"); } catch { return null; } })();
  const signalProfile = (() => { try { return JSON.parse(localStorage.getItem("stillform_signal_profile") || "null"); } catch { return null; } })();

  const toolNames = { breathe: "Breathe", ground: "Breathe", "body-scan": "Body Scan", reframe: "Reframe", sigh: "Breathe", metacognition: "Observe and Choose" };
  const toolCounts = {};
  sessions.forEach(s => (s.tools || []).forEach(t => { toolCounts[t] = (toolCounts[t] || 0) + 1; }));
  const topToolEntry = Object.entries(toolCounts).sort((a, b) => b[1] - a[1])[0] || null;

  const sessionsWithRatings = sessions.filter(s => s.preRating && s.postRating);
  const avgDelta = sessionsWithRatings.length > 0
    ? (sessionsWithRatings.reduce((sum, s) => sum + (s.delta || 0), 0) / sessionsWithRatings.length).toFixed(1)
    : null;

  const daySet = new Set(sessions.map(s => s.timestamp?.slice(0, 10)).filter(Boolean));
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    if (daySet.has(d.toISOString().slice(0, 10))) streak++; else break;
  }

  const emotionFreq = {};
  journalEntries.forEach(e => (e.emotions || []).forEach(em => { emotionFreq[em] = (emotionFreq[em] || 0) + 1; }));
  const topEmotionEntry = Object.entries(emotionFreq).sort((a, b) => b[1] - a[1])[0] || null;

  // --- TREND ANALYSIS ---
  // Signal area frequency from journal
  const signalFreq = {};
  journalEntries.forEach(e => (e.signal || []).forEach(s => { signalFreq[s] = (signalFreq[s] || 0) + 1; }));

  // Trigger type frequency
  const triggerFreq = {};
  journalEntries.forEach(e => { if (e.triggerType) triggerFreq[e.triggerType] = (triggerFreq[e.triggerType] || 0) + 1; });

  // Outcome distribution
  const outcomeFreq = {};
  journalEntries.forEach(e => { if (e.outcome) outcomeFreq[e.outcome] = (outcomeFreq[e.outcome] || 0) + 1; });

  // Session improvement trend — compare first half vs second half avg delta
  const halfLen = Math.floor(sessionsWithRatings.length / 2);
  const firstHalf = sessionsWithRatings.slice(0, halfLen);
  const secondHalf = sessionsWithRatings.slice(halfLen);
  const firstAvg = firstHalf.length ? firstHalf.reduce((s, e) => s + (e.delta || 0), 0) / firstHalf.length : null;
  const secondAvg = secondHalf.length ? secondHalf.reduce((s, e) => s + (e.delta || 0), 0) / secondHalf.length : null;
  const improving = firstAvg !== null && secondAvg !== null && secondAvg > firstAvg;

  const hasPatterns = journalEntries.length >= 3 || sessionsWithRatings.length >= 5;

  // --- SIGNAL AWARENESS LATENCY ---
  // Proxy: session duration trend (shorter = catching it earlier)
  // Autonomous exits: "I saw it and didn't need help"
  const autonomousExits = sessions.filter(s =>
    s.source === "metacognition" && (s.exitPoint === "autonomous" || s.exitPoint === "self-regulated")
  ).length;

  // Session duration trend — compare recent 5 vs prior 5
  const timedSessions = sessions.filter(s => s.duration && s.duration > 0);
  const recentFive = timedSessions.slice(-5);
  const priorFive = timedSessions.slice(-10, -5);
  const recentAvgDuration = recentFive.length
    ? recentFive.reduce((sum, s) => sum + s.duration, 0) / recentFive.length / 1000 / 60
    : null;
  const priorAvgDuration = priorFive.length
    ? priorFive.reduce((sum, s) => sum + s.duration, 0) / priorFive.length / 1000 / 60
    : null;
  const durationTrend = recentAvgDuration !== null && priorAvgDuration !== null
    ? priorAvgDuration - recentAvgDuration // positive = getting faster
    : null;

  // Autonomous exit trend — last 30 days vs prior 30 days
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const sixtyDaysAgo = Date.now() - 60 * 24 * 60 * 60 * 1000;
  const recentAutoExits = sessions.filter(s =>
    s.source === "metacognition" &&
    (s.exitPoint === "autonomous" || s.exitPoint === "self-regulated") &&
    new Date(s.timestamp).getTime() > thirtyDaysAgo
  ).length;
  const priorAutoExits = sessions.filter(s =>
    s.source === "metacognition" &&
    (s.exitPoint === "autonomous" || s.exitPoint === "self-regulated") &&
    new Date(s.timestamp).getTime() > sixtyDaysAgo &&
    new Date(s.timestamp).getTime() <= thirtyDaysAgo
  ).length;

  // Additional data sources
  const checkinToday = (() => { try { return JSON.parse(localStorage.getItem("stillform_checkin_today") || "null"); } catch { return null; } })();
  const eodToday = (() => { try { return JSON.parse(localStorage.getItem("stillform_eod_today") || "null"); } catch { return null; } })();
  const morningOpenHistory = readArrayFromStorage(LOOP_HISTORY_KEYS.morningStart);
  const morningHistory = readArrayFromStorage(LOOP_HISTORY_KEYS.morning);
  const eodOpenHistory = readArrayFromStorage(LOOP_HISTORY_KEYS.eodStart);
  const eodHistory = readArrayFromStorage(LOOP_HISTORY_KEYS.eod);
  const loopNudgeEvents = readArrayFromStorage(LOOP_NUDGE_EVENTS_KEY);
  const morningOpen14dDays = recentDaySet(morningOpenHistory);
  const morningDone14dDays = recentDaySet(morningHistory);
  const eodOpen14dDays = recentDaySet(eodOpenHistory);
  const eodDone14dDays = recentDaySet(eodHistory);

  const morning14dCount = morningHistory.filter((entry) => withinDays(entry?.date || entry?.timestamp, 14)).length;
  const eod14dCount = eodHistory.filter((entry) => withinDays(entry?.date || entry?.timestamp, 14)).length;
  const loopCompletion14d = Math.round(((morning14dCount + eod14dCount) / (14 * 2)) * 100);
  const morningCompletion14d = Math.round((morning14dCount / 14) * 100);
  const eodCompletion14d = Math.round((eod14dCount / 14) * 100);
  const morningDropoff14dCount = Array.from(morningOpen14dDays).filter((day) => !morningDone14dDays.has(day)).length;
  const eodDropoff14dCount = Array.from(eodOpen14dDays).filter((day) => !eodDone14dDays.has(day)).length;
  const morningDropoff14dPct = morningOpen14dDays.size ? Math.round((morningDropoff14dCount / morningOpen14dDays.size) * 100) : 0;
  const eodDropoff14dPct = eodOpen14dDays.size ? Math.round((eodDropoff14dCount / eodOpen14dDays.size) * 100) : 0;
  const loopNudgeShown14d = (Array.isArray(loopNudgeEvents) ? loopNudgeEvents : []).filter(
    (entry) => entry?.event === "shown" && withinDays(entry?.date || entry?.timestamp, 14)
  );
  const loopNudgeActioned14d = (Array.isArray(loopNudgeEvents) ? loopNudgeEvents : []).filter(
    (entry) => entry?.event === "actioned" && withinDays(entry?.date || entry?.timestamp, 14)
  );
  const recoveredNudges14d = loopNudgeShown14d.filter((entry) => (
    entry?.type === "morning"
      ? morningDone14dDays.has(entry?.date)
      : eodDone14dDays.has(entry?.date)
  )).length;
  const nudgeRecovery14dPct = loopNudgeShown14d.length
    ? Math.round((recoveredNudges14d / loopNudgeShown14d.length) * 100)
    : null;
  const completionRatio14d = (morningDone14dDays.size + eodDone14dDays.size) / (14 * 2);
  const loopNudgeDismissStreak = (() => {
    try {
      const raw = Number.parseInt(localStorage.getItem(LOOP_NUDGE_DISMISS_STREAK_KEY) || "0", 10);
      return Number.isFinite(raw) ? Math.max(0, raw) : 0;
    } catch {
      return 0;
    }
  })();
  const groundingHistory = (() => { try { return JSON.parse(localStorage.getItem("stillform_grounding_data") || "[]"); } catch { return []; } })();
  const aiSessionNotes = (() => { try { return JSON.parse(localStorage.getItem("stillform_ai_session_notes") || "[]"); } catch { return []; } })();
  const aiInternalSessionNotes = (Array.isArray(aiSessionNotes) ? aiSessionNotes : []).filter((n) => n?.noteType !== "user-facing");
  const aiUserFacingInsights = (Array.isArray(aiSessionNotes) ? aiSessionNotes : []).filter((n) => (
    n?.noteType === "user-facing" || !n?.noteType
  ));
  const regulationType = (() => { try { return localStorage.getItem("stillform_regulation_type") || null; } catch { return null; } })();
  const proofRatedSessions = sessions.filter(s => s.preRating && s.postRating && Number.isFinite(s.postRating - s.preRating));
  const proofActiveDays = new Set(sessions.map(s => (s.timestamp || "").slice(0, 10)).filter(Boolean)).size;
  const proofProtocolRuns = sessions.filter(s => s.entryMode && String(s.entryMode).startsWith("protocol-")).length;
  const proofAvgShift = proofRatedSessions.length
    ? (proofRatedSessions.reduce((sum, s) => sum + (s.postRating - s.preRating), 0) / proofRatedSessions.length)
    : null;
  const topToolName = topToolEntry ? (toolNames[topToolEntry[0]] || topToolEntry[0]) : "Mixed";
  const toolDebriefs = getToolDebriefsFromStorage();
  const normalizedRegulationType = regulationType === "thought-first" || regulationType === "body-first"
    ? regulationType
    : "balanced";
  const recent30ToolSessions = sessions
    .filter((session) => withinDays(session?.timestamp, 30))
    .map((session) => {
      const primaryToolId = getPrimarySessionToolId(session);
      const toolFamily = getToolFamily(primaryToolId);
      return { ...session, primaryToolId, toolFamily };
    })
    .filter((session) => session.toolFamily);
  const defaultToolFamily = (() => {
    if (normalizedRegulationType === "thought-first") return "cognitive";
    if (normalizedRegulationType === "body-first") return "somatic";
    if (!recent30ToolSessions.length) return null;
    const familyCounts = recent30ToolSessions.reduce((acc, session) => {
      acc[session.toolFamily] = (acc[session.toolFamily] || 0) + 1;
      return acc;
    }, {});
    const sorted = Object.entries(familyCounts).sort((a, b) => b[1] - a[1]);
    if (!sorted.length) return null;
    if (sorted.length > 1 && sorted[0][1] === sorted[1][1]) return null;
    return sorted[0][0];
  })();
  const defaultPatternAccuracy30d = defaultToolFamily && recent30ToolSessions.length
    ? Math.round((recent30ToolSessions.filter((session) => session.toolFamily === defaultToolFamily).length / recent30ToolSessions.length) * 100)
    : null;
  const defaultPatternLabel = defaultToolFamily === "cognitive"
    ? "Cognitive-first"
    : defaultToolFamily === "somatic"
      ? "Somatic-first"
      : "No dominant default";
  const switchAgility30d = (() => {
    const dayFamilies = {};
    recent30ToolSessions.forEach((session) => {
      const day = toDayKey(session?.timestamp);
      if (!day) return;
      if (!dayFamilies[day]) dayFamilies[day] = new Set();
      dayFamilies[day].add(session.toolFamily);
    });
    const sets = Object.values(dayFamilies);
    if (!sets.length) return null;
    const switchedDays = sets.filter((set) => set.size > 1).length;
    return Math.round((switchedDays / sets.length) * 100);
  })();
  const debriefCoverage30d = (() => {
    const debriefs30d = toolDebriefs.filter((entry) => withinDays(entry?.timestamp || entry?.date, 30));
    if (recent30ToolSessions.length === 0) return null;
    return Math.min(100, Math.round((debriefs30d.length / recent30ToolSessions.length) * 100));
  })();
  const recent7ToolSessions = sessions
    .filter((session) => withinDays(session?.timestamp, 7))
    .map((session) => {
      const primaryToolId = getPrimarySessionToolId(session);
      const toolFamily = getToolFamily(primaryToolId);
      return { ...session, primaryToolId, toolFamily };
    });
  const weeklyToolCounts = {};
  recent7ToolSessions.forEach((session) => {
    if (!session.primaryToolId) return;
    weeklyToolCounts[session.primaryToolId] = (weeklyToolCounts[session.primaryToolId] || 0) + 1;
  });
  const weeklyTopToolEntry = Object.entries(weeklyToolCounts).sort((a, b) => b[1] - a[1])[0] || null;
  const weeklyTopToolLabelMap = {
    reframe: "Reframe",
    breathe: "Breathe",
    scan: "Body Scan",
    "body-scan": "Body Scan"
  };
  const weeklyTopToolLabel = weeklyTopToolEntry
    ? (weeklyTopToolLabelMap[weeklyTopToolEntry[0]] || weeklyTopToolEntry[0])
    : null;
  const weeklyAvgShift = (() => {
    const rated = sessions.filter((session) => (
      withinDays(session?.timestamp, 7)
      && Number.isFinite(Number(session?.preRating))
      && Number.isFinite(Number(session?.postRating))
    ));
    if (!rated.length) return null;
    const sum = rated.reduce((total, session) => total + (Number(session.postRating) - Number(session.preRating)), 0);
    return sum / rated.length;
  })();
  const weeklySwitchAgility = (() => {
    const dayFamilies = {};
    recent7ToolSessions.forEach((session) => {
      if (!session.toolFamily) return;
      const day = toDayKey(session?.timestamp);
      if (!day) return;
      if (!dayFamilies[day]) dayFamilies[day] = new Set();
      dayFamilies[day].add(session.toolFamily);
    });
    const sets = Object.values(dayFamilies);
    if (!sets.length) return null;
    const switchedDays = sets.filter((set) => set.size > 1).length;
    return Math.round((switchedDays / sets.length) * 100);
  })();
  const weeklyDebriefs = toolDebriefs.filter((entry) => withinDays(entry?.timestamp || entry?.date, 7));
  const weeklyTopDebrief = (() => {
    if (!weeklyDebriefs.length) return null;
    const counts = {};
    weeklyDebriefs.forEach((entry) => {
      const text = String(entry?.reflectionText || "").trim();
      if (!text) return;
      counts[text] = (counts[text] || 0) + 1;
    });
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || null;
    if (!top) return null;
    return { text: top[0], count: top[1] };
  })();
  const weeklyReflectionSummary = (() => {
    const lines = [];
    if (recent7ToolSessions.length > 0) {
      lines.push(`${recent7ToolSessions.length} tool session${recent7ToolSessions.length !== 1 ? "s" : ""} in the last 7 days.`);
    } else {
      lines.push("No completed tool sessions in the last 7 days.");
    }
    if (weeklyTopToolLabel) {
      lines.push(`Most used this week: ${weeklyTopToolLabel}.`);
    }
    if (Number.isFinite(weeklyAvgShift)) {
      lines.push(`Average composure gain this week: ${weeklyAvgShift >= 0 ? "+" : ""}${weeklyAvgShift.toFixed(1)}.`);
    }
    if (Number.isFinite(weeklySwitchAgility)) {
      lines.push(`Switch agility this week: ${weeklySwitchAgility}%.`);
    }
    if (weeklyTopDebrief?.text) {
      lines.push(`Most repeated lock-in: "${weeklyTopDebrief.text}"${weeklyTopDebrief.count > 1 ? ` (${weeklyTopDebrief.count}x)` : ""}.`);
    }
    return lines;
  })();
  const ratingDeltaSessionsForProof = sessions.filter((session) => (
    Number.isFinite(Number(session?.preRating))
    && Number.isFinite(Number(session?.postRating))
  ));
  const recent30RatedForProof = ratingDeltaSessionsForProof.filter((session) => withinDays(session?.timestamp, 30));
  const positiveRecent30ForProof = recent30RatedForProof.filter((session) => (
    Number(session.postRating) - Number(session.preRating)
  ) > 0).length;
  const acuteShiftRate30dForProof = recent30RatedForProof.length
    ? Math.round((positiveRecent30ForProof / recent30RatedForProof.length) * 100)
    : null;
  const recoveredFromHighActivationForProof = recent30RatedForProof.filter((session) => (
    Number(session.preRating) <= 2
    && Number(session.postRating) >= 3
    && Number.isFinite(Number(session.duration))
    && Number(session.duration) > 0
  ));
  const recoverySpeedMinutesForProof = recoveredFromHighActivationForProof.length
    ? (recoveredFromHighActivationForProof.reduce((sum, session) => sum + Number(session.duration || 0), 0) / recoveredFromHighActivationForProof.length / 60)
    : null;
  const communicationEvents30dForProof = readArrayFromStorage(COMMUNICATION_EVENTS_KEY).filter((entry) => (
    withinDays(entry?.timestamp || entry?.date, 30)
  ));
  const communicationActionSetForProof = {
    opportunity: new Set(["state-to-statement-opportunity", "opportunity", "presented"]),
    drafted: new Set(["state-to-statement-drafted", "drafted"]),
    sentConfirmed: new Set(["state-to-statement-sent-confirmed", "sent-confirmed"])
  };
  const normalizedCommunicationEvents30dForProof = communicationEvents30dForProof.map((entry) => {
    const rawAction = String(entry?.action || "");
    const matched = Object.entries(communicationActionSetForProof).find(([, values]) => values.has(rawAction));
    return { ...entry, normalizedAction: matched?.[0] || rawAction };
  });
  const opportunity30dForProof = normalizedCommunicationEvents30dForProof.filter((entry) => entry.normalizedAction === "opportunity").length;
  const drafted30dForProof = normalizedCommunicationEvents30dForProof.filter((entry) => entry.normalizedAction === "drafted").length;
  const sentConfirmed30dForProof = normalizedCommunicationEvents30dForProof.filter((entry) => entry.normalizedAction === "sentConfirmed").length;
  const followThrough30dForProof = drafted30dForProof > 0
    ? Math.round((sentConfirmed30dForProof / drafted30dForProof) * 100)
    : null;
  const checkinsCompleted14dForProof = morning14dCount + eod14dCount;
  const integrationContext = resolveIntegrationContext();
  const shareCardLines = [
    "Stillform Composure Card",
    `${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
    "",
    `Sessions logged: ${sessions.length}`,
    `Active days: ${proofActiveDays}`,
    `Protocol launches: ${proofProtocolRuns}`,
    `Rated sessions: ${proofRatedSessions.length}`,
    `Avg composure gain: ${proofAvgShift === null ? "N/A" : `${proofAvgShift >= 0 ? "+" : ""}${proofAvgShift.toFixed(1)}`}`,
    `Current streak: ${streak} day${streak !== 1 ? "s" : ""}`,
    `Most used tool: ${topToolName}`,
    `Calendar context: ${integrationContext.calendar?.source || "none"}`,
    `Health context: ${integrationContext.health?.source || "none"}`
  ];
  const shareCardText = shareCardLines.join("\n");
  const setShareStatusWithClear = (msg) => {
    setShareCardStatus(msg);
    try { window.setTimeout(() => setShareCardStatus(""), 2600); } catch {}
  };
  const copyShareCard = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareCardText);
      } else {
        const ta = document.createElement("textarea");
        ta.value = shareCardText;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setShareStatusWithClear("Copied.");
      try { window.plausible("Composure Card Copied"); } catch {}
    } catch {
      setShareStatusWithClear("Copy failed.");
    }
  };
  const downloadShareCard = () => {
    try {
      const blob = new Blob([shareCardText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const stamp = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `stillform-composure-card-${stamp}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setShareStatusWithClear("Downloaded.");
      try { window.plausible("Composure Card Downloaded"); } catch {}
    } catch {
      setShareStatusWithClear("Download failed.");
    }
  };
  const exportShareCardPdf = () => {
    try {
      const w = window.open("", "_blank", "noopener,noreferrer");
      if (!w) {
        setShareStatusWithClear("Popup blocked. Allow popups to export PDF.");
        return;
      }
      const escaped = shareCardText
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Stillform Composure Card</title><style>body{font-family:Arial,sans-serif;background:#fff;color:#111;margin:32px;} pre{white-space:pre-wrap;line-height:1.6;font-size:13px;}</style></head><body><pre>${escaped}</pre></body></html>`);
      w.document.close();
      w.focus();
      w.print();
      setShareStatusWithClear("Print dialog opened. Save as PDF.");
      try { window.plausible("Composure Card PDF Export"); } catch {}
    } catch {
      setShareStatusWithClear("PDF export failed.");
    }
  };

  const cardStyle = { background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r-lg)", padding: "20px 16px", textAlign: "center", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.025)" };
  const rowStyle = { width: "100%", background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r-lg)", padding: "14px 18px", textAlign: "left", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.025)" };
  const subRowStyle = { background: "var(--surface2)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "10px 14px" };

  return (
    <section style={{ maxWidth: 480, margin: "0 auto", padding: "24px 24px 80px", position: "relative", zIndex: 1 }}>
      <button className="intervention-back" onClick={onBack}>← Back</button>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, marginBottom: 4 }}>My Progress</h1>
      <p style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 32 }}>One question: is the observer getting faster?</p>

      {sessions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)", fontSize: 13 }}>
          Your data builds here as you use the practice.
        </div>
      ) : (<>
        {/* PROOF AREAS — top focus */}
        <div style={{ marginBottom: 20, background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r-lg)", padding: "14px 14px 12px" }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 8 }}>
            Observer growth
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {/* HERO: Signal Awareness */}
            {(autonomousExits > 0 || durationTrend !== null) && (
              <div style={{ background: "var(--amber-glow)", border: "0.5px solid var(--amber-dim)", borderRadius: "var(--r)", padding: "12px 14px" }}>
                <div style={{ fontSize: 11, color: "var(--amber)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                  Signal Awareness
                </div>
                {autonomousExits > 0 && (
                  <div style={{ fontSize: 15, color: "var(--amber)", marginBottom: 4, fontWeight: 500 }}>
                    {autonomousExits === 1
                      ? "You caught it once without needing a tool."
                      : `${autonomousExits} times you saw it and chose without tools.`}
                  </div>
                )}
                {durationTrend !== null && durationTrend > 0.5 && (
                  <div style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6 }}>
                    Your sessions are getting {durationTrend.toFixed(1)}m shorter on average. You're catching it earlier.
                  </div>
                )}
                {durationTrend !== null && durationTrend <= 0.5 && autonomousExits === 0 && (
                  <div style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6 }}>
                    This measures how quickly you notice your state before it drives action. Keep going.
                  </div>
                )}
                {recentAutoExits > priorAutoExits && priorAutoExits >= 0 && (
                  <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 6 }}>
                    Autonomous exits this month: <span style={{ color: "var(--amber)" }}>{recentAutoExits}</span>
                    {priorAutoExits > 0 ? ` (up from ${priorAutoExits} last month)` : " — first month tracking."}
                  </div>
                )}
              </div>
            )}
            <div style={{ background: "var(--surface2)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "10px 12px" }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
                Recovery when needed
              </div>
              <div style={{ fontSize: 15, color: "var(--amber)", marginBottom: 4 }}>
                {recoverySpeedMinutesForProof === null ? "N/A" : `${recoverySpeedMinutesForProof.toFixed(1)}m avg from high activation`}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.5 }}>
                30-day acute shift rate: <span style={{ color: "var(--text)" }}>{acuteShiftRate30dForProof === null ? "N/A" : `${acuteShiftRate30dForProof}%`}</span>
                {avgDelta ? <> · Avg session delta: <span style={{ color: "var(--text)" }}>{Number(avgDelta) >= 0 ? "+" : ""}{avgDelta}</span></> : null}
              </div>
            </div>
            <div style={{ background: "var(--surface2)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "10px 12px" }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
                Check-in consistency
              </div>
              <div style={{ fontSize: 15, color: "var(--amber)", marginBottom: 4 }}>
                {loopCompletion14d}% loop consistency (14d)
              </div>
              <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.5 }}>
                Check-ins completed: <span style={{ color: "var(--text)" }}>{checkinsCompleted14dForProof}</span>
                {" "}({morning14dCount}/14 morning · {eod14dCount}/14 evening)
              </div>
            </div>
            <div style={{ background: "var(--surface2)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "10px 12px" }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
                Cleaner choices / follow-through
              </div>
              <div style={{ fontSize: 15, color: "var(--amber)", marginBottom: 4 }}>
                {followThrough30dForProof === null ? "N/A" : `${followThrough30dForProof}% follow-through from drafted actions`}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.5 }}>
                Opportunities: <span style={{ color: "var(--text)" }}>{opportunity30dForProof}</span>
                {" · "}Drafted: <span style={{ color: "var(--text)" }}>{drafted30dForProof}</span>
                {" · "}Sent confirmed: <span style={{ color: "var(--text)" }}>{sentConfirmed30dForProof}</span>
              </div>
            </div>
          </div>
        </div>

        {/* PULSE HEAT MAP — supporting telemetry below top proof cards */}
        <div style={{ marginBottom: 12 }}>
          <button onClick={() => toggle("telemetry")} style={rowStyle}>
            <div>
              <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>Composure telemetry</div>
              <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>
                12-week activity heat map
              </div>
            </div>
            <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{openSections.telemetry ? "▾" : "▸"}</span>
          </button>
          {openSections.telemetry && (() => {
            const allEvents = [];
            sessions.forEach(s => { if (s.timestamp) allEvents.push(new Date(s.timestamp)); });
            journalEntries.forEach(e => { if (e.id) allEvents.push(new Date(e.id)); });
            if (allEvents.length < 1) return null;

            const today = new Date();
            today.setHours(23, 59, 59, 999);
            const weeks = 12;
            const startDate = new Date(today);
            startDate.setDate(startDate.getDate() - (weeks * 7 - 1));
            startDate.setHours(0, 0, 0, 0);

            const dayMap = {};
            allEvents.forEach(d => {
              const key = d.toISOString().slice(0, 10);
              dayMap[key] = (dayMap[key] || 0) + 1;
            });

            const cells = [];
            const d = new Date(startDate);
            while (d.getDay() !== 1) d.setDate(d.getDate() - 1);
            const gridStart = new Date(d);

            for (let week = 0; week < weeks; week++) {
              for (let day = 0; day < 7; day++) {
                const cellDate = new Date(gridStart);
                cellDate.setDate(gridStart.getDate() + week * 7 + day);
                const key = cellDate.toISOString().slice(0, 10);
                const count = dayMap[key] || 0;
                const future = cellDate > today;
                cells.push({ week, day, count, future, date: cellDate });
              }
            }

            const maxCount = Math.max(1, ...cells.map(c => c.count));
            const dayLabels = ["M", "", "W", "", "F", "", ""];

            return (
              <div style={{ background: "var(--surface2)", border: "0.5px solid var(--border)", borderTop: "none", borderRadius: "0 0 var(--r-lg) var(--r-lg)", padding: "14px 16px 12px" }}>
                <div style={{ display: "flex", gap: 2 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2, marginRight: 4, justifyContent: "flex-start" }}>
                    {dayLabels.map((label, i) => (
                      <div key={i} style={{ width: 12, height: 14, fontSize: 9, color: "var(--text-muted)", fontFamily: "'IBM Plex Mono', monospace", display: "flex", alignItems: "center" }}>{label}</div>
                    ))}
                  </div>
                  {Array.from({ length: weeks }, (_, week) => (
                    <div key={week} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {Array.from({ length: 7 }, (_, day) => {
                        const cell = cells[week * 7 + day];
                        if (!cell) return null;
                        const intensity = cell.future ? 0 : cell.count / maxCount;
                        const bg = cell.future ? "transparent"
                          : cell.count === 0 ? "rgba(255,255,255,0.03)"
                          : `rgba(201, 147, 58, ${0.15 + intensity * 0.75})`;
                        const border = cell.future ? "0.5px solid transparent" : cell.count === 0 ? "0.5px solid var(--border)" : "0.5px solid rgba(201, 147, 58, 0.2)";
                        return (
                          <div key={day} title={`${cell.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}: ${cell.count} event${cell.count !== 1 ? "s" : ""}`} style={{
                            width: 14, height: 14, borderRadius: 2, background: bg, border, transition: "background 0.3s"
                          }} />
                        );
                      })}
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, justifyContent: "flex-end" }}>
                  <span style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "'IBM Plex Mono', monospace" }}>Less</span>
                  {[0, 0.25, 0.5, 0.75, 1].map((v, i) => (
                    <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: v === 0 ? "rgba(255,255,255,0.03)" : `rgba(201, 147, 58, ${0.15 + v * 0.75})`, border: "0.5px solid rgba(201, 147, 58, 0.15)" }} />
                  ))}
                  <span style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "'IBM Plex Mono', monospace" }}>More</span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* PROOF — outcome and protocol evidence */}
        {(() => {
          const ratingDeltaSessions = sessions.filter(s => s.preRating && s.postRating && Number.isFinite(s.postRating - s.preRating));
          const avgShift = ratingDeltaSessions.length
            ? (ratingDeltaSessions.reduce((sum, s) => sum + (s.postRating - s.preRating), 0) / ratingDeltaSessions.length)
            : null;
          const ratedTrendValues = ratingDeltaSessions.slice(-10).map((s) => s.postRating - s.preRating);
          const dropoffPenalty = Math.round((morningDropoff14dPct + eodDropoff14dPct) / 2);
          const recoveryBaseline = nudgeRecovery14dPct === null ? Math.max(0, 100 - dropoffPenalty) : nudgeRecovery14dPct;
          const reliabilityScore = Math.max(
            0,
            Math.min(100, Math.round((loopCompletion14d * 0.65) + (recoveryBaseline * 0.35)))
          );
          const recent30Rated = ratingDeltaSessions.filter((s) => withinDays(s.timestamp, 30));
          const positiveRecent30 = recent30Rated.filter((s) => (s.postRating - s.preRating) > 0).length;
          const acuteShiftRate30d = recent30Rated.length
            ? Math.round((positiveRecent30 / recent30Rated.length) * 100)
            : null;
          const recoveredFromHighActivation = recent30Rated.filter((s) => (
            Number(s.preRating) <= 2
            && Number(s.postRating) >= 3
            && Number.isFinite(s.duration)
            && Number(s.duration) > 0
          ));
          const recoverySpeedMinutes = recoveredFromHighActivation.length
            ? (recoveredFromHighActivation.reduce((sum, s) => sum + Number(s.duration || 0), 0) / recoveredFromHighActivation.length / 60)
            : null;
          const ratedDays14Map = recent30Rated
            .filter((s) => withinDays(s.timestamp, 14))
            .reduce((map, s) => {
              const day = String(s.timestamp || "").slice(0, 10);
              if (!day) return map;
              if (!map[day]) map[day] = [];
              map[day].push(s.postRating - s.preRating);
              return map;
            }, {});
          const ratedDays14 = Object.keys(ratedDays14Map).length;
          const transferPositiveDays14 = Object.values(ratedDays14Map).filter((deltas) => {
            if (!Array.isArray(deltas) || deltas.length === 0) return false;
            const avg = deltas.reduce((sum, value) => sum + value, 0) / deltas.length;
            return avg >= 0;
          }).length;
          const transferScore14d = ratedDays14 ? Math.round((transferPositiveDays14 / ratedDays14) * 100) : null;
          const communicationEvents = readArrayFromStorage(COMMUNICATION_EVENTS_KEY);
          const communicationEvents30d = communicationEvents.filter((entry) => withinDays(entry?.timestamp || entry?.date, 30));
          const communicationActionSet = {
            opportunity: new Set(["state-to-statement-opportunity", "opportunity", "presented"]),
            expanded: new Set(["state-to-statement-expanded", "expanded"]),
            drafted: new Set(["state-to-statement-drafted", "drafted"]),
            copied: new Set(["state-to-statement-copied", "copied"]),
            shared: new Set(["state-to-statement-shared", "shared"]),
            sentConfirmed: new Set(["state-to-statement-sent-confirmed", "sent-confirmed"]),
            completedWithDraft: new Set(["state-to-statement-completed-with-draft"]),
            completedWithoutDraft: new Set(["state-to-statement-completed-without-draft"]),
            skipped: new Set(["state-to-statement-skipped", "skipped"])
          };
          const withNormalizedAction = communicationEvents30d.map((entry) => {
            const raw = String(entry?.action || "");
            const match = Object.entries(communicationActionSet).find(([, values]) => values.has(raw));
            return { ...entry, normalizedAction: match?.[0] || raw };
          });
          const opportunityEvents30d = withNormalizedAction.filter((entry) => entry.normalizedAction === "opportunity");
          const expanded30d = withNormalizedAction.filter((entry) => entry.normalizedAction === "expanded").length;
          const draftedEntries30d = withNormalizedAction.filter((entry) => entry.normalizedAction === "drafted");
          const drafted30d = draftedEntries30d.length;
          const meaningfulDrafted30d = draftedEntries30d.filter((entry) => entry?.meaningfulDraft === "yes").length;
          const copied30d = withNormalizedAction.filter((entry) => entry.normalizedAction === "copied").length;
          const shared30d = withNormalizedAction.filter((entry) => entry.normalizedAction === "shared").length;
          const sentConfirmed30d = withNormalizedAction.filter((entry) => entry.normalizedAction === "sentConfirmed").length;
          const skippedEntries30d = withNormalizedAction.filter((entry) => entry.normalizedAction === "skipped");
          const skipped30d = skippedEntries30d.length;
          const completedWithoutDraft30d = withNormalizedAction.filter((entry) => entry.normalizedAction === "completedWithoutDraft").length;
          const opportunity30d = opportunityEvents30d.length;
          const uptakeRate30d = opportunity30d > 0 ? Math.round((expanded30d / opportunity30d) * 100) : null;
          const meaningfulDraftRate30d = drafted30d > 0 ? Math.round((meaningfulDrafted30d / drafted30d) * 100) : null;
          const followThrough30d = drafted30d > 0 ? Math.round((sentConfirmed30d / drafted30d) * 100) : null;
          const lastSentConfirmedEvent = [...withNormalizedAction].reverse().find((entry) => entry?.normalizedAction === "sentConfirmed");
          const skipReasonCounts = skippedEntries30d.reduce((acc, entry) => {
            const key = entry?.skipReason || "not-needed";
            acc[key] = (acc[key] || 0) + 1;
            return acc;
          }, {});
          const topSkipReason = Object.entries(skipReasonCounts).sort((a, b) => b[1] - a[1])[0] || null;
          const skipReasonLabelMap = {
            "not-needed": "Not needed for this event",
            "private-processing": "Keeping it internal for now",
            "send-later": "Will send later outside app"
          };
          const scienceEvidenceRead = (() => {
            if (acuteShiftRate30d === null || transferScore14d === null) return "building baseline";
            if (acuteShiftRate30d >= 70 && transferScore14d >= 70) return "strong carryover";
            if (acuteShiftRate30d >= 55 && transferScore14d >= 55) return "stable trend";
            return "tighten execution";
          })();
          const renderTrendSparkline = (values) => {
            if (!Array.isArray(values) || values.length < 2) {
              return (
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  Add at least 2 rated sessions to unlock trend line.
                </div>
              );
            }
            const width = 200;
            const height = 52;
            const minV = Math.min(...values, 0);
            const maxV = Math.max(...values, 0);
            const range = Math.max(1, maxV - minV);
            const points = values.map((v, i) => {
              const x = (i / Math.max(values.length - 1, 1)) * (width - 8) + 4;
              const y = ((maxV - v) / range) * (height - 12) + 6;
              return { x, y };
            });
            const pathD = points.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");
            const zeroY = ((maxV - 0) / range) * (height - 12) + 6;
            return (
              <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="56" role="img" aria-label="Composure trend line">
                <line x1="4" y1={zeroY} x2={width - 4} y2={zeroY} stroke="rgba(255,255,255,0.14)" strokeDasharray="2 3" strokeWidth="1" />
                <path d={pathD} fill="none" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round" />
                {points.map((p, idx) => (
                  <circle key={idx} cx={p.x} cy={p.y} r="1.7" fill={idx === points.length - 1 ? "var(--amber)" : "rgba(201,147,58,0.45)"} />
                ))}
              </svg>
            );
          };
          const protocolRuns = sessions.filter(s => s.entryMode && String(s.entryMode).startsWith("protocol-")).length;
          const activeDays = new Set(sessions.map(s => (s.timestamp || "").slice(0, 10)).filter(Boolean)).size;
          if (sessions.length < 2) return null;
          return (
            <div style={{ marginBottom: 12 }}>
              <button onClick={() => toggle("proof")} style={rowStyle}>
                <div>
                  <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>Proof snapshot</div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>
                    {activeDays} active day{activeDays !== 1 ? "s" : ""} · {protocolRuns} protocol run{protocolRuns !== 1 ? "s" : ""}
                  </div>
                </div>
                <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{openSections.proof ? "▾" : "▸"}</span>
              </button>
              {openSections.proof && (
                <div style={{ background: "var(--surface2)", border: "0.5px solid var(--border)", borderTop: "none", borderRadius: "0 0 var(--r-lg) var(--r-lg)", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.7 }}>
                    Sessions logged: <span style={{ color: "var(--text)" }}>{sessions.length}</span>
                    {" · "}Active days: <span style={{ color: "var(--text)" }}>{activeDays}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.7 }}>
                    Protocol launches: <span style={{ color: "var(--text)" }}>{protocolRuns}</span>
                    {" · "}Rated sessions: <span style={{ color: "var(--text)" }}>{ratingDeltaSessions.length}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.7 }}>
                    Loop completion (14d): <span style={{ color: "var(--text)" }}>{loopCompletion14d}%</span>
                    {" · "}Morning: <span style={{ color: "var(--text)" }}>{morningCompletion14d}%</span>
                    {" · "}EOD: <span style={{ color: "var(--text)" }}>{eodCompletion14d}%</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.7 }}>
                    Drop-off (14d): Morning <span style={{ color: "var(--text)" }}>{morningDropoff14dPct}%</span> ({morningDropoff14dCount}/{morningOpen14dDays.size || 0})
                    {" · "}EOD <span style={{ color: "var(--text)" }}>{eodDropoff14dPct}%</span> ({eodDropoff14dCount}/{eodOpen14dDays.size || 0})
                  </div>
                  <div style={{ background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                      Science Evidence
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 8 }}>
                      <div style={{ background: "var(--surface2)", border: "0.5px solid var(--border)", borderRadius: "var(--r-sm)", padding: "8px 9px" }}>
                        <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Acute shift rate (30d)</div>
                        <div style={{ fontSize: 14, color: "var(--amber)", marginTop: 3 }}>{acuteShiftRate30d === null ? "N/A" : `${acuteShiftRate30d}%`}</div>
                      </div>
                      <div style={{ background: "var(--surface2)", border: "0.5px solid var(--border)", borderRadius: "var(--r-sm)", padding: "8px 9px" }}>
                        <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Recovery speed</div>
                        <div style={{ fontSize: 14, color: "var(--amber)", marginTop: 3 }}>{recoverySpeedMinutes === null ? "N/A" : `${recoverySpeedMinutes.toFixed(1)}m`}</div>
                      </div>
                      <div style={{ background: "var(--surface2)", border: "0.5px solid var(--border)", borderRadius: "var(--r-sm)", padding: "8px 9px" }}>
                        <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Loop reliability (14d)</div>
                        <div style={{ fontSize: 14, color: "var(--amber)", marginTop: 3 }}>{reliabilityScore}%</div>
                      </div>
                      <div style={{ background: "var(--surface2)", border: "0.5px solid var(--border)", borderRadius: "var(--r-sm)", padding: "8px 9px" }}>
                        <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Transfer score (14d)</div>
                        <div style={{ fontSize: 14, color: "var(--amber)", marginTop: 3 }}>{transferScore14d === null ? "N/A" : `${transferScore14d}%`}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)", lineHeight: 1.5 }}>
                      Readout: <span style={{ color: "var(--text)" }}>{scienceEvidenceRead}</span>.
                      {" "}Built from existing sessions, deltas, and loop completion — no extra workflow required.
                    </div>
                  </div>
                  {focusCheckSummary && (
                    <div style={{ background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                        Composure Check
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
                        <div>
                          <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Accuracy</div>
                          <div style={{ fontSize: 13, color: "var(--amber)", marginTop: 2 }}>{focusCheckSummary.accuracy ?? "N/A"}%</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Inhibition</div>
                          <div style={{ fontSize: 13, color: "var(--amber)", marginTop: 2 }}>{focusCheckSummary.inhibition ?? "N/A"}%</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Avg RT</div>
                          <div style={{ fontSize: 13, color: "var(--amber)", marginTop: 2 }}>{focusCheckSummary.avgReactionMs ? `${focusCheckSummary.avgReactionMs}ms` : "N/A"}</div>
                        </div>
                      </div>
                      {previousFocusSummary && (
                        <div style={{ marginTop: 2, fontSize: 11, color: "var(--text-dim)" }}>
                          Delta: accuracy {focusAccuracyDelta >= 0 ? "+" : ""}{focusAccuracyDelta} pts · inhibition {focusInhibitionDelta >= 0 ? "+" : ""}{focusInhibitionDelta} pts · reaction {focusReactionDelta <= 0 ? "" : "+"}{focusReactionDelta}ms
                        </div>
                      )}
                    </div>
                  )}
                  <div style={{ background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                      Composure → Communication
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
                      <div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Opportunities (30d)</div>
                        <div style={{ fontSize: 13, color: "var(--amber)", marginTop: 2 }}>{opportunity30d}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Voluntary uptake</div>
                        <div style={{ fontSize: 13, color: "var(--amber)", marginTop: 2 }}>{uptakeRate30d === null ? "N/A" : `${uptakeRate30d}%`}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Drafted (30d)</div>
                        <div style={{ fontSize: 13, color: "var(--amber)", marginTop: 2 }}>{drafted30d}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Meaningful drafts</div>
                        <div style={{ fontSize: 13, color: "var(--amber)", marginTop: 2 }}>{meaningfulDraftRate30d === null ? "N/A" : `${meaningfulDraftRate30d}%`}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Sent confirmed</div>
                        <div style={{ fontSize: 13, color: "var(--amber)", marginTop: 2 }}>{sentConfirmed30d}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Follow-through</div>
                        <div style={{ fontSize: 13, color: "var(--amber)", marginTop: 2 }}>{followThrough30d === null ? "N/A" : `${followThrough30d}%`}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)" }}>
                      Copy/share actions (30d): <span style={{ color: "var(--text)" }}>{copied30d + shared30d}</span>
                      {" · "}Skipped: <span style={{ color: "var(--text)" }}>{skipped30d}</span>
                      {" · "}Completed without draft: <span style={{ color: "var(--text)" }}>{completedWithoutDraft30d}</span>
                    </div>
                    {topSkipReason && (
                      <div style={{ fontSize: 11, color: "var(--text-dim)" }}>
                        Most common skip reason: <span style={{ color: "var(--text)" }}>{skipReasonLabelMap[topSkipReason[0]] || topSkipReason[0]}</span>
                      </div>
                    )}
                    {lastSentConfirmedEvent && (
                      <div style={{ fontSize: 11, color: "var(--text-dim)" }}>
                        Last sent confirmation: <span style={{ color: "var(--text)" }}>{new Date(lastSentConfirmedEvent.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 132px", gap: 10 }}>
                    <div style={{ background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "10px 12px" }}>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>
                        Shift trend (last 10 rated)
                      </div>
                      {renderTrendSparkline(ratedTrendValues)}
                    </div>
                    <div style={{ background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "10px 10px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>
                        Loop reliability
                      </div>
                      <div style={{ width: 64, height: 64, borderRadius: "50%", border: "5px solid var(--amber-dim)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ position: "absolute", inset: -5, borderRadius: "50%", clipPath: `polygon(50% 50%, 50% 0%, ${50 + (reliabilityScore * 0.5)}% 0%, 100% 100%, 0% 100%)`, background: "var(--amber-20)", pointerEvents: "none" }} />
                        <div style={{ position: "relative", zIndex: 1, fontSize: 13, color: "var(--amber)", fontWeight: 600 }}>
                          {reliabilityScore}
                        </div>
                      </div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 8 }}>
                        14-day composite
                      </div>
                    </div>
                  </div>
                  {nudgeRecovery14dPct !== null && (
                    <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.7 }}>
                      Nudge recovery (14d): <span style={{ color: "var(--text)" }}>{nudgeRecovery14dPct}%</span> ({recoveredNudges14d}/{loopNudgeShown14d.length})
                      {" · "}Actioned: <span style={{ color: "var(--text)" }}>{loopNudgeActioned14d.length}</span>
                    </div>
                  )}
                  {nudgeRecovery14dPct === null && (
                    <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7 }}>
                      Nudge recovery (14d): waiting for intervention data.
                    </div>
                  )}
                  {avgShift !== null && (
                    <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.7 }}>
                      Average composure gain per rated session:{" "}
                      <span style={{ color: avgShift >= 0 ? "var(--amber)" : "#e05" }}>
                        {avgShift >= 0 ? "+" : ""}{avgShift.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {avgShift === null && (
                    <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7 }}>
                      Add pre and post ratings to see measured composure gains here.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {/* SHAREABLE COMPOSURE CARD — exportable result artifact */}
        <div style={{ marginBottom: 12 }}>
          <button onClick={() => toggle("sharecard")} style={rowStyle}>
            <div>
              <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>Shareable composure card</div>
              <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>
                Share progress snapshot or export as PDF
              </div>
            </div>
            <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{openSections.sharecard ? "▾" : "▸"}</span>
          </button>
          {openSections.sharecard && (
            <div style={{ background: "var(--surface2)", border: "0.5px solid var(--border)", borderTop: "none", borderRadius: "0 0 var(--r-lg) var(--r-lg)", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
              <pre style={{ margin: 0, whiteSpace: "pre-wrap", background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "12px 14px", color: "var(--text)", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, lineHeight: 1.6 }}>{shareCardText}</pre>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={copyShareCard} style={{ background: "var(--amber)", color: "#0A0A0C", border: "none", borderRadius: "var(--r)", padding: "8px 12px", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>Copy</button>
                <button onClick={downloadShareCard} style={{ background: "none", border: "0.5px solid var(--border)", color: "var(--text)", borderRadius: "var(--r)", padding: "8px 12px", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Download .txt</button>
                <button onClick={exportShareCardPdf} style={{ background: "none", border: "0.5px solid var(--amber-dim)", color: "var(--amber)", borderRadius: "var(--r)", padding: "8px 12px", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Export PDF</button>
              </div>
              {shareCardStatus && (
                <div style={{ fontSize: 11, color: "var(--text-dim)" }}>{shareCardStatus}</div>
              )}
            </div>
          )}
        </div>

        {/* ADDITIONAL STATS — moved below top proof areas */}
        <div style={{ marginBottom: 12 }}>
          <button onClick={() => toggle("supportingStats")} style={rowStyle}>
            <div>
              <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>Additional stats</div>
              <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>
                Supporting metrics and weekly readout
              </div>
            </div>
            <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{openSections.supportingStats ? "▾" : "▸"}</span>
          </button>
          {openSections.supportingStats && (
            <div style={{ background: "var(--surface2)", border: "0.5px solid var(--border)", borderTop: "none", borderRadius: "0 0 var(--r-lg) var(--r-lg)", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {avgDelta && Number(avgDelta) > 0 && <div style={cardStyle}>
                  <div style={{ fontSize: 36, color: "var(--amber)", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1 }}>+{avgDelta}</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 6 }}><span>Avg state shift</span> <button onClick={() => setInfoModal({ title: "Avg Shift", body: "The average difference between your pre-session and post-session feel state. A positive number means regulation is working. The trend over time matters more than any single session." })} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 11, padding: "0 2px", lineHeight: 1 }}>ⓘ</button></div>
                </div>}
                {streak > 0 && <div style={cardStyle}>
                  <div style={{ fontSize: 36, color: "var(--amber)", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1 }}>{streak}</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 6 }}>Day{streak !== 1 ? "s" : ""} streak</div>
                </div>}
                {topToolEntry && <div style={cardStyle}>
                  <div style={{ fontSize: 16, color: "var(--amber)", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2, marginTop: 4 }}>{toolNames[topToolEntry[0]] || topToolEntry[0]}</div>
                </div>}
                {(() => {
                  const durations = sessions.map(s => s.duration).filter(d => 0 < d);
                  if (durations.length < 2) return null;
                  const fastest = Math.min(...durations);
                  const fastSec = Math.round(fastest / 1000);
                  const fastStr = fastSec >= 60 ? `${Math.floor(fastSec / 60)}m ${fastSec % 60}s` : `${fastSec}s`;
                  return <div style={cardStyle}>
                    <div style={{ fontSize: 28, color: "var(--amber)", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1 }}>{fastStr}</div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 6 }}>Fastest session</div>
                  </div>;
                })()}
                {regulationType && <div style={cardStyle}>
                  <div style={{ fontSize: 16, color: "var(--amber)", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2, marginTop: 4 }}>
                    {regulationType === "thought-first" ? "Thought-first" : regulationType === "body-first" ? "Body-first" : "Balanced"}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 6 }}><span>Processing type</span> <button onClick={() => setInfoModal({ title: "Processing Type", body: "Your calibration tendency — body-first or thought-first. This is your default entry point, not a fixed identity. Your current state modulates routing each session through the bio-filter and feel state you log." })} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 11, padding: "0 2px", lineHeight: 1 }}>ⓘ</button></div>
                </div>}
                {groundingHistory.length >= 3 && (() => {
                  const skipped = groundingHistory.filter(g => g.skipped).length;
                  const rate = Math.round((skipped / groundingHistory.length) * 100);
                  const label = rate >= 50 ? `Skipped ${rate}%` : rate === 0 ? "Never skipped" : `${100 - rate}% complete`;
                  return <div style={cardStyle}>
                    <div style={{ fontSize: 16, color: "var(--amber)", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2, marginTop: 4 }}>{label}</div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 6 }}>Grounding rate</div>
                  </div>;
                })()}
                {checkinToday && <div style={cardStyle}>
                  <div style={{ fontSize: 16, color: "var(--amber)", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2, marginTop: 4, textTransform: "capitalize" }}>{checkinToday.energy || "—"}</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 6 }}>Today's energy</div>
                </div>}
                {eodToday && <div style={cardStyle}>
                  <div style={{ fontSize: 16, color: "var(--amber)", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2, marginTop: 4, textTransform: "capitalize" }}>{eodToday.composure || "—"}</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 6 }}>Yesterday's composure</div>
                </div>}
              </div>

              <div style={{ background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r-lg)", padding: "14px 14px 12px" }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 8 }}>
                  Processing Mastery
                </div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.55, marginBottom: 10 }}>
                  {normalizedRegulationType === "thought-first"
                    ? "Default pattern = cognitive first. Accuracy tracks how often your completed sessions align to that under pressure."
                    : normalizedRegulationType === "body-first"
                      ? "Default pattern = somatic first. Accuracy tracks how often your completed sessions align to that under pressure."
                      : "Balanced profile. Accuracy appears once your usage reveals a stable default pattern."}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
                  <div style={{ background: "var(--surface2)", border: "0.5px solid var(--border)", borderRadius: "var(--r-sm)", padding: "8px 9px" }}>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Default pattern accuracy</div>
                    <div style={{ fontSize: 15, color: "var(--amber)", marginTop: 3 }}>{defaultPatternAccuracy30d === null ? "N/A" : `${defaultPatternAccuracy30d}%`}</div>
                  </div>
                  <div style={{ background: "var(--surface2)", border: "0.5px solid var(--border)", borderRadius: "var(--r-sm)", padding: "8px 9px" }}>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Switch agility</div>
                    <div style={{ fontSize: 15, color: "var(--amber)", marginTop: 3 }}>{switchAgility30d === null ? "N/A" : `${switchAgility30d}%`}</div>
                  </div>
                  <div style={{ background: "var(--surface2)", border: "0.5px solid var(--border)", borderRadius: "var(--r-sm)", padding: "8px 9px" }}>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}><span>Debrief capture (30d)</span> <button onClick={() => setInfoModal({ title: "Lock-in Rate", body: "How consistently you complete the post-session lock-in. Reflection-on-action — naming the processing move that produced your decision — consolidates the regulated insight and makes it repeatable. Schön (1983)." })} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 11, padding: "0 2px", lineHeight: 1 }}>ⓘ</button></div>
                    <div style={{ fontSize: 15, color: "var(--amber)", marginTop: 3 }}>{debriefCoverage30d === null ? "N/A" : `${debriefCoverage30d}%`}</div>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>
                  Built from completed tool sessions and lock-in captures.
                </div>
              </div>

              <div style={{ background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r-lg)", padding: "14px 14px 12px" }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 8 }}>
                  Weekly reflection
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {weeklyReflectionSummary.map((line, idx) => (
                    <div key={`weekly-reflection-${idx}`} style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.55 }}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MY PATTERNS — diagnostic intelligence, not history */}
        {hasPatterns && (() => {
          // ── DATA COMPUTATION ─────────────────────────────────────────
          const now = new Date();
          const oneWeekAgo = new Date(now - 7 * 86400000);
          const twoWeeksAgo = new Date(now - 14 * 86400000);

          // Sessions this week vs last week
          const sessionsThisWeek = sessions.filter(s => new Date(s.timestamp) >= oneWeekAgo);
          const sessionsLastWeek = sessions.filter(s => {
            const d = new Date(s.timestamp);
            return d >= twoWeeksAgo && d < oneWeekAgo;
          });

          // Avg shift this week vs last week
          const avgShiftForGroup = (group) => {
            const rated = group.filter(s => s.preRating && s.postRating);
            if (rated.length === 0) return null;
            return rated.reduce((sum, s) => sum + (s.postRating - s.preRating), 0) / rated.length;
          };
          const shiftThisWeek = avgShiftForGroup(sessionsThisWeek);
          const shiftLastWeek = avgShiftForGroup(sessionsLastWeek);
          const shiftTrend = shiftThisWeek !== null && shiftLastWeek !== null
            ? shiftThisWeek - shiftLastWeek : null;

          // Tool usage and effectiveness
          const toolStats = {};
          sessions.forEach(s => {
            (s.tools || []).forEach(t => {
              if (!toolStats[t]) toolStats[t] = { count: 0, shifts: [] };
              toolStats[t].count++;
              if (s.preRating && s.postRating) toolStats[t].shifts.push(s.postRating - s.preRating);
            });
          });
          const toolList = Object.entries(toolStats)
            .filter(([, v]) => v.count >= 2)
            .map(([id, v]) => ({
              id,
              count: v.count,
              pct: Math.round((v.count / Math.max(sessions.length, 1)) * 100),
              avgShift: v.shifts.length ? (v.shifts.reduce((a, b) => a + b, 0) / v.shifts.length) : null
            }))
            .sort((a, b) => (b.avgShift || 0) - (a.avgShift || 0));
          const underusedHighPerformer = toolList.find(t => t.avgShift > 1.5 && t.pct < 30 && t.count >= 2);

          // Day-of-week pattern
          const dayCounts = {};
          const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
          sessions.forEach(s => {
            const day = dayNames[new Date(s.timestamp).getDay()];
            dayCounts[day] = (dayCounts[day] || 0) + 1;
          });
          const topDay = Object.entries(dayCounts).sort((a,b) => b[1]-a[1])[0];
          const topDaySignificant = topDay && topDay[1] >= 3 && topDay[1] / sessions.length >= 0.3;

          // Pulse signal patterns
          const pulseThisWeek = journalEntries.filter(e => new Date(e.date || e.timestamp) >= oneWeekAgo);
          const signalCounts = {};
          pulseThisWeek.forEach(e => {
            (e.emotions || []).forEach(em => {
              signalCounts[em] = (signalCounts[em] || 0) + 1;
            });
          });
          const topSignalThisWeek = Object.entries(signalCounts).sort((a,b) => b[1]-a[1])[0];

          // Body area frequency from journal
          const areaCounts = {};
          journalEntries.forEach(e => {
            if (e.area) areaCounts[e.area] = (areaCounts[e.area] || 0) + 1;
          });
          const topArea = Object.entries(areaCounts).sort((a,b) => b[1]-a[1])[0];

          // Blind spot pattern from AI session notes
          const biasHits = {};
          aiInternalSessionNotes.forEach(n => {
            if (!n.note) return;
            const note = n.note.toLowerCase();
            (biasProfile || []).forEach(bias => {
              if (note.includes(bias.toLowerCase().split(" ")[0])) {
                biasHits[bias] = (biasHits[bias] || 0) + 1;
              }
            });
          });
          const topBias = Object.entries(biasHits).sort((a,b) => b[1]-a[1])[0];

          // Recommendation — one thing based on data, factual only
          let recommendation = null;
          if (underusedHighPerformer) {
            const toolLabels = { scan: "Body Scan", breathe: "Breathe", reframe: "Reframe", metacognition: "Observe and Choose" };
            recommendation = `${toolLabels[underusedHighPerformer.id] || underusedHighPerformer.id} shows your strongest avg shift (+${underusedHighPerformer.avgShift.toFixed(1)}) but accounts for ${underusedHighPerformer.pct}% of sessions.`;
          } else if (shiftTrend !== null && shiftTrend > 0.3) {
            recommendation = `Avg composure shift increased by +${shiftTrend.toFixed(1)} compared to last week.`;
          } else if (topDay && topDaySignificant) {
            recommendation = `${topDay[1]} of your sessions have been on ${topDay[0]}s. That may reflect a recurring pattern worth noting.`;
          }

          // Summary line for accordion header
          const summaryParts = [];
          if (sessionsThisWeek.length > 0) summaryParts.push(`${sessionsThisWeek.length} session${sessionsThisWeek.length !== 1 ? "s" : ""} this week`);
          if (shiftTrend !== null) summaryParts.push(shiftTrend > 0 ? `shift improving` : `shift holding`);
          if (topSignalThisWeek) summaryParts.push(`${topSignalThisWeek[0]} most active`);
          const summaryLine = summaryParts.join(" · ") || "System notes from your data";

          const insightStyle = { fontSize: 13, color: "var(--text)", lineHeight: 1.7 };
          const dimStyle = { fontSize: 11, color: "var(--text-muted)", marginTop: 4 };
          const sectionLabel = { fontSize: 10, color: "var(--amber)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6, fontFamily: "'IBM Plex Mono', monospace" };

          return (
            <div style={{ marginBottom: 8 }}>
              <button onClick={() => toggle("patterns")} style={rowStyle}>
                <div>
                  <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>My Patterns</div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>{summaryLine}</div>
                </div>
                <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{openSections.patterns ? "▾" : "▸"}</span>
              </button>
              {openSections.patterns && (
                <div style={{ background: "var(--surface2)", border: "0.5px solid var(--border)", borderTop: "none", borderRadius: "0 0 var(--r-lg) var(--r-lg)", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 16 }}>

                  {/* This week */}
                  {sessionsThisWeek.length > 0 && (
                    <div>
                      <div style={sectionLabel}>This Week</div>
                      <div style={insightStyle}>
                        {sessionsThisWeek.length} session{sessionsThisWeek.length !== 1 ? "s" : ""} logged.
                        {shiftThisWeek !== null && ` Avg composure shift: ${shiftThisWeek > 0 ? "+" : ""}${shiftThisWeek.toFixed(1)}.`}
                        {shiftTrend !== null && Math.abs(shiftTrend) >= 0.3 && (
                          shiftTrend > 0
                            ? ` Up ${shiftTrend.toFixed(1)} from last week.`
                            : ` Down ${Math.abs(shiftTrend).toFixed(1)} from last week.`
                        )}
                      </div>
                      {topSignalThisWeek && topSignalThisWeek[1] >= 2 && (
                        <div style={dimStyle}>Most logged signal this week: {topSignalThisWeek[0]} ({topSignalThisWeek[1]}x)</div>
                      )}
                    </div>
                  )}

                  {/* Tool effectiveness */}
                  {toolList.length >= 2 && (
                    <div>
                      <div style={sectionLabel}>Tool Effectiveness</div>
                      {toolList.slice(0, 3).map(t => {
                        const labels = { scan: "Body Scan", breathe: "Breathe", reframe: "Reframe", metacognition: "Observe and Choose", signals: "Map Signals", bias: "Pattern Check" };
                        const shift = t.avgShift ?? 0;
                        const shiftPct = Math.max(0, Math.min(100, ((shift + 1.5) / 3.5) * 100));
                        return (
                          <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: "0.5px solid var(--border)" }}>
                            <div style={{ minWidth: 120 }}>
                              <div style={{ fontSize: 13, color: "var(--text)" }}>{labels[t.id] || t.id}</div>
                              <div style={{ width: 120, height: 5, borderRadius: 999, background: "rgba(255,255,255,0.08)", marginTop: 5, overflow: "hidden" }}>
                                <div style={{ width: `${shiftPct}%`, height: "100%", background: "linear-gradient(90deg, var(--amber-dim), var(--amber))" }} />
                              </div>
                            </div>
                            <div style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "right" }}>
                              {t.avgShift !== null ? `avg ${t.avgShift >= 0 ? "+" : ""}${t.avgShift.toFixed(1)}` : "—"}
                              <span style={{ marginLeft: 8, color: "var(--text-dim)" }}>{t.pct}% of sessions</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Primary activation zone */}
                  {topArea && topArea[1] >= 3 && (
                    <div>
                      <div style={sectionLabel}>Primary Activation Zone</div>
                      <div style={insightStyle}>
                        {topArea[0]} logged in {topArea[1]} of {journalEntries.length} pulse entries ({Math.round((topArea[1] / journalEntries.length) * 100)}%).
                      </div>
                    </div>
                  )}

                  {/* Day of week pattern */}
                  {topDaySignificant && (
                    <div>
                      <div style={sectionLabel}>Temporal Pattern</div>
                      <div style={insightStyle}>
                        {topDay[1]} of {sessions.length} sessions on {topDay[0]}s.
                      </div>
                      <div style={dimStyle}>Observation only — patterns can reflect schedule, not just state.</div>
                    </div>
                  )}

                  {/* Blind spot activity */}
                  {topBias && topBias[1] >= 2 && (
                    <div>
                      <div style={sectionLabel}>Blind Spot Activity</div>
                      <div style={insightStyle}>
                        {topBias[0]} appeared in {topBias[1]} recent session{topBias[1] !== 1 ? "s" : ""}.
                      </div>
                      <div style={dimStyle}>Based on AI session notes. Not a diagnosis — a data point.</div>
                    </div>
                  )}

                  {/* One recommendation */}
                  {recommendation && (
                    <div style={{ background: "var(--surface)", border: "0.5px solid var(--amber-dim)", borderRadius: "var(--r)", padding: "12px 14px" }}>
                      <div style={sectionLabel}>System Note</div>
                      <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.7 }}>{recommendation}</div>
                    </div>
                  )}

                  {/* No data state */}
                  {sessionsThisWeek.length === 0 && toolList.length < 2 && !topArea && !topBias && (
                    <div style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: "8px 0" }}>
                      More data needed. Patterns surface after a few sessions.
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })()}

        {/* AI SESSION NOTES */}
        {aiUserFacingInsights.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <button onClick={() => toggle("ainotes")} style={rowStyle}>
              <div><div style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>What the AI has noticed</div><div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>{aiUserFacingInsights.length} insight{aiUserFacingInsights.length !== 1 ? "s" : ""}</div></div>
              <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{openSections.ainotes ? "▾" : "▸"}</span>
            </button>
            {openSections.ainotes && (
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
                {[...aiUserFacingInsights].reverse().slice(0, 3).map((n, i) => (
                  <div key={i} style={subRowStyle}>
                    <div style={{ fontSize: 11, color: "var(--amber)", marginBottom: 4 }}>{new Date(n.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                    <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6, fontStyle: "italic" }}>{n.note}</div>
                  </div>
                ))}
                <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.6, marginTop: 4 }}>
                  Insight guardrails are active: no labels, no diagnoses, no judgment.
                </div>
              </div>
            )}
          </div>
        )}

        {/* REFRAMES */}
        {savedReframes.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <button onClick={() => toggle("reframes")} style={rowStyle}>
              <div><div style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>Reframes that landed</div><div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>{savedReframes.length} saved</div></div>
              <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{openSections.reframes ? "▾" : "▸"}</span>
            </button>
            {openSections.reframes && (
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
                {[...savedReframes].reverse().map((r, i) => (
                  <div key={i} style={subRowStyle}>
                    <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6, fontStyle: "italic" }}>"{r.text}"</div>
                    {r.timestamp && <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{new Date(r.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PULSE — full inline, not accordion */}
        <div style={{ marginTop: 24, paddingTop: 24, borderTop: "0.5px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--amber)" }}><span>Pulse</span> <button onClick={() => setInfoModal({ title: "Signal Log", body: "Emotion tracking through specific labeling. The ability to distinguish between granular emotional states — not broad categories — is consistently associated with better regulation outcomes and more adaptive coping. Barrett et al. (2001)." })} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 11, padding: "0 2px", lineHeight: 1 }}>ⓘ</button></div>
              {journalEntries.length > 0 && <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>{journalEntries.length} entries{topEmotionEntry ? ` · most logged: ${topEmotionEntry[0]}` : ""}</div>}
            </div>
          </div>
          <div style={{ background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "10px 12px", marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.6 }}>
              Pulse is fed by completed tools and check-ins. It lives here as part of My Progress.
            </div>
          </div>

          {/* VIEW SINGLE ENTRY */}
          {viewEntry && (() => {
            const e = viewEntry;
            const labelStyle = { fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "var(--text-muted)", marginBottom: 6, letterSpacing: "0.16em", textTransform: "uppercase" };
            const valueStyle = { fontSize: 13, color: "var(--text)", lineHeight: 1.6 };
            return (
              <div style={{ background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "18px" }}>
                <button onClick={() => setViewEntry(null)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: 16, padding: 0 }}>← Back</button>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, marginBottom: 16, lineHeight: 1.3 }}>{e.triggerType || e.trigger || "Signal event"}</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "var(--text-muted)", marginBottom: 16 }}>{e.date} · {e.time}</div>
                {e.signal?.length > 0 && <div style={{ marginBottom: 12 }}><div style={labelStyle}>Signal</div><div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>{e.signal.map(s => <span key={s} style={{ padding: "3px 8px", borderRadius: "var(--r-sm)", background: "var(--amber-glow)", border: "0.5px solid var(--amber-dim)", color: "var(--amber)", fontFamily: "'IBM Plex Mono', monospace", fontSize: 9 }}>{s}</span>)}</div></div>}
                {(e.triggerType || e.trigger) && <div style={{ marginBottom: 12 }}><div style={labelStyle}>Trigger</div><div style={valueStyle}>{[e.triggerType, e.trigger].filter(Boolean).join(" — ")}</div></div>}
                {e.outcome && <div style={{ marginBottom: 12 }}><div style={labelStyle}>Outcome</div><div style={{ ...valueStyle, color: "var(--amber)" }}>{e.outcome}</div></div>}
                {e.notes && <div style={{ marginBottom: 12 }}><div style={labelStyle}>Notes</div><div style={valueStyle}>{e.notes}</div></div>}
              </div>
            );
          })()}

          {/* ENTRY LIST */}
          {!viewEntry && (
            journalEntries.length === 0 ? (
              <div style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic", padding: "16px 0" }}>No pulse data yet. Complete check-ins and tools to start your progress signal.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {[...journalEntries].reverse().map((e, i) => (
                  <button key={e.id || i} onClick={() => setViewEntry(e)} style={{ ...subRowStyle, textAlign: "left", cursor: "pointer", width: "100%", background: "var(--surface)", border: "0.5px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: e.source === "reframe-auto" ? 0 : 4 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text)" }}>{e.triggerType || e.trigger?.slice(0,40) || (e.emotions?.length ? e.emotions.join(", ") : "State logged")}</div>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "var(--text-muted)", flexShrink: 0, marginLeft: 8 }}>{e.date}</div>
                    </div>
                    {e.source !== "reframe-auto" && e.outcome && <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.06em" }}>→ {e.outcome}</div>}
                  </button>
                ))}
              </div>
            )
          )}
        </div>
      </>)}
    </section>
  );
}

// ─── DRAGGABLE QUICK BREATHE PILL ───────────────────────────────────────────
// Users can drag to reposition. Position saved in localStorage.
function QBPill({ onPress }) {
  const storageKey = "stillform_qb_position";

  const getSavedPos = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (saved && typeof saved.x === "number" && typeof saved.y === "number") return saved;
    } catch {}
    // Safe default — bottom right, evaluated lazily
    return {
      x: (typeof window !== "undefined" ? window.innerWidth : 400) - 160,
      y: 80
    };
  };

  const [pos, setPos] = useState(getSavedPos);
  const [dragging, setDragging] = useState(false);
  const startRef = useRef(null);
  const posRef = useRef(pos);
  const pointerIdRef = useRef(null);
  const draggedRef = useRef(false);
  posRef.current = pos;

  const clamp = (p) => ({
    x: Math.max(8, Math.min(window.innerWidth - 152, p.x)),
    y: Math.max(60, Math.min(window.innerHeight - 120, p.y))
  });

  const onPointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    pointerIdRef.current = e.pointerId;
    draggedRef.current = false;
    setDragging(false);
    startRef.current = {
      px: e.clientX - posRef.current.x,
      py: e.clientY - posRef.current.y,
      sx: e.clientX,
      sy: e.clientY
    };
    try { e.currentTarget.setPointerCapture?.(e.pointerId); } catch {}
  };

  const onPointerMove = (e) => {
    if (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) return;
    if (!startRef.current) return;
    const moveDistance = Math.hypot(e.clientX - startRef.current.sx, e.clientY - startRef.current.sy);
    if (moveDistance < 6 && !dragging) return;
    if (!dragging) setDragging(true);
    draggedRef.current = true;
    const next = clamp({ x: e.clientX - startRef.current.px, y: e.clientY - startRef.current.py });
    setPos(next);
  };

  const onPointerUp = (e) => {
    if (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) return;
    try { e.currentTarget.releasePointerCapture?.(e.pointerId); } catch {}
    pointerIdRef.current = null;
    startRef.current = null;
    if (draggedRef.current || dragging) {
      try { localStorage.setItem(storageKey, JSON.stringify(posRef.current)); } catch {}
    } else {
      onPress();
    }
    setDragging(false);
  };

  const onPointerCancel = (e) => {
    if (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) return;
    pointerIdRef.current = null;
    startRef.current = null;
    draggedRef.current = false;
    setDragging(false);
  };

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      style={{
        position: "fixed", left: pos.x, top: pos.y, zIndex: 200,
        background: "var(--bg)", border: "1px solid var(--amber-dim)",
        borderRadius: 28, padding: "10px 18px", fontSize: 12, letterSpacing: "0.06em",
        color: "var(--amber)", cursor: dragging ? "grabbing" : "grab",
        fontFamily: "'DM Sans', sans-serif",
        boxShadow: dragging ? "0 8px 24px rgba(0,0,0,0.5)" : "0 2px 12px rgba(0,0,0,0.3)",
        transition: dragging ? "none" : "box-shadow 0.2s",
        userSelect: "none", WebkitUserSelect: "none",
        transform: dragging ? "scale(1.05)" : "scale(1)",
        touchAction: "none"
      }}
    >
      ◎ Quick Breathe
    </div>
  );
}

export default function Stillform() {
  const FIRST_RUN_STAGE_KEY = "stillform_first_run_stage";
  const [infoModal, setInfoModal] = useState(null);
  const readFirstRunStage = () => {
    try {
      const raw = localStorage.getItem(FIRST_RUN_STAGE_KEY);
      return raw === "bridge" || raw === "calibration" ? raw : "tutorial";
    } catch {
      return "tutorial";
    }
  };
  const setFirstRunStage = (stage) => {
    try {
      if (stage === "bridge" || stage === "calibration") {
        localStorage.setItem(FIRST_RUN_STAGE_KEY, stage);
      } else {
        localStorage.removeItem(FIRST_RUN_STAGE_KEY);
      }
    } catch {}
  };
  const isFirstRunComplete = () => {
    try { return localStorage.getItem("stillform_onboarded") === "yes"; } catch { return false; }
  };
  const [splashDone, setSplashDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSplashDone(true), 2500);
    setupPushNotifications();
    // Apply high contrast on startup if previously enabled
    try {
      if (localStorage.getItem("stillform_high_contrast") === "on") {
        const savedTheme = localStorage.getItem("stillform_theme") || "dark";
        applyThemePreset(savedTheme, true);
      }
    } catch {}
    // Cloud sync init — version check + restore data if signed in
    sbVersionCheck().catch(() => {});
    if (sbIsSignedIn()) {
      sbRefreshSession().then(() => sbSyncDown().then(() => {
        // After sync, re-check onboarded state and rehydrate preferences
        try {
          const onboarded = localStorage.getItem("stillform_onboarded") === "yes";
          const regType = localStorage.getItem("stillform_regulation_type");
          if (onboarded && regType) {
            setScreenRaw("home");
            try { window.location.hash = "#home"; } catch {}
          }
        } catch {}
      }).catch(() => {})).catch(() => {});
    }
    return () => clearTimeout(t);
  }, []);

  // `stillform_onboarded` marks completion of first-run flow (tutorial -> setup bridge -> calibration).
  // While incomplete, FIRST_RUN_STAGE_KEY keeps cold-start recovery within that sequence.
  // Subscription & trial tracking
  const [isSubscribed, setIsSubscribed] = useState(() => { 
    try { 
      // Check URL params synchronously on mount — catches return from Lemon Squeezy
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("subscribed") === "true" || urlParams.get("checkout") === "success") {
        localStorage.setItem("stillform_subscribed", "yes");
        return true;
      }
      return localStorage.getItem("stillform_subscribed") === "yes"; 
    } catch { return false; } 
  });
  const [syncSignedIn, setSyncSignedIn] = useState(() => sbIsSignedIn());
  const [subscriptionCheckTick, setSubscriptionCheckTick] = useState(0);
  const trialDaysLeft = (() => {
    try {
      const start = localStorage.getItem("stillform_trial_start");
      if (!start) return 14;
      const elapsed = (Date.now() - new Date(start).getTime()) / (1000 * 60 * 60 * 24);
      return Math.max(0, Math.ceil(14 - elapsed));
    } catch { return 14; }
  })();
  const uatTrialFreezeUntilMs = (() => {
    const dt = new Date(UAT_TRIAL_FREEZE_UNTIL_ISO);
    return Number.isNaN(dt.getTime()) ? 0 : dt.getTime();
  })();
  const uatModeEnabled = (() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const query = (params.get(UAT_MODE_QUERY_PARAM) || "").trim().toLowerCase();
      if (query === "1" || query === "true" || query === "on") {
        localStorage.setItem(UAT_MODE_STORAGE_KEY, "yes");
        return true;
      }
      if (query === "0" || query === "false" || query === "off") {
        localStorage.removeItem(UAT_MODE_STORAGE_KEY);
        return false;
      }
      return localStorage.getItem(UAT_MODE_STORAGE_KEY) === "yes";
    } catch {
      return false;
    }
  })();
  const uatTrialFreezeActive = uatModeEnabled && !isSubscribed && Date.now() < uatTrialFreezeUntilMs;
  const uatLaunchTargetLabel = uatTrialFreezeUntilMs > 0
    ? new Date(uatTrialFreezeUntilMs).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "launch";
  const trialExpired = trialDaysLeft <= 0 && !isSubscribed && !uatTrialFreezeActive;

  // Check for subscription confirmation from Lemon Squeezy redirect
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("subscribed") === "true" || params.get("checkout") === "success") {
        localStorage.setItem("stillform_subscribed", "yes");
        markSubscribePending();
        setIsSubscribed(true);
        setSubscriptionCheckTick(n => n + 1);
        window.history.replaceState({}, "", "/");
      }
    } catch {}
  }, []);

  useEffect(() => {
    let cancelled = false;
    const syncSubscriptionTruth = async () => {
      try {
        const status = await sbCheckSubscriptionStatus();
        if (cancelled || !status) return;
        if (screen === "settings") setSubscriptionLastCheckedAt(Date.now());
        if (status?.is_subscribed === true) {
          try {
            localStorage.setItem("stillform_subscribed", "yes");
            clearSubscribePending();
          } catch {}
          setIsSubscribed(true);
          return;
        }
        // If checkout just completed, allow webhook delivery lag before downgrading local state.
        if (hasFreshSubscribePending(SUBSCRIPTION_PENDING_GRACE_MS)) return;
        try {
          localStorage.removeItem("stillform_subscribed");
          clearSubscribePending();
        } catch {}
        setIsSubscribed(false);
      } catch {
        // Keep current state when status API is unavailable.
      }
    };
    syncSubscriptionTruth();
    return () => { cancelled = true; };
  }, [syncSignedIn, subscriptionCheckTick]);

  const [screen, setScreenRaw] = useState(null);
  const [setupBridgeStep, setSetupBridgeStep] = useState(0); // 0=personalization, 1=signal mapping — must be before screenToHash

  // Hash routing — keeps browser back button working
  const HASH_SCREENS = new Set(["home","settings","pricing","progress","faq","privacy","crisis","focus-check","tutorial","setup","setup-bridge"]);
  const screenToHash = (s) => {
    if (!s) return "#home";
    // Transient screens (tool, panic) keep whatever hash is current — no navigation entry
    if (s === "tool" || s === "panic") return window.location.hash || "#home";
    if (!HASH_SCREENS.has(s)) return "#home";
    if (s === "setup-bridge") return `#setup-bridge-${setupBridgeStep}`;
    return `#${s}`;
  };
  const hashToScreen = (h) => {
    const raw = (h || "").replace("#", "");
    // Handle setup-bridge sub-steps
    if (raw === "setup-bridge-0") { setSetupBridgeStep(0); return "setup-bridge"; }
    if (raw === "setup-bridge-1") { setSetupBridgeStep(1); return "setup-bridge"; }
    return HASH_SCREENS.has(raw) ? raw : "home";
  };
  const setScreen = (s) => {
    setScreenRaw(s);
    try {
      const hash = screenToHash(s);
      if (window.location.hash !== hash) window.location.hash = hash;
    } catch {}
  };

  // Keep hash in sync when setup bridge step changes
  useEffect(() => {
    if (screen === "setup-bridge") {
      try {
        const hash = `#setup-bridge-${setupBridgeStep}`;
        if (window.location.hash !== hash) window.location.hash = hash;
      } catch {}
    }
  }, [setupBridgeStep, screen]);
  const [faqBackScreen, setFaqBackScreen] = useState("home");
  const [preferredCrisisRegion, setPreferredCrisisRegion] = useState(null);
  const [showOtherCrisisResources, setShowOtherCrisisResources] = useState(false);
  const [showHomeContextTip, setShowHomeContextTip] = useState(() => {
    try { return localStorage.getItem("stillform_tooltip_home_seen") !== "yes"; } catch { return true; }
  });
  const [milestone7Seen, setMilestone7Seen] = useState(() => {
    try { return localStorage.getItem("stillform_milestone_7_seen") === "yes"; } catch { return false; }
  });
  const [tutorialStep, setTutorialStep] = useState(0);
  const [tutorialReturnScreen, setTutorialReturnScreen] = useState("home");
  const [setupBridgeOrigin, setSetupBridgeOrigin] = useState("home");
  const [focusCheckReturnScreen, setFocusCheckReturnScreen] = useState("home");
  const [tutorialFocusBrief, setTutorialFocusBrief] = useState(null);
  const [screenReady, setScreenReady] = useState(false);
  const [biometricCleared, setBiometricCleared] = useState(false); // true once authenticated this session
  const [homeProgressPinned, setHomeProgressPinned] = useState(() => {
    try {
      const modern = localStorage.getItem("stillform_home_progress_pinned_v2");
      if (modern === "yes" || modern === "no") return modern === "yes";
      return localStorage.getItem("stillform_home_progress_pinned") === "yes";
    } catch {
      return false;
    }
  });
  const [homeProgressExpanded, setHomeProgressExpanded] = useState(() => {
    try {
      const pinned = localStorage.getItem("stillform_home_progress_pinned_v2") === "yes"
        || localStorage.getItem("stillform_home_progress_pinned") === "yes";
      if (pinned) return true;
      return localStorage.getItem("stillform_home_progress_expanded") === "yes";
    } catch {
      return false;
    }
  });
  const [setupStep, setSetupStep] = useState(0);
  const setupAutoLaunchStepRef = useRef(null);
  // Tool sub-state back override — any tool with internal sub-states writes a handler here.
  // handleActiveToolBack checks this first so back always goes to the right place.
  const toolBackOverrideRef = useRef(null);
  const [assessmentAnswers, setAssessmentAnswers] = useState([]);
  const [ciOpen, setCiOpen] = useState(false);
  const [ciEnergy, setCiEnergy] = useState(null);
  const [ciBio, setCiBio] = useState(new Set());
  const [ciTension, setCiTension] = useState({});
  const [ciOffBaselineOpen, setCiOffBaselineOpen] = useState(false); // "something's off" branch
  const [ciSaved, setCiSaved] = useState(false);
  const [eodOpen, setEodOpen] = useState(false);
  const [eodEnergy, setEodEnergy] = useState(null);
  const [eodComposure, setEodComposure] = useState(null);
  const [eodWord, setEodWord] = useState(null);
  const [eodSaved, setEodSaved] = useState(false);
  const [eodPromptDismissed, setEodPromptDismissed] = useState(false);
  const [loopNudgeDismissedDay, setLoopNudgeDismissedDay] = useState(() => {
    try { return localStorage.getItem(LOOP_NUDGE_DISMISSED_DAY_KEY) || ""; } catch { return ""; }
  });
  const [loopNudgeDismissStreak, setLoopNudgeDismissStreak] = useState(() => {
    try {
      const raw = Number.parseInt(localStorage.getItem(LOOP_NUDGE_DISMISS_STREAK_KEY) || "0", 10);
      return Number.isFinite(raw) ? Math.max(0, raw) : 0;
    } catch {
      return 0;
    }
  });
  const [regType, setRegType] = useState(() => { try { return localStorage.getItem("stillform_regulation_type") || null; } catch { return null; } });
  const [showObserveEntry, setShowObserveEntry] = useState(false);
  const [showSupportSheet, setShowSupportSheet] = useState(false);
  const [pendingNextMoveFollowUpSession, setPendingNextMoveFollowUpSession] = useState(() => getPendingNextMoveFollowUpSession());

  useEffect(() => {
    if (screen !== "home") return;
    setPendingNextMoveFollowUpSession(getPendingNextMoveFollowUpSession());
  }, [screen]);

  const handleNextMoveFollowUpSubmit = ({ sessionTimestamp, didIt, helped }) => {
    const updated = saveSessionNextMoveFollowUp(sessionTimestamp, { didIt, helped });
    if (!updated) return;
    setPendingNextMoveFollowUpSession(getPendingNextMoveFollowUpSession());
    try {
      window.plausible("Next Move Follow-Up Saved", {
        props: {
          did_it: didIt === true ? "yes" : didIt === false ? "no" : "not-yet",
          helped: didIt === true
            ? (helped === true ? "yes" : helped === false ? "no" : "not-sure")
            : "not-yet"
        }
      });
    } catch {}
  };

  useEffect(() => {
    if (preferredCrisisRegion) return;
    try {
      const locale = Intl.DateTimeFormat().resolvedOptions().locale || "";
      const lower = String(locale).toLowerCase();
      const map = [
        ["us", "United States"],
        ["ca", "Canada"],
        ["gb", "United Kingdom"],
        ["ie", "Ireland"],
        ["au", "Australia"],
        ["nz", "New Zealand"],
        ["de", "Germany"],
        ["fr", "France"],
        ["es", "Spain"],
        ["jp", "Japan"],
        ["kr", "South Korea"],
        ["tr", "Turkey"],
        ["am", "Armenia"]
      ];
      const matched = map.find(([suffix]) => lower.endsWith(`-${suffix}`) || lower.includes(`_${suffix}`));
      if (matched) setPreferredCrisisRegion(matched[1]);
    } catch {}
  }, [preferredCrisisRegion]);

  useEffect(() => {
    if (screen !== "crisis" && showOtherCrisisResources) {
      setShowOtherCrisisResources(false);
    }
  }, [screen, showOtherCrisisResources]);

  useEffect(() => {
    try { localStorage.removeItem("stillform_home_progress_pinned"); } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("stillform_home_progress_pinned_v2", homeProgressPinned ? "yes" : "no");
    } catch {}
    if (homeProgressPinned && !homeProgressExpanded) {
      setHomeProgressExpanded(true);
    }
  }, [homeProgressPinned, homeProgressExpanded]);

  useEffect(() => {
    try {
      localStorage.setItem("stillform_home_progress_expanded", homeProgressExpanded ? "yes" : "no");
    } catch {}
  }, [homeProgressExpanded]);

  const openFaq = (backScreen = "home") => {
    setFaqBackScreen(backScreen);
    setScreen("faq");
  };
  const openUatBoard = () => {
    if (typeof window !== "undefined") {
      window.location.assign("/uat-roadmap.html#issues");
    }
  };
  const openUatBoardHomeOnly = () => {
    if (screen === "home") openUatBoard();
  };
  const resolveTutorialReturnScreen = (target) => (target === "settings" ? "settings" : "home");
  const resolveSetupBridgeOrigin = (origin) => {
    if (origin === "tutorial" || origin === "settings" || origin === "home") return origin;
    return "home";
  };
  const openSetupBridge = (origin = "home") => {
    const resolvedOrigin = resolveSetupBridgeOrigin(origin);
    setSetupBridgeOrigin(resolvedOrigin);
    setSetupBridgeStep(0);
    if (!isFirstRunComplete()) {
      setFirstRunStage("bridge");
    }
    setScreen("setup-bridge");
  };
  const openTutorial = (backScreen = "home") => {
    setTutorialStep(0);
    setTutorialReturnScreen(resolveTutorialReturnScreen(backScreen));
    setTutorialFocusBrief(null);
    setScreen("tutorial");
  };
  const openFocusCheck = (backScreen = "home") => {
    setFocusCheckReturnScreen(backScreen || "home");
    setScreen("focus-check");
  };
  const goHomeSafely = (defer = false) => {
    // If not onboarded, return to tutorial not home — avoids blank screen
    const isOnboarded = (() => { try { return localStorage.getItem("stillform_onboarded") === "yes"; } catch { return false; } })();
    const targetScreen = isOnboarded ? "home" : "tutorial";
    const targetHash = isOnboarded ? "#home" : "#tutorial";
    if (defer) {
      setTimeout(() => { setScreenRaw(targetScreen); try { if (window.location.hash !== targetHash) window.location.hash = targetHash; } catch {} }, 0);
      return;
    }
    setScreenRaw(targetScreen);
    try { if (window.location.hash !== targetHash) window.location.hash = targetHash; } catch {}
  };
  const handleScreenBack = () => {
    if (screen === "tutorial") {
      if (tutorialStep > 0) {
        setTutorialStep((s) => Math.max(0, s - 1));
      } else {
        setScreen(resolveTutorialReturnScreen(tutorialReturnScreen));
      }
      return;
    }
    if (screen === "setup") {
      if (setupStep > 0) {
        setSetupStep((s) => Math.max(0, s - 1));
      } else {
        // Set step and hash synchronously before React processes state
        // to avoid hashchange firing with stale step=0
        setSetupBridgeStep(1);
        setScreenRaw("setup-bridge");
        try { window.location.hash = "#setup-bridge-1"; } catch {}
      }
      return;
    }
    if (screen === "setup-bridge") {
      if (setupBridgeStep === 1) {
        setSetupBridgeStep(0);
        return;
      }
      const origin = resolveSetupBridgeOrigin(setupBridgeOrigin);
      if (origin === "settings") {
        setScreen("settings");
        return;
      }
      if (origin === "tutorial") {
        setTutorialReturnScreen("home");
        setTutorialStep(4);
        setScreen("tutorial");
        return;
      }
      goHomeSafely();
      return;
    }
    if (screen === "faq") {
      setScreen(faqBackScreen || "home");
      return;
    }
    if (screen === "focus-check") {
      setScreen(focusCheckReturnScreen || "home");
      return;
    }
    if (screen === "tool") {
      handleActiveToolBack();
      return;
    }
    if (screen === "settings" || screen === "privacy" || screen === "progress" || screen === "pricing") {
      goHomeSafely();
      return;
    }
  };
  const showBottomBack = ["tutorial", "setup-bridge", "setup", "faq", "privacy", "settings", "progress", "focus-check", "pricing", "tool"].includes(screen);
  const dismissHomeContextTip = () => {
    setShowHomeContextTip(false);
    try { localStorage.setItem("stillform_tooltip_home_seen", "yes"); } catch {}
  };

  // Sync browser back/forward to in-app screen via hash
  useEffect(() => {
    const onHashChange = () => {
      const s = hashToScreen(window.location.hash);
      setScreenRaw(s);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const swipeEnabledScreens = new Set(["tutorial", "setup-bridge", "setup", "faq", "privacy", "settings", "progress", "focus-check", "pricing"]);
    if (!swipeEnabledScreens.has(screen)) return;
    let touchStart = null;
    const interactiveTags = new Set(["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"]);

    const onTouchStart = (event) => {
      if (!event.touches || event.touches.length !== 1) return;
      const target = event.target;
      // Only block swipe initiation on text inputs — buttons/links are fine to start from
      // (swipe vs tap is distinguished in onTouchEnd by distance)
      if (target instanceof HTMLElement) {
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT") return;
        if (target.closest("input, textarea, select")) return;
      }
      const t = event.touches[0];
      touchStart = { x: t.clientX, y: t.clientY, ts: Date.now() };
    };

    const onTouchEnd = (event) => {
      if (!touchStart || !event.changedTouches || event.changedTouches.length !== 1) return;
      const t = event.changedTouches[0];
      const dx = t.clientX - touchStart.x;
      const dy = t.clientY - touchStart.y;
      const dt = Date.now() - touchStart.ts;
      touchStart = null;

      if (dt > 700) return;
      if (Math.abs(dx) < 70) return;
      if (Math.abs(dy) > 90) return;
      if (Math.abs(dx) < Math.abs(dy) * 1.1) return;

      if (dx > 0) {
        handleScreenBack();
        return;
      }
      if (dx < 0 && screen === "tutorial") {
        const tutorialLastStep = 4;
        if (tutorialStep >= tutorialLastStep) return;
        if (tutorialStep === 2 && !tutorialFocusBrief) return;
        setTutorialStep((s) => Math.min(tutorialLastStep, s + 1));
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [screen, tutorialStep, tutorialFocusBrief, tutorialReturnScreen, setupBridgeOrigin, setupBridgeStep, setupStep, faqBackScreen, focusCheckReturnScreen]);

  const getLoopNudgeSnapshot = () => {
    const todayIso = toLocalDateKey();
    const parseLoopHistory = (key) => {
      try {
        const parsed = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    };
    const toDayKey = (entry) => {
      const raw = entry?.date || entry?.timestamp;
      if (!raw) return null;
      try {
        const dt = new Date(raw);
        if (Number.isNaN(dt.getTime())) return null;
        return dt.toISOString().slice(0, 10);
      } catch {
        return null;
      }
    };
    const withinRecentDays = (rawDate, days) => {
      if (!rawDate) return false;
      try {
        const dt = new Date(rawDate);
        if (Number.isNaN(dt.getTime())) return false;
        const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
        return dt.getTime() >= cutoff;
      } catch {
        return false;
      }
    };
    const recentLoopDaySet = (items) => new Set(
      (Array.isArray(items) ? items : [])
        .filter((entry) => withinRecentDays(entry?.date || entry?.timestamp, 14))
        .map(toDayKey)
        .filter(Boolean)
    );

    const morningOpen14dDays = recentLoopDaySet(parseLoopHistory(LOOP_HISTORY_KEYS.morningStart));
    const morningDone14dDays = recentLoopDaySet(parseLoopHistory(LOOP_HISTORY_KEYS.morning));
    const eodOpen14dDays = recentLoopDaySet(parseLoopHistory(LOOP_HISTORY_KEYS.eodStart));
    const eodDone14dDays = recentLoopDaySet(parseLoopHistory(LOOP_HISTORY_KEYS.eod));
    const morningDropoff14dCount = Array.from(morningOpen14dDays).filter((day) => !morningDone14dDays.has(day)).length;
    const eodDropoff14dCount = Array.from(eodOpen14dDays).filter((day) => !eodDone14dDays.has(day)).length;
    const morningDropoff14dPct = morningOpen14dDays.size ? Math.round((morningDropoff14dCount / morningOpen14dDays.size) * 100) : 0;
    const eodDropoff14dPct = eodOpen14dDays.size ? Math.round((eodDropoff14dCount / eodOpen14dDays.size) * 100) : 0;
    const completedLoopDays14d = new Set([...morningDone14dDays, ...eodDone14dDays]).size;
    const completionRatio14d = completedLoopDays14d / 14;
    const adaptiveDropoffThreshold = Math.max(
      LOOP_NUDGE_DROPOFF_THRESHOLD_LOWER_BOUND,
      Math.min(
        LOOP_NUDGE_DROPOFF_THRESHOLD_UPPER_BOUND,
        LOOP_NUDGE_DROPOFF_THRESHOLD
        + (completionRatio14d >= 0.75 ? 8 : 0)
        - (completionRatio14d <= 0.35 ? 8 : 0)
        + (loopNudgeDismissStreak >= 2 ? 6 : 0)
      )
    );
    const adaptiveMinOpens = Math.max(
      LOOP_NUDGE_MIN_OPENS_LOWER_BOUND,
      Math.min(
        LOOP_NUDGE_MIN_OPENS_UPPER_BOUND,
        LOOP_NUDGE_MIN_OPENS
        + (completionRatio14d >= 0.75 ? 1 : 0)
        - (completionRatio14d <= 0.35 ? 1 : 0)
        + (loopNudgeDismissStreak >= 3 ? 1 : 0)
      )
    );
    const sensitivityLabel = completionRatio14d <= 0.35
      ? "Protective"
      : ((completionRatio14d >= 0.75 || loopNudgeDismissStreak >= 3) ? "Conservative" : "Balanced");

    const nowNudge = new Date();
    const currentMinutesNudge = nowNudge.getHours() * 60 + nowNudge.getMinutes();
    const morningStartMin = (() => { try { const v = localStorage.getItem("stillform_morning_start"); return v ? parseInt(v) : 270; } catch { return 270; } })();
    const eveningStartMin = (() => { try { const v = localStorage.getItem("stillform_evening_start"); return v ? parseInt(v) : 1080; } catch { return 1080; } })();
    const morningEndMin = 1050;
    const morningCap = 240;
    const inMorningWindow = currentMinutesNudge >= morningStartMin && currentMinutesNudge < morningEndMin;
    const inEodWindow = currentMinutesNudge >= eveningStartMin || currentMinutesNudge < morningCap;

    const morningDoneToday = (() => {
      try {
        const c = JSON.parse(localStorage.getItem("stillform_checkin_today") || "null");
        return c?.date === todayIso;
      } catch {
        return false;
      }
    })();
    const eodDoneToday = (() => {
      try {
        const e = JSON.parse(localStorage.getItem("stillform_eod_today") || "null");
        return e?.date === todayIso;
      } catch {
        return false;
      }
    })();

    const loopNudgeCandidates = [
      {
        id: "morning",
        title: "Morning loop consistency",
        actionLabel: "Resume morning check-in",
        opens: morningOpen14dDays.size,
        dropoffCount: morningDropoff14dCount,
        dropoffPct: morningDropoff14dPct,
        eligible: inMorningWindow && !morningDoneToday
      },
      {
        id: "eod",
        title: "End-of-day loop consistency",
        actionLabel: "Close the loop now",
        opens: eodOpen14dDays.size,
        dropoffCount: eodDropoff14dCount,
        dropoffPct: eodDropoff14dPct,
        eligible: inEodWindow && !eodDoneToday
      }
    ]
      .filter((item) => item.eligible)
      .filter((item) => item.opens >= adaptiveMinOpens && item.dropoffPct >= adaptiveDropoffThreshold)
      .sort((a, b) => b.dropoffPct - a.dropoffPct);

    const activeLoopNudge = loopNudgeCandidates[0] || null;
    const showLoopNudge = !!activeLoopNudge && loopNudgeDismissedDay !== todayIso;
    return {
      todayIso,
      activeLoopNudge,
      showLoopNudge,
      isSoftTone: loopNudgeDismissStreak >= 2,
      adaptiveDropoffThreshold,
      adaptiveMinOpens,
      completionRatio14d,
      sensitivityLabel
    };
  };

  // Sync regulation type when navigating screens (catches Settings changes)
  useEffect(() => {
    if (screen === "home") {
      try { setRegType(localStorage.getItem("stillform_regulation_type") || null); } catch {}
    }
  }, [screen]);

  useEffect(() => {
    if (screen !== "home") return;
    const { todayIso, activeLoopNudge, showLoopNudge, adaptiveDropoffThreshold, adaptiveMinOpens, sensitivityLabel } = getLoopNudgeSnapshot();
    if (!showLoopNudge || !activeLoopNudge) return;
    const tracked = appendLoopNudgeEvent({
      event: "shown",
      type: activeLoopNudge.id,
      date: todayIso,
      timestamp: new Date().toISOString(),
      dropoffPct: activeLoopNudge.dropoffPct,
      opens14d: activeLoopNudge.opens,
      dropoffCount: activeLoopNudge.dropoffCount,
      adaptiveDropoffThreshold,
      adaptiveMinOpens,
      sensitivityLabel
    });
    if (tracked) {
      trackLoopNudgeTelemetry("Loop Nudge Shown", {
        type: activeLoopNudge.id,
        dropoff_pct: activeLoopNudge.dropoffPct,
        opens_14d: activeLoopNudge.opens,
        adaptive_dropoff_threshold: adaptiveDropoffThreshold,
        adaptive_min_opens: adaptiveMinOpens,
        sensitivity: sensitivityLabel.toLowerCase()
      });
    }
  }, [screen, loopNudgeDismissedDay, loopNudgeDismissStreak, ciOpen, ciSaved, eodOpen, eodSaved]);
  const [activeTool, setActiveTool] = useState(null);
  const [pathway, setPathway] = useState(null);
  const [sharedText, setSharedText] = useState(null);
  const [outcomeFocus, setOutcomeFocus] = useState(() => {
    try { return JSON.parse(localStorage.getItem("stillform_outcome_focus") || "null"); } catch { return null; }
  });

  useEffect(() => {
    try {
      if (!outcomeFocus) localStorage.removeItem("stillform_outcome_focus");
      else localStorage.setItem("stillform_outcome_focus", JSON.stringify(outcomeFocus));
    } catch {}
  }, [outcomeFocus]);

  // Widget action check — calls native plugin, routes before splash ends
  useEffect(() => {
    const init = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const preview = (params.get("preview") || "").trim().toLowerCase();
        const previewAllowed = new Set(["tutorial", "setup-bridge", "home", "settings", "faq", "privacy"]);
        if (previewAllowed.has(preview)) {
          if (preview === "tutorial") {
            setTutorialStep(0);
            setTutorialReturnScreen("home");
          }
          if (preview === "setup-bridge") {
            setSetupBridgeOrigin("home");
          }
          setScreen(preview);
          setScreenReady(true);
          return;
        }
      } catch {}

      if (!isFirstRunComplete()) {
        const firstRunStage = readFirstRunStage();
        if (firstRunStage === "calibration") {
          setSetupBridgeOrigin("tutorial");
          setScreen("setup");
          setScreenReady(true);
          setBiometricCleared(true);
          return;
        }
        if (firstRunStage === "bridge") {
          setSetupBridgeOrigin("tutorial");
          setScreen("setup-bridge");
          setScreenReady(true);
          setBiometricCleared(true);
          return;
        }
        setTutorialStep(0);
        setTutorialReturnScreen("home");
        setScreen("tutorial");
        setScreenReady(true);
        setBiometricCleared(true); // no biometric gate for first-run flows
        return;
      }

      try {
        const result = await WidgetBridge.getWidgetAction();
        if (result?.action === "breathe") {
          setActiveTool({ id: "breathe", name: "Breathe", quickStart: true });
          setPathway("calm");
          setScreen("tool");
          setScreenReady(true);
          setBiometricCleared(true);
          return;
        }
      } catch (e) {
        console.error("WidgetBridge error:", e);
      }

      // If onboarded but somehow missing regType, send to tutorial — never show dead screen
      const missingRegType = !localStorage.getItem("stillform_regulation_type");
      if (missingRegType && !trialExpired) {
        setTutorialStep(0);
        setTutorialReturnScreen("home");
        setScreen("tutorial");
        setScreenReady(true);
        return;
      }
      // Biometric gate — prompt before revealing home if enabled
      if (biometric.isEnabled()) {
        setScreen(trialExpired ? "pricing" : "home");
        setScreenReady(true);
        const ok = await biometric.authenticate();
        if (!ok) {
          // Auth failed or cancelled — keep showing splash until they authenticate
          setBiometricCleared(false);
          const retry = async () => {
            const r = await biometric.authenticate();
            if (r) setBiometricCleared(true);
            else setTimeout(retry, 1000);
          };
          retry();
          return;
        }
        setBiometricCleared(true);
      } else {
        setScreen(trialExpired ? "pricing" : "home");
        setScreenReady(true);
        setBiometricCleared(true);
      }
    };
    init();
    // Safety net: if screenReady never fires (e.g. return from external URL), force it after 4s
    const safetyNet = setTimeout(() => {
      setScreenReady(true);
      setBiometricCleared(true);
    }, 4000);
    return () => clearTimeout(safetyNet);
  }, []);

  // Deep link handling — share extension
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const share = params.get("share");
      if (share && isFirstRunComplete()) {
        setSharedText(decodeURIComponent(share));
        setActiveTool({ id: "reframe", name: "Reframe", mode: "calm" });
        setScreen("tool");
        window.history.replaceState({}, "", "/");
      }

      // Native: listen for share extension
      if (isNative()) {
        import('@capacitor/app').then(({ App }) => {
          App.addListener("appUrlOpen", (data) => {
            try {
              const url = new URL(data.url);
              const s = url.searchParams.get("share");
              if (s && isFirstRunComplete()) {
                setSharedText(decodeURIComponent(s));
                setActiveTool({ id: "reframe", name: "Reframe", mode: "calm" });
                setScreen("tool");
              }
            } catch {}
          });

          // Foreground resume — re-prompt biometric when app comes back from background
          App.addListener("appStateChange", async ({ isActive }) => {
            if (isActive && biometric.isEnabled()) {
              setBiometricCleared(false);
              const ok = await biometric.authenticate();
              if (ok) {
                setBiometricCleared(true);
              } else {
                const retry = async () => {
                  const r = await biometric.authenticate();
                  if (r) setBiometricCleared(true);
                  else setTimeout(retry, 1500);
                };
                retry();
              }
            }
          });

          // Android hardware back button
          App.addListener("backButton", () => {
            handleScreenBack();
          });
        }).catch(() => {});
      }
    } catch {}
  }, []);
  const checkoutToLemon = () => {
    if (checkoutLoading) return;
    setCheckoutLoading(true);
    setCheckoutMessage(null);
    try {
      const trialStart = (() => {
        try { return localStorage.getItem("stillform_trial_start"); } catch { return null; }
      })();
      if (trialExpired && !trialStart) {
        setCheckoutMessage("Subscription required. Trial start date is missing on this device.");
        setCheckoutLoading(false);
        return;
      }
      const userId = sbGetUser()?.id;
      if (!userId) {
        setCheckoutMessage(null);
        try {
          localStorage.setItem("stillform_checkout_after_login", JSON.stringify({
            createdAt: Date.now(),
            pricingPlan: pricingPlan === "annual" ? "annual" : "monthly"
          }));
        } catch {}
        setPricingAuthOpen(true);
        setCheckoutLoading(false);
        return;
      }
      const checkoutBase = "https://embers.lemonsqueezy.com/checkout/buy/540c609b-2534-4362-9e9f-0b07b08dbedc";
      const params = new URLSearchParams();
      params.set("checkout[custom][variant]", pricingPlan === "annual" ? "annual" : "monthly");
      params.set("checkout[custom][redirect_url]", window.location.origin + "/?subscribed=true");
      const installId = getOrCreateInstallId();
      if (installId) params.set("checkout[custom][install_id]", installId);
      params.set("checkout[custom][user_id]", userId);
      window.location.href = `${checkoutBase}?${params.toString()}`;
    } catch {
      setCheckoutLoading(false);
      setCheckoutMessage("Couldn't open checkout. Try again.");
    }
  };
  const [pricingPlan, setPricingPlan] = useState("annual");
  const [highContrastMode, setHighContrastMode] = useState(() => {
    try { return localStorage.getItem("stillform_high_contrast") === "on"; } catch { return false; }
  });
  const [themeChoice, setThemeChoice] = useState(() => {
    try {
      const stored = localStorage.getItem("stillform_theme") || "dark";
      return VALID_THEME_IDS.has(stored) ? stored : "dark";
    } catch {
      return "dark";
    }
  });
  const [aiToneChoice, setAiToneChoice] = useState(() => {
    try {
      const stored = localStorage.getItem("stillform_ai_tone") || "balanced";
      return VALID_AI_TONE_IDS.has(stored) ? stored : "balanced";
    } catch {
      return "balanced";
    }
  });
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState(null);
  const [openLog, setOpenLog] = useState(null);
  const [, forceUpdate] = useState(0);
  const refreshSettings = () => forceUpdate(n => n + 1);

  // Re-reads key preference state from localStorage after cloud sync
  const rehydrateAfterSync = () => {
    try {
      const restoredTheme = localStorage.getItem("stillform_theme");
      const restoredHC = localStorage.getItem("stillform_high_contrast") === "on";
      const restoredRegType = localStorage.getItem("stillform_regulation_type");
      if (restoredTheme && ["dark","midnight","suede","teal","rose","light"].includes(restoredTheme)) {
        setThemeChoice(restoredTheme);
        applyThemePreset(restoredTheme, restoredHC);
      }
      if (restoredRegType) setRegType(restoredRegType);
      if (restoredHC !== highContrastMode) setHighContrastMode(restoredHC);
      refreshSettings();
    } catch {}
  };
  const { screenLight, reducedMotion } = useDisplayPrefs();
  const appClasses = `app${screenLight ? " screenlight-active" : ""}${reducedMotion ? " reduced-motion" : ""}`;

  // Journal state — must be before any early return (React Rules of Hooks)
  const [journalEntries, setJournalEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem("stillform_journal") || "[]"); } catch { return []; }
  });

  const [syncEmail, setSyncEmail] = useState("");
  const [syncPassword, setSyncPassword] = useState("");
  const [showSyncPassword, setShowSyncPassword] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [syncSuccess, setSyncSuccess] = useState(null);
  const [syncAuthCooldownUntil, setSyncAuthCooldownUntil] = useState(0);
  const [, setSyncAuthTick] = useState(0);
  const [pricingAuthOpen, setPricingAuthOpen] = useState(false);
  const [pricingAuthEmail, setPricingAuthEmail] = useState("");
  const [pricingAuthPassword, setPricingAuthPassword] = useState("");
  const [showPricingPassword, setShowPricingPassword] = useState(false);
  const [pricingAuthLoading, setPricingAuthLoading] = useState(false);
  const [pricingAuthError, setPricingAuthError] = useState(null);
  const [pricingAuthCooldownUntil, setPricingAuthCooldownUntil] = useState(0);
  const [, setPricingAuthTick] = useState(0);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installDismissed, setInstallDismissed] = useState(false);
  const [integrationActionStatus, setIntegrationActionStatus] = useState("");
  const [subscriptionStatusLoading, setSubscriptionStatusLoading] = useState(false);
  const [subscriptionStatusMessage, setSubscriptionStatusMessage] = useState("");
  const [subscriptionLastCheckedAt, setSubscriptionLastCheckedAt] = useState(0);
  const [exportStatus, setExportStatus] = useState("");
  const [settingsShareQrOpen, setSettingsShareQrOpen] = useState(false);
  const [settingsSectionOpen, setSettingsSectionOpen] = useState(() => ({
    personalization: false,
    account: false,
    integrations: false,
    data: false,
    more: false,
  }));
  const [settingsSubOpen, setSettingsSubOpen] = useState(() => ({
    theme: false, aiTone: false, display: false, sound: false,
    processingType: false, breathingPattern: false, scanPace: false, signalMapping: false, scheduleNotif: false,
    subscriptionStatus: false, syncControls: false,
    metrics: false, exports: false,
  }));
  const toggleSubOpen = (key) => setSettingsSubOpen(prev => ({ ...prev, [key]: !prev[key] }));
  const [metricsOptIn, setMetricsOptIn] = useState(() => {
    try { return localStorage.getItem(METRICS_OPT_IN_KEY) !== "no"; } catch { return true; }
  });
  const [metricsStatus, setMetricsStatus] = useState("");
  const [metricsUploading, setMetricsUploading] = useState(false);
  const [metricsLastSentAt, setMetricsLastSentAt] = useState(() => {
    try { return localStorage.getItem(METRICS_LAST_SENT_AT_KEY) || ""; } catch { return ""; }
  });
  const initialUatFeedbackDraft = getUatFeedbackDraft();
  const [uatQuestionId, setUatQuestionId] = useState(initialUatFeedbackDraft.questionId || (UAT_QUESTION_OPTIONS[0]?.id || "confusing"));
  const [uatQuestionText, setUatQuestionText] = useState(initialUatFeedbackDraft.text || "");
  const [uatFeedbackStatus, setUatFeedbackStatus] = useState("");
  const [uatSubmitting, setUatSubmitting] = useState(false);
  const [showUatFeedbackPanel, setShowUatFeedbackPanel] = useState(false);
  const [uatFeedbackHistoryOpen, setUatFeedbackHistoryOpen] = useState(false);
  const [uatFeedbackHistory, setUatFeedbackHistory] = useState(() => getUatFeedbackHistoryFromStorage());
  const [uatFeedbackHistorySyncing, setUatFeedbackHistorySyncing] = useState(false);
  useEffect(() => {
    const themeToApply = ["dark", "midnight", "suede", "teal", "rose", "light"].includes(themeChoice) ? themeChoice : "dark";
    applyThemePreset(themeToApply, highContrastMode);
    if (themeToApply !== themeChoice) {
      try { localStorage.setItem("stillform_theme", themeToApply); } catch {}
      setThemeChoice(themeToApply);
    }
  }, [themeChoice, highContrastMode]);
  const metricsAuthToken = sbGetSession()?.access_token || "";
  const nativePlatform = (() => {
    try { return window?.Capacitor?.getPlatform?.() || "web"; } catch { return "web"; }
  })();
  const integrationsSupportedOnPlatform = nativePlatform === "ios" || nativePlatform === "android";
  const integrationContext = resolveIntegrationContext();
  const hasPendingWebhookSync = hasFreshSubscribePending(SUBSCRIPTION_PENDING_GRACE_MS);

  const syncAuthCooldownSeconds = Math.max(0, Math.ceil((syncAuthCooldownUntil - Date.now()) / 1000));
  const pricingAuthCooldownSeconds = Math.max(0, Math.ceil((pricingAuthCooldownUntil - Date.now()) / 1000));
  const toggleSettingsSection = (key) => {
    setSettingsSectionOpen((current) => ({ ...current, [key]: !current?.[key] }));
  };

  const setThemeSelection = (nextTheme) => {
    if (!VALID_THEME_IDS.has(nextTheme)) return;
    try { localStorage.setItem("stillform_theme", nextTheme); } catch {}
    setThemeChoice(nextTheme);
    refreshSettings();
  };

  const setDisplayPreference = (storageKey, isOn) => {
    try { localStorage.setItem(storageKey, isOn ? "on" : "off"); } catch {}
    refreshSettings();
  };

  const setAiToneSelection = (nextTone) => {
    if (!VALID_AI_TONE_IDS.has(nextTone)) return;
    try { localStorage.setItem("stillform_ai_tone", nextTone); } catch {}
    setAiToneChoice(nextTone);
    refreshSettings();
  };

  useEffect(() => {
    if (syncAuthCooldownSeconds <= 0) return;
    const id = setInterval(() => setSyncAuthTick(n => n + 1), 1000);
    return () => clearInterval(id);
  }, [syncAuthCooldownSeconds]);

  useEffect(() => {
    if (pricingAuthCooldownSeconds <= 0) return;
    const id = setInterval(() => setPricingAuthTick(n => n + 1), 1000);
    return () => clearInterval(id);
  }, [pricingAuthCooldownSeconds]);

  const startSyncAuthCooldown = (message) => {
    const m = String(message || "").match(/wait(?: about)? (\d+)\s*second/i);
    const seconds = Math.max(15, Number(m?.[1] || 60));
    setSyncAuthCooldownUntil(Date.now() + (seconds * 1000));
  };

  const isRateLimitedMessage = (message) => /too many attempts|wait/i.test(String(message || ""));
  const isAlreadyRegisteredMessage = (message) => /already (registered|exists|been registered)/i.test(String(message || ""));
  const isInvalidCredentialsMessage = (message) => /invalid login credentials|invalid email or password|email not confirmed/i.test(String(message || ""));

  const startPricingAuthCooldown = (message) => {
    const m = String(message || "").match(/wait(?: about)? (\d+)\s*second/i);
    const seconds = Math.max(15, Number(m?.[1] || 60));
    setPricingAuthCooldownUntil(Date.now() + (seconds * 1000));
  };

  const signInAndContinueCheckout = async () => {
    if (!pricingAuthEmail || !pricingAuthPassword) {
      setPricingAuthError("Enter email and password.");
      return;
    }
    if (pricingAuthCooldownSeconds > 0) {
      setPricingAuthError(`Please wait ${pricingAuthCooldownSeconds}s, then try again.`);
      return;
    }
    setPricingAuthLoading(true);
    setPricingAuthError(null);
    try {
      let signedIn = false;
      let signInError = null;
      try {
        await sbSignIn(pricingAuthEmail, pricingAuthPassword);
        if (sbIsSignedIn()) {
          await sbSyncDown();
          rehydrateAfterSync();
          signedIn = true;
        }
      } catch (e) {
        signInError = e;
      }

      if (!signedIn) {
        if (isRateLimitedMessage(signInError?.message)) {
          startPricingAuthCooldown(signInError?.message);
          throw signInError;
        }
        if (isInvalidCredentialsMessage(signInError?.message)) {
          throw new Error("Incorrect email or password. Please try again.");
        }
        try {
          await sbSignUp(pricingAuthEmail, pricingAuthPassword);
        } catch (signupErr) {
          if (isAlreadyRegisteredMessage(signupErr?.message) || isAlreadyRegisteredMessage(signInError?.message)) {
            throw new Error("Incorrect email or password. Please try again.");
          }
          throw signupErr;
        }
        if (!sbIsSignedIn()) {
          setPricingAuthError("Check your email to confirm your account, then sign in.");
          setPricingAuthLoading(false);
          return;
        }
        await sbCreateProfile();
        await sbSyncUp();
        signedIn = true;
      }

      if (signedIn) {
        try {
          await fetch(`${NETLIFY_BASE}/.netlify/functions/subscription-link-account`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sbGetSession()?.access_token || ""}`
            },
            body: JSON.stringify({ install_id: getOrCreateInstallId() })
          });
        } catch {}
        setSyncSignedIn(true);
        setPricingAuthCooldownUntil(0);
        setSubscriptionCheckTick(n => n + 1);
        setSyncEmail("");
        setSyncPassword("");
        setPricingAuthOpen(false);
        refreshSettings();
        setTimeout(() => checkoutToLemon(), 200);
      }
    } catch (e) {
      const msg = e?.message || "Something went wrong. Check your details.";
      if (isRateLimitedMessage(msg)) startPricingAuthCooldown(msg);
      setPricingAuthError(msg);
    }
    setPricingAuthLoading(false);
  };

  const setIntegrationStatusWithClear = (message) => {
    setIntegrationActionStatus(message);
    try {
      window.setTimeout(() => setIntegrationActionStatus(""), 2600);
    } catch {}
  };

  const getIntegrationLabel = (kind) => (kind === "calendar" ? "Calendar" : "Health");

  const writeIntegrationData = (kind, payload) => {
    const config = INTEGRATION_STORAGE_KEYS[kind];
    if (!config) return;
    if (kind === "calendar") {
      const events = Array.isArray(payload?.events) ? payload.events : [];
      if (typeof payload?.summary === "string" && payload.summary.trim()) {
        localStorage.setItem("stillform_calendar_summary", payload.summary.trim());
      } else {
        localStorage.removeItem("stillform_calendar_summary");
      }
      localStorage.setItem("stillform_calendar_events", JSON.stringify(events));
      localStorage.setItem("stillform_calendar_updated_at", String(payload?.updatedAt || new Date().toISOString()));
      return;
    }
    if (kind === "health") {
      if (typeof payload?.summary === "string" && payload.summary.trim()) {
        localStorage.setItem("stillform_health_summary", payload.summary.trim());
      } else {
        localStorage.removeItem("stillform_health_summary");
      }
      localStorage.setItem("stillform_health_snapshot", JSON.stringify(payload?.snapshot || null));
      localStorage.setItem("stillform_health_updated_at", String(payload?.updatedAt || new Date().toISOString()));
    }
  };

  const clearIntegrationData = (kind) => {
    const config = INTEGRATION_STORAGE_KEYS[kind];
    if (!config) return;
    config.data.forEach((k) => localStorage.removeItem(k));
  };

  const setIntegrationConsent = (kind, nextState) => {
    const config = INTEGRATION_STORAGE_KEYS[kind];
    if (!config) return;
    try {
      if (nextState === "granted" || nextState === "revoked" || nextState === "pending") {
        localStorage.setItem(config.consent, nextState);
      }
      if (nextState === "revoked") {
        clearIntegrationData(kind);
        localStorage.removeItem(config.error);
        localStorage.removeItem(config.retryAt);
      }
      if (nextState === "granted") {
        localStorage.removeItem(config.error);
      }
      refreshSettings();
      const label = getIntegrationLabel(kind);
      const msg = nextState === "granted"
        ? `${label} access enabled.`
        : nextState === "revoked"
          ? `${label} context revoked and local cache cleared.`
          : `${label} context reset to pending.`;
      setIntegrationStatusWithClear(msg);
    } catch {
      setIntegrationStatusWithClear("Could not update integration consent.");
    }
  };

  const syncIntegrationContext = async (kind, { source = "sync" } = {}) => {
    const config = INTEGRATION_STORAGE_KEYS[kind];
    if (!config) return;
    const label = getIntegrationLabel(kind);
    try {
      const result = kind === "calendar"
        ? await integrationBridge.syncCalendar()
        : await integrationBridge.syncHealth();

      if (result?.ok) {
        localStorage.setItem(config.consent, "granted");
        localStorage.removeItem(config.error);
        localStorage.setItem(config.retryAt, new Date().toISOString());
        writeIntegrationData(kind, result);
        refreshSettings();
        if (result?.status === "no-data") {
          setIntegrationStatusWithClear(`${label} connected, but no recent data was found yet.`);
        } else {
          const eventCount = (() => { try { const ev = JSON.parse(localStorage.getItem("stillform_calendar_events") || "[]"); return Array.isArray(ev) ? ev.length : 0; } catch { return 0; } })();
          const summary = localStorage.getItem("stillform_calendar_summary") || "";
          if (kind === "calendar" && eventCount > 0) {
            setIntegrationStatusWithClear(`Calendar synced · ${eventCount} event${eventCount !== 1 ? "s" : ""} found`);
          } else {
            setIntegrationStatusWithClear(`${label} connected and synced from device.`);
          }
        }
        return;
      }

      const status = String(result?.status || "error");
      const reason = String(result?.error || `${label} sync failed.`);
      if (status === "denied" || status === "restricted") {
        localStorage.setItem(config.consent, "pending");
        clearIntegrationData(kind);
      }
      localStorage.setItem(config.error, reason.slice(0, 220));
      localStorage.setItem(config.retryAt, new Date().toISOString());
      refreshSettings();
      if (source === "connect") {
        setIntegrationStatusWithClear(`${label} connection not completed: ${reason}`);
      } else {
        setIntegrationStatusWithClear(`${label} sync failed: ${reason}`);
      }
    } catch {
      try {
        localStorage.setItem(config.error, `${label} sync failed.`);
        localStorage.setItem(config.retryAt, new Date().toISOString());
      } catch {}
      refreshSettings();
      setIntegrationStatusWithClear(`Could not sync ${label.toLowerCase()} right now.`);
    }
  };

  const retryIntegrationContext = (kind) => {
    const config = INTEGRATION_STORAGE_KEYS[kind];
    if (!config) return;
    void syncIntegrationContext(kind, { source: "retry" });
  };

  const clearIntegrationError = (kind) => {
    const config = INTEGRATION_STORAGE_KEYS[kind];
    if (!config) return;
    try {
      localStorage.removeItem(config.error);
      refreshSettings();
      const label = getIntegrationLabel(kind);
      setIntegrationStatusWithClear(`${label} error cleared.`);
    } catch {
      setIntegrationStatusWithClear("Could not clear integration error.");
    }
  };

  const clearIntegrationContextCache = () => {
    const keys = [
      ...INTEGRATION_STORAGE_KEYS.calendar.data,
      ...INTEGRATION_STORAGE_KEYS.health.data
    ];
    try {
      keys.forEach((k) => localStorage.removeItem(k));
      refreshSettings();
      setIntegrationStatusWithClear("Cleared stale integration context.");
    } catch {
      setIntegrationStatusWithClear("Could not clear integration context.");
    }
  };

  const integrationSignalColor = (kind, hasContext) => {
    const consent = kind === "calendar" ? integrationContext.calendarConsent : integrationContext.healthConsent;
    const error = kind === "calendar" ? integrationContext.calendarError : integrationContext.healthError;
    if (error) return "#c05040";
    if (consent === "revoked") return "var(--text-muted)";
    if (hasContext) return "var(--amber)";
    return "var(--text-muted)";
  };

  const integrationSignalLabel = (kind, hasContext, detail) => {
    const consent = kind === "calendar" ? integrationContext.calendarConsent : integrationContext.healthConsent;
    const error = kind === "calendar" ? integrationContext.calendarError : integrationContext.healthError;
    if (error) return `Error · ${detail}`;
    if (consent === "revoked") return `Revoked · ${detail}`;
    if (consent === "pending") return `Pending consent · ${detail}`;
    return hasContext ? `Connected · ${detail}` : `Awaiting context · ${detail}`;
  };

  const setSubscriptionStatusWithClear = (message) => {
    setSubscriptionStatusMessage(message);
    try {
      window.setTimeout(() => setSubscriptionStatusMessage(""), 3200);
    } catch {}
  };

  const setSyncFeedbackWithClear = (type, message) => {
    if (type === "error") {
      setSyncError(message);
      try { window.setTimeout(() => setSyncError(null), 3200); } catch {}
      return;
    }
    setSyncSuccess(message);
    try { window.setTimeout(() => setSyncSuccess(null), 3200); } catch {}
  };

  const setExportStatusWithClear = (message) => {
    setExportStatus(message);
    try { window.setTimeout(() => setExportStatus(""), 3200); } catch {}
  };

  const setMetricsStatusWithClear = (message) => {
    setMetricsStatus(message);
    try { window.setTimeout(() => setMetricsStatus(""), 3200); } catch {}
  };

  const setUatFeedbackStatusWithClear = (message) => {
    setUatFeedbackStatus(message);
    try { window.setTimeout(() => setUatFeedbackStatus(""), 4200); } catch {}
  };

  const syncUatFeedbackHistoryState = (entries) => {
    const merged = mergeUatFeedbackHistoryEntries(entries, UAT_FEEDBACK_HISTORY_MAX_ITEMS);
    setUatFeedbackHistory(merged);
    try { localStorage.setItem(UAT_FEEDBACK_HISTORY_KEY, JSON.stringify(merged)); } catch {}
    return merged;
  };

  const refreshUatFeedbackHistory = async ({ silent = true } = {}) => {
    if (uatFeedbackHistorySyncing) return;
    setUatFeedbackHistorySyncing(true);
    try {
      const params = new URLSearchParams();
      params.set("limit", String(UAT_FEEDBACK_HISTORY_CLOUD_FETCH_MAX_ITEMS));
      const authToken = sbGetSession()?.access_token || "";
      const response = await fetch(`${NETLIFY_BASE}/.netlify/functions/uat-feedback-history?${params.toString()}`, {
        method: "GET",
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}
      });
      if (!response.ok) {
        const failure = await response.json().catch(() => ({}));
        throw new Error(failure?.error || `UAT feedback history ${response.status}`);
      }
      const data = await response.json().catch(() => ({}));
      const cloudEntries = (Array.isArray(data?.history) ? data.history : [])
        .map((entry) => normalizeUatFeedbackHistoryEntry(entry))
        .filter(Boolean);
      syncUatFeedbackHistoryState(cloudEntries);
    } catch {
      if (!silent) {
        setUatFeedbackStatusWithClear("Could not load shared feedback feed right now.");
      }
      setUatFeedbackHistory(getUatFeedbackHistoryFromStorage());
    } finally {
      setUatFeedbackHistorySyncing(false);
    }
  };

  const toggleUatFeedbackHistoryOpen = () => {
    setUatFeedbackHistoryOpen((value) => {
      const next = !value;
      if (next) {
        setUatFeedbackHistory([]);
        void refreshUatFeedbackHistory({ silent: true });
      }
      return next;
    });
  };

  useEffect(() => {
    try {
      localStorage.setItem(UAT_FEEDBACK_DRAFT_KEY, JSON.stringify({
        questionId: uatQuestionId,
        text: String(uatQuestionText || "").slice(0, UAT_FEEDBACK_TEXT_MAX)
      }));
    } catch {}
  }, [uatQuestionId, uatQuestionText]);

  const submitUatFeedback = async () => {
    if (uatSubmitting) return;
    const selectedQuestionId = UAT_QUESTION_OPTIONS.some((item) => item.id === uatQuestionId)
      ? uatQuestionId
      : (UAT_QUESTION_OPTIONS[0]?.id || "confusing");
    const trimmed = String(uatQuestionText || "").trim();
    if (trimmed.length < UAT_FEEDBACK_TEXT_MIN) {
      setUatFeedbackStatusWithClear("Please add a little more detail so we can act on it.");
      return;
    }
    setUatSubmitting(true);
    try {
      const installId = getOrCreateInstallId();
      const payload = {
        install_id: installId,
        source_screen: "home",
        question_id: selectedQuestionId,
        question_prompt: (UAT_QUESTION_OPTIONS.find((item) => item.id === selectedQuestionId)?.prompt) || null,
        feedback_text: trimmed.slice(0, UAT_FEEDBACK_TEXT_MAX),
        app_version: APP_VERSION,
        package_version: APP_PACKAGE_VERSION,
        submitted_at: new Date().toISOString()
      };
      const endpoint = "/.netlify/functions/uat-feedback";
      const authToken = sbGetSession()?.access_token;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const failure = await response.json().catch(() => ({}));
        throw new Error(failure?.error || `UAT feedback ${response.status}`);
      }
      setUatQuestionText("");
      try {
        localStorage.setItem(UAT_FEEDBACK_DRAFT_KEY, JSON.stringify({
          questionId: selectedQuestionId,
          text: ""
        }));
      } catch {}
      const historyEntry = {
        id: `uat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        submittedAt: new Date().toISOString(),
        questionId: selectedQuestionId,
        text: trimmed.slice(0, UAT_FEEDBACK_TEXT_MAX)
      };
      const updatedHistory = appendUatFeedbackHistory(historyEntry, UAT_FEEDBACK_HISTORY_MAX_ITEMS);
      setUatFeedbackHistory(updatedHistory);
      setUatFeedbackHistoryOpen(true);
      void refreshUatFeedbackHistory({ silent: true });
      setUatFeedbackStatusWithClear("Thanks. Your UAT feedback was sent.");
      try { window.plausible("UAT Feedback Submitted", { props: { question: selectedQuestionId } }); } catch {}
    } catch {
      setUatFeedbackStatusWithClear("Could not send right now. Draft saved on this device.");
    } finally {
      setUatSubmitting(false);
    }
  };

  const getMetricsSnapshot = () => buildPerformanceMetricsSnapshot({
    appVersion: APP_VERSION,
    packageVersion: APP_PACKAGE_VERSION,
    isSubscribed
  });

  const copyMetricsSnapshot = async () => {
    try {
      const payload = JSON.stringify(getMetricsSnapshot(), null, 2);
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(payload);
      } else {
        const ta = document.createElement("textarea");
        ta.value = payload;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setMetricsStatusWithClear("Diagnostic snapshot copied.");
      try { window.plausible("Metrics Snapshot Copied"); } catch {}
    } catch {
      setMetricsStatusWithClear("Could not copy diagnostic snapshot.");
    }
  };

  const pushMetricsSnapshot = async ({ source = "manual", silent = false } = {}) => {
    if (metricsUploading) return false;
    if (!metricsOptIn) {
      if (!silent) setMetricsStatusWithClear("App diagnostics is turned off.");
      return false;
    }
    if (!metricsAuthToken) {
      if (!silent) setMetricsStatusWithClear("Sign in to send diagnostics.");
      return false;
    }
    setMetricsUploading(true);
    try {
      const snapshot = getMetricsSnapshot();
      const installId = getOrCreateInstallId();
      const res = await fetch(`${NETLIFY_BASE}/.netlify/functions/metrics-ingest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${metricsAuthToken}`
        },
        body: JSON.stringify({
          metrics_opt_in: true,
          source,
          install_id: installId,
          snapshot
        })
      });
      if (!res.ok) {
        const failure = await res.json().catch(() => ({}));
        throw new Error(failure?.error || `Metrics ingest ${res.status}`);
      }
      const response = await res.json().catch(() => ({}));
      const sentAt = new Date().toISOString();
      const sentDay = sentAt.slice(0, 10);
      try {
        localStorage.setItem(METRICS_LAST_SENT_AT_KEY, sentAt);
        localStorage.setItem(METRICS_LAST_SENT_DAY_KEY, sentDay);
      } catch {}
      setMetricsLastSentAt(sentAt);
      if (!silent) {
        setMetricsStatusWithClear(
          response?.metric_date ? `Diagnostics sent for ${response.metric_date}.` : "Diagnostics sent."
        );
      }
      try {
        window.plausible("Metrics Snapshot Sent", { props: { source } });
      } catch {}
      return true;
    } catch {
      if (!silent) setMetricsStatusWithClear("Could not send. Try again.");
      return false;
    } finally {
      setMetricsUploading(false);
    }
  };

  const escapeHtml = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const downloadTextFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const csvValue = (value) => {
    const raw = value == null ? "" : String(value);
    if (/[",\n]/.test(raw)) return `"${raw.replace(/"/g, "\"\"")}"`;
    return raw;
  };

  const exportSessionHistoryCsv = () => {
    const sessions = getSessionsFromStorage();
    if (sessions.length === 0) {
      setExportStatusWithClear("No sessions to export yet.");
      return;
    }
    const headers = [
      "timestamp",
      "source",
      "mode",
      "entryMode",
      "tools",
      "durationSec",
      "preState",
      "postState",
      "delta",
      "selfGuided",
      "exitPoint"
    ];
    const lines = [
      headers.join(","),
      ...sessions.map((session) => [
        csvValue(session.timestamp),
        csvValue(session.source),
        csvValue(session.mode),
        csvValue(session.entryMode),
        csvValue(Array.isArray(session.tools) ? session.tools.join("|") : ""),
        csvValue(session.duration ? Math.round(Number(session.duration) / 1000) : ""),
        csvValue(session.preState),
        csvValue(session.postState),
        csvValue(Number.isFinite(session.delta) ? session.delta : ""),
        csvValue(session.selfGuided ? "yes" : "no"),
        csvValue(session.exitPoint)
      ].join(","))
    ];
    const stamp = new Date().toISOString().slice(0, 10);
    downloadTextFile(lines.join("\n"), `stillform-session-history-${stamp}.csv`, "text/csv;charset=utf-8");
    setExportStatusWithClear(`Session CSV downloaded (${sessions.length} rows).`);
    try { window.plausible("Session CSV Exported", { props: { rows: sessions.length } }); } catch {}
  };

  const exportPulseLogPdf = () => {
    const entries = readArrayFromStorage("stillform_journal");
    if (entries.length === 0) {
      setExportStatusWithClear("No pulse entries to export yet.");
      return;
    }
    const toRow = (entry) => {
      const signal = Array.isArray(entry.signal) && entry.signal.length > 0
        ? entry.signal.join(", ")
        : (Array.isArray(entry.emotions) ? entry.emotions.join(", ") : "");
      const trigger = [entry.triggerType, entry.trigger].filter(Boolean).join(" — ");
      return {
        date: entry.date || "",
        time: entry.time || "",
        signal: signal || "",
        trigger: trigger || "",
        outcome: entry.outcome || "",
        notes: entry.notes || entry.body || ""
      };
    };
    const rows = entries.map((entry) => {
      const row = toRow(entry);
      return `
        <tr>
          <td>${escapeHtml(row.date)}</td>
          <td>${escapeHtml(row.time)}</td>
          <td>${escapeHtml(row.signal)}</td>
          <td>${escapeHtml(row.trigger)}</td>
          <td>${escapeHtml(row.outcome)}</td>
          <td>${escapeHtml(row.notes)}</td>
        </tr>`;
    }).join("");
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Stillform Pulse Log</title><style>
      body{font-family:Arial,sans-serif;background:#fff;color:#111;margin:24px;}
      h1{font-size:18px;margin:0 0 6px;}
      p{font-size:12px;color:#555;margin:0 0 16px;}
      table{width:100%;border-collapse:collapse;font-size:11px;}
      th,td{border:1px solid #ddd;padding:6px 8px;vertical-align:top;text-align:left;}
      th{background:#f4f4f4;font-size:10px;letter-spacing:.06em;text-transform:uppercase;}
    </style></head><body>
      <h1>Stillform Pulse Log</h1>
      <p>Exported ${new Date().toLocaleString()} · ${entries.length} entries</p>
      <table>
        <thead><tr><th>Date</th><th>Time</th><th>Signal</th><th>Trigger</th><th>Outcome</th><th>Notes</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </body></html>`;
    const stamp = new Date().toISOString().slice(0, 10);
    const fallbackCsv = () => {
      const headers = ["date", "time", "signal", "trigger", "outcome", "notes"];
      const lines = [
        headers.join(","),
        ...entries.map((entry) => {
          const row = toRow(entry);
          return [
            csvValue(row.date),
            csvValue(row.time),
            csvValue(row.signal),
            csvValue(row.trigger),
            csvValue(row.outcome),
            csvValue(row.notes)
          ].join(",");
        })
      ];
      downloadTextFile(lines.join("\n"), `stillform-pulse-log-${stamp}.csv`, "text/csv;charset=utf-8");
      setExportStatusWithClear(`Print preview unavailable. Downloaded pulse log CSV (${entries.length} rows).`);
    };
    try {
      const frame = document.createElement("iframe");
      frame.setAttribute("title", "Stillform Pulse Export");
      frame.style.position = "fixed";
      frame.style.width = "0";
      frame.style.height = "0";
      frame.style.opacity = "0";
      frame.style.pointerEvents = "none";
      frame.style.border = "0";
      const cleanup = () => {
        try { frame.remove(); } catch {}
      };
      frame.onload = () => {
        try {
          const targetWin = frame.contentWindow;
          if (!targetWin) throw new Error("Print target unavailable");
          targetWin.focus();
          targetWin.print();
          setExportStatusWithClear(`Pulse log ready for PDF export (${entries.length} entries).`);
          try { window.plausible("Pulse PDF Exported", { props: { rows: entries.length } }); } catch {}
        } catch {
          fallbackCsv();
        } finally {
          window.setTimeout(cleanup, 1200);
        }
      };
      document.body.appendChild(frame);
      const doc = frame.contentDocument || frame.contentWindow?.document;
      if (!doc) throw new Error("Export document unavailable");
      doc.open();
      doc.write(html);
      doc.close();
    } catch {
      fallbackCsv();
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem(METRICS_OPT_IN_KEY, metricsOptIn ? "yes" : "no");
      if (!metricsOptIn) {
        localStorage.removeItem(METRICS_LAST_SENT_DAY_KEY);
      }
    } catch {}
  }, [metricsOptIn]);

  useEffect(() => {
    let cancelled = false;
    const autoSend = async () => {
      if (!metricsOptIn || !metricsAuthToken) return;
      const today = new Date().toISOString().slice(0, 10);
      const alreadySentToday = (() => {
        try { return localStorage.getItem(METRICS_LAST_SENT_DAY_KEY) === today; } catch { return false; }
      })();
      if (alreadySentToday) return;
      const ok = await pushMetricsSnapshot({ source: "auto-daily", silent: true });
      if (!cancelled && ok && screen === "settings") {
        setMetricsStatusWithClear("Daily diagnostics synced.");
      }
    };
    autoSend();
    return () => { cancelled = true; };
  }, [metricsOptIn, metricsAuthToken, screen]);

  const refreshSubscriptionStatus = async () => {
    if (subscriptionStatusLoading) return;
    setSubscriptionStatusLoading(true);
    try {
      const status = await sbCheckSubscriptionStatus();
      if (!status) {
        setSubscriptionStatusWithClear("Subscription check returned no data.");
        return;
      }
      setSubscriptionLastCheckedAt(Date.now());
      const serverSubscribed = status?.is_subscribed === true;
      const lookupSource = status?.user_id ? "account" : "device";
      if (serverSubscribed) {
        try {
          localStorage.setItem("stillform_subscribed", "yes");
          clearSubscribePending();
        } catch {}
        setIsSubscribed(true);
        setSubscriptionStatusWithClear(`Active via ${lookupSource} server truth.`);
      } else {
        const pending = hasFreshSubscribePending(SUBSCRIPTION_PENDING_GRACE_MS);
        if (!pending) {
          try {
            localStorage.removeItem("stillform_subscribed");
            clearSubscribePending();
          } catch {}
          setIsSubscribed(false);
          setSubscriptionStatusWithClear(`No active subscription found for this ${lookupSource}.`);
        } else {
          setSubscriptionStatusWithClear("Checkout is pending. Waiting for webhook sync.");
        }
      }
      setSubscriptionCheckTick(n => n + 1);
    } catch {
      setSubscriptionStatusWithClear("Couldn't reach subscription server. Keeping current access.");
    } finally {
      setSubscriptionStatusLoading(false);
    }
  };

  // PWA install prompt — capture from window (set in index.html before React loads)
  useEffect(() => {
    // Check if event was already captured before React mounted
    if (window.__pwaInstallPrompt) {
      setInstallPrompt(window.__pwaInstallPrompt);
    }
    const handler = (e) => {
      setInstallPrompt(e);
      window.__pwaInstallPrompt = e;
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Detects if recent check-in tension patterns diverge from mapped signal profile
// Returns the top divergent area if 3+ check-ins in last 7 days show tension in an unmapped area
const getSignalDivergence = () => {
  try {
    const profile = JSON.parse(localStorage.getItem("stillform_signal_profile") || "null");
    const mappedAreas = (profile?.firstAreas || []).map(a => a.toLowerCase());
    if (!mappedAreas.length) return null;

    const history = JSON.parse(localStorage.getItem("stillform_checkin_history") || "[]");
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recent = history.filter(c => new Date(c.timestamp || c.date).getTime() > sevenDaysAgo);
    if (recent.length < 3) return null;

    const areaCounts = {};
    recent.forEach(c => {
      if (!c.tension) return;
      Object.entries(c.tension).forEach(([area, level]) => {
        if (level > 0) {
          const normalized = area.toLowerCase();
          areaCounts[normalized] = (areaCounts[normalized] || 0) + 1;
        }
      });
    });

    // Find areas with tension in 3+ check-ins that aren't in mapped profile
    const divergent = Object.entries(areaCounts)
      .filter(([area, count]) => count >= 3 && !mappedAreas.includes(area))
      .sort((a, b) => b[1] - a[1]);

    return divergent.length > 0 ? divergent[0][0] : null;
  } catch { return null; }
};

const isSignalProfileConfigured = () => {
    try {
      const profile = JSON.parse(localStorage.getItem("stillform_signal_profile") || "null");
      return Array.isArray(profile?.firstAreas) && profile.firstAreas.length > 0;
    } catch {
      return false;
    }
  };

  // ─── OBSERVE ENTRY ROUTING ──────────────────────────────────────────────────
  // App-level routing function for ObserveEntryLite shell
  // Called after user answers "what fired first?" + "what do you need?"
  const routeObserveEntry = (signalOrigin, needState) => {
    setShowObserveEntry(false);
    const bioFilter = (() => { try { return localStorage.getItem("stillform_bio_filter") || ""; } catch { return ""; } })();
    const offBaseline = bioFilter.includes("activated") || bioFilter.includes("depleted") || bioFilter.includes("pain") || bioFilter.includes("sleep") || bioFilter.includes("medicated") || bioFilter.includes("off-baseline") || bioFilter.includes("something");

    const goMetacognition = () => {
      setScreen("tool");
      setActiveTool({ ...TOOLS.find(t => t.id === "metacognition") });
    };
    const goReframe = () => {
      setScreen("tool");
      setActiveTool({ ...TOOLS.find(t => t.id === "reframe"), mode: "calm" });
    };
    const goScan = () => {
      setScreen("tool");
      setActiveTool({ ...TOOLS.find(t => t.id === "scan") });
    };

    // Priority 1 — off-baseline + body signal → Body Scan
    if (offBaseline && (signalOrigin === "body" || signalOrigin === "both" || signalOrigin === "unsure") && needState !== "understand") {
      goScan(); return;
    }

    if (needState === "settle") { startPathway("calm"); return; }

    if (needState === "understand") {
      if (signalOrigin === "body") { offBaseline ? goScan() : startPathway("calm"); return; }
      if (signalOrigin === "thought") { goReframe(); return; }
      if (signalOrigin === "both") { goMetacognition(); return; }
      // unsure — use regType as tie-break
      if (regType === "thought-first") { goReframe(); return; }
      if (regType === "body-first") { goScan(); return; }
      goMetacognition(); return;
    }

    if (needState === "catch") { goMetacognition(); return; }

    // fallback
    startPathway("calm");
  };

  const beginCalibrationFlow = ({ bridgeOrigin = null } = {}) => {
    // Route to calibration assessment, not home
    if (bridgeOrigin !== null) {
      const resolvedOrigin = resolveSetupBridgeOrigin(bridgeOrigin);
      setSetupBridgeOrigin(resolvedOrigin);
      if (!isFirstRunComplete()) {
        setFirstRunStage("calibration");
      }
    }
    setupAutoLaunchStepRef.current = null;
    setSetupStep(0);
    setAssessmentAnswers([]);
    setScreen("setup");
  };

  const finalizeOnboarding = () => {
    try { localStorage.setItem("stillform_onboarded", "yes"); } catch {}
    setFirstRunStage(null);
    // Ensure regType is always set before going to home — default balanced if user skipped assessment
    try {
      if (!localStorage.getItem("stillform_regulation_type")) {
        localStorage.setItem("stillform_regulation_type", "balanced");
        setRegType("balanced");
      }
    } catch {}
    try { if (!localStorage.getItem("stillform_trial_start")) localStorage.setItem("stillform_trial_start", new Date().toISOString()); } catch {}
    try { window.plausible("Onboarding Complete"); } catch {}
  };

  // Scroll to top on every screen change + analytics
  useEffect(() => {
    window.scrollTo(0, 0);
    if (screen !== "home" && screen !== "setup-bridge") {
      try { window.plausible("Screen View", { props: { screen } }); } catch {}
    }
  }, [screen]);
  const startTool = (tool) => {
    try { window.plausible("Tool Started", { props: { tool: tool?.id || "unknown" } }); } catch {}
    setActiveTool(tool);
    setScreen("tool");
  };
  const handleActiveToolBack = () => {
    // Check if an active tool has registered a sub-state back handler
    if (toolBackOverrideRef.current) {
      toolBackOverrideRef.current();
      toolBackOverrideRef.current = null;
      return;
    }
    if (activeTool?.returnTo) {
      const returnScreen = activeTool.returnTo;
      setActiveTool(null);
      setScreen(returnScreen);
      return;
    }
    if (activeTool?.setupFlow === "calibration-combined") {
      const currentToolId = activeTool?.id;
      setActiveTool(null);
      if (currentToolId === "signals") {
        setScreen("setup-bridge");
        return;
      }
      if (currentToolId === "bias") {
        setScreen("setup");
        return;
      }
    }
    goHomeSafely();
  };

  const startPathway = async (p) => {
    try { window.plausible("Session Initiated", { props: { pathway: p } }); } catch {}
    setPathway(p);
    if (p === "calm") {
      startTool(TOOLS.find(t => t.id === "breathe"));
    } else if (p === "hype") {
      setActiveTool({ ...TOOLS.find(t => t.id === "reframe"), mode: "hype" });
      setScreen("tool");
    } else if (p === "clarity") {
      setActiveTool({ ...TOOLS.find(t => t.id === "reframe"), mode: "clarity" });
      setScreen("tool");
    } else {
      startTool(TOOLS.find(t => t.id === "breathe"));
    }
  };

  const launchScenarioProtocol = async (protocolId) => {
    const launched = await launchScenarioProtocolById({
      protocolId,
      setPathway,
      setActiveTool,
      setScreen,

    });
    if (!launched) {
      // Fail safe: if routing config drifts, default to calm reframe so users are never blocked.
      setPathway("calm");
      setActiveTool({ ...TOOLS.find(t => t.id === "reframe"), mode: "calm" });
      setScreen("tool");
      try { window.plausible("Scenario Protocol Fallback", { props: { protocol: String(protocolId || "unknown") } }); } catch {}
      return;
    }
    try { window.plausible("Scenario Protocol Launched", { props: { protocol: String(protocolId || "unknown") } }); } catch {}
  };

  const renderTool = () => {
    const props = { onComplete: (redirectTo) => {
      if (redirectTo) {
        if (redirectTo === "crisis") { setScreen("crisis"); return; }
        if (redirectTo === "eod-close") {
          setEodSaved(false);
          setEodPromptDismissed(false);
          setEodOpen(true);
          goHomeSafely();
          return;
        }
        if (redirectTo === "reframe") {
          setActiveTool({ ...TOOLS.find(t => t.id === "reframe"), mode: "calm" });
          setScreen("tool");
          return;
        }
        if (redirectTo === "reframe-calm" || redirectTo === "reframe-clarity" || redirectTo === "reframe-hype") {
          const mode = redirectTo.split("-")[1];
          setActiveTool({ ...TOOLS.find(t => t.id === "reframe"), mode });
          setScreen("tool");
          return;
        }
        const tool = TOOLS.find(t => t.id === redirectTo);
        if (tool) { startTool(tool); return; }
      }
      if (!redirectTo && activeTool?.setupFlow === "calibration-combined") {
        if (activeTool?.id === "signals") {
          setActiveTool({ ...TOOLS.find(t => t.id === "bias"), setupFlow: "calibration-combined" });
          setScreen("tool");
          return;
        }
        if (activeTool?.id === "bias") {
          finalizeOnboarding();
          goHomeSafely();
          return;
        }
      }
      if (activeTool?.returnTo === "setup-bridge") {
        // Always return to setup bridge regardless of redirectTo — calibration not done yet
        setActiveTool(null);
        setScreen("setup-bridge");
        return;
      }
      if (!redirectTo && activeTool?.returnTo) {
        const returnScreen = activeTool.returnTo;
        setActiveTool(null);
        setScreen(returnScreen);
        return;
      }
      goHomeSafely();
    }};
    switch (activeTool?.id) {
      case "breathe": return <BreatheGroundTool {...props} pathway={pathway} quickStart={activeTool?.quickStart} />;
      case "sigh": return <PhysiologicalSighTool {...props} />;
      case "scan": return <BodyScanTool {...props} />;
      case "reframe": return <ReframeTool {...props} mode={activeTool?.mode || (pathway === "clarity" ? "clarity" : pathway === "hype" ? "hype" : "calm")} defaultTab={activeTool?.defaultTab || "talk"} sharedText={sharedText} onSharedTextConsumed={() => setSharedText(null)} toolBackOverrideRef={toolBackOverrideRef} />;
      case "signals": return <SignalMapTool {...props} skipIntro={activeTool?.returnTo === "setup-bridge"} />;

      case "bias": return <MicroBiasTool {...props} />;
      case "metacognition": return (
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "48px 24px" }}>
          <MetacognitionTool onComplete={(redirectTo) => {
            if (redirectTo === "breathe") { setScreen("tool"); setActiveTool({ ...TOOLS.find(t => t.id === "breathe") }); }
            else if (redirectTo === "scan") { setScreen("tool"); setActiveTool({ ...TOOLS.find(t => t.id === "scan") }); }
            else if (redirectTo === "reframe" || redirectTo === "reframe-calm") { setScreen("tool"); setActiveTool({ ...TOOLS.find(t => t.id === "reframe"), mode: "calm" }); }
            else if (redirectTo === "reframe-clarity") { setScreen("tool"); setActiveTool({ ...TOOLS.find(t => t.id === "reframe"), mode: "clarity" }); }
            else if (redirectTo === "reframe-hype") { setScreen("tool"); setActiveTool({ ...TOOLS.find(t => t.id === "reframe"), mode: "hype" }); }
            else { goHomeSafely(); }
          }} />
        </div>
      );
      default:
        // Safety net — unknown tool or activeTool not yet flushed, go home
        if (activeTool?.id) {
          goHomeSafely(true);
        }
        return null;
    }
  };

  return (
    <ErrorBoundary>
    <>
      <style>{styles}</style>
      <div className={appClasses}>
        {/* INFO MODAL */}
      {infoModal && (
        <div onClick={() => setInfoModal(null)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 9999,
          display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "0 16px 48px"
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "var(--bg2, #111)", border: "0.5px solid var(--border)",
            borderRadius: "var(--r-lg)", padding: "28px 20px", maxWidth: 440, width: "100%"
          }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 14 }}>
              {infoModal.title}
            </div>
            <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif" }}>
              {infoModal.body}
            </div>
            <button onClick={() => setInfoModal(null)} style={{
              marginTop: 24, background: "none", border: "0.5px solid var(--border)",
              borderRadius: "var(--r)", padding: "8px 24px", fontSize: 12,
              color: "var(--text-muted)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
            }}>
              Got it
            </button>
          </div>
        </div>
      )}

      {/* SPLASH OVERLAY — fades out, never blocks hooks */}
        {(!splashDone || !screenReady || (biometric.isEnabled() && !biometricCleared)) && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            background: "#0e0f11", transition: "opacity 0.4s ease-out"
          }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300,
              color: "var(--amber)", letterSpacing: "0.04em", marginBottom: 8,
              opacity: 0, animation: "splashIn 1.2s ease-out 0.3s forwards"
            }}>Stillform</div>
            <div style={{
              fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase",
              opacity: 0, animation: "splashIn 1.2s ease-out 0.8s forwards"
            }}>Composure architecture</div>
            <style>{`@keyframes splashIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
          </div>
        )}
        {/* NAV — hidden during setup bridge */}
        {screen !== "setup-bridge" && (
        <nav className="nav">
          <div
            className="nav-logo"
            style={{ cursor: screen === "home" ? "default" : "pointer", opacity: screen === "home" ? 0.7 : 1 }}
            onClick={() => { if (screen !== "home") goHomeSafely(); }}
          >
            Still<span>form</span>
          </div>
          <div className="nav-actions">
            <button onClick={() => openFaq("home")} style={{
              background: "none", width: 32, height: 32, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-muted)", fontSize: 14, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              border: "0.5px solid var(--border)", transition: "all 0.2s"
            }}>?</button>
            <button className="btn btn-ghost" onClick={() => setScreen("settings")} style={{ padding: "8px 14px" }}>
              ⚙
            </button>
            {syncSignedIn && isSubscribed ? (
              <button className="btn btn-ghost" onClick={() => setScreen("settings")} style={{ padding: "8px 14px", fontSize: 13 }}>
                Account
              </button>
            ) : syncSignedIn ? (
              <button className="btn btn-primary" onClick={() => setScreen("pricing")}>
                Subscribe
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => { setScreen("pricing"); setPricingAuthOpen(true); }}>
                Log In / Sign Up
              </button>
            )}
          </div>
        </nav>
        )}

        {/* TUTORIAL — guided quickstart */}
        {screen === "tutorial" && (() => {
          const tutorialPages = [
            {
              kicker: "Opening page",
              title: "Stillform",
              openingLines: [
                "Most people don't catch themselves until after the moment has passed. After the text they shouldn't have sent. After the decision they regret. After the reaction that cost them.",
                "Stillform trains you to catch it earlier — before your state drives the outcome. That's composure. And it's a skill that builds.",
                "Stillform. Composure Architecture."
              ]
            },
            {
              kicker: "Tutorial · 1 of 4",
              title: "This Setup Is For You",
              paragraphs: [
                "Before anything else works, the system needs to know how you work. This is a one-time calibration — takes about 3 minutes.",
                "After this, every tool, every AI response, and every recommendation is built around you specifically. Not a generic user. You.",
                "The more honestly you answer, the more accurately the system reads your signals. This is not a quiz. There are no wrong answers."
              ]
            },
            {
              kicker: "Tutorial · 2 of 4",
              title: "Composure Check — Time to First Value",
              focusCheckTTFV: true,
              paragraphs: [
                "Run a 30-second Go/No-Go check first. It gives you immediate signal on attention stability, inhibition control, and response tempo.",
                "Not a diagnosis. A fast read on how your system is running today."
              ]
            },
            {
              kicker: "Tutorial · 3 of 4",
              title: "One Practice. Three Moments.",
              paragraphs: [
                "Morning Check-in in the morning — before the day sets it for you. Observe and Choose through the day — catch the state before it drives the action. Close the loop in the evening — consolidate what you learned about your system.",
                "Breathe, Body Scan, and Reframe are supports. The system routes you to the right one. You don't have to choose."
              ]
            },
            {
              kicker: "Tutorial · 4 of 4",
              title: "The Skill Builds Over Time",
              paragraphs: [
                "First-time setup: How You Process → Signal Profile → Pattern Check. One time. The system learns you.",
                "Every day after: Morning Check-in → Observe and Choose → Close the loop. The less you need the app, the more it's working."
              ],
              footer: "If you want to know more about the app, please go to our FAQ page."
            }
          ];

          const safeStep = Math.max(0, Math.min(tutorialStep, tutorialPages.length - 1));
          const page = tutorialPages[safeStep];
          const isLastStep = safeStep === tutorialPages.length - 1;
          const returnTo = resolveTutorialReturnScreen(tutorialReturnScreen);
          return (
            <section
              style={{
                maxWidth: 520, margin: "0 auto", padding: "40px 24px 80px",
                minHeight: "100vh", position: "relative", zIndex: 1
              }}
            >
              <button
                className="intervention-back"
                onClick={() => {
                  if (safeStep > 0) {
                    setTutorialStep((s) => Math.max(0, s - 1));
                    return;
                  }
                  setScreen(returnTo);
                }}
              >
                ← Back
              </button>
              <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 8 }}>
                {page.kicker}
              </div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 300, lineHeight: 1.15, marginBottom: 14 }}>
                {page.title}
              </h1>
              {Array.isArray(page.openingLines) && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                  {page.openingLines.map((line, idx) => (
                    <p key={`${line}-${idx}`} style={{ fontSize: 14, color: idx === page.openingLines.length - 1 ? "var(--amber)" : "var(--text-dim)", lineHeight: 1.8, margin: 0, fontStyle: idx === page.openingLines.length - 1 ? "italic" : "normal" }}>
                      {line}
                    </p>
                  ))}
                </div>
              )}
              {page.subtitle && (
                <p style={{ fontSize: 14, color: "var(--text-dim)", marginBottom: 16, lineHeight: 1.7 }}>
                  {page.subtitle}
                </p>
              )}
              {Array.isArray(page.paragraphs) && page.paragraphs.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                  {page.paragraphs.map((line, idx) => (
                    <p key={`${page.title}-paragraph-${idx}`} style={{ fontSize: 14, color: "var(--text-dim)", lineHeight: 1.7, margin: 0 }}>
                      {line}
                    </p>
                  ))}
                </div>
              )}
              {page.focusCheckTTFV && (
                <div style={{ marginBottom: 18 }}>
                  {!tutorialFocusBrief ? (
                    <FocusCheckValidation
                      hideBack
                      autoStart
                      compact
                      onCompleteRun={(entry) => {
                        setTutorialFocusBrief(entry);
                      }}
                      autoReturnToCaller
                    />
                  ) : (
                    <div style={{ background: "var(--surface)", border: "0.5px solid var(--amber-dim)", borderRadius: "var(--r)", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)" }}>
                        Post-Check Briefing
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
                        <div>
                          <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Accuracy</div>
                          <div style={{ fontSize: 14, color: "var(--amber)", marginTop: 2 }}>{tutorialFocusBrief.accuracy ?? "N/A"}%</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Inhibition</div>
                          <div style={{ fontSize: 14, color: "var(--amber)", marginTop: 2 }}>{tutorialFocusBrief.inhibition ?? "N/A"}%</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Avg RT</div>
                          <div style={{ fontSize: 14, color: "var(--amber)", marginTop: 2 }}>{tutorialFocusBrief.avgReactionMs ? `${tutorialFocusBrief.avgReactionMs}ms` : "N/A"}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.6 }}>
                        Accuracy reflects attentional consistency. Inhibition reflects response control under conflict. Avg RT reflects processing tempo under speed demand.
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.6 }}>
                        This is your baseline performance signature for today. Stillform uses this with signal mapping and check-ins to adapt routing and track transfer over time.
                      </div>
                    </div>
                  )}
                </div>
              )}
              {page.footer && (
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 18, lineHeight: 1.6 }}>
                  {page.footer}
                </div>
              )}
              <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 18 }}>
                {tutorialPages.map((_, idx) => (
                  <div key={idx} style={{
                    width: idx === safeStep ? 18 : 8,
                    height: 8,
                    borderRadius: 99,
                    background: idx === safeStep ? "var(--amber)" : "var(--border)",
                    transition: "all 0.2s"
                  }} />
                ))}
              </div>
              {!isLastStep && (
                <button
                  className="btn btn-primary"
                  style={{ padding: "16px 24px", fontSize: 15, width: "100%", maxWidth: 360 }}
                  disabled={page.focusCheckTTFV && !tutorialFocusBrief}
                  onClick={() => setTutorialStep((s) => Math.min(s + 1, tutorialPages.length - 1))}
                >
                  Next →
                </button>
              )}
              {isLastStep && (
                <button
                  className="btn btn-primary"
                  style={{ padding: "16px 24px", fontSize: 15, width: "100%", maxWidth: 360 }}
                  onClick={() => {
                    if (returnTo === "settings") {
                      setScreen("settings");
                      return;
                    }
                    openSetupBridge("tutorial");
                  }}
                >
                  {returnTo === "settings" ? "Return to settings" : "Continue →"}
                </button>
              )}
            </section>
          );
        })()}

        {/* SETUP BRIDGE — between tutorial and calibration */}
        {screen === "setup-bridge" && (() => {
          const reducedMotionOn = (() => { try { return localStorage.getItem("stillform_reducedmotion") === "on"; } catch { return false; } })();
          const visualGroundingOn = (() => { try { return localStorage.getItem("stillform_visual_grounding") !== "off"; } catch { return true; } })();
          const signalMappingConfigured = isSignalProfileConfigured();
          const themeOptions = [
            { id: "dark",     label: "Dark",     bg: "#0A0A0C", accent: "#C8922A" },
            { id: "midnight", label: "Midnight",  bg: "#070b18", accent: "#7aa8ff" },
            { id: "suede",    label: "Suede",     bg: "#0f0d0b", accent: "#c9956a" },
            { id: "teal",     label: "Teal",      bg: "#030d0e", accent: "#2e7a74" },
            { id: "rose",     label: "Rose",      bg: "#0e090c", accent: "#7a3a50" },
            { id: "light",    label: "Light",     bg: "#f0f2f8", accent: "#C8922A" }
          ];

          // Page 1 — Make it yours
          if (setupBridgeStep === 0) {
            return (
              <section style={{ maxWidth: 480, margin: "0 auto", padding: "40px 24px 80px", minHeight: "100vh", position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 10 }}>Step 1 of 2</div>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 300, lineHeight: 1.12, marginBottom: 8 }}>
                  Personalization
                </h1>
                <p style={{ fontSize: 14, color: "var(--text-dim)", lineHeight: 1.7, marginBottom: 28 }}>
                  Set up how Stillform looks and feels before you start. You can always change these in Settings.
                </p>

                {/* Theme */}
                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontSize: 15, color: "var(--text)", fontWeight: 500, marginBottom: 4 }}>Theme</div>
                  <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 14, lineHeight: 1.5 }}>
                    Pick your environment. The whole app changes instantly — try them.
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                    {themeOptions.map((opt) => {
                      const active = themeChoice === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setThemeSelection(opt.id)}
                          style={{
                            background: active ? "var(--amber-glow)" : "var(--surface)",
                            border: `1.5px solid ${active ? "var(--amber)" : "var(--border)"}`,
                            borderRadius: "var(--r-lg)",
                            padding: "14px 10px 12px",
                            cursor: "pointer",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 13,
                            fontWeight: active ? 500 : 400,
                            color: active ? "var(--amber)" : "var(--text)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 8,
                            transition: "all 0.15s"
                          }}
                        >
                          <div style={{
                            width: 44, height: 28, borderRadius: 6,
                            overflow: "hidden", flexShrink: 0,
                            display: "flex",
                            border: "1px solid rgba(255,255,255,0.12)"
                          }}>
                            <div style={{ flex: 1, background: opt.bg }} />
                            <div style={{ flex: 1, background: opt.accent }} />
                          </div>
                          {opt.label}
                          {active && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--amber)", marginTop: -4 }} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* High contrast */}
                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontSize: 15, color: "var(--text)", fontWeight: 500, marginBottom: 4 }}>High contrast</div>
                  <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 14, lineHeight: 1.5 }}>
                    Strengthens text and borders. Helps with color sensitivity and low vision. Toggle and see the difference on any theme above.
                  </div>
                  <button
                    onClick={() => {
                      const next = !highContrastMode;
                      setHighContrastMode(next);
                      try { localStorage.setItem("stillform_high_contrast", next ? "on" : "off"); } catch {}
                    }}
                    style={{
                      width: "100%",
                      background: highContrastMode ? "var(--amber-glow)" : "var(--surface)",
                      border: `1.5px solid ${highContrastMode ? "var(--amber)" : "var(--border)"}`,
                      borderRadius: "var(--r-lg)",
                      padding: "14px 18px",
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      display: "flex", justifyContent: "space-between", alignItems: "center"
                    }}
                  >
                    <span style={{ fontSize: 13, color: "var(--text)" }}>
                      {highContrastMode ? "High contrast — On" : "High contrast — Off"}
                    </span>
                    <div style={{
                      width: 44, height: 24, borderRadius: 12,
                      background: highContrastMode ? "var(--amber)" : "var(--border)",
                      position: "relative", transition: "background 0.2s", flexShrink: 0
                    }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: "50%", background: "white",
                        position: "absolute", top: 3, left: highContrastMode ? 23 : 3, transition: "left 0.2s"
                      }} />
                    </div>
                  </button>
                </div>

                {/* Reduced motion */}
                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontSize: 15, color: "var(--text)", fontWeight: 500, marginBottom: 4 }}>Reduced motion</div>
                  <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 14, lineHeight: 1.5 }}>
                    Removes animations throughout the app. Text and timers only.
                  </div>
                  <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                    {/* Demo: animated vs static */}
                    <div style={{ flex: 1, background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r-lg)", padding: "16px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                      <div style={{ fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>Animations on</div>
                      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--amber)", animation: "pulse 1.2s ease-in-out infinite" }} />
                    </div>
                    <div style={{ flex: 1, background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r-lg)", padding: "16px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                      <div style={{ fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>Reduced motion</div>
                      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--text-muted)" }} />
                    </div>
                  </div>
                  <button
                    onClick={() => setDisplayPreference("stillform_reducedmotion", !reducedMotionOn)}
                    style={{
                      width: "100%",
                      background: reducedMotionOn ? "var(--amber-glow)" : "var(--surface)",
                      border: `1.5px solid ${reducedMotionOn ? "var(--amber)" : "var(--border)"}`,
                      borderRadius: "var(--r-lg)",
                      padding: "14px 18px",
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      display: "flex", justifyContent: "space-between", alignItems: "center"
                    }}
                  >
                    <span style={{ fontSize: 13, color: "var(--text)" }}>
                      {reducedMotionOn ? "Reduced motion — On" : "Reduced motion — Off"}
                    </span>
                    <div style={{
                      width: 44, height: 24, borderRadius: 12,
                      background: reducedMotionOn ? "var(--amber)" : "var(--border)",
                      position: "relative", transition: "background 0.2s", flexShrink: 0
                    }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: "50%", background: "white",
                        position: "absolute", top: 3, left: reducedMotionOn ? 23 : 3, transition: "left 0.2s"
                      }} />
                    </div>
                  </button>
                </div>

                {/* Visual grounding */}
                <div style={{ marginBottom: 32 }}>
                  <div style={{ fontSize: 15, color: "var(--text)", fontWeight: 500, marginBottom: 4 }}>Visual grounding</div>
                  <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 14, lineHeight: 1.5 }}>
                    Organic visuals behind breathing exercises. Gives your eyes an anchor while your body settles.
                  </div>
                  <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                    {/* Demo: fractal vs plain */}
                    <div style={{ flex: 1, background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r-lg)", padding: "16px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                      <div style={{ fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>Grounding on</div>
                      <svg width="40" height="40" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="18" fill="none" stroke="var(--amber)" strokeWidth="0.5" opacity="0.4" />
                        <circle cx="20" cy="20" r="12" fill="none" stroke="var(--amber)" strokeWidth="0.5" opacity="0.6" />
                        <circle cx="20" cy="20" r="6" fill="none" stroke="var(--amber)" strokeWidth="1" opacity="0.8" />
                        <circle cx="20" cy="20" r="2" fill="var(--amber)" />
                        {[0,60,120,180,240,300].map(deg => {
                          const r = deg * Math.PI / 180;
                          return <line key={deg} x1={20 + 8*Math.cos(r)} y1={20 + 8*Math.sin(r)} x2={20 + 16*Math.cos(r)} y2={20 + 16*Math.sin(r)} stroke="var(--amber)" strokeWidth="0.5" opacity="0.5" />;
                        })}
                      </svg>
                    </div>
                    <div style={{ flex: 1, background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r-lg)", padding: "16px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                      <div style={{ fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>Grounding off</div>
                      <svg width="40" height="40" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="18" fill="none" stroke="var(--border)" strokeWidth="1" />
                        <circle cx="20" cy="20" r="2" fill="var(--text-muted)" />
                      </svg>
                    </div>
                  </div>
                  <button
                    onClick={() => setDisplayPreference("stillform_visual_grounding", !visualGroundingOn)}
                    style={{
                      width: "100%",
                      background: visualGroundingOn ? "var(--amber-glow)" : "var(--surface)",
                      border: `1.5px solid ${visualGroundingOn ? "var(--amber)" : "var(--border)"}`,
                      borderRadius: "var(--r-lg)",
                      padding: "14px 18px",
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      display: "flex", justifyContent: "space-between", alignItems: "center"
                    }}
                  >
                    <span style={{ fontSize: 13, color: "var(--text)" }}>
                      {visualGroundingOn ? "Visual grounding — On" : "Visual grounding — Off"}
                    </span>
                    <div style={{
                      width: 44, height: 24, borderRadius: 12,
                      background: visualGroundingOn ? "var(--amber)" : "var(--border)",
                      position: "relative", transition: "background 0.2s", flexShrink: 0
                    }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: "50%", background: "white",
                        position: "absolute", top: 3, left: visualGroundingOn ? 23 : 3, transition: "left 0.2s"
                      }} />
                    </div>
                  </button>
                </div>

                <button
                  className="btn btn-primary"
                  style={{ padding: "16px 24px", fontSize: 15, width: "100%" }}
                  onClick={() => setSetupBridgeStep(1)}
                >
                  Next →
                </button>
              </section>
            );
          }

          // Page 2 — Map your signals
          return (
            <section style={{ maxWidth: 480, margin: "0 auto", padding: "40px 24px 80px", minHeight: "100vh", position: "relative", zIndex: 1 }}>
              <button className="intervention-back" onClick={() => setSetupBridgeStep(0)}>← Back</button>
              <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 10 }}>Step 2 of 2</div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 300, lineHeight: 1.12, marginBottom: 8 }}>
                Map your signals.
              </h1>
              <p style={{ fontSize: 14, color: "var(--text-dim)", lineHeight: 1.7, marginBottom: 28 }}>
                Where does intensity hit first in your body? Jaw, shoulders, chest, gut, hands, legs. This is how the app learns you.
              </p>
              <div style={{ background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r-lg)", padding: "20px", marginBottom: 24 }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 12 }}>
                  Signal mapping
                </div>
                <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 6, fontWeight: 500 }}>
                  {signalMappingConfigured ? "✓ Your signals are mapped." : "Takes about 60 seconds."}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 16, lineHeight: 1.6 }}>
                  {signalMappingConfigured
                    ? "The app knows where to look first. You can update this anytime in Settings."
                    : "Every session uses this to personalise your regulation tools and AI prompts. The more accurate, the faster it works."}
                </div>
                <button
                  className="btn btn-primary"
                  style={{ width: "100%", fontSize: 14 }}
                  onClick={() => startTool({ ...TOOLS.find(t => t.id === "signals"), returnTo: "setup-bridge" })}
                >
                  {signalMappingConfigured ? "Update signal mapping →" : "Map signals now →"}
                </button>
              </div>
              {signalMappingConfigured
                ? (
                  <button
                    className="btn btn-primary"
                    style={{ padding: "16px 24px", fontSize: 15, width: "100%" }}
                    onClick={() => beginCalibrationFlow({ bridgeOrigin: setupBridgeOrigin })}
                  >
                    Continue to calibration →
                  </button>
                ) : (
                  <button
                    onClick={() => { try { sessionStorage.setItem("stillform_signals_skipped_this_session", "yes"); } catch {} beginCalibrationFlow({ bridgeOrigin: setupBridgeOrigin }); }}
                    style={{ width: "100%", background: "none", border: "none", color: "var(--text-muted)", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginTop: 8, padding: "8px 0", textDecoration: "underline" }}
                  >
                    Skip for now →
                  </button>
                )
              }
            </section>
          );
        })()}

                {/* SETUP — System Calibration */}
        {screen === "setup" && (() => {
          const signalMappingConfigured = isSignalProfileConfigured();
          const setupSteps = [
            {
              step: 1,
              label: "Calibration · 1 of 2",
              title: "How You Process",
              subtitle: "When a moment hits, what fires first — your thoughts or your body?",
              body: "Research in neuroscience shows two distinct regulation pathways. Some people process through thoughts first — analyzing, replaying, building a response. Others feel it in the body first — tension, heat, restlessness.\n\nNeither is better. Knowing yours means the system starts with the right tool.\n\nAnswer instinctively. There are no wrong answers.",
              isAssessment: true,
              scenarios: [
                {
                  q: "You're about to walk into a job interview. What do you notice first?",
                  a: { T: "My mind is racing through what I might be asked", B: "My hands are shaking and my chest feels tight" }
                },
                {
                  q: "Someone you respect challenges your idea in front of the room.",
                  a: { T: "I'm already building a counter-argument in my head", B: "I feel heat in my face and tension in my shoulders" }
                },
                {
                  q: "A quiet moment. Nothing is wrong. Just you.",
                  a: { T: "My mind is reviewing the day and planning tomorrow", B: "I notice where I'm holding tension" }
                }
              ]
            },
            {
              step: 2,
              label: "Calibration · 2 of 2",
              title: "Signal Profile + Pattern Check",
              subtitle: signalMappingConfigured
                ? "Signal mapping already configured. Continue to Pattern Check baseline."
                : "Map body signals, then set a baseline for recurring interpretation patterns.",
              body: null,
              cta: null,
              autoLaunch: () => {
                const skippedSignals = (() => { try { return sessionStorage.getItem("stillform_signals_skipped_this_session") === "yes"; } catch { return false; } })();
                const firstToolId = (signalMappingConfigured || skippedSignals) ? "bias" : "signals";
                setScreen("tool");
                startTool({ ...TOOLS.find(t => t.id === firstToolId), setupFlow: "calibration-combined" });
              }
            }
          ];

          const current = setupSteps[setupStep];
          const isLast = setupStep === setupSteps.length - 1;
          if (current?.autoLaunch) {
            if (setupAutoLaunchStepRef.current !== setupStep) {
              setupAutoLaunchStepRef.current = setupStep;
              setTimeout(() => { current.autoLaunch(); }, 0);
            }
            return null;
          }

          // Assessment state (uses component-level assessmentAnswers)
          const currentScenario = current.isAssessment ? (current.scenarios[assessmentAnswers.length] || null) : null;
          const assessmentComplete = current.isAssessment && assessmentAnswers.length >= current.scenarios.length;

          // Score assessment
          const scoreAssessment = () => {
            const tCount = assessmentAnswers.filter(a => a === "T").length;
            const bCount = assessmentAnswers.filter(a => a === "B").length;
            if (tCount > bCount) return "thought-first";
            if (bCount > tCount) return "body-first";
            return "balanced";
          };

          const typeLabels = {
            "thought-first": { name: "Thought-first", desc: "You tend to process through your mind first. Reframe will be your primary tool." },
            "body-first": { name: "Body-first", desc: "You tend to feel it in the body first. Breathe will be your primary tool." },
            "balanced": { name: "Balanced", desc: "You process through both equally. We'll start with both available and learn which you reach for." }
          };

          return (
            <section style={{ maxWidth: 480, margin: "0 auto", padding: "40px 24px 80px", position: "relative", zIndex: 1 }}>
              <button className="intervention-back" onClick={handleScreenBack}>← Back</button>

              {/* System calibration header */}
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 16 }}>
                ◎ SYSTEM CALIBRATION
              </div>

              {/* Progress */}
              <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
                {setupSteps.map((_, i) => (
                  <div key={i} style={{
                    height: 2, flex: 1, borderRadius: 1,
                    background: i <= setupStep ? "var(--amber)" : "var(--border)",
                    transition: "background 0.3s"
                  }} />
                ))}
              </div>

              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 12 }}>
                {current.label}
              </div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, marginBottom: 8, lineHeight: 1.15 }}>
                {current.title}
              </h1>
              <div style={{ fontSize: 14, color: "var(--text-dim)", fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif", marginBottom: 28 }}>
                {current.subtitle}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.8, marginBottom: 36 }}>
                {current.body && current.body.split("\n\n").map((para, i) => (
                  <p key={i} style={{ marginBottom: 12 }}>{para}</p>
                ))}
              </div>

              {/* Assessment scenarios */}
              {current.isAssessment && !assessmentComplete && currentScenario && (
                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 12 }}>
                    Scenario {assessmentAnswers.length + 1} of {current.scenarios.length}
                  </div>
                  <div style={{ color: "var(--text)", lineHeight: 1.6, marginBottom: 20, fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif", fontSize: 17 }}>
                    {currentScenario.q}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <button onClick={() => setAssessmentAnswers(prev => [...prev, "T"])} style={{
                      width: "100%", background: "var(--surface)", border: "0.5px solid var(--border)",
                      borderRadius: "var(--r)", padding: "16px 18px", cursor: "pointer", textAlign: "left",
                      fontSize: 13, color: "var(--text-dim)", lineHeight: 1.5,
                      fontFamily: "'DM Sans', sans-serif", WebkitTapHighlightColor: "transparent"
                    }}>
                      {currentScenario.a.T}
                    </button>
                    <button onClick={() => setAssessmentAnswers(prev => [...prev, "B"])} style={{
                      width: "100%", background: "var(--surface)", border: "0.5px solid var(--border)",
                      borderRadius: "var(--r)", padding: "16px 18px", cursor: "pointer", textAlign: "left",
                      fontSize: 13, color: "var(--text-dim)", lineHeight: 1.5,
                      fontFamily: "'DM Sans', sans-serif", WebkitTapHighlightColor: "transparent"
                    }}>
                      {currentScenario.a.B}
                    </button>
                  </div>
                </div>
              )}

              {/* Assessment result */}
              {current.isAssessment && assessmentComplete && (
                <div style={{ marginBottom: 28 }}>
                  <div style={{ background: "var(--surface)", border: "0.5px solid var(--amber-dim)", borderRadius: "var(--r)", padding: "20px", textAlign: "center" }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 10 }}>
                      Your processing type
                    </div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: "var(--text)", marginBottom: 8 }}>
                      {typeLabels[scoreAssessment()].name}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6, marginBottom: 16 }}>
                      {typeLabels[scoreAssessment()].desc}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5, fontStyle: "italic" }}>
                      This isn't permanent. The system learns from how you actually use it and will check in after 7 sessions.
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {current.cta && (
                  <button className="btn btn-primary" style={{ padding: "16px 24px", fontSize: 15 }}
                    onClick={() => { current.action(); }}>
                    {current.cta}
                  </button>
                )}
                {/* Assessment: only show next when complete */}
                {current.isAssessment && assessmentComplete && (
                  <button className="btn btn-primary" style={{ padding: "16px 24px", fontSize: 15 }}
                    onClick={() => {
                      const type = scoreAssessment();
                      try { localStorage.setItem("stillform_regulation_type", type); } catch {}
                      try { window.plausible("Assessment Completed", { props: { type } }); } catch {}
                      setRegType(type);
                      setAssessmentAnswers([]);
                      setSetupStep(s => s + 1);
                    }}>
                    Continue →
                  </button>
                )}
                {/* Assessment: skip option */}
                {current.isAssessment && !assessmentComplete && (
                  <button onClick={() => {
                    try { localStorage.setItem("stillform_regulation_type", "balanced"); } catch {}
                    setRegType("balanced");
                    setAssessmentAnswers([]);
                    setSetupStep(s => s + 1);
                  }} style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.14em",
                    textTransform: "uppercase", color: "var(--text-muted)", padding: "8px 0"
                  }}>
                    Help me figure it out →
                  </button>
                )}
                {/* Non-assessment steps */}
                {!current.isAssessment && (
                  <button onClick={() => {
                    if (isLast) {
                      finalizeOnboarding();
                      goHomeSafely();
                    } else {
                      setSetupStep(s => s + 1);
                    }
                  }} style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.14em",
                    textTransform: "uppercase", color: "var(--text-muted)", padding: "8px 0"
                  }}>
                    {isLast ? "Calibration complete → Enter system" : "Skip this step →"}
                  </button>
                )}
              </div>
            </section>
          );
        })()}

        {showBottomBack && (
          <button
            onClick={handleScreenBack}
            style={{
              position: "fixed",
              left: "50%",
              transform: "translateX(-50%)",
              bottom: 14,
              zIndex: 210,
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: 999,
              padding: "9px 14px",
              color: "var(--text)",
              fontSize: 12,
              letterSpacing: "0.06em",
              fontFamily: "'DM Sans', sans-serif",
              cursor: "pointer",
              boxShadow: "0 6px 16px rgba(0,0,0,0.35)"
            }}
          >
            ← Back
          </button>
        )}

        {/* FLOATING RESET — accessible from any screen except active tool sessions */}
        {screen !== "home" && screen !== "panic" && screen !== "setup-bridge" && screen !== "pricing" && 
         !(screen === "tool" && (activeTool?.id === "breathe" || activeTool?.id === "sigh")) && (
          <QBPill onPress={() => setScreen("panic")} />
        )}

        {/* PANIC MODE — zero decisions, auto-start breathing */}
        {screen === "panic" && (
          <PanicMode onComplete={(redirectTo) => {
            if (redirectTo) {
              if (redirectTo === "crisis") { setScreen("crisis"); return; }
              if (redirectTo === "reframe" || redirectTo === "reframe-calm") {
                const tool = { ...TOOLS.find(t => t.id === "reframe"), mode: "calm" };
                setActiveTool(tool);
                setScreen("tool");
                return;
              }
              if (redirectTo === "reframe-clarity" || redirectTo === "reframe-hype") {
                const mode = redirectTo.split("-")[1];
                const tool = { ...TOOLS.find(t => t.id === "reframe"), mode };
                setActiveTool(tool);
                setScreen("tool");
                return;
              }
              const tool = TOOLS.find(t => t.id === redirectTo);
              if (tool) { startTool(tool); return; }
            }
            goHomeSafely();
          }} />
        )}

        {/* HOME — different for first-time vs returning users */}
        {screen === "home" && (() => {
          const sessionCount = getSessionCountFromStorage();

          // regType guaranteed by startup routing — this is a safety net only
          if (!regType) return null;

                    const isThoughtFirst = regType === "thought-first";
          const isBodyFirst = regType === "body-first";

          /* ── RETURNING USER: clean, one dominant action ── */
          // Calculate milestones
          const sessions = getSessionsFromStorage();
          const lastSession = sessions.length > 0 ? new Date(sessions[sessions.length - 1].timestamp) : null;
          const daysSinceLastSession = lastSession ? Math.floor((Date.now() - lastSession.getTime()) / (1000 * 60 * 60 * 24)) : 0;
          const milestone7 = sessionCount === 7 && !milestone7Seen;
          const isAbsent = daysSinceLastSession >= 14 && sessionCount > 0;

          // Check 7-day streak
          let hasStreak = false;
          if (sessions.length >= 7) {
            const last7 = sessions.slice(-7);
            const days = last7.map(s => new Date(s.timestamp).toDateString());
            const uniqueDays = [...new Set(days)];
            if (uniqueDays.length >= 7) {
              const sorted = uniqueDays.map(d => new Date(d).getTime()).sort((a, b) => a - b);
              const span = (sorted[sorted.length - 1] - sorted[0]) / (1000 * 60 * 60 * 24);
              hasStreak = span <= 8;
            }
          }

          const { todayIso, activeLoopNudge, showLoopNudge, isSoftTone, adaptiveDropoffThreshold, adaptiveMinOpens, sensitivityLabel } = getLoopNudgeSnapshot();
          const dismissLoopNudge = () => {
            if (!activeLoopNudge) return;
            const previousDismissDate = loopNudgeDismissedDay ? new Date(`${loopNudgeDismissedDay}T00:00:00`) : null;
            const todayDate = new Date(`${todayIso}T00:00:00`);
            const dayDiff = previousDismissDate
              ? Math.round((todayDate.getTime() - previousDismissDate.getTime()) / (1000 * 60 * 60 * 24))
              : null;
            const nextDismissStreak = dayDiff === 0
              ? Math.max(1, loopNudgeDismissStreak)
              : (dayDiff === 1 ? loopNudgeDismissStreak + 1 : 1);
            try { localStorage.setItem(LOOP_NUDGE_DISMISSED_DAY_KEY, todayIso); } catch {}
            try { localStorage.setItem(LOOP_NUDGE_DISMISS_STREAK_KEY, String(nextDismissStreak)); } catch {}
            setLoopNudgeDismissedDay(todayIso);
            setLoopNudgeDismissStreak(nextDismissStreak);
            const tracked = appendLoopNudgeEvent({
              event: "dismissed",
              type: activeLoopNudge.id,
              date: todayIso,
              timestamp: new Date().toISOString(),
              dropoffPct: activeLoopNudge.dropoffPct,
              opens14d: activeLoopNudge.opens,
              dropoffCount: activeLoopNudge.dropoffCount,
              dismissStreak: nextDismissStreak,
              adaptiveDropoffThreshold,
              adaptiveMinOpens,
              sensitivityLabel
            });
            if (tracked) {
              trackLoopNudgeTelemetry("Loop Nudge Dismissed", {
                type: activeLoopNudge.id,
                dropoff_pct: activeLoopNudge.dropoffPct,
                opens_14d: activeLoopNudge.opens,
                dismiss_streak: nextDismissStreak,
                adaptive_dropoff_threshold: adaptiveDropoffThreshold,
                adaptive_min_opens: adaptiveMinOpens,
                sensitivity: sensitivityLabel.toLowerCase()
              });
            }
          };
          const handleLoopNudgeAction = () => {
            if (!activeLoopNudge) return;
            const tracked = appendLoopNudgeEvent({
              event: "actioned",
              type: activeLoopNudge.id,
              date: todayIso,
              timestamp: new Date().toISOString(),
              dropoffPct: activeLoopNudge.dropoffPct,
              opens14d: activeLoopNudge.opens,
              dropoffCount: activeLoopNudge.dropoffCount,
              adaptiveDropoffThreshold,
              adaptiveMinOpens,
              sensitivityLabel
            });
            if (tracked) {
              trackLoopNudgeTelemetry("Loop Nudge Actioned", {
                type: activeLoopNudge.id,
                dropoff_pct: activeLoopNudge.dropoffPct,
                opens_14d: activeLoopNudge.opens,
                adaptive_dropoff_threshold: adaptiveDropoffThreshold,
                adaptive_min_opens: adaptiveMinOpens,
                sensitivity: sensitivityLabel.toLowerCase()
              });
            }
            try { localStorage.setItem(LOOP_NUDGE_DISMISS_STREAK_KEY, "0"); } catch {}
            setLoopNudgeDismissStreak(0);
            if (activeLoopNudge.id === "morning") {
              try {
                trackMorningStart({
                  date: todayIso,
                  timestamp: new Date().toISOString(),
                  source: "nudge"
                });
              } catch {}
              setCiSaved(false);
              setCiOpen(true);
              return;
            }
            try {
              trackEodStart({
                date: todayIso,
                timestamp: new Date().toISOString(),
                source: "nudge"
              });
            } catch {}
            setEodSaved(false);
            setEodOpen(true);
            setEodPromptDismissed(false);
          };

          return (
            <section style={{ maxWidth: 420, margin: "0 auto", padding: "40px 24px 80px", position: "relative", zIndex: 1 }}>

              {/* ── 1. MORNING STRIP ─────────────────────────────────────────── */}
              {(() => {
                const _ms_now = new Date();
                const _ms_mins = _ms_now.getHours() * 60 + _ms_now.getMinutes();
                const _ms_start = (() => { try { const v = localStorage.getItem("stillform_morning_start"); return v ? parseInt(v) : 270; } catch { return 270; } })();
                const _ms_end = 1050;
                if (_ms_mins < _ms_start || _ms_mins >= _ms_end) return null;
                const _ms_today = new Date().toISOString().slice(0, 10);
                const _ms_done = (() => { try { const ci = JSON.parse(localStorage.getItem("stillform_checkin_today") || "null"); return ci?.date === _ms_today; } catch { return false; } })();
                if (ciOpen) return null;
                return (
                  <div onClick={() => setCiOpen(true)} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "12px 16px", marginBottom: 12,
                    background: "var(--surface)", border: "0.5px solid var(--border)",
                    borderRadius: "var(--r)", cursor: "pointer", WebkitTapHighlightColor: "transparent"
                  }}>
                    <div>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 3 }}>
                        Morning Check-in
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
                        {_ms_done ? "✓ Done · tap to update" : "What might drive you today if you don't notice it early?"}
                      </div>
                    </div>
                    <span style={{ color: "var(--text-muted)", fontSize: 14 }}>↓</span>
                  </div>
                );
              })()}

              {/* MORNING CHECK-IN FULL FLOW — existing logic, only when ciOpen */}
              {(() => {
                const now = new Date();
                const hour = now.getHours();
                const minute = now.getMinutes();
                const currentMinutes = hour * 60 + minute;
                const morningStart = (() => { try { const v = localStorage.getItem("stillform_morning_start"); return v ? parseInt(v) : 270; } catch { return 270; } })();
                const eveningStart = (() => { try { const v = localStorage.getItem("stillform_evening_start"); return v ? parseInt(v) : 1080; } catch { return 1080; } })();
                const morningEnd = 1050;
                if (currentMinutes < morningStart || currentMinutes >= morningEnd) return null;
                if (!ciOpen) return null;
                const today = toLocalDateKey(now);
                // EOD done suppresses morning check-in only if EOD was completed TODAY
                const eodDoneToday = (() => { try { const e = JSON.parse(localStorage.getItem("stillform_eod_today") || "null"); return e?.date === today && now.getHours() < 4; } catch { return false; } })();
                if (eodDoneToday) return null;

                const checkedIn = (() => { try { const c = JSON.parse(localStorage.getItem("stillform_checkin_today") || "null"); return c?.date === today; } catch { return false; } })();
                const isCheckedIn = ciSaved || checkedIn;

                const protocols = [
                  {
                    id: "hard-conversation",
                    title: "Hard conversation",
                    subtitle: "Objective + facts vs story + clear ask",
                    route: "Reframe · Clarity",
                    match: ["composure", "recover"]
                  },
                  {
                    id: "physiological-spike",
                    title: "Physiological spike",
                    subtitle: "Body-first reset now",
                    route: "Breathe",
                    match: ["recover", "composure"]
                  },
                  {
                    id: "winning-locked-in",
                    title: "Winning but unfocused",
                    subtitle: "Channel momentum cleanly",
                    route: "Reframe · Hype",
                    match: ["sharp"]
                  },
                  {
                    id: "after-conflict-reset",
                    title: "After conflict reset",
                    subtitle: "Drop tension from body",
                    route: "Body Scan",
                    match: ["recover", "composure"]
                  }
                ];
                const recommendedProtocol = protocols.find(p => outcomeFocus && p.match.includes(outcomeFocus.id)) || protocols[0];
                const integrationContext = resolveIntegrationContext();
                const upcomingPressure = integrationContext.upcomingPressure;

                const saveCheckin = async () => {
                  const bioArray = [...ciBio].filter(b => b !== "clear");
                  const isOffBaseline = ciBio.has("off-baseline");
                  try {
                    localStorage.setItem("stillform_checkin_today", JSON.stringify({
                      date: today, energy: ciEnergy || "steady", bio: bioArray.length > 0 ? bioArray : ["clear"],
                      tension: Object.keys(ciTension).length > 0 ? ciTension : null
                    }));
                    trackMorningComplete({
                      date: today,
                      timestamp: new Date().toISOString(),
                      energy: ciEnergy || "steady",
                      tensionAreas: Object.keys(ciTension || {}).filter((k) => ciTension[k] > 0).length
                    });
                    if (bioArray.length > 0) localStorage.setItem("stillform_bio_filter", bioArray.join(","));
                    else localStorage.setItem("stillform_bio_filter", "clear");
                    if (isOffBaseline) localStorage.setItem("stillform_off_baseline_flagged", new Date().toISOString());
                  } catch {}
                  try {
                    const tensionAreas = Object.keys(ciTension).filter(k => ciTension[k] > 0);
                    window.plausible("Morning Check-In", { props: { energy: ciEnergy || "steady", tension_areas: tensionAreas.length, upcoming_context: upcomingPressure ? "yes" : "no" } });
                  } catch {}
                  setCiSaved(true);
                  setCiOpen(false);
                  try { window.plausible("Morning Outcome Chosen", { props: { outcome: outcomeFocus?.id || "none", protocol: recommendedProtocol.id } }); } catch {}
                  await launchScenarioProtocol(recommendedProtocol.id);
                };

                if (isCheckedIn && !ciOpen) return (
                  <button onClick={() => {
                    try {
                      trackMorningStart({
                        date: today,
                        timestamp: new Date().toISOString(),
                        source: "update"
                      });
                    } catch {}
                    setCiSaved(false); setCiOpen(true); setCiTension({}); setCiEnergy(null); setCiBio(new Set()); setCiOffBaselineOpen(false);
                  }} style={{
                    width: "100%", background: "var(--surface)", border: "0.5px solid var(--amber-dim)",
                    borderRadius: "var(--r)", padding: "14px 18px", marginBottom: 20, cursor: "pointer",
                    textAlign: "left", WebkitTapHighlightColor: "transparent"
                  }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber)" }}>Morning Check-in</div>
                    <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>✓ Done · tap to update</div>
                  </button>
                );

                if (!ciOpen) return (
                  <button onClick={() => {
                    try {
                      trackMorningStart({
                        date: today,
                        timestamp: new Date().toISOString(),
                        source: "open"
                      });
                    } catch {}
                    setCiOpen(true);
                  }} style={{
                    width: "100%", background: "var(--surface)", border: "0.5px solid var(--amber-dim)",
                    borderRadius: "var(--r)", padding: "14px 18px", marginBottom: 20, cursor: "pointer",
                    textAlign: "left", WebkitTapHighlightColor: "transparent"
                  }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber)" }}>Before the day begins</div>
                    <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>What might run you today if you don't see it first?</div>
                  </button>
                );

                return (
                  <div style={{ background: "var(--surface)", border: "0.5px solid var(--amber-dim)", borderRadius: "var(--r)", padding: "18px", marginBottom: 20 }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 10 }}>Morning Check-in</div>
                    {(() => {
                      const breathCueOn = (() => { try { return localStorage.getItem("stillform_morning_breath_cue") === "on"; } catch { return false; } })();
                      if (!breathCueOn) return null;
                      return (
                        <div style={{ marginBottom: 16, padding: "12px 14px", background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r-lg)", textAlign: "center" }}>
                          <div style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Before you begin</div>
                          <div style={{ fontSize: 13, color: "var(--text-dim)", fontStyle: "italic", lineHeight: 1.7 }}>
                            Take one breath in through your nose.<br />Let it out slowly through your mouth.<br />Notice where you're starting from.
                          </div>
                        </div>
                      );
                    })()}
                    {upcomingPressure && (
                      <div style={{ fontSize: 11, color: "var(--amber)", background: "var(--amber-glow)", border: "0.5px solid var(--amber-dim)", borderRadius: "var(--r)", padding: "8px 10px", marginBottom: 14, lineHeight: 1.5 }}>
                        {upcomingPressure}
                      </div>
                    )}

                    <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 10 }}>How's your energy?</div>
                    <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                      {["Low", "Steady", "High", "Ready", "On fire", "Wired"].map(e => (
                        <button key={e} onClick={() => setCiEnergy(e.toLowerCase())} style={{
                          background: ciEnergy === e.toLowerCase() ? "var(--amber-glow)" : "transparent",
                          border: `1px solid ${ciEnergy === e.toLowerCase() ? "var(--amber-dim)" : "var(--border)"}`,
                          borderRadius: 20, padding: "5px 14px", fontSize: 12, cursor: "pointer",
                          color: ciEnergy === e.toLowerCase() ? "var(--amber)" : "var(--text-muted)",
                          fontFamily: "'DM Sans', sans-serif"
                        }}>{e}</button>
                      ))}
                    </div>

                    <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 10 }}>Hardware check</div>
                    <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                      {[
                        { id: "clear", label: "All clear" },
                        { id: "depleted", label: "Depleted" },
                        { id: "sleep", label: "Under-rested" },
                        { id: "pain", label: "Pain present" },
                        { id: "activated", label: "Activated" },
                        { id: "medicated", label: "Medicated" }
                      ].map(b => (
                        <button key={b.id} onClick={() => {
                          setCiOffBaselineOpen(false);
                          setCiBio(prev => {
                            const next = new Set(prev);
                            if (b.id === "clear") return new Set(["clear"]);
                            next.delete("clear");
                            next.delete("off-baseline");
                            if (next.has(b.id)) next.delete(b.id);
                            else next.add(b.id);
                            return next.size === 0 ? new Set(["clear"]) : next;
                          });
                        }} style={{
                          background: ciBio.has(b.id) ? "var(--amber-glow)" : "transparent",
                          border: `1px solid ${ciBio.has(b.id) ? "var(--amber-dim)" : "var(--border)"}`,
                          borderRadius: 20, padding: "5px 14px", fontSize: 11, cursor: "pointer",
                          color: ciBio.has(b.id) ? "var(--amber)" : "var(--text-muted)",
                          fontFamily: "'DM Sans', sans-serif"
                        }}>{b.label}</button>
                      ))}
                      {/* Something's off — for users who can't name it yet */}
                      <button onClick={() => {
                        setCiBio(new Set(["off-baseline"]));
                        setCiOffBaselineOpen(true);
                      }} style={{
                        background: ciBio.has("off-baseline") ? "var(--amber-glow)" : "transparent",
                        border: `1px solid ${ciBio.has("off-baseline") ? "var(--amber-dim)" : "var(--border)"}`,
                        borderRadius: 20, padding: "5px 14px", fontSize: 11, cursor: "pointer",
                        color: ciBio.has("off-baseline") ? "var(--amber)" : "var(--text-muted)",
                        fontFamily: "'DM Sans', sans-serif"
                      }}>Something's off</button>
                    </div>
                    {/* Branch: have time vs pin it */}
                    {ciOffBaselineOpen && (
                      <div style={{ marginBottom: 16, padding: "12px 14px", background: "var(--surface)", border: "0.5px solid var(--amber-dim)", borderRadius: "var(--r-lg)" }}>
                        <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 10, lineHeight: 1.5 }}>
                          Something's registering. Do you have a minute to check where?
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={async () => {
                            setCiOffBaselineOpen(false);
                            // Save check-in with off-baseline flag then route to quick tension scan
                            const bioArray = ["off-baseline"];
                            try {
                              const today = new Date().toISOString().slice(0, 10);
                              localStorage.setItem("stillform_checkin_today", JSON.stringify({
                                date: today, energy: ciEnergy || "steady", bio: bioArray,
                                tension: Object.keys(ciTension).length > 0 ? ciTension : null,
                                offBaseline: true
                              }));
                              localStorage.setItem("stillform_bio_filter", "off-baseline");
                            } catch {}
                            setCiSaved(true);
                            setCiOpen(false);
                            // Launch body scan to identify the signal
                            startTool({ ...TOOLS.find(t => t.id === "scan"), returnTo: "home" });
                          }} style={{
                            flex: 1, background: "var(--amber)", color: "#0A0A0C", border: "none",
                            borderRadius: "var(--r-lg)", padding: "10px", fontSize: 13, fontWeight: 500,
                            cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
                          }}>I have a minute →</button>
                          <button onClick={() => {
                            setCiOffBaselineOpen(false);
                            // Pin it — flag for AI, continue with check-in
                            setCiBio(new Set(["off-baseline"]));
                          }} style={{
                            flex: 1, background: "none", border: "1px solid var(--border)",
                            borderRadius: "var(--r-lg)", padding: "10px", fontSize: 13,
                            cursor: "pointer", color: "var(--text-dim)", fontFamily: "'DM Sans', sans-serif"
                          }}>Pin it for now</button>
                        </div>
                      </div>
                    )}

                    <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 10 }}>Where are you holding tension?</div>
                    <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                      {["Jaw","Shoulders","Chest","Gut","Hands","Legs"].map(area => {
                        const level = ciTension[area] || 0;
                        return (
                          <button key={area} onClick={() => setCiTension(prev => ({
                            ...prev, [area]: prev[area] === 2 ? 0 : (prev[area] || 0) + 1
                          }))} style={{
                            padding: "5px 12px", borderRadius: 20, fontSize: 11, cursor: "pointer",
                            fontFamily: "'DM Sans', sans-serif",
                            background: level === 0 ? "transparent" : level === 1 ? "rgba(201,147,42,0.15)" : "var(--amber-glow)",
                            border: `1px solid ${level === 0 ? "var(--border)" : "var(--amber-dim)"}`,
                            color: level === 0 ? "var(--text-muted)" : "var(--amber)"
                          }}>
                            {area}{level > 0 ? ` ${"·".repeat(level)}` : ""}
                          </button>
                        );
                      })}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 16, fontStyle: "italic" }}>Tap once = mild · twice = high</div>

                    <button onClick={saveCheckin} style={{
                      width: "100%", background: "var(--amber)", color: "#0A0A0C", border: "none",
                      borderRadius: "var(--r)", padding: "12px", fontSize: 14, fontWeight: 500,
                      cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
                    }}>
                      Done. Start the day. →
                    </button>
                  </div>
                );
              
              })()}


              {/* ── 2. MAIN HERO ──────────────────────────────────────────────── */}
              <div style={{ marginBottom: 32, animation: "entrain60glow 1s ease-in-out infinite", position: "relative" }}>
                  <div style={{ position: "absolute", top: 0, right: 0 }}><button onClick={() => setInfoModal({ title: "Why 60 BPM?", body: "A 1Hz ambient rhythm matching a calm resting heart rate. The nervous system entrains to rhythmic environmental stimuli without conscious effort. Regulation begins before you open a single tool." })} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 13, padding: "0 4px", lineHeight: 1 }}>ⓘ</button></div>

                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontStyle: "italic", color: "var(--text-muted)", marginBottom: 16, letterSpacing: "0.02em", animation: "entrain60 1s ease-in-out infinite" }}>
                  <span>{isBodyFirst ? "Settle the body. Then think." : isThoughtFirst ? "Think clearly. Then settle." : "Choose your entry point."}</span>
                  {isBodyFirst && <button onClick={() => setInfoModal({ title: "Why body first?", body: "Your calibration identified a body-first tendency. When activation hits, physical signals arrive before cognition can intervene. Settling the nervous system first creates the conditions for clear thinking — not the other way around." })} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 13, padding: "0 4px", lineHeight: 1 }}>ⓘ</button>}
                  {isThoughtFirst && <button onClick={() => setInfoModal({ title: "Why thought first?", body: "Your calibration identified a thought-first tendency. When activation hits, the cognitive loop fires first. Processing the thinking directly is what releases the physical tension — your body follows your mind." })} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 13, padding: "0 4px", lineHeight: 1 }}>ⓘ</button>}
                </div>

                {showObserveEntry ? (
                  /* Balanced / unclear — one orienting question inline */
                  <ObserveEntryLite
                    isBodyFirst={isBodyFirst}
                    isThoughtFirst={isThoughtFirst}
                    onClose={() => setShowObserveEntry(false)}
                    onRoute={(signalOrigin, needState) => routeObserveEntry(signalOrigin, needState)}
                  />
                ) : (
                  <>
                    {/* Hero CTA — app routes directly based on calibration */}
                    <button onClick={() => {
                      const bioFilter = (() => { try { return localStorage.getItem("stillform_bio_filter") || ""; } catch { return ""; } })();
                      const offBaseline = ["activated","depleted","pain","sleep","medicated","off-baseline","something"].some(s => bioFilter.includes(s));

                      if (isThoughtFirst) {
                        // Thought-first → straight to Reframe
                        setPathway("calm"); startTool(TOOLS.find(t => t.id === "reframe"));
                      } else if (isBodyFirst) {
                        // Body-first → Breathe, or Body Scan if off-baseline, or Reframe if stuck
                        if (feelState === "stuck") { setPathway("clarity"); startTool(TOOLS.find(t => t.id === "reframe")); }
                        else if (offBaseline) startTool(TOOLS.find(t => t.id === "scan"));
                        else startPathway("calm");
                      } else {
                        // Balanced / unclear → one orienting question
                        setShowObserveEntry(true);
                      }
                    }} style={{
                      width: "100%", background: "var(--amber)", color: "var(--btn-primary-text, #0A0A0C)", border: "none",
                      borderRadius: "var(--r)", padding: "20px 24px", fontSize: 16, fontWeight: 500,
                      cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.2)",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      WebkitTapHighlightColor: "transparent", marginBottom: 8
                    }}>
                      <div>
                        <div>{isThoughtFirst ? "Talk it out" : isBodyFirst ? "Calm my body" : "Start here"}</div>
                        <div style={{ fontSize: 12, fontWeight: 400, marginTop: 2, opacity: 0.75 }}>
                          {isThoughtFirst ? "Start with what the mind is doing." : isBodyFirst ? "Start where the pressure lands." : "Start with what's loudest."}
                        </div>

                      </div>
                      <span style={{ fontSize: 18, opacity: 0.6 }}>→</span>
                    </button>


                  </>
                )}
              </div>

              {/* SUPPORT SHEET — secondary fast-lane, discreet */}
              {showSupportSheet && (
                <div style={{
                  position: "fixed", inset: 0, zIndex: 200,
                  background: "rgba(0,0,0,0.7)", display: "flex",
                  alignItems: "flex-end", justifyContent: "center"
                }} onClick={() => setShowSupportSheet(false)}>
                  <div onClick={e => e.stopPropagation()} style={{
                    background: "var(--surface)", borderRadius: "var(--r-lg) var(--r-lg) 0 0",
                    padding: "24px 24px 40px", width: "100%", maxWidth: 480
                  }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 20 }}>
                      Direct access
                    </div>
                    {[
                      { label: "Breathe", sub: "Settle the system. 60 seconds.", action: () => { setShowSupportSheet(false); startPathway("calm"); } },
                      { label: "Reframe", sub: "Talk through what's happening.", action: () => { setShowSupportSheet(false); setPathway("calm"); startTool(TOOLS.find(t => t.id === "reframe")); } },
                      { label: "Body Scan", sub: "Find where the signal lives.", action: () => { setShowSupportSheet(false); startTool(TOOLS.find(t => t.id === "scan")); } },
                    ].map(opt => (
                      <button key={opt.label} onClick={opt.action} style={{
                        width: "100%", background: "none", border: "0.5px solid var(--border)",
                        borderRadius: "var(--r)", padding: "14px 18px", marginBottom: 8,
                        cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans', sans-serif",
                        WebkitTapHighlightColor: "transparent"
                      }}>
                        <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>{opt.label}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{opt.sub}</div>
                      </button>
                    ))}
                    <button onClick={() => setShowSupportSheet(false)} style={{
                      width: "100%", background: "none", border: "none", color: "var(--text-muted)",
                      fontSize: 12, cursor: "pointer", marginTop: 8, fontFamily: "'DM Sans', sans-serif", padding: "8px"
                    }}>Cancel</button>
                  </div>
                </div>
              )}

              {pendingNextMoveFollowUpSession && (
                <NextMoveFollowUpCard
                  session={pendingNextMoveFollowUpSession}
                  onSubmit={handleNextMoveFollowUpSubmit}
                />
              )}




              {/* ── 3. EOD STRIP ─────────────────────────────────────────────── */}
              {/* END OF DAY CHECK-IN — appears 6 PM through 4 AM only */}
              {(() => {
                const now = new Date();
                const currentMinutes = now.getHours() * 60 + now.getMinutes();
                const eveningStart = (() => { try { const v = localStorage.getItem("stillform_evening_start"); return v ? parseInt(v) : 1080; } catch { return 1080; } })(); // default 6:00 PM
                const morningCap = 240; // 4:00 AM — EOD window closes
                const inEodWindow = currentMinutes >= eveningStart || currentMinutes < morningCap;
                if (!inEodWindow) return null;
                const today = toLocalDateKey(now);
                const eodDone = (() => { try { const e = JSON.parse(localStorage.getItem("stillform_eod_today") || "null"); return e?.date === today; } catch { return false; } })();
                if (eodSaved && !eodOpen) return (
                  <button onClick={() => {
                    try {
                      trackEodStart({
                        date: today,
                        timestamp: new Date().toISOString(),
                        source: "update"
                      });
                    } catch {}
                    setEodSaved(false); setEodOpen(true); setEodPromptDismissed(false);
                  }} style={{
                    width: "100%", background: "var(--surface)", border: "0.5px solid var(--border)",
                    borderRadius: "var(--r)", padding: "14px 18px", marginBottom: 20, cursor: "pointer",
                    textAlign: "left", WebkitTapHighlightColor: "transparent"
                  }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)" }}>Close the loop</div>
                    <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>✓ Closed · tap to update</div>
                  </button>
                );
                if (eodDone && !eodOpen) return (
                  <button onClick={() => {
                    try {
                      trackEodStart({
                        date: today,
                        timestamp: new Date().toISOString(),
                        source: "update"
                      });
                    } catch {}
                    setEodOpen(true);
                  }} style={{
                    width: "100%", background: "var(--surface)", border: "0.5px solid var(--border)",
                    borderRadius: "var(--r)", padding: "14px 18px", marginBottom: 20, cursor: "pointer",
                    textAlign: "left", WebkitTapHighlightColor: "transparent"
                  }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)" }}>Close the loop</div>
                    <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>✓ Closed · tap to update</div>
                  </button>
                );

                const saveEod = () => {
                  try {
                    const morningData = JSON.parse(localStorage.getItem("stillform_checkin_today") || "null");
                    localStorage.setItem("stillform_eod_today", JSON.stringify({
                      date: today,
                      energy: eodEnergy || "same",
                      composure: eodComposure || "mostly",
                      word: eodWord || null,
                      morningEnergy: morningData?.energy || null
                    }));
                    trackEodComplete({
                      date: today,
                      timestamp: new Date().toISOString(),
                      composure: eodComposure || "mostly"
                    });
                  } catch {}
                  try { window.plausible("End of Day Check-In", { props: { composure: eodComposure || "mostly" } }); } catch {}
                  setEodSaved(true);
                  setEodPromptDismissed(false);
                  setEodOpen(false);
                };

                if (!eodOpen && !eodDone) return (
                  <button onClick={() => {
                    try {
                      trackEodStart({
                        date: today,
                        timestamp: new Date().toISOString(),
                        source: "open"
                      });
                    } catch {}
                    setEodOpen(true);
                  }} style={{
                    width: "100%", background: "var(--surface)", border: "0.5px solid var(--border)",
                    borderRadius: "var(--r)", padding: "14px 18px", marginBottom: 20, cursor: "pointer",
                    textAlign: "left", WebkitTapHighlightColor: "transparent"
                  }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)" }}>Before you close out</div>
                    <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>What did you catch today? What got past you?</div>
                  </button>
                );

                return (
                  <div style={{ background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "18px", marginBottom: 20 }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 14 }}>Close the loop</div>

                    <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 10 }}>Where's your energy landing?</div>
                    <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                      {["Full", "Steady", "Low", "Empty"].map(e => (
                        <button key={e} onClick={() => setEodEnergy(e.toLowerCase())} style={{
                          background: eodEnergy === e.toLowerCase() ? "var(--amber-glow)" : "transparent",
                          border: `1px solid ${eodEnergy === e.toLowerCase() ? "var(--amber-dim)" : "var(--border)"}`,
                          borderRadius: 20, padding: "5px 14px", fontSize: 12, cursor: "pointer",
                          color: eodEnergy === e.toLowerCase() ? "var(--amber)" : "var(--text-muted)",
                          fontFamily: "'DM Sans', sans-serif"
                        }}>{e}</button>
                      ))}
                    </div>

                    <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 10 }}>How much did you catch before it ran you?</div>
                    <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                      {["Solid", "Mixed", "Rough"].map(e => (
                        <button key={e} onClick={() => setEodComposure(e.toLowerCase())} style={{
                          background: eodComposure === e.toLowerCase() ? "var(--amber-glow)" : "transparent",
                          border: `1px solid ${eodComposure === e.toLowerCase() ? "var(--amber-dim)" : "var(--border)"}`,
                          borderRadius: 20, padding: "5px 14px", fontSize: 12, cursor: "pointer",
                          color: eodComposure === e.toLowerCase() ? "var(--amber)" : "var(--text-muted)",
                          fontFamily: "'DM Sans', sans-serif"
                        }}>{e}</button>
                      ))}
                    </div>

                    <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 10 }}>One word that names what today taught you</div>
                    <div style={{ display: "flex", gap: 5, marginBottom: 16, flexWrap: "wrap" }}>
                      {["Solid", "Heavy", "Sharp", "Scattered", "Quiet", "Grateful", "Drained", "Proud"].map(w => (
                        <button key={w} onClick={() => setEodWord(w.toLowerCase())} style={{
                          background: eodWord === w.toLowerCase() ? "var(--amber-glow)" : "transparent",
                          border: `1px solid ${eodWord === w.toLowerCase() ? "var(--amber-dim)" : "var(--border)"}`,
                          borderRadius: 20, padding: "4px 12px", fontSize: 11, cursor: "pointer",
                          color: eodWord === w.toLowerCase() ? "var(--amber)" : "var(--text-muted)",
                          fontFamily: "'DM Sans', sans-serif"
                        }}>{w}</button>
                      ))}
                    </div>

                    <button onClick={saveEod} style={{
                      width: "100%", background: "var(--amber)", color: "#0A0A0C", border: "none",
                      borderRadius: "var(--r)", padding: "12px", fontSize: 13, fontWeight: 500,
                      cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
                    }}>Close the loop →</button>
                  </div>
                );
              })()}

              


              {/* MY PROGRESS — evidence layer, secondary to shell */}
              {(() => {
                const daySet = new Set(sessions.map(s => (s.timestamp || "").slice(0, 10)).filter(Boolean));
                let streakCount = 0;
                for (let i = 0; i < 365; i++) {
                  const d = new Date();
                  d.setDate(d.getDate() - i);
                  if (daySet.has(d.toISOString().slice(0, 10))) streakCount++;
                  else break;
                }
                const toolCounts = sessions.reduce((acc, s) => {
                  (s.tools || []).forEach((id) => {
                    if (!id) return;
                    acc[id] = (acc[id] || 0) + 1;
                  });
                  return acc;
                }, {});
                const topToolEntry = Object.entries(toolCounts).sort((a, b) => b[1] - a[1])[0] || null;
                const topToolMap = {
                  breathe: "Breathe",
                  ground: "Breathe",
                  reframe: "Reframe",
                  metacognition: "Observe and Choose",
                  "body-scan": "Body Scan",
                  scan: "Body Scan",
                  panic: "Panic",
                  sigh: "Sigh"
                };
                const mostUsedLabel = topToolEntry ? (topToolMap[topToolEntry[0]] || topToolEntry[0]) : "N/A";
                // Processing cue bank removed — replaced with evidence-based data
                const showHomeProgressDetails = homeProgressPinned || homeProgressExpanded;
                const signalDivergence = getSignalDivergence();
                return (
                  <div style={{ marginBottom: 16 }}>
                    {signalDivergence && (
                      <div style={{ marginBottom: 8, padding: "10px 12px", background: "var(--amber-glow)", border: "0.5px solid var(--amber-dim)", borderRadius: "var(--r-sm)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 4 }}>
                            Signal shift detected
                          </div>
                          <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.5 }}>
                            You've been reporting {signalDivergence} tension consistently. Your signal map doesn't include it yet.
                          </div>
                        </div>
                        <button onClick={() => openSetupBridge("home")} style={{
                          background: "none", border: "1px solid var(--amber-dim)", borderRadius: "var(--r-sm)",
                          padding: "6px 10px", fontSize: 10, color: "var(--amber)", cursor: "pointer",
                          fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.08em", marginLeft: 12, flexShrink: 0
                        }}>Update →</button>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        if (homeProgressPinned) {
                          setHomeProgressExpanded(true);
                          return;
                        }
                        setHomeProgressExpanded((prev) => !prev);
                      }}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        background: "var(--surface)",
                        border: "0.5px solid var(--border)",
                        borderRadius: "var(--r)",
                        padding: "16px 18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer"
                      }}
                    >
                      <div>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 400, color: "var(--text)" }}>My Progress</div>
                        {(() => {
                          // Show one data-backed cue at rest — priority order per spec
                          try {
                            const sessions = JSON.parse(localStorage.getItem("stillform_sessions") || "[]");
                            if (!Array.isArray(sessions) || sessions.length < 3) return null;
                            // 1. Signal Awareness — autonomous exits
                            const autoExits = sessions.filter(s => s.autonomousExit).length;
                            if (autoExits > 0) return (
                              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3, fontStyle: "italic" }}>
                                {autoExits === 1 ? "1 time you caught it before it ran." : `${autoExits} times you caught it before it ran.`}
                              </div>
                            );
                            // 2. Session duration trend
                            const recent = sessions.slice(-5).filter(s => s.duration);
                            const early = sessions.slice(0, 5).filter(s => s.duration);
                            if (recent.length >= 3 && early.length >= 3) {
                              const recentAvg = recent.reduce((a, s) => a + s.duration, 0) / recent.length;
                              const earlyAvg = early.reduce((a, s) => a + s.duration, 0) / early.length;
                              if (recentAvg < earlyAvg - 0.5) return (
                                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3, fontStyle: "italic" }}>
                                  Sessions are getting shorter. The observer is faster.
                                </div>
                              );
                            }
                            return null;
                          } catch { return null; }
                        })()}

                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            setHomeProgressPinned((current) => {
                              const next = !current;
                              if (next) {
                                setHomeProgressExpanded(true);
                              } else {
                                setHomeProgressExpanded(false);
                              }
                              return next;
                            });
                          }}
                          aria-label={homeProgressPinned ? "Unpin My Progress" : "Pin My Progress"}
                          title={homeProgressPinned ? "Unpin My Progress" : "Pin My Progress"}
                          style={{
                            border: "0.5px solid var(--amber-dim)",
                            background: homeProgressPinned ? "var(--amber-glow)" : "transparent",
                            color: "var(--amber)",
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            cursor: "pointer",
                            fontSize: 14,
                            lineHeight: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 0
                          }}
                        >
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            width="14"
                            height="14"
                            style={{ display: "block" }}
                          >
                            <path
                              fill="currentColor"
                              d="M14.2 3c.9 0 1.7.8 1.7 1.7v2l2.4 2.4c.5.5.1 1.4-.6 1.4H13v5.4l1.1 3.2c.2.7-.6 1.3-1.2.8L12 18.8l-1 1.1c-.6.5-1.4-.1-1.2-.8l1.1-3.2v-5.4H6.3c-.8 0-1.2-1-.6-1.4L8.1 6.7v-2C8.1 3.8 8.8 3 9.8 3h4.4Z"
                            />
                          </svg>
                        </button>
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 18, color: "var(--amber)", lineHeight: 1, opacity: homeProgressPinned ? 0.45 : 1 }}>
                          {showHomeProgressDetails ? "−" : "+"}
                        </div>
                      </div>
                    </button>
                    {showHomeProgressDetails && (
                      <div style={{ marginTop: 8, background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: 12 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                          <div style={{ background: "var(--surface2)", border: "0.5px solid var(--border)", borderRadius: "var(--r-sm)", padding: "10px 8px", textAlign: "center" }}>
                            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: "var(--amber)", lineHeight: 1 }}>{sessionCount}</div>
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginTop: 4 }}><span>Sessions</span> <button onClick={() => setInfoModal({ title: "Sessions", body: "Total completed sessions. Each session is one rep of autonomic flexibility training — repeated practice increases the nervous system\\'s ability to shift between activation and recovery. Frequency is the leading indicator of composure development." })} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 11, padding: "0 2px", lineHeight: 1 }}>ⓘ</button></div>
                          </div>
                          <div style={{ background: "var(--surface2)", border: "0.5px solid var(--border)", borderRadius: "var(--r-sm)", padding: "10px 8px", textAlign: "center" }}>
                            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: "var(--amber)", lineHeight: 1 }}>{streakCount}</div>
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginTop: 4 }}><span>Day streak</span> <button onClick={() => setInfoModal({ title: "Day Streak", body: "Consecutive days with at least one session. Stress inoculation research shows that practicing regulation when calm builds the capacity that deploys automatically under pressure. Consistency compounds." })} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 11, padding: "0 2px", lineHeight: 1 }}>ⓘ</button></div>
                          </div>
                          <div style={{ gridColumn: "1 / -1", background: "var(--surface2)", border: "0.5px solid var(--border)", borderRadius: "var(--r-sm)", padding: "10px 8px", textAlign: "center" }}>
                            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "var(--amber)", lineHeight: 1.2 }}>{mostUsedLabel}</div>
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginTop: 4 }}><span>Most used</span> <button onClick={() => setInfoModal({ title: "Most Used", body: "The tool your system defaults to most. Over time this should align with your calibration tendency. A persistent mismatch may indicate your default routing has shifted and recalibration is worth considering." })} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 11, padding: "0 2px", lineHeight: 1 }}>ⓘ</button></div>
                          </div>

                        </div>
                        <button
                          onClick={() => setScreen("progress")}
                          style={{
                            width: "100%",
                            background: "none",
                            border: "0.5px solid var(--amber-dim)",
                            borderRadius: "var(--r-sm)",
                            color: "var(--amber)",
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: 10,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            padding: "10px 12px",
                            cursor: "pointer"
                          }}
                        >
                          Open full My Progress →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* ABSENCE DETECTION — operator tone, no guilt */}
              {isAbsent && (
                <div style={{ marginBottom: 24, padding: "16px 20px", background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r)" }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 8 }}>System idle · {daysSinceLastSession} days</div>
                  <div style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6 }}>Resuming. Anything shift in your environment since last check-in?</div>
                </div>
              )}

              {/* 7-SESSION MILESTONE — type review */}
              {milestone7 && !isAbsent && (() => {
                // Check if tool usage matches assessed processing type
                const regType = localStorage.getItem("stillform_regulation_type") || "balanced";
                const reframeSessions = sessions.filter(s => (s.tools || []).includes("reframe")).length;
                const breatheSessions = sessions.filter(s => (s.tools || []).includes("breathe") || (s.tools || []).includes("body-scan")).length;
                const totalTool = reframeSessions + breatheSessions;
                const reframeRatio = totalTool > 0 ? reframeSessions / totalTool : 0.5;
                const mismatch = (regType === "body-first" && reframeRatio > 0.7) ||
                                 (regType === "thought-first" && reframeRatio < 0.3);
                return (
                  <div style={{ marginBottom: 24, padding: "16px 20px", background: "var(--surface)", border: "0.5px solid var(--amber-dim)", borderRadius: "var(--r)" }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 10 }}>
                      {hasStreak ? "7 days straight" : "7 sessions"}
                    </div>
                    <div style={{ fontSize: 17, color: "var(--text)", lineHeight: 1.7, marginBottom: 8, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
                      {hasStreak
                        ? "You've been here every day this week. I've noticed something — want to talk about it?"
                        : mismatch
                          ? `I've noticed something. You came in as ${regType === "body-first" ? "body-first" : "thought-first"}, but you keep reaching for ${regType === "body-first" ? "conversation" : "breathing"}. That's not wrong — it might mean your system is telling you something about how you actually process. Want to explore that?`
                          : "7 sessions. You're building something. How's it feeling?"}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.5, marginBottom: 14 }}>
                      {mismatch
                        ? "The system adapts to how you actually use it, not just how it assessed you. You decide."
                        : "Take it into Reframe when you're ready — or just notice it."}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => {
                        try { localStorage.setItem("stillform_milestone_7_seen", "yes"); } catch {}
                        setMilestone7Seen(true);
                        setActiveTool({ ...TOOLS.find(t => t.id === "reframe"), mode: "calm" });
                        setScreen("tool");
                        try { window.plausible("7 Session Milestone Open Reframe"); } catch {}
                      }} style={{
                        flex: 1, padding: "10px", background: "var(--amber-glow)", border: "0.5px solid var(--amber-dim)",
                        borderRadius: "var(--r)", color: "var(--amber)", fontSize: 12, cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif"
                      }}>Talk it through →</button>
                      <button onClick={() => {
                        try { localStorage.setItem("stillform_milestone_7_seen", "yes"); } catch {}
                        setMilestone7Seen(true);
                        try { window.plausible("7 Session Milestone Dismissed"); } catch {}
                      }} style={{
                        padding: "10px 14px", background: "none", border: "0.5px solid var(--border)",
                        borderRadius: "var(--r)", color: "var(--text-dim)", fontSize: 12, cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif"
                      }}>Got it</button>
                    </div>
                  </div>
                );
              })()}

              {/* LOOP INTERVENTION NUDGE — shown only when drop-off risk is meaningful */}
              {showLoopNudge && (
                <div style={{ marginBottom: 20, padding: "14px 16px", background: "var(--surface)", border: "0.5px solid var(--amber-dim)", borderRadius: "var(--r)" }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 8 }}>
                    Loop reliability nudge
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.5, marginBottom: 12 }}>
                    {isSoftTone
                      ? "Quick check-in now keeps your daily loop steady."
                      : `${activeLoopNudge?.title}: ${activeLoopNudge?.dropoffPct}% drop-off in the last 14 days (${activeLoopNudge?.dropoffCount}/${activeLoopNudge?.opens}).`}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={handleLoopNudgeAction}
                      style={{
                        flex: 1,
                        background: "var(--amber)",
                        color: "#0A0A0C",
                        border: "none",
                        borderRadius: "var(--r)",
                        padding: "9px 10px",
                        fontSize: 11,
                        fontFamily: "'DM Sans', sans-serif",
                        cursor: "pointer"
                      }}
                    >
                      {activeLoopNudge?.actionLabel}
                    </button>
                    {!isSoftTone && (
                      <button
                        onClick={dismissLoopNudge}
                        style={{
                          background: "none",
                          color: "var(--text-muted)",
                          border: "0.5px solid var(--border)",
                          borderRadius: "var(--r)",
                          padding: "9px 10px",
                          fontSize: 11,
                          fontFamily: "'DM Sans', sans-serif",
                          cursor: "pointer"
                        }}
                      >
                        Not now
                      </button>
                    )}
                  </div>
                  {isSoftTone && (
                    <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 8 }}>
                      Keeping this simple after recent dismissals.
                    </div>
                  )}
                </div>
              )}

              {/* PWA INSTALL BANNER */}
              {installPrompt && !installDismissed && (
                <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--amber-glow)", border: "0.5px solid var(--amber-dim)", borderRadius: "var(--r)", padding: "10px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: "var(--text)" }}>Install Stillform for instant access</span>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setInstallDismissed(true)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Later</button>
                    <button onClick={async () => {
                      if (installPrompt) {
                        installPrompt.prompt();
                        const result = await installPrompt.userChoice;
                        if (result.outcome === "accepted") setInstallPrompt(null);
                        setInstallDismissed(true);
                      }
                    }} style={{ background: "var(--amber)", border: "none", color: "#0A0A0C", fontSize: 11, cursor: "pointer", fontFamily: "'IBM Plex Mono', monospace", padding: "4px 12px", borderRadius: "var(--r-sm)", fontWeight: 500 }}>Install</button>
                  </div>
                </div>
              )}
              {/* FALLBACK INSTALL HINT — shows in browser mode when no install prompt event */}
              {!installPrompt && !installDismissed && !window.matchMedia("(display-mode: standalone)").matches && (
                <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "10px 16px" }}>
                  <span style={{ fontSize: 11, color: "var(--text-dim)" }}>Install: tap ⋮ menu → "Add to Home Screen"</span>
                  <button onClick={() => setInstallDismissed(true)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>✕</button>
                </div>
              )}

            {/* Home UAT status banner (UAT mode only) */}
            {uatTrialFreezeActive && (
              <div
                style={{
                  marginBottom: 12,
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "var(--surface)",
                  border: "0.5px solid var(--border)",
                  borderRadius: "var(--r)",
                  padding: "10px 14px",
                  animation: !reducedMotion ? "uatBannerFlash 1.5s ease-in-out infinite" : "none",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03), 0 0 0 1px var(--amber-dim)"
                }}
              >
                <div style={{ position: "absolute", left: 12, display: "flex", alignItems: "center" }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--amber)" }}>
                    UAT
                  </div>
                </div>
                <div style={{ textAlign: "center", lineHeight: 1.4 }}>
                  <div style={{ fontSize: 11, color: "var(--text-dim)" }}>{UAT_BOARD_UPDATED_LABEL}</div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)" }}>Launch ETA {UAT_BOARD_LAUNCH_ETA_LABEL}</div>
                </div>
                <button
                  onClick={openUatBoardHomeOnly}
                  style={{ position: "absolute", right: 12, background: "none", border: "none", color: "var(--amber)", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", padding: 0 }}
                  aria-label="Open UAT board"
                >
                  →
                </button>
              </div>
            )}

            {uatTrialFreezeActive && (() => {
              const selectedQuestion = UAT_QUESTION_OPTIONS.find((item) => item.id === uatQuestionId) || UAT_QUESTION_OPTIONS[0];
              const remaining = Math.max(0, UAT_FEEDBACK_TEXT_MAX - String(uatQuestionText || "").length);
              const tooShort = String(uatQuestionText || "").trim().length < UAT_FEEDBACK_TEXT_MIN;
              const shortLabelMap = {
                confusing: "Confusing",
                friction: "Friction",
                missing: "Missing clarity",
                working: "Working well"
              };
              return (
                <div style={{ marginBottom: 14, background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "14px 14px 12px" }}>
                  <button
                    onClick={() => setShowUatFeedbackPanel((value) => !value)}
                    style={{
                      width: "100%",
                      background: "none",
                      border: "none",
                      padding: 0,
                      textAlign: "left",
                      cursor: "pointer",
                      marginBottom: showUatFeedbackPanel ? 10 : 0
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--amber)", animation: !reducedMotion ? "pulse 1.2s ease-in-out infinite" : "none" }}>
                        {UAT_FEEDBACK_FLASH_LABEL}
                      </div>
                      <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
                        {showUatFeedbackPanel ? "▾" : "▸"}
                      </div>
                    </div>
                  </button>

                  {showUatFeedbackPanel && (
                    <>
                      <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.55, marginBottom: 10 }}>
                        Tell us what is unclear. This is reviewed against the SHIP list and actioned in UAT updates.
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                        {UAT_QUESTION_OPTIONS.map((item) => {
                          const active = item.id === selectedQuestion?.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => setUatQuestionId(item.id)}
                              style={{
                                background: active ? "var(--amber-glow)" : "transparent",
                                border: `1px solid ${active ? "var(--amber-dim)" : "var(--border)"}`,
                                borderRadius: 999,
                                padding: "5px 11px",
                                fontSize: 11,
                                color: active ? "var(--amber)" : "var(--text-muted)",
                                cursor: "pointer",
                                fontFamily: "'DM Sans', sans-serif"
                              }}
                            >
                              {shortLabelMap[item.id] || item.prompt}
                            </button>
                          );
                        })}
                      </div>
                      <textarea
                        value={uatQuestionText}
                        onChange={(event) => setUatQuestionText(String(event.target.value || "").slice(0, UAT_FEEDBACK_TEXT_MAX))}
                        placeholder={selectedQuestion?.placeholder || "Write your feedback."}
                        style={{
                          width: "100%",
                          minHeight: 92,
                          background: "var(--surface2)",
                          border: "0.5px solid var(--border)",
                          borderRadius: "var(--r)",
                          padding: "10px 12px",
                          color: "var(--text)",
                          fontSize: 12,
                          lineHeight: 1.55,
                          fontFamily: "'DM Sans', sans-serif",
                          resize: "vertical",
                          outline: "none"
                        }}
                      />
                      <div style={{ marginTop: 7, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                        <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                          {tooShort ? `Add at least ${UAT_FEEDBACK_TEXT_MIN} characters.` : `${remaining} characters left.`}
                        </div>
                        <button
                          onClick={submitUatFeedback}
                          disabled={uatSubmitting || tooShort}
                          style={{
                            background: "var(--amber)",
                            color: "#0A0A0C",
                            border: "none",
                            borderRadius: "var(--r-sm)",
                            padding: "8px 12px",
                            fontSize: 11,
                            fontFamily: "'IBM Plex Mono', monospace",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            cursor: uatSubmitting || tooShort ? "not-allowed" : "pointer",
                            opacity: uatSubmitting || tooShort ? 0.55 : 1
                          }}
                        >
                          {uatSubmitting ? "Sending…" : "Send UAT feedback"}
                        </button>
                      </div>
                    </>
                  )}

                  <div style={{ marginTop: showUatFeedbackPanel ? 10 : 8 }}>
                    <button
                      onClick={toggleUatFeedbackHistoryOpen}
                      style={{
                        width: "100%",
                        background: "none",
                        border: "0.5px solid var(--border)",
                        borderRadius: "var(--r-sm)",
                        color: "var(--text-dim)",
                        fontSize: 11,
                        cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif",
                        padding: "8px 10px",
                        textAlign: "left",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <span>Shared UAT feed (all testers)</span>
                      <span style={{ color: "var(--text-muted)" }}>{uatFeedbackHistoryOpen ? "▾" : "▸"}</span>
                    </button>
                    {uatFeedbackHistoryOpen && (
                      <div style={{ marginTop: 8, background: "var(--surface2)", border: "0.5px solid var(--border)", borderRadius: "var(--r-sm)", padding: "8px 10px", maxHeight: 220, overflowY: "auto" }}>
                        {uatFeedbackHistorySyncing && (
                          <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 6 }}>
                            Syncing shared feed…
                          </div>
                        )}
                        {uatFeedbackHistory.length === 0 ? (
                          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>No shared UAT feedback yet.</div>
                        ) : (
                          uatFeedbackHistory.map((entry) => {
                            const questionLabel = shortLabelMap[entry.questionId] || entry.questionId || "Feedback";
                            return (
                              <div key={entry.id} style={{ padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 4 }}>
                                  <span style={{ fontSize: 10, color: "var(--amber)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{questionLabel}</span>
                                  <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{new Date(entry.submittedAt).toLocaleString()}</span>
                                </div>
                                <div style={{ fontSize: 11, color: "var(--text-dim)", lineHeight: 1.5 }}>{entry.text}</div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>

                  {uatFeedbackStatus && (
                    <div style={{ marginTop: 8, fontSize: 11, color: "var(--text-dim)", lineHeight: 1.5 }}>
                      {uatFeedbackStatus}
                    </div>
                  )}
                </div>
              );
            })()}

              {/* Roadmap link intentionally hidden from home surface */}
              {/* BOTTOM LINKS — minimal */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button onClick={() => openFocusCheck("home")} style={{ background: "none", border: "none", fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer" }}>Composure Check</button>
                <button onClick={() => setInfoModal({ title: "What is Composure Check?", body: "Thirty rapid-response trials measuring reaction time, impulse control, and response inhibition. Not a mood check — a read of your current regulatory capacity. Use it before high-stakes interactions or decisions." })} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 13, padding: "0 4px", lineHeight: 1 }}>ⓘ</button>
              </div>

            </section>
          );
        })()}

        {/* ACTIVE TOOL */}
        {screen === "tool" && !activeTool && (
          <div style={{ position: "fixed", inset: 0, background: "var(--bg)" }} />
        )}
        {screen === "tool" && activeTool && (
          <section className="intervention">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <button className="intervention-back" onClick={handleActiveToolBack} style={{ marginBottom: 0 }}>
                ← Back
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {activeTool && (() => {
                  const INFO = {
                    breathe: { title: "Breathe", body: "Paced breathing activates the vagus nerve, directly down-regulating the autonomic nervous system. The exhale length determines recovery speed. Body-first users start here. Thought-first users use this when cognition alone isn't clearing the state." },
                    scan: { title: "Body Scan", body: "Six acupressure points with timed holds. Focused somatic attention redirects cognitive resources to physical sensation — ruminative thought cannot run at full capacity simultaneously. Each point corresponds to a tension-release pathway." },
                    reframe: { title: "Reframe", body: "AI-assisted cognitive processing. The system reads your physical state, feel state, and input — then identifies what is operationally relevant. It separates what is factually present from what your interpretation is adding. Self Mode runs the same process without AI." },
                    pulse: { title: "Signal Log", body: "Emotion tracking through specific labeling. The ability to distinguish between granular emotional states — not broad categories — is consistently associated with better regulation outcomes. Each entry is a data point. Patterns surface in My Progress over time." },
                    metacognition: { title: "Self Mode", body: "Structured self-observation without AI. Five steps: Notice the physical location, Name the first thought without elaboration, Recognize whether the pattern is familiar, identify your Perspective on what you actually need, then Choose what comes next. Grounded in Metacognitive Therapy." },
                    progress: { title: "My Progress", body: "A 12-week practice record. Session frequency, streak, tool usage, and Signal Log entries. Patterns that stay invisible inside day-to-day experience become legible over time. A flight recorder, not a mood log." },
                  };
                  const info = INFO[activeTool.id];
                  if (!info) return null;
                  return (
                    <button onClick={() => setInfoModal(info)} style={{
                      background: "none", border: "none", color: "var(--text-muted)",
                      cursor: "pointer", fontSize: 15, padding: "2px 4px", lineHeight: 1
                    }}>ⓘ</button>
                  );
                })()}
                <div style={{ fontSize: 13, color: "var(--text-dim)" }}>
                {activeTool.id === "reframe" ? (
                  (() => {
                    const m = activeTool.mode || pathway || "calm";
                    const names = { calm: "◎ Talk it through", clarity: "✦ Break the loop", hype: "◌ Get ready" };
                    return names[m] || "✦ Reframe";
                  })()
                ) : (
                  <>{activeTool.icon} {activeTool.name}</>
                )}
              </div>

            </div>
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", marginBottom: 12 }}>
              Your data is encrypted. <button onClick={() => setScreen("crisis")} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 11, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>Crisis resources</button>
            </div>
            {(() => {
              const primer = getToolEntryPrimer(activeTool?.id, regType);
              if (!primer) return null;
              return (
                <div
                  style={{
                    marginBottom: 12,
                    background: "var(--surface)",
                    border: "0.5px solid var(--amber-dim)",
                    borderRadius: "var(--r)",
                    padding: "10px 12px"
                  }}
                >
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 4 }}>
                    Processing primer
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.6 }}>
                    {primer}
                  </div>
                </div>
              );
            })()}
            {renderTool()}
          </section>
        )}

        {/* MY PROGRESS */}
        {screen === "progress" && (
          <MyProgress onBack={() => goHomeSafely()} />
        )}

        {/* FOCUS CHECK */}
        {screen === "focus-check" && (
          <FocusCheckValidation onBack={() => setScreen(focusCheckReturnScreen || "home")} />
        )}

        {/* JOURNAL — log triggers, emotions, outcomes */}

        {/* PRICING */}
        {screen === "pricing" && (
          <section className="pricing">
            {!trialExpired && <button className="intervention-back" onClick={() => goHomeSafely()}>← Back</button>}
            {!syncSignedIn && (
              <div style={{
                maxWidth: 420,
                margin: "0 auto 12px",
                padding: "12px 14px",
                borderRadius: "var(--r-lg)",
                background: "var(--surface)",
                border: "1px solid var(--border)"
              }}>
                <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 8, lineHeight: 1.5 }}>
                  Create an account or sign in — then choose your plan.
                </div>
                {pricingAuthOpen && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <input
                      type="email"
                      placeholder="Email"
                      value={pricingAuthEmail}
                      onChange={e => setPricingAuthEmail(e.target.value)}
                      style={{ background: "var(--surface2)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "10px 14px", fontSize: 14, color: "var(--text)", fontFamily: "'DM Sans', sans-serif", outline: "none" }}
                    />
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                      <input
                        type={showPricingPassword ? "text" : "password"}
                        placeholder="Password"
                        value={pricingAuthPassword}
                        onChange={e => setPricingAuthPassword(e.target.value)}
                        style={{ background: "var(--surface2)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "10px 40px 10px 14px", fontSize: 14, color: "var(--text)", fontFamily: "'DM Sans', sans-serif", outline: "none", width: "100%" }}
                      />
                      <button
                        onClick={() => setShowPricingPassword(p => !p)}
                        style={{ position: "absolute", right: 10, background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans', sans-serif", padding: 0 }}
                      >
                        {showPricingPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {pricingAuthError && <div style={{ fontSize: 12, color: "#e05" }}>{pricingAuthError}</div>}
                    <button
                      className="btn btn-primary"
                      style={{ width: "100%" }}
                      disabled={pricingAuthLoading || pricingAuthCooldownSeconds > 0}
                      onClick={signInAndContinueCheckout}
                    >
                      {pricingAuthLoading
                        ? "Signing in..."
                        : pricingAuthCooldownSeconds > 0
                          ? `Please wait ${pricingAuthCooldownSeconds}s`
                          : "Sign in and continue →"}
                    </button>
                  </div>
                )}
                {!pricingAuthOpen && (
                  <button
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                    onClick={() => setPricingAuthOpen(true)}
                  >
                    Create account or sign in →
                  </button>
                )}
              </div>
            )}
            <div className="pricing-header">
              <h2>{trialExpired ? "Your subscription has ended." : "Subscribe. Stay only if it works."}</h2>
              <p>{trialExpired
                ? "Subscribe to keep using Stillform. Your data is safe — right where you left it."
                : (uatTrialFreezeActive
                    ? `UAT access window active until ${uatLaunchTargetLabel}.`
                    : "Try everything free for 14 days. Composure when you need it — under two minutes.")}
              </p>
            </div>
            <div className="pricing-cards">
              <div className="pricing-card featured" style={{ maxWidth: 360, margin: "0 auto" }}>
                {/* Monthly / Annual toggle */}
                <div style={{ display: "flex", background: "var(--surface)", borderRadius: "var(--r-lg)", padding: 3, marginBottom: 20 }}>
                  <button onClick={() => setPricingPlan("monthly")} style={{
                    flex: 1, padding: "8px 0", borderRadius: "var(--r)", border: "none", cursor: "pointer",
                    fontSize: 13, fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                    background: pricingPlan === "monthly" ? "var(--amber)" : "transparent",
                    color: pricingPlan === "monthly" ? "#0e0f11" : "var(--text-muted)"
                  }}>Monthly</button>
                  <button onClick={() => setPricingPlan("annual")} style={{
                    flex: 1, padding: "8px 0", borderRadius: "var(--r)", border: "none", cursor: "pointer",
                    fontSize: 13, fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                    background: pricingPlan === "annual" ? "var(--amber)" : "transparent",
                    color: pricingPlan === "annual" ? "#0e0f11" : "var(--text-muted)"
                  }}>Annual</button>
                </div>

                <div className="pricing-price">
                  {pricingPlan === "annual" ? (
                    <><sup>$</sup>9<span style={{ fontSize: 28 }}>.99</span></>
                  ) : (
                    <><sup>$</sup>14<span style={{ fontSize: 28 }}>.99</span></>
                  )}
                </div>
                <div className="pricing-save">
                  {pricingPlan === "annual" ? "per month · $119.88/yr · Save 33%" : "per month"}
                </div>

                <ul className="pricing-features">
                  <li>One-tap reset — always free</li>
                  <li>Breathe, Body Scan, Reframe</li>
                  <li>Adaptive AI mode (calm, clarity, or hype)</li>
                  <li>Offline self-guided fallback if AI is unavailable</li>
                  <li>Pulse with AI memory</li>
                  <li>Daily check-in</li>
                  <li>Encrypted local storage + encrypted cloud backup</li>
                  <li>Signal mapping + tension check</li>
                  <li>Pattern recognition (evolves with use)</li>
                  <li>Voice-to-text everywhere</li>
                  <li>AES-256 encryption on all session data</li>
                </ul>
                <button
                  className="btn btn-primary"
                  style={{ width: "100%", opacity: checkoutLoading ? 0.75 : 1, cursor: checkoutLoading ? "wait" : "pointer" }}
                  disabled={checkoutLoading}
                  onClick={() => {
                    if (!syncSignedIn) {
                      setPricingAuthOpen(true);
                      return;
                    }
                    checkoutToLemon();
                  }}
                >
                  {checkoutLoading
                    ? "Opening checkout..."
                    : (!syncSignedIn ? "Sign in / Sign up to subscribe →" : (trialExpired ? "Subscribe now →" : "Subscribe →"))}
                </button>
                <div style={{ textAlign: "center", marginTop: 8, fontSize: 12, color: "var(--text-dim)" }}>
                  Quick checkout. Plan details are below if you want them.
                </div>
                {checkoutMessage && (
                  <div style={{ fontSize: 12, color: "#e05", marginTop: 10, textAlign: "center" }}>{checkoutMessage}</div>
                )}
              </div>
            </div>
            <p style={{ textAlign: "center", marginTop: 32, fontSize: 13, color: "var(--text-dim)" }}>
              Stillform is not medical treatment. It is a composure tool. By subscribing, you agree to our <button onClick={() => setScreen("privacy")} style={{ background: "none", border: "none", color: "var(--amber)", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>Privacy & Disclaimers</button>.
            </p>
          </section>
        )}

        {/* PRIVACY */}
        {screen === "privacy" && (
          <section className="privacy">
            <button className="intervention-back" onClick={() => goHomeSafely()}>← Back</button>
            <h1>Privacy & Disclaimers</h1>
            <div className="privacy-date">Effective April 01, 2026 · ARA Embers LLC</div>
            <p style={{ marginBottom: 24 }}><a href="https://app.termly.io/policy-viewer/policy.html?policyUUID=b96f179b-d3e1-4bdb-acc8-6b656ffe0280" target="_blank" rel="noopener noreferrer" style={{ color: "var(--amber)" }}>View full Privacy Policy</a></p>

            <h2>What Stillform Is</h2>
            <p>Stillform is a composure and self-awareness tool. It provides structured breathing exercises, sensory grounding techniques, acupressure guidance, and AI-assisted cognitive reframing to help users regulate their nervous system and develop awareness of their own mental and emotional patterns.</p>

            <h2>What Stillform Is Not</h2>
            <p>Stillform is not medical treatment, therapy, counseling, or a crisis intervention service. It does not diagnose, treat, cure, or prevent any medical or psychological condition. It is not a substitute for professional medical advice, diagnosis, or treatment. If you are experiencing a medical or mental health crisis, please see our Crisis Resources page for international helplines.</p>
            <p>Stillform can help in many situations, but composure may still be limited by underlying physical or health factors such as illness, pain, inflammation, hormonal shifts, medication effects, or severe sleep disruption. If your state is being driven by a medical issue, treat that as real signal and seek appropriate professional care.</p>

            <h2>Acupressure</h2>
            <p>The acupressure guidance in Stillform is for general wellness purposes only. It is not medical treatment. The pressure points referenced are based on traditional practices and are provided for informational and self-care purposes. Consult a healthcare provider before beginning any new wellness practice, especially if you are pregnant, have a medical condition, or are taking medication.</p>

            <h2>AI-Powered Reframe</h2>
            <p>The Reframe feature uses artificial intelligence (OpenAI's GPT-4o) to generate responses based on evidence-based reframing techniques. These responses are generated by AI, not by a licensed therapist or medical professional. AI responses may not always be accurate, appropriate, or applicable to your situation. Do not rely on AI-generated content as a substitute for professional mental health care. Do not enter sensitive personal, medical, or identifying information.</p>
            <p>Text entered into the Reframe feature is sent to OpenAI's servers for processing via our API integration. OpenAI does not store or retain conversation data sent through the API, and it is not used to train AI models. See our <a href="https://app.termly.io/policy-viewer/policy.html?policyUUID=b96f179b-d3e1-4bdb-acc8-6b656ffe0280" target="_blank" rel="noopener noreferrer" style={{ color: "var(--amber)" }}>full Privacy Policy</a> for details.</p>

            <h2>My Patterns — System Diagnostics</h2>
            <p>Stillform tracks session data and may surface patterns or insights based on your usage history. These insights are observational and educational. They are not clinical assessments, diagnoses, or medical advice. Patterns identified by the app reflect your self-reported data and should not be used as the basis for medical or psychological decisions.</p>

            <h2>Your Data</h2>
            <p>Stillform stores session data, signal profiles, check-ins, and saved reframes locally on your device using AES-256 encryption. If you enable Cloud Sync, encrypted backups from this device are stored in our Supabase cloud infrastructure. Data is encrypted on-device before upload. Restore requires access to the original device encryption key, so restore on a different device may be limited.</p>
            <p>If you subscribe, we collect your email address and payment information through our payment processor (Lemon Squeezy). We do not store credit card numbers.</p>
            <h2>App Diagnostics (counts + rates only)</h2>
            <p>App Diagnostics are enabled by default so Stillform can verify app performance and reliability. Stillform sends only anonymous aggregate counts (for example session counts, completion rates, and trend deltas).</p>
            <p>These metrics do not include journal text, AI conversation content, or free-form notes. You can turn this off anytime in Settings, and this handling is covered in this Privacy &amp; Disclaimers view and our full Privacy Policy.</p>

            <h2>Screenshot &amp; Image Analysis Boundaries</h2>
            <p>When you attach screenshots in Reframe, the image is sent to the AI model for interpretation so Stillform can parse layout context and message sequence. Image interpretation can be incomplete or incorrect. You are responsible for reviewing output before acting.</p>
            <p>Stillform does not guarantee factual accuracy of screenshot-derived interpretation, does not provide legal or clinical judgment from images, and should not be used as a sole basis for high-risk personal, legal, medical, safety, or financial decisions.</p>
            <p>Use screenshot analysis as composure support only. If a situation has material consequences, verify facts independently and consult qualified professionals.</p>

            <h2>Assumption of Risk</h2>
            <p>By using Stillform, you acknowledge that you use the app at your own risk. ARA Embers LLC is not liable for any outcomes resulting from the use of this app, including but not limited to decisions made based on AI-generated content, acupressure techniques, or pattern insights.</p>

            <h2>Contact</h2>
            <p>For questions: ARAembersllc@proton.me</p>
            <p>ARA Embers LLC · New Jersey, United States</p>
          </section>
        )}

        {/* FAQ */}
        {screen === "faq" && (
          <section style={{ maxWidth: 560, margin: "0 auto", padding: "40px 24px 80px", position: "relative", zIndex: 1 }}>
            <button className="intervention-back" onClick={() => setScreen(faqBackScreen || "home")}>← Back</button>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, marginBottom: 16 }}>FAQ</h1>
            <div style={{ fontSize: 14, fontStyle: "italic", color: "var(--text-dim)", lineHeight: 1.7, marginBottom: 32, fontFamily: "'Cormorant Garamond', serif" }}>
              Composure is being in control of how you show up — in any moment that matters.
            </div>

            {[
              {
                q: "What is Stillform?",
                a: "Stillform is composure architecture. Based on proven neuroscience, we built a system that identifies how each person processes their internal state. A short calibration determines whether you are body-first or thought-first — the entry point where regulation actually takes hold. From there, the system routes you precisely. Body-first users settle the nervous system before the thinking can clear. Thought-first users process the cognition before the body releases. Every session trains you to notice, name, and choose your response — replacing automatic reactions with intentional clarity. That is the architecture of composure."
              },
              {
                q: "What does composure mean here?",
                a: "Not calm for its own sake. Composure is the ability to perceive accurately and respond deliberately — in high-stakes conversations, under pressure, when something goes sideways, and when nothing is wrong at all. Stillform treats it as a trainable skill, not a fixed trait. The practice is daily. The standard is consistent."
              },
              {
                q: "How is this different from meditation or therapy?",
                a: "Stillform is neither. Meditation is a sustained attention practice. Therapy is clinical treatment for psychological conditions. Stillform is a precision regulation system — structured interventions that interrupt activation and restore a functional baseline in real time. It is a performance and composure tool. It is not a substitute for clinical care."
              },
              {
                q: "What is calibration?",
                a: "A five-scenario assessment that identifies your default regulation tendency — body-first or thought-first. Research shows people have genuine biases toward certain strategies, but these are probabilistic and state-dependent, not fixed. On a given day, physical activation may require a body-first entry even for someone who typically processes cognitively first. Calibration pre-loads your most likely starting point. The bio-filter and feel state you log each session adjust routing when your current state calls for something different. Recalibrate anytime in Settings."
              },
              {
                q: "What is the morning check-in?",
                a: "Three inputs at the start of the day: energy level, physical state, and where you are holding tension. Under 30 seconds. Sleep debt, pain, and hormonal state directly alter how you perceive situations — they narrow your capacity before any external stressor arrives. The check-in catches that early, so the AI already knows your baseline when you open Reframe later."
              },
              {
                q: "What is the end of day check-in?",
                a: "After 6 PM, three inputs: where your energy landed, whether you held composure, one word for the day. The AI carries that into the next morning as context. The morning-to-evening structure creates a feedback loop — patterns that stay invisible inside day-to-day experience become legible over time."
              },
              {
                q: "What does the AI do in Reframe?",
                a: "It reads your physical state, feel state, and input — then identifies what is actually happening. Under activation, the mind tends to collect evidence for the interpretation it has already formed and miss what contradicts it. The AI introduces a perspective that interrupts that pattern. For interpersonal situations, it separates what is factually present from what your read of the other person is adding. It does not follow a script — it adapts to your input."
              },
              {
                q: "Does the AI learn about me?",
                a: "Yes. It reads your signal profile, identified cognitive patterns, check-in history, and session notes. The more you use it, the more precise it becomes. From session five onward, it begins surfacing cross-session observations directly. Seeing your own patterns from the outside creates the distance needed to respond to them rather than operate from inside them."
              },
              {
                q: "What is Self Mode in Reframe?",
                a: "A structured self-observation protocol for users who prefer to process independently. Five steps: Notice the physical location, Name the first thought without elaboration, Recognize whether the pattern is familiar, identify your Perspective on what you actually need, then Choose what comes next. The structure is grounded in Metacognitive Therapy — observing a state rather than fusing with it, without AI involvement. Available via the Self Mode tab inside Reframe."
              },
              {
                q: "What is What Shifted?",
                a: "A single line written after Reframe, naming what changed in your internal state. Translating an emotional experience into precise language measurably reduces activation and reinforces the regulated state. The one-line constraint is deliberate — precision requires more effort than open-ended writing and produces more durable results. It is a processing tool, not a communication tool."
              },
              {
                q: "What is Next Move?",
                a: "One concrete action selected from a regulated state immediately after Reframe. Four options: Send a message, Hold a boundary, Delay your response, Let it go. Each has a real execution path — not a label. Forming a specific behavioral intention at the moment of clarity significantly increases follow-through. The AI reads your session context and surfaces the relevant options."
              },
              {
                q: "What is the Bio-Filter?",
                a: "A physical state check before Reframe. Options include depleted, under-rested, pain present, hormonal shift, gut signal, medicated, activated. Physical state directly shapes perception — sleep debt amplifies threat detection, pain demands attentional resources, hormonal shifts alter baseline. The bio-filter surfaces these variables so the AI contextualizes your input accurately rather than coaching past something that may need a different response entirely."
              },
              {
                q: "What is the Body Scan?",
                a: "Six acupressure points with timed holds, auto-advancing. Each point corresponds to a tension-release pathway. Focused physical attention interrupts ruminative thought by redirecting cognitive resources to somatic sensation — the two cannot run simultaneously at full capacity. The session completes with \'Signal cleared.\'"
              },
              {
                q: "What is Signal Log?",
                a: "The emotion tracking layer. Tap chips to name what you are experiencing throughout the day — not only during sessions. The ability to distinguish between specific states, rather than broad categories, is consistently associated with better regulation and more adaptive responses. Signal Log builds that precision gradually through repeated, specific labeling."
              },
              {
                q: "What is Composure Telemetry?",
                a: "A 12-week visual timeline on My Progress. Each session and Signal Log entry activates a cell. Brighter amber indicates more activity that day. It is a practice record — frequency and consistency over time — not a mood log."
              },
              {
                q: "What happens when I type rapidly in Reframe?",
                a: "The system notices. Fast input is a behavioral signal — the body is ahead of the thinking. Physical tension during emotional processing amplifies the response. A brief somatic cue appears: \'Drop your shoulders\' or \'Unclench your jaw.\' It clears within seconds. The system reads behavior, not only content."
              },
              {
                q: "What is Composure Check?",
                a: "A voluntary assessment of your regulatory state. Thirty rapid-response trials that measure reaction time, impulse control, and response inhibition — whether you are operating from a regulated baseline or whether something is narrowing your window. Not a diagnostic. Use it before high-stakes conversations, decisions, or any moment where an accurate read of your current capacity matters."
              },
              {
                q: "What is the 60 BPM pulse on the home screen?",
                a: "A 1Hz ambient glow matching a calm resting heart rate. The nervous system entrains to rhythmic environmental stimuli without conscious effort. The home screen is designed to begin regulation before any tool is opened."
              },
              {
                q: "What if the AI connection drops?",
                a: "Reframe retries automatically. If the connection fails, a built-in self-guided protocol takes over so the session continues without interruption. Fallback sessions are recorded in your history the same as any other."
              },
              {
                q: "Can I attach screenshots to Reframe?",
                a: "Yes. Attach up to three screenshots per session. The AI reads visual context — layout, attribution, sequence — to improve coaching for interpersonal situations. Screenshot interpretation has limits. Do not treat it as legal, factual, or medical analysis. Verify anything consequential independently."
              },
              {
                q: "Why don't I see calendar or health data?",
                a: "Calendar and Health Connect integrations require device-level permissions only available in the native Android app. Browser access does not support them. Install the Android app and grant permissions in Settings under Integrations."
              },
              {
                q: "What if regulation remains difficult?",
                a: "Physical variables can impose a ceiling on regulation outcomes independent of practice quality. Sleep debt, chronic pain, inflammation, hormonal changes, and medication effects alter perception at a biological level. Stillform can help you read the signal more clearly — but if your state appears physically driven or consistently resistant, that warrants medical attention, not more practice."
              },
              {
                q: "Is my data private?",
                a: "Session data is encrypted on your device. Optional Cloud Sync stores AES-256 encrypted backups — the content is not accessible to us. The AI receives context to generate a response and returns output. No session content is retained on our servers. Delete your data anytime from Settings."
              },
              {
                q: "How much does Stillform cost?",
                a: "$14.99 per month, or $9.99 per month on the annual plan ($119.88 per year). One price. Everything included."
              },
              {
                q: "What happens to my data if I cancel?",
                a: "Local data stays on your device. If Cloud Sync was active, encrypted backups are retained and restorable if you return. Restoration on a different device depends on the original encryption key."
              },
              {
                q: "Is my data backed up?",
                a: "Sign in or create an account in Settings to enable Cloud Sync. Data is encrypted on your device before it leaves — we cannot access it. Sync and restore are managed from Settings."
              },
              {
                q: "Does Stillform work on tablets?",
                a: "The web app runs on any browser, including tablets and iPads. The layout is optimized for phones but functional on larger screens. A dedicated tablet layout is planned."
              }
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 6 }}>{item.q}</div>
                <div style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.7 }}>{item.a}</div>
              </div>
            ))}
          </section>
        )}

        {/* CRISIS RESOURCES — international hotlines */}
        {screen === "crisis" && (
          <section style={{ maxWidth: 560, margin: "0 auto", padding: "40px 24px 80px", position: "relative", zIndex: 1 }}>
            <button className="intervention-back" onClick={() => goHomeSafely()}>← Back</button>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, marginBottom: 8 }}>Crisis Resources</h1>
            <p style={{ fontSize: 14, color: "var(--text-dim)", lineHeight: 1.7, marginBottom: 28 }}>
              Stillform is a composure tool, not a crisis service. If you or someone you know is in immediate danger or experiencing a mental health crisis, please reach out to a professional.
            </p>
            {(() => {
              const crisisResources = [
              { region: "United States", lines: [{ name: "Suicide & Crisis Lifeline", number: "988", note: "Call or text" }, { name: "Crisis Text Line", number: "Text HOME to 741741", note: "Text-based support" }] },
              { region: "Canada", lines: [{ name: "Suicide & Crisis Lifeline", number: "988", note: "Call or text" }, { name: "Crisis Services Canada", number: "1-833-456-4566", note: "24/7" }] },
              { region: "United Kingdom", lines: [{ name: "Samaritans", number: "116 123", note: "24/7, free" }, { name: "Crisis Text Line", number: "Text SHOUT to 85258", note: "Text-based" }] },
              { region: "Ireland", lines: [{ name: "Samaritans", number: "116 123", note: "24/7, free" }] },
              { region: "Australia", lines: [{ name: "Lifeline", number: "13 11 14", note: "24/7" }, { name: "Beyond Blue", number: "1300 22 4636", note: "24/7" }] },
              { region: "New Zealand", lines: [{ name: "Need to Talk?", number: "1737", note: "Call or text, 24/7" }] },
              { region: "Germany", lines: [{ name: "Telefonseelsorge", number: "0800 111 0 111", note: "24/7, free" }] },
              { region: "France", lines: [{ name: "Numéro National", number: "3114", note: "24/7" }] },
              { region: "Spain", lines: [{ name: "Línea de Atención", number: "024", note: "24/7" }] },
              { region: "Japan", lines: [{ name: "Yorisoi Hotline", number: "0120-279-338", note: "24/7, free" }] },
              { region: "South Korea", lines: [{ name: "Crisis Line", number: "1393", note: "24/7" }] },
              { region: "Turkey", lines: [{ name: "ALO Psikiyatri", number: "182", note: "" }] },
              { region: "Armenia", lines: [{ name: "Trust Social Work", number: "+374 10 538194", note: "" }] },
              { region: "International", lines: [{ name: "Find your country", number: "findahelpline.com", note: "Directory of crisis lines worldwide" }] }
              ];
              const sortedResources = [...crisisResources].sort((a, b) => (
                preferredCrisisRegion && a.region === preferredCrisisRegion
                  ? -1
                  : preferredCrisisRegion && b.region === preferredCrisisRegion
                    ? 1
                    : 0
              ));
              const primaryResource = sortedResources[0] || null;
              const otherResources = sortedResources.slice(1);
              const renderLine = (line, j) => {
                const isPhone = /^[\d\s\-+]+$/.test(line.number);
                const isText = line.number.toLowerCase().startsWith("text");
                const isUrl = line.number.includes(".");
                const phoneDigits = line.number.replace(/[^\d+]/g, "");
                const smsMatch = line.number.match(/\d{5,}/);
                return (
                  <div key={j} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "12px 16px", marginBottom: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>{line.name}</div>
                        {line.note && <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>{line.note}</div>}
                      </div>
                      {isPhone ? (
                        <a href={`tel:${phoneDigits}`} style={{ fontSize: 15, color: "var(--amber)", fontWeight: 500, whiteSpace: "nowrap", textDecoration: "none" }}>{line.number} →</a>
                      ) : isText && smsMatch ? (
                        <a href={`sms:${smsMatch[0]}`} style={{ fontSize: 13, color: "var(--amber)", fontWeight: 500, whiteSpace: "nowrap", textDecoration: "none" }}>{line.number} →</a>
                      ) : isUrl ? (
                        <a href={`https://${line.number}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "var(--amber)", fontWeight: 500, whiteSpace: "nowrap", textDecoration: "none" }}>{line.number} →</a>
                      ) : (
                        <div style={{ fontSize: 15, color: "var(--amber)", fontWeight: 500, whiteSpace: "nowrap" }}>{line.number}</div>
                      )}
                    </div>
                  </div>
                );
              };
              return (
                <>
                  {primaryResource && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 8 }}>{primaryResource.region}</div>
                      {primaryResource.lines.map(renderLine)}
                    </div>
                  )}

                  {otherResources.length > 0 && (
                    <div style={{ marginTop: 14 }}>
                      <button
                        onClick={() => setShowOtherCrisisResources(prev => !prev)}
                        style={{ width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "10px 14px", color: "var(--text)", fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
                      >
                        <span>Other resources</span>
                        <span style={{ color: "var(--text-muted)" }}>{showOtherCrisisResources ? "▾" : "▸"}</span>
                      </button>
                      {showOtherCrisisResources && (
                        <div style={{ marginTop: 10 }}>
                          {otherResources.map((country, i) => (
                            <div key={country.region || i} style={{ marginBottom: 16 }}>
                              <div style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 8 }}>{country.region}</div>
                              {country.lines.map(renderLine)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              );
            })()}
          </section>
        )}

        {/* SETTINGS */}
        {screen === "settings" && (
          <section style={{ maxWidth: 480, margin: "0 auto", padding: "48px 24px" }}>
            <button className="intervention-back" onClick={() => goHomeSafely()}>← Back</button>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, marginBottom: 32 }}>Settings</h1>

{/* PERSONALIZATION */}
            <div style={{ marginBottom: 28 }}>
              <button onClick={() => toggleSettingsSection("personalization")} style={{
                width: "100%", background: "none", border: "none", padding: "0 0 10px",
                display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer"
              }}>
                <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)" }}>Personalization</span>
                <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{settingsSectionOpen.personalization ? "▾" : "▸"}</span>
              </button>
              {settingsSectionOpen.personalization && (<>

                {/* App Customization sub-group */}
                <div style={{ fontSize: 9, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10, marginTop: 4 }}>App Customization</div>

                                {/* Theme — collapsible */}
                <div style={{ marginBottom: 10 }}>
                  <button onClick={() => toggleSubOpen("theme")} style={{
                    width: "100%", background: "none", border: "none", padding: "8px 0",
                    display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
                    borderBottom: "0.5px solid var(--border)"
                  }}>
                    <span style={{ fontSize: 13, color: "var(--text)" }}>Theme</span>
                    <span style={{ color: "var(--text-muted)", fontSize: 11 }}>{settingsSubOpen.theme ? "▾" : "▸"}</span>
                  </button>
                  {settingsSubOpen.theme && (
                    <div style={{ marginTop: 10 }}>
                      {/* Theme */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 8 }}>Theme</div>
                  {[
                    { id: "dark", label: "Dark" }, { id: "midnight", label: "Midnight" },
                    { id: "suede", label: "Suede" }, { id: "teal", label: "Teal" },
                    { id: "rose", label: "Rose" }, { id: "light", label: "Light" }
                  ].map(t => {
                    const selected = themeChoice === t.id;
                    return (
                      <button key={t.id} type="button" onClick={() => setThemeSelection(t.id)} style={{
                        width: "100%", background: selected ? "var(--amber-glow)" : "var(--surface)",
                        border: `1px solid ${selected ? "var(--amber-dim)" : "var(--border)"}`,
                        borderRadius: "var(--r-lg)", padding: "12px 16px", marginBottom: 4, cursor: "pointer",
                        display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left",
                        fontFamily: "'DM Sans', sans-serif"
                      }}>
                        <div style={{ fontSize: 14, color: selected ? "var(--amber)" : "var(--text)" }}>{t.label}</div>
                        {selected && <div style={{ fontSize: 11, color: "var(--amber)" }}>✓</div>}
                      </button>
                    );
                  })}
                </div>
                    </div>
                  )}
                </div>
                                {/* AI Reframe Tone — collapsible */}
                <div style={{ marginBottom: 10 }}>
                  <button onClick={() => toggleSubOpen("aiTone")} style={{
                    width: "100%", background: "none", border: "none", padding: "8px 0",
                    display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
                    borderBottom: "0.5px solid var(--border)"
                  }}>
                    <span style={{ fontSize: 13, color: "var(--text)" }}>AI Reframe Tone</span>
                    <span style={{ color: "var(--text-muted)", fontSize: 11 }}>{settingsSubOpen.aiTone ? "▾" : "▸"}</span>
                  </button>
                  {settingsSubOpen.aiTone && (
                    <div style={{ marginTop: 10 }}>
                      {/* AI Reframe Tone */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 8 }}>AI Reframe Tone</div>
                  {[
                    { id: "balanced", label: "Balanced (default)" }, { id: "gentle", label: "Gentle" },
                    { id: "direct", label: "Direct & blunt" }, { id: "clinical", label: "Clinical / technical" },
                    { id: "motivational", label: "Motivational" }
                  ].map(t => {
                    const selected = aiToneChoice === t.id;
                    return (
                      <button key={t.id} type="button" onClick={() => setAiToneSelection(t.id)} style={{
                        width: "100%", background: selected ? "var(--amber-glow)" : "var(--surface)",
                        border: `1px solid ${selected ? "var(--amber-dim)" : "var(--border)"}`,
                        borderRadius: "var(--r-lg)", padding: "12px 16px", marginBottom: 4,
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans', sans-serif"
                      }}>
                        <div style={{ fontSize: 14, color: selected ? "var(--amber)" : "var(--text)" }}>{t.label}</div>
                        {selected && <div style={{ fontSize: 11, color: "var(--amber)" }}>✓</div>}
                      </button>
                    );
                  })}
                </div>
                    </div>
                  )}
                </div>
                                {/* Display — collapsible */}
                <div style={{ marginBottom: 10 }}>
                  <button onClick={() => toggleSubOpen("display")} style={{
                    width: "100%", background: "none", border: "none", padding: "8px 0",
                    display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
                    borderBottom: "0.5px solid var(--border)"
                  }}>
                    <span style={{ fontSize: 13, color: "var(--text)" }}>Display</span>
                    <span style={{ color: "var(--text-muted)", fontSize: 11 }}>{settingsSubOpen.display ? "▾" : "▸"}</span>
                  </button>
                  {settingsSubOpen.display && (
                    <div style={{ marginTop: 10 }}>
                      {/* Display */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 8 }}>Display</div>
                  {[
                    { key: "stillform_screenlight", label: "Screen-light mode", desc: "Dims screen to near-black during exercises. Audio guides you.", icon: "◐" },
                    { key: "stillform_reducedmotion", label: "Reduced motion", desc: "Removes animations. Text and timers only.", icon: "◻" },
                    { key: "stillform_visual_grounding", label: "Visual grounding", desc: "Organic fractal visuals behind breathing exercises. Helps ground through visual focus.", icon: "◈", defaultOn: true },
                    { key: "stillform_morning_breath_cue", label: "Morning breath cue", desc: "A brief breathing prompt before your morning check-in. Helps you arrive before you assess.", icon: "◌", defaultOn: false }
                  ].map(opt => {
                    const isOn = (() => { try { const v = localStorage.getItem(opt.key); if (v === null && opt.defaultOn) return true; return v === "on"; } catch { return !!opt.defaultOn; } })();
                    return (
                      <div key={opt.key} style={{
                        background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                        padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8
                      }}>
                        <div>
                          <div style={{ fontSize: 14, color: "var(--text)" }}>{opt.icon} {opt.label}</div>
                          <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>{opt.desc}</div>
                        </div>
                        <button onClick={() => { try { localStorage.setItem(opt.key, isOn ? "off" : "on"); refreshSettings(); } catch {} }} style={{
                          background: isOn ? "var(--amber)" : "var(--border)",
                          border: "none", borderRadius: "var(--r-lg)", width: 44, height: 24, cursor: "pointer",
                          position: "relative", transition: "background 0.2s", flexShrink: 0
                        }}>
                          <div style={{ width: 18, height: 18, borderRadius: "50%", background: "white", position: "absolute", top: 3, left: isOn ? 23 : 3, transition: "left 0.2s" }} />
                        </button>
                      </div>
                    );
                  })}
                  {/* High contrast toggle */}
                  <div style={{
                    background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                    padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8
                  }}>
                    <div>
                      <div style={{ fontSize: 14, color: "var(--text)" }}>◑ High contrast</div>
                      <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>Boosts text and border contrast. Helps with color blindness and visual sensitivity.</div>
                    </div>
                    <button onClick={() => {
                      const next = !highContrastMode;
                      setHighContrastMode(next);
                      try { localStorage.setItem("stillform_high_contrast", next ? "on" : "off"); } catch {}
                    }} style={{
                      background: highContrastMode ? "var(--amber)" : "var(--border)",
                      border: "none", borderRadius: "var(--r-lg)", width: 44, height: 24, cursor: "pointer",
                      position: "relative", transition: "background 0.2s", flexShrink: 0
                    }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "white", position: "absolute", top: 3, left: highContrastMode ? 23 : 3, transition: "left 0.2s" }} />
                    </button>
                  </div>
                </div>
                    </div>
                  )}
                </div>
                {/* Audio */}
                <div style={{ marginBottom: 10, padding: "8px 0", borderBottom: "0.5px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: 13, color: "var(--text)" }}>Audio</span>
                    <span style={{ fontSize: 11, color: "var(--text-dim)", marginLeft: 8 }}>Gentle tones during breathing</span>
                  </div>
                  <button onClick={() => { try { const current = localStorage.getItem("stillform_audio") === "on"; localStorage.setItem("stillform_audio", current ? "off" : "on"); refreshSettings(); } catch {} }} style={{
                    background: (() => { try { return localStorage.getItem("stillform_audio") === "on" ? "var(--amber)" : "var(--border)"; } catch { return "var(--border)"; } })(),
                    border: "none", borderRadius: "var(--r-lg)", width: 44, height: 24, cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%", background: "white", position: "absolute", top: 3,
                      left: (() => { try { return localStorage.getItem("stillform_audio") === "on" ? 23 : 3; } catch { return 3; } })(),
                      transition: "left 0.2s"
                    }} />
                  </button>
                </div>

                                {/* Sound — collapsible */}
                <div style={{ marginBottom: 10 }}>
                  <button onClick={() => toggleSubOpen("sound")} style={{
                    width: "100%", background: "none", border: "none", padding: "8px 0",
                    display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
                    borderBottom: "0.5px solid var(--border)"
                  }}>
                    <span style={{ fontSize: 13, color: "var(--text)" }}>Sound</span>
                    <span style={{ color: "var(--text-muted)", fontSize: 11 }}>{settingsSubOpen.sound ? "▾" : "▸"}</span>
                  </button>
                  {settingsSubOpen.sound && (
                    <div style={{ marginTop: 10 }}>
                      {/* Sound */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 8 }}>Sound</div>
                  {(() => {
                    const current = (() => { try { return localStorage.getItem("stillform_sound_type") || "tone"; } catch { return "tone"; } })();
                    const free = [
                      { id: "tone", label: "Tone", desc: "Oscillator tones that follow your breath" },
                      { id: "rhythm", label: "Rhythm", desc: "Pulsing beat matched to breathing pattern" },
                      { id: "silence", label: "Silence", desc: "No sound. Visual cues only." }
                    ];
                    const premium = [
                      { id: "bowl", label: "Singing bowl" }, { id: "rain", label: "Rain" },
                      { id: "ocean", label: "Ocean waves" }, { id: "lofi", label: "Lo-fi ambient" }, { id: "white", label: "White noise" }
                    ];
                    return (<>
                      {free.map(s => (
                        <button key={s.id} onClick={() => { try { localStorage.setItem("stillform_sound_type", s.id); } catch {} refreshSettings(); }} style={{
                          width: "100%", background: current === s.id ? "var(--amber-glow)" : "var(--surface)",
                          border: `1px solid ${current === s.id ? "var(--amber-dim)" : "var(--border)"}`,
                          borderRadius: "var(--r-lg)", padding: "12px 16px", marginBottom: 6, cursor: "pointer",
                          display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'DM Sans', sans-serif", textAlign: "left"
                        }}>
                          <div>
                            <div style={{ fontSize: 13, color: current === s.id ? "var(--amber)" : "var(--text)" }}>{s.label}</div>
                            <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 1 }}>{s.desc}</div>
                          </div>
                          {current === s.id && <div style={{ fontSize: 11, color: "var(--amber)" }}>✓</div>}
                        </button>
                      ))}
                      {premium.map(s => (
                        <div key={s.id} style={{
                          background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                          padding: "12px 16px", marginBottom: 6, opacity: 0.35, display: "flex", justifyContent: "space-between", alignItems: "center"
                        }}>
                          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{s.label}</div>
                          <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Coming soon</div>
                        </div>
                      ))}
                    </>);
                  })()}
                </div>
                    </div>
                  )}
                </div>
                {/* Your Setup sub-group */}
                <div style={{ fontSize: 9, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10, marginTop: 4 }}>Your Setup</div>

                                {/* Processing Type — collapsible */}
                <div style={{ marginBottom: 10 }}>
                  <button onClick={() => toggleSubOpen("processingType")} style={{
                    width: "100%", background: "none", border: "none", padding: "8px 0",
                    display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
                    borderBottom: "0.5px solid var(--border)"
                  }}>
                    <span style={{ fontSize: 13, color: "var(--text)" }}>Processing Type</span>
                    <span style={{ color: "var(--text-muted)", fontSize: 11 }}>{settingsSubOpen.processingType ? "▾" : "▸"}</span>
                  </button>
                  {settingsSubOpen.processingType && (
                    <div style={{ marginTop: 10 }}>
                      {/* Processing Type */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 8 }}>Processing Type</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10, lineHeight: 1.6 }}>
                    How you naturally process intensity — through thoughts or through your body. This determines which tool appears first. The system checks in after 7 sessions to see if it still fits.
                  </div>
                  {[
                    { id: "thought-first", name: "Thought-first", desc: "I process through my mind — analyzing, replaying, building responses" },
                    { id: "body-first", name: "Body-first", desc: "I feel it physically first — tension, heat, restlessness, then thoughts follow" },
                    { id: "balanced", name: "Balanced", desc: "I use both equally — depends on the moment" }
                  ].map(t => {
                    const isSelected = (() => { try { return (localStorage.getItem("stillform_regulation_type") || "balanced") === t.id; } catch { return t.id === "balanced"; } })();
                    return (
                      <button key={t.id} onClick={() => { try { localStorage.setItem("stillform_regulation_type", t.id); setRegType(t.id); refreshSettings(); } catch {} }} style={{
                        width: "100%", padding: "14px 16px", textAlign: "left", cursor: "pointer",
                        background: isSelected ? "var(--amber-glow)" : "var(--surface)",
                        border: `1px solid ${isSelected ? "var(--amber-dim)" : "var(--border)"}`,
                        borderRadius: "var(--r-lg)", marginBottom: 6, color: "var(--text)", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s"
                      }}>
                        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, color: isSelected ? "var(--amber)" : "var(--text)" }}>{t.name}</div>
                        <div style={{ fontSize: 11, color: "var(--text-dim)", lineHeight: 1.5 }}>{t.desc}</div>
                      </button>
                    );
                  })}
                </div>
                    </div>
                  )}
                </div>
                                {/* Breathing Pattern — collapsible */}
                <div style={{ marginBottom: 10 }}>
                  <button onClick={() => toggleSubOpen("breathingPattern")} style={{
                    width: "100%", background: "none", border: "none", padding: "8px 0",
                    display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
                    borderBottom: "0.5px solid var(--border)"
                  }}>
                    <span style={{ fontSize: 13, color: "var(--text)" }}>Breathing Pattern</span>
                    <span style={{ color: "var(--text-muted)", fontSize: 11 }}>{settingsSubOpen.breathingPattern ? "▾" : "▸"}</span>
                  </button>
                  {settingsSubOpen.breathingPattern && (
                    <div style={{ marginTop: 10 }}>
                      {/* Breathing Pattern */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 8 }}>Breathing Pattern</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10, lineHeight: 1.6 }}>
                    Your default starts automatically each session. Quick for regulation on the go, Deep for a fuller reset.
                  </div>
                  {[
                    { id: "quick", name: "Quick Reset", use: "60 seconds. Regulate and get back to it.", why: "Focused breathing slows your system. The shift starts in under a minute." },
                    { id: "deep", name: "Deep Regulate", use: "3 minutes. Deeper reset.", why: "Extended exhale cycle gives your nervous system time to fully downregulate." }
                  ].map(p => {
                    const isSelected = (() => { try { return (localStorage.getItem("stillform_breath_pattern") || "quick") === p.id; } catch { return p.id === "quick"; } })();
                    return (
                      <button key={p.id} onClick={() => { try { localStorage.setItem("stillform_breath_pattern", p.id); refreshSettings(); } catch {} }} style={{
                        width: "100%", padding: "14px 16px", textAlign: "left", cursor: "pointer",
                        background: isSelected ? "var(--amber-glow)" : "var(--surface)",
                        border: `1px solid ${isSelected ? "var(--amber-dim)" : "var(--border)"}`,
                        borderRadius: "var(--r-lg)", marginBottom: 6, color: "var(--text)", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s"
                      }}>
                        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, color: isSelected ? "var(--amber)" : "var(--text)" }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: "var(--amber)", marginBottom: 4, fontStyle: "italic" }}>{p.use}</div>
                        <div style={{ fontSize: 11, color: "var(--text-dim)", lineHeight: 1.5 }}>{p.why}</div>
                      </button>
                    );
                  })}
                </div>
                    </div>
                  )}
                </div>
                                {/* Body Scan Pace — collapsible */}
                <div style={{ marginBottom: 10 }}>
                  <button onClick={() => toggleSubOpen("scanPace")} style={{
                    width: "100%", background: "none", border: "none", padding: "8px 0",
                    display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
                    borderBottom: "0.5px solid var(--border)"
                  }}>
                    <span style={{ fontSize: 13, color: "var(--text)" }}>Body Scan Pace</span>
                    <span style={{ color: "var(--text-muted)", fontSize: 11 }}>{settingsSubOpen.scanPace ? "▾" : "▸"}</span>
                  </button>
                  {settingsSubOpen.scanPace && (
                    <div style={{ marginTop: 10 }}>
                      {/* Body Scan Pace */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 8 }}>Body Scan Pace</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>Hold time per acupressure point. Standard is 45–60s.</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[
                      { id: "fast", label: "Fast", desc: "~25s / point" },
                      { id: "standard", label: "Standard", desc: "~50s / point" },
                      { id: "slow", label: "Slow", desc: "~90s / point" }
                    ].map(opt => {
                      const current = (() => { try { return localStorage.getItem("stillform_scan_pace") || "standard"; } catch { return "standard"; } })();
                      const active = current === opt.id;
                      return (
                        <button key={opt.id} onClick={() => { try { localStorage.setItem("stillform_scan_pace", opt.id); refreshSettings(); } catch {} }} style={{
                          flex: 1, background: active ? "var(--amber-glow)" : "var(--surface)",
                          border: `0.5px solid ${active ? "var(--amber-dim)" : "var(--border)"}`,
                          borderRadius: "var(--r)", padding: "10px 8px", cursor: "pointer", textAlign: "center", transition: "all 0.15s",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.025)"
                        }}>
                          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: active ? "var(--amber)" : "var(--text-dim)", fontWeight: active ? 500 : 400 }}>{opt.label}</div>
                          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.08em", marginTop: 3 }}>{opt.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                    </div>
                  )}
                </div>
                                {/* Signal Mapping — collapsible */}
                <div style={{ marginBottom: 10 }}>
                  <button onClick={() => toggleSubOpen("signalMapping")} style={{
                    width: "100%", background: "none", border: "none", padding: "8px 0",
                    display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
                    borderBottom: "0.5px solid var(--border)"
                  }}>
                    <span style={{ fontSize: 13, color: "var(--text)" }}>Signal Mapping</span>
                    <span style={{ color: "var(--text-muted)", fontSize: 11 }}>{settingsSubOpen.signalMapping ? "▾" : "▸"}</span>
                  </button>
                  {settingsSubOpen.signalMapping && (
                    <div style={{ marginTop: 10 }}>
                      {/* Signal Mapping */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 8 }}>Signal Mapping</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10, lineHeight: 1.6 }}>
                    Map where your body responds first — jaw, shoulders, chest, gut, hands, legs. One-time setup. The app uses this to personalize your sessions.
                  </div>
                  <button onClick={() => startTool(TOOLS.find(t => t.id === "signals"))} style={{
                    width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                    padding: "14px 18px", textAlign: "left", cursor: "pointer", color: "var(--text)", fontSize: 14, fontFamily: "'DM Sans', sans-serif"
                  }}>
                    <div style={{ fontWeight: 500, marginBottom: 2 }}>Map your signals →</div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)" }}>Where does it hit first? Takes 60 seconds.</div>
                  </button>
                </div>
                    </div>
                  )}
                </div>
                                {/* Schedule & Notifications — collapsible */}
                <div style={{ marginBottom: 10 }}>
                  <button onClick={() => toggleSubOpen("scheduleNotif")} style={{
                    width: "100%", background: "none", border: "none", padding: "8px 0",
                    display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
                    borderBottom: "0.5px solid var(--border)"
                  }}>
                    <span style={{ fontSize: 13, color: "var(--text)" }}>Schedule & Notifications</span>
                    <span style={{ color: "var(--text-muted)", fontSize: 11 }}>{settingsSubOpen.scheduleNotif ? "▾" : "▸"}</span>
                  </button>
                  {settingsSubOpen.scheduleNotif && (
                    <div style={{ marginTop: 10 }}>
                      {/* Schedule & Notifications — combined */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 8 }}>Schedule & Notifications</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10, lineHeight: 1.5 }}>
                    When check-ins appear and whether you get a daily reminder.
                  </div>
                  {/* Time pickers */}
                  {(() => {
                    const morningMin = (() => { try { return parseInt(localStorage.getItem("stillform_morning_start") || "270"); } catch { return 270; } })();
                    const eveningMin = (() => { try { return parseInt(localStorage.getItem("stillform_evening_start") || "1080"); } catch { return 1080; } })();
                    const toTime = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
                    const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
                    return (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "12px 16px" }}>
                          <div style={{ fontSize: 13, color: "var(--text)" }}>Morning starts</div>
                          <input type="time" value={toTime(morningMin)} onChange={e => { try { localStorage.setItem("stillform_morning_start", String(toMin(e.target.value))); refreshSettings(); } catch {} }} style={{ background: "transparent", border: "1px solid var(--border)", borderRadius: 8, padding: "4px 8px", color: "var(--amber)", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }} />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "12px 16px" }}>
                          <div style={{ fontSize: 13, color: "var(--text)" }}>Evening starts</div>
                          <input type="time" value={toTime(eveningMin)} onChange={e => { try { localStorage.setItem("stillform_evening_start", String(toMin(e.target.value))); refreshSettings(); } catch {} }} style={{ background: "transparent", border: "1px solid var(--border)", borderRadius: 8, padding: "4px 8px", color: "var(--amber)", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }} />
                        </div>
                      </div>
                    );
                  })()}
                  {/* Reminder toggle */}
                  {(() => {
                    const reminderOn = (() => { try { return localStorage.getItem("stillform_reminder") === "on"; } catch { return false; } })();
                    const reminderTime = (() => { try { return localStorage.getItem("stillform_reminder_time") || "08:00"; } catch { return "08:00"; } })();
                    const [rHour, rMin] = reminderTime.split(":").map(Number);
                    return (
                      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
                        <div style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ fontSize: 14, color: "var(--text)" }}>Daily check-in reminder</div>
                            <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>
                              {reminderOn ? `Scheduled · ${reminderTime}` : "Off"}
                            </div>
                          </div>
                          <button onClick={() => { try { const current = localStorage.getItem("stillform_reminder") === "on"; localStorage.setItem("stillform_reminder", current ? "off" : "on"); if (!current) scheduleReminder("Stillform", "Time to check in. How steady are you?", rHour, rMin); refreshSettings(); } catch {} }} style={{
                            background: reminderOn ? "var(--amber)" : "var(--border)",
                            border: "none", borderRadius: "var(--r-lg)", width: 44, height: 24, cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0
                          }}>
                            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "white", position: "absolute", top: 3, left: reminderOn ? 23 : 3, transition: "left 0.2s" }} />
                          </button>
                        </div>
                        <div style={{ padding: "10px 18px", borderTop: "0.5px solid var(--border)", fontSize: 11, color: "var(--text-muted)", lineHeight: 1.6 }}>
                          Mobile push notification support depends on device/browser permissions and native shell capabilities.
                        </div>
                        {reminderOn && (
                          <div style={{ padding: "12px 18px", borderTop: "0.5px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Time</div>
                            <input type="time" defaultValue={reminderTime} onChange={e => { try { localStorage.setItem("stillform_reminder_time", e.target.value); const [h, m] = e.target.value.split(":").map(Number); scheduleReminder("Stillform", "Time to check in. How steady are you?", h, m); refreshSettings(); } catch {} }} style={{ background: "var(--surface2)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "6px 10px", color: "var(--text)", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
                    </div>
                  )}
                </div>
                {/* Re-run calibration */}
                <div style={{ marginBottom: 10, padding: "8px 0", borderBottom: "0.5px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button onClick={() => { try { localStorage.removeItem("stillform_regulation_type"); localStorage.removeItem("stillform_signal_profile"); localStorage.removeItem("stillform_bias_profile"); localStorage.removeItem("stillform_bio_filter"); } catch {} setRegType(null); beginCalibrationFlow({ bridgeOrigin: "settings" }); }} style={{
                    width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    display: "flex", justifyContent: "space-between", alignItems: "center"
                  }}>
                    <span style={{ fontSize: 13, color: "var(--text)" }}>Re-run calibration</span>
                    <span style={{ color: "var(--amber)", fontSize: 12 }}>→</span>
                  </button>
                </div>

                {/* Replay setup bridge */}
                <div style={{ marginBottom: 10, padding: "8px 0", borderBottom: "0.5px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button onClick={() => openSetupBridge("settings")} style={{
                    width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    display: "flex", justifyContent: "space-between", alignItems: "center"
                  }}>
                    <span style={{ fontSize: 13, color: "var(--text)" }}>Replay setup bridge</span>
                    <span style={{ color: "var(--amber)", fontSize: 12 }}>→</span>
                  </button>
                </div>

              </>)}
            </div>

            {/* ACCOUNT */}
            <div style={{ marginBottom: 28 }}>
              <button onClick={() => toggleSettingsSection("account")} style={{
                width: "100%", background: "none", border: "none", padding: "0 0 10px",
                display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer"
              }}>
                <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)" }}>Account</span>
                <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{settingsSectionOpen.account ? "▾" : "▸"}</span>
              </button>
              {settingsSectionOpen.account && (<>
                {syncSignedIn ? (
                  <div>
                    <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 8 }}>
                      Signed in as <span style={{ color: "var(--amber)" }}>{sbGetUser()?.email}</span>
                    </div>

                                        {/* Subscription — collapsible */}
                    <div style={{ marginBottom: 10 }}>
                      <button onClick={() => toggleSubOpen("subscriptionStatus")} style={{
                        width: "100%", background: "none", border: "none", padding: "8px 0",
                        display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
                        borderBottom: "0.5px solid var(--border)"
                      }}>
                        <span style={{ fontSize: 13, color: "var(--text)" }}>Subscription</span>
                        <span style={{ color: "var(--text-muted)", fontSize: 11 }}>{settingsSubOpen.subscriptionStatus ? "▾" : "▸"}</span>
                      </button>
                      {settingsSubOpen.subscriptionStatus && (
                        <div style={{ marginTop: 10 }}>
                          {isSubscribed ? (
                            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "14px 18px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ fontSize: 13, color: "var(--text)" }}>Status</div>
                                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)" }}>Active</div>
                              </div>
                              {syncSignedIn && sbGetUser()?.email && (
                                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>{sbGetUser().email}</div>
                              )}
                            </div>
                          ) : (
                            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "14px 18px" }}>
                              <div style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6, marginBottom: 12 }}>
                                No active subscription found on this device.
                              </div>
                              <button
                                className="btn btn-ghost"
                                style={{ fontSize: 13, width: "100%" }}
                                onClick={refreshSubscriptionStatus}
                                disabled={subscriptionStatusLoading}
                              >
                                {subscriptionStatusLoading ? "Checking..." : "Restore purchase"}
                              </button>
                              {subscriptionStatusMessage && (
                                <div style={{ marginTop: 8, fontSize: 11, color: "var(--amber)" }}>{subscriptionStatusMessage}</div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                                        {/* Cloud Sync — collapsible */}
                    <div style={{ marginBottom: 10 }}>
                      <button onClick={() => toggleSubOpen("syncControls")} style={{
                        width: "100%", background: "none", border: "none", padding: "8px 0",
                        display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
                        borderBottom: "0.5px solid var(--border)"
                      }}>
                        <span style={{ fontSize: 13, color: "var(--text)" }}>Cloud Sync</span>
                        <span style={{ color: "var(--text-muted)", fontSize: 11 }}>{settingsSubOpen.syncControls ? "▾" : "▸"}</span>
                      </button>
                      {settingsSubOpen.syncControls && (
                        <div style={{ marginTop: 10 }}>
                          {/* Cloud sync controls */}
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
                      Your data is encrypted before upload and backed up to cloud. Automatic sync runs in supported flows, and you can always tap Sync now.
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 12 }}>
                      Restore works when this device has the original encryption key. On a different device, some encrypted items may not decrypt.
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                      <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={async () => {
                        setSyncLoading(true); setSyncError(null); setSyncSuccess(null);
                        try {
                          const r = await sbSyncUp();
                          setSyncFeedbackWithClear(r.ok ? "success" : "error", r.ok ? `Synced ${r.uploaded} items ✓` : `Synced ${r.uploaded} — ${r.errors?.length || 0} failed. Retry.`);
                        } catch { setSyncFeedbackWithClear("error", "Sync failed. Check connection."); }
                        setSyncLoading(false);
                      }}>
                        {syncLoading ? "Syncing..." : "Sync now"}
                      </button>
                      <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={async () => {
                        setSyncLoading(true); setSyncError(null); setSyncSuccess(null);
                        try {
                          const r = await sbSyncDown();
                          const restoreIssueCount = (r?.errors?.length || 0) + (r?.undecryptable || 0);
                          setSyncFeedbackWithClear(r?.ok ? "success" : "error", r?.ok ? `Restored ${r.restored || 0} items from cloud ✓` : `Restore completed with issues (${restoreIssueCount}).${r?.undecryptable ? ` ${r.undecryptable} item(s) couldn't be decrypted on this device.` : ""}`);
                          rehydrateAfterSync();
                          try {
                            const onboarded = localStorage.getItem("stillform_onboarded") === "yes";
                            const regType = localStorage.getItem("stillform_regulation_type");
                            if (onboarded && regType) { goHomeSafely(); }
                          } catch {}
                        } catch { setSyncFeedbackWithClear("error", "Restore failed. Check connection."); }
                        setSyncLoading(false);
                      }}>
                        {syncLoading ? "Restoring..." : "Restore now"}
                      </button>
                    </div>
                    {syncSuccess && <div style={{ fontSize: 12, color: "#4caf50", marginBottom: 8 }}>{syncSuccess}</div>}
                    {syncError && <div style={{ fontSize: 12, color: "#e05", marginBottom: 8 }}>{syncError}</div>}
                        </div>
                      )}
                    </div>
                    {/* Sign out — always visible when signed in */}
                    {syncSignedIn && (
                      <button className="btn btn-ghost" style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8, width: "100%", textAlign: "left" }} onClick={async () => { await sbSignOut(); setSyncSignedIn(false); setSyncSuccess(null); setSyncError(null); }}>
                        Sign out
                      </button>
                    )}
                    {/* Biometric lock — native only */}
                    {isNative() && (() => {
                      const bioOn = (() => { try { return localStorage.getItem("stillform_biometric_enabled") === "yes"; } catch { return false; } })();
                      return (
                        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                          <div>
                            <div style={{ fontSize: 14, color: "var(--text)" }}>🔒 Biometric lock</div>
                            <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>Require Face ID or fingerprint for Reframe and My Progress. Syncs across devices — each device uses its own biometric.</div>
                          </div>
                          <button onClick={() => { biometric.setEnabled(!bioOn); refreshSettings(); }} style={{
                            background: bioOn ? "var(--amber)" : "var(--border)",
                            border: "none", borderRadius: "var(--r-lg)", width: 44, height: 24, cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0
                          }}>
                            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "white", position: "absolute", top: 3, left: bioOn ? 23 : 3, transition: "left 0.2s" }} />
                          </button>
                        </div>
                      );
                    })()}


                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>
                      Back up encrypted data from this device. Your data is encrypted before it leaves your device — we can't read it. Restore on a different device may be limited if the original encryption key is unavailable.
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                      <input type="email" placeholder="Email" value={syncEmail} onChange={e => setSyncEmail(e.target.value)}
                        style={{ background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "10px 14px", fontSize: 14, color: "var(--text)", fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
                      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                        <input type={showSyncPassword ? "text" : "password"} placeholder="Password" value={syncPassword} onChange={e => setSyncPassword(e.target.value)}
                          style={{ background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "10px 40px 10px 14px", fontSize: 14, color: "var(--text)", fontFamily: "'DM Sans', sans-serif", outline: "none", width: "100%" }} />
                        <button onClick={() => setShowSyncPassword(p => !p)} style={{ position: "absolute", right: 10, background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans', sans-serif", padding: 0 }}>
                          {showSyncPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                      {syncError && <div style={{ fontSize: 12, color: "#e05" }}>{syncError}</div>}
                      {syncAuthCooldownSeconds > 0 && (
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                          Too many attempts. Please wait {syncAuthCooldownSeconds}s before trying again.
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn btn-primary" style={{ fontSize: 14, flex: 1 }} onClick={async () => {
                        if (!syncEmail || !syncPassword) { setSyncError("Enter email and password."); return; }
                        if (syncAuthCooldownSeconds > 0) { setSyncError(`Please wait ${syncAuthCooldownSeconds}s, then try again.`); return; }
                        setSyncLoading(true); setSyncError(null);
                        try {
                          let signedIn = false; let signInError = null;
                          try { await sbSignIn(syncEmail, syncPassword); if (sbIsSignedIn()) { await sbSyncDown(); rehydrateAfterSync(); signedIn = true; } } catch (e) { signInError = e; }
                          if (!signedIn) {
                            if (isRateLimitedMessage(signInError?.message)) { startSyncAuthCooldown(signInError?.message); throw signInError; }
                            if (isInvalidCredentialsMessage(signInError?.message)) { throw new Error("Incorrect email or password. Please try again."); }
                            try { await sbSignUp(syncEmail, syncPassword); } catch (signupErr) {
                              if (isAlreadyRegisteredMessage(signupErr?.message) || isAlreadyRegisteredMessage(signInError?.message)) { throw new Error("Incorrect email or password. Please try again."); }
                              throw signupErr;
                            }
                            if (!sbIsSignedIn()) { setSyncError("Check your email to confirm your account, then sign in."); setSyncLoading(false); return; }
                            await sbCreateProfile(); await sbSyncUp(); signedIn = true;
                          }
                          if (signedIn) {
                            try { await fetch(`${NETLIFY_BASE}/.netlify/functions/subscription-link-account`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${sbGetSession()?.access_token || ""}` }, body: JSON.stringify({ install_id: getOrCreateInstallId() }) }); } catch {}
                            try {
                              const pending = JSON.parse(localStorage.getItem("stillform_checkout_after_login") || "null");
                              const isFreshPending = pending?.createdAt && (Date.now() - pending.createdAt) < (10 * 60 * 1000);
                              if (isFreshPending) { if (pending.pricingPlan === "annual" || pending.pricingPlan === "monthly") { setPricingPlan(pending.pricingPlan); } localStorage.removeItem("stillform_checkout_after_login"); setTimeout(() => checkoutToLemon(), 200); }
                            } catch {}
                            setSyncSignedIn(true); setSyncAuthCooldownUntil(0); setSubscriptionCheckTick(n => n + 1); setSyncEmail(""); setSyncPassword(""); refreshSettings();
                          }
                        } catch (e) {
                          const msg = e?.message || "Something went wrong. Check your details.";
                          if (isRateLimitedMessage(msg)) startSyncAuthCooldown(msg);
                          setSyncError(msg);
                        }
                        setSyncLoading(false);
                      }}>
                        {syncLoading ? "Please wait..." : (syncAuthCooldownSeconds > 0 ? `Wait ${syncAuthCooldownSeconds}s` : "Sign in / Create account")}
                      </button>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>
                      New to Stillform? Enter your email and a password — your account is created automatically.
                    </div>
                  </div>
                )}
              </>)}
            </div>

            {/* INTEGRATIONS */}
            <div style={{ marginBottom: 28 }}>
              <button onClick={() => toggleSettingsSection("integrations")} style={{
                width: "100%", background: "none", border: "none", padding: "0 0 10px",
                display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer"
              }}>
                <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)" }}>Integrations</span>
                <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{settingsSectionOpen.integrations ? "▾" : "▸"}</span>
              </button>
              {settingsSectionOpen.integrations && (
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "14px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ fontSize: 13, color: "var(--text)" }}>Calendar context</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: integrationSignalColor("calendar", !!integrationContext.calendar) }}>
                    {integrationSignalLabel("calendar", !!integrationContext.calendar, `${integrationContext.calendar?.source || "none"} · ${integrationContext.calendar?.freshness || "Unknown"}`)}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "var(--text-dim)", lineHeight: 1.6, marginBottom: 12 }}>
                  {integrationContext.calendar
                    ? integrationContext.calendar.summary
                    : (integrationsSupportedOnPlatform
                        ? "No calendar context available yet. When connected, Morning and Reframe use upcoming context to reduce manual input."
                        : (nativePlatform === "android"
                            ? "Calendar integration available on Android. Grant permission in phone Settings > Apps > Stillform > Permissions."
                            : "Calendar integration requires the native Android app."))}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Consent</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: integrationContext.calendarConsent === "granted" ? "var(--amber)" : "var(--text-muted)" }}>
                    {integrationContext.calendarConsent || "pending"}
                  </div>
                </div>
                {integrationContext.calendarConsent === "revoked" && <div style={{ marginBottom: 10, fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}>Calendar access is revoked. Re-enable to let Stillform use upcoming schedule context.</div>}
                {integrationContext.calendarError && <div style={{ marginBottom: 10, fontSize: 11, color: "#c05040", lineHeight: 1.5 }}>Calendar error: {integrationContext.calendarError}</div>}
                {integrationContext.calendarLastRetryAt && <div style={{ marginBottom: 10, fontSize: 10, color: "var(--text-muted)" }}>Calendar retry queued: {new Date(integrationContext.calendarLastRetryAt).toLocaleString()}</div>}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ fontSize: 13, color: "var(--text)" }}>Health context</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: integrationSignalColor("health", !!integrationContext.health) }}>
                    {integrationSignalLabel("health", !!integrationContext.health, `${integrationContext.health?.source || "none"} · ${integrationContext.health?.freshness || "Unknown"}`)}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "var(--text-dim)", lineHeight: 1.6 }}>
                  {integrationContext.health
                    ? integrationContext.health.summary
                    : (integrationsSupportedOnPlatform
                        ? "No health context available yet. When connected, Reframe uses sleep/readiness context to tune prompts."
                        : (nativePlatform === "android"
                            ? "Health Connect integration available on Android. Grant permission in Health Connect app > App permissions > Stillform."
                            : "Health integration requires the native Android app."))}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, marginBottom: 10 }}>
                  <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Consent</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: integrationContext.healthConsent === "granted" ? "var(--amber)" : "var(--text-muted)" }}>
                    {integrationContext.healthConsent || "pending"}
                  </div>
                </div>
                {integrationContext.healthConsent === "revoked" && <div style={{ marginBottom: 10, fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}>Health access is revoked. Re-enable to let Stillform use sleep/readiness context.</div>}
                {integrationContext.healthError && <div style={{ marginBottom: 10, fontSize: 11, color: "#c05040", lineHeight: 1.5 }}>Health error: {integrationContext.healthError}</div>}
                {integrationContext.healthLastRetryAt && <div style={{ marginBottom: 10, fontSize: 10, color: "var(--text-muted)" }}>Health retry queued: {new Date(integrationContext.healthLastRetryAt).toLocaleString()}</div>}
                {!integrationsSupportedOnPlatform && (
                  <div style={{ marginTop: 12, marginBottom: 6, fontSize: 11, color: "var(--text-dim)", lineHeight: 1.5 }}>
                    {"Calendar and Health Connect integrations require the native Android app. Install from the Play Store and grant permissions here to enable them."}
                  </div>
                )}
                <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button className="btn btn-ghost" style={{ fontSize: 12, padding: "8px 12px" }} onClick={() => { refreshSettings(); setIntegrationStatusWithClear("Integration status refreshed."); }}>Refresh status</button>
                  <button className="btn btn-ghost" style={{ fontSize: 12, padding: "8px 12px", color: "var(--text-muted)" }} onClick={clearIntegrationContextCache} disabled={!integrationContext.hasAny}>Clear stale context</button>
                  {integrationsSupportedOnPlatform && (<>
                    <button className="btn btn-ghost" style={{ fontSize: 12, padding: "8px 12px" }} onClick={async () => {
                      const r = await integrationBridge.requestCalendarPermission();
                      if (r?.granted) {
                        void syncIntegrationContext("calendar", { source: "connect" });
                      } else if (r?.status === "requested") {
                        // Wait for user to respond to dialog then sync
                        setTimeout(() => void syncIntegrationContext("calendar", { source: "connect" }), 2000);
                      }
                    }}>Connect calendar</button>
                    <button className="btn btn-ghost" style={{ fontSize: 12, padding: "8px 12px" }} onClick={async () => {
                      await integrationBridge.requestHealthPermission();
                      setIntegrationActionStatus("Grant Stillform access in Health Connect, then tap 'Sync health now'");
                      setTimeout(() => setIntegrationActionStatus(""), 8000);
                    }}>Connect health</button>
                    <button className="btn btn-ghost" style={{ fontSize: 12, padding: "8px 12px" }} onClick={() => retryIntegrationContext("calendar")}>Sync calendar now</button>
                    <button className="btn btn-ghost" style={{ fontSize: 12, padding: "8px 12px" }} onClick={() => retryIntegrationContext("health")}>Sync health now</button>
                  </>)}
                  <button className="btn btn-ghost" style={{ fontSize: 12, padding: "8px 12px", color: "var(--text-muted)" }} onClick={() => setIntegrationConsent("calendar", "revoked")} disabled={!integrationContext.calendarConsent || integrationContext.calendarConsent === "pending"}>Revoke calendar</button>
                  <button className="btn btn-ghost" style={{ fontSize: 12, padding: "8px 12px", color: "var(--text-muted)" }} onClick={() => setIntegrationConsent("health", "revoked")} disabled={!integrationContext.healthConsent || integrationContext.healthConsent === "pending"}>Revoke health</button>
                  <button className="btn btn-ghost" style={{ fontSize: 12, padding: "8px 12px", color: "var(--text-muted)" }} onClick={() => clearIntegrationError("calendar")} disabled={!integrationContext.calendarError}>Clear calendar error</button>
                  <button className="btn btn-ghost" style={{ fontSize: 12, padding: "8px 12px", color: "var(--text-muted)" }} onClick={() => clearIntegrationError("health")} disabled={!integrationContext.healthError}>Clear health error</button>
                </div>
                {integrationContext.hasStale && <div style={{ marginTop: 10, fontSize: 11, color: "#c05040", lineHeight: 1.5 }}>One or more integration signals are stale. Stillform will continue in manual mode until context is refreshed.</div>}
                {integrationActionStatus && <div style={{ marginTop: 8, fontSize: 11, color: "var(--amber)" }}>{integrationActionStatus}</div>}
              </div>
              )}
            </div>

            {/* DATA MANAGEMENT */}
            <div style={{ marginBottom: 28 }}>
              <button onClick={() => toggleSettingsSection("data")} style={{
                width: "100%", background: "none", border: "none", padding: "0 0 10px",
                display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer"
              }}>
                <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)" }}>Data Management</span>
                <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{settingsSectionOpen.data ? "▾" : "▸"}</span>
              </button>
              {settingsSectionOpen.data && (<>

                {/* Your Logs sub-group */}
                <div style={{ fontSize: 9, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10 }}>Your Logs</div>

                {/* Session history */}
                <button onClick={() => setOpenLog(openLog === "sessions" ? null : "sessions")} style={{
                  width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                  padding: "14px 18px", marginBottom: 6, cursor: "pointer", textAlign: "left",
                  fontFamily: "'DM Sans', sans-serif", display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <div>
                    <div style={{ fontSize: 14, color: "var(--text)" }}>Session history</div>
                    <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{getSessionCountFromStorage()} sessions</div>
                  </div>
                  <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{openLog === "sessions" ? "▾" : "▸"}</span>
                </button>
                {openLog === "sessions" && (() => {
                  try {
                    const sessions = getSessionsFromStorage().slice().reverse();
                    if (sessions.length === 0) return <div style={{ fontSize: 12, color: "var(--text-muted)", padding: "8px 18px" }}>No sessions yet.</div>;
                    const toolLabel = { breathe: "Breathe", "body-scan": "Body Scan", reframe: "Reframe" };
                    return (
                      <div style={{ maxHeight: 300, overflowY: "auto", marginBottom: 8 }}>
                        {sessions.map((s, i) => {
                          const d = s.timestamp ? new Date(s.timestamp) : null;
                          const dur = s.duration ? Math.round(s.duration / 1000) : 0;
                          const durStr = dur >= 60 ? `${Math.floor(dur / 60)}m ${dur % 60}s` : `${dur}s`;
                          return (
                            <div key={i} style={{ padding: "8px 18px", borderBottom: "1px solid var(--border)", fontSize: 12 }}>
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "var(--text-dim)" }}>{d ? d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</span>
                                <span style={{ color: "var(--text-muted)" }}>{d ? d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : ""}</span>
                              </div>
                              <div style={{ color: "var(--text)", marginTop: 2 }}>{(s.tools || []).map(t => toolLabel[t] || t).join(", ") || "Session"} · {durStr}</div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  } catch { return null; }
                })()}

                {/* Pulse */}
                <button onClick={() => setOpenLog(openLog === "journal" ? null : "journal")} style={{
                  width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                  padding: "14px 18px", marginBottom: 6, cursor: "pointer", textAlign: "left",
                  fontFamily: "'DM Sans', sans-serif", display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <div>
                    <div style={{ fontSize: 14, color: "var(--text)" }}>Pulse</div>
                    <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{(() => { try { return JSON.parse(localStorage.getItem("stillform_journal") || "[]").length; } catch { return 0; } })()} entries</div>
                  </div>
                  <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{openLog === "journal" ? "▾" : "▸"}</span>
                </button>
                {openLog === "journal" && (() => {
                  try {
                    const entries = JSON.parse(localStorage.getItem("stillform_journal") || "[]");
                    if (entries.length === 0) return <div style={{ fontSize: 12, color: "var(--text-muted)", padding: "8px 18px" }}>No signal entries yet.</div>;
                    return (
                      <div style={{ maxHeight: 300, overflowY: "auto", marginBottom: 8 }}>
                        {entries.map((e, i) => (
                          <div key={i} style={{ padding: "10px 18px", borderBottom: "1px solid var(--border)", fontSize: 12 }}>
                            <div style={{ color: "var(--text-dim)", marginBottom: 4 }}>{e.date || "—"}</div>
                            {e.emotions?.length > 0 && <div style={{ color: "var(--amber)", marginBottom: 4 }}>{e.emotions.join(", ")}</div>}
                            <div style={{ color: "var(--text)", lineHeight: 1.5 }}>{e.text || e.trigger || "—"}</div>
                            {e.body && <div style={{ color: "var(--text-dim)", marginTop: 4, fontStyle: "italic" }}>Body: {e.body}</div>}
                            {e.outcome && <div style={{ color: "var(--text-dim)", marginTop: 2, fontStyle: "italic" }}>Outcome: {e.outcome}</div>}
                          </div>
                        ))}
                      </div>
                    );
                  } catch { return null; }
                })()}

                {/* Saved reframes */}
                <button onClick={() => setOpenLog(openLog === "reframes" ? null : "reframes")} style={{
                  width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                  padding: "14px 18px", marginBottom: 6, cursor: "pointer", textAlign: "left",
                  fontFamily: "'DM Sans', sans-serif", display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <div>
                    <div style={{ fontSize: 14, color: "var(--text)" }}>Saved reframes</div>
                    <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{(() => { try { return JSON.parse(localStorage.getItem("stillform_saved_reframes") || "[]").length; } catch { return 0; } })()} saved</div>
                  </div>
                  <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{openLog === "reframes" ? "▾" : "▸"}</span>
                </button>
                {openLog === "reframes" && (() => {
                  try {
                    const saved = JSON.parse(localStorage.getItem("stillform_saved_reframes") || "[]");
                    if (saved.length === 0) return <div style={{ fontSize: 12, color: "var(--text-muted)", padding: "8px 18px" }}>No saved reframes yet.</div>;
                    const modeLabel = { calm: "Talk it through", clarity: "Break the loop", hype: "Get ready" };
                    return (
                      <div style={{ maxHeight: 300, overflowY: "auto", marginBottom: 8 }}>
                        {saved.map((r, i) => (
                          <div key={i} style={{ padding: "10px 18px", borderBottom: "1px solid var(--border)", fontSize: 12 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                              <span style={{ color: "var(--amber)" }}>{modeLabel[r.mode] || "Reframe"}</span>
                              {r.distortion && <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>{r.distortion}</span>}
                            </div>
                            <div style={{ color: "var(--text)", lineHeight: 1.5 }}>{r.text || r.reframe || "—"}</div>
                          </div>
                        ))}
                      </div>
                    );
                  } catch { return null; }
                })()}

                {/* Signal profile */}
                <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "14px 18px", marginBottom: 20 }}>
                  <div style={{ fontSize: 14, color: "var(--text)", marginBottom: 4 }}>Signal profile</div>
                  <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
                    {(() => { try { const s = JSON.parse(localStorage.getItem("stillform_signal_profile") || "{}"); return Object.keys(s).length > 0 ? "Configured" : "Not set up yet — find Signal Mapping in Personalization"; } catch { return "Not set up yet"; } })()}
                  </div>
                </div>

                {/* Divider */}
                <div style={{ borderTop: "0.5px solid var(--border)", marginBottom: 16 }} />

                                {/* App Diagnostics — collapsible */}
                <div style={{ marginBottom: 10 }}>
                  <button onClick={() => toggleSubOpen("metrics")} style={{
                    width: "100%", background: "none", border: "none", padding: "8px 0",
                    display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
                    borderBottom: "0.5px solid var(--border)"
                  }}>
                    <span style={{ fontSize: 13, color: "var(--text)" }}>App Diagnostics</span>
                    <span style={{ color: "var(--text-muted)", fontSize: 11 }}>{settingsSubOpen.metrics ? "▾" : "▸"}</span>
                  </button>
                  {settingsSubOpen.metrics && (
                    <div style={{ marginTop: 10 }}>
                      {/* App Diagnostics */}
                <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "12px 16px", marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 13, color: "var(--text)" }}>App diagnostics (counts + rates only)</div>
                      <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>
                        Enabled by default. Sends aggregate usage metrics only. Never sends journal text, AI conversation content, or free-form notes.
                      </div>
                    </div>
                    <button onClick={() => setMetricsOptIn((value) => !value)} style={{
                      background: metricsOptIn ? "var(--amber-glow)" : "var(--surface)",
                      border: `1px solid ${metricsOptIn ? "var(--amber-dim)" : "var(--border)"}`,
                      color: metricsOptIn ? "var(--amber)" : "var(--text-muted)",
                      borderRadius: "var(--r)", padding: "8px 10px", fontSize: 11, cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif", flexShrink: 0
                    }}>
                      {metricsOptIn ? "On" : "Off"}
                    </button>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>
                    {metricsLastSentAt ? `Last sent: ${new Date(metricsLastSentAt).toLocaleString()}` : "Last sent: not yet"}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
                    Disclosure is documented in Privacy &amp; Disclaimers and must stay aligned with the full Privacy Policy.
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
                    <button onClick={() => pushMetricsSnapshot({ source: "manual" })} disabled={!metricsOptIn || !metricsAuthToken || metricsUploading} style={{
                      width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r)",
                      padding: "10px 12px", textAlign: "left", cursor: (!metricsOptIn || !metricsAuthToken || metricsUploading) ? "not-allowed" : "pointer",
                      color: "var(--text)", fontSize: 12, opacity: (!metricsOptIn || !metricsAuthToken || metricsUploading) ? 0.55 : 1, fontFamily: "'DM Sans', sans-serif"
                    }}>
                      {metricsUploading ? "Sending..." : "Send to Stillform"}
                    </button>
                    <button onClick={copyMetricsSnapshot} style={{
                      width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r)",
                      padding: "10px 12px", textAlign: "left", cursor: "pointer", color: "var(--text)", fontSize: 12, fontFamily: "'DM Sans', sans-serif"
                    }}>
                      Copy diagnostic snapshot (JSON)
                    </button>
                  </div>
                  {!metricsAuthToken && <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>Sign in to Cloud Sync to send metrics.</div>}
                </div>
                    </div>
                  )}
                </div>
                                {/* Download My Data — collapsible */}
                <div style={{ marginBottom: 10 }}>
                  <button onClick={() => toggleSubOpen("exports")} style={{
                    width: "100%", background: "none", border: "none", padding: "8px 0",
                    display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
                    borderBottom: "0.5px solid var(--border)"
                  }}>
                    <span style={{ fontSize: 13, color: "var(--text)" }}>Download My Data</span>
                    <span style={{ color: "var(--text-muted)", fontSize: 11 }}>{settingsSubOpen.exports ? "▾" : "▸"}</span>
                  </button>
                  {settingsSubOpen.exports && (
                    <div style={{ marginTop: 10 }}>
                      {/* Download My Data */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
                  <button onClick={exportPulseLogPdf} style={{
                    width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                    padding: "12px 16px", textAlign: "left", cursor: "pointer", color: "var(--text)", fontSize: 13, fontFamily: "'DM Sans', sans-serif"
                  }}>
                    <div style={{ fontSize: 13, color: "var(--text)" }}>Download pulse log (PDF)</div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>Opens a printable document for Save as PDF.</div>
                  </button>
                  <button onClick={exportSessionHistoryCsv} style={{
                    width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                    padding: "12px 16px", textAlign: "left", cursor: "pointer", color: "var(--text)", fontSize: 13, fontFamily: "'DM Sans', sans-serif"
                  }}>
                    <div style={{ fontSize: 13, color: "var(--text)" }}>Download session history (CSV)</div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>Structured session data for personal review or provider share.</div>
                  </button>
                </div>
                {exportStatus && <div style={{ fontSize: 11, color: "var(--amber)", marginBottom: 8 }}>{exportStatus}</div>}
                {metricsStatus && <div style={{ fontSize: 11, color: "var(--amber)", marginBottom: 8 }}>{metricsStatus}</div>}
                    </div>
                  )}
                </div>
                {/* Delete */}
                <button onClick={async () => {
                  if (window.confirm("Are you sure? This will permanently delete ALL your data — sessions, pulse log, conversations, signal profile, check-ins, and saved reframes. This cannot be undone.")) {
                    const typed = window.prompt("To confirm deletion, type DELETE below:");
                    if (typed === "DELETE") {
                      try {
                        try { await sbDeleteCloudData().catch(() => {}); } catch {}
                        try { await sbSignOut().catch(() => {}); } catch {}
                        try { sbClearSession(); } catch {}
                        setSyncSignedIn(false); setSyncSuccess(null); setSyncError(null);
                        const keysToRemove = ["stillform_sessions","stillform_signal_profile","stillform_saved_reframes","stillform_reframe_session_calm","stillform_reframe_session_clarity","stillform_reframe_session_hype","stillform_reframe_last_mode","stillform_reframe_entry_mode","stillform_reframe_entry_protocol","stillform_reframe_prefill","stillform_journal","stillform_focus_check_history","stillform_communication_events","stillform_tool_debriefs","stillform_ai_session_notes","stillform_bias_profile","stillform_regulation_type","stillform_breath_pattern","stillform_ai_tone","stillform_theme","stillform_scan_pace","stillform_audio","stillform_sound_type","stillform_screenlight","stillform_reducedmotion","stillform_visual_grounding","stillform_grounding_data","stillform_bio_filter","stillform_morning_start","stillform_evening_start","stillform_reminder","stillform_reminder_time","stillform_tooltip_home_seen","stillform_tooltips_reframe_seen","stillform_outcome_focus","stillform_session_entry_context","stillform_checkout_after_login","stillform_sb_sync_version","stillform_qb_position","stillform_milestone_7_seen","stillform_trial_start","stillform_subscribed","stillform_checkin_today","stillform_checkin_open_history","stillform_checkin_history","stillform_eod_open_history","stillform_eod_history","stillform_eod_today","stillform_loop_nudge_events","stillform_loop_nudge_dismissed_day","stillform_loop_nudge_dismiss_streak",METRICS_OPT_IN_KEY,METRICS_LAST_SENT_DAY_KEY,METRICS_LAST_SENT_AT_KEY,"stillform_onboarded",FIRST_RUN_STAGE_KEY,"stillform_sb_session","stillform_app_version","stillform_install_id"];
                        keysToRemove.forEach(key => localStorage.removeItem(key));
                        Object.keys(localStorage).forEach((key) => { if (key.startsWith("stillform_")) localStorage.removeItem(key); });
                        window.location.reload();
                      } catch {}
                    }
                  }
                }} style={{
                  background: "none", border: "none", padding: "8px 0", fontSize: 11,
                  color: "rgba(200,80,80,0.4)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  marginTop: 16, letterSpacing: "0.04em"
                }}>
                  Delete all data
                </button>

              </>)}
            </div>

            {/* MORE */}
            <div style={{ marginBottom: 28 }}>
              <button onClick={() => toggleSettingsSection("more")} style={{
                width: "100%", background: "none", border: "none", padding: "0 0 10px",
                display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer"
              }}>
                <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)" }}>More</span>
                <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{settingsSectionOpen.more ? "▾" : "▸"}</span>
              </button>
              {settingsSectionOpen.more && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button onClick={() => setScreen("privacy")} style={{
                  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                  padding: "12px 16px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <span style={{ fontSize: 13, color: "var(--text)" }}>Privacy &amp; Disclaimers</span>
                  <span style={{ color: "var(--amber)", fontSize: 12 }}>→</span>
                </button>
                <a href="mailto:ARAembersllc@proton.me" style={{
                  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                  padding: "12px 16px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  textDecoration: "none"
                }}>
                  <span style={{ fontSize: 13, color: "var(--text)" }}>Contact us</span>
                  <span style={{ color: "var(--amber)", fontSize: 12 }}>→</span>
                </a>
                <button onClick={() => openTutorial("settings")} style={{
                  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                  padding: "12px 16px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <span style={{ fontSize: 13, color: "var(--text)" }}>Replay tutorial</span>
                  <span style={{ color: "var(--amber)", fontSize: 12 }}>→</span>
                </button>
                {/* Focus Check */}
                <button onClick={() => openFocusCheck("settings")} style={{
                  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                  padding: "14px 18px", textAlign: "left", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <div>
                    <div style={{ fontSize: 14, color: "var(--text)" }}>Run Focus Check (30s)</div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>Quick signal on focus, inhibition, and response control.</div>
                  </div>
                  <span style={{ color: "var(--amber)", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>Open →</span>
                </button>
                <button onClick={() => setSettingsShareQrOpen((prev) => !prev)} style={{
                  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                  padding: "14px 18px", textAlign: "left", cursor: "pointer", color: "var(--text)", fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "space-between"
                }}>
                  <span>Share app link (QR)</span>
                  <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{settingsShareQrOpen ? "▾" : "▸"}</span>
                </button>
                {settingsShareQrOpen && (
                  <div style={{ marginTop: 4, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--amber)" }}>Share Stillform</div>
                      <a href={SHARE_QR_TARGET_URL} target="_blank" rel="noopener noreferrer" style={{ color: "var(--amber)", fontSize: 10, textDecoration: "none", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase" }}>Open link ↗</a>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.55, marginBottom: 10 }}>Use this QR when meeting someone in person.</div>
                    <div style={{ display: "flex", justifyContent: "center", background: "var(--surface2)", border: "0.5px solid var(--border)", borderRadius: "var(--r-sm)", padding: 12 }}>
                      <img src={SHARE_QR_IMAGE_URL} alt={`QR code for ${SHARE_QR_TARGET_URL}`} style={{ width: 180, height: 180, borderRadius: 6, background: "#fff", padding: 8 }} loading="lazy" />
                    </div>
                    <div style={{ marginTop: 8, fontSize: 10, color: "var(--text-muted)", textAlign: "center", wordBreak: "break-all" }}>{SHARE_QR_TARGET_URL}</div>
                  </div>
                )}
              </div>
              )}
            </div>

            <div style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", marginTop: 28, lineHeight: 1.5 }}>
              Stillform · ARA Embers LLC · v{APP_VERSION}<br />
              Build {APP_PACKAGE_VERSION} · {new Date(APP_BUILD_TIME).toISOString().slice(0, 16).replace("T", " ")} UTC
            </div>
          </section>
        )}

        {/* RECONSTRUCTION BANNER */}
        {screen === "home" && (
          <div style={{
            background: "var(--surface)", borderBottom: "0.5px solid var(--amber-dim)",
            padding: "8px 20px", textAlign: "center", fontSize: 11,
            color: "var(--text-dim)", letterSpacing: "0.04em"
          }}>
            <span style={{ color: "var(--amber)", marginRight: 6 }}>◉</span>
            Composure is a practice. You're building it.
          </div>
        )}

        {/* FOOTER — always visible except tool/panic/setup bridge. Active screen link hidden. */}
        {!["tool","panic","setup-bridge"].includes(screen) && (
          <footer className="footer">
            <div className="footer-logo">Stillform</div>
            <div className="footer-links">
              {screen !== "pricing" && screen !== "home" && !isSubscribed && (
                <button onClick={() => setScreen("pricing")}>{syncSignedIn ? "Subscribe" : "Sign In"}</button>
              )}
              {screen !== "settings" && (
                <button onClick={() => setScreen("settings")}>Settings</button>
              )}
              {screen !== "crisis" && (
                <button onClick={() => setScreen("crisis")}>Crisis Resources</button>
              )}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.06em", textAlign: "center" }}>
              Private. No data sold. No noise.
            </div>
            <div className="footer-copy">© 2026 ARA Embers LLC</div>
          </footer>
        )}
      </div>
    </>
    </ErrorBoundary>
  );
}





