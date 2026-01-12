
import React, { useState, useEffect } from 'react';
import { Case, CaseCollection, UserProfile, ResultEntry } from '../types';
import { geminiService } from '../services/geminiService';

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

  // Load profile and progress
  useEffect(() => {
    const savedProfile = localStorage.getItem('ziyo_user_profile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }

    if (isUnlocked && collection) {
      const savedProgress = localStorage.getItem(`ziyo_progress_${collection.id}`);
      if (savedProgress) {
        setCompletedCases(JSON.parse(savedProgress));
      } else {
        setCompletedCases({});
      }
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
        alert("Kechirasiz, ushbu kod bo'yicha to'plam topilmadi!");
      }
      setIsLoading(false);
    }, 800);
  };

  const handleStartSolving = (c: Case) => {
    setActiveCase(c);
    if (completedCases[c.id]) {
      setUserAnswer(completedCases[c.id].originalAnswer);
    } else {
      setUserAnswer('');
    }
  };

  const handleValidate = async () => {
    if (!activeCase || !userAnswer.trim() || isValidating || completedCases[activeCase.id] || !userProfile || !collection) return;
    
    setIsValidating(true);
    try {
      const result = await geminiService.validateAgainstReference(
        activeCase.text, 
        userAnswer, 
        activeCase.correctAnswer || "Javob belgilanmagan."
      );
      
      const newResult = {
        ...result,
        originalAnswer: userAnswer,
        submittedAt: new Date().toISOString()
      };

      // 1. Update local UI state
      setCompletedCases(prev => ({
        ...prev,
        [activeCase.id]: newResult
      }));

      // 2. Log to Global Admin Results
      const globalResults: ResultEntry[] = JSON.parse(localStorage.getItem('ziyo_global_results') || '[]');
      const newEntry: ResultEntry = {
        id: Math.random().toString(36).substr(2, 9),
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        collectionTitle: collection.title,
        caseId: activeCase.id,
        score: result.score,
        timestamp: new Date().toISOString()
      };
      globalResults.push(newEntry);
      localStorage.setItem('ziyo_global_results', JSON.stringify(globalResults));

    } catch (error) {
      console.error(error);
      alert("Tekshirishda xatolik yuz berdi.");
    } finally {
      setIsValidating(false);
    }
  };

  const preventSecurityAction = (e: any) => {
    e.preventDefault();
    alert("Xavfsizlik yuzasidan ushbu amal taqiqlangan!");
    return false;
  };

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] animate-fadeIn">
        <div className="glass p-10 rounded-[3rem] w-full max-w-lg space-y-8 shadow-2xl border-blue-500/20">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 bg-blue-600/10 text-blue-400 rounded-full flex items-center justify-center text-3xl mx-auto border border-blue-500/30 mb-2">
              <i className="fa-solid fa-user-graduate"></i>
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Identifikatsiya</h2>
            <p className="text-slate-400 text-sm">Topshiriqlarni boshlashdan oldin ma'lumotlaringizni kiriting</p>
          </div>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Ism</label>
                <input
                  required
                  type="text"
                  value={profileInput.firstName}
                  onChange={(e) => setProfileInput({...profileInput, firstName: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white outline-none focus:border-blue-500"
                  placeholder="Ismingizni yozing"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Familiya</label>
                <input
                  required
                  type="text"
                  value={profileInput.lastName}
                  onChange={(e) => setProfileInput({...profileInput, lastName: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white outline-none focus:border-blue-500"
                  placeholder="Familiyangizni yozing"
                />
              </div>
            </div>
            <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-600/20">
              Tasdiqlash va Davom etish
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      {!isUnlocked ? (
        <div className="glass p-10 rounded-[3rem] text-center space-y-8 animate-fadeIn max-w-lg mx-auto mt-10 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-6">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 font-bold">
                   {userProfile.firstName[0]}
                </div>
                <div className="text-left">
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Tinglovchi</p>
                   <p className="text-sm text-white font-bold">{userProfile.firstName} {userProfile.lastName}</p>
                </div>
             </div>
             <button 
               onClick={() => { localStorage.removeItem('ziyo_user_profile'); setUserProfile(null); }}
               className="text-[10px] text-slate-500 hover:text-rose-400 font-bold uppercase"
             >
               O'zgartirish
             </button>
          </div>
          <div className="w-20 h-20 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center text-3xl mx-auto border border-blue-500/30">
            <i className="fa-solid fa-lock"></i>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">To'plamni ochish</h2>
            <p className="text-slate-400 text-sm">Akademiya kodi orqali kirish</p>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
              placeholder="Masalan: ABC123"
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-center text-2xl font-mono tracking-widest text-white outline-none focus:border-blue-500 transition-all uppercase"
            />
            <button
              onClick={handleUnlock}
              disabled={isLoading || !code}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-white font-bold transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              {isLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-key"></i>}
              Kodni tekshirish
            </button>
          </div>
        </div>
      ) : activeCase ? (
        <div className="animate-fadeIn space-y-8 pb-20 select-none">
          <div className="flex justify-between items-center">
            <button onClick={() => setActiveCase(null)} className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
              <i className="fa-solid fa-arrow-left"></i> To'plamga qaytish
            </button>
            <div className="text-right">
               <p className="text-[10px] text-slate-500 font-bold uppercase">Ishlayotgan shaxs:</p>
               <p className="text-xs text-blue-400 font-bold">{userProfile.firstName} {userProfile.lastName}</p>
            </div>
          </div>
          
          <div className="glass p-8 rounded-3xl space-y-6 relative overflow-hidden">
            {completedCases[activeCase.id] && (
               <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 px-4 py-1 rounded-full text-xs font-bold border border-emerald-500/30 z-10">
                 <i className="fa-solid fa-lock mr-2"></i> Javob Topshirilgan
               </div>
            )}
            
            <div className="flex justify-between items-center">
               <h3 className="text-xl font-bold text-white">Kazus #{activeCase.id}</h3>
               <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-bold uppercase">{activeCase.difficulty}</span>
            </div>
            
            <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
               <p className="text-slate-200 leading-relaxed italic">"{activeCase.text}"</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-400 uppercase">Sizning javobingiz:</label>
                {!completedCases[activeCase.id] && <span className="text-[10px] text-rose-400 font-bold uppercase"><i className="fa-solid fa-triangle-exclamation mr-1"></i> Natija monitoringga yuboriladi</span>}
              </div>
              
              <textarea 
                value={userAnswer}
                onChange={(e) => !completedCases[activeCase.id] && setUserAnswer(e.target.value)}
                onPaste={preventSecurityAction}
                onCopy={preventSecurityAction}
                onCut={preventSecurityAction}
                onContextMenu={preventSecurityAction}
                readOnly={!!completedCases[activeCase.id]}
                placeholder={completedCases[activeCase.id] ? "" : "Yechimingizni yozing..."}
                className={`w-full h-48 border rounded-2xl p-6 text-white outline-none transition-all resize-none font-medium ${
                  completedCases[activeCase.id] 
                    ? 'bg-slate-800/30 border-slate-700 text-slate-400 cursor-not-allowed' 
                    : 'bg-slate-900/50 border-slate-700 focus:border-blue-500'
                }`}
              />
              
              {!completedCases[activeCase.id] && (
                <button
                  onClick={handleValidate}
                  disabled={isValidating || !userAnswer.trim()}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white font-bold flex items-center justify-center gap-3 shadow-xl transition-all"
                >
                  {isValidating ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-paper-plane"></i>}
                  Yakuniy topshirish
                </button>
              )}
            </div>
          </div>

          {completedCases[activeCase.id] && (
            <div className="glass p-8 rounded-3xl border-2 border-emerald-500/30 animate-slideUp space-y-6">
               <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-2xl font-bold text-white">Natija</h4>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Monitoring markaziga saqlandi</p>
                  </div>
                  <div className="text-4xl font-black text-emerald-400">
                    {completedCases[activeCase.id].score}%
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                     <p className="text-xs font-bold text-emerald-400 mb-2 uppercase">Ijobiy:</p>
                     <ul className="space-y-1">
                        {completedCases[activeCase.id].matchingPoints.map((p: string, i: number) => (
                          <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                            <i className="fa-solid fa-check text-emerald-500 mt-1"></i> {p}
                          </li>
                        ))}
                     </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                     <p className="text-xs font-bold text-rose-400 mb-2 uppercase">Kamchiliklar:</p>
                     <ul className="space-y-1">
                        {completedCases[activeCase.id].missingPoints.map((p: string, i: number) => (
                          <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                            <i className="fa-solid fa-xmark text-rose-500 mt-1"></i> {p}
                          </li>
                        ))}
                     </ul>
                  </div>
               </div>
            </div>
          )}
        </div>
      ) : collection && (
        <div className="animate-fadeIn space-y-8 pb-20">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
              <button onClick={() => setIsUnlocked(false)} className="text-blue-400 text-sm mb-4 flex items-center gap-2">
                <i className="fa-solid fa-arrow-left"></i> Kodga qaytish
              </button>
              <h2 className="text-3xl font-bold text-white">{collection.title}</h2>
              <p className="text-slate-400 max-w-2xl">{collection.description || 'Tavsif mavjud emas.'}</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 px-6 py-3 rounded-2xl text-blue-400 text-sm font-bold h-fit shrink-0">
              Jarayon: {Object.keys(completedCases).length} / {collection.cases.length}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {collection.cases.map((c: any) => {
              const isSolved = completedCases[c.id];
              return (
                <div 
                  key={c.id} 
                  onClick={() => handleStartSolving(c)}
                  className={`glass p-6 rounded-[2rem] group hover:border-blue-500/50 transition-all cursor-pointer relative overflow-hidden ${isSolved ? 'border-emerald-500/30' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-slate-800 rounded-lg text-[10px] font-black text-blue-400 uppercase">KAZUS #{c.id}</span>
                      {isSolved && <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-500/10 px-2 py-1 rounded-md">Yechilgan ({isSolved.score}%)</span>}
                    </div>
                    <span className="text-slate-500 text-xs font-bold uppercase">{c.difficulty}</span>
                  </div>
                  <p className="text-slate-200 mt-4 line-clamp-1">{c.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseCollections;
