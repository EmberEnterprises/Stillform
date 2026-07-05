// devils-advocate.js — "the other read."
//
// Produces the single strongest good-faith case for the OTHER way of reading a
// belief the user has CHOSEN to test in their Thought Record. This is a
// "consider the opposite" corrective (Lord, Lepper & Preston 1984; Mussweiler,
// Strack & Pfeiffer 2000) — it exists to loosen overconfidence in a distorted
// belief, offered take-it-or-leave-it. The user stays the authority: it never
// re-rates for them, never tells them what to conclude.
//
// SAFETY IS THE POINT, NOT A FEATURE:
//   - It challenges the BELIEF the user chose to test — never the person, never
//     the feeling. The feeling is valid regardless of whether the belief holds.
//   - It REFUSES to argue when the thought is a value, a boundary, grief, an
//     accurate read of a genuinely bad situation, or a need/feeling itself.
//     Those aren't distortions to correct; a counter-case there would invalidate.
//     → arguable:false, no counter-read, an honest one-line note.
//   - Crisis language short-circuits BEFORE the model is ever called.
//
// Mirrors scripts.js scaffolding (CORS allowlist, origin enforcement, per-IP
// rate limit, abort timeout, gpt-4o, strict JSON, no fallback template).

const rateLimits = new Map();
const RATE_LIMIT_PER_MINUTE = 8; // deliberate, like Scripts

const ALLOWED_ORIGINS = (() => {
  const envOrigins = String(process.env.SECURITY_ALLOWED_ORIGINS || process.env.ALLOWED_ORIGINS || "")
    .split(",").map((s) => s.trim()).filter(Boolean);
  return envOrigins.length ? envOrigins : ["https://stillformapp.com"];
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
    Vary: "Origin",
  };
  if (origin && isAllowedOrigin(origin)) headers["Access-Control-Allow-Origin"] = origin;
  else if (!origin) headers["Access-Control-Allow-Origin"] = "https://stillformapp.com";
  return headers;
}

// Crisis detection — same family as scripts.js / reframe.js.
const CRISIS_PATTERNS = [
  /\b(suicid|kill myself|end (it|my life|things)|don'?t want to (be alive|live|exist))/i,
  /\b(self.harm|harm myself|hurt myself|cut myself)/i,
  /\b(overdos|take.*pills.*die|take all (my|the) pills)/i,
  /\b(abuse|abusing|abused|domestic violence)\b.*\b(me|my)\b/i,
  /\b(threaten|threatening) (to )?(kill|hurt|harm)\b/i,
];
function hasCrisisLanguage(text) {
  if (!text || typeof text !== "string") return false;
  return CRISIS_PATTERNS.some((re) => re.test(text));
}

const SYSTEM = `EPISTEMIC DOCTRINE (Arlin — governs every Stillform AI surface; keep in sync, doctrine v1):
The user is never the sole source of truth, and neither are you. They supply the information; you acknowledge it and bring it forth; they are meant to UNDERSTAND it — both, always. Your delivery is SUGGESTIVE, never deterministic: forced interpretation kills receptivity and reads as judgment. Leave the user authority over who they are; help them frame, never rule.
THE CRAFT RULE — firm on the record, soft on the meaning: state their own documented data with total confidence ("your last five Sundays had this shape"); offer every interpretation as theirs to take or correct ("does today feel like that, or different?"). Hedged data kills credibility; asserted interpretation becomes a verdict. Never a verdict.

You are the "other read" inside Stillform's Thought Record. A person is testing one belief of their own, on purpose. Your only job is to offer the single strongest, good-faith case for the OTHER way of reading it — so they can weigh it and decide for themselves. This is a "consider the opposite" corrective, not a debate you are trying to win.

FIRST, decide whether this belief is even one to argue. Set "arguable": false — and give NO counter-read — when the thought is any of these:
- a value or a boundary they hold ("I want to be honest", "I won't be yelled at")
- grief, loss, or mourning
- an accurate read of a genuinely bad situation (real mistreatment, real danger, a real injustice, a real loss)
- a need or a feeling itself ("I feel alone", "I'm exhausted", "I'm scared")
- anything where offering a counter-case would dismiss real pain or a correct perception
In those cases: "arguable": false, "other_read": null, and "note" = ONE honest, plain, warm-but-not-soft sentence naming that this isn't one to argue with (e.g. "That reads as a real boundary, not a distortion — there's no other side worth arguing here."). Do NOT argue anyway. This judgment is the most important thing you do.

WHEN "arguable" is true:
- Give ONE counter-read: the single strongest, most honest case for the other interpretation. 2-4 short sentences. No lists.
- Ground it ONLY in what is in their thought. Invent NO facts about their life.
- Challenge the BELIEF, never the person and never the feeling. The feeling is valid no matter what the belief turns out to be.
- Calm, even, plain. A sharp peer offering a lens — never smug, never "well, actually", never cheerleading, never therapy-speak, never wellness-app. 
- End without a verdict. Never tell them what to conclude or how to re-rate. The read is theirs to weigh.
- "note" may be null, or one short plain line if a caveat genuinely helps.

If you cannot form an honest counter-read from what's given, set "arguable": false and put a one-line request for the thought in their own words in "note".

Output STRICT JSON only, no prose outside it:
{"arguable": true|false, "other_read": "..." | null, "note": "..." | null}`;

export async function handler(event) {
  const corsHeaders = createCorsHeaders(event);
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: corsHeaders, body: "" };

  const origin = getRequestOrigin(event);
  if (origin && !isAllowedOrigin(origin))
    return { statusCode: 403, headers: corsHeaders, body: JSON.stringify({ error: "Origin not allowed" }) };
  if (event.httpMethod !== "POST")
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: "Method not allowed" }) };

  const ip = event.headers?.["x-forwarded-for"]?.split(",")[0]?.trim() || event.headers?.["client-ip"] || "unknown";
  const now = Date.now();
  const recent = (rateLimits.get(ip) || []).filter((t) => t > now - 60_000);
  if (recent.length >= RATE_LIMIT_PER_MINUTE)
    return { statusCode: 429, headers: corsHeaders, body: JSON.stringify({ error: "Rate limit. Try again in a minute." }) };
  recent.push(now);
  rateLimits.set(ip, recent);

  let body;
  try { body = JSON.parse(event.body || "{}"); }
  catch { return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Invalid JSON" }) }; }

  const thought = String(body.thought || "").trim().slice(0, 1000);
  const evidence = String(body.evidence || "").trim().slice(0, 1500);
  if (!thought || thought.length < 4)
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "A thought is required." }) };

  // Crisis short-circuit — never argue with someone in crisis. No model call.
  if (hasCrisisLanguage(`${thought} ${evidence}`)) {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        arguable: false,
        other_read: null,
        note: "This isn't a thought to argue with. If you're carrying something this heavy, the right move is a real person — not a counter-argument.",
        isCrisis: true,
      }),
    };
  }

  if (!process.env.OPENAI_API_KEY)
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: "API key not configured." }) };

  const userMessage = evidence
    ? `The belief I'm testing:\n"${thought}"\n\nMy own evidence so far:\n${evidence}\n\nGive the other read.`
    : `The belief I'm testing:\n"${thought}"\n\nGive the other read.`;

  const controller = new AbortController();
  const apiTimeout = setTimeout(() => controller.abort(), 20000);
  let aiContent = "";
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      signal: controller.signal,
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 300,
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: userMessage },
        ],
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("Devil's advocate API error:", JSON.stringify(data));
      return { statusCode: 502, headers: corsHeaders, body: JSON.stringify({ error: data.error?.message || "Upstream error" }) };
    }
    aiContent = data.choices?.[0]?.message?.content || "";
  } catch (e) {
    return { statusCode: 504, headers: corsHeaders, body: JSON.stringify({ error: e.name === "AbortError" ? "Request timed out" : "Network error" }) };
  } finally {
    clearTimeout(apiTimeout);
  }

  let parsed = null;
  try { parsed = JSON.parse(aiContent); }
  catch { return { statusCode: 502, headers: corsHeaders, body: JSON.stringify({ error: "AI returned malformed response. Try again." }) }; }

  // Validate + clamp. Fail closed: anything malformed becomes a safe not-arguable.
  const arguable = parsed.arguable === true;
  let otherRead = arguable && typeof parsed.other_read === "string" ? parsed.other_read.trim().slice(0, 700) : null;
  let note = typeof parsed.note === "string" && parsed.note.trim() ? parsed.note.trim().slice(0, 350) : null;

  if (arguable && !otherRead) {
    // Model said arguable but gave nothing usable — treat as not-arguable, honestly.
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        arguable: false,
        other_read: null,
        note: note || "I couldn't form an honest counter-read from that. Try putting the thought in your own words.",
        isCrisis: false,
      }),
    };
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      arguable,
      other_read: arguable ? otherRead : null,
      note,
      isCrisis: false,
    }),
  };
}
