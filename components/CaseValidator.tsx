
import React, { useState } from 'react';
import { localLogicService } from '../services/localLogicService';

const CaseValidator: React.FC = () => {
  const [caseText, setCaseText] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleValidate = () => {
    if (!caseText || !userAnswer || isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      const data = localLogicService.calculateScore(userAnswer, caseText); // Comparing to some reference
      setResult(data);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl shadow-lg">
          <i className="fa-solid fa-file-shield"></i>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Lokal Tahlilchi</h2>
          <p className="text-slate-400 text-sm">Javobingizni mantiqiy kalit so'zlar bo'yicha tekshirish</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Etalon/Asos matni</h3>
            <textarea value={caseText} onChange={e => setCaseText(e.target.value)} placeholder="Taqqoslash uchun to'g'ri javobni bu yerga qo'ying..." className="w-full h-48 bg-slate-900/50 border border-slate-700 rounded-2xl p-4 text-white outline-none resize-none" />
          </div>
          <div className="glass p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Sizning javobingiz</h3>
            <textarea value={userAnswer} onChange={e => setUserAnswer(e.target.value)} placeholder="O'z yechimingizni yozing..." className="w-full h-48 bg-slate-900/50 border border-slate-700 rounded-2xl p-4 text-white outline-none resize-none" />
            <button onClick={handleValidate} disabled={isLoading || !caseText || !userAnswer} className="w-full py-4 bg-blue-600 rounded-2xl text-white font-bold transition-all shadow-xl shadow-blue-600/20">
              {isLoading ? "Tahlil qilinmoqda..." : "Taqqoslash"}
            </button>
          </div>
        </div>

        <div className="glass rounded-3xl p-8 min-h-[400px]">
          {result ? (
            <div className="animate-fadeIn space-y-6 text-center">
              <h3 className="text-xl font-bold text-white">Natija</h3>
              <div className="text-6xl font-black text-blue-400">{result.score}%</div>
              <p className="text-slate-300 italic">"{result.feedback}"</p>
              <div className="text-left space-y-4 mt-8">
                 <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/20">
                    <p className="text-xs font-bold text-blue-400 uppercase mb-2">Mos kelgan terminlar:</p>
                    <div className="flex flex-wrap gap-2">
                       {result.matches.map((m: string, i: number) => <span key={i} className="px-2 py-1 bg-blue-500/10 text-blue-200 rounded text-[10px]">{m}</span>)}
                    </div>
                 </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
              <i className="fa-solid fa-microchip text-7xl"></i>
              <p className="max-w-xs">Matnlarni kiriting va "Taqqoslash" tugmasini bosing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseValidator;
