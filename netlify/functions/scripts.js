// Stillform Scripts function — Engagement Architecture Build #9
// May 8, 2026
//
// Per STILLFORM_ENGAGEMENT_ARCHITECTURE.md §3.2 lines 136-138:
//   "Scripts: Extension of State to Statement. Given a situation,
//    generate verbatim language for the hard conversation. Either
//    ready-to-send or starting point."
//
// What this does:
//   The user has a hard conversation to have. They've already
//   regulated their state (or not). Scripts gives them deployable
//   language they could actually send/say. Not advice. Not a
//   reflection prompt. The verbatim message.
//
// Why a separate function (not a reframe.js mode):
//   Reframe is conversational reflection — Wells 2009 MCT,
//   metacognitive observation. Scripts is verbatim message
//   generation — different output shape, different voice rules,
//   different validation. Keeping concerns separate keeps each
//   prompt simpler and each validation layer cleaner.
//
// Voice: prestige-operator. Adult-to-adult under pressure. Not
// therapy-coded ("I feel" formulas by default). Not corporate
// softening. Not wellness. Their language, their situation, their
// move — clarified into one deployable line.

const rateLimits = new Map();
const RATE_LIMIT_PER_MINUTE = 8; // Scripts is more deliberate than Reframe

const SCRIPTS_ALLOWED_ORIGINS = (() => {
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
  if (SCRIPTS_ALLOWED_ORIGINS.includes(origin)) return true;
  if (/^https?:\/\/localhost:\d+$/i.test(origin)) return true;
  if (/^https?:\/\/127\.0\.0\.1:\d+$/i.test(origin)) return true;
  return false;
}

function createCorsHeaders(event) {
  const origin = getRequestOrigin(event);
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin"
  };
  if (origin && isAllowedOrigin(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  } else if (!origin) {
    headers["Access-Control-Allow-Origin"] = "https://stillformapp.com";
  }
  return headers;
}

// Crisis detection — same pattern as reframe.js. If user's situation
// language signals a crisis context, do NOT generate a script —
// surface support resources instead.
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

const SCRIPTS_SYSTEM = `You are inside Stillform's Scripts tool. The user has a hard conversation to have. Your job is to produce a single verbatim message they could send or say — clarified into deployable language. Not advice. Not a reflection prompt. The line itself.

WHAT YOU WRITE:
- One message. Verbatim. Send-ready or close to it.
- Their voice register, not yours. Plain language. No corporate softening, no therapy-speak, no wellness.
- Honor what they actually want to happen. Not "nice" — what would land in this specific situation.
- The fewest words that make the move. Adult-to-adult, under pressure, after they've thought it through.

WHAT YOU DON'T DO:
- Don't lecture them about communication strategy.
- Don't write a paragraph explaining how to say it; write the thing.
- Don't default to "I feel ___" formulas unless the situation specifically calls for emotional self-disclosure.
- Don't add apologies they didn't ask for.
- Don't use "I just wanted to" / "Hope you don't mind" / "No worries if not" softeners by default.
- Don't ask the user follow-up questions; produce the script with what you have.

VOICE — operator tier, not therapy:
- Direct. Specific. Plain.
- Like a thoughtful person under pressure who has had time to think.
- The composure is in what they're NOT saying — not in performative softening.

LENGTH:
- For a text or short message: typically 1-3 sentences.
- For a more formal email: typically 3-6 sentences.
- Default to shorter unless the situation requires more.

CRISIS:
If the user's situation describes self-harm intent, abuse against them, threats of violence, or immediate physical danger, do NOT write a script. Output the crisis JSON shape (see OUTPUT FORMAT) with a redirect message.

OUTPUT FORMAT — strict JSON, no other text:
{
  "script": "the verbatim message, ready to send or near-ready",
  "tone": "3-6 word label for what move this script is making (examples: 'Direct ask, no apology' / 'Boundary, no over-explaining' / 'Hold the line, warm')",
  "note": "optional 1-sentence context on the move, or null"
}

For crisis cases:
{
  "script": null,
  "tone": "crisis-redirect",
  "note": "What you're describing sounds beyond what a script can hold. Stillform has a Crisis Resources screen — open Settings → Crisis Resources, or call 988 (US Suicide & Crisis Lifeline). The script you came for can wait until you're safe."
}`;

function validateScriptPayload(payload, { isCrisis = false } = {}) {
  const reasons = [];
  if (!payload || typeof payload !== "object") {
    return { ok: false, reasons: ["payload not object"] };
  }
  if (isCrisis) {
    // Crisis path — only validate the redirect shape.
    if (payload.script !== null) reasons.push("crisis script must be null");
    if (payload.tone !== "crisis-redirect") reasons.push("crisis tone must be 'crisis-redirect'");
    if (!payload.note || typeof payload.note !== "string") reasons.push("crisis note required");
    return { ok: reasons.length === 0, reasons };
  }
  // Standard path.
  const script = String(payload.script || "").trim();
  if (script.length < 12) reasons.push("script too short");
  if (script.length > 1200) reasons.push("script too long");
  // No JSON leakage in user-facing field.
  if (/^```|json\s*\{|^\s*\{/.test(script)) reasons.push("script contains JSON markup");
  // Voice contract — no banned softeners by default.
  const banned = [
    /\bI just wanted to\b/i,
    /\bHope you don'?t mind\b/i,
    /\bno worries if not\b/i,
    /\bjust a thought\b/i
  ];
  for (const re of banned) {
    if (re.test(script)) reasons.push(`voice contract: ${re.source}`);
  }
  const tone = String(payload.tone || "").trim();
  if (tone.length < 3) reasons.push("tone label missing");
  if (tone.length > 80) reasons.push("tone label too long");
  return { ok: reasons.length === 0, reasons };
}

export async function handler(event) {
  const corsHeaders = createCorsHeaders(event);

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  const origin = getRequestOrigin(event);
  if (origin && !isAllowedOrigin(origin)) {
    return { statusCode: 403, headers: corsHeaders, body: JSON.stringify({ error: "Origin not allowed" }) };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  // Rate limiting per IP
  const ip = event.headers?.["x-forwarded-for"]?.split(",")[0]?.trim() || event.headers?.["client-ip"] || "unknown";
  const now = Date.now();
  const minuteAgo = now - 60_000;
  const recent = (rateLimits.get(ip) || []).filter((t) => t > minuteAgo);
  if (recent.length >= RATE_LIMIT_PER_MINUTE) {
    return {
      statusCode: 429,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Rate limit. Try again in a minute." })
    };
  }
  recent.push(now);
  rateLimits.set(ip, recent);

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const recipient = String(body.recipient || "").trim().slice(0, 200);
  const situation = String(body.situation || "").trim().slice(0, 1500);
  const outcome = String(body.outcome || "").trim().slice(0, 400);
  const channel = ["text", "email", "in-person", "voice"].includes(body.channel) ? body.channel : "text";

  if (!situation || situation.length < 8) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Situation required (at least a sentence)." }) };
  }

  const isCrisis = hasCrisisLanguage(`${recipient} ${situation} ${outcome}`);

  if (!process.env.OPENAI_API_KEY) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "API key not configured." })
    };
  }

  const userMessage = isCrisis
    ? `[Crisis content detected. Output the crisis-redirect JSON only.]`
    : `Channel: ${channel}\nRecipient: ${recipient || "not specified"}\nSituation: ${situation}\nWhat I want to happen: ${outcome || "not specified"}\n\nProduce the script.`;

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
        max_tokens: 500,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SCRIPTS_SYSTEM },
          { role: "user", content: userMessage }
        ]
      })
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("Scripts API error:", JSON.stringify(data));
      return {
        statusCode: 502,
        headers: corsHeaders,
        body: JSON.stringify({ error: data.error?.message || "Upstream error" })
      };
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
    return {
      statusCode: 502,
      headers: corsHeaders,
      body: JSON.stringify({ error: "AI returned malformed response. Try again." })
    };
  }

  const validation = validateScriptPayload(parsed, { isCrisis });
  if (!validation.ok) {
    console.error("Scripts validation failed:", validation.reasons, "payload:", JSON.stringify(parsed));
    return {
      statusCode: 502,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Output didn't pass quality check. Try again or rephrase the situation." })
    };
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      script: parsed.script,
      tone: parsed.tone,
      note: parsed.note || null,
      isCrisis: isCrisis
    })
  };
}
