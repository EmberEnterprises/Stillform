// re-read.js — "The Re-Read" (name = Arlin's placeholder, hers to rename).
//
// Arlin's mechanic (2026-07-02 spec, build go 2026-07-08): we store memories
// from ONE-SIDED narration — hurt, victimized, at-fault — and rarely see the
// wider picture. Recalling a memory briefly makes it editable before it
// re-stores (reconsolidation — vetted in the Science Sheet). This surface
// points the other-read engine at a REMEMBERED event: it helps the user widen
// the single-sided story into a fuller-perspective one AT THE MOMENT OF
// RECALL, so it re-stores lighter. Not erasing the event — loosening the grip
// of the one-sided version.
//
// EPISTEMIC DOCTRINE — GUIDED reauthoring (Arlin, non-negotiable): the app
// scaffolds the person to the unseen angle; the INSIGHT lands as THEIRS. The
// AI never TELLS them the conclusion; it guides with questions until they turn
// and see it themselves. Forced reframes rebound; unguided ones never happen.
//
// ⚠ SAFETY FLOOR — DESIGNED IN FIRST (Arlin's spec; this is the highest-risk
// surface in the app):
//   - SELF-SELECTED only: the user brings the memory; the app never digs.
//   - LIGHT-TOUCH perspective-widening on manageable memories — NOT depth
//     trauma excavation. Severe trauma / abuse / violence / crisis content
//     gets workable:false + the "heavier than a reframe" note and the client
//     routes to CrisisResources + handoff. No model call on crisis language.
//   - RESOLUTION, NOT FORGIVENESS (Arlin's posture, canon-level): the goal is
//     a story that costs the USER less to hold — never absolution, never
//     "give them the benefit of the doubt," never dropping their guard, and
//     the guide NEVER argues the user into excusing real mistreatment.
//   - Never reappraisal of abuse or ongoing harm (Gross-literature boundary).
//
// Mirrors devils-advocate.js scaffolding exactly (CORS allowlist, origin
// enforcement, per-IP rate limit, abort timeout, gpt-4o, strict JSON).

const rateLimits = new Map();
const RATE_LIMIT_PER_MINUTE = 6; // slower than the other-read: this is deliberate work

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

// Crisis detection — same family as devils-advocate.js / reframe.js.
const CRISIS_PATTERNS = [
  /\b(suicid|kill myself|end (it|my life|things)|don'?t want to (be alive|live|exist))/i,
  /\b(self.harm|harm myself|hurt myself|cut myself)/i,
  /\b(overdos|take.*pills.*die|take all (my|the) pills)/i,
  /\b(abuse|abusing|abused|domestic violence)\b/i,
  /\b(threaten|threatening) (to )?(kill|hurt|harm)\b/i,
  /\b(rape|raped|molest|assault(ed)?)\b/i,
];
function hasCrisisLanguage(text) {
  if (!text || typeof text !== "string") return false;
  return CRISIS_PATTERNS.some((re) => re.test(text));
}

const HEAVIER_NOTE =
  "This one is heavier than a re-read. A memory like this deserves a real person, not a widening exercise — the app can hand you a summary of what you've built here to bring with you.";

const SYSTEM = `EPISTEMIC DOCTRINE (Arlin — governs every Stillform AI surface; keep in sync, doctrine v1):
The user is never the sole source of truth, and neither are you. They supply the information; you acknowledge it and bring it forth; they are meant to UNDERSTAND it — both, always. Your delivery is SUGGESTIVE, never deterministic: forced interpretation kills receptivity and reads as judgment. Leave the user authority over who they are; help them frame, never rule.
THE CRAFT RULE — firm on the record, soft on the meaning. Never a verdict.

You are "The Re-Read" inside Stillform. A person has CHOSEN to revisit one remembered event — a memory they carry in a single-sided telling (hurt, at-fault, victimized, humiliated). Recall makes a memory briefly editable before it re-stores. Your only job is to GUIDE them to a wider view of the same event while it is open — so the version that re-stores is fuller and costs less to hold. You never erase, never dispute what happened, and NEVER hand them the conclusion.

FIRST, decide whether this memory is workable here. Set "workable": false — and ask NO questions — when the memory involves any of these:
- abuse, violence, assault, or ongoing harm (reappraisal is the WRONG tool there; naming and distance are right)
- severe trauma, or telling that reads raw enough that widening could reopen it
- grief or loss where the pain IS the accurate response
- a situation where the user's one-sided read appears ACCURATE (real mistreatment does not need a wider view; it needs acknowledgment)
In those cases: "workable": false, "questions": null, and "note" = one plain, warm-but-not-soft line saying this one is heavier than a re-read and deserves a real person. Do NOT proceed anyway. This judgment is the most important thing you do.

WHEN "workable" is true, GUIDE — never conclude:
- Return TWO to THREE short questions, each one aimed at a genuinely unseen angle of THIS memory: what was outside the frame (what else was true in the room), the other people's separate weather (their conditioning, their day — a REASON, never an excuse), what the person themselves did that the one-sided telling skips, or what the telling assumes that was never actually verified.
- Questions ONLY. No statements of what the memory "really" means. No reassurance. No "maybe they actually…" conclusions — turn every candidate insight into a question the user answers.
- Ground every question ONLY in what they wrote. Invent NOTHING about their life.
- RESOLUTION posture (Arlin): the aim is a story that costs THEM less to hold — never absolving anyone, never asking them to drop their guard, never "give the benefit of the doubt." Understanding why someone did something is a reason, not an excuse.
- Firm on their record, soft on the meaning. The event stands; only the single-sided narration is in question.
- Calm, plain, spare. A sharp peer beside them — never therapy-speak, never wellness-app, never cheerleading.
- "note": null, or one short plain line if a caveat genuinely helps.

Output STRICT JSON only, no prose outside it:
{"workable": true|false, "questions": ["...","..."] | null, "note": "..." | null}`;

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

  const memory = String(body.memory || "").trim().slice(0, 1800);
  if (!memory || memory.length < 12)
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Tell it in your own words first." }) };

  // Safety floor 1 — crisis / severe-trauma language short-circuits BEFORE the
  // model. workable:false + heavier-than-a-reframe note; the client routes to
  // CrisisResources + the handoff summary.
  if (hasCrisisLanguage(memory)) {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ workable: false, questions: null, note: HEAVIER_NOTE, isCrisis: true }),
    };
  }

  if (!process.env.OPENAI_API_KEY)
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: "API key not configured." }) };

  const userMessage = `The memory, in my own words:\n"${memory}"\n\nGuide the re-read.`;

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
        temperature: 0.4,
        max_tokens: 420,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: userMessage },
        ],
      }),
    });
    clearTimeout(apiTimeout);
    if (!response.ok)
      return { statusCode: 502, headers: corsHeaders, body: JSON.stringify({ error: "Upstream error." }) };
    const data = await response.json();
    aiContent = data?.choices?.[0]?.message?.content || "";
  } catch {
    clearTimeout(apiTimeout);
    return { statusCode: 504, headers: corsHeaders, body: JSON.stringify({ error: "Timed out. Try again." }) };
  }

  let parsed;
  try { parsed = JSON.parse(aiContent); }
  catch {
    return { statusCode: 502, headers: corsHeaders, body: JSON.stringify({ error: "Malformed response. Try again." }) };
  }

  // Safety floor 2 — server-side shape enforcement: questions only, 2-3, each
  // actually a question. Anything else degrades to workable:false, honestly.
  const workable = parsed && parsed.workable === true;
  let questions = null;
  if (workable && Array.isArray(parsed.questions)) {
    questions = parsed.questions
      .filter((q) => typeof q === "string" && q.trim().length > 8)
      .map((q) => q.trim())
      .filter((q) => /\?\s*$/.test(q)) // guided means QUESTIONS — enforce it
      .slice(0, 3);
  }
  if (workable && (!questions || questions.length < 2)) {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ workable: false, questions: null, note: "Couldn't find an honest wider angle from what's here — try telling it with a little more of the room in it.", isCrisis: false }),
    };
  }

  const note = parsed && typeof parsed.note === "string" && parsed.note.trim() ? parsed.note.trim().slice(0, 300) : null;
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      workable,
      questions: workable ? questions : null,
      note: workable ? note : (note || HEAVIER_NOTE),
      isCrisis: false,
    }),
  };
}
