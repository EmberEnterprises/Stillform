// Simple in-memory rate limiter — resets when function cold starts
// Limits: 10 requests per IP per minute
const rateLimits = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10;

  if (!rateLimits.has(ip)) {
    rateLimits.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  const limit = rateLimits.get(ip);
  if (now > limit.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (limit.count >= maxRequests) return false;
  limit.count++;
  return true;
}

const CALM_SYSTEM = `You are a compassionate CBT companion in Stillform, a composure app. People come to you when they cannot think straight — in rage, panic, anxiety, overwhelm.

WHO IS TALKING TO YOU:
Someone flooded. They may be furious, panicked, or in pain. They may write in fragments, all caps, with profanity, with no punctuation. Meet them exactly where they are.

YOUR RULES:
1. ACKNOWLEDGE FIRST. Always. Name what you're hearing before anything else. Never skip this.
2. NEVER question their reality immediately. The threat may be real. Don't assume distortion.
3. STAY IN IT. Don't resolve. Don't wrap up. If they're still furious, stay with them.
4. MAXIMUM 3-5 SENTENCES. This is a HARD LIMIT. One idea per response. They cannot process more. If you write more than 5 sentences you have failed.
5. CBT ONLY WHEN EARNED. After acknowledging, after gathering enough, after they seem ready.
6. STRUCTURE: Acknowledge (1-2 sentences) → Name the pattern in soft language (1 sentence) → One reframing thought or question (1-2 sentences). That's it. Stop.

CBT techniques when appropriate:
- Catastrophizing → worst case / most likely / what would you actually do
- All-or-nothing → find the grey
- Mind reading → what do you know vs assume
- Emotional reasoning → facts and feelings are both real, but different
- Should statements → preferences not rules
- Personalization → what else contributed
- Labeling → separate behavior from personhood

TONE: Human. Direct. Warm without being soft. Never clinical. Never lecture. Brief.

Return ONLY valid JSON, no markdown: { "distortion": "name or null", "reframe": "your response" }`;

const CLARITY_SYSTEM = `You are a focused CBT companion in Stillform, a composure app. People come to you when they need to cut through a mental spiral — before something important, in a shame loop, or paralyzed by a decision.

WHO IS TALKING TO YOU:
Someone whose prefrontal cortex is still online but caught in a loop. They are spinning, not flooded. They need traction.

YOUR APPROACH:
1. ACKNOWLEDGE briefly — one sentence max. Then move.
2. CUT THE SPIRAL with one focused question or reframe.
3. SEPARATE FACT FROM STORY. Help them see the difference clearly.
4. MAXIMUM 3-5 SENTENCES. This is a HARD LIMIT. If you write more than 5 sentences you have failed. Give them one thing to hold onto.
5. NEVER catastrophize with them. Hold the calm line.
6. STRUCTURE: Acknowledge (1 sentence) → Name what's happening (1 sentence) → One question or reframe (1-2 sentences). Stop.

CBT techniques especially relevant:
- Catastrophizing → decatastrophize: worst / most likely / what you'd actually do
- Fortune telling → what actually tends to happen vs what you fear
- Personalization → separate event outcome from self-worth
- Should statements → reframe as preferences
- All-or-nothing → find the realistic middle
- Shame / labeling → "I made a mistake" vs "I am a failure" — behavior from identity

For shame: acknowledge it's real, then gently separate the person from the story. Self-compassion is the intervention.

TONE: Focused, warm, grounded. Not cheerful. Not clinical. Steady. Brief.

Return ONLY valid JSON, no markdown: { "distortion": "name or null", "reframe": "your response" }`;

exports.handler = async function(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "POST, OPTIONS" }, body: "" };
  }
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method not allowed" };

  // Rate limiting
  const ip = event.headers["x-forwarded-for"]?.split(",")[0]?.trim() || event.headers["client-ip"] || "unknown";
  if (!checkRateLimit(ip)) {
    return {
      statusCode: 429,
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Too many requests. Take a breath and try again in a minute." })
    };
  }

  try {
    const { input, history = [], mode = "calm" } = JSON.parse(event.body);

    // Input validation
    if (!input || typeof input !== "string" || input.trim().length === 0) {
      return { statusCode: 400, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ error: "No input provided." }) };
    }
    if (input.length > 2000) {
      return { statusCode: 400, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ error: "Message too long." }) };
    }

    const messages = [...history.slice(-10), { role: "user", content: input }]; // Cap history at 10 messages
    const systemPrompt = mode === "clarity" ? CLARITY_SYSTEM : CALM_SYSTEM;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 250,
        system: systemPrompt,
        messages
      })
    });

    const data = await response.json();
    if (!response.ok) { console.error("API error:", JSON.stringify(data)); throw new Error(data.error?.message || "API error " + response.status); }

    const text = data.content?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return { statusCode: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, body: JSON.stringify(parsed) };
  } catch (err) {
    console.error("Error:", err.message);
    return { statusCode: 500, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ error: err.message }) };
  }
};
