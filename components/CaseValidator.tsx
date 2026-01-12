
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';

const CaseValidator: React.FC = () => {
  const [caseText, setCaseText] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleValidate = async () => {
    if (!caseText || !userAnswer || isLoading) return;
    setIsLoading(true);
    try {
      const data = await geminiService.validateAnswer(caseText, userAnswer);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl shadow-lg">
          <i className="fa-solid fa-file-shield"></i>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Javobni Tekshirish</h2>
          <p className="text-slate-400 text-sm">O'z javobingizni kazusga mosligini AI orqali tekshiring</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">1. Kazus matni</h3>
            <textarea
              value={caseText}
              onChange={(e) => setCaseText(e.target.value)}
              placeholder="Kazus shartini bu yerga yozing yoki nusxalab tashlang..."
              className="w-full h-48 bg-slate-900/50 border border-slate-700 rounded-2xl p-4 text-white outline-none focus:border-indigo-500 transition-all resize-none"
            />
          </div>
          <div className="glass p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">2. Sizning javobingiz</h3>
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="O'z yechimingizni yozing..."
              className="w-full h-48 bg-slate-900/50 border border-slate-700 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 transition-all resize-none"
            />
            <button
              onClick={handleValidate}
              disabled={isLoading || !caseText || !userAnswer}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-emerald-600 rounded-2xl text-white font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl shadow-indigo-600/20"
            >
              {isLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-check-double"></i>}
              Tekshirishni boshlash
            </button>
          </div>
        </div>

        <div className="glass rounded-3xl p-8 space-y-6 min-h-[400px]">
          {result ? (
            <div className="animate-fadeIn space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Natija</h3>
                <div className={`text-3xl font-black ${result.score > 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {result.score}<span className="text-sm opacity-50">/100</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900/50 border-l-4 border-indigo-500">
                  <p className="text-sm font-bold text-indigo-400 mb-1">AI Izohi:</p>
                  <p className="text-slate-300">{result.feedback}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/50 border-l-4 border-emerald-500">
                  <p className="text-sm font-bold text-emerald-400 mb-1">To'g'ri tahlil:</p>
                  <p className="text-slate-300">{result.correctAnalysis}</p>
                </div>

                {result.missedPoints && result.missedPoints.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-rose-400">E'tibordan chetda qolgan jihatlar:</p>
                    {result.missedPoints.map((point: string, i: number) => (
                      <div key={i} className="flex gap-2 text-sm text-slate-400">
                        <i className="fa-solid fa-circle-exclamation text-rose-500 mt-1"></i>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
              <i className="fa-solid fa-shield-halved text-7xl"></i>
              <p className="max-w-xs">Javobingizni tahlil qilish uchun ma'lumotlarni kiriting va tugmani bosing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseValidator;
