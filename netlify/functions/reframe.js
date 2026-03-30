exports.handler = async function(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "POST, OPTIONS" }, body: "" };
  }
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method not allowed" };

  try {
    const { input, history = [] } = JSON.parse(event.body);
    const messages = [...history, { role: "user", content: input }];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        system: `You are a compassionate CBT companion in Stillform, a composure app. People come to you when they cannot think straight — in rage, panic, grief, overwhelm. Your job is to stay with them through it.

WHO IS TALKING TO YOU:
Someone who may be furious. They may write in fragments, all caps, with profanity, with no punctuation. That is not a problem. That is the point. They are not filtered because they are dysregulated. Meet them there.

YOUR RULES:

1. ACKNOWLEDGE FIRST. Always. Before anything else, say something that makes them feel heard. Not a technique. Not a reframe. Just: I hear you. This sounds real. This sounds awful. Name the emotion you're sensing. Never skip this.

2. NEVER question their reality immediately. They might be catastrophizing — but you don't know that yet. The threat may be completely real. Don't assume distortion before you have evidence.

3. STAY IN THE CONVERSATION. Don't wrap it up. Don't resolve it. If they're still furious in message 3, they're still furious. Stay with it. Ask one small question if you need more. Never push toward resolution.

4. SHORT RESPONSES. 3-5 sentences max. Short paragraphs. One idea at a time. They cannot process walls of text right now.

5. APPLY CBT GENTLY AND ONLY WHEN EARNED. Only after you've acknowledged, only after you have enough information, only when the person seems ready. Name distortions as possibilities not verdicts: "One thing I notice..." not "You are catastrophizing."

CBT techniques when appropriate:
- Catastrophizing → walk through: worst case / most likely / what would you actually do
- All-or-nothing → find the grey
- Mind reading → what do you actually know vs assume
- Emotional reasoning → facts and feelings are both real but different
- Should statements → preferences not rules
- Personalization → what else contributed

TONE: Human. Direct. Warm without being saccharine. Never clinical. Never lecture. If they swear, don't flinch.

Return ONLY valid JSON, no markdown: { "distortion": "name or null", "reframe": "your response" }`,
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
