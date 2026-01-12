
import React, { useState } from 'react';
import { Case, CaseCollection } from '../types';

interface CaseCreatorProps {
  onCreated?: () => void;
}

const CaseCreator: React.FC<CaseCreatorProps> = ({ onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cases, setCases] = useState<Omit<Case, 'id'>[]>(
    Array(5).fill(null).map(() => ({ text: '', difficulty: "O'rta", correctAnswer: '' }))
  );
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const updateCaseText = (index: number, text: string) => {
    const newCases = [...cases];
    newCases[index].text = text;
    setCases(newCases);
  };

  const updateCaseAnswer = (index: number, answer: string) => {
    const newCases = [...cases];
    newCases[index].correctAnswer = answer;
    setCases(newCases);
  };

  const updateCaseDifficulty = (index: number, difficulty: any) => {
    const newCases = [...cases];
    newCases[index].difficulty = difficulty;
    setCases(newCases);
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSave = () => {
    if (!title || cases.some(c => !c.text || !c.correctAnswer)) {
      alert("Iltimos, sarlavha, barcha 5 ta kazus va ularning to'g'ri javoblarini to'ldiring!");
      return;
    }

    setIsSaving(true);
    const code = generateCode();
    
    const newCollection: CaseCollection = {
      id: code,
      title,
      description,
      cases: cases.map((c, i) => ({ ...c, id: i + 1 })),
      createdAt: new Date().toISOString()
    };

    const existingStr = localStorage.getItem('ziyo_collections') || '[]';
    const existing = JSON.parse(existingStr);
    existing.push(newCollection);
    localStorage.setItem('ziyo_collections', JSON.stringify(existing));

    setTimeout(() => {
      setGeneratedCode(code);
      setIsSaving(false);
    }, 1500);
  };

  if (generatedCode) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center space-y-8 animate-fadeIn">
        <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-5xl mx-auto border border-emerald-500/30">
          <i className="fa-solid fa-circle-check"></i>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">To'plam muvaffaqiyatli yaratildi!</h2>
          <p className="text-slate-400">Ushbu kodni boshqalarga bering, ular to'plamni yechishlari mumkin:</p>
        </div>
        <div className="glass p-8 rounded-3xl border-2 border-indigo-500/50 bg-indigo-500/10">
          <span className="text-6xl font-black tracking-[0.5em] text-white select-all">{generatedCode}</span>
        </div>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => {
              navigator.clipboard.writeText(generatedCode);
              alert("Kod nusxalandi!");
            }}
            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold text-white transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-copy"></i> Nusxalash
          </button>
          <button 
            onClick={onCreated}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold text-white transition-all"
          >
            To'plamga o'tish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-fadeIn">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl shadow-lg">
          <i className="fa-solid fa-plus-circle"></i>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Yangi To'plam Yaratish</h2>
          <p className="text-slate-400 text-sm">Kazuslar va ularning to'g'ri javoblarini kiriting</p>
        </div>
      </div>

      <div className="glass p-8 rounded-3xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">To'plam nomi</label>
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masalan: Fuqarolik huquqi imtihoni"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-indigo-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Tavsif</label>
            <input 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Foydalanuvchilar uchun qisqacha ma'lumot..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-indigo-600 text-[14px] flex items-center justify-center">5</span>
            Kazuslar va Javob Mezonlari
          </h3>
          
          {cases.map((c, i) => (
            <div key={i} className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4 hover:border-indigo-500/30 transition-all">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Kazus #{i+1}</span>
                <select 
                  value={c.difficulty}
                  onChange={(e) => updateCaseDifficulty(i, e.target.value)}
                  className="bg-slate-800 border-none rounded-lg text-xs text-slate-300 p-1 outline-none"
                >
                  <option value="Oson">Oson</option>
                  <option value="O'rta">O'rta</option>
                  <option value="Qiyin">Qiyin</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-500 uppercase">Vaziyat sharti</label>
                   <textarea 
                    value={c.text}
                    onChange={(e) => updateCaseText(i, e.target.value)}
                    placeholder="Vaziyatni batafsil tasvirlang..."
                    className="w-full h-40 bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-white text-sm outline-none focus:border-indigo-500 resize-none"
                  />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-emerald-500/70 uppercase">To'g'ri javob (Etalon)</label>
                   <textarea 
                    value={c.correctAnswer}
                    onChange={(e) => updateCaseAnswer(i, e.target.value)}
                    placeholder="AI foydalanuvchi javobini aynan shu matn mazmuniga qarab tekshiradi..."
                    className="w-full h-40 bg-emerald-950/10 border border-emerald-900/30 rounded-xl p-4 text-emerald-100 text-sm outline-none focus:border-emerald-500 resize-none placeholder:text-emerald-900"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full py-5 bg-gradient-to-r from-indigo-600 to-emerald-600 rounded-2xl text-white font-black text-lg shadow-xl shadow-indigo-600/20 hover:scale-[1.01] transition-all disabled:opacity-50"
        >
          {isSaving ? <i className="fa-solid fa-spinner animate-spin"></i> : "To'plamni Saqlash va Kod Olish"}
        </button>
      </div>
    </div>
  );
};

export default CaseCreator;
