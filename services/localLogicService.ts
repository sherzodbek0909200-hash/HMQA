
export const localLogicService = {
  // Simple algorithm to compare texts based on meaningful keywords
  calculateScore(userAnswer: string, referenceAnswer: string) {
    const stopWords = ['va', 'bilan', 'uchun', 'ham', 'yoki', 'esa', 'lekin', 'ammo', 'shuningdek', 'bu', 'shu', 'u', 'men', 'siz'];
    
    const cleanText = (text: string) => {
      return text.toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .split(/\s+/)
        .filter(word => word.length > 3 && !stopWords.includes(word));
    };

    const userWords = cleanText(userAnswer);
    const refWords = cleanText(referenceAnswer);
    
    if (refWords.length === 0) return { score: 0, matches: [], missing: [] };

    const matches = userWords.filter(word => 
      refWords.some(ref => ref.includes(word) || word.includes(ref))
    );

    const uniqueMatches = [...new Set(matches)];
    const uniqueRef = [...new Set(refWords)];

    const score = Math.min(100, Math.round((uniqueMatches.length / (uniqueRef.length * 0.7)) * 100));
    
    const missing = uniqueRef.filter(word => 
      !uniqueMatches.some(m => word.includes(m) || m.includes(word))
    ).slice(0, 5);

    return {
      score,
      matches: uniqueMatches.slice(0, 5),
      missing: missing,
      feedback: score > 70 
        ? "Javobingiz etalon javobga mazmunan juda yaqin. Asosiy huquqiy tushunchalar to'g'ri qo'llanilgan." 
        : score > 40 
        ? "Javobda qisman to'g'ri fikrlar bor, lekin huquqiy asoslar to'liq ochilmagan." 
        : "Javob yetarli emas. Etalon javobdagi kalit so'zlarga e'tibor bering."
    };
  }
};
