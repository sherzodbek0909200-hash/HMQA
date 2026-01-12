
import React, { useState, useEffect } from 'react';
import { ResultEntry } from '../types';

const AdminView: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [results, setResults] = useState<ResultEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const ADMIN_PASSWORD = 'admin777'; // Hardcoded for demo, could be stored securely

  useEffect(() => {
    if (isAuthenticated) {
      const allResults = JSON.parse(localStorage.getItem('ziyo_global_results') || '[]');
      setResults(allResults.reverse()); // Latest first
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Xato parol!");
    }
  };

  const clearResults = () => {
    if (confirm("Haqiqatan ham barcha natijalarni o'chirib tashlamoqchimisiz?")) {
      localStorage.setItem('ziyo_global_results', '[]');
      setResults([]);
    }
  };

  const filteredResults = results.filter(r => 
    `${r.firstName} ${r.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.collectionTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-fadeIn">
        <div className="glass p-10 rounded-[2.5rem] w-full max-w-md space-y-8 shadow-2xl border-amber-500/20">
          <div className="text-center space-y-2">
            <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center text-3xl mx-auto border border-amber-500/30 mb-4">
              <i className="fa-solid fa-user-shield"></i>
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Admin Kirish</h2>
            <p className="text-slate-400 text-sm">Tizimni nazorat qilish uchun parol kiriting</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin paroli"
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white outline-none focus:border-amber-500 text-center text-xl tracking-widest"
              autoFocus
            />
            <button className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-amber-600/20">
              Kirish
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tight">Monitoring <span className="text-amber-500">Markazi</span></h2>
          <p className="text-slate-400">Akademiya tinglovchilarining natijalari tahlili</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={clearResults}
            className="px-6 py-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl font-bold text-sm hover:bg-rose-500/20 transition-all"
          >
            <i className="fa-solid fa-trash-can mr-2"></i> Tozalash
          </button>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="px-6 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-700"
          >
            Chiqish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-3xl space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase">Jami topshiriqlar</p>
          <p className="text-3xl font-black text-white">{results.length}</p>
        </div>
        <div className="glass p-6 rounded-3xl space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase">O'rtacha ball</p>
          <p className="text-3xl font-black text-emerald-400">
            {results.length > 0 
              ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length) 
              : 0}%
          </p>
        </div>
        <div className="glass p-6 rounded-3xl space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase">Faol foydalanuvchilar</p>
          <p className="text-3xl font-black text-blue-400">
            {new Set(results.map(r => `${r.firstName} ${r.lastName}`)).size}
          </p>
        </div>
      </div>

      <div className="glass rounded-[2rem] overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
          <h3 className="text-xl font-bold text-white">Natijalar jadvali</h3>
          <div className="relative w-full md:w-80">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
            <input 
              type="text"
              placeholder="Ism yoki to'plam bo'yicha qidiruv..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-2 text-sm text-white focus:border-amber-500 outline-none"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                <th className="px-6 py-4">F.I.SH</th>
                <th className="px-6 py-4">To'plam / Kazus</th>
                <th className="px-6 py-4 text-center">Natija</th>
                <th className="px-6 py-4 text-right">Vaqti</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredResults.length > 0 ? filteredResults.map((result) => (
                <tr key={result.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs uppercase">
                        {result.firstName[0]}{result.lastName[0]}
                      </div>
                      <span className="text-white font-medium text-sm">{result.firstName} {result.lastName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-0.5">
                      <p className="text-slate-300 text-sm font-bold">{result.collectionTitle}</p>
                      <p className="text-xs text-slate-500">Kazus #{result.caseId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                      result.score >= 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      result.score >= 50 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {result.score}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="space-y-0.5">
                      <p className="text-slate-300 text-xs font-medium">
                        {new Date(result.timestamp).toLocaleDateString()}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-600 italic">Ma'lumot topilmadi</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
