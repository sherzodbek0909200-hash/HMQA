
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini API with the environment variable API key
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  /**
   * General purpose chat functionality for Ziyo AI
   */
  async chat(message: string, history: any[] = []) {
    // Basic text task: use gemini-3-flash-preview
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
    });
    return response.text || "";
  },

  /**
   * Specialized solver for legal and logical cases using pro model for reasoning
   */
  async solveCase(caseText: string) {
    // Complex reasoning task: use gemini-3-pro-preview
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Quyidagi huquqiy kazusni tahlil qiling va yechimini bering: ${caseText}`,
      config: {
        systemInstruction: "Siz professional huquqshunos va tahlilchisiz. O'zbekiston qonunchiligiga tayangan holda javob bering."
      }
    });
    return response.text || "";
  },

  /**
   * Generates images based on user description
   */
  async generateImage(prompt: string) {
    // General image generation: use gemini-2.5-flash-image
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

  /**
   * Smart search using Google Search grounding
   */
  async searchWithGrounding(query: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    // Extract search source URLs from grounding chunks
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
