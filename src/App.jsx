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
    --text-dim: #8a8680;
    --text-muted: #4a4845;
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
    font-family: 'Cormorant Garamond', serif;
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
    font-size: 16px;
    line-height: 1.7;
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
    background: radial-gradient(circle, rgba(201,147,58,0.15) 0%, rgba(201,147,58,0.04) 60%, transparent 100%);
    border: 1px solid var(--amber-dim);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 4s ease-in-out;
  }

  .breath-circle.expand { transform: scale(1.3); }
  .breath-circle.hold { transform: scale(1.3); }
  .breath-circle.contract { transform: scale(1); }

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
    font-size: 13px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: 8px;
    text-align: center;
  }

  .breath-instruction {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px;
    font-style: italic;
    color: var(--amber);
    text-align: center;
    margin-bottom: 32px;
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

  .privacy-date { color: var(--text-muted); font-size: 13px; margin-bottom: 40px; }

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
    color: var(--text-muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    cursor: pointer;
    transition: color 0.2s;
    letter-spacing: 0.06em;
  }

  .footer-links button:hover { color: var(--amber); }

  .footer-copy { color: var(--text-muted); font-size: 12px; }

  /* DISCLAIMER */
  .disclaimer {
    background: var(--surface);
    border: 1px solid var(--border);
    border-left: 3px solid var(--amber-dim);
    border-radius: 6px;
    padding: 14px 18px;
    font-size: 12px;
    color: var(--text-muted);
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
`;

const TOOLS = [
  {
    id: "breathe",
    icon: "◎",
    name: "Breathe & Ground",
    desc: "Regulate your nervous system, then anchor to the present moment.",
    time: "8 min"
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
    desc: "Talk through what's happening. AI applies CBT to exactly what you say — stay as long as you need.",
    time: "Open"
  }
];

function BreatheGroundTool({ onComplete }) {
  const [phase, setPhase] = useState("breathe"); // breathe | ground
  
  // --- BREATHE ---
  const phases = [
    { name: "Inhale", duration: 4, instruction: "Breathe in slowly..." },
    { name: "Hold", duration: 4, instruction: "Hold gently..." },
    { name: "Exhale", duration: 6, instruction: "Release completely..." },
    { name: "Hold", duration: 2, instruction: "Rest here..." }
  ];
  const totalCycles = 4;
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [count, setCount] = useState(phases[0].duration);
  const [cycle, setCycle] = useState(1);
  const [running, setRunning] = useState(false);
  const [breatheDone, setBreatheDone] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (count === 0) {
      const next = (phaseIdx + 1) % phases.length;
      if (next === 0) {
        if (cycle >= totalCycles) { setBreatheDone(true); setRunning(false); return; }
        setCycle(c => c + 1);
      }
      setPhaseIdx(next);
      setCount(phases[next].duration);
    } else {
      const t = setTimeout(() => setCount(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [count, running, phaseIdx, cycle]);

  // --- GROUND ---
  const steps = [
    { num: 5, label: "Five things you can see", prompt: "Look around. Name 5 things visible to you right now." },
    { num: 4, label: "Four things you can touch", prompt: "What 4 surfaces or textures can you feel right now?" },
    { num: 3, label: "Three things you can hear", prompt: "Listen. What 3 sounds do you notice?" },
    { num: 2, label: "Two things you can smell", prompt: "What 2 scents can you identify, however faint?" },
    { num: 1, label: "One thing you can taste", prompt: "What do you taste, even subtly?" }
  ];
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [groundDone, setGroundDone] = useState(false);

  const handleGroundNext = () => {
    if (current < steps.length - 1) setCurrent(c => c + 1);
    else setGroundDone(true);
  };

  const circleClass = `breath-circle ${phaseIdx === 0 ? "expand" : phaseIdx === 2 ? "contract" : "hold"}`;

  if (groundDone) return (
    <div className="complete">
      <div className="complete-icon">✓</div>
      <h2>You're here.</h2>
      <p>Your nervous system has slowed. Your senses have anchored you. You are present.</p>
      <button className="btn btn-primary" onClick={onComplete}>Return to tools</button>
    </div>
  );

  if (phase === "breathe") return (
    <div>
      <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 24, textAlign: "center" }}>
        Step 1 of 2 — Breathing
      </div>
      {!breatheDone ? (
        <div className="breath-container">
          <div className="breath-circle-wrap">
            <div className={circleClass}>
              <div className="breath-inner">
                <span className="breath-count">{count}</span>
              </div>
            </div>
          </div>
          <div className="breath-phase">{phases[phaseIdx].name} · Cycle {cycle} of {totalCycles}</div>
          <div className="breath-instruction">{phases[phaseIdx].instruction}</div>
          {!running ? (
            <button className="btn btn-primary" onClick={() => setRunning(true)}>Begin</button>
          ) : (
            <button className="btn btn-ghost" onClick={() => setRunning(false)}>Pause</button>
          )}
        </div>
      ) : (
        <div className="complete">
          <div className="complete-icon">✓</div>
          <h2>Breathing complete.</h2>
          <p>Your nervous system is slowing. Now let's anchor you to the present moment.</p>
          <button className="btn btn-primary" onClick={() => setPhase("ground")}>Continue to Grounding →</button>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 24 }}>
        Step 2 of 2 — Grounding
      </div>
      <div className="grounding-steps">
        {steps.map((step, i) => (
          <div key={i} className={`ground-step ${i === current ? "active" : i < current ? "done" : ""}`}>
            <div className="ground-step-header">
              <div className="ground-number">{i < current ? "✓" : step.num}</div>
              <div className="ground-label">{step.label}</div>
            </div>
            <div className="ground-desc">{step.prompt}</div>
            {i === current && (
              <>
                <textarea
                  className="ground-input"
                  rows={2}
                  placeholder="Write what you notice..."
                  value={answers[i] || ""}
                  onChange={e => setAnswers(a => ({ ...a, [i]: e.target.value }))}
                />
                <div style={{ paddingLeft: 42, marginTop: 12 }}>
                  <button className="btn btn-primary" onClick={handleGroundNext} style={{ fontSize: 13 }}>
                    {i < steps.length - 1 ? "Continue →" : "Complete"}
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function BodyScanTool({ onComplete }) {
  const areas = [
    {
      name: "Jaw & Face",
      prompt: "Unclench your jaw. Let your tongue rest. Soften your eyes.",
      point: "GV24.5 — Third Eye Point",
      pointLocation: "Place two fingers between your eyebrows, just above the bridge of your nose.",
      pointInstruction: "Apply firm, steady pressure. Close your eyes. Hold.",
      holdSeconds: 60,
      benefit: "Calms racing thoughts and reduces tension headaches."
    },
    {
      name: "Shoulders & Neck",
      prompt: "Notice if your shoulders are raised. Let them drop completely.",
      point: "GB21 — Shoulder Well",
      pointLocation: "Find the highest point of your shoulder muscle, halfway between your neck and the edge of your shoulder.",
      pointInstruction: "Press firmly with your thumb or two fingers. You may feel a tender ache — that's the point. Hold.",
      holdSeconds: 45,
      benefit: "Releases shoulder and neck tension. A primary stress relief point."
    },
    {
      name: "Chest & Breath",
      prompt: "Is your breath shallow? Take one slow, full breath down to your belly.",
      point: "CV17 — Sea of Tranquility",
      pointLocation: "Find the center of your sternum (breastbone), level with your heart. Place your flat palm here.",
      pointInstruction: "Apply gentle but firm pressure with your palm. Breathe into it. Hold.",
      holdSeconds: 60,
      benefit: "Eases emotional distress and regulates the breath."
    },
    {
      name: "Hands & Arms",
      prompt: "Are your hands gripping anything? Open them fully. Let your arms go heavy.",
      point: "LI4 — Union Valley",
      pointLocation: "Find the webbing between your thumb and index finger. Pinch the highest point of the muscle there.",
      pointInstruction: "Squeeze firmly — this point is often tender. Switch hands halfway. Hold.",
      holdSeconds: 45,
      benefit: "One of the most powerful acupressure points for stress, anxiety, and tension."
    },
    {
      name: "Gut & Core",
      prompt: "Scan your stomach and core. Notice tightness without trying to fix it.",
      point: "PC6 — Inner Gate",
      pointLocation: "Turn your wrist palm-up. Measure three finger-widths down from your wrist crease, between the two tendons.",
      pointInstruction: "Press firmly with your thumb. Switch wrists halfway. Hold.",
      holdSeconds: 60,
      benefit: "Relieves anxiety, nausea, and racing heart. Directly calms the nervous system."
    },
    {
      name: "Legs & Feet",
      prompt: "Feel the full weight of your legs. Press your feet flat into the floor.",
      point: "ST36 — Leg Three Miles",
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
    if (currentArea < areas.length - 1) setCurrentArea(a => a + 1);
    else setDone(true);
  };

  const area = areas[currentArea];
  const holdTarget = area.holdSeconds;
  const holdProgress = Math.min((holdCount / holdTarget) * 100, 100);

  if (done) return (
    <div className="complete">
      <div className="complete-icon">✓</div>
      <h2>Scan complete.</h2>
      <p>You've moved awareness and pressure through your body. Notice what has shifted.</p>
      <button className="btn btn-primary" onClick={onComplete}>Return to tools</button>
    </div>
  );

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
              <div style={{ marginTop: 16, marginBottom: 8, fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.08em" }}>TENSION LEVEL</div>
              <div className="tension-bar">
                {[1,2,3,4,5].map(n => (
                  <div key={n} className={`tension-dot ${(tension[i] || 0) >= n ? "active" : ""}`}
                    onClick={(e) => { e.stopPropagation(); setTension(t => ({ ...t, [i]: n })); }} />
                ))}
              </div>
              <div style={{ marginTop: 20 }}>
                <button className="btn btn-primary" style={{ fontSize: 13 }}
                  onClick={(e) => { e.stopPropagation(); setPhase("pressure"); }}>
                  Apply pressure point →
                </button>
              </div>
            </>
          )}
          {i === currentArea && phase === "pressure" && (
            <>
              <div style={{ background: "var(--amber-glow)", border: "1px solid var(--amber-dim)", borderRadius: 8, padding: "16px 20px", marginTop: 16 }}>
                <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 8 }}>{a.point}</div>
                <div style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.7, marginBottom: 10 }}><strong>Find it:</strong> {a.pointLocation}</div>
                <div style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.7, marginBottom: 10 }}><strong>Apply:</strong> {a.pointInstruction}</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", fontStyle: "italic" }}>{a.benefit}</div>
              </div>
              {!holding && holdCount === 0 && (
                <button className="btn btn-primary" style={{ marginTop: 16, fontSize: 13 }}
                  onClick={(e) => { e.stopPropagation(); startHold(); }}>
                  Start {holdTarget}s hold
                </button>
              )}
              {(holding || holdCount > 0) && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, letterSpacing: "0.08em" }}>
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

function ReframeTool({ onComplete }) {
  const STORAGE_KEY = "stillform_reframe_session";

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

  // Persist every message change to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

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
      const timeout = setTimeout(() => controller.abort(), 30000);

      const response = await fetch("/.netlify/functions/reframe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          input: textToSend,
          history: prevMessages.map(m => ({
            role: m.role === "ai" ? "assistant" : "user",
            content: m.text
          }))
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

  return (
    <div>
      <div className="disclaimer">
        This is not therapy. It is an AI-powered CBT tool. If you are in crisis, please contact your local emergency services or a mental health professional.
      </div>
      <div className="ai-container">
        <div className="ai-messages">
          {messages.length === 0 && (
            <div style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.7, padding: "8px 0" }}>
              Say what's happening. Don't explain it — just say it. The AI will read exactly what you wrote and respond with it directly.
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              <div className="message-avatar">{msg.role === "ai" ? "✦" : "◎"}</div>
              <div className="message-bubble">
                {msg.distortion && (
                  <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 8 }}>
                    {msg.distortion}
                  </div>
                )}
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message ai">
              <div className="message-avatar">✦</div>
              <div className="message-bubble" style={{ color: "var(--text-muted)" }}>
                <span style={{ letterSpacing: "0.2em" }}>···</span>
              </div>
            </div>
          )}
          {error && (
            <div style={{
              background: "rgba(200,0,50,0.08)",
              border: "1px solid rgba(200,0,50,0.25)",
              borderRadius: 10,
              padding: "14px 16px",
              margin: "8px 0"
            }}>
              <div style={{ fontSize: 14, color: "#e05", marginBottom: 12, lineHeight: 1.5 }}>{error}</div>
              <button
                className="btn btn-primary"
                style={{ fontSize: 14, padding: "10px 20px", marginBottom: 16 }}
                onClick={() => handleSend(lastInput)}
              >
                ↺ Retry
              </button>
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
                  While you wait, try one of these
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    className="btn btn-ghost"
                    style={{ fontSize: 13 }}
                    onClick={() => onComplete("breathe")}
                  >
                    ◎ Breathe & Ground
                  </button>
                  <button
                    className="btn btn-ghost"
                    style={{ fontSize: 13 }}
                    onClick={() => onComplete("scan")}
                  >
                    ◉ Body Scan
                  </button>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="ai-input-row">
          <input
            className="ai-input"
            placeholder="Say what's happening..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
          />
          <button className="btn-send" onClick={() => handleSend()} disabled={!input.trim() || loading}>
            Send
          </button>
        </div>
      </div>
      {messages.length > 0 && (
        <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {messages.length > 2 && (
            <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => {
              try { localStorage.removeItem(STORAGE_KEY); } catch {}
              onComplete();
            }}>
              I'm done for now
            </button>
          )}
          <button className="btn btn-ghost" style={{ fontSize: 13, color: "var(--text-muted)" }} onClick={() => {
            try { localStorage.removeItem(STORAGE_KEY); } catch {}
            setMessages([]);
          }}>
            Start fresh
          </button>
        </div>
      )}
    </div>
  );
}

export default function Stillform() {
  const [screen, setScreen] = useState("home");
  const [activeTool, setActiveTool] = useState(null);

  const startTool = (tool) => {
    setActiveTool(tool);
    setScreen("tool");
  };

  const renderTool = () => {
    const props = { onComplete: (redirectTo) => {
      if (redirectTo) {
        const tool = TOOLS.find(t => t.id === redirectTo);
        if (tool) { startTool(tool); return; }
      }
      setScreen("tools");
    }};
    switch (activeTool?.id) {
      case "breathe": return <BreatheGroundTool {...props} />;
      case "scan": return <BodyScanTool {...props} />;
      case "reframe": return <ReframeTool {...props} />;
      default: return null;
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo" style={{ cursor: "pointer" }} onClick={() => setScreen("home")}>
            Still<span>form</span>
          </div>
          <div className="nav-actions">
            {screen !== "tools" && (
              <button className="btn btn-ghost" onClick={() => setScreen("tools")}>
                Open App
              </button>
            )}
            <button className="btn btn-primary" onClick={() => setScreen("pricing")}>
              Start Free Trial
            </button>
          </div>
        </nav>

        {/* HOME */}
        {screen === "home" && (
          <section className="home">
            <div className="home-tag">
              ◎ Composure Tool
            </div>
            <h1 className="home-title">
              For when you<br />
              can't <em>think straight.</em>
            </h1>
            <p className="home-sub">
              Stillform delivers fast, structured interventions for moments of stress, panic, and overwhelm. Not meditation. Not therapy. Stabilization — right now.
            </p>
            <div className="home-cta">
              <button className="btn btn-primary" style={{ padding: "14px 32px", fontSize: "15px" }} onClick={() => setScreen("tools")}>
                Begin →
              </button>
              <button className="btn btn-ghost" style={{ padding: "14px 32px", fontSize: "15px" }} onClick={() => setScreen("pricing")}>
                Pricing
              </button>
            </div>
            <div className="home-features">
              {[
                { icon: "◎", title: "Breathe & Ground", desc: "Structured breathing to slow your nervous system, followed by sensory anchoring to bring you back to the present." },
                { icon: "◉", title: "Body Scan", desc: "Directed awareness through six body areas with targeted acupressure points and timed holds for real tension release." },
                { icon: "✦", title: "Reframe", desc: "AI reads exactly what you wrote and applies the specific CBT technique for what you're experiencing. Stay as long as you need." },
              ].map((f, i) => (
                <div key={i} className="feature-card">
                  <div className="feature-icon">{f.icon}</div>
                  <div className="feature-title">{f.title}</div>
                  <div className="feature-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TOOLS */}
        {screen === "tools" && (
          <section className="tools">
            <div className="tools-header">
              <h2>What do you need right now?</h2>
              <p>Choose a tool. Each one takes less than 6 minutes.</p>
            </div>
            <div className="disclaimer">
              Stillform is not a substitute for professional mental health treatment. If you are in crisis, please contact your local emergency services or a mental health professional.
            </div>
            <div className="tools-grid">
              {TOOLS.map(tool => (
                <div key={tool.id} className="tool-card" onClick={() => startTool(tool)}>
                  <div className="tool-icon">{tool.icon}</div>
                  <div className="tool-name">{tool.name}</div>
                  <div className="tool-desc">{tool.desc}</div>
                  <span className="tool-time">{tool.time}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ACTIVE TOOL */}
        {screen === "tool" && activeTool && (
          <section className="intervention">
            <button className="intervention-back" onClick={() => setScreen("tools")}>
              ← Back to tools
            </button>
            <div className="intervention-header">
              <h2>{activeTool.icon} {activeTool.name}</h2>
              <p>{activeTool.desc}</p>
            </div>
            {renderTool()}
          </section>
        )}

        {/* PRICING */}
        {screen === "pricing" && (
          <section className="pricing">
            <div className="pricing-header">
              <h2>Start free. Stay only if it works.</h2>
              <p>7-day free trial. No credit card required. Cancel any time.</p>
            </div>
            <div className="pricing-cards">
              <div className="pricing-card">
                <div className="pricing-period">Monthly</div>
                <div className="pricing-price"><sup>$</sup>9<span style={{ fontSize: 28 }}>.99</span></div>
                <div className="pricing-save">per month</div>
                <ul className="pricing-features">
                  <li>All 5 composure tools</li>
                  <li>Unlimited sessions</li>
                  <li>AI Consult included</li>
                  <li>7-day free trial</li>
                </ul>
                <button className="btn btn-secondary" style={{ width: "100%" }}>
                  Start free trial →
                </button>
              </div>
              <div className="pricing-card featured">
                <div className="pricing-badge">Best Value</div>
                <div className="pricing-period">Annual</div>
                <div className="pricing-price"><sup>$</sup>89<span style={{ fontSize: 28 }}>.99</span></div>
                <div className="pricing-save">$7.50/mo · Save 25%</div>
                <ul className="pricing-features">
                  <li>All 5 composure tools</li>
                  <li>Unlimited sessions</li>
                  <li>AI Consult included</li>
                  <li>7-day free trial</li>
                </ul>
                <button className="btn btn-primary" style={{ width: "100%" }}>
                  Start free trial →
                </button>
              </div>
            </div>
            <p style={{ textAlign: "center", marginTop: 32, fontSize: 13, color: "var(--text-muted)" }}>
              Stillform is not medical treatment. It is a composure tool. By subscribing, you agree to our <button onClick={() => setScreen("privacy")} style={{ background: "none", border: "none", color: "var(--amber)", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>Privacy Policy</button>.
            </p>
          </section>
        )}

        {/* PRIVACY */}
        {screen === "privacy" && (
          <section className="privacy">
            <button className="intervention-back" onClick={() => setScreen("home")}>← Back</button>
            <h1>Privacy Policy</h1>
            <div className="privacy-date">Effective March 2026 · Ember Enterprises LLC</div>

            <h2>What We Collect</h2>
            <p>Stillform stores all session data locally on your device. We do not collect, store, or transmit your personal session data to our servers. What you type stays on your device.</p>
            <p>If you subscribe, we collect your email address and payment information through our payment processor (Lemon Squeezy). We do not store credit card numbers.</p>

            <h2>AI Consult</h2>
            <p>The AI Consult feature sends text you enter to Anthropic's Claude API to generate responses. Text entered into AI Consult is processed by Anthropic's servers in accordance with <a href="https://www.anthropic.com/privacy" style={{ color: "var(--amber)" }}>Anthropic's privacy policy</a>. Do not enter sensitive personal or medical information into AI Consult.</p>

            <h2>Medical Disclaimer</h2>
            <p>Stillform is not medical treatment, therapy, or a crisis intervention service. It is a composure tool. If you are experiencing a mental health crisis, please contact your local emergency services or a mental health professional.</p>

            <h2>Contact</h2>
            <p>For privacy questions: emberenterprises@proton.me</p>
            <p>Ember Enterprises LLC · New Jersey, United States</p>
          </section>
        )}

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-logo">Stillform</div>
          <div className="footer-links">
            <button onClick={() => setScreen("home")}>Home</button>
            <button onClick={() => setScreen("tools")}>Open App</button>
            <button onClick={() => setScreen("pricing")}>Pricing</button>
            <button onClick={() => setScreen("privacy")}>Privacy</button>
          </div>
          <div className="footer-copy">© 2026 Ember Enterprises LLC</div>
        </footer>
      </div>
    </>
  );
}
