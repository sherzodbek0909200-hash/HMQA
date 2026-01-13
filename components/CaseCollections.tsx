
import React, { useState, useEffect } from 'react';
import { Case, CaseCollection, UserProfile, ResultEntry } from '../types';
import { localLogicService } from '../services/localLogicService';

const CaseCollections: React.FC = () => {
  const [code, setCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [collection, setCollection] = useState<CaseCollection | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileInput, setProfileInput] = useState<UserProfile>({ firstName: '', lastName: '' });
  
  const [completedCases, setCompletedCases] = useState<Record<number, any>>({});
  const [activeCase, setActiveCase] = useState<Case | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem('ziyo_user_profile');
    if (savedProfile) setUserProfile(JSON.parse(savedProfile));

    if (isUnlocked && collection) {
      const savedProgress = localStorage.getItem(`ziyo_progress_${collection.id}`);
      if (savedProgress) setCompletedCases(JSON.parse(savedProgress));
    }
  }, [isUnlocked, collection]);

  useEffect(() => {
    if (isUnlocked && collection && Object.keys(completedCases).length > 0) {
      localStorage.setItem(`ziyo_progress_${collection.id}`, JSON.stringify(completedCases));
    }
  }, [completedCases, isUnlocked, collection]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileInput.firstName.trim() && profileInput.lastName.trim()) {
      localStorage.setItem('ziyo_user_profile', JSON.stringify(profileInput));
      setUserProfile(profileInput);
    }
  };

  const handleUnlock = () => {
    setIsLoading(true);
    setTimeout(() => {
      const upperCode = code.toUpperCase();
      const userCollections: CaseCollection[] = JSON.parse(localStorage.getItem('ziyo_collections') || '[]');
      const found = userCollections.find(c => c.id === upperCode);

      if (found) {
        setCollection(found);
        setIsUnlocked(true);
      } else {
        alert("Kod topilmadi!");
      }
      setIsLoading(false);
    }, 600);
  };

  // Fixed missing handleStartSolving function
  const handleStartSolving = (c: Case) => {
    setActiveCase(c);
    setUserAnswer('');
  };

  const handleValidate = () => {
    if (!activeCase || !userAnswer.trim() || isValidating || completedCases[activeCase.id] || !userProfile || !collection) return;
    
    setIsValidating(true);
    setTimeout(() => {
      const analysis = localLogicService.calculateScore(userAnswer, activeCase.correctAnswer);
      
      const newResult = {
        ...analysis,
        originalAnswer: userAnswer,
        submittedAt: new Date().toISOString()
      };

      setCompletedCases(prev => ({ ...prev, [activeCase.id]: newResult }));

      const globalResults: ResultEntry[] = JSON.parse(localStorage.getItem('ziyo_global_results') || '[]');
      globalResults.push({
        id: Math.random().toString(36).substr(2, 9),
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        collectionTitle: collection.title,
        caseId: activeCase.id,
        score: analysis.score,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('ziyo_global_results', JSON.stringify(globalResults));
      
      setIsValidating(false);
    }, 1000);
  };

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] animate-fadeIn text-center p-6">
        <div className="glass p-10 rounded-[3rem] w-full max-w-lg space-y-8 shadow-2xl">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Ro'yxatdan o'tish</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <input required placeholder="Ism" className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white" value={profileInput.firstName} onChange={e => setProfileInput({...profileInput, firstName: e.target.value})} />
            <input required placeholder="Familiya" className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white" value={profileInput.lastName} onChange={e => setProfileInput({...profileInput, lastName: e.target.value})} />
            <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl transition-all">Davom etish</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      {!isUnlocked ? (
        <div className="glass p-10 rounded-[3rem] text-center space-y-8 animate-fadeIn max-w-lg mx-auto mt-10 shadow-2xl">
          <h2 className="text-2xl font-bold text-white">To'plamni ochish</h2>
          <input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="Maxsus kod" className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-center text-2xl font-mono text-white transition-all uppercase" />
          <button onClick={handleUnlock} disabled={isLoading || !code} className="w-full py-4 bg-blue-600 rounded-2xl text-white font-bold">
            {isLoading ? "Tekshirilmoqda..." : "Kirish"}
          </button>
        </div>
      ) : activeCase ? (
        <div className="animate-fadeIn space-y-8 pb-20 select-none">
          <button onClick={() => setActiveCase(null)} className="text-slate-400 hover:text-white flex items-center gap-2"><i className="fa-solid fa-arrow-left"></i> Orqaga</button>
          <div className="glass p-8 rounded-3xl space-y-6 relative overflow-hidden">
            <h3 className="text-xl font-bold text-white">Kazus #{activeCase.id}</h3>
            <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-200">"{activeCase.text}"</div>
            <textarea 
              value={userAnswer}
              onChange={e => !completedCases[activeCase.id] && setUserAnswer(e.target.value)}
              readOnly={!!completedCases[activeCase.id]}
              placeholder="Yechimingizni yozing..."
              className="w-full h-48 bg-slate-900/50 border border-slate-700 rounded-2xl p-6 text-white outline-none resize-none"
            />
            {!completedCases[activeCase.id] && (
              <button onClick={handleValidate} disabled={isValidating || !userAnswer.trim()} className="w-full py-4 bg-blue-600 rounded-2xl text-white font-bold">
                {isValidating ? "Tahlil qilinmoqda..." : "Topshirish"}
              </button>
            )}
          </div>

          {completedCases[activeCase.id] && (
            <div className="glass p-8 rounded-3xl border-2 border-emerald-500/30 animate-slideUp space-y-6">
               <div className="flex items-center justify-between">
                  <h4 className="text-2xl font-bold text-white">Natija: <span className="text-emerald-400">{completedCases[activeCase.id].score}%</span></h4>
               </div>
               <p className="text-slate-400">{completedCases[activeCase.id].feedback}</p>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900 p-4 rounded-xl">
                    <p className="text-xs font-bold text-blue-400 uppercase mb-2">Aniqlangan tushunchalar:</p>
                    {completedCases[activeCase.id].matches.map((m: string, i: number) => <span key={i} className="text-xs bg-blue-500/10 text-blue-300 px-2 py-1 rounded mr-2">{m}</span>)}
                  </div>
                  <div className="bg-slate-900 p-4 rounded-xl">
                    <p className="text-xs font-bold text-rose-400 uppercase mb-2">E'tibor berish kerak:</p>
                    {completedCases[activeCase.id].missing.map((m: string, i: number) => <span key={i} className="text-xs bg-rose-500/10 text-rose-300 px-2 py-1 rounded mr-2">{m}</span>)}
                  </div>
               </div>
            </div>
          )}
        </div>
      ) : collection && (
        <div className="animate-fadeIn space-y-8 pb-20">
          <div className="flex justify-between items-end">
            <h2 className="text-3xl font-bold text-white">{collection.title}</h2>
            <div className="bg-blue-500/10 border border-blue-500/30 px-6 py-2 rounded-xl text-blue-400 font-bold">
              Progress: {Object.keys(completedCases).length} / {collection.cases.length}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {collection.cases.map((c: any) => (
              <div key={c.id} onClick={() => handleStartSolving(c)} className={`glass p-6 rounded-[2rem] hover:border-blue-500/50 transition-all cursor-pointer ${completedCases[c.id] ? 'border-emerald-500/30' : ''}`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-blue-400 uppercase">KAZUS #{c.id}</span>
                  {completedCases[c.id] && <span className="text-xs font-bold text-emerald-400">Yechilgan ({completedCases[c.id].score}%)</span>}
                </div>
                <p className="text-slate-200 mt-4 line-clamp-1">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseCollections;
