// EOD Artifact — engagement architecture Engine 2 surface 4 (Build #10)
// Per STILLFORM_ENGAGEMENT_ARCHITECTURE.md §3.2 lines 140-142:
//   "EOD artifact: 2-sentence summary of what the day taught the user,
//    accumulating into a vocabulary of their own life. Distinct from
//    existing EOD reflection — this one is the AI-named takeaway, not
//    the user's freewrite."
//
// Mechanism: single-shot generation from today's data. Voice: prestige-
// operator declarative, second person, specific to the user's day. No
// advice. No "tomorrow." No platitudes. The artifact accumulates over
// time into a vocabulary the user keeps.
//
// Modeled after reframe.js structure (CORS, rate limit, OpenAI gpt-4o)
// but simpler — one-shot, no conversation state, no complex validation.

const rateLimits = new Map();

const ALLOWED_ORIGINS = (() => {
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
  if (ALLOWED_ORIGINS.includes(origin)) return true;
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

// System prompt — voice rubric: prestige-operator, declarative, experience
// first, science as language not authority. Mirrors the established voice
// of Quick Reset card, Move card, Reframe close micro-credits. Two sentences,
// no exceptions. Specific to the data given. No advice. No "tomorrow."
const SYSTEM_PROMPT = `You are Stillform — a composure architecture system grounded in metacognitive therapy (Wells 2009). The user just closed their day. Your job: generate exactly two sentences naming what today taught them.

VOICE — non-negotiable:
- Prestige-operator declarative. Second person. Specific to the data given.
- Lead with the experience or the observation. Not credentials, not science labels.
- Like the rest of Stillform: WHOOP / Bloomberg / Amex tone — not Headspace / Calm.
- No advice. No "tomorrow." No "remember to." No "be gentle with yourself." No "you've got this."
- No platitudes. No therapy-coded language ("growth," "journey," "honor your feelings," "self-care").
- One declarative observation, then one specific implication or pattern. Two sentences total.

STRUCTURE:
- Sentence 1: a specific observation about today, drawn from the data given.
- Sentence 2: the pattern or implication — what today taught them about themselves, their tells, or their capacity. Specific to what they actually did or felt today, not generic.

CONSTRAINTS:
- EXACTLY two sentences. Not three. Not one.
- Maximum ~280 characters total (the artifact accumulates into a vocabulary; brevity matters).
- Second person ("you"), present tense where possible.
- No questions. No imperatives. Observations only.
- If the data is thin (no sessions, no morning data), name that honestly without judgment.

EXAMPLES of the right voice (illustrative):
- "Energy crashed by mid-afternoon despite a steady morning. Today taught you the gap between starting steady and staying steady is where most days break."
- "Three Reframes, all naming the same thing under different framings. The pattern under your patterns is your tell — not the trigger."
- "Stuck → focused twice today, both within ten minutes. Your body knew the move before your head did."
- "No sessions today, and you held composure anyway. That's the goal — using less of the system, not more."

NEVER DO THIS:
- "Today was a journey of self-discovery." (therapy-coded)
- "Tomorrow, try to..." (advice)
- "Be proud of yourself for showing up." (platitude)
- "Remember, healing isn't linear." (therapy-coded)
- "You're doing amazing." (wellness-app voice)

Output: only the two sentences. No preamble, no quotes, no labels, no signoff. Just the two sentences as plain text.`;

exports.handler = async (event) => {
  const headers = createCorsHeaders(event);
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  // Origin enforcement — block requests from unknown origins entirely
  const origin = getRequestOrigin(event);
  if (origin && !isAllowedOrigin(origin)) {
    return { statusCode: 403, headers, body: JSON.stringify({ error: "Origin not allowed" }) };
  }

  // Rate limit — 5 per IP per minute (EOD artifact fires once per day per
  // user normally; 5/min is generous and protects against runaway loops)
  const ip = event.headers?.["x-forwarded-for"]?.split(",")[0]?.trim()
    || event.headers?.["client-ip"]
    || "unknown";
  const now = Date.now();
  const windowMs = 60 * 1000;
  const limit = 5;
  const entry = rateLimits.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + windowMs;
  }
  entry.count += 1;
  rateLimits.set(ip, entry);
  if (entry.count > limit) {
    return {
      statusCode: 429,
      headers,
      body: JSON.stringify({ error: "Rate limit exceeded — try again in a minute." })
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  // Input validation — keep payload bounded. EOD data is small by design.
  const eodEnergy = String(payload.eodEnergy || "").slice(0, 32);
  const eodComposure = String(payload.eodComposure || "").slice(0, 32);
  const eodWord = String(payload.eodWord || "").slice(0, 64);
  const morningEnergy = String(payload.morningEnergy || "").slice(0, 32);
  const sessionsToday = Number.isFinite(payload.sessionsToday) ? Math.max(0, Math.min(50, payload.sessionsToday)) : 0;
  const toolsUsed = Array.isArray(payload.toolsUsed) ? payload.toolsUsed.slice(0, 10).map(t => String(t).slice(0, 32)) : [];
  const feelStatesToday = Array.isArray(payload.feelStatesToday) ? payload.feelStatesToday.slice(0, 10).map(s => String(s).slice(0, 32)) : [];
  const recentShifts = Array.isArray(payload.recentShifts) ? payload.recentShifts.slice(0, 5).map(s => ({
    pre: String(s?.pre || "").slice(0, 32),
    post: String(s?.post || "").slice(0, 32),
    delta: Number.isFinite(s?.delta) ? s.delta : null
  })) : [];
  const patternsCaughtToday = Array.isArray(payload.patternsCaughtToday)
    ? payload.patternsCaughtToday.slice(0, 6).map(p => String(p).slice(0, 64))
    : [];

  // Construct user-message context block from the day's data.
  // The AI gets a structured snapshot it can pull from, not a question.
  const contextLines = [];
  contextLines.push(`Date: ${new Date().toISOString().slice(0, 10)}`);
  if (morningEnergy) contextLines.push(`Morning energy: ${morningEnergy}`);
  if (eodEnergy) contextLines.push(`EOD energy: ${eodEnergy}`);
  if (eodComposure) contextLines.push(`EOD composure: ${eodComposure}`);
  if (eodWord) contextLines.push(`User's word for the day: "${eodWord}"`);
  contextLines.push(`Sessions completed today: ${sessionsToday}`);
  if (toolsUsed.length) contextLines.push(`Tools used today: ${toolsUsed.join(", ")}`);
  if (feelStatesToday.length) contextLines.push(`Feel-states logged today: ${feelStatesToday.join(", ")}`);
  if (recentShifts.length) {
    const shiftsText = recentShifts.map(s => {
      const deltaStr = s.delta !== null ? ` (Δ${s.delta > 0 ? "+" : ""}${s.delta})` : "";
      return `${s.pre} → ${s.post}${deltaStr}`;
    }).join("; ");
    contextLines.push(`Today's state shifts: ${shiftsText}`);
  }
  if (patternsCaughtToday.length) {
    contextLines.push(`Patterns the user caught themselves running today: ${patternsCaughtToday.join(", ")}. This is metacognitive work — credit the catch in the artifact when relevant.`);
  }

  const userMessage = `Generate the two-sentence EOD artifact from this data:\n\n${contextLines.join("\n")}`;

  // OpenAI API call — gpt-4o, low temperature for consistency, max_tokens
  // sized for ~280 chars (~80-90 tokens with overhead headroom)
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "API key not configured" })
    };
  }

  const controller = new AbortController();
  const apiTimeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 150,
        temperature: 0.6,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage }
        ]
      })
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("EOD artifact API error:", JSON.stringify(data));
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: "Generation failed" })
      };
    }
    const raw = String(data.choices?.[0]?.message?.content || "").trim();
    if (!raw) {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: "Empty response" })
      };
    }

    // Light voice/length validation — strip surrounding quotes if model
    // added them, enforce reasonable length cap. Don't over-engineer
    // validation here; the prompt is strong, the surface is forgiving.
    let artifact = raw.replace(/^["'`]|["'`]$/g, "").trim();
    if (artifact.length > 400) artifact = artifact.slice(0, 400).trim();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        artifact,
        generatedAt: new Date().toISOString()
      })
    };
  } catch (err) {
    if (err.name === "AbortError") {
      return {
        statusCode: 504,
        headers,
        body: JSON.stringify({ error: "Generation timed out" })
      };
    }
    console.error("EOD artifact unexpected error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Generation failed" })
    };
  } finally {
    clearTimeout(apiTimeout);
  }
};
