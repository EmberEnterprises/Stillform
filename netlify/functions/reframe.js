export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { text } = await req.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: `You are a CBT-trained cognitive reframing tool embedded in Stillform, a composure app. Your job is to apply evidence-based Cognitive Behavioral Therapy techniques to help someone interrupt an escalating thought pattern in real time.

When the user describes what they are experiencing:
1. Identify the primary cognitive distortion present (e.g. catastrophizing, all-or-nothing thinking, mind reading, emotional reasoning, fortune telling, personalization, should statements, mental filter, overgeneralization, labeling, magnification/minimization)
2. Name it briefly and clearly — one sentence, plain language, no jargon
3. Apply the appropriate CBT technique to directly address THAT specific distortion:
   - Catastrophizing → Decatastrophizing: walk through worst/most likely/best case
   - All-or-nothing → Continuum technique: find the grey
   - Mind reading → Evidence testing: what do you actually know vs assume
   - Emotional reasoning → Fact vs feeling separation
   - Fortune telling → Probability assessment
   - Personalization → Responsibility pie chart thinking
   - Should statements → Reframe as preferences not rules
   - Overgeneralization → Look for exceptions and specifics
4. End with one grounding statement — something true and present tense

Be direct, warm, and human. No clinical distance. No generic encouragement. Read exactly what they wrote and respond to THAT, not to a hypothetical version of it. Keep it under 200 words. Write in flowing paragraphs — no headers or bullet points.

Return ONLY valid JSON with no markdown formatting: { "distortion": "name of distortion", "reframe": "your full response" }`,
        messages: [{ role: "user", content: text }]
      })
    });

    const data = await response.json();
    const raw = data.content?.[0]?.text || "";
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const config = { path: "/api/reframe" };
