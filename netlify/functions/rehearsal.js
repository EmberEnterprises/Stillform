// Stillform Rehearsal function — Phase 7c (Pre-event Brief v2)
// May 28, 2026
//
// The user has a hard conversation coming up. The Pre-event Brief gives them
// context (Hardware / Risks / Moves / Recovery); Rehearsal goes one step
// further per the Phase 7 spec ("draft + practice 2-3 likely exchanges, not
// just context"): it anticipates a few realistic MOMENTS in the exchange and
// drafts the user's deployable line for each, so they can practice the
// back-and-forth before they're in it.
//
// Why a separate function (not Scripts): Scripts produces ONE verbatim line
// for a single move. Rehearsal produces a short ARC of paired moments
// (their likely line → the user's response), a different output shape and a
// different prompt. Modeled on scripts.js (be4f23d-era) — same CORS, rate
// limit, crisis detection, abort controller, voice rules.
//
// Voice: operator-tier, the user's own register. The "they" lines are
// plausible moments to rehearse, NEVER predictions of fact.

const rateLimits = new Map();
const RATE_LIMIT_PER_MINUTE = 8; // deliberate, like Scripts

const REHEARSAL_ALLOWED_ORIGINS = (() => {
  const defaults = [
    "https://stillformapp.com",
    "https://www.stillformapp.com",
    "https://stillformapp.netlify.app",
    "http://localhost:4173",
    "http://localhost:5173",
    "http://127.0.0.1:4173",
    "http://127.0.0.1:5173",
    "capacitor://localhost",
    "ionic://localhost",
    "https://localhost",
    "http://localhost"
  ];
  const envOrigins = String(process.env.SECURITY_ALLOWED_ORIGINS || process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  return [...new Set([...defaults, ...envOrigins])];
})();

function getRequestOrigin(event) {
  return event?.headers?.origin || event?.headers?.Origin || null;
}

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (REHEARSAL_ALLOWED_ORIGINS.includes(origin)) return true;
  if (/^https?:\/\/localhost:\d+$/i.test(origin)) return true;
  if (/^https?:\/\/127\.0\.0\.1:\d+$/i.test(origin)) return true;
  return false;
}

function createCorsHeaders(event) {
  const origin = getRequestOrigin(event);
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": isAllowedOrigin(origin) && origin ? origin : "https://stillformapp.com",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin"
  };
}

// Crisis detection — same pattern as scripts.js / reframe.js. If the
// situation signals crisis, do NOT rehearse — surface support instead.
const CRISIS_PATTERNS = [
  /\b(suicid|kill myself|end (it|my life|things)|don'?t want to (be alive|live|exist))/i,
  /\b(self.harm|harm myself|hurt myself|cut myself)/i,
  /\b(overdos|take.*pills.*die|take all (my|the) pills)/i,
  /\b(abuse|abusing|abused|domestic violence)\b.*\b(me|my)\b/i,
  /\b(threaten|threatening) (to )?(kill|hurt|harm)\b/i
];

function hasCrisisLanguage(text) {
  if (!text || typeof text !== "string") return false;
  return CRISIS_PATTERNS.some((re) => re.test(text));
}

const REHEARSAL_SYSTEM = `You are inside Stillform's Rehearsal tool. The user has a hard conversation coming up. Your job: help them rehearse it — anticipate 2-3 likely MOMENTS in the exchange, and for each, draft what they could say. Not a full turn-by-turn script. Not advice about communication. Realistic moments + their deployable line for each.

WHAT YOU PRODUCE:
- 2-3 exchanges. Each is a pair: "they" = a realistic thing the other person might open with or push back with; "you" = the user's response to it, verbatim, say-ready.
- "they" lines: plausible and specific to THIS situation — the likely opener, the likely pushback, the deflection. Realistic moves a reasonable counterpart makes, not worst-case catastrophe. These are possibilities to rehearse, NEVER predictions of what will happen.
- "you" lines: the user's own register, operator-tier. Plain, direct, the fewest words that hold the line. No corporate softening, no therapy-speak, no "I feel ___" formulas by default, no reflexive apologies or "just wanted to" softeners.
- When the situation suggests an arc, order the moments that way (open → pushback → close).

WHAT YOU DON'T DO:
- Don't script the whole conversation — 2-3 load-bearing moments only.
- Don't assert the other person's motives or psychology as fact.
- Don't lecture about strategy; write the lines.
- Don't ask the user follow-up questions; work with what you have.

VOICE — operator tier, not therapy: direct, specific, plain. Like a thoughtful person under pressure who has had time to think. The composure is in what they're NOT saying.

CRISIS:
If the situation describes self-harm intent, abuse against the user, threats of violence, or immediate physical danger, do NOT rehearse. Output the crisis JSON shape.

OUTPUT — strict JSON, no markdown:
{
  "exchanges": [ { "they": "their likely line", "you": "your say-ready response" } ],
  "note": "optional 1-sentence read of the arc, or null"
}
CRISIS shape:
{ "exchanges": [], "crisis": true, "note": "What you're describing sounds beyond what rehearsal can hold. Stillform has a Crisis Resources screen in Settings, or call 988 (US Suicide & Crisis Lifeline). The conversation can wait until you're safe." }`;

function validateRehearsalPayload(payload, { isCrisis }) {
  const reasons = [];
  if (!payload || typeof payload !== "object") {
    return { ok: false, reasons: ["payload not object"] };
  }

  if (isCrisis) {
    if (payload.crisis !== true) reasons.push("crisis flag must be true");
    if (!Array.isArray(payload.exchanges) || payload.exchanges.length !== 0) reasons.push("crisis exchanges must be empty");
    if (!payload.note || String(payload.note).trim().length < 12) reasons.push("crisis note missing");
    return { ok: reasons.length === 0, reasons };
  }

  if (!Array.isArray(payload.exchanges)) {
    return { ok: false, reasons: ["exchanges not array"] };
  }
  if (payload.exchanges.length < 1 || payload.exchanges.length > 3) {
    reasons.push("exchanges must be 1-3");
  }
  payload.exchanges.forEach((ex, i) => {
    const they = ex && typeof ex.they === "string" ? ex.they.trim() : "";
    const you = ex && typeof ex.you === "string" ? ex.you.trim() : "";
    if (they.length < 3) reasons.push(`exchange ${i}: 'they' too short`);
    if (you.length < 3) reasons.push(`exchange ${i}: 'you' too short`);
    if (you.length > 700) reasons.push(`exchange ${i}: 'you' too long`);
    if (/^```|^\s*\{/.test(you)) reasons.push(`exchange ${i}: 'you' contains JSON markup`);
  });
  return { ok: reasons.length === 0, reasons };
}

exports.handler = async (event) => {
  const corsHeaders = createCorsHeaders(event);

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }
  const origin = getRequestOrigin(event);
  if (!isAllowedOrigin(origin)) {
    return { statusCode: 403, headers: corsHeaders, body: JSON.stringify({ error: "Origin not allowed" }) };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  // Rate limit (per IP, per minute).
  const ip =
    event.headers?.["x-nf-client-connection-ip"] ||
    event.headers?.["client-ip"] ||
    event.headers?.["x-forwarded-for"] ||
    "unknown";
  const now = Date.now();
  const recent = (rateLimits.get(ip) || []).filter((t) => now - t < 60000);
  if (recent.length >= RATE_LIMIT_PER_MINUTE) {
    return { statusCode: 429, headers: corsHeaders, body: JSON.stringify({ error: "Rate limit. Try again in a minute." }) };
  }
  recent.push(now);
  rateLimits.set(ip, recent);

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const situation = String(body.situation || "").trim().slice(0, 1500);
  const recipient = String(body.recipient || "").trim().slice(0, 200);
  const context = String(body.context || "").trim().slice(0, 600);

  if (!situation || situation.length < 8) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Situation required (at least a sentence)." }) };
  }

  const isCrisis = hasCrisisLanguage(`${recipient} ${situation} ${context}`);

  if (!process.env.OPENAI_API_KEY) {
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: "API key not configured." }) };
  }

  const userMessage = isCrisis
    ? `[Crisis content detected. Output the crisis JSON only.]`
    : `Recipient: ${recipient || "not specified"}\nSituation: ${situation}\nExtra context: ${context || "none"}\n\nRehearse 2-3 likely moments.`;

  const controller = new AbortController();
  const apiTimeout = setTimeout(() => controller.abort(), 20000);

  let aiContent = "";
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` },
      signal: controller.signal,
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 700,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: REHEARSAL_SYSTEM },
          { role: "user", content: userMessage }
        ]
      })
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("Rehearsal API error:", JSON.stringify(data));
      return { statusCode: 502, headers: corsHeaders, body: JSON.stringify({ error: data.error?.message || "Upstream error" }) };
    }
    aiContent = data.choices?.[0]?.message?.content || "";
  } catch (e) {
    return {
      statusCode: 504,
      headers: corsHeaders,
      body: JSON.stringify({ error: e.name === "AbortError" ? "Request timed out" : "Network error" })
    };
  } finally {
    clearTimeout(apiTimeout);
  }

  let parsed = null;
  try {
    parsed = JSON.parse(aiContent);
  } catch {
    return { statusCode: 502, headers: corsHeaders, body: JSON.stringify({ error: "AI returned malformed response. Try again." }) };
  }

  const validation = validateRehearsalPayload(parsed, { isCrisis });
  if (!validation.ok) {
    console.error("Rehearsal validation failed:", validation.reasons, "payload:", JSON.stringify(parsed));
    return { statusCode: 502, headers: corsHeaders, body: JSON.stringify({ error: "Output didn't pass quality check. Try again or rephrase the situation." }) };
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      exchanges: isCrisis ? [] : parsed.exchanges,
      note: parsed.note || null,
      crisis: isCrisis
    })
  };
};
