
import React, { useState } from 'react';

const LEGAL_DATA = [
  {
    category: "Konstitutsiya",
    title: "Inson huquqlari",
    content: "O'zbekiston Respublikasida barcha fuqarolar bir xil huquq va erkinliklarga ega bo'lib, jinsi, irqi, millati, tili, dini, ijtimoiy kelib chiqishi, e'tiqodi, shaxsi va ijtimoiy mavqeidan qat'i nazar, qonun oldida tengdirlar.",
    article: "18-modda"
  },
  {
    category: "Jinoyat Kodeksi",
    title: "Aybsizlik prezumpsiyasi",
    content: "Aybdorligi qonunda nazarda tutilgan tartibda isbotlanmaguncha va sudning qonuniy kuchga kirgan hukmi bilan aniqlanmaguncha, shaxs aybsiz hisoblanadi.",
    article: "23-modda"
  },
  {
    category: "Ma'muriy Kodeks",
    title: "Ma'muriy jazo turlari",
    content: "Ma'muriy huquqbuzarliklar sodir etganlik uchun quyidagi ma'muriy jazo choralari qo'llanilishi mumkin: jarima, ma'muriy qamoq, huquqdan mahrum etish.",
    article: "23-modda"
  },
  {
    category: "Fuqarolik Kodeksi",
    title: "Bitimlar shakli",
    content: "Bitimlar og'zaki yoki yozma (oddiy yoki notarial tasdiqlangan) shaklda tuzilishi mumkin. Qonunda belgilangan hollarda yozma shakl shart.",
    article: "105-modda"
  },
  {
    category: "Protsessual tartib",
    title: "Dalillar",
    content: "Ish bo'yicha haqiqiy holatlarni aniqlashga yordam beradigan har qanday ma'lumotlar dalil hisoblanadi. Guvoh ko'rsatmalari, ashyoviy dalillar, ekspert xulosalari shular jumlasidandir.",
    article: "UPK 81-modda"
  }
];

const LibraryView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Barchasi');

  const categories = ['Barchasi', ...new Set(LEGAL_DATA.map(d => d.category))];

  const filtered = LEGAL_DATA.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                         item.content.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'Barchasi' || item.category === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tight">Bilimlar <span className="text-blue-500">Xazinasi</span></h2>
          <p className="text-slate-400">Offline rejimda ishlovchi huquqiy qo'llanmalar bazasi</p>
        </div>
        <div className="relative w-full md:w-80">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
          <input 
            type="text"
            placeholder="Mavzuni qidiring..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-white focus:border-blue-500 outline-none transition-all shadow-xl"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${
              activeTab === cat 
                ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/20' 
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item, i) => (
          <div key={i} className="glass p-8 rounded-[2.5rem] border border-slate-800/50 hover:border-blue-500/30 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="text-[10px] font-black text-blue-500/50 uppercase tracking-widest group-hover:text-blue-400 transition-colors">{item.article}</span>
            </div>
            <div className="space-y-4">
              <span className="px-3 py-1 bg-slate-800 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.category}</span>
              <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.content}</p>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-800/50 flex justify-end">
               <button className="text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:text-white transition-colors">
                 To'liq o'qish <i className="fa-solid fa-arrow-right ml-1"></i>
               </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-600 italic">
            <i className="fa-solid fa-box-open text-6xl mb-4 opacity-20"></i>
            <p>Ma'lumot topilmadi</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryView;
