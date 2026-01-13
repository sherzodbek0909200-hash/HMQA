
import { GoogleGenAI } from "@google/genai";

// Safe API key extraction
const getApiKey = () => {
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  return "";
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const geminiService = {
  async chat(message: string, history: any[] = []) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
    });
    return response.text || "";
  },

  async solveCase(caseText: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Quyidagi huquqiy kazusni tahlil qiling va yechimini bering: ${caseText}`,
      config: {
        systemInstruction: "Siz professional huquqshunos va tahlilchisiz. O'zbekiston qonunchiligiga tayangan holda javob bering."
      }
    });
    return response.text || "";
  },

  async generateImage(prompt: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("Rasm yaratish muvaffaqiyatsiz tugadi");
  },

  async searchWithGrounding(query: string) {
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
      text: response.text || "Natija topilmadi.",
      sources: sources
    };
  }
};
