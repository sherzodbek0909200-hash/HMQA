
import React from 'react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const menuItems = [
    { id: ViewType.DASHBOARD, icon: 'fa-house', label: 'Bosh Sahifa' },
    { id: ViewType.LIBRARY, icon: 'fa-book-bookmark', label: 'Bilimlar Bazasi' },
    { id: ViewType.VALIDATOR, icon: 'fa-file-shield', label: 'Javob Tekshiruvi' },
    { id: ViewType.CREATOR, icon: 'fa-plus-circle', label: 'To\'plam Yaratish' },
    { id: ViewType.COLLECTIONS, icon: 'fa-folder-tree', label: 'Topshiriqlar' },
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
          <div className="absolute inset-0 rounded-2xl bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div className="hidden md:block text-center space-y-1">
          <span className="block font-black text-[12px] leading-tight text-white uppercase tracking-tighter">HMQ AKADEMIYASI</span>
          <div className="flex items-center justify-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-amber-500 animate-pulse"></div>
            <span className="block text-[8px] text-amber-500 font-black uppercase tracking-[0.2em]">O'zbekiston</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 py-8 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 group relative overflow-hidden ${
              currentView === item.id 
                ? 'bg-blue-600/10 text-white border border-blue-500/20 shadow-lg' 
                : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            {currentView === item.id && (
              <div className="absolute left-0 top-0 w-1 h-full bg-blue-500"></div>
            )}
            <i className={`fa-solid ${item.icon} w-6 text-center text-xl ${currentView === item.id ? 'text-blue-400' : 'group-hover:text-blue-400'} transition-colors`}></i>
            <span className="hidden md:block font-bold text-sm tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 mt-auto border-t border-slate-800/50">
        <button
          onClick={() => onNavigate(ViewType.ADMIN)}
          className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all mb-4 group ${
            currentView === ViewType.ADMIN ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' : 'text-slate-500 hover:text-amber-400'
          }`}
        >
          <i className="fa-solid fa-user-tie w-6 text-center text-xl"></i>
          <span className="hidden md:block font-black text-xs uppercase tracking-widest">Admin Panel</span>
        </button>
        
        <div className="hidden md:block p-4 rounded-2xl bg-slate-900/50 border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tizim Faol</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
