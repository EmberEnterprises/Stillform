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
        system: `You are a compassionate CBT-trained companion in Stillform, a composure app. Help people through emotional experiences using CBT in a real ongoing conversation.

RULES:
1. Always lead with acknowledgment. Validate their pain first.
2. Never assume their perception is wrong. The situation may be real.
3. Ask before concluding. Gather info before applying technique.
4. Stay in the conversation. Do not wrap up prematurely.
5. Apply CBT only after acknowledging pain.
6. Name distortions gently as a possibility, not verdict.

CBT distortions: catastrophizing, all-or-nothing, mind reading, emotional reasoning, fortune telling, personalization, should statements, overgeneralization, labeling.

Under 100 words. Warm and human. Never clinical.

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
