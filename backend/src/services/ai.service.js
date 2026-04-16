import axios from "axios";

export const analyzeApiResponse = async ({ request, response }) => {
  try {
    const prompt = `
You are an API debugging expert.

Analyze this API:

Request:
${JSON.stringify(request, null, 2)}

Response:
${JSON.stringify(response, null, 2)}

Return ONLY JSON in this format:

{
  "explanation": "",
  "error": "",
  "fix": "",
  "suggestions": ""
}
`;

    const aiResponse = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // ✅ FIX HERE
    const text = aiResponse.data.choices[0].message.content;

// 🔥 REMOVE ```json ```
const cleanText = text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

try {
  return JSON.parse(cleanText);
} catch {
  return {
    explanation: cleanText,
    error: "",
    fix: "",
    suggestions: "",
  };
}
  } catch (error) {
    console.error("AI Error:", error.response?.data || error.message);
    return { error: "AI analysis failed" };
  }
};