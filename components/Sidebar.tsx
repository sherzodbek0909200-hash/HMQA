
import React from 'react';
import { ViewType } from '../types.ts';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const menuItems = [
    { id: ViewType.DASHBOARD, icon: 'fa-house', label: 'Bosh Sahifa' },
    { id: ViewType.LIBRARY, icon: 'fa-book-bookmark', label: 'Bilimlar Bazasi' },
    { id: ViewType.VALIDATOR, icon: 'fa-file-shield', label: 'Javob Tekshiruvi' },
    { id: ViewType.COLLECTIONS, icon: 'fa-folder-tree', label: 'Topshiriqlar' },
  ];

  const aiItems = [
    { id: ViewType.SOLVER, icon: 'fa-scale-balanced', label: 'Kazus Yechish' },
    { id: ViewType.CHAT, icon: 'fa-comments', label: 'Ziyo Chat' },
    { id: ViewType.IMAGE, icon: 'fa-palette', label: 'Tasvir Yaratish' },
    { id: ViewType.SEARCH, icon: 'fa-earth-asia', label: 'Aqlli Izlash' },
  ];

  return (
    <aside className="w-20 md:w-64 border-r border-slate-800 flex flex-col glass z-40 select-none">
      <div className="p-8 flex flex-col items-center gap-4 border-b border-slate-800/50">
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 group cursor-pointer relative">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Emblem_of_Uzbekistan.svg/1024px-Emblem_of_Uzbekistan.svg.png" 
            className="w-10 h-10 object-contain gold-glow group-hover:scale-110 transition-transform" 
            alt="Emblem"
          />
        </div>
        <div className="hidden md:block text-center">
          <span className="block font-black text-[12px] text-white uppercase tracking-tighter leading-tight">HMQ AKADEMIYASI</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 py-4 overflow-y-auto scrollbar-hide">
        <p className="hidden md:block text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-2 px-4">Asosiy</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
              currentView === item.id 
                ? 'bg-blue-600/10 text-white border border-blue-500/20' 
                : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-6 text-center`}></i>
            <span className="hidden md:block font-bold text-sm">{item.label}</span>
          </button>
        ))}

        <div className="my-6 border-t border-slate-800/50"></div>
        <p className="hidden md:block text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-2 px-4">AI Imkoniyatlari</p>
        {aiItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
              currentView === item.id 
                ? 'bg-indigo-600/10 text-white border border-indigo-500/20' 
                : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-6 text-center`}></i>
            <span className="hidden md:block font-bold text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 mt-auto border-t border-slate-800/50">
        <button
          onClick={() => onNavigate(ViewType.ADMIN)}
          className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all mb-4 ${
            currentView === ViewType.ADMIN ? 'bg-amber-500/10 text-amber-500' : 'text-slate-500 hover:text-amber-400'
          }`}
        >
          <i className="fa-solid fa-user-tie w-6 text-center"></i>
          <span className="hidden md:block font-black text-[10px] uppercase tracking-widest">Admin</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
