// netlify/functions/infer-trigger.js
// May 11, 2026 — Ship 1.3 AI trigger inference at Reframe close.
//
// Replaces the manual trigger-tagger chip selector that was stripped from
// the What Shifted close in Ship 1.2. Stage 3 marker "pre→post delta on
// named-trigger sessions" depends on knowing which trigger a session
// addressed; without close-time user tagging, that data has to come from
// inference over the conversation transcript.
//
// Per Arlin's decision May 11, 2026: Option B (one-tap confirm at close)
// preserves data integrity over Option A (silent storage with retrospective
// correction). The inference function returns a single best-match trigger
// with a confidence level. The client:
//   - High confidence: shows "About: [label]? [Yes] [Edit]" at close.
//   - Low confidence: skips silently (better silence than fabricated tag).
//   - Null inference: skips silently (no triggers in profile, or none
//     plausibly matched the conversation).
//
// Endpoint expects:
//   POST {
//     triggers: [{ id, label, description?, category? }],
//     recentMessages: [{ role: "user"|"assistant", content: string }],
//     preState: string|null,    // chip label
//     postState: string|null,   // chip label
//     regulationType: "thought-first"|"body-first"|null
//   }
//
// Returns: {
//   inferredTriggerId: string|null,
//   confidence: "high"|"low"|null,
//   reasoning?: string             // for analytics; not shown to user
// }
//
// Confidence is a categorical level (high|low) not a 0-1 number — easier
// for the client to gate on and easier for the model to reason about. The
// client renders the confirm only on high; everything else stays silent.
//
// SCIENCE GROUNDING:
// - Heider 1958 attribution: when the system silently tags trigger data
//   the user attributes their own progress to "I just got better." The
//   one-tap confirm names the trigger explicitly so the user sees the
//   data being captured — Stage 3 progression remains legibly tied to
//   the work they did.
// - Gollwitzer 1999 implementation intentions: trigger-tagged sessions
//   feed the Pre-event Brief and Today's Brief, which then propose
//   pre-loaded if-then routing on those triggers. Tag quality directly
//   affects the value of those downstream surfaces.

import {
  jsonResponse,
  rejectDisallowedOrigin
} from "./_httpSecurity.js";

const CORS_OPTIONS = { methods: "POST, OPTIONS" };

const SYSTEM_PROMPT = `You are a trigger-matching engine for Stillform, a metacognition practice.

A user just finished a Reframe session. They have a Trigger Profile naming the people, contexts, and recurring situations that destabilize them. Your job: identify which trigger (if any) this session was about.

OUTPUT FORMAT — JSON only, no preamble:
{
  "inferredTriggerId": "trigger_xyz" | null,
  "confidence": "high" | "low",
  "reasoning": "one short sentence naming the evidence"
}

CONFIDENCE LEVELS:
- "high" — clear and specific match. The user named the trigger directly OR described a scene/person that maps unambiguously to one trigger. The user-facing confirm will fire only on high.
- "low" — possible match but not certain, OR no clear match. Always set inferredTriggerId to null when confidence is low (the client treats low + non-null as low, the cleaner output is null + low).
- If no triggers match at all: { inferredTriggerId: null, confidence: "low", reasoning: "no match" }.

RULES:
- Match ONLY against the provided trigger list. Never invent.
- A trigger mentioned in passing is NOT the session's subject. The session subject is what the user was processing/regulating around. If the user mentioned their boss once but the conversation was about a fight with their partner, the trigger is the partner-related one (if it exists) or null.
- Pre/post chips are signal: if pre = "anxious" and the conversation references work, work-category triggers are more plausible than family ones.
- Be conservative. "Low confidence" is the safer default. A miss is recoverable (user can Edit). A false-positive at high confidence trains the user to ignore the confirm.

VOICE:
- The reasoning string is internal — not shown to the user. Plain observation. No "you" voice, no therapy framing.
- Examples: "Mentioned 2pm meeting + boss directly." / "Described conflict with mother — matches Family pressure." / "No clear match to listed triggers."`;

const validateInput = (body) => {
  if (!body || typeof body !== "object") return "body required";
  if (!Array.isArray(body.triggers)) return "triggers must be an array";
  if (body.triggers.length === 0) return null; // valid but will short-circuit
  for (const t of body.triggers) {
    if (!t || typeof t.id !== "string" || typeof t.label !== "string") {
      return "each trigger needs string id + label";
    }
  }
  if (body.recentMessages && !Array.isArray(body.recentMessages)) {
    return "recentMessages must be an array if provided";
  }
  return null;
};

const buildUserPrompt = (body) => {
  const triggersList = body.triggers
    .map(t => {
      const cat = t.category ? ` [${t.category}]` : "";
      const desc = t.description ? ` — ${t.description}` : "";
      return `  ${t.id}: "${t.label}"${cat}${desc}`;
    })
    .join("\n");

  const transcript = (body.recentMessages || [])
    .slice(-12) // last 12 messages — enough context, bounded cost
    .map(m => {
      const role = m.role === "user" ? "User" : "Stillform";
      const content = String(m.content || "").slice(0, 500); // cap each message
      return `${role}: ${content}`;
    })
    .join("\n");

  const pre = body.preState ? ` (pre: ${body.preState})` : "";
  const post = body.postState ? ` (post: ${body.postState})` : "";
  const regType = body.regulationType ? ` · ${body.regulationType}` : "";

  return `Triggers in this user's profile:
${triggersList}

Session context${pre}${post}${regType}:
${transcript || "(no message content)"}

Which trigger (if any) was this session about? Return JSON only.`;
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

  // Short-circuit: empty trigger profile means nothing to match against.
  // Returns null inference with no API cost.
  if (!body.triggers || body.triggers.length === 0) {
    return jsonResponse(event, 200, {
      inferredTriggerId: null,
      confidence: "low",
      reasoning: "no triggers in profile"
    }, CORS_OPTIONS);
  }

  // Short-circuit: no transcript means nothing to infer from. The user
  // might have completed Reframe via Self Mode (independent practice) or
  // the session was empty. Either way, no honest inference is possible.
  if (!body.recentMessages || body.recentMessages.length === 0) {
    return jsonResponse(event, 200, {
      inferredTriggerId: null,
      confidence: "low",
      reasoning: "no transcript"
    }, CORS_OPTIONS);
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return jsonResponse(event, 200, {
      inferredTriggerId: null,
      confidence: "low",
      reasoning: "inference unavailable"
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
        model: "gpt-4o-mini", // cheaper/faster than gpt-4o; inference is a classification task
        max_tokens: 150,
        temperature: 0.2, // low temp — we want consistent matching, not creative output
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(body) }
        ]
      })
    });

    if (!response.ok) {
      return jsonResponse(event, 200, {
        inferredTriggerId: null,
        confidence: "low",
        reasoning: "api error",
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
        inferredTriggerId: null,
        confidence: "low",
        reasoning: "parse error"
      }, CORS_OPTIONS);
    }

    // Validate shape + verify inferredTriggerId is actually in the input list.
    // Belt-and-suspenders against the model hallucinating a trigger ID.
    const validIds = new Set(body.triggers.map(t => t.id));
    let inferredTriggerId = (typeof parsed.inferredTriggerId === "string" && validIds.has(parsed.inferredTriggerId))
      ? parsed.inferredTriggerId
      : null;
    let confidence = (parsed.confidence === "high" || parsed.confidence === "low")
      ? parsed.confidence
      : "low";

    // If confidence is low but a trigger ID was returned, force null — the
    // client only acts on high+id pairs, so cleaner output is null on low.
    if (confidence === "low") inferredTriggerId = null;

    // Hallucinated trigger ID (model returned a string but it's not in the
    // profile) — already nulled above by the validIds check. Belt + suspenders.

    const reasoning = typeof parsed.reasoning === "string"
      ? parsed.reasoning.slice(0, 200)
      : null;

    return jsonResponse(event, 200, {
      inferredTriggerId,
      confidence,
      reasoning
    }, CORS_OPTIONS);
  } catch (err) {
    return jsonResponse(event, 200, {
      inferredTriggerId: null,
      confidence: "low",
      reasoning: "exception",
      message: String(err?.message || "").slice(0, 100)
    }, CORS_OPTIONS);
  }
}
