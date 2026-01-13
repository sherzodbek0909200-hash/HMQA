
import { GoogleGenAI } from "@google/genai";

// Initialize the Google GenAI client following strict guidelines.
// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
// We assume process.env.API_KEY is pre-configured and accessible.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const geminiService = {
  // Use generateContent for text answers with gemini-3-flash-preview
  async chat(message: string, history: any[] = []) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
    });
    // Access response text property directly (not a method)
    return response.text || "";
  },

  // Use gemini-3-pro-preview for complex reasoning tasks like legal analysis
  async solveCase(caseText: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Quyidagi huquqiy kazusni tahlil qiling va yechimini bering: ${caseText}`,
      config: {
        systemInstruction: "Siz professional huquqshunos va tahlilchisiz. O'zbekiston qonunchiligiga tayangan holda javob bering."
      }
    });
    // Access response text property directly
    return response.text || "";
  },

  // Image generation using gemini-2.5-flash-image
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

    // Iterate through candidates and parts to find the image part
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString: string = part.inlineData.data;
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
    }
    throw new Error("Rasm yaratish muvaffaqiyatsiz tugadi");
  },

  // Search grounding for queries relating to recent events or news
  async searchWithGrounding(query: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    // Extracting URLs from groundingChunks and listing them as required by guidelines
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
