import { useState, useEffect, useRef, Component } from "react";
import { WidgetBridge } from "./plugins/widgetBridge";

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
    letter-spacing: 0.14em;
    text-transform: uppercase;
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
    color: #0A0A0C;
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
    height: calc(100vh - 280px);
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

  .btn-send:hover { background: #d9a34a; }
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
    desc: "Smart breathing — the app picks the right pattern for what you're feeling, then grounds you.",
    time: "3 min"
  },
  {
    id: "scan",
    icon: "◉",
    name: "Body Scan",
    desc: "Locate activation and release it with targeted acupressure.",
    time: "10 min"
  },
  {
    id: "reframe",
    icon: "✦",
    name: "Reframe",
    desc: "Talk through what's happening. AI reads exactly what you say and helps you see it differently.",
    time: "Open"
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
    id: "checkin",
    icon: "◈",
    name: "Tension Check",
    desc: "10-second body scan. Are you holding tension you haven't noticed?",
    time: "10 sec",
    level: 2
  },

  {
    id: "bias",
    icon: "⬡",
    name: "Know Your Blind Spots",
    desc: "Learn the thinking patterns that run on autopilot when you're stressed.",
    time: "5 min",
    level: 3
  },
  {
    id: "meta",
    icon: "❖",
    name: "Watch & Choose",
    desc: "Catch the spiral in real time. Name it. Choose your next move.",
    time: "3 min",
    level: 4
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

const setupPushNotifications = async () => {
  if (!isNative()) return;
  try {
    const { PushNotifications } = await import('@capacitor/push-notifications');
    const permission = await PushNotifications.requestPermissions();
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
            schedule: { at: scheduled, repeats: true, every: 'day' },
            sound: undefined,
            smallIcon: 'ic_stat_icon_config_sample',
          }]
        });
      }
    }
  } catch {}
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

  // TIME-TO-REGULATION
  const startTime = useRef(Date.now());
  const saveSession = () => {
    const elapsed = Date.now() - startTime.current;
    const fmt = (ms) => { const s = Math.round(ms / 1000); const m = Math.floor(s / 60); return m > 0 ? `${m}m ${s % 60}s` : `${s % 60}s`; };
    try {
      const sessions = JSON.parse(localStorage.getItem("stillform_sessions") || "[]");
      sessions.push({ timestamp: new Date().toISOString(), duration: elapsed, durationFormatted: fmt(elapsed), tools: ["sigh"], exitPoint: "sigh-complete", source: "sigh" });
      localStorage.setItem("stillform_sessions", JSON.stringify(sessions));
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
    const count = (() => { try { return JSON.parse(localStorage.getItem("stillform_sessions") || "[]").length; } catch { return 0; } })();
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

  // TIME-TO-REGULATION
  const startTime = useRef(Date.now());
  const formatTime = (ms) => {
    const totalSec = Math.round(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return min > 0 ? `${min}m ${sec}s` : `${sec}s`;
  };
  const saveSession = (tools, exitPoint) => {
    const elapsed = Date.now() - startTime.current;
    try {
      const sessions = JSON.parse(localStorage.getItem("stillform_sessions") || "[]");
      sessions.push({ timestamp: new Date().toISOString(), duration: elapsed, durationFormatted: formatTime(elapsed), tools, exitPoint, source: "breathe-ground" });
      localStorage.setItem("stillform_sessions", JSON.stringify(sessions));
    } catch {}
    return elapsed;
  };
  const getSessionCount = () => { try { return JSON.parse(localStorage.getItem("stillform_sessions") || "[]").length; } catch { return 0; } };

  // --- BREATHE ---
  const savedPatternId = (() => { try { return localStorage.getItem("stillform_breath_pattern") || "quick"; } catch { return "quick"; } })();
  const [patternId, setPatternId] = useState(savedPatternId);
  const [showPatternPicker, setShowPatternPicker] = useState(false);
  const pattern = BREATHING_PATTERNS.find(p => p.id === patternId) || BREATHING_PATTERNS[0];
  const phases = pattern.phases;

  const selectPattern = (id) => {
    setPatternId(id);
    try { localStorage.setItem("stillform_breath_pattern", id); } catch {}
    setShowPatternPicker(false);
    setStarted(true);
    setRunning(true);
    watchBridge.startBreathing(id);
  };

  const [started, setStarted] = useState(false);
  const breathPrompts = [
    { id: "quick", label: "Quick reset", desc: "60 seconds. Regulate and get back to it.", why: "Focused breathing slows your system. The shift starts in under a minute." },
    { id: "deep", label: "Deep regulate", desc: "3 minutes. Deeper reset when you have the space.", why: "Extended exhale cycle. Gives your nervous system time to fully downregulate." }
  ];

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

  const circleClass = `breath-circle ${phaseIdx === 0 ? "expand" : phaseIdx === 2 ? "contract" : "hold"}`;
  const progress = ((cycle - 1) * phases.length + phaseIdx) / (totalCycles * phases.length);
  const bgtBreathScale = (phaseIdx === 0 || phaseIdx === 1) ? 1 : 0;
  const bgtVisualGrounding = (() => { try { return localStorage.getItem("stillform_visual_grounding") !== "off"; } catch { return true; } })();

  const groundSavedRef = useRef(false);
  const groundElapsedRef = useRef(0);
  const groundAutoRef = useRef(false);
  if (groundDone) {
    if (!groundSavedRef.current) {
      groundSavedRef.current = true;
      groundElapsedRef.current = saveSession(["breathe", "ground"], "grounding-complete");
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
          <button className="btn btn-primary" onClick={() => onComplete("reframe-calm")}>
            Continue to Reframe →
          </button>
          <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => onComplete()}>
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
        Bio-filter · What is your hardware running right now?
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
            background: audioOn ? "rgba(201,147,58,0.12)" : "var(--surface)",
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
            <button className="btn btn-ghost" onClick={() => { saveSession(["breathe"], "breathing-only"); setPhase("post-rate"); }} style={{ color: "var(--text-dim)", fontSize: 13 }}>
              Stop here
            </button>
          </div>
        </div>
      )}

      {/* POST-RATE */}
      {phase === "post-rate" && (
        <div style={{ maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, marginBottom: 8 }}>
            Where are you now?
          </h2>
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
                  const sessions = JSON.parse(localStorage.getItem("stillform_sessions") || "[]");
                  if (sessions.length > 0) {
                    sessions[sessions.length - 1].preRating = preRating || null;
                    sessions[sessions.length - 1].postRating = n;
                    sessions[sessions.length - 1].delta = delta;
                    localStorage.setItem("stillform_sessions", JSON.stringify(sessions));
                  }
                } catch {}
              }} style={{
                width: 56, height: 56, borderRadius: "50%",
                border: `2px solid ${postRating === n ? "var(--amber)" : "var(--border)"}`,
                background: postRating === n ? "rgba(201,147,58,0.15)" : "var(--surface)",
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
                    <button className="btn btn-ghost" onClick={onComplete}>Done for now</button>
                  </>
                ) : (
                  <>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 8 }}>Stabilized</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", animation: "pulse 1s ease-in-out infinite" }}>
                      Moving to grounding…
                    </div>
                    <button className="btn btn-ghost" onClick={() => onComplete("reframe-calm")} style={{ fontSize: 13 }}>Skip to Reframe instead</button>
                    <button className="btn btn-ghost" onClick={onComplete} style={{ color: "var(--text-muted)", fontSize: 12 }}>Exit session</button>
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
  const formatTime = (ms) => {
    const totalSec = Math.round(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return min > 0 ? `${min}m ${sec}s` : `${sec}s`;
  };
  const saveSession = () => {
    const elapsed = Date.now() - startTime.current;
    try {
      const sessions = JSON.parse(localStorage.getItem("stillform_sessions") || "[]");
      sessions.push({ timestamp: new Date().toISOString(), duration: elapsed, durationFormatted: formatTime(elapsed), tools: ["body-scan"], exitPoint: "scan-complete", source: "body-scan" });
      localStorage.setItem("stillform_sessions", JSON.stringify(sessions));
      try { window.plausible("Body Scan Completed"); } catch {}
    } catch {}
    return elapsed;
  };
  const getSessionCount = () => { try { return JSON.parse(localStorage.getItem("stillform_sessions") || "[]").length; } catch { return 0; } };

  const areas = [
    {
      name: "Jaw & Face",
      prompt: "Unclench your jaw. Let your tongue rest. Soften your eyes.",
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

  const scanSavedRef = useRef(false);
  const scanElapsedRef = useRef(0);
  const scanAutoRef = useRef(false);
  if (done) {
    if (!scanSavedRef.current) { scanSavedRef.current = true; scanElapsedRef.current = saveSession(); }
    if (!scanAutoRef.current) { scanAutoRef.current = true; setTimeout(() => onComplete("reframe-calm"), 2000); }
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
        <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => onComplete()}>Exit session</button>
        
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
              <div className="scan-area-prompt" style={{ marginTop: 8 }}>{a.prompt}</div>
              <div style={{ marginTop: 16, marginBottom: 8, fontSize: 12, color: "var(--text-dim)", letterSpacing: "0.08em" }}>TENSION LEVEL</div>
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
              {/* Acupressure point diagram */}
              <div style={{ display: "flex", justifyContent: "center", marginTop: 16, marginBottom: 8 }}>
                <svg viewBox="0 0 160 160" width="140" height="140" style={{ overflow: "visible" }}>
                  {a.name === "Jaw & Face" && <>
                    {/* Head */}
                    <ellipse cx="80" cy="54" rx="28" ry="34" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
                    {/* Neck */}
                    <line x1="72" y1="86" x2="70" y2="102" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
                    <line x1="88" y1="86" x2="90" y2="102" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
                    {/* Jaw line */}
                    <path d="M55 68 Q80 82 105 68" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>
                    {/* Pressure point — between eyebrows */}
                    <circle cx="80" cy="43" r="5" fill="var(--amber)" opacity="0.9"/>
                    <circle cx="80" cy="43" r="9" fill="none" stroke="var(--amber)" strokeWidth="0.5" opacity="0.3"/>
                    {/* Label */}
                    <text x="80" y="128" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="'IBM Plex Mono', monospace">GV24.5 · between eyebrows</text>
                  </>}

                  {a.name === "Shoulders & Neck" && <>
                    {/* Head */}
                    <circle cx="80" cy="28" r="14" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
                    {/* Neck */}
                    <line x1="75" y1="41" x2="74" y2="54" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
                    <line x1="85" y1="41" x2="86" y2="54" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
                    {/* Shoulders */}
                    <path d="M74 54 Q60 56 38 70" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2"/>
                    <path d="M86 54 Q100 56 122 70" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2"/>
                    {/* Torso top */}
                    <line x1="38" y1="70" x2="42" y2="110" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                    <line x1="122" y1="70" x2="118" y2="110" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                    {/* Pressure point — GB21 left shoulder */}
                    <circle cx="56" cy="62" r="5" fill="var(--amber)" opacity="0.9"/>
                    <circle cx="56" cy="62" r="9" fill="none" stroke="var(--amber)" strokeWidth="0.5" opacity="0.3"/>
                    {/* Label */}
                    <text x="80" y="136" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="'IBM Plex Mono', monospace">GB21 · shoulder well</text>
                  </>}

                  {a.name === "Chest & Breath" && <>
                    {/* Head */}
                    <circle cx="80" cy="18" r="11" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
                    {/* Neck */}
                    <line x1="76" y1="28" x2="75" y2="36" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
                    <line x1="84" y1="28" x2="85" y2="36" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
                    {/* Shoulders */}
                    <path d="M75 36 Q62 38 48 48" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
                    <path d="M85 36 Q98 38 112 48" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
                    {/* Torso / chest */}
                    <path d="M48 48 L44 110 L116 110 L112 48 Z" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
                    {/* Sternum center line */}
                    <line x1="80" y1="48" x2="80" y2="110" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" strokeDasharray="3,3"/>
                    {/* Pressure point — CV17 center sternum */}
                    <circle cx="80" cy="66" r="5" fill="var(--amber)" opacity="0.9"/>
                    <circle cx="80" cy="66" r="9" fill="none" stroke="var(--amber)" strokeWidth="0.5" opacity="0.3"/>
                    {/* Label */}
                    <text x="80" y="138" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="'IBM Plex Mono', monospace">CV17 · center sternum</text>
                  </>}

                  {a.name === "Hands & Arms" && <>
                    {/* Hand outline — palm facing up */}
                    <path d="M60 110 L60 65 Q60 58 56 50 M60 65 Q62 56 64 44 M60 65 Q65 55 70 43 M60 65 Q67 57 75 48 M60 65 Q58 57 52 52" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2"/>
                    {/* Palm base */}
                    <path d="M52 52 Q48 70 50 85 Q54 100 60 110 Q66 100 70 85 Q72 70 75 48" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
                    {/* Thumb */}
                    <path d="M52 52 Q44 48 40 56 Q38 64 46 68" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
                    {/* Pressure point — LI4 webbing */}
                    <circle cx="52" cy="57" r="5" fill="var(--amber)" opacity="0.9"/>
                    <circle cx="52" cy="57" r="9" fill="none" stroke="var(--amber)" strokeWidth="0.5" opacity="0.3"/>
                    {/* Label */}
                    <text x="80" y="140" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="'IBM Plex Mono', monospace">LI4 · thumb–index web</text>
                  </>}

                  {a.name === "Gut & Core" && <>
                    {/* Arm outline — inner wrist */}
                    <path d="M55 20 L55 100 Q55 112 65 118 Q75 124 85 118 Q95 112 95 100 L95 20" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2"/>
                    {/* Wrist crease */}
                    <line x1="52" y1="95" x2="98" y2="95" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"/>
                    <line x1="52" y1="100" x2="98" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8"/>
                    {/* Two tendons */}
                    <line x1="72" y1="20" x2="72" y2="92" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" strokeDasharray="2,3"/>
                    <line x1="78" y1="20" x2="78" y2="92" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" strokeDasharray="2,3"/>
                    {/* Pressure point — PC6, 3 fingers below wrist */}
                    <circle cx="75" cy="78" r="5" fill="var(--amber)" opacity="0.9"/>
                    <circle cx="75" cy="78" r="9" fill="none" stroke="var(--amber)" strokeWidth="0.5" opacity="0.3"/>
                    {/* 3-finger measurement indicator */}
                    <line x1="104" y1="78" x2="104" y2="95" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8"/>
                    <line x1="101" y1="78" x2="107" y2="78" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8"/>
                    <line x1="101" y1="95" x2="107" y2="95" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8"/>
                    <text x="112" y="88" fill="rgba(255,255,255,0.25)" fontSize="7" fontFamily="'IBM Plex Mono', monospace">3 fin</text>
                    {/* Label */}
                    <text x="80" y="150" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="'IBM Plex Mono', monospace">PC6 · inner wrist</text>
                  </>}

                  {a.name === "Legs & Feet" && <>
                    {/* Knee outline */}
                    <ellipse cx="80" cy="42" rx="22" ry="18" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
                    {/* Thigh */}
                    <line x1="64" y1="36" x2="58" y2="10" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2"/>
                    <line x1="96" y1="36" x2="102" y2="10" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2"/>
                    {/* Shin */}
                    <line x1="66" y1="58" x2="62" y2="120" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2"/>
                    <line x1="94" y1="58" x2="98" y2="120" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2"/>
                    {/* Shin bone — tibia */}
                    <line x1="74" y1="58" x2="72" y2="118" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" strokeDasharray="3,3"/>
                    {/* 4-finger measurement */}
                    <line x1="108" y1="62" x2="108" y2="94" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8"/>
                    <line x1="105" y1="62" x2="111" y2="62" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8"/>
                    <line x1="105" y1="94" x2="111" y2="94" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8"/>
                    <text x="115" y="80" fill="rgba(255,255,255,0.25)" fontSize="7" fontFamily="'IBM Plex Mono', monospace">4 fin</text>
                    {/* Pressure point — ST36, 4 fingers below kneecap */}
                    <circle cx="80" cy="94" r="5" fill="var(--amber)" opacity="0.9"/>
                    <circle cx="80" cy="94" r="9" fill="none" stroke="var(--amber)" strokeWidth="0.5" opacity="0.3"/>
                    {/* Label */}
                    <text x="80" y="148" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="'IBM Plex Mono', monospace">ST36 · below kneecap</text>
                  </>}
                </svg>
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
                    background: audioOn ? "rgba(201,147,58,0.12)" : "var(--surface)",
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
                    <button onClick={(e) => { e.stopPropagation(); handleNext(); }} style={{
                      background: "none", border: "none", fontSize: 11, color: "var(--text-muted)",
                      cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginTop: 12,
                      letterSpacing: "0.06em"
                    }}>
                      Skip →
                    </button>
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
const loadTesseract = () => new Promise((resolve, reject) => {
  if (window.Tesseract) { resolve(window.Tesseract); return; }
  const script = document.createElement("script");
  script.src = "https://unpkg.com/tesseract.js@5/dist/tesseract.min.js";
  script.onload = () => resolve(window.Tesseract);
  script.onerror = () => reject(new Error("Failed to load OCR engine"));
  document.head.appendChild(script);
});

const extractTextFromImage = async (file) => {
  const Tesseract = await loadTesseract();
  const url = URL.createObjectURL(file);
  try {
    const result = await Tesseract.recognize(url, "eng", {
      logger: () => {} // suppress progress logs
    });
    return result.data.text.trim();
  } finally {
    URL.revokeObjectURL(url);
  }
};

function ReframeTool({ onComplete, mode = "calm", defaultTab = "talk", sharedText = null, onSharedTextConsumed = null }) {
  const [activeMode, setActiveMode] = useState(mode === "calm" ? null : mode);
  const [exitAnchor, setExitAnchor] = useState(false);
  const [showPostRating, setShowPostRating] = useState(false);
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
    return "calm"; // default — clarity mode is triggered per-message by input content
  })();
  const effectiveMode = autoMode;
  const isClarity = effectiveMode === "clarity";
  const isHype = effectiveMode === "hype";
  const openingText = isHype
    ? "What are you walking into? Name it and what's making it hard."
    : "What's on your mind?";
  const STORAGE_KEY = `stillform_reframe_session_${effectiveMode}`;

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
  const saveSession = (postRating = null) => {
    const elapsed = Date.now() - startTime.current;
    const fmt = (ms) => { const s = Math.round(ms / 1000); const m = Math.floor(s / 60); return m > 0 ? `${m}m ${s % 60}s` : `${s % 60}s`; };
    try {
      const sessions = JSON.parse(localStorage.getItem("stillform_sessions") || "[]");
      const fss = (s) => ({ angry:1, anxious:2, flat:2, mixed:3, excited:4, focused:5 }[s] ?? null);
      const entry = { timestamp: new Date().toISOString(), duration: elapsed, durationFormatted: fmt(elapsed), tools: ["reframe"], exitPoint: "reframe-done", source: "reframe", mode: effectiveMode, preRating: fss(feelState), preState: feelState || null };
      if (postRating) { entry.postRating = fss(postRating); entry.postState = postRating; }
      if (entry.preRating && entry.postRating) entry.delta = entry.postRating - entry.preRating;
      sessions.push(entry);
      localStorage.setItem("stillform_sessions", JSON.stringify(sessions));
    } catch {}

    // Post-session AI summary — background call, non-blocking
    if (messages.length >= 2) {
      const convo = messages.map(m => `${m.role === "ai" ? "Stillform" : "User"}: ${m.text}`).join("\n");
      fetch("/.netlify/functions/reframe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: `INTERNAL — SESSION SUMMARY REQUEST. This is not a user message. Write 2-3 sentences capturing what mattered in this session. Focus on: what they confided, any growth or patterns you noticed, what their current concern is, and what made them feel understood (if anything). Do NOT use clinical labels. Write like a friend's mental note, not a chart entry. Return JSON: { "distortion": null, "reframe": "your session note" }`,
          mode: effectiveMode,
          history: messages.map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text })),
          sessionCount: (() => { try { return JSON.parse(localStorage.getItem("stillform_sessions") || "[]").length; } catch { return 0; } })()
        })
      }).then(r => r.json()).then(data => {
        if (data?.reframe) {
          try {
            const notes = JSON.parse(localStorage.getItem("stillform_ai_session_notes") || "[]");
            notes.push({ timestamp: new Date().toISOString(), mode: effectiveMode, note: data.reframe });
            // Keep last 20 notes
            if (notes.length > 20) notes.splice(0, notes.length - 20);
            localStorage.setItem("stillform_ai_session_notes", JSON.stringify(notes));
          } catch {}
        }
      }).catch(() => {});
    }
  };

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

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
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (screenshot, photo).");
      return;
    }
    setOcrLoading(true);
    setError(null);
    try {
      const text = await extractTextFromImage(file);
      if (!text || text.length < 5) {
        setError("Couldn\'t read text from that image. Try a clearer screenshot.");
        return;
      }
      // Clean OCR output — strip phone UI metadata before dropping into input
      const cleanOcr = (raw) => {
        return raw
          .split("\n")
          .map(l => l.trim())
          .filter(l => {
            if (l.length < 3) return false;
            // Drop timestamp lines: "1:23 PM", "12:26 EL", etc.
            if (/^\d{1,2}:\d{2}/.test(l)) return false;
            // Drop carrier/metadata lines
            if (/RCS message|©|\(F\)|\(E\)|oi \d|¢€|¢|€/.test(l)) return false;
            // Drop lines that start with & or @ (metadata artifacts)
            if (/^[&@#]/.test(l)) return false;
            // Drop lines that look like contact header: "Name LO :" or "Name LO:"
            if (/\b(LO|CO|EL)\s*:/.test(l)) return false;
            // Drop lines that are phone UI noise: battery, signal, notification counts
            if (/^[\d\s\|<>@&©¢€\+\-\.]{0,5}$/.test(l)) return false;
            // Drop symbol-heavy lines where less than 50% is real words
            const words = l.match(/[a-zA-Z]{2,}/g) || [];
            const wordChars = words.join("").length;
            if (wordChars / l.length < 0.4 && l.length < 40) return false;
            return true;
          })
          // After filtering, strip leading metadata from remaining lines
          // e.g. "& ¢€ Paula Fischkelta LO : actual message" → "actual message"
          .map(l => {
            // Strip "Name Name LO : " prefix pattern
            return l.replace(/^[^:]+\bLO\s*:\s*/, "")
                    .replace(/^[^:]+\bCO\s*:\s*/, "")
                    .replace(/^[\s&@#¢€©]+/, "")
                    .trim();
          })
          .filter(l => l.length > 3)
          .join("\n")
          .replace(/\n{3,}/g, "\n\n")
          .trim();
      };
      const cleanedText = cleanOcr(text);
      if (!cleanedText || cleanedText.length < 5) {
        setError("Couldn\'t extract clean text from that image. Try a clearer screenshot.");
        return;
      }
      // Prepend context so AI knows this is a screenshot of a conversation, not the user's own words
      const contextualText = `[Screenshot of a conversation]\n${cleanedText}\n\nThis is what I'm dealing with — what do I do with this?`;
      setInput(prev => prev ? prev + "\n\n" + contextualText : contextualText);
      try { window.plausible("Image Upload", { props: { chars: text.length } }); } catch {}
    } catch {
      setError("OCR failed. Try a clearer screenshot or type it out.");
    } finally {
      setOcrLoading(false);
      // Reset file input so same file can be re-uploaded
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

  const getSavedReframes = () => {
    try { return JSON.parse(localStorage.getItem("stillform_saved_reframes") || "[]").filter(r => r.mode === effectiveMode); } catch { return []; }
  };

  // Persist encrypted messages on every change
  useEffect(() => {
    if (messages.length > 0) {
      secureSet(STORAGE_KEY, messages).catch(() => {});
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

  const handleSend = async (retryText) => {
    const textToSend = retryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = { role: "user", text: textToSend };
    const prevMessages = retryText ? messages.slice(0, -1) : messages;
    const history = [...prevMessages, userMsg];

    setMessages(retryText ? [...prevMessages, userMsg] : [...messages, userMsg]);
    setLastInput(textToSend);
    if (!retryText) setInput("");
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
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 24000);

      const response = await fetch("/.netlify/functions/reframe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          input: textToSend,
          mode: (() => {
            // Auto-route to clarity mode if input signals spiraling/looping
            const lower = textToSend.toLowerCase();
            const clarityTriggers = ["can't stop", "cant stop", "keep thinking", "won't stop", "wont stop", "looping", "replaying", "over and over", "can't sleep", "cant sleep", "won't shut up", "wont shut up", "same thought", "stuck in my head", "broken record"];
            if (clarityTriggers.some(t => lower.includes(t)) && textToSend.split(/\s+/).length < 30) return "clarity";
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
          sessionCount: (() => { try { return JSON.parse(localStorage.getItem("stillform_sessions") || "[]").length; } catch { return 0; } })(),
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
              return `User's identified cognitive blind spots: ${biases.join(", ")}`;
            } catch { return null; }
          })(),
          priorToolContext: (() => {
            try {
              const sessions = JSON.parse(localStorage.getItem("stillform_sessions") || "[]");
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
          sessionNotes: (() => {
            try {
              const notes = JSON.parse(localStorage.getItem("stillform_ai_session_notes") || "[]");
              if (notes.length === 0) return null;
              return notes.slice(-5).map(n => `[${n.timestamp.split("T")[0]}] ${n.note}`).join("\n");
            } catch { return null; }
          })()
        })
      });
      clearTimeout(timeout);
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Server error");
      }
      const parsed = await response.json();
      if (parsed.crisisDetected) { try { window.plausible("Crisis Detection Triggered"); } catch {} }
      if (parsed.liabilityGuard) { try { window.plausible("Liability Guard Triggered"); } catch {} }
      setMessages(prev => [...prev, {
        role: "ai",
        text: parsed.reframe,
        distortion: parsed.distortion
      }]);
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
      "Name the thought loop. Cut through it.",
      "What keeps coming back no matter how many times you dismiss it?",
      "What decision are you circling?",
      "What thought won't stop?",
      "What are you replaying?"
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
      color: "#c9933a",
      bg: "linear-gradient(180deg, rgba(201,147,58,0.10) 0%, transparent 50%)",
      border: "rgba(201,147,58,0.25)",
      inputBg: "rgba(201,147,58,0.07)",
      aiBubble: "rgba(201,147,58,0.10)",
      sendBg: "#c9933a"
    },
    clarity: {
      icon: "✦", title: "Talk it out", subtitle: rotatingSubtitle,
      color: "#7aadcf",
      bg: "linear-gradient(180deg, rgba(122,173,207,0.12) 0%, transparent 50%)",
      border: "rgba(122,173,207,0.28)",
      inputBg: "rgba(122,173,207,0.07)",
      aiBubble: "rgba(122,173,207,0.10)",
      sendBg: "#7aadcf"
    },
    hype: {
      icon: "◌", title: "Talk it out", subtitle: rotatingSubtitle,
      color: "#c9793a",
      bg: "linear-gradient(180deg, rgba(201,121,58,0.12) 0%, transparent 50%)",
      border: "rgba(201,121,58,0.30)",
      inputBg: "rgba(201,121,58,0.08)",
      aiBubble: "rgba(201,121,58,0.12)",
      sendBg: "#c9793a"
    }
  };
  const mc = modeConfig[effectiveMode] || modeConfig.calm;

  if (showPostRating) {
    const feelChips = [
      { id: "excited", label: "Excited" },
      { id: "focused", label: "Focused" },
      { id: "anxious", label: "Anxious" },
      { id: "angry", label: "Angry" },
      { id: "flat", label: "Flat" },
      { id: "mixed", label: "Mixed" }
    ];
    return (
      <div style={{ textAlign: "center", padding: "48px 0" }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 20 }}>
          Where are you now?
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 36 }}>
          {feelChips.map(f => (
            <button key={f.id} onClick={() => { saveSession(f.id); onComplete(); }} style={{
              background: "transparent", border: `1px solid var(--border)`,
              borderRadius: 20, padding: "8px 20px", fontSize: 13,
              color: "var(--text-muted)", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s"
            }}>
              {f.label}
            </button>
          ))}
        </div>
        <button onClick={() => { saveSession(); onComplete(); }} style={{
          background: "none", border: "none", fontSize: 12,
          color: "var(--text-muted)", cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif", opacity: 0.6
        }}>Skip</button>
      </div>
    );
  }

  return (
    <div style={{ background: mc.bg, margin: "-40px -40px 0", padding: "40px 40px 0", borderRadius: "0 0 16px 16px" }}>

      {/* Ghost echo — faint past resilience */}
      {(() => {
        try {
          const sessions = JSON.parse(localStorage.getItem("stillform_sessions") || "[]");
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
        <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>
          What's present — <span style={{ color: "var(--text-dim)", textTransform: "none", letterSpacing: 0 }}>optional</span>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[
            { id: "excited", label: "Excited" },
            { id: "focused", label: "Focused" },
            { id: "anxious", label: "Anxious" },
            { id: "angry", label: "Angry" },
            { id: "flat", label: "Flat" },
            { id: "mixed", label: "Mixed" }
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

      {/* MODE AUTO-DETECTED — from feel state + input content */}

      <div className="disclaimer">
        Your data is encrypted. <button onClick={() => onComplete("crisis")} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "inherit", cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>Crisis resources</button>
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
            <button className="btn btn-primary" style={{ fontSize: 14 }} onClick={() => handleSend(lastInput)}>
              ↺ Retry
            </button>
            <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => setError(null)}>
              Dismiss
            </button>
          </div>
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
            <div style={{ fontSize: 12, color: "var(--text-dim)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
              While you wait, try one of these
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => onComplete("breathe")}>
                ◎ Breathe
              </button>
              <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => onComplete("scan")}>
                ◉ Body Scan
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="ai-container">
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
                {(() => { try { return JSON.parse(localStorage.getItem("stillform_sessions") || "[]").filter(s => s.tools?.includes("reframe")).length === 0; } catch { return true; } })() && (
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
                {msg.distortion && (
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
                ) : msg.text}
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
                onClick={() => { saveSession(); onComplete("breathe"); }}
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
                This isn't helping → try breathing instead
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
            background: "rgba(201,147,58,0.08)", borderRadius: "var(--r)",
            border: "0.5px solid rgba(201,147,58,0.2)",
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
                placeholder={speech.listening ? "Listening..." : isHype ? "What are you about to face?" : isClarity ? "What's looping?" : "What's on your mind..."}
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
      </div>
      {messages.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
            {messages.length > 1 && (
              <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => {
                try { localStorage.removeItem(STORAGE_KEY); } catch {}
                setShowPostRating(true);
              }}>
                Done for now
              </button>
            )}
            <button className="btn btn-ghost" style={{ fontSize: 13, color: "var(--text-dim)" }} onClick={() => {
              try { localStorage.removeItem(STORAGE_KEY); } catch {}
              setMessages([]);
              setError(null);
              setLoading(false);
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

  const biases = [
    {
      name: "Confirmation Bias",
      what: "Your brain seeks evidence that confirms what you already believe — and filters out what doesn't.",
      example: "You're convinced your partner is pulling away. You notice every short text and missed call. You don't notice the three kind things they did today.",
      question: "When you're upset, do you find yourself only seeing evidence that supports the worst interpretation?"
    },
    {
      name: "Fundamental Attribution Error",
      what: "When someone else does something wrong, you blame their character. When you do something wrong, you blame the situation.",
      example: "They cut you off in traffic — they're reckless. You cut someone off — you were late for something important.",
      question: "Do you tend to judge others by their actions but judge yourself by your intentions?"
    },
    {
      name: "Negativity Bias",
      what: "Your brain gives more weight to bad experiences than good ones. One criticism outweighs ten compliments.",
      example: "Nine people loved your presentation. One person looked bored. You go home thinking about the one.",
      question: "Does one negative thing tend to overshadow multiple positive things?"
    },
    {
      name: "Optimism Bias",
      what: "Your brain underestimates risk and overestimates how well things will go. You skip preparation because it 'feels fine.'",
      example: "You don't study for the interview because you're confident. You don't have the hard conversation because you assume it'll work itself out. It doesn't.",
      question: "Do you sometimes skip preparation or avoid hard steps because you assume things will just work out?"
    },
    {
      name: "Sunk Cost Fallacy",
      what: "You keep investing in something — a relationship, a job, a decision — because of what you've already put in, not because it's still right.",
      example: "You stay in a situation that's hurting you because 'I've already given it three years.'",
      question: "Have you ever stayed in something too long because leaving would mean admitting the investment was wasted?"
    },
    {
      name: "Self-Serving Bias",
      what: "You take credit for successes and externalize blame for failures. Your brain protects your self-image.",
      example: "The project succeeded — you led it. The project failed — the team dropped the ball.",
      question: "When something goes wrong, is your first instinct to look outward for the cause?"
    },
    {
      name: "Anchoring",
      what: "The first piece of information you receive carries disproportionate weight in every decision after.",
      example: "Someone told you you're 'too much' at age 12. You're 35 and still shrinking yourself in rooms.",
      question: "Is there an old belief or early experience that still shapes how you see yourself — even though everything has changed since then?"
    },
    {
      name: "Spotlight Effect",
      what: "You overestimate how much other people notice or care about your mistakes.",
      example: "You said something awkward in a meeting. You replay it for days. Nobody else remembers.",
      question: "Do you assume people are thinking about your mistakes as much as you are?"
    },
    {
      name: "Planning Fallacy",
      what: "You consistently underestimate how long things take, how much energy they'll require, or how many things can go wrong.",
      example: "You say yes to five things this week because each one 'only takes an hour.' By Wednesday you're drowning.",
      question: "Do you regularly underestimate how long things take or overcommit because each thing seems small on its own?"
    },
    {
      name: "Halo Effect",
      what: "One positive impression about a person colors everything else. You trust their judgment, overlook red flags, or defer to them because they got one thing right.",
      example: "Your new manager seems sharp and confident, so you assume their plan is solid. You don't push back. The plan was wrong.",
      question: "Do you sometimes give people too much credit across the board because of one strong impression?"
    }
  ];

  const handleResponse = (recognized) => {
    if (recognized) {
      setIdentified(prev => [...prev, biases[current].name]);
    }
    if (current < biases.length - 1) {
      setCurrent(c => c + 1);
    } else {
      // Save identified biases
      try {
        localStorage.setItem("stillform_bias_profile", JSON.stringify(identified));
      } catch {}
      setDone(true);
    }
  };

  if (done) {
    return (
      <div style={{ textAlign: "center", maxWidth: 380, margin: "0 auto" }}>
        <div style={{ fontSize: 28, marginBottom: 16 }}>✦</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, marginBottom: 12 }}>
          Awareness is the intervention.
        </h2>
        <p style={{ color: "var(--text-dim)", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
          You don't need to fix these. Just knowing they're there changes how you act on them. The AI in Reframe is also watching for these patterns in your conversations.
        </p>
        {identified.length > 0 && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "16px 20px", textAlign: "left", marginBottom: 24 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 10 }}>Patterns you recognized</div>
            {identified.map((b, i) => (
              <div key={i} style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 4 }}>· {b}</div>
            ))}
          </div>
        )}
        {identified.length === 0 && (
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 24 }}>You didn't identify with any of these right now. That may change — biases show up differently under stress.</p>
        )}
        <button className="btn btn-ghost" onClick={onComplete}>Done</button>
      </div>
    );
  }

  const bias = biases[current];
  return (
    <div style={{ maxWidth: 420, margin: "0 auto" }}>
      <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 24, textAlign: "center" }}>
        {current + 1} of {biases.length}
      </div>

      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, marginBottom: 16 }}>
        {bias.name}
      </h2>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "16px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.6, marginBottom: 12 }}>{bias.what}</div>
        <div style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6, fontStyle: "italic" }}>{bias.example}</div>
      </div>

      <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.6, marginBottom: 24 }}>
        {bias.question}
      </p>

      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleResponse(true)}>
          Yes, I see this
        </button>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => handleResponse(false)}>
          Not really
        </button>
      </div>

      <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 24 }}>
        {biases.map((_, i) => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i <= current ? "var(--amber)" : "var(--border)", transition: "all 0.3s" }} />
        ))}
      </div>
    </div>
  );
}

function MetacognitionTool({ onComplete }) {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState({});
  const startTrackedRef = useRef(false);
  if (step === 0 && !startTrackedRef.current) {
    startTrackedRef.current = true;
    try { window.plausible?.("Watch & Choose Started"); } catch {}
  }

  const prompts = [
    {
      label: "Notice",
      question: "What's happening in your body right now?",
      sub: "Don't fix it. Just notice it. Where is it? What does it feel like?",
      placeholder: "My chest is tight, my jaw is clenched..."
    },
    {
      label: "Name",
      question: "What thought just fired?",
      sub: "The first thought. Not the story, not the explanation. The raw thought.",
      placeholder: "I'm going to lose everything..."
    },
    {
      label: "Recognize",
      question: "Have you been here before?",
      sub: "Does this thought have a pattern? Is this familiar?",
      placeholder: "This is the money spiral. I do this when I'm tired..."
    },
    {
      // EQ integration — light, not labeled
      label: "Perspective",
      question: "What do you actually need right now?",
      sub: "Not what you think you should do. What does the part of you that's hurting actually need?",
      placeholder: "What do you need right now?"
    },
    {
      label: "Choose",
      question: "What do you want to do with the next 60 seconds?",
      sub: "You caught the spiral. You named it. Now you choose.",
      placeholder: ""
    }
  ];

  const choices = [
    { label: "Breathe", desc: "Regulate first", action: () => onComplete("breathe") },
    { label: "Sit with it", desc: "I see it. That's enough.", action: () => {
      // Save as metacognition session
      try {
        const sessions = JSON.parse(localStorage.getItem("stillform_sessions") || "[]");
        sessions.push({
          timestamp: new Date().toISOString(),
          duration: 0,
          tools: ["metacognition"],
          exitPoint: "self-regulated",
          source: "metacognition",
          responses
        });
        localStorage.setItem("stillform_sessions", JSON.stringify(sessions));
      } catch {}
      setStep(prompts.length);
    }},
    { label: "Talk it through", desc: "Use Reframe", action: () => onComplete("reframe-calm") },
    { label: "Move on", desc: "No tools needed", action: () => {
      try {
        const sessions = JSON.parse(localStorage.getItem("stillform_sessions") || "[]");
        sessions.push({
          timestamp: new Date().toISOString(),
          duration: 0,
          tools: ["metacognition"],
          exitPoint: "autonomous",
          source: "metacognition",
          responses
        });
        localStorage.setItem("stillform_sessions", JSON.stringify(sessions));
        try { window.plausible?.("Watch & Choose Autonomous"); } catch {}
      } catch {}
      setStep(prompts.length);
    }}
  ];

  // Completion screen
  if (step >= prompts.length) {
    const autonomousCount = (() => {
      try {
        return JSON.parse(localStorage.getItem("stillform_sessions") || "[]")
          .filter(s => s.source === "metacognition" && (s.exitPoint === "autonomous" || s.exitPoint === "self-regulated")).length;
      } catch { return 0; }
    })();
    return (
      <div style={{ textAlign: "center", maxWidth: 320, margin: "0 auto" }}>
        <div style={{ fontSize: 28, marginBottom: 16 }}>✦</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, marginBottom: 12 }}>
          You watched it. You named it. You chose.
        </h2>
        <p style={{ color: "var(--text-dim)", fontSize: 14, lineHeight: 1.7, marginBottom: 8 }}>
          That's the skill. Seeing your own mind in motion and choosing what to do with it.
        </p>
        {autonomousCount > 1 && (
          <div style={{ fontSize: 13, color: "var(--amber)", marginBottom: 24 }}>
            You've done this {autonomousCount} times without tools.
          </div>
        )}
        <button className="btn btn-ghost" onClick={onComplete}>Done</button>
      </div>
    );
  }

  const prompt = prompts[step];
  const isChoiceStep = step === prompts.length - 1;

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
          <button className="btn btn-primary" style={{ width: "100%", marginTop: 16 }}
            disabled={!(responses[step] || "").trim()}
            onClick={() => setStep(s => s + 1)}>
            Next →
          </button>
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

function SignalMapTool({ onComplete }) {
  const [step, setStep] = useState(0);
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

  const triggers = [
    // High — positive activation
    "Big win or unexpected good news", "Excitement before something important",
    "Riding high — risk of overcommitting", "Creative flow or peak performance state",
    "Recognition or praise", "A big opportunity opening up",
    // Situational
    "Work / deadlines", "Conflict / confrontation", "Being put on the spot", "Public speaking / performing",
    "Difficult conversations", "Being judged or evaluated", "Waiting for results or news",
    "High-stakes decision", "Negotiation or competition",
    // Emotional
    "Rejection or abandonment", "Feeling disrespected", "Jealousy", "Guilt or shame from the past",
    "Grief / loss / anniversaries", "Feeling invisible or unheard",
    // Relational
    "Family dynamics", "Romantic relationship tension", "Parenting moments", "Social situations / networking",
    "Supporting someone else through something hard",
    // Physical / environmental
    "Chronic pain flares", "Sleep deprivation", "Sensory overload (noise, light, crowds)",
    "Hormonal changes", "Hunger or blood sugar drops",
    // Cognitive
    "Money / financial pressure", "Self-worth / impostor feelings", "Uncertainty / not knowing",
    "Being alone with your thoughts", "Comparison to others", "Unfinished tasks piling up",
    "Making a decision with incomplete information"
  ];

  const save = (key, value) => {
    const updated = { ...signals, [key]: value };
    setSignals(updated);
    try { localStorage.setItem("stillform_signal_profile", JSON.stringify(updated)); } catch {}
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
        <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 12 }}>Tap the areas that respond first — whether stress, excitement, or anything in between.</p>
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
        <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 8 }}>Most people don't recognize half their triggers. Scroll through — tap any that feel familiar, even slightly. You might be surprised.</p>
        <p style={{ color: "var(--text-muted)", fontSize: 11, marginBottom: 12, fontStyle: "italic" }}>This isn't a diagnosis. It's self-knowledge. The more you identify, the earlier you'll catch the wave.</p>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 24 }}>Select all that apply</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {triggers.map(t => {
            const selected = (signals.triggers || []).includes(t);
            return (
              <button key={t} onClick={() => {
                const current = signals.triggers || [];
                const updated = selected ? current.filter(x => x !== t) : [...current, t];
                save("triggers", updated);
              }} style={{
                background: selected ? "var(--amber-glow)" : "var(--surface)",
                border: `1px solid ${selected ? "var(--amber)" : "var(--border)"}`,
                borderRadius: "var(--r-lg)", padding: "8px 16px", fontSize: 13, cursor: "pointer",
                color: selected ? "var(--amber)" : "var(--text-dim)", transition: "all 0.2s"
              }}>{t}</button>
            );
          })}
        </div>
        <button className="btn btn-primary" style={{ width: "100%", marginTop: 20 }}
          disabled={!(signals.triggers || []).length}
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
            <strong style={{ color: "var(--text)" }}>Common triggers:</strong> {(signals.triggers || []).join(", ")}
          </div>
        </div>
        <button className="btn btn-primary" onClick={onComplete}>Done</button>
      </div>
    )
  ];

  return (
    <div>
      {steps[step]()}
    </div>
  );
}

function BodyCheckInTool({ onComplete }) {
  const areas = [
    { id: "jaw", label: "Jaw" },
    { id: "shoulders", label: "Shoulders" },
    { id: "chest", label: "Chest" },
    { id: "gut", label: "Gut" }
  ];
  const [levels, setLevels] = useState({});
  const [done, setDone] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  const handleTap = (areaId, level) => {
    const updated = { ...levels, [areaId]: level };
    setLevels(updated);
    if (currentIdx < areas.length - 1) {
      setTimeout(() => setCurrentIdx(i => i + 1), 300);
    } else {
      // Tension data — handled by morning check-in now
      setTimeout(() => setDone(true), 300);
    }
  };

  if (done) {
    const highest = Object.entries(levels).sort((a, b) => b[1] - a[1])[0];
    const highArea = areas.find(a => a.id === highest[0]);
    const needsHelp = highest[1] >= 2;
    return (
      <div style={{ textAlign: "center", maxWidth: 320, margin: "0 auto" }}>
        <div style={{ fontSize: 28, marginBottom: 16 }}>◎</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, marginBottom: 12 }}>Checked in.</h2>
        {needsHelp ? (
          <>
            <p style={{ color: "var(--text-dim)", fontSize: 14, marginBottom: 24 }}>
              Your {highArea.label.toLowerCase()} is holding activation. Want to address it?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button className="btn btn-primary" onClick={() => onComplete("scan")}>Body Scan →</button>
              <button className="btn btn-ghost" onClick={() => onComplete("breathe")}>Breathe</button>
              <button className="btn btn-ghost" style={{ color: "var(--text-muted)", fontSize: 13 }} onClick={onComplete}>Close</button>
            </div>
          </>
        ) : (
          <>
            <p style={{ color: "var(--text-dim)", fontSize: 14, marginBottom: 24 }}>Low activation across the board. System baseline.</p>
            <button className="btn btn-ghost" onClick={onComplete}>Done</button>
          </>
        )}
      </div>
    );
  }

  const area = areas[currentIdx];
  return (
    <div style={{ textAlign: "center", maxWidth: 320, margin: "0 auto" }}>
      <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 24 }}>
        Quick scan — {currentIdx + 1} of {areas.length}
      </div>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, marginBottom: 32 }}>
        {area.label}
      </h2>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        {[
          { level: 0, label: "Composed", color: "var(--green)" },
          { level: 1, label: "Mild", color: "var(--amber-dim)" },
          { level: 2, label: "Tense", color: "var(--amber)" },
          { level: 3, label: "High", color: "#c05040" }
        ].map(opt => (
          <button key={opt.level} onClick={() => handleTap(area.id, opt.level)} style={{
            background: levels[area.id] === opt.level ? "var(--surface2)" : "var(--surface)",
            border: `1px solid ${levels[area.id] === opt.level ? opt.color : "var(--border)"}`,
            borderRadius: "var(--r-lg)", padding: "14px 6px", flex: 1, cursor: "pointer", transition: "all 0.2s",
            textAlign: "center"
          }}>
            <div style={{ fontSize: 13, color: levels[area.id] === opt.level ? opt.color : "var(--text-dim)" }}>{opt.label}</div>
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 24 }}>
        {areas.map((_, i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i <= currentIdx ? "var(--amber)" : "var(--border)", transition: "all 0.3s" }} />
        ))}
      </div>
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
      const sessions = JSON.parse(localStorage.getItem("stillform_sessions") || "[]");
      sessions.push({
        timestamp: new Date().toISOString(),
        duration: elapsed,
        durationFormatted: formatTime(elapsed),
        tools: exitPoint === "grounding" ? ["breathe", "ground"] : ["breathe"],
        source: "panic",
        exitPoint
      });
      localStorage.setItem("stillform_sessions", JSON.stringify(sessions));
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
            const sessions = JSON.parse(localStorage.getItem("stillform_sessions") || "[]");
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
          background: audioOn ? "rgba(201,147,58,0.12)" : "var(--surface)",
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

function CheckInWidget({ onComplete }) {
  const [step, setStep] = useState(0);
  const [sleep, setSleep] = useState(7);
  const [energy, setEnergy] = useState("ok");
  const [mood, setMood] = useState("");
  const [stressEvent, setStressEvent] = useState("");
  const [notes, setNotes] = useState("");
  const [dismissed, setDismissed] = useState(false);

  const save = () => {
    const today = new Date().toISOString().slice(0, 10);
    const checkin = { date: today, sleep, energy, mood: mood || "not set", stressEvent: stressEvent || null, notes: notes || null };
    try { localStorage.setItem("stillform_checkin_today", JSON.stringify(checkin)); } catch {}
    onComplete();
  };

  if (dismissed) return null;

  // Step 0: prompt
  if (step === 0) return (
    <div style={{ marginBottom: 20, padding: "14px 18px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 2 }}>Quick check-in</div>
          <div style={{ fontSize: 11, color: "var(--text-dim)" }}>30 seconds. Helps the AI give better advice.</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setStep(1)} style={{
            background: "var(--amber)", color: "#0e0f11", border: "none", borderRadius: "var(--r)",
            padding: "6px 14px", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
          }}>Start</button>
          <button onClick={() => setDismissed(true)} style={{
            background: "none", border: "1px solid var(--border)", borderRadius: "var(--r)",
            padding: "6px 10px", fontSize: 11, color: "var(--text-muted)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
          }}>Skip</button>
        </div>
      </div>
    </div>
  );

  // Step 1: Sleep
  if (step === 1) return (
    <div style={{ marginBottom: 20, padding: "16px 18px", background: "var(--surface)", border: "1px solid var(--amber-dim)", borderRadius: "var(--r-lg)" }}>
      <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 10 }}>1 of 3 · Sleep</div>
      <div style={{ fontSize: 14, color: "var(--text)", marginBottom: 12 }}>How many hours did you sleep?</div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <input type="range" min="0" max="12" step="0.5" value={sleep} onChange={e => setSleep(parseFloat(e.target.value))}
          style={{ flex: 1, accentColor: "var(--amber)" }} />
        <div style={{ fontSize: 18, color: "var(--amber)", fontWeight: 500, minWidth: 40, textAlign: "center" }}>{sleep}h</div>
      </div>
      <button onClick={() => setStep(2)} style={{
        width: "100%", marginTop: 12, background: "var(--amber)", color: "#0e0f11", border: "none", borderRadius: "var(--r-lg)",
        padding: "10px", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
      }}>Next</button>
    </div>
  );

  // Step 2: Energy + Mood
  if (step === 2) return (
    <div style={{ marginBottom: 20, padding: "16px 18px", background: "var(--surface)", border: "1px solid var(--amber-dim)", borderRadius: "var(--r-lg)" }}>
      <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 10 }}>2 of 3 · Energy & mood</div>
      <div style={{ fontSize: 14, color: "var(--text)", marginBottom: 10 }}>Energy right now?</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["low", "ok", "high"].map(e => (
          <button key={e} onClick={() => setEnergy(e)} style={{
            flex: 1, padding: "8px", borderRadius: "var(--r-lg)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, border: `1px solid ${energy === e ? "var(--amber)" : "var(--border)"}`,
            background: energy === e ? "var(--amber-glow)" : "transparent",
            color: energy === e ? "var(--amber)" : "var(--text-dim)", transition: "all 0.15s"
          }}>{e.charAt(0).toUpperCase() + e.slice(1)}</button>
        ))}
      </div>
      <div style={{ fontSize: 14, color: "var(--text)", marginBottom: 8 }}>Mood in a word?</div>
      <div style={{ display: "flex", gap: 6 }}>
        <input value={mood} onChange={e => setMood(e.target.value)} placeholder="calm, anxious, flat, wired..."
          style={{
            flex: 1, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
            padding: "10px 14px", color: "var(--text)", fontSize: 14, fontFamily: "'DM Sans', sans-serif"
          }} />
        <MicButton onTranscript={t => setMood(t)} />
      </div>
      <button onClick={() => setStep(3)} style={{
        width: "100%", marginTop: 12, background: "var(--amber)", color: "#0e0f11", border: "none", borderRadius: "var(--r-lg)",
        padding: "10px", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
      }}>Next</button>
    </div>
  );

  // Step 3: Stress + save
  return (
    <div style={{ marginBottom: 20, padding: "16px 18px", background: "var(--surface)", border: "1px solid var(--amber-dim)", borderRadius: "var(--r-lg)" }}>
      <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 10 }}>3 of 3 · Context</div>
      <div style={{ fontSize: 14, color: "var(--text)", marginBottom: 8 }}>Anything stressing you today?</div>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        <input value={stressEvent} onChange={e => setStressEvent(e.target.value)} placeholder="Optional — one line"
          style={{
            flex: 1, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
            padding: "10px 14px", color: "var(--text)", fontSize: 14, fontFamily: "'DM Sans', sans-serif"
          }} />
        <MicButton onTranscript={t => setStressEvent(prev => prev + (prev ? " " : "") + t)} />
      </div>
      <div style={{ fontSize: 14, color: "var(--text)", marginBottom: 8 }}>Anything else? Caffeine, meals, pain level?</div>
      <div style={{ display: "flex", gap: 6 }}>
        <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional"
          style={{
            flex: 1, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
            padding: "10px 14px", color: "var(--text)", fontSize: 14, fontFamily: "'DM Sans', sans-serif"
          }} />
        <MicButton onTranscript={t => setNotes(prev => prev + (prev ? " " : "") + t)} />
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={save} style={{
          flex: 1, background: "var(--amber)", color: "#0e0f11", border: "none", borderRadius: "var(--r-lg)",
          padding: "10px", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
        }}>Save check-in</button>
        <button onClick={() => { setStep(0); setDismissed(true); }} style={{
          background: "none", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
          padding: "10px 14px", fontSize: 12, color: "var(--text-muted)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
        }}>Skip</button>
      </div>
    </div>
  );
}

function MyProgress({ onBack }) {
  const [openSections, setOpenSections] = useState({});
  const toggle = (key) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [viewEntry, setViewEntry] = useState(null);
  const [jSignal, setJSignal] = useState([]);
  const [jTriggerType, setJTriggerType] = useState("");
  const [jTrigger, setJTrigger] = useState("");
  const [jBody, setJBody] = useState("");
  const [jOutcome, setJOutcome] = useState("");
  const [journalEntries, setJournalEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem("stillform_journal") || "[]"); } catch { return []; }
  });
  const signalAreas = ["Jaw","Shoulders","Chest","Gut","Hands","Legs","Head","Throat"];
  const triggerTypes = ["Social demand","Performance pressure","Conflict","Uncertainty","Sensory overload","Transition","Rejection","Fatigue","Physical pain","Other"];
  const outcomeTypes = ["Composed","Talked through","Loop broken","Ready","Incomplete","Reacted","Still processing"];
  const savePulseEntry = () => {
    if (!jSignal.length && !jTriggerType && !jTrigger.trim()) return;
    const entry = { id: Date.now(), date: new Date().toISOString().split("T")[0], time: new Date().toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"}), signal: jSignal, trigger: jTrigger.trim(), triggerType: jTriggerType, emotions: [], body: jBody.trim(), outcome: jOutcome, notes: jBody.trim() };
    const updated = [entry, ...journalEntries];
    setJournalEntries(updated);
    try { localStorage.setItem("stillform_journal", JSON.stringify(updated)); } catch {}
    try { window.plausible("Pulse Entry"); } catch {}
    setJSignal([]); setJTrigger(""); setJTriggerType(""); setJBody(""); setJOutcome("");
    setShowNewEntry(false);
  };
  const deletePulseEntry = (id) => {
    if (!window.confirm("Delete this entry?")) return;
    const updated = journalEntries.filter(e => e.id !== id);
    setJournalEntries(updated);
    try { localStorage.setItem("stillform_journal", JSON.stringify(updated)); } catch {}
    setViewEntry(null);
  };

  const sessions = (() => { try { return JSON.parse(localStorage.getItem("stillform_sessions") || "[]"); } catch { return []; } })();
  const savedReframes = (() => { try { return JSON.parse(localStorage.getItem("stillform_saved_reframes") || "[]"); } catch { return []; } })();
  const biasProfile = (() => { try { return JSON.parse(localStorage.getItem("stillform_bias_profile") || "null"); } catch { return null; } })();
  const signalProfile = (() => { try { return JSON.parse(localStorage.getItem("stillform_signal_profile") || "null"); } catch { return null; } })();

  const toolNames = { breathe: "Breathe", ground: "Breathe", "body-scan": "Body Scan", reframe: "Reframe", sigh: "Breathe", metacognition: "Watch & Choose" };
  const toolCounts = {};
  sessions.forEach(s => (s.tools || []).forEach(t => { toolCounts[t] = (toolCounts[t] || 0) + 1; }));
  const topToolEntry = Object.entries(toolCounts).sort((a, b) => b[1] - a[1])[0] || null;

  const sessionsWithRatings = sessions.filter(s => s.preRating && s.postRating);
  const avgDelta = sessionsWithRatings.length > 0
    ? (sessionsWithRatings.reduce((sum, s) => sum + (s.delta || 0), 0) / sessionsWithRatings.length).toFixed(1)
    : null;
  const positiveShifts = sessionsWithRatings.filter(s => (s.delta || 0) > 0).length;

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
  // Day-of-week trigger clustering from journal
  const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const dayTriggerCounts = {};
  journalEntries.forEach(e => {
    if (!e.id) return;
    const d = new Date(e.id);
    if (isNaN(d)) return;
    const day = dayNames[d.getDay()];
    dayTriggerCounts[day] = (dayTriggerCounts[day] || 0) + 1;
  });
  const topDayEntry = Object.entries(dayTriggerCounts).sort((a, b) => b[1] - a[1])[0] || null;
  const topDayCount = topDayEntry?.[1] || 0;

  // Signal area frequency from journal
  const signalFreq = {};
  journalEntries.forEach(e => (e.signal || []).forEach(s => { signalFreq[s] = (signalFreq[s] || 0) + 1; }));
  const topSignalEntry = Object.entries(signalFreq).sort((a, b) => b[1] - a[1])[0] || null;

  // Trigger type frequency
  const triggerFreq = {};
  journalEntries.forEach(e => { if (e.triggerType) triggerFreq[e.triggerType] = (triggerFreq[e.triggerType] || 0) + 1; });
  const topTriggerEntry = Object.entries(triggerFreq).sort((a, b) => b[1] - a[1])[0] || null;

  // Outcome distribution
  const outcomeFreq = {};
  journalEntries.forEach(e => { if (e.outcome) outcomeFreq[e.outcome] = (outcomeFreq[e.outcome] || 0) + 1; });
  const topOutcomeEntry = Object.entries(outcomeFreq).sort((a, b) => b[1] - a[1])[0] || null;

  // Session improvement trend — compare first half vs second half avg delta
  const halfLen = Math.floor(sessionsWithRatings.length / 2);
  const firstHalf = sessionsWithRatings.slice(0, halfLen);
  const secondHalf = sessionsWithRatings.slice(halfLen);
  const firstAvg = firstHalf.length ? firstHalf.reduce((s, e) => s + (e.delta || 0), 0) / firstHalf.length : null;
  const secondAvg = secondHalf.length ? secondHalf.reduce((s, e) => s + (e.delta || 0), 0) / secondHalf.length : null;
  const improving = firstAvg !== null && secondAvg !== null && secondAvg > firstAvg;
  const trendDiff = firstAvg !== null && secondAvg !== null ? (secondAvg - firstAvg).toFixed(1) : null;

  const hasPatterns = journalEntries.length >= 3 || sessionsWithRatings.length >= 5;

  // Additional data sources
  const checkinToday = (() => { try { return JSON.parse(localStorage.getItem("stillform_checkin_today") || "null"); } catch { return null; } })();
  const eodToday = (() => { try { return JSON.parse(localStorage.getItem("stillform_eod_today") || "null"); } catch { return null; } })();
  const groundingHistory = (() => { try { return JSON.parse(localStorage.getItem("stillform_grounding_data") || "[]"); } catch { return []; } })();
  const aiSessionNotes = (() => { try { return JSON.parse(localStorage.getItem("stillform_ai_session_notes") || "[]"); } catch { return []; } })();
  const regulationType = (() => { try { return localStorage.getItem("stillform_regulation_type") || null; } catch { return null; } })();

  const cardStyle = { background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r-lg)", padding: "20px 16px", textAlign: "center", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.025)" };
  const rowStyle = { width: "100%", background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r-lg)", padding: "14px 18px", textAlign: "left", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.025)" };
  const subRowStyle = { background: "var(--surface2)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "10px 14px" };
  const monoLabel = { fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 };

  return (
    <section style={{ maxWidth: 480, margin: "0 auto", padding: "24px 24px 80px", position: "relative", zIndex: 1 }}>
      <button className="intervention-back" onClick={onBack}>← Back</button>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, marginBottom: 4 }}>My Progress</h1>
      <p style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 32 }}>Everything you've built. Every session counted.</p>

      {sessions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)", fontSize: 13 }}>
          Your progress appears here after your first session.
        </div>
      ) : (<>
        {/* STATS GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
          {avgDelta && Number(avgDelta) > 0 && <div style={cardStyle}>
            <div style={{ fontSize: 36, color: "var(--amber)", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1 }}>+{avgDelta}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 6 }}>Avg state shift</div>
          </div>}
          {streak > 0 && <div style={cardStyle}>
            <div style={{ fontSize: 36, color: "var(--amber)", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1 }}>{streak}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 6 }}>Day{streak !== 1 ? "s" : ""} streak</div>
          </div>}
          {topToolEntry && <div style={cardStyle}>
            <div style={{ fontSize: 16, color: "var(--amber)", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2, marginTop: 4 }}>{toolNames[topToolEntry[0]] || topToolEntry[0]}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 6 }}>Most used</div>
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
          <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 6 }}>Processing type</div>
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

        {/* PULSE HEAT MAP — composure telemetry */}
        {(() => {
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

          // Build day map: "YYYY-MM-DD" → count
          const dayMap = {};
          allEvents.forEach(d => {
            const key = d.toISOString().slice(0, 10);
            dayMap[key] = (dayMap[key] || 0) + 1;
          });

          // Build grid: 7 rows (Mon-Sun) × 12 cols (weeks)
          const cells = [];
          const d = new Date(startDate);
          // Adjust to Monday
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
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10 }}>Composure Telemetry</div>
              <div style={{ display: "flex", gap: 2 }}>
                {/* Day labels */}
                <div style={{ display: "flex", flexDirection: "column", gap: 2, marginRight: 4, justifyContent: "flex-start" }}>
                  {dayLabels.map((label, i) => (
                    <div key={i} style={{ width: 12, height: 14, fontSize: 9, color: "var(--text-muted)", fontFamily: "'IBM Plex Mono', monospace", display: "flex", alignItems: "center" }}>{label}</div>
                  ))}
                </div>
                {/* Grid */}
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
          const topTool = toolList[0];
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
          aiSessionNotes.forEach(n => {
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
            const toolLabels = { scan: "Body Scan", breathe: "Breathe", reframe: "Reframe", meta: "Watch & Choose" };
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
                        const labels = { scan: "Body Scan", breathe: "Breathe", reframe: "Reframe", meta: "Watch & Choose", signals: "Map Signals", bias: "Blind Spots" };
                        return (
                          <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: "0.5px solid var(--border)" }}>
                            <div style={{ fontSize: 13, color: "var(--text)" }}>{labels[t.id] || t.id}</div>
                            <div style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "right" }}>
                              {t.avgShift !== null ? `avg +${t.avgShift.toFixed(1)}` : "—"}
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
        {aiSessionNotes.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <button onClick={() => toggle("ainotes")} style={rowStyle}>
              <div><div style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>What the AI noticed</div><div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>{aiSessionNotes.length} session{aiSessionNotes.length !== 1 ? "s" : ""} logged</div></div>
              <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{openSections.ainotes ? "▾" : "▸"}</span>
            </button>
            {openSections.ainotes && (
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
                {[...aiSessionNotes].reverse().slice(0, 5).map((n, i) => (
                  <div key={i} style={subRowStyle}>
                    <div style={{ fontSize: 11, color: "var(--amber)", marginBottom: 4 }}>{new Date(n.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                    <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6, fontStyle: "italic" }}>{n.note}</div>
                  </div>
                ))}
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
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--amber)" }}>Pulse</div>
              {journalEntries.length > 0 && <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>{journalEntries.length} entries{topEmotionEntry ? ` · most logged: ${topEmotionEntry[0]}` : ""}</div>}
            </div>
            {!showNewEntry && !viewEntry && (
              <button onClick={() => setShowNewEntry(true)} style={{ background: "none", border: "0.5px solid var(--amber-dim)", borderRadius: "var(--r)", padding: "6px 14px", fontSize: 12, color: "var(--amber)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                + Log a pulse
              </button>
            )}
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
                <button onClick={() => deletePulseEntry(e.id)} style={{ marginTop: 8, background: "none", border: "0.5px solid rgba(200,60,60,0.3)", borderRadius: "var(--r)", padding: "8px 14px", fontSize: 11, color: "rgba(200,80,80,0.7)", cursor: "pointer", fontFamily: "'IBM Plex Mono', monospace" }}>Delete entry</button>
              </div>
            );
          })()}

          {/* NEW ENTRY FORM */}
          {showNewEntry && !viewEntry && (
            <div style={{ background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "18px", marginBottom: 16 }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 16 }}>New Entry</div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>Signal — where did it activate?</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {signalAreas.map(area => <button key={area} onClick={() => setJSignal(prev => prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area])} style={{ padding: "5px 10px", borderRadius: "var(--r-sm)", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", background: jSignal.includes(area) ? "var(--amber-glow)" : "var(--surface2)", border: `0.5px solid ${jSignal.includes(area) ? "var(--amber-dim)" : "var(--border)"}`, color: jSignal.includes(area) ? "var(--amber)" : "var(--text-dim)" }}>{area}</button>)}
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>Trigger</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
                  {triggerTypes.map(t => <button key={t} onClick={() => setJTriggerType(prev => prev === t ? "" : t)} style={{ padding: "5px 10px", borderRadius: "var(--r-sm)", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", background: jTriggerType === t ? "var(--amber-glow)" : "var(--surface2)", border: `0.5px solid ${jTriggerType === t ? "var(--amber-dim)" : "var(--border)"}`, color: jTriggerType === t ? "var(--amber)" : "var(--text-dim)" }}>{t}</button>)}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <textarea value={jTrigger} onChange={e => setJTrigger(e.target.value)} placeholder="Add detail..." style={{ flex: 1, background: "var(--surface2)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "8px 10px", color: "var(--text)", fontSize: 13, fontFamily: "'DM Sans', sans-serif", resize: "none", minHeight: 44, lineHeight: 1.5 }} />
                  <MicButton onTranscript={t => setJTrigger(prev => prev + (prev ? " " : "") + t)} />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>Outcome</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {outcomeTypes.map(o => <button key={o} onClick={() => setJOutcome(prev => prev === o ? "" : o)} style={{ padding: "5px 10px", borderRadius: "var(--r-sm)", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", background: jOutcome === o ? "var(--amber-glow)" : "var(--surface2)", border: `0.5px solid ${jOutcome === o ? "var(--amber-dim)" : "var(--border)"}`, color: jOutcome === o ? "var(--amber)" : "var(--text-dim)" }}>{o}</button>)}
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>Notes <span style={{ opacity: 0.5 }}>— optional</span></div>
                <div style={{ display: "flex", gap: 6 }}>
                  <textarea value={jBody} onChange={e => setJBody(e.target.value)} placeholder="What's the context?" style={{ flex: 1, background: "var(--surface2)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "8px 10px", color: "var(--text)", fontSize: 13, fontFamily: "'DM Sans', sans-serif", resize: "none", minHeight: 44, lineHeight: 1.5 }} />
                  <MicButton onTranscript={t => setJBody(prev => prev + (prev ? " " : "") + t)} />
                </div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={savePulseEntry} disabled={!jSignal.length && !jTriggerType && !jTrigger.trim()} style={{ flex: 1, background: (jSignal.length || jTriggerType || jTrigger.trim()) ? "var(--amber)" : "var(--surface2)", color: (jSignal.length || jTriggerType || jTrigger.trim()) ? "#0A0A0C" : "var(--text-muted)", border: "none", borderRadius: "var(--r)", padding: "10px", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Save</button>
                <button onClick={() => { setShowNewEntry(false); setJSignal([]); setJTrigger(""); setJTriggerType(""); setJBody(""); setJOutcome(""); }} style={{ background: "none", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "10px 16px", fontSize: 12, color: "var(--text-muted)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
              </div>
            </div>
          )}

          {/* ENTRY LIST */}
          {!viewEntry && !showNewEntry && (
            journalEntries.length === 0 ? (
              <div style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic", padding: "16px 0" }}>No entries yet. Pulse logs automatically when you select a feel state before a session.</div>
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
  const [didDrag, setDidDrag] = useState(false);
  const startRef = useRef(null);
  const posRef = useRef(pos);
  posRef.current = pos;

  const clamp = (p) => ({
    x: Math.max(8, Math.min(window.innerWidth - 152, p.x)),
    y: Math.max(60, Math.min(window.innerHeight - 120, p.y))
  });

  const onPointerDown = (e) => {
    e.preventDefault();
    setDragging(true);
    setDidDrag(false);
    startRef.current = { px: e.clientX - posRef.current.x, py: e.clientY - posRef.current.y };
    
    const onMove = (me) => {
      const next = clamp({ x: me.clientX - startRef.current.px, y: me.clientY - startRef.current.py });
      setPos(next);
      setDidDrag(true);
    };
    const onUp = () => {
      setDragging(false);
      try { localStorage.setItem(storageKey, JSON.stringify(posRef.current)); } catch {}
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <div
      onPointerDown={onPointerDown}
      onClick={() => { if (!didDrag) onPress(); }}
      style={{
        position: "fixed", left: pos.x, top: pos.y, zIndex: 200,
        background: "var(--bg)", border: "1px solid var(--amber-dim)",
        borderRadius: 28, padding: "10px 18px", fontSize: 12, letterSpacing: "0.06em",
        color: "var(--amber)", cursor: dragging ? "grabbing" : "grab",
        fontFamily: "'DM Sans', sans-serif",
        boxShadow: dragging ? "0 8px 24px rgba(0,0,0,0.5)" : "0 2px 12px rgba(0,0,0,0.3)",
        transition: dragging ? "none" : "box-shadow 0.2s",
        userSelect: "none", WebkitUserSelect: "none",
        transform: dragging ? "scale(1.05)" : "scale(1)"
      }}
    >
      ◎ Quick Breathe
    </div>
  );
}

export default function Stillform() {
  const [splashDone, setSplashDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSplashDone(true), 2500);
    setupPushNotifications(); // init push notifications in native context
    return () => clearTimeout(t);
  }, []);

  // Production: show onboarding only once, unless user replays from Settings.
  const hasSeenOnboarding = (() => { try { return localStorage.getItem("stillform_onboarded") === "yes"; } catch { return false; } })();
  
  // Subscription & trial tracking
  const isSubscribed = (() => { try { return localStorage.getItem("stillform_subscribed") === "yes"; } catch { return false; } })();
  const trialDaysLeft = (() => {
    try {
      const start = localStorage.getItem("stillform_trial_start");
      if (!start) return 14;
      const elapsed = (Date.now() - new Date(start).getTime()) / (1000 * 60 * 60 * 24);
      return Math.max(0, Math.ceil(14 - elapsed));
    } catch { return 14; }
  })();
  const trialExpired = trialDaysLeft <= 0 && !isSubscribed;

  // Check for subscription confirmation from Lemon Squeezy redirect
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("subscribed") === "true" || params.get("checkout") === "success") {
        localStorage.setItem("stillform_subscribed", "yes");
        window.history.replaceState({}, "", "/");
      }
    } catch {}
  }, []);

  // Check widget launch flag synchronously (works on web only)
  const widgetLaunch = false;

  const [screen, setScreen] = useState(null);
  const [screenReady, setScreenReady] = useState(false);
  const [onboardStep, setOnboardStep] = useState(0);
  const [setupStep, setSetupStep] = useState(0);
  const [assessmentAnswers, setAssessmentAnswers] = useState([]);
  const [ciOpen, setCiOpen] = useState(true);
  const [ciEnergy, setCiEnergy] = useState(null);
  const [ciBio, setCiBio] = useState(new Set());
  const [ciTension, setCiTension] = useState({});
  const [ciSaved, setCiSaved] = useState(false);
  const [eodOpen, setEodOpen] = useState(false);
  const [eodEnergy, setEodEnergy] = useState(null);
  const [eodComposure, setEodComposure] = useState(null);
  const [eodWord, setEodWord] = useState(null);
  const [eodSaved, setEodSaved] = useState(false);
  const [eodPromptDismissed, setEodPromptDismissed] = useState(false);
  const [regType, setRegType] = useState(() => { try { return localStorage.getItem("stillform_regulation_type") || null; } catch { return null; } });

  // Sync regulation type when navigating screens (catches Settings changes)
  useEffect(() => {
    if (screen === "home") {
      try { setRegType(localStorage.getItem("stillform_regulation_type") || null); } catch {}
    }
  }, [screen]);
  const [activeTool, setActiveTool] = useState(null);
  const [pathway, setPathway] = useState(null);
  const [sharedText, setSharedText] = useState(null);

  // Widget action check — calls native plugin, routes before splash ends
  useEffect(() => {
    const init = async () => {
      if (!hasSeenOnboarding) {
        setScreen("onboarding");
        setScreenReady(true);
        return;
      }

      try {
        const result = await WidgetBridge.getWidgetAction();
        if (result?.action === "breathe") {
          setActiveTool({ id: "breathe", name: "Breathe", quickStart: true });
          setPathway("calm");
          setScreen("tool");
          setScreenReady(true);
          return;
        }
      } catch (e) {
        console.error("WidgetBridge error:", e);
      }

      setScreen(trialExpired ? "pricing" : "home");
      setScreenReady(true);
    };
    init();
  }, []);

  // Deep link handling — share extension
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const share = params.get("share");
      if (share && hasSeenOnboarding) {
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
              if (s && hasSeenOnboarding) {
                setSharedText(decodeURIComponent(s));
                setActiveTool({ id: "reframe", name: "Reframe", mode: "calm" });
                setScreen("tool");
              }
            } catch {}
          });
        }).catch(() => {});
      }
    } catch {}
  }, []);
  const [pricingPlan, setPricingPlan] = useState("annual");
  const [pricingCloud, setPricingCloud] = useState(false);
  const [openLog, setOpenLog] = useState(null);
  const [, forceUpdate] = useState(0);
  const refreshSettings = () => forceUpdate(n => n + 1);
  const { screenLight, reducedMotion } = useDisplayPrefs();
  const appClasses = `app${screenLight ? " screenlight-active" : ""}${reducedMotion ? " reduced-motion" : ""}`;

  // Journal state — must be before any early return (React Rules of Hooks)
  const [journalEntries, setJournalEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem("stillform_journal") || "[]"); } catch { return []; }
  });

  const [uatRoadmapOpen, setUatRoadmapOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installDismissed, setInstallDismissed] = useState(false);

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
  const [uatTestAgain, setUatTestAgain] = useState(null);

  const completeOnboarding = () => {
    try { localStorage.setItem("stillform_onboarded", "yes"); } catch {}
    try { if (!localStorage.getItem("stillform_trial_start")) localStorage.setItem("stillform_trial_start", new Date().toISOString()); } catch {}
    try { window.plausible("Onboarding Complete"); } catch {}
    // Route to calibration assessment, not home
    setSetupStep(0);
    setAssessmentAnswers([]);
    setScreen("setup");
  };

  // Scroll to top on every screen change + analytics
  useEffect(() => {
    window.scrollTo(0, 0);
    if (screen !== "home" && screen !== "onboarding") {
      try { window.plausible("Screen View", { props: { screen } }); } catch {}
    }
  }, [screen]);
  const startTool = (tool) => {
    try { window.plausible("Tool Started", { props: { tool: tool?.id || "unknown" } }); } catch {}
    setActiveTool(tool);
    setScreen("tool");
  };

  const startPathway = async (p) => {
    try { window.plausible("Session Initiated", { props: { pathway: p } }); } catch {}
    setPathway(p);
    if (p === "calm") {
      startTool(TOOLS.find(t => t.id === "breathe"));
    } else if (p === "hype") {
      if (!(await biometric.gate())) return;
      setActiveTool({ ...TOOLS.find(t => t.id === "reframe"), mode: "hype" });
      setScreen("tool");
    } else if (p === "clarity") {
      if (!(await biometric.gate())) return;
      setActiveTool({ ...TOOLS.find(t => t.id === "reframe"), mode: "clarity" });
      setScreen("tool");
    } else {
      startTool(TOOLS.find(t => t.id === "breathe"));
    }
  };

  const renderTool = () => {
    const props = { onComplete: (redirectTo) => {
      if (redirectTo) {
        if (redirectTo === "crisis") { setScreen("crisis"); return; }
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
      setScreen("home");
    }};
    switch (activeTool?.id) {
      case "breathe": return <BreatheGroundTool {...props} pathway={pathway} quickStart={activeTool?.quickStart} />;
      case "sigh": return <PhysiologicalSighTool {...props} />;
      case "scan": return <BodyScanTool {...props} />;
      case "reframe": return <ReframeTool {...props} mode={activeTool?.mode || (pathway === "clarity" ? "clarity" : pathway === "hype" ? "hype" : "calm")} defaultTab={activeTool?.defaultTab || "talk"} sharedText={sharedText} onSharedTextConsumed={() => setSharedText(null)} />;
      case "signals": return <SignalMapTool {...props} />;
      case "checkin": return <BodyCheckInTool {...props} />;

      case "bias": return <MicroBiasTool {...props} />;
      case "meta": return <MetacognitionTool {...props} />;
      default:
        // Safety net — unknown tool or activeTool not yet flushed, go home
        if (activeTool?.id) {
          setTimeout(() => setScreen("home"), 0);
        }
        return null;
    }
  };

  return (
    <ErrorBoundary>
    <>
      <style>{styles}</style>
      <div className={appClasses}>
        {/* SPLASH OVERLAY — fades out, never blocks hooks */}
        {(!splashDone || !screenReady) && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            background: "#0e0f11", transition: "opacity 0.4s ease-out"
          }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300,
              color: "#c9933a", letterSpacing: "0.04em", marginBottom: 8,
              opacity: 0, animation: "splashIn 1.2s ease-out 0.3s forwards"
            }}>Stillform</div>
            <div style={{
              fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase",
              opacity: 0, animation: "splashIn 1.2s ease-out 0.8s forwards"
            }}>Composure mastery</div>
            <style>{`@keyframes splashIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
          </div>
        )}
        {/* NAV — hidden during onboarding */}
        {screen !== "onboarding" && (
        <nav className="nav">
          <div className="nav-logo" style={{ cursor: "pointer" }} onClick={() => setScreen("home")}>
            Still<span>form</span>
          </div>
          <div className="nav-actions">
            <button onClick={() => setScreen("faq")} style={{
              background: "none", border: "none", width: 32, height: 32, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-muted)", fontSize: 14, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              border: "0.5px solid var(--border)", transition: "all 0.2s"
            }}>?</button>
            <button className="btn btn-ghost" onClick={() => setScreen("settings")} style={{ padding: "8px 14px" }}>
              ⚙
            </button>
            <button className="btn btn-primary" onClick={() => setScreen("pricing")}>
              Subscribe
            </button>
          </div>
        </nav>
        )}

        {/* ONBOARDING — first visit only */}
        {screen === "onboarding" && (() => {
          const steps = [
            {
              icon: "◎",
              title: "Stillform",
              subtitle: "A precision composure system.",
              body: "A channel to self-awareness — and a tool to act on it. Regulate your body first. Reset your thinking. Then approach whatever you're dealing with more clearly.\n\nComposure isn't just for bad moments. Excitement, confidence, a big win — your state can drive impulsive decisions when things are going great too. Bad sleep, a trigger, physical pain, or riding high — the system reads all of it, because your state shapes your actions more than most people realize.\n\nBuilt from lived experience and grounded in proven neuroscience and cognitive research.",
              note: null
            },
            {
              icon: "◎",
              label: "The science",
              title: "Two pathways. Yours is different.",
              subtitle: "Peer-reviewed neuroscience. Applied.",
              body: "Your brain regulates through two distinct pathways. Thought-first — your mind fires first. Replaying, analyzing, building a response. Body-first — tension hits first. Jaw, chest, shoulders.\n\nResearch confirms: matching the right tool to your pathway is what makes regulation work. Forcing the wrong one makes it worse. During setup, five quick scenarios determine your default. The system adapts from there.",
              note: null,
              research: [
                { label: "Bottom-up and top-down emotion generation", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2858766/" },
                { label: "Cognitive reappraisal neuroimaging meta-analysis", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4193464/" }
              ]
            },
            {
              icon: "◎",
              label: "Three tools",
              title: "Talk. Breathe. Scan.",
              subtitle: "Each one backed by clinical research.",
              body: "Reframe — AI-powered reframing. Talk through what's happening. The AI identifies distortions, separates signal from noise, and learns your patterns over time.\n\nBreathe — paced breathing based on how your nervous system actually works. Extended exhale tells your body the threat is over. Measurable shift in under 90 seconds.\n\nBody Scan — six acupressure points. Locate tension, release it, clear the signal. Auto-advances.\n\nThe Bio-Filter checks your physical state first — because biology gets misread as emotion more often than you'd think.",
              note: "Quick Breathe is always free. Full access requires a subscription.",
              research: [
                { label: "Cognitive reappraisal: effects on emotion and physiology", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6188704/" },
                { label: "Interoceptive awareness for emotion regulation", url: "https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2018.00798/full" }
              ]
            },
            {
              icon: "◈",
              label: "It learns you",
              title: "The AI gets sharper.",
              subtitle: "Nine categories of context. Every session.",
              body: "The AI tracks what matters — your triggers, your values, your growth, what's happening in your life right now. After each session it writes its own notes. Not transcripts — just what mattered.\n\nIt never says 'I understand how you feel.' It proves it heard you by remembering. After 7 sessions, the system checks in and adjusts based on how you actually use it.",
              note: null,
              research: [
                { label: "Feeling understood in relationships", url: "https://compass.onlinelibrary.wiley.com/doi/10.1111/spc3.12308" },
                { label: "Validation reduces sympathetic activation", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9614309/" }
              ]
            },
            {
              icon: "◎",
              label: "Daily practice",
              title: "Morning calibration. In-the-moment reset.",
              subtitle: "Two habits. That's it.",
              body: "Morning check-in — two taps. Set your energy level and physical state. The AI uses this as context for every session that day.\n\nPulse — when you select how you're feeling before a session, it logs automatically. View your full history, patterns, and AI session notes in My Progress.\n\nEnd of Day — after 6 PM, close the loop. Three taps: energy, composure, one word. The AI uses yesterday's close as context the next morning.\n\nReframe adapts to your state automatically — if you're spiraling, it cuts the loop. If you're processing, it reframes. If you're riding high, it channels the energy.",
              note: null,
              research: [
                { label: "Affect labeling reduces amygdala reactivity", url: "https://pubmed.ncbi.nlm.nih.gov/17576282/" },
                { label: "Emotional granularity improves regulation", url: "https://journals.sagepub.com/doi/abs/10.1177/0963721414550708" }
              ]
            },
            {
              icon: "◎",
              label: "Your growth",
              title: "People change. We measure it.",
              subtitle: "Neuroplasticity tracked, not assumed.",
              body: "People are always looking for patterns. Why do I keep reacting this way? Why am I off today? The app tracks your signal history over time — emotions, triggers, physical state — and surfaces what you can't see in the moment.\n\nComposure Telemetry — a 12-week visual timeline on My Progress. Every session and every pulse entry lights up. You'll see your practice at a glance.\n\nOnce you can see your patterns clearly, that awareness becomes the power source. Your brain is wiring new responses every time you choose differently. That's neuroplasticity — not as a concept, but as something you can watch happen.\n\nOld patterns that resolve get dropped from your profile. The system evolves because you do.\n\nYour data is encrypted and stored on your device. Delete everything anytime from Settings. Replay this tutorial anytime.",
              note: null,
              research: [
                { label: "Neuroplasticity and growth mindset", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5836039/" },
                { label: "Flexible emotion regulation strategies", url: "https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2019.00072/full" }
              ]
            }
          ];
          const step = steps[onboardStep];
          const isLast = onboardStep === steps.length - 1;
          const isFirst = onboardStep === 0;

          // Swipe handling
          let touchStartX = null;
          const handleTouchStart = (e) => { touchStartX = e.touches[0].clientX; };
          const handleTouchEnd = (e) => {
            if (touchStartX === null) return;
            const diff = touchStartX - e.changedTouches[0].clientX;
            touchStartX = null;
            if (Math.abs(diff) < 50) return;
            if (diff > 0) {
              if (isLast) { completeOnboarding(); }
              else { setOnboardStep(s => s + 1); }
            } else {
              if (!isFirst) { setOnboardStep(s => s - 1); }
            }
          };

          return (
            <section
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              style={{
              maxWidth: 480, margin: "0 auto", padding: "0 24px",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              minHeight: "100vh", textAlign: "center", position: "relative", zIndex: 1,
              touchAction: "pan-y"
            }}>
              {/* Progress dots */}
              <div style={{ display: "flex", gap: 8, marginBottom: 40 }}>
                {steps.map((_, i) => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: i === onboardStep ? "var(--amber)" : "var(--border)",
                    transition: "background 0.3s"
                  }} />
                ))}
              </div>

              <div style={{ fontSize: 32, marginBottom: 16 }}>{step.icon}</div>
              {step.label && (
                <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 8 }}>
                  {step.label}
                </div>
              )}
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: isFirst ? 42 : 32,
                fontWeight: 300, lineHeight: 1.1, marginBottom: 8
              }}>
                {step.title}
              </h1>
              <div style={{ fontSize: 15, color: "var(--text-dim)", fontStyle: "italic", marginBottom: 24 }}>
                {step.subtitle}
              </div>
              <div style={{ fontSize: 14, color: "var(--text-dim)", lineHeight: 1.7, maxWidth: 360, marginBottom: 12, textAlign: "left" }}>
                {step.body.split("\n\n").map((para, i) => (
                  <p key={i} style={{ marginBottom: i < step.body.split("\n\n").length - 1 ? 12 : 0 }}>{para}</p>
                ))}
              </div>
              {step.note && (
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
                  {step.note}
                </div>
              )}
              {step.research && (
                <div style={{ marginBottom: 12, textAlign: "left", maxWidth: 360, width: "100%" }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>Research</div>
                  {step.research.map((r, i) => (
                    <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" style={{
                      display: "block", fontSize: 11, color: "var(--amber)", opacity: 0.7,
                      textDecoration: "none", marginBottom: 4, lineHeight: 1.4
                    }}>
                      {r.label} ↗
                    </a>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 32, width: "100%", maxWidth: 320 }}>
                {!isFirst && !isLast && (
                  <button className="btn btn-ghost" onClick={() => setOnboardStep(s => s - 1)}>
                    Back
                  </button>
                )}
                {isLast ? (
                  <>
                    <button onClick={() => completeOnboarding()} style={{
                      width: "100%", background: "var(--amber)", color: "#0e0f11", border: "none", borderRadius: "var(--r-lg)",
                      padding: "16px 24px", fontSize: 16, fontWeight: 500, cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif", textAlign: "center"
                    }}>
                      Begin Calibration →
                    </button>
                    <button onClick={() => setOnboardStep(s => s - 1)} style={{
                      background: "none", border: "none", color: "var(--text-muted)", fontSize: 12,
                      cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginTop: 8
                    }}>
                      ← Back
                    </button>
                    <div style={{ marginTop: 32, padding: "16px 20px", borderTop: "1px solid var(--border)", textAlign: "center" }}>
                      <p style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 8 }}>
                        Stillform is a composure tool, not a crisis service. If you or someone you know is in immediate danger or experiencing a mental health crisis:
                      </p>
                      <button onClick={() => { completeOnboarding(); setScreen("crisis"); }} style={{
                        background: "none", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                        padding: "8px 16px", fontSize: 12, color: "var(--text-dim)", cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s"
                      }}>
                        Crisis resources & helplines →
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                  {isFirst ? (
                    <>
                      <button className="btn btn-primary" style={{ padding: "16px 32px", fontSize: 16, width: "100%" }} onClick={() => completeOnboarding()}>
                        Begin Calibration
                      </button>
                      <button className="btn btn-ghost" style={{ marginTop: 8, fontSize: 13 }} onClick={() => setOnboardStep(s => s + 1)}>
                        How does it work? →
                      </button>
                    </>
                  ) : (
                    <button className="btn btn-primary" style={{ padding: "14px 32px" }} onClick={() => setOnboardStep(s => s + 1)}>
                      Next
                    </button>
                  )}
                  </>
                )}
              </div>

              {!isFirst && !isLast && (
                <button onClick={completeOnboarding} style={{
                  background: "none", border: "none", color: "var(--text-muted)", fontSize: 12,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginTop: 20
                }}>
                  Skip — take me to the app
                </button>
              )}
            </section>
          );
        })()}

        {/* SETUP — System Calibration */}
        {screen === "setup" && (() => {
          const regType = (() => { try { return localStorage.getItem("stillform_regulation_type") || null; } catch { return null; } })();

          const setupSteps = [
            {
              step: 1,
              label: "Calibration · 1 of 4",
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
                  q: "You just got incredible news you weren't expecting.",
                  a: { T: "I can't stop thinking about what this means", B: "My heart is pounding and I feel energy everywhere" }
                },
                {
                  q: "You're tired but someone close to you is testing your patience.",
                  a: { T: "I'm telling myself 'stay calm, this isn't worth it'", B: "I feel the tension building in my jaw" }
                },
                {
                  q: "A quiet moment. Nothing is wrong. Just you.",
                  a: { T: "My mind is reviewing the day and planning tomorrow", B: "I notice where I'm holding tension" }
                }
              ]
            },
            {
              step: 2,
              label: "Calibration · 2 of 4",
              title: "Signal Mapping",
              subtitle: "Where does your body respond first?",
              body: null,
              cta: null,
              autoLaunch: () => { setScreen("tool"); startTool(TOOLS.find(t => t.id === "signals")); }
            },
            {
              step: 3,
              label: "Calibration · 3 of 4",
              title: "Blind Spot Profile",
              subtitle: "What patterns does your thinking run?",
              body: null,
              cta: null,
              autoLaunch: () => { setScreen("tool"); startTool(TOOLS.find(t => t.id === "bias")); }
            },
            {
              step: 4,
              label: "Calibration · 4 of 4",
              title: "Default Protocol",
              subtitle: "Select your baseline breathing pattern.",
              body: "Quick Reset — 60 seconds. Slows your system down fast. Use when you need to regulate and get back to what you're doing.\n\nDeep Regulate — 3 minutes. Extended exhale cycle. Deeper reset for when you have the time and space.",
              cta: null,
              patterns: ["quick", "deep"]
            }
          ];

          const current = setupSteps[setupStep];
          const isLast = setupStep === setupSteps.length - 1;
          const savedPattern = (() => { try { return localStorage.getItem("stillform_breath_pattern") || "quick"; } catch { return "quick"; } })();

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

          const patternLabels = {
            quick: { name: "Quick Reset", detail: "60 seconds · Fast regulation" },
            deep: { name: "Deep Regulate", detail: "3 minutes · Extended exhale cycle" }
          };

          return (
            <section style={{ maxWidth: 480, margin: "0 auto", padding: "40px 24px 80px", position: "relative", zIndex: 1 }}>
              <button className="intervention-back" onClick={() => { if (setupStep > 0) { setSetupStep(s => s - 1); } else { setScreen("home"); } }}>← Back</button>

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
                  <div style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.6, marginBottom: 20, fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif", fontSize: 17 }}>
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

              {/* Step 3 — pattern picker */}
              {isLast && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 28 }}>
                  {Object.entries(patternLabels).map(([id, p]) => (
                    <button key={id} onClick={() => {
                      try { localStorage.setItem("stillform_breath_pattern", id); refreshSettings(); } catch {}
                    }} style={{
                      width: "100%", background: savedPattern === id ? "var(--amber-glow)" : "var(--surface)",
                      border: `0.5px solid ${savedPattern === id ? "var(--amber-dim)" : "var(--border)"}`,
                      borderRadius: "var(--r)", padding: "14px 18px", cursor: "pointer",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.025)",
                      WebkitTapHighlightColor: "transparent"
                    }}>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: savedPattern === id ? "var(--amber)" : "var(--text)", fontWeight: savedPattern === id ? 500 : 400 }}>{p.name}</div>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.08em" }}>{p.detail}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* CTA — autoLaunch fires once when step renders */}
              {current.autoLaunch && (() => {
                // Use a module-level flag to prevent re-fire on re-render
                if (!window.__sfAutoLaunched || window.__sfAutoLaunched !== setupStep) {
                  window.__sfAutoLaunched = setupStep;
                  setTimeout(() => { current.autoLaunch(); }, 50);
                }
                return null;
              })()}
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
                    if (isLast) { setScreen("home"); } else { setSetupStep(s => s + 1); }
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

        {/* FLOATING RESET — accessible from any screen except active tool sessions */}
        {screen !== "home" && screen !== "panic" && screen !== "onboarding" && 
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
            setScreen("home");
          }} />
        )}

        {/* HOME — different for first-time vs returning users */}
        {screen === "home" && (() => {
          let sessionCount = 0;
          try { sessionCount = JSON.parse(localStorage.getItem("stillform_sessions") || "[]").length; } catch {}

          // No regulation type set? Route to calibration
          if (!regType) {
            return (
              <section className="home">
                <h1 className="home-title">
                  Composure.<br /><em>On demand.</em>
                </h1>
                <p className="home-sub">
                  Master how you carry yourself — when things are hard and when things are going great. Composure isn’t just for bad days. Set your tone, stay sharp, and build awareness that compounds over time.
                </p>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontStyle: "italic", color: "var(--text-muted)", marginBottom: 40, marginTop: -8 }}>
                  Let's calibrate your system first.
                </div>
                <button onClick={() => { setSetupStep(0); setAssessmentAnswers([]); setScreen("setup"); }} className="btn btn-primary" style={{ padding: "18px 32px", fontSize: 15, width: "100%", maxWidth: 360 }}>
                  Begin Calibration →
                </button>
              </section>
            );
          }

          const isThoughtFirst = regType === "thought-first";
          const isBodyFirst = regType === "body-first";

          /* ── RETURNING USER: clean, one dominant action ── */
          // Calculate milestones
          let sessions = [];
          try { sessions = JSON.parse(localStorage.getItem("stillform_sessions") || "[]"); } catch {}
          const lastSession = sessions.length > 0 ? new Date(sessions[sessions.length - 1].timestamp) : null;
          const daysSinceLastSession = lastSession ? Math.floor((Date.now() - lastSession.getTime()) / (1000 * 60 * 60 * 24)) : 0;
          const milestone7 = sessionCount === 7 && !localStorage.getItem("stillform_milestone_7_seen");
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

          return (
            <section style={{ maxWidth: 420, margin: "0 auto", padding: "40px 24px 80px", position: "relative", zIndex: 1 }}>

              {/* ABSENCE DETECTION — operator tone, no guilt */}
              {isAbsent && (
                <div style={{ marginBottom: 24, padding: "16px 20px", background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r)" }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 8 }}>System idle · {daysSinceLastSession} days</div>
                  <div style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6 }}>Resuming. Anything shift in your environment since last check-in?</div>
                </div>
              )}

              {/* 7-SESSION MILESTONE — type review */}
              {milestone7 && !isAbsent && (
                <div style={{ marginBottom: 24, padding: "16px 20px", background: "var(--surface)", border: "0.5px solid var(--amber-dim)", borderRadius: "var(--r)" }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 8 }}>
                    {hasStreak ? "7 days straight" : "7 sessions"}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6, marginBottom: 12 }}>
                    {hasStreak
                      ? "You've been here every day this week. You're building something. How's it feeling?"
                      : "I've noticed something. You've been here 7 times now — and the way you're using the tools might be telling you something about how you actually process. Is what you're reaching for working?"}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => { localStorage.setItem("stillform_milestone_7_seen", "yes"); setScreen("home"); }} style={{
                      flex: 1, padding: "10px", background: "none", border: "0.5px solid var(--amber-dim)",
                      borderRadius: "var(--r)", color: "var(--amber)", fontSize: 12, cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif"
                    }}>Working well</button>
                    <button onClick={() => { localStorage.setItem("stillform_milestone_7_seen", "yes"); setScreen("home"); }} style={{
                      flex: 1, padding: "10px", background: "none", border: "0.5px solid var(--border)",
                      borderRadius: "var(--r)", color: "var(--text-dim)", fontSize: 12, cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif"
                    }}>Let me try different</button>
                  </div>
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

              {/* TRIAL BADGE */}
              {!isSubscribed && trialDaysLeft > 0 && (
                <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "10px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: trialDaysLeft <= 3 ? "#c05040" : "var(--text-muted)" }}>FREE TRIAL</span>
                    <span style={{ fontSize: 12, color: "var(--text-dim)" }}>{trialDaysLeft} day{trialDaysLeft !== 1 ? "s" : ""} remaining</span>
                  </div>
                  <button onClick={() => setScreen("pricing")} style={{ background: "none", border: "none", color: "var(--amber)", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Subscribe</button>
                </div>
              )}

              {/* UAT BANNER — visible dropdown with roadmap */}
              <div style={{ marginBottom: 32 }}>
                <button onClick={() => setUatRoadmapOpen(!uatRoadmapOpen)} style={{
                  width: "100%", background: "var(--surface)", border: "0.5px solid var(--border)",
                  borderRadius: "var(--r)", padding: "12px 16px", cursor: "pointer",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  WebkitTapHighlightColor: "transparent"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--amber)", background: "var(--amber-glow)", padding: "2px 8px", borderRadius: 4 }}>EARLY ACCESS</span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c05040", animation: "pulse 1.5s ease-in-out infinite" }}>NEW!</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "var(--text-muted)" }}>What's new + what's coming</span>
                  </div>
                  <span style={{ fontSize: 10, color: "var(--text-muted)", transition: "transform 0.2s", transform: uatRoadmapOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
                </button>
                {uatRoadmapOpen && (
                  <div style={{ marginTop: 6, fontSize: 11, color: "var(--text-dim)", lineHeight: 1.8, padding: "14px 16px", border: "0.5px solid var(--border)", borderRadius: "var(--r)", background: "var(--surface)" }}>

                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c05040", marginBottom: 8 }}>New this week</div>

                    <div style={{ marginBottom: 4 }}><span style={{ color: "#c05040" }}>★</span> AI upgraded to GPT-4o — dramatically sharper responses</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "#c05040" }}>★</span> AI gives you perspectives first, asks questions second</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "#c05040" }}>★</span> AI sounds like a sharp friend, not a therapist</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "#c05040" }}>★</span> Multi-turn conversations fixed — AI actually follows the thread now</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "#c05040" }}>★</span> My Progress — all your data in one place. Sessions, patterns, pulse history, AI notes, and what you know about yourself.</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "#c05040" }}>★</span> Morning check-in now includes tension check — tap body areas to flag where you're holding it before your day starts.</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "#c05040" }}>★</span> Check-in windows tightened — morning 4:30 AM–5:30 PM, evening 6 PM–4 AM. No overlap, no confusion.</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "#c05040" }}>★</span> Watch & Choose now accessible from home screen under Go Deeper.</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "#c05040" }}>★</span> Reframe input now shows character count near the limit — keeps you focused on one thought.</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "#c05040" }}>★</span> Upload a screenshot in Reframe — tap 📎 to extract text from emails, texts, or social posts. Processed on your device, nothing sent anywhere.</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "#c05040" }}>★</span> AI knows the time — late night sessions hit different</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "#c05040" }}>★</span> Composure when winning — AI watches for overcommitment and blind spots when you're riding high</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "#c05040" }}>★</span> Language simplified — no more clinical jargon</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "#c05040" }}>★</span> Research blog post live — the science behind the two-pathway system</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "#c05040" }}>★</span> Composure Telemetry — heat map of your activity on My Progress</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "#c05040" }}>★</span> 60 BPM ambient pulse — the app calms you before you tap anything</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "#c05040" }}>★</span> Somatic interrupt — "Drop your shoulders" when you're typing too fast</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "#c05040" }}>★</span> Ghost echo — faint reminder of a past win when you log a pulse</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "#c05040" }}>★</span> End of day check-in — close the loop in 15 seconds after 6 PM</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "#c05040" }}>★</span> Install banner — guides new users to install the app</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "#c05040" }}>★</span> Visual grounding — organic fractal visuals behind breathing (Settings toggle)</div>

                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 8, marginTop: 16 }}>Already shipped</div>

                    <div style={{ marginBottom: 4 }}><span style={{ color: "var(--amber)" }}>✓</span> 5-scenario assessment — app adapts to how you process</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "var(--amber)" }}>✓</span> Tutorial with links to published research</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "var(--amber)" }}>✓</span> Morning check-in — sets your physical baseline for the AI</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "var(--amber)" }}>✓</span> AI mirrors your communication style</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "var(--amber)" }}>✓</span> AI writes session notes — gets sharper every conversation</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "var(--amber)" }}>✓</span> AI understands ego protection — backs off when you push back</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "var(--amber)" }}>✓</span> AI adjusts for depleted / pain / under-rested states</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "var(--amber)" }}>✓</span> Multi-select hardware check (pain + under-rested etc.)</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "var(--amber)" }}>✓</span> Adaptive home screen — thought-first / body-first / balanced</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "var(--amber)" }}>✓</span> Continue / Resend buttons — never lose a conversation</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "var(--amber)" }}>✓</span> App never punishes you for not using it</div>

                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8, marginTop: 16 }}>Coming soon</div>

                    <div style={{ marginBottom: 4 }}><span style={{ color: "var(--text-muted)" }}>⬡</span> Samsung Galaxy Watch — haptic breathing</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "var(--text-muted)" }}>⬡</span> Apple Watch — haptic breathing</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "var(--text-muted)" }}>⬡</span> Health integration — HRV, sleep, heart rate, cycle data</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "var(--text-muted)" }}>⬡</span> Auto-populated morning check-in from biometrics</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "var(--text-muted)" }}>⬡</span> Calendar-aware morning practice</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "var(--text-muted)" }}>⬡</span> Screen time awareness — context without self-report</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "var(--text-muted)" }}>⬡</span> Location-aware AI — work vs home vs commute</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "var(--text-muted)" }}>⬡</span> Weather + barometric pressure context</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "var(--text-muted)" }}>⬡</span> State-to-Statement — help you say what you mean</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "var(--text-muted)" }}>⬡</span> Signal Awareness speed tracking</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "var(--text-muted)" }}>⬡</span> Cloud sync across devices</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "var(--text-muted)" }}>⬡</span> Premium sound packs</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "var(--text-muted)" }}>⬡</span> PDF/CSV export of sessions + metrics</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "var(--text-muted)" }}>⬡</span> Shareable composure card</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "var(--text-muted)" }}>⬡</span> Anticipatory Regulation — calendar-aware cool-downs</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "var(--text-muted)" }}>⬡</span> Composure Gate — system-level interceptor before reactive actions</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "var(--text-muted)" }}>⬡</span> Composure Index — single prestige metric</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "var(--text-muted)" }}>⬡</span> Monthly composure summary</div>
                    <div style={{ marginBottom: 4 }}><span style={{ color: "var(--text-muted)" }}>⬡</span> Timed micro-resets — cooling system throughout the day</div>
                    <div style={{ marginTop: 8, fontSize: 10, color: "var(--text-muted)", fontStyle: "italic" }}>+ more in development</div>

                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6, marginTop: 16 }}>Native app</div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 10 }}>In development. Apple Developer active — TestFlight ready. Google Play Console setup pending.</div>

                    <div style={{ marginTop: 10, fontSize: 10, color: "var(--text-muted)" }}>Your feedback shapes this. Send anything: ARAembersllc@proton.me</div>
                  </div>
                )}
              </div>

              {/* MORNING CHECK-IN — appears during morning hours, not after EOD time */}
              {(() => {
                const now = new Date();
                const hour = now.getHours();
                const minute = now.getMinutes();
                const currentMinutes = hour * 60 + minute;
                const morningStart = (() => { try { const v = localStorage.getItem("stillform_morning_start"); return v ? parseInt(v) : 270; } catch { return 270; } })(); // default 4:30 AM = 270 min
                const eveningStart = (() => { try { const v = localStorage.getItem("stillform_evening_start"); return v ? parseInt(v) : 1080; } catch { return 1080; } })(); // default 6:00 PM = 1080 min
                
                // Morning check-in shows 4:30 AM – 5:30 PM
                // Stops at 5:30 so there's no overlap or confusion with EOD at 6 PM
                const morningEnd = 1050; // 5:30 PM
                if (currentMinutes < morningStart || currentMinutes >= morningEnd) return null;
                
                const today = now.toISOString().split("T")[0];
                // EOD done suppresses morning check-in only if EOD was completed TODAY
                // (edge case: someone does EOD very early morning — rare but valid)
                const eodDoneToday = (() => { try { const e = JSON.parse(localStorage.getItem("stillform_eod_today") || "null"); return e?.date === today && now.getHours() < 4; } catch { return false; } })();
                if (eodDoneToday) return null;

                const checkedIn = (() => { try { const c = JSON.parse(localStorage.getItem("stillform_checkin_today") || "null"); return c?.date === today; } catch { return false; } })();
                const isCheckedIn = ciSaved || checkedIn;

                const saveCheckin = () => {
                  const bioArray = [...ciBio].filter(b => b !== "clear");
                  try {
                    localStorage.setItem("stillform_checkin_today", JSON.stringify({
                      date: today, energy: ciEnergy || "steady", bio: bioArray.length > 0 ? bioArray : ["clear"],
                      tension: Object.keys(ciTension).length > 0 ? ciTension : null
                    }));
                    if (bioArray.length > 0) localStorage.setItem("stillform_bio_filter", bioArray.join(","));
                    else localStorage.setItem("stillform_bio_filter", "clear");
                  } catch {}
                  try {
                    const tensionAreas = Object.keys(ciTension).filter(k => ciTension[k] > 0);
                    window.plausible("Morning Check-In", { props: { energy: ciEnergy || "steady", tension_areas: tensionAreas.length } });
                  } catch {}
                  setCiSaved(true);
                  setCiOpen(false);
                };

                if (isCheckedIn) return (
                  <div style={{ marginBottom: 20 }}>
                    <button onClick={() => { setCiSaved(false); setCiOpen(true); setCiTension({}); setCiEnergy(null); setCiBio(new Set()); }} style={{
                      background: "none", border: "none", fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.12em", cursor: "pointer", padding: 0
                    }}>
                      ✓ Checked in · tap to update
                    </button>
                  </div>
                );

                if (!ciOpen) return (
                  <button onClick={() => setCiOpen(true)} style={{
                    width: "100%", background: "var(--surface)", border: "0.5px solid var(--amber-dim)",
                    borderRadius: "var(--r)", padding: "14px 18px", marginBottom: 20, cursor: "pointer",
                    textAlign: "left", WebkitTapHighlightColor: "transparent"
                  }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber)" }}>Morning check-in</div>
                    <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>Set your tone for today</div>
                  </button>
                );

                return (
                  <div style={{ background: "var(--surface)", border: "0.5px solid var(--amber-dim)", borderRadius: "var(--r)", padding: "18px", marginBottom: 20 }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 14 }}>Morning check-in</div>

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
                          setCiBio(prev => {
                            const next = new Set(prev);
                            if (b.id === "clear") return new Set(["clear"]);
                            next.delete("clear");
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
                    </div>

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
                      Set my tone →
                    </button>
                  </div>
                );
              })()}

              {/* DOMINANT CTA — Adaptive to regulation type */}
              <div style={{ marginBottom: 48, animation: "entrain60glow 1s ease-in-out infinite" }}>
                {/* Identity line */}
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontStyle: "italic", color: "var(--text-muted)", marginBottom: 16, letterSpacing: "0.02em", animation: "entrain60 1s ease-in-out infinite" }}>
                  {isThoughtFirst ? "Think clearly. Then settle." : isBodyFirst ? "Settle the body. Then think." : "Choose your entry point."}
                </div>

                {/* Balanced: three equal buttons */}
                {!isThoughtFirst && !isBodyFirst ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={async () => {
                        if (await biometric.gate()) { setPathway("calm"); startTool(TOOLS.find(t => t.id === "reframe")); }
                      }} style={{
                        flex: 1, background: "var(--surface)", border: "0.5px solid var(--amber-dim)",
                        borderRadius: "var(--r)", padding: "20px 10px", cursor: "pointer",
                        WebkitTapHighlightColor: "transparent", textAlign: "center"
                      }}>
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)" }}>✦ Reframe</div>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "var(--text)", marginTop: 6 }}>Talk it out</div>
                      </button>
                      <button onClick={() => startPathway("calm")} style={{
                        flex: 1, background: "var(--surface)", border: "0.5px solid var(--amber-dim)",
                        borderRadius: "var(--r)", padding: "20px 10px", cursor: "pointer",
                        WebkitTapHighlightColor: "transparent", textAlign: "center"
                      }}>
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)" }}>◎ Breathe</div>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "var(--text)", marginTop: 6 }}>Calm my body</div>
                      </button>
                    </div>
                    <button onClick={() => startTool(TOOLS.find(t => t.id === "scan"))} style={{
                      width: "100%", background: "var(--surface)", border: "0.5px solid var(--border)",
                      borderRadius: "var(--r)", padding: "16px 10px", cursor: "pointer",
                      WebkitTapHighlightColor: "transparent", textAlign: "center"
                    }}>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-dim)" }}>◉ Body Scan</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>Release tension</div>
                    </button>
                  </div>
                ) : (
                <>
                {/* Primary tool — determined by regulation type */}
                <button onClick={async () => {
                  if (isThoughtFirst) {
                    if (await biometric.gate()) { setPathway("calm"); startTool(TOOLS.find(t => t.id === "reframe")); }
                  } else {
                    startPathway("calm");
                  }
                }} style={{
                  width: "100%", background: "var(--amber)", color: "#0A0A0C", border: "none",
                  borderRadius: "var(--r)", padding: "22px 24px", fontSize: 16, fontWeight: 500,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.2)",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  WebkitTapHighlightColor: "transparent"
                }}>
                  <div>
                    <div>{isBodyFirst ? "Calm my body" : "Talk it out"}</div>
                    <div style={{ fontSize: 12, fontWeight: 500, opacity: 1, marginTop: 2, color: "rgba(10,10,12,0.75)" }}>
                      {isBodyFirst ? "Settle the nervous system" : "Think through what's happening"}
                    </div>
                  </div>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.1em", opacity: 1, color: "rgba(10,10,12,0.65)" }}>
                    {isBodyFirst ? "◎ BREATHE" : "✦ REFRAME"}
                  </span>
                </button>

                {/* Secondary tool + Body Scan */}
                <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                  <button onClick={async () => {
                    if (isBodyFirst) {
                      if (await biometric.gate()) { setPathway("calm"); startTool(TOOLS.find(t => t.id === "reframe")); }
                    } else {
                      startPathway("calm");
                    }
                  }} style={{
                    flex: 1, background: "var(--surface)", border: "0.5px solid var(--amber-dim)",
                    borderRadius: "var(--r)", padding: "14px 10px", cursor: "pointer",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.025)",
                    WebkitTapHighlightColor: "transparent", textAlign: "center"
                  }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)" }}>
                      {isBodyFirst ? "✦ Reframe" : "◎ Breathe"}
                    </div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.3 }}>
                      {isBodyFirst ? "Talk it out" : "Calm my body"}
                    </div>
                  </button>
                  <button onClick={() => startTool(TOOLS.find(t => t.id === "scan"))} style={{
                    flex: 1, background: "var(--surface)", border: "0.5px solid var(--border)",
                    borderRadius: "var(--r)", padding: "14px 10px", cursor: "pointer",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.025)",
                    WebkitTapHighlightColor: "transparent", textAlign: "center"
                  }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-dim)" }}>◉ Body Scan</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.3 }}>Release tension</div>
                  </button>
                </div>
                </>
                )}
              </div>

              {/* STREAK — only if exists */}
              {(() => {
                try {
                  const sessions = JSON.parse(localStorage.getItem("stillform_sessions") || "[]");
                  if (sessions.length === 0) return null;
                  const daySet = new Set(sessions.map(s => s.timestamp?.slice(0, 10)).filter(Boolean));
                  let streak = 0;
                  for (let i = 0; i < 365; i++) {
                    const d = new Date(); d.setDate(d.getDate() - i);
                    if (daySet.has(d.toISOString().slice(0, 10))) streak++; else break;
                  }
                  const improving = (() => {
                    const rated = sessions.filter(s => s.preRating && s.postRating);
                    if (rated.length < 8) return false;
                    const early = rated.slice(0, 5).map(s => s.duration).filter(d => d > 0);
                    const recent = rated.slice(-5).map(s => s.duration).filter(d => d > 0);
                    const earlyAvg = early.length ? early.reduce((a, b) => a + b, 0) / early.length : 0;
                    const recentAvg = recent.length ? recent.reduce((a, b) => a + b, 0) / recent.length : 0;
                    return recentAvg < earlyAvg * 0.85 && earlyAvg > 0;
                  })();
                  return (
                    <div style={{ marginBottom: 40, display: "flex", alignItems: "center", gap: 24 }}>
                      <div>
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 28, fontWeight: 300, color: "var(--amber)", lineHeight: 1 }}>{sessions.length}</div>
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, color: "var(--text-muted)", letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 4 }}>Sessions</div>
                      </div>
                      {streak > 1 && <div>
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 28, fontWeight: 300, color: "var(--amber)", lineHeight: 1 }}>{streak}</div>
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, color: "var(--text-muted)", letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 4 }}>Day streak</div>
                      </div>}
                      {improving && <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "var(--amber)", letterSpacing: "0.1em" }}>↑ Trending faster</div>}
                    </div>
                  );
                } catch { return null; }
              })()}

              {/* GO DEEPER — secondary, below the line */}
              {(() => {
                const biasDone = (() => { try { return JSON.parse(localStorage.getItem("stillform_bias_profile") || "null"); } catch { return null; } })();
                const signalDone = (() => { try { const p = JSON.parse(localStorage.getItem("stillform_signal_profile") || "null"); return p?.firstAreas?.length > 0; } catch { return false; } })();
                const calibrationComplete = signalDone && !!biasDone;

                const tools = [
                  ...(!signalDone ? [{ id: "signals", label: "Map Signals", rec: true }] : []),
                  ...(!biasDone ? [{ id: "bias", label: "Blind Spots", rec: true }] : []),
                  { id: "meta", label: "Watch & Choose", rec: false },
                ];

                return (
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)" }}>Go Deeper</div>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", opacity: 0.5 }}>After session</div>
                    </div>
                    {calibrationComplete && (
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10, fontStyle: "italic" }}>
                        Calibration complete. Update signal mapping, blind spots, or processing type anytime in Settings.
                      </div>
                    )}
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      {tools.map(item => (
                        <button key={item.id} onClick={() => startTool(TOOLS.find(t => t.id === item.id))} style={{
                          width: "100%", background: item.rec ? "rgba(200,146,42,0.05)" : "var(--surface)",
                          border: `0.5px solid ${item.rec ? "var(--amber-dim)" : "var(--border)"}`,
                          borderRadius: "var(--r)", padding: "11px 14px", textAlign: "left", cursor: "pointer",
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
                          WebkitTapHighlightColor: "transparent"
                        }}>
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--text)" }}>{item.label}</span>
                          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: item.rec ? "var(--amber)" : "var(--text-muted)", letterSpacing: "0.1em" }}>
                            {item.rec ? "REC" : "→"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* END OF DAY CHECK-IN — appears 6 PM through 4 AM only */}
              {(() => {
                const now = new Date();
                const currentMinutes = now.getHours() * 60 + now.getMinutes();
                const eveningStart = (() => { try { const v = localStorage.getItem("stillform_evening_start"); return v ? parseInt(v) : 1080; } catch { return 1080; } })(); // default 6:00 PM
                const morningCap = 240; // 4:00 AM — EOD window closes
                const inEodWindow = currentMinutes >= eveningStart || currentMinutes < morningCap;
                if (!inEodWindow) return null;
                const today = now.toISOString().split("T")[0];
                const eodDone = (() => { try { const e = JSON.parse(localStorage.getItem("stillform_eod_today") || "null"); return e?.date === today; } catch { return false; } })();
                if (eodSaved && !eodOpen) return (
                  <div style={{ marginBottom: 20, textAlign: "center" }}>
                    {!eodPromptDismissed ? (
                      <div style={{ background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "18px", textAlign: "center" }}>
                        <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 14, lineHeight: 1.6 }}>Anything you want to clear before bed?</div>
                        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                          <button className="btn btn-primary" style={{ fontSize: 13, padding: "8px 18px" }} onClick={() => { setEodPromptDismissed(true); setActiveTool({ id: "reframe", name: "Reframe", mode: "calm" }); setScreen("tool"); }}>Talk it out →</button>
                          <button className="btn btn-ghost" style={{ fontSize: 12, padding: "8px 14px" }} onClick={() => setEodPromptDismissed(true)}>I'm good</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => { setEodSaved(false); setEodOpen(true); setEodPromptDismissed(false); }} style={{
                        background: "none", border: "none", fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.12em", cursor: "pointer"
                      }}>✓ Day closed · tap to update</button>
                    )}
                  </div>
                );
                if (eodDone && !eodOpen) return (
                  <div style={{ marginBottom: 20, textAlign: "center" }}>
                    <button onClick={() => setEodOpen(true)} style={{
                      background: "none", border: "none", fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.12em", cursor: "pointer"
                    }}>✓ Day closed · tap to update</button>
                  </div>
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
                  } catch {}
                  try { window.plausible("End of Day Check-In", { props: { composure: eodComposure || "mostly" } }); } catch {}
                  setEodSaved(true);
                  setEodPromptDismissed(false);
                  setEodOpen(false);
                };

                if (!eodOpen && !eodDone) return (
                  <button onClick={() => setEodOpen(true)} style={{
                    width: "100%", background: "var(--surface)", border: "0.5px solid var(--border)",
                    borderRadius: "var(--r)", padding: "14px 18px", marginBottom: 20, cursor: "pointer",
                    textAlign: "left", WebkitTapHighlightColor: "transparent"
                  }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)" }}>End of day</div>
                    <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>Close the loop — 15 seconds</div>
                  </button>
                );

                return (
                  <div style={{ background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: "var(--r)", padding: "18px", marginBottom: 20 }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 14 }}>End of day</div>

                    <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 10 }}>Where's your energy?</div>
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

                    <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 10 }}>How'd you carry yourself today?</div>
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

                    <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 10 }}>One word for today</div>
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
                    }}>Close the day →</button>
                  </div>
                );
              })()}

              {/* BOTTOM LINKS — minimal */}
              <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
                <button onClick={async () => { if (await biometric.gate()) setScreen("progress"); }} style={{ background: "none", border: "none", fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer" }}>My Progress</button>
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
              <button className="intervention-back" onClick={() => setScreen("home")} style={{ marginBottom: 0 }}>
                ← Back
              </button>
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
            <div style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", marginBottom: 12 }}>
              Your data is encrypted. <button onClick={() => setScreen("crisis")} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 11, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>Crisis resources</button>
            </div>
            {renderTool()}
          </section>
        )}

        {/* MY PROGRESS */}
        {screen === "progress" && (
          <MyProgress onBack={() => setScreen("home")} />
        )}

        {/* JOURNAL — log triggers, emotions, outcomes */}

        {/* PRICING */}
        {screen === "pricing" && (
          <section className="pricing">
            {!trialExpired && <button className="intervention-back" onClick={() => setScreen("home")}>← Back</button>}
            <div className="pricing-header">
              <h2>{trialExpired ? "Your subscription has ended." : "Subscribe. Stay only if it works."}</h2>
              <p>{trialExpired ? "Subscribe to keep using Stillform. Your data is safe — right where you left it." : "Try everything free for 14 days. Composure when you need it — under two minutes."}</p>
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
                  <li>3 AI modes: Regulate, Get Sharp, Lock In</li>
                  <li>Pulse with AI memory</li>
                  <li>Daily check-in</li>
                  <li>Device-local encrypted storage</li>
                  <li>Signal mapping + tension check</li>
                  <li>Pattern recognition (evolves with use)</li>
                  <li>Voice-to-text everywhere</li>
                  <li>AES-256 encryption on all session data</li>
                </ul>
                <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => { window.location.href = "https://embers.lemonsqueezy.com/checkout/buy/a150deb3-79d1-4418-904d-434662c9eed7?checkout[custom][redirect_url]=" + encodeURIComponent(window.location.origin + "/?subscribed=true"); }}>
                  {trialExpired ? "Subscribe now →" : "Subscribe →"}
                </button>
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
            <button className="intervention-back" onClick={() => setScreen("home")}>← Back</button>
            <h1>Privacy & Disclaimers</h1>
            <div className="privacy-date">Effective April 01, 2026 · ARA Embers LLC</div>
            <p style={{ marginBottom: 24 }}><a href="https://app.termly.io/policy-viewer/policy.html?policyUUID=b96f179b-d3e1-4bdb-acc8-6b656ffe0280" target="_blank" rel="noopener noreferrer" style={{ color: "var(--amber)" }}>View full Privacy Policy</a></p>

            <h2>What Stillform Is</h2>
            <p>Stillform is a composure and self-awareness tool. It provides structured breathing exercises, sensory grounding techniques, acupressure guidance, and AI-assisted cognitive reframing to help users regulate their nervous system and develop awareness of their own mental and emotional patterns.</p>

            <h2>What Stillform Is Not</h2>
            <p>Stillform is not medical treatment, therapy, counseling, or a crisis intervention service. It does not diagnose, treat, cure, or prevent any medical or psychological condition. It is not a substitute for professional medical advice, diagnosis, or treatment. If you are experiencing a medical or mental health crisis, please see our Crisis Resources page for international helplines.</p>

            <h2>Acupressure</h2>
            <p>The acupressure guidance in Stillform is for general wellness purposes only. It is not medical treatment. The pressure points referenced are based on traditional practices and are provided for informational and self-care purposes. Consult a healthcare provider before beginning any new wellness practice, especially if you are pregnant, have a medical condition, or are taking medication.</p>

            <h2>AI-Powered Reframe</h2>
            <p>The Reframe feature uses artificial intelligence (OpenAI's GPT-4o) to generate responses based on evidence-based reframing techniques. These responses are generated by AI, not by a licensed therapist or medical professional. AI responses may not always be accurate, appropriate, or applicable to your situation. Do not rely on AI-generated content as a substitute for professional mental health care. Do not enter sensitive personal, medical, or identifying information.</p>
            <p>Text entered into the Reframe feature is sent to OpenAI's servers for processing via our API integration. OpenAI does not store or retain conversation data sent through the API, and it is not used to train AI models. See our <a href="https://app.termly.io/policy-viewer/policy.html?policyUUID=b96f179b-d3e1-4bdb-acc8-6b656ffe0280" target="_blank" rel="noopener noreferrer" style={{ color: "var(--amber)" }}>full Privacy Policy</a> for details.</p>

            <h2>My Patterns — System Diagnostics</h2>
            <p>Stillform tracks session data and may surface patterns or insights based on your usage history. These insights are observational and educational. They are not clinical assessments, diagnoses, or medical advice. Patterns identified by the app reflect your self-reported data and should not be used as the basis for medical or psychological decisions.</p>

            <h2>Your Data</h2>
            <p>Stillform stores session data, signal profiles, check-ins, and saved reframes locally on your device using AES-256 encryption. Your data never leaves your device. You can delete your data at any time from Settings.</p>
            <p>If you subscribe, we collect your email address and payment information through our payment processor (Lemon Squeezy). We do not store credit card numbers.</p>

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
            <button className="intervention-back" onClick={() => setScreen("settings")}>← Back</button>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, marginBottom: 16 }}>FAQ</h1>
            <div style={{ fontSize: 14, fontStyle: "italic", color: "var(--text-dim)", lineHeight: 1.7, marginBottom: 32, fontFamily: "'Cormorant Garamond', serif" }}>
              Composure is being in control of how you show up — in any moment that matters.
            </div>

            {[
              {
                q: "What is Stillform?",
                a: "A composure system. Breathing, body scan, and AI-powered reframing — built for your morning practice, for the moments that test you, and for the moments when you're winning. Composure matters most when things are going well."
              },
              {
                q: "Who is this for?",
                a: "Anyone who wants more control over how they show up. Not just in hard moments — every day. The person who wants to walk into any room composed, handle whatever comes, and know they're getting better at it over time."
              },
              {
                q: "What does the AI actually do?",
                a: "It helps you see what's really happening. Names the pattern, separates what's real from what your brain is adding, and helps you choose your next move instead of running on autopilot. It sharpens over time based on your Pulse entries and session history."
              },
              {
                q: "How does the AI know what I need?",
                a: "It reads your feel state, your physical state, and what you type. If you're excited, it channels the energy and checks for overcommitment. If you're spiraling, it cuts the loop with one sharp question. If you're processing, it gives you perspectives and names what your brain is adding. You don't choose a mode — it adapts to you."
              },
              {
                q: "Does the AI learn about me?",
                a: "Yes. It reads your Pulse, signal profile, blind spots, and check-ins. The more you use it, the more precise it gets about your specific patterns and how you move through states."
              },
              {
                q: "What's the AI's limitation?",
                a: "It's a tool, not a person. It may occasionally miss context or give a response that doesn't land. It can't give medical, legal, or financial advice. If something it says doesn't fit — tell it. It adjusts."
              },
              {
                q: "What is the Pulse?",
                a: "A quick after-action record. What happened, what you felt, how it landed — logged in about 15 seconds. The AI uses these to spot your patterns over time."
              },
              {
                q: "What is Watch & Choose?",
                a: "A five-step tool that walks you through catching a thought pattern in real time — notice it in your body, name the thought, recognize the pattern, find what you actually need, then choose what to do next. Access it from Go Deeper on the home screen."
              },
              {
                q: "How does Pulse work?",
                a: "When you select how you're feeling before a session, it logs automatically. Your full Pulse history lives in My Progress — along with AI session notes, pattern analysis, and everything the app has learned about you."
              },
              {
                q: "What is Composure Telemetry?",
                a: "A 12-week visual timeline on My Progress. Every session and Pulse entry lights up a cell. Brighter amber means more activity that day. It's your composure practice at a glance — not a diary, a flight recorder."
              },
              {
                q: "What's the morning check-in?",
                a: "Three quick steps at the start of your day — your energy level, your hardware state, and where you're holding tension in your body. Takes under 30 seconds. The AI uses all of it as context for every session that day."
              },
              {
                q: "What's the end of day check-in?",
                a: "After 6 PM, three taps to close the loop. Where your energy is, did you hold composure, one word for the day. The AI uses yesterday's close as context the next morning."
              },
              {
                q: "What happens when I type fast in Reframe?",
                a: "The app notices. If you're typing rapidly — a sign your body is ahead of your thoughts — a gentle nudge appears: 'Drop your shoulders' or 'Unclench your jaw.' It fades after a few seconds. The system watches your body, not just your words."
              },
              {
                q: "Is my data private?",
                a: "Your data is encrypted and stored on your device. The AI receives your context to generate a response, then forgets it. Nothing is stored on our servers. You can delete everything anytime from Settings."
              },
              {
                q: "How much does it cost?",
                a: "$14.99/month or $9.99/month on the annual plan ($119.88/year). One price — everything included. No add-ons."
              },
              {
                q: "What if I cancel?",
                a: "Your data stays on your device — nothing is lost. You can resubscribe anytime and pick up right where you left off."
              },
              {
                q: "Can I upload a screenshot to Reframe?",
                a: "Yes. Tap the 📎 icon in Reframe to upload a screenshot of an email, text, or social post. The text is extracted on your device — nothing is sent to any server. It drops into the input so you can edit it before sending to the AI."
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
            <button className="intervention-back" onClick={() => setScreen("home")}>← Back</button>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, marginBottom: 8 }}>Crisis Resources</h1>
            <p style={{ fontSize: 14, color: "var(--text-dim)", lineHeight: 1.7, marginBottom: 28 }}>
              Stillform is a composure tool, not a crisis service. If you or someone you know is in immediate danger or experiencing a mental health crisis, please reach out to a professional.
            </p>
            {[
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
            ].map((country, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 8 }}>{country.region}</div>
                {country.lines.map((line, j) => {
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
                })}
              </div>
            ))}
          </section>
        )}

        {/* SETTINGS */}
        {screen === "settings" && (
          <section style={{ maxWidth: 480, margin: "0 auto", padding: "48px 24px" }}>
            <button className="intervention-back" onClick={() => setScreen("home")}>← Back</button>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, marginBottom: 32 }}>Settings</h1>

            {/* Language */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 4 }}>Language</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10, lineHeight: 1.5 }}>
                Additional languages coming soon.
              </div>
              <div style={{
                background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                padding: "12px 14px", color: "var(--text)", fontSize: 14, fontFamily: "'DM Sans', sans-serif"
              }}>
                English
              </div>
            </div>

            {/* Regulation Type */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 4 }}>Processing Type</div>
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
                  <button key={t.id} onClick={() => {
                    try { localStorage.setItem("stillform_regulation_type", t.id); setRegType(t.id); refreshSettings(); } catch {}
                  }} style={{
                    width: "100%", padding: "14px 16px", textAlign: "left", cursor: "pointer",
                    background: isSelected ? "var(--amber-glow)" : "var(--surface)",
                    border: `1px solid ${isSelected ? "var(--amber-dim)" : "var(--border)"}`,
                    borderRadius: "var(--r-lg)", marginBottom: 6, color: "var(--text)",
                    fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s"
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, color: isSelected ? "var(--amber)" : "var(--text)" }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)", lineHeight: 1.5 }}>{t.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Breathing Pattern */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 4 }}>Breathing Pattern</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10, lineHeight: 1.6 }}>
                Your default starts automatically each session. Quick for regulation on the go, Deep for a fuller reset.
              </div>
              {[
                { id: "quick", name: "Quick Reset", use: "60 seconds. Regulate and get back to it.", why: "Focused breathing slows your system. The shift starts in under a minute." },
                { id: "deep", name: "Deep Regulate", use: "3 minutes. Deeper reset.", why: "Extended exhale cycle gives your nervous system time to fully downregulate." }
              ].map(p => {
                const isSelected = (() => { try { return (localStorage.getItem("stillform_breath_pattern") || "quick") === p.id; } catch { return p.id === "quick"; } })();
                return (
                  <button key={p.id} onClick={() => {
                    try { localStorage.setItem("stillform_breath_pattern", p.id); refreshSettings(); } catch {}
                  }} style={{
                    width: "100%", padding: "14px 16px", textAlign: "left", cursor: "pointer",
                    background: isSelected ? "var(--amber-glow)" : "var(--surface)",
                    border: `1px solid ${isSelected ? "var(--amber-dim)" : "var(--border)"}`,
                    borderRadius: "var(--r-lg)", marginBottom: 6, color: "var(--text)",
                    fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s"
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, color: isSelected ? "var(--amber)" : "var(--text)" }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "var(--amber)", marginBottom: 4, fontStyle: "italic" }}>{p.use}</div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)", lineHeight: 1.5 }}>{p.why}</div>
                  </button>
                );
              })}
            </div>

            {/* Check-In Schedule */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 4 }}>Check-In Schedule</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10, lineHeight: 1.5 }}>
                When morning check-in appears and when end of day begins.
              </div>
              {(() => {
                const morningMin = (() => { try { return parseInt(localStorage.getItem("stillform_morning_start") || "270"); } catch { return 270; } })();
                const eveningMin = (() => { try { return parseInt(localStorage.getItem("stillform_evening_start") || "1080"); } catch { return 1080; } })();
                const toTime = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
                const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
            </div>

            {/* Daily Reminder */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 4 }}>Daily Reminder</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10, lineHeight: 1.5 }}>
                A daily nudge to check in. Delivered as a push notification on iOS and Android.
              </div>
              {(() => {
                const reminderOn = (() => { try { return localStorage.getItem("stillform_reminder") === "on"; } catch { return false; } })();
                const reminderTime = (() => { try { return localStorage.getItem("stillform_reminder_time") || "08:00"; } catch { return "08:00"; } })();
                const [rHour, rMin] = reminderTime.split(":").map(Number);
                return (
                  <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
                    <div style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 14, color: "var(--text)" }}>Daily check-in</div>
                        <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>
                          {reminderOn ? `Scheduled · ${reminderTime}` : "Off"}
                        </div>
                      </div>
                      <button onClick={() => {
                        try {
                          const current = localStorage.getItem("stillform_reminder") === "on";
                          localStorage.setItem("stillform_reminder", current ? "off" : "on");
                          if (!current) scheduleReminder("Stillform", "Time to check in. How steady are you?", rHour, rMin);
                          refreshSettings();
                        } catch {}
                      }} style={{
                        background: reminderOn ? "var(--amber)" : "var(--border)",
                        border: "none", borderRadius: "var(--r-lg)", width: 44, height: 24,
                        cursor: "pointer", position: "relative", transition: "background 0.2s",
                        flexShrink: 0
                      }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: "50%", background: "white",
                          position: "absolute", top: 3, left: reminderOn ? 23 : 3, transition: "left 0.2s"
                        }} />
                      </button>
                    </div>
                    {reminderOn && (
                      <div style={{ padding: "12px 18px", borderTop: "0.5px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Time</div>
                        <input type="time" defaultValue={reminderTime} onChange={e => {
                          try {
                            localStorage.setItem("stillform_reminder_time", e.target.value);
                            const [h, m] = e.target.value.split(":").map(Number);
                            scheduleReminder("Stillform", "Time to check in. How steady are you?", h, m);
                            refreshSettings();
                          } catch {}
                        }} style={{
                          background: "var(--surface2)", border: "0.5px solid var(--border)",
                          borderRadius: "var(--r)", padding: "6px 10px", color: "var(--text)",
                          fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none"
                        }} />
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Audio */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 10 }}>Audio</div>
              <div style={{
                background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <div>
                  <div style={{ fontSize: 14, color: "var(--text)" }}>Breathing audio guidance</div>
                  <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>Gentle tones during breathing exercises</div>
                </div>
                <button onClick={() => {
                  try {
                    const current = localStorage.getItem("stillform_audio") === "on";
                    localStorage.setItem("stillform_audio", current ? "off" : "on");
                    refreshSettings();
                  } catch {}
                }} style={{
                  background: (() => { try { return localStorage.getItem("stillform_audio") === "on" ? "var(--amber)" : "var(--border)"; } catch { return "var(--border)"; } })(),
                  border: "none", borderRadius: "var(--r-lg)", width: 44, height: 24, cursor: "pointer", position: "relative", transition: "background 0.2s"
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%", background: "white", position: "absolute", top: 3,
                    left: (() => { try { return localStorage.getItem("stillform_audio") === "on" ? 23 : 3; } catch { return 3; } })(),
                    transition: "left 0.2s"
                  }} />
                </button>
              </div>
            </div>

            {/* Body Scan Pace */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 6 }}>Body Scan Pace</div>
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
                      borderRadius: "var(--r)", padding: "10px 8px", cursor: "pointer",
                      textAlign: "center", transition: "all 0.15s",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.025)"
                    }}>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: active ? "var(--amber)" : "var(--text-dim)", fontWeight: active ? 500 : 400 }}>{opt.label}</div>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.08em", marginTop: 3 }}>{opt.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Display */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 10 }}>Display</div>
              {[
                { key: "stillform_screenlight", label: "Screen-light mode", desc: "Dims screen to near-black during exercises. Audio guides you.", icon: "◐" },
                { key: "stillform_reducedmotion", label: "Reduced motion", desc: "Removes animations. Text and timers only.", icon: "◻" },
                { key: "stillform_visual_grounding", label: "Visual grounding", desc: "Organic fractal visuals behind breathing exercises. Helps ground through visual focus.", icon: "◈", defaultOn: true }
              ].map(opt => {
                const isOn = (() => { try { const v = localStorage.getItem(opt.key); if (v === null && opt.defaultOn) return true; return v === "on"; } catch { return !!opt.defaultOn; } })();
                return (
                  <div key={opt.key} style={{
                    background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                    padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center",
                    marginBottom: 8
                  }}>
                    <div>
                      <div style={{ fontSize: 14, color: "var(--text)" }}>{opt.icon} {opt.label}</div>
                      <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>{opt.desc}</div>
                    </div>
                    <button onClick={() => {
                      try { localStorage.setItem(opt.key, isOn ? "off" : "on"); refreshSettings(); } catch {}
                    }} style={{
                      background: isOn ? "var(--amber)" : "var(--border)",
                      border: "none", borderRadius: "var(--r-lg)", width: 44, height: 24, cursor: "pointer",
                      position: "relative", transition: "background 0.2s", flexShrink: 0
                    }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: "50%", background: "white",
                        position: "absolute", top: 3, left: isOn ? 23 : 3, transition: "left 0.2s"
                      }} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Security — only visible in native shell (Face ID / fingerprint) */}
            {isNative() && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 10 }}>Security</div>
                {(() => {
                  const bioOn = (() => { try { return localStorage.getItem("stillform_biometric_enabled") === "yes"; } catch { return false; } })();
                  return (
                    <div style={{
                      background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                      padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center"
                    }}>
                      <div>
                        <div style={{ fontSize: 14, color: "var(--text)" }}>🔒 Biometric lock</div>
                        <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>Require Face ID or fingerprint for Reframe and Pulse</div>
                      </div>
                      <button onClick={() => {
                        biometric.setEnabled(!bioOn);
                        refreshSettings();
                      }} style={{
                        background: bioOn ? "var(--amber)" : "var(--border)",
                        border: "none", borderRadius: "var(--r-lg)", width: 44, height: 24, cursor: "pointer",
                        position: "relative", transition: "background 0.2s", flexShrink: 0
                      }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: "50%", background: "white",
                          position: "absolute", top: 3, left: bioOn ? 23 : 3, transition: "left 0.2s"
                        }} />
                      </button>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Sound */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 10 }}>Sound</div>
              {(() => {
                const current = (() => { try { return localStorage.getItem("stillform_sound_type") || "tone"; } catch { return "tone"; } })();
                const free = [
                  { id: "tone", label: "Tone", desc: "Oscillator tones that follow your breath" },
                  { id: "rhythm", label: "Rhythm", desc: "Pulsing beat matched to breathing pattern" },
                  { id: "silence", label: "Silence", desc: "No sound. Visual cues only." }
                ];
                const premium = [
                  { id: "bowl", label: "Singing bowl" },
                  { id: "rain", label: "Rain" },
                  { id: "ocean", label: "Ocean waves" },
                  { id: "lofi", label: "Lo-fi ambient" },
                  { id: "white", label: "White noise" }
                ];
                return (
                  <>
                    {free.map(s => (
                      <button key={s.id} onClick={() => {
                        try { localStorage.setItem("stillform_sound_type", s.id); } catch {}
                        refreshSettings();
                      }} style={{
                        width: "100%", background: current === s.id ? "rgba(201,147,58,0.08)" : "var(--surface)",
                        border: `1px solid ${current === s.id ? "var(--amber-dim)" : "var(--border)"}`,
                        borderRadius: "var(--r-lg)", padding: "12px 16px", marginBottom: 6, cursor: "pointer",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        fontFamily: "'DM Sans', sans-serif", textAlign: "left"
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
                        padding: "12px 16px", marginBottom: 6, opacity: 0.35,
                        display: "flex", justifyContent: "space-between", alignItems: "center"
                      }}>
                        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{s.label}</div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Coming soon</div>
                      </div>
                    ))}
                  </>
                );
              })()}
            </div>

            {/* Your Logs */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 10 }}>Your Logs</div>

              {/* Session Log */}
              <button onClick={() => setOpenLog(openLog === "sessions" ? null : "sessions")} style={{
                width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                padding: "14px 18px", marginBottom: 6, cursor: "pointer", textAlign: "left",
                fontFamily: "'DM Sans', sans-serif", display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <div>
                  <div style={{ fontSize: 14, color: "var(--text)" }}>Session history</div>
                  <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
                    {(() => { try { return JSON.parse(localStorage.getItem("stillform_sessions") || "[]").length; } catch { return 0; } })()} sessions
                  </div>
                </div>
                <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{openLog === "sessions" ? "▾" : "▸"}</span>
              </button>
              {openLog === "sessions" && (() => {
                try {
                  const sessions = JSON.parse(localStorage.getItem("stillform_sessions") || "[]").slice().reverse();
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
                            <div style={{ color: "var(--text)", marginTop: 2 }}>
                              {(s.tools || []).map(t => toolLabel[t] || t).join(", ") || "Session"} · {durStr}
                            </div>
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
                  <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
                    {(() => { try { return JSON.parse(localStorage.getItem("stillform_journal") || "[]").length; } catch { return 0; } })()} entries
                  </div>
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

              {/* Saved Reframes Log */}
              <button onClick={() => setOpenLog(openLog === "reframes" ? null : "reframes")} style={{
                width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                padding: "14px 18px", marginBottom: 6, cursor: "pointer", textAlign: "left",
                fontFamily: "'DM Sans', sans-serif", display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <div>
                  <div style={{ fontSize: 14, color: "var(--text)" }}>Saved reframes</div>
                  <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
                    {(() => { try { return JSON.parse(localStorage.getItem("stillform_saved_reframes") || "[]").length; } catch { return 0; } })()} saved
                  </div>
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

              {/* Signal Profile */}
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "14px 18px", marginBottom: 6 }}>
                <div style={{ fontSize: 14, color: "var(--text)", marginBottom: 4 }}>Signal profile</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
                  {(() => { try { const s = JSON.parse(localStorage.getItem("stillform_signal_profile") || "{}"); return Object.keys(s).length > 0 ? "Configured" : "Not set up yet — find Signal Mapping in Settings"; } catch { return "Not set up yet"; } })()}
                </div>
              </div>
            </div>

            {/* Links */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 10 }}>More</div>

            {/* PREMIUM CUSTOMIZATION */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 10 }}>Customization</div>

              {/* Theme — free: dark. Others IAP */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 8 }}>Theme</div>
                {[
                  { id: "dark", label: "Dark", free: true },
                  { id: "midnight", label: "Midnight Blue", free: false },
                  { id: "warm", label: "Warm Amber", free: false },
                  { id: "light", label: "Light", free: false }
                ].map(t => (
                  <div key={t.id} style={{
                    background: t.id === "dark" ? "var(--amber-glow)" : "var(--surface)",
                    border: `1px solid ${t.id === "dark" ? "var(--amber-dim)" : "var(--border)"}`,
                    borderRadius: "var(--r-lg)", padding: "12px 16px", marginBottom: 4,
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    opacity: t.free ? 1 : 0.4
                  }}>
                    <div style={{ fontSize: 14, color: t.free ? "var(--text)" : "var(--text-muted)" }}>{t.label}</div>
                    {!t.free && <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Premium</div>}
                  </div>
                ))}
              </div>

              {/* AI Tone — IAP */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 8 }}>AI Reframe Tone</div>
                {[
                  { id: "default", label: "Balanced (default)", free: true },
                  { id: "gentle", label: "Gentle", free: false },
                  { id: "direct", label: "Direct & blunt", free: false },
                  { id: "clinical", label: "Clinical / technical", free: false },
                  { id: "motivational", label: "Motivational", free: false }
                ].map(t => (
                  <div key={t.id} style={{
                    background: t.id === "default" ? "var(--amber-glow)" : "var(--surface)",
                    border: `1px solid ${t.id === "default" ? "var(--amber-dim)" : "var(--border)"}`,
                    borderRadius: "var(--r-lg)", padding: "12px 16px", marginBottom: 4,
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    opacity: t.free ? 1 : 0.4
                  }}>
                    <div style={{ fontSize: 14, color: t.free ? "var(--text)" : "var(--text-muted)" }}>{t.label}</div>
                    {!t.free && <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Premium</div>}
                  </div>
                ))}
              </div>

              {/* Export — IAP */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 8 }}>Export</div>
                {[
                  { label: "Export pulse log (PDF)", desc: "Download your full pulse log" },
                  { label: "Export session history (CSV)", desc: "Your regulation data for personal records or a provider" }
                ].map((item, i) => (
                  <div key={i} style={{
                    background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                    padding: "12px 16px", marginBottom: 4, opacity: 0.4,
                    display: "flex", justifyContent: "space-between", alignItems: "center"
                  }}>
                    <div>
                      <div style={{ fontSize: 14, color: "var(--text-muted)" }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{item.desc}</div>
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", flexShrink: 0 }}>Premium</div>
                  </div>
                ))}
              </div>

              {/* Notifications — micro-nudges, needs native */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 8 }}>Notifications</div>
                <div style={{
                  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                  padding: "12px 16px", marginBottom: 4, opacity: 0.3,
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <div>
                    <div style={{ fontSize: 14, color: "var(--text-muted)" }}>Micro-nudges</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Brief composure prompts throughout the day</div>
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", flexShrink: 0 }}>Native app</div>
                </div>
              </div>

              {/* Wearable — grayed, needs native */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 8 }}>Wearable Integration</div>
                <div style={{
                  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                  padding: "12px 16px", opacity: 0.3,
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <div>
                    <div style={{ fontSize: 14, color: "var(--text-muted)" }}>Connect HR / HRV monitor</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Auto-detect elevated heart rate and prompt composure tools</div>
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", flexShrink: 0 }}>Native app</div>
                </div>
              </div>
              </div>

              {/* Cloud Sync — premium */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 8 }}>Cloud Sync</div>
                <div style={{
                  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                  padding: "12px 16px", opacity: 0.4,
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <div>
                    <div style={{ fontSize: 14, color: "var(--text-muted)" }}>Sync across devices</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Coming soon — sync across devices. Requires account.</div>
                  </div>
                  <div style={{ fontSize: 10, color: "var(--amber)", letterSpacing: "0.08em", textTransform: "uppercase", flexShrink: 0 }}>Included</div>
                </div>
              </div>
            </div>

            {/* Signal Mapping */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 4 }}>Signal Mapping</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10, lineHeight: 1.6 }}>
                Map where your body responds first — jaw, shoulders, chest, gut, hands, legs. One-time setup. The app uses this to personalize your sessions.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button onClick={() => startTool(TOOLS.find(t => t.id === "signals"))} style={{
                  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                  padding: "14px 18px", textAlign: "left", cursor: "pointer", color: "var(--text)", fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif"
                }}>
                  <div style={{ fontWeight: 500, marginBottom: 2 }}>Map your signals →</div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)" }}>Where does it hit first? Takes 60 seconds.</div>
                </button>
                {/* Tension check moved into morning check-in flow */}
              </div>
            </div>

            {/* More */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 10 }}>More</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button onClick={() => setScreen("faq")} style={{
                  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                  padding: "14px 18px", textAlign: "left", cursor: "pointer", color: "var(--text)", fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif"
                }}>
                  FAQ
                </button>
                <button onClick={() => setScreen("privacy")} style={{
                  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                  padding: "14px 18px", textAlign: "left", cursor: "pointer", color: "var(--text)", fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif"
                }}>
                  Privacy & Disclaimers
                </button>
                <a href="mailto:ARAembersllc@proton.me" style={{
                  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                  padding: "14px 18px", textAlign: "left", cursor: "pointer", color: "var(--text)", fontSize: 14,
                  textDecoration: "none", fontFamily: "'DM Sans', sans-serif"
                }}>
                  Contact us
                </a>
                <button onClick={() => {
                  try { localStorage.removeItem("stillform_onboarded"); } catch {}
                  setOnboardStep(0);
                  setScreen("onboarding");
                }} style={{
                  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                  padding: "14px 18px", textAlign: "left", cursor: "pointer", color: "var(--text)", fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif"
                }}>
                  Replay tutorial
                </button>
                <button onClick={() => {
                  setSetupStep(0);
                  setAssessmentAnswers([]);
                  setScreen("setup");
                }} style={{
                  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                  padding: "14px 18px", textAlign: "left", cursor: "pointer", color: "var(--text)", fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif"
                }}>
                  Re-run calibration
                </button>
              </div>
            </div>

            <div style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", marginTop: 32 }}>
              Stillform · ARA Embers LLC · v1.0
            </div>

            {/* BACKUP & DATA — buried at very bottom */}
            <div style={{ marginTop: 40, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10, opacity: 0.6 }}>Data management</div>

              {/* Auto backup */}
              <div style={{
                background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                padding: "12px 16px", marginBottom: 8,
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <div>
                  <div style={{ fontSize: 13, color: "var(--text)" }}>Auto backup</div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>Weekly encrypted backup of all your data</div>
                </div>
                <div style={{ fontSize: 11, color: "var(--amber)", letterSpacing: "0.06em" }}>Weekly</div>
              </div>

              {/* Export */}
              <div style={{
                background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                padding: "12px 16px", marginBottom: 8, opacity: 0.4,
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Export your data</div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>Download pulse log, sessions, insights as PDF or CSV</div>
                </div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Coming soon</div>
              </div>

              {/* Delete — small, understated, double confirm */}
              <button onClick={() => {
                if (window.confirm("Are you sure? This will permanently delete ALL your data — sessions, pulse log, conversations, signal profile, check-ins, and saved reframes. This cannot be undone.")) {
                  const typed = window.prompt("To confirm deletion, type DELETE below:");
                  if (typed === "DELETE") {
                    try {
                      localStorage.removeItem("stillform_sessions");
                      localStorage.removeItem("stillform_signal_profile");
                      localStorage.removeItem("stillform_saved_reframes");
                      localStorage.removeItem("stillform_reframe_session_calm");
                      localStorage.removeItem("stillform_reframe_session_clarity");
                      localStorage.removeItem("stillform_reframe_session_hype");
                      localStorage.removeItem("stillform_journal");
                      localStorage.removeItem("stillform_checkin_today");
                      localStorage.removeItem("stillform_onboarded");
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
            </div>
          </section>
        )}

        {/* FOOTER — always visible except tool/panic/onboarding. Active screen link hidden. */}
        {!["tool","panic","onboarding"].includes(screen) && (
          <footer className="footer">
            <div className="footer-logo">Stillform</div>
            <div className="footer-links">
              {screen !== "pricing" && screen !== "home" && (
                <button onClick={() => setScreen("pricing")}>Subscribe</button>
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

