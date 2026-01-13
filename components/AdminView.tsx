
import React, { useState, useEffect } from 'react';
import { ResultEntry } from '../types.ts';

const AdminView: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [results, setResults] = useState<ResultEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const ADMIN_PASSWORD = 'admin777';

  useEffect(() => {
    if (isAuthenticated) {
      const allResults = JSON.parse(localStorage.getItem('ziyo_global_results') || '[]');
      setResults(allResults.reverse());
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

  const exportData = () => {
    const data = {
      collections: JSON.parse(localStorage.getItem('ziyo_collections') || '[]'),
      results: JSON.parse(localStorage.getItem('ziyo_global_results') || '[]'),
      user: JSON.parse(localStorage.getItem('ziyo_user_profile') || '{}')
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hmq_database_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.collections) localStorage.setItem('ziyo_collections', JSON.stringify(data.collections));
        if (data.results) localStorage.setItem('ziyo_global_results', JSON.stringify(data.results));
        if (data.user) localStorage.setItem('ziyo_user_profile', JSON.stringify(data.user));
        alert("Xotira muvaffaqiyatli tiklandi! Sahifa yangilanadi.");
        window.location.reload();
      } catch (err) {
        alert("Fayl formati noto'g'ri!");
      }
    };
    reader.readAsText(file);
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
          <p className="text-slate-400">Tizim xotirasi va tinglovchilar tahlili</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="cursor-pointer px-6 py-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl font-bold text-sm hover:bg-indigo-500/20 transition-all flex items-center gap-2">
            <i className="fa-solid fa-file-import"></i> Xotirani Tiklash
            <input type="file" accept=".json" onChange={importData} className="hidden" />
          </label>
          <button onClick={exportData} className="px-6 py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl font-bold text-sm hover:bg-emerald-500/20 transition-all">
            <i className="fa-solid fa-download mr-2"></i> Xotirani Yuklash
          </button>
          <button onClick={clearResults} className="px-6 py-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl font-bold text-sm hover:bg-rose-500/20 transition-all">
            <i className="fa-solid fa-trash-can mr-2"></i> Tozalash
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-3xl">
          <p className="text-xs font-bold text-slate-500 uppercase">Jami topshiriqlar</p>
          <p className="text-3xl font-black text-white">{results.length}</p>
        </div>
        <div className="glass p-6 rounded-3xl">
          <p className="text-xs font-bold text-slate-500 uppercase">O'rtacha ball</p>
          <p className="text-3xl font-black text-emerald-400">
            {results.length > 0 ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length) : 0}%
          </p>
        </div>
        <div className="glass p-6 rounded-3xl">
          <p className="text-xs font-bold text-slate-500 uppercase">Foydalanuvchilar</p>
          <p className="text-3xl font-black text-blue-400">
            {new Set(results.map(r => `${r.firstName} ${r.lastName}`)).size}
          </p>
        </div>
      </div>

      <div className="glass rounded-[2rem] overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
          <h3 className="text-xl font-bold text-white">Natijalar jadvali</h3>
          <input 
            type="text"
            placeholder="Qidiruv..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:border-amber-500 outline-none"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                <th className="px-6 py-4">F.I.SH</th>
                <th className="px-6 py-4">To'plam / Kazus</th>
                <th className="px-6 py-4 text-center">Ball</th>
                <th className="px-6 py-4 text-right">Vaqti</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredResults.map((result) => (
                <tr key={result.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-sm text-white">{result.firstName} {result.lastName}</td>
                  <td className="px-6 py-4">
                    <p className="text-slate-300 text-sm font-bold">{result.collectionTitle}</p>
                    <p className="text-xs text-slate-500">Kazus #{result.caseId}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-emerald-400 font-bold">{result.score}%</span>
                  </td>
                  <td className="px-6 py-4 text-right text-xs text-slate-500">
                    {new Date(result.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
