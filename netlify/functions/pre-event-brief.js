// Pre-event Brief — engagement architecture Engine 2 surface (Build #7, Phase 7a)
// Per STILLFORM_ENGAGEMENT_ARCHITECTURE.md §3.2 lines 128-130 verbatim:
//   "Same shape as Today's Brief, scoped to a specific calendar trigger.
//    Fires 30 minutes before. User has it on their phone walking into the room."
//
// Per PRE_EVENT_BRIEF_FLOW_AUDIT.md (May 8) §3a default + §6 call 1 default
// (Option A — on-demand at notification tap; same fire-and-forget
// operational pattern Today's Brief established).
//
// Per audit §4 science alignment, the four sections operationalize:
//   - Hardware: granular bio label (Barrett constructed emotion theory)
//   - Risks: this single event named in advance (Heider 1958 / Lazarus 1991)
//   - Moves: implementation intentions FOR THIS EVENT (Gollwitzer 1999)
//   - Recovery: anticipatory downregulation FROM this event (Sheppes & Gross 2011)
//
// Modeled after todays-brief.js (be4f23d) — same CORS, rate limit, abort
// controller, no fallback on failure per voice rubric. Differences:
//   - Input scoped to ONE event (title, start, optional description)
//   - System prompt names that single event in every section
//   - Rate limit 10/min (vs 5/min) — user can plausibly have multiple
//     flagged events per day
//   - Output schema same 4-key JSON, same per-section 280-char clamp

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

// System prompt — voice rubric matches todays-brief.js / eod-artifact.js.
// Output: strict JSON with same 4 keys (hardware/risks/moves/recovery).
// Difference from Today's Brief prompt: every section narrows to THIS
// SINGLE EVENT happening in ~30 minutes. Risks doesn't survey the day —
// it names what's about to happen. Moves are if-then for THIS interaction.
// Recovery is downregulation FROM this event, not the whole day.
const SYSTEM_PROMPT = `You are Stillform — a metacognition practice. The user has an event in approximately 30 minutes. Your job: generate the Pre-event Brief — a four-section operator's read for THIS specific event.

VOICE — non-negotiable:
- Prestige-operator declarative. Second person. Specific to the data given.
- WHOOP / Bloomberg / Amex tone. NOT Headspace / Calm.
- No advice phrasing ("try to," "remember to," "make sure"). State the move flatly.
- No platitudes. No therapy-coded language ("growth," "journey," "honor your feelings," "self-care," "be gentle").
- No questions. Observations and named moves only.
- Lead with the experience or the data, not the science label.

OUTPUT — strict JSON with exactly these four keys, each a short string:
{
  "hardware": "...",   // Granular bio label. What state they're in physically RIGHT NOW. 1 short sentence.
  "risks": "...",      // What's load-bearing about THIS specific event. 1-2 short sentences.
  "moves": "...",      // Implementation intentions FOR THIS EVENT. "If [moment in event] then [move]." 1-2 short sentences.
  "recovery": "..."    // Post-event downregulation move. What buys back capacity AFTER this ends. 1 short sentence.
}

SECTION GUIDANCE — all narrowed to this single upcoming event:

HARDWARE — Name the state. Use the data: bio-filter, morning energy, tension areas. If depleted, say depleted. If activated, say activated. Be specific to their data, not generic.
  Good: "Depleted. Jaw already tight."
  Bad: "Today might feel a little harder than usual."

RISKS — Name what's load-bearing about THIS event specifically. Pull from event title, description, and any Trigger Profile match. If the event is with a person named in their Trigger Profile, name it directly. If it's a known type of trigger (1:1 with manager, kid pickup, performance review), name the type.
  Good: "Mike, again. Your Trigger Profile flags this — your fuse runs short on these."
  Good: "Performance review. The kind where the air gets thin and your jaw locks."
  Bad: "This event might be challenging."
  If no specific data: "Standard meeting. Watch for the energy you walk in with."

MOVES — Implementation intentions for THIS event. Pair specific moments to specific moves. Pre-committing the move halves the cognitive cost when the moment hits.
  Good: "Walking in: feet flat, two slow exhales. If they bring up the budget: pause, breathe, ask one clarifying question."
  Bad: "Try to stay calm during the meeting."
  If no specific risks: "Walking in: shoulders back, slow exhale. Listen first, respond second."

RECOVERY — One specific downregulation move tied to AFTER this event ends. Buys capacity back.
  Good: "Five minutes alone before the next thing."
  Bad: "Practice self-care after."
  If thin data: "Quick Reset on the walk back."

THIN DATA RULE: If the user has no calendar context beyond title+start, no Trigger Profile match — name that honestly. Don't fabricate. "Generic event. Walk in slow." is fine.

SAFETY: If the user's data shows distress signals (extreme depletion, body areas with pain, repeated negative state shifts), the brief should be GENTLE in pace but still operator-tier. Do not switch to wellness-app voice. Do not add disclaimers. Do not advise skipping or leaving the event.

NEVER DO:
- "Today might be a good day to..." (advice + scoped wrong — this is event-scoped not day-scoped)
- "Remember to be patient with yourself." (platitude)
- "Honor your body's needs." (therapy-coded)
- "You've got this!" (cheerleading)
- "Maybe consider rescheduling..." (event-cancellation framing — never)
- Any field longer than 30 words
- Any output that is not valid JSON with the four keys

Return ONLY the JSON object. No preamble, no code fence, no commentary.`;

exports.handler = async (event) => {
  const headers = createCorsHeaders(event);
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const origin = getRequestOrigin(event);
  if (origin && !isAllowedOrigin(origin)) {
    return { statusCode: 403, headers, body: JSON.stringify({ error: "Origin not allowed" }) };
  }

  // Rate limit — 10 per IP per minute. Higher than Today's Brief (5/min)
  // because user can plausibly have multiple flagged events in a day.
  const ip = event.headers?.["x-forwarded-for"]?.split(",")[0]?.trim()
    || event.headers?.["client-ip"]
    || "unknown";
  const now = Date.now();
  const windowMs = 60 * 1000;
  const limit = 10;
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

  // Input validation — bound every field. Event details are the new
  // surface vs Today's Brief; everything else parallels.
  const eventTitle = String(payload.eventTitle || "").slice(0, 120);
  const eventStart = String(payload.eventStart || "").slice(0, 40);
  const eventDescription = String(payload.eventDescription || "").slice(0, 400);
  if (!eventTitle) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Missing eventTitle — Pre-event Brief requires the event subject." })
    };
  }
  // State context — same shape as Today's Brief payload
  const morningEnergy = String(payload.morningEnergy || "").slice(0, 32);
  const morningMood = String(payload.morningMood || "").slice(0, 32);
  const bioFilter = Array.isArray(payload.bioFilter)
    ? payload.bioFilter.slice(0, 6).map(b => String(b).slice(0, 32))
    : [];
  const tensionAreas = Array.isArray(payload.tensionAreas)
    ? payload.tensionAreas.slice(0, 8).map(a => String(a).slice(0, 32))
    : [];
  const outcomeFocus = String(payload.outcomeFocus || "").slice(0, 200);
  // Pre-formatted profile strings (signalProfile, biasProfile, triggerProfile)
  // mirror the inline IIFE pattern Reframe uses (line ~10030+) so the AI
  // receives identical context shape across surfaces.
  const triggerProfile = String(payload.triggerProfile || "").slice(0, 600);
  const matchedTriggers = String(payload.matchedTriggers || "").slice(0, 300);
  const biasProfile = String(payload.biasProfile || "").slice(0, 400);
  const userFlaggedPatterns = String(payload.userFlaggedPatterns || "").slice(0, 400);
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

  // Construct the user-message context block. Event details first (the
  // subject), then state (the input), then context (Trigger Profile etc.).
  const contextLines = [];
  contextLines.push(`Event: "${eventTitle}"`);
  if (eventStart) contextLines.push(`Event start: ${eventStart}`);
  if (eventDescription) contextLines.push(`Event description: ${eventDescription}`);
  contextLines.push("");
  contextLines.push("USER STATE RIGHT NOW:");
  if (morningEnergy) contextLines.push(`Morning energy: ${morningEnergy}`);
  if (morningMood) contextLines.push(`Morning mood: ${morningMood}`);
  if (bioFilter.length) contextLines.push(`Bio-filter (current physical state): ${bioFilter.join(", ")}`);
  if (tensionAreas.length) contextLines.push(`Tension areas: ${tensionAreas.join(", ")}`);
  if (outcomeFocus) contextLines.push(`Today's outcome focus: ${outcomeFocus}`);
  if (triggerProfile) {
    contextLines.push("");
    contextLines.push(`Trigger Profile (load-bearing people/contexts/moments — check if event matches): ${triggerProfile}`);
  }
  if (matchedTriggers) {
    contextLines.push(matchedTriggers);
    contextLines.push("(This event references a known trigger. Risks should name this specifically. Moves should be calibrated to the named pattern.)");
  }
  if (biasProfile) contextLines.push(`Bias Profile: ${biasProfile}`);
  if (userFlaggedPatterns) contextLines.push(userFlaggedPatterns);
  if (signalProfile) contextLines.push(`Signal Profile: ${signalProfile}`);
  if (stageId && stageName) contextLines.push(`Engagement stage: ${stageId} of 5 (${stageName})`);
  if (recentSessionsCount > 0) contextLines.push(`Practice in last ${recentSessionDays || 7} days: ${recentSessionsCount} session(s)`);
  if (yesterdayEodArtifact) contextLines.push(`Yesterday's EOD takeaway: "${yesterdayEodArtifact}"`);

  const userMessage = `Generate the Pre-event Brief for this event in ~30 minutes:\n\n${contextLines.join("\n")}`;

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
      console.error("Pre-event Brief API error:", JSON.stringify(data));
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
      // Same 280-char per-field clamp as Today's Brief
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
    console.error("Pre-event Brief unexpected error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Generation failed" })
    };
  } finally {
    clearTimeout(apiTimeout);
  }
};
