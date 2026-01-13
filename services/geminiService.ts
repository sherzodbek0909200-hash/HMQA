import { GoogleGenAI } from "@google/genai";

// Cloudflare/Vercel env o'zgaruvchilari uchun polyfill bilan ishlash
const getApiKey = () => {
  try {
    return process.env.API_KEY || "";
  } catch (e) {
    return "";
  }
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

export const geminiService = {
  async chat(message: string) {
    if (!apiKey) throw new Error("API Key sozlanmagan.");
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
    });
    return response.text || "";
  },

  async solveCase(caseText: string) {
    if (!apiKey) throw new Error("API Key sozlanmagan.");
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Quyidagi huquqiy kazusni tahlil qiling va yechimini bering: ${caseText}`,
      config: {
        systemInstruction: "Siz professional huquqshunos va tahlilchisiz. O'zbekiston Respublikasi qonunchiligiga tayangan holda javob bering."
      }
    });
    return response.text || "";
  },

  async generateImage(prompt: string) {
    if (!apiKey) throw new Error("API Key sozlanmagan.");
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      },
    });

    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (part?.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("Rasm yaratilmadi.");
  },

  async searchWithGrounding(query: string) {
    if (!apiKey) throw new Error("API Key sozlanmagan.");
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        uri: chunk.web?.uri || '',
        title: chunk.web?.title || 'Manba'
      }))
      .filter((s: any) => s.uri) || [];

    return {
      text: response.text || "Natija yo'q.",
      sources: sources
    };
  }
};