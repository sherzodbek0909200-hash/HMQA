
import { GoogleGenAI, Type } from "@google/genai";

export const geminiService = {
  async solveCase(message: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: `Siz professional huquqshunos va mantiqiy tahlilchisiz. 
        Sizga berilgan kazusni (vaziyatli masalani) quyidagi tartibda tahlil qiling:
        1. Vaziyatning mohiyati.
        2. Huquqiy yoki mantiqiy asoslar (moddalar, qoidalar).
        3. Yakuniy xulosa va yechim.
        Javoblaringiz doimo o'zbek tilida, professional va aniq bo'lsin.`,
      },
    });

    const response = await chat.sendMessage({ message });
    return response.text;
  },

  // NEW: Compares user answer to creator's reference answer
  async validateAgainstReference(caseText: string, userAnswer: string, referenceAnswer: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `KAZUS SHARTI: ${caseText}\n\nYARATUVCHI JAVOBI (ETALON): ${referenceAnswer}\n\nFOYDALANUVCHI JAVOBI: ${userAnswer}\n\nIltimos, foydalanuvchi javobini etalon javobga qanchalik yaqinligini foizda (0-100%) baholang. 
      Muhim: Agar foydalanuvchi javobi qisqa bo'lsa ham mohiyatni ochgan bo'lsa, yuqori ball bering. 
      Xatolarni ko'rsating va foydalanuvchi javobidagi yetishmayotgan punktlarni sanab o'ting.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Foizda similarity (0-100)" },
            feedback: { type: Type.STRING, description: "Umumiy tahlil" },
            matchingPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "To'g'ri topilgan jihatlar" },
            missingPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Yetishmayotgan jihatlar" },
            suggestion: { type: Type.STRING, description: "Yaxshilash uchun maslahat" }
          },
          required: ["score", "feedback", "matchingPoints", "missingPoints"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  },

  async validateAnswer(caseText: string, userAnswer: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Kazus: ${caseText}\n\nFoydalanuvchi javobi: ${userAnswer}\n\nIltimos, foydalanuvchi javobini kazusga mosligini tekshiring. 
      Uni 100 ballik tizimda baholang va xatolarni ko'rsatib o'ting.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            feedback: { type: Type.STRING },
            correctAnalysis: { type: Type.STRING },
            missedPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["score", "feedback", "correctAnalysis"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  },

  async chat(message: string, history: any[]) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "Siz Ziyo AI yordamchisiz. O'zbek tilida foydalanuvchilarga har qanday mavzuda yordam berasiz.",
      },
    });
    const response = await chat.sendMessage({ message });
    return response.text;
  },

  async generateImage(prompt: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Rasm yaratib bo'lmadi.");
  },

  async searchWithGrounding(query: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        uri: chunk.web?.uri,
        title: chunk.web?.title
      }))
      .filter((s: any) => s.uri && s.title) || [];

    return {
      text: response.text || "",
      sources
    };
  }
};
