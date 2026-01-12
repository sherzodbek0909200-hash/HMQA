
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { GroundingSource } from '../types';

const SearchView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ text: string, sources: GroundingSource[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const data = await geminiService.searchWithGrounding(query);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Qidiruvda xatolik yuz berdi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl">
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Aqlli Qidiruv</h2>
          <p className="text-slate-400 text-sm">Google Search Grounding bilan boyitilgan</p>
        </div>
      </div>

      <div className="glass p-2 rounded-2xl flex items-center gap-2 border-slate-700 shadow-2xl">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Bugungi ob-havo, so'nggi yangiliklar yoki istalgan savol..."
          className="flex-1 bg-transparent border-none outline-none px-4 py-4 text-white placeholder-slate-500 text-lg"
        />
        <button
          onClick={handleSearch}
          disabled={isLoading || !query.trim()}
          className="px-6 py-4 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          {isLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-sparkles"></i>}
          Izlash
        </button>
      </div>

      {isLoading && (
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-slate-800 rounded w-3/4"></div>
          <div className="h-4 bg-slate-800 rounded w-full"></div>
          <div className="h-4 bg-slate-800 rounded w-5/6"></div>
          <div className="h-32 bg-slate-800 rounded w-full"></div>
        </div>
      )}

      {result && (
        <div className="space-y-6 animate-fadeIn">
          <div className="glass p-8 rounded-3xl">
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-200 text-lg leading-relaxed whitespace-pre-wrap">
                {result.text}
              </p>
            </div>
          </div>

          {result.sources.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2">Manbalar</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.sources.map((source, i) => (
                  <a
                    key={i}
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass p-4 rounded-2xl flex items-center justify-between hover:border-emerald-500/50 group transition-all"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                        <i className="fa-solid fa-link text-xs"></i>
                      </div>
                      <span className="text-slate-300 text-sm font-medium truncate">{source.title}</span>
                    </div>
                    <i className="fa-solid fa-chevron-right text-slate-600 group-hover:text-emerald-500 text-xs"></i>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!result && !isLoading && (
        <div className="text-center py-20 opacity-30">
          <i className="fa-solid fa-earth-asia text-8xl mb-6"></i>
          <p className="text-xl">Internetdagi eng so'nggi ma'lumotlarni qidiring</p>
        </div>
      )}
    </div>
  );
};

export default SearchView;
