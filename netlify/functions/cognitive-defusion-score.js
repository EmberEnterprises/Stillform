// netlify/functions/cognitive-defusion-score.js
// June 23, 2026 — Cognitive Function Measurement (CFM), Phase 1 · Decision 7.
//
// Scores a user's cognitive-defusion exercise: given an original thought and
// the alternative frames the user generated against it in a timed window, the
// function classifies each frame's distinctiveness. "Distinct count" is the
// tracked metric — direct measurement of the cognitive flexibility Reframe is
// meant to train (ACT lineage; Hayes).
//
// DESIGN PRINCIPLES (from the Phase 1 audit + CANON §321 mirror integrity):
//   - The AI only CLASSIFIES (distinct | reworded | same). The SERVER owns the
//     label→score mapping, so the model can never invent a score — same honest-
//     arithmetic discipline as the discovery engine: the AI voices a judgment,
//     it does not produce the number.
//   - Strict validation: the model must return exactly one label per frame, all
//     from the closed set. Any mismatch fails SOFT with error:"scoring failed"
//     and scores:null — never a fabricated score (CANON: a mirror that lies
//     isn't a mirror).
//   - The rubric is returned to the client so the user can SEE why a frame
//     scored as it did, and the client offers a "this should be distinct"
//     dispute affordance (client UI = deferred, Arlin's). The AI is never an
//     unaccountable judge.
//
// Endpoint expects:
//   POST {
//     thought: string,        // the original thought stimulus
//     frames:  string[]       // the alternative frames the user generated
//   }
//
// Returns:
//   {
//     scores: [{ frame: string, label: "distinct"|"reworded"|"same", score: 1|0.5|0 }] | null,
//     distinctCount: number | null,   // count of "distinct" — the tracked metric
//     total: number | null,           // frames scored
//     error: string | null
//   }

import {
  jsonResponse,
  rejectDisallowedOrigin
} from "./_httpSecurity.js";

const CORS_OPTIONS = { methods: "POST, OPTIONS" };

const MAX_FRAMES = 12;        // a 30s window won't yield more; bound cost + abuse
const MAX_FRAME_CHARS = 400;  // per-frame cap
const MAX_THOUGHT_CHARS = 500;

// Server-owned mapping. The AI returns a label; the server assigns the score.
const LABEL_TO_SCORE = { distinct: 1, reworded: 0.5, same: 0 };

const SYSTEM_PROMPT = `You are a cognitive-defusion scoring engine for Stillform, a metacognition practice.

A user was shown a single distressing thought and asked to generate alternative frames on it within a short timed window (cognitive defusion — the ACT skill of seeing a thought as one construction among many, not as fact). Your job: classify how distinct each frame is from the original thought.

Score each frame as exactly one of three labels:
- "distinct" — a genuinely DIFFERENT perspective on the original thought. It does at least one of: introduces a different actor's intent, reality-tests the assumption, surfaces an underlying value or need, or accepts/defuses the worst case. A real shift in vantage point.
- "reworded" — the SAME content in different words. Synonym swap, active↔passive voice, added hedging or softening. No new vantage point.
- "same" — restates or merely expands the original thought without changing perspective at all. Agrees with or amplifies it.

OUTPUT FORMAT — JSON only, no preamble:
{ "labels": ["distinct" | "reworded" | "same", ...] }

RULES:
- Return EXACTLY one label per frame, in the SAME ORDER as the frames given. The labels array length MUST equal the number of frames.
- Judge each frame ONLY against the original thought, independently of the other frames.
- Be calibrated, not generous. Rewording is not distinctness. When unsure between distinct and reworded, choose reworded.
- Never add commentary, scores, or fields beyond the labels array.`;

const validateInput = (body) => {
  if (!body || typeof body !== "object") return "body required";
  if (typeof body.thought !== "string" || !body.thought.trim()) return "thought required";
  if (!Array.isArray(body.frames)) return "frames must be an array";
  const clean = body.frames.filter((f) => typeof f === "string" && f.trim());
  if (clean.length === 0) return "at least one non-empty frame required";
  return null;
};

const buildUserPrompt = (thought, frames) => {
  const numbered = frames.map((f, i) => `  ${i + 1}. ${f}`).join("\n");
  return `Original thought:
"${thought}"

Frames the user generated (${frames.length}):
${numbered}

Classify each frame as "distinct", "reworded", or "same". Return JSON only: { "labels": [...] } with exactly ${frames.length} labels in order.`;
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

  // Normalize + bound the inputs.
  const thought = body.thought.trim().slice(0, MAX_THOUGHT_CHARS);
  const frames = body.frames
    .filter((f) => typeof f === "string" && f.trim())
    .slice(0, MAX_FRAMES)
    .map((f) => f.trim().slice(0, MAX_FRAME_CHARS));

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return jsonResponse(event, 200, { scores: null, distinctCount: null, total: null, error: "scoring unavailable" }, CORS_OPTIONS);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // classification task — cheaper/faster, like infer-trigger
        max_tokens: 200,
        temperature: 0.2,     // low temp — calibrated, repeatable classification
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(thought, frames) }
        ]
      })
    });

    if (!response.ok) {
      return jsonResponse(event, 200, { scores: null, distinctCount: null, total: null, error: "scoring failed", status: response.status }, CORS_OPTIONS);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "";

    let parsed;
    try {
      const cleaned = content.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return jsonResponse(event, 200, { scores: null, distinctCount: null, total: null, error: "scoring failed" }, CORS_OPTIONS);
    }

    const labels = parsed && Array.isArray(parsed.labels) ? parsed.labels : null;

    // STRICT validation: one valid label per frame, exact count. No fabrication
    // on mismatch — fail soft with error, never a guessed score.
    if (!labels || labels.length !== frames.length || !labels.every((l) => l in LABEL_TO_SCORE)) {
      return jsonResponse(event, 200, { scores: null, distinctCount: null, total: null, error: "scoring failed" }, CORS_OPTIONS);
    }

    // Server owns the label→score mapping. The AI never produced a number.
    const scores = frames.map((frame, i) => ({
      frame,
      label: labels[i],
      score: LABEL_TO_SCORE[labels[i]]
    }));
    const distinctCount = scores.filter((s) => s.label === "distinct").length;

    return jsonResponse(event, 200, {
      scores,
      distinctCount,
      total: scores.length,
      error: null
    }, CORS_OPTIONS);
  } catch (err) {
    return jsonResponse(event, 200, {
      scores: null,
      distinctCount: null,
      total: null,
      error: "scoring failed",
      message: String(err?.message || "").slice(0, 100)
    }, CORS_OPTIONS);
  }
}
