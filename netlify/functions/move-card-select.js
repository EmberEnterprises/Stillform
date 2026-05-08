// Move Card Select — engagement architecture Engine 2 Build #8 Phase 8b
// Per MOVE_CARD_FLOW_AUDIT.md §3b. Option B (audit §2 default): AI selects
// from a curated library; never composes novel prompt text. Locked-science
// fidelity is preserved by keeping all prompt content in the client-side
// library (src/move-card/library.js) and asking the AI only to choose an
// id. AI failure → client falls back to deterministic selectByDeterministicRule.
//
// Modeled after eod-artifact.js / todays-brief.js: same CORS allowlist,
// same 5/min per-IP rate limit, same abort controller, same no-fallback
// policy. Smaller token budget — output is one id and a short reason.

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

// System prompt — voice rubric matches eod-artifact / todays-brief. Output
// is structured JSON with two fields: sequenceId (must be one of the IDs
// in the supplied library summary) and reason (one short sentence the AI
// can write to itself for transparency; not currently surfaced to user
// but logged for telemetry).
//
// CRITICAL: The AI must NEVER compose new prompt text. Its job is selection
// only. The library content is locked science (PATTERN_DISRUPTION_SPEC §4.2);
// novel prompts would drift from that.
const SYSTEM_PROMPT = `You are Stillform — a composure architecture system. The user just summoned a Move card — a 30-90 second somatic regulation move available anywhere in their day. Your job is SELECTION, not generation: pick the best-fit sequence from the supplied library based on the user's current state.

CRITICAL RULES:
- You DO NOT compose prompt text. You select an id from the library.
- The id you return MUST EXACTLY match one of the ids supplied in the user message.
- If no sequence is a great fit, prefer the universal fallback (id ending in "-universal-60s" or similar wide-fitness entry).
- If the user has shown sequences recently (recentMoveIds), prefer NOT to repeat them — variety matters for the orienting-response mechanism.

OUTPUT — strict JSON with exactly these two keys:
{
  "sequenceId": "...",   // Must match one of the library entry ids exactly.
  "reason": "..."        // One short phrase describing why this fits. Plain English. Used for internal telemetry, not shown to user.
}

VOICE OF reason:
- Operator-tier. Specific to data given.
- Example: "Activated + jaw signal — vagal release fits."
- Example: "Flat + depleted — gentle titration over activation push."
- Bad: "I think this would be a nice option for them to try right now."

Return ONLY the JSON object. No preamble. No code fence.`;

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

  // Rate limit — 12 per IP per minute. Move card is summonable on demand
  // so a user could plausibly hit it several times in a tight window
  // (different rooms, different moments). 12/min protects against runaway
  // loops while not tripping legitimate burst use.
  const ip = event.headers?.["x-forwarded-for"]?.split(",")[0]?.trim()
    || event.headers?.["client-ip"]
    || "unknown";
  const now = Date.now();
  const windowMs = 60 * 1000;
  const limit = 12;
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

  // Input validation — bound everything. The library summary comes from
  // the client; we don't bundle it server-side because the library is the
  // single source of truth in src/move-card/library.js. Limit to 60
  // entries to bound the prompt size; current library has 10.
  const state = payload.state && typeof payload.state === "object" ? payload.state : {};
  const feelState = String(state.feelState || "").slice(0, 32);
  const bioFilter = Array.isArray(state.bioFilter)
    ? state.bioFilter.slice(0, 6).map(b => String(b).slice(0, 32))
    : [];
  const signalArea = String(state.signalArea || "").slice(0, 32);
  const timeOfDay = String(state.timeOfDay || "").slice(0, 32);
  const recentMoveIds = Array.isArray(payload.recentMoveIds)
    ? payload.recentMoveIds.slice(0, 10).map(id => String(id).slice(0, 80))
    : [];
  const librarySummary = Array.isArray(payload.librarySummary)
    ? payload.librarySummary.slice(0, 60).map(s => ({
        id: String(s?.id || "").slice(0, 80),
        fitness: s?.fitness && typeof s.fitness === "object" ? {
          feelStates: Array.isArray(s.fitness.feelStates) ? s.fitness.feelStates.slice(0, 12).map(f => String(f).slice(0, 32)) : [],
          bioFilters: Array.isArray(s.fitness.bioFilters) ? s.fitness.bioFilters.slice(0, 12).map(f => String(f).slice(0, 32)) : [],
          signalAreas: Array.isArray(s.fitness.signalAreas) ? s.fitness.signalAreas.slice(0, 12).map(f => String(f).slice(0, 32)) : [],
          timeOfDay: String(s.fitness.timeOfDay || "").slice(0, 16)
        } : null,
        durationMs: Number.isFinite(s?.durationMs) ? s.durationMs : null,
        scienceTags: Array.isArray(s?.scienceTags) ? s.scienceTags.slice(0, 6).map(t => String(t).slice(0, 48)) : []
      })).filter(s => s.id)
    : [];

  if (librarySummary.length === 0) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Empty library summary — selection requires at least one candidate." })
    };
  }

  // Build user message. Compact — selection prompt is much smaller than
  // generation prompts. Library summary first (the choices), then state
  // (the input that drives selection), then recent (what to avoid).
  const lines = [];
  lines.push("LIBRARY:");
  for (const s of librarySummary) {
    const dur = s.durationMs ? Math.round(s.durationMs / 1000) + "s" : "?s";
    const sci = s.scienceTags.length ? ` [${s.scienceTags.join(", ")}]` : "";
    const fitFs = s.fitness?.feelStates?.length ? ` feel=${s.fitness.feelStates.join("/")}` : "";
    const fitBio = s.fitness?.bioFilters?.length ? ` bio=${s.fitness.bioFilters.join("/")}` : "";
    const fitSig = s.fitness?.signalAreas?.length ? ` body=${s.fitness.signalAreas.join("/")}` : "";
    lines.push(`- ${s.id} (${dur})${sci}${fitFs}${fitBio}${fitSig}`);
  }
  lines.push("");
  lines.push("STATE:");
  if (feelState) lines.push(`- feel-state: ${feelState}`);
  if (bioFilter.length) lines.push(`- bio-filter: ${bioFilter.join(", ")}`);
  if (signalArea) lines.push(`- signal area: ${signalArea}`);
  if (timeOfDay) lines.push(`- time of day: ${timeOfDay}`);
  if (recentMoveIds.length) {
    lines.push("");
    lines.push(`RECENTLY SHOWN (avoid if alternatives fit): ${recentMoveIds.join(", ")}`);
  }

  const userMessage = lines.join("\n");

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "API key not configured" })
    };
  }

  const controller = new AbortController();
  const apiTimeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 120,
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage }
        ]
      })
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("Move card select API error:", JSON.stringify(data));
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: "Selection failed" })
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
        body: JSON.stringify({ error: "Invalid JSON from selector" })
      };
    }

    const sequenceId = String(parsed?.sequenceId || "").trim();
    if (!sequenceId) {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: "Missing sequenceId" })
      };
    }

    // Validate the AI's choice is actually in the supplied library.
    // Defense against the model hallucinating an id not in the catalog.
    const validIds = new Set(librarySummary.map(s => s.id));
    if (!validIds.has(sequenceId)) {
      console.error("Move card select returned unknown id:", sequenceId);
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: "Selector returned unknown id" })
      };
    }

    const reason = String(parsed?.reason || "").trim().slice(0, 200);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sequenceId,
        reason,
        selectedAt: new Date().toISOString()
      })
    };
  } catch (err) {
    if (err.name === "AbortError") {
      return {
        statusCode: 504,
        headers,
        body: JSON.stringify({ error: "Selection timed out" })
      };
    }
    console.error("Move card select unexpected error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Selection failed" })
    };
  } finally {
    clearTimeout(apiTimeout);
  }
};
