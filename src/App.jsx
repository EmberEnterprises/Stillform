import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #0e0f11;
    --surface: #161819;
    --surface2: #1e2022;
    --border: #2a2d30;
    --amber: #c9933a;
    --amber-dim: #8a6228;
    --amber-glow: rgba(201,147,58,0.12);
    --text: #e8e4dc;
    --text-dim: #a09c97;
    --text-muted: #6a6662;
    --green: #4a8c6a;
    --green-glow: rgba(74,140,106,0.12);
  }

  html, body, #root { height: 100%; background: var(--bg); }

  .app {
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    position: relative;
    overflow-x: hidden;
  }

  .app::before {
    content: '';
    position: fixed;
    top: -40%;
    left: -20%;
    width: 60%;
    height: 60%;
    background: radial-gradient(ellipse, rgba(201,147,58,0.04) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 40px;
    border-bottom: 1px solid var(--border);
    position: relative;
    z-index: 10;
  }

  .nav-logo {
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    letter-spacing: 0.05em;
    font-size: 22px;
    font-weight: 300;
    letter-spacing: 0.12em;
    color: var(--text);
  }

  .nav-logo span { color: var(--amber); }

  .nav-actions { display: flex; gap: 12px; align-items: center; }

  .btn {
    padding: 10px 22px;
    border-radius: 4px;
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
    border: 1px solid var(--border);
  }

  .btn-ghost:hover { border-color: var(--amber-dim); color: var(--amber); }

  .btn-primary {
    background: var(--amber);
    color: #0e0f11;
    font-weight: 500;
  }

  .btn-primary:hover { background: #d9a34a; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(201,147,58,0.3); }

  .btn-secondary {
    background: var(--surface2);
    color: var(--text);
    border: 1px solid var(--border);
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
    width: 240px;
    height: 240px;
    margin-bottom: 40px;
  }

  .breath-circle {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,147,58,0.12) 0%, rgba(201,147,58,0.03) 60%, transparent 100%);
    border: 1px solid var(--amber-dim);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform var(--breath-duration, 4s) ease-in-out, box-shadow var(--breath-duration, 4s) ease-in-out;
  }

  .breath-circle.expand {
    transform: scale(1.35);
    box-shadow: 0 0 60px rgba(201,147,58,0.15), 0 0 120px rgba(201,147,58,0.06);
  }
  .breath-circle.hold {
    transform: scale(1.35);
    box-shadow: 0 0 40px rgba(201,147,58,0.1), 0 0 80px rgba(201,147,58,0.04);
  }
  .breath-circle.contract {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(201,147,58,0.05);
  }

  @keyframes breathe-ring {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 0.08; transform: scale(1.5); }
  }

  .breath-inner {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: var(--amber-glow);
    border: 1px solid var(--amber);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .breath-count {
    font-family: 'Cormorant Garamond', serif;
    font-size: 36px;
    font-weight: 300;
    color: var(--amber);
  }

  .breath-phase {
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: 12px;
    text-align: center;
  }

  .breath-instruction {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;
    font-style: italic;
    font-weight: 300;
    color: var(--text);
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
    height: 480px;
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
  }

  .ai-input {
    flex: 1;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 12px 16px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    transition: border-color 0.2s;
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

  /* BODY SCAN */
  .scan-body {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .scan-area {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 20px 24px;
    transition: all 0.3s;
    cursor: pointer;
  }

  .scan-area.active {
    border-color: var(--amber);
    background: var(--amber-glow);
  }

  .scan-area-name {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 4px;
  }

  .scan-area-prompt {
    font-size: 13px;
    color: var(--text-dim);
    line-height: 1.6;
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
    padding: 60px 20px;
  }

  .complete-icon {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: var(--green-glow);
    border: 1px solid var(--green);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    margin: 0 auto 28px;
  }

  .complete h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 38px;
    font-weight: 300;
    margin-bottom: 12px;
  }

  .complete p {
    color: var(--text-dim);
    font-size: 15px;
    line-height: 1.7;
    max-width: 400px;
    margin: 0 auto 36px;
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
    padding: 14px 18px;
    font-size: 12px;
    color: var(--text-dim);
    line-height: 1.6;
    margin-bottom: 32px;
  }

  @media (max-width: 640px) {
    .nav { padding: 20px 24px; }
    .home { padding: 40px 24px; }
    .tools { padding: 32px 24px 60px; }
    .intervention { padding: 32px 24px 60px; }
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
    desc: "Locate tension and release it with targeted acupressure.",
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
    id: "patterns",
    icon: "◆",
    name: "Your Patterns",
    desc: "What the data shows about how you regulate.",
    time: "1 min",
    level: 3
  },
  {
    id: "bias",
    icon: "⬡",
    name: "Know Your Blind Spots",
    desc: "Learn the cognitive biases that shape how you think under pressure.",
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

// Tally feedback form — replace TALLY_FORM_ID with your actual form ID from tally.so
const TALLY_FORM_ID = "D45ljE";

function FeedbackPrompt({ tool }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div style={{
      marginTop: 24,
      padding: "16px 18px",
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12
    }}>
      <div style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.5 }}>
        Did this help? 60 seconds of feedback makes it better.
      </div>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <a
          href={`https://tally.so/r/${TALLY_FORM_ID}?tool=${tool}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: "var(--amber-glow)",
            border: "1px solid var(--amber-dim)",
            borderRadius: 6,
            padding: "7px 14px",
            fontSize: 12,
            color: "var(--amber)",
            textDecoration: "none",
            whiteSpace: "nowrap"
          }}
        >
          Give feedback
        </a>
        <button
          onClick={() => setDismissed(true)}
          style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 16, cursor: "pointer", padding: "0 4px" }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

// Quick post-session journal note
function SessionNote() {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const save = () => {
    if (!note.trim()) return;
    try {
      const notes = JSON.parse(localStorage.getItem("stillform_notes") || "[]");
      notes.push({ timestamp: new Date().toISOString(), text: note.trim() });
      localStorage.setItem("stillform_notes", JSON.stringify(notes));
    } catch {}
    setSaved(true);
  };

  if (saved) return <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 12 }}>✓ Noted.</div>;

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          style={{
            flex: 1, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6,
            padding: "8px 12px", color: "var(--text)", fontSize: 13, fontFamily: "'DM Sans', sans-serif"
          }}
          placeholder="What triggered this? (optional)"
          value={note}
          onChange={e => setNote(e.target.value)}
          onKeyDown={e => e.key === "Enter" && save()}
        />
        <MicButton onTranscript={t => setNote(prev => prev + (prev ? " " : "") + t)} />
        {note.trim() && (
          <button onClick={save} style={{
            background: "var(--amber-glow)", border: "1px solid var(--amber-dim)", borderRadius: 6,
            padding: "8px 12px", fontSize: 12, color: "var(--amber)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
          }}>Save</button>
        )}
      </div>
    </div>
  );
}

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

  if (phase === "done") {
    const elapsed = saveSession();
    const fmt = (ms) => { const s = Math.round(ms / 1000); const m = Math.floor(s / 60); return m > 0 ? `${m}m ${s % 60}s` : `${s % 60}s`; };
    const count = (() => { try { return JSON.parse(localStorage.getItem("stillform_sessions") || "[]").length; } catch { return 0; } })();
    return (
      <div className="complete">
        <div className="complete-icon">✓</div>
        <h2>Reset complete.</h2>
        <p style={{ marginBottom: 8 }}>Three physiological sighs. Your head is clearer than it was {fmt(elapsed)} ago.</p>
        {count > 1 && <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>Session #{count}.</div>}
        <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => onComplete("reframe")}>
          Talk through what's happening →
        </button>
        <button className="btn btn-ghost" style={{ marginTop: 10, width: "100%" }} onClick={onComplete}>
          I'm good
        </button>
        <FeedbackPrompt tool="sigh" />
        <SessionNote />
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
          <div
            className={`breath-circle ${phase === "exhale" ? "contract" : phase === "rest" ? "hold" : "expand"}`}
            style={{ '--breath-duration': `${phases[phase]?.duration || 2}s` }}
          >
            <div className="breath-inner">
              <span className="breath-count">{count}</span>
            </div>
          </div>
        </div>

        {running && phase !== "done" ? (
          <>
            <div className="breath-phase" style={{ fontSize: 22, marginBottom: 6 }}>
              {phases[phase]?.label}
            </div>
            <div className="breath-instruction">{phases[phase]?.sub}</div>
            <div style={{ height: 32 }} />
          </>
        ) : (
          <>
            <div className="breath-phase" style={{ fontSize: 18, marginBottom: 8 }}>
              Double inhale, long exhale.
            </div>
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
  { id: "calm", name: "Calm (4-4-8-2)", desc: "Longer exhale activates parasympathetic response", phases: [
    { name: "Inhale", duration: 4, instruction: "In through your nose." },
    { name: "Hold", duration: 4, instruction: "Hold." },
    { name: "Exhale", duration: 8, instruction: "Out through your mouth. Long and slow." },
    { name: "Rest", duration: 2, instruction: "Rest." }
  ]},
  { id: "box", name: "Box (4-4-4-4)", desc: "Equal rhythm. Used by Navy SEALs for focus", phases: [
    { name: "Inhale", duration: 4, instruction: "In through your nose." },
    { name: "Hold", duration: 4, instruction: "Hold." },
    { name: "Exhale", duration: 4, instruction: "Out through your mouth." },
    { name: "Hold", duration: 4, instruction: "Hold." }
  ]},
  { id: "478", name: "4-7-8", desc: "Deep calm. Best when you have a quiet moment", phases: [
    { name: "Inhale", duration: 4, instruction: "In through your nose." },
    { name: "Hold", duration: 7, instruction: "Hold." },
    { name: "Exhale", duration: 8, instruction: "Out through your mouth. Long and slow." }
  ]},
  { id: "quick", name: "Quick Reset (4-4-6)", desc: "Shorter pattern when time is tight", phases: [
    { name: "Inhale", duration: 4, instruction: "In through your nose." },
    { name: "Hold", duration: 4, instruction: "Hold." },
    { name: "Exhale", duration: 6, instruction: "Out through your mouth." }
  ]}
];

function BreatheGroundTool({ onComplete, pathway }) {
  const [phase, setPhase] = useState("breathe"); // breathe | ground | done

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
  const savedPatternId = (() => { try { return localStorage.getItem("stillform_breath_pattern") || "calm"; } catch { return "calm"; } })();
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
  };

  const [started, setStarted] = useState(false);
  const breathPrompts = [
    { id: "calm", label: "Overwhelmed right now", desc: "Rage, panic, anxiety, overwhelm", why: "Extended exhale forces your nervous system down" },
    { id: "box", label: "Need to stay steady", desc: "Sustained pressure, staying composed", why: "Equal rhythm stabilizes over time" },
    { id: "478", label: "Can't sleep / deep anxiety", desc: "Quiet moment, need deep calm", why: "Long hold + exhale is the deepest reset" },
    { id: "quick", label: "Quick reset", desc: "Public, limited time, 60 seconds", why: "Shortest effective pattern" }
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
          return;
        }
        if (keepGoing && newCycle > totalCycles + 3) {
          setBreatheDone(true);
          setRunning(false);
          return;
        }
        setCycle(newCycle);
      }
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

  const circleClass = `breath-circle ${phaseIdx === 0 ? "expand" : phaseIdx === 2 ? "contract" : "hold"}`;
  const progress = ((cycle - 1) * phases.length + phaseIdx) / (totalCycles * phases.length);

  if (groundDone) {
    const elapsed = saveSession(["breathe", "ground"], "grounding-complete");
    const count = getSessionCount();
    return (
      <div className="complete">
        <div className="complete-icon">✓</div>
        <h2>You're here.</h2>
        <p>Nervous system regulated. Senses anchored.</p>
        <div style={{ fontSize: 14, color: "var(--amber)", marginBottom: 8 }}>Regulated in {formatTime(elapsed)}</div>
        {count > 1 && <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>Session #{count}.</div>}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 8 }}>
          <button className="btn btn-primary" onClick={() => onComplete("reframe-calm")}>
            Talk it through →
          </button>
          <button className="btn btn-ghost" onClick={onComplete}>
            I'm good
          </button>
      </div>
      <FeedbackPrompt tool="breathe" />
      <SessionNote />
    </div>
  );
  }

  const [groundStepStart, setGroundStepStart] = useState(Date.now());
  const [groundData, setGroundData] = useState([]);
  const [showGroundWrite, setShowGroundWrite] = useState(false);

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
      <div style={{ background: "var(--surface)", borderRadius: 12, padding: "24px 20px", marginBottom: 20, textAlign: "center" }}>
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
          {current < steps.length - 1 ? `I've got ${steps[current].num} ✓` : "Done ✓"}
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

  // Breathe phase
  if (!started && phase === "breathe") return (
    <div style={{ maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, marginBottom: 8 }}>
        What's happening?
      </h2>
      <p style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 24 }}>
        The app picks the right breathing pattern for you.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {breathPrompts.map(bp => (
          <button key={bp.id} onClick={() => selectPattern(bp.id)} style={{
            width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10,
            padding: "14px 18px", textAlign: "left", cursor: "pointer", color: "var(--text)",
            fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s"
          }}>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{bp.label}</div>
            <div style={{ fontSize: 11, color: "var(--text-dim)", marginBottom: 4 }}>{bp.desc}</div>
            <div style={{ fontSize: 10, color: "var(--amber)", fontStyle: "italic" }}>{bp.why}</div>
          </button>
        ))}
      </div>
      <button onClick={() => { setStarted(true); setRunning(true); }} style={{
        background: "none", border: "none", color: "var(--text-muted)", fontSize: 12,
        cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginTop: 16
      }}>
        Skip — use {pattern.name}
      </button>
    </div>
  );

  return (
    <div>
      {!breatheDone ? (
        <div className="breath-container">
          <div className="breath-circle-wrap">
            <div
              className={circleClass}
              style={{ '--breath-duration': `${phases[phaseIdx].duration}s` }}
            >
              <div className="breath-inner">
                <span className="breath-count">{count}</span>
              </div>
            </div>
          </div>
          <div className="breath-phase" style={{ fontSize: 20, marginBottom: 4 }}>
            {phases[phaseIdx].name}
          </div>
          <div className="breath-instruction">{phases[phaseIdx].instruction}</div>
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
          {!running && !showPatternPicker && (
            <button onClick={() => setShowPatternPicker(true)} style={{
              background: "none", border: "none", color: "var(--text-muted)", fontSize: 11,
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: 16,
              letterSpacing: "0.04em"
            }}>
              {pattern.name} · change pattern
            </button>
          )}
          {showPatternPicker && (
            <div style={{ width: "100%", maxWidth: 320, marginBottom: 20 }}>
              {BREATHING_PATTERNS.map(p => (
                <button key={p.id} onClick={() => selectPattern(p.id)} style={{
                  width: "100%", padding: "10px 14px", textAlign: "left", cursor: "pointer",
                  background: p.id === patternId ? "var(--amber-glow)" : "var(--surface)",
                  border: `1px solid ${p.id === patternId ? "var(--amber-dim)" : "var(--border)"}`,
                  borderRadius: 8, marginBottom: 6, color: "var(--text)",
                  fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s"
                }}>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)" }}>{p.desc}</div>
                </button>
              ))}
            </div>
          )}
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
          <h2>How do you feel?</h2>
          <p style={{ marginBottom: 24 }}>Three rounds of extended exhale breathing. Your nervous system is beginning to settle.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button className="btn btn-primary" onClick={() => setPhase("ground")}>
              Ground myself now →
            </button>
            <button className="btn btn-ghost" onClick={() => {
              setKeepGoing(true);
              setBreatheDone(false);
              setRunning(true);
            }}>
              Keep breathing
            </button>
            <button className="btn btn-ghost" onClick={() => { saveSession(["breathe"], "breathing-only"); onComplete(); }} style={{ color: "var(--text-dim)", fontSize: 13 }}>
              I'm ready to stop
            </button>
          </div>
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
    } catch {}
    return elapsed;
  };
  const getSessionCount = () => { try { return JSON.parse(localStorage.getItem("stillform_sessions") || "[]").length; } catch { return 0; } };

  const areas = [
    {
      name: "Jaw & Face",
      prompt: "Unclench your jaw. Let your tongue rest. Soften your eyes.",
      pointEffect: "Calm racing thoughts",
      pointName: "GV24.5 — Third Eye Point",
      pointLocation: "Place two fingers between your eyebrows, just above the bridge of your nose.",
      pointInstruction: "Apply firm, steady pressure. Close your eyes. Hold.",
      holdSeconds: 60,
      benefit: "Reduces tension headaches and quiets mental noise."
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
      pointEffect: "Ease emotional distress",
      pointName: "CV17 — Sea of Tranquility",
      pointLocation: "Find the center of your breastbone, level with your heart. Place your flat palm here.",
      pointInstruction: "Apply gentle but firm pressure with your palm. Breathe into it. Hold.",
      holdSeconds: 60,
      benefit: "Eases emotional heaviness and regulates the breath."
    },
    {
      name: "Hands & Arms",
      prompt: "Are your hands gripping anything? Open them fully. Let your arms go heavy.",
      pointEffect: "Reduce stress and anxiety",
      pointName: "LI4 — Union Valley",
      pointLocation: "Find the webbing between your thumb and index finger. Pinch the highest point of the muscle there.",
      pointInstruction: "Squeeze firmly — this point is often tender. Switch hands halfway. Hold.",
      holdSeconds: 45,
      benefit: "One of the most powerful points for anxiety and tension."
    },
    {
      name: "Gut & Core",
      prompt: "Scan your stomach and core. Notice tightness without trying to fix it.",
      pointEffect: "Calm nausea and racing heart",
      pointName: "PC6 — Inner Gate",
      pointLocation: "Turn your wrist palm-up. Measure three finger-widths down from your wrist crease, between the two tendons.",
      pointInstruction: "Press firmly with your thumb. Switch wrists halfway. Hold.",
      holdSeconds: 60,
      benefit: "Directly calms the nervous system. Relieves anxiety and nausea."
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
    const target = areas[currentArea].holdSeconds;
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
    if (currentArea < areas.length - 1) setCurrentArea(a => a + 1);
    else setDone(true);
  };

  const area = areas[currentArea];
  const holdTarget = area.holdSeconds;
  const holdProgress = Math.min((holdCount / holdTarget) * 100, 100);

  if (done) {
    const elapsed = saveSession();
    const sessionCount = getSessionCount();
    return (
      <div className="complete">
        <div className="complete-icon">✓</div>
        <h2>Scan complete.</h2>
        <p>You've moved awareness and pressure through your body.</p>
        <div style={{ fontSize: 14, color: "var(--amber)", marginBottom: 8 }}>Completed in {formatTime(elapsed)}</div>
        {sessionCount > 1 && <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>Session #{sessionCount}.</div>}
        <button className="btn btn-primary" onClick={onComplete}>Return to tools</button>
        <FeedbackPrompt tool="bodyscan" />
        <SessionNote />
      </div>
    );
  }

  return (
    <div className="scan-body">
      {areas.map((a, i) => (
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
              <div style={{ marginTop: 20 }}>
                <button className="btn btn-primary" style={{ fontSize: 13 }}
                  onClick={(e) => { e.stopPropagation(); setPhase("pressure"); }}>
                  Apply pressure here →
                </button>
              </div>
            </>
          )}
          {i === currentArea && phase === "pressure" && (
            <>
              {/* Acupressure point diagram */}
              <div style={{ display: "flex", justifyContent: "center", marginTop: 16, marginBottom: 8 }}>
                <svg viewBox="0 0 120 120" width="100" height="100" style={{ opacity: 0.9 }}>
                  {a.name === "Jaw & Face" && <>
                    <ellipse cx="60" cy="55" rx="30" ry="38" fill="none" stroke="var(--amber)" strokeWidth="1.5" opacity="0.4" />
                    <line x1="45" y1="42" x2="55" y2="42" stroke="var(--text-dim)" strokeWidth="1" />
                    <line x1="65" y1="42" x2="75" y2="42" stroke="var(--text-dim)" strokeWidth="1" />
                    <circle cx="60" cy="35" r="5" fill="var(--amber)" opacity="0.8" />
                    <text x="60" y="108" textAnchor="middle" fill="var(--text-muted)" fontSize="8" fontFamily="DM Sans">between eyebrows</text>
                  </>}
                  {a.name === "Shoulders & Neck" && <>
                    <line x1="60" y1="20" x2="60" y2="45" stroke="var(--text-dim)" strokeWidth="1.5" />
                    <path d="M60 45 Q60 55 30 65" fill="none" stroke="var(--text-dim)" strokeWidth="1.5" />
                    <path d="M60 45 Q60 55 90 65" fill="none" stroke="var(--text-dim)" strokeWidth="1.5" />
                    <circle cx="45" cy="55" r="5" fill="var(--amber)" opacity="0.8" />
                    <text x="60" y="108" textAnchor="middle" fill="var(--text-muted)" fontSize="8" fontFamily="DM Sans">top of shoulder muscle</text>
                  </>}
                  {a.name === "Chest & Breath" && <>
                    <path d="M40 25 Q60 20 80 25 L85 80 Q60 90 35 80 Z" fill="none" stroke="var(--text-dim)" strokeWidth="1.5" />
                    <circle cx="60" cy="48" r="5" fill="var(--amber)" opacity="0.8" />
                    <text x="60" y="108" textAnchor="middle" fill="var(--text-muted)" fontSize="8" fontFamily="DM Sans">center of breastbone</text>
                  </>}
                  {a.name === "Hands & Arms" && <>
                    <path d="M50 90 L50 50 Q50 35 45 25 M50 50 Q55 35 60 20 M50 50 Q58 38 65 25 M50 50 Q60 40 70 30 M50 50 Q50 40 40 30" fill="none" stroke="var(--text-dim)" strokeWidth="1.5" />
                    <circle cx="50" cy="42" r="5" fill="var(--amber)" opacity="0.8" />
                    <text x="60" y="108" textAnchor="middle" fill="var(--text-muted)" fontSize="8" fontFamily="DM Sans">web of thumb + index</text>
                  </>}
                  {a.name === "Gut & Core" && <>
                    <rect x="35" y="20" width="50" height="15" rx="4" fill="none" stroke="var(--text-dim)" strokeWidth="1.5" />
                    <line x1="60" y1="35" x2="60" y2="85" stroke="var(--text-dim)" strokeWidth="1.5" />
                    <line x1="35" y1="35" x2="35" y2="60" stroke="var(--text-dim)" strokeWidth="1" opacity="0.4" />
                    <line x1="85" y1="35" x2="85" y2="60" stroke="var(--text-dim)" strokeWidth="1" opacity="0.4" />
                    <circle cx="60" cy="52" r="5" fill="var(--amber)" opacity="0.8" />
                    <text x="60" y="108" textAnchor="middle" fill="var(--text-muted)" fontSize="8" fontFamily="DM Sans">inner wrist, 3 fingers down</text>
                  </>}
                  {a.name === "Legs & Feet" && <>
                    <line x1="55" y1="15" x2="55" y2="95" stroke="var(--text-dim)" strokeWidth="2" />
                    <ellipse cx="55" cy="35" rx="12" ry="8" fill="none" stroke="var(--text-dim)" strokeWidth="1.5" />
                    <circle cx="65" cy="55" r="5" fill="var(--amber)" opacity="0.8" />
                    <text x="60" y="108" textAnchor="middle" fill="var(--text-muted)" fontSize="8" fontFamily="DM Sans">4 fingers below kneecap</text>
                  </>}
                </svg>
              </div>

              <div style={{ background: "var(--amber-glow)", border: "1px solid var(--amber-dim)", borderRadius: 8, padding: "16px 20px" }}>
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
                    borderRadius: 8, padding: "8px 12px", fontSize: 11, cursor: "pointer",
                    color: audioOn ? "var(--amber)" : "var(--text-dim)", fontFamily: "'DM Sans', sans-serif"
                  }}>
                    {audioOn ? "♪" : "♪"}
                  </button>
                </div>
              )}
              {(holding || holdCount > 0) && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 8, letterSpacing: "0.08em" }}>
                    {holding ? `HOLDING — ${holdTarget - holdCount}s remaining` : "HOLD COMPLETE"}
                  </div>
                  <div style={{ background: "var(--border)", borderRadius: 4, height: 4, overflow: "hidden" }}>
                    <div style={{ width: `${holdProgress}%`, height: "100%", background: holdProgress >= 100 ? "var(--green)" : "var(--amber)", transition: "width 1s linear" }} />
                  </div>
                  {!holding && holdCount >= holdTarget && (
                    <button className="btn btn-primary" style={{ marginTop: 16, fontSize: 13 }}
                      onClick={(e) => { e.stopPropagation(); handleNext(); }}>
                      {currentArea < areas.length - 1 ? "Next area →" : "Complete scan"}
                    </button>
                  )}
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

  const toggle = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
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
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  useEffect(() => { return () => recognitionRef.current?.stop(); }, []);

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
      borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12,
      color: speech.listening ? "rgba(200,80,80,0.9)" : "var(--text-dim)",
      fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
      animation: speech.listening ? "pulse 1.5s ease-in-out infinite" : "none"
    }}>
      🎙 {speech.listening ? "Listening..." : "Speak"}
    </button>
  );
}

function ReframeTool({ onComplete, mode = "calm", defaultTab = "talk" }) {
  const [activeMode, setActiveMode] = useState(mode === "calm" ? null : mode);
  const [tab, setTab] = useState(defaultTab);
  const effectiveMode = activeMode || "calm";
  const isClarity = effectiveMode === "clarity";
  const isHype = effectiveMode === "hype";
  const openingText = isHype
    ? "What are you about to walk into? A stage, a room, a conversation, a meeting — say what it is and what's making it hard."
    : isClarity
    ? "What won't stop spinning? The thought, the decision, the thing you keep replaying. Say it — don't organize it."
    : "Say what you're feeling. Rage, anxiety, grief, shame, overwhelm — whatever it is. Don't filter it. The AI reads exactly what you wrote.";
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

  // Journal state
  const [journalText, setJournalText] = useState("");
  const saveJournal = () => {
    if (!journalText.trim()) return;
    try {
      const entries = JSON.parse(localStorage.getItem("stillform_journal") || "[]");
      entries.unshift({
        id: Date.now(),
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        trigger: journalText.trim(),
        emotions: [],
        intensity: 0,
        body: "",
        outcome: "",
        mode: effectiveMode
      });
      localStorage.setItem("stillform_journal", JSON.stringify(entries));
    } catch {}
    setJournalText("");
  };

  // TIME-TO-REGULATION
  const startTime = useRef(Date.now());
  const saveSession = () => {
    const elapsed = Date.now() - startTime.current;
    const fmt = (ms) => { const s = Math.round(ms / 1000); const m = Math.floor(s / 60); return m > 0 ? `${m}m ${s % 60}s` : `${s % 60}s`; };
    try {
      const sessions = JSON.parse(localStorage.getItem("stillform_sessions") || "[]");
      sessions.push({ timestamp: new Date().toISOString(), duration: elapsed, durationFormatted: fmt(elapsed), tools: ["reframe"], exitPoint: "reframe-done", source: "reframe", mode: effectiveMode });
      localStorage.setItem("stillform_sessions", JSON.stringify(sessions));
    } catch {}
  };

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const [savedIds, setSavedIds] = useState(new Set());

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

  // Persist every message change to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Reload messages when mode changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      setMessages(saved ? JSON.parse(saved) : []);
    } catch { setMessages([]); }
    setSavedIds(new Set());
    setError(null);
  }, [effectiveMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 24000);

      const response = await fetch("/.netlify/functions/reframe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          input: textToSend,
          mode: effectiveMode,
          history: prevMessages.map(m => ({
            role: m.role === "ai" ? "assistant" : "user",
            content: m.text
          })),
          journalContext: (() => {
            try {
              const entries = JSON.parse(localStorage.getItem("stillform_journal") || "[]").slice(0, 5);
              if (entries.length === 0) return null;
              return entries.map(e => `[${e.date}] ${e.trigger}${e.emotions?.length ? ` (${e.emotions.join(", ")})` : ""}`).join("\n");
            } catch { return null; }
          })(),
          checkinContext: (() => {
            try {
              const checkin = JSON.parse(localStorage.getItem("stillform_checkin_today") || "null");
              if (!checkin) return null;
              return `Today: ${checkin.sleep}h sleep, energy ${checkin.energy}, mood "${checkin.mood}"${checkin.stressEvent ? `, stress event: ${checkin.stressEvent}` : ""}${checkin.notes ? `, notes: ${checkin.notes}` : ""}`;
            } catch { return null; }
          })(),
          sessionCount: (() => { try { return JSON.parse(localStorage.getItem("stillform_sessions") || "[]").length; } catch { return 0; } })(),
          priorModeContext: (() => {
            try {
              const otherModes = ["calm", "clarity", "hype"].filter(m => m !== effectiveMode);
              for (const m of otherModes) {
                const data = JSON.parse(localStorage.getItem(`stillform_reframe_session_${m}`) || "[]");
                if (data.length >= 2) {
                  const recent = data.slice(-4).map(msg => `${msg.role === "ai" ? "Stillform" : "User"}: ${msg.text}`).join("\n");
                  const modeLabel = { calm: "Calm", clarity: "Get Sharp", hype: "Lock In" }[m];
                  return `USER'S PRIOR CONVERSATION (from ${modeLabel} mode, same session):\n${recent}\nThey switched modes. Use this context — don't make them repeat themselves.`;
                }
              }
              return null;
            } catch { return null; }
          })()
        })
      });
      clearTimeout(timeout);
      if (!response.ok) throw new Error("Server error");
      const parsed = await response.json();
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
        setError("Couldn't connect. Your message is saved — tap Retry to send it again.");
      }
    }
    setLoading(false);
  };

  const modeConfig = {
    calm: {
      icon: "◎", title: "Reframe", subtitle: "Say what you're feeling. The AI reads exactly what you wrote.",
      color: "#c9933a",
      bg: "linear-gradient(180deg, rgba(201,147,58,0.06) 0%, transparent 40%)",
      border: "rgba(201,147,58,0.2)",
      inputBg: "rgba(201,147,58,0.05)",
      aiBubble: "rgba(201,147,58,0.08)",
      sendBg: "#c9933a"
    },
    clarity: {
      icon: "✦", title: "Get Sharp", subtitle: "Name the thought loop. Cut through it.",
      color: "#7aadcf",
      bg: "linear-gradient(180deg, rgba(122,173,207,0.08) 0%, transparent 40%)",
      border: "rgba(122,173,207,0.2)",
      inputBg: "rgba(122,173,207,0.05)",
      aiBubble: "rgba(122,173,207,0.08)",
      sendBg: "#7aadcf"
    },
    hype: {
      icon: "◌", title: "Lock In", subtitle: "What are you about to walk into? Say it.",
      color: "#c9793a",
      bg: "linear-gradient(180deg, rgba(201,121,58,0.08) 0%, transparent 40%)",
      border: "rgba(201,121,58,0.25)",
      inputBg: "rgba(201,121,58,0.06)",
      aiBubble: "rgba(201,121,58,0.1)",
      sendBg: "#c9793a"
    }
  };
  const mc = modeConfig[effectiveMode] || modeConfig.calm;

  return (
    <div style={{ background: mc.bg, margin: "-40px -40px 0", padding: "40px 40px 0", borderRadius: "0 0 16px 16px" }}>
      {/* MODE PICKER — three tones */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {[
          { id: "calm", label: "Calm", icon: "◎", color: "#c9933a" },
          { id: "clarity", label: "Get Sharp", icon: "✦", color: "#7aadcf" },
          { id: "hype", label: "Lock In", icon: "◌", color: "#c9793a" }
        ].map(m => {
          const active = effectiveMode === m.id;
          return (
            <button key={m.id} onClick={() => setActiveMode(m.id)} style={{
              flex: 1, background: active ? `${m.color}18` : "transparent",
              border: `1px solid ${active ? m.color : "var(--border)"}`,
              borderRadius: 8, padding: "10px 8px", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s", textAlign: "center"
            }}>
              <div style={{ fontSize: 14, color: active ? m.color : "var(--text-muted)", marginBottom: 2 }}>{m.icon}</div>
              <div style={{ fontSize: 10, color: active ? m.color : "var(--text-muted)", letterSpacing: "0.06em" }}>{m.label}</div>
            </button>
          );
        })}
      </div>

      {/* TALK / JOURNAL TABS */}
      <div style={{ display: "flex", marginBottom: 16, borderBottom: `1px solid ${mc.border}` }}>
        <button onClick={() => setTab("talk")} style={{
          flex: 1, background: "none", border: "none", borderBottom: tab === "talk" ? `2px solid ${mc.color}` : "2px solid transparent",
          padding: "10px 0", fontSize: 13, fontWeight: tab === "talk" ? 500 : 400,
          color: tab === "talk" ? mc.color : "var(--text-muted)",
          cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s"
        }}>
          Talk · get guidance
        </button>
        <button onClick={() => setTab("journal")} style={{
          flex: 1, background: "none", border: "none", borderBottom: tab === "journal" ? `2px solid ${mc.color}` : "2px solid transparent",
          padding: "10px 0", fontSize: 13, fontWeight: tab === "journal" ? 500 : 400,
          color: tab === "journal" ? mc.color : "var(--text-muted)",
          cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s"
        }}>
          Journal · get it out
        </button>
      </div>

      <div className="disclaimer">
        Not therapy or clinical treatment. Your data is encrypted and synced securely. <button onClick={() => onComplete("crisis")} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "inherit", cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>Crisis resources</button>
      </div>

      {/* ── JOURNAL TAB ── */}
      {tab === "journal" && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <textarea
              value={journalText}
              onChange={e => setJournalText(e.target.value)}
              placeholder="What happened? How are you feeling? Write freely — the AI uses this as context next time you talk."
              style={{
                width: "100%", minHeight: 120, background: mc.inputBg || "var(--surface)",
                border: `1px solid ${mc.border}`, borderRadius: 10,
                padding: "14px 16px", color: "var(--text)", fontSize: 14,
                fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, resize: "vertical"
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
              <MicButton onTranscript={t => setJournalText(prev => prev + (prev ? " " : "") + t)} />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button onClick={saveJournal} disabled={!journalText.trim()} style={{
                flex: 1, background: mc.sendBg, color: "#fff", border: "none", borderRadius: 8,
                padding: "10px", fontSize: 13, fontWeight: 500, cursor: journalText.trim() ? "pointer" : "default",
                fontFamily: "'DM Sans', sans-serif", opacity: journalText.trim() ? 1 : 0.4, transition: "opacity 0.2s"
              }}>
                Save entry
              </button>
            </div>
          </div>

          <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: mc.color, marginBottom: 10 }}>
            Past entries
          </div>
          {(() => {
            try {
              const entries = JSON.parse(localStorage.getItem("stillform_journal") || "[]");
              if (entries.length === 0) return (
                <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, padding: "8px 0" }}>
                  No entries yet. Write your first one above — the AI will use it as context next time you talk.
                </div>
              );
              return entries.slice(0, 10).map((e, i) => (
                <div key={e.id || i} style={{
                  padding: "12px 14px", background: mc.aiBubble || "var(--surface)",
                  border: `1px solid ${mc.border || "var(--border)"}`, borderRadius: 10, marginBottom: 8
                }}>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 6 }}>{e.date} · {e.time}</div>
                  <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6 }}>{e.trigger}</div>
                  {e.emotions && e.emotions.length > 0 && (
                    <div style={{ fontSize: 11, color: mc.color, marginTop: 6 }}>{e.emotions.join(" · ")}</div>
                  )}
                </div>
              ));
            } catch { return null; }
          })()}
        </div>
      )}

      {/* ── TALK TAB ── */}
      {tab === "talk" && (
      <>

      {/* Error banner */}
      {error && (
        <div style={{
          background: "rgba(200,0,50,0.08)",
          border: "1px solid rgba(200,0,50,0.25)",
          borderRadius: 10,
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
                <div style={{ marginBottom: 16, padding: "12px 14px", background: mc.aiBubble, border: `1px solid ${mc.border}`, borderRadius: 10 }}>
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
                {openingText}
              </div>
            </>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              <div className="message-avatar" style={msg.role === "ai" ? { color: mc.color } : {}}>{msg.role === "ai" ? mc.icon : "●"}</div>
              <div className="message-bubble" style={msg.role === "ai" ? { background: mc.aiBubble, borderColor: mc.border } : {}}>
                {msg.distortion && (
                  <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: mc.color, marginBottom: 8 }}>
                    {msg.distortion}
                  </div>
                )}
                {msg.text}
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
          ))}
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
        <div className="ai-input-row">
          {loading ? (
            <div style={{ flex: 1, fontSize: 13, color: "var(--text-dim)", padding: "0 12px", display: "flex", alignItems: "center" }}>
              Reading what you wrote<span style={{ animation: "pulse 1.5s ease-in-out infinite" }}>...</span>
            </div>
          ) : (
            <input
              className="ai-input"
              style={{ borderColor: mc.border }}
              placeholder={speech.listening ? "Listening..." : isHype ? "What are you about to face?" : isClarity ? "What's looping?" : "Say what's happening..."}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
            />
          )}
          {!loading && speech.supported && (
            <button onClick={speech.toggle} style={{
              background: speech.listening ? "rgba(200,60,60,0.2)" : "var(--surface2)",
              border: speech.listening ? "1px solid rgba(200,60,60,0.4)" : "1px solid var(--border)",
              borderRadius: 8, width: 40, height: 40, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, color: speech.listening ? "rgba(200,80,80,0.9)" : "var(--text-dim)",
              transition: "all 0.2s", flexShrink: 0,
              animation: speech.listening ? "pulse 1.5s ease-in-out infinite" : "none"
            }}>
              🎙
            </button>
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
            {messages.length > 2 && (
              <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => {
                saveSession();
                try { localStorage.removeItem(STORAGE_KEY); } catch {}
                onComplete();
              }}>
                I'm done for now
              </button>
            )}
            <button className="btn btn-ghost" style={{ fontSize: 13, color: "var(--text-dim)" }} onClick={() => {
              try { localStorage.removeItem(STORAGE_KEY); } catch {}
              setMessages([]);
              setError(null);
            }}>
              Start fresh
            </button>
          </div>
          {messages.length > 2 && <FeedbackPrompt tool="reframe" />}
          {messages.length > 2 && <SessionNote />}
        </div>
      )}
      </>
      )}
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
      name: "In-Group Bias",
      what: "You naturally favor people who are like you and view outsiders with more suspicion.",
      example: "You trust someone's opinion more because they share your background, not because their reasoning is stronger.",
      question: "Do you find it easier to empathize with people who share your experience than people who don't?"
    },
    {
      name: "Spotlight Effect",
      what: "You overestimate how much other people notice or care about your mistakes.",
      example: "You said something awkward in a meeting. You replay it for days. Nobody else remembers.",
      question: "Do you assume people are thinking about your mistakes as much as you are?"
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
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, marginBottom: 12 }}>
          Awareness is the intervention.
        </h2>
        <p style={{ color: "var(--text-dim)", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
          You don't need to fix these. Just knowing they're there changes how you respond to them. The AI in Reframe is also watching for these patterns in your conversations.
        </p>
        {identified.length > 0 && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 20px", textAlign: "left", marginBottom: 24 }}>
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

      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, marginBottom: 16 }}>
        {bias.name}
      </h2>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 20px", marginBottom: 16 }}>
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

function PatternsTool({ onComplete }) {
  const [sessions, setSessions] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [signals, setSignals] = useState({});

  useEffect(() => {
    try { setSessions(JSON.parse(localStorage.getItem("stillform_sessions") || "[]")); } catch {}
    try { setCheckins(JSON.parse(localStorage.getItem("stillform_checkins") || "[]")); } catch {}
    try { setSignals(JSON.parse(localStorage.getItem("stillform_signal_profile") || "{}")); } catch {}
  }, []);

  // Generate insights from data
  const insights = [];

  if (sessions.length >= 3) {
    // Most used tool
    const toolCounts = {};
    sessions.forEach(s => (s.tools || []).forEach(t => { toolCounts[t] = (toolCounts[t] || 0) + 1; }));
    const topTool = Object.entries(toolCounts).sort((a, b) => b[1] - a[1])[0];
    if (topTool) {
      const names = { breathe: "Breathe", ground: "Grounding", "body-scan": "Body Scan", reframe: "Reframe", sigh: "Breathe" };
      insights.push({ label: "Most effective tool", value: names[topTool[0]] || topTool[0], detail: `Used ${topTool[1]} times` });
    }

    // Average regulation time
    const times = sessions.filter(s => s.duration).map(s => s.duration);
    if (times.length >= 2) {
      const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length / 1000);
      const min = Math.floor(avg / 60);
      const sec = avg % 60;
      insights.push({ label: "Average time to regulate", value: min > 0 ? `${min}m ${sec}s` : `${sec}s`, detail: `Across ${times.length} sessions` });
    }

    // Getting faster?
    if (times.length >= 4) {
      const firstHalf = times.slice(0, Math.floor(times.length / 2));
      const secondHalf = times.slice(Math.floor(times.length / 2));
      const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
      if (avgSecond < avgFirst * 0.85) {
        const pct = Math.round((1 - avgSecond / avgFirst) * 100);
        insights.push({ label: "Regulation speed", value: `${pct}% faster`, detail: "Compared to your first sessions" });
      }
    }

    // Fastest recovery
    if (times.length >= 2) {
      const fastest = Math.min(...times);
      const fastMin = Math.floor(Math.round(fastest / 1000) / 60);
      const fastSec = Math.round(fastest / 1000) % 60;
      insights.push({ label: "Fastest recovery", value: fastMin > 0 ? `${fastMin}m ${fastSec}s` : `${fastSec}s`, detail: "Your personal best" });
    }

    // Session count
    insights.push({ label: "Total sessions", value: `${sessions.length}`, detail: "Every one of these worked" });
  }

  // Check-in patterns
  if (checkins.length >= 3) {
    const areaTotals = {};
    checkins.forEach(c => {
      Object.entries(c.levels || {}).forEach(([area, level]) => {
        if (!areaTotals[area]) areaTotals[area] = { total: 0, count: 0 };
        areaTotals[area].total += level;
        areaTotals[area].count++;
      });
    });
    const highest = Object.entries(areaTotals).sort((a, b) => (b[1].total / b[1].count) - (a[1].total / a[1].count))[0];
    if (highest && highest[1].total / highest[1].count > 1) {
      const names = { jaw: "Jaw", shoulders: "Shoulders", chest: "Chest", gut: "Gut" };
      insights.push({ label: "Tension pattern", value: names[highest[0]] || highest[0], detail: "Consistently your highest tension area" });
    }
  }

  if (insights.length === 0) {
    return (
      <div style={{ textAlign: "center", maxWidth: 320, margin: "0 auto" }}>
        <div style={{ fontSize: 28, marginBottom: 16 }}>◇</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, marginBottom: 12 }}>Not enough data yet.</h2>
        <p style={{ color: "var(--text-dim)", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
          Keep using the tools and doing check-ins. Patterns emerge after about 10 sessions.
        </p>
        <button className="btn btn-ghost" onClick={onComplete}>Back</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <div style={{ fontSize: 28, marginBottom: 12, textAlign: "center" }}>◇</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, marginBottom: 8, textAlign: "center" }}>Your Patterns</h2>
      <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 28, textAlign: "center" }}>What the data shows. One insight at a time.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {insights.map((ins, i) => (
          <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 20px" }}>
            <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>{ins.label}</div>
            <div style={{ fontSize: 20, fontWeight: 500, color: "var(--amber)", marginBottom: 4 }}>{ins.value}</div>
            <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{ins.detail}</div>
          </div>
        ))}
      </div>

      <button className="btn btn-ghost" style={{ width: "100%", marginTop: 24 }} onClick={onComplete}>Done</button>
    </div>
  );
}

function MetacognitionTool({ onComplete }) {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState({});

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
      placeholder: "I need to know it's going to be okay..."
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
    { label: "I've got this", desc: "No tools needed", action: () => {
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
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, marginBottom: 12 }}>
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

      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, marginBottom: 8 }}>
        {prompt.question}
      </h2>
      <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>
        {prompt.sub}
      </p>

      {isChoiceStep ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {choices.map((c, i) => (
            <button key={i} onClick={c.action} style={{
              background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10,
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
                flex: 1, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8,
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
    { id: "jaw", label: "Jaw & Face", desc: "Clenching, tightness, grinding" },
    { id: "shoulders", label: "Shoulders & Neck", desc: "Rising, stiffness, pain" },
    { id: "chest", label: "Chest", desc: "Tightness, pressure, shallow breath" },
    { id: "hands", label: "Hands & Arms", desc: "Gripping, tingling, fists" },
    { id: "gut", label: "Stomach & Core", desc: "Knots, nausea, heaviness" },
    { id: "legs", label: "Legs & Feet", desc: "Restlessness, numbness, pacing urge" }
  ];

  const sensations = [
    "Tightness", "Heat", "Numbness", "Racing heart", "Shallow breath", "Nausea", "Trembling", "Brain fog"
  ];

  const triggers = [
    // Situational
    "Work / deadlines", "Conflict / confrontation", "Being put on the spot", "Public speaking / performing",
    "Difficult conversations", "Being judged or evaluated", "Waiting for results or news",
    // Emotional
    "Rejection or abandonment", "Feeling disrespected", "Jealousy", "Guilt or shame from the past",
    "Grief / loss / anniversaries", "Feeling invisible or unheard",
    // Relational
    "Family dynamics", "Romantic relationship tension", "Parenting moments", "Social situations / networking",
    // Physical / environmental
    "Chronic pain flares", "Sleep deprivation", "Sensory overload (noise, light, crowds)",
    "Hormonal changes", "Hunger or blood sugar drops",
    // Cognitive
    "Money / financial pressure", "Self-worth / impostor feelings", "Uncertainty / not knowing",
    "Being alone with your thoughts", "Comparison to others", "Unfinished tasks piling up"
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
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, marginBottom: 12 }}>Map Your Signals</h2>
        <p style={{ color: "var(--text-dim)", fontSize: 14, lineHeight: 1.7, marginBottom: 32 }}>
          Your body sends signals before things escalate. Most people never learn to read them. This takes 2 minutes and teaches the app how YOUR nervous system works.
        </p>
        <button className="btn btn-primary" onClick={() => setStep(1)}>Start →</button>
      </div>
    ),
    // Step 1: Where tension shows first
    () => (
      <div style={{ maxWidth: 400, margin: "0 auto" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 8 }}>Step 1 of 3</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, marginBottom: 8 }}>Where does tension show up first?</h2>
        <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 24 }}>Tap the areas that react first when stress is building. Select all that apply.</p>
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
                borderRadius: 10, padding: "14px 18px", textAlign: "left", cursor: "pointer", transition: "all 0.2s"
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
    // Step 2: What sensations come before crisis
    () => (
      <div style={{ maxWidth: 400, margin: "0 auto" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 8 }}>Step 2 of 3</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, marginBottom: 8 }}>What do you feel before it hits?</h2>
        <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 24 }}>The physical sensations that show up before a spiral, shutdown, or overwhelm.</p>
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
                borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer",
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
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, marginBottom: 8 }}>What activates you?</h2>
        <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 8 }}>Most people don't recognize half their triggers. Scroll through — tap any that feel familiar, even slightly. You might be surprised.</p>
        <p style={{ color: "var(--text-muted)", fontSize: 11, marginBottom: 24, fontStyle: "italic" }}>This isn't a diagnosis. It's self-knowledge. The more you identify, the earlier you'll catch the wave.</p>
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
                borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer",
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
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, marginBottom: 12 }}>Signal profile saved.</h2>
        <p style={{ color: "var(--text-dim)", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
          Now you know what to watch for. Over time, you'll start catching these signals before they escalate.
        </p>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 20px", textAlign: "left", marginBottom: 24 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 10 }}>Your signals</div>
          <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 8 }}>
            <strong style={{ color: "var(--text)" }}>First to react:</strong> {(signals.firstAreas || []).map(a => bodyAreas.find(b => b.id === a)?.label).join(", ")}
          </div>
          <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 8 }}>
            <strong style={{ color: "var(--text)" }}>Warning sensations:</strong> {(signals.preSensations || []).join(", ")}
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
      // Save check-in
      try {
        const checkins = JSON.parse(localStorage.getItem("stillform_checkins") || "[]");
        checkins.push({ timestamp: new Date().toISOString(), levels: updated });
        localStorage.setItem("stillform_checkins", JSON.stringify(checkins));
      } catch {}
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
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, marginBottom: 12 }}>Checked in.</h2>
        {needsHelp ? (
          <>
            <p style={{ color: "var(--text-dim)", fontSize: 14, marginBottom: 24 }}>
              Your {highArea.label.toLowerCase()} is carrying tension. Want to address it?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button className="btn btn-primary" onClick={() => onComplete("scan")}>Body Scan →</button>
              <button className="btn btn-ghost" onClick={() => onComplete("breathe")}>Breathe</button>
              <button className="btn btn-ghost" style={{ color: "var(--text-muted)", fontSize: 13 }} onClick={onComplete}>I'm fine</button>
            </div>
          </>
        ) : (
          <>
            <p style={{ color: "var(--text-dim)", fontSize: 14, marginBottom: 24 }}>Low tension across the board. You're regulated.</p>
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
          { level: 0, label: "Calm", color: "var(--green)" },
          { level: 1, label: "Mild", color: "var(--amber-dim)" },
          { level: 2, label: "Tense", color: "var(--amber)" },
          { level: 3, label: "High", color: "#c05040" }
        ].map(opt => (
          <button key={opt.level} onClick={() => handleTap(area.id, opt.level)} style={{
            background: levels[area.id] === opt.level ? "var(--surface2)" : "var(--surface)",
            border: `1px solid ${levels[area.id] === opt.level ? opt.color : "var(--border)"}`,
            borderRadius: 10, padding: "14px 6px", flex: 1, cursor: "pointer", transition: "all 0.2s",
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
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, color: "var(--text)", marginBottom: 8 }}>
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
            I need to talk through something
          </button>
          <button className="btn btn-ghost" style={{ width: "100%" }} onClick={() => onComplete()}>
            I'm okay now
          </button>
        </div>
        <SessionNote />
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
          Breathing complete
        </div>
        <div className="panic-done-text">
          Your system is settling. That shift is real.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 280 }}>
          <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => setShowGround(true)}>
            Continue to grounding →
          </button>
          <button className="btn btn-ghost" style={{ width: "100%" }} onClick={() => onComplete("reframe-calm")}>
            I need to talk through something
          </button>
          <button className="btn btn-ghost" style={{ width: "100%", color: "var(--text-muted)", fontSize: 13 }} onClick={() => {
            saveSession("breathing-only");
            onComplete();
          }}>
            I'm okay now
          </button>
        </div>
        <SessionNote />
      </div>
    );
  }

  // BREATHING ACTIVE — auto-started, one instruction only
  return (
    <div className="panic-screen">
      {/* Audio toggle — visible, labeled */}
      <button
        onClick={toggleAudio}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: audioOn ? "rgba(201,147,58,0.12)" : "var(--surface)",
          border: `1px solid ${audioOn ? "var(--amber-dim)" : "var(--border)"}`,
          borderRadius: 8,
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
    <div style={{ marginBottom: 20, padding: "14px 18px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 2 }}>Quick check-in</div>
          <div style={{ fontSize: 11, color: "var(--text-dim)" }}>30 seconds. Helps the AI give better advice.</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setStep(1)} style={{
            background: "var(--amber)", color: "#0e0f11", border: "none", borderRadius: 6,
            padding: "6px 14px", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
          }}>Start</button>
          <button onClick={() => setDismissed(true)} style={{
            background: "none", border: "1px solid var(--border)", borderRadius: 6,
            padding: "6px 10px", fontSize: 11, color: "var(--text-muted)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
          }}>Skip</button>
        </div>
      </div>
    </div>
  );

  // Step 1: Sleep
  if (step === 1) return (
    <div style={{ marginBottom: 20, padding: "16px 18px", background: "var(--surface)", border: "1px solid var(--amber-dim)", borderRadius: 10 }}>
      <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 10 }}>1 of 3 · Sleep</div>
      <div style={{ fontSize: 14, color: "var(--text)", marginBottom: 12 }}>How many hours did you sleep?</div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <input type="range" min="0" max="12" step="0.5" value={sleep} onChange={e => setSleep(parseFloat(e.target.value))}
          style={{ flex: 1, accentColor: "var(--amber)" }} />
        <div style={{ fontSize: 18, color: "var(--amber)", fontWeight: 500, minWidth: 40, textAlign: "center" }}>{sleep}h</div>
      </div>
      <button onClick={() => setStep(2)} style={{
        width: "100%", marginTop: 12, background: "var(--amber)", color: "#0e0f11", border: "none", borderRadius: 8,
        padding: "10px", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
      }}>Next</button>
    </div>
  );

  // Step 2: Energy + Mood
  if (step === 2) return (
    <div style={{ marginBottom: 20, padding: "16px 18px", background: "var(--surface)", border: "1px solid var(--amber-dim)", borderRadius: 10 }}>
      <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 10 }}>2 of 3 · Energy & mood</div>
      <div style={{ fontSize: 14, color: "var(--text)", marginBottom: 10 }}>Energy right now?</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["low", "ok", "high"].map(e => (
          <button key={e} onClick={() => setEnergy(e)} style={{
            flex: 1, padding: "8px", borderRadius: 8, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
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
            flex: 1, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8,
            padding: "10px 14px", color: "var(--text)", fontSize: 14, fontFamily: "'DM Sans', sans-serif"
          }} />
        <MicButton onTranscript={t => setMood(t)} />
      </div>
      <button onClick={() => setStep(3)} style={{
        width: "100%", marginTop: 12, background: "var(--amber)", color: "#0e0f11", border: "none", borderRadius: 8,
        padding: "10px", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
      }}>Next</button>
    </div>
  );

  // Step 3: Stress + save
  return (
    <div style={{ marginBottom: 20, padding: "16px 18px", background: "var(--surface)", border: "1px solid var(--amber-dim)", borderRadius: 10 }}>
      <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 10 }}>3 of 3 · Context</div>
      <div style={{ fontSize: 14, color: "var(--text)", marginBottom: 8 }}>Anything stressing you today?</div>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        <input value={stressEvent} onChange={e => setStressEvent(e.target.value)} placeholder="Optional — one line"
          style={{
            flex: 1, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8,
            padding: "10px 14px", color: "var(--text)", fontSize: 14, fontFamily: "'DM Sans', sans-serif"
          }} />
        <MicButton onTranscript={t => setStressEvent(prev => prev + (prev ? " " : "") + t)} />
      </div>
      <div style={{ fontSize: 14, color: "var(--text)", marginBottom: 8 }}>Anything else? Caffeine, meals, pain level?</div>
      <div style={{ display: "flex", gap: 6 }}>
        <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional"
          style={{
            flex: 1, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8,
            padding: "10px 14px", color: "var(--text)", fontSize: 14, fontFamily: "'DM Sans', sans-serif"
          }} />
        <MicButton onTranscript={t => setNotes(prev => prev + (prev ? " " : "") + t)} />
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={save} style={{
          flex: 1, background: "var(--amber)", color: "#0e0f11", border: "none", borderRadius: 8,
          padding: "10px", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
        }}>Save check-in</button>
        <button onClick={() => { setStep(0); setDismissed(true); }} style={{
          background: "none", border: "1px solid var(--border)", borderRadius: 8,
          padding: "10px 14px", fontSize: 12, color: "var(--text-muted)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
        }}>Skip</button>
      </div>
    </div>
  );
}

export default function Stillform() {
  // UAT MODE: always show onboarding. Change back to conditional for production.
  const hasSeenOnboarding = false;
  const [screen, setScreen] = useState("onboarding");
  const [onboardStep, setOnboardStep] = useState(0);
  const [activeTool, setActiveTool] = useState(null);
  const [pathway, setPathway] = useState(null);
  const [pricingPlan, setPricingPlan] = useState("annual");
  const [pricingCloud, setPricingCloud] = useState(false);
  const { screenLight, reducedMotion } = useDisplayPrefs();
  const appClasses = `app${screenLight ? " screenlight-active" : ""}${reducedMotion ? " reduced-motion" : ""}`;

  const completeOnboarding = () => {
    // UAT MODE: tutorial shows every visit. Re-enable the line below when ready for production.
    // try { localStorage.setItem("stillform_onboarded", "yes"); } catch {}
    setScreen("home");
  };

  // Journal state
  const [journalEntries, setJournalEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem("stillform_journal") || "[]"); } catch { return []; }
  });
  const [journalMode, setJournalMode] = useState("list");
  const [journalViewIdx, setJournalViewIdx] = useState(null);
  const [jTrigger, setJTrigger] = useState("");
  const [jEmotion, setJEmotion] = useState([]);
  const [jBody, setJBody] = useState("");
  const [jOutcome, setJOutcome] = useState("");
  const [jIntensity, setJIntensity] = useState(5);

  const journalEmotions = ["Anger", "Anxiety", "Shame", "Sadness", "Frustration", "Overwhelm", "Fear", "Numbness", "Confusion", "Guilt", "Relief", "Calm", "Pride", "Clarity", "Gratitude", "Joy"];

  const saveJournalEntry = () => {
    const entry = {
      id: Date.now(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      trigger: jTrigger.trim(),
      emotions: jEmotion,
      intensity: jIntensity,
      body: jBody.trim(),
      outcome: jOutcome.trim()
    };
    const updated = [entry, ...journalEntries];
    setJournalEntries(updated);
    try { localStorage.setItem("stillform_journal", JSON.stringify(updated)); } catch {}
    setJournalMode("list");
    setJTrigger(""); setJEmotion([]); setJBody(""); setJOutcome(""); setJIntensity(5);
  };

  const deleteJournalEntry = (id) => {
    if (!window.confirm("Delete this entry?")) return;
    const updated = journalEntries.filter(e => e.id !== id);
    setJournalEntries(updated);
    try { localStorage.setItem("stillform_journal", JSON.stringify(updated)); } catch {}
    setJournalMode("list");
  };

  // Scroll to top on every screen change
  useEffect(() => { window.scrollTo(0, 0); }, [screen]);
  const startTool = (tool) => {
    setActiveTool(tool);
    setScreen("tool");
  };

  const startPathway = (p) => {
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

  const renderTool = () => {
    const props = { onComplete: (redirectTo) => {
      if (redirectTo) {
        const tool = TOOLS.find(t => t.id === redirectTo);
        if (tool) { startTool(tool); return; }
        // Special case: reframe with mode
        if (redirectTo === "reframe-calm" || redirectTo === "reframe-clarity" || redirectTo === "reframe-hype") {
          setActiveTool({ ...TOOLS.find(t => t.id === "reframe"), mode: redirectTo.split("-")[1] });
          setScreen("tool");
          return;
        }
      }
      setScreen("home");
    }};
    switch (activeTool?.id) {
      case "breathe": return <BreatheGroundTool {...props} pathway={pathway} />;
      case "sigh": return <PhysiologicalSighTool {...props} />;
      case "scan": return <BodyScanTool {...props} />;
      case "reframe": return <ReframeTool {...props} mode={activeTool?.mode || (pathway === "clarity" ? "clarity" : pathway === "hype" ? "hype" : "calm")} defaultTab={activeTool?.defaultTab || "talk"} />;
      case "signals": return <SignalMapTool {...props} />;
      case "checkin": return <BodyCheckInTool {...props} />;
      case "patterns": return <PatternsTool {...props} />;
      case "bias": return <MicroBiasTool {...props} />;
      case "meta": return <MetacognitionTool {...props} />;
      default: return null;
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className={appClasses}>
        {/* NAV — hidden during onboarding */}
        {screen !== "onboarding" && (
        <nav className="nav">
          <div className="nav-logo" style={{ cursor: "pointer" }} onClick={() => setScreen("home")}>
            Still<span>form</span>
          </div>
          <div className="nav-actions">
            <button className="btn btn-ghost" onClick={() => setScreen("settings")} style={{ padding: "8px 14px" }}>
              ⚙
            </button>
            <button className="btn btn-primary" onClick={() => setScreen("pricing")}>
              Start Free Trial
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
              subtitle: "Composure mastery. Stay centered anywhere.",
              body: "Anxiety. Stage fright. Obsessive thinking. Rage. Overwhelm. Excitement you can't contain. Any feeling too big to hold — this system trains you to hold it.",
              note: null
            },
            {
              icon: "◎",
              label: "Your tools",
              title: "Regulate",
              subtitle: "Three tools. Each one different.",
              body: "Breathe — smart breathing that picks the right pattern for what you're feeling, plus sensory grounding. Sound on or off.\n\nBody Scan — find tension in your body and release it with guided acupressure at six targeted points. Sound on or off.\n\nReframe — AI-powered. Three modes: Calm (settle overwhelm), Get Sharp (cut through loops), Lock In (pre-performance composure). Switch modes mid-conversation — the AI carries everything with you. Talk tab for real-time conversation, Journal tab to write entries the AI remembers next time.",
              note: "The floating reset button is always free. Full tools require a subscription."
            },
            {
              icon: "◎",
              label: "Features",
              title: "Built for you",
              subtitle: "The more you use it, the smarter it gets.",
              body: "Daily check-in — 30 seconds, optional. Sleep, energy, mood, stress. The AI factors this in when you talk to it.\n\nVoice-to-text — every text field has a mic button. Speak instead of type.\n\nCloud sync — encrypted, accessible from any device.\n\nHow the AI remembers you: Your conversations, journal, and check-ins are stored in your encrypted cloud account. Every time you open Reframe, the AI reads your history fresh. It never stores anything on its own — your data is yours. Delete it anytime and it's gone.",
              note: null
            },
            {
              icon: "◇",
              label: "Body awareness",
              title: "Know your signals",
              subtitle: "Where does stress show first?",
              body: "In Settings, you can map where tension shows up in your body — jaw, shoulders, chest, gut, hands, legs. This builds a signal profile so you catch the wave earlier. You only need to do this once."
            },
            {
              icon: "◈",
              label: "Over time",
              title: "The app learns you",
              subtitle: "The more you use it, the smarter it gets.",
              body: "After a few sessions, your home page starts showing insights — your most effective tool, regulation speed, patterns. The AI stops being generic and starts being yours. It won't call out patterns too early. It builds trust first, then gets direct."
            },
            {
              icon: "✦",
              label: "Mastery",
              title: "Composure on demand",
              subtitle: "Regulate faster. Recognize sooner. Choose deliberately.",
              body: "This is what Stillform trains: notice what's happening in your body, name what your mind is doing, and choose your response instead of reacting. The tools stay the same — but your relationship with them changes completely."
            }
          ];
          const step = steps[onboardStep];
          const isLast = onboardStep === steps.length - 1;
          const isFirst = onboardStep === 0;

          return (
            <section style={{
              maxWidth: 480, margin: "0 auto", padding: "0 24px",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              minHeight: "100vh", textAlign: "center", position: "relative", zIndex: 1
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

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 32, width: "100%", maxWidth: 320 }}>
                {!isFirst && !isLast && (
                  <button className="btn btn-ghost" onClick={() => setOnboardStep(s => s - 1)}>
                    Back
                  </button>
                )}
                {isLast ? (
                  <>
                    <button onClick={() => {
                      const el = document.getElementById("onboard-menu");
                      if (el) el.style.display = el.style.display === "none" ? "block" : "none";
                    }} style={{
                      width: "100%", background: "var(--amber)", color: "#0e0f11", border: "none", borderRadius: 10,
                      padding: "16px 24px", fontSize: 16, fontWeight: 500, cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif", display: "flex", justifyContent: "space-between", alignItems: "center"
                    }}>
                      <span>Start your first session</span>
                      <span style={{ fontSize: 12 }}>▾</span>
                    </button>
                    <div id="onboard-menu" style={{ display: "none", marginTop: 2, borderRadius: 10, overflow: "hidden", border: "1px solid var(--amber-dim)", background: "var(--surface2)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)", width: "100%" }}>
                      <button onClick={() => { completeOnboarding(); startPathway("calm"); }} style={{
                        width: "100%", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.06)",
                        padding: "12px 18px", textAlign: "left", cursor: "pointer", color: "var(--text)", fontFamily: "'DM Sans', sans-serif",
                        display: "flex", alignItems: "center", gap: 12
                      }}>
                        <span style={{ color: "var(--amber)", fontSize: 14 }}>◎</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>Breathe</div>
                          <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Smart breathing + grounding</div>
                        </div>
                      </button>
                      <button onClick={() => { completeOnboarding(); startTool(TOOLS.find(t => t.id === "scan")); }} style={{
                        width: "100%", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.06)",
                        padding: "12px 18px", textAlign: "left", cursor: "pointer", color: "var(--text)", fontFamily: "'DM Sans', sans-serif",
                        display: "flex", alignItems: "center", gap: 12
                      }}>
                        <span style={{ color: "var(--amber)", fontSize: 14 }}>◉</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>Body Scan</div>
                          <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Find tension · acupressure release</div>
                        </div>
                      </button>
                      <button onClick={() => { completeOnboarding(); setPathway("calm"); startTool(TOOLS.find(t => t.id === "reframe")); }} style={{
                        width: "100%", background: "transparent", border: "none",
                        padding: "12px 18px", textAlign: "left", cursor: "pointer", color: "var(--text)", fontFamily: "'DM Sans', sans-serif",
                        display: "flex", alignItems: "center", gap: 12
                      }}>
                        <span style={{ color: "var(--amber)", fontSize: 14 }}>✦</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>Reframe</div>
                          <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Talk it through or journal it</div>
                        </div>
                      </button>
                    </div>
                    <button onClick={() => { completeOnboarding(); setScreen("home"); }} style={{
                      background: "none", border: "none", color: "var(--text-muted)", fontSize: 13,
                      cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginTop: 16
                    }}>
                      Just explore the app →
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
                        background: "none", border: "1px solid var(--border)", borderRadius: 8,
                        padding: "8px 16px", fontSize: 12, color: "var(--text-dim)", cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s"
                      }}>
                        Crisis resources & helplines →
                      </button>
                    </div>
                  </>
                ) : (
                  <button className="btn btn-primary" style={{ padding: "14px 32px" }} onClick={() => setOnboardStep(s => s + 1)}>
                    {isFirst ? "See how it works" : "Next"}
                  </button>
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
              {isFirst && (
                <button onClick={completeOnboarding} style={{
                  background: "none", border: "none", color: "var(--text-muted)", fontSize: 12,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginTop: 12
                }}>
                  I don't need instructions
                </button>
              )}
            </section>
          );
        })()}

        {/* FLOATING RESET — accessible from any screen */}
        {screen !== "home" && screen !== "panic" && screen !== "onboarding" && (
          <button onClick={() => setScreen("panic")} style={{
            position: "fixed", bottom: 80, right: 24, zIndex: 100,
            background: "var(--bg)", border: "1px solid var(--amber-dim)",
            borderRadius: 28, padding: "10px 18px", fontSize: 12, letterSpacing: "0.06em",
            color: "var(--amber)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 2px 12px rgba(0,0,0,0.3)", transition: "all 0.2s"
          }}>
            ◎ Reset
          </button>
        )}

        {/* PANIC MODE — zero decisions, auto-start breathing */}
        {screen === "panic" && (
          <PanicMode onComplete={(redirectTo) => {
            if (redirectTo) {
              const tool = TOOLS.find(t => t.id === redirectTo);
              if (tool) { startTool(tool); return; }
              if (redirectTo === "reframe-calm") {
                setActiveTool({ ...TOOLS.find(t => t.id === "reframe"), mode: "calm" });
                setScreen("tool");
                return;
              }
            }
            setScreen("home");
          }} />
        )}

        {/* HOME — different for first-time vs returning users */}
        {screen === "home" && (() => {
          let sessionCount = 0;
          try { sessionCount = JSON.parse(localStorage.getItem("stillform_sessions") || "[]").length; } catch {}
          const isNew = sessionCount === 0;

          if (isNew) return (
            /* ── FIRST TIME: what is this, why should I care ── */
            <section className="home">
              <h1 className="home-title">
                Composure<br /><em>Mastery.</em>
              </h1>
              <p className="home-sub">
                Stay centered anywhere. Stillform trains your composure — whether it's anxiety, stage fright, obsessive thinking, rage, or any feeling too big to hold.
              </p>

              <div style={{ width: "100%", maxWidth: 360 }}>
                <button onClick={() => {
                  const el = document.getElementById("session-menu");
                  if (el) el.style.display = el.style.display === "none" ? "block" : "none";
                }} style={{
                  width: "100%", background: "var(--amber)", color: "#0e0f11", border: "none", borderRadius: 10,
                  padding: "16px 24px", fontSize: 16, fontWeight: 500, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <span>Start your first session</span>
                  <span style={{ fontSize: 12 }}>▾</span>
                </button>
                <div id="session-menu" style={{ display: "none", marginTop: 2, borderRadius: 10, overflow: "hidden", border: "1px solid var(--amber-dim)", background: "var(--surface2)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                  <button onClick={() => startPathway("calm")} style={{
                    width: "100%", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.06)",
                    padding: "12px 18px", textAlign: "left", cursor: "pointer", color: "var(--text)",
                    fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 12
                  }}>
                    <span style={{ color: "var(--amber)", fontSize: 14 }}>◎</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>Breathe</div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Smart breathing + grounding</div>
                    </div>
                  </button>
                  <button onClick={() => startTool(TOOLS.find(t => t.id === "scan"))} style={{
                    width: "100%", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.06)",
                    padding: "12px 18px", textAlign: "left", cursor: "pointer", color: "var(--text)",
                    fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 12
                  }}>
                    <span style={{ color: "var(--amber)", fontSize: 14 }}>◉</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>Body Scan</div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Find tension · acupressure release</div>
                    </div>
                  </button>
                  <button onClick={() => { setPathway("calm"); startTool(TOOLS.find(t => t.id === "reframe")); }} style={{
                    width: "100%", background: "transparent", border: "none",
                    padding: "12px 18px", textAlign: "left", cursor: "pointer", color: "var(--text)",
                    fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 12
                  }}>
                    <span style={{ color: "var(--amber)", fontSize: 14 }}>✦</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>Reframe</div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Talk it through or journal it</div>
                    </div>
                  </button>
                </div>
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 12, marginBottom: 56 }}>7-day free trial. Most sessions take 2 minutes.</div>

              {/* HOW IT GETS SMARTER */}
              <div style={{ maxWidth: 440, width: "100%", textAlign: "center" }}>
                <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 16 }}>
                  The more you use it, the smarter it gets.
                </div>
                <div style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.7 }}>
                  Stillform learns from your sessions, your journal, and your daily check-ins. Over time, it recognizes your triggers, knows your patterns, and gives you sharper, more personalized guidance — without you having to explain yourself twice.
                </div>
              </div>

              <div style={{ marginTop: 40, fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.04em" }}>
                Built from lived experience.
              </div>
            </section>
          );

          /* ── RETURNING USER: everything visible, organized by level ── */
          return (
            <section style={{ maxWidth: 480, margin: "0 auto", padding: "24px 24px 80px", position: "relative", zIndex: 1 }}>

              {/* Repeat what worked */}
              {(() => {
                try {
                  const sessions = JSON.parse(localStorage.getItem("stillform_sessions") || "[]");
                  if (sessions.length < 2) return null;
                  const last = sessions[sessions.length - 1];
                  const toolNames = { breathe: "Breathe", ground: "Breathe", "body-scan": "Body Scan", reframe: "Reframe", sigh: "Breathe", metacognition: "Watch & Choose" };
                  const toolIds = { breathe: "breathe", ground: "breathe", "body-scan": "scan", reframe: "reframe", sigh: "breathe", metacognition: "meta" };
                  const mainTool = (last.tools || [])[0];
                  if (!mainTool || !toolNames[mainTool]) return null;
                  return (
                    <button
                      onClick={() => startTool(TOOLS.find(t => t.id === (toolIds[mainTool] || "breathe")))}
                      style={{
                        width: "100%", background: "var(--amber-glow)", border: "1px solid var(--amber-dim)",
                        borderRadius: 10, padding: "12px 16px", textAlign: "left", cursor: "pointer",
                        marginBottom: 20, transition: "all 0.2s"
                      }}
                    >
                      <div style={{ fontSize: 13, color: "var(--amber)" }}>
                        ↺ {toolNames[mainTool]} worked last time · {last.durationFormatted || "tap to repeat"}
                      </div>
                    </button>
                  );
                } catch { return null; }
              })()}

              {/* DAILY CHECK-IN — optional, 30 seconds, makes AI smarter */}
              {(() => {
                const today = new Date().toISOString().slice(0, 10);
                let checkin = null;
                try { checkin = JSON.parse(localStorage.getItem("stillform_checkin_today") || "null"); } catch {}
                const isDoneToday = checkin && checkin.date === today;

                if (isDoneToday) return (
                  <div style={{ marginBottom: 20, padding: "10px 16px", background: "var(--amber-glow)", border: "1px solid var(--amber-dim)", borderRadius: 10 }}>
                    <div style={{ fontSize: 12, color: "var(--amber)" }}>
                      Checked in · {checkin.sleep}h sleep · Energy {checkin.energy} · Mood: {checkin.mood}
                    </div>
                  </div>
                );

                return (
                  <CheckInWidget onComplete={() => window.location.reload()} />
                );
              })()}

              {/* YOUR TOOLS */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button onClick={() => startPathway("calm")} style={{
                    width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10,
                    padding: "16px 18px", textAlign: "left", cursor: "pointer", color: "var(--text)",
                    fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s"
                  }}>
                    <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 3 }}>◎ Breathe</div>
                    <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Smart breathing + grounding. The app picks the right pattern for what you're feeling.</div>
                  </button>
                  <button onClick={() => startTool(TOOLS.find(t => t.id === "scan"))} style={{
                    width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10,
                    padding: "16px 18px", textAlign: "left", cursor: "pointer", color: "var(--text)",
                    fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s"
                  }}>
                    <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 3 }}>◉ Body Scan</div>
                    <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Most people hold stress without realizing it. Find it. Release it with acupressure.</div>
                  </button>
                  <button onClick={() => { setPathway("calm"); startTool(TOOLS.find(t => t.id === "reframe")); }} style={{
                    width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10,
                    padding: "16px 18px", textAlign: "left", cursor: "pointer", color: "var(--text)",
                    fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s"
                  }}>
                    <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 3 }}>✦ Reframe</div>
                    <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Talk it through or journal it. AI learns from everything you share.</div>
                  </button>
                </div>
              </div>

              {/* STATS */}
              {(() => {
                try {
                  const sessions = JSON.parse(localStorage.getItem("stillform_sessions") || "[]");
                  if (sessions.length === 0) return null;
                  const avgMs = sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / sessions.length;
                  const avgSec = Math.round(avgMs / 1000);
                  const avgStr = avgSec >= 60 ? `${Math.floor(avgSec / 60)}m ${avgSec % 60}s` : `${avgSec}s`;

                  // Streak: consecutive days with sessions
                  const daySet = new Set(sessions.map(s => s.timestamp?.slice(0, 10)).filter(Boolean));
                  let streak = 0;
                  const today = new Date();
                  for (let i = 0; i < 365; i++) {
                    const d = new Date(today);
                    d.setDate(d.getDate() - i);
                    const key = d.toISOString().slice(0, 10);
                    if (daySet.has(key)) streak++;
                    else break;
                  }

                  // Fastest regulation
                  const durations = sessions.map(s => s.duration).filter(d => d > 0);
                  const fastest = durations.length > 0 ? Math.min(...durations) : null;
                  const fastSec = fastest ? Math.round(fastest / 1000) : null;
                  const fastStr = fastSec ? (fastSec >= 60 ? `${Math.floor(fastSec / 60)}m ${fastSec % 60}s` : `${fastSec}s`) : null;

                  return (
                    <>
                    <div style={{ display: "flex", gap: 20, justifyContent: "center", paddingTop: 12, flexWrap: "wrap" }}>
                      <div style={{ textAlign: "center", minWidth: 60 }}>
                        <div style={{ fontSize: 28, color: "var(--amber)", fontFamily: "'Cormorant Garamond', serif" }}>{sessions.length}</div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>sessions</div>
                      </div>
                      <div style={{ textAlign: "center", minWidth: 60 }}>
                        <div style={{ fontSize: 28, color: "var(--amber)", fontFamily: "'Cormorant Garamond', serif" }}>{avgStr}</div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>avg time</div>
                      </div>
                      {streak > 1 && (
                        <div style={{ textAlign: "center", minWidth: 60 }}>
                          <div style={{ fontSize: 28, color: "var(--amber)", fontFamily: "'Cormorant Garamond', serif" }}>{streak}</div>
                          <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>consecutive days</div>
                        </div>
                      )}
                      {fastStr && (
                        <div style={{ textAlign: "center", minWidth: 60 }}>
                          <div style={{ fontSize: 28, color: "var(--amber)", fontFamily: "'Cormorant Garamond', serif" }}>{fastStr}</div>
                          <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>fastest</div>
                        </div>
                      )}
                    </div>

                    {sessions.length >= 5 && (() => {
                      // Most used tool
                      const toolCounts = {};
                      sessions.forEach(s => { const t = (s.tools || [])[0]; if (t) toolCounts[t] = (toolCounts[t] || 0) + 1; });
                      const topTool = Object.entries(toolCounts).sort((a, b) => b[1] - a[1])[0];
                      const toolLabel = { breathe: "Breathe", "body-scan": "Body Scan", reframe: "Reframe" };

                      // Time trend (first 5 vs last 5)
                      const recentDurations = sessions.slice(-5).map(s => s.duration).filter(d => d > 0);
                      const earlyDurations = sessions.slice(0, 5).map(s => s.duration).filter(d => d > 0);
                      const recentAvg = recentDurations.length ? recentDurations.reduce((a, b) => a + b, 0) / recentDurations.length : 0;
                      const earlyAvg = earlyDurations.length ? earlyDurations.reduce((a, b) => a + b, 0) / earlyDurations.length : 0;
                      const improving = recentAvg < earlyAvg && earlyAvg > 0;

                      return (
                        <div style={{ marginTop: 16, padding: "12px 16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12, color: "var(--text-dim)", lineHeight: 1.6 }}>
                          {topTool && <div>Most used: <span style={{ color: "var(--amber)" }}>{toolLabel[topTool[0]] || topTool[0]}</span></div>}
                          {sessions.length >= 8 && improving && <div style={{ marginTop: 4 }}>Your regulation time is trending faster.</div>}
                          {sessions.length >= 8 && !improving && recentAvg > 0 && <div style={{ marginTop: 4 }}>Your regulation time is holding steady.</div>}
                          {sessions.length >= 12 && <div style={{ marginTop: 4, color: "var(--amber)" }}>The AI is using your full history to personalize guidance.</div>}
                        </div>
                      );
                    })()}
                    </>
                  );
                } catch { return null; }
              })()}
            </section>
          );
        })()}

        {/* ACTIVE TOOL */}
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
                    const names = { calm: "✦ Reframe", clarity: "✦ Get Sharp", hype: "◌ Lock In" };
                    return names[m] || "✦ Reframe";
                  })()
                ) : (
                  <>{activeTool.icon} {activeTool.name}</>
                )}
              </div>
              <button onClick={() => setScreen("panic")} style={{
                background: "none", border: "1px solid var(--amber-dim)", borderRadius: 6,
                padding: "4px 10px", fontSize: 11, color: "var(--amber)", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.04em"
              }}>
                Reset
              </button>
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", marginBottom: 12 }}>
              Not therapy. Not crisis intervention. <button onClick={() => setScreen("crisis")} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 11, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>Crisis resources</button>
            </div>
            {renderTool()}
          </section>
        )}

        {/* JOURNAL — log triggers, emotions, outcomes */}
        {screen === "journal" && (
          <section style={{ maxWidth: 560, margin: "0 auto", padding: "40px 24px 80px", position: "relative", zIndex: 1 }}>
            <button className="intervention-back" onClick={() => journalMode === "list" ? setScreen("home") : setJournalMode("list")}>
              ← {journalMode === "list" ? "Home" : "Back"}
            </button>

            {journalMode === "list" && (
              <>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, marginBottom: 8 }}>Journal</h1>
                <p style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 24 }}>
                  Track what triggered you, how it felt, and what happened after.
                </p>
                <button
                  onClick={() => setJournalMode("new")}
                  style={{
                    width: "100%", background: "var(--amber-glow)", border: "1px solid var(--amber-dim)",
                    borderRadius: 10, padding: "14px 18px", cursor: "pointer", color: "var(--amber)",
                    fontSize: 14, fontFamily: "'DM Sans', sans-serif", marginBottom: 24, textAlign: "left"
                  }}
                >
                  + New entry
                </button>
                {journalEntries.length === 0 && (
                  <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)", fontSize: 13 }}>
                    No entries yet. Your journal builds your record over time.
                  </div>
                )}
                {journalEntries.map((e, i) => (
                  <button key={e.id} onClick={() => { setJournalViewIdx(i); setJournalMode("view"); }} style={{
                    width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10,
                    padding: "14px 18px", textAlign: "left", cursor: "pointer", marginBottom: 8, color: "var(--text)",
                    fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{e.trigger || "Untitled"}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{e.date}</div>
                    </div>
                    {e.emotions?.length > 0 && (
                      <div style={{ fontSize: 11, color: "var(--text-dim)" }}>{e.emotions.join(" · ")}</div>
                    )}
                  </button>
                ))}
              </>
            )}

            {journalMode === "new" && (
              <>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, marginBottom: 24 }}>New entry</h1>

                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 6, letterSpacing: "0.04em" }}>What triggered this?</div>
                  <textarea
                    value={jTrigger}
                    onChange={e => setJTrigger(e.target.value)}
                    placeholder="What happened or what were you thinking about?"
                    style={{
                      width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
                      padding: "12px 14px", color: "var(--text)", fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                      resize: "none", minHeight: 70, lineHeight: 1.6
                    }}
                  />
                  <div style={{ marginTop: 6 }}>
                    <MicButton onTranscript={t => setJTrigger(prev => prev + (prev ? " " : "") + t)} />
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 8, letterSpacing: "0.04em" }}>What did you feel? <span style={{ color: "var(--text-muted)" }}>(tap all that apply)</span></div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {journalEmotions.map(em => (
                      <button key={em} onClick={() => setJEmotion(prev => prev.includes(em) ? prev.filter(e => e !== em) : [...prev, em])}
                        style={{
                          padding: "6px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                          fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
                          background: jEmotion.includes(em) ? "var(--amber-glow)" : "var(--surface)",
                          border: `1px solid ${jEmotion.includes(em) ? "var(--amber-dim)" : "var(--border)"}`,
                          color: jEmotion.includes(em) ? "var(--amber)" : "var(--text-dim)"
                        }}
                      >{em}</button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 8, letterSpacing: "0.04em" }}>Intensity: {jIntensity}/10</div>
                  <input type="range" min="1" max="10" value={jIntensity} onChange={e => setJIntensity(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--amber)" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-muted)" }}>
                    <span>Mild</span><span>Severe</span>
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 6, letterSpacing: "0.04em" }}>Where did you feel it in your body?</div>
                  <textarea
                    value={jBody}
                    onChange={e => setJBody(e.target.value)}
                    placeholder="Jaw, chest, stomach, hands..."
                    style={{
                      width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
                      padding: "12px 14px", color: "var(--text)", fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                      resize: "none", minHeight: 50, lineHeight: 1.6
                    }}
                  />
                  <div style={{ marginTop: 6 }}>
                    <MicButton onTranscript={t => setJBody(prev => prev + (prev ? " " : "") + t)} />
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 6, letterSpacing: "0.04em" }}>What happened after? <span style={{ color: "var(--text-muted)" }}>(optional)</span></div>
                  <textarea
                    value={jOutcome}
                    onChange={e => setJOutcome(e.target.value)}
                    placeholder="Did you use a tool? Did you react? What did you do?"
                    style={{
                      width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
                      padding: "12px 14px", color: "var(--text)", fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                      resize: "none", minHeight: 70, lineHeight: 1.6
                    }}
                  />
                  <div style={{ marginTop: 6 }}>
                    <MicButton onTranscript={t => setJOutcome(prev => prev + (prev ? " " : "") + t)} />
                  </div>
                </div>

                <button onClick={saveJournalEntry} disabled={!jTrigger.trim()} style={{
                  width: "100%", padding: "14px", borderRadius: 8, fontSize: 14, fontWeight: 500,
                  fontFamily: "'DM Sans', sans-serif", cursor: jTrigger.trim() ? "pointer" : "not-allowed",
                  background: jTrigger.trim() ? "var(--amber)" : "var(--surface2)",
                  color: jTrigger.trim() ? "#0e0f11" : "var(--text-muted)", border: "none",
                  transition: "all 0.2s"
                }}>
                  Save entry
                </button>
              </>
            )}

            {journalMode === "view" && journalViewIdx !== null && journalEntries[journalViewIdx] && (() => {
              const e = journalEntries[journalViewIdx];
              return (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, gap: 12 }}>
                    <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, lineHeight: 1.3 }}>{e.trigger || "Untitled"}</h1>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap", flexShrink: 0 }}>{e.date} · {e.time}</div>
                  </div>
                  {e.emotions?.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>Emotions</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {e.emotions.map(em => (
                          <span key={em} style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, background: "var(--amber-glow)", border: "1px solid var(--amber-dim)", color: "var(--amber)" }}>{em}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {e.intensity && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>Intensity</div>
                      <div style={{ fontSize: 14, color: "var(--text)" }}>{e.intensity}/10</div>
                    </div>
                  )}
                  {e.body && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>Body</div>
                      <div style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.6 }}>{e.body}</div>
                    </div>
                  )}
                  {e.outcome && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>Outcome</div>
                      <div style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.6 }}>{e.outcome}</div>
                    </div>
                  )}
                  <button onClick={() => deleteJournalEntry(e.id)} style={{
                    marginTop: 24, background: "none", border: "1px solid rgba(200,60,60,0.3)", borderRadius: 8,
                    padding: "10px 16px", fontSize: 13, color: "rgba(200,80,80,0.8)", cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif"
                  }}>
                    Delete entry
                  </button>
                </>
              );
            })()}
          </section>
        )}

        {/* PRICING */}
        {screen === "pricing" && (
          <section className="pricing">
            <button className="intervention-back" onClick={() => setScreen("home")}>← Back</button>
            <div className="pricing-header">
              <h2>Start free. Stay only if it works.</h2>
              <p>Try everything free for 7 days. The one-tap reset button stays free forever.</p>
            </div>
            <div className="pricing-cards">
              <div className="pricing-card featured" style={{ maxWidth: 360, margin: "0 auto" }}>
                {/* Monthly / Annual toggle */}
                <div style={{ display: "flex", background: "var(--surface)", borderRadius: 8, padding: 3, marginBottom: 20 }}>
                  <button onClick={() => setPricingPlan("monthly")} style={{
                    flex: 1, padding: "8px 0", borderRadius: 6, border: "none", cursor: "pointer",
                    fontSize: 13, fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                    background: pricingPlan === "monthly" ? "var(--amber)" : "transparent",
                    color: pricingPlan === "monthly" ? "#0e0f11" : "var(--text-muted)"
                  }}>Monthly</button>
                  <button onClick={() => setPricingPlan("annual")} style={{
                    flex: 1, padding: "8px 0", borderRadius: 6, border: "none", cursor: "pointer",
                    fontSize: 13, fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                    background: pricingPlan === "annual" ? "var(--amber)" : "transparent",
                    color: pricingPlan === "annual" ? "#0e0f11" : "var(--text-muted)"
                  }}>Annual</button>
                </div>

                <div className="pricing-price">
                  {pricingPlan === "annual" ? (
                    <><sup>$</sup>14<span style={{ fontSize: 28 }}>.99</span></>
                  ) : (
                    <><sup>$</sup>19<span style={{ fontSize: 28 }}>.99</span></>
                  )}
                </div>
                <div className="pricing-save">
                  {pricingPlan === "annual" ? "per month · $179.88/yr · Save 25%" : "per month"}
                </div>

                <ul className="pricing-features">
                  <li>One-tap reset — always free</li>
                  <li>Breathe, Body Scan, Reframe</li>
                  <li>3 AI modes: Calm, Get Sharp, Lock In</li>
                  <li>Journal with AI memory</li>
                  <li>Daily check-in</li>
                  <li>Cloud sync — access from any device</li>
                  <li>Signal mapping + tension check</li>
                  <li>Pattern recognition (evolves with use)</li>
                  <li>Voice-to-text everywhere</li>
                  <li>Encrypted cloud backup</li>
                </ul>
                <button className="btn btn-primary" style={{ width: "100%" }}>
                  Start 7-day free trial →
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
            <div className="privacy-date">Effective March 2026 · Ember Enterprises LLC</div>

            <h2>What Stillform Is</h2>
            <p>Stillform is a composure and self-awareness tool. It provides structured breathing exercises, sensory grounding techniques, acupressure guidance, and AI-assisted cognitive reframing to help users regulate their nervous system and develop awareness of their own mental and emotional patterns.</p>

            <h2>What Stillform Is Not</h2>
            <p>Stillform is not medical treatment, therapy, counseling, or a crisis intervention service. It does not diagnose, treat, cure, or prevent any medical or psychological condition. It is not a substitute for professional medical advice, diagnosis, or treatment. If you are experiencing a medical or mental health crisis, please see our Crisis Resources page for international helplines.</p>

            <h2>Acupressure</h2>
            <p>The acupressure guidance in Stillform is for general wellness purposes only. It is not medical treatment. The pressure points referenced are based on traditional practices and are provided for informational and self-care purposes. Consult a healthcare provider before beginning any new wellness practice, especially if you are pregnant, have a medical condition, or are taking medication.</p>

            <h2>AI-Powered Reframe</h2>
            <p>The Reframe feature uses artificial intelligence (Anthropic's Claude API) to generate responses based on evidence-based reframing techniques. These responses are generated by AI, not by a licensed therapist or medical professional. AI responses may not always be accurate, appropriate, or applicable to your situation. Do not rely on AI-generated content as a substitute for professional mental health care. Do not enter sensitive personal, medical, or identifying information.</p>
            <p>Text entered into the Reframe feature is sent to Anthropic's servers for processing. It is handled in accordance with <a href="https://www.anthropic.com/privacy" style={{ color: "var(--amber)" }}>Anthropic's privacy policy</a>.</p>

            <h2>Pattern Analysis & Insights</h2>
            <p>Stillform tracks session data and may surface patterns or insights based on your usage history. These insights are observational and educational. They are not clinical assessments, diagnoses, or medical advice. Patterns identified by the app reflect your self-reported data and should not be used as the basis for medical or psychological decisions.</p>

            <h2>Your Data</h2>
            <p>Stillform stores session data, signal profiles, check-ins, and saved reframes with encrypted cloud sync so you can access your data from any device. Your data is encrypted in transit and at rest. You can delete your data at any time from Settings.</p>
            <p>If you subscribe, we collect your email address and payment information through our payment processor (Lemon Squeezy). We do not store credit card numbers.</p>

            <h2>Assumption of Risk</h2>
            <p>By using Stillform, you acknowledge that you use the app at your own risk. Ember Enterprises LLC is not liable for any outcomes resulting from the use of this app, including but not limited to decisions made based on AI-generated content, acupressure techniques, or pattern insights.</p>

            <h2>Contact</h2>
            <p>For questions: emberenterprises@proton.me</p>
            <p>Ember Enterprises LLC · New Jersey, United States</p>
          </section>
        )}

        {/* CRISIS RESOURCES — international hotlines */}
        {screen === "crisis" && (
          <section style={{ maxWidth: 560, margin: "0 auto", padding: "40px 24px 80px", position: "relative", zIndex: 1 }}>
            <button className="intervention-back" onClick={() => setScreen("home")}>← Back</button>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, marginBottom: 8 }}>Crisis Resources</h1>
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
                {country.lines.map((line, j) => (
                  <div key={j} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 16px", marginBottom: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>{line.name}</div>
                        {line.note && <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>{line.note}</div>}
                      </div>
                      <div style={{ fontSize: 15, color: "var(--amber)", fontWeight: 500, whiteSpace: "nowrap" }}>{line.number}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </section>
        )}

        {/* SETTINGS */}
        {screen === "settings" && (
          <section style={{ maxWidth: 480, margin: "0 auto", padding: "48px 24px" }}>
            <button className="intervention-back" onClick={() => setScreen("home")}>← Back</button>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, marginBottom: 32 }}>Settings</h1>

            {/* Language */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 10 }}>Language</div>
              <select
                value={(() => { try { return localStorage.getItem("stillform_lang") || "en"; } catch { return "en"; } })()}
                onChange={e => { try { localStorage.setItem("stillform_lang", e.target.value); } catch {} }}
                style={{
                  width: "100%", background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: 8, padding: "12px 14px", color: "var(--text)", fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif", appearance: "none", cursor: "pointer"
                }}
              >
                <option value="en">English</option>
                <option value="hy" disabled>Հայերեն — Armenian (coming soon)</option>
                <option value="es" disabled>Español (coming soon)</option>
                <option value="fr" disabled>Français (coming soon)</option>
                <option value="de" disabled>Deutsch (coming soon)</option>
                <option value="pt" disabled>Português (coming soon)</option>
                <option value="ja" disabled>日本語 (coming soon)</option>
                <option value="ko" disabled>한국어 (coming soon)</option>
                <option value="zh" disabled>中文 (coming soon)</option>
                <option value="ar" disabled>العربية (coming soon)</option>
                <option value="tr" disabled>Türkçe (coming soon)</option>
              </select>
            </div>

            {/* Breathing Pattern */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 10 }}>Breathing Pattern</div>
              {BREATHING_PATTERNS.map(p => {
                const isSelected = (() => { try { return (localStorage.getItem("stillform_breath_pattern") || "calm") === p.id; } catch { return p.id === "calm"; } })();
                return (
                  <button key={p.id} onClick={() => {
                    try { localStorage.setItem("stillform_breath_pattern", p.id); window.location.reload(); } catch {}
                  }} style={{
                    width: "100%", padding: "12px 16px", textAlign: "left", cursor: "pointer",
                    background: isSelected ? "var(--amber-glow)" : "var(--surface)",
                    border: `1px solid ${isSelected ? "var(--amber-dim)" : "var(--border)"}`,
                    borderRadius: 8, marginBottom: 6, color: "var(--text)",
                    fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s"
                  }}>
                    <div style={{ fontSize: 14, marginBottom: 2 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{p.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Audio */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 10 }}>Audio</div>
              <div style={{
                background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
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
                    window.location.reload();
                  } catch {}
                }} style={{
                  background: (() => { try { return localStorage.getItem("stillform_audio") === "on" ? "var(--amber)" : "var(--border)"; } catch { return "var(--border)"; } })(),
                  border: "none", borderRadius: 12, width: 44, height: 24, cursor: "pointer", position: "relative", transition: "background 0.2s"
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%", background: "white", position: "absolute", top: 3,
                    left: (() => { try { return localStorage.getItem("stillform_audio") === "on" ? 23 : 3; } catch { return 3; } })(),
                    transition: "left 0.2s"
                  }} />
                </button>
              </div>
            </div>

            {/* Display */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 10 }}>Display</div>
              {[
                { key: "stillform_screenlight", label: "Screen-light mode", desc: "Dims screen to near-black during exercises. Audio guides you.", icon: "◐" },
                { key: "stillform_reducedmotion", label: "Reduced motion", desc: "Removes animations. Text and timers only.", icon: "◻" }
              ].map(opt => {
                const isOn = (() => { try { return localStorage.getItem(opt.key) === "on"; } catch { return false; } })();
                return (
                  <div key={opt.key} style={{
                    background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
                    padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center",
                    marginBottom: 8
                  }}>
                    <div>
                      <div style={{ fontSize: 14, color: "var(--text)" }}>{opt.icon} {opt.label}</div>
                      <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>{opt.desc}</div>
                    </div>
                    <button onClick={() => {
                      try { localStorage.setItem(opt.key, isOn ? "off" : "on"); window.location.reload(); } catch {}
                    }} style={{
                      background: isOn ? "var(--amber)" : "var(--border)",
                      border: "none", borderRadius: 12, width: 44, height: 24, cursor: "pointer",
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

            {/* Session Data */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 10 }}>Your Data</div>
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 18px", marginBottom: 8 }}>
                <div style={{ fontSize: 14, color: "var(--text)", marginBottom: 4 }}>Session history</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
                  {(() => { try { return JSON.parse(localStorage.getItem("stillform_sessions") || "[]").length; } catch { return 0; } })()} completed sessions · encrypted cloud sync
                </div>
              </div>
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 18px", marginBottom: 8 }}>
                <div style={{ fontSize: 14, color: "var(--text)", marginBottom: 4 }}>Signal profile</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
                  {(() => { try { const s = JSON.parse(localStorage.getItem("stillform_signal_profile") || "{}"); return Object.keys(s).length > 0 ? "Configured" : "Not set up yet"; } catch { return "Not set up yet"; } })()}
                </div>
              </div>
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 18px", marginBottom: 8 }}>
                <div style={{ fontSize: 14, color: "var(--text)", marginBottom: 4 }}>Journal entries</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
                  {(() => { try { return JSON.parse(localStorage.getItem("stillform_journal") || "[]").length; } catch { return 0; } })()} entries · encrypted cloud sync
                </div>
              </div>
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 18px", marginBottom: 8 }}>
                <div style={{ fontSize: 14, color: "var(--text)", marginBottom: 4 }}>Saved reframes</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
                  {(() => { try { return JSON.parse(localStorage.getItem("stillform_saved_reframes") || "[]").length; } catch { return 0; } })()} saved
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
                    borderRadius: 8, padding: "12px 16px", marginBottom: 4,
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
                    borderRadius: 8, padding: "12px 16px", marginBottom: 4,
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
                  { label: "Export journal entries (PDF)", desc: "Download your full journal" },
                  { label: "Export session history (CSV)", desc: "Your regulation data for personal records or a provider" }
                ].map((item, i) => (
                  <div key={i} style={{
                    background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
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

              {/* Notifications — grayed, needs native */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 8 }}>Notifications</div>
                {[
                  { label: "Daily check-in reminder", desc: "Configurable time" },
                  { label: "Micro-nudges", desc: "Brief composure prompts throughout the day" }
                ].map((item, i) => (
                  <div key={i} style={{
                    background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
                    padding: "12px 16px", marginBottom: 4, opacity: 0.3,
                    display: "flex", justifyContent: "space-between", alignItems: "center"
                  }}>
                    <div>
                      <div style={{ fontSize: 14, color: "var(--text-muted)" }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{item.desc}</div>
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", flexShrink: 0 }}>Native app</div>
                  </div>
                ))}
              </div>

              {/* Wearable — grayed, needs native */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 8 }}>Wearable Integration</div>
                <div style={{
                  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
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
                  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
                  padding: "12px 16px", opacity: 0.4,
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <div>
                    <div style={{ fontSize: 14, color: "var(--text-muted)" }}>Sync across devices</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Access conversations, journal, and progress from any device. Encrypted.</div>
                  </div>
                  <div style={{ fontSize: 10, color: "var(--amber)", letterSpacing: "0.08em", textTransform: "uppercase", flexShrink: 0 }}>Included</div>
                </div>
              </div>
            </div>

            {/* Know Your Body */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 10 }}>Know Your Body</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button onClick={() => startTool(TOOLS.find(t => t.id === "signals"))} style={{
                  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
                  padding: "14px 18px", textAlign: "left", cursor: "pointer", color: "var(--text)", fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif"
                }}>
                  <div style={{ fontWeight: 500, marginBottom: 2 }}>Map your signals</div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)" }}>Where does tension show first? Build your body profile.</div>
                </button>
                <button onClick={() => startTool(TOOLS.find(t => t.id === "checkin"))} style={{
                  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
                  padding: "14px 18px", textAlign: "left", cursor: "pointer", color: "var(--text)", fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif"
                }}>
                  <div style={{ fontWeight: 500, marginBottom: 2 }}>Tension check</div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)" }}>10-second body scan. Are you holding something you haven't noticed?</div>
                </button>
              </div>
            </div>

            {/* More */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 10 }}>More</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button onClick={() => setScreen("privacy")} style={{
                  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
                  padding: "14px 18px", textAlign: "left", cursor: "pointer", color: "var(--text)", fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif"
                }}>
                  Privacy & Disclaimers
                </button>
                <a href="https://tally.so/r/D45ljE" target="_blank" rel="noopener noreferrer" style={{
                  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
                  padding: "14px 18px", textAlign: "left", cursor: "pointer", color: "var(--text)", fontSize: 14,
                  textDecoration: "none", fontFamily: "'DM Sans', sans-serif"
                }}>
                  Give feedback
                </a>
                <a href="mailto:emberenterprises@proton.me" style={{
                  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
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
                  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
                  padding: "14px 18px", textAlign: "left", cursor: "pointer", color: "var(--text)", fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif"
                }}>
                  Replay tutorial
                </button>
              </div>
            </div>

            <div style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", marginTop: 32 }}>
              Stillform · Ember Enterprises LLC · v1.0
            </div>

            {/* BACKUP & DATA — buried at very bottom */}
            <div style={{ marginTop: 40, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10, opacity: 0.6 }}>Data management</div>

              {/* Auto backup */}
              <div style={{
                background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
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
                background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
                padding: "12px 16px", marginBottom: 8, opacity: 0.4,
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Export your data</div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>Download journal, sessions, insights as PDF or CSV</div>
                </div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Coming soon</div>
              </div>

              {/* Delete — small, understated, double confirm */}
              <button onClick={() => {
                if (window.confirm("Are you sure? This will permanently delete ALL your data — sessions, journal, conversations, signal profile, check-ins, and saved reframes. This cannot be undone.")) {
                  const typed = window.prompt("To confirm deletion, type DELETE below:");
                  if (typed === "DELETE") {
                    try {
                      localStorage.removeItem("stillform_sessions");
                      localStorage.removeItem("stillform_signal_profile");
                      localStorage.removeItem("stillform_checkins");
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

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-logo">Stillform</div>
          <div className="footer-links">
            <button onClick={() => setScreen("home")}>Home</button>
            <button onClick={() => { setPathway("calm"); setActiveTool({ ...TOOLS.find(t => t.id === "reframe"), mode: "calm", defaultTab: "journal" }); setScreen("tool"); }}>Journal</button>
            <button onClick={() => setScreen("pricing")}>Pricing</button>
            <button onClick={() => setScreen("settings")}>Settings</button>
            <button onClick={() => setScreen("crisis")}>Crisis Resources</button>
          </div>
          <div className="footer-copy">© 2026 Ember Enterprises LLC</div>
        </footer>
      </div>
    </>
  );
}
