// netlify/functions/pattern-enrichment.js
// May 7, 2026 — Pattern Disruption Layer AI enrichment
//
// Layered on top of the client-side deterministic detector. The detector
// finds repeats across the 8 loop-signal dimensions (cheap, no AI cost);
// this function articulates WHAT THE LOOP ACTUALLY IS in the user's voice,
// using the recent session data as context.
//
// Per PATTERN_DISRUPTION_SPEC.md §4 open question Q4: AI runs ONLY after
// deterministic pre-filter trips, not on every data point. This keeps cost
// bounded and the AI-down backup case working — if AI is unavailable, the
// deterministic count-based prompt still surfaces.
//
// Endpoint expects:
//   POST {
//     dimension: string,         // e.g. "same_chip"
//     dimensionLabel: string,    // plain-language, e.g. "Same closing state"
//     value: string,             // the repeating value
//     count: number,             // how many times it's repeated
//     dataPoints: [{ timestamp, sessionId? }],
//     sessionExcerpts: [{ preState, postState, bioFilter, tools, ... }],  // recent sessions for context
//     bioFilter: string|null,    // active hardware state (cohort)
//     signalProfile: object|null,
//     biasProfile: array|null
//   }
//
// Returns: { reasoning: string, suggestedPathway?: string, confidence?: number }
//
// Voice: Stillform observation mode. Same persona as Reframe — no advice,
// no therapy framing, no "you should." Names the loop as observation, not
// as diagnosis. 1-2 sentences max for the in-app modal body.

import {
  jsonResponse,
  rejectDisallowedOrigin
} from "./_httpSecurity.js";

const CORS_OPTIONS = { methods: "POST, OPTIONS" };

const SYSTEM_PROMPT = `You are a pattern observation engine for Stillform, a composure architecture app.

The deterministic detector found a loop in the user's recent sessions. Your job is to articulate what the loop actually is — in ONE short sentence, max 15 words — using the data they've generated. The user reads this in a modal that asks them if they want to step out of the loop for 90 seconds. Brevity is the brand. Long text is the bug.

VOICE — match the Stillform AI persona exactly:
- Observation, not diagnosis. "What I'm seeing" not "what's wrong."
- No advice. No "you should." No suggested fixes inside the reasoning. The disruptor is the action; your text is the noticing.
- No therapy framing. Stillform is composure architecture, not treatment.
- No love language. Don't say "I care," don't lean warm. The text should land neutral and useful.
- Specific, not generic. Reference what they've actually done. Avoid platitudes.
- No "always" or "never." A pattern is a frequency, not a verdict.
- Hard ceiling: 15 words. If you can't name the loop in 15 words, name less of it. Cut adjectives, cut prepositional phrases, cut "this pattern suggests" and similar throat-clearing.

OUTPUT — strict JSON only, no markdown, no prose preamble:
{
  "reasoning": "ONE sentence, max 15 words, naming the loop directly.",
  "confidence": 0.0-1.0
}

Examples of GOOD reasoning text (all 15 words or fewer):
- "Three of your last five sessions ended in 'stuck' — the closing state isn't moving."
- "Same hardware state — depleted — for four sessions running."
- "Tension landed in shoulders four times this week, even after Body Scan."
- "Reframe ran three sessions in a row. Same lane, different content."

Examples of BAD reasoning (do not produce):
- "You always end up stuck — you should try a longer practice." (advice + always)
- "I notice you might be feeling overwhelmed and that's okay." (love language + therapy framing)
- "It seems like there's a pattern of repetition." (generic, doesn't name the loop)
- "The loop is the exclusive use of the reframe tool across three consecutive sessions. This pattern suggests a focus on a single approach without variation." (32 words; throat-clearing; "suggests" hedging)

Return JSON only.`;

const buildUserPrompt = (input) => {
  const {
    dimensionLabel,
    value,
    count,
    sessionExcerpts = [],
    bioFilter = null,
    signalProfile = null,
    biasProfile = null
  } = input;

  const excerptText = sessionExcerpts.slice(-6).map((s, i) => {
    const parts = [];
    if (s.timestamp) parts.push(`Session ${i + 1} (${new Date(s.timestamp).toLocaleDateString()})`);
    if (s.preState) parts.push(`entered as: ${s.preState}`);
    if (s.tools && s.tools.length) parts.push(`tools: ${s.tools.join(", ")}`);
    if (s.postState) parts.push(`closed as: ${s.postState}`);
    if (typeof s.preRate === "number" && typeof s.postRate === "number") {
      parts.push(`rate: ${s.preRate}→${s.postRate}`);
    }
    if (s.bioFilter) parts.push(`hardware: ${s.bioFilter}`);
    return parts.join(" · ");
  }).join("\n");

  const profileText = [
    bioFilter ? `Current hardware state: ${bioFilter}` : null,
    signalProfile?.areas ? `Signal profile (where intensity activates): ${(signalProfile.areas || []).join(", ")}` : null,
    Array.isArray(biasProfile) && biasProfile.length ? `Known bias profile: ${biasProfile.join(", ")}` : null
  ].filter(Boolean).join("\n");

  return `DETECTED LOOP:
Dimension: ${dimensionLabel}
Repeating value: ${value}
Count: ${count} instances in recent sessions

RECENT SESSION DATA:
${excerptText || "(no recent session detail available)"}

USER PROFILE CONTEXT:
${profileText || "(no profile context provided)"}

Articulate what the loop actually is in 1-2 short sentences. Return JSON only.`;
};

const validateInput = (body) => {
  if (!body || typeof body !== "object") return "missing body";
  if (typeof body.dimension !== "string") return "missing dimension";
  if (typeof body.value !== "string") return "missing value";
  if (typeof body.count !== "number" || body.count < 1) return "invalid count";
  if (body.sessionExcerpts && !Array.isArray(body.sessionExcerpts)) return "sessionExcerpts must be array";
  if (body.sessionExcerpts && body.sessionExcerpts.length > 20) return "too many sessionExcerpts";
  return null;
};

// Heuristic fallback — used when AI is unavailable. Composes a reasoning
// string from the deterministic data alone. Conservative phrasing, no
// invented detail. Per spec §4 AI-down backup case: the user still gets
// useful text, just less personalized.
const heuristicFallback = (input) => {
  const { dimensionLabel = "A pattern", value = "", count = 0 } = input;
  // May 7, 2026 — tightened from 22 words to ~9. Per spec §3.1: 7-12 words.
  // No "the loop is the repetition itself" editorializing — that was meta-explanation.
  const valueText = value ? ` (${value})` : "";
  return `${dimensionLabel}${valueText} — ${count} times across recent sessions.`;
};

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") return jsonResponse(event, 200, { ok: true }, CORS_OPTIONS);
  if (event.httpMethod !== "POST") return jsonResponse(event, 405, { error: "Method not allowed" }, CORS_OPTIONS);

  const originBlocked = rejectDisallowedOrigin(event, CORS_OPTIONS);
  if (originBlocked) return originBlocked;

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse(event, 400, { error: "invalid JSON" }, CORS_OPTIONS);
  }

  const validationError = validateInput(body);
  if (validationError) {
    return jsonResponse(event, 400, { error: validationError }, CORS_OPTIONS);
  }

  const apiKey = process.env.OPENAI_API_KEY;

  // No API key — heuristic fallback. Still returns useful text.
  if (!apiKey) {
    return jsonResponse(event, 200, {
      reasoning: heuristicFallback(body),
      confidence: 0.3,
      fallback: "no-api-key"
    }, CORS_OPTIONS);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 220,
        temperature: 0.4,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(body) }
        ]
      })
    });

    if (!response.ok) {
      return jsonResponse(event, 200, {
        reasoning: heuristicFallback(body),
        confidence: 0.3,
        fallback: "api-error",
        status: response.status
      }, CORS_OPTIONS);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "";

    let parsed;
    try {
      const cleaned = content.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return jsonResponse(event, 200, {
        reasoning: heuristicFallback(body),
        confidence: 0.3,
        fallback: "parse-error"
      }, CORS_OPTIONS);
    }

    if (typeof parsed?.reasoning !== "string" || parsed.reasoning.length === 0) {
      return jsonResponse(event, 200, {
        reasoning: heuristicFallback(body),
        confidence: 0.3,
        fallback: "shape-error"
      }, CORS_OPTIONS);
    }

    // Length cap — model occasionally exceeds the 15-word ceiling. Truncate
    // at 100 chars (≈15 words at typical word length) and trim to last
    // sentence boundary if possible. Tightened May 7, 2026 (was 280).
    let reasoning = parsed.reasoning.trim();
    if (reasoning.length > 100) {
      const truncated = reasoning.slice(0, 100);
      const lastSentence = truncated.lastIndexOf(".");
      reasoning = lastSentence > 40
        ? truncated.slice(0, lastSentence + 1)
        : truncated + "…";
    }

    // Brand-voice post-filter — strip disallowed phrases. Same approach as
    // the Reframe banned-phrase filter in reframe.js. If reasoning trips
    // the filter, fall back to heuristic — easier than re-prompting.
    const BANNED_PHRASES = [
      /you should/i,
      /you need to/i,
      /you must/i,
      /always/i,
      /never\b/i,
      /it'?s okay/i,
      /that'?s okay/i,
      /i care/i,
      /i'm here/i,
      /you'?re not alone/i,
      /therapy/i,
      /treatment/i
    ];
    const bannedHit = BANNED_PHRASES.some(rx => rx.test(reasoning));
    if (bannedHit) {
      return jsonResponse(event, 200, {
        reasoning: heuristicFallback(body),
        confidence: 0.3,
        fallback: "brand-voice-violation"
      }, CORS_OPTIONS);
    }

    const confidence = typeof parsed.confidence === "number"
      ? Math.max(0, Math.min(1, parsed.confidence))
      : 0.7;

    return jsonResponse(event, 200, { reasoning, confidence }, CORS_OPTIONS);
  } catch (err) {
    return jsonResponse(event, 200, {
      reasoning: heuristicFallback(body),
      confidence: 0.3,
      fallback: "exception",
      message: String(err?.message || "").slice(0, 100)
    }, CORS_OPTIONS);
  }
}
