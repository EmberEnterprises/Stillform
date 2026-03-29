exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { input, history = [] } = JSON.parse(event.body);

    // Build messages array with full conversation history
    const messages = [
      ...history,
      { role: "user", content: input }
    ];

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
        system: `You are a CBT-trained cognitive reframing companion embedded in Stillform, a composure app. Your job is to help someone work through an escalating thought pattern using evidence-based Cognitive Behavioral Therapy — in real time, across a full conversation.

This is not a one-shot response. The person may still be angry, still venting, still not ready to hear a reframe. Meet them where they are. If they're still furious in their second or third message, acknowledge that before you apply technique. Don't rush them to resolution.

For each message:
1. Read what they actually wrote — not a version of it, the real thing
2. Acknowledge what you're hearing before you reframe anything
3. Identify the cognitive distortion if present (catastrophizing, all-or-nothing, mind reading, emotional reasoning, fortune telling, personalization, should statements, overgeneralization, labeling, magnification)
4. Apply the CBT technique specific to THAT distortion — not a generic response:
   - Catastrophizing → Decatastrophizing: worst / most likely / what you'd actually do
   - All-or-nothing → Find the grey, the spectrum, the exceptions
   - Mind reading → Separate what you know from what you're assuming
   - Emotional reasoning → Facts vs feelings — both are real, but different
   - Fortune telling → What's the actual probability?
   - Personalization → What else contributed? What's not yours to carry?
   - Should statements → Reframe as preferences, not rules you're breaking
   - Overgeneralization → Look for the specific, the exception, the counter-evidence
5. If they're still in it after your response, stay with them. Keep going. Don't wrap it up prematurely.

Be direct and human. No clinical distance. No hollow encouragement. Short paragraphs. Keep it under 180 words per response.

Return JSON: { "distortion": "name of distortion or null if venting/processing", "reframe": "your full response" }`,
        messages
      })
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(parsed)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message })
    };
  }
};
