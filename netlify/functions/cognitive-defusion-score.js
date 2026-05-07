// netlify/functions/cognitive-defusion-score.js
// CFM Phase 1 Sprint 3 · May 7, 2026
//
// Scores user-generated alternative frames against an original sticky thought,
// per CFM_PHASE_1_AUDIT.md Decision 7. Three-tier rubric:
//   - distinct (1.0): genuinely different perspective from the original
//   - reworded (0.5): same content, different words
//   - same (0.0): restates the original or expands without changing perspective
//
// User sees: "5 frames generated. 3 distinct, 1 reworded, 1 same."
// Distinct count is what's tracked over time (primaryCount field in
// stillform_function_checks).
//
// Endpoint expects:
//   POST { thought: string, frames: string[] }
//   Returns: { scores: [{ frame: string, score: "distinct"|"reworded"|"same" }],
//              distinctCount: number, rewordedCount: number, sameCount: number }
//
// Few-shot examples for the prompt come from the stimulus library
// (DEFUSION_SCORING_EXAMPLES), kept in the function for self-containment
// since Netlify functions can't import from /src.

import {
  jsonResponse,
  rejectDisallowedOrigin
} from "./_httpSecurity.js";

const CORS_OPTIONS = { methods: "POST, OPTIONS" };

// Few-shot examples mirrored from src/practice-signals/cognitive-defusion-stimuli.js
// Anchor the AI rubric so scoring is consistent across thoughts.
const FEW_SHOT_EXAMPLES = [
  {
    thought: "I'll never get this right.",
    frames: [
      { text: "I'll never figure this out.", score: "reworded" },
      { text: "This is harder than I expected, and that's information.", score: "distinct" },
      { text: "I never get anything right.", score: "same" },
      { text: "What does 'right' look like, and who decided that?", score: "distinct" },
    ],
  },
  {
    thought: "If they really knew me, they'd see I'm faking it.",
    frames: [
      { text: "They'd realize I'm a fraud.", score: "reworded" },
      { text: "What I'm calling 'faking' might be the part of me still learning.", score: "distinct" },
      { text: "I'm a fake.", score: "same" },
    ],
  },
];

const SYSTEM_PROMPT = `You are a scoring engine for a cognitive defusion exercise. Score each user-generated frame against the original sticky thought using a three-tier rubric.

RUBRIC:
- "distinct" — genuinely different perspective from the original. Examples: introduces a different actor's intent, reality-tests the assumption, surfaces an underlying value, accepts the worst case as workable, or reframes the cognitive level (the user observing their thought rather than being it).
- "reworded" — same content, different words. Examples: synonym swap, passive↔active voice, hedging language added, same emotional valence with new vocabulary.
- "same" — restates the original or expands it without changing perspective. Examples: paraphrase that adds detail without shifting the frame, or a stronger version of the same claim.

OUTPUT: a JSON array of {frame, score} objects, one per input frame, in the same order as the input. No prose, no explanation, no markdown. JUST the JSON array.

Be honest. The user benefits from accurate scoring. A reworded frame called "distinct" inflates the trend. A distinct frame called "same" deflates legitimate practice signal.`;

const buildUserPrompt = (thought, frames) => {
  const examples = FEW_SHOT_EXAMPLES.map(ex => {
    const scored = ex.frames.map((f, i) => `  ${i + 1}. "${f.text}" → ${f.score}`).join("\n");
    return `Thought: "${ex.thought}"\nFrames:\n${scored}`;
  }).join("\n\n");

  const inputFrames = frames.map((f, i) => `  ${i + 1}. "${f}"`).join("\n");

  return `Examples:

${examples}

Now score these frames:

Thought: "${thought}"
Frames:
${inputFrames}

Return JSON array only.`;
};

const validateInput = (body) => {
  if (!body || typeof body !== "object") return "missing body";
  if (typeof body.thought !== "string" || body.thought.trim().length === 0) return "missing thought";
  if (body.thought.length > 500) return "thought too long";
  if (!Array.isArray(body.frames)) return "frames must be array";
  if (body.frames.length === 0) return "no frames provided";
  if (body.frames.length > 10) return "too many frames (max 10)";
  for (const f of body.frames) {
    if (typeof f !== "string") return "frames must be strings";
    if (f.length > 500) return "frame too long";
  }
  return null;
};

// Heuristic fallback scorer if AI is unavailable. Conservative — defaults
// most frames to "reworded" so we don't inflate the user's distinct count
// when the AI is down. Trend will recover when AI comes back online.
const heuristicFallbackScores = (thought, frames) => {
  const normalized = (s) => String(s || "").toLowerCase().replace(/[^\w\s]/g, "").trim();
  const thoughtNorm = normalized(thought);
  return frames.map((frame) => {
    const frameNorm = normalized(frame);
    if (frameNorm === thoughtNorm) return { frame, score: "same" };
    // If the frame contains all but one word of the thought, treat as same/reworded.
    const tWords = new Set(thoughtNorm.split(/\s+/).filter(w => w.length > 3));
    const fWords = new Set(frameNorm.split(/\s+/).filter(w => w.length > 3));
    let overlap = 0;
    tWords.forEach(w => { if (fWords.has(w)) overlap++; });
    const overlapRatio = tWords.size > 0 ? overlap / tWords.size : 0;
    if (overlapRatio > 0.7) return { frame, score: "same" };
    if (overlapRatio > 0.4) return { frame, score: "reworded" };
    // Conservative default: when uncertain, score reworded rather than distinct.
    return { frame, score: "reworded" };
  });
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

  const { thought, frames } = body;
  const apiKey = process.env.OPENAI_API_KEY;

  // No API key — fall back to heuristic scoring. User still gets a result,
  // just not as accurate. Trend recovers when key is restored.
  if (!apiKey) {
    const scores = heuristicFallbackScores(thought, frames);
    const summary = summarize(scores);
    return jsonResponse(event, 200, { ...summary, fallback: "no-api-key" }, CORS_OPTIONS);
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
        max_tokens: 600,
        temperature: 0.2, // low for consistency in scoring
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(thought, frames) }
        ]
      })
    });

    if (!response.ok) {
      const scores = heuristicFallbackScores(thought, frames);
      const summary = summarize(scores);
      return jsonResponse(event, 200, { ...summary, fallback: "api-error", status: response.status }, CORS_OPTIONS);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "";

    let parsed;
    try {
      // Strip any code fences if the model adds them despite the instruction.
      const cleaned = content.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      // Parse failure — fall back to heuristic.
      const scores = heuristicFallbackScores(thought, frames);
      const summary = summarize(scores);
      return jsonResponse(event, 200, { ...summary, fallback: "parse-error" }, CORS_OPTIONS);
    }

    if (!Array.isArray(parsed) || parsed.length !== frames.length) {
      const scores = heuristicFallbackScores(thought, frames);
      const summary = summarize(scores);
      return jsonResponse(event, 200, { ...summary, fallback: "shape-error" }, CORS_OPTIONS);
    }

    // Normalize each entry: must have frame + score in the allowed set.
    const validScores = ["distinct", "reworded", "same"];
    const scores = parsed.map((entry, i) => {
      const score = validScores.includes(entry?.score) ? entry.score : "reworded";
      return { frame: frames[i], score };
    });

    const summary = summarize(scores);
    return jsonResponse(event, 200, summary, CORS_OPTIONS);
  } catch (err) {
    // Network or unexpected error — fall back to heuristic.
    const scores = heuristicFallbackScores(thought, frames);
    const summary = summarize(scores);
    return jsonResponse(event, 200, { ...summary, fallback: "exception", message: String(err?.message || "").slice(0, 100) }, CORS_OPTIONS);
  }
}

function summarize(scores) {
  const distinctCount = scores.filter(s => s.score === "distinct").length;
  const rewordedCount = scores.filter(s => s.score === "reworded").length;
  const sameCount = scores.filter(s => s.score === "same").length;
  return { scores, distinctCount, rewordedCount, sameCount };
}
