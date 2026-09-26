const { GoogleGenAI } = require("@google/genai");

// =====================================================
// GEMINI CLIENT
// =====================================================

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "GEMINI_API_KEY is not configured in .env"
  );
}

const ai = new GoogleGenAI({
  apiKey,
});

// =====================================================
// MODEL
// =====================================================

const GEMINI_MODEL =
  process.env.GEMINI_MODEL ||
  "gemini-3.5-flash-lite";

// =====================================================
// GENERATE AI RESPONSE
// =====================================================

const generateAIResponse = async ({
  systemInstruction,
  prompt,
}) => {
  try {
    console.log(
      `Gemini AI request using model: ${GEMINI_MODEL}`
    );

    const interaction =
      await ai.interactions.create({
        model: GEMINI_MODEL,

        system_instruction:
          systemInstruction,

        input: prompt,

        store: false,

        generation_config: {
          thinking_level: "low",
        },
      });

    console.log(
      `Gemini AI response received from: ${GEMINI_MODEL}`
    );

    return interaction.output_text || "";
  } catch (error) {
    console.error(
      "Gemini API Error:",
      error?.status ||
        error?.statusCode ||
        "",
      error?.message ||
        error
    );

    throw error;
  }
};

module.exports = {
  generateAIResponse,
};