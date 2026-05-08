// Today's Brief — engagement architecture Engine 2 surface (Build #3, Phase 3a)
// Per STILLFORM_ENGAGEMENT_ARCHITECTURE.md §3.2 lines 121-126:
//   "Today's Brief. Morning artifact summarizing hardware + risks + moves +
//    recovery. Generated at morning check-in from bio-filter + outcome focus
//    + calendar + Trigger Profile + bias profile. Re-readable all day.
//    AI-generated, brand-voice locked."
//
// Per TODAYS_BRIEF_FLOW_AUDIT.md (May 8) §3a default: structured 4-field JSON
// output (hardware / risks / moves / recovery) for display flexibility and
// Build #7 (Pre-event Brief) reuse. §6 open call 2 default applied.
// Per audit §4 science alignment, the four sections operationalize:
//   - Hardware: granular bio label (Barrett constructed emotion theory)
//   - Risks: forecast events named in advance (Heider 1958 / Lazarus 1991)
//   - Moves: implementation intentions (Gollwitzer 1999, "if X then Y")
//   - Recovery: anticipatory downregulation plan (Sheppes & Gross 2011)
//
// Modeled after eod-artifact.js structure (CORS, rate limit, OpenAI gpt-4o,
// abort controller, no fallback on failure per voice rubric).

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

// System prompt — voice rubric same as EOD artifact (prestige-operator,
// declarative, second person, no advice, no platitudes, no therapy-coded
// language). Output: strict JSON with 4 string fields. Each field 1-2
// short sentences max. Lengths kept tight because the brief renders on
// a phone screen and the user reads it before the day starts.
const SYSTEM_PROMPT = `You are Stillform — a composure architecture system. The user just completed their morning check-in. Your job: generate today's brief — a four-section morning compass keyed to their actual state and forecast.

VOICE — non-negotiable:
- Prestige-operator declarative. Second person. Specific to the data given.
- WHOOP / Bloomberg / Amex tone. NOT Headspace / Calm.
- No advice phrasing ("try to," "remember to," "make sure"). State the move flatly.
- No platitudes. No therapy-coded language ("growth," "journey," "honor your feelings," "self-care," "be gentle").
- No questions. No imperatives that sound like commands. State observations and named moves.
- Lead with the experience or the data, not the science label.

OUTPUT — strict JSON with exactly these four keys, each a short string:
{
  "hardware": "...",   // Granular bio label. What state they're in physically. 1 short sentence.
  "risks": "...",      // Named forecast: today's load-bearing events or triggers. 1-2 short sentences.
  "moves": "...",      // Implementation intentions. "If [event/trigger] then [specific move]." 1-2 short sentences.
  "recovery": "..."    // Post-event downregulation plan. What buys back capacity later. 1 short sentence.
}

SECTION GUIDANCE:

HARDWARE — Name the state. Use the data: bio-filter, morning energy, tension areas. If depleted, say depleted. If steady, say steady. If activated, say activated. Be specific to their data, not generic.
  Good: "Depleted. Sleep short, jaw tight."
  Bad: "Today might feel a little harder than usual."

RISKS — Name SPECIFIC forecast pressure. Pull from calendar events (with names if given) and Trigger Profile. If the user has a meeting with [someone] who is in their Trigger Profile, name it directly. If no calendar and no triggers, name the risk type from feel-state alone.
  Good: "2pm with Mike — your Trigger Profile flags it. Pickup at 3:30 against an already short fuse."
  Bad: "Today might bring some challenges."
  If no specific data: "Open day. Watch for the 3pm dip — your usual."

MOVES — Implementation intentions, NAMED specifically. Pair the trigger to the move. The science: pre-committing the move halves the cognitive cost of executing it under load.
  Good: "Before Mike: feet flat, two slow exhales. If pickup runs late: text first, react second."
  Bad: "Try to stay calm during meetings."
  If no specific risks: "Quick Reset between transitions. Cyclic Sigh after the 3pm dip if you feel it building."

RECOVERY — One specific downregulation move tied to a real moment in the day. Buys capacity back.
  Good: "Ten minutes alone after the kid is settled."
  Bad: "Practice self-care tonight."
  If thin data: "Quick Reset before bed."

THIN DATA RULE: If the user has no calendar consent, no Trigger Profile, no recent practice — name that honestly. "Open day, no flagged triggers" is fine. Generate the brief anyway, just don't fabricate specifics.

SAFETY: If the user's data shows distress signals (extreme depletion, body areas with pain, repeated negative state shifts), the brief should be GENTLE in pace but still operator-tier. Do not switch to wellness-app voice. Do not add disclaimers.

NEVER DO:
- "Today might be a good day to..." (advice)
- "Remember to be patient with yourself." (platitude)
- "Honor your body's needs." (therapy-coded)
- "You've got this!" (cheerleading)
- Any field longer than 30 words
- Any output that is not valid JSON with the four keys

Return ONLY the JSON object. No preamble, no code fence, no commentary.`;

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

  // Rate limit — 5 per IP per minute. Today's Brief fires once per day per
  // user under normal usage; same generous cap as eod-artifact protects
  // against runaway loops without tripping legitimate retries.
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

  // Input validation — bound every field. Today's Brief consumes more inputs
  // than EOD artifact, so validation surface is wider. Each input is sliced
  // / clamped to prevent oversize payloads being relayed to OpenAI.
  const morningEnergy = String(payload.morningEnergy || "").slice(0, 32);
  const morningMood = String(payload.morningMood || "").slice(0, 32);
  const bioFilter = Array.isArray(payload.bioFilter)
    ? payload.bioFilter.slice(0, 6).map(b => String(b).slice(0, 32))
    : [];
  const tensionAreas = Array.isArray(payload.tensionAreas)
    ? payload.tensionAreas.slice(0, 8).map(a => String(a).slice(0, 32))
    : [];
  const outcomeFocus = String(payload.outcomeFocus || "").slice(0, 200);
  const calendarEvents = Array.isArray(payload.calendarEvents)
    ? payload.calendarEvents.slice(0, 6).map(e => ({
        title: String(e?.title || "").slice(0, 80),
        start: String(e?.start || "").slice(0, 40)
      })).filter(e => e.title)
    : [];
  const calendarSummary = String(payload.calendarSummary || "").slice(0, 400);
  // triggerProfile / biasProfile / signalProfile come pre-formatted from the
  // client (formatTriggerProfileForAI, etc.) — they're already strings.
  const triggerProfile = String(payload.triggerProfile || "").slice(0, 600);
  const biasProfile = String(payload.biasProfile || "").slice(0, 400);
  const signalProfile = String(payload.signalProfile || "").slice(0, 400);
  const stageName = String(payload.stageName || "").slice(0, 64);
  const stageId = Number.isFinite(payload.stageId) ? Math.max(1, Math.min(5, payload.stageId)) : null;
  const recentSessionsCount = Number.isFinite(payload.recentSessionsCount)
    ? Math.max(0, Math.min(99, payload.recentSessionsCount))
    : 0;
  const recentSessionDays = Number.isFinite(payload.recentSessionDays)
    ? Math.max(0, Math.min(30, payload.recentSessionDays))
    : 0;
  const yesterdayEodArtifact = String(payload.yesterdayEodArtifact || "").slice(0, 400);
  const yesterdayComposure = String(payload.yesterdayComposure || "").slice(0, 32);

  // Construct the user-message context block. Same posture as eod-artifact:
  // give the AI a structured snapshot to draw from, not a question.
  const contextLines = [];
  contextLines.push(`Date: ${new Date().toISOString().slice(0, 10)}`);
  if (morningEnergy) contextLines.push(`Morning energy: ${morningEnergy}`);
  if (morningMood) contextLines.push(`Morning mood: ${morningMood}`);
  if (bioFilter.length) contextLines.push(`Bio-filter (current physical state): ${bioFilter.join(", ")}`);
  if (tensionAreas.length) contextLines.push(`Tension areas reported this morning: ${tensionAreas.join(", ")}`);
  if (outcomeFocus) contextLines.push(`Today's outcome focus (what they want to be true today): ${outcomeFocus}`);
  if (calendarEvents.length) {
    const eventsText = calendarEvents.map(e => `${e.start ? e.start + " " : ""}${e.title}`).join("; ");
    contextLines.push(`Today's calendar events: ${eventsText}`);
  } else if (calendarSummary) {
    contextLines.push(`Today's calendar summary: ${calendarSummary}`);
  }
  if (triggerProfile) contextLines.push(`Trigger Profile (specific people/contexts/moments the user has named as load-bearing): ${triggerProfile}`);
  if (biasProfile) contextLines.push(`Bias Profile (cognitive distortions the user is working with): ${biasProfile}`);
  if (signalProfile) contextLines.push(`Signal Profile (where in the body intensity activates first for them): ${signalProfile}`);
  if (stageId && stageName) contextLines.push(`Engagement stage: ${stageId} of 5 (${stageName})`);
  if (recentSessionsCount > 0) contextLines.push(`Practice in last ${recentSessionDays || 7} days: ${recentSessionsCount} session(s)`);
  if (yesterdayComposure) contextLines.push(`Yesterday's EOD composure rating: ${yesterdayComposure}`);
  if (yesterdayEodArtifact) contextLines.push(`Yesterday's EOD takeaway: "${yesterdayEodArtifact}"`);

  const userMessage = `Generate today's brief from this data:\n\n${contextLines.join("\n")}`;

  // OpenAI API call — gpt-4o, response_format: json_object guarantees the
  // four-key JSON contract. max_tokens sized for ~120 words across all
  // four fields plus JSON structural tokens (~250 token headroom).
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
        max_tokens: 400,
        temperature: 0.6,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage }
        ]
      })
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("Today's Brief API error:", JSON.stringify(data));
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

    // Parse the JSON object the model returned. response_format: json_object
    // guarantees valid JSON but does NOT guarantee the schema — validate
    // each of the four fields exists and is a non-empty string.
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: "Invalid JSON from generator" })
      };
    }

    const fields = ["hardware", "risks", "moves", "recovery"];
    const brief = {};
    for (const field of fields) {
      const value = String(parsed[field] || "").trim();
      if (!value) {
        return {
          statusCode: 502,
          headers,
          body: JSON.stringify({ error: `Missing ${field} field` })
        };
      }
      // Length cap per field — defense in depth against the model going long.
      // 280 chars per field × 4 = 1120 char ceiling for the whole brief.
      brief[field] = value.length > 280 ? value.slice(0, 280).trim() : value;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ...brief,
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
    console.error("Today's Brief unexpected error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Generation failed" })
    };
  } finally {
    clearTimeout(apiTimeout);
  }
};
