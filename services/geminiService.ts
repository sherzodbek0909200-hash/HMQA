import { GoogleGenAI } from "@google/genai";

// API key platforma tomonidan process.env.API_KEY orqali avtomatik taqdim etiladi
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async chat(message: string) {
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
        imageConfig: { aspectRatio: "1:1" }
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("Rasm yaratib bo'lmadi");
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